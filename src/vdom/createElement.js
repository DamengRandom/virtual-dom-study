export default (tagName, {attrs = {}, children = []} = {}) => {
  return { // virtual dom
    tagName,
    attrs,
    children,
  };
};
