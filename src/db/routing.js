var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = require('./user');
var ListLayout = require('./ListLayout');
var FormLayout = require('./FormLayout');
var FormMenu = require('./FormMenu');
var group = require('./group');
let sequence = require('./sequence')
var task = require('./core');
var task = require('./task');
var dictionary = require('./dictionary');
var _ = require('lodash');

router.options
// router.post('*', function (req, res, next) {
//     console.log("/POST USER: ")
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
//     res.setHeader('Access-Control-Allow-Credentials', true); // If neededres.send('upd')
// });

let populate = [
    {path:'sys', schema:'core'},
    {path: 'sys', populate: { path: 'createdBy' }, schema:'user'},
    {path: 'sys', populate: { path: 'updatedBy' }, schema:'user'}
];

router.get('/query', function (req, res, next) {

    console.log("/query collection: [ " + req.query.collection + "] params: " + req.query.query)

    let limit = parseInt(req.query.limit) || 1000;
    let skip = parseInt(req.query.skip) || 0;


    let query = {};
    if (req.query.query) {
        try {
            query = JSON.parse(req.query.query)
            console.log("/query: " + JSON.stringify(query))
        } catch (e) {
            res.send({error: true, msg: e})
        }
    }
    if (req.query.ref) {
        try {
            let tmpList = JSON.parse(req.query.ref)
            tmpList.forEach(function (reff) {
                populate.push({path:reff.f, model:reff.m})
            })
            console.log("/query: populate" + JSON.stringify(populate, null, 2))
        } catch (e) {
            res.send({error: true, msg: e})
        }
    }
    if (req.query.wquery) {
        try {
            wquery = JSON.parse(req.query.wquery)
            console.log("/wquery: " + JSON.stringify(wquery))
            for( let key in wquery) {
                console.log("/wquery: [" + key + "] [" + wquery[key])
                query[key] = new RegExp(wquery[key],"i")
            }
        } catch (e) {
            res.send({error: true, msg: e})
        }
        //query = {name: new RegExp("e","i")}
    }

    console.log("/query: " + JSON.stringify(query, null, 4))
    if (req.query.collection) {
        mongoose.model(req.query.collection).count(query, function(error, count) {
            mongoose.model(req.query.collection).find(query, function (error, records) {
                if (error) {
                    console.log(error)
                    res.send({error: true, msg: error})
                } else {

                    console.log("/query: " + records.length + " " + req.query.collection)
                    console.log("/query: " + JSON.stringify(records, null, 2))
                    res.send({count:count, records: records})
                }
            })
                .limit(limit).skip(skip)
                .populate(populate)
        })

    } else {
        res.send({error: true})
    }
});

router.put('/formlayout', function (req, res, next) {
    console.log("/save: formlayout: [" + JSON.stringify(req.body) + "] ID: " + req.body._id)
    FormLayout.update({_id: req.body._id}, req.body, function (error, record) {
        if (error) {
            console.log("ERR" + error);
            res.send({updated: false, error: error})
        } else {
            console.log("/formlayout: OK " + JSON.stringify(record))
            res.send({status:"OK", record})
        }
    })
});

router.put('/save', function (req, res, next) {
    let populate = [
        {path:'sys', schema:'core'},
        {path: 'sys', populate: { path: 'createdBy' }, schema:'user'},
        {path: 'sys', populate: { path: 'updatedBy' }, schema:'user'}
    ];

    try {
        console.log("/save: collection: [" + req.query.collection + "] ID: " + req.body._id)
        console.log("/save: ReferenceID's: : " + req.query.ids)
        console.log("/save: collection: [" + req.query._id + "] IDs: " + req.body._id)
        try {
            let ids = JSON.parse(req.query.ids);

            ids.forEach(function (id) {
                req.body[id.field] = id.id
            })
        } catch (e) {

        }
        // if (req.query.ids);
        console.log("/save: " + JSON.stringify(req.body))
        mongoose.model(req.query.collection).update({_id: req.body._id}, req.body, function (error, record) {
            if (error) {
                console.log("ERR" + error);
                res.send({updated: false, error: error})
            } else {
                console.log("/save: OK " + JSON.stringify(record))
                mongoose.model(req.query.collection).find({_id: req.body._id}, function (err, results) {
                    if (error) {
                        console.log("ERR" + error);
                    }
                    if (results.length == 1)
                        res.send(results[0])
                    else
                        res.send("OK-NOTFOUND")
                }).populate(populate)
            }
        })
    } catch (e) {
        console.log("ERR" + e);
    }
});

router.delete('/delete', function (req, res, next) {
    try {
        console.log("/delete: collection: [" + req.query.collection + "] ID: " + req.body._id)
        console.log("/delete: " + JSON.stringify(req.body))
        mongoose.model(req.query.collection).remove({_id: req.body._id}, function (error, record) {
            if (error) {
                console.log("ERR" + error);
                res.send({status: "FAIL", error: error})
            } else {
                console.log("/delete: OK ")
                res.send({status:"OK"})
            }
        })
    } catch (e) {
        console.log("ERR" + e);
    }
});

function createRecord(req, res, next) {
    mongoose.model(req.query.collection).create(req.body, function (error, record) {
        if (error) {
            console.log("ERR" + error);
            res.send({status:"FAIL", created: false, error: error})
        } else {
            console.log("/create: OK " + JSON.stringify(record))
            mongoose.model(req.query.collection).find({_id: record._id}, function (err, results) {
                if (error) {
                    console.log("ERR" + error);
                }
                if (results.length == 1)
                    res.send({status:"OK", record:results[0]})
                    // res.send({status:"OK", record})
                else
                    res.send("OK-NOTFOUND")
            }).populate(populate)


        }
    })
}
function getSequece (req, res, next) {
    let seq = req.query.collection + '1';
    if (req.query.getnumber) {
        mongoose.model('sequence').find({coll: req.query.collection}, function (error, record) {
            if (error) {
                console.log(error)
                res.send({error: true, msg: error})
            } else {
                console.log("/SEQUENCE: " + record.length + " " + JSON.stringify(record, null, 2))
                if (record.length == 1) {
                    let lz = "0000000000000000000000000000000".substr(0,record[0].digits);
                    lz += String(record[0].sequence + 1)
                    lz = lz.slice(-record[0].digits);
                    seq = record[0].prefix + lz
                    req.body[req.query.getnumber] = seq;
                    record[0].sequence++;
                    mongoose.model('sequence').update({_id: record[0]._id}, record[0], function (error, record) {

                    })

                } else if (record.length == 0) {
                    req.body[req.query.getnumber] = seq;
                    mongoose.model('sequence').create({coll:req.query.collection, prefix: req.query.collection}, function (error, record) {
                    })
                }
                createRecord(req, res, next)
            }
        })
    } else {
        createRecord(req, res, next)
    }
    return 0;
}

router.post('/create', function (req, res, next) {
    try {
        console.log("/create: collection: [" + req.query.collection + "]")
        console.log("/create: " + JSON.stringify(req.body))
        getSequece(req, res, next)

    } catch (e) {
        console.log("ERR" + e);
    }
});

router.get('/query', function (req, res, next) {

    console.log("/query collection: [ " + req.query.collection + "] params: " + req.query.query)

    let limit = parseInt(req.query.limit) || 1000;
    let skip = parseInt(req.query.skip) || 0;

    let populate = [
        {path:'sys', schema:'core'},
        {path: 'sys', populate: { path: 'createdBy' }, schema:'user'},
        {path: 'sys', populate: { path: 'updatedBy' }, schema:'user'}
    ];

    let query = {};
    if (req.query.query) {
        try {
            query = JSON.parse(req.query.query)
            console.log("/query: " + JSON.stringify(query))
        } catch (e) {
            res.send({error: true, msg: e})
        }
    }
    if (req.query.ref) {
        try {
            let tmpList = JSON.parse(req.query.ref)
            tmpList.forEach(function (reff) {
                populate.push({path:reff.f, model:reff.m})
            })
            console.log("/query: populate" + JSON.stringify(populate, null, 2))
        } catch (e) {
            res.send({error: true, msg: e})
        }
    }
    if (req.query.wquery) {
        try {
            wquery = JSON.parse(req.query.wquery)
            console.log("/wquery: " + JSON.stringify(wquery))
            for( let key in wquery) {
                console.log("/wquery: [" + key + "] [" + wquery[key])
                query[key] = new RegExp(wquery[key],"i")
            }
        } catch (e) {
            res.send({error: true, msg: e})
        }
        //query = {name: new RegExp("e","i")}
    }

    console.log("/query: " + JSON.stringify(query, null, 4))
    if (req.query.collection) {
         mongoose.model(req.query.collection).count(query, function(error, count) {
            mongoose.model(req.query.collection).find(query, function (error, records) {
                if (error) {
                    console.log(error)
                    res.send({error: true, msg: error})
                } else {

                    console.log("/query: " + records.length + " " + req.query.collection)
                    console.log("/query: " + JSON.stringify(records, null, 2))
                    res.send({count:count, records: records})
                }
            })
            .limit(limit).skip(skip)
            .populate(populate)
        })

    } else {
        res.send({error: true})
    }
});

router.get('/dictionary', function (req, res, next) {
    console.log("/query: " + JSON.stringify(req.query, null, 4))
    let payload = {
        dictionary: [],
        formlayout: [],
        form: {},
        listlayout: [],
        menu: {}
    }
    dictionary.find({coll:req.query.collection}, function (error, docs) {
        if (error) console.log("ERR" + error);
        payload.dictionary = docs

        console.log("dictionary: " + JSON.stringify(docs));

        let f = [];
        docs.forEach(function (field) {
            console.log("dictionary: " + JSON.stringify(field, null, 4));
            f.push(field._id)
        })

        console.log("dictionary: [" + req.query.collection + "] " + docs.length);

        FormLayout.find({coll:req.query.collection}, function (error, docs) {

            if (docs.length < 1) {
                console.log("AAA000 NO FORM LAYOUT LEN " + docs.length + req.query.collection)

                dictionary.find({coll:req.query.collection}, function (error, docs) {
                    if (error) console.log("ERR" + error);
                    console.log("dictionary: " + JSON.stringify(docs, null, 4));
                    let f1 = [];

                    docs.forEach(function (field) {
                        f1.push(field._id)

                    })

                    let tsections1 = [
                        {header: "Default", fields: f1}
                    ]

                    let tcolumns1 = [
                        {sections: tsections1}
                    ];
                    let rows = [{columns: tcolumns1}]
                    FormLayout.create({coll: req.query.collection, rows: rows}, function(error, docs) {
                        if (error) console.log("ERR" + error);
                        console.log("FormLayout: " + JSON.stringify(docs, null, 4));
                        // res.send('FORM LAYOUT')
                    })
                })
            } else {

                payload.formlayout = docs;
                payload.form = {
                    view: docs[0].view,
                    _id: docs[0]._id,
                    style: docs[0].style,
                    "coll": docs[0].coll,
                    "rows": []
                }
                for (let idx1 = 0; idx1 < docs[0].rows.length; idx1++) {
                    console.log("AAA000 " + idx1)

                    payload.form.rows.push({index: idx1, columns: []})
                    // console.log("001 " + " --- " + JSON.stringify(docs[0].rows[idx1]))
                    for (let idx2 = 0; idx2 < docs[0].rows[idx1].columns.length; idx2++) {
                        // console.log("002 " + " --- " + JSON.stringify(payload.form))
                        payload.form.rows[idx1].columns.push({index: idx2, sections: []})
                        for (let idx3 = 0; idx3 < docs[0].rows[idx1].columns[idx2].sections.length; idx3++) {
                            // console.log("003 " + " --- " + JSON.stringify(payload.form))
                            payload.form.rows[idx1].columns[idx2].sections.push({
                                index: idx3,
                                header: docs[0].rows[idx1].columns[idx2].sections[idx3].header,
                                fields: []
                            })

                            for (let idx4 = 0; idx4 < docs[0].rows[idx1].columns[idx2].sections[idx3].fields.length; idx4++) {
                                // console.log("003 " + " --- " + JSON.stringify(payload.form))
                                payload.dictionary.forEach(function (dic) {
                                    if (String(dic._id) == docs[0].rows[idx1].columns[idx2].sections[idx3].fields[idx4]._id) {
                                        payload.form.rows[idx1].columns[idx2].sections[idx3].fields.push(
                                            {
                                                index: idx4,
                                                _id: docs[0].rows[idx1].columns[idx2].sections[idx3].fields[idx4]._id,
                                                dataType: dic.dataType,
                                                dataSubType: dic.dataSubType,
                                                reference: dic.reference,
                                                coll: dic.coll,
                                                name: dic.name,
                                                label: dic.label,
                                                order: dic.order,
                                                readonly: dic.readonly
                                            }
                                        )
                                    }
                                })

                            }
                        }
                    }
                }
            }
            ListLayout.find({coll:req.query.collection}, function (error, docs) {
                if (docs.length < 1) {
                    console.log("AAA000 NO LIST LAYOUT")
                    dictionary.find({coll:req.query.collection}, function (error, docs) {
                        if (error) console.log("ERR" + error);
                        console.log("dictionary: " + JSON.stringify(docs, null, 4));
                        let f1 = [];

                        docs.forEach(function (field) {
                            f1.push({order:f1.length+1,ref:field._id, active:f1.length>9?false:true})
                        })
                        ListLayout.create({coll:req.query.collection, fields:f1})
                        res.send('ok')
                    })
                } else {
                    payload.listlayout.push({view: docs[0].view, fields: []})

                    for (let idx1 = 0; idx1 < docs[0].fields.length; idx1++) {
                        payload.dictionary.forEach(function (dic) {
                            if (String(dic._id) == docs[0].fields[idx1].ref) {
                                payload.listlayout[0].fields.push(
                                    {
                                        index: idx1,
                                        _id: docs[0].fields[idx1]._id,
                                        dataType: dic.dataType,
                                        dataSubType: dic.dataSubType,
                                        reference: dic.reference,
                                        coll: dic.coll,
                                        name: dic.name,
                                        label: dic.label,
                                        order: docs[0].fields[idx1].order,
                                        active: docs[0].fields[idx1].active
                                    }
                                )
                            }
                        })
                    }
                    FormMenu.find({coll: req.query.collection}, function (error, docs) {
                        for (let idx1 = 0; idx1 < docs.length; idx1++) {
                            payload.menu[docs[idx1].field] = {menu: [], active: true}
                            for (let idx2 = 0; idx2 < docs[idx1].menus.length; idx2++) {
                                payload.menu[docs[idx1].field].menu.push(
                                    {
                                        active: docs[idx1].menus[idx2].active,
                                        text: docs[idx1].menus[idx2].label,
                                        value: docs[idx1].menus[idx2].value
                                    }
                                )
                            }


                        }

                        res.send(payload)
                    })
                }
            }).sort({order: -1})

        })

    });
});

router.get('/load', function (req, res, next) {

    let gr = {coll:"task",name:"assignment_group", label:"Assignment group", order:4, dataType: "Reference", reference: "group"}

    dictionary.create(gr, function (error, record) {
        if (error)
            console.log(error)
        console.log("/: " + JSON.stringify(record))
    })
    res.send("ok")

});

router.get('/task', function (req, res, next) {
    task.create({short_description:'test 123',description:'test 123'}, function (error, record) {
        if (error)
            console.log(error)
        console.log("/: " + JSON.stringify(record))
    })
    res.send("ok")
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