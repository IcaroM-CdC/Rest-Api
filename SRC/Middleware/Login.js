const JWT = require("jsonwebtoken")

exports.Obrigatorio = function(Requisicao, Resposta, Next){

    try {
        
        const Token = Requisicao.headers.authorization.split(" ")[1]
        const Decode = JWT.verify(Token, process.env.JWT_KEY)
        Requisicao.Usuario = Decode
        Next()

    } catch (error) {

        return res.status(401).send({ Mensagem: "Falha na autenticação" })
    
    }
}

exports.Opcional = function(Requisicao, Resposta, Next){

    try {
        
        const Token = Requisicao.headers.authorization.split(" ")[1]
        const Decode = JWT.verify(Token, process.env.JWT_KEY)
        Requisicao.Usuario = Decode
        Next()

    } catch (error) {

        Next()
    
    }
}