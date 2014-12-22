import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    host: 'http://dev.truecron.com:3000',
    namespace: 'api/v1',
    findHasMany: function(store, record, url) { //relationship
        var host = this.get('host');
        var namespace = this.get('namespace');
        var id   = this.get('id');
        var type = record.constructor.typeKey;

        if (host && url.charAt(0) === '/' && url.charAt(1) !== '/') {
          url = host + '/' + namespace + url;
        }
        var reqBuildUrl = this.buildURL(type, id);
        var reqUrl = this.urlPrefix(url, reqBuildUrl);
        return this.ajax(reqUrl, 'GET');
    }
});