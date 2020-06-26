import { h } from './core/h.js'
import { render } from './core/dom'
import { useState } from './core/hooks'

export {
  h,
  h as createElement,
  render,
  useState
}

const Ez = {
  h,
  createElement: h,
  render,
  useState
}

export default Ez;