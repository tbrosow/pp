
<template>
    <div class="dataView">

        <b-alert v-if="alert.error.show" variant="danger" show>
            <b-container fluid class="">
                <!-- Stack the columns on mobile by making one full-width and the other half-width -->
                <b-row>
                    <b-col cols="12" lg="10">{{alert.error.text}}</b-col>
                    <b-col cols="6" lg="2"><div style="text-align: right"><button v-on:click="closeAlert('error')" class="btn btn-outline-danger">OK</button></div></b-col>
                </b-row>

            </b-container>
        </b-alert>
        <b-alert v-if="alert.warning.show" variant="warning" show>
            <b-container fluid class="">
                <!-- Stack the columns on mobile by making one full-width and the other half-width -->
                <b-row>
                    <b-col cols="12" lg="10">{{alert.warning.text}}</b-col>
                    <b-col cols="6" lg="2"><div style="text-align: right"><button v-on:click="closeAlert('warning')" class="btn btn-outline-warning">OK</button></div></b-col>
                </b-row>

            </b-container>
        </b-alert>
        <b-alert v-if="alert.success.show" variant="success" show>
            <b-container fluid class="">
                <!-- Stack the columns on mobile by making one full-width and the other half-width -->
                <b-row>
                    <b-col cols="12" lg="10"><div style="    padding-top: 8px;">{{alert.success.text}}</div></b-col>
                    <b-col cols="6" lg="2"><div style="text-align: right"><button v-on:click="closeAlert('success')" class="btn btn-outline-success">OK</button></div></b-col>
                </b-row>

            </b-container>
        </b-alert>

        <!-- FORM -->
        <b-alert show>Admin Console
        <div>
            <b-link class="btn" style="border-color: #28a745;" :to="{ path: '/fb?col='+collection}" replace>Form Builder</b-link>
            <b-link class="btn" style="border-color: #28a745;" :to="{ path: linkDictionary}" replace>Dictionary</b-link>
            <button v-if="curRecord._id && collection=='db_collection'" v-on:click="updateSchema" class="btn btn-outline-success">Update Schema</button>
        </div>
        </b-alert>

        <b-alert show>Data View</b-alert>


        <div v-if="curRecord._id || newRec" id="" class="detailView">

            <div  v-for="(row, r_index) in formLayout.rows" class="rowt">

                <div v-for="(column, index) in row.columns" :style="row.style" class="column">

                    <div v-for="(section, s_index) in column.sections" class="section">

                        <div class="section-header"><h5>{{section.header}}</h5></div>

                        <div v-for="(field, f_index) in section.fields">

                            <b-form-group horizontal

                                          :label-cols="2"
                                          label-size="sm"
                                          :label=field.label
                                          label-for="input_sm">
                                <b-form-group style="text-align: left" v-if="field.dataType=='Checkbox'" >
                                    <b-form-checkbox-group size="sm" buttons button-variant="primary" v-model="curRecord[field.name]" name="butons1" :options="opt_boolean">
                                    </b-form-checkbox-group>
                                </b-form-group>
<!--{{refField[field.name]}} {{field.name}}-->
                                <div v-for="(set, s_index) in refFieldList">
                                <vue-bootstrap-typeahead
                                        size="sm"
                                        v-if="field.dataType=='Reference' && set.field == field.name"
                                        v-model="refField[field.name]"
                                        @input="reloadReference( field.name, refField[field.name], set.reference)"
                                        @hit="refFieldList[s_index].value = $event"
                                        :data="refFieldList[s_index].data"
                                        :serializer="item => item.name"
                                        ref="ReferenceField"/>
                                </div>
                                <!--@hit="selectedGroup = $event"-->
                                <!--v-model="curRecord[field.name]"-->
                                <!--<b-form-checkbox v-if="field.dataType=='Checkbox'" id="checkbox1"-->
                                                 <!--v-model="curRecord[field.name]"-->
                                                 <!--value="true"-->
                                                 <!--unchecked-value="false">-->
<!--s-->
                                <!--</b-form-checkbox>-->
                                <!--<b-form-select v-model="curRecord[field.name]" :options="opt_boolean" class="mb-3" />-->
                                <b-form-input v-if="field.dataType=='Text'" :type="field.dataSubType" :readonly="field.readonly" :id="field.name" @input="setValue(field.name, $event)" :value="getValue(curRecord, field.name)" size="sm" v-bind:placeholder="errorInfo[field.name]"></b-form-input>
                                <!--<b-form-input v-if="field.dataType=='Text'" :type="field.dataSubType" :readonly="field.readonly" :id="field.name" v-on:change="setValue(this, field.name)" :value="getValue(curRecord, field.name)" size="sm" v-bind:placeholder="errorInfo[field.name]"></b-form-input>-->
                                <b-form-input v-if="field.dataType=='Number'" :type="field.dataSubType" :readonly="field.readonly" :id="field.name+field._id" v-model="curRecord[field.name]" size="sm" v-bind:placeholder="errorInfo[field.name]"></b-form-input>
                                <b-form-input v-if="field.dataType=='SYSTEM'" :type="field.dataSubType" readonly :id="field.name" :value="getSystemValue(curRecord, field.name)" size="sm" v-bind:placeholder="errorInfo[field.name]"></b-form-input>
                                <div class = "DIV_JSON" v-if="field.dataType=='JSON'">
                                    <!--<vue-json-pretty :data="JSON.parse(curRecord[field.name])"></vue-json-pretty>-->
                                    <vue-json-pretty :data="getJSON(curRecord[field.name])"></vue-json-pretty>
                                </div>


                                <b-form-textarea v-if="field.dataType=='TextArea'" rows=4 :type="field.dataSubType" :readonly="field.readonly" :id="field.name+field._id" v-model="curRecord[field.name]" size="sm" v-bind:placeholder="errorInfo[field.name]"></b-form-textarea>

                                <b-form-select v-if="field.dataType=='Menu'" v-model="curRecord[field.name]" :options="menu[field.name].menu" class="mb-3" size="sm" />
                            </b-form-group>
                        </div>

                    </div>
                </div>
            </div>
            <div class="rowt">
                <div class=" actionButton">
                    <!--<b-col col lg="2">-->
                    <button v-if="curRecord._id || newRec" v-on:click="newRecord" class="btn btn-outline-success">Create</button>
                    <button v-if="curRecord._id" v-on:click="saveRecord" class="btn btn-outline-success">Save</button>
                    <button v-if="curRecord._id || newRec" v-on:click="cancelRecord" class="btn btn-outline-success">Cancel</button>
                    <button v-if="curRecord._id" v-on:click="deleteRecord" class="btn btn-outline-danger">Delete</button>
                    <!--</b-col>-->
                </div>
            </div>
        </div>

        <b-alert show>List View</b-alert>
        <div id="listView" class="listView">
            <div class="rowt">
                <!--<div class="div50">{{ records }}</div>-->
                <div class="div50">
                    <b-pagination size="sm" :total-rows="records" v-model="page" :per-page="rowsPerPage">
                    </b-pagination>
                </div>

                <div class="div50">
                    <div class=" actionButton">

                        <!--<b-col col lg="2">-->
                        <button v-on:click="initRecord" class="btn btn-outline-success">New</button>
                        <button v-on:click="search" class="btn btn-outline-success">Search</button>
                        <button v-on:click="clear" class="btn btn-outline-success">Reset</button>
                        <button class="btn" style="border-color: #28a745;"><list-edit :collection='collection'></list-edit></button>
                        <!--</b-col>-->

                    </div>

                </div>
            </div>

            <div class="rowt">
                <div class=" actionButton">


                </div>
            </div>

        <!--<list-edit v-bind:data="data.collection"></list-edit>-->



        <table class="table">
            <thead>
            <tr>
                <th v-if="fields.active" v-for="fields in listLayout.fields" scope="col">{{ fields.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">

                <!--<td>{{item}} </td>-->
                <td v-if="fields.active" v-for="fields in listLayout.fields"  v-on:click="addQuery(fields['name'], item._id, item[fields['name']])" scope="row">
                    <!--{{item}} &#45;&#45;&#45;&#45; {{ fields }} -->
                    <button v-if="fields['dataType'] == 'Checkbox' && item[fields['name']] == true" type="button" class="btn btn-sm btn-outline-success">True</button>
                    <button v-if="fields['dataType'] == 'Checkbox' && item[fields['name']] != true" type="button" class="btn btn-sm btn-outline-secondary">False</button>
                    <div v-if="fields['dataType'] == 'Text'">{{ item[fields["name"]] }}</div>
                    <div v-if="fields['dataType'] == 'SYSTEM'">{{ getSystemValue(item, fields["name"]) }}</div>
                    <div v-if="fields['dataType'] == 'Menu'">{{ getMenuValue(item, fields["name"]) }}</div>
                    <div v-if="fields['dataType'] == 'Reference'">{{ getReferenceValue(item, fields["name"]) }}</div>
                    <button v-if="fields['dataType'] == 'ID'" type="button" class="btn btn-sm btn-outline-info">Open</button>

                </td>
            </tr>
            </tbody>
        </table>

    </div>

        <hr/>
        <b-btn v-b-toggle.curRecord variant="primary">Record</b-btn>
        <b-btn v-b-toggle.listLayout variant="primary">List Layout</b-btn>
        <b-btn v-b-toggle.formLayout variant="primary">Form Layout</b-btn>
        <b-btn v-b-toggle.fieldlist variant="primary">Field list</b-btn>
        <b-btn v-b-toggle.menu variant="primary">Menu</b-btn>
        <b-btn v-b-toggle.items variant="primary">Records</b-btn>
        <b-btn v-b-toggle.ref variant="primary">Ref Field List</b-btn>
        <b-btn v-b-toggle.miscellaneous variant="primary">Miscellaneous</b-btn>

        <b-collapse id="curRecord" class="mt-2">
            <h5>curRecord</h5>
            <vue-json-pretty :data="curRecord"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="listLayout" class="mt-2">
            <h5>List Layout</h5>
            <vue-json-pretty :data="listLayout"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="formLayout" class="mt-2">
            <h5>Form Layout</h5>
            <vue-json-pretty :data="formLayout"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="fieldlist" class="mt-2">
            <h5>Field list</h5>
            <vue-json-pretty :data="fieldlist"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="menu" class="mt-2">
            <h5>Menu</h5>
            <vue-json-pretty :data="menu"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="items" class="mt-2">
            <h5>Records</h5>
            <vue-json-pretty :data="items"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="ref" class="mt-2">
            <h5>Records</h5>
            <vue-json-pretty :data="refFieldList"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="miscellaneous" class="mt-2">
            <h5>Miscellaneous</h5>
            QueryText: {{ queryText }}
            <br/>Query:
            <vue-json-pretty :data="query"></vue-json-pretty>
        </b-collapse>

    </div>
</template>



<script>

    const axios = require('axios');

    import listEdit from './listEdit.vue'
    import formElement from './formElement.vue'
    import formLabel from './formLabel.vue'
    import { EventBus } from '../eventbus.js'
    // import coolSelect  from 'vue-cool-select'
    // import SwitchTheme from './SwitchTheme.vue'
    import $ from 'jquery'
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
    import _ from 'lodash'
    import VueJsonPretty from 'vue-json-pretty'
    var debounce = require('debounce');


    export default {
        name: "statistics",
        components: {formLabel, listEdit, formElement, VueBootstrapTypeahead, VueJsonPretty},

        data: function() {
            return {
                // Alerts
                alert: {
                    success: {
                        show:false,
                        text: ''
                    },
                    warning: {
                        show:false,
                        text: ''
                    },
                    error: {
                        show:false,
                        text: ''
                    }
                },
                // DICTIONARY
                listLayout: [],
                formLayout: [],
                menu: [],
                fieldlist: [],

                // PAGINATION
                selectedUser: null,
                users: [],

                page: 1,
                rowsPerPage: 10,

                refFieldList: [],
                refField:{},

                noData: false,
                // xx
                opt_boolean: [{ value: true, text: 'Yes' },{ value: false, text: 'No' }],
                name:"statistics",
                collection: "",

                counter:0,
                items: { },
                query: {},
                queryText: "",
                records: 0,
                curRecord: {},
                newRec: false,
                errorInfo: {},

                linkDictionary: ""
            }
        },
        watch: {
            refFieldList: {
                handler: function(prev, current) {
                    // let t = this
                    // console.log('refFieldList name ' + JSON.stringify(prev) + " "+ current)
                    // this.refFieldList.forEach(function(field) {
                    //     console.log('refFieldList name ' + JSON.stringify(field))
                    //     if (_.get(field, 'data', 'none') != 'none') {
                    //         if (field.data.length > 0) {
                    //
                    //             if (_.get(field.data[0], '_id', 'none') != 'none') {
                    //                 console.log('refFieldList has ID ' + JSON.stringify(field))
                    //                 t.curRecord[field.field] = field.data[0]['_id']
                    //             }
                    //         } else {
                    //             t.curRecord[field.field] = "";
                    //         }
                    //     }
                    // })
                },
                deep: true,
            },
            'refFieldData': {
                handler: function(prev, current) {
                    console.log('name ' + JSON.stringify(prev) + " "+ current)
                },
                deep: true,
            },
            'page': function(prev, current) {
                console.log(prev + " "+ current)
                let pageing = {
                    skip: (this.page -1 ) * this.rowsPerPage,
                    limit: this.rowsPerPage
                };
                this.search(pageing)
            },
            'refField2':

                _.debounce(function (addr) {
                    console.log(" refField")
                    this.getGroups(addr)
                }, 500)

        },
        created() {

        },
        mounted() {

            if (this.$route.query.col) {
                this.collection = this.$route.query.col
                this.linkDictionary = "list?col=dictionary&query=%7B\"coll\"%3A\"" + this.collection + "\"%7D";
            }
            if (this.$route.query.query) {
                this.queryText = decodeURIComponent(this.$route.query.query);
                try {
                    this.query = JSON.parse(decodeURIComponent(this.queryText));
                } catch (e) {
                    this.setMessage('error', 'Error parsing Query ' + this.queryText + "<br/>" + e)
                }
            }

            EventBus.$on("LIST_RELOAD", data => {
                console.log("EVENT LIST_RELOAD received");
                this.listLayout = [{dd:123}]
                axios({
                    method:'get',
                    url:'http://localhost:8089/query',
                    params: {
                        collection: "ListLayout",
                        query: JSON.stringify({coll:this.collection})
                    }
                }).then(response => (
                    this.listLayout = response.data.records[0])
                );

            })

            EventBus.$on("RELOAD_REF", data => {
                console.log("EVENT RELOAD_REF received" + JSON.stringify(data));
                let t = this
                this.refFieldList.forEach(function (set) {
                    if (set.field == data.field) {
                        set.data = data.data
                        console.log("RELOAD_REF2"+JSON.stringify(data));
                        console.log("RELOAD_REF3"+JSON.stringify(t.refField));

                        //t.refField[data.field] = "S"//data.name
                        // t.$refs.assignee.inputValue = "DD"
                    }
                })
            })
            EventBus.$on("TEST", data => {

                console.log("EVENT TEST received" + JSON.stringify(data));
                for( let key in this.$refs) {
                    console.log("mounted0: " + key + " - " + typeof this.$refs[key]);
                    let to = typeof this.$refs[key]
                    console.log("mounted0: " +to)
                    console.log("mounted0: " + typeof to)
                    if (to == 'object') {
                        console.log("mounted1: " + typeof to)
                        if (key == 'ReferenceField') {
                            this.$refs.ReferenceField[0].inputValue = "Tor";
                            this.$refs.ReferenceField[1].inputValue = "D";
                            for (let key in this.refFieldList) {
                                console.log("mounted3: " + key)
                                console.log("mounted2: " + this.refFieldList[key].data.length)
                                if (this.refFieldList[key].data.length == 1) {
                                    this.$refs.ReferenceField[key].inputValue = this.refFieldList[key].data[0].name;
                                }
                            }
                        }
                    }
                    // console.log("mounted1: " + key + " - " + this.$refs[key] + "I " + this.$refs[key].inputValue);
                    // for( let key2 in this.$refs[key]) {
                    //     console.log("mounted2: " + key2 + " - " + this.$refs[key][key2]);
                    // }
                    // console.log("mounted4: " + key);
                    //if (key == 'ReferenceField' && typeof this.$refs[key] == 'object')
                    //    this.$refs.ReferenceField[1].inputValue = "D";
                    // this.$refs[key].inputValue = "DDDDD"
                }
                for( let key in this.$refs) {
                    // console.log("mounted3: " + key + " - " + this.$refs[key] + "I " + this.$refs[key].inputValue);
                }
            })

            EventBus.$on("ERROR_INFO", data => {
                console.log("EVENT ERROR_INFO received");
            })



            console.log("LOAD FORM DICTIONARY")
            axios({
                method:'get',
                url:'http://localhost:8089/dictionary',
                params: {
                    collection: this.collection
                }
            })
            .then(response => (
                this.parseDictionary(response)

            )).then(response => (
                this.search()
            ))


        },
        computed: {
       },
        methods: {
            // UI FUNCTIONS
            setMessage(_type, _text) {
                console.log("setMessage " + new Date());
                if (_type == 'success') {
                    this.alert.success.show = true;
                    this.alert.success.text = _text;
                    setTimeout(function() {EventBus.$emit('CLEAR_ALARM',{alarm:"success"})}, 4000)
                }
                if (_type == 'warning') {
                    this.alert.warning.show = true;
                    this.alert.warning.text = _text;
                    setTimeout(function() {EventBus.$emit('CLEAR_ALARM',{alarm:"warning"})}, 8000)
                }
                if (_type == 'error') {
                    this.alert.error.show = true;
                    this.alert.error.text = _text;
                    setTimeout(function() {EventBus.$emit('CLEAR_ALARM',{alarm:"error"})}, 12000)
                }
            },

            getJSON: function(json) {
                console.log("IA:" + _.isArray(json))
                if (_.isString(json)) {
                    return JSON.parse(json);
                } else if (_.isArray(json)) {
                        return json;
                } else {
                    return json;
                }
            },
            getSystemValue: function(item, fn) {
                console.log("getSystemValue: " + fn + " " + JSON.stringify(item))
                let dv = 'none';
                if (fn == 'createdBy' || fn == 'updatedBy')
                    dv = ""+_.get(item, 'sys.['+fn+'].name','s2')
                if (fn == 'created' || fn == 'updated')
                    dv = String(_.get(item, 'sys.['+fn+']','s3')).replace(/T/," ").replace(/Z/," ").split(".")[0]
                return dv
            },
            getValue: function(item, fn) {
                console.log("getValue: " + fn + " " + JSON.stringify(item))

                var val = _.get(this.curRecord, fn, 'nf')


                return val;
            },
            setValue: function( fn, value ) {

                console.log("setValue: fn" + fn)
                console.log("setValue: v" + JSON.stringify(value))
                _.set(this.curRecord, fn, value)

                // var val = _.get(this.curRecord, type, 'nf')

                // console.log('1 '+$('#'+fn).val())
                // console.log($('#core.updated').val())
                // console.log($('#number').val())
                //
                //
                // var val = _.get(this.curRecord, fn, 'nf')
                //console.log("setValue: " + val);

                // return val;
            },
            getReferenceValue: function(item, fn) {
                console.log("getReferenceValue: " + fn + " " + JSON.stringify(item))
                let dv = _.get(item[fn],'name','')
                return dv
            },
            getMenuValue: function(item, fn) {
                console.log("getMenuValue: " + fn + " " + item[fn])
                try {
                    let dv = this.menu[fn].menu[_.findIndex(this.menu[fn].menu, {value: item[fn]})].text
                    return dv
                } catch (e) {
                    return "invalid"
                }
            },

            getRefData: function(d) {
                console.log("getRefData" + d)
                this.refFieldData2.forEach(function(set) {
                    console.log("getRefData: " + typeof  set.data + " " + JSON.stringify(set.data))
                    return set.data
                })
            },

            // clearAlarms: function() {
            //     this.closeAlert('success')
            // },
            // closeAlert: function(_alert) {
            //     this.alert[_alert].show = false
            // },

            reloadReference: _.debounce((d,e,f) => {
                console.log('reloadReference field:' + d + " Value: " + e + " Ref: " + f)

                axios({
                    method:'get',
                    url:'http://localhost:8089/query',
                    params: {
                        wquery: {name: e},
                        collection: f
                        // limit: paging.limit,
                        // skip: paging.skip
                    }
                }).then(response => (
                    console.log('reloadReference field:' + JSON.stringify(response)),
                    // this.refFieldData2 = response.data.records
                        EventBus.$emit('RELOAD_REF',{field:d, data:response.data.records})

                ))
            }, 500),

            updateSchema: function() {
                axios({
                    data: this.curRecord,
                    method:'put',
                    baseURL: 'http://localhost:8089/',
                    url: 'schema',
                    params: {
                        collection: this.collection
                    }


                }).then(response => (
                    console.log("AJAX RESP: " + JSON.stringify(response)),
                        // this.curRecord = response.data,
                        this.updateListView()
                ));
            },

            initRecord: function() {
                this.curRecord = {}
                this.newRec = true
            },

            newRecord: function() {
                // this.errorInfo = {}
                let display = '_id';
                console.log("newRecord"+JSON.stringify(this.curRecord))
                delete this.curRecord._id;
                let params = {
                    collection: this.collection
                }
                this.fieldlist.forEach(function (field) {
                    var regex1 = RegExp('func:getnumber');
                    if ( regex1.test(String(field.default)) ) {
                        params.getnumber = field.name
                    }
                    if (field.display) {
                        display = field.name;
                    }
                })
                axios({
                    data: this.curRecord,
                    method:'post',
                    baseURL: 'http://localhost:8089/',
                    url: 'create',
                    params: params

                }).then(response => {

                    this.errorInfo = {lastUpdate:new Date()}

                    console.log("parseRes 1 " + JSON.stringify(response))
                    console.log("parseRes" + JSON.stringify(this.errorInfo))
                    let errObj = _.has(response.data.error, 'errors')
                    console.log("errObj" + (errObj))

                    if (errObj) {
                        for (let key in response.data.error.errors) {
                            console.log(key);
                            this.errorInfo[key] = response.data.error.errors[key].message
                        }
                    }

                    let statObj = _.get(response.data, "status", "FAIL")
                    if (statObj == "FAIL") {
                        this.alert.error.text = JSON.stringify(response.data.error)
                        this.alert.error.show = true;
                        console.log("errObj" + response.data.status)
                    }
                    if (statObj == "OK") {
                        this.curRecord = response.data.record;
                        this.alert.success.show = true;
                        this.alert.success.text = response.data.record[display] + " created"
                        setTimeout(this.clearAlarms, 4000)
                    }
                })
            },



            saveRecord: function() {
                console.log("saveRecord" + JSON.stringify(this.curRecord,null, 4))

                axios({
                    data: this.curRecord,
                    method:'put',
                    baseURL: 'http://localhost:8089/',
                    url: 'save',
                    params: {
                        collection: this.collection,
                        _id: this.curRecord._id,
                        ids: JSON.stringify(this.getObjectIds())
                    }


                }).then(response => (
                    console.log("AJAX RESP: " + JSON.stringify(response)),
                        this.curRecord = response.data,
                        this.updateListView()
                ));

            },
            getObjectIds: function() {
                let o_id = [];

                this.refFieldList.forEach(function(field) {
                    console.log('refFieldList name ' + JSON.stringify(field));
                    if (_.get(field, 'data', 'none') != 'none') {
                        if (field.data.length == 1) {

                            if (_.get(field.data[0], '_id', 'none') != 'none') {
                                o_id.push({field: field.field, id: field.data[0]['_id']})
                            }
                        }
                    }
                })
                console.log("getObjectIds" + JSON.stringify(o_id,null, 4))
                return o_id;
            },
            deleteRecord: function(_id) {
                console.log("saveRecord" + this.curRecord.name)
                console.log("save"+JSON.stringify(this.curRecord))

                axios({
                    data: this.curRecord,
                    method:'delete',
                    baseURL: 'http://localhost:8089/',
                    url: 'delete',
                    params: {
                        collection: this.collection,
                        _id: this.curRecord._id
                    }


                }).then(response => (
                    console.log("AJAX RESP: " + JSON.stringify(response)),
                        this.curRecord = response.data,
                        this.updateListView()
                ));
            },
            cancelRecord: function(_id) {
                this.curRecord = {};
                this.newRecord = false
            },
            updateListView: function(_id) {
                let pageing = {
                    skip: (this.page -1 ) * this.rowsPerPage,
                    limit: this.rowsPerPage
                };
                this.search(pageing)

            },

            changeSearchCondition: function() {
                console.log("CSC:" + this.queryText)
                if (this.queryText == "")
                    this.query = {}
                else
                    this.query = JSON.parse(this.queryText)
            },
            addQuery: function(_attr,_id, _value) {
                // this.query[_attr] = _value
                // this.queryText = JSON.stringify(this.query)

                this.getRecord(_id)
            },
            id: function (elem) {
                alert("on: " +  elem)
            },
            clear: function() {
                this.queryText = "";
                this.query = {};
                this.search()
            },


            parseResponse: function(sin) {
                console.log("parseResponse: " + JSON.stringify(sin))
                this.curRecord = sin.records[0]
                let t = this
                this.fieldlist.forEach(function(field) {
                    if (field.dataType == 'Reference') {
                        axios({
                            method:'get',
                            url:'http://localhost:8089/query',
                            params: {
                                query: {_id: t.curRecord[field.name]},
                                collection: field.reference
                            }

                        }).then(response => (
                            console.log("XX"+JSON.stringify(response)),
                            t.refFieldList.forEach(function(field2) {
                                console.log("XX1 "+field.name + " " + JSON.stringify(field2))
                                if (field2.field == field.name && response.data.count == 1) {
                                    console.log("XX2 "+field.name + " " + JSON.stringify(field2))
                                    field2.data.push(response.data.records[0])
                                    // t.refField[field.name] = response.data.records[0].first_name
                                    EventBus.$emit('RELOAD_REF',{field:field.name, data:response.data.records})

                                }
                            }),
                                EventBus.$emit('TEST',{})
                            //,this.refFieldList.push(response.data.records[0])

                        )).then(EventBus.$emit('TEST',{}));
                    }

                })
                // for (let key in sin.records[0]) {
                //     console.log(key)
                //     this.curRecord[key] = sin.records[0][key]
                // }
                // let rec = this.curRecord;
                // let items = this.items
                // items.forEach(function (item) {
                //     if (item._id == sin[0]._id) {
                //         item = rec
                //     }
                // })
                // this.items = items;
            },

            getRecord: function(_id) {
                this.counter++;

                console.log("SEARCH QUERY:" + JSON.stringify(this.query))

                axios({
                    method:'get',
                    url:'http://localhost:8089/query',
                    params: {
                        query: {_id: _id},
                        collection: this.collection
                    }

                }).then(response => (
                    this.$route.query.id=response.data._id,
                    this.curRec = response.data,
                    this.parseResponse(response.data)
                ));

            },
            getGroups: function (_paging) {
                console.log(new RegExp(this.refField,"i"))
                let rf = this.refFieldData
                // rf = []
                axios({
                    method:'get',
                    url:'http://localhost:8089/query',
                    params: {

                        wquery: {name: this.refField},
                        collection: "group"
                        // limit: paging.limit,
                        // skip: paging.skip
                    }}).then(response => (
                        console.log("RESP"+JSON.stringify(response)),
                        this.refFieldData = response.data.records
                    ))

                // (
                //         console.log("RESP"+JSON.stringify(response)),
                //             this.refFieldData = response.data.records
                //         // this.records = response.data.count
                //     )
                // });
            },
            search: function (_paging) {
                this.counter++;
                console.log("SEARCH QUERY:" + JSON.stringify(this.listLayout))
                let menuFields = [];
                let refFields = [];
                this.fieldlist.forEach(function (field) {
                    if (field.dataType == 'Menu') {
                        menuFields.push(field.name)
                    }
                })
                this.refFieldList.forEach(function (field) {
                    refFields.push({f:field.field,m:field.reference})
                })
                let paging = {skip:0, limit: this.rowsPerPage}
                if (_paging)
                    paging = _paging
                console.log("SEARCH QUERY2:" + JSON.stringify(this.listLayout))
                axios({
                    method:'get',
                    url:'http://localhost:8089/query',
                    params: {
                        query: this.query,
                        collection: this.collection,
                        limit: paging.limit,
                        skip: paging.skip,
                        menu: JSON.stringify(menuFields),
                        ref: JSON.stringify(refFields)
                    }

                }).then(response => (
                    console.log("RESP"+JSON.stringify(response)),
                        this.items = response.data.records,
                        this.records = response.data.count
                ));


            },

            // P A R S E R
            parseDictionary: function(response) {
                // console.log("parseDictionary" +JSON.stringify(response,null,4))

                this.formLayout = response.data.form
                this.formLayout.rows.forEach(function (row) {
                    row.style = {width: (100/ row.columns.length) + '%'}
                })
                this.listLayout = response.data.listlayout[0]
                this.fieldlist = response.data.dictionary
                this.menu = response.data.menu
                let t = this
                this.fieldlist.forEach(function(field) {
                    if (field.dataType == 'Reference') {
                        t.refFieldList.push({field:field.name, data:[], reference: field.reference})
                        t.refField[field.name] = "";
                    }
                })
                console.log("parsedDictionary");
            }
        }
    }
</script>


<style lang="scss">

    body {
        margin: 2em;
    }

    .DIV_JSON {
        background: aliceblue;
        padding: 1em;
    }
    .div50 {
        float: left;
        width: 50%;
    }

    .div90 {
        float: left;
        width: 80%;
    }
    .divAlertButton {
        float: right;
        width: 10%;
    }

    .column {
        float: left;
        width: 33.33%;
        padding-left: 2em;
        padding-right: 1em;
    }

    .section {
        padding-top: 2em;
    }

    .section-header {
        padding-bottom: 1em;
    }

    /* Clear floats after the columns */
    .rowt:after {
        content: "";
        display: table;
        clear: both;
    }

    .dataView {
        padding: 10px;
    }
    .detailView {
        padding: 10px;
        border-style: solid;
        border-color: #cacaca;
        border-width: thin;
    }

    .listView {

        padding: 10px;
        border-style: solid;
        border-color: #cacaca;
        border-width: thin;
        ;
    }

    .actionButton {
        /*background: cornflowerblue;*/
        text-align: -webkit-right;
        width: 95%;
        padding: 5px;
    }

    .form-control::-webkit-input-placeholder { color: red; }  /* WebKit, Blink, Edge */
    .form-control:-moz-placeholder { color: red; }  /* Mozilla Firefox 4 to 18 */
    .form-control::-moz-placeholder { color: red; }  /* Mozilla Firefox 19+ */
    .form-control:-ms-input-placeholder { color: red; }  /* Internet Explorer 10-11 */
    .form-control::-ms-input-placeholder { color: red; }  /* Microsoft Edge */

</style>