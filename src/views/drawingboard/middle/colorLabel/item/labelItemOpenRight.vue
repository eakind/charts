<template>
  <div class="item-open-right" :data-symbol="dataSymbol"  :data-dragging="dragging" v-click-out="hide">
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
        :index="len + index"
        type="labels"
        v-on="$listeners"
        :data-symbol="dataSymbol"
        :data-dragging="dataDragging"
      ></dc-capsule>
    </div>
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
      type: String
    },
    len: {
      type: Number,
    },
    pageLen: {
      type: Number
    }
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
  methods: {
    hide () {
      this.$emit('hide');
    },
  },
};
</script>
<style lang='scss' scoped>
.item-open-right {
  position: fixed;
  background-color: white;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  padding: 0px 60px 10px 104px;
  box-sizing: border-box;
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0 2px 0px 0 rgba(151, 120, 120, 0.1),
    0 4px 4px 0px rgba(0, 0, 0, 0.1);
  // max-height: 130px;
  // overflow-y: auto;
  .item-capsule {
    // min-width: 220px;
    // max-width: 280px;
    width: 50%;
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
}
</style>
