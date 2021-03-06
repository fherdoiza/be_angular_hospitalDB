var express = require("express");
var middlewareAuth = require('../middlewares/auth');

var app = express();

var Doctor = require("../models/doctor");

//Routes
app.get("/", (req, res, next) => {


  var skip = req.query.skip || 0;
  skip = Number(skip);

  Doctor.find({})
    .skip(skip) // a partir de qué registro muestra (desde)
    .limit(5) // limite del número de registros que se quiere
    .populate('user', 'nombre, email') //muestra del objeto user las propiedades nombre y email.
    .populate('hospital') //muestra del objeto hospital y todas sus propiedades.
    .exec((err, doctors) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error al cargar los doctores",
          error: err
        });
      } else {

        Doctor.count({}, (err, count) => {
          return res.status(200).json({
            ok: true,
            message: "Get de doctor",
            data: doctors,
            total: count
          });
        });

      }
    });
});

app.get('/:id', (req, res) => {
  var id = req.params.id;
  Doctor.findById(id)
    .populate('usuario', 'nombre img email')
    .populate('hospital')
    .exec((err, doctor) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar doctor',
          errors: err
        });
      }
      if (!doctor) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El doctor con el id ' + id + 'no existe',
          errors: {
            message: 'No existe un doctor con ese ID'
          }
        });
      }
      res.status(200).json({
        ok: true,
        doctor: doctor
      });
    })
});

app.post("/", middlewareAuth.tokenVerify, (req, res) => {
  var body = req.body;
  var doctor = new Doctor({
    name: body.name,
    user: req.user._id,
    hospital: body.hospital // is the Id
  });

  doctor.save((err, newDoctor) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al crear el doctor",
        error: err
      });
    } else {
      return res.status(201).json({
        ok: true,
        message: "Post de doctor",
        data: newDoctor
      });
    }
  });
});

app.put("/:id", middlewareAuth.tokenVerify, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Doctor.findById(id, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el doctor",
        error: err
      });
    }
    if (!doctor) {
      return res.status(400).json({
        ok: false,
        message: "El doctor con ese id no existe"
      });
    }

    doctor.name = body.name;
    doctor.user = req.user;
    doctor.hospital = body.hospital;

    doctor.save((err, updatedDoctor) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al actualizar el doctor",
          error: err
        });
      } else {
        return res.status(200).json({
          ok: true,
          message: "Put del doctor",
          data: updatedDoctor
        });
      }
    });
  });
});

app.delete("/:id", middlewareAuth.tokenVerify, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Doctor.findById(id, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el doctor",
        error: err
      });
    }
    if (!doctor) {
      return res.status(400).json({
        ok: false,
        message: "El doctor con ese id no existe"
      });
    }
  });

  Doctor.findByIdAndDelete(id, (err, deletedDoctor) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al borrar el doctor",
        error: err
      });
    } else {
      return res.status(200).json({
        ok: true,
        message: "DELETE de doctor",
        data: deletedDoctor
      });
    }
  });
});

module.exports = app;