<template>
  <div class="colors-recent" v-show="recentlyList.length">
    <div class="title">{{$t('message.color_recently')}}</div>
    <div class="colors">
        <color-item :class="setIsMin"
                    :color="item"
                    :active="item === color"
                    v-for="item in recentlyList"
                    :key="item"
                    :update-recent="false"
                    @click="onColorPick(item)"
        />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import colorItem from './colorItem';

export default {
  components: { colorItem },
  props: {
    value: { // color
      type: String,
      default: '#424242',
    },
    isMin: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      color: this.value,
    };
  },
  computed: {
    ...mapGetters('colors', ['getColorsRecentlyUsed']),
    recentlyList () {
      return this.getColorsRecentlyUsed();
    },
    setIsMin () {
      return this.isMin ? 'min-width' : '';
    }
  },
  watch: {
    value: {
      handler (val) {
        this.color = val;
      },
      immediate: true,
    },
  },
  methods: {
    onColorPick (color) {
      if (color === this.color) { return; }
      this.$emit('input', color);
      this.$emit('pick-recent', color);
    },
  }
};
</script>

<style lang="scss" scoped>
.colors-recent {
  padding: 6px 0 2px;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
  &:last-child {
    border-bottom: none;
  }
}
.title {
  font-size: 12px;
  color: #666;
  text-align: left;
}
.colors {
  display: flex;
  margin-top: 7px;
  padding: 0 2px;
  .color-item:last-child {
    margin-right: 0;
  }
}
.min-width{
  margin-right: 8px;
}
</style>
