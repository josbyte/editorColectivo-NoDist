var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// Serve HTML
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/bower_components", express.static("bower_components"));

var editorText='a'

io.on("connection", function(socket) {
    console.log("a user connected");
    socket.emit('updateEditorText', editorText)
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
    socket.on('updateEditor', function(data){
      editorText = data
      io.sockets.emit('updateEditorText', editorText)
      console.log("update: "+editorText)
    })
  });

// Setup Express Listener
http.listen(8080, "0.0.0.0", function() {
  console.log("listening on: 0.0.0.0:8080");
});