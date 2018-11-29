var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./user');
var ListLayout = require('./ListLayout');

router.options
// router.post('*', function (req, res, next) {
//     console.log("/POST USER: ")
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
//     res.setHeader('Access-Control-Allow-Credentials', true); // If neededres.send('upd')
// });

router.put('2222', function (req, res, next) {
    console.log("/PUT USER: " + JSON.stringify(req.body))
    User.update({_id: req.body._id}, req.body, function (error, record) {
        if (error) {
            console.log(error);
            res.send({updated:false, error:error})
        } else {
            console.log("/updateGame: " + JSON.stringify(record))
            User.find({_id: req.body._id}, function(err, results) {
                if (error) {
                    console.log(error);
                }
                res.send(results)
            })

        }
    });
});

router.put('/save', function (req, res, next) {
    console.log("/save: ")
    console.log("/collection: " + req.query.collection)
    console.log("/id: " + req.body._id)
    console.log("/save: " + JSON.stringify(req.body))
    mongoose.model(req.query.collection).update({_id: req.body._id}, req.body, function (error, record) {
        if (error) {
            console.log(error);
            res.send({updated:false, error:error})
        } else {
            console.log("/save: " + JSON.stringify(record))
            mongoose.model(req.query.collection).find({_id: req.body._id}, function(err, results) {
                if (error) {
                    console.log(error);
                }
                res.send(results)
            })

        }
    })
});

router.post('/user', function (req, res, next) {
    console.log("/POST USER: " )
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    console.log("/POST USER: " + JSON.stringify(req.body))
    res.send('upd1')
});

router.get('/query', function (req, res, next) {
    console.log("/params: " + req.query.collection)
    let query = {};
    if (req.query.query) {
        try {
            query = JSON.parse(req.query.query)
            console.log("/query: " + JSON.stringify(query))
        } catch (e) {
            res.send({error: true, msg: e})
        }
    }
    if (req.query.collection) {
        mongoose.model(req.query.collection).find(query, function (error, record) {
            if (error) {
                console.log(error)
                res.send({error: true, msg: error})
            } else {
                console.log("/ListLayout: " + JSON.stringify(record, null, 2))
                res.send(record)
            }
        })
    } else {
        res.send({error: true})
    }
});

router.get('/test', function (req, res, next) {

    mongoose.model('ListLayout').find({}, function (error, record) {
        if (error)
            console.log(error)
        console.log("/ListLayout: " + JSON.stringify(record))
    })

    let fields = [
        {name:"email", label:"Email Address", order:1, datatype: "Text"},
        {name:"name", label:"Name", order:2, datatype: "Text"},
        {name:"active", label:"Active", order:3, datatype: "Checkbox"},
        {name:"_id", label:"ID", order:4, datatype: "ID"}
    ];
    ListLayout.create({coll:"user", fields:fields}, function (error, record) {
        if (error)
            console.log(error)
        console.log("/: " + JSON.stringify(record))
        res.send(JSON.stringify(record))
    });
});

router.get('/user', function (req, res, next) {

    console.log("/user")
    console.log("/params: " + req.query.query)
    console.log("/params: " + JSON.stringify(req.query))

    let query = {};

    console.log("/QUERY: " + JSON.stringify(query))
    try {


        //if (req.query.query !== undefined) {
        query = JSON.parse(req.query.query);
        console.log(typeof query)
    } catch (e) {
        console.log("/QUERY: " +e)
    }
    console.log("/QUERY: " + JSON.stringify(query))

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let users = [
        {
            "user_name": "MerweA",
            "name": "Andre Merwe",
            "email": "andre.merwe@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "AzzopaB",
            "name": "Brett Azzopardi",
            "email": "brett.azzopardi@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "Faraz.Hussain@valueflow.com.au",
            "name": "Faraz Hussain",
            "email": "Faraz.Hussain@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "WhiteI",
            "name": "Ian White",
            "email": "Ian.White@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "james.mcilwain@valueflow.com.au",
            "name": "James Mcilwain",
            "email": "james.mcilwain@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "KellyJ",
            "name": "John Kelly",
            "email": "john.kelly@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "johnny.chong@valueflow.com.au",
            "name": "Johnny Chong",
            "email": "johnny.chong@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "EasteyL",
            "name": "Liam Eastey",
            "email": "liam.eastey@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "luke.kelly",
            "name": "Luke Kelly",
            "email": "luke.kelly@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "luke.sorensen",
            "name": "Luke Sorensen",
            "email": "Luke.Sorensen@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "HanssenM",
            "name": "Max Hanssen",
            "email": "Max.Hanssen@valueflow.com.au",
            "active": false
        },
        {
            "user_name": "DuongN",
            "name": "Nguyen Duong",
            "email": "nguyen.duong@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "VF.Test.Portfolio.Coordinator",
            "name": "Portfolio Coordinator",
            "email": "VF.Test.Portfolio.Coordinator@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "VF.Test.Portfolio.Lead",
            "name": "Portfolio Lead",
            "email": "vfPortfolioLead@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "VF.Test.Portfolio.Office",
            "name": "Portfolio Office",
            "email": "VF.Test.Portfolio.Office@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "VF.Test.Program.Manager",
            "name": "Program Manager",
            "email": "VF.Test.Program.Manager@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "VF.Test.Project.User",
            "name": "Project  User",
            "email": "VF.Test.Project.User@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "VF.Test.Project.Manager",
            "name": "Project Manager",
            "email": "VF.Test.Project.Manager@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "PurdieR",
            "name": "Roger Purdie",
            "email": "Roger.Purdie@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "Test7zT",
            "name": "Test7y Test7z",
            "email": "Test7y@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "torsten.brosow@valueflow.com.au",
            "name": "Torsten Brosow",
            "email": "torsten.brosow@valueflow.com.au",
            "active": true
        },
        {
            "user_name": "vf.test.branch.user",
            "name": "VF Test Branch User",
            "email": "vf.test.user@valueflow.com.au",
            "active": true
        }
    ]
    // User.create(users, function (error, user) {
    //     if (error)
    //         console.log(error)
    //     console.log("/: " + JSON.stringify(user))
    // });
    User.find(query, function(err, results) {
        console.log("/user: " + JSON.stringify(results))
        res.send(results)

    });


})
module.exports = router;