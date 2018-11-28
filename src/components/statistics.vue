<template>

    <div id="" class="listView">
        <b-alert show>{{ records }} Records </b-alert>
        <input type="text" class="form-control" id="query" @change="changeSearchCondition"
               aria-describedby="emailHelp" placeholder="Enter query"  v-model="queryText">
        <button v-on:click="search">Search</button>
        <button v-on:click="clear">Clear</button>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Active</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
                <td v-on:click="addQuery('_id', item._id, item._id)" scope="row">{{ item._id }}</td>
                <td @click="addQuery('name', item._id, item.name)">{{ item.name }}</td>
                <td @click="addQuery('email', item._id, item.email)">{{ item.email }}</td>
                <td @click="addQuery('active', item._id, item.active)">{{ item.active }}</td>
            </tr>
            </tbody>
        </table>
        <b-alert show>Default Alert</b-alert>

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

    export default {
        name: "statistics",
        data: function() {
            return {
                name:"statistics",
                counter:0,
                items: { message:[{_id:1234}]},
                list: [],
                query: {},
                queryText: "",
                records: 0,
                curRecord: {}

            }
        },
        mounted() {
            console.log("mounterd")
            axios({
                method:'get',
                url:'http://localhost:8089/user',
                params: {
                    query: this.queryText
                }

            }).then(response => (this.items = response.data, this.records = this.items.length));

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
                        this.parseResponse(response.data)
                ));
            },
            parseResponse: function(sin) {
                console.log("PR"+JSON.stringify(sin))
                this.curRecord = {}
                for (let key in sin[0]) {
                    console.log(key)
                    this.curRecord[key] = sin[0][key]

                }
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

                }).then(response => (this.items = response.data, this.records = this.items.length));


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