<template>
  <div class="template-select"  @click="showListHandler">
    <span class="select-view-title">{{selected}}</span>
    <span class="iconfont icon-db_triangle" :class="showList ? 'rotated' : ''"></span>
    <div class="dc-select-view-list"  v-if="showList" v-click-out="hide">
      <ul >
        <li v-for="(item, index) in list" :key="index" :class="selected == item.name ? 'view_active' : ''" @click.stop="selectItem(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    },
    select: {
      type: [String, Object],
      default: 'standard'
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
      this.showList = false;
    }
  }
};
</script>

<style scoped lang="scss">
.template-select{
  height: 28px;
  line-height: 30px;
  text-align: left;
  border: 1px solid #a4a4a4;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  top: 3px;
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
    max-height: 100px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 3px;
    border: 1px solid #a4a4a4;
    top: 30px;
    position: absolute;
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
    top: 0px;
    right: 5px;
  }
  .rotated{
     transform: rotate(180deg)
  }
}
</style>
