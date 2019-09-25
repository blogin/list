<template>
  <div class="root">
    <loading v-if="!list"></loading>

    <table v-if="list" class="tbl-list">
      <tr
        v-for="(l,i) in list"
        :key="i"
        v-if="l.show == true"
        :class="{'green' : l.check, 'grey' : !l.check}"
      >
        <!-- Цена -->
        <td v-if="l === editingItem">
          <input
            autofocus
            type="text"
            v-model="l.cost"
            @blur="endEditing(l)"
            @keyup.enter="endEditing(l)"
          />
        </td>
        <td
          v-if="l !== editingItem"
          v-long-press="300"
          @long-press-start="edit(l)"
          @click="check(i)"
        >{{ l.cost }}</td>
        <!--  -->

        <!-- Название -->
        <td v-if="l === editingItem">
          <input
            autofocus
            type="text"
            v-model="l.name"
            @blur="endEditing(l)"
            @keyup.enter="endEditing(l)"
          />
        </td>
        <td
          v-if="l !== editingItem"
          v-long-press="300"
          @long-press-start="edit(l)"
          @click="check(i)"
        >{{ l.name }}</td>
        <!--  -->

        <!-- Категория -->
        <td v-if="l === editingItem">
          <select
            v-model="l.sel"
            :class="{'green' : l.check, 'grey' : !l.check}"
            @click="l.check = !l.check"
            @change="endEditing(l)"
          >
            <option v-for="c in category" :key="c.id">{{ c.name }}</option>
          </select>
        </td>
        <td
          v-if="l !== editingItem"
          v-long-press="300"
          @long-press-start="edit(l)"
          @click="check(i)"
          :class="{'green' : l.check, 'grey' : !l.check}"
        >{{ l.sel }}</td>
        <!--  -->

        <!-- Удаление -->
        <td>
          <button @click="del(i)">X</button>
        </td>
        <!--  -->
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import loading from "@/components/loading.vue";
import LongPress from "vue-directive-long-press";

export default {
  data() {
    return {
      checkedItems: [],
      inputsDisabled: true
    };
  },
  directives: {
    "long-press": LongPress
  },
  methods: {
    ...mapActions(["getList"]),
    ...mapMutations([
      "sortListByCheck",
      "setEditingItem",
      "calcCategory",
      "calcSalary",
      "sortList",
      "sortListByCheck"
    ]),
    check(i) {
      this.$set(this.list[i], "check", !this.list[i].check);
      this.$store.commit("sortListByCheck");
    },
    edit(item) {
      this.$store.commit("setEditingItem", item);
    },
    endEditing(item) {
      this.setEditingItem({});
      this.calcCategory();
      this.calcSalary();
      this.sortList();
      this.sortListByCheck();
    },
    del(i) {
      this.$delete(this.list, i);
      this.calcCategory();
      this.calcSalary();
      this.sortList();
    }
  },
  watch: {
    list() {
      this.checkedItems = this.list.filter(e => e.check).map(e => e.name);
    }
  },
  computed: {
    ...mapGetters(["list", "category", "editingItem"])
  },
  mounted() {
    this.getList();
  },
  components: {
    loading
  }
};
</script>

<style scoped>

button {
  height: 25px;
  border: 1px solid #b30707;
  background-color: transparent;
  color: #b30707;
  border-radius: 50%;
  width: 25px;
  outline: none;
}
button:hover {
  transition: 0.5s;
  background-color: #b30707;
  color: white;
}
button:active {
  box-shadow: -442px -0px #b30707;
  transition: 0.3s;
}
input,
select {
  font-size: 15px;
  background-color: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid lightgrey;
  outline: none;
  padding: 0 3px;
}
table {
  margin: auto;
}
td:nth-child(1) {
  vertical-align: middle;
  width: 65px;
  text-align: center;
}
td:nth-child(1) input {
  width: 58px;
  text-align: center;
}

td:nth-child(2) {
  vertical-align: middle;
  width: 250px;
  text-align: left;
}
td:nth-child(2) input {
  width: 243px;
  text-align: left;
}
td:nth-child(3) {
  vertical-align: middle;
  width: 90px;
  text-align: center;
}
table,
td:nth-child(4) {
  vertical-align: middle;
  border: none;
}

.green {
  background-color: CadetBlue;
  color: white;
}
.green input {
  border-color: white;
  color: white;
}
.green td:nth-child(4) {
  background: #f7f7f7;
}

.grey {
  background-color: #f7f7f7;
  color: black;
}
</style>
