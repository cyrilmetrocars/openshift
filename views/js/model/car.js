var BRANDS = [
	{
	  "id": 1,
	  "name": "Ferrari",
	  "abrev": "FER",
	  "notoriety": 9
	},
	{
	  "id": 2,
	  "name": "Lamborghini",
	  "abrev": "LBI",
	  "notoriety": 9,
	  "new": true
	},
	{
	  "id": 3,
	  "name": "DACIA",
	  "abrev": "DAC",
	  "notoriety": 2
	},
	{
	  "id": 4,
	  "name": "Porsche",
	  "abrev": "POR",
	  "notoriety": 7
	},
	{
	  "id": 5,
	  "name": "Renault",
	  "abrev": "REN",
	  "notoriety": 4
	}
];

function Car( settings){

	"use strict";

	//initialisation des settings
	if( !settings) { settings = {};}
	settings.id = settings.id || 0;
	settings.name = settings.name || 'Voiture';
	settings.price = settings.price || settings.preis || settings.prix || 29.99;
	settings.priceLongTime = settings.priceLongTime || settings.preisLongTime || settings.prixLongTime || settings.price;
	settings.year = settings.year || (new Date()).getFullYear();
	settings.stock = settings.stock || settings.dispo || 1;
	settings.desc = settings.desc || 'Sans doute la meilleure voiture du monde !';
	settings.dirty = !!settings.dirty;

	//initialiation des variables membres (propriétés) privées
	var _idBrand = 1;//FERRARI par défaut

	//initialisation des variables membres (propriétés) publiques
	this.id = settings.id;
	this.name = settings.name;
	this.price = settings.price;
	this.priceLongTime = settings.priceLongTime;
	this.year = settings.year;
	this.stock = settings.stock;
	this.desc = settings.desc;
	this.dirty = settings.dirty;

	//fonctions membres (méthodes) privées
	function checkIdBrand( idBrand) {
		var _r = false;
		var _listIdBrand = [1,2,3,4,5];
		if( null != idBrand){
			if( 'number' == typeof(idBrand)){
				_r = (-1 != _listIdBrand.indexOf(idBrand));
			} else {
				_r = (-1 != _listIdBrand.indexOf(idBrand.toNumber()));
			}
		}
		return _r;
	}

	//fonctions membres (méthodes) publiques
	this.sgIdBrand = function( idBrand){
		if(checkIdBrand(idBrand)){
			if( 'number' == typeof(idBrand)){
				_idBrand = idBrand;
			} else {
				_idBrand = idBrand.toNumber();
			}	
		}
		this.idBrand = _idBrand;
		return _idBrand;
	};
	this.sgIdBrand(settings.idBrand);

	//méthodes utilitaires
	this.toJSON = function(){
		return {
			id: this.id
			, idBrand: _idBrand
			, name: this.name
			, price: this.price
			, priceLongTime: this.priceLongTime
			, year: this.year
			, stock: this.stock
			, desc: this.desc
			, dirty: this.dirty
//			, autogenFromClass: true
		};
	};

	this.toString = function(){
		return JSON.stringify(this.toJSON());
	};

	//méthodes utilitaires réseau (non ORM)
	//fn:FACTORY
	this.wsPost = function(final){

		//préparation des données à envoyer
		var _data = this.toJSON();
		delete _data.id;

		//envoi des données dans le service
		$.post(
			Config.getWsUrl('cars')
			, _data
		).then(function(car){
			this.id = car.id;
			if(final){final(this);}
		});
	};
}
//fn:FACTORY
//méthode statique = de classe = méthode utilitaire de la classe
Car.wsGet = function(final,settings){
	var _url = Config.getWsUrl('cars',settings);
	$.get(_url
		,function(data)
		{
			final(
				data.map(
					function(car)
					{
						return new Car(car);
					}
				)
			);
		}
	);
};

function testCar(){
	"use strict";
	var _c1 = new Car();
	console.log(_c1);
	console.log(_c1.toJSON());

	var _cToSave = new Car(
		{
			idBrand: 2
			, name: 'Aventador'
			, price: 1899.99
			, priceLongTime: 699.99
		}
	);
//	_cToSave.wsPost(function(car){console.log(car.id);});

	Car.wsGet(function(cars){console.log(cars);});//toutes
	Car.wsGet(
		function(car){console.log(car);}
		,1
	);//voiture id=1
	Car.wsGet(
		function(cars){console.log(cars);}
		,{idBrand:2}
	);//voitures idBrand=2
}
//testCar();