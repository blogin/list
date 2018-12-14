<template>
    <div class="control-el">
      <div>
        <button @click = "addToList" class="btn btn-success">Add</button>
        <button @click = "addListToDB" class="btn btn-info">Add to DB</button>
        <button class="btn btn-info">Download</button>
      </div>
      <div>
        <transition name="fade" v-on:enter="showAlert">
            <div class="alert alert-m alert-danger" v-if="show"> Необходимо заполнить все поля !!!</div>
        </transition>
      </div>
      <div>
        <transition name="fade" v-on:enter="showAlert">
            <div class="alert alert-m alert-danger" v-if="dbSuccess"> Данные успешно внесены </div>
        </transition>
      </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["show", "nameOfList", "list", "dbSuccess", "options"])
  },
  methods: {
    ...mapMutations(["addToList", "showMessage"]),
    showAlert() {
      setTimeout(() => {
        this.$store.commit("showMessage", false);
      }, 2000);
    },
    addListToDB() {
      //console.log(this.list);
      this.$store.dispatch("putList", { 0: this.nameOfList, 1: this.list });
      this.$store.dispatch("putOptions", this.options);
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>


