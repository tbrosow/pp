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
var user = require('../db/user');
var core = require('../db/core');
var task = require('../db/task');
var sequence = require('../db/sequence');
var menu = require('../db/FormMenu');

function getDictionary() {
    console.log("dic start");
    dictionary.remove({coll: "task"}, function (error) {

        await(dictionary.create({coll: "task", name: "number", label: "Number", order: 1, dataType: "Text", default:'func:getnumber', display:true},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "created", label: "Opened", order: 1, dataType: "SYSTEM"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "updated", label: "Last updated", order: 1, dataType: "SYSTEM"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "createdBy", label: "Opened by", order: 1, dataType: "SYSTEM"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({coll: "task", name: "updatedBy", label: "Last updated by", order: 1, dataType: "SYSTEM"},function (err,doc) {console.log(doc._id) }))

        await(dictionary.create({coll: "task", name: "_id", label: "ID", order: 1, dataType: "Text", readonly:true},function (err,doc) {console.log(doc._id) }))

        await(dictionary.create({coll: "task", name: "state", label: "Status", order: 2, dataType: "Menu"},function (err,doc) {console.log(doc._id) }))
        await(dictionary.create({
            coll: "task",
            name: "assignee",
            label: "Assignee",
            order: 2,
            dataType: "Reference",
            reference: "user"
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

function getFormLayout(schema) {
    FormLayout.remove({coll: schema}, function (error) {
        dictionary.find({coll:schema}, function (error, docs) {
            if (error) console.log("ERR" + error);
            console.log("FormLayout: " + JSON.stringify(docs, null, 4));
            let f1 = [];

            docs.forEach(function (field) {
                // console.log("FormLayout1: " + JSON.stringify(field, null, 4));
                f1.push(field._id)

            })

            let tsections1 = [
                {header:"Details", fields:f1}
                ]

            let tcolumns1 = [
                {sections:tsections1}
            ];

            let rows = [{columns:tcolumns1}]

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

    user.create({active:true,email: "D", last_name: "D", first_name: "Torsten", name: "Torsten Brosow", user_name: "DDD4"}, function (error, user) {
        if (error) console.log("ERR" + error);
        console.log("USER"+JSON.stringify(user,null,2))

        core.create({createdBy:user,updatedBy:user}, function (error, record) {
        if (error) console.log("ERR" + error);
        console.log("CORE"+JSON.stringify(record,null,2))

        task.create({sys:record,"task_type":"Client","active":true,"major":true,"closed":true,"state":"in_progress","notes":"hfhfgh","short_description":"hfgh","description":"hfghgfh","number":"INC0099999"},
            function (error, record) {
                if (error) console.log("ERR" + error);
                console.log("TASK"+JSON.stringify(record,null,2))
            })
        })
    })
}

function genDic() {
    for(let key in sequence.schema.tree) {
        console.log(key + ' ' + sequence.schema.tree[key])
        console.log(key + 'TYPE [xx' + String(sequence.schema.tree[key].type).substr(0,17) + 'xx]')
        if (String(sequence.schema.tree[key].type).substr(0,17) == 'function Number()') {

            dictionary.find({coll:'schema', name: key}, function (error, records) {
                if (error) console.log("ERR" + error);
                console.log(JSON.stringify(records) + "LEN: " + records.length)
                if (records.length == 0) {
                    dictionary.create(
                        {
                            dataType : "Text",
                            dataSubType : "number",
                            coll: "sequence",
                            "name" : key,
                            "label" : key
                        }
                        , function (error, records) {
                            if (error) console.log("ERR" + error);
                            console.log(JSON.stringify(records))
                        })
                }
            })
        }

        if (String(sequence.schema.tree[key].type).substr(0,17) == 'function String()')
            dictionary.find({coll:'schema', name: key}, function (error, records) {
                if (error) console.log("ERR" + error);
                console.log(JSON.stringify(records) + "LEN: " + records.length)
                if (records.length == 0) {
                    dictionary.create(
                        {
                            dataType : "Text",
                            dataSubType : "text",
                            coll: "sequence",
                            "name" : key,
                            "label" : key
                        }
                        , function (error, records) {
                            if (error) console.log("ERR" + error);
                            console.log(JSON.stringify(records))
                        })
                }
            })
    }
}

//connect to MongoDB
mongoose.connect('mongodb://localhost/tupp', { useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("we're connected!");
    // console.log(core.schema.tree)
    // console.log(task.schema.tree)
    //
    // core.remove({}, function (error, records) {
    //     if (error) console.log("ERR" + error);
    //     console.log(JSON.stringify(records))
    // })
    // task.remove({}, function (error, records) {
    //     if (error) console.log("ERR" + error);
    //     console.log(JSON.stringify(records))
    // })
    // user.remove({}, function (error, records) {
    //     if (error) console.log("ERR" + error);
    //     console.log(JSON.stringify(records))
    // })
    //
    // console.log('removed')

    // await(getDictionary('dictionary'))


// setTimeout(function() {
//     await(getListLayout())
//     console.log("getListLayout loaded");
// }, 1000);

setTimeout(function() {
    FormLayout.remove({coll:'dictionary'}, function (error, records) {
        if (error) console.log("ERR" + error);
        console.log(JSON.stringify(records))
        await(getFormLayout('dictionary'))
    })


    console.log("getFormLayout loaded");
}, 1000);

// setTimeout(function() {
//     await(getOtherStuff())
//     console.log("getListLayout loaded");
// }, 1000);

setTimeout(function() {

    // await(dictionary.find({}, function (error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("dictionary: " + docs.length);
    // }));
    // await(ListLayout.find({}, function (error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("ListLayout: " + docs.length);
    // }));
    //
    // menu.find({}, function (error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("menu: " + docs.length);
    //
    // });
    // FormLayout.find({}, function (error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("FormLayout: " + docs.length);
    //
    // });
    //
    // console.log(' TYPE [' + JSON.stringify(mongoose.model('task').schema.tree))
    //
    // core.find({}, function (error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("core: " + docs.length);
    //     console.log("core: " + JSON.stringify(docs,null,2));
    //
    // }).populate([{path:'createdBy', schema:'user'}]);
    // task.find({}, function (error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("Task: " + docs.length);
    //     console.log("Task: " + JSON.stringify(docs,null,2));
    //
    // }).populate([
    //     {path:'sys', schema:'core'},
    //     {path: 'sys', populate: { path: 'createdBy' }, schema:'user'},
    //     {path: 'sys', populate: { path: 'updatedBy' }, schema:'user'}
    //         ]);
    // sequence.find({}, function (error, docs) {
    //     if (error) console.log("ERR" + error);
    //     console.log("sequence: " + docs.length);
    //
    // });


    }, 2000)

setTimeout(function() {
        mongoose.connection.close()

    }, 4000)
});