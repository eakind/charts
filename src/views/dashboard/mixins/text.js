import { mapState, mapActions } from 'vuex';
// import { hexToRgba } from '@/utils/utils.js';
export default {
  data () {
    return {
      curStr: '',
    };
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', ['currentTarget']),
  },
  methods: {
    ...mapActions('dashboard', ['setTargetCss']),
  },
};
