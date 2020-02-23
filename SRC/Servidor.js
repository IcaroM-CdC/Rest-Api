const Porta = 3003

const Express = require("express")
const APP = Express()


APP.get("/", function(Requisicao, Resposta){

    Resposta.send("Teste")

})


APP.listen(Porta, function(){

    console.log("Servidor rodando na url http://localhost:3003")

})
