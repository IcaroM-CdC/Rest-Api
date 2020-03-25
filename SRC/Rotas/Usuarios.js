const Express = require("express")
const MySQL = require("../MySQL").Pool
const Router = Express.Router()
const Bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")


Router.post("/cadastro", function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

            // VERIFICANDO SE O EMAIL JA FOI ULTILIZADO ANTERIORMENTE
            Conexao.query(

                "SELECT * FROM Usuarios WHERE Email = ?",
                [Requisicao.body.Email],

                function(Erro, Resultado){
                    if (Erro){  return Resposta.status(500).send({error: Erro})  }

                    // CASO SEJA, ENTRA NESTA CONDIÇÃO RETORNANDO UM ERRO
                    if (Resultado.length > 0) {

                        Resposta.status(401).send({Mensagem: "Email já ultilizado"})

                    } 
                    
                    // CASO NÃO SEJA, DA PROSSEGUIMENTO AO CADASTRO
                    else {

                        Bcrypt.hash(Requisicao.body, 10, function(ErroBcrypt, Hash){
        
                            if (ErroBcrypt) {return Resposta.status(500).send({error: ErroBcrypt})}
                
                            Conexao.query(
                                
                                "INSERT INTO Usuarios (Email, Senha) VALUES (?,?)",
                                [Requisicao.body.Email, Hash],
                                
                                function(Erro, Resultado, Fields){                                    
                                    Conexao.release()
                                    
                                    if (Erro){  return Resposta.status(500).send({error: Erro})  }
                                
                                    const RespostaCriado = {
                                        Mensagem: "Usuario criado com sucesso",
                                        Usuario: {
                                            ID_Usuario:Resultado.insertId,
                                            Email: Requisicao.body.Email
                                        }
                                    }
                                    return Resposta.status(201).send(RespostaCriado)
                                }
                            )      
                        })
                    }
                }
            )
    })
})

Router.post("/login", function(Requisicao, Resposta, Next){

    MySQL.getConnection(function(Erro, Conexao){

        if (Erro){  return Resposta.status(500).send({error: Erro})  }

        Conexao.query(

            "SELECT * FROM Usuarios WHERE Email = ?",
            [Requisicao.body.Email],

            function(Erro, Resultado, Fields){
                Conexao.release()
                
                if (Erro){  return Resposta.status(500).send({error: Erro})  }

                if (Resultado.length < 1){
                    return Resposta.status(401).send({ Mensagem: "Falha na autenticação"})
                }

                Bcrypt.compare(Requisicao.body.Senha, Resultado[0].Senha, function(Err, Resultados){

                    if (Err){
                        return Resposta.status(401).send({ Mensagem: "Falha na autenticação"})
                    }
                    
                    if (Resultados){
                        var Token = JWT.sign({
                            ID_Usuario: Resultado[0].ID_Usuario,
                            Email: Resultado[0].Email
                        }, 
                        process.env.JWT_KEY,
                         {
                             expiresIn: "1h" //TEMPO PARA A SEÇÃO EXPIRAR
                         })
                        
                        return Resposta.status(200).send({ 
                            Mensagem: "Autenticado com sucesso",
                            Token: Token
                        })
                    }

                    else {
                        return Resposta.status(401).send({ Mensagem: "Falha na autenticação"})
                    }
                })
            }
        )
    })
})

module.exports = Router