<template>
  <div class="add-base-info">
    <v-header class="bot-border" :title="title"/>
    <ul class="form-wrap">
      <li v-show="null" class="form-box-first"><h3>基本信息</h3></li>
      <li class="form-box bot-line">
        <label class="display-inline-block i-red-star">所属活动<i>*</i></label>
        <input class="display-inline-block" v-model="formData.marketActiveName" type="text" placeholder="请输入25字以内的活动名称（必填）"/>
      </li>
      <li class="form-box bot-line">
        <label class="display-inline-block i-red-star">公司名称<i>*</i></label>
        <input class="display-inline-block" v-model="formData.companyName" type="text" placeholder="请选择（必填）"/>
      </li>
      <li @click="popShow" class="form-box select-icon bot-line">
        <label class="display-inline-block i-red-star">公司地址<i>*</i></label>
        <input class="display-inline-block" v-model="formData.companyAddress" type="text" placeholder="请选择（必填）"/>
      </li>
      <li class="form-box bot-line">
        <label class="display-inline-block i-red-star">联系人<i>*</i></label>
        <input class="display-inline-block" v-model="formData.contacter" type="text" placeholder="请选择（必填）"/>
      </li>
      <li class="form-box bot-line">
        <label class="display-inline-block">所属职务</label>
        <input class="display-inline-block" v-model="formData.post" type="text" placeholder="请选择"/>
      </li>
      <li class="form-box bot-line">
        <label class="display-inline-block">联系电话</label>
        <input class="display-inline-block" v-model="formData.phone" type="text" placeholder="请输入"/>
      </li>
      <li class="form-box bot-line">
        <label class="display-inline-block">微信帐号</label>
        <input class="display-inline-block" v-model="formData.weichat" type="text" placeholder="请选择"/>
      </li>
      <li class="form-box">
        <label class="display-inline-block">联系邮箱</label>
        <input class="display-inline-block" v-model="formData.email" type="text" placeholder="请选择"/>
      </li>
      <!-- <li @click="toSelect" class="form-box select-icon">
        <label class="display-inline-block">信息等级</label>
        <input class="display-inline-block" type="text" placeholder="请选择"/>
      </li>
      <li class="form-box li-final-box">
        <label class="display-inline-block">备注</label>
        <textarea rows="3" class="display-inline-block" placeholder="请输入"></textarea>
      </li> -->
    </ul>
    <div class="footer back-color footer-fixed">
      <p class="div-wrap footer-main">
        <span class="border-right" @click="cancel">取消</span>
        <span @click="save">保存</span>
      </p>
    </div>
    <!-- picker -->
    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
      <p @click="okPop" class="pop-cel div-wrap">取消</p>
      <p @click="okPop" class="pop-ok div-wrap">确定</p>
      <mt-picker :slots="addressSlots" @change="onDateChange" :visible-item-count="5" :show-toolbar="false"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
const address = {
    '北京': ['北京'],
    '广东': ['广州', '深圳', '珠海', '汕头', '韶关', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
    '上海': ['上海'],
    '天津': ['天津'],
    '重庆': ['重庆']
}
import { contact } from '../../utils/api'
export default {
  name: "AddContact",
  data () {
    return {
      // value: '2019/01/01 00:00',
      title: '新增Contact',
      popupVisible: false,
      addressSlots: [
        {
          flex: 1,
          values: Object.keys(address),
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['北京'],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      addressProvince: '北京',
      addressCity: '北京',
      formData: {
        companyAddress: '',
        companyName: '',
        contacter: '',
        createrName: '',
        email: '',
        infoGrade: '',
        marketActiveName: '',
        phone: '',
        post: '',
        weichat: ''
      }
    }
  },
  // todo.............
  created () {
    const oQuery = this.$route.query
    if(oQuery.type === 'edit') {
      const contact_id = oQuery.contactId
      let params = {
        contact_id
      }
      this.$axios.post(contact.viewContact, params).then(res => {
        if(res.data.code !=200){
        this.$notice(res.data.message)
        return
      }
      this.formData = {...res.data.data.tMarketingActiveContact}
      })
    }
  },
  computed: {
    oRoute () {
      return this.$route
    }
  },
  methods: {
    toSelect () {
      this.$router.push({
        path: '/infoRank'
      })
    },
    nextStep () {
      if (this.$route.query.type) {
        return
      }
      this.$router.push({
        path: '/addCostDesc',
        query: {}
      })
    },
    onDateChange(picker, values) {
      console.log(picker, values)
      picker.setSlotValues(1, address[values[0]])
      this.addressProvince = values[0]
      this.addressCity = values[1]
    },
    popShow () {
      this.popupVisible = true
    },
    okPop () {
      this.popupVisible = false
    },
    cancel () {
      this.$messageBox.confirm('现在退出，将丢失已编辑的内容<br>确认退出?').then(val => {
        if (this.$route.query.type == 'edit') {
          this.$router.push({
            path: '/viewContactDesc'
          })
        }else{
          this.$router.push({
            path: '/viewActiveDesc',
            query: {
              flag: 'contact'
            }
          })
        }
      })
    },
    save () {
      // 验证
      const checkObject = {
        marketActiveName: '请输入所属活动名称',
        companyName: '请填写公司名称',
        // companyAddress: '请填写公司地址',
        contacter: '请填写联系人姓名',
        email: '请填写手机号/邮箱/微信号',
        phone: '请填写手机号/邮箱/微信号',
        weichat: '请填写手机号/邮箱/微信号'
      }
      const checkCon = ['email', 'phone', 'weichat']
      let arr = []
      let count = 0
      Object.keys(checkObject).forEach(k => {
        if(!this.formData[k]) {
          if(checkCon.includes(k)){
            count++
          }else{
            arr.push(checkObject[k])
          }
        }
      })
      // 手机号 邮箱 微信号 选填一
      if(count === 3){
        arr.push(checkObject['phone'])
      }else{
        if(this.formData['phone']){
          // 验证手机号 邮箱
          const phoneReg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
          if(!phoneReg.test(this.formData['phone'])){
            arr.push('请输入正确的手机号！')
          }
        }
        if(this.formData['email']) {
          // 验证邮箱
          const emailReg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
          if(!emailReg.test(this.formData['email'])){
            arr.push('请输入正确的邮箱！')
          }
        }
      }
      if (arr.length) {
        this.$notice(arr[0])
        return
      }
      let userName = JSON.parse(this.$getStore('userInfo')).userName
      let userId = JSON.parse(this.$getStore('userInfo')).id
      this.formData.marketActiveId = this.$getStore('marketId')
      // 编辑  新增
      let type = this.$route.query.type
      let params = {
        tMarketingActiveContact: {...this.formData}
      }
      let url = ''
      if(type ==='edit') {
        url = contact.update
      }else{
        url = contact.add
        params.tMarketingActiveContactUser = {
          userId: userId,
          userIdAssign: userId,
          userName: userName,
          userIdAssignName: userName
        }
      }
      this.$axios.post(url, params).then(res => {
        if(res.data.code != 200){
          this.$notice(res.data.message)
          return
        }
        if(type ==='edit') {
          this.$router.push({
            path: '/viewContactDesc'
          })
        }else {
          this.$router.push({
            path: '/viewActiveDesc',
            query: {
              flag: 'contact'
            }
          })
        }
        
      })
    }
  },
  mounted () {
    this.title = this.$route.query.type === 'edit' ? '修改名片信息' : '新增名片信息' 
    this.formData.marketActiveName = this.$route.query.activeName || ''
  }
}
</script>
<style lang="scss" scoped>
  .add-base-info{
    background: #F4F7F9;
  }
  .form-wrap{
    li{
      label{
        text-align: right;
        padding-right: 44px;
      }
    }
    .li-2{
      margin: 25px 0;
    }
  }
</style>