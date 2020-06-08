var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// Serve HTML
app.set( 'port', ( process.env.PORT || 8080 ));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/editor", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/bower_components", express.static("bower_components"));

var editorText='a'
var usersOnline=[]

io.on("connection", function(socket) {
    console.log("a user connected");
    socket.emit('updateEditorText', editorText)
    socket.on("disconnect", function() {
      console.log(usersOnline)
      console.log(socket.id);
    });
    socket.on('updateEditor', function(data){
      editorText = data
      socket.broadcast.emit('updateEditorText', editorText)
    })
    socket.on('saveUser', function(user, id){
      usersOnline.push(user+"/"+id)
      socket.emit('sendToEditor', id)
    })
    socket.on('getUserById', function(id){
      user=usersOnline.find(a =>a.includes(id))
      user=user.split('/')[0];
      socket.emit('sendUserById', user)
      console.log(socket.id)
      console.log(usersOnline.find(a =>a.includes(id)))
    })
    socket.on('getUsersOnline', function(){
      socket.emit('receiveUsersOnline', usersOnline)
    })
    socket.on('userTyping', function(user){
      console.log("b"+user)
      socket.broadcast.emit('sendUserTyping', user)
    })
  });

// Setup Express Listener
http.listen(app.get( 'port' ), function() {
  console.log("listening on: 0.0.0.0:8080");
});