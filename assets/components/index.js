import Comp1 from "./Button";

export default [Comp1].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.name >= b.config.name ? -1 : 1;
  } else {
    return a.config.order - b.config.order;
  }
});
