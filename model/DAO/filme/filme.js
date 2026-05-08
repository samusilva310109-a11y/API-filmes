/*******************************************************************
 * Objetivo: arquivo responsável pelo CRUD de dados do filme no banco
 * de dados MySQL
 * Data:15/02/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão:1.0
 *******************************************************************/

//Realiza import da biblioteca knex para manipular dados no banco de dados my sql
const knex = require('knex')

//Realiza import do arquivo de configuração do acesso ao banco dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexação com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

//Função para inserir um novo filme no banco de dados
async function insertFilme(filme) {
    try {
        let sql = `
            insert into tbl_filme (
                nome,
                sinopse,
                capa,
                data_lancamento,
                duracao,
                valor,
                avaliacao
            ) values (
                '${filme.nome}',
                '${filme.sinopse}',
                '${filme.capa}',
                '${filme.data_lancamento}',
                '${filme.duracao}',
                '${filme.valor}',
                if('${filme.avaliacao}' = '', null, '${filme.avaliacao}')
            );
            `
        
        //Encaminha ao banco de dados o script sql
        let result = await knexConection.raw(sql)

        if(result)
            return result[0].insertId //retorna o ID gerado no insert
        else 
            return false
        
    } catch (error) {
        return false
    }
}

//Função para atualizar um filme existente no banco de dados
async function updateFilme(filme) {  
    try {
        let sql = 
        `update tbl_filme set
                    nome            = '${filme.nome}',
                    sinopse         = '${filme.sinopse}',
                    capa            = '${filme.capa}',
                    data_lancamento = '${filme.data_lancamento}',
                    duracao         = '${filme.valor}',
                    valor           = '${filme.valor}',
                    avaliacao       = if('${filme.avaliacao}' = '', null , '${filme.avaliacao}')
                    where id        = ${filme.id};`


        console.log(sql);
        
        let result = await knexConection.raw(sql)
        

        if(result)
            return true
        else
            return false

    } catch (error) {
        console.log(error);
        
        return false
    }
    
   
}

//Função para retornar todos os dados de filme do banco de dados
async function selectAllFilme() {
    try {
        let sql = `select * from tbl_filme order by id desc`//'order by desc' ordena a lista da tabela pelo id maior ao menor

        //Executa no BD o script e guarda o retorno do BD,
        //Pode ser um erro (false) ou um Array com dados
        let result = await knexConection.raw(sql)


        //Validação para verificar se o retorno do BD é um 
        //Array ou um Boolean (false)
       if(Array.isArray(result)){
            return result[0] //Retorna apanas o indice 0 onde está contido os dados da tabela (lista de filmes)
       }else{
            return false
       }

    } catch (error) {
        return false
    }
}

//Função para retornar os dados de um filme em específico filtrando pela chave primária (ID)
async function selectByIdFilme(id) {
    try {
        let sql = `select * from tbl_filme where id=${id}`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result)) {
            return result[0]    
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
}

//Função para excluir um filme em específico filtrando pela chave primária (ID)
async function deleteFilme(id) {
    try {
        let sql = `delete from tbl_filme where id=${id};`
        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    insertFilme,
    updateFilme,
    selectAllFilme,
    selectByIdFilme,
    deleteFilme
}