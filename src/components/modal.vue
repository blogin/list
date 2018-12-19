<template>
  <div>
    <b-modal id="modal-list" :title="nameOfList" hide-header hide-footer>
      <div v-if="list"> <!-- если список существует то отрисовывать модальное окно -->
          <b-table 
              small hover bordered
              :items="list"              
              :fields="fields">
          </b-table>
          <!-- <b-table 
              small hover bordered
              :items="list">
          </b-table> -->
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
