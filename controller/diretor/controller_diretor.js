/*******************************************************************
 * Objetivo: arquivo responsável pelo validação, tratamento e manipulação
 *           de dados para realizar o CRUD de diretores
 * Data:13/05/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

const configMessages = require('../modulo/configMessage.js')
const diretorDAO = require('../../model/DAO/diretor/diretor.js')
const {json} = require('body-parser')

async function inserirNovoDiretor(diretor, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            
            let validar = await validarDados(diretor)

            if(!validar){
                
                let result = await diretorDAO.insertDiretor(await tratarDados(diretor))

                if (result) {

                    diretor.id = result
                    
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = diretor

                    return customMessage.DEFAULT_MESSAGE //201 
                } else {
                    return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
                }
            }else{
                return validar //404
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function atualizarDiretor(diretor, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let buscaDiretor = await buscarDiretor(id)

            if (buscaDiretor.status) {

                let validar = await validarDados(diretor)

                if (!validar) {
                    diretor.id = Number(id)

                    let result = await diretorDAO.updateDiretor(await tratarDados(diretor))

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_UPDATE_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_UPDATE_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.response = diretor
    
                        return customMessage.DEFAULT_MESSAGE //200
                    } else {
                        return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
                    }
                } else {
                    return validar //400   
                } 
            } else {
                return customMessage.ERROR_NOT_FOUND //404
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function listarDiretores() {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await diretorDAO.selectAllDiretor()       

        if (result) {
            if (result.length > 0) {

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.diretor = result
    
                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND //404
            }
        } else {
            return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 Model
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 
    }
}

async function buscarDiretor(id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação do ID
        if (id == undefined || String(id).replaceAll(" ", "") == '' || id == null || isNaN(id)) {
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVÁLIDO"
            return customMessage.ERROR_BAD_REQUEST //400
        } else {
            let result = await diretorDAO.selectByIdDiretor(id)

            //Verificando se houve retorno da MODEL
            if (result) {
                //Verificando se foi encontrado o diretor buscado
                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.diretor = result                    

                    return customMessage.DEFAULT_MESSAGE //200
                }else{
                    return customMessage.ERROR_NOT_FOUND //404
                }

            } else {
                return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
            }
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function excluirDiretor(id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let buscaDiretor = await buscarDiretor(id)        

        if (buscaDiretor.status) {
            let result = await diretorDAO.deleteDiretor(id)

            if (result) {
                return customMessage.SUCESS_DELETED_ITEM  //200
            } else {
                return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
            }
        } else {
            return buscaDiretor //404
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function validarDados(diretor) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(diretor.nome == undefined || diretor.nome == null || diretor.nome == " " || diretor.nome == "" || diretor.nome.length > 100){
        customMessage.ERROR_BAD_REQUEST.field =  "[NOME] INVÁLIDO"
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

async function tratarDados(diretor) {
    diretor.nome = diretor.nome.replaceAll("'","")
    return diretor
}

module.exports = {
    inserirNovoDiretor, 
    atualizarDiretor,
    listarDiretores,
    buscarDiretor,
    excluirDiretor
}