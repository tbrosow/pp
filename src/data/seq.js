var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var async = require('asyncawait/async');
var await = require('asyncwait');

var dictionary = require('../db/dictionary');
var ListLayout = require('../db/ListLayout')
var FormLayout = require('../db/FormLayout');
var FormMenu = require('../db/FormMenu');
var group = require('../db/group');
var task = require('../db/task');
var sequence = require('../db/sequence');
var menu = require('../db/FormMenu');

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

function getListLayout() {
    ListLayout.remove({coll: "task"}, function (error) {
        dictionary.find({coll:'task'}, function (error, docs) {
            if (error) console.log("ERR" + error);

            let f = [];
            docs.forEach(function (field) {
                // delete field._id
                delete field['__v']
                f.push({order:f.length+1,ref:field._id, active:f.length>9?false:true})
                console.log("ListLayout2342: " + field._id);
                console.log("ListLayout2342: " + JSON.stringify(field, null, 4));
            })
            console.log("ListLayout234: " + JSON.stringify(f, null, 4));
            ListLayout.create({coll:'task', fields:f})
        });


    })

}

function getFormLayout() {
    FormLayout.remove({coll: "task"}, function (error) {
        dictionary.find({coll:'task'}, function (error, docs) {
            if (error) console.log("ERR" + error);
            console.log("FormLayout: " + JSON.stringify(docs, null, 4));
            let f1 = [];
            let f2 = [];
            let f3 = [];
            let f4 = [];
            let f8 = [];
            let f9 = [];
            docs.forEach(function (field) {
                // console.log("FormLayout1: " + JSON.stringify(field, null, 4));
                if (field.order == 1)
                    f1.push(field._id)
                if (field.order == 2)
                    f2.push(field._id)
                if (field.order == 3)
                    f3.push(field._id)
                if (field.order == 4)
                    f4.push(field._id)
                if (field.order == 8)
                    f8.push(field._id)
                if (field.order == 9)
                    f8.push(field._id)
            })

            let tsections2 = [
                {header:"Assignment", fields:f2}
                ,{header:"Core", fields:f3}
            ]

            let tsections1 = [
                {header:"Details", fields:f1},
                {header:"Extra", fields:f4}
            ]

            let tsections3 = [
                {header:"Details", fields:f8}
            ]

            let tcolumns1 = [
                {sections:tsections1},
                {sections:tsections2}
            ];
            let tcolumns2 = [
                {sections:tsections3}
            ];

            let rows = [{columns:tcolumns1},{columns:tcolumns2}]
//, style:{width: (100 / tcolumns1.length) + "%"}
            FormLayout.create({coll:'task', rows:rows})
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

    dictionary.remove({coll:schema}, function(error, docs) {
        if (error) console.log("ERR" + error);
        console.log("dictionary: " + JSON.stringify(docs, null, 4));
    })
    ListLayout.remove({coll:schema}, function(error, docs) {
        if (error) console.log("ERR" + error);
        console.log("ListLayout: " + JSON.stringify(docs, null, 4));
    })
    FormLayout.remove({coll:schema}, function(error, docs) {
        if (error) console.log("ERR" + error);
        console.log("FormLayout: " + JSON.stringify(docs, null, 4));
    })

    setTimeout(function() {
        genDic(schema)
    }, 2000)
    setTimeout(function() {
        genDic2(schema)
    }, 4000)

    setTimeout(function() {
        mongoose.connection.close()

    }, 6000)
});