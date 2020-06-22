const isArr = Array.isArray;
const flattenArray = arr => {
  while (isArr(arr) && arr.some(item => isArr(item))) {
    arr = [].concat(...arr);
  }

  return arr;
};
const isText = val => typeof val === 'number' || typeof val === 'string';
const isExist = v => v != null && v !== false && v !== true;
const getKeys = Object.keys;

const h = function (type, attrs) {
  let props = attrs || {};
  let key = props.key || null;
  let ref = props.ref || null;
  let children = [];

  for (let i = 2; i < arguments.length; i++) {
    let vnode = arguments[i];

    if (isExist(vnode)) {
      flattenArray(vnode);

      if (isText(vnode)) {
        vnode = createText(vnode);
      }

      children.push(vnode);
    }
  }

  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }

  return {
    type,
    props,
    key,
    ref
  };
};
function createText(vnode) {
  return {
    type: 'text',
    props: {
      nodeValue: vnode
    }
  };
}

const createChildren = (vnode, parentElm, refElm) => {
  // document.createDocumentFragment()
  let v = typeof vnode.type === 'function' ? vnode.type() : vnode;
  const props = v.props || {};
  const $ele = v.type === 'text' ? document.createTextNode(props.nodeValue) : document.createElement(v.type);

  if (props.children) {
    createChildren(props.children, $ele);
  }

  console.log(props, 'x');

  for (let propKey of getKeys(props)) {
    if (propKey !== 'children') {
      const val = props[propKey];
      $ele.setAttribute && $ele.setAttribute(propKey, val);
    }
  } // updateElement($ele);


  parentElm.appendChild($ele);
};

const render = (vnode, node, done) => {
  createChildren(vnode, node);
};

const Ez = {
  h,
  createElement: h,
  render
};

export default Ez;
export { h as createElement, h, render };
