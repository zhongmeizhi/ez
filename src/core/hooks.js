import { render } from "./dom";

let currentHook = {};
let cursor = 0;
let hooks = [];

export const resetHook = (vnode, dom) => {
  cursor = 0;
  currentHook = { vnode, dom };
}

const createSetter = (cursor) => (newVal) => {
  let hook = hooks[cursor];
  let current = hook.current;
  hook.state = newVal;
  render(current.vnode, current.dom)
}

export function useState(initVal) {
  if (hooks[cursor] === undefined) {
    const hook = {
      current: currentHook,
      state: initVal,
      setter: createSetter(cursor)
    }
    hooks.push(hook)
  }
  const { state, setter} = hooks[cursor];
  cursor++;
  return [state, setter];
}
