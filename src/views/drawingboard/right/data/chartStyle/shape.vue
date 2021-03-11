<template>
<div class="shape-box" v-if="shapeShow">
      <div class="text">{{shapeObj.text}}</div>
      <dc-select-view class="select-view"
                      :select="shapedSelected"
                      :list="shapeObj.list"
                      width='160px'
                      @change="shapeProcess"></dc-select-view>
    </div>
</template>
<script>
import dcSelectView from '@/components/dcselectview/dcSelectView.vue';
export default {
  components: { dcSelectView },
  props: {
    shapeObj: {
      type: Object,
      default: _ => {
        return {
          text: '外形',
          list: [],
          // selected: ''
        };
      }
    },
    shapeShow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    shapedSelected () {
      let item = this.shapeObj.list.find(i => i.checked);
      return item && item.id;
    }
  },
  methods: {
    shapeProcess (item) {
      let list = JSON.parse(JSON.stringify(this.shapeObj.list));
      list.map(i => {
        i.id === item.id ? i.checked = true : i.checked = false;
      });
      this.$emit('change', 'shape', list, item);
    },
  }
};
</script>
<style lang="scss" scoped>
.text{
  font-size: 12px;
  color: #4284F5;
}
.select-view{
  margin: 8px;
}
.shape-box{
  padding: 8px 0;
}
</style>
