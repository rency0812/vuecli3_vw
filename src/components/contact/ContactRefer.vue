<template>
<div class="contact-refer">
  <v-header title="跟进名片"/>
  <ul>
    <li class="form-box li-1 select-icon">
      <label class="display-inline-block">名片等级</label>
      <input readonly class="display-inline-block" type="text" placeholder="请选择"/>
    </li>
    <li style="height:auto;" class="form-box li-final-box">
      <!-- <label class="display-inline-block">活动地址</label> -->
      <textarea rows="3" class="display-inline-block" placeholder="请输入备注（200字内）"></textarea>
    </li>
  </ul>
  <div class="footer back-color footer-fixed">
    <p class="div-wrap footer-main">
      <span class="border-right">取消</span>
      <span>保存</span>
    </p>
  </div>
  <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
    <p @click="okPop" class="pop-cel div-wrap">取消</p>
    <p @click="okPop" class="pop-ok div-wrap">确定</p>
    <mt-picker :slots="Slots" @change="onDateChange" :visible-item-count="5" :show-toolbar="false"></mt-picker>
  </mt-popup>
</div>
</template>
<script>
export default {
  name: "ContactRefer",
  data () {
    return {
      popupVisible: false
    }
  }
}
</script>
<style lang="scss" scoped>
.contact-refer{
  height: 100%;
  background: #F4F7F9;
  .li-1{
    margin: 25px 0;
  }
  textarea{
    height: 240px;
  }
}
</style>