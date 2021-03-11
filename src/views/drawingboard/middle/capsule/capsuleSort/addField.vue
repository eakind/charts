<template>
  <!-- 排序 -->
  <dc-alert
    class="add-field-box dc-dialog-box"
    :appendToBody="false"
    :enabled="true"
    :z-index="100"
  >
    <div class="dc-dialog-header">
      <div class="title title-large">排序</div>
      <div class="iconfont icon-db_plus" @click="closeHandler"></div>
    </div>
    <div class="dc-dialog-body">
      <div class="title">编辑筛选字段</div>
      <div class="add-content">
        <div class="add-btn" @click="addHandler">
          <span class="iconfont icon-db_plus"></span>
          <span>添加</span>
        </div>
        <template v-for="(i, idx) in curSelect">
          <div class="flex" :key="idx">
            <dc-select
              :list="list"
              :value="i.name"
              @change="changeHandler($event, idx, 'name')"
            ></dc-select>
            <dc-select
              :list="valList"
              :value="i.value"
              @on-visible-change="visibleChange(i.name)"
              @change="changeHandler($event, idx, 'value')"
            ></dc-select>
            <div class="del-btn" @click="delItem(idx)">删除</div>
          </div>
        </template>
      </div>
    </div>
    <div class="dc-dialog-footer">
      <div class="sure-btn" @click="comfirmHandler">确定</div>
      <div class="cancel-btn" @click="closeHandler">取消</div>
    </div>
  </dc-alert>
</template>
<script>
import dcAlert from '@/components/dcalert/dcAlert.vue';
import dcSelect from '@/components/newSelect/index.vue';
import { sortMix } from './mixins/index.js';
export default {
  components: {
    dcAlert,
    dcSelect,
  },
  props: {
    list: {
      type: Array,
      default: (_) => [],
    },
    query: {
      type: Array,
      default: (_) => [],
    },
  },
  watch: {
    query: {
      handler (val) {
        this.curSelect = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true,
    },
  },
  mixins: [sortMix],
  data () {
    return {
      curSelect: [],
      valList: [],
    };
  },
  methods: {
    closeHandler () {
      this.$emit('close');
    },
    comfirmHandler () {
      this.$emit('sure', this.curSelect);
    },
    addHandler () {
      this.curSelect.push({});
    },
    changeHandler (val, idx, attr) {
      this.$set(this.curSelect[idx], attr, val);
      if (attr === 'name') {
        let id = this.list.find((i) => i.label === val).id;
        this.getUniqueData(id, (data) => {
          this.valList = [];
          data.map((i, index) => {
            if (index === 0) {
              this.$set(this.curSelect[idx], 'value', i.name);
            }
            this.valList.push({
              label: i.name,
              value: i.name,
            });
          });
        });
      }
    },
    visibleChange (name) {
      let id = this.list.find((i) => i.label === name).id;

      this.getUniqueData(id, (data) => {
        this.valList = [];
        data.map((i, index) => {
          this.valList.push({
            label: i.name,
            value: i.name,
          });
        });
      });
    },
    delItem (idx) {
      this.curSelect.splice(idx, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../countList/style/index.scss';
.add-field-box {
  background-color: #fff;
  .add-content {
    background: #e7ebf2;
    border-radius: 4px;
    width: 37.7em;
    height: 32em;
    padding: 0.8em;
    .flex {
      display: flex;
      align-items: center;
      & > div {
        margin-right: 1.7em;
      }
    }
    .flex + .flex {
      margin-top: 0.8em;
    }
    .del-btn {
      color: #4284f5;
      text-decoration: underline;
      cursor: pointer;
    }
    .add-btn {
      margin-bottom: 0.5em;
      padding-left: 0.1em;
      cursor: pointer;
      .iconfont {
        color: #4284f5;
        margin-right: 0.2em;
      }
    }
  }
}

</style>
<style lang="scss">
.el-select-dropdown{
  max-width: 400px;
}
</style>
