import DS from 'ember-data';
import ENV from 'true-cron/config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.APP.SERVER_HOST,
  namespace: 'api/v1',
  findHasMany: function(store, snapshot, url) { //relationship
    var host = this.get('host');
    var namespace = this.get('namespace');
    var id   = snapshot.id;
    var type = snapshot.typeKey;

    if (host && url.charAt(0) === '/' && url.charAt(1) !== '/') {
      url = host + '/' + namespace + url;
    }
    var reqBuildUrl = this.buildURL(type, id, null, 'findHasMany');
    var reqUrl = this.urlPrefix(url, reqBuildUrl);
    return this.ajax(reqUrl, 'GET');
  }
});
