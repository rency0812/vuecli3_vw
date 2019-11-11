<template>
  <div v-show="isFalse" class="v-header">
    <slot><i @click="back" v-show="show" class="icon-arrow-left"><span>&lt;</span></i></slot>
    <p>{{title}}</p>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'

export default {
  name: "v-header",
  props: {
    title: String
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    back () {
      const { meta, query } = this.$route
      // let confirm = null
      // if (meta.in) {
      //   confirm = await MessageBox.confirm('现在退出，将丢失已编辑的内容<br>确认退出?')
      // }
      // console.log(confirm)
      if (!meta.pre) {
        this.$router.go(-1)
        return
      }
      if (query.type === 'edit' || query.find === 'contact') {
        this.$router.push({
          path: meta.editPath || meta.pre
        })
        return
      }
      // if (query.find === 'contact') {
      //   this.$router.push({
      //     path: meta.editPath
      //   })
      //   return
      // }
      if (query.type === 'addManager') {
        this.$router.push({
          path: '/targetInfo'
        })
        return
      }
      this.$router.push({
        path: meta.pre
      })
    }
  },
  computed: {
    // show () {
    //   const name = this.$route.name
    //   if (name === 'city' || name === 'assistMan' || name === 'industry') {
    //     return false
    //   }
    //   return true
    // },
    isFalse () {
      const name = this.$route.name
      if (name === 'home' || name === 'index' || name === 'contact' || name === 'me') {
        return false
      }
      return true
    }
  },
  mounted () {
    console.log(this)
  }
}
</script>
<style lang="scss" scoped>
  .v-header{
    position: fixed;
    top:0;
    left: 0;
    display: flex;
    width: 100%;
    height: 88px;
    text-align: left;
    line-height: 88px;
    font-weight: bold;
    margin-bottom: 24px;
    background: #fff;
    color: #555555;
    font-size: 32px;
    z-index: 2;
    p{
      flex: 1;
    }
  }
  .icon-arrow-left{
    width: 60px;
    height: 100%;
    text-align: center;
    font-weight: bold;
    transform: scaleY(1.5) translateY(-1px);
  }
</style>