const renderElem = ({ tagName, attrs, children }) => {
  const $el = document.createElement(tagName);

  // set attributes
  for(const [k,v] of Object.entries(attrs)) {
    if (k === 'text') {
      $el.innerHTML = v;
    } else {
      $el.setAttribute(k, v);
    }
  }

  // set children
  for(const child of children) {
    const $child = render(child);
    $el.appendChild($child);
  }

  return $el;
}

const render = (vNode) => {
  if (typeof vNode === 'string') { // (text node handler)
    return document.createTextNode(vNode);
  } // detect if element is a pure text node, then create text node for it !!

  return renderElem(vNode); // render element node (element node handler)
};

export default render;
