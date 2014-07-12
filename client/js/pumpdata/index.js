/*
 * client/js/pumpdata/index.js
 */

 'use strict';

 var angular = require('angular'),
 	rhtml = require('rhtml');

 var ngModule = angular.module('app.pumpdata', []);

 // Controllers
 require('./controllers/_layout')(ngModule);
 require('./controllers/dashboard')(ngModule);

// Directives
require('./directives/pump-table')(ngModule);

 //Routes
 ngModule.config(function ($stateProvider) {
 	$stateProvider
 		.state('app.pumpdata', {
 			abstract: true,
 			url: '/pumpdata',
 			views: {
 				'@': {
 					controller: '_LayoutCtrl',
 					template: rhtml('./templates/_layout.html')
 				}
 			},
 			data: {
 				menuTitle: 'Pump Data'
 			}
 		})
 		.state('app.pumpdata.dashboard', {
 			url: '/dashboard',
 			controller: 'PumpDashboardCtrl',
 			template: rhtml('./templates/dashboard.html'),
 			data: {
 				title: 'Dashboard'
 			}
 		});
 });

 // Redirections
 ngModule.run(function (route) {
 	route.redirect({
 		'/pumpdata': 'app.pumpdata.dashboard'
 	});
 });

// Authorizations
ngModule.run(function (auth) {
  auth.authorize({
    'app.account': {
      allow: ['user']
    }
  });
});

