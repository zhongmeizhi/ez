// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/ez.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = useState;
exports.render = exports.h = exports.createElement = exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isFn = function isFn(fn) {
  return typeof fn === 'function';
};

var isText = function isText(fn) {
  return typeof fn === 'string' || typeof fn === 'number';
};

var isStuff = function isStuff(v) {
  return v !== null && v !== false && v !== true;
};

var h = function h(type, attrs) {
  var _ref;

  var props = attrs || {};
  var key = props.key || null;
  var ref = props.ref || null;
  delete props.key;
  delete props.ref; // 过滤 undefined
  // 数组扁平化

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var childrenElement = (_ref = []).concat.apply(_ref, children).reduce(function (list, child) {
    // 过滤非真实意义的元素，比如 nul、true、false
    if (isStuff(child)) {
      if (isText(child)) {
        list.push(createText(child));
      } else {
        list.push(child);
      }
    }

    return list;
  }, []);

  props.children = childrenElement;
  return {
    type: type,
    props: props,
    key: key,
    ref: ref
  };
};

exports.h = exports.createElement = h;

var createText = function createText(text) {
  return {
    type: 'text',
    props: {
      children: [],
      content: text
    }
  };
};

var currentHook = {};
var cursor = 0;
var hooks = [];

var resetHook = function resetHook(vnode, dom) {
  cursor = 0;
  currentHook = {
    vnode: vnode,
    dom: dom
  };
};

var createSetter = function createSetter(cursor) {
  return function (newVal) {
    var hook = hooks[cursor];
    var current = hook.current;
    hook.state = newVal;
    render(current.vnode, current.dom);
  };
};

function useState(initVal) {
  if (hooks[cursor] === undefined) {
    var hook = {
      current: currentHook,
      state: initVal,
      setter: createSetter(cursor)
    };
    hooks.push(hook);
  }

  var _hooks$cursor = hooks[cursor],
      state = _hooks$cursor.state,
      setter = _hooks$cursor.setter;
  cursor++;
  return [state, setter];
}
/* 
  TODO: 实现Fiber

  fiber = {
    id
    dirty,
    key,
    type,
    parent,
    parentNode,
    vnode,
    ref,
    props: {
      children
    },
    sibling
  }
*/


var render = function render(vnode, dom) {
  var oldDom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : dom.firstChild;
  diff(vnode, dom, oldDom);
};

exports.render = render;

var diff = function diff(vnode, dom, oldDom) {
  // 获得在创建元素是的vnode
  var oldVnode = oldDom && oldDom.vnode;

  if (!oldDom) {
    mount(vnode, dom, oldDom);
  } else if (isFn(vnode.type)) {
    diffComponent(vnode, null, dom, oldDom);
  } else if (oldVnode && oldVnode.type === vnode.type) {
    diffElement(oldDom, vnode, oldVnode);
  } else {
    // TODO: 
    console.log('不值得比较了');
  }
};

var diffComponent = function diffComponent(vnode, oldVnode, dom, oldDom) {
  if (!oldVnode) {
    mount(vnode, dom, oldDom);
  }
};

var diffElement = function diffElement(oldDom, vnode, oldVnode) {
  if (oldVnode.type === 'text') {
    updateTextNode(oldDom, vnode, oldVnode);
  } else {
    updateElement(oldDom, vnode, oldVnode);
  }

  oldDom.vnode = vnode;
  vnode.props.children.forEach(function (child, i) {
    // children:只包含元素节点
    // childNodes:包含所有类型的节点
    // 这时需要在h函数中剔除undefined元素
    console.log(child, 'child');
    diff(child, oldDom, oldDom.childNodes[i]);
  }); // 试图剔除多余节点 childNodes

  var oldChildNodes = oldDom.childNodes;
  var oldMaxIndex = oldChildNodes.length - 1;
  var vnodeMaxIndex = vnode.props.children.length - 1; // 剔除多余节点

  if (oldMaxIndex > vnodeMaxIndex) {
    // 从后面开始删除，保证index顺序
    for (var i = oldMaxIndex; i > vnodeMaxIndex; i--) {
      unmountNode(oldDom, oldChildNodes[i]);
    }
  }
};

var mount = function mount(vnode, dom, oldDom) {
  if (isFn(vnode.type)) {
    return mountComponent(vnode, dom, oldDom);
  } else {
    return mountElement(vnode, dom, oldDom);
  }
};

var mountComponent = function mountComponent(vnode, dom, oldDom) {
  resetHook(vnode, dom);
  var nextVnode = vnode;

  while (isFn(nextVnode.type)) {
    nextVnode = nextVnode.type(vnode.props || {});
  }

  return mount(nextVnode, dom, oldDom);
};

var mountElement = function mountElement(vnode, dom, oldDom, parent) {
  /*
    在 h 函数中已经将数组扁平化
    在处理 map 等jsx 的时候不需要再通过再次判断数组递归
  */
  // console.log(isArr(vnode), 'isArr(vnode)')
  var newDom = null;
  var nextSibiling = oldDom && oldDom.nextSibiling;

  if (vnode.type === 'text') {
    newDom = document.createTextNode(vnode.props.content);
  } else {
    newDom = document.createElement(vnode.type);
    updateElement(newDom, vnode);
  } // 生成元素的的时候顺便造一颗vnode树


  newDom.vnode = vnode;

  if (oldDom) {
    unmountNode(parent, oldDom);
  }

  if (nextSibiling) {
    dom.insertBefore(newDom, nextSibiling);
  } else {
    dom.appendChild(newDom);
  }

  vnode.props.children.forEach(function (child) {
    mount(child, newDom);
  });
};

var updateElement = function updateElement(dom, newVnode) {
  var oldVnode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var newProps = newVnode.props || {};
  var oldProps = oldVnode.props || {}; // 将新旧属性同时比较以减少遍历次数

  for (var name in _objectSpread(_objectSpread({}, oldProps), newProps)) {
    var oldValue = oldProps[name];
    var newValue = newProps[name];
    if (oldValue == newValue || name === 'children') ;else if (name === 'style') ;else if (name === 'className') {
      dom.setAttribute('class', newValue);
    } else if (name.startsWith('on')) {
      var eventName = name.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(eventName, oldValue, false);
      dom.addEventListener(eventName, newValue, false);
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, newValue);
    }
  }
};

var updateTextNode = function updateTextNode(dom, newVnode) {
  var oldVnode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (newVnode.props.content !== oldVnode.props.content) {
    dom.textContent = newVnode.props.content;
  }

  dom.vnode = newVnode;
};

var unmountNode = function unmountNode(dom, child) {
  child.remove();
};

var Ez = {
  h: h,
  createElement: h,
  render: render,
  useState: useState
};
var _default = Ez;
exports.default = _default;
},{}],"src/views/test-comp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TestComp;

var _ez = _interopRequireDefault(require("../ez.esm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TestComp(props) {
  return _ez.default.createElement("div", {
    className: "home-page"
  }, _ez.default.createElement("div", null, props.propsTest), props.children);
}
},{"../ez.esm":"src/ez.esm.js"}],"src/main.js":[function(require,module,exports) {
"use strict";

var _ez = _interopRequireWildcard(require("./ez.esm"));

var _testComp = _interopRequireDefault(require("./views/test-comp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function App() {
  var _useState = (0, _ez.useState)(10),
      _useState2 = _slicedToArray(_useState, 2),
      count = _useState2[0],
      setCount = _useState2[1];

  var _useState3 = (0, _ez.useState)(1000),
      _useState4 = _slicedToArray(_useState3, 2),
      num = _useState4[0],
      setNum = _useState4[1];

  var clickHandler = function clickHandler() {
    setCount(count += 10);
    console.log(count, 'count');
  };

  var clickHandler2 = function clickHandler2() {
    setNum(num -= 10);
    console.log(num, 'count');
  };

  return _ez.default.createElement("div", {
    className: "app-page"
  }, [1, 2, 3].map(function (val) {
    return _ez.default.createElement("span", null, val + 'map、');
  }), _ez.default.createElement("div", {
    name: "proName"
  }, "a div"), _ez.default.createElement("br", null), _ez.default.createElement(_testComp.default, {
    propsTest: "propsTest......"
  }, _ez.default.createElement("div", {
    className: "btn"
  }, _ez.default.createElement("span", null, "count: "), _ez.default.createElement("span", null, count)), _ez.default.createElement("button", {
    className: "btn",
    onclick: clickHandler
  }, "add number"), _ez.default.createElement("div", {
    className: "btn"
  }, _ez.default.createElement("span", null, "num: "), _ez.default.createElement("span", null, num)), _ez.default.createElement("button", {
    className: "btn",
    onclick: clickHandler2
  }, "add number")));
}

var root = document.querySelector("#app");
(0, _ez.render)(_ez.default.createElement(App, {
  name: "mokou"
}), root);
},{"./ez.esm":"src/ez.esm.js","./views/test-comp":"src/views/test-comp.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64097" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/main.js"], null)
//# sourceMappingURL=/main.1e43358e.js.map