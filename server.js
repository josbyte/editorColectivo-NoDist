var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// Serve HTML
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/bower_components", express.static("bower_components"));

var editorText='<div class="ql-editor" data-gramm="false" data-placeholder="Escribe un documento aquí..." contenteditable="true"><p></p></div><div class="ql-clipboard" tabindex="-1" contenteditable="true"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div>'
io.on("connection", function(socket) {
    console.log("a user connected");
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
    socket.on('updateEditor', function(data){
      editorText=data
    })
    socket.on('getEditorText', function(data){
      socket.emit('updateEditorText', editorText)
    })
  });

// Setup Express Listener
http.listen(8080, "0.0.0.0", function() {
  console.log("listening on: 0.0.0.0:8080");
});