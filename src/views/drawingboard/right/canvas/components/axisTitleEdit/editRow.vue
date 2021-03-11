<template>
  <div class="edit-row">
    <div class="row-left" @click="toggleHandler">
      <canvas-checked :active="itemObj.show"></canvas-checked>
    </div>
    <div class="row-other">
      <span class="origin-name">{{itemObj.feature}}</span>
    </div>
    <div class="row-other mid">
      <input class="new-name" placeholder="请输入" v-model="itemObj.value" @keyup="changeHandler" />
    </div>
  </div>
</template>
<script>
import CanvasChecked from '../canvasChecked.vue';
export default {
  data () {
    return {
      itemObj: {}
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {
    item: {
      handler (obj) {
        if (!obj) return;
        this.itemObj = JSON.parse(JSON.stringify(obj));
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    CanvasChecked
  },
  mounted () {
  },
  methods: {
    toggleHandler () {
      this.$set(this.itemObj, 'show', !this.itemObj.show);
      this.$emit('change', this.itemObj, this.index);
    },
    changeHandler () {
      this.$emit('change', this.itemObj, this.index);
    }
  }
};
</script>
<style lang='scss' scoped>
.edit-row{
  display: flex;
  height: 30px;
  margin: 5px 0px;
  align-items: center;
  .row-left{
     width: 70px;
  }
  .row-other{
    flex:1;
    width: 0px;
  }
  .origin-name{
    width: 100%;
    background-color: #F2F2F2;
    display: block;
    margin: 0px 10px;
    height: 30px;
    font-size: 14px;
    padding: 0px 5px;
    box-sizing: border-box;
    line-height: 30px;
    @include ellipsis;
  }
  .new-name{
    padding: 0px 5px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #dedede;
    border-radius: 4px;
    outline: none;
  }
}
.mid {
  margin-left: 10px;
  padding: 0px 10px;
}
</style>
