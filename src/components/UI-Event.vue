<template>
    <div>

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
    </div>
</template>

<script>
    import { EventBus } from '../eventbus.js'

    export default {
        name: "UI-Event",
        props: {
            alert: Object
        },
        data: function () {
            return {
                // Alerts

            }
        },
        mounted() {

            console.log("UI EVENT mounted");

            if (this.$route.query.col) {
                // this.collection = this.$route.query.col
            }

            // EventBus.$on("UI-EVENT", payload => {
            //     console.log("UI EVENT received" + JSON.stringify(payload, null, 2));
            //
            //
            // })
        },
        watch: {
          'alert':  {
              handler: function(prev, current) {

              },
              deep: true,
          }
        },
        methods: {
            closeAlert2: function(_alert) {
                this.alert[_alert].show = false
            }
        }
    }
</script>

<style scoped>

</style>