import { getKeys, isArr, isFn, isStr } from '../utils/base.js';

// const updateElement = (dom, newProps) => {
// }

export const createElement = (vnode) => {
  let v = isFn(vnode.type)
      ? vnode.type(vnode.props)
      : vnode

  let $ele = isStr(v)
      ? document.createTextNode(v)
      : document.createElement(v.type)
      
  const props  = v.props || {};
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
  
  const children = (v.props && v.props.children) || [];
  for (const child of children) {
    const $child = createElement(child);
    $ele.appendChild($child);
  }
  
  return $ele;
}

export const render = (vnode, node) => {
  const vList = isArr(vnode) ? vnode : [vnode];
  for (const vItem of vList) {
    const $ele = createElement(vItem);
    node.appendChild($ele);
  }
}

