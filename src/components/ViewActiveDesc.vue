<template>
  <div class="view-active-desc padding-bot">
    <v-header title="市场活动详情" />
    <header-desc :headerInfo.sync="detailData"/>
    <ul class="tab-bar">
      <li @click="tabBar(1)" class="on-type"><i class="under-line"></i>活动信息</li>
      <li ref="tabLi2" @click="tabBar(2)"><i class="under-line"></i>指标信息</li>
      <li @click="tabBar(3)"><i class="under-line"></i>名片管理</li>
    </ul>
    <div class="view-main div-wrap" id="active_info">
      <ul class="form-wrap">
        <li class="form-box-first">
          <h3>基本信息</h3>
          <p class="edit-btn" @click="toEdit('1')" v-show="btnShow">编辑</p>
        </li>
        <li v-for="(v, k) in data1" :key="k" :class="{'gain-box': k.indexOf('权益')>-1}" class="form-box">
          <label :class="{'user-text': k.indexOf('指标')>-1}" class="display-inline-block">{{k}}:</label>
          <p v-show="k.indexOf('权益')==-1" class="display-inline-block">{{v}}</p>
          <p v-show="k.includes('权益')" class="display-inline-block">
            <span class="good-box">{{v}}</span>
          </p>
        </li>
      </ul>
      <ul v-show="isShow1" class="cost-info-desc top-border form-wrap">
        <li class="form-box-first top-border-no ">
          <h3>成本信息</h3>
          <p class="edit-btn" @click="toEdit('2')">编辑</p>
        </li>
        <li>
          <ul class="cost-mess">
            <li class="form-box" v-for="(v, k) in data2" :key="k">
              <label class="display-inline-block">{{k}}:</label>
              <p class="display-inline-block">{{v}}</p>
            </li>
          </ul>
        </li>
      </ul>
      <ul v-show="isShow2" class="target-info-desc">
        <li class="form-box-first top-border-no">
          <h3>指标信息</h3>
          <p class="edit-btn" v-show="btnShow1" @click="toEdit('3')">编辑</p>
        </li>
        <li v-show="null">
          <no-data tips="还未添加指标信息" />
        </li>
        <li :class="{item1: type == 'manager' && managerOwnTarget(v)}" :data-index="k" class="info-item" v-for="(v, k) in targetList" :key="k">
          <div :class="{usercolor: type == 'manager'&& !managerOwnTarget(v)}" class="item-left">
            <p>{{avatarName(v.username)}}</p>
            <!-- <p>XXX</p> -->
          </div>
          <div class="item-center">
            <p>{{v.username}}</p>
            <p>可分配人员：{{v.indicatorNumber}}名</p>
          </div>
        </li>
      </ul>
      <ul v-show="isShow3" class="card-info-desc form-wrap">
        <!-- <li class="form-box-first top-border-no">
          <h3>分配信息</h3>
          <p class="edit-btn" @click="manUpdate" v-show="btnShow">变更</p>
          <p class="edit-btn" @click="manUpdate" v-show="btnShow1">添加销售人员</p>
        </li> -->
        <li v-show="noData" style="border:none">
          <no-data tips="还未添加名片信息" />
        </li>
        <li v-show="!noData" class="info-item" v-for="(v, k) in contactList" :key="k">
          <div>
            <h3>{{v.companyName}}</h3>
            <ul class="detail-info">
              <li class="active-rank r-a" :class="contactLevel(v.infoGrade)">{{v.infoGrade}}级</li>
              <li class="contact-man">{{v.contacter}}</li>
              <li class="people-num">{{v.phone}}</li>
            </ul>
          </div>
          <!-- <div class="item-center">
            <p>人数限额</p>
            <p>100</p>
          </div>
          <div>
            <p>指标数</p>
            <p>1</p>
          </div> -->
          <!-- <div v-show="btnShow1">删除</div> -->
        </li>
      </ul>
    </div>
    <div class="footer footer-fixed div-wrap">
      <p class="footer-main">
        <span @click="addContact">添加名片</span>
        <span @click="toScanCode">扫描名片</span>
      </p>
    </div>
    <div v-show="videoShow" class="code-box">
      <div id="video"></div>
      <div id="result"></div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import { marketActive, contact } from '../utils/api'
const scan = new QRScan('video')

export default {
  name: "ViewActiveDesc",
  components: {
    headerDesc: () => import('./header-desc.vue'),
    noData: () => import('./NoData.vue')
  },
  data () {
    return {
      videoShow: false,
      detailData: {},
      data1: {
        // '活动名称': 'XXX',
        // '开始时间': 'XXX',
        // '结束时间': 'XXX',
        '主办城市': '',
        '主办方': '',
        '活动规模': '',
        '行业归属': '',
        // '活动规模': 'XXX',
        '活动权益': '',
        '我的指标': '',
        // '人员限额': 'XXX',
        // '活动地址': 'XXX',
        '活动负责人': '',
        '市场辅助人': ''
      },
      data2: {
        '赞助/项目成本': '',
        '物料成本': '',
        '门票成本': '',
        '市场部差旅费': '',
        '其他费用': '',
        '其他费用说明': '',
        '备注': '',
      },
      data3: {},
      isShow1: true,
      isShow2: false,
      isShow3: false,
      btnShow: true,
      btnShow1: false,
      timer: null,
      // 指标列表信息
      targetList:[],
      // 名片信息
      contactList:[]
    }
  },
  created () {
    
  },
  mounted () {
    // 获取详情数据
    this.getDetailData()

    const type = this.type
    if (type === 'market') {
      this.btnShow1 = true
    }
    if (type === 'sell') {
      this.isShow1 = false
      this.isShow2 = false
      this.btnShow = false
      this.$refs.tabLi2.style.display = 'none'
    }
    if (type === 'manager') {
      this.isShow1 = false
      this.btnShow = false
      this.btnShow1 = false
    }
    document.querySelector('.user-text').innerHTML = type === 'market' ? '我的指标' : '总指标数'


    if(this.$route.query.flag === 'contact'){
      this.tabBar(3)
    }
  },
  computed: {
    type () {
      return this.$getStore('userType')
    },
    query () {
      return this.$route.query
    },
    noData () {
      return this.contactList.length < 1
    }
  },
  destroyed () {
    window.setInterval(this.timer)
  },
  methods: {
    getDetailData () {
      let params = {}
      params.roleCode = JSON.parse(this.$getStore('userInfo')).roleCode
      params.userId = JSON.parse(this.$getStore('userInfo')).id
      params.marketingActiveId = this.$getStore('marketId') //this.$root.$data.marketingActiveId || 
      this.$axios.post(marketActive.getDetailInfo, params).then(res => {
        if (res.data.code !== 200) {
          this.$notice(res.data.message)
          return
        }
        this.detailData = res.data.data
        this.detailData.marketingActiveBasic.assistanceUser = res.data.data.marketingAssistanceUser
        // this.query.activeDetail.marketingCreater = res.data.data.marketingCreater
        let basicData = res.data.data.marketingActiveBasic
        this.data1 = {
          '主办城市': basicData.activeCity,
          '主办方': basicData.activeHost,
          '活动规模': basicData.number+'人',
          '行业归属': basicData.industry,
          '活动权益': basicData.equity,
          '我的指标': basicData.recoveryIndex+'个',
          '活动负责人': res.data.data.marketingCreater,
          '市场辅助人': res.data.data.marketingAssistanceUser
        },
        this.data2 = {
          '赞助/项目成本': basicData.sponsorFee,
          '物料成本': basicData.materialFee,
          '门票成本': basicData.admissionTicket,
          '市场部差旅费': basicData.travelExpenses,
          '其他费用': basicData.otherFee,
          '其他费用说明': basicData.otherfeeRemark,
          '备注': basicData.remark,
        },
        // 总的指标数保存  在分配指标时要使用
        this.$setStore('totalIndexNum', basicData.recoveryIndex)
        console.log(res.data.data)
      })
    },
    block (dom) {
      dom.style.display = 'block'
    },
    tabBar (i) {
      const tabLi = document.querySelectorAll('.tab-bar li')
      const oDom = document.querySelectorAll('#active_info>ul')
      const len = tabLi.length
      for (let i = 0; i < len; i++) {
        tabLi[i].className = ''
        oDom[i].style.display = 'none'
      }
      oDom[3].style.display = 'none'
      if (i === 1) {
        tabLi[0].className = 'on-type'
        this.block(oDom[0])
        if (this.type === 'market') {
          this.block(oDom[1])
        }
      } else if (i === 2) {
        tabLi[1].className = 'on-type'
        this.block(oDom[2])
        // 指标信息
        this.getData(i, marketActive.targetList)

      } else {
        tabLi[2].className = 'on-type'
        this.block(oDom[3])
        // 名片列表
        this.getData(i, contact.viewList)
      }
    },
    getData (i, url) {
      let params = {
        marketingActiveId: this.$getStore('marketId')
      }
      this.$axios.post(url, params).then(res => {
        if (res.data.code !== 200) {
          this.$notice(res.data.message)
          return
        }
        if(i === 2) {
          this.targetList = res.data.data
          // dom渲染完毕后再调用的方法
          this.$nextTick(function(){
            let item1Dom= document.querySelector('.item1')
            console.log(item1Dom)
            item1Dom && item1Dom.addEventListener('click', () => {
              let index = item1Dom.dataset.index
              this.$setStore('targetDetail', JSON.stringify(this.targetList[index]))
              if (this.type === 'manager') {
                this.$router.push({
                  path: '/sellManUpdate',
                  query: {user: this.type}
                })
              }
            })
          })
        }else {
          this.contactList = res.data.data
        }
      })
    },
    tick () {
      const self = this
      this.timer = setInterval(self.startScan, 1500)
    },
    startScan () {
      // let reDiv = document.getElementById('result')
      const self = this
      scan.getImgDecode(function (data) {
        console.log(data)
        let p = document.createElement('p')
        let txt = ''
        if (data.success) {
            p.innerHTML = 'RESULT: ' + data.payload
            txt = 'RESULT: ' + data.payload
            window.clearInterval(self.timer)
        } else {
            p.innerHTML = 'ERROR: ' + data.msg
            Toast('ERROR: ' + data.msg)
        }
        // reDiv.appendChild(p)
      })
    },
    toScanCode () {
      this.videoShow = true
      scan.openScan()
      this.tick()
      this.$router.push({
        path: '/qrScan'
      })
    },
    addContact () {
      this.$router.push({
        path: '/addContact',
        query: {activeName: this.detailData.marketingActiveBasic.activeName}
      })
    },
    toEdit (index) {
      const path = {
        '1': '/addMarketActive',
        '2': '/addCostDesc',
        '3': '/targetInfo'
      }
      this.$root.$data.addEdit = 'targetEdit'
      this.$router.push({
        path: path[index],
        query: {type: 'edit', detailData: this.detailData}
      })
    },
    manUpdate () {
      this.$router.push({
        path: '/sellManUpdate'
      })
    },
    avatarName (name) {
      if(typeof name === 'string'){
        if(name.length > 2){
          return name.substring(1)
        }
        return name
      }
    },
    // 判断是不是当前区域总的指标
    managerOwnTarget (target) {
      let userId = JSON.parse(this.$getStore('userInfo')).id
      return target.userId === userId
    },
    // 卡片等级
    contactLevel (level) {
      if(level == 'A') {
        return 'level-a'
      }else if(level == 'B') {
        return 'level-b'
      }
    },
    // 指派
    assign (item) {
      // this.$route.push({
      //   path: '/'
      // })
    }

  }
}
</script>
<style lang="scss" scoped>
.usercolor{
  background: #ccc !important;
  opacity: .7;
}
.footer-main{
  display: block;
  text-align: right;
  font-size: 24px;
  color: #222222;
  span{
    display: inline-block;
    width: 148px;
    height: 64px;
    vertical-align: center;
    text-align: center;
    line-height: 64px;
    margin: 17px 24px 17px 0;
    &:nth-child(1){
      transform: translateY(1px);
      border: 1px solid #E6E6E6;
    }
    &:nth-child(2){
      color: #fff;
      background: #4298F9;
    }
  }
}
.detail-info{
  padding-top: 10px;
  font-size: 24px;
  color: #9DA0A7;
  .level-a{
    color: #FF5846;
  }
  .level-b{
    color: #FFB600;
  }
  &>li{
    display: inline-block;
    vertical-align: top;
    &:nth-child(1){
      padding-right: 16px;
    }
    &:nth-child(2){
      border-right: 1px solid #9DA0A7;
      border-left: 1px solid #9DA0A7;
      padding: 0 16px;
    }
    &:nth-child(3){
      padding-left: 16px;
    }
  }
}
.card-info-desc{
  padding: 20px 0 0 56px;
  .no-data-box{
    position: relative;
    transform: translateX(-28px);
  }
  &>li{
    height: 150px;
    border: none;
    border-bottom: 1px solid #E8EAEC;
    text-align: left;
    div{
      flex: 1;
    }
    p:nth-child(1){
      font-size: 30px;
      color: #222222;
      font-weight: bold;
    }
  } 
}
.target-info-desc{
  padding: 0 40px;
  &>li{
    margin-top: 32px;
    align-items: center;
    .item-left{
      width: 88px;
      height: 88px;
      margin: 0 32px;
      border-radius: 50%;
      background: #4298F9;
      p{
        font-size: 32px;
        color: #fff;
        line-height: 88px;
      }
    }
    .item-center{
      flex: 1;
      text-align: left;
      p{
        font-size: 26px;
        color: #555555;
        padding-top: 8px;
      }
      p:nth-child(1){
        font-size: 32px;
        color: #222222;
      }
    }
  }
}
.cost-mess{
  border-radius:4px;
  border:1px solid rgba(232,234,236,1);
  &>li{
    height: 64px;
    font-size: 24px;
    line-height: 64px;
    &:nth-child(odd){
      background:rgba(244,247,249,1);
    }
    label{
      width: 230px;
      color: #9DA0A7;
      padding: 0 24px;
    }
    p{
      color: #555555;
    }
  }
}
.form-box{
  border: none;
  height: 60px;
  line-height: 60px;
}
.view-main{
  ul{
    position: relative;
    .no-data-box{
      position: relative;
    }
  }
}
.form-wrap{
  li:nth-child(10){
    p{
      width: calc(100% - 200px);
    }
  }
}
video {
  display: block;
  margin: 0 auto;
  width: 240px;
  height: 240px;
  background: #000;
  border-radius: 5px;
}
.code-box{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.2);
}
.tab-bar{
  display: flex;
  height: 72px;
  font-size: 28px;
  color: #9DA0A7;
  line-height: 72px;
  border-bottom: 1px solid #D8DCE0;
  li{
    position: relative;
    flex: 1;
    i{
      bottom: 0;
    }
  } 
}
.active-rank{
  padding-right: 16px;
}
.contact-man{
  border-left: 1px solid #9DA0A7;
  border-right: 1px solid #9DA0A7;
  padding: 0 16px;
}
.people-num{
  padding-left: 16px;
}
h3{
  font-size: 30px;
  color: #222222;
}

</style>