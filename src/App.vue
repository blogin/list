<template>
  <div id="app">
    <Header></Header>
    <Options></Options>
    <List></List>    
    <Controls></Controls>
  </div>
</template>

<script>
import Header from "./components/Head/header.vue"
import Options from "./components/Head/options.vue"
import Controls from "./components/Head/controls.vue"
import List from "./components/list.vue"

export default {
  name: "app",
  components: {
    Header,
    Options,
    List,
    Controls
  },
  mounted() {    
    this.$store.dispatch("getOptions");     // загружается список опций
    this.$store.dispatch("getList","10");   // Загружается список расходов и применяются опции
    this.$store.dispatch("getYearSalary");  // Загружается ЗП и расчитываются расходы от списка расходов

  }
};
</script>

<style scoped>
#app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 10px;
  grid-gap: 10px;
}
</style>


