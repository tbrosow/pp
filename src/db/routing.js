var express = require('express');
var router = express.Router();
var User = require('./user');

router.options
// router.post('*', function (req, res, next) {
//     console.log("/POST USER: ")
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
//     res.setHeader('Access-Control-Allow-Credentials', true); // If neededres.send('upd')
// });

router.put('*', function (req, res, next) {
    console.log("/PUT USER: " + JSON.stringify(req.body))
    User.update({_id: req.body._id}, req.body, function (error, record) {
        if (error) {
            console.log(error);
            res.send({updated:false, error:error})
        } else {
            console.log("/updateGame: " + JSON.stringify(record))
            res.send({updated:true})
        }
    });
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
        res.send(results)

    });


})
module.exports = router;