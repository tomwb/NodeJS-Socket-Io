// Iniciamos uma nova instância do socket.io passando o objeto http(o servidor http)
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
	res.sendFile( __dirname + '/index.html');
});

app.get('/chat', function(req, res){
	res.sendFile( __dirname + '/chat.html');
});

// Quando tivermos uma chamada para o nosso socket iremos logar no terminal uma mensagem de novo usuário
io.on('connection', function(socket){

	// defino qual a sala dele
	socket.on('room', function(room) {
		socket.join(room);
		io.sockets.in(room).emit('receiver_chat_message', 'Usuário entrou na sala.');
	});

	socket.on('send_chat_mensseger', function( msg ){
		// envia msg só para o usuario que solicitou
		// socket.emit('receiver_chat_message', 'Nova mensagem enviada');

		// mensagem para todos os usuarios
		room = getUserRoom(socket);	
		if ( room ) {
			io.sockets.in(room).emit('receiver_chat_message', msg);
		}
	});

	socket.on('disconnecting', function( reason ){
		room = getUserRoom(socket);	
		if ( room ) {
			io.sockets.in(room).emit('receiver_chat_message', 'Usuário saiu da sala.');
		}
	});
	
});

function getUserRoom (socket) {
	for(var index in socket.rooms) { 
		if(socket.rooms[index] != socket.id){
			return socket.rooms[index];
		}
	};
	return null;
}

http.listen(3000, function(){
	console.log('listening on http://localhost:3000');
});