import DS from 'ember-data';
//import Store from 'simple-auth/stores/base';

// export default DS.FixtureAdapter.extend({
// 	queryFixtures: function(records, query) {
//         console.dir(records);
//         console.dir(query);
//         return records.filter(function(record) {
//             for(var key in query) {
//                 if (!query.hasOwnProperty(key)) { continue; }
//                 var value = query[key];
//                 if (record[key] !== value) { return false; }
//             }
//             return true;
//         });
//     }
// });

export default DS.RESTAdapter.extend({
    host: 'http://dev.truecron.com:3000',
    namespace: 'api/v1',
    headers: function() {
        console.log('populate request headers');
        //var sessionData = Store.restore();
        var access_token = this.get("session.access_token");
        console.dir('session data : ' + access_token);
        if (access_token) {
            return {
                "Authorization": "Bearer " + this.get("session.access_token")
            };
        } else {
            return {};
        }
    }.property('session.access_token')
});