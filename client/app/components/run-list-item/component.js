import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'tr',
    date: function() {
        "use strict";
        var d = this.get('item.startedAt');
        return moment(d).format('MMM D hh:mm A');
    }.property('item.startedAt'),
    duration: function() {
        "use strict";
        return moment.duration(this.get('item.elapsed')).asSeconds() + 's';
    }.property('item.elapsed')
});
