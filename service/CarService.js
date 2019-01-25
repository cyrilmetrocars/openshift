'use strict';
const MongoClient = require('mongodb').MongoClient;
const db_name = 'sampledb';
const url = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;

/**
 * Supprimer une voiture
 * Supprimer une voiture par son ID
 *
 * id Long Le ID de la voiture à supprimer
 * no response value expected for this operation
 **/
exports.deleteCar = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Trouver une voiture
 * Trouver une voiture par son ID
 *
 * id Long Le ID de la voiture à trouver
 * returns Car
 **/
exports.getCar = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "dirty" : true,
  "priceLongTime" : 39.99,
  "year" : 2017,
  "idBrand" : 3,
  "price" : 69.69,
  "name" : "Logan",
  "id" : 27,
  "stock" : 9,
  "desc" : "La meilleure voiture de sa catégorie !"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Trouver des voitures
 * Nombreux queryParams : _limit, _page, name_like, idBrand, dirty
 *
 * idBrand Integer L'ID de la marque des voitures à récupérer (optional)
 * dirty Boolean Le booléen qui précise si on s'intéresse aux dirty cars uniquement (optional)
 * returns List
 **/
exports.getCars = function(idBrand,dirty) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, client)
    {

      const _db = client.db(db_name);
      const _cars = _db.collection('cars');

      var _params = {};
      if( idBrand) { _params.idBrand = idBrand}
      if( dirty) { _params.dirty = true;}
      if( false === dirty) { _params.dirty = false;}
    
      //recherche du MAX id
      _cars
        .find(_params)
        .toArray(
          function(error, findResult)
          {
            //affectation du MAX id à notre CAR
            var _data = findResult.map(function(car){
              delete car._id;
              return car;
            });
//            console.log(_data.forEach(function(car){return JSON.stringify(car)}).join(''));

            //réponse
            resolve( _data);
            client.close();
          }
        );//toArray
      
    });//connect
  });//promise
}


/**
 * Ajouter une voiture
 * Ajouter une voiture sans ID la voiture revient avec son ID
 *
 * body Car La voiture à ajouter sans ID
 * returns Car
 **/
exports.postCar = function(body)
{
  return new Promise(function(resolve, reject)
  {
    var _car = body;
    _car.dirty = !!_car.dirty;
    
    MongoClient.connect(url, function(err, client)
    {

      const _db = client.db(db_name);
      const _cars = _db.collection('cars');
    
      //recherche du MAX id
      _cars
        .find()
        .sort({id:-1})
        .limit(1)
        .toArray(
          function(error, findResult)
          {

            //affectation du MAX id à notre CAR
            _car.id = findResult[0].id + 1;

            _cars.insertOne( _car, {w:1}, function(err, postResult)
            {
              delete _car._id;
              console.log('Voitures insérées : ' + postResult.insertedCount + '\nStructure: ' + JSON.stringify(_car));
              resolve( _car);
              client.close();
            });

          }
        );//toArray
      
    });//connect
  });//Promise
};//export postCar


/**
 * Ecraser une voiture
 * Ecraser toutes les données d'une voiture
 *
 * body Car La voiture à écraser
 * id Long Le ID de la voiture à écraser
 * returns Car
 **/
exports.putCar = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "dirty" : true,
  "priceLongTime" : 29.99,
  "year" : 2017,
  "idBrand" : 3,
  "price" : 59.99,
  "name" : "Logan",
  "id" : 27,
  "stock" : 9,
  "desc" : "La meilleure voiture de sa catégorie !"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

