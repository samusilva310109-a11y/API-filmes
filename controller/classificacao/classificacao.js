/*******************************************************************
 * Objetivo: arquivo responsável pelo validação, tratamento e manipulação
 *           de dados para realizar o CRUD de classificação
 * Data:15/05/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

const configMessages = require('../modulo/configMessage.js')
const classificaçãoDAO = require('../../model/DAO/classificacao/classificacao.js')
const {json} = require('body-parser')

async function inserirNovaClassificacao(classificacao, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(classificacao)

            if (!validar) {
                let result = await classificaçãoDAO.insertClassificacao(await tratarDados(classificacao))

                if (result) {

                    classificacao.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.classificacao = classificacao

                    return customMessage.DEFAULT_MESSAGE //201
                } else {
                    return customMessage.INTERNAL_SERVER_ERROR_MODEL //500 [MODEL]
                }
            } else {
                return validar //400
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLER]
    }
}

async function atualizarClassificacao(classificacao, id, contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

}
async function listarClassificacoes(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await classificaçãoDAO.selectAllClassificacao()
        //Verifica se o result realizou a busca
        if (result) {
            if (result.length > 0) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response = result

                return customMessage.DEFAULT_MESSAGE //200
            } else {
                return customMessage.ERROR_NOT_FOUND //404   
            }
        } else {
            return customMessage.INTERNAL_SERVER_ERROR_MODEL // 500 [MODEL]
        }

    } catch (error) {
        return customMessage.INTERNAL_SERVER_ERROR_CONTROLLER //500 [CONTROLLERS]
    }
}
async function buscarClassificacao(id){

}
async function excluirClassificacao(id){

}

async function validarDados(classificacao) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (classificacao.classificacao == undefined || classificacao.classificacao == null || classificacao.classificacao.length > 4 || classificacao == "" || classificacao.classificacao == " ") {
        customMessage.ERROR_BAD_REQUEST.field = '[CLASSIFICACAO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST    
    } else {
        return false
    }
}

async function tratarDados(classificacao) {
    classificacao.classificacao = classificacao.classificacao.replaceAll("'", "")

    return classificacao
}

module.exports = {
    inserirNovaClassificacao,
    atualizarClassificacao,
    listarClassificacoes,
    buscarClassificacao,
    excluirClassificacao
}