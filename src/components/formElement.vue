<template>
    <!--<div style="background: cornflowerblue">-->
    <v-fragment>
            <div v-if="true" class="col-2">
                <label :for="label" class=" col-form-label" >{{ label }}</label>
            </div>
            <div v-if="true" class="col-4">
                <input type="text" class="form-control" placeholder="" :id="name">
            </div>
            <!--<div class="col-2">-->
                <!--<label for="first_name" class=" col-form-label" >First name</label>-->
            <!--</div>-->
            <!--<div class="col-4">-->
                <!--<input type="text" class="form-control" placeholder="First name" id="first_name">-->
            <!--</div>-->
        <!--</td></tr></table>-->
        </v-fragment>
    <!--</div>-->
</template>

<script>
    export default {
        name: "formElement",
        props: ['name','label']
    }
</script>

<style scoped>

</style>