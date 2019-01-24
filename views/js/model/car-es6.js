"use strict";

class Car {

	constructor(settings = {
		id: 0
		, idBrand: 1
		, name: 'Voiture'
		, preis
		, prix
		, price: preis || prix || 29.99
		, preisLongTime
		, prixLongTime
		, priceLongTime: preisLongTime || prixLongTime || price
		, year: (new Date()).getFullYear()
		, stock: dispo || 1
		, desc: 'Sans doute la meilleure voiture du monde !'
		, dirty: false
	}){

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
		this.dirty = !!settings.dirty;

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
			return _idBrand;
		};
		this.sgIdBrand(settings.idBrand);
	}

	//setters / getters
	get idBrand() {
		return this.sgIdBrand();
	}

	set idBrand(idBrand) {
		this.sgIdBrand(idBrand);
	}


	//méthodes utilitaires
	toJSON(){
		return {
			id: this.id
			, idBrand: this.sgIdbrand()
			, name: this.name
			, price: this.price
			, priceLongTime: this.priceLongTime
			, year: this.year
			, stock: this.stock
			, desc: this.desc
			, dirty: this.dirty
		};
	}

	toString(){
		return JSON.stringify(this.toJSON());
	}

	//méthodes utilitaires réseau (non ORM)
	//fn:FACTORY
	wsPost(final){

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
	}
}

Car.wsGet = (final,settings) => {
	var _url = Config.getWsUrl('cars',settings);
	$.get(_url
		,data => {
			final(
				data.map(
					car => {
						return new Car(car);
					}
				)
			);
		}
	);
};
