<template>
  <div class="operate-geo">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="geo-select">
      <dc-select :list="list" :tip="tip" @change="changeHandler"></dc-select>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import DcSelect from './operate/dcSelect';
export default {
  name: 'OperateGeo',
  components: {
    OperateHeader,
    DcSelect
  },
  props: {
    item: {
      type: Object
    },
    dataType: {
      type: String
    }
  },
  data () {
    return {
      transformType: this.$t('dashboard.geo_feature'),
      tip: this.$t('dashboard.select_geo_feature'),
      list: [
        {
          name: this.$t('dashboard.area_code'),
          code: 'AREACODE'
        },
        {
          name: this.$t('dashboard.zip_code'),
          code: 'ZIPCODE'
        }
        // {
        //   name: this.$t('dashboard.city_code'),
        //   code: 'CITYCODE'
        // }
      ]
    };
  },
  mounted () {
    if (this.item.data_type === 'STRING') {
      this.list.unshift(
        {
          name: this.$t('dashboard.province'),
          code: 'PROVINCE'
        },
        {
          name: this.$t('dashboard.city'),
          code: 'CITY'
        },
        {
          name: this.$t('dashboard.district'),
          code: 'DISTRICT'
        }
      );
    }
  },
  methods: {
    modify () {
      this.$emit('modify');
    },
    changeHandler (item) {
      this.$emit('change', item.code);
    }
  }
};
</script>
<style lang='scss' scoped>
.operate-geo {
  height: 200px;
  .geo-select {
    height: 50px;
    padding: 20px 0px;
  }
}
</style>
