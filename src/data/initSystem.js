try {


    conn = new Mongo();
    db = conn.getDB("tupp");

    db.listlayouts.remove({});
    db.dictionaries.remove({});

    db.dictionaries.insertOne({coll:"task",name:"state", label:"Status", order:8, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"number", label:"Number", order:6, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"active", label:"Active", order:6, dataType: "Checkbox"})
    db.dictionaries.insertOne({coll:"task",name:"_id", label:"ID", order:7, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"created", label:"Opened", order:7, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"updated", label:"Last updated", order:7, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"state", label:"Status", order:6, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"number", label:"Number", order:7, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"assignee", label:"Assignee", order:8, dataType: "Reference", reference: "User"})
    db.dictionaries.insertOne({coll:"task",name:"assignment_group", label:"Assignment group", order:8, dataType: "Reference", reference: "group"})
    db.dictionaries.insertOne({coll:"task",name:"description", label:"Description", order:9, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"short_description", label:"Short description", order:9, dataType: "Text"})
    db.dictionaries.insertOne({coll:"task",name:"category", label:"Category", order:6, dataType: "Menu"})

    let f = [];
    db.dictionaries.find().forEach( function(thisDoc) {
        f.push({order:1, ref:thisDoc});
    })
    db.listlayouts.insertOne({coll:"task", fields:f})
    printjson(f)

        // db.listlayouts.insertOne({coll:"task", fields:record})

    db.formlayouts.remove({});

    let f1 = [];
    db.dictionaries.find({coll:"task",order:9}).forEach( function(thisDoc) {
        f1.push(thisDoc);
    })
    let f2 = [];
    db.dictionaries.find({coll:"task",order:8}).forEach( function(thisDoc) {
        f2.push(thisDoc);
    })
    let f3 = [];
    db.dictionaries.find({coll:"task",order:7}).forEach( function(thisDoc) {
        f3.push(thisDoc);
    })
    let f4 = [];
    db.dictionaries.find({coll:"task",order:6}).forEach( function(thisDoc) {
        f4.push(thisDoc);
    })

    let tsections1 = [
        {header:"Core", fields:f3},{header:"Assignment", fields:f2}
    ]
    let tsections2 = [
        {header:"Details", fields:f1},{header:"Extra", fields:f4}
    ]
    let tcolumns = [
        {sections:tsections1},
        {sections:tsections2}
    ];
    let tstyle = {width: (100 / tcolumns.length) + "%"}
    db.formlayouts.insertOne({coll:"task", view:"default", columns:tcolumns, style:tstyle})
    db.formlayouts.insertOne({coll:"task", view:"default", columns:tcolumns, style:tstyle})

    // let tfields2 = [
    //     {name:"active", label:"Active", order:3, dataType: "Checkbox"},
    //     {name:"_id", label:"ID", order:4, dataType: "Text"},
    //     {name:"created", label:"Opened", order:5, dataType: "Text"},
    //     {name:"updated", label:"Last updated", order:6, dataType: "Text"}
    // ];
    //
    // let tfields3 = [
    //     {name:"description", label:"Description", order:1, dataType: "Text"},
    //     {name:"short_description", label:"Short description", order:2, dataType: "Text"}
    // ];
    //
    // db.listlayouts.insertOne({coll:"task", fields:tfields})

    // let tsections1 = [
    //     {header:"Assignment", fields:tfields1},{header:"Dates", fields:tfields2}
    // ]
    // let tsections2 = [
    //     {header:"Details", fields:tfields3}
    // ]
    //
    // let tcolumns = [
    //     {sections:tsections1},{sections:tsections2}
    // ];
    //
    // let tstyle = {width: (100 / tcolumns.length) + "%"}
    //
    // db.formlayouts.remove({});
    // db.formlayouts.insertOne({coll:"task", view:"default", columns:tcolumns, style:tstyle})


    db.groups.remove({});
    db.groups.insertOne({name:"HelpDesk", email:"", type:"", active:true })
    db.groups.insertOne({name:"CRM Engineering Team", email:"", type:"", active:true })
    db.groups.insertOne({name:"HR Engineering Team", email:"", type:"", active:true })
    db.groups.insertOne({name:"NPP Support Team", email:"", type:"", active:true })
    db.groups.insertOne({name:"Support Team", email:"", type:"", active:true })
    db.groups.insertOne({name:"IT Support", email:"", type:"", active:true })
    // db.formlayouts.remove({});
    // db.players.remove({});
    db.menus.remove({});
    db.menus.insertOne({coll:"User", field: "user_type", menus:[
            {label:"Admin", value:"admin", order:1},
            {label:"ITIL", value:"itil", order:2},
            {label:"Client", value:"none", order:3}]})

    db.menus.insertOne({coll:"task", field: "category", menus:[
            {label:"Admin", value:"admin", order:1},
            {label:"ITIL", value:"itil", order:2},
            {label:"Client", value:"none", order:3}]})

    db.menus.find({})



    // let fields1 = [
    //     {name:"email", label:"Email Address", order:1, dataType: "Text", dataSubType: "email", readonly:false},
    //     {name:"name", label:"Name", order:2, dataType: "Text", readonly:false},
    //     {name:"user_name", label:"Login ID", order:3, dataType: "Text", readonly:false},
    //     {name:"_id", label:"User ID", order:4, dataType: "Text", readonly:true}
    // ];
    //
    // let fields2 = [
    //     {name:"first_name", label:"First name", order:1, dataType: "Text", readonly:false},
    //     {name:"last_name", label:"Last name", order:2, dataType: "Text", readonly:false}
    // ];
    //
    // let fields3 = [
    //     {name:"password", label:"Password", order:1, dataType: "Text", dataSubType: "password", readonly:false},
    //     {name:"active", label:"Active", order:2, dataType: "Checkbox", readonly:false},
    //     {name:"user_type", label:"User Type", order:3, dataType: "Menu", readonly:false}
    // ];
    //
    // let fields4 = [
    //     {name:"assignment", label:"Assignment group", order:1, dataType: "Reference", reference: "group", readonly:false},
    //     {name:"assignee", label:"Assigee", order:2, dataType: "Reference", reference: "User", readonly:false}
    // ];
    //
    // let sections1 = [
    //     {header:"Corporate", fields:fields1},{header:"Private Data", fields:fields2}
    // ]
    // let sections2 = [
    //     {header:"Security", fields:fields3},{header:"Assignment", fields:fields4}
    // ]
    // let columns = [
    //     {sections:sections1},{sections:sections2}
    // ];
    //
    // let style = {width: (100 / columns.length) + "%"}
    //
    // // db.formlayouts.remove({});
    // db.formlayouts.insertOne({coll:"user", view:"default", columns:columns, style:style})


} catch (e) {
    print (e);
};