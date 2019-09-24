<template>
  <div>
    <b-modal id="modal-list" :title="nameOfList" hide-header ok-only>
      <div v-if="list"> <!-- если список существует то отрисовывать модальное окно -->
          <!-- <b-table 
              small hover bordered
              :items="list"              
              :fields="fields">
          </b-table> -->
          <table class="table table-bordered table-sm">
            <tr v-for = "(td, i) in list" :key="i" :style="[!td.check ? {'text-decoration':'none'} : {'text-decoration': 'line-through #E30101'}]">
              <td>{{ td.cost }}</td>
              <td>{{ td.name}}</td>
              <td>{{ td.sel}}</td>
            </tr>
          </table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["list", "nameOfList"]),
    fields() {
      let f = [
        { key: "cost", label: "Цена" },
        { key: "name", label: "Название" },
        { key: "sel", label: "Категория" }
      ];
      return f;
    }
  }
};
</script>

<style scoped>
.crossed{
  text-decoration: line-through #E30101;
}
</style>

