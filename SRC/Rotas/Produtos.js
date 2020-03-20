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

    // COMANDO MYSQL PARA INTRODUZIR O PRODUTO NO BANCO DE DADOS
    MySQL.getConnection(function(Erro, Conexao) {


        console.error(Erro)
        
        if (Erro == null) {
            console.log("DEU CERTO")
        }
        else{
            console.error("FUDEU")
        }
        Conexao.query(

            "INSERT INTO Produtos (Nome, Preco) VALUES (?,?)",
            [Requisicao.body.Nome, Requisicao.body.Preco],
            
            //CALLBACK PARA ENCERRAR A CONEXÃO DEPOIS DO TERMINO DA REQUISIÇÃO
            function(Erro, Resultado, Field){
                Conexao.release()

                if (Erro) {
                    return Resposta.status(500).send({
                        Erro: Erro,
                        Response: null
                    })
                }
                
                Resposta.status(201).send({
                    Mensagem: "Produto criado com sucesso!!",
                    ID_Produto: Resultado.insertId
                })
            }
        )
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
