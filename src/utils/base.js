export const isArr = Array.isArray;
export const isFn = (fn) => typeof fn === 'function';
export const isStr = (fn) => typeof fn === 'string';
export const isText = (fn) => typeof fn === 'string' || typeof fn === 'number';

export const getKeys = Object.keys;

export const flattenArray = (arr) => {
  while(isArr(arr) && arr.some(item => isArr(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
