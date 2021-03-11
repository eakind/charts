<template>
  <div class="column-map-left">
    <div class="box" @click.stop="show = !show">
      <span class="selected-text">{{ selectPos }}</span>
      <span class="iconfont icon-db_arrow" :class="isOpenList"></span>
    </div>
    <div class="list" v-if="show">
      <div
        class="item"
        @click="clkProcess(i)"
        :class="i.name === selectPos ? 'active' : ''"
        v-for="(i, idx) in posList"
        :key="idx"
      >
        {{ i.name }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
      posList: [
        {
          name: this.$t('dashboard.address'),
        },
        {
          name: this.$t('dashboard.area_code'),
        },
        {
          name: this.$t('dashboard.zip_code'),
        },
        {
          name: this.$t('dashboard.lo_and_lat'),
        },
      ],
      selectPos: this.$t('dashboard.location'),
      show: false,
    };
  },
  computed: {
    ...mapState('drawingboard', ['columnList', 'loAndLatFlag']),
    isOpenList () {
      return this.show ? 'map-list-acitve' : '';
    },
  },
  watch: {
    columnList: {
      handler (val) {
        if (val.length === 0) {
          return;
        }
        let flag = false;
        let dataTypePList = [
          'province',
          'city',
          'district',
          'areacode',
          'zipcode',
          'longitude',
          'latitude',
        ];
        let idx = dataTypePList.indexOf(val[0].data_type.toLowerCase());
        if (idx === -1) {
          idx = val[0].property === 'AGGR' ? 5 : -1; // && dataTypePList.indexOf(val[0].feature_name);
        }
        if (idx === -1) {
          this.selectPos = this.$t('dashboard.location');
          flag = false;
        } else if (idx > -1 && idx <= 2) {
          flag = false;
          this.selectPos = this.$t('dashboard.address');
        } else if (idx === 3) {
          flag = false;
          this.selectPos = this.$t('dashboard.area_code');
        } else if (idx === 4) {
          flag = false;
          this.selectPos = this.$t('dashboard.zip_code');
        } else {
          this.selectPos = this.$t('dashboard.lo_and_lat');
          flag = true;
        }
        this.setLoAndLatFlag(flag);
        this.$emit('on-map-type-change', flag);
      },
      deep: true,
    },
  },
  mounted () {
    document.body.removeEventListener('click', this.bodyClkProcess, false);
    document.body.addEventListener('click', this.bodyClkProcess, false);
  },
  methods: {
    ...mapMutations('drawingboard', ['setColumnList', 'setLoAndLatFlag']),
    bodyClkProcess (e) {
      let dom = document.querySelector('.column-map-left');
      if (dom && dom.contains(e.tagret)) {
        return;
      }
      this.show = false;
    },
    clkProcess (i) {
      this.show = false;
      if (i.name === this.selectPos) {
        return;
      }
      this.selectPos = i.name;
      let flag = i.name === this.$t('dashboard.lo_and_lat');
      this.setColumnList([]);
      this.setLoAndLatFlag(flag);
      this.$emit('on-map-type-change', flag);
    },
  },
};
</script>
<style lang="scss" scoped>
.column-map-left {
  position: relative;
  cursor: pointer;
  width: 110px !important;
  .box {
    display: flex;
    align-items: center;
    .selected-text {
      width: 80px;
    }
  }
  .list {
    position: absolute;
    top: 38px;
    width: 110px;
    left: 0px;
    z-index: 2;
    background-color: #fff;
    box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .item {
      line-height: 36px;
      height: 36px;
      padding-left: 6px;

      &:hover {
        background-color: #e7ebf2;
      }
    }
    .item.active {
      color: #4284f5;
    }
  }
  .icon-db_arrow {
    display: inline-block;
    transform: rotate(90deg);
    // width: 32px;
    // height: 32px;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;
  }
  .map-list-acitve {
    transform: rotate(-90deg);
  }
}
</style>
