<template>
<div class="city-pop pop-padding-top">
  <div class="city-pop-main">
    <ul @click="tabLi" class="city-left">
      <li :data-index="k" v-for="(v, k) in city" :key="k">{{k}}
        <i class="b-r"></i>
      </li>
    </ul>
    <ul @click="select" :class="{'show-ul': k=='直辖市'}" :id="k" v-for="(v, k) in city" :key="k" class="city-right div-wrap">
      <li :data-index="k" v-for="(val, i) in v" :key="i">{{val}}</li>
    </ul>
  </div>
</div>
</template>
<script>
export default {
  name: "City",
  data () {
    return {
      city: {
        '直辖市': ['北京', '上海', '重庆'],
        '广东省': ['深圳']
      }
    }
  },
  methods: {
    tabLi (e) {
      const target = e.target || e.srcElement
      if (document.querySelector('.show-ul')) {
        document.querySelector('.show-ul').className = 'city-right div-wrap'
      }
      if (document.querySelector('.c-on')) {
        document.querySelector('.c-on').className = ''
      }
      if (target.nodeName === 'LI') {
        const { index } = target.dataset
        document.getElementById(index).className = 'city-right div-wrap show-ul'
        target.className = 'c-on'
      }
    },
    select (e) {
      const target = e.target || e.srcElement
      if (target.nodeName !== 'LI') {
        return
      }
      const { index } = target.dataset
      const obj = {key: 'activeCity'}
      if (index === '直辖市') {
        obj.val = target.innerHTML.trim()
      } else {
        obj.val = index + target.innerHTML.trim()
      }
      this.$emit('city', obj)
    }
  }
}
</script>
<style lang="scss" scoped>
.city-pop{
  height: 100%;
}
.show-ul{
  display: block !important;
}
.city-pop-main{
  display: flex;
  height: inherit;
  .city-left{
    width: 196px;
    background: #F4F7F9;
    height: 100%;
    overflow-y: scroll;
    .c-on{
      position: relative;
      color: #222;
      font-weight: 600;
      // border-right: 4px solid #4298F9;
      .b-r{
        position: absolute;
        height: 40px;
        width: 5px;
        top: 40px;
        right: 0;
        background: #4298F9;
        z-index: 2;
      }
    }
    li{
      padding: 40px 0;
      font-size: 28px;
      color: #555;
      line-height: 40px;
    }
  }
  .city-right{
    display: none;
    flex: 1;
    li{
      float: left;
      border: 1px solid #D8DCE0;
      margin: 30px 24px 0;
      overflow: hidden;
      height: 56px;
      padding: 0 36px;
      line-height: 56px;
      text-align: center;
      color: #555;
    }
  }
}
</style>