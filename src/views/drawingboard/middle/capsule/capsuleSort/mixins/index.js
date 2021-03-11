import { get } from '@/api/server.js';
import { mapState } from 'vuex';
export const sortMix = {
  computed: {
    ...mapState('project', ['projectId']),
  },
  methods: {
    async getUniqueData (feature_idx, cb) {
      let param = {
        project_id: this.projectId,
        feature_idx,
        offset: 0,
        limit: 99999,
      };
      let res = await get('featureUnique', param);
      if (res && res.code === 0) {
        typeof cb === 'function' && cb(res.unique);
      }
    },
  },
};
