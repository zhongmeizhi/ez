import { getKeys, isArr, isFn, isText } from '../utils/base.js';

let updateQueue = [];

export const mount = (vnode, parentEle) => {
  console.log(vnode, 'vnode')
  let v = isFn(vnode.type)
      ? vnode.type(vnode.props)
      : vnode

  if (isArr(v)) {
    v.forEach(v => mount(v, parentEle));
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
    children.forEach(child => mount(child, $ele))
    
    parentEle.appendChild($ele);
  }
}

export const createApp = (vnode, node, done) => {
  mount(vnode, node);
}

