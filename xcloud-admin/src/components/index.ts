import DataTable from './page/DataTable.vue';
import SearchForm from './page/SearchForm.vue';
import type { App } from 'vue';

const install = (vue: App) => {
  vue.component('DataTable', DataTable);
  vue.component('SearchForm', SearchForm);
};
export default { install };
