<template>
  <div
    class="item-right"
    :data-symbol="dataSymbol"
    :data-dragging="dataDragging"
  >
    <div
      class="item-capsule"
      :style="setWidth"
      v-for="(item, index) in list"
      :key="index"
      :data-symbol="dataSymbol"
      :data-dragging="dataDragging"
    >
      <span
        class="row-feature"
        :title="item.parentName"
        :data-symbol="dataSymbol"
        :data-dragging="dataDragging"
        >{{ item.parentName }}</span
      >
      <dc-capsule
        :item="item"
        :index="index"
        type="labels"
        v-on="$listeners"
        :data-symbol="dataSymbol"
        :data-dragging="dataDragging"
      ></dc-capsule>
    </div>
    <span
      class="item-right-tip"
      :data-symbol="dataSymbol"
      :data-dragging="dataDragging"
      v-if="!list.length"
      >请放入特征</span
    >
  </div>
</template>
<script>
import DcCapsule from '../../capsule';
export default {
  data () {
    return {};
  },
  props: {
    list: {
      type: Array,
    },
    dataSymbol: {
      type: String,
    },
    dataDragging: {
      type: String,
    },
    pageLen: {
      type: Number,
    },
  },
  computed: {
    setWidth () {
      let width = '50%';
      if (this.pageLen === 1) width = '100%';
      return {
        width: width,
      };
    },
  },
  components: {
    DcCapsule,
  },
  mounted () {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.item-right {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  height: 40px;
  align-items: center;
  .item-capsule {
    width: 50%;
    // max-width: 240px;
    height: 40px;
    display: flex;
    align-items: center;
  }
  .row-feature {
    min-width: 80px;
    max-width: 120px;
    color: #6b6b6b;
    position: relative;
    padding-right: 16px;
    margin-right: 8px;
    box-sizing: border-box;
    @include ellipsis;
    &::after {
      height: 1px;
      width: 12px;
      content: "";
      background-color: #6b6b6b;
      display: inline-block;
      position: absolute;
      top: 50%;
      right: 0px;
    }
  }
  .color-feature {
    flex: 1;
  }
  .item-right-tip {
    font-weight: 300;
    margin-left: 8px;
    font-size: 14px;
    color: #a4a4a4;
    flex: 1;
    height: 40px;
    line-height: 40px;
  }
}
</style>
