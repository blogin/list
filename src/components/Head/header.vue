<template>
    <div>
        <table class="table table-sm table-bordered">
            <tr>
                <td>
                    <select @change="getCurMoney" class="form-control form-control-sm">
                        <option value="ЗП">Зарплата в {{ getMonth }}</option>
                        <option value="Аванс">Аванс в {{ getMonth }}</option>
                    </select>
                </td>
                <td>
                    {{ loadingYear === true ? "Loading..." : money }}
                </td>
            </tr>
            <tr>
              <td>Остаток</td>
              <td>{{ loadingYear === true ? "Loading..." : (money - costs).toFixed(2)}}</td>
            </tr>
            <tr>
              <td>Расходы всего \ по категориям </td>
              <td>{{ costs }} \ {{ showCosts}}</td>
            </tr>
        </table>
        <hr>
        <table class="table table-sm table-bordered">
          <tr>
            <td>Положить на сбер</td>
            <td>{{ toSber }}</td>
          </tr>
          <tr>
            <td>Оставить наличкой дома</td>
            <td>{{ toNal }}</td>
          </tr>
        </table>
        <hr>
        <Options></Options>
        <Controls></Controls>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Options from './options.vue';
import Controls from "./controls.vue";
export default {
  computed: {
    ...mapGetters(["salYear", "money", "loadingYear", "costs", "showCosts", "toSber", "toNal"]),
    getMonth() {
      for (let i = 1; i < 13; i++) {
        let a = new Date().toLocaleString("ru", { month: "long" });
        a = a.slice(0, -1);
        a = a + "e";
        return a;
      }
    }
  },
  methods:{
      getCurMoney(event){
          let obj = this.salYear 
          let d = new Date().toLocaleString("en", { month: "long" }); 
          for (let i in obj){
              if (obj[i].name == d){
                  event.target.value == "ЗП" 
                    ? this.$store.commit('setMoney', obj[i].salary+'~10')
                    : this.$store.commit('setMoney', obj[i].backfire+'~25')
              }
          }
      }
  },
  components:{
      Options,
      Controls
  }
};
</script>