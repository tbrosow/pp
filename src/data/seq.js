var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var async = require('asyncawait/async');
var await = require('asyncwait');

var dictionary = require('../db/dictionary');
var db_collection = require('../db/db');
var ListLayout = require('../db/ListLayout')
var FormLayout = require('../db/FormLayout');
var FormMenu = require('../db/FormMenu');
var group = require('../db/group');
var task = require('../db/task');
var sequence = require('../db/sequence');
var menu = require('../db/FormMenu');

function createSchema(schemaName) {
    let schema = {};
    var Schema = mongoose.Schema;
    console.log('createSchema: ' + schemaName);


    dictionary.find({coll:schemaName}, function (error, records) {
        if (error) console.log(error)
        console.log(records)
        records.forEach(function(element) {
            if (element.field_type == "Field") {
                schema[element.name] = {type: String}
                if (element.dataType === 'Checkbox') {
                    schema[element.name].type = "Boolean";
                    schema[element.name].default = element.default==="0"?0:1;
                }
                if (element.dataType === 'Text') {
                    if (element.dataSubType === "datetime") {
                        schema[element.name].type = "Date";
                    }
                    if (element.dataSubType === "number") {
                        schema[element.name].type = "Number";
                    }
                    if (element.dataSubType === "text") {
                        schema[element.name].type = "String";
                    }
                    schema[element.name].default = element.default;
                }
                if (element.dataType === 'Menu') {
                    if (element.dataSubType === "number") {
                        schema[element.name].type = "Number";
                    }
                    if (element.dataSubType === "text") {
                        schema[element.name].type = "String";
                    }
                    schema[element.name].default = element.default;
                }

            }
            if (element.field_type == "Collection") {
                schema[element.name] = {
                    type: "mongoose.Schema.Types.ObjectId",
                    ref: element.reference
                }
            }
        })
        console.log(schemaName + ' - ' + JSON.stringify(schema, null, 2));
        console.log('1'+JSON.stringify(schema, null, 2));

        // let mySchema = new Schema(schema);
        // let testM = mongoose.model(schemaName, mySchema);
        // console.log(schemaName + ' 2- ' + JSON.stringify(testM.schema, null, 2));
        // core.create({}, function (error, cresults) {
        //     if (error) console.log(error)
        //     else console.log(cresults)
        //
        //     testM.create(
        //         {
        //             due_date:new Date(),
        //             core: cresults,
        //             number: new Date()
        //         }, function (error, results) {
        //             if (error) console.log(error)
        //             else console.log(results)
        //         })
        // })
        console.log('Update Schema: ' + schemaName);
        // db_collection.find({}, function (error, records) {
        db_collection.find({coll:schemaName}, function (error, records) {
            console.log("RES"+records + " " + records.length)
            if (records.length == 1) {
                records[0]._schema = JSON.stringify(schema, null, 2);
                // records[0].mongo_schema = JSON.stringify(testM.schema, null, 2);

                db_collection.update({_id: records[0]._id},records[0], function (error, results) {
                    if (error) console.log(error)
                    else console.log(results)
                    console.log('Updated Schema: '+schema);
                })
            }
        });

        // testM.find({}, function (error, results) {
        //     if (error) console.log(error)
        //     else console.log("REC:" + JSON.stringify(results[0], null, 2))
        // }).populate(populate).sort({_id:1})

    }).sort({level: 1})
}

function load_collections() {
    let schema = "db_collection";
    let collections = [
        {coll:"dictionary", label: "Dictionary", platform: true}
        ,{coll:"db_collection", label: "Collection", platform: true}
        ,{coll:"ListLayout", label: "ListLayout", platform: true}
        ,{coll:"FormLayout", label: "FormLayout", platform: true}
        ,{coll:"core", label: "Core Fields", platform: true}
        ,{coll:"user", label: "User"}
        ,{coll:"task", label: "Task"}
    ]
    db_collection.remove({}, function (error, results) {
        if (error) console.log("ERR" + error);
        console.log(JSON.stringify(results));

        collections.forEach(function (collection) {
            db_collection.create(collection, function (error, record) {
                if (error) console.log("ERR" + error);
                console.log(JSON.stringify(record));
                try {
                    createSchema(record.coll)
                } catch (e) {
                    console.log("createSchema" + e);
                }
            })
        })
    })

}

function load_dictionary() {
    let schema = "dictionary";

    let menus = [
        {
            coll:"dictionary", field: "field_type",
            menus:[
                {label:"Field", value:"Field", order:1},
                {label:"Collection", value:"Collection", order:2},
            ]
        },
        {
            coll:"task", field: "approval_requested",
            menus:[
                {label:"Not Requested", value:"not_requested", order:1},
                {label:"Requested", value:"requested", order:2},
                {label:"Approved", value:"approved", order:3},
                {label:"Declined", value:"declined", order:4}
            ]
        }
    ]

    let dics = [
        { coll: "task", dataType: "Text",        dataSubType: "datetime", reference: "",         default: "", display: false,  name: "due_date", label: "Due date"},
        { coll: "task", dataType: "Collection",  dataSubType: "",         reference: "core",     default: "", display: false, name: "core",   label: "CORE", field_type: "Collection"},

        { coll: "task", dataType: "Checkbox",    dataSubType: "",         reference: "",         default: "", display: false, name: "active",   label: "Active"},
        { coll: "task", dataType: "Checkbox",    dataSubType: "",         reference: "",         default: "0", display: false, name: "approved",   label: "Approved"},

        { coll: "task", dataType: "Text",        dataSubType: "text",     reference: "",         default: "", display: false, name: "number",   label: "Number"},
        { coll: "task", dataType: "Text",        dataSubType: "number",   reference: "",         default: "4", display: false, name: "priority",   label: "Priority"},

        { coll: "task", dataType: "Menu",        dataSubType: "text",     reference: "",         default: "not_requested", display: false, name: "approval_requested",   label: "Approval requested"},

        { coll: "task", dataType: "Text",        dataSubType: "datetime", reference: "",         default: "", display: false, readonly: true, name: "core.created", label: "Created"},
        { coll: "task", dataType: "Text",        dataSubType: "datetime", reference: "",         default: "", display: false, readonly: true, name: "core.updated", label: "Updated"},
        { coll: "task", dataType: "Reference",   dataSubType: "",           reference: "user",   default: "", display: false, readonly: true, name: "core.updatedBy", label: "Updated by"},


        { dataType : "Text", dataSubType: "datetime", reference: "",        default: "", display: false, coll: "user", name: "created", label: "Created"},
        { dataType: "Text", dataSubType: "datetime", reference: "",        default: "", display: false, coll: "user", name: "updated", label: "Updated"},
        { dataType: "Text", dataSubType: "datetime", reference: "",        default: "", display: false, coll: "user", name: "createdBy", label: "Created by" },
        { dataType: "Text", dataSubType: "datetime", reference: "",        default: "", display: false, coll: "user", name: "updatedBy", label: "Updated by"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "domain", label: "Domain"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "class_name", label: "Class"},

        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "user_name", label: "Login ID"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "name", label: "Name"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "first_name", label: "First name"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "last_name", label: "Last name"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "user_type", label: "User type"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "user", name: "email", label: "Email"},
        { dataType: "Checkbox", dataSubType: "",     reference: "",        default: "", display: false, coll: "user", name: "active", label: "Active"},


        { dataType : "Text", dataSubType: "datetime", reference: "",        default: "", display: false, coll: "core", name: "created", label: "Created"},
        { dataType: "Text", dataSubType: "datetime", reference: "",        default: "", display: false, coll: "core", name: "updated", label: "Updated"},
        { dataType: "Text", dataSubType: "datetime", reference: "user",    default: "", display: false, coll: "core", name: "createdBy", label: "Created by", field_type: "Collection" },
        { dataType: "Text", dataSubType: "datetime", reference: "user",    default: "", display: false, coll: "core", name: "updatedBy", label: "Updated by", field_type: "Collection"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "core", name: "domain", label: "Domain"},
        { dataType: "Text", dataSubType: "text",     reference: "",        default: "", display: false, coll: "core", name: "class_name", label: "Class"},

        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "db_collection", name: "label", label: "Collection"},
        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "db_collection", name: "coll", label: "Name"},
        { dataType: "JSON", dataSubType: "text", reference: "",    default: "", display: false, coll: "db_collection", name: "element_path", label: "Hierarchy"},
        { dataType: "JSON", dataSubType: "text", reference: "",    default: "", display: false, coll: "db_collection", name: "_schema", label: "Schema"},
        { dataType: "JSON", dataSubType: "text", reference: "",    default: "", display: false, coll: "db_collection", name: "mongo_schema", label: "Mongo schema"},

        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "name", label: "Name"},
        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "coll", label: "Coll"},
        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "reference", label: "Reference"},
        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "dataSubType", label: "DataSubType"},
        { dataType: "Text", dataSubType: "number", reference: "",  default: "", display: false, coll: "dictionary", name: "order", label: "Order"},
        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "label", label: "Label"},
        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "dataType", label: "DataType"},
        { dataType: "Text", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "default", label: "Default"},
        { dataType: "Menu", dataSubType: "text", reference: "",    default: "", display: false, coll: "dictionary", name: "field_type", label: "Field type", order: 1}
    ]

    FormMenu.remove({}, function (error, results) {
        if (error) console.log("ERR" + error);
        console.log(JSON.stringify(results));

        menus.forEach(function (menu) {
            FormMenu.create(menu, function (error, record) {
                if (error) console.log("ERR" + error);
                console.log("FormMenu"+JSON.stringify(record,null,2));
            })
        })
    })

    dictionary.remove({}, function (error, results) {
        if (error) console.log("ERR" + error);
        console.log(JSON.stringify(results));

        dics.forEach(function (dic) {
            dictionary.create(dic, function (error, record) {
                if (error) console.log("ERR" + error);
                console.log(JSON.stringify(record));

            })
        })
    })

}

function getDictionary() {
    console.log("dic start");
    dictionary.remove({coll: "task"}, function (error) {

        await(dictionary.create({coll: "task", name: "number", label: "Number", order: 1, dataType: "Text", default:'func:getnumber', display:true},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "created", label: "Opened", order: 1, dataType: "Text"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "updated", label: "Last updated", order: 1, dataType: "Text"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "_id", label: "ID", order: 1, dataType: "Text", readonly:true},function (err,doc) {console.log(doc._id) }))

        await(dictionary.create({coll: "task", name: "state", label: "Status", order: 2, dataType: "Menu"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({
            coll: "task",
            name: "assignee",
            label: "Assignee",
            order: 2,
            dataType: "Reference",
            reference: "User"
        },function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({
            coll: "task",
            name: "assignment_group",
            label: "Assignment group",
            order: 2,
            dataType: "Reference",
            reference: "group"
        },function (err,doc) {console.log(doc._id) }))


        await(dictionary.create({coll: "task", name: "active", label: "Active", order: 3, dataType: "Checkbox"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "major", label: "Major", order: 3, dataType: "Checkbox"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "closed", label: "Closed", order: 3, dataType: "Checkbox"},function (err,doc) {console.log(doc._id) }))

        await(dictionary.create({coll: "task", name: "notes", label: "Notes", order: 4, dataType: "TextArea"},function (err,doc) {console.log(doc._id) }))


        await(dictionary.create({
            coll: "task",
            name: "short_description",
            label: "Short description",
            order: 8,
            dataType: "Text"
        },function (err,doc) {console.log(doc._id) }))

        await(dictionary.create({coll: "task", name: "description", label: "Description", order: 9, dataType: "TextArea"}))
    })
    console.log("dic end");
}

function defaultListLayout(schema) {
    ListLayout.remove({coll: schema}, function (error) {
        dictionary.find({coll:schema}, function (error, docs) {
            if (error) console.log("ERR" + error);

            let f = [];
            docs.forEach(function (field) {
                // delete field._id
                delete field['__v']
                f.push({order:f.length+1,ref:field._id, active:f.length>9?false:true})

            })
            ListLayout.create({coll:schema, fields:f})
        });
    })
}

function defaultFormLayout(schema) {
    FormLayout.remove({coll: schema}, function (error) {
        dictionary.find({coll:schema}, function (error, docs) {
            if (error) console.log("ERR" + error);
            console.log("FormLayout: " + JSON.stringify(docs, null, 4));
            let f = [];
            docs.forEach(function (field) {
                // console.log("FormLayout1: " + JSON.stringify(field, null, 4));
                f.push(field._id)
            })

            let tsections = [
                {header:"Default", fields:f}
            ]

            let tcolumns = [
                {sections:tsections}
            ];

            let rows = [{columns:tcolumns}]
            FormLayout.create({coll:schema, rows:rows})
        });
    })
}

function getOtherStuff() {
    sequence.remove({}, function (error) {
        if (error) console.log("ERR" + error);
    })

    sequence.create({coll:'task',prefix:'INC'}, function (error, record) {
        if (error) console.log("ERR" + error);
        console.log(JSON.stringify(record))
    })

    menu.remove({coll: "task"}, function (error) {
        if (error) console.log("ERR" + error);
    })
    menu.create({coll:"task", field: "category", menus:[
            {label:"Admin", value:"admin", order:1},
            {label:"ITIL", value:"itil", order:2},
            {label:"Client", value:"none", order:3}]})

    menu.create({coll:"task", field: "state", menus:[
            {label:"New", value:"new", order:1},
            {label:"In progress", value:"in_progress", order:2},
            {label:"Resolved", value:"resolved", order:3},
            {label:"Closed", value:"closed", order:4}
        ]})
}
function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function genDic(_schema) {
    for (let key in mongoose.model(_schema).schema.tree) {

        console.log(key + ' TYPE [' + String(mongoose.model(_schema).schema.tree[key].type).substr(0, 17) + ']')
        if (String(mongoose.model(_schema).schema.tree[key].type).substr(0, 17) == 'function Number()') {

            dictionary.find({coll: 'schema', name: key}, function (error, records) {
                if (error) console.log("ERR" + error);
                console.log(JSON.stringify(records) + "LEN: " + records.length)
                if (records.length == 0) {
                    dictionary.create(
                        {
                            dataType: "Text",
                            dataSubType: "number",
                            coll: _schema,
                            "name": key,
                            "label": jsUcfirst(key)
                        }
                        , function (error, records) {
                            if (error) console.log("ERR" + error);
                            console.log(JSON.stringify(records))
                        })
                }
            })
        }

        if (String(mongoose.model(_schema).schema.tree[key].type).substr(0, 17) == 'function String()')
            dictionary.find({coll: 'schema', name: key}, function (error, records) {
                if (error) console.log("ERR" + error);
                console.log(JSON.stringify(records) + "LEN: " + records.length)
                if (records.length == 0) {
                    dictionary.create(
                        {
                            dataType: "Text",
                            dataSubType: "text",
                            coll: _schema,
                            "name": key,
                            "label": jsUcfirst(key)
                        }
                        , function (error, records) {
                            if (error) console.log("ERR" + error);
                            console.log(JSON.stringify(records))
                        })
                }
            })
    }
}

function genDic2(_schema) {
    dictionary.find({coll:_schema}, function (error, docs) {
        if (error) console.log("ERR" + error);
        console.log("dictionary: " + JSON.stringify(docs, null, 4));
        let f1 = [];

        docs.forEach(function (field) {
            f1.push({order:f1.length+1,ref:field._id, active:f1.length>9?false:true})
        })
        ListLayout.create({coll:_schema, fields:f1}, function(error, docs) {
            if (error) console.log("ERR" + error);
            console.log("ListLayout: " + JSON.stringify(docs, null, 4));
            // res.send('FORM LAYOUT')
        })

        if (error) console.log("ERR" + error);
        console.log("dictionary: " + JSON.stringify(docs, null, 4));
        f1 = [];

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
        FormLayout.create({coll: _schema, rows: rows}, function(error, docs) {
            if (error) console.log("ERR" + error);
            console.log("FormLayout: " + JSON.stringify(docs, null, 4));
            // res.send('FORM LAYOUT')
        })

    })

}

//connect to MongoDB
mongoose.connect('mongodb://localhost/tupp', { useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("we're connected!");
    console.log(sequence.schema.tree)
    // let schema = 'dictionary'
    let schema = 'dictionary'

    setTimeout(function() {
        load_collections();

    }, 2000)

    load_dictionary();

    setTimeout(function() {
        db_collection.find({}, function(error, results) {
            results.forEach(function(coll) {
                console.log(coll.coll)
                defaultFormLayout(coll.coll);
                defaultListLayout(coll.coll);
            })
        })

    }, 4000)




    // dictionary.remove({coll:schema}, function(error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("dictionary: " + JSON.stringify(docs, null, 4));
    // })
    // ListLayout.remove({coll:schema}, function(error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("ListLayout: " + JSON.stringify(docs, null, 4));
    // })
    // FormLayout.remove({coll:schema}, function(error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("FormLayout: " + JSON.stringify(docs, null, 4));
    // })
    //
    // setTimeout(function() {
    //     genDic(schema)
    // }, 2000)
    // setTimeout(function() {
    //     genDic2(schema)
    // }, 4000)

    setTimeout(function() {
        mongoose.connection.close()

    }, 6000)
});