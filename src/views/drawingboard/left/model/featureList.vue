<template>
  <div class="feature-list">
    <div
      :class="setActive(item)"
      v-for="(item, index) in list"
      v-show="item.feature_name.includes(searchValue)&&targetName!==item.feature_name"
      :key="index"
      :title="item.feature_name"
      @click="selectHandler(item, index)"
    >{{item.feature_name}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    list: {
      type: Array
    },
    dataType: {
      type: String
    },
    searchValue: {
      type: String,
      default: ''
    },
    targetName: {
      type: String
    }
  },
  watch: {
    list: {
      handler (arr) {
      },
      deep: true
    }
  },
  components: {},
  mounted () {},
  methods: {
    selectHandler (item, index) {
      this.$emit('change', item, index, this.dataType);
    },
    setActive (item) {
      if (item.selected === 1) {
        if (this.dataType === 'CAT') {
          return 'green';
        }
        return 'blue';
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-list {
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  background-color: white;
  > div {
    padding: 5px;
    color: #424242;
    cursor: pointer;
    @include ellipsis;
    border: 1px solid #DEDEDE;
    border-radius: 4px;
    margin: 5px 0px 0px 0px;
  }
  .green {
    color: white;
    border: 1px solid #03b98c;
    background-color: #03b98c;
  }
  .blue {
    color: white;
    border: 1px solid #4284f5;
    background-color: #4284f5;
  }
}
</style>
