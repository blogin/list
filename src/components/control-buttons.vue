<template>
  <div>
    <div class="div-input">
      <input type="text" v-model="c" placeholder="Цена" class="pr-cost" />
      <input type="text" v-model="n" placeholder="Название" class="pr-name" />
      <select v-model="o" class="pr-attr">
        <option v-for="c in category" :key="c.id">{{ c.name }}</option>
      </select>
      <a class="primary pr-btn-add" @click="add()">+</a>
    </div>
    <button class="success" @click="save()">Сохранить</button>
    <button class="secondary" @click="setShowModal(true)">Список</button>
    <button class="danger" @click="reset()">Сбросить</button>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      o: "",
      n: "",
      c: ""
    };
  },
  methods: {
    ...mapActions(["putList", "putCategory"]),
    ...mapMutations(["showSnBar", "calcCategory", "calcSalary", "sortList", "setShowModal"]),
    save() {
      this.putList();
      this.putCategory();
    },
    add() {
      if (!this.c || !this.n || !this.o) {
        this.showSnBar("Необходимо заполнить все поля");
        return;
      }
      if (!this.c.match(/^\d+$/)) {
        this.showSnBar("Стоимость должна быть в цифрах");
        return;
      }
      this.list || this.list.length > 0
        ? this.list.unshift({
            cost: this.c,
            name: this.n,
            sel: this.o,
            check: false,
            show: true
          })
        : (this.list = [
            {
              cost: this.c,
              name: this.n,
              sel: this.o,
              check: false,
              show: true
            }
          ]);
      (this.o = null), (this.n = null), (this.c = null);
      this.calcCategory();
      this.calcSalary();
      this.sortList();
    },
    reset() {
      this.list.forEach(e => (e["check"] = false));
      this.sortList();
    }
  },
  computed: {
    ...mapGetters(["list", "category"])
  }
};
</script>

<style scoped>
.pr-cost {
  width: 15%;
  margin: 5px 7px;
  height: 25px;
  padding: 0 3px;
  height: 25px;
}
.pr-name {
  width: 30%;
  margin: 5px 7px;
  height: 25px;
  padding: 0 3px;
  height: 25px;
}
.pr-attr {
  width: 30%;
  margin: 5px 7px;
  height: 25px;
  padding: 0 3px;
  height: 25px;
}
input::placeholder {
  font-size: 13px;
}
input,
select {
  font-size: 18px;
  background-color: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid lightgrey;
  outline: none;
  padding: 0 3px;
}

button {
  margin: 5px;
  border: 1px solid black;
  background-color: transparent;
  color: black;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;
  outline: none;
}

/* success */
.success {
  border-color: #339966;
  color: #339966;
  transition: 0.5s;
}

.success:hover {
  background-color: #339966;
  color: white;
  transition: 0.5s;
}

.success:active {
  background-color: #006633;
  transition: 0.3s;
}

/* danger */
.danger {
  border-color: #cc0000;
  color: #cc0000;
  transition: 0.5s;
}

.danger:hover {
  background-color: #cc0000;
  color: white;
  transition: 0.5s;
}

.danger:active {
  background-color: #990000;
  transition: 0.3s;
}

/* primary */
.primary {
  border: 1px solid #666699;
  background-color: transparent;
  color: #666699;
  outline: none;
  transition: 0.5s;
  padding: 3px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.primary:hover {
  background-color: #666699;
  color: white;
  transition: 0.5s;
}

.primary:active {
  background-color: #000066;
  transition: 0.3s;
}

/* secondary */
.secondary {
  border-color: #666666;
  color: #666666;
  transition: 0.5s;
}

.secondary:hover {
  background-color: #666666;
  color: white;
  transition: 0.5s;
}

.secondary:active {
  background-color: #333333;
  transition: 0.3s;
}
</style>
