<template>
  <div class="scope-num">
    <div class="name" :title="itemObj.name">{{itemObj.name}}</div>
    <div class="scope">
      <input class="scope-input" v-model.number="min" />
      <span class="scope-line"></span>
      <input class="scope-input" v-model.number="max" />
    </div>
    <div class="num">
      <input class="scope-input" v-model.number="num" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      min: 0,
      max: 0,
      num: 0,
      itemObj: {}
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  watch: {
    item: {
      handler (obj) {
        this.min = obj.tick_range.length ? obj.tick_range[0] : obj.min;
        this.max = obj.tick_range.length ? obj.tick_range[1] : obj.max;
        this.num = obj.tick_counts ? obj.tick_counts : obj.num;
        this.itemObj = JSON.parse(JSON.stringify(obj));
      },
      immediate: true,
      deep: true
    },
    min () {
      this.changeTick();
    },
    max () {
      this.changeTick();
    },
    num () {
      this.changeTick();
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    changeTick () {
      this.itemObj.tick_counts = this.num;
      this.itemObj.tick_range = [this.min, this.max];
      this.$emit('change', this.itemObj);
    }
  }
};
</script>
<style lang='scss' scoped>
.scope-num{
  margin: 8px 0px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .name{
    font-size: 14px;
    width: 200px;
    @include ellipsis;
  }
  .scope{
    width: 400px;
    display: flex;
    align-items: center;
  }
  .num {
    width: 200px;
  }
  .scope-line{
    width: 10px;
    height: 1px;
    background-color: #424242;
    display: inline-block;
  }
  .scope-input{
    width: 120px;
    height: 32px;
    margin: 0px 5px;
    border-radius: 4px;
    outline: none;
    padding: 0px 5px;
    box-sizing: border-box;
    border: 1px solid #dedede;
  }
}
</style>
