/*global
  $, window, console
*/
/*jslint
  white, this, single, browser
*/
function showPage(data,title,final) {
	"use strict";
	$('main>div.container').first().html(data);
	$('h1').text(title);
	$('title').text(title);
	if(final){final(data);}
}
function loadPage(url,title,final) {
	"use strict";
//	$.get(url,showPage(data,'coucou'));//PAS BIEN !
	$.get(url,function(data){showPage(data,title,final);});
}
function carsToHTMLTable(cars,template){
	"use strict";
	var _brands = window.localStorage.getItem('brands').toJSON();
	var _html = cars.map(function(car){
		var _brandName = _brands.filter(function(brand){
			return brand.id == car.idBrand;
		})[0].name;
		return template
			.replace('{{name}}',car.name)
			.replace('{{idBrand}}',car.idBrand)
			.replace('{{brandName}}',_brandName)
			.replace('{{price}}',car.price)
			.replace('{{age}}', (new Date()).getFullYear() - car.year);
	}).join('');
	$('.cars tbody').html(_html);
}
function gererMenu(ev) {
	"use strict";

	//stop l'événement HTML
	ev.preventDefault();

	//gérer la couleur du lien actif
	$('.active').removeClass('active');
	$(this).parent().addClass('active');

	//gérer le lecteur aural
	$('a>span.sr-only').remove();
	$(this).append('<span class="sr-only">(menu courant)</span>');

	//charger la page
	var _url = $(this).attr('data-metro-url') || 'index-fragment.html';
	var _resource = $(this).attr('data-metro-resource');
	var _title = $(this).attr('data-metro-title') || 'MetroCars';

	if( !_resource){
		loadPage( _url, _title);
	} else {
		loadPage( _url, _title, function(){
			$.get(
				Config.getWsUrl(_resource)
				, function(cars){
					var _template = $('.cars tbody').html();
					carsToHTMLTable(cars,_template);
				}
			);
		});
	}
	
}
function loadByBrand(ev){
	"use strict";

	//pour ne pas suivre le lien
	ev.preventDefault();

	//pour mettre le lien actif (bleu)
	$('#menu .brand.active').removeClass('active');
	$(this).addClass('active');

	//ACTION
	var _idBrand = $(this).attr('data-metro-brand-id').toNumber();
	Car.wsGet(
		function(cars){
			loadPage(
				'voitures-fragment.html'
				,'Voitures de la marque : ' + _idBrand
				,function(){
					var _html = $('.cars tbody').html();
					carsToHTMLTable(cars,_html);
				}
			);
		}
		, {idBrand:_idBrand}
	);
}
function menuBrands(){
	"use strict";

	//pour les besoins du Clouding en attendant le dev de la resource "brands"
//	$.get(Config.getWsUrl('brands'),function(brands){
		brands = BRANDS;
		
		//marques triées
		var _brands = brands
			.sort(
				function(a,b)
				{
//					return +(a.name.toLowerCase() > b.name.toLowerCase()); //OLD BEE
					var _compare = a.name.toLowerCase() > b.name.toLowerCase();
					return _compare.toNumber(); //OLD BEE
				}
			);

		//sauvegarde en localStorage
		window.localStorage.setItem('brands',_brands.toString());

		//fabrication du menu HTML
		var _html = _brands
			.map(function(brand){
				return '<a class="dropdown-item brand" href="#" data-metro-brand-id="'
					+brand.id+'">'
					+brand.name+'</a>';
			})
			.join('');
		$('div.dropdown-menu').append(_html);

		//gestion du click sur les brands
		$('#menu .brand').click( loadByBrand);

//	});//clouding
}
//avec PROMISE
function loadDirty(ev){
	"use strict";
	ev.preventDefault();
	Promise.all(
		[
			$.get('dirty-view.html')
			, $.get(Config.getWsUrl('cars',{dirty:true}))
			, $.get(Config.getWsUrl('brands'))
		]
	).then(
		function(responses){
			var _template = responses[0];
			var _cars = responses[1];
			var _brands = responses[2];
			var _html = _cars.map(function(car){
				return _template.replace('{{id}}',car.id)
					.replace('{{name}}',car.name)
					.replace('{{brandName}}',_brands.filter(
						function(brand){
							return brand.id == car.idBrand
						}
					)[0].name)
					.replace('{{price}}',car.price);
			}).join('');
			$('main>div.container').first().html(_html);
		}
	);
}
function init(){
	"use strict";
//	window.alert('PSG PSG PSG ... PSG PSG PSGEEEE !');
	$('a.navigate').click(gererMenu);
	loadPage('index-fragment.html','MetroCars !!!');
	menuBrands();
	$('#menuDirty').click(loadDirty);
}
$(document).ready(init);