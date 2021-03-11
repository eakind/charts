<template>
  <div class="item-drop" v-click-out="hide">
    <div class="drop-title" @click="showList=!showList">{{selected}}</div>
    <span
      class="iconfont icon-db_triangle"
      :class="showList?'icon-rotated':''"
      @click="showList=!showList"
    ></span>
    <div class="drop-list" v-if="showList">
      <div v-for="(item, index) in list" :key="index" @click="selectHandler(item)">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    list: {
      type: Array
    },
    select: {
      type: String
    }
  },
  data () {
    return {
      selected: '',
      showList: false
    };
  },
  watch: {
    list: {
      handler (list) {
        if (list.length > 0) {
          if (!this.select) {
            this.selected = this.list[0].name;
          }
        }
      },
      deep: true
    },
    select (val) {
      if (val) {
        this.selected = this.select;
      }
    }
  },
  mounted () {
  },
  methods: {
    hide () {
      this.showList = false;
    },
    selectHandler (item) {
      this.showList = false;
      if (this.selected !== item.name) {
        this.selected = item.name;
        this.$emit('change', item);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.item-drop {
  width: 200px;
  height: 28px;
  border: 1px solid #a4a4a4;
  border-radius: 4px;
  background-color:#e8e8e8;
  color: #424242;
  .drop-title {
    height: 100%;
    line-height: 28px;
    padding: 0px 5px;
  }
  .icon-db_triangle {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 18px;
    display: inline-block;
    color: #424242;
  }
  .icon-rotated {
    transform: rotate(180deg);
  }
  .drop-list {
    position: absolute;
    width: 100%;
    max-height: 200px;
    top: 30px;
    left: 0px;
    z-index: 9;
    border-radius: 4px;
    border: 1px solid #a4a4a4;
    background-color: white;
    > div {
      color: #424242;
      padding: 3px 10px;
    }
  }
}
</style>
