var apiErrors = require('./../../lib/errors'),
    validator = require('../../lib/validator');

module.exports.parseListParams  = function (req, res, next) {
    req.checkParams('offset', 'Invalid offset value.').optional().isInt().isGreaterOrEqual(0);
    req.checkParams('limit', 'Invalid limit value.').optional().isInt().isInRange(10, 100);
    req.checkParams('q', 'Invalid search query.').optional().isLength(0, 100);
    req.checkParams('sort', 'Invalid sort field.').optional().isLength(0, 30).isAlphanumeric();
    req.checkParams('direction', 'Invalid sort direction.').optional().isIn(['asc', 'desc']);

    var errors = req.validationErrors();
    if (errors) {
        return next(new apiErrors.InvalidParams(errors));
    }

    req.sanitize('offset').toInt();
    req.sanitize('limit').toInt();
    req.sanitize('q').trim();
    req.sanitize('sort').trim();
    req.sanitize('direction').trim();

    req.listParams = req.listParams || {};
    if (req.param('q')) {
        req.listParams.searchTerm = '%' + req.param('q').replace(/%/g, '%%') + '%';
    }
    req.listParams.offset = req.param('offset') || 0;
    req.listParams.limit = req.param('limit') || 30;
    req.listParams.sort = req.param('sort');
    req.listParams.direction = req.param('direction') || 'asc';
    return next();
};
