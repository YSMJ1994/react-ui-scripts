import demo1 from './basic';
import demo1_config from './basic_config'

const demo1 = {component: demo1, config: demo1_config};

export default [demo1].sort((a, b) => {
	if (a.config.order === b.config.order) {
		return a.config.title >= b.config.title ? -1 : 1;
	} else {
		return a.config.order - b.config.order;
	}
});
