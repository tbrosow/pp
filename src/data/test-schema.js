var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var async = require('asyncawait/async');
var await = require('asyncwait');
var dictionary = require('../db/dictionary');
var db_collection = require('../db/db')
var core = require('../db/core')
var _ = require('lodash')

//connect to MongoDB
mongoose.connect('mongodb://localhost/tupp', { useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));


function getCS(schema, name, _path, _level, _main, _arr) {
    let path = "", level=0, main, pathArr = [];
    let init = false;
    if (_main) {
        main = _main
    } else {
        main = schema
        init = true;
    }
    if(_level) {
        _level++;
        level = _level;
    } else {
        level++;
    }
    if (_path)
        path = _path
    if (_arr)
        pathArr = _arr

    console.log("getCS: " + schema);
    let tmpPath = path;

    // console.log("getCS Schema: " + schema + " Element: " + name + " level: [" + level + "]") ;

    dictionary.find({coll:schema},function (error, dics) {
        console.log(schema + " :" + dics.length)
        dics.forEach(function (dic) {

            if (dic.field_type == 'Collection') {
                if (tmpPath != '')
                    path = tmpPath + "." + dic.name;
                else
                    path = dic.name;
                console.log("getCS ADD Schema: " + main + " " + dic.reference + " Element: " + dic.name + " Path: [" + path + "]"+ " Path: [" + level + "]") ;
                pathArr.push({element:dic.name, path:path, coll:dic.reference, level:level})

                // setTimeout(function() {
                    getCS(dic.reference, dic.name, path, level, main, pathArr)
                // }, 1300);
            }

        })

    })
    // console.log("ARR " + init + " " + JSON.stringify(pathArr, null, 2))

        db_collection.find({coll:main}, function (error, results) {
            if (error) console.log(error)
            // console.log(results)
            if (results.length == 1) {
                console.log("EP: " + results[0].element_path + " Path: "+ path);
                results[0].element_path = pathArr;

                console.log("EP: "+results[0]._id);
                db_collection.update({_id:results[0]._id}, results[0], function (error, results) {
                    if (error) console.log(error)
                    console.log(results)
                })

            }
        })

    return pathArr;
}

function getRecord(schemaName) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    db_collection.find({coll:schemaName}, function (error, records) {
        if (error) console.log(error)
        console.log("Collection: " + records);
        if (records.length == 1) {
            console.log("Collection: " + typeof records[0]._schema);
            // console.log("Collection: " + records[0].mongo_schema);

            let schema = {};

            let s = JSON.parse(records[0]._schema);
            _.forEach(s, function(value, key) {
                console.log(key + " " + JSON.stringify(value));
                console.log("REF" + _.has(value.options, 'ref'));

                if (_.has(value.options, 'ref')) {
                    schema[key] = {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: value.options.ref
                    };
                }
                if (value.instance === "Date") {
                    schema[key] = {
                        type: Date
                    };
                }
                if (value.instance === "Boolean") {
                    schema[key] = {
                        type: Boolean
                    };
                }
                if (value.instance === "Number") {
                    schema[key] = {
                        type: Number
                    };
                }
                if (value.instance === "String") {
                    schema[key] = {
                        type: String
                    };
                }
                if (value.instance === "String") {
                    schema[key] = {
                        type: String
                    };
                }
                if (_.has(value.options, 'default')) {
                    schema[key].default = value.options.default;
                }
            });

            console.log("schema " + JSON.stringify(schema));
            var task = mongoose.model(schemaName, schema);

            core.create({}, function (error, cresults) {
                if (error) console.log(error)
                else console.log(cresults)

                task.create(
                    {
                        due_date:new Date(),
                        core: cresults,
                        number: new Date()
                    }, function (error, results) {
                        if (error) console.log(error)
                        else console.log(results)
                    })
            });


            task.find({}, function (error, trecords) {
                if (trecords.length > 0) {
                    console.log("TASK: " + trecords[0]._id);
                    console.log("TASK: " + JSON.stringify(trecords[0], null, 2));
                }
            }).sort({number:1}).populate(populate)

        }
    });

}

function getSchema(schemaName) {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    function printSchema(obj, indent) {
        for (var key in obj) {
            console.log(indent, key, typeof obj[key]);
            if (typeof obj[key] == "object") {
                printSchema(obj[key], indent + "\t")
            }
        }
    }

    db_collection.find({coll:schemaName}, function (error, records) {
        if (error) console.log(error)
        console.log("Collection: " + records);
        if (records.length == 1) {

            var blogSchema = new Schema({
                title:  String,
                author: String,
                body:   String,
                comments: [{ body: String, date: Date }],
                date: { type: Date, default: Date.now },
                hidden: Boolean,
                meta: {
                    votes: Number,
                    favs:  Number
                }
            });
            console.log(schemaName + ' blogSchema' + JSON.stringify(blogSchema.paths, null, 2));

            xxschema = {
                title:  String,
                active: {
                  type: Boolean
                },
                fields2: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "dictionary"
                }
            };

            console.log(schemaName + ' ==> ' + JSON.stringify(xxschema, null, 2));
            var mySchema = new Schema(xxschema);
            var testM = mongoose.model('test', xxschema);
            testM.create({title:'test'})
            console.log(schemaName + ' ' + JSON.stringify(mySchema.paths, null, 2));
            // console.log(schemaName + ' blogSchema' + JSON.stringify(blogSchema.schema.tree, null, 2));
            // console.log(schemaName + ' ' + JSON.stringify(mongoose.model(schemaName).schema.tree, null, 2));

        }
    });
}

let populate = [
    {path:'core', schema:'core'},
    {path: 'sys', populate: { path: 'createdBy' }, schema:'user'},
    {path: 'sys', populate: { path: 'updatedBy' }, schema:'user'}
];

function createSchema(schemaName) {
    let schema = {};
    var Schema = mongoose.Schema;

    dictionary.find({coll:schemaName}, function (error, records) {
        if (error) console.log(error)
        console.log(records)
        records.forEach(function(element) {
            if (element.field_type == "Field") {
                schema[element.name] = {type: String}
                if (element.dataType === 'Checkbox') {
                    schema[element.name].type = Boolean;
                    schema[element.name].default = element.default==="0"?0:1;
                }
                if (element.dataType === 'Text') {
                    if (element.dataSubType === "datetime") {
                        schema[element.name].type = Date;
                    }
                    if (element.dataSubType === "number") {
                        schema[element.name].type = Number;
                    }
                    schema[element.name].default = element.default;
                }

            }
            if (element.field_type == "Collection") {
                schema[element.name] = {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: element.reference
                }
            }
        })
        console.log(schemaName + ' - ' + JSON.stringify(schema, null, 2));
        console.log('1'+JSON.stringify(schema, null, 2));

        let mySchema = new Schema(schema);
        let testM = mongoose.model(schemaName, mySchema);
        console.log(schemaName + ' 2- ' + JSON.stringify(testM.schema, null, 2));
        core.create({}, function (error, cresults) {
            if (error) console.log(error)
            else console.log(cresults)

            testM.create(
                {
                    due_date:new Date(),
                    core: cresults,
                    number: new Date()
                }, function (error, results) {
                    if (error) console.log(error)
                    else console.log(results)
                })
        })
        console.log('UPD'+schemaName);
        // db_collection.find({}, function (error, records) {
        db_collection.find({coll:schemaName}, function (error, records) {
            console.log("RES"+records + " " + records.length)
            if (records.length == 1) {
                records[0]._schema = JSON.stringify(testM.schema.paths, null, 2);
                records[0].mongo_schema = JSON.stringify(testM.schema, null, 2);

                db_collection.update({_id: records[0]._id},records[0], function (error, results) {
                    if (error) console.log(error)
                    else console.log(results)
                    console.log('UPD2'+schema);
                })
            }
        });

        testM.find({}, function (error, results) {
            if (error) console.log(error)
            else console.log("REC:" + JSON.stringify(results[0], null, 2))
        }).populate(populate).sort({_id:1})

    }).sort({level: 1})
}

db.once('open', function () {

    let mySchema = {};
    let schema = 'task';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    console.log("we're connected!");

    // db_nested.remove({main:schema}, function (error, result) {
    //     if (error) console.log(error)
    //     console.log(result)
         //getCS(schema, function (error, res) {

         //});


    // })
    db_collection.find({coll:schema}, function (error, results) {
        if (error) console.log(error)
        // console.log(results)
        if (results.length === 1) {
            results[0].element_path = [];

            console.log("EP: " + results[0]._id);
            db_collection.update({_id:results[0]._id}, results[0], function (error, results) {
                if (error) console.log(error)
                console.log(results)
                getCS(schema)
            })
        }
    });

    // createSchema('task')

    // getSchema('task')
    // getRecord('task')

    setTimeout(function() {
        console.log("XXXXX3")
    }, 2000)

    // })
    setTimeout(function() {
        mongoose.connection.close()

    }, 4000)
});
