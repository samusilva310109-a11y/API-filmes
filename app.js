
//import das dependências para criar a API

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

//Criando um objeto do express para criar uma API
const app = express()

//Configurações do CORS da API
const corsOptions = {
    origin: ["*"], // Configuração de origem e domínio da requisição (IP ou domínio)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //Configuração dos métodos que serão utilizados na API
    allowedHeaders: ['Content-type', 'Authorization'] // Configurações de permissões
    //Tipo de dados //Autorização de acesso
}

//Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))

//Import das CONTROLLER do projeto
const controllerFilme = require("./controller/filme/controller_filme.js")
const controllerAtor = require("./controller/ator/controller_ator.js")
const controllerDiretor = require("./controller/diretor/controller_diretor.js")

//ENDPOINTS

//Endpoints relacionados a filmes

app.post("/v1/senai/locadora/filme", bodyParserJSON, async (request, response) => {
    //Recebendo o body da requisição 
    let dados = request.body

    let contentType = request.headers['content-type']
    
    let result = await controllerFilme.inserirNovoFilme(dados, contentType)
    
    response.status(result.status_code)
    response.json(result)
})

app.get("/v1/senai/locadora/filme", async (request, response) => {
    let result = await controllerFilme.listarFilmes()

    response.status(result.status_code)
    response.json(result)
})

app.get("/v1/senai/locadora/filme/:id", async (request, response) => {
    //Recebe o id do filme via parâmetross
    let id = request.params.id

    let result = await controllerFilme.buscarFilme(id)

    response.status(result.status_code)
    response.json(result)
})

app.put("/v1/senai/locadora/filme/:id", bodyParserJSON, async (request, response) => {
    
    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body


    let result = await controllerFilme.atualizarFilme(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete("/v1/senai/locadora/filme/:id", async (request, response) => {
    let id = request.params.id

    let result = await controllerFilme.excluirFilme(id)

    response.status(result.status_code)
    response.json(result)
})

//Endpoints relacionados ao ator

app.get("/v1/senai/locadora/ator", async (request, response) =>{
    let result = await controllerAtor.listarAtores()

    response.status(result.status_code)
    response.json(result)
})

app.get("/v1/senai/locadora/ator/:id", async (request, response) => {
    let idAtor = request.params.id

    let result = await controllerAtor.buscarAtor(idAtor)

    response.status(result.status_code)
    response.json(result)
})

app.post("/v1/senai/locadora/ator", bodyParserJSON, async (request, response) => {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerAtor.inserirNovoAtor(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete("/v1/senai/locadora/ator/:id", async (request, response) => {
    let idAtor = request.params.id

    let result = await controllerAtor.excluirAtor(idAtor)

    response.status(result.status_code)
    response.json(result)
})

app.put("/v1/senai/locadora/ator/:id", bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']
    let id = request.params.id
    let dados = request.body

    let result = await controllerAtor.atualizarAtor(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

//Endpoints realacionados ao diretor

app.get("/v1/senai/locadora/diretor", async (request, response) => {
    let result = await controllerDiretor.listarDiretores()

    response.status(result.status_code)
    response.json(result)
})

app.post("/v1/senai/locadora/diretor", bodyParserJSON, async (request, response) => {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDiretor.inserirNovoDiretor(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})
//Fazer o start na API (aguardando as requisições)
app.listen(8080, () => {
    console.log("API aguardando novas requisições...");
})