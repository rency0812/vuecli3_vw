<template>
  <div class="add-base-info add-market-color padding-bot">
    <v-header class="bot-border" :title="title">
      <i @click="back" class="icon-arrow-left"><span>&lt;</span></i>
    </v-header>
    <ul class="form-wrap">
      <!-- <li class="form-box-first"><h3>基本信息</h3></li> -->
      <li class="form-box">
        <!-- <label class="display-inline-block"></label> -->
        <input maxlength="25" style="width:100%;" class="display-inline-block" v-model="formData.activeName" type="text" placeholder="请输入25字以内的活动名称（必填）"/>
      </li>
      <li class="form-box">
        <label class="display-inline-block">活动主办方</label>
        <input class="display-inline-block" v-model="formData.activeHost" type="text" placeholder="请输入"/>
      </li>
      <li class="form-box bot-line li-2">
        <label class="display-inline-block">人数规模</label>
        <input class="display-inline-block" v-model="formData.number" type="number" placeholder="请输入"/>
        <span>人</span>
      </li>
      <li @click="open('strat', $event)" class="form-box bot-line select-icon">
        <label class="display-inline-block i-red-star">开始时间<i>*</i></label>
        <input v-model="formData.sTime" class="display-inline-block" type="text" placeholder="请选择（必填）"/>
      </li>
      <li @click="open('end')" class="form-box li-5 select-icon">
        <label class="display-inline-block i-red-star">结束时间<i>*</i></label>
        <input v-model="formData.eTime" class="display-inline-block" type="text" placeholder="请选择（必填）"/>
      </li>
      <li @click="openGain" class="form-box gain-box select-icon bot-line">
        <label class="display-inline-block">活动权益</label>
        <input v-show="!selectedArr.length" class="display-inline-block" type="text" placeholder="请选择"/>
        <p v-show="selectedArr.length" class="display-inline-block">
          <span v-for="(txt, i) in selectedArr" :key="i" class="good-box">{{txt}}</span>
        </p>
      </li>
      <li class="form-box select-icon bot-line">
        <label class="display-inline-block">行业归属</label>
        <input v-model="formData.industry" @click="toSelect('industry')" class="display-inline-block" type="text" placeholder="请选择"/>
      </li>
      <li :class="{'man-select': formData.assistanceUser}" class="form-box li-8 select-icon">
        <label class="display-inline-block">辅助人员</label>
        <input @click="toSelect('assistMan')" v-model="formData.assistanceUser" class="display-inline-block" type="text" placeholder="请选择"/>
        <span class="ignore" v-show="formData.assistanceUser">
          {{txt}}
        </span>
      </li>
      <li @click="toSelect('city')" class="form-box bot-line select-icon">
        <label class="display-inline-block i-red-star">活动地址<i>*</i></label>
        <input v-model="formData.activeCity" class="display-inline-block" type="text" placeholder="请选择（必填）"/>
      </li>
      <li class="form-box li-final-box">
        <!-- <label class="display-inline-block">活动地址</label> 城市-->
        <textarea v-model="formData.activeAddress" maxlength="50" rows="3" class="display-inline-block" placeholder="请输入不超过50字的地址"></textarea>
      </li>
      <!-- <li class="form-box select-icon">
        <label class="display-inline-block">大区</label>
        <input class="display-inline-block" type="text" placeholder="请选择"/>
      </li>
      <li class="form-box select-icon">
        <label class="display-inline-block">细分行业</label>
        <input class="display-inline-block" type="text" placeholder="请选择"/>
      </li> -->
      <li class="form-box li-last">
        <label class="display-inline-block">录入指标数</label>
        <input v-model="formData.recoveryIndex" class="display-inline-block" type="number" placeholder="请输入"/>
        <span>个</span>
      </li>
    </ul>
    <div class="footer div-wrap footer-fixed">
      <!-- <p @click="nextStep" class="div-wrap">{{oRoute.query.type?'保存':'下一步'}}</p> -->
      <p class="footer-main">
        <span @click="backGo">返回</span>
        <span @click="nextStep">{{oQuery.type==='edit'?'保存':'下一步'}}</span>
      </p>
    </div>
    <!-- time picker -->
    <mt-datetime-picker
      ref="datePicker"
      v-model="value"
      :closeOnClickModal="false"
      @confirm="handleChange">
    </mt-datetime-picker>
    <!-- <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
      <p @click="okPop" class="pop-cel div-wrap">取消</p>
      <p @click="okPop('ok')" class="pop-ok div-wrap">确定</p>
      <mt-picker :slots="addressSlots" @change="onDateChange" :visible-item-count="5" :show-toolbar="false"></mt-picker>
    </mt-popup> -->
    <mt-popup v-model="popup2" position="bottom">
      <pop-header @cancel="close" @ok="confirm" title="选择活动权益" />
      <ul class="pop-main">
        <li v-for="(v ,k) in gain" :key="k" class="form-box bot-line">
          <p>{{v}}</p>
          <p>
            <input v-model="checked[k]" class="check-icon check-box" type="checkbox">
            <span :class="{selected: checked[k]}" class="check-icon">
              <span class="shade-el"></span>
              <svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="choose" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path d="M41.3909142,59.1140648 L67.3237923,31.4028594 C68.9627873,29.6514718 71.7529896,29.5224008 73.5558838,31.1145714 C75.3587782,32.7067419 75.4916449,35.4172313 73.8526501,37.168619 L44.4409994,68.597151 C42.6154586,70.5478767 39.42691,70.4501597 37.7315742,68.3915324 L25.966914,54.1058359 C24.4448189,52.2575729 24.7532944,49.5606088 26.6559132,48.0819984 C28.558532,46.6033879 31.3348112,46.9030505 32.8569062,48.7513137 L41.3909142,59.1140648 Z" id="Path-3" fill="#000000"></path>
                </g>
              </svg>
            </span>
          </p>
        </li>
      </ul>
    </mt-popup>
    <mt-popup class="full-pop" position="bottom" v-model="popupFull">
      <v-header v-show="!popup.assistMan" :class="{'bot-border': popup.city||popup.assistMan}" :title="modelTitle">
        <i @click="popupFull = false" class="icon-arrow-left"><span class="s-icon"></span></i>
      </v-header>
      <pop-city @city="getPopData" v-show="popup.city" />
      <pop-assist-man @assist="getPopData" v-show="popup.assistMan"/>
      <pop-industry @industry="getPopData" v-show="popup.industry" />
    </mt-popup>
  </div>
</template>
<script>
import { formatTime } from '../utils/util.js'
import { Toast } from 'mint-ui'
import { marketActive } from '../utils/api';

const address = {
    '北京': ['北京'],
    '广东': ['广州', '深圳', '珠海', '汕头', '韶关', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
    '上海': ['上海'],
    '天津': ['天津'],
    '重庆': ['重庆']
}

export default {
  name: "AddMarketActive",
  components: {
    popHeader: () => import('./pop-header.vue'),
    popCity: () => import('./popTemp/City.vue'),
    popAssistMan: () => import('./popTemp/AssistMan.vue'),
    popIndustry: () => import('./popTemp/Industry.vue')
  },
  data () {
    return {
      title: '新增市场活动',
      modelTitle: '选择城市',
      popupFull: false,
      popup: {
        city: false,
        industry: false,
        assistMan: false
      },
      popTitle: {
        city: '选择城市',
        industry: '选择所属行业',
        assistMan: '选择活动辅助人员'
      },
      value: '2019/01/01 00:00',
      title: '新增市场活动',
      popup2: false,
      selectedArr: [],
      startTime: '',
      endTime: '',
      checked: {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false,
        '6': false,
        '7': false
      },
      gain: {
        '1': '广告植入',
        '2': '视频播放',
        '3': '圆桌对话',
        '4': '展会',
        '5': '展位',
        '6': '主题发言',
        '7': '资料入袋'
      },
      popupVisible: false,
      formData: {
        activeName: '',
        activeStartTime: '',
        activeEndTime: '',
        activeCity: '',
        activeHost: '',
        industry: '',
        equity: '',
        number: '',
        recoveryIndex: '',
        assistanceUser: '11',
        activeAddress: '',
        createrName: '',
        sTime: null,
        eTime: null
      },
      timeType: ''
    }
  },
  computed: {
    txt () {
      const txt = this.formData.assistanceUser
      if (typeof txt === 'string') {
        if (txt.length > 2) {
          return txt.substring(1)
        }
        return txt
      }
      return ''
    },
    oQuery () {
      return this.$route.query
    }
  },
  methods: {
    back () {
      if (this.$route.query.type === 'edit') {
        this.$router.push({
          path: '/viewActiveDesc'
        })
      }else{
        this.$root.activeData = {...this.formData}
          this.$router.push({
            path: '/'
          })
      }
    },
    getPopData (data) {
      this.popupFull = false
      this.formData[data.key] = data.val
      if(data.id) {
        this.formData['assistanceUserId'] = data.id
      }
    },
    toSelect (name) {
      if (document.querySelector('.on')) {
        document.querySelector('.on').className = ''
      }
      const selected = document.querySelectorAll('.assist-man .selected')
      selected.length && selected.forEach((v, i) => {
        selected[i].className = 's-icon'
      })
      Object.keys(this.popup).forEach(k => {
        this.popup[k] = false
      })
      this.popupFull = true
      this.popup[name] = true
      this.modelTitle = this.popTitle[name]
    },
    openGain () {
      this.popup2 = true
      this.selectedArr = []
      Object.keys(this.checked).forEach(k => {
        this.checked[k] = false
      })
    },
    confirm () {// 权益选择确定
      Object.keys(this.checked).forEach(k => {
        if (this.checked[k]) {
          this.selectedArr.push(this.gain[k])
        }
      })
      this.popup2 = false
    },
    close () {
      this.popup2 = false
    },
    nextStep () {
      const checkObj = {
        activeName: '请输入活动名称',
        number: '请输入人数规模',
        activeStartTime: '请输入活动开始时间',
        activeEndTime: '请输入活动结束时间',
        industry: '请选择所属行业',
        assistanceUser: '请输入辅助人员',
        activeCity: '请选择活动城市'
      }
      const arr = []
      Object.keys(checkObj).forEach(k => {
        if (!this.formData[k]) {
          arr.push(k)
        }
      })
      if (arr.length) {
        this.$notice(checkObj[arr[0]])
        return
      }

      if (this.oQuery.type === 'edit') {
        // 保存修改数据
        this.$axios.post(marketActive.marketbasicEdit, this.formData).then(res => {
          if(res.data.code != 200){
            this.$notice(res.data.message)
            return
          }
          this.$notice('修改成功')
          this.$router.push({
            path: '/viewActiveDesc'
          })
        })
        return
      }
      
      this.formData.equity = this.selectedArr.toString()
      this.$root.$data.activeData = {...this.formData}
      this.$router.push({
        path: '/addCostDesc',
        query: {}
      })
    },
    backGo () {
      let path = ''
      if (this.oQuery.type === 'edit') {
        path = '/viewActiveDesc'
      }
      this.$messageBox.confirm('现在退出，将丢失已编辑的内容<br>确认退出?').then(val => {
        if (val) {
          this.$root.activeData = {}
          this.$router.push({
            path: path || '/index'
          })
        }
      })
      // 返回 清空数据
      this.$root.activeData = {}
    },
    handleChange (val) {
      const date = val.toString()
      const strDate = formatTime(date)
      if (this.timeType === 'strat') {
        this.formData.sTime = strDate
        this.formData.activeStartTime = formatTime(date, 1)
        this.s = val
      } else {
        this.formData.activeEndTime = formatTime(date, 1)
        this.e = val
        this.formData.eTime = strDate
      }
      if (this.s && this.e) {
        let [s, e] = [this.s.getTime(), this.e.getTime()]
        if (e && e <= s) {
          Toast('结束时间应大于开始时间')
          this.formData.eTime = ''
          this.formData.activeEndTime = ''
        }
      }
      // console.log(val)
    },
    open (type, $event) {
      this.timeType = type
      this.$refs.datePicker.open()
    },
    okPop (type) {
      if (type === 'ok') {
      }
      this.popupVisible = false
    }
  },
  mounted () {
    Object.keys(this.formData).forEach(k => {
      this.formData[k] = this.$root.activeData[k]
    })
    this.selectedArr = this.formData.equity ? [].concat(this.formData.equity.split(',')) : []
    this.title = this.oQuery.type === 'edit' ? '编辑市场活动' : '新增市场活动'
    this.formData = this.oQuery.type === 'edit' ? {...this.oQuery.detailData.marketingActiveBasic} : this.formData
    // 转换时间格式
    if (this.oQuery.type === 'edit') {
      this.formData.sTime = formatTime(this.formData.activeStartTime)
      this.formData.eTime = formatTime(this.formData.activeEndTime)
    }
    Object.keys(this.gain).forEach(k => {
      if(this.gain[k] === this.formData.equity){
        this.checked[k] = true
        this.selectedArr.push(this.gain[k])
      }
    })
    // 下拉选择等  不能直接修改input
    this.$nextTick(function () {
      const $input = document.querySelectorAll('.select-icon > input')
      $input.forEach((v, i) => {
        $input[i].readOnly = true
      })
    })
  }
}
</script>
<style lang="scss" scoped>
  .s-icon{
    display: inline-block;
    background: url('../assets/img/close.svg') no-repeat;
    background-size: 100% 100%;
    height: 22px !important;
  }
  .form-wrap{
    &>li:nth-child(1){
      height: 152px;
    }
    &>li:nth-child(2), .li-last{
      margin: 24px 0;
    }
    .li-5{
      margin-bottom: 24px;
    }
    .li-8{
      @extend .li-5;
    }
    .li-last, .li-2{
      &>span{
        position: absolute;
        top: 0;
        right: 28px;
        color: #222222;
      }
    }
  }
  .pop-main{
    li{
      display: flex;
      justify-content: space-between;
      &:last-child{
        &::before{
          height: 0;
        }
      }
    }
    p{
      position: relative;
      flex: 1;
      font-size: 28px;
      color: #222;
      letter-spacing: 2px;
      .check-icon{
        position: absolute;
        right: 40px;
        top: 28px;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        border: 1px solid #E6E6E6;
        svg{
          position: absolute;
          path{
            fill: #fff;
          }
        }
      }
      .check-box{
        height: 100%;
        width: 100%;
        opacity: 0;
        z-index: 20;
      }
    }
  }
  .selected{
    background: #4298F9;
  }
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder{
    color:#C5C9D1;
  }
  input::-moz-placeholder{
    color:#C5C9D1;
  }
  input:-moz-placeholder{
    color:#C5C9D1;
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder{
    color:#C5C9D1;
  }
</style>