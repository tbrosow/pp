<template>
    <!--<div style="background: cornflowerblue">-->
    <!--<table><tr><td>-->
    <div v-if="true" class="col-2">
    <label :for="label" class=" col-form-label" >{{ label }}</label>
    </div>
    <!--<div v-if="true" class="col-3">-->
        <!--<input type="text" class="form-control" placeholder="" :id="name">-->
    <!--</div>-->
    <!--<div class="col-2">-->
    <!--<label for="first_name" class=" col-form-label" >First name</label>-->
    <!--</div>-->
    <!--<div class="col-4">-->
    <!--<input type="text" class="form-control" placeholder="First name" id="first_name">-->
    <!--</div>-->
    <!--</td></tr></table>-->

    <!--</div>-->
</template>

<script>
    export default {
        name: "formLabel",
        props: ['name','label']
    }
</script>

<style scoped>

</style>