const handlers = {
  // set(val) {
  //   console.log(val, '')
  // }
}

export const reactive = (target) => {

  const observed = new Proxy(target, handlers);
  return observed;
}

const getHook = (cursor) => {
  console.log(cursor, 'cursor')
  return []
}

let state = [];
let setters = [];
let isFirstRun = true;
let cursor = 0;

const createSetter = (cursor) => (newVal) => {
  state[cursor] = newVal;
  const [current] = getHook(cursor);
}

export function useState(initVal) {
  if (isFirstRun) {
    state.push(initVal);
    setters.push(createSetter(cursor));
    isFirstRun = false;
  }

  const setter = setters[cursor];
  const value = state[cursor];

  cursor++;
  return [value, setter];
}
