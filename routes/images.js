var express = require('express');

const path = require('path');
const fs = require('fs');

var app = express();


//Routes
app.get("/:type/:img", (req, res, next) => {

  var type = req.params.type;
  var img = req.params.img;

  var imagePath = path.resolve(__dirname, `../uploads/${type}/${img}`);
  if(fs.existsSync(imagePath)){
    res.sendFile(imagePath);
  }else{
    var pathNoImage= path.resolve(__dirname, '../assets/no-img.jpg');
    res.sendFile(pathNoImage);
  }

});

module.exports = app;