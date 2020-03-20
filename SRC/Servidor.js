const Porta = 3003

const Express = require("express")
const BodyParser = require("body-parser")
const RotaProdutos = require("./Rotas/Produtos")
const RotaPedidos = require("./Rotas/Pedidos")

const APP = Express()

//Estudar sobre CORS que ainda não fiz

APP.use(BodyParser.urlencoded({ extended: false }))
APP.use(BodyParser.json()) //SO VAI ACEITAR DADOS JSON COMO ENTRADA NO BODY
APP.use("/produtos", RotaProdutos)
APP.use("/pedidos", RotaPedidos)

// TRATANDO O ERRO CASO UMA ROTA NÃO DEFINIDA FOR INFORMADA

APP.use(function(Requisicao, Resposta, Next){

    const Erro = new Error("Não encontrado!!!")
    Erro.status = 404
    Next(Erro)

})

APP.use(function(Erro, Requisicao, Resposta, Next) {

    Resposta.status(Erro.status || 500)
    return Resposta.send({

        Erro: {
            Mensagem: Erro.message
        }

    })
})

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

APP.listen(Porta, function(){

    console.log("Servidor rodando na url http://localhost:3003")

})
