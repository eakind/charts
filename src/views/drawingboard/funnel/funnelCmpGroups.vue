<template>
  <div class="cmp">
    <dc-select-view
      :list="featureValueOptions"
      :select="value_1"
      @change="({ id }) => onValueChange('value_1', id)"
      class="cmp-item"
      :width="'100%'">
    </dc-select-view>
    <i class="hyphen-line" />
    <dc-select-view
      :list="featureValueOptions"
      :select="value_2"
      @change="({ id }) => onValueChange('value_2', id)"
      class="cmp-item"
      :width="'100%'">
    </dc-select-view>
  </div>
</template>

<script>
import { get } from '@/api/server';
import { mapState } from 'vuex';
import DcSelectView from '@/components/dcselectview/dcSelectView';

export default {
  components: { DcSelectView },
  props: {
    value: Array, // support v-model
    featureItem: Object,
  },
  data () {
    return {
      featureValueOptions: [],
      value_1: '',
      value_2: '',
    };
  },
  computed: {
    ...mapState({
      projectId: state => state.project.projectId,
    }),
  },
  watch: {
    featureItem: {
      handler (val) {
        if (!val || val.type !== 'cat') { return; }
        this.getUnique(val.feature_idx);
      },
      deep: true,
      immediate: true,
    },
    value: {
      handler (val) {
        const [value_1, value_2] = val || [];
        this.value_1 = value_1 || '';
        this.value_2 = value_2 || '';
      },
      immediate: true,
    },
  },
  methods: {
    onValueChange (key, id) {
      if (this[key] === id) { return; }
      this[key] = id;
      if (this.value_1 && this.value_2) {
        this.$emit('input', [this.value_1, this.value_2]); // v-model
      }
    },
    async getUnique (featureIdx) {
      let param = {
        project_id: this.projectId,
        feature_idx: featureIdx,
        offset: 0,
        limit: 999999
      };
      let res = await get('featureUnique', param);
      if (res.code !== 0) return;
      let list = res.unique || {};
      if (!list || !list.length) return;
      for (let i = 0, len = list.length; i < len; i++) {
        const el = list[i];
        el.id = el.name; // add id for select status
        if (el.name === 'null' && !el.moved) { // move null item to tail.
          const itemToMove = list.splice(i, 1)[0];
          itemToMove.moved = true;
          list.push(itemToMove);
          i--;
        }
      }
      this.featureValueOptions = list;
      const isValue1Available = list.map(el => el.id).indexOf(this.value_1) !== -1;
      const isValue2Available = list.map(el => el.id).indexOf(this.value_2) !== -1;
      if (isValue1Available && isValue2Available) {
        return;
      }
      setTimeout(() => { // while cmp change to a cat feature, set default cmpGroups
        if (list.length > 1) {
          this.$emit('input', [list[0].id, list[1].id]);
        } else {
          this.$emit('input', [list[0].id, list[0].id]);
        }
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.cmp {
  display: inline-flex;
  align-items: center;
  color: #424242;
}
.cmp-item {
  top: 0;
  min-width: 200px;
}
.hyphen-line {
  flex-shrink: 0;
  margin: 0 7px;
  width: 18px;
  height: 2px;
  background-color: #979797;
}
</style>
