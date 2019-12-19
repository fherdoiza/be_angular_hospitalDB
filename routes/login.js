var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var app = express();

var User = require("../models/user");

var SEED = require('../config/config').SEED;

app.post("/", (req, res) => {
  var body = req.body;
  User.findOne({
      email: body.email
    },
    (err, userDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error al buscar el usuario",
          error: err
        });
      }
      if (!userDB) {
        return res.status(400).json({
          ok: false,
          message: "Credenciales incorrectas",
          error: err
        });
      }

      if (!bcrypt.compareSync(body.password, userDB.password)) {
        return res.status(400).json({
          ok: false,
          message: "Credenciales incorrectas",
          error: null
        });
      }
      // TODO crear token
      usuarioDB.password = "";
      var token = jwt.sign({
        user: userDB
      }, SEED, {
        expiresIn: 14400
      });

      res.status(200).json({
        ok: true,
        message: "Login correcto",
        data: {
          token,
          user: usuarioDB
        }
      });
    }
  );
});

module.exports = app;