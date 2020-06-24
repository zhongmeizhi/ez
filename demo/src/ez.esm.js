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
const isText = fn => typeof fn === 'string' || typeof fn === 'number';
const getKeys = Object.keys;

let id = 0;
/* 
  fiber = {
    id
    dirty,
    key,
    type,
    parent,
    parentNode,
    vnode,
    ref,
    props: {
      children
    },
    sibling
  }
*/

const createElement = (vnode, parentEle) => {
  let $ele = isText(vnode) ? document.createTextNode(vnode) : document.createElement(vnode.type);
  const props = vnode.props || {};

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

  const children = props.children || [];
  children.forEach(child => {
    child && mount({
      parentNode: $ele,
      vnode: child
    });
  });
  parentEle.appendChild($ele);
  return $ele;
};

const forceUpdate = fiber => {
  return updateComponent.bind(null, fiber);
};

const updateComponent = fiber => {
  const {
    vnode,
    parentNode
  } = fiber;
  const props = Object.assign({}, vnode.props, {
    $forceUpdate: forceUpdate(fiber)
  });
  const v = vnode.type(props);

  if (!fiber.ref) {
    fiber.ref = createElement(v, parentNode);
  } else {
    const ref = createElement(v, parentNode);
    fiber.parentNode.replaceChild(ref, fiber.ref);
  }
};

const updateElement = fiber => {
  const {
    vnode,
    parentNode
  } = fiber;

  if (isArr(vnode)) {
    vnode.forEach(v => createElement(v, parentNode));
  } else {
    createElement(vnode, parentNode);
  }
};

const mount = fiber => {
  const {
    vnode
  } = fiber;

  if (isFn(vnode.type)) {
    updateComponent(fiber);
  } else {
    updateElement(fiber);
  }
};
const createApp = (vnode, node) => {
  let rootFiber = {
    id,
    parentNode: node,
    vnode
  };
  mount(rootFiber);
};

const handlers = {// set(val) {
  //   console.log(val, '')
  // }
};
const reactive = target => {
  const observed = new Proxy(target, handlers);
  return observed;
};

let state = [];
let setters = [];
let isFirstRun = true;
let cursor = 0;

const createSetter = cursor => newVal => {
  state[cursor] = newVal;
};

function useState(initVal) {
  if (isFirstRun) {
    state.push(initVal);
    setters.push(createSetter(cursor));
    isFirstRun = false;
  }

  const setter = setters[cursor];
  const value = state[cursor];
  cursor++;
  return [value, setter];
}

const Ez = {
  h,
  createElement: h,
  createApp,
  reactive,
  useState
};

export default Ez;
export { createApp, h as createElement, h, reactive, useState };
