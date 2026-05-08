/*******************************************************************
 * Objetivo: arquivo responsável pelo validação, tratamento e manipulação
 *           de dados para realizar o CRUD de filmes
 * Data:17/02/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

//Import do arquivo de configurações de menssagens do projeto
const configMessages = require("../modulo/configMessage.js")

//Import do arquivo responsável por manipular os dados do filme no banco de dados
const FilmeDAO = require("../../model/DAO/filme/filme.js")
const { json } = require("body-parser")

//Função para inserir um novo filme
async function inserirNovoFilme(filme, contentType) {

    //Cria uma cópia dos JSON do arquivo de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toLowerCase() == "application/json") {
            //Chama a função para ela validar a entrada dos dados do filme
            let validar = await validarDados(filme)

            //Retorna um JSON de erro caso algum atributo seja inválido,
            //Se não, retorna um false (Não teve erro)
            if (validar) {
                return validar //Aqui ele retorna um 400
            } else {//201
                //Encaminha os dados do filme para o DAO inserir no banco de dados
                let result = await FilmeDAO.insertFilme(await tratarDados(filme))

                if (result) { //201
                    //Cria o ID no JSON do filme e adiciona o ID gerado no DAO
                    filme.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = filme

                    return customMessage.DEFAULT_MESSAGE

                } else { 
                    return customMessage.INTERNAL_SERVER_ERROR_MODEL // erro 500 (Model)
                }
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER // 500 (Controller)
    }


}

//Função para atualizar um filme existente
async function atualizarFilme(filme, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            
            let resultBuscarFilme = await buscarFilme(id)

            if(resultBuscarFilme.status){

                let validar = await validarDados(filme)

                if(!validar){

                    filme.id = Number(id)

                    let result = await FilmeDAO.updateFilme(await tratarDados(filme))

                    if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_UPDATE_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = filme

                        return customMessage.DEFAULT_MESSAGE // 200 -> criado com sucesso
                    }else{
                        return customMessage.INTERNAL_SERVER_ERROR_MODEL // 500 -> erro no model
                    }
                }else{
                    return validar // retorna 400  - campos inválidos
                }
            }else{
                return buscarFilme // retorns 400, 500, 404 caso não encontrado(404), bad request(400) ou erro interno no servidor(500)
            }
        }else{
            return configMessages.ERROR_CONTENT_TYPE // 415 - tipo de conteúdo inválido
        }
    } catch (error) {
        return configMessages.INTERNAL_SERVER_ERROR_CONTROLLER // 500 - erro interno no controller
    }
   


}

//Função para retornar todos os filmes existentes
async function listarFilmes() {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Chama a funçap para retornar a lista de todos os filmes
        let result = await FilmeDAO.selectAllFilme()

        //Validação para veificar se o DAO conseguiu processar o script no BD
        if(result){
            //Validação para verificar se o conteúdo do array tem dados de retorno
            //Ou se está vazia
            if (result.length > 0) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.filme = result

                return customMessage.DEFAULT_MESSAGE // 200
            }else{
                return customMessage.ERROR_NOT_FOUND // 404
            }
        }else{
            return customMessage.INTERNAL_SERVER_ERROR_MODEL // 500 model
        }
            
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER // 500 controller
    }
}

//Função para retornar um filme filtrando pelo ID
async function buscarFilme(id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o id seja um número válido
        if(id == undefined || String(id).replaceAll(" ", "") == '' || id == null || isNaN(id)){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST // 400
        }else{
            let result = await FilmeDAO.selectByIdFilme(id)

            if(result){
                //Verifica se houve algum dado retornado do DAO ou um false (erro)
                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.filme = result

                    return customMessage.DEFAULT_MESSAGE //200 
                }else{
                    return customMessage.ERROR_NOT_FOUND //404
                }
            }else{
                return customMessage.INTERNAL_SERVER_ERROR_MODEL
            }
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER // 500 (controller)
    }
}

//Função para excluir um filme
async function excluirFilme(id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Chama a função de buscar filme para verificar se o filme existe  
        let resultBuscarFilme = await buscarFilme(id)

        //Verifica se o retorno do status é true 
        if(resultBuscarFilme.status){
            let result = await FilmeDAO.deleteFilme(id)

            if(result){
                return customMessage.SUCESS_DELETED_ITEM //200 ou 204
            }else{
                return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 model
            }
        }else{
            return resultBuscarFilme //400 ou 404
        }
    } catch (error) {
        console.log(error)
        customMessage.INTERNAL_SERVER_ERROR_CONTROLLER // 500 erro no controlller
    }
}


async function validarDados(filme) {

    //Cria uma cópia dos JSON do arquivo de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (filme.nome == undefined || filme.nome == null || filme.nome == "" || filme.nome.length > 80) {
        customMessage.ERROR_BAD_REQUEST.field = "[NOME] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else if (filme.sinopse == undefined || filme.sinopse == null || filme.sinopse == "") {
        customMessage.ERROR_BAD_REQUEST.field = "[SINOPSE] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else if (filme.capa == undefined || filme.capa == null || filme.capa == "" || filme.capa.length > 255) {
        customMessage.ERROR_BAD_REQUEST.field = "[CAPA] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else if (filme.data_lancamento == undefined || filme.data_lancamento == null || filme.data_lancamento == "" || filme.data_lancamento.length != 10) {
        customMessage.ERROR_BAD_REQUEST.field = "[DATA DE LANÇAMENTO] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else if (filme.duracao == undefined || filme.duracao == null || filme.duracao == "" || filme.duracao.length < 5) {
        customMessage.ERROR_BAD_REQUEST.field = "[DURAÇÃO] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else if (filme.valor == undefined || isNaN(filme.valor) || filme.valor.length > 5) {
        customMessage.ERROR_BAD_REQUEST.field = "[VALOR] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else if (filme.avaliacao == undefined || isNaN(filme.avaliacao) || filme.avaliacao > 5 || filme.avaliacao.length > 3) {
        customMessage.ERROR_BAD_REQUEST.field = "[AVALIAÇÃO] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

async function tratarDados(filme) {

    filme.nome = filme.nome.replaceAll("'","")
    filme.sinopse = filme.sinopse.replaceAll("'","")
    filme.capa = filme.capa.replaceAll("'","")
    filme.data_lancamento = filme.data_lancamento.replaceAll("'","")
    filme.duracao = filme.duracao.replaceAll("'","")
    filme.valor = filme.valor.replaceAll("'","")
    filme.avaliacao = filme.avaliacao.replaceAll("'","")
    
    return filme
}

module.exports = {
    inserirNovoFilme,
    atualizarFilme,
    listarFilmes,
    buscarFilme,
    excluirFilme
}