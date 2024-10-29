import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeProject:{},//当前操作项目
    shootingList:[],//拍摄计划列表
    noticeList:[],//通告列表
    activeNotice:{//当前正在编辑的通告
      id:"",
      form1:{},//创建通告页
      form2:{},//完善通告页
      form3:{}//计划与日程页
    }
  },
  getters: {
  },
  mutations: {
    //修改当前操作项目
    SET_ACTIVEPROJECT(state,info){
      state.activeProject = info
    },
    //修改拍摄计划列表
    SET_SHOOTINGLIST(state,info){
      state.shootingList = info
    },
    //修改通告列表
    SET_NOTICELIST(state,info){
      state.noticeList = info
    },
    //修改当前正在编辑的通告
    SET_ACTIVENOTICE(state,info){
      state.activeNotice = info
    },
  },
  actions: {
  },
  modules: {
  }
})
