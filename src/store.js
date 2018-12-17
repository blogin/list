import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex, Axios)

// Сортировка массива
function compareAge(personA, personB) {
  return personB.cost - personA.cost;
}

export default new Vuex.Store({
  state: {
    money: null,
    costs: null,
    showCosts: null,
    salYear: null,
    options: null,
    list: null,
    loadingYear:true,
    loadingOpt:true,
    loadingList:true,
    toSber:null,
    toNal:null,
    show:false,
    nameOfList:null,
    dbSuccess:false,
    nullOfList: false
  },
  getters: {
    nullOfList(state){
      return state.nullOfList;
    },
    money(state) {
      return state.money;
    },
    salYear(state) {
      return state.salYear;
    },
    loadingYear(state){
      return state.loadingYear;
    },
    loadingOpt(state){
      return state.loadingOpt;
    },
    loadingList(state){
      return state.loadingList;
    },
    options(state){
      return state.options;
    },
    list(state){
      return state.list;
    },
    costs(state){
      return state.costs;
    },
    showCosts(state){
      return state.showCosts;
    },
    toSber(state){
      return state.toSber;
    },
    toNal(state){
      return state.toNal;
    },
    show(state){
      return state.show;
    },
    dbSuccess(state){
      return state.dbSuccess;
    },    
    nameOfList(state){
      return state.nameOfList
    }
  },
  mutations: {
    showMessage(state,payload){
      state.show = payload
      state.dbSuccess = payload
      state.nullOfList = payload
    },
    addToList(state){
      let list = state.list;
      if (list) {
        let i = list.length;
        if (i == 0 || list == null) {
          list.unshift({ cost: "", name: "", sel: "", show: true });
        } else {
          if (list[0].cost == "" || list[0].name == "" || list[0].sel == "") {
            state.show = !state.show; /// Показывать сообщение если не все поля заполнены
          } else {
            list.unshift({ cost: "", name: "", sel: "", show: true });
          }
        }
      } else {
        list = [];
        list.unshift({ cost: "", name: "", sel: "", show: true });
      }
      state.list = list;
    },
    setYearSalary(state, payload) {
      state.salYear = payload
      let obj = state.salYear
      let d = new Date().toLocaleString("en", {month: "long"});
      for (let i in obj) {
        obj[i].name == d ? state.money = obj[i].salary : null
      }      
      state.loadingYear = false;
    },
    costCalculate(state){
      let list = state.list;
      let options = state.options;
      let cost = 0;
      let showCost = 0;      
      let costNal = 0;
      let costSber = 0;
      // подсчет расходов которые видимы
      for (let i in list){
        cost += parseFloat(list[i].cost)
        list[i].show ? showCost += parseFloat(list[i].cost) : null
      }
      // подсчет расходов по опциям
      for (let i in options){
        let cost = 0;
        let opt = options[i].name
        for (let j in list){          
          list[j].sel == opt ? cost += parseFloat(list[j].cost) : null
        }
        options[i].total = cost.toFixed(2);
      }
      // подсчет расходов налички и сбера
      for (let i in options){
        let opt = options[i].name
        opt == "Нал" || opt == "Рынок" || opt == "База" ? costNal += parseFloat(options[i].total) : null
        opt == "Сбер" ? costSber += parseFloat(options[i].total) : null
      }
      state.toNal = costNal;
      state.toSber = costSber;
      state.options = options;
      state.costs = cost.toFixed(2);
      state.showCosts = showCost.toFixed(2);            
      state.list ? state.list.sort(compareAge) : null
    },
    setOptions(state,obj){
      state.options = obj;
      this.commit("setOptionsToList");
      state.loadingOpt = false; 
    },
    changeOptions(state,obj){
      state.options = obj;
      this.commit("setOptionsToList");        
      this.commit("costCalculate");
    },
    setList(state, payload) {
      if (payload){
        state.list = payload;
        this.commit("setOptionsToList");  
        this.commit("costCalculate");
        state.loadingList = false;
      }else{
        state.nullOfList = true;
      }
    },
    setMoney(state, payload) {
      let p = payload.split("~");
      state.money = p[0];
      this.dispatch("getList",p[1]);
    },
    setOptionsToList(state){
      let obj = state.options;
      let objList = state.list;
      for (let i in obj){
          if (!obj[i].checked){
              let opt = obj[i].name
              for (let j in objList)
                  objList[j].sel == opt ? objList[j].show = false : null
          }else{
              let opt = obj[i].name
              for (let j in objList)
                  objList[j].sel == opt ? objList[j].show = true : null
          }
      }
    },
    setNameOfList(state,payload){
      state.nameOfList = payload
    },
    setListToDB(state,data){
      state.dbSuccess = true;
    },
    copyLastList(state){
      let d = new Date();
      let curMonth = d.toLocaleString("en", {month: "long"}).toLowerCase();
      d.setMonth(d.getMonth() - 1);
      let prevMonth = d.toLocaleString("en", {month: "long"}).toLowerCase();      
      let curNameOfList = state.nameOfList;
      curNameOfList == "10_"+curMonth ? curNameOfList = "10_"+prevMonth : null
      curNameOfList == "25_"+curMonth ? curNameOfList = curNameOfList.replace("25", "10") : null
      this.dispatch("getPrevList",curNameOfList);
    }
  },
  actions: {
    getYearSalary: async ({ commit }) => {
      let { data } = await Axios.get('https://list-of-product.firebaseio.com/yearSalary.json');
      commit('setYearSalary', data);
    },
    getOptions: async ({ commit }) => {
      let { data } = await Axios.get('https://list-of-product.firebaseio.com/db_opt.json');
      commit('setOptions', data);
    },
    getList: async ({ commit }, day) => {
      let d = new Date().toLocaleString("en", {month: "long"});
      d = day+"_"+d.toLowerCase();
      let { data } = await Axios.get('https://list-of-product.firebaseio.com/list/'+d+'.json');
      commit('setList', data);
      commit('setNameOfList', d);
    },
    getPrevList: async ({ commit }, name) => {
      let { data } = await Axios.get('https://list-of-product.firebaseio.com/list/'+name+'.json');
      commit('setList', data);
      commit('setNameOfList', name);
    },
    putOptions: async ({ commit }, obj) => {
      let { data } = await Axios.put('https://list-of-product.firebaseio.com/db_opt.json', obj);
      commit('setOptions', data);
    },
    putList: async ({ commit }, obj) => {
      let { data } = await Axios.put('https://list-of-product.firebaseio.com/list/'+obj[0]+'.json', obj[1]);
      commit('setListToDB', data);
    },
  }
})