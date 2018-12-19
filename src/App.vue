<template>
  <div id="app">
    <Header id="head"></Header>
    <List id="list"></List>
    <modal></modal>
  </div>
</template>

<script>
import Header from "./components/Head/header.vue";
import List from "./components/list.vue";
import modal from "./components/modal.vue";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    Header,
    List,
    modal
  },
  computed: {
    ...mapGetters(["isModalVisible"])
  },
  methods: {
    closeModal() {
      this.$store.commit("modalVisible", false)
    }
  },
  mounted() {
    this.$store.dispatch("getOptions"); // загружается список опций
    this.$store.dispatch("getList", "10"); // Загружается список расходов и применяются опции
    this.$store.dispatch("getYearSalary"); // Загружается ЗП и расчитываются расходы от списка расходов
  }
};
</script>

<style scoped>
@media (max-width: 800px) { 
  #head, #list {
    grid-column: span 2;
  }
}
#app {
  display: grid;
  grid-template-columns: minmax(100px, 35%) 1fr;
  margin: 10px;
  grid-gap: 10px;
}
</style>


