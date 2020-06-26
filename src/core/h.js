import { isText, isStuff } from '../utils/base'

export const h = function (type, attrs, ...children) {
  let props = attrs || {};
  let key = props.key || null
  let ref = props.ref || null

  delete props.key
  delete props.ref

  // 过滤 undefined
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
  }, [])

  props.children = childrenElement;

  return { type, props, key, ref };
}

const createText = (text) => {
  return {
    type: 'text',
    props: {
      children: [],
      content: text,
    }
  }
}