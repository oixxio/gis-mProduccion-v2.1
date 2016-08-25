(function () {
    'use strict';

    angular.module('app.mapaprod', ['ngRoute','ngMaterial'])
    .config(function($mdIconProvider, $mdThemingProvider){  

		$mdIconProvider
			.icon("arrow-right", "assets/svg/ic_keyboard_arrow_right_black_24px.svg", 24)
			.icon("file", "assets/svg/ic_insert_drive_file_black_24px.svg", 24)
			.icon("map-pin", "assets/svg/ic_place_black_24px.svg", 24)
			.icon("empleo", "assets/svg/work.svg", 48)
			.icon("exportacion", "assets/svg/economy.svg", 48)
			.icon("salario", "assets/svg/hand-holding-up-a-sack-of-money.svg", 48)
			.icon("pbg", "assets/svg/growing-markets.svg", 48);

		$mdThemingProvider.definePalette('black', {
			'50': '000000',
			'100': '000000',
			'200': '000000',
			'300': '000000',
			'400': '000000',
			'500': '000000',
			'600': '000000',
			'700': '000000',
			'800': '000000',
			'900': '000000',
			'A100': '000000',
			'A200': '000000',
			'A400': '000000',
			'A700': '000000',
			'contrastDefaultColor': 'light'
		});

		$mdThemingProvider.definePalette('white', {
			'50': 'ffffff',
			'100': 'ffffff',
			'200': 'ffffff',
			'300': 'ffffff',
			'400': 'ffffff',
			'500': 'ffffff',
			'600': 'ffffff',
			'700': 'ffffff',
			'800': 'ffffff',
			'900': 'ffffff',
			'A100': 'ffffff',
			'A200': 'ffffff',
			'A400': 'ffffff',
			'A700': 'ffffff',
			'contrastDefaultColor': 'dark'
		});
		
		$mdThemingProvider.definePalette('gray-custom', {
			'50': 'f1f2f2',
			'100': 'f1f2f2',
			'200': 'f1f2f2',
			'300': 'f1f2f2',
			'400': 'f1f2f2',
			'500': 'f1f2f2',
			'600': 'f1f2f2',
			'700': 'f1f2f2',
			'800': 'f1f2f2',
			'900': 'f1f2f2',
			'A100': 'f1f2f2',
			'A200': 'f1f2f2',
			'A400': 'f1f2f2',
			'A700': 'f1f2f2',
			'contrastDefaultColor': 'dark'
		});

		$mdThemingProvider.theme('default')
			.primaryPalette('white')
			.accentPalette('indigo');

		$mdThemingProvider.theme('secondary')
			.primaryPalette('indigo');			

	});

})();
