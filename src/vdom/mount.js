export default ($node, $target) => {
  $target.replaceWith($node);
  // console.log($node);
  return $node;
};
