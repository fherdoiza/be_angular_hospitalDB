var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');


app.use(fileUpload());

//Routes
app.put('/:type/:id', function(req, res) {


  var type = req.params.type;
  var id = req.params.id;

  var validImageTypes = ['hospitals', 'doctors', 'users'];

  if(validImageTypes.indexOf(type)<0){
    return res.status(400).json({
      ok: false,
      message: 'Ruta con categoría de imagen no válida',
      error: 'Path no válido.'
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'No files were uploaded.',
      error: 'No se ha seleccionado nada'
    });
  }

  // The name of the input field (i.e. "imageFile") is used to retrieve the uploaded file
  let imageFile = req.files.imageFile;
  var nameArray = imageFile.name.split('.');
  var extension = nameArray[nameArray.length-1];

  // solo estas extensiones se permiten

  var validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

  if(validExtensions.indexOf(extension)<0){
    return res.status(400).json({
      ok: false,
      message: 'Extensión no válida',
      error: 'Las extensiones válidas son png, jpg, gif, jpeg.'
    });
  }

  var fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

  var path = `./uploads/${type}/${fileName}`;

  // Use the mv() method to place the file somewhere on your server
  imageFile.mv(path, err => {
    if (err){
      return res.status(500).json({
        ok: false,
        message: 'Error al mover el archivo',
        error: err
      });
    }

    saveFile(type, id, fileName, res);
      
    
  });
});

function saveFile(type, id, fileName, res){


  if(type === 'users'){
    User.findById(id, (err, user)=>{

      if(!user){
        res.status(400).json({
          ok: false,
          message: 'no existe el usuario'
        });
      }

      var oldPath = './uploads/users/'+user.img;

      // si existe, elimina la imagen anterior
      if(fs.existsSync(oldPath)){
        fs.unlink(oldPath);
      }

      user.img = fileName;
      user.save((err, updatedUser)=>{
        updatedUser.password = 'Oculta :D';
        if(err){
          return res.status(400).json({
            ok: false,
            message: err
          });
        }
        return res.status(200).json({
          ok: true,
          message: 'File uploaded!',
          data: updatedUser
        });
      });
    });
  }
  if(type === 'doctors'){
    Doctor.findById(id, (err, doctor)=>{

      if(!doctor){
        res.status(400).json({
          ok: false,
          message: 'no existe el doctor'
        });
      }
      var oldPath = './uploads/doctors/' + doctor.img;

      // si existe, elimina la imagen anterior
      if(fs.existsSync(oldPath)){
        fs.unlink(oldPath);
      }

      doctor.img = fileName;
      doctor.save((err, updatedDoctor)=>{
        if(err){
          return res.status(400).json({
            ok: false,
            message: err
          });
        }
        return res.status(200).json({
          ok: true,
          message: 'File uploaded!',
          data: updatedDoctor
        });
      });
    });
  }
  if(type === 'hospitals'){
    Hospital.findById(id, (err, hospital)=>{

      if(!hospital){
        res.status(400).json({
          ok: false,
          message: 'no existe el hospital'
        });
      }

      var oldPath = './uploads/hospitals/' + hospital.img;

      // si existe, elimina la imagen anterior
      if(fs.existsSync(oldPath)){
        fs.unlink(oldPath);
      }

      hospital.img = fileName;
      hospital.save((err, updatedHospital)=>{
        if(err){
          return res.status(400).json({
            ok: false,
            message: err
          });
        }
        return res.status(200).json({
          ok: true,
          message: 'File uploaded!',
          data: updatedHospital
        });
      });
    });
  }
}

module.exports = app;