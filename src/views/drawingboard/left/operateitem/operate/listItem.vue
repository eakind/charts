<template>
  <div class="list-item">
    <div>{{item}}</div>
    <div>
      <input v-model="value" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ListItem',
  data () {
    return {
      value: ''
    };
  },
  props: {
    item: {
      type: [Object, String, Number]
    }
  },
  components: {},
  mounted () {
    this.value = this.item;
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.list-item {
  display: flex;
  margin: 5px;
  > div {
    flex: 1;
    height: 28px;
    line-height: 28px;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 0px 15px 0px 0px;
    border: 1px solid #dedede;
    &:nth-child(1) {
      padding: 0px 5px;
    }
    &:nth-child(2) {
      margin: 0px;
      > input {
        height: calc(100% - 1px);
        width: 100%;
        border: none;
        padding: 0px 5px;
        margin: 0px;
        outline: none;
        border-radius: 4px;
        box-sizing: border-box;
        background-color: white;
      }
    }
  }
}
</style>
