
<template>
  <!-- 表格title编辑框 -->
  <div class="table-title-edit-box">
    <div class="head flex">
      <div class="title">{{$t('message.tableTitleName')}}</div>
      <div class="close-icon-box"
           @click="$emit('on-close-edit')">
        <icon-svg class="icon"
                  className='icon-close'
                  icon="#icon-db_plus"></icon-svg>
      </div>
    </div>
    <div class="tips-box flex">
      <div class="tips">{{$t('message.tableTitleTips')}}</div>
      <div class="btn-reset" @click="resetData">{{$t('message.resetDefault')}}</div>
    </div>
    <div class="content">
      <div class="thead flex">
        <div>{{$t('message.originalName')}}</div>
        <div>{{$t('message.showColumnName')}}</div>
      </div>
      <template v-for="(i,index) in curTableTitleData">
        <div class="column flex" :name="i.key+'_'+i.display"
             :key="i.key+'_'+i.display">
          <div class="flex item">
            <span @click.stop="change(i,index)"
                  class="check">
              <dc-check :active="i.display!=='none'"></dc-check>
            </span>

            <span>{{$t('message.db_display')}}</span>
            <div class="name">{{tableTitleData[index].key}}</div>
          </div>
          <div>
            <input type="text"
                   placeholder="请输入"
                   v-model="i.title" />
          </div>
        </div>
      </template>

    </div>
    <div class="btn-group">
      <div class="btn-sure"
           @click="sure">{{$t('message.confirm')}}</div>
      <div class="btn-cancel"
           @click="$emit('on-close-edit')">{{$t('message.cancel')}}</div>
    </div>
  </div>
</template>
<script>
import DcCheck from '../../../left/model/dcCheck';
export default {
  name: 'tableTitleEdit',
  components: { DcCheck },
  props: {
    tableTitleData: {
      type: Array,
      default: _ => []
    }
  },
  data () {
    return {
      curTableTitleData: []
    };
  },
  watch: {
    tableTitleData: {
      handler (val) {
        this.curTableTitleData = [];
        let list = JSON.parse(JSON.stringify(val));
        list.map(i => {
          this.curTableTitleData.push(i);
        });
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    sure () {
      this.$emit('on-close-edit');
      this.$emit('on-canvasCss-change', 'tableTitleData', this.curTableTitleData);
    },
    change (item, idx) {
      item.display = item.display === 'auto' ? 'none' : 'auto';

      this.$set(this.curTableTitleData, idx, item);
    },
    resetData () {
      this.curTableTitleData = JSON.parse(JSON.stringify(this.tableTitleData));
      this.curTableTitleData.map(i => {
        i.title = i.key;
        i.display = 'auto';
      });
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.table-title-edit-box {
  //   width: 544px;
  padding: 10px;
  background-color: #fff;
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .head {
    .title {
      color: #424242;
      font-size: 16px;
      font-weight: bold;
    }
    .close-icon-box {
      width: 30px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      .icon-close {
        color: #a4a4a4;
        transform: rotate(45deg);
      }
    }
  }
  .tips-box {
    padding: 8px 0;
    margin: 8px auto;
    .tips {
      font-size: 14px;
      color: #a4a4a4;
    }
    .btn-reset {
      color: #4284f5;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .content {
    width: 528px;
    height: 440px;
    background: #e7ebf2;
    border-radius: 4px;
    .flex {
      justify-content: space-around;
    }
    .thead {
      padding: 8px;
      & > div {
        color: #666666;
      }
    }
    .column.flex {
      justify-content: flex-start;
    }
    .column {
      padding: 8px;
      .item {
        flex: 1;
        height: 40px;
        & > div {
          margin-right: 8px;
          margin-left: 8px;
        }
        .name {
          width: 208px;
          height: 40px;
          padding-left: 8px;
          line-height: 40px;
          background: #f2f2f2;
          border-radius: 4px;
          font-size: 16px;
          color: #424242;
          font-weight: bold;
        }
      }
      input {
        width: 208px;
        height: 40px;
        padding: 8px;
        background: #ffffff;
        border: 1px solid #dedede;
        border-radius: 4px;
        outline: none;
        appearance: none;
      }
    }
  }
  .btn-group {
    display: flex;
    justify-content: center;
    & > div {
      padding: 8px;
      margin: 0 20px;
      font-size: 16px;
      cursor: pointer;
    }
    .btn-sure {
      color: #4284f5;
    }
    .btn-cancel {
      color: #a4a4a4;
    }
  }
}
.dc-check{
    background-color: #fff;
}
</style>
