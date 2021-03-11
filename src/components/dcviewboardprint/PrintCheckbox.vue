<template>
  <dc-tabs :stretch="false" class="print-checkbox">
    <dc-tab-item :title="$t('print.select_boards')">
      <div class="exchange">
        {{$t('print.exchange_tip')}}
        <button class="btn-exchange" @click="toggleState">{{ state[currentState].btnName }}</button>
      </div>
      <ul class="checkbox-list" v-if="currentState === 'select'">
        <li class="checkbox-item all" @click="onCheckAll">
          <dc-checked :active="isAllChecked" />
          {{$t('message.select_all')}}
        </li>
        <li class="checkbox-item"
            v-for="item in disboardList"
            :key="item.dashboard_id"
            @click="onItemCheck(item.dashboard_id)">
          <dc-checked :active="activeDashboardIds.indexOf(item.dashboard_id) !== -1" />
          {{item.dashboard_title}}
        </li>
      </ul>
      <ul class="checked-list" v-else>
        <div class="checked-item">{{$t('print.dashboard_total', { n: activeDashboardIds.length })}}</div>
        <li class="checked-item"
            v-for="(id, index) in activeDashboardIds"
            :key="id">
          <span>
            <span class="checked-order">{{index + 1}}</span>{{ disboardMap[id].dashboard_title }}
          </span>
          <div v-if="index !== 0">
            <span class="btn-sort" @click="moveUp(index)">
              <span class="iconfont icon-db10_sortArrow"></span>
              {{ $t('message.up') }}
            </span>
            <span class="btn-sort" @click="moveTop(index)">
              <span class="iconfont icon-db_up"></span>
              {{ $t('message.sticky_top') }}
            </span>
          </div>
        </li>
      </ul>
    </dc-tab-item>
    <dc-tab-item :title="$t('print.use_print_temp')"></dc-tab-item>
  </dc-tabs>
</template>

<script>
import DcChecked from '@/components/dcchecked/dcChecked';
export default {
  components: { DcChecked },
  props: {
    disboardList: Array,
    activeDashboardIds: Array, // sync 选中的看板id数组
    disboardMap: Object,
  },

  data () {
    return {
      currentState: 'select',
    };
  },
  computed: {
    state () {
      return {
        select: { name: '选取', btnName: this.$t('print.print_sort') },
        sort: { name: '排序', btnName: this.$t('print.reselect_boards') },
      };
    },
    isAllChecked () {
      return this.activeDashboardIds.length === this.disboardList.length;
    }
  },

  methods: {
    toggleState () {
      if (this.currentState === 'sort') {
        this.currentState = 'select';
      } else {
        this.currentState = 'sort';
      }
    },
    onCheckAll () {
      if (!this.isAllChecked) {
        this.$emit('update:activeDashboardIds', this.disboardList.map(el => el.dashboard_id));
      } else {
        this.$emit('update:activeDashboardIds', []);
        this.$emit('remove-all');
      }
    },
    onItemCheck (id) {
      const itemIdx = this.activeDashboardIds.indexOf(id);
      if (itemIdx === -1) {
        this.activeDashboardIds.push(id);
      } else {
        this.activeDashboardIds.splice(itemIdx, 1);
        this.$emit('remove', id);
      }
    },
    moveUp (index) {
      if (index === 0) return;
      const itemToMove = this.activeDashboardIds.splice(index, 1)[0];
      this.activeDashboardIds.splice(index - 1, 0, itemToMove);
    },
    moveDown (index) {
      if (index === this.activeDashboardIds.length - 1) return;
      const itemToMove = this.activeDashboardIds.splice(index, 1)[0];
      this.activeDashboardIds.splice(index + 1, 0, itemToMove);
    },
    moveTop (index) {
      if (index === 0) return;
      const itemToMove = this.activeDashboardIds.splice(index, 1)[0];
      this.activeDashboardIds.unshift(itemToMove);
    },
  }
};
</script>

<style lang="scss" scoped>
.print-checkbox {
  margin-left: 3.125%;
  margin-top: 8px;
  width: 35%;
  /deep/ {
    .dc-tab-item {
      box-sizing: border-box;
      padding: 10px 15px;
      height: 96%;
      height: calc(100% - 40px);
      background-color: #fff;
      overflow-y: auto;
    }
    .nav-item.active {
      background-color: #fff;
    }
  }
}

.exchange {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}
.btn-exchange {
  background-color: #4284f5;
  color: white;
  border: none;
  font-size: 14px;
  border-radius: 4px;
  padding: 2px 15px;
  outline: none;
  text-align: center;
}

.checkbox-list {
  padding: 0;
  margin: 0;
  margin-right: 20px;
  list-style-type: none;
}
.checkbox-item,
.checked-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
}
.checkbox-item {
  padding: 9px 8px;
  cursor: pointer;
  .dc-checked {
    margin-right: 8px;
  }
  &.all {
    border-bottom: 1px solid #eaeaea;
  }
}
.checked-list {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
.checked-item {
  padding: 13px 0;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
}
.checked-order {
  display: inline-block;
  width: 28px;
  margin-right: 6px;
}
.btn-sort {
  margin-left: 24px;
  cursor: pointer;
}
.icon-db10_sortArrow {
  color: #4284F5;
}
.icon-db_up {
  color: #03B98C;
}
</style>
