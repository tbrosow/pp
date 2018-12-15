<template>
    <!--<vue-grid-layout>123</vue-grid-layout>-->
    <div>
        <u-i-event :alert="alert"></u-i-event>
        <div>
            <b-btn v-b-modal.modal1>New Section</b-btn>

            <!-- Modal Component -->
            <b-modal id="modal1" title="Form Builder"
                     @ok="addSection"
            >
                <p class="my-4">Add a new form section</p>
                <b-form-input v-model="newSection"
                              type="text"
                              placeholder="Enter your section name"></b-form-input>
            </b-modal>
        </div>
        <div v-for="(row, rindex) in layout.layouts">
            <grid-layout
                    :layout="row"
                    :col-num="4"
                    :row-height="30"
                    :is-draggable="true"
                    :is-resizable="false"
                    :is-mirrored="false"
                    :vertical-compact="false"
                    :margin="[10, 20]"
                    :use-css-transforms="true"
                    @layout-updated="layoutUpdatedEvent"

            >

                <grid-item v-for="(item, ik) in row" :style="item.style"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :i="item.i">
                    {{item.i}}
                </grid-item>
            </grid-layout>
            <hr/>
        </div>

        <hr/>
        <b-btn v-b-toggle.layout variant="primary">Layout</b-btn>
        <!--<b-btn v-b-toggle.listLayout variant="primary">List Layout</b-btn>-->
        <b-btn v-b-toggle.formLayout variant="primary">Form Layout</b-btn>
        <b-btn v-b-toggle.fieldlist variant="primary">Field list</b-btn>
        <!--<b-btn v-b-toggle.menu variant="primary">Menu</b-btn>-->
        <!--<b-btn v-b-toggle.items variant="primary">Records</b-btn>-->
        <!--<b-btn v-b-toggle.ref variant="primary">Ref Field List</b-btn>-->

        <b-collapse id="layout" class="mt-2">
            <h5>Layout</h5>
            <vue-json-pretty :data="layout"></vue-json-pretty>
        </b-collapse>
        <b-collapse id="listLayout" class="mt-2">
            <h5>List Layout</h5>
            <!--<vue-json-pretty :data="listLayout"></vue-json-pretty>-->
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
            <!--<vue-json-pretty :data="menu"></vue-json-pretty>-->
        </b-collapse>
        <b-collapse id="items" class="mt-2">
            <h5>Records</h5>
            <!--<vue-json-pretty :data="items"></vue-json-pretty>-->
        </b-collapse>
        <b-collapse id="ref" class="mt-2">
            <h5>Records</h5>
            <!--<vue-json-pretty :data="refFieldList"></vue-json-pretty>-->
        </b-collapse>

    </div>
</template>

<script>
    const axios = require('axios');
    import _ from 'lodash'
    var debounce = require('debounce');

    // import listEdit from './listEdit.vue'
    // import formElement from './formElement.vue'
    // import formLabel from './formLabel.vue'
    import { EventBus } from '../eventbus.js'
    // import coolSelect  from 'vue-cool-select'
    // import SwitchTheme from './SwitchTheme.vue'
    // import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
    import VueJsonPretty from 'vue-json-pretty'


    import VueGridLayout from 'vue-grid-layout'
    import UIEvent from './UI-Event.vue'

    var GridLayout = VueGridLayout.GridLayout;
    var GridItem = VueGridLayout.GridItem;

    export default {
        name: "formBuilder",
        components: {GridLayout, GridItem, VueJsonPretty, UIEvent },
        data: function () {
            return {
                newSection: "",
                alert: {
                    success: {
                        show: false,
                        text: ''
                    },
                    warning: {
                        show: false,
                        text: ''
                    },
                    error: {
                        show: false,
                        text: ''
                    }
                },
                fieldlist: [],
                formLayout: [],
                layout: {layouts: []},
                layout2: [
                    {"x":0,"y":3,"w":4,"h":2,"i":"BBBB"},
                    {"x":0,"y":2,"w":2,"h":4,"i":"AAAA"},
                    {"x":0,"y":1,"w":2,"h":5,"i":"CCCCCC"},
                    {"x":0,"y":0,"w":2,"h":3,"i":"DDDDDD"},
                    {"x":8,"y":0,"w":2,"h":3,"i":"4"},
                    {"x":10,"y":0,"w":2,"h":3,"i":"5"},
                    {"x":0,"y":5,"w":2,"h":5,"i":"6"},
                    {"x":2,"y":5,"w":2,"h":5,"i":"7"},
                    {"x":4,"y":5,"w":2,"h":5,"i":"8"},
                    {"x":6,"y":4,"w":2,"h":4,"i":"9"},
                    {"x":8,"y":4,"w":2,"h":4,"i":"10"},
                    {"x":10,"y":4,"w":2,"h":4,"i":"11"},
                    {"x":0,"y":10,"w":2,"h":5,"i":"12"},
                    {"x":2,"y":10,"w":2,"h":5,"i":"13"},
                    {"x":4,"y":8,"w":2,"h":4,"i":"14"},
                    {"x":6,"y":8,"w":2,"h":4,"i":"15"},
                    {"x":8,"y":10,"w":2,"h":5,"i":"16"},
                    {"x":10,"y":4,"w":2,"h":2,"i":"17"},
                    {"x":0,"y":9,"w":2,"h":3,"i":"18"},
                    {"x":2,"y":6,"w":2,"h":2,"i":"19"}
                ],
                style: {
                    section: {
                        color:'whitesmoke',
                        padding: "10px",
                        'font-weight': 'bold',
                        background: 'darkturquoise'

                    },
                    field: {
                        color:'whitesmoke',
                        padding: "10px",
                        'font-weight': 'bold',
                        background: '#7f85a7'
                    }
                }
            }
        },
        mounted() {

            if (this.$route.query.col) {
                this.collection = this.$route.query.col
            }

            EventBus.$on("CLEAR_ALARM", payload => {
                console.log("EVENT CLEAR_ALARM received: " + new Date() + "[" + JSON.stringify(payload, null, 2)+"]");
                let x = _.get(payload,'alarm','xxx')
                if (x == 'success' || x == 'warning' || x == 'error')
                    this.alert[x].show = false;

            })

            EventBus.$on("UI-EVENT", payload => {
                console.log("UI EVENT received" + JSON.stringify(payload, null, 2));

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
            ))


        },
        methods: {
            addSection: function() {
                this.layout.layouts[0].push(
                    {
                        x:3,
                        y:1,
                        w:1,
                        h:2,
                        i:this.newSection,
                        style:this.style.section,
                        section:true,
                        id:"",
                        row:0
                    })
            },
            closeAlert: function(_alert) {
                // this.alert[_alert].show = false
            },
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
            // P A R S E R
            genColumn: function(col, colObj) {
                let column = { sections: []}
                console.log("genColumn ");
                // console.log("Column " + col + JSON.stringify(colObj, null, 2))
                let t = this;

                let section = false;
                let curSection = {fields: []};
                let sections = 0;
                colObj.forEach(function (item) {
                    if (item.section) {
                        if (sections > 0) {
                            column.sections.push(curSection);

                        }
                        sections++;
                        curSection = {
                            index: (sections-1),
                            header: item.i,
                            fields: []
                        }

                    }
                    if (!item.section) {
                        let curfield = {}
                        t.fieldlist.forEach(function(field) {
                            if (field._id == item.id) {
                                curfield = field
                                curfield.index = curSection.fields.length
                            }
                        })
                        curSection.fields.push(curfield)
                    }
                })
                column.sections.push(curSection);
                // console.log("Column " + col + JSON.stringify(column, null, 2))
                return column;
            },

            layoutUpdatedEvent: function(newLayout) {
                let t = this;
                console.log("Updated layout: ", JSON.stringify(newLayout, null, 2))
                let col1 =[];
                let col2 =[];
                let col3 =[];
                let row = 0;
                newLayout.forEach(function (item) {
                    row = item.row;
                    if (item.x == 0) {
                        col1.push(item)
                    }
                    if (item.x == 1) {
                        col2.push(item)
                    }
                    if (item.x == 2) {
                        col3.push(item)
                    }

                })

                col1 = _.sortBy(col1, [function (o) {return o.y}])
                col2 = _.sortBy(col2, [function (o) {return o.y}])
                col3 = _.sortBy(col3, [function (o) {return o.y}])

                let columns = [];

                // let newFL = {
                //     view: this.formLayout.view,
                //     _id: this.formLayout._id,
                //     coll: this.formLayout.coll,
                //     rows: [{index:0, columns:[]}]
                // }

                if (col1.length > 0) {
                    col1 = this.genColumn(0, col1)
                    columns.push(col1)
                }
                if (col2.length > 0) {
                    col2 = this.genColumn(0, col2)
                    columns.push(col2)
                }
                if (col3.length > 0) {
                    col3 = this.genColumn(0, col3)
                    columns.push(col3)
                }
                this.formLayout.rows = [];
                this.formLayout.rows[0] = {index:row, columns:columns};

                console.log("SAVE: " + JSON.stringify(this.formLayout,null,4));

                axios({
                    data: this.formLayout,
                    method:'put',
                    baseURL: 'http://localhost:8089/',
                    url: 'formlayout',
                    params: {
                        _id: this.formLayout._id,
                    }

                }).then(response => {
                    console.log("RESP: " +JSON.stringify(response,null,4));
                    if (response.data.status == 'OK') { this.setMessage('success', "Form Layout updated.") }
                })
            },
            parseDictionary: function(response) {

                console.log("parseDictionary" +JSON.stringify(response,null,4))
                console.log("parseDictionary" +JSON.stringify(this.layout,null,4))
                this.formLayout = response.data.form




                for (let idx1 = 0; idx1 < this.formLayout.rows.length; idx1++) {
                    let row = this.formLayout.rows[idx1];
                    let layout = [];
                    console.log(idx1)
                    for (let idx2 = 0; idx2 < row.columns.length; idx2++) {
                        console.log(idx1 + " " + idx2)
                        let column = row.columns[idx2]
                        let y = 0;
                        for (let idx3 = 0; idx3 < column.sections.length; idx3++) {
                            console.log(idx1 + " " + idx2 + " " + idx3)
                            let section = column.sections[idx3];
                            //let y = 1000 * (row.index+1) + 100*(column.index+1) + 10*(section.index+1);

                            layout.push(
                                {
                                    x:idx2,
                                    y:++y,
                                    w:1,
                                    h:2,
                                    i:section.header + " ",
                                    style:this.style.section,
                                    section:true,
                                    id:"",
                                    row:idx1
                                })
                            for (let idx4 = 0; idx4 < section.fields.length; idx4++) {
                                console.log(idx1 + " " + idx2 + " " + idx3 + " " + idx4)
                                let field = section.fields[idx4];
                                //let y = 1000 * (row.index+1) + 100*(column.index+1) + 10*(section.index+1) + field.index;
                                layout.push({x:idx2, y:++y, w:1, h:2, i:field.label, style: this.style.field, section:false, id:field._id,row:idx1})
                            }
                        }
                    }
                    let y = 0;
                    let t = this;
                    response.data.dictionary.forEach(function(dic) {
                        console.log(dic.name)

                        layout.push({x:3, y:++y, w:1, h:2, i:dic.label + " [" + dic.name + "]", style: t.style.field, section:false, id:dic._id, row:4})
                    })
                    this.layout.layouts.push(layout)
                }



                console.log("parseDictionary" +JSON.stringify(this.layout,null,4))

                this.formLayout.rows.forEach(function (row) {
                    row.style = {width: (100/ row.columns.length) + '%'}
                })
                this.fieldlist = response.data.dictionary
                let t = this

            }
        }
    }
</script>

<style scoped>
    /*** EXAMPLE ***/
    #content {
        width: 100%;
    }

    .vue-grid-layout {
        background: #eee;
    }

    .layoutJSON {
        background: #ddd;
        border: 1px solid black;
        margin-top: 10px;
        padding: 10px;
    }

    .eventsJSON {
        background: #ddd;
        border: 1px solid black;
        margin-top: 10px;
        padding: 10px;
        height: 100px;
        overflow-y: scroll;
    }

    .columns {
        -moz-columns: 120px;
        -webkit-columns: 120px;
        columns: 120px;
    }



    /*.vue-resizable-handle {
        z-index: 5000;
        position: absolute;
        width: 20px;
        height: 20px;
        bottom: 0;
        right: 0;
        background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
        background-position: bottom right;
        padding: 0 3px 3px 0;
        background-repeat: no-repeat;
        background-origin: content-box;
        box-sizing: border-box;
        cursor: se-resize;
    }*/

    .vue-grid-item:not(.vue-grid-placeholder) {
        background: #ccc;
        border: 1px solid black;
    }

    .vue-grid-item.resizing {
        opacity: 0.9;
    }

    .vue-grid-item.static {
        background: #cce;
    }

    .vue-grid-item .text {
        font-size: 24px;
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 100%;
        width: 100%;
    }

    .vue-grid-item .no-drag {
        height: 100%;
        width: 100%;
    }

    .vue-grid-item .minMax {
        font-size: 12px;
    }

    .vue-grid-item .add {
        cursor: pointer;
    }

    .vue-draggable-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 0;
        left: 0;
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
        background-position: bottom right;
        padding: 0 8px 8px 0;
        background-repeat: no-repeat;
        background-origin: content-box;
        box-sizing: border-box;
        cursor: pointer;
    }
</style>