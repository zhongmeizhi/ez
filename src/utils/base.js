export const isArr = Array.isArray;
export const isFn = (fn) => typeof fn === 'function';
export const isStr = (fn) => typeof fn === 'string';
export const isText = (fn) => typeof fn === 'string' || typeof fn === 'number';

export const isStuff = (v) => v !== null && v !== false && v !== true;