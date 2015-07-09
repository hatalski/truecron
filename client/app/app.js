/* global swal */
import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver,
  ready: function () {
    var language = navigator.language || navigator.browserLanguage;
    this.intl.set('locales', [language, 'en']);
    Ember.$.material.init();
    swal.setDefaults({ confirmButtonColor: '#66bb6a' });
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
