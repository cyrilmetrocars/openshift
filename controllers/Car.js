'use strict';

var utils = require('../utils/writer.js');
var Car = require('../service/CarService');

module.exports.deleteCar = function deleteCar (req, res, next) {
  var id = req.swagger.params['id'].value;
  Car.deleteCar(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCar = function getCar (req, res, next) {
  var id = req.swagger.params['id'].value;

  //CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.setHeader('Content-Type','application/json');
//  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Credentials','true');
  
  //Envoi
  Car.getCar(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCars = function getCars (req, res, next) {

  //params
  var idBrand = req.swagger.params['idBrand'].value;
  var dirty = req.swagger.params['dirty'].value;

  //CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.setHeader('Content-Type','application/json');
  res.setHeader('Access-Control-Allow-Credentials','true');

  //reponse
  Car.getCars(idBrand,dirty)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postCar = function postCar (req, res, next) {
  var body = req.swagger.params['body'].value;

  //CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.setHeader('Content-Type','application/json');
  res.setHeader('Access-Control-Allow-Credentials','true');

  //Envoi au client
  Car.postCar(body)
    .then(function (response) {

      //gestion du status de réussite
      res.statusCode = 201;
      res.statusMessage = 'Voiture créée!';

      //écriture sur le port client
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putCar = function putCar (req, res, next) {
  var body = req.swagger.params['body'].value;
  var id = req.swagger.params['id'].value;
  Car.putCar(body,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
