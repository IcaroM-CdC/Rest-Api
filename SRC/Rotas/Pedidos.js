const Express = require("express")
const Router = Express.Router()

Router.get("/", function(Requisicao, Resposta, Next){

    Resposta.status(200).send({

        Mensagem: "Retorna os pedidos"

    })
})

Router.get("/:ID_Produto", function(Requisicao, Resposta, Next){

    Resposta.status(200).send({

        Mensagem: "Retorna um pedido"

    })
})

Router.post("/", function(Requisicao, Resposta, Next){

    const Pedido = {

        ID_Produto: Requisicao.body.ID_Produto,
        Quantidade: Requisicao.body.Quantidade

    }

    Resposta.status(201).send({

        Mensagem: "O pedido foi criado",
        PedidoCriado: Pedido

    })
})

Router.delete("/:ID_Produto", function(Requisicao, Resposta, Next){

    Resposta.status(201).send({

        Mensagem: "Pedido excluido"

    })
})

module.exports = Router