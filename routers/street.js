var express = require('express');
var Street = require('../models/street');

const moment = require('moment-timezone');
const street = require('../models/street');
const dateIndonesia = moment.tz(Date.now(), "Asia/Jakarta");

var streetRouter = express.Router();

streetRouter
  .route('/street')
  .post(function (request, response) {

    console.log('POST /street');

    var street = new Street(request.body);

    street.save(function(error){
      if(error) response.json(error);
      else response.status(200).send(street);
    });
  })

streetRouter
  .route('/street/count')
  .post(function(req, resp) {

    console.log('POST /street/count');

    var today = new Date;
    today.setHours(today.getHours() + 7);

    var counting = {
      motorcycle: req.body.motorcycle,
      car: req.body.car,
      truck: req.body.truck,
      bus: req.body.bus,
      time: today
    };

    const date = new Date;
    console.log(date);

    const condition = counting.motorcycle * 1 +
                        counting.car * 2 +
                        counting.truck * 3 +
                        counting.bus * 4;

    var status = 0

    Street.findOneAndUpdate(
      { name: req.body.streetName },
      { $push: { counts: counting }},
      { safe: true, upsert: true },
      function(err, resp2) {    
          if(err) resp.json(err);
          else {
            resp.status(200).send(resp2);

            if(condition > resp2.limit.danger)
              status = 2
            else if(condition > resp2.limit.warning) 
              status = 1
            else
              status = 0

            Street.findOneAndUpdate(
              { name: req.body.streetName },
              { $set: { latestCounting: counting}},
              { safe: true, upsert: true},
              function(err, resp2){
                
                if(resp2.latestCondition.status != status) {
            
                  var conditionDoc = {
                    motorcycle: req.body.motorcycle,
                    car: req.body.car,
                    truck: req.body.truck,
                    bus: req.body.bus,
                    time: Date.now(),
                    status: status,
                  };
                  
                  Street.findOneAndUpdate(
                    { name: req.body.streetName },
                    { $push: { conditions: conditionDoc }},
                    { safe: true, upsert: true}, 
                    function(err, resp2) {
                      Street.findOneAndUpdate(
                        { name: req.body.streetName },
                        { $set: { latestCondition: conditionDoc}},
                        { safe: true, upsert: true},
                        function(err, resp2){

                        }
                      )
                    }
                  )
                }
              }
            )
          }
      });
  })

streetRouter
  .route('/street/all/count/now')
  .post(function (req, resp) {

    console.log('POST /street/all/count/now');

    var streets = [];

    street.find(
      {},
      function(err, resp2) {
        if(err) resp.status(400).send(err)
        else {
          resp2.forEach(function(street) {
            streets.push({
              'name': street['name'],
              'count': street['latestCounting']
            });
          })

          resp.status(200).send(streets)
        }
      }
    );
  })

streetRouter
  .route('/street/all/condition')
  .post(function (req, resp) {

    console.log('POST /street/all/condition');

    var streets = [];

    street.find(
      {},
      function(err, resp2) {
        if(err) resp.status(400).send(err)
        else {
          var conditions = []
          
          resp2.forEach(function(street) {
            street.conditions.forEach(function(condition){
              conditions.push({
                name: street.name,
                motorcycle: condition.motorcycle,
                car: condition.car,
                truck: condition.truck,
                bus: condition.bus,
                time: condition.time,
                status: condition.status,
              })
            })
          })

          conditions.sort((a,b) => b.date - a.date)

          resp.status(200).send(conditions)
        }
      }
    );
  })

streetRouter
  .route('/street/count/now')
  .post(function(req, resp) {
      
    console.log('POST /street/count/now')

    Street.findOne(
      { name: req.body.streetName },

      function(err, resp2) {
        if(err) resp.send(err);
        else {
          var counting = {
            motorcycle: 0,
            car: 0,
            truck: 0,
            bus: 0,
          }
          if(resp2==null)
            resp.status(200).send(counting)
          else
            resp.status(200).send(resp2.latestCounting)
        };
      }
    )  
  })

streetRouter
  .route('/street/count/day')
  .post(function(req, resp) {

    console.log('POST /street/count/day')

    const today = new Date();
    today.setHours(7,0,0,0);

    const tomorrow = new Date();
    tomorrow.setHours(48,0,0,0);

    console.log(today + "-" + tomorrow)

    Street.aggregate(
      { $match: { 'name' : req.body.streetName } },
  
      // This will create an 'intermediate' document for each track

      { $project : {
        '_id': 1,
        "counts": {
          "$setDifference": [
              { "$map": {
                  "input": "$counts",
                  "as": "c",
                  "in": { "$cond": [
                      { "$gte": [ "$$c.time", today ], },
                      "$$c",
                      false
                  ]}
              },},
              [false]
          ]
      } 
      }},
      { $sort : { 'counts.time':-1 }},  
    ).exec(function(err, resp2) {
      if(err) resp.json(err);
      else resp.status(200).send(resp2);
    });
  })

module.exports = streetRouter;