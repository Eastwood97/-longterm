import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user
  },
  getters,
  state: { //存放状态
    cmcc1: 3,
    cucc1: 3,
    ctcc1: 3,
    cmcc2: 3,
    cucc2: 3,
    ctcc2: 3,
  },
  mutations: {
    updateCmcc1(state, value) {
      state.cmcc1 = value
    },
    updateCmcc2(state, value) {
      state.cmcc2 = value
    },
    updateCucc1(state, value) {
      state.cucc1 = value
    },
    updateCucc2(state, value) {
      state.cucc2 = value
    },
    updateCtcc1(state, value) {
      state.ctcc1 = value
    },
    updateCtcc2(state, value) {
      state.ctcc2 = value
    },
  }
})

export default store
