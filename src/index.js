import { h } from './core/h.js'
import { render } from './core/reconciler'

export {
  h,
  h as createElement,
  render
}

const Ez = {
  h,
  createElement: h,
  render
}

export default Ez;