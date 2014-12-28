import Ember from 'ember';
// app/torii-adapters/application.js
//
// Here we will presume the store has been injected onto torii-adapter
// factories. You would do this with an initializer, e.g.:
//
// application.inject('torii-adapter', 'store', store:main');
//
export default Ember.Object.extend({

  // The authorization argument passed in to `session.open` here is
  // the result of the `torii.open(providerName)` promise
  open: function(authorization){
    console.log('open authorization provider');
    console.dir(authorization);
    var userId = authorization.user,
        store  = this.get('store');
    return store.find('user', userId).then(function(user){
      return {
        currentUser: user
      };
    });
  }
});