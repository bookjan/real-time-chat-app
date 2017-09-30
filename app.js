// Require the libraries:
const SocketIOFileUpload = require('socketio-file-upload');
const socketio = require('socket.io');
const express = require('express');

// Make your Express server:
const app = express()
    .use(SocketIOFileUpload.router)
    .use(express.static(__dirname + "/public"))
    .listen(3000);

// Start up Socket.IO:
const io = socketio.listen(app);
io.sockets.on("connection", function(socket) {

    // Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new SocketIOFileUpload();
    uploader.dir = __dirname + "/public/uploads";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function(event) {
        console.log(event.file);
        downloadLink = '/uploads/' + event.file.name;
        io.emit('chat message', { type: 'image', content: downloadLink });
    });

    // Error handler:
    uploader.on("error", function(event) {
        console.log("Error from uploader", event);
    });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
});