var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var middlewareAuth = require('../middlewares/auth');

var app = express();

var User = require("../models/user");

//Routes
app.get("/", (req, res, next) => {
  User.find({}, "nombre email img role").exec((err, users) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al cargar los usuarios",
        error: err
      });
    } else {
      return res.status(200).json({
        ok: true,
        message: "Get de user",
        data: users
      });
    }
  });
});

app.post("/", middlewareAuth.tokenVerify, (req, res) => {
  var body = req.body;
  var user = new User({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  user.save((err, newUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al crear el usuario",
        error: err
      });
    } else {
      return res.status(201).json({
        ok: true,
        message: "Post de user",
        data: newUser
      });
    }
  });
});

app.put("/:id", middlewareAuth.tokenVerify, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el usuario",
        error: err
      });
    }
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "El usuario con ese id no existe"
      });
    }

    user.nombre = body.nombre;
    user.email = body.email;
    user.role = body.role;

    user.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al actualizar el usuario",
          error: err
        });
      } else {
        return res.status(200).json({
          ok: true,
          message: "Put de user",
          data: updatedUser
        });
      }
    });
  });
});

app.delete("/:id", middlewareAuth.tokenVerify, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el usuario",
        error: err
      });
    }
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "El usuario con ese id no existe"
      });
    }
  });

  User.findByIdAndDelete(id, (err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al borrar el usuario",
        error: err
      });
    } else {
      return res.status(200).json({
        ok: true,
        message: "DELETE de user",
        data: deletedUser
      });
    }
  });
});

module.exports = app;