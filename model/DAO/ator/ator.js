/*******************************************************************
 * Objetivo: arquivo responsável pelo CRUD de dados do ator no banco
 * de dados MySQL
 * Data:08/05/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/
//Realizando import biblioteca
const knex = require('knex')

//Import do arquivo de configurações do acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

//Cria a conexão com BD conforme a configuração do acesso ao banco de dados
const knexConection = knex(knexDatabaseConfig.development)

async function insertAtor(ator) {
    try {
        let sql = 
        `
            insert into tbl_ator(
                nome            
            )values(
                '${ator.nome}'
            )    
        `

        let result = await knexConection.raw(sql)
        console.log(result);
                        

        if(result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        return false
    }
}

async function updateAtor(ator) {
    
}

async function selectAllAtor() {
    try {
        let sql = 
        `
            select * from tbl_ator where id > 0
        `

        let result = await knexConection.raw(sql)        

        if(result)
            return result[0]
        else
            return false
    } catch (error) {
        
    }
}

async function selectByIdAtor(id) {
    
}

async function deleteAtor(id) {
    
}

module.exports = {
    insertAtor,
    updateAtor,
    selectAllAtor,
    selectByIdAtor,
    deleteAtor
}