const isFn = fn => typeof fn === 'function';
const isText = fn => typeof fn === 'string' || typeof fn === 'number';
const isStuff = v => v !== null && v !== false && v !== true;

const h = function (type, attrs, ...children) {
  let props = attrs || {};
  let key = props.key || null;
  let ref = props.ref || null;
  delete props.key;
  delete props.ref; // 过滤 undefined
  // 数组扁平化

  const childrenElement = [].concat(...children).reduce((list, child) => {
    // 过滤非真实意义的元素，比如 nul、true、false
    if (isStuff(child)) {
      if (isText(child)) {
        list.push(createText(child));
      } else {
        list.push(child);
      }
    }

    return list;
  }, []);
  props.children = childrenElement;
  return {
    type,
    props,
    key,
    ref
  };
};

const createText = text => {
  return {
    type: 'text',
    props: {
      children: [],
      content: text
    }
  };
};

let currentHook = {};
let cursor = 0;
let hooks = [];
const resetHook = (vnode, dom) => {
  cursor = 0;
  currentHook = {
    vnode,
    dom
  };
};

const createSetter = cursor => newVal => {
  let hook = hooks[cursor];
  let current = hook.current;
  hook.state = newVal;
  render(current.vnode, current.dom);
};

function useState(initVal) {
  if (hooks[cursor] === undefined) {
    const hook = {
      current: currentHook,
      state: initVal,
      setter: createSetter(cursor)
    };
    hooks.push(hook);
  }

  const {
    state,
    setter
  } = hooks[cursor];
  cursor++;
  return [state, setter];
}

/* 
  TODO: 实现Fiber

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

const render = (vnode, dom, oldDom = dom.firstChild) => {
  diff(vnode, dom, oldDom);
};

const diff = (vnode, dom, oldDom) => {
  // 获得在创建元素是的vnode
  let oldVnode = oldDom && oldDom.vnode;

  if (!oldDom) {
    mount(vnode, dom, oldDom);
  } else if (isFn(vnode.type)) {
    diffComponent(vnode, null, dom, oldDom);
  } else if (oldVnode && oldVnode.type === vnode.type) {
    diffElement(oldDom, vnode, oldVnode);
  } else {
    // TODO: 
    console.log('不值得比较了');
  }
};

const diffComponent = (vnode, oldVnode, dom, oldDom) => {
  if (!oldVnode) {
    mount(vnode, dom, oldDom);
  }
};

const diffElement = (oldDom, vnode, oldVnode) => {
  if (oldVnode.type === 'text') {
    updateTextNode(oldDom, vnode, oldVnode);
  } else {
    updateElement(oldDom, vnode, oldVnode);
  }

  oldDom.vnode = vnode;
  vnode.props.children.forEach((child, i) => {
    // children:只包含元素节点
    // childNodes:包含所有类型的节点
    // 这时需要在h函数中剔除undefined元素
    console.log(child, 'child');
    diff(child, oldDom, oldDom.childNodes[i]);
  }); // 试图剔除多余节点 childNodes

  let oldChildNodes = oldDom.childNodes;
  let oldMaxIndex = oldChildNodes.length - 1;
  let vnodeMaxIndex = vnode.props.children.length - 1; // 剔除多余节点

  if (oldMaxIndex > vnodeMaxIndex) {
    // 从后面开始删除，保证index顺序
    for (let i = oldMaxIndex; i > vnodeMaxIndex; i--) {
      unmountNode(oldDom, oldChildNodes[i]);
    }
  }
};

const mount = (vnode, dom, oldDom) => {
  if (isFn(vnode.type)) {
    return mountComponent(vnode, dom, oldDom);
  } else {
    return mountElement(vnode, dom, oldDom);
  }
};

const mountComponent = (vnode, dom, oldDom) => {
  resetHook(vnode, dom);
  let nextVnode = vnode;

  while (isFn(nextVnode.type)) {
    nextVnode = nextVnode.type(vnode.props || {});
  }

  return mount(nextVnode, dom, oldDom);
};

const mountElement = (vnode, dom, oldDom, parent) => {
  /*
    在 h 函数中已经将数组扁平化
    在处理 map 等jsx 的时候不需要再通过再次判断数组递归
  */
  // console.log(isArr(vnode), 'isArr(vnode)')
  let newDom = null;
  const nextSibiling = oldDom && oldDom.nextSibiling;

  if (vnode.type === 'text') {
    newDom = document.createTextNode(vnode.props.content);
  } else {
    newDom = document.createElement(vnode.type);
    updateElement(newDom, vnode);
  } // 生成元素的的时候顺便造一颗vnode树


  newDom.vnode = vnode;

  if (oldDom) {
    unmountNode(parent, oldDom);
  }

  if (nextSibiling) {
    dom.insertBefore(newDom, nextSibiling);
  } else {
    dom.appendChild(newDom);
  }

  vnode.props.children.forEach(child => {
    mount(child, newDom);
  });
};

const updateElement = (dom, newVnode, oldVnode = {}) => {
  const newProps = newVnode.props || {};
  const oldProps = oldVnode.props || {}; // 将新旧属性同时比较以减少遍历次数

  for (let name in { ...oldProps,
    ...newProps
  }) {
    let oldValue = oldProps[name];
    let newValue = newProps[name];

    if (oldValue == newValue || name === 'children') ; else if (name === 'style') ; else if (name === 'className') {
      dom.setAttribute('class', newValue);
    } else if (name.startsWith('on')) {
      const eventName = name.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(eventName, oldValue, false);
      dom.addEventListener(eventName, newValue, false);
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, newValue);
    }
  }
};

const updateTextNode = (dom, newVnode, oldVnode = {}) => {
  if (newVnode.props.content !== oldVnode.props.content) {
    dom.textContent = newVnode.props.content;
  }

  dom.vnode = newVnode;
};

const unmountNode = (dom, child) => {
  child.remove();
};

const Ez = {
  h,
  createElement: h,
  render,
  useState
};

export default Ez;
export { h as createElement, h, render, useState };
