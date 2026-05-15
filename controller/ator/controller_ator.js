/*******************************************************************
 * Objetivo: arquivo responsável pelo validação, tratamento e manipulação
 *           de dados para realizar o CRUD de atores
 * Data:08/05/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

const configMessages = require('../modulo/configMessage.js')

const atorDAO = require('../../model/DAO/ator/ator.js')
const {json} = require('body-parser')

async function inserirNovoAtor(ator, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let validar = await validarDados(ator)                   

            if(validar){
                return validar //400
            }else{
                let result = await atorDAO.insertAtor(await tratarDados(ator))

                if(result){

                    ator.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = ator

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 model
                }
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 controller
    }
}

async function atualizarAtor(ator, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            
            let resultBuscaAtor = await buscarAtor(id)

            if (resultBuscaAtor.status) {
                let validar = await validarDados(ator)

                if(!validar){

                    ator.id = Number(id)

                    let atualizarAtor = await atorDAO.updateAtor(await tratarDados(ator))

                    if (atualizarAtor) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.response = ator

                        return customMessage.DEFAULT_MESSAGE
                    } else {
                        return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
                    }
                }else{
                    return validar // 400
                }
            } else {
                return resultBuscaAtor //404
            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function listarAtores() {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        let result = await atorDAO.selectAllAtor()

        if(result){//Valida se a conexão com o BD teve sucesso

            if(result.length > 0){ //Valida se o item foi encontrado
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.ator = result

                return customMessage.DEFAULT_MESSAGE //201
            }else{
                return customMessage.ERROR_NOT_FOUND // 404 item não encontrado
            }

        }else{
            return customMessage.INTERNAL_SERVER_ERROR_MODEL // 500 model
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER // 500 controller
    }
}

async function buscarAtor(id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        //Validação para verificar a validade do id
        if(id == undefined || String(id).replaceAll(" ", "") == '' || id == null || isNaN(id)){
            customMessage.ERROR_BAD_REQUEST.field  = "[ID] INVÁLIDO"
            return customMessage
        }else{
            let result = await atorDAO.selectByIdAtor(id)

            //Verifica se a busca foi realizada
            if (result) {
                //Verifica se o filme foi econtrado
                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.ator = result

                    return customMessage.DEFAULT_MESSAGE //200
                } else {
                    return customMessage.ERROR_NOT_FOUND // 404
                }
                
            }else{
                return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
            }
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function excluirAtor(id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscaAtor = await buscarAtor(id)

        if(resultBuscaAtor.status){
            let result = await atorDAO.deleteAtor(id)

            if (result) {
                return customMessage.SUCESS_DELETED_ITEM //200
            } else {
                return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
            }
        }else{
            return resultBuscaAtor //404
        }
    } catch (error) {
        console.log(error);
        
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function validarDados(ator) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(ator.nome == undefined || ator.nome == null || ator.nome == " " || ator.nome == "" || ator.nome.length > 100){
        customMessage.ERROR_BAD_REQUEST.field =  "[NOME] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

async function tratarDados(ator) {
    ator.nome = ator.nome.replaceAll("'", "")

    return ator
}

module.exports = {
    inserirNovoAtor,
    atualizarAtor,
    listarAtores,
    buscarAtor,
    excluirAtor
}