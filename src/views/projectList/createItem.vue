<template>
  <div class="create-item" @click="selectMenu">
    <span class="left-line" :style="isBorder"></span>
    <div class="right-txt">
      <div class="title">{{item.title}}<span v-if="item.tip" class="tip">{{item.tip}}</span></div>
      <div class="desc">{{item.desc}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    isBorder () {
      return `background: ${this.item.borderColor}`;
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectMenu () {
      if (!this.item.url) return;
      this.$router.push({
        path: this.item.url
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.create-item{
  height: 68px;
  overflow: hidden;
  margin: 12px 0px 24px;
  background-color: white;
  box-sizing: border-box;
  display: flex;
  cursor: pointer;
  .left-line {
    height: 68px;
    width: 4px;
    display: inline-block;
  }
  .right-txt{
    flex: 1;
    padding-left: 20px;
  }
  .title{
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    color: #424242;
    font-weight: bold;
  }
  .desc {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #666666;
  }
  .tip {
    font-size: 18px;
    color: #4284F5;
    margin-left: 5px;
  }
}
</style>
