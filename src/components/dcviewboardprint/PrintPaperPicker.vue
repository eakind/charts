<template>
  <ul class="paper-list">
    <li class="paper-item"
        v-for="(size, name) in papers" :key="name"
        @click="onPaperSelect(name)">
      <div class="name">{{ name }}</div>
      <div>{{size.width}} x {{ size.height}} mm</div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    paperName: String,
    paperSize: { // sync
      type: Object,
      default () {
        return {
          w: 992, // px
          h: 1403,
          width: 210, // mm
          height: 297,
        };
      }
    }
  },
  data () {
    return {
      papers: {
        A4: {
          width: 210, // mm
          height: 297
        },
        A3: {
          width: 297,
          height: 420
        },
        B4: {
          width: 257,
          height: 364
        },
        B5: {
          width: 182,
          height: 257
        },
        Legal: {
          width: 215.9,
          height: 355.6
        }
      }
    };
  },
  watch: {
    paperName (name) {
      const size = this.papers[name];
      size.w = this.pm2px(size.width);
      size.h = this.pm2px(size.height);
      this.$emit('update:paperSize', size);
    },
  },
  methods: {
    onPaperSelect (name) {
      this.$emit('update:paperName', name);
    },
    pm2px (d) {
      if (window.screen.deviceXDPI) {
        return Math.round((d * window.screen.deviceXDPI) / 25.41);
      } else {
        return Math.round((d * 120) / 25.41);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.paper-list {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
</style>
