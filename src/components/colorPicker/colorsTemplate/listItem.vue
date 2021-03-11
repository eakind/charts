<template>
  <div class="list-item">
    <span class="square"></span>
    <span class="item-name">feature name</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
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
.list-item{
  display: flex;
  margin-top: 5px;
  padding: 5px;
  border-radius: 4px;
  align-items: center;
  background-color: #dedede;
  .square {
    width: 15px;
    height: 15px;
    margin-right: 5px;
    border-radius: 3px;
    border: 1px solid white;
    background-color: #4284f5;
  }
  .item-name {
    color: #424242;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
