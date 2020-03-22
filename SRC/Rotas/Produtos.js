const Express = require("express")
const MySQL = require("../MySQL").Pool
const Router = Express.Router()

// ADICIONA UM NOVO PRODUTO

Router.post("/", function(Requisicao, Resposta, Next){

    // COMANDO MYSQL PARA INTRODUZIR O PRODUTO NO BANCO DE DADOS
    MySQL.getConnection(function(Erro, Conexao) {

        if (Erro){  return Resposta.status(500).send({error: Erro})  }
        
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

                const Resposta = {
                    Mensagem: "Produto criado com sucesso",
                    Produto: {
                        ID_Produto: Resultado.ID_Produto,
                        Nome: Requisicao.body.Nome,
                        Preco: Requisicao.body.Preco,
                        Requisicao: {
                            Tipo: "POST",
                            Descricao: "Insere um produto no banco de dados",
                            URL: "http://localhost:3003/produtos"
                        }
                    }
                }
                
                return Resposta.status(201).send(Resposta)
            }
        )
    })
})

//RETORNA TODOS OS PRODUTOS

Router.get("/", function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

        Conexao.query(

            "SELECT * FROM Produtos;",

            function(Erro, Resultado, Field){
                if (Erro){  return Resposta.status(500).send({error: Erro})  }
                
                // DETALHANDO A RESPOSTA
                const Resposta = {
                    Quantidade: Resultado.length,
                    Produtos: Resultado.map(Prod => {
                        return {
                            ID_Produto: Prod.ID_Produto,
                            Nome: Prod.Nome,
                            Preco: Prod.Preco,
                            Requisicao: {
                                Tipo: "GET",
                                Descricao: "Retornando Todos os produtos do banco de dados",
                                URL: "http://localhost:3003/produtos"
                            }
                        }
                    })
                }

                return Resposta.status(200).send({Resposta})
                
            }
        )

    })
})

// RETORNA OS DADOS DE UM PRODUTO

Router.get("/:ID_Produto", function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

        Conexao.query(

            "SELECT * FROM Produtos WHERE ID_Produto = ?;",
            [Requisicao.params.ID_Produto],

            function(Erro, Resultado, Field){
                if (Erro){  return Resposta.status(500).send({error: Erro})  }

                // VERIFICA CASO O ID FORNECIDO SEJA INVALIDO
                if (Resultado.lenght == 0){
                    return Resposta.status(404).send({
                        Mensagem: "Não foi encontrado o produto com esse ID"
                    })
                }
                
                const Resposta = {
                    Produto: {
                        ID_Produto: Requisicao.body.ID_Produto,
                        Nome: Requisicao.body.Nome,
                        Preco: Requisicao.body.Preco,
                        Requisicao: {
                            Tipo: "GET",
                            Descricao: "Retorna os dados de um produto",
                            URL: "http://localhost:3003/produtos/" + Requisicao.body.ID_Produto
                        }
                    }
                }
                
                return Resposta.status(200).send(Resposta)
                
            }
        )

    })

})

// ATUALIZA UM PRODUTO

Router.patch("/:ID_Produto", function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao) {

        if (Erro){  return Resposta.status(500).send({error: Erro})  }
        
        Conexao.query(

            "UPDATE Produtos SET Nome = ?, Preco = ? WHERE ID_Produtos = ?",
            [Requisicao.body.Nome, Requisicao.body.Preco, Requisicao.body.ID_Produto],
            
            //CALLBACK PARA ENCERRAR A CONEXÃO DEPOIS DO TERMINO DA REQUISIÇÃO
            function(Erro, Resultado, Field){
                Conexao.release()

                if (Erro) {
                    return Resposta.status(500).send({
                        Erro: Erro,
                        Response: null
                    })
                }

                const Resposta = {
                    Mensagem: "Produto atualizado com sucesso",
                    Produto: {
                        ID_Produto: Requisicao.body.ID_Produto,
                        Nome: Requisicao.body.Nome,
                        Preco: Requisicao.body.Preco,
                        Requisicao: {
                            Tipo: "PATCH",
                            Descricao: "Atualiza os dados de um produto",
                            URL: "http://localhost:3003/produtos/" + Requisicao.body.ID_Produto
                        }
                    }
                }
                
                return Resposta.status(202).send(Resposta)

            }
        )
    })

})

// DELETA UM PRODUTO

Router.delete("/:ID_Produto", function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao) {

        if (Erro){  return Resposta.status(500).send({error: Erro})  }
        
        Conexao.query(

            "DELETE FROM Produtos WHERE ID_Produto = ?",
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

                const Resposta = {
                    Mensagem: "Produto removido com sucesso",
                    Requisicao: {
                        Tipo: "Delete",
                        Descricao: "Remove um produto",
                        URL: "http://localhost:3003/produtos",
                        Body: {
                            Nome: "String",
                            Preco: "Number"
                        }
                    }
                }
                
                return Resposta.status(202).send(Resposta)
            }
        )
    })
})

module.exports = Router
