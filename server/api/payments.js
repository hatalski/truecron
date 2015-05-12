/**
 * Created by Andrew on 05.05.2015.
 */

var express = require('express'),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
    common = require('./common');

var api = express.Router();

api.route('/payments')
    //
    // Create a new payment
    //

    .post(function (req, res, next) {
        if (!req.body || !req.body.payment) {
            return next(new apiErrors.InvalidParams('Payment is not specified.'));
        }
        var organizationId = req.organization ? req.organization.id : req.body.payment.organizationId;
        if (!organizationId) {
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        storage.Organization.findById(req.context, organizationId)
            .then(function (organization){
                if(!organization){
                    return next(new apiErrors.InvalidParams('Invalid organization specified.'));
                }
                //req.body.payment.organizationId = organization.organizationId;
                storage.Payments.create(req.context, req.body.payment)
                    .then(function (payment) {
                        res.status(201).json({ payment: payment });
                    })
                    .catch(function (err) {
                        logger.error(err.toString());
                        return next(err);
                    });
            })
    });

var organizationId = null;
api.param('organizationId', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid organization ID.'));
    }
    organizationId = id;
    next();
});





api.route('/payments/:organizationId')
    //
    // List of payments
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = { };
        if (req.listParams.searchTerm) {
            where = _.merge(where, { date: { like: req.listParams.searchTerm } });
        }
        var sort = req.listParams.sort || 'date';

        storage.Payments.findAndCountAll(req.context, organizationId, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            if (result == null) {
                next(new apiErrors.NotFound());
            }
            var maxIndexOnCurrentPage = req.listParams.offset + req.listParams.limit;
            var coountPayments = result.count > maxIndexOnCurrentPage ? maxIndexOnCurrentPage : result.count;

            var response = [];
            var complete = function(){
                res.status(200).json({
                    payments: response,
                    meta: {
                        total: result.count
                    }
                })
            };

            var processNextItem = function(index)
            {
                if(index >= coountPayments)
                {
                    complete();
                    return;
                }

                var allPayments = result.rows[index];

                response.push(allPayments ? allPayments : null);

                index++;
                processNextItem(index);

            };

            processNextItem(0);
        })
            .catch(function (err) {
                logger.error(err.toString());
                return next(err);
            });
    });

module.exports = api;