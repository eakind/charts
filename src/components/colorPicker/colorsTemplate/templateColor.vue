<template>
  <div class="template-color">
    <color-item class="color-item" v-for="(item, index) in list" :key="index" :color="item"
                  :active="item === color" @click="onColorPick(item)"></color-item>
  </div>
</template>
<script>
import ColorItem from '../colorItem.vue';
export default {
  data () {
    return {
      color: this.list[0]
    };
  },
  props: {
    value: {
      type: String
    },
    list: {
      type: Array
    }
  },
  watch: {
    value: {
      handler (val) {
        this.color = val;
      },
      deep: true
    },
    list: {
      handler (array) {
        if (!array.length) return;
        this.color = array[0];
      },
      deep: true
    }
  },
  components: {
    ColorItem
  },
  mounted () {
  },
  methods: {
    onColorPick (item) {
      this.color = item;
      this.$emit('change', item);
    }
  }
};
</script>
<style lang='scss' scoped>
.template-color {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 5px;
  .color-item {
    margin-right: 12px;
    &:nth-child(7n) {
      margin-right: 0px;
    }
  }
}
</style>
