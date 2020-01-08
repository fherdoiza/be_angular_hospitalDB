var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var User = require('../models/user');
var Doctor = require('../models/doctor');

//Routes
app.get("/todo/:query", (req, res, next) => {

  var query = req.params.query;

  var regex = new RegExp(query, 'i');

  Promise.all(
    [
      searchHospitals(query, regex),
      searchDoctors(query, regex),
      searchUsers(query, regex)
    ]
  ).then(resp => {
    res.status(200).json({
      ok: true,
      message: "OK",
      hospitals: resp[0],
      doctors: resp[1],
      users: resp[2]
    });
  });
});

function searchHospitals(query, regex) {

  return new Promise((resolve, reject) => {
    Hospital.find({
        name: regex
      })
      .populate('user', 'nombre email img')
      .exec((err, hospitals) => {
        if (err) {
          reject();
        } else {
          resolve(hospitals);
        }
      });
  });

}

function searchDoctors(query, regex) {

  return new Promise((resolve, reject) => {
    Doctor.find({
        name: regex
      })
      .populate('user', 'nombre email img')
      .populate('hospital')
      .exec((err, doctors) => {
        if (err) {
          reject();
        } else {
          resolve(doctors);
        }
      });
  });

}

function searchUsers(query, regex) {

  return new Promise((resolve, reject) => {
    User.find({}, 'nombre email role img')
      .or([ // para buscar sobre múltiples campos
        {
          'nombre': regex
        },
        {
          'email': regex
        },
      ]).exec((err, users) => {
        if (err) {
          reject();
        } else {
          resolve(users);
        }
      });
  });

}

app.get('/collection/:table/:query', (req, res, next) => {

  var table = req.params.table;
  var query = req.params.query;
  var regex = new RegExp(query, 'i');

  var promise;

  switch (table) {
    case 'users':
      promise = searchUsers(query, regex);
      break;
    case 'hospitals':
      promise = searchHospitals(query, regex);
      break;
    case 'doctors':
      promise = searchDoctors(query, regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        message: 'no coincide la ruta para la búsqueda'
      });
  }

  promise.then(resp => {

    res.status(200).json({
      ok: true,
      [table]: resp
    });
  });

});

module.exports = app;