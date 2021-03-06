/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  name: require('./package.json').name,
  minifyCSS: {
    enabled: false,
    options: {}
  },
  gzip: {
    enabled: false,
    keepUncompressed: true
  },
  'ember-cli-selectize': {
    //valid values are `default`, `bootstrap2`, `bootstrap3` or false
    'theme': 'bootstrap3'
  }
});

// css
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', { destDir: "assets"});
//app.import('bower_components/bootstrap/dist/css/bootstrap-theme.css');
//app.import('bower_components/bootstrap/dist/css/bootstrap-theme.css.map', { destDir: "assets"});
app.import('bower_components/bootstrap-material-design/dist/css/roboto.css');
app.import('bower_components/bootstrap-material-design/dist/css/roboto.css.map', { destDir: "assets"});
app.import('bower_components/bootstrap-material-design/dist/css/material-fullpalette.css');
app.import('bower_components/bootstrap-material-design/dist/css/material-fullpalette.css.map', { destDir: "assets"});
app.import('bower_components/bootstrap-material-design/dist/css/ripples.css');
app.import('bower_components/bootstrap-material-design/dist/css/ripples.css.map', { destDir: "assets"});
app.import('bower_components/bootstrap-material-design/dist/fonts/Material-Design-Icons.eot', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/Material-Design-Icons.svg', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/Material-Design-Icons.ttf', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/Material-Design-Icons.woff', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftMedium.woff', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftMedium.woff2', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftItalic.woff', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftItalic.woff2', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftBold.woff', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftBold.woff2', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftRegular.woff', { destDir: "fonts"});
app.import('bower_components/bootstrap-material-design/dist/fonts/RobotoDraftRegular.woff2', { destDir: "fonts"});
app.import('bower_components/font-awesome/css/font-awesome.min.css');
//app.import('bower_components/font-awesome/fonts/fontawesome-webfont.eot', { destDir: "fonts"});
//app.import('bower_components/font-awesome/fonts/fontawesome-webfont.svg', { destDir: "fonts"});
//app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', { destDir: "fonts"});
//app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff', { destDir: "fonts"});
//app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff2', { destDir: "fonts"});
app.import('bower_components/selectize/dist/css/selectize.css');
app.import('bower_components/selectize/dist/css/selectize.default.css');
//app.import('bower_components/selectize/dist/css/selectize.bootstrap3.css');
app.import('bower_components/sweetalert/lib/sweet-alert.css');

// js
app.import('bower_components/jquery/dist/jquery.js');
//app.import('bower_components/jquery-ui/jquery-ui.js');
app.import('bower_components/JavaScript-MD5/js/md5.js');
app.import('bower_components/socket.io-client/socket.io.js');
app.import('bower_components/bootstrap/dist/js/bootstrap.js');
app.import('bower_components/selectize/dist/js/selectize.js');
app.import('bower_components/arrive/minified/arrive.min.js');
app.import('bower_components/bootstrap-material-design/dist/js/material.js');
app.import('bower_components/bootstrap-material-design/dist/js/ripples.js');
//app.import('bower_components/ember-data/ember-data.min.js');
app.import('bower_components/rrule/lib/rrule.js');
app.import('bower_components/rrule/lib/nlp.js');
app.import('bower_components/moment/min/moment.min.js');
app.import('bower_components/moment-timezone/builds/moment-timezone-with-data.js');
app.import('bower_components/validator-js/validator.min.js');
app.import('bower_components/sweetalert/lib/sweet-alert.js');
app.import('bower_components/ember-data.model-fragments/dist/ember-data.model-fragments.js');
app.import('bower_components/moment-range/lib/moment-range.bare.min.js');
app.import('bower_components/moment-range/lib/moment-range.min.js');

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
