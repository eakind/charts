<template>
  <div class="align-selection">
    <template v-for="(i,idx) in selection">
      <div class="align-box"
           :key="idx"
           @click="$emit('update:align',i)">
        <icon-svg :icon="retIcon(i)"
                  :className="i===align?'active':'align'"></icon-svg>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    align: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      selection: ['left', 'center', 'right']
    };
  },
  methods: {
    retIcon (target) {
      return '#icon-db_text' + target.substring(0, 1).toUpperCase() + target.substr(1);
    }
  }
};
</script>
<style lang="scss" scoped>
.align-selection {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  line-height: 30px;
  background: #ffffff;
  border: 1px solid #dedede;
  border-radius: 4px;
  .align-box {
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin: 5px;
    text-align: center;
    cursor: pointer;
    .active {
      color: #4284f5;
    }
    .align {
      color: #a4a4a4;
    }
  }
}
</style>
