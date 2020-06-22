
import { flattenArray, isText, isExist } from '../utils/base.js';

export const h = function (type, attrs) {
  let props = attrs || {};
  let key = props.key || null;
  let ref = props.ref || null;
  
  let children = [];

  for (let i = 2; i < arguments.length; i++) {
    let vnode = arguments[i];
    if (isExist(vnode)) {
      flattenArray(vnode);
      if (isText(vnode)) {
        vnode = createText(vnode)
      }
      children.push(vnode)
    }
  }

  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }
  
  return { type, props, key, ref };
}

export function createText(vnode) {
  return { type: 'text', props: { nodeValue: vnode } }
}
