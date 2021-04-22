import render from './render';

const zip = (xs, ys) => {
  const zipped = [];

  for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }

  return zipped;
};

// diff attrs

const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = [];

  // set new attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  // remove old attributes
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return $node => {
    for (const patch of patches) {
      patch($node);
    }
  };
}

// diff children

const diffChildren = (oldChildren, newChildren) => {
  const childPatches = [];

  for (const [oldChild, newChild] of zip(oldChildren, newChildren)) {
    if (oldChild && newChild) {
      childPatches.push(diff(oldChild, newChild));
    }
  }
  // const childPatches = [];
  
  // oldChildren.forEach((oldChild, i) => {
  //   childPatches.push(diff(oldChild, newChildren[i]));
  // });

  const additionalPatches = [];

  for (const additionalChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(render(additionalChild));

      return $node;
    });
  }

  return $parent => {
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      patch(child);
    }

    for (const additionalPatch of additionalPatches) {
      additionalPatch($parent);
    }

    return $parent;
  }
}

const diff = (vOldNode, vNewNode) => {
  if (!vNewNode) {
    return $node => {
      $node.remove();
      return undefined;
    }
  }

  if (typeof vOldNode === 'string'
    || typeof vNewNode === 'string') {
    if (vOldNode !== vNewNode) {
      return $node => {
        const $newNode = render(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      }
    } else {
      return $node => undefined;
    }
  }

  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    }
  }

  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

  return $node => {
    patchAttrs($node);
    patchChildren($node);

    return $node;
  }
};

export default diff;
