const Express = require("express")
const MySQL = require("../MySQL").Pool
const Router = Express.Router()

Router.get("/", function(Requisicao, Resposta, Next){

    Resposta.status(200).send({

        Mensagem: "Usando o GET dentro da rota de produtos"

    })
})

Router.get("/:ID_Produto", function(Requisicao, Resposta, Next){

    Resposta.status(200).send({

        Mensagem: "Retornando um produto exclusivo"

    })
})

Router.post("/", function(Requisicao, Resposta, Next){

    const Produto = {

        Nome: Requisicao.body.Nome,
        Preco: Requisicao.body.Preco

    }
    Resposta.status(201).send({

        Mensagem: "Usando o POST dentro da rota de produtos",
        ProdutoCriado: Produto

    })
})

Router.patch("/:ID_Produto", function(Requisicao, Resposta, Next){

    Resposta.status(201).send({

        Mensagem: "Usando o PATCH dentro da rota de produtos"

    })
})

Router.delete("/:ID_Produto", function(Requisicao, Resposta, Next){

    Resposta.status(201).send({

        Mensagem: "Usando o DELETE dentro da rota de produtos"

    })
})

module.exports = Router