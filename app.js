const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const SocketIOFileUpload = require('socketio-file-upload');
const express = require('express');
const socketio = require('socket.io');

const app = express()
    .use(SocketIOFileUpload.router)
    .use(express.static(path.join(__dirname, '/public')))
    .listen(80);

const io = socketio.listen(app);

var onlineUsers = {};
var onlineCount = 0;

io.on('connection', function (socket) {

    socket
        .on('login', function (obj) {
            socket.id = obj.uid;

            if (!onlineUsers.hasOwnProperty(obj.uid)) {
                onlineUsers[obj.uid] = obj.username;
                onlineCount++;
            }

            io.emit('login', {
                onlineUsers: onlineUsers,
                onlineCount: onlineCount,
                user: obj
            });
            console.log(obj.username + 'Joined the Chat Room');
        })

    socket.on('disconnect', function () {

        if (onlineUsers.hasOwnProperty(socket.id)) {
            const obj = {
                uid: socket.id,
                username: onlineUsers[socket.id]
            };

            delete onlineUsers[socket.id];
            onlineCount--;

            io.emit('logout', {
                onlineUsers: onlineUsers,
                onlineCount: onlineCount,
                user: obj
            });
            console.log(obj.username + 'Left the Chat Room');
        }
    })

    const uploader = new SocketIOFileUpload();
    uploader.dir = __dirname + "/public/uploads";
    uploader.listen(socket);

    uploader.on("saved", function (event) {
        console.log(event.file);
        const extension = event
            .file
            .name
            .split(".")
            .pop();

        const originalFilePath = path.join(uploader.dir, event.file.name);
        const newFileName = `${uuid.v4()}.${extension}`;
        const newFilePath = path.join(uploader.dir, newFileName);

        fs.rename(originalFilePath, newFilePath, function (err) {
            if (err) 
                throw err;
            console.log('renamed conplete');

        });
        event.file.clientDetail.downloadLink = `/uploads/${newFileName}`;
    });

    uploader.on("error", function (event) {
        console.log("Error from uploader", event);
    });

    socket.on('message', function (obj) {
        io.emit('message', obj);
        console.log(obj.username + "说:" + obj.message)
    })

});