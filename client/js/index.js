/*
 * client/js/index.js
 */

'use strict';

// Load dependencies.
require('angular.translate');
require('angular.ui');
require('bootstrap');
require('jquery.center');
require('jquery.spin');
require('restangular');

// Register modules.
require('./account');
require('./admin');
require('./auth');
require('./layout');
require('./main');
require('./shared');
require('./pumpdata');

// Register app.
require('./app');