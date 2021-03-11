<template>
  <div class="base-input">
    <el-input v-model="value" v-bind="$attrs" v-on="$listeners">
       <template slot="prepend"><slot name="prepend"></slot></template>
       <template slot="append"><slot name="append"></slot></template>
       <template slot="prefix"><slot name="prefix"></slot></template>
       <template slot="suffix"><slot name="suffix"></slot></template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'base-input',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  }
};
</script>

<style>
.el-input__inner {
  border: 1px solid #DEDEDE;
  padding: 0 10px;
}
.el-textarea__inner {
  border: 1px solid #DEDEDE;
  padding: 5px 10px;
}
.el-input-group__append, .el-input-group__prepend {
  padding: 0 5px;
  background-color: #4284F5;
  border: 1px solid #4284F5;
  color: white;
}
.el-input--mini .el-input__inner {
  height: 24px;
  line-height: 24px;
}
.el-input--small .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
<style lang="scss" scoped>
  .base-input {
    display: inline-block;
    width: 100%;
  }
</style>
