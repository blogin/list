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
            />
            {{ cat.name }}
          </label>
        </td>
        <td>{{ cat.total }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import loading from "@/components/loading.vue";

export default {
  data() {
    return {
      checkedCategory: [],
    };
  },
  methods: {
    ...mapActions(["getCategory"]),
    ...mapMutations(["sortList", "setCheckedCategory"]),
  },
  computed: {
    ...mapGetters(["category", "list"])
  },
  watch: {
    checkedCategory() {
      /** 
       * При изменении списка отмеченных категорий
       */

      // Пересчитываем список
      this.list.forEach(e => {
        ~this.checkedCategory.indexOf(e["sel"])
          ? (e["show"] = true)
          : (e["show"] = false);
      });

      // Делаем копию массива объектов категорий
      let chCat = JSON.parse(JSON.stringify(this.category));

      // Перебираем копию и изменяем в ней состояние checked для отмеченных категорий
      chCat.forEach((e,i) => ~this.checkedCategory.indexOf(e.name) ? chCat[i].checked = true : chCat[i].checked = false)
      
      // Записываем в отдельный state который будем использовать чтобы пересылать на сервер
      this.setCheckedCategory(chCat);

      this.sortList();
    },
    category() {
      // Заполняем массив названий категорий как они пришли с сервера
      this.checkedCategory = this.category
        .filter(e => e.checked)
        .map(e => e.name);
    }
  },
  mounted() {
    this.getCategory();
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
