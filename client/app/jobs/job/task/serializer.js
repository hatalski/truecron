import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  typeForRoot: function(root) {
    // 'response-fast-car' should become 'fast-car'
    debugger;
    var subRoot = root.substring(9);

    // _super normalizes 'fast-car' to 'fastCar'
    return this._super(subRoot);
  }
});
