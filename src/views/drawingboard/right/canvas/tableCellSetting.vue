<template>
  <dc-collapse-item :title="$t('dashboard.cell_format')">
    <div class="table-cell-setting-wrap">
      <div class="flex w-wrap">
        <div class="w-name">{{$t('dashboard.db_width')}}</div>
        <div class="w-edit">
          <!-- v-model.number="cellSetting.cell.width" -->
          <input type="text"
                 :readonly="cellSetting.cell.disabled?'readonly':false"
                 :class="cellSetting.cell.disabled?'readonly':''"
                 :value="cellSetting.cell.width"
                 @input="inputProcess('cell','width',$event.target.value)" /> <span>px</span>
        </div>
      </div>
      <div class="padding-wrap">
        <p class="p-name">{{$t('dashboard.inner_height')}}</p>
        <template v-for="d in direction">
          <div class="flex p-wrap"
               :key="d.type">
            <div :class="'name-'+d.type">{{$t('dashboard[\''+d.type+'\']')}}</div>
            <div class="p-edit"
                 :class="'edit-'+d.type">
              <!-- v-model.number="cellSetting.padding[d.type]" -->
              <input type="text"
                     :value="cellSetting.padding[d.type]"
                     :readonly="isReadOnly(d.type)"
                     :class="isReadOnly(d.type)==='readonly'?'readonly':''"
                     @input="inputProcess('padding',d.type,$event.target.value)" /> <span>px</span>
            </div>
          </div>
        </template>
      </div>
      <div class="m-wrap">
        <p class="p-name">{{$t('dashboard.marginStyle')}}</p>
        <template v-for="i in marginType">
          <div class="flex"
               :class="i.type+'-wrap'"
               :key="i.type">
            <div :class="i.type+'-name'">{{$t('dashboard[\''+i.type+'_border\']')}}</div>
            <div :class="i.type+'-edit'"
                 class="flex">
              <color-picker v-model="cellSetting[i.type].color"
              @on-tpl-confirm="titleChange(i.type,$event)"
                            :colorList="[{list:[{color:cellSetting[i.type].color,val:$t('dashboard[\''+i.type+'_border\']')}],name:$t('dashboard[\''+i.type+'_border\']')}]"
                            @pick-color="inputProcess(i.type,'color',$event,'1')"></color-picker>
              <!-- <span :class="i.type+'-color'"
                    :style="{backgroundColor:retOuterOrInner(i.type).color}"></span> -->
              <!-- v-model.number="cellSetting[i.type].width" -->
              <input type="text"
                     :value="cellSetting[i.type].width"
                     @input="inputProcess(i.type,'width',$event.target.value)" /> <span>px</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </dc-collapse-item>
</template>
<script>
import colorPicker from '@/components/colorPicker/colorPicker';
export default {
  name: 'tableSetting',
  components: { colorPicker },
  props: {
    tableSetting: {
      type: Object,
      default: _ => {}
    }
  },
  watch: {
    tableSetting: {
      handler (val) {
        if (!val.cell) {
          return;
        }
        this.cellSetting = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true
    },
  },
  data () {
    return {
      cellSetting: {
        cell: { width: 80, disabled: false },
        inner: { color: '#C2C9D1', width: 1 },
        outter: { color: '#C2C9D1', width: 2 },
        padding: { top: 0, left: 4, bottom: 0, right: 4, disabled_top_bottom: false, disabled_left_right: false }
      },
      marginType: [{
        name: this.$t('dashboard.outter_border'),
        type: 'outter'
      }, {
        name: this.$t('dashboard_inner_border'),
        type: 'inner'
      }],
      direction: [{
        name: this.$t('dashboard.up'),
        type: 'top'
      }, {
        name: this.$t('dashboard.down'),
        type: 'bottom'
      }, {
        name: this.$t('dashboard.left'),
        type: 'left'
      }, {
        name: this.$t('dashboard.right'),
        type: 'right'
      }]
    };
  },
  methods: {
    retOuterOrInner (type) {
      return this.cellSetting[type];
    },
    isReadOnly (type) {
      if (type === 'left' || type === 'right') {
        return this.cellSetting.padding.disabled_left_right ? 'readonly' : false;
      }
      return this.cellSetting.padding.disabled_top_bottom ? 'readonly' : false;
    },
    titleChange (type, value) {
      this.cellSetting[type].color = value[0].color;
      this.$emit('on-canvasCss-change', 'tableSetting', this.cellSetting);
    },
    inputProcess (type, attr, value, regFlag) {
      if (regFlag !== '1') {
        this.cellSetting[type][attr] = value.replace(/[^\d]/, '');
      } else {
        this.cellSetting[type][attr] = value;
      }
      this.$emit('on-canvasCss-change', 'tableSetting', this.cellSetting);
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.table-cell-setting-wrap {
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 8px;
    .w-name {
      color: #4284f5;
    }
    input {
      width: 80px;
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      border-radius: 4px;
      color: #424242;
      outline: none;
      border: none;
      border: 1px solid #dedede;
      border-radius: 4px;
    }
  }
  .p-name {
    color: #4284f5;
  }
  .w-wrap,
  .padding-wrap {
    padding-bottom: 8px;
    border-bottom: 1px solid #e1e1e1;
  }
  .m-wrap {
    padding-bottom: 8px;
    .inner-edit,
    .outter-edit {
      margin-top: 0;
    }
    input {
      width: 48px;
      margin-left: 8px;
      margin-right: 8px;
    }
    .outter-color,
    .inner-color {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 4px;
      background-color: #424242;
      margin-top: 8px;
      margin-right: 8px;
    }
  }
  input.readonly{
    background-color: #d8d8d8;
  }
}
.dc-color-picker {
  display: inline-block;
}
</style>
