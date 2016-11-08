// Iniciamos uma nova instância do socket.io passando o objeto http(o servidor http)
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendfile('index.html');
});

// Quando tivermos uma chamada para o nosso socket iremos logar no terminal uma mensagem de novo usuário
io.on('connection', function(socket){
	console.log('Usuário conectado.');
	io.emit('mensagem de chat', 'Usuário conectado.');

	socket.on('mensagem de chat', function(msg){
	   console.log('nova mensagem enviada: ' + msg);

	   // envia msg só para o usuario que solicitou
	   // socket.emit('mensagem de chat', 'Nova mensagem enviada');

	   // mensagem para todos os usuarios
	   io.emit('mensagem de chat', msg);
	});

	socket.on('disconnect', function(){
		console.log('O usuário saiu da aplicação.');
		io.emit('mensagem de chat', 'O usuário saiu da aplicação.');
	});
	
});

http.listen(3000, function(){
	console.log('listening on http://localhost:3000');
});