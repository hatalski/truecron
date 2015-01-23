var AWS = require('aws-sdk');
var cloudfront = new AWS.CloudFront();

// production E2T1C41858X5WT
// staging    E2UE4NJWYIP2WU

var distributionId = process.argv[2];

var d = new Date();
var timestamp = d.toISOString();

var params = {
    DistributionId: distributionId,
    InvalidationBatch: {
        CallerReference: timestamp,
        Paths: {
            Quantity: 1,
            Items: [
                '/index.html'
            ]
        }
    }
};

cloudfront.createInvalidation(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});