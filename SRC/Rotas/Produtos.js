const Express = require("express")
const MySQL = require("../MySQL").Pool
const Router = Express.Router()
const Multer = require("multer")
const Login = require("../Middleware/Login")

// TRATANDO O ARMAZENAMENTO DE IMAGENS

const Storage = Multer.diskStorage({

    destination: function(Requisicao, Arquivo, Callback){
        
        Callback(null, "./uploads/")
    
    },
    
    filename: function(Requisicao, Arquivo, Callback){
    
        Callback(null, Arquivo.originalname)
    
    }
})

const Filefilter = function(Requisicao, Arquivo, Callback){
    
    // DEFININDO OS TIPOS DE IMAGEM SUPORTADOS
    if (Arquivo.mimetype === "image/jpeg" || Arquivo.mimetype === "image/png"){

        Callback(null, true)

    } else {

        Callback(null, false)

    }
}

const Upload = Multer({
    storage: Storage,
    limits:{
        fileSize: 1024 * 1024 * 10 // LIMITANDO A IMAGEM A 10 MB
    },
    fileFilter: Filefilter
})

// ADICIONA UM NOVO PRODUTO

Router.post("/", Login.Obrigatorio, Upload.single("Imagem_Produto"), function(Requisicao, Resposta, Next){

    // COMANDO MYSQL PARA INTRODUZIR O PRODUTO NO BANCO DE DADOS
    MySQL.getConnection(function(Erro, Conexao) {

        if (Erro){  return Resposta.status(500).send({error: Erro})  }
        
        Conexao.query(

            "INSERT INTO Produtos (Nome, Preco, Imagem_Produto) VALUES (?,?,?)",
            [Requisicao.body.Nome, Requisicao.body.Preco, Requisicao.file.path],
            
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
                    Mensagem: "Produto criado com sucesso",
                    Produto: {
                        ID_Produto: Resultado.ID_Produto,
                        Nome: Requisicao.body.Nome,
                        Preco: Requisicao.body.Preco,
                        Imagem_Produto: Requisicao.file.path,
                        Requisicao: {
                            Tipo: "POST",
                            Descricao: "Insere um produto no banco de dados",
                            URL: "http://localhost:3003/produtos/" + Resultado.ID_Produto
                        }
                    }
                }
                
                return Resposta.status(201).send(RespostaCriado)
            }
        )
    })
})

//RETORNA TODOS OS PRODUTOS

Router.get("/", Login.Opcional, function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

        Conexao.query(

            "SELECT * FROM Produtos;",

            function(Erro, Resultado, Field){
                Conexao.release()
                
                if (Erro){  return Resposta.status(500).send({error: Erro})  }
                
                // DETALHANDO A RESPOSTA
                const Resposta = {
                    Quantidade: Resultado.length,
                    Produtos: Resultado.map(Prod => {
                        return {
                            ID_Produto: Prod.ID_Produto,
                            Nome: Prod.Nome,
                            Preco: Prod.Preco,
                            Imagem_Produto: Prod.Imagem_Produto,
                            Requisicao: {
                                Tipo: "GET",
                                Descricao: "Retornando Todos os produtos do banco de dados",
                                URL: "http://localhost:3003/produtos"
                            }
                        }
                    })
                }

                return Resposta.status(200).send(RespostaCriado)
                
            }
        )

    })
})

// RETORNA OS DADOS DE UM PRODUTO

Router.get("/:ID_Produto", Login.Opcional, function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

        Conexao.query(

            "SELECT * FROM Produtos WHERE ID_Produto = ?;",
            [Requisicao.params.ID_Produto],

            function(Erro, Resultado, Field){
                Conexao.release()

                if (Erro){  return Resposta.status(500).send({error: Erro})  }

                // VERIFICA CASO O ID FORNECIDO SEJA INVALIDO
                if (Resultado.lenght == 0){
                    return Resposta.status(404).send({
                        Mensagem: "Não foi encontrado o produto com esse ID"
                    })
                }
                
                const RespostaCriado = {
                    Produto: {
                        ID_Produto: Requisicao.body.ID_Produto,
                        Nome: Resultado[0].Nome,
                        Preco: Resultado[0].Preco,
                        Imagem_Produto: Resultado[0].Imagem_Produto,
                        Requisicao: {
                            Tipo: "GET",
                            Descricao: "Retorna os dados de um produto",
                            URL: "http://localhost:3003/produtos/" + Requisicao.body.ID_Produto
                        }
                    }
                }
                
                return Resposta.status(200).send(RespostaCriado)
                
            }
        )

    })

})

// ATUALIZA UM PRODUTO

Router.patch("/:ID_Produto", Login.Obrigatorio, function(Requisicao, Resposta, Next){

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

                const RespostaCriado = {
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
                
                return Resposta.status(202).send(RespostaCriado)

            }
        )
    })

})

// DELETA UM PRODUTO

Router.delete("/:ID_Produto", Login.Obrigatorio, function(Requisicao, Resposta, Next){

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

                const RespostaCriado = {
                    Mensagem: "Produto removido com sucesso",
                    Requisicao: {
                        Tipo: "POST",
                        Descricao: "ADICIONA UM PRODUTO",
                        URL: "http://localhost:3003/produtos",
                        Body: {
                            Nome: "String",
                            Preco: "Number"
                        }
                    }
                }
                
                return Resposta.status(202).send(RespostaCriado)
            }
        )
    })
})

module.exports = Router