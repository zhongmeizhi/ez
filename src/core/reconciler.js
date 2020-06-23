import { getKeys, isArr, isFn, isText } from '../utils/base.js';

// const updateElement = (dom, newProps) => {
// }

export const createElement = (vnode, parentEle) => {
  let v = isFn(vnode.type)
      ? vnode.type(vnode.props)
      : vnode

  if (isArr(v)) {
    v.forEach(v => createElement(v, parentEle));
  } else {
    let $ele = isText(v)
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
    children.forEach(child => createElement(child, $ele))
    
    parentEle.appendChild($ele);
  }
}

export const render = (vnode, node) => {
  const vList = isArr(vnode) ? vnode : [vnode];
  for (const vItem of vList) {
    createElement(vItem, node);
  }
}

