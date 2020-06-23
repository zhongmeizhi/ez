const h = function (type, attrs, ...children) {
  let props = attrs || {};
  let key = props.key || null;
  let ref = props.ref || null;
  delete props.key;
  delete props.ref;
  props.children = children;
  return {
    type,
    props,
    key,
    ref
  };
};

const isArr = Array.isArray;
const isFn = fn => typeof fn === 'function';
const isStr = fn => typeof fn === 'string';
const getKeys = Object.keys;

// }

const createElement = vnode => {
  let v = isFn(vnode.type) ? vnode.type(vnode.props) : vnode;
  let $ele = isStr(v) ? document.createTextNode(v) : document.createElement(v.type);
  const props = v.props || {};

  for (let propKey of getKeys(props)) {
    if (propKey === 'children') ; else if (propKey.startsWith('on')) {
      const name = propKey.slice(2);
      const event = props[propKey];
      $ele.addEventListener(name, event);
    } else {
      const val = props[propKey];
      $ele.setAttribute && $ele.setAttribute(propKey, val);
    }
  }

  const children = v.props && v.props.children || [];

  for (const child of children) {
    const $child = createElement(child);
    $ele.appendChild($child);
  }

  return $ele;
};
const render = (vnode, node) => {
  const vList = isArr(vnode) ? vnode : [vnode];

  for (const vItem of vList) {
    const $ele = createElement(vItem);
    node.appendChild($ele);
  }
};

const Ez = {
  h,
  createElement: h,
  render
};

export default Ez;
export { h as createElement, h, render };
