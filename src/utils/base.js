export const isArr = Array.isArray;

export const flattenArray = (arr) => {
  while(isArr(arr) && arr.some(item => isArr(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

export const isText = (val) => typeof val === 'number' || typeof val === 'string';

export const isExist = (v) => v != null && v !== false && v !== true

export const getKeys = Object.keys;