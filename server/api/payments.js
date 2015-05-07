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
    // List of payments
    //
    .get(common.parseListParams, function (req, res, next) {
        console.log('!!!!!111');
        if (!req.organizationId) {
            return next(new apiErrors.InvalidParams('Organization ID is not specified.'));
        }
        var where = { };
        if (req.listParams.searchTerm) {
            where = _.merge(where, { date: { like: req.listParams.searchTerm } });
        }
        var sort = req.listParams.sort || 'date';

        storage.Payments.findAndCountAll(req.context, req.organizationId, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
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

            };

            processNextItem(0);
        });
    })

    //
    // Create a new payment
    //

    .post(function (req, res, next) {
        console.log('!!!!!1');
        if (!req.body || !req.body.payment) {
            return next(new apiErrors.InvalidParams('Payment is not specified.'));
        }
        var organizationId = req.organization ? req.organization.id : req.body.payment.organizationId;
        console.log('!!!!!2');
        if (!organizationId) {
            console.log('!!!!!3');
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        storage.Organization.findById(req.context, organizationId)
            .then(function (organization){
                if(!organization){
                    console.log('!!!!!4');
                    return next(new apiErrors.InvalidParams('Invalid organization specified.'));
                }
                req.body.payment.organizationId = organization.organizationId;
                console.log('!!!!!5');
                storage.Payments.create(req.context, req.payment)
                    .then(function (payment) {
                        console.log('!!!!!6');
                        res.status(201).json({ payment: payment });
                    })
                    .catch(function (err) {
                        logger.error(err.toString());
                        return next(err);
                    });
            })
    });

module.exports = api;