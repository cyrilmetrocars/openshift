/*global
  $, window, console
*/
/*jslint
  white, this, single, browser
*/
"use strict";

function showPage(data,title='MetroCars',final=function(){}) {
	$('main>div.container').first().html(data);
	$('h1').text(title);
	$('title').text(title);
	if(final){final(data);}
}
function loadPage(url='index-fragment.html',title,final) {
	$.get(url, data => showPage(data,title,final));
}
function carsToHTMLTable(cars,template){

	var _brands = window.localStorage.getItem('brands').toJSON();

	let _html = cars.map( car => {
		var _brandName = _brands.filter( brand => {
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

	//stop l'événement HTML
	ev.preventDefault();

	//gérer la couleur du lien actif
	$('.active').removeClass('active');
	$(this).parent().addClass('active');

	//gérer le lecteur aural
	$('a>span.sr-only').remove();
	$(this).append('<span class="sr-only">(menu courant)</span>');

	//charger la page
	var _url = $(this).attr('data-metro-url');
	let _resource = $(this).attr('data-metro-resource');
	var _title = $(this).attr('data-metro-title');

	if( !_resource){
		loadPage( _url, _title);
	} else {
		loadPage( _url, _title, function(){
			$.get(
				Config.getWsUrl(_resource)
				, cars => {
					var _template = $('.cars tbody').html();
					carsToHTMLTable(cars,_template);
				}
			);
		});
	}
	
}
function loadByBrand(ev){

	//pour ne pas suivre le lien
	ev.preventDefault();

	//pour mettre le lien actif (bleu)
	$('#menu .brand.active').removeClass('active');
	$(this).addClass('active');

	//ACTION
	var _idBrand = $(this).attr('data-metro-brand-id').toNumber();
	Car.wsGet(
		cars => {
			loadPage(
				'voitures-fragment.html'
				,'Voitures de la marque : ' + _idBrand
				,() => {
					var _html = $('.cars tbody').html();
					carsToHTMLTable(cars,_html);
				}
			);
		}
		, {idBrand:_idBrand}
	);
}
function menuBrands(){

	$.get(Config.getWsUrl('brands'), brands => {

		//marques triées
		let _brands = brands
			.sort(
				(a,b) =>
				{
//					return +(a.name.toLowerCase() > b.name.toLowerCase()); //OLD BEE
					var _compare = a.name.toLowerCase() > b.name.toLowerCase();
					return _compare.toNumber(); //OLD BEE
				}
			);

		//sauvegarde en localStorage
		window.localStorage.setItem('brands',_brands.toString());

		//fabrication du menu HTML
		let _html = _brands
			.map( brand => {
				return `<a class="dropdown-item brand" href="#" data-metro-brand-id="${brand.id}">${brand.name}</a>`;
			})
			.join('');
		$('div.dropdown-menu').append(_html);

		//gestion du click sur les brands
		$('#menu .brand').click( loadByBrand);

	});
}
//avec PROMISE
function loadDirty(ev){

	ev.preventDefault();

	Promise.all(
		[
			$.get('dirty-view.html')
			, $.get(Config.getWsUrl('cars',{dirty:true}))
			, $.get(Config.getWsUrl('brands'))
		]
	).then(
		responses => {
			var _template = responses[0];
			var _cars = responses[1];
			var _brands = responses[2];
			var _html = _cars.map( car => {
				return _template.replace('{{id}}',car.id)
					.replace('{{name}}',car.name)
					.replace('{{brandName}}',_brands.filter(
						brand => {
							return brand.id == car.idBrand
						}
					)[0].name)
					.replace('{{price}}',car.price);
			}).join('');

			$('main>div.container').first().html(_html);
		}
	);
}
String.prototype.addToto = function(){
	return this + ' toto';
}
function init(){
	$('a.navigate').click(gererMenu);
	loadPage();
	menuBrands();
	$('#menuDirty').click(loadDirty);
	// console.log(`${"coucou".addToto()}`);
	// `${alert('coucou')}`;
}
$(document).ready(init);