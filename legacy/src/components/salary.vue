<template>
  <div>
    <loading v-if="!salary"></loading>
    <div v-if="salary">
      <table>
        <tr>
          <td>{{ curDay > 13 ? "Аванс" : "Зап.плата" }} в {{ curMonth }}</td>
          <td>
            <output style="color:green;">{{ curDay > 13 ? salary[0].backfire : salary[0].salary }}</output>
          </td>
        </tr>
        <tr>
          <td>Остаток | Расходы</td>
          <td>
            <output :class="{'green': restOfMoney >= 0, 'red': restOfMoney < 0}">{{ restOfMoney }}</output> |
            <output style="color:red;">{{ allExpenses }}</output>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import loading from "@/components/loading.vue";

export default {
  data() {
    return {
      curDay: new Date().toLocaleString("ru", { day: "2-digit" })
    };
  },
  watch: {
    list() {
      this.calcRestOfMoney();
    }
  },
  computed: {
    ...mapGetters(["salary", "restOfMoney", "allExpenses"]),
    curMonth() {
      let m = new Date().toLocaleString("ru", { month: "long" });
      m = m.slice(0, -1) + "e";
      return m;
    }
  },
  mounted() {
    this.$store.dispatch("getSalary");
  },
  components: {
    loading
  },
  methods: {
    calcRestOfMoney() {
      this.restOfMoney = parseInt(this.list.map(e => e["cost"])).reduce(
        (a, b) => {
          return a + b;
        }
      );
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
}
td:nth-child(1) {
  width: 180px;
}
td:nth-child(2) {
  width: auto;
}
.green {
  color: green;
  transition: 0.7s;
}
.red {
  color: #b30707;
  transition: 0.7s;
}
</style>
