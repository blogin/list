<template>
    <div class="control-el">
      <div>
        <button @click = "addToList" id="add" class="btn btn-success">Add</button>
        <button @click = "addListToDB" id="addDb" class="btn btn-success">Add to DB</button>
        <button @click = "copyLastList" id="copy" class="btn btn-success">Copy</button>        
        <b-btn v-b-modal.modal-list>List</b-btn>
        <button @click = "resetCheckboxes" class="btn btn-info" >Reset Checkbox</button>
      </div>
      <div>
        <transition name="fade" v-on:enter="showAlert">
            <div class="alert alert-m alert-danger" v-if="show"> Необходимо заполнить все поля !!!</div>
        </transition>
      </div>
      <div>
        <transition name="fade" v-on:enter="showAlert">
            <div class="alert alert-m alert-success" v-if="dbSuccess"> Данные успешно внесены </div>
        </transition>
      </div>
      <div>
        <transition name="fade" v-on:enter="showAlert">
            <div class="alert alert-m alert-danger" v-if="nullOfList"> Предыдущий список пуст </div>
        </transition>
      </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "show",
      "nameOfList",
      "list",
      "dbSuccess",
      "options",
      "nullOfList",
      "isModalVisible"
    ])
  },
  methods: {
    ...mapMutations(["addToList", "showMessage", "copyLastList", "resetCheckboxes"]),
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
@media (max-width: 800px) {
  #copy {
    display: none;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
button {
  margin: 0 5px;
}
.alert {
  margin: 10px 0;
}
</style>


