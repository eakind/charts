<template>
  <div class="user-edit-box">
    <dc-alert class="edit-alert">
      <div class="title">
        选择{{itemDetail.title}}
        <span class="iconfont icon-db_plus" @click="cancel"></span>
      </div>
      <div class="dc-alert-body">
        <search-input :value="userName" @change="searchChange"></search-input>
        <div class="content-box">
          <el-checkbox-group v-model="checkedList">
            <el-checkbox v-for="item in userList" :label="item.user_id" :key="item.user_id">{{item.user_name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="footer">
          <span class="yes" @click='confirm'>确定</span>
          <span class="cancel" @click='cancel'>取消</span>
        </div>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import SearchInput from '@/components/searchinput/searchInput.vue';
import DcAlert from '@/components/dcalert/dcAlert.vue';
export default {
  data () {
    return {
      userName: '',
      checkedList: [],
      userList: [],
      allSelectList: [],
      originList: []
    };
  },
  props: {
    editFlag: {
      type: Boolean,
      default: false
    },
    editUserList: {
      type: Array
    },
    itemDetail: {
      type: Object
    }
  },
  components: {
    SearchInput,
    DcAlert
  },
  mounted () {
    this.userList = [];
    let allUsers = JSON.parse(JSON.stringify(this.editUserList.allUsers));
    for (let i in allUsers) {
      if (!allUsers[i].disabled) {
        this.userList.push(allUsers[i]);
      }
    }
    if (this.itemDetail.list.length !== 0) {
      this.itemDetail.list.forEach(item => {
        this.userList.push(item);
      });
    }
    this.userList = this.userList.filter((item, index, self) => index === self.findIndex((t) => (t.user_id === item.user_id)));
    this.originList = JSON.parse(JSON.stringify(this.userList));
    this.checkedList = [];
    this.itemDetail.list.forEach(item => {
      this.checkedList.push(item.user_id);
    });
  },
  methods: {
    searchChange (val) {
      this.userList = [];
      if (val !== '') {
        this.originList.forEach(list => {
          if (list.userName.indexOf(val) >= 0) {
            this.userList.push(list);
          };
        });
      } else {
        this.userList = this.originList;
      }
    },
    confirm () {
      if (this.itemDetail.value === 'admin') {
        if (this.checkedList.length > 1) {
          this.$message({
            message: '只能选择一个管理者',
            type: 'warning'
          });
          return;
        }
      }
      let checkItem = [];
      for (let i in this.checkedList) {
        for (let j in this.userList) {
          if (this.checkedList[i] === this.userList[j].user_id) {
            checkItem.push(this.userList[j]);
          }
        }
      }
      for (let i in checkItem) {
        if (this.itemDetail.value === 'admin') {
          checkItem[i].permission = 'O';
        } else if (this.itemDetail.value === 'editors') {
          checkItem[i].permission = 'E';
        } else if (this.itemDetail.value === 'viewers') {
          checkItem[i].permission = 'V';
        }
      }
      let key = this.itemDetail.value;
      this.editUserList[key] = checkItem;
      if (this.editUserList.admin.length === 0) {
        this.$message({
          message: '请至少指定一个管理者',
          type: 'warning'
        });
        return;
      }
      this.$emit('on-confirm', this.editUserList);
    },
    cancel () {
      this.$emit('on-cancel');
    }
  }
};
</script>
<style lang="scss" scoped>
.user-edit-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .2);
  z-index: 9999;
}
.edit-alert {
  width: 400px;
  height: 412px;
  box-sizing: border-box;
  .title {
    font-size: 14px;
    font-weight: bold;
    padding: 16px 16px 8px;
    box-sizing: border-box;
    color: #424242;
    position: relative;
  }
  .icon-db_plus {
    right: 15px;
    transform: rotate(45deg);
    display: inline-block;
    position: absolute;
    color: #a4a4a4;
  }
  .dc-alert-body {
    height: calc(100% - 45px);
  }
}
.content-box {
  padding: 8px;
  height: 270px;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid #DEDEDE;
  margin-top: 8px;
}
/deep/ .searchinput {
  width: 100%;
}
.footer {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  position: relative;
  >span {
    display: inline-block;
    width: 120px;
    height: 40px;
    box-sizing: border-box;
    cursor: pointer;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
    color: #A4A4A4;
  }
  .yes {
    color: #4284F5;
  }
}
</style>
<style lang="scss">
.content-box {
  .el-checkbox {
    width: calc(100% - 24px);
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E1E1E1;
    display: flex;
    align-items: center;
    .el-checkbox__label {
      width: 100%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
}
</style>
