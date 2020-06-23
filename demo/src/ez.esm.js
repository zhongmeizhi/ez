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

const mount = (vnode, parentEle) => {
  console.log(vnode, 'vnode');
  let v = isFn(vnode.type) ? vnode.type(vnode.props) : vnode;

  if (isArr(v)) {
    v.forEach(v => mount(v, parentEle));
  } else {
    let $ele = isText(v) ? document.createTextNode(v) : document.createElement(v.type);
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
    children.forEach(child => mount(child, $ele));
    parentEle.appendChild($ele);
  }
};
const createApp = (vnode, node, done) => {
  mount(vnode, node);
};

const handlers = {// set(val) {
  //   console.log(val, '')
  // }
};
const reactive = target => {
  const observed = new Proxy(target, handlers);
  return observed;
};

const getHook = cursor => {
  console.log(cursor, 'cursor');
  return [];
};

let state = [];
let setters = [];
let isFirstRun = true;
let cursor = 0;

const createSetter = cursor => newVal => {
  state[cursor] = newVal;
  const [current] = getHook(cursor);
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
