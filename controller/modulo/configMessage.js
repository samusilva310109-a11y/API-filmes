/*******************************************************************
 * Objetivo: arquivo responsável pela padronização das mensagens e status code
 *           do projeto filmes
 * Data:17/02/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

//Padronização dos retornos da API
const DEFAULT_MESSAGE = {
    api_description:"API para controlar projeto de filmes",
    developer:"Samuel Silva Moreira Dos Santos",
    version:"1.0.4.26",
    status: Boolean,
    status_code: Number,
    response: {}
} 

//Menssagens de erro do projeto de filmes
const ERROR_BAD_REQUEST = {
    staus:false,
    status_code:400,
    message: "Não foi possível processar. Há inconsistências nos dados."
}

const ERROR_NOT_FOUND = {
    staus:false,
    status_code:404,
    message: "Não foram encontrados dados para retorno."
}

const ERROR_CONTENT_TYPE = {
    status:false,
    status_code:415,
    message: "Não foi possível processar a requisição, pois o formato de dados encaminhad não é suportado pelo servidor. Apenas deve ser utilizado o formato JSON."
}

const INTERNAL_SERVER_ERROR_MODEL = {
    status:false,
    status_code:500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [MODEL]."
}

const INTERNAL_SERVER_ERROR_CONTROLLER = {
    status:false,
    status_code:500,
    message: "Não foi possível processar a requisição devido a um erro interno no servidor [CONTROLLER]."
}



//Mensagens de SUCESSO do projeto de filmes
const SUCESS_RESPONSE = {
    status:true,
    status_code: 200
}

const SUCESS_CREATED_ITEM = {
    status:true,
    status_code: 201,
    message:"Item inserido com sucesso."
}

const SUCESS_UPDATE_ITEM = {
    status:true,
    status_code: 200,
    message:"Item atualizado com sucesso."
}

const SUCESS_DELETED_ITEM = {
    status:true,
    status_code: 200,
    message:"Item removido com sucesso."
}

module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    ERROR_CONTENT_TYPE,
    ERROR_NOT_FOUND,
    INTERNAL_SERVER_ERROR_MODEL,
    INTERNAL_SERVER_ERROR_CONTROLLER,
    SUCESS_RESPONSE,
    SUCESS_CREATED_ITEM,
    SUCESS_UPDATE_ITEM,
    SUCESS_DELETED_ITEM
}