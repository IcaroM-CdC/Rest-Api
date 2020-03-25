const Express = require("express")
const MySQL = require("../MySQL").Pool
const Router = Express.Router()
const Login = require("../Middleware/Login")

// RETORNA TODOS OS PEDIDOS

Router.get("/", Login.Obrigatorio, function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

        Conexao.query(
            // INNER JOIN

            `SELECT Pedidos.ID_Pedido,
                    Pedidos.Quantidade
                    Produtos.ID_Produto
                    Produtos.Nome
                    Produtos.Preco
               FROM Pedidos
         INNER JOIN Produtos
                 ON Produtos.ID_Produto = Pedidos.ID_Produto;`,

            function(Erro, Resultado, Field){
                Conexao.release()

                if (Erro){  return Resposta.status(500).send({error: Erro})  }
                
                // DETALHANDO A RESPOSTA
                const RespostaCriado = {
                    Pedidos: Resultado.map(Ped => {
                        return {
                            ID_Pedido: Ped.ID_Pedido,
                            Quantidade: Ped.Quantidade,
                            Produto: {
                                ID_Produto: Ped.ID_Produto,
                                Nome: Ped.Nome,
                                Preco: Ped.Preco
                            },
                            
                            Requisicao: {
                                Tipo: "GET",
                                Descricao: "Retornando um pedido especifico",
                                URL: "http://localhost:3003/pedidos/" + Ped.ID_Pedido
                            }
                        }
                    })
                }

                return Resposta.status(200).send(RespostaCriado)
                
            }
        )

    })
})

// RETORNA OS DADOS DE UM PEDIDO

Router.get("/:ID_Pedido", Login.Obrigatorio, function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

        Conexao.query(

            "SELECT * FROM Pedidos WHERE ID_Pedido = ?;",
            [Requisicao.params.ID_Produto],

            function(Erro, Resultado, Field){
                Conexao.release()

                if (Erro){  return Resposta.status(500).send({error: Erro})  }

                // VERIFICA CASO O ID FORNECIDO SEJA INVALIDO
                if (Resultado.lenght == 0){
                    return Resposta.status(404).send({
                        Mensagem: "Não foi encontrado o pedido com esse ID"
                    })
                }
                
                const RespostaCriado = {
                    Produto: {
                        ID_Produto: Resultado.ID_Produto,
                        ID_Pedido: Requisicao.body.ID_Pedido,
                        Quantidade: Resultado.Quantidade,
                        Requisicao: {
                            Tipo: "GET",
                            Descricao: "Retorna os dados de todos os pedidos",
                            URL: "http://localhost:3003/pedidos"
                        }
                    }
                }
                
                return Resposta.status(200).send(RespostaCriado)
                
            }
        )

    })
})

// CRIA UM PEDIDO

Router.post("/", Login.Obrigatorio, function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }
        
        Conexao.query(

            "SELECT * FROM Produtos WHERE ID_Produtos = ?"
            [Requisicao.body.ID_Produto],

            function(Erro, Resultado, Field){

                if (Erro){  return Resposta.status(500).send({error: Erro})  }

                if (Resultado.lenght == 0){
                    return Resposta.status(404).send({
                        Mensagem: "Não foi encontrado nenhum produto com esse ID"
                    })
                }

                Conexao.query(

                    "INSERT INTO Pedidos (ID_Produto, Quantidade) VALUES (?,?)",
                    [Requisicao.body.ID_Produto, Requisicao.body.Quantidade],
                    
                    //CALLBACK PARA ENCERRAR A CONEXÃO DEPOIS DO TERMINO DA REQUISIÇÃO
                    function(Erro, Resultado, Field){
                        Conexao.release()
        
                        if (Erro) {
                            return Resposta.status(500).send({
                                Erro: Erro,
                                Response: null
                            })
                        }
        
                        const RespRespostaCriadoosta = {
                            Mensagem: "Pedido criado com sucesso",
                            Pedido: {
                                ID_Pedido: Resultado.ID_Pedido,
                                ID_Produto: Requisicao.body.ID_Produto,
                                Quantidade: Requisicao.body.Quantidade,
                                Requisicao: {
                                    Tipo: "POST",
                                    Descricao: "Cria um pedido",
                                    URL: "http://localhost:3003/pedidos"
                                }
                            }
                        }
                        
                        return Resposta.status(201).send(RespostaCriado)
                    }
                )
            }
        )
    })
})

// DELETA UM PEDIDO

Router.delete("/:ID_Pedido", Login.Obrigatorio, function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao) {

        if (Erro){  return Resposta.status(500).send({error: Erro})  }
        
        Conexao.query(

            "DELETE FROM Pedidos WHERE ID_Pedido = ?",
            [Requisicao.body.ID_Produto],
            
            //CALLBACK PARA ENCERRAR A CONEXÃO DEPOIS DO TERMINO DA REQUISIÇÃO
            function(Erro, Resultado, Field){
                Conexao.release()

                if (Erro) {
                    return Resposta.status(500).send({
                        Erro: Erro,
                        Response: null
                    })
                }

                const RespostaCriado = {
                    Mensagem: "Produto removido com sucesso",
                    Requisicao: {
                        Tipo: "POST",
                        Descricao: "Cria um pedido",
                        URL: "http://localhost:3003/pedidos",
                        Body: {
                            ID_Produto: "Number",
                            Quantidade: "Number"
                        }
                    }
                }
                
                return Resposta.status(202).send(RespostaCriado)
            }
        )
    })
})

module.exports = Router