
export const h = function (type, attrs, ...children) {
  let props = attrs || {};
  let key = props.key || null
  let ref = props.ref || null

  delete props.key
  delete props.ref

  props.children = children;
  
  return { type, props, key, ref };
}