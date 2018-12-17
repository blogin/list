<template>
    <div>
        <div v-if="loadingOpt">Loading...</div>
        <table v-else class="table table-sm table-bordered">
          <tr v-for="(el,iEl) in options" :key="iEl">
            <td><input 
                    type="checkbox" 
                    v-model="el.checked" 
                    @change="onChecked" 
                    :value = "el.name"
                > {{ el.name }}</td>
            <td>{{ el.total }}</td>
          </tr>
        </table>
    </div>
</template>

<script>

import { mapGetters } from "vuex";
export default {
    computed:{
        ...mapGetters(["loadingOpt", "options", "list"])
    },
    methods:{
        onChecked(event){
            let notChecked = [];
            let obj = this.options;
            let objList = this.list;
            for (let i in obj) {
                obj[i].name == event.target.value ? obj[i].checked = event.target.checked : null;
                !obj[i].checked ? notChecked.push(obj[i].name) : null;
            }
            this.$store.commit("changeOptions", obj);
        }
    }
}
</script>

