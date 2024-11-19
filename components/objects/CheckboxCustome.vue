<template>
    <div>
        <el-checkbox  v-model="CheckAll"  @change="onchange" />

    </div>
</template>
<script>
export default {
    props:{
        value: {}
    },
    data() {
        return {
            CheckAll: this.value,
        }
    },
    watch:{
        value(){
            this.CheckAll = this.value
            console.log(this)
        }
    },
    methods: {
        onchange(){
            this.$emit("change",this.CheckAll)
            this.$emit("input",this.CheckAll)
        }
    },
}
</script>
<style>
    
</style>