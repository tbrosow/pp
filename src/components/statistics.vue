<template>

    <div id="" class="listView">
        <div class="alert alert-dark" role="alert">
        List {{ collection }}: {{ records }} Records
        </div>
        <!--<b-alert show>{{ listLayout }} listLayout </b-alert>-->


        <!--<list-edit v-bind:data="data.collection"></list-edit>-->
        <list-edit :collection='collection'></list-edit>
        <b-container class="bv-example-row">

            <b-row>
                <b-col><input type="text" class="form-control" id="query" @change="changeSearchCondition"
                              aria-describedby="emailHelp" placeholder="Enter query"  v-model="queryText"></b-col>
                <b-col cols="12" md="auto"></b-col>
                <b-col col lg="2">
                    <button v-on:click="search">Search</button>
                    <button v-on:click="clear">Clear</button></b-col>
            </b-row>
        </b-container>

        <table class="table">
            <thead>
            <tr>
                <th v-for="fields in listLayout.fields" scope="col">{{ fields.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">


                <td v-for="fields in listLayout.fields"  v-on:click="addQuery(fields['name'], item._id, item[fields['name']])" scope="row">
                    <button v-if="fields['datatype'] == 'Checkbox' && item[fields['name']] == true" type="button" class="btn btn-sm btn-outline-success">True</button>
                    <button v-if="fields['datatype'] == 'Checkbox' && item[fields['name']] != true" type="button" class="btn btn-sm btn-outline-secondary">False</button>
                    <div v-if="fields['datatype'] == 'Text'">{{ item[fields["name"]] }}</div>
                    <button v-if="fields['datatype'] == 'ID'" type="button" class="btn btn-sm btn-outline-info">Open</button>

                </td>
            </tr>
            </tbody>
        </table>

         <b-alert show>Form Section</b-alert>

        <hr/>
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" v-model="curRecord.email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="exampleInputEmail1">Name</label>
                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" v-model="curRecord.name">

            </div>
            <div class="form-group">
                <label for="exampleInputEmail1">ID</label>
                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" v-model="curRecord._id">

            </div>

            <div class="form-check">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="curRecord.active">
                    Active User
                </label>
            </div>

            <button type="button" class="btn btn-primary" @click="save(curRecord._id)">Save</button>
        </form>


    </div>
</template>



<script>
    const axios = require('axios');

    import listEdit from './listEdit.vue'
    import eventbus from '../eventbus'

    export default {
        name: "statistics",
        components: {listEdit},

        data: function() {
            return {
                name:"statistics",
                collection: "user",
                counter:0,
                items: { message:[{_id:1234}]},
                listLayout: [],
                query: {},
                queryText: "",
                records: 0,
                curRecord: {},

            }
        },
        created() {

        },
        mounted() {
            console.log("mounterd")
            eventbus.$on("LIST_RELOAD", data => {
                this.xxx = "EVENT received"
                this.listLayout = [{dd:123}]
                axios({
                    method:'get',
                    url:'http://localhost:8089/query',
                    params: {
                        collection: "ListLayout",
                        query: JSON.stringify({coll:"user"})
                    }
                }).then(response => (
                    this.listLayout = response.data[0])
                );
            })

            axios({
                method:'get',
                url:'http://localhost:8089/user',
                params: {
                    query: this.queryText
                }

            }).then(response => (
                this.items = response.data.sort(function(a, b){return a.order-b.order}),
                this.records = this.items.length)
            );

            axios({
                method:'get',
                url:'http://localhost:8089/query',
                params: {
                    collection: "ListLayout",
                    query: JSON.stringify({coll:"user"})
                }

            }).then(response => (
                // console.log("AJAX RESP: " + JSON.stringify(response)),
                this.listLayout = response.data[0])
            );

        },
        methods: {
            save: function(_id) {
                console.log("SAVE CR12" + _id)
                console.log("save"+JSON.stringify(this.curRecord))

               axios({
                    data: this.curRecord,
                    method:'put',
                    baseURL: 'http://localhost:8089/',
                    url: 'user'



                }).then(response => (
                    this.curRec = response.data,
                        this.search()
                ));
            },
            parseResponse: function(sin) {
                console.log("parseResponse: " + JSON.stringify(sin))
                this.curRecord = {}
                for (let key in sin[0]) {
                    console.log(key)
                    this.curRecord[key] = sin[0][key]
                }
                let rec = this.curRecord;
                let items = this.items
                items.forEach(function (item) {
                    console.log("HIT1: " + item._id + " " + items.length)
                    console.log("parseResponse2: " + JSON.stringify(rec))
                    console.log("HIT2: " + item._id + " " + items.length)
                    console.log("HIT3: " + item._id + " " + item._id)
                    if (item._id == sin[0]._id) {
                        console.log("HIT3")
                        item = rec
                    }
                })
                this.items = items;
            },
            changeSearchCondition: function() {
                console.log("CSC:" + this.queryText)
                if (this.queryText == "")
                    this.query = {}
                else
                    this.query = JSON.parse(this.queryText)
            },
            addQuery: function(_attr,_id, _value) {
                this.query[_attr] = _value
                this.queryText = JSON.stringify(this.query)
                this.f_email = _value
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
            getRecord: function(_id) {
                this.counter++;

                console.log("SEARCH QUERY:" + JSON.stringify(this.query))

                axios({
                    method:'get',
                    url:'http://localhost:8089/user',
                    params: {
                        query: {_id: _id}
                    }

                }).then(response => (
                    this.curRec = response.data,
                    this.parseResponse(response.data)
                ));

            },
            search: function () {
                this.counter++;
                console.log("SEARCH QUERY:" + JSON.stringify(this.query))

                axios({
                    method:'get',
                    url:'http://localhost:8089/user',
                    params: {
                        query: this.query
                    }

                }).then(response => (
                    console.log("RESP"+JSON.stringify(response)),
                        this.items = response.data,
                        this.records = this.items.length
                ));


            }
        }
    }
</script>


<style lang="scss">

    .listView {

        padding: 10px;
        border-style: solid;
        border-color: #cacaca;
        border-width: thin;
        ;
    }
</style>