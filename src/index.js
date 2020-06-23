import { h } from './core/h.js'
import { createApp } from './core/reconciler'
import { reactive, useState } from './core/hooks'

export {
  h,
  h as createElement,
  createApp,
  reactive,
  useState
}

const Ez = {
  h,
  createElement: h,
  createApp,
  reactive,
  useState
}

export default Ez;