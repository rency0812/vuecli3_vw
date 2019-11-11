<template>
  <div class="sell-man padding-bot" :class="{'add-market-color': title.indexOf('销售')<=-1}">
    <v-header :title="title">
      <i @click="back" v-if="$route.query.user == 'manager'" class="icon-arrow-left"><span>&lt;</span></i>
    </v-header>
    <ul v-show="manData" class="div-wrap top-border form-wrap sell-man-main">
      <li :data-index="v.userName" :data-id="v.id" @click="toSelect" v-for="(v,i) in manData" :key="i" class="bot-border">
        <h4>{{(v.userName&&v.userName.length>2)?v.userName.slice(1):v.userName}}</h4>
        <div>
          <p>{{v.userName}}</p>
          <p>指标数: {{v.indicatorNumber}}</p>
        </div>
      </li>
    </ul>
    <no-data v-show="!manData.length>0" :tips="tip"/>
    <div v-show="null" class="footer footer-fixed back-color">
      <p class="div-wrap">保存</p>
    </div>
    <p v-show="title.indexOf('分配')>-1" class="top-edit-btn" @click="toAdd">
      {{manData.length>0?'修改':'添加'}}
    </p>
  </div>
</template>
<script>
import { appoint, manager } from '../utils/api'

export default {
  name: "SellMan",
  data () {
    return {
      manData: [],
      startX: null,
      startY: null,
      tip: '还未分配销售人员'
    }
  },
  created () {
    const type = this.$route.query.user
    // 选择区域总
    if(type === 'addManager'){
      this.tip = '没有数据'
      this.$axios.post(manager).then(res => {
        if(res.data.code != 200){
          this.$notice(res.data.message)
          return
        }
        this.manData = res.data.data
      })
    }else {
      // 选择分配的销售人员
      const detail = JSON.parse(this.$getStore('targetDetail'))
      let params = {
        userIdAssign: detail.userId
      }
      this.$axios.post(appoint.getList, params).then(res => {
        if(res.data.code != 200){
          this.$notice(res.data.message)
          return
        }
        this.manData = res.data.data
      })
      }
  },
  components: {
    noData: () => import('./NoData.vue')
  },
  computed: {
    title () {
      const type = this.$route.query.user || this.$route.query.type
      const detail = JSON.parse(this.$getStore('targetDetail'))
      if (type === 'manager' && detail) {
        return `${detail.username}（可分配${detail.indicatorNumber}人）`
      }
      return type === 'addManager' ? '选择区域负责人' : '销售人员变更'
    }
  },
  methods: {
    back () {
      this.$router.push({
        path: '/viewActiveDesc'
      })
    },
    toAdd (e) {
      // console.log(e)
      const target = e.target || e.srcElement
      if (target.innerHTML.trim() === '修改') {
        this.$router.push({
          path: '/editCanMan',
          query:{
            manData: this.manData
          }
        })
        return
      }
      this.$router.push({
        path: '/sellManSelect'
      })
    },
    toSelect (e) {
      const $dom = e.target || e.srcElement
      const $li = $dom.nodeName === 'P' ? $dom.parentNode.parentNode : $dom.parentNode || $dom
      this.$setStore('managerName', $li.dataset.index)
      this.$setStore('manId', $li.dataset.id)
      if (this.$route.query.user === 'manager') {return}
      let type = this.$route.query.type
      this.$router.push({
        path: '/addTargetMan',
        query: {type}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sell-man{
  height: 100%;
}
</style>