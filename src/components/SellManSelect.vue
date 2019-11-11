<template>
<div class="sell-select">
  <Search class="search" @get-list="getList"/>
  <div class="a-class class-box padding-bot">
    <h3>A</h3>
    <ul class="div-wrap form-wrap">
      <li @click="selected(v, $event)" :data-index='k' v-for="(v, k) in saleManList" :key="k" class="info-item bot-line">
        <div class="item-left">
          <p>{{avatarName(v.userName)}}</p>
          <!-- <p>XXX</p> -->
        </div>
        <div class="item-center">
          <p>{{v.userName}}</p>
          <p>{{v.position}}</p>
        </div>
        <p class="check-wrap">
          <span class="check-icon"></span>
        </p>
      </li>
    </ul>
  </div>
  <div class="footer footer-fixed div-wrap">
    <p class="selected-num">
      已选择{{arr.length}}/{{totalNum}}名
    </p>
    <p class="footer-main">
      <span @click="back">取消</span>
      <span @click="save">确定</span>
    </p>
  </div>
</div>
</template>
<script>
import { targetDispatch, appoint } from '../utils/api'
export default {
  name: "SellSelect",
  data () {
    return {
      arr: [],
      saleManList: [],
      totalNum: 0,
      selectedNum: 0
    }
  },
  created () {
    const detail = JSON.parse(this.$getStore('targetDetail'))
    this.totalNum = detail.indicatorNumber
    this.userInfo = JSON.parse(this.$getStore('userInfo'))
    let params = {
      userId: this.userInfo.id
    }
    this.$axios.post(targetDispatch, params).then(res => {
      if(res.data.code != 200){
        this.$notice(res.data.message)
        return
      }
      this.saleManList = res.data.data
    })
    // 已经选择了几个销售 继续添加
    this.selectedNum = this.$route.query.selectedNum
  },
  computed: {
    // totalNum () {
    //   const detail = JSON.parse(this.$getStore('targetDetail'))
    //   return detail.indicatorNumber
    // }
  },
  methods: {
    back () {
      this.$messageBox.confirm('现在退出，将丢失已编辑的内容<br>确认退出?').then(val => {
        if (val) {
          this.$router.push({
            path: '/sellManUpdate?user=manager'
          })
        }
      })
    },
    getList (val) {
      console.log(val)
    },
    selected (item, e) {
      console.log(item)
      const target = e.target || e.srcElement
      // 选择的信息
      let dispatchInfo = {
        username: item.userName,
        userId: item.id,
        userIdAssign: this.userInfo.id,
        marketingActiveId: this.$getStore('marketId')
      }
      if (target.className.includes('selected')) {
        target.className = 'check-icon'
        let i = this.arr.indexOf(dispatchInfo)
        this.arr.splice(i, 1)
        return
      }
      if (this.arr.length>=this.totalNum) {
        return
      }
      if (target.nodeName === 'SPAN') {
        this.arr.push(dispatchInfo)
        target.className = 'check-icon selected'
      }
      this.$root.$data.sellName = target.innerHTML
      console.log(this.arr)
    },
    save () {
      const type = this.$route.query.type
      const totalIndexNum = this.$getStore('totalIndexNum')
      let params = {
        tMarketingActiveUserList: this.arr,
        totalNumner: totalIndexNum
      }
      let url = ''
      if(type === 'edit') {
        url = appoint.update
      }else {
        url = appoint.add
      }
      this.$axios.post(url, params).then(res => {
        if(res.data.code != 200) {
          this.$notice(res.data.message)
          return
        }
        this.$router.push({
          path: '/sellManUpdate?user=manager'
        })
      })
    },
    avatarName (name) {
      if(typeof name === 'string'){
        if(name.length > 2){
          return name.substring(1)
        }
        return name
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .selected-num{
    position: absolute;
    left: 40px;
    top: 35px;
    color: #222222;
    font-size: 28px;
  }
  .sell-select{
    padding-top: 12px !important;
    .class-box{
      ul{
        padding-bottom: 10px;
      }
    }
    .search{
      height: 68px;
    }
    .info-item{
      position: relative;
      border: none;
      height: 140px;
    }
  }
</style>