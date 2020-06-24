import { getKeys, isArr, isFn, isText } from '../utils/base.js';

let id = 0;
let updateQueue = [];

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
  let $ele = isText(vnode)
    ? document.createTextNode(vnode)
    : document.createElement(vnode.type)
    
  const props  = vnode.props || {};
  for(let propKey of getKeys(props)) {
    if (propKey === 'children') {
    } else if (propKey.startsWith('on')) {
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
    child && mount({ parentNode: $ele, vnode: child })
  })

  parentEle.appendChild($ele);
  return $ele;
}

const forceUpdate = (fiber) => {
  return updateComponent.bind(null, fiber);
}

const updateComponent = (fiber) => {
  const { vnode, parentNode } = fiber;
  const props = Object.assign({}, vnode.props, { $forceUpdate: forceUpdate(fiber) })
  const v = vnode.type(props);
  if (!fiber.ref) {
    fiber.ref = createElement(v, parentNode);
  } else {
    const ref = createElement(v, parentNode);
    fiber.parentNode.replaceChild(ref, fiber.ref)
  }
}

const updateElement = (fiber) => {
  const { vnode, parentNode } = fiber;
  if (isArr(vnode)) {
    vnode.forEach(v => createElement(v, parentNode));
  } else {
    createElement(vnode, parentNode)
  }
}

export const mount = (fiber) => {
  const { vnode } = fiber;
  if (isFn(vnode.type)) {
    updateComponent(fiber);
  } else {
    updateElement(fiber);
  }
}

export const createApp = (vnode, node) => {
  let rootFiber = {
    id,
    parentNode: node,
    vnode
  }
  mount(rootFiber);
}

