/**
 * Created by estet on 12/2/14.
 */
var S3LogWritter = require('./s3LogWritter');


var logwritter = new S3LogWritter('test1');

logwritter.write("Line1");
logwritter.write("Line1");
logwritter.stop();
