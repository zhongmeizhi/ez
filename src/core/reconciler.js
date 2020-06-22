import { getKeys } from '../utils/base.js';

const updateElement = (dom, newProps) => {
  
}

const createChildren = (vnode, parentElm, refElm) => {
  // document.createDocumentFragment()
  let v = typeof vnode.type === 'function'
      ? vnode.type()
      : vnode

  const props  = v.props || {};

  const $ele = v.type === 'text'
      ? document.createTextNode(props.nodeValue)
      : document.createElement(v.type)
  
  if (props.children) {
    createChildren(props.children, $ele);
  }

  console.log(props, 'x')

  for(let propKey of getKeys(props)) {
    if (propKey !== 'children') {
      const val = props[propKey];
      $ele.setAttribute && $ele.setAttribute(propKey, val);
    }
  }
  
  // updateElement($ele);

  parentElm.appendChild($ele);
}

export const render = (vnode, node, done) => {
  createChildren(vnode, node);
}

