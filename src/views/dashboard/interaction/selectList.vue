<template>
  <div class="select-list" :style="`height: ${selectStyle.height};width: ${selectStyle.width}`">
    <el-checkbox :indeterminate="isIndeterminate" v-model="editSelect.checkAll" @change="handleCheckAllChange">全部</el-checkbox>
    <el-checkbox-group v-model="editSelect.checkedList" @change="handleCheckedItemChange">
      <el-checkbox v-for="item in canvasList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isIndeterminate: true,
      editSelect: {
        checkAll: false,
        checkedList: []
      },
      selectList: []
    };
  },
  props: {
    selectStyle: {
      type: Object,
      default: () => {
        return {
          height: '316px',
          width: '266px',
          boderColor: '#E1E1E1'
        };
      }
    },
    canvasList: {
      type: Array
    },
    selectType: {
      type: String
    }
  },
  watch: {
    canvasList: {
      handler (val) {
        this.selectList = val;
        this.editSelect.checkedList = [];
        for (let i in val) {
          if (this.selectType === 'separate') {
            this.editSelect.checkedList.push(val[i].value);
          } else {
            this.editSelect.checkedList.push(val[i].value);
          }
          this.editSelect.checkAll = true;
          this.$emit('on-selectFeature', val, this.editSelect.checkAll);
        }
      },
      deep: true,
      immediate: true
    },
    selectList: {
      handler (val) {
        if (this.selectType === 'separate') {
          this.$emit('on-selectFeature', val, this.editSelect.checkAll);
        } else {
          this.$emit('on-selectCanvas', val);
        }
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    handleCheckAllChange (val) {
      if (this.editSelect.checkAll) {
        this.editSelect.checkedList = [];
        this.selectList = [];
        this.canvasList.forEach(item => {
          this.editSelect.checkedList.push(item.value);
          this.selectList.push(item);
        });
        this.isIndeterminate = false;
      } else {
        this.editSelect.checkedList = [];
        this.selectList = [];
      }
    },
    handleCheckedItemChange (val) {
      if (this.editSelect.checkedList.length === this.canvasList.length) {
        this.editSelect.checkAll = true;
      } else {
        this.editSelect.checkAll = false;
      }
      this.selectList = [];
      for (let i in val) {
        for (let j in this.canvasList) {
          if (this.selectType === 'separate') {
            if (val[i] === this.canvasList[j].value) {
              this.selectList.push(this.canvasList[j]);
            }
          } else {
            if (val[i] === this.canvasList[j].value) {
              this.selectList.push(this.canvasList[j]);
            }
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.select-list {
  width: 100%;
  overflow-y: auto;
  border: 1px solid #E1E1E1;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.select-list {
  .el-checkbox-group{
    display: flex;
    flex-direction: column;
  }
  .el-checkbox{
    line-height: 32px;
    width: 100%;
    border-bottom: 1px solid #E1E1E1;
    &:last-child {
      border: none;
    }
  }
  .el-checkbox__input {
    margin-left: 10px;
  }
  .is-checked {
    .el-checkbox__label {
      color: #424242;
    }
  }
}
</style>
