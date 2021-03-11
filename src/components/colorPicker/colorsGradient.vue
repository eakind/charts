<template>
  <div class="colors-gradient">
    <div class="gradient-start">
      <span class="gradient-title">起始</span>
      <colors-pure :start-color="startColor" @pick-color="pickStartColor">
        <div slot="bottom" class="btn-custom" @click="showCustomStartDialog">{{$t('message.self_color')}}</div>
      </colors-pure>
      <colors-custom-dialog v-if="isCustomStart"
                            :value="color"
                            @confirm="onDialogConfirmStart"
                            @cancel="isCustomStart = false" />
      <color-item class="color-item" :color="startColor"></color-item>
    </div>
    <div class="gradient-end">
      <span class="gradient-title">结束</span>
      <colors-pure :end-color="endColor" @pick-color="pickEndColor" v-on="$listener">
        <div slot="bottom" class="btn-custom" @click="showCustomEndDialog">{{$t('message.self_color')}}</div>
      </colors-pure>
      <colors-custom-dialog v-if="isCustomEnd"
                            :value="color"
                            @confirm="onDialogConfirmEnd"
                            @cancel="isCustomEnd = false" />
    </div>
  </div>
</template>

<script>
import colorsPure from './colorsPure.vue';
import ColorItem from './colorItem.vue';
import ColorsCustomDialog from './colorsCustomDialog.vue';
export default {
  data: () => {
    return {
      isCustomStart: false,
      isCustomEnd: false,
      startColor: '#4284f5',
      endColor: '#4284f5'
    };
  },
  components: {
    colorsPure,
    ColorItem,
    ColorsCustomDialog
  },
  mounted () {
  },
  methods: {
    pickStartColor (val) {
      this.startColor = val;
      this.$emit('pickStartColor', val);
    },
    pickEndColor (val) {
      this.endColor = val;
      this.$emit('pickEndColor', val);
    },
    showCustomStartDialog () {
      this.isCustomStart = true;
    },
    showCustomEndDialog () {
      this.isCustomEnd = true;
    },
    onDialogConfirmStart () {
      this.isCustomStart = true;
    },
    onDialogConfirmEnd () {
      this.isCustomEnd = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.colors-gradient {
  padding: 10px;
  text-align: left;
  .gradient-title {
    color: #4284f5;
    font-size: 16px;
  }
  .gradient-start {
    position: relative;
    .color-item {
      right: 0px;
      bottom: 10px;
      position: absolute;
    }
  }
  .gradient-end{
    border-top: 1px solid #4284f5;
  }
  .btn-custom {
    margin-top: 7px;
    width: 136px;
    height: 32px;
    border-radius: 4px;
    line-height: 32px;
    color: #777;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #DEDEDE;
  }
}
</style>
