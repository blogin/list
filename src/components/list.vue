<template>
    <div>
        <div class="list">
            <div v-if="loadingList">Loading...</div>
            <template v-else >
                <div v-for="(l,i) in list" :key="i" v-if="l.show" class="chList">
                    <input id="cost" 
                        type="number" 
                        v-focus
                        v-model="l.cost"
                        class="form-control form-control-sm"
                        v-on:keyup.enter="costCalculate"
                    >
                    <input type="text" v-model="l.name" key="1" class="form-control form-control-sm">
                    <select v-model="l.sel" @change="costCalculate" class="form-control form-control-sm">
                    <option v-for="(el,iEl) in options" :key="iEl">
                        {{ el.name }}
                    </option>
                    </select>
                    <button @click="removeListItem(i)" class="CustomBtn">x</button>            
                </div>
            </template>
        </div>       
    </div>
</template>

<script>
const focus = {
  inserted(el) {
    el.focus();
  }
};
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
export default {
  directives: { focus },
  computed: {
    ...mapGetters(["loadingList", "list", "options"])
  },
  methods: {
    ...mapMutations(["costCalculate"]),
    removeListItem(index) {
      this.$delete(this.list, index);
      this.$store.commit("costCalculate");
    }
  }
};
</script>

<style scoped>
.form-control{
  border-left:none;
  border-top:none;
  border-right:none;
}
.form-control:focus{
    border-color: #cccccc;
    -webkit-box-shadow: none;
    box-shadow: none;
}
.list {
  height: 97vh;
  overflow-y: hidden;
  overflow: auto;
}
/* Let's get this party started */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: rgba(220, 220, 220, 0.8);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(256, 256, 256, 0.4);
}
.CustomBtn {
  width: 30px;
  height: 30px;
  text-justify: auto;
  border-radius: 5px;
  border:none;
  background-color: rgb(238, 94, 94);
  color:rgb(247, 238, 238);

}
.chList{
  display: grid;
  grid-template-columns: 10% 20% 10% 4%;
  grid-gap:3px;
  margin:2px 0;
}
</style>



