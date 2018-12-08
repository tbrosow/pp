<template>

    <div class="listEditView1">

        <img v-b-modal.modal1 @click="openModal()" src="../assets/icons.24/cog.png"/>

        <!-- Modal Component -->
        <b-modal id="modal1" title="Edit List Layout" @ok="handleOk">
            <b-alert show> {{ collection }}  </b-alert>

            <table class="table">
                <thead>
                <tr>
                    <th>Label</th>
                    <th>Name</th>
                    <th>Order</th>
                    <!--<th>Active</th>-->
                    <th></th>
                    <th></th>

                </tr>
                </thead>
                <tbody>
                <tr v-for="(fields, index) in listLayout.fields">

                    <td>{{ fields.label}}</td>
                    <td>{{ fields.name}}</td>
                    <td>{{ fields.order}}</td>
                    <!--<td>{{ fields.order}}</td>-->
                    <td>
                        {{ index}} {{listLayout.fields.length}}
                        <button @click="up(index)" v-if="index>0" type="button" class="btn btn-sm btn-outline-info">Up</button>
                    </td>
                    <td>
                        <button @click="down(index)" v-if="!((index+1)==listLayout.fields.length)" type="button" class="btn btn-sm btn-outline-info">Down</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </b-modal>
    </div>

</template>

<script>
    const axios = require('axios');
    import { Eventbus } from '../eventbus.js'

    export default {
        name: "listEdit",
        props: {
          collection: {
              type: String,
              required: true
          }
        },
        data: function() {
            return {
                name: "???",
                data: "DATA",
                listLayout: []
            }
        },
        methods: {
            handleOk (evt) {
                console.log("ld" + JSON.stringify(this.listLayout,null,4))


                axios({
                    data: this.listLayout,
                    method:'put',
                    baseURL: 'http://localhost:8089/',
                    url: 'save',
                    params: {
                        collection: "ListLayout"
                    }

                }).then(response => (
                    // console.log("")
                    Eventbus.$emit('LIST_RELOAD',{collection:this.collection})
                ));


            },
            up: function (index, list) {

                let tmpList = [];
                this.listLayout.fields.reverse()
                this.listLayout.fields.forEach(function (entry) {
                    console.log(index)
                    if (entry.order < index) {
                        tmpList.push(entry)
                    } else if (entry.order == index) {
                        console.log(index + " -- ")
                        entry.order ++;
                        tmpList.push(entry)

                    } else if (entry.order == (index+1)) {
                        console.log(index + " ++ ")
                        entry.order --;
                        tmpList.push(entry)

                    } else if (entry.order > index) {
                        tmpList.push(entry)
                    }
                })
                this.listLayout.fields = tmpList;
                this.listLayout.fields.sort(function(a, b){return a.order-b.order});
            },
            down: function (index, list) {
                index++
                let tmpList = [];
                this.listLayout.fields.forEach(function (entry) {
                    if (entry.order < index) {
                        tmpList.push(entry)
                    } else if (entry.order == index) {
                        entry.order ++;
                        tmpList.push(entry)

                    } else if (entry.order == (index+1)) {
                        entry.order --;
                        tmpList.push(entry)

                    } else if (entry.order > index) {
                        tmpList.push(entry)
                    }
                })
                this.listLayout.fields = tmpList;
                this.listLayout.fields.sort(function(a, b){return a.order-b.order});
            },
            openModal: function () {
                console.log("OM")
                this.data = "DDDDSSS"+this.collection+"E"

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

            }
        }
    }
</script>

<style scoped>
    .listEditView {
        /*background: aquamarine;*/
        width: 24px;
    }
</style>