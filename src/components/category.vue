<template>
  <div>
    <loading v-if="!category"></loading>
    <table v-if="category">
      <tr v-for="(cat,i) in category" :key="i">
        <td style="padding:0px;">
          <label>
            <input
              type="checkbox"
              class="option-input checkbox"
              :checked="cat.checked"
              :value="cat.name"
              v-model="checkedCategory"
            >
            {{ cat.name }}
          </label>
        </td>
        <td>{{ cat.total }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import loading from "@/components/loading.vue";

export default {
  data() {
    return {
      checkedCategory: [],
      cat:null
    };
  },
  watch: {
    checkedCategory() {
      this.list.forEach(e => {
        ~this.checkedCategory.indexOf(e["sel"])
          ? (e["show"] = true)
          : (e["show"] = false);
      });
      // this.checkedCategory.forEach((e, i) => {
      //   this.cat.forEach(el => {
      //     el.name == e ? el.checked = true : null
      //   })        
      // });
      this.$store.commit("sortList");
    },
    category() {
      this.cat = JSON.parse(JSON.stringify(this.category));
      this.checkedCategory = this.category
        .filter(e => e.checked)
        .map(e => e.name);
    }
  },
  computed: {
    ...mapGetters(["category", "list"]),
  },
  mounted() {
    this.$store.dispatch("getCategory");
  },
  components: {
    loading
  }
};
</script>

<style scoped>
table {
  width: 100%;
}
td:nth-child(1) {
  width: 190px;
  text-align: left;
}
td:nth-child(2) {
  width: auto;
}
</style>
