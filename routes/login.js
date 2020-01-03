var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");



var User = require("../models/user");

var SEED = require('../config/config').SEED;

//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



var app = express();

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

//Google Auth
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}
verify().catch(console.error);

app.post('/google', async (req, res) => {
  var token = req.body.token;
  var googleUser = await verify(token)
                          .catch(error=>{
                            return res.status(400).json({
                              ok:false,
                              message:'token no válido'
                            })
                          });


  User.findOne({email:googleUser.email}, (err, userDB)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el usuario",
        error: err
      });
    }
    if (userDB) {
      if(userDB.google===false){
        return res.status(400).json({
          ok: false,
          message: "No se puede autenticar con google ya que está registrado con contraseña"
        });
      }else{
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
            user: userDB
          }
        });
      }
    }else{
      // El usuario no existe y hay que crearlo
      var userG = new User();
      userG.nombre = googleUser.nombre;
      userG.email = googleUser.email;
      userG.img = googleUser.img;
      userG.google = true;
      userG.password = 'NA';

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
          user: userDB
        }
      });
    }
  });

  /*
  return res.status(200).json({
    ok:true,
    message: 'usuario de google ok',
    data: googleUser
  });
  */

});

module.exports = app;