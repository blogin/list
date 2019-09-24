/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

Axios.defaults.baseURL = "https://list-of-product.firebaseio.com/";

function compare(a, b) {
  return b.cost - a.cost;
}

export default new Vuex.Store({
  state: {
    salary: null,
    category: null,
    checkedCategory: [],
    list: null,
    allExpenses: null,
    restOfMoney: null,
    editingItem: {},
    msgSnackBar: null,
    showSnackBar: false,
  },
  getters: {
    msgSnackBar(state) {
      return state.msgSnackBar;
    },
    showSnackBar(state) {
      return state.showSnackBar;
    },
    editingItem(state) {
      return state.editingItem;
    },
    restOfMoney(state) {
      return state.restOfMoney;
    },
    allExpenses(state) {
      return state.allExpenses;
    },
    salary(state) {
      return state.salary
    },
    category(state) {
      return state.category
    },
    checkedCategory(state) {
      return state.checkedCategory;
    },
    list(state) {
      return state.list;
    }
  },
  mutations: {
    showSnBar(state, payload) {
      state.msgSnackBar = payload;
      state.showSnackBar = true;
      setTimeout(() => {
        state.showSnackBar = false;
        state.msgSnackBar = null;
      }, 3000)
    },
    setEditingItem(state, payload) {
      state.editingItem = payload;
    },
    setSalary(state, payload) {
      let curMonth = new Date().toLocaleString("en", {
        month: "long"
      });
      state.salary = payload.filter(e => e.name == curMonth)
      this.commit("calcSalary");
    },
    setCategory(state, payload) {
      state.category = payload;
      state.checkedCategory = payload.filter(e => e.checked == true).map(e => e.name);
      this.commit("calcCategory");
    },
    setList(state, payload) {
      state.list = payload;
    },
    calcCategory(state) {
      state.category.forEach(e => {
        let arr = state.list.filter(f => f["sel"] == e["name"]).map(m => parseInt(m["cost"]));
        arr.length > 0 ? e["total"] = arr.reduce((a, b) => {
          return (a + b)
        }) : e["total"] = 0;
      })

    },
    calcSalary(state) {
      let day = new Date().toLocaleString("ru", {
        day: "2-digit"
      });
      // Подсчет всех расходов
      state.allExpenses = state.list.map(e => parseInt(e["cost"])).reduce((a, b) => {
        return (a + b)
      });
      // Подсчет остатка денег исходя из расходов
      day > 15 ? state.restOfMoney = state.salary[0].backfire - state.allExpenses : state.restOfMoney = state.salary[0].salary - state.allExpenses;
      state.restOfMoney = state.restOfMoney.toFixed(2);
    },
    sortList(state) {
      state.list ? state.list.sort(compare) : null;
    },
    sortListByCheck(state){
      state.list = state.list.filter(e => !e.check).concat(state.list.filter(e => e.check));
    }
  },
  actions: {
    getSalary: async ({ commit }) => {
      await Axios.get('yearSalary.json')
        .then((response) => {
          commit("setSalary", response.data);
        })
        .catch((error) => {
          console.log("error -> ", error);
        });
    },
    getCategory: async ({ commit }) => {
      await Axios.get('db_opt.json')
        .then((response) => {
          commit("setCategory", response.data);
        })
        .catch((error) => {
          console.log("error -> ", error);
        });
    },
    getList: async ({ commit }) => {
      let day = new Date().toLocaleString("ru", {day: "2-digit"});
      let month = new Date().toLocaleString("en", {month: "long"});
      let monthLocalizedString = (month, locale) => {
        return new Date(2010, month).toLocaleString(locale, {
          month: "long"
        });
      };
      let pMmonth = monthLocalizedString(new Date().getMonth() - 1, 'en');
      let nameOfList, pNameOfList;

      day > 15 ? nameOfList = "25_" + month.toLocaleLowerCase() : nameOfList = "10_" + month.toLocaleLowerCase();
      day > 15 ? pNameOfList = "10_" + month.toLocaleLowerCase() : pNameOfList = "25_" + pMmonth.toLocaleLowerCase();

      // nameOfList = '10_june';

      // console.log("name_of_list ->", nameOfList)
      await Axios.get('list/' + nameOfList + '.json')
        .then((response) => {
          if (response.data) {
            commit("setList", response.data);
          } else {  
            // Если не найден список на этот месяц то берем список за предыдущий месяц
            Axios.get('list/' + pNameOfList + '.json')
              .then((response) => {
                if (response.data) {
                  commit("setList", response.data);
                  commit("showSnBar", "Список не найден, скопирован предыдущий список");
                } else {            
                  commit("showSnBar", "Предыдущий Список не найден");
                }
              })
              .catch((error) => {
                console.log("error -> ", error);
              }); 
            // ---- \\
          }
        })
        .catch((error) => {
          console.log("error -> ", error);
        });
    },

    putList: async ({ commit, state }) => {
      let day = new Date().toLocaleString("ru", {day: "2-digit"});
      let month = new Date().toLocaleString("en", {month: "long"});
      let nameOfList;

      day > 15 ? nameOfList = "25_" + month.toLocaleLowerCase() : nameOfList = "10_" + month.toLocaleLowerCase();

      await Axios.put('list/' + nameOfList + '.json', state.list)
        .then((response) => {
          response.data ? commit("showSnBar", "Список успешно сохранен") : commit("showSnBar", "Проблемы при сохранении списка");
        })
        .catch((error) => {
          console.log("error -> ", error);
        });
    },

    putCategory: async ({ commit, state }) => {
      console.log("category ->",state.category);
      // await Axios.put('db_opt.json', state.category)
      //   .then((response) => {
      //     response.data ? commit("showSnBar", "Категории успешно сохранены") : commit("showSnBar", "Проблемы при сохранении категорий");
      //   })
      //   .catch((error) => {
      //     console.log("error -> ", error);
      //   });
    },
  }
})