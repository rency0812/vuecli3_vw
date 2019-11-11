<template>
  <div class="add-target-man add-market-color">
    <v-header class="bot-border" :title="title"/>
    <ul class="div-wrap form-wrap">
      <li class="form-box select-icon bot-line" :class="{'man-select': formData.username}">
        <label class="display-inline-block">区域负责人</label>
        <input v-model="formData.username" @click="toSelect" readonly class="display-inline-block" type="text" placeholder="0"/>
        <span v-show="formData.username" class="ignore">{{txt}}</span>
      </li>
      <li class="form-box end-unit">
        <label class="display-inline-block">可分配人员</label>
        <input v-model.number="formData.indicatorNumber" class="display-inline-block" type="number" placeholder="0"/>
        <span>人</span>
      </li>
    </ul>
    <div class="footer back-color footer-fixed">
      <p class="div-wrap footer-main">
        <span @click="cancel" class="border-right">取消</span>
        <span @click="save">确定</span>
      </p>
      <!-- <p @click="save" class="div-wrap">保存</p> -->
    </div>
    <div v-show="type == 'edit'" @click="del" class="del-btn">
      <span class="s-icon">
      </span>
    </div>
    <mt-popup position="bottom" v-model="show">
      <ul class="del-main">
        <li>
          删除指标信息
        </li>
        <li @click="show=false">取消</li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import axios from 'axios'
import { marketActive } from '../utils/api.js'

export default {
  name: "AddTargetMan",
  data () {
    return {
      manage: '某某某',
      show: false,
      formData: {
        username: '',
        userId: '', //id
        indicatorNumber: null,
        userIdAssign: ''
      }
    }
  },
  mounted () {
    this.formData.userId = this.$getStore('manId')
    this.formData.username = this.$getStore('managerName')
    if (this.type === 'edit') {
      const editData = JSON.parse(this.$getStore('managerEdit'))
      // this.formData.username = editData.username
    }
  },
  methods: {
    del () {
      this.show = true
    },
    toSelect () {
      this.$router.push({
        path: '/sellManUpdate',
        query: {user: 'addManager', type: this.type}// 选择区域总
      })
    },
    cancel () {
      this.$root.$data.targetInfo = []
      this.$router.push({
        path: '/targetInfo',
        query: {}
      })
    },
    save () {
      this.formData.marketingActiveId = this.$getStore('marketId') || '1'
      this.formData.userIdAssign = JSON.parse(this.$getStore('userInfo')).id
      this.$root.$data.targetInfo.push(this.formData)
      this.$router.push({
        path: '/targetInfo',
        query: {
          // targetInfo: this.formData
        }
      })
      // axios.post(marketActive.targetInfo, [this.formData]).then(res => {
      //   if (res.data.code === 200) {
      //     this.$notice(res.data.message)
      //     this.$router.push({
      //       path: '/targetInfo',
      //       query: {}
      //     })
      //   } else {
      //     this.$notice(res.data.message)
      //   }
      // })
    }
  },
  computed: {
    txt () {
      const txt = this.$getStore('managerName')
      if (txt) {
        if (txt.length > 2) {
          return txt.substring(1)
        } else {
          return txt
        }
      }
      return ''
    },
    type () {
      return this.$route.query.type
    },
    title () {
      if (this.$root.$data.addEdit === 'add') {
        return '分配指标人数'
      }
      return (this.type === 'edit' || this.type === 'addEdit') ? '修改指标信息' : '添加指标信息'
    }
  }
}
</script>
<style lang="scss" scoped>
.add-target-man{
  height: 100%;
  .del-main{
    background: rgba(0,0,0,.5);
    li{
      font-size: 32px;
      line-height: 102px;
      height: 102px;
      background: #fff;
      color: #FF5846;
      &:last-child{
        margin-top: 16px;
        color: #555555;
      }
    }
  }
  .del-btn{
    position: absolute;
    top: 41px;
    right: 27px;
    z-index: 2;
    span{
      display: inline-block;
      transform: translateY(-16px);
      background: url('../assets/img/guidebackcopy.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>