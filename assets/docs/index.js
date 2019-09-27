import comp_0 from './测试.jsx';
import comp_1 from './快速开始.jsx';

export default [comp_0, comp_1].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.name >= b.config.name ? -1 : 1;
  } else {
    return a.config.order - b.config.order;
  }
});