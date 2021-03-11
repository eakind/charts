<template>
  <span class="iconsvg" :class="className">
    <svg class="icon"   :style="styleObj" aria-hidden="true">
        <use :xlink:href="icon"></use>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'IconSvg',
  data () {
    return {
    };
  },
  props: {
    icon: {
      type: String
    },
    styleObj: {
      type: Object,
      default: () => {
        return {
          width: '1.2em',
          height: '1.2em'
        };
      }
    },
    className: {
      type: String,
      default: ''
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.iconsvg{
  display: inline-block;
  .icon {
    width: 1.4em;
    height: 1.4em;
    vertical-align: -0.25em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
