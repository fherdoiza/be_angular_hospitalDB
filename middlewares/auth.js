var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var app = express();

var SEED = require('../config/config').SEED;

exports.tokenVerify = function (req, res, next) {
  //middleware 

  var token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Error el token no es válido",
        error: err
      });
    }

    req.user = decoded.user;

    next();
  });
}