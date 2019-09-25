<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @click="$event.target.className == 'modal-wrapper' ? setShowModal(false) : null;"
      >
        <div class="modal-container">
          <table>
            <tr v-for="(l,i) in list" :key="i" :class="{'green' : l.check, 'grey' : !l.check}">
              <td>{{ l.cost }}</td>
              <td>{{ l.name }}</td>
              <td>{{ l.sel }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "modal",
  methods: {
    ...mapMutations(["setShowModal"])
  },
  computed: {
    ...mapGetters(["list"])
  }
};
</script>

<style scoped>
.green {
  background-color: CadetBlue;
  color: white;
}
.modal-mask {
  position: fixed;
  z-index: 9000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  z-index: 9001;
  width: auto;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.5s ease;
  background-color: #e2e2e2;
  display: inline-block;
  position: relative;
  max-width: 90%;
  max-height: 95vh;
  overflow: auto;
  overflow-x: hidden;
}
/* Скрол для content*/
.modal-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}
.modal-container::-webkit-scrollbar {
  width: 3px;
  background-color: #f5f5f5;
}
.modal-container::-webkit-scrollbar-thumb {
  background-color: #b1afaf;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>