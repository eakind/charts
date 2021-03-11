<template>
  <div class="dc-select-view"  @click="showListHandler" :style="{width: width}">
    <span class="select-view-title">{{selected}}</span>
    <span class="iconfont icon-db_triangle" :class="showList ? 'rotated' : ''"></span>
    <div class="dc-select-view-list"  v-if="showList" :style="setPos"  v-click-out="hide">
      <ul >
        <li v-for="(item, index) in list" :key="index" :class="selected == item.name ? 'view_active' : ''" @click="selectItem(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DcSelectView',
  props: {
    list: {
      type: Array,
      default: function () {
        return [{ name: '标准视图', id: 'standard' }, { name: '适应宽度', id: 'fitWidth' }, { name: '适应高度', id: 'fitHeight' }, { name: '完整视图', id: 'full' }];
      }
    },
    select: {
      type: [String, Object],
      default: 'standard'
    },
    width: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      showList: false,
      selected: ''
    };
  },
  watch: {
    select (val) {
      this.selected = '';
      this.list.forEach(l => {
        if (l.id === val) this.selected = l.name;
      });
    },
    list () {
      this.selected = '';
      this.list.forEach(l => {
        if (l.id === this.select) this.selected = l.name;
      });
    }
  },
  computed: {
    setPos () {
      if (!this.showList) return;
      let width = this.$el.clientWidth;
      let left = this.$el.getBoundingClientRect().left;
      let top = this.$el.getBoundingClientRect().bottom + 1;
      return {
        width: `${width}px`,
        left: `${left}px`,
        top: `${top}px`
      };
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    this.list.forEach(l => {
      if (l.id === this.select) this.selected = l.name;
    });
  },
  destroyed () {
  },
  methods: {
    showListHandler () {
      this.showList = !this.showList;
    },
    hide () {
      setTimeout(() => {
        this.showList = false;
      }, 0);
    },
    selectItem (item) {
      this.selected = item.name;
      this.$emit('change', item);
    }
  }
};
</script>

<style scoped lang="scss">
.dc-select-view{
  height: 28px;
  line-height: 28px;
  text-align: left;
  border: 1px solid #DEDEDE;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  font-size: 14px;
  min-width: 110px;
  background-color: white;
  display: inline-block;
  .select-view-title{
    display: inline-block;
    width: 80%;
    text-indent: 10px;
    @include ellipsis;
  }
  span{
    color: #424242;
  }
  .dc-select-view-list{
    z-index: 3002;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 3px;
    border: 1px solid #a4a4a4;
    position: fixed;
    background-color: white;
    ul{
      list-style-type: none;
      margin: 0px;
      padding: 0px;
      width: 101%;
      left: -1px;
      position: relative;
      li{
        margin: 0px;
        padding: 0px 10px;
        text-align: left;
        text-indent: 0px;
        @include ellipsis;
      }
      .view_active{
        color: white;
        border: 1px solid #4284f5;
        background-color: #4284f5;
      }
    }
  }
  .icon-db_triangle{
    color: #a4a4a4;
    display: inline-block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 5px;
  }
  .rotated{
     transform: rotate(180deg) translateY(50%);
  }
}
</style>
