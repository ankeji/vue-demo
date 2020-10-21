import copy from './Tool/v-copy';
import drag from './Tool/v-drag';
import debounce from './Tool/v-debounce';
// 自定义指令
const directives = {
  copy,
  drag,
  debounce
};
// 这种写法可以批量注册指令
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
