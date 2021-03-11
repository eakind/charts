<template>
  <div class="filter-value" :title="item.name" :class="isActive">
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
    }
  },
  computed: {
    isActive () {
      return this.item.flag === 1 ? 'filter-active' : '';
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
.filter-value{
  margin-top: 5px;
  color: #424242;
  height: 25px;
  line-height: 25px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0px 10px;
  background-color: #E1E1E1;
  cursor: pointer;
  @include ellipsis;
}
.filter-active{
  background-color: #4284f5;
  color: white;
}
</style>
