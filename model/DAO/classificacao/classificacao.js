/*******************************************************************
 * Objetivo: arquivo responsável pelo CRUD de dados da classificação no banco
 * de dados MySQL
 * Data:15/05/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

//Realiza import da biblioteca knex para manipular dados no banco de dados my sql
const knex = require('knex')

//Realiza import do arquivo de configuração do acesso ao banco dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexação com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

async function insertClassificacao(classificacao) {
    try {
        let sql = `
            insert into tbl_classificacao(
                classificacao           
            )values(
                '${classificacao.classificacao}'
            );
        `

        let result = await knexConection.raw(sql)

        if(result)
            return result[0].insertId
        else
            return false

    } catch (error) {
        return false
    }
}

async function updateClassificacao(classificacao) {
    try {
        let sql = `update tbl_classificacao set classificacao = '${classificacao.classificacao}' where id = ${classificacao.id}`
        let result = await knexConection.raw(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

async function selectAllClassificacao(){
    try {
        let sql = `select * from tbl_classificacao where id > 0;`

        let result = await knexConection.raw(sql)
        

        if (result) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

async function selectByIdClassificacao(id){
    try {
        let sql = `select * from tbl_classificacao where id=${id};`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

async function deleteClassificacao(id) {
    try {
        let sql = `delete from tbl_classificacao where id = ${id}`
        let result = await knexConection.raw(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    insertClassificacao,
    updateClassificacao,
    selectAllClassificacao,
    selectByIdClassificacao,
    deleteClassificacao
}