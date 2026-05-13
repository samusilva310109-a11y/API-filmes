/*******************************************************************
 * Objetivo: arquivo responsável pelo CRUD de dados do diretor no banco
 * de dados MySQL
 * Data:13/05/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

//Realiza import da biblioteca knex para manipular dados no banco de dados my sql
const knex = require('knex')

//Realiza import do arquivo de configuração do acesso ao banco dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexação com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

async function insertDiretor(diretor) {
    try {
        let sql = `
            insert into tbl_diretor(
                nome            
            )values(
                '${diretor.nome}'
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

async function updateDiretor(diretor) {
    
}

async function selectAllDiretor(){
    try {
        let sql = `select * from tbl_diretor where id > 0;`

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

async function selectByIdDiretor(id){
    try {
        let sql = `select * from tbl_diretor where id=${id};`

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

async function deleteDiretor(id) {
    
}

module.exports = {
    insertDiretor,
    updateDiretor, 
    selectAllDiretor, 
    selectByIdDiretor,
    deleteDiretor
}

