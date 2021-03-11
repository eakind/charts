/**
 * 项目列表逻辑
 */
import { get, post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export const list = {
  data () {
    return {
      searchObj: {
        offset: 0,
        limit: 100,
        project_type: 'BI',
        project_name: '',
        direction: null,
        status: null,
      },
      self: true,
      totalNum: 0,
      list: []
    };
  },
  computed: {
    ...mapState({
      worksheetTypesIconActiveMap: state => state.project.worksheetTypesIconActiveMap,
    })
  },
  watch: {
    searchProjectName (val) {
      this.searchObj.project_name = val;
      this.searchObj.offset = 0;
      this.list = [];
      this.getList();
    },
    direction (val) {
      this.searchObj.direction = val;
      this.searchObj.offset = 0;
      this.list = [];
      this.getList();
    }
  },
  methods: {
    ...mapMutations('project', ['setProjectId', 'setProjectName']),
    scrollProcess (e) {
      if (this.searchObj.offset >= this.totalNum) {
        return false;
      }
      if (this.list.length >= this.totalNum) {
        return false;
      }
      this.searchObj.offset += this.searchObj.limit;
      this.getList();
      // let flag = e.target.scrollTop + e.target.clientHeight - e.target.scrollHeight + 10 > 0;
      // if (flag > 0) {
      //   if (this.searchObj.offset >= this.totalNum) {
      //     return false;
      //   }
      //   this.searchObj.offset += this.searchObj.limit;
      //   this.getList();
      // }
    },

    async getList () {
      let param = this.searchObj;
      let res = await get('project', param);
      if (!res) return;

      res.project_list.forEach(l => {
        l.worksheet_type_list = l.worksheet_type_list
          ? l.worksheet_type_list.map(t => this.worksheetTypesIconActiveMap[t])
          : [];
        l.worksheet_type_list = [...new Set(l.worksheet_type_list)].slice(0, 9);
        l.user_abbr_list = l.user_abbr_list
          ? l.user_abbr_list.slice(0, 10)
          : [];
        l.showUpdate = false;
        l.showModify = false;
      });
      this.list = [...this.list, ...res.project_list];
      this.totalNum = res.total_num;
    },
    // 修改名字
    modifyName (item) {
      item.showModify = true;
      this.projectName = item.project_name;
    },
    async sureModifyName (itemData, index) {
      let param = {
        project_id: itemData.project_id,
        project_name: this.projectName
      };
      if (this.projectName.length > 64) {
        this.$createMassage(this.$t('message.check_projectname'));
        return;
      }
      let res = await post('projectRename', param);
      if (res.code === 0) {
        this.showChangenameAlert = false;
        itemData.project_name = this.projectName;
        itemData.showModify = false;
        this.setProjectName(this.projectName);
        this.projectName = '';
        this.list.splice(index, 1, itemData);
      }
    },
    // 项目删除
    delHandler (itemData) {
      sessionStorage.setItem('delProjectId', itemData.project_id);
      this.isAlert = true;
    },
    delCancel () {
      sessionStorage.removeItem('delProjectId');
      this.isAlert = false;
    },
    delConfirm () {
      let projectId = sessionStorage.getItem('delProjectId');
      this.delCancel();
      this.delProject(projectId);
    },
    async delProject (id) {
      let param = {
        project_id: id
      };
      let res = await post('delProject', param);
      if (!res) return;
      this.searchObj.offset = 0;
      this.list = [];
      this.getList();
    },
  }
};
