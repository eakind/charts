<template>
  <div class="shape-feature" :class="featureActive">
    {{item.name}}
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    item: {
      type: Object
    },
    select: {
      type: Number
    },
    index: {
      type: Number
    }
  },
  computed: {
    featureActive () {
      return this.select === this.index ? 'feature-active' : '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.shape-feature{
  height: 32px;
  line-height: 32px;
  color: #a4a4a4;
  padding: 0px 10px;
  border-radius: 4px;
  box-sizing: border-box;
  background: #F2F2F2;
  cursor: pointer;
  border: 1px solid #f2f2f2;
  margin-top: 10px;
}
.feature-active{
  border: 1px solid #4284f5;
  background-color: white;
  color: #4284f5;
}
</style>
