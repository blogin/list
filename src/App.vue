<template>
  <div id="app" class="grid">
    <div class="control">
      <salary v-if="list"></salary>
      <category v-if="list"></category>
      <buttons v-if="list" id="cont-btn"></buttons>
    </div>

    <div class="content">
      <list></list>
    </div>
    <snackbar :class="{ show: showSnackBar }"/>
    <modal v-if="showModal"></modal>
  </div>
</template>

<script>
import salary from "@/components/salary.vue";
import category from "@/components/category.vue";
import list from "@/components/list.vue";
import buttons from "@/components/control-buttons.vue";
import snackbar from "@/components/snackbar.vue";
import modal from "@/components/Modal.vue";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    salary,
    category,
    list,
    buttons,
    snackbar,
    modal
  },
  computed: {
    ...mapGetters(["list", "showSnackBar","showModal"])
  }
};
</script>

<style>
#cont-btn {
  position: relative;
}
@media (max-width: 800px) {
  .control,
  .content {
    grid-column: span 2;
  }
}
#app {
  font-family: Roboto, "Helvetica Neue Light", "Helvetica Neue", Helvetica,
    Arial, "Lucida Grande", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #f7f7f7;
}
.grid {
  display: grid;
  grid-template-columns: 30% 1fr;
}
.control,
.content {
  margin: 0 5px;
}
.content {
  height: 97vh;
  overflow-y: hidden;
  overflow: auto;
}
/* Скрол для content*/
.content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}
.content::-webkit-scrollbar {
  width: 3px;
  background-color: #f5f5f5;
}
.content::-webkit-scrollbar-thumb {
  background-color: #b1afaf;
}
.content {
  border-left: 1px solid transparent;
  -moz-border-image: -moz-linear-gradient(
    to top,
    #f7f7f7 0%,
    #b30707 50%,
    #f7f7f7 100%
  );
  -webkit-border-image: -webkit-linear-gradient(
    to top,
    #f7f7f7 0%,
    #b30707 50%,
    #f7f7f7 100%
  );
  border-image: linear-gradient(
    to bottom,
    #f7f7f7 0%,
    #b30707 50%,
    #f7f7f7 100%
  );
  border-image-slice: 1;
} 

</style>
