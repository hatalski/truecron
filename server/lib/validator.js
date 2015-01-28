var expressValidator = require('express-validator');

var validator = expressValidator.validator;

validator.extend('isLess', function (str, value) {
    return str < value;
});

validator.extend('isLessOrEqual', function (str, value) {
    return str <= value;
});

validator.extend('isGreater', function (str, value) {
    return str > value;
});

validator.extend('isGreaterOrEqual', function (str, value) {
    return str >= value;
});

validator.extend('isInRange', function (str, lbound, ubound) {
    return (lbound <= str) && (str <= ubound);
});

module.exports = validator;
module.exports.expressValidator = expressValidator;