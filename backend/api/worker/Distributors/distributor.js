/**
 * Created by estet on 11/30/14.
 */

var Distributor = function()
{
    this.init();
    this.isTest = true;
};

Distributor.prototype.init = function()
{
    console.log('init');
    this.outPut = [];
};

Distributor.prototype.send = function(message) {

    if(this.isTest) {
        this.outPut.push(message);
        console.log('Distributor received: ' + message);
    }
    else {
        throw new Error('Distributor needs to have send() defined.');
    }
};

module.exports = Distributor;