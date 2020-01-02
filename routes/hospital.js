var express = require("express");
var middlewareAuth = require('../middlewares/auth');

var app = express();

var Hospital = require("../models/hospital");

//Routes
app.get("/", (req, res, next) => {

  var skip = req.query.skip || 0;
  skip = Number(skip);

  Hospital.find({})
  .skip(skip) // a partir de qué registro muestra (desde)
  .limit(5) // limite del número de registros que se quiere
  .populate('user', 'nombre, email') //muestra del objeto user las propiedades nombre y email.
  .exec((err, hospitals) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al cargar los hospitales",
        error: err
      });
    } else {
      Hospital.count({}, (err, count)=>{
        return res.status(200).json({
          ok: true,
          message: "Get de hospital",
          data: hospitals,
          total:count
        });
      });
      
    }
  });
});

app.post("/", middlewareAuth.tokenVerify, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    name: body.nombre,
    user: req.user._id
  });

  hospital.save((err, newHospital) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al crear el hospital",
        error: err
      });
    } else {
      return res.status(201).json({
        ok: true,
        message: "Post de hospital",
        data: newHospital
      });
    }
  });
});

app.put("/:id", middlewareAuth.tokenVerify, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el hospital",
        error: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: "El hospital con ese id no existe"
      });
    }

    hospital.name = body.nombre;
    hospital.user = req.user._id;

    hospital.save((err, updatedHospital) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al actualizar el hospital",
          error: err
        });
      } else {
        return res.status(200).json({
          ok: true,
          message: "Put del hospital",
          data: updatedHospital
        });
      }
    });
  });
});

app.delete("/:id", middlewareAuth.tokenVerify, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el hospital",
        error: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: "El hospital con ese id no existe"
      });
    }
  });

  Hospital.findByIdAndDelete(id, (err, deletedHospital) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al borrar el hospital",
        error: err
      });
    } else {
      return res.status(200).json({
        ok: true,
        message: "DELETE de hospital",
        data: deletedHospital
      });
    }
  });
});

module.exports = app;