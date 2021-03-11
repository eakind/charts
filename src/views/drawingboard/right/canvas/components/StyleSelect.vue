<template>
  <div class="style-select" @click="showPanelHandler">
    <span class="select-title" :class="selected">

    </span>
    <span class="iconfont icon-db_triangle" :class="showPanel ? 'rotated' : ''"></span>
    <div class="select-panel" ref="panelRef" v-if="showPanel"  v-click-out="hide">
       <div v-for="(item, index) in list" :key="index" @click.stop="selectStyle(item, index)">
        <div :class="item">

        </div>
       </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StyleSelect',
  data () {
    return {
      list: ['line', 'dot'],
      selected: this.select,
      showPanel: false
    };
  },
  props: {
    select: {
      type: String
    }
  },
  watch: {
    select: {
      handler () {
        this.selected = this.select;
      },
      immediate: true
    },
    selected (val) {
      // this.$emit('change', val);
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectStyle (item, index) {
      this.selected = item;
      this.showPanel = false;
      this.$emit('change', item);
    },
    hide () {
      setTimeout(() => {
        this.showPanel = false;
      }, 0);
    },
    showPanelHandler () {
      this.showPanel = !this.showPanel;
      if (!this.showPanel) return;
      setTimeout(() => {
        let panel = this.$refs.panelRef;
        panel.style.left = this.$el.getBoundingClientRect().left + 2 + 'px';
        panel.style.top = this.$el.getBoundingClientRect().top + 29 + 'px';
      }, 0);
    }
  }
};
</script>
<style lang='scss' scoped>
.style-select{
  border: 1px solid #a4a4a4;
  border-radius: 4px;
  position: relative;
  height: 28px;
  line-height: 30px;
  width: 110px;
  background-color: #fff;
  .select-title{
    left: 10px;
    top: -4px;
    position: relative;
    display: inline-block;
  }
  .icon-db_triangle{
    position: absolute;
    right: 5px;
    top: 0px;
    color: #a4a4a4;
    display: inline-block
  }
  .rotated{
     transform: rotate(180deg)
  }
  .select-panel{
    background-color: white;
    position: fixed;
    width: 110px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-bottom: 10px;
    margin-top: 6px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    z-index: 999;
    > div {
       height: 30px;
       line-height: 30px;
       text-align: left;
    }
  }
  .line{
    width: 60px;
    border-top: 2px solid black;
    height: 2px;
    display: inline-block;
   }
   .dot{
     width: 60px;
     height: 2px;
     border-top: 2px dotted black;
     display: inline-block;
   }
   .none{
      font-size: 12px;
      display: inline-block;
   }
}
</style>
