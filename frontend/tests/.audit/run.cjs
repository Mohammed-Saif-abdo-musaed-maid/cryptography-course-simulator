"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/react/cjs/react.production.min.js
var require_react_production_min = __commonJS({
  "node_modules/react/cjs/react.production.min.js"(exports2) {
    "use strict";
    var l = Symbol.for("react.element");
    var n = Symbol.for("react.portal");
    var p = Symbol.for("react.fragment");
    var q = Symbol.for("react.strict_mode");
    var r = Symbol.for("react.profiler");
    var t = Symbol.for("react.provider");
    var u = Symbol.for("react.context");
    var v = Symbol.for("react.forward_ref");
    var w = Symbol.for("react.suspense");
    var x = Symbol.for("react.memo");
    var y = Symbol.for("react.lazy");
    var z = Symbol.iterator;
    function A(a) {
      if (null === a || "object" !== typeof a) return null;
      a = z && a[z] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var B = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } };
    var C = Object.assign;
    var D = {};
    function E(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    E.prototype.isReactComponent = {};
    E.prototype.setState = function(a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    E.prototype.forceUpdate = function(a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function F() {
    }
    F.prototype = E.prototype;
    function G(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    var H = G.prototype = new F();
    H.constructor = G;
    C(H, E.prototype);
    H.isPureReactComponent = true;
    var I = Array.isArray;
    var J = Object.prototype.hasOwnProperty;
    var K = { current: null };
    var L = { key: true, ref: true, __self: true, __source: true };
    function M(a, b, e) {
      var d, c = {}, k = null, h = null;
      if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
      var g = arguments.length - 2;
      if (1 === g) c.children = e;
      else if (1 < g) {
        for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
        c.children = f;
      }
      if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
      return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
    }
    function N(a, b) {
      return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
    }
    function O(a) {
      return "object" === typeof a && null !== a && a.$$typeof === l;
    }
    function escape(a) {
      var b = { "=": "=0", ":": "=2" };
      return "$" + a.replace(/[=:]/g, function(a2) {
        return b[a2];
      });
    }
    var P = /\/+/g;
    function Q(a, b) {
      return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
    }
    function R(a, b, e, d, c) {
      var k = typeof a;
      if ("undefined" === k || "boolean" === k) a = null;
      var h = false;
      if (null === a) h = true;
      else switch (k) {
        case "string":
        case "number":
          h = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l:
            case n:
              h = true;
          }
      }
      if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
      h = 0;
      d = "" === d ? "." : d + ":";
      if (I(a)) for (var g = 0; g < a.length; g++) {
        k = a[g];
        var f = d + Q(k, g);
        h += R(k, b, e, f, c);
      }
      else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
      else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
      return h;
    }
    function S(a, b, e) {
      if (null == a) return a;
      var d = [], c = 0;
      R(a, d, "", "", function(a2) {
        return b.call(e, a2, c++);
      });
      return d;
    }
    function T(a) {
      if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
        }, function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
        });
        -1 === a._status && (a._status = 0, a._result = b);
      }
      if (1 === a._status) return a._result.default;
      throw a._result;
    }
    var U = { current: null };
    var V = { transition: null };
    var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
    function X() {
      throw Error("act(...) is not supported in production builds of React.");
    }
    exports2.Children = { map: S, forEach: function(a, b, e) {
      S(a, function() {
        b.apply(this, arguments);
      }, e);
    }, count: function(a) {
      var b = 0;
      S(a, function() {
        b++;
      });
      return b;
    }, toArray: function(a) {
      return S(a, function(a2) {
        return a2;
      }) || [];
    }, only: function(a) {
      if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
      return a;
    } };
    exports2.Component = E;
    exports2.Fragment = p;
    exports2.Profiler = r;
    exports2.PureComponent = G;
    exports2.StrictMode = q;
    exports2.Suspense = w;
    exports2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
    exports2.act = X;
    exports2.cloneElement = function(a, b, e) {
      if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
      if (null != b) {
        void 0 !== b.ref && (k = b.ref, h = K.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
      }
      var f = arguments.length - 2;
      if (1 === f) d.children = e;
      else if (1 < f) {
        g = Array(f);
        for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
        d.children = g;
      }
      return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
    };
    exports2.createContext = function(a) {
      a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t, _context: a };
      return a.Consumer = a;
    };
    exports2.createElement = M;
    exports2.createFactory = function(a) {
      var b = M.bind(null, a);
      b.type = a;
      return b;
    };
    exports2.createRef = function() {
      return { current: null };
    };
    exports2.forwardRef = function(a) {
      return { $$typeof: v, render: a };
    };
    exports2.isValidElement = O;
    exports2.lazy = function(a) {
      return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
    };
    exports2.memo = function(a, b) {
      return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
    };
    exports2.startTransition = function(a) {
      var b = V.transition;
      V.transition = {};
      try {
        a();
      } finally {
        V.transition = b;
      }
    };
    exports2.unstable_act = X;
    exports2.useCallback = function(a, b) {
      return U.current.useCallback(a, b);
    };
    exports2.useContext = function(a) {
      return U.current.useContext(a);
    };
    exports2.useDebugValue = function() {
    };
    exports2.useDeferredValue = function(a) {
      return U.current.useDeferredValue(a);
    };
    exports2.useEffect = function(a, b) {
      return U.current.useEffect(a, b);
    };
    exports2.useId = function() {
      return U.current.useId();
    };
    exports2.useImperativeHandle = function(a, b, e) {
      return U.current.useImperativeHandle(a, b, e);
    };
    exports2.useInsertionEffect = function(a, b) {
      return U.current.useInsertionEffect(a, b);
    };
    exports2.useLayoutEffect = function(a, b) {
      return U.current.useLayoutEffect(a, b);
    };
    exports2.useMemo = function(a, b) {
      return U.current.useMemo(a, b);
    };
    exports2.useReducer = function(a, b, e) {
      return U.current.useReducer(a, b, e);
    };
    exports2.useRef = function(a) {
      return U.current.useRef(a);
    };
    exports2.useState = function(a) {
      return U.current.useState(a);
    };
    exports2.useSyncExternalStore = function(a, b, e) {
      return U.current.useSyncExternalStore(a, b, e);
    };
    exports2.useTransition = function() {
      return U.current.useTransition();
    };
    exports2.version = "18.3.1";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV !== "production") {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var ReactVersion = "18.3.1";
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactCurrentDispatcher = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactCurrentBatchConfig = {
          transition: null
        };
        var ReactCurrentActQueue = {
          current: null,
          // Used to reproduce behavior of `batchedUpdates` in legacy mode.
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false
        };
        var ReactCurrentOwner = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactDebugCurrentFrame = {};
        var currentExtraStackFrame = null;
        function setExtraStackFrame(stack) {
          {
            currentExtraStackFrame = stack;
          }
        }
        {
          ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
            {
              currentExtraStackFrame = stack;
            }
          };
          ReactDebugCurrentFrame.getCurrentStack = null;
          ReactDebugCurrentFrame.getStackAddendum = function() {
            var stack = "";
            if (currentExtraStackFrame) {
              stack += currentExtraStackFrame;
            }
            var impl = ReactDebugCurrentFrame.getCurrentStack;
            if (impl) {
              stack += impl() || "";
            }
            return stack;
          };
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var ReactSharedInternals = {
          ReactCurrentDispatcher,
          ReactCurrentBatchConfig,
          ReactCurrentOwner
        };
        {
          ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
          ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
        }
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var didWarnStateUpdateForUnmountedComponent = {};
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
              return;
            }
            error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
            didWarnStateUpdateForUnmountedComponent[warningKey] = true;
          }
        }
        var ReactNoopUpdateQueue = {
          /**
           * Checks whether or not this composite component is mounted.
           * @param {ReactClass} publicInstance The instance we want to test.
           * @return {boolean} True if mounted, false otherwise.
           * @protected
           * @final
           */
          isMounted: function(publicInstance) {
            return false;
          },
          /**
           * Forces an update. This should only be invoked when it is known with
           * certainty that we are **not** in a DOM transaction.
           *
           * You may want to call this when you know that some deeper aspect of the
           * component's state has changed but `setState` was not called.
           *
           * This will not invoke `shouldComponentUpdate`, but it will invoke
           * `componentWillUpdate` and `componentDidUpdate`.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueForceUpdate: function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
          },
          /**
           * Replaces all of the state. Always use this or `setState` to mutate state.
           * You should treat `this.state` as immutable.
           *
           * There is no guarantee that `this.state` will be immediately updated, so
           * accessing `this.state` after calling this method may return the old value.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} completeState Next state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, "replaceState");
          },
          /**
           * Sets a subset of the state. This only exists because _pendingState is
           * internal. This provides a merging strategy that is not available to deep
           * properties which is confusing. TODO: Expose pendingState or don't use it
           * during the merge.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} partialState Next partial state to be merged with state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} Name of the calling function in the public API.
           * @internal
           */
          enqueueSetState: function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, "setState");
          }
        };
        var assign = Object.assign;
        var emptyObject = {};
        {
          Object.freeze(emptyObject);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
            throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          }
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        {
          var deprecatedAPIs = {
            isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
            replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
          };
          var defineDeprecationWarning = function(methodName, info) {
            Object.defineProperty(Component.prototype, methodName, {
              get: function() {
                warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                return void 0;
              }
            });
          };
          for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
              defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
          }
        }
        function ComponentDummy() {
        }
        ComponentDummy.prototype = Component.prototype;
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
        pureComponentPrototype.constructor = PureComponent;
        assign(pureComponentPrototype, Component.prototype);
        pureComponentPrototype.isPureReactComponent = true;
        function createRef() {
          var refObject = {
            current: null
          };
          {
            Object.seal(refObject);
          }
          return refObject;
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          var warnAboutAccessingKey = function() {
            {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function defineRefPropWarningGetter(props, displayName) {
          var warnAboutAccessingRef = function() {
            {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
        function warnIfStringRefCannotBeAutoConverted(config) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        var ReactElement = function(type, key, ref, self, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function createElement(type, config, children) {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          var self = null;
          var source = null;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              {
                warnIfStringRefCannotBeAutoConverted(config);
              }
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            self = config.__self === void 0 ? null : config.__self;
            source = config.__source === void 0 ? null : config.__source;
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            {
              if (Object.freeze) {
                Object.freeze(childArray);
              }
            }
            props.children = childArray;
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          {
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
          return newElement;
        }
        function cloneElement(element, config, children) {
          if (element === null || element === void 0) {
            throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
          }
          var propName;
          var props = assign({}, element.props);
          var key = element.key;
          var ref = element.ref;
          var self = element._self;
          var source = element._source;
          var owner = element._owner;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
              defaultProps = element.type.defaultProps;
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                if (config[propName] === void 0 && defaultProps !== void 0) {
                  props[propName] = defaultProps[propName];
                } else {
                  props[propName] = config[propName];
                }
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
          }
          return ReactElement(element.type, key, ref, self, source, owner, props);
        }
        function isValidElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var SEPARATOR = ".";
        var SUBSEPARATOR = ":";
        function escape(key) {
          var escapeRegex = /[=:]/g;
          var escaperLookup = {
            "=": "=0",
            ":": "=2"
          };
          var escapedString = key.replace(escapeRegex, function(match) {
            return escaperLookup[match];
          });
          return "$" + escapedString;
        }
        var didWarnAboutMaps = false;
        var userProvidedKeyEscapeRegex = /\/+/g;
        function escapeUserProvidedKey(text) {
          return text.replace(userProvidedKeyEscapeRegex, "$&/");
        }
        function getElementKey(element, index) {
          if (typeof element === "object" && element !== null && element.key != null) {
            {
              checkKeyStringCoercion(element.key);
            }
            return escape("" + element.key);
          }
          return index.toString(36);
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if (type === "undefined" || type === "boolean") {
            children = null;
          }
          var invokeCallback = false;
          if (children === null) {
            invokeCallback = true;
          } else {
            switch (type) {
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                }
            }
          }
          if (invokeCallback) {
            var _child = children;
            var mappedChild = callback(_child);
            var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
            if (isArray(mappedChild)) {
              var escapedChildKey = "";
              if (childKey != null) {
                escapedChildKey = escapeUserProvidedKey(childKey) + "/";
              }
              mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                return c;
              });
            } else if (mappedChild != null) {
              if (isValidElement(mappedChild)) {
                {
                  if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                    checkKeyStringCoercion(mappedChild.key);
                  }
                }
                mappedChild = cloneAndReplaceKey(
                  mappedChild,
                  // Keep both the (mapped) and old keys if they differ, just as
                  // traverseAllChildren used to do for objects as children
                  escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                  (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? (
                    // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                    // eslint-disable-next-line react-internal/safe-string-coercion
                    escapeUserProvidedKey("" + mappedChild.key) + "/"
                  ) : "") + childKey
                );
              }
              array.push(mappedChild);
            }
            return 1;
          }
          var child;
          var nextName;
          var subtreeCount = 0;
          var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              child = children[i];
              nextName = nextNamePrefix + getElementKey(child, i);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else {
            var iteratorFn = getIteratorFn(children);
            if (typeof iteratorFn === "function") {
              var iterableChildren = children;
              {
                if (iteratorFn === iterableChildren.entries) {
                  if (!didWarnAboutMaps) {
                    warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                  }
                  didWarnAboutMaps = true;
                }
              }
              var iterator = iteratorFn.call(iterableChildren);
              var step;
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getElementKey(child, ii++);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else if (type === "object") {
              var childrenString = String(children);
              throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
            }
          }
          return subtreeCount;
        }
        function mapChildren(children, func, context) {
          if (children == null) {
            return children;
          }
          var result = [];
          var count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function countChildren(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        }
        function forEachChildren(children, forEachFunc, forEachContext) {
          mapChildren(children, function() {
            forEachFunc.apply(this, arguments);
          }, forEachContext);
        }
        function toArray(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        }
        function onlyChild(children) {
          if (!isValidElement(children)) {
            throw new Error("React.Children.only expected to receive a single React element child.");
          }
          return children;
        }
        function createContext(defaultValue) {
          var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            // As a workaround to support multiple concurrent renderers, we categorize
            // some renderers as primary and others as secondary. We only expect
            // there to be two concurrent renderers at most: React Native (primary) and
            // Fabric (secondary); React DOM (primary) and React ART (secondary).
            // Secondary renderers store their context values on separate fields.
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            // Used to track how many concurrent renderers this context currently
            // supports within in a single renderer. Such as parallel server rendering.
            _threadCount: 0,
            // These are circular
            Provider: null,
            Consumer: null,
            // Add these to use same hidden class in VM as ServerContext
            _defaultValue: null,
            _globalName: null
          };
          context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context
          };
          var hasWarnedAboutUsingNestedContextConsumers = false;
          var hasWarnedAboutUsingConsumerProvider = false;
          var hasWarnedAboutDisplayNameOnConsumer = false;
          {
            var Consumer = {
              $$typeof: REACT_CONTEXT_TYPE,
              _context: context
            };
            Object.defineProperties(Consumer, {
              Provider: {
                get: function() {
                  if (!hasWarnedAboutUsingConsumerProvider) {
                    hasWarnedAboutUsingConsumerProvider = true;
                    error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                  }
                  return context.Provider;
                },
                set: function(_Provider) {
                  context.Provider = _Provider;
                }
              },
              _currentValue: {
                get: function() {
                  return context._currentValue;
                },
                set: function(_currentValue) {
                  context._currentValue = _currentValue;
                }
              },
              _currentValue2: {
                get: function() {
                  return context._currentValue2;
                },
                set: function(_currentValue2) {
                  context._currentValue2 = _currentValue2;
                }
              },
              _threadCount: {
                get: function() {
                  return context._threadCount;
                },
                set: function(_threadCount) {
                  context._threadCount = _threadCount;
                }
              },
              Consumer: {
                get: function() {
                  if (!hasWarnedAboutUsingNestedContextConsumers) {
                    hasWarnedAboutUsingNestedContextConsumers = true;
                    error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                  return context.Consumer;
                }
              },
              displayName: {
                get: function() {
                  return context.displayName;
                },
                set: function(displayName) {
                  if (!hasWarnedAboutDisplayNameOnConsumer) {
                    warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                    hasWarnedAboutDisplayNameOnConsumer = true;
                  }
                }
              }
            });
            context.Consumer = Consumer;
          }
          {
            context._currentRenderer = null;
            context._currentRenderer2 = null;
          }
          return context;
        }
        var Uninitialized = -1;
        var Pending = 0;
        var Resolved = 1;
        var Rejected = 2;
        function lazyInitializer(payload) {
          if (payload._status === Uninitialized) {
            var ctor = payload._result;
            var thenable = ctor();
            thenable.then(function(moduleObject2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var resolved = payload;
                resolved._status = Resolved;
                resolved._result = moduleObject2;
              }
            }, function(error2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var rejected = payload;
                rejected._status = Rejected;
                rejected._result = error2;
              }
            });
            if (payload._status === Uninitialized) {
              var pending = payload;
              pending._status = Pending;
              pending._result = thenable;
            }
          }
          if (payload._status === Resolved) {
            var moduleObject = payload._result;
            {
              if (moduleObject === void 0) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
              }
            }
            {
              if (!("default" in moduleObject)) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            return moduleObject.default;
          } else {
            throw payload._result;
          }
        }
        function lazy(ctor) {
          var payload = {
            // We use these fields to store the result.
            _status: Uninitialized,
            _result: ctor
          };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: payload,
            _init: lazyInitializer
          };
          {
            var defaultProps;
            var propTypes;
            Object.defineProperties(lazyType, {
              defaultProps: {
                configurable: true,
                get: function() {
                  return defaultProps;
                },
                set: function(newDefaultProps) {
                  error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  defaultProps = newDefaultProps;
                  Object.defineProperty(lazyType, "defaultProps", {
                    enumerable: true
                  });
                }
              },
              propTypes: {
                configurable: true,
                get: function() {
                  return propTypes;
                },
                set: function(newPropTypes) {
                  error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  propTypes = newPropTypes;
                  Object.defineProperty(lazyType, "propTypes", {
                    enumerable: true
                  });
                }
              }
            });
          }
          return lazyType;
        }
        function forwardRef(render) {
          {
            if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
              error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
            } else if (typeof render !== "function") {
              error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
            } else {
              if (render.length !== 0 && render.length !== 2) {
                error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
              }
            }
            if (render != null) {
              if (render.defaultProps != null || render.propTypes != null) {
                error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
              }
            }
          }
          var elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!render.name && !render.displayName) {
                  render.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function memo(type, compare) {
          {
            if (!isValidElementType(type)) {
              error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
            }
          }
          var elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: compare === void 0 ? null : compare
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!type.name && !type.displayName) {
                  type.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        function resolveDispatcher() {
          var dispatcher = ReactCurrentDispatcher.current;
          {
            if (dispatcher === null) {
              error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
          }
          return dispatcher;
        }
        function useContext(Context) {
          var dispatcher = resolveDispatcher();
          {
            if (Context._context !== void 0) {
              var realContext = Context._context;
              if (realContext.Consumer === Context) {
                error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
              } else if (realContext.Provider === Context) {
                error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
              }
            }
          }
          return dispatcher.useContext(Context);
        }
        function useState(initialState3) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useState(initialState3);
        }
        function useReducer(reducer, initialArg, init) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useReducer(reducer, initialArg, init);
        }
        function useRef(initialValue) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useRef(initialValue);
        }
        function useEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useEffect(create, deps);
        }
        function useInsertionEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useInsertionEffect(create, deps);
        }
        function useLayoutEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useLayoutEffect(create, deps);
        }
        function useCallback(callback, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useCallback(callback, deps);
        }
        function useMemo(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useMemo(create, deps);
        }
        function useImperativeHandle(ref, create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useImperativeHandle(ref, create, deps);
        }
        function useDebugValue(value, formatterFn) {
          {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDebugValue(value, formatterFn);
          }
        }
        function useTransition() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useTransition();
        }
        function useDeferredValue(value) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDeferredValue(value);
        }
        function useId() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useId();
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher$1.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component2) {
          var prototype = Component2.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              setExtraStackFrame(stack);
            } else {
              setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function getDeclarationErrorAddendum() {
          if (ReactCurrentOwner.current) {
            var name = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
        function getSourceInfoErrorAddendum(source) {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
        function getSourceInfoErrorAddendumForProps(elementProps) {
          if (elementProps !== null && elementProps !== void 0) {
            return getSourceInfoErrorAddendum(elementProps.__source);
          }
          return "";
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
        function validateExplicitKey(element, parentType) {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          {
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function createElementWithValidation(type, props, children) {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendumForProps(props);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            {
              error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
          }
          var element = createElement.apply(this, arguments);
          if (element == null) {
            return element;
          }
          if (validType) {
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], type);
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
        var didWarnAboutDeprecatedCreateFactory = false;
        function createFactoryWithValidation(type) {
          var validatedFactory = createElementWithValidation.bind(null, type);
          validatedFactory.type = type;
          {
            if (!didWarnAboutDeprecatedCreateFactory) {
              didWarnAboutDeprecatedCreateFactory = true;
              warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
            }
            Object.defineProperty(validatedFactory, "type", {
              enumerable: false,
              get: function() {
                warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                Object.defineProperty(this, "type", {
                  value: type
                });
                return type;
              }
            });
          }
          return validatedFactory;
        }
        function cloneElementWithValidation(element, props, children) {
          var newElement = cloneElement.apply(this, arguments);
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }
        function startTransition(scope, options) {
          var prevTransition = ReactCurrentBatchConfig.transition;
          ReactCurrentBatchConfig.transition = {};
          var currentTransition = ReactCurrentBatchConfig.transition;
          {
            ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
          }
          try {
            scope();
          } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
            {
              if (prevTransition === null && currentTransition._updatedFibers) {
                var updatedFibersCount = currentTransition._updatedFibers.size;
                if (updatedFibersCount > 10) {
                  warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                }
                currentTransition._updatedFibers.clear();
              }
            }
          }
        }
        var didWarnAboutMessageChannel = false;
        var enqueueTaskImpl = null;
        function enqueueTask(task) {
          if (enqueueTaskImpl === null) {
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              var nodeRequire = module2 && module2[requireString];
              enqueueTaskImpl = nodeRequire.call(module2, "timers").setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                {
                  if (didWarnAboutMessageChannel === false) {
                    didWarnAboutMessageChannel = true;
                    if (typeof MessageChannel === "undefined") {
                      error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                    }
                  }
                }
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          }
          return enqueueTaskImpl(task);
        }
        var actScopeDepth = 0;
        var didWarnNoAwaitAct = false;
        function act(callback) {
          {
            var prevActScopeDepth = actScopeDepth;
            actScopeDepth++;
            if (ReactCurrentActQueue.current === null) {
              ReactCurrentActQueue.current = [];
            }
            var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
            var result;
            try {
              ReactCurrentActQueue.isBatchingLegacy = true;
              result = callback();
              if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                var queue = ReactCurrentActQueue.current;
                if (queue !== null) {
                  ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                  flushActQueue(queue);
                }
              }
            } catch (error2) {
              popActScope(prevActScopeDepth);
              throw error2;
            } finally {
              ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
            }
            if (result !== null && typeof result === "object" && typeof result.then === "function") {
              var thenableResult = result;
              var wasAwaited = false;
              var thenable = {
                then: function(resolve2, reject) {
                  wasAwaited = true;
                  thenableResult.then(function(returnValue2) {
                    popActScope(prevActScopeDepth);
                    if (actScopeDepth === 0) {
                      recursivelyFlushAsyncActWork(returnValue2, resolve2, reject);
                    } else {
                      resolve2(returnValue2);
                    }
                  }, function(error2) {
                    popActScope(prevActScopeDepth);
                    reject(error2);
                  });
                }
              };
              {
                if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                  Promise.resolve().then(function() {
                  }).then(function() {
                    if (!wasAwaited) {
                      didWarnNoAwaitAct = true;
                      error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                    }
                  });
                }
              }
              return thenable;
            } else {
              var returnValue = result;
              popActScope(prevActScopeDepth);
              if (actScopeDepth === 0) {
                var _queue = ReactCurrentActQueue.current;
                if (_queue !== null) {
                  flushActQueue(_queue);
                  ReactCurrentActQueue.current = null;
                }
                var _thenable = {
                  then: function(resolve2, reject) {
                    if (ReactCurrentActQueue.current === null) {
                      ReactCurrentActQueue.current = [];
                      recursivelyFlushAsyncActWork(returnValue, resolve2, reject);
                    } else {
                      resolve2(returnValue);
                    }
                  }
                };
                return _thenable;
              } else {
                var _thenable2 = {
                  then: function(resolve2, reject) {
                    resolve2(returnValue);
                  }
                };
                return _thenable2;
              }
            }
          }
        }
        function popActScope(prevActScopeDepth) {
          {
            if (prevActScopeDepth !== actScopeDepth - 1) {
              error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
            }
            actScopeDepth = prevActScopeDepth;
          }
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve2, reject) {
          {
            var queue = ReactCurrentActQueue.current;
            if (queue !== null) {
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  if (queue.length === 0) {
                    ReactCurrentActQueue.current = null;
                    resolve2(returnValue);
                  } else {
                    recursivelyFlushAsyncActWork(returnValue, resolve2, reject);
                  }
                });
              } catch (error2) {
                reject(error2);
              }
            } else {
              resolve2(returnValue);
            }
          }
        }
        var isFlushing = false;
        function flushActQueue(queue) {
          {
            if (!isFlushing) {
              isFlushing = true;
              var i = 0;
              try {
                for (; i < queue.length; i++) {
                  var callback = queue[i];
                  do {
                    callback = callback(true);
                  } while (callback !== null);
                }
                queue.length = 0;
              } catch (error2) {
                queue = queue.slice(i + 1);
                throw error2;
              } finally {
                isFlushing = false;
              }
            }
          }
        }
        var createElement$1 = createElementWithValidation;
        var cloneElement$1 = cloneElementWithValidation;
        var createFactory = createFactoryWithValidation;
        var Children = {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray,
          only: onlyChild
        };
        exports2.Children = Children;
        exports2.Component = Component;
        exports2.Fragment = REACT_FRAGMENT_TYPE;
        exports2.Profiler = REACT_PROFILER_TYPE;
        exports2.PureComponent = PureComponent;
        exports2.StrictMode = REACT_STRICT_MODE_TYPE;
        exports2.Suspense = REACT_SUSPENSE_TYPE;
        exports2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
        exports2.act = act;
        exports2.cloneElement = cloneElement$1;
        exports2.createContext = createContext;
        exports2.createElement = createElement$1;
        exports2.createFactory = createFactory;
        exports2.createRef = createRef;
        exports2.forwardRef = forwardRef;
        exports2.isValidElement = isValidElement;
        exports2.lazy = lazy;
        exports2.memo = memo;
        exports2.startTransition = startTransition;
        exports2.unstable_act = act;
        exports2.useCallback = useCallback;
        exports2.useContext = useContext;
        exports2.useDebugValue = useDebugValue;
        exports2.useDeferredValue = useDeferredValue;
        exports2.useEffect = useEffect;
        exports2.useId = useId;
        exports2.useImperativeHandle = useImperativeHandle;
        exports2.useInsertionEffect = useInsertionEffect;
        exports2.useLayoutEffect = useLayoutEffect;
        exports2.useMemo = useMemo;
        exports2.useReducer = useReducer;
        exports2.useRef = useRef;
        exports2.useState = useState;
        exports2.useSyncExternalStore = useSyncExternalStore;
        exports2.useTransition = useTransition;
        exports2.version = ReactVersion;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_react_production_min();
    } else {
      module2.exports = require_react_development();
    }
  }
});

// node_modules/react/cjs/react-jsx-runtime.production.min.js
var require_react_jsx_runtime_production_min = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.min.js"(exports2) {
    "use strict";
    var f = require_react();
    var k = Symbol.for("react.element");
    var l = Symbol.for("react.fragment");
    var m = Object.prototype.hasOwnProperty;
    var n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
    var p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, g) {
      var b, d = {}, e = null, h = null;
      void 0 !== g && (e = "" + g);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (h = a.ref);
      for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
      return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
    }
    exports2.Fragment = l;
    exports2.jsx = q;
    exports2.jsxs = q;
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports2) {
    "use strict";
    if (process.env.NODE_ENV !== "production") {
      (function() {
        "use strict";
        var React = require_react();
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var assign = Object.assign;
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown;
        var specialPropRefWarningShown;
        var didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function warnIfStringRefCannotBeAutoConverted(config, self) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        function defineKeyPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingKey = function() {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
        }
        function defineRefPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingRef = function() {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
        }
        var ReactElement = function(type, key, ref, self, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function jsxDEV(type, config, maybeKey, source, self) {
          {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            if (maybeKey !== void 0) {
              {
                checkKeyStringCoercion(maybeKey);
              }
              key = "" + maybeKey;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            if (hasValidRef(config)) {
              ref = config.ref;
              warnIfStringRefCannotBeAutoConverted(config, self);
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
            return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
          }
        }
        var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function isValidElement(object) {
          {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
        }
        function getDeclarationErrorAddendum() {
          {
            if (ReactCurrentOwner$1.current) {
              var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
        }
        function getSourceInfoErrorAddendum(source) {
          {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
            }
            return "";
          }
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
        }
        function validateExplicitKey(element, parentType) {
          {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          {
            if (typeof node !== "object") {
              return;
            }
            if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        var didWarnAboutKeySpread = {};
        function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
          {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendum(source);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
            var element = jsxDEV(type, props, key, source, self);
            if (element == null) {
              return element;
            }
            if (validType) {
              var children = props.children;
              if (children !== void 0) {
                if (isStaticChildren) {
                  if (isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                      validateChildKeys(children[i], type);
                    }
                    if (Object.freeze) {
                      Object.freeze(children);
                    }
                  } else {
                    error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                  }
                } else {
                  validateChildKeys(children, type);
                }
              }
            }
            {
              if (hasOwnProperty.call(props, "key")) {
                var componentName = getComponentNameFromType(type);
                var keys = Object.keys(props).filter(function(k) {
                  return k !== "key";
                });
                var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
                if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                  var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                  error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                  didWarnAboutKeySpread[componentName + beforeExample] = true;
                }
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
        }
        function jsxWithValidationStatic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, true);
          }
        }
        function jsxWithValidationDynamic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, false);
          }
        }
        var jsx39 = jsxWithValidationDynamic;
        var jsxs39 = jsxWithValidationStatic;
        exports2.Fragment = REACT_FRAGMENT_TYPE;
        exports2.jsx = jsx39;
        exports2.jsxs = jsxs39;
      })();
    }
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_react_jsx_runtime_production_min();
    } else {
      module2.exports = require_react_jsx_runtime_development();
    }
  }
});

// scripts/audit/run.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");

// src/components/simulation/simulationShared.ts
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var mod = (n, m) => (n % m + m) % m;
var upperLetters = (s) => s.toUpperCase().replace(/[^A-Z]/g, "");
var isLetter = (ch) => /[a-zA-Z]/.test(ch);
var strToBytes = (s) => new TextEncoder().encode(s);
var bytesToHex = (b) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
var u32ToHex = (v) => ("00000000" + v.toString(16)).slice(-8);
function hexToBytes(hex) {
  const h = hex.replace(/[\s_]/g, "");
  if (h.length % 2 !== 0) throw new Error("odd hex length");
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  return out;
}
var modPowBig = (base, exp, m) => {
  let r = 1n;
  let b = base;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = r * b % m;
    b = b * b % m;
    e >>= 1n;
  }
  return r;
};
var gcdBig = (a, b) => {
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
};
function modInverseBig(a, m) {
  let oldR = a;
  let r = m;
  let oldS = 1n;
  let s = 0n;
  while (r) {
    const q = oldR / r;
    const nr = oldR - q * r;
    oldR = r;
    r = nr;
    const ns = oldS - q * s;
    oldS = s;
    s = ns;
  }
  if (oldR !== 1n) throw new Error("no modular inverse");
  return (oldS % m + m) % m;
}
function modPowSteps(base, exponent, m) {
  const bits = exponent.toString(2);
  let result = 1n;
  const rows = [];
  for (const bit of bits) {
    result = result * result % m;
    const row = { bit, square: result.toString() };
    if (bit === "1") {
      result = result * base % m;
      row.multiply = result.toString();
    }
    rows.push(row);
  }
  return { result, bits, rows };
}
function caesarChars(text, shift, decrypt) {
  const alphabet = ALPHABET.split("");
  const k = mod(shift, 26);
  const chars = [];
  for (const ch of text) {
    if (!isLetter(ch)) {
      chars.push({ raw: ch, plain: ch, value: -1, mapped: ch, note: "ignored" });
      continue;
    }
    const plain = ch.toUpperCase();
    const value = plain.charCodeAt(0) - 65;
    const mappedVal = mod(decrypt ? value - k : value + k, 26);
    const mapped = ch === plain.toUpperCase() ? alphabet[mappedVal] : alphabet[mappedVal].toLowerCase();
    chars.push({ raw: ch, plain, value, keyValue: k, mapped });
  }
  return { chars, alphabet, k };
}
function vigenereChars(text, key, decrypt) {
  const keyU = upperLetters(key);
  const keyVals = keyU.split("").map((c) => c.charCodeAt(0) - 65);
  const chars = [];
  let ki = 0;
  for (const ch of text) {
    if (!isLetter(ch)) {
      chars.push({ raw: ch, plain: ch, value: -1, mapped: ch, note: "ignored" });
      continue;
    }
    const plain = ch.toUpperCase();
    const value = plain.charCodeAt(0) - 65;
    const kv = keyVals[ki % keyVals.length];
    const mappedVal = mod(decrypt ? value - kv : value + kv, 26);
    const mapped = ch === plain.toUpperCase() ? ALPHABET[mappedVal] : ALPHABET[mappedVal].toLowerCase();
    chars.push({ raw: ch, plain, value, keyValue: kv, mapped, note: `key[${ki}]` });
    ki++;
  }
  return { chars, knownLetters: keyU };
}
function monoChars(text, substitution, decrypt) {
  const sub = upperLetters(substitution);
  const inverse = ALPHABET.split("").map((c) => {
    const pos = sub.indexOf(c);
    return pos === -1 ? c : ALPHABET[pos];
  }).join("");
  const chars = [];
  for (const ch of text) {
    if (!isLetter(ch)) {
      chars.push({ raw: ch, plain: ch, value: -1, mapped: ch, note: "ignored" });
      continue;
    }
    const plain = ch.toUpperCase();
    const pos = plain.charCodeAt(0) - 65;
    const mappedUp = decrypt ? ABSolve(plain, sub) : sub[pos];
    const mapped = ch === plain ? mappedUp : mappedUp.toLowerCase();
    chars.push({ raw: ch, plain, value: pos, mapped, note: `${plain}\u2192${mappedUp}` });
  }
  return { chars, sub, inverse };
}
function ABSolve(cipher, sub) {
  const pos = sub.indexOf(cipher);
  return pos === -1 ? cipher : ALPHABET[pos];
}
function playfairSquare(keyword) {
  const cleaned = [];
  const seen = /* @__PURE__ */ new Set();
  const push = (c) => {
    if (!seen.has(c)) {
      seen.add(c);
      cleaned.push(c);
    }
  };
  for (const ch of keyword.toUpperCase()) {
    if (/[A-Z]/.test(ch)) push(ch === "J" ? "I" : ch);
  }
  for (const ch of ALPHABET.replace("J", "")) push(ch);
  const square = [];
  for (let r = 0; r < 5; r++) square.push(cleaned.slice(r * 5, r * 5 + 5));
  return square;
}
function playfairPrepare(text) {
  const norm2 = upperLetters(text).replace(/J/g, "I");
  const pairs = [];
  const notes = [];
  let i = 0;
  while (i < norm2.length) {
    const a = norm2[i];
    if (i + 1 < norm2.length && norm2[i + 1] === a) {
      pairs.push(a + "X");
      notes.push(`repeated '${a}' \u2192 filler X`);
      i += 1;
    } else if (i + 1 < norm2.length) {
      pairs.push(norm2.slice(i, i + 2));
      notes.push("normal pair");
      i += 2;
    } else {
      pairs.push(a + "X");
      notes.push(`odd tail '${a}' \u2192 filler X`);
      i += 1;
    }
  }
  return { pairs, notes };
}
function playfairPairs(text, keyword, decrypt) {
  const square = playfairSquare(keyword);
  const pos = {};
  square.forEach((row, r) => row.forEach((ch, c) => pos[ch] = [r, c]));
  const { pairs, notes } = playfairPrepare(text);
  const steps = [];
  const out = [];
  for (let k = 0; k < pairs.length; k++) {
    const [a, b] = pairs[k].split("");
    const [ra, ca] = pos[a];
    const [rb, cb] = pos[b];
    let rule = "";
    let oa = "";
    let ob = "";
    if (ra === rb) {
      oa = square[ra][(ca + (decrypt ? 3 : 1)) % 5];
      ob = square[rb][(cb + (decrypt ? 3 : 1)) % 5];
      rule = decrypt ? "same row \u2192 shift left" : "same row \u2192 shift right";
    } else if (ca === cb) {
      oa = square[(ra + (decrypt ? 3 : 1)) % 5][ca];
      ob = square[(rb + (decrypt ? 3 : 1)) % 5][cb];
      rule = decrypt ? "same column \u2192 shift up" : "same column \u2192 shift down";
    } else {
      oa = square[ra][cb];
      ob = square[rb][ca];
      rule = "rectangle \u2192 swap corners";
    }
    steps.push({ a, b, ra, ca, rb, cb, rule, out: oa + ob, kind: notes[k] || "" });
    out.push(oa + ob);
  }
  return { square, pairs, notes, steps, result: out.join("") };
}
function matrixInverseMod(matrix, modu) {
  const n = matrix.length;
  let det;
  if (n === 2) det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  else {
    const [a, b, c, d, e, f, g, h, i] = matrix.flat();
    det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  }
  const detMod = mod(det, modu);
  const detInv = modInverse(detMod, modu);
  if (detInv === null) return { det: detMod, detInv: 0, inverse: [], valid: false };
  let cof;
  if (n === 2) {
    cof = [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]]
    ];
  } else {
    const [a, b, c, d, e, f, g, h, i] = matrix.flat();
    cof = [
      [e * i - f * h, -(d * i - f * g), d * h - e * g],
      [-(b * i - c * h), a * i - c * g, -(a * h - b * g)],
      [b * f - c * e, -(a * f - c * d), a * e - b * d]
    ];
  }
  const inverse = cof.map((row) => row.map((x) => mod(x * detInv, modu)));
  return { det: detMod, detInv, inverse, valid: true };
}
function hillBlocks(matrix, text, decrypt) {
  const n = matrix.length;
  const letters = text.toUpperCase().replace(/[^A-Z]/g, "").split("");
  let padded = 0;
  if (letters.length % n !== 0) {
    padded = n - letters.length % n;
    for (let i = 0; i < padded; i++) letters.push("X");
  }
  const inv = matrixInverseMod(matrix, 26);
  const work = decrypt ? inv.valid ? inv.inverse : [] : matrix;
  const blocks = [];
  for (let b = 0; b < letters.length; b += n) {
    const v = letters.slice(b, b + n).map((c) => c.charCodeAt(0) - 65);
    const block = [];
    for (let r = 0; r < n; r++) {
      let s = 0;
      for (let c = 0; c < n; c++) s += work[r][c] * v[c];
      const out = mod(s, 26);
      block.push({ ch: letters[b + r], v: v[r], out, mapped: String.fromCharCode(65 + out) });
    }
    blocks.push(block);
  }
  return {
    n,
    blocks,
    padded,
    determin: inv.det,
    detInv: inv.valid ? inv.detInv : null,
    inverse: inv.inverse,
    valid: inv.valid
  };
}
function modInverse(a, m) {
  const g = gcd(a, m);
  if (g !== 1) return null;
  let t = 0;
  let newT = 1;
  let r = m;
  let newR = a;
  while (newR !== 0) {
    const q = Math.floor(r / newR);
    const nr = r - q * newR;
    r = newR;
    newR = nr;
    const nt = t - q * newT;
    t = newT;
    newT = nt;
  }
  return mod(t, m);
}
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}
function railPositions(length, rails) {
  const cycle = 2 * (rails - 1) || 1;
  const out = [];
  for (let i = 0; i < length; i++) {
    const m = i % cycle;
    out.push(m < rails ? m : cycle - m);
  }
  return out;
}
function railFenceEncrypt(text, rails) {
  const positions = railPositions(text.length, rails);
  const rows = Array.from({ length: rails }, () => "");
  text.split("").forEach((ch, i) => {
    rows[positions[i]] += ch;
  });
  return { positions, ciphertext: rows.join(""), rows, cycle: 2 * (rails - 1) };
}
function railFenceDecrypt(text, rails) {
  const n = text.length;
  const positions = railPositions(n, rails);
  const counts = Array.from({ length: rails }, (_, r) => positions.filter((p) => p === r).length);
  const chunks = [];
  let pos = 0;
  for (let r = 0; r < rails; r++) {
    chunks.push(text.slice(pos, pos + counts[r]));
    pos += counts[r];
  }
  const cursor = counts.map(() => 0);
  const placeholders = positions.map((r) => chunks[r][cursor[r]++] ?? "");
  const plaintext = placeholders.join("");
  return { plaintext, positions, counts };
}
function columnOrder(key) {
  const keys = upperLetters(key);
  const indexed = keys.split("").map((c, i) => [c, i]);
  indexed.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] < b[0] ? -1 : 1);
  return indexed.map(([, i]) => i);
}
function columnarEncrypt(text, key) {
  const cols = upperLetters(key).length;
  const rowsNeeded = Math.ceil(text.length / cols);
  const grid = [];
  let idx = 0;
  for (let r = 0; r < rowsNeeded; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(idx < text.length ? text[idx++] : "");
    grid.push(row);
  }
  const columnTexts = Array.from(
    { length: cols },
    (_, c) => grid.map((row) => row[c]).join("")
  );
  const order = columnOrder(key);
  return { rows: grid, cols, order, columnTexts, ciphertext: order.map((c) => columnTexts[c]).join("") };
}
function columnarDecrypt(text, key) {
  const cols = upperLetters(key).length;
  const rows = Math.ceil(text.length / cols);
  const padded = rows * cols - text.length;
  const colLengths = Array(cols).fill(rows);
  const order = columnOrder(key);
  let pad = padded;
  for (let i = order.length - 1; i >= 0 && pad > 0; i--) {
    colLengths[order[i]] -= 1;
    pad -= 1;
  }
  const colTexts = [];
  let pos = 0;
  for (let c = 0; c < cols; c++) {
    colTexts.push(text.slice(pos, pos + colLengths[c]));
    pos += colLengths[c];
  }
  const rowsOut = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(r < colTexts[c].length ? colTexts[c][r] : "");
    rowsOut.push(row);
  }
  return { plaintext: rowsOut.map((row) => row.join("")).join("") };
}
function rsaKeygen(p, q, eChoice) {
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const candidates = [3, 5, 7, 11, 13, 17, 19, 23, 65537];
  let e = eChoice ?? 65537;
  let eNote = "";
  if (e >= phi || gcd(e, phi) !== 1) {
    for (const cand of candidates) {
      if (cand < phi && gcd(cand, phi) === 1) {
        eNote = `preferred e=${e} unusable \u2192 e=${cand}`;
        e = cand;
        break;
      }
    }
  }
  const d = Number(modInverseBig(BigInt(e), BigInt(phi)));
  return { p, q, n, phi, e, d, eNote };
}
function rsaEncode(message) {
  const msg = upperLetters(message);
  let m = 0;
  const limbs = [];
  for (const ch of msg) {
    const v = ch.charCodeAt(0) - 65 + 1;
    limbs.push(v);
    m = m * 27 + v;
  }
  return { m, limbs, digits: msg };
}
function rsaDecode(m) {
  const digits = [];
  let x = m;
  while (x > 0) {
    digits.unshift(x % 27);
    x = Math.floor(x / 27);
  }
  let out = "";
  for (const v of digits) {
    if (v === 0) out += " ";
    else out += String.fromCharCode(64 + v);
  }
  return out;
}
function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}
function hashPaddingInfo(msg, blockBytes, lengthWordBytes, lengthLE) {
  const bitLength = msg.length * 8;
  const innerPad = (blockBytes - (msg.length + 1 + lengthWordBytes) % blockBytes) % blockBytes;
  const padded = new Uint8Array(msg.length + 1 + innerPad + lengthWordBytes);
  padded.set(msg);
  padded[msg.length] = 128;
  for (let i = 0; i < lengthWordBytes; i++) {
    const shift = lengthLE ? i : lengthWordBytes - 1 - i;
    padded[msg.length + 1 + innerPad + i] = Math.floor(bitLength / Math.pow(2, shift * 8)) & 255;
  }
  const blocks = [];
  for (let i = 0; i < padded.length; i += blockBytes) blocks.push(padded.slice(i, i + blockBytes));
  return {
    blocks,
    originalBytes: msg.length,
    bitLength,
    padBytes: 1 + innerPad + lengthWordBytes,
    blockCount: blocks.length
  };
}
var SHA256_K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
function rotr(x, n) {
  return x >>> n | x << 32 - n;
}
function rotl(x, n) {
  return x << n | x >>> 32 - n;
}
function sha256Detail(msg) {
  const { blocks } = hashPaddingInfo(msg, 64, 8, false);
  const h = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  const hInit = Array.from(h, u32ToHex);
  const w = new Uint32Array(64);
  const rounds = [];
  let schedule = [];
  const blocksHex = blocks.map(bytesToHex);
  blocks.forEach((block, bi) => {
    for (let t = 0; t < 16; t++) {
      w[t] = (block[t * 4] << 24 | block[t * 4 + 1] << 16 | block[t * 4 + 2] << 8 | block[t * 4 + 3]) >>> 0;
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ w[t - 15] >>> 3;
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ w[t - 2] >>> 10;
      w[t] = w[t - 16] + s0 + w[t - 7] + s1 >>> 0;
    }
    if (bi === 0) schedule = Array.from(w, u32ToHex);
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (let t = 0; t < 64; t++) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = e & f ^ ~e & g;
      const t1 = hh + s1 + ch + SHA256_K[t] + w[t] >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = a & b ^ a & c ^ b & c;
      const t2 = s0 + maj >>> 0;
      hh = g;
      g = f;
      f = e;
      e = d + t1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 >>> 0;
      if (bi === 0) {
        rounds.push({
          t,
          w: u32ToHex(w[t]),
          t1: u32ToHex(t1),
          t2: u32ToHex(t2),
          state: [a, b, c, d, e, f, g, hh].map(u32ToHex)
        });
      }
    }
    h[0] = h[0] + a >>> 0;
    h[1] = h[1] + b >>> 0;
    h[2] = h[2] + c >>> 0;
    h[3] = h[3] + d >>> 0;
    h[4] = h[4] + e >>> 0;
    h[5] = h[5] + f >>> 0;
    h[6] = h[6] + g >>> 0;
    h[7] = h[7] + hh >>> 0;
  });
  return {
    digest: Array.from(h, u32ToHex).join(""),
    blocksHex,
    schedule,
    hInit,
    hFinal: Array.from(h, u32ToHex),
    rounds
  };
}
var SHA1_K = [1518500249, 1859775393, 2400959708, 3395469782];
function sha1Detail(msg) {
  const { blocks } = hashPaddingInfo(msg, 64, 8, false);
  const h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  const hInit = h.map(u32ToHex);
  const w = new Uint32Array(80);
  const blocksHex = blocks.map(bytesToHex);
  blocks.forEach((block) => {
    for (let t = 0; t < 16; t++) {
      w[t] = (block[t * 4] << 24 | block[t * 4 + 1] << 16 | block[t * 4 + 2] << 8 | block[t * 4 + 3]) >>> 0;
    }
    for (let t = 16; t < 80; t++) w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
    for (let t = 0; t < 80; t++) {
      const k = SHA1_K[Math.floor(t / 20)];
      let f;
      if (t < 20) f = b & c | ~b & d;
      else if (t < 40) f = b ^ c ^ d;
      else if (t < 60) f = b & c | b & d | c & d;
      else f = b ^ c ^ d;
      const tmp = rotl(a, 5) + f + e + k + w[t] >>> 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = tmp;
    }
    h[0] = h[0] + a >>> 0;
    h[1] = h[1] + b >>> 0;
    h[2] = h[2] + c >>> 0;
    h[3] = h[3] + d >>> 0;
    h[4] = h[4] + e >>> 0;
  });
  return {
    digest: h.map((x) => ("00000000" + x.toString(16)).slice(-8)).join(""),
    blocksHex,
    hInit,
    hFinal: h.map(u32ToHex)
  };
}
var MD5_S = new Uint8Array([
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21
]);
var md5K = (i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
function md5Detail(msg) {
  const { blocks } = hashPaddingInfo(msg, 64, 8, true);
  let a0 = 1732584193;
  let b0 = 4023233417;
  let c0 = 2562383102;
  let d0 = 271733878;
  const hInit = [a0, b0, c0, d0].map(u32ToHex);
  const blocksHex = blocks.map(bytesToHex);
  const M = new Uint32Array(16);
  blocks.forEach((block) => {
    for (let i = 0; i < 16; i++) {
      M[i] = (block[i * 4] | block[i * 4 + 1] << 8 | block[i * 4 + 2] << 16 | block[i * 4 + 3] << 24) >>> 0;
    }
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let F;
      let g;
      if (i < 16) {
        F = B & C | ~B & D;
        g = i;
      } else if (i < 32) {
        F = D & B | ~D & C;
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = 7 * i % 16;
      }
      const sum = A + F + md5K(i) + M[g] >>> 0;
      const tmp = D;
      D = C;
      C = B;
      B = B + rotl(sum, MD5_S[i]) >>> 0;
      A = tmp;
    }
    a0 = a0 + A >>> 0;
    b0 = b0 + B >>> 0;
    c0 = c0 + C >>> 0;
    d0 = d0 + D >>> 0;
  });
  const digest = [a0, b0, c0, d0].map((x) => u32ToHex(x).match(/../g).reverse().join("")).join("");
  return { digest, blocksHex, hInit };
}
function sha256Digest(msg) {
  return hexToBytes(sha256Detail(msg).digest);
}
function hmacSha256Detail(keyText, message) {
  const blockSize = 64;
  const orig = strToBytes(keyText);
  const keyTooLong = orig.length > blockSize;
  const key = keyTooLong ? sha256Digest(orig) : orig;
  const keyBytes = new Uint8Array(blockSize);
  keyBytes.set(key);
  const ik = new Uint8Array(blockSize);
  const ok = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    ik[i] = keyBytes[i] ^ 54;
    ok[i] = keyBytes[i] ^ 92;
  }
  const msg = strToBytes(message);
  const inner = new Uint8Array(blockSize + msg.length);
  inner.set(ik);
  inner.set(msg, blockSize);
  const innerDigest = sha256Digest(inner);
  const outer = new Uint8Array(blockSize + 32);
  outer.set(ok);
  outer.set(innerDigest, blockSize);
  return {
    digest: bytesToHex(sha256Digest(outer)),
    keySize: orig.length,
    keyTooLong,
    keyPadded: bytesToHex(keyBytes),
    ipad: bytesToHex(ik),
    opad: bytesToHex(ok),
    innerMsg: bytesToHex(inner),
    innerDigest: bytesToHex(innerDigest)
  };
}
function hmacSha256(key, message) {
  const blockSize = 64;
  let keyBytes = typeof key === "string" ? strToBytes(key) : key;
  if (keyBytes.length > blockSize) keyBytes = sha256Digest(keyBytes);
  const ik = new Uint8Array(blockSize);
  const ok = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    ik[i] = (keyBytes[i] ?? 0) ^ 54;
    ok[i] = (keyBytes[i] ?? 0) ^ 92;
  }
  const msg = typeof message === "string" ? strToBytes(message) : message;
  const inner = new Uint8Array(blockSize + msg.length);
  inner.set(ik);
  inner.set(msg, blockSize);
  const innerDigest = sha256Digest(inner);
  const outer = new Uint8Array(blockSize + 32);
  outer.set(ok);
  outer.set(innerDigest, blockSize);
  return sha256Digest(outer);
}
function pbkdf2Sha256(password, salt, iterations, dkLen) {
  const hashLen = 32;
  const totalBlocks = Math.ceil(dkLen / hashLen);
  const saltBytes = strToBytes(salt);
  const out = new Uint8Array(dkLen);
  let offset = 0;
  let u1 = "";
  const blockDigests = [];
  for (let i = 1; i <= totalBlocks; i++) {
    const int = new Uint8Array(4);
    int[0] = i >>> 24 & 255;
    int[1] = i >>> 16 & 255;
    int[2] = i >>> 8 & 255;
    int[3] = i & 255;
    const saltWithInt = new Uint8Array(saltBytes.length + 4);
    saltWithInt.set(saltBytes);
    saltWithInt.set(int, saltBytes.length);
    let ui = hmacSha256(password, saltWithInt);
    if (i === 1) u1 = bytesToHex(ui);
    const acc = new Uint8Array(ui.length);
    acc.set(ui);
    for (let c = 1; c < iterations; c++) {
      ui = hmacSha256(password, ui);
      for (let j = 0; j < acc.length; j++) acc[j] ^= ui[j];
    }
    blockDigests.push(bytesToHex(acc));
    out.set(acc.subarray(0, Math.min(dkLen - offset, acc.length)), offset);
    offset += acc.length;
  }
  return { dkHex: bytesToHex(out), blockDigests, u1 };
}
function hkdfSha256(ikm, salt, info, len) {
  const prk = hmacSha256(salt, ikm);
  const blocks = [];
  const out = new Uint8Array(len);
  let prev = new Uint8Array(0);
  let offset = 0;
  let counter = 1;
  while (offset < len) {
    const input = new Uint8Array(prev.length + strToBytes(info).length + 1);
    input.set(prev);
    input.set(strToBytes(info), prev.length);
    input[input.length - 1] = counter;
    const t = hmacSha256(prk, input);
    blocks.push(bytesToHex(t));
    out.set(t.subarray(0, Math.min(len - offset, t.length)), offset);
    offset += t.length;
    prev = t;
    counter++;
  }
  return { prk: bytesToHex(prk), outHex: bytesToHex(out), blocks };
}

// src/components/simulation/common/CharRow.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function Cell({ cell, size }) {
  const tone = cell.tone === "active" ? `tone-active` : `tone-${cell.tone}`;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `lab-cell ${tone}${size ? ` lab-cell-${size}` : ""}`, title: cell.note, children: cell.ch });
}
function CharRow({
  cells,
  size,
  label
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lab-crow", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "lab-crow-label mono", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lab-crow-cells", dir: "ltr", children: cells.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { cell: c, size }, i)) })
  ] });
}
function CharRows({
  rows,
  size
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lab-rows", children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharRow, { label: r.label, cells: r.cells, size }, i)) });
}

// src/components/simulation/common/DataBlock.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
function DataBlock({
  label,
  value,
  tone,
  big
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: `lab-data-block${tone ? ` tone-${tone}` : ""}`, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "lab-data-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `lab-data-value mono${big ? " lab-data-big" : ""}`, dir: "ltr", children: value })
  ] });
}

// src/components/simulation/common/FlowArrow.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
function FlowArrow({ op }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "lab-arrow-wrap", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "lab-flow-arrow", "aria-hidden": "true", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "lab-flow-line" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "lab-flow-head" })
    ] }),
    op && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "lab-flow-op mono", dir: "ltr", children: op })
  ] });
}
function MatrixGrid({
  matrix,
  highlight,
  tone = "internal"
}) {
  const hs = new Set((highlight ?? []).map(([r, c]) => `${r},${c}`));
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "lab-matrix", dir: "ltr", children: matrix.map((row, r) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "lab-matrix-row", children: row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "span",
    {
      className: `lab-matrix-cell ${hs.has(`${r},${c}`) ? "tone-active" : `tone-${tone}`}`,
      dir: "ltr",
      children: cell
    },
    c
  )) }, r)) });
}

// src/components/simulation/renderers/caesar.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var id = "caesar";
var caesarEngine = {
  id,
  nameKey: "simulation.caesar.name",
  demoInputs: { text: "HELLO WORLD", shift: 3 },
  educationalKey: "simulation.caesar.educational",
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const shift = Number(ctx.inputs.shift ?? 3);
    const { chars, k } = caesarChars(text, shift, decrypt);
    const sign = decrypt ? "-" : "+";
    const cell = (c, tone) => ({
      ch: c.mapped,
      tone,
      note: c.note ?? `${c.plain}(${c.value}) ${sign}${k} \u2192 ${c.mapped}`
    });
    const pRow = chars.map((c) => ({
      ch: c.raw,
      tone: c.note === "ignored" ? "muted" : "input",
      note: c.note
    }));
    const kRow = chars.map((c) => ({
      ch: c.note === "ignored" ? "\xB7" : sign + String(c.keyValue ?? k),
      tone: c.note === "ignored" ? "muted" : "key",
      note: ""
    }));
    const cValRow = chars.map((c) => ({
      ch: c.value >= 0 ? String(modOut(c.value, sign, c.keyValue ?? 0)) : "\xB7",
      tone: c.note === "ignored" ? "muted" : "transform",
      note: ""
    }));
    const cRow = chars.map((c) => cell(c, "output"));
    const finalC = chars.filter((c) => c.note !== "ignored").map((c) => c.mapped).join("");
    return [
      {
        id: `${id}-input`,
        titleKey: "simulation.caesar.input.title",
        descKey: "simulation.caesar.input.desc",
        descArgs: { shift },
        phase: "input",
        view: {
          kind: "caesar-input",
          text,
          shift,
          chars: pRow.map((cc) => cc.ch).join("")
        }
      },
      {
        id: `${id}-rail`,
        titleKey: "simulation.caesar.rail.title",
        descKey: decrypt ? "simulation.caesar.rail.descLeft" : "simulation.caesar.rail.desc",
        descArgs: { k },
        phase: "transform",
        view: { kind: "caesar-rail", alphabet: ALPHABET.split(""), k, decrypt }
      },
      {
        id: `${id}-places`,
        titleKey: "simulation.caesar.places.title",
        descKey: "simulation.caesar.places.desc",
        descArgs: { k, sign },
        phase: "transform",
        view: { kind: "rows", rows: [
          { label: "P", cells: pRow },
          { label: "k", cells: kRow },
          { label: "mod 26", cells: cValRow },
          { label: "C", cells: cRow }
        ] }
      },
      {
        id: `${id}-chars`,
        titleKey: decrypt ? "simulation.caesar.chars.dTitle" : "simulation.caesar.chars.title",
        descKey: "simulation.caesar.chars.desc",
        descArgs: { k, sign },
        phase: "transform",
        view: { kind: "rows", rows: [
          { label: "P", cells: pRow },
          { label: "C", cells: cRow }
        ] }
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? "simulation.caesar.result.dTitle" : "simulation.caesar.result.title",
        descKey: decrypt ? "simulation.caesar.result.desc" : "simulation.caesar.result.desc",
        descArgs: { out: finalC },
        phase: "output",
        view: { kind: "result", text: finalC, chars: cRow }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "caesar-input": {
        const text = String(view.text);
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(DataBlock, { label: "k", value: String(view.shift), tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CharRows, { rows: [{ label: "Input", cells: text.split("").map((ch) => ({ ch, tone: "input" })) }] })
        ] });
      }
      case "caesar-rail": {
        const alphabet = view.alphabet;
        const k = Number(view.k);
        const decrypt = Boolean(view.decrypt);
        const shifted = alphabet.map(
          (_, i) => decrypt ? alphabet[(i - k + 26 * 100) % 26] : alphabet[(i + k) % 26]
        );
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lab-rail", dir: "ltr", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lab-rail-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "lab-rail-rowlabel", children: decrypt ? "P" : "C" }),
            shifted.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `lab-cell lab-cell-sm tone-transform`, children: ch }, i))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lab-rail-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "lab-rail-rowlabel", children: "idx" }),
            Array.from({ length: 26 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "lab-rail-guide", children: i }, i))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lab-rail-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "lab-rail-rowlabel", children: decrypt ? "C" : "P" }),
            alphabet.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `lab-cell lab-cell-sm tone-input`, children: ch }, i))
          ] })
        ] }) });
      }
      case "rows":
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          CharRows,
          {
            rows: view.rows
          }
        ) });
      case "result":
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CharRows, { rows: [{ label: "\u2192", cells: view.chars }] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(DataBlock, { label: "result", value: String(view.text), tone: "output", big: true })
        ] });
      default:
        return null;
    }
  }
};
function modOut(v, sign, k) {
  const m = sign === "-" ? v - k : v + k;
  return (m % 26 + 26) % 26;
}

// src/components/simulation/renderers/monoAlphabetic.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var id2 = "monoalphabetic";
var monoAlphabeticEngine = {
  id: id2,
  nameKey: "simulation.monoalphabetic.name",
  demoInputs: { text: "HELLO", substitution: "QAZWSXEDCRFVTGBYHNUJMIKOLP" },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const substitution = String(ctx.inputs.substitution ?? "QAZWSXEDCRFVTGBYHNUJMIKOLP");
    const { chars, sub, inverse } = monoChars(text, substitution, decrypt);
    const pRow = chars.map((c) => ({
      ch: c.raw,
      tone: c.note === "ignored" ? "muted" : "input",
      note: c.note
    }));
    const mRow = chars.map((c) => ({
      ch: c.mapped,
      tone: c.note === "ignored" ? "muted" : "output",
      note: c.note
    }));
    const finalText = chars.filter((c) => c.note !== "ignored").map((c) => c.mapped).join("");
    const gridRows = [
      {
        cells: ALPHABET.split("").map((ch) => ({ ch, tone: "input" }))
      },
      {
        cells: ALPHABET.split("").map((ch) => ({
          ch: decrypt ? inverse[ALPHABET.indexOf(ch)] ?? ch : sub[ALPHABET.indexOf(ch)],
          tone: "transform"
        }))
      }
    ];
    return [
      {
        id: `${id2}-key`,
        titleKey: "simulation.monoalphabetic.key.title",
        descKey: "simulation.monoalphabetic.key.desc",
        phase: "key",
        view: {
          kind: "mono-key",
          sub
        }
      },
      {
        id: `${id2}-input`,
        titleKey: "simulation.monoalphabetic.input.title",
        descKey: "simulation.monoalphabetic.input.desc",
        phase: "input",
        view: {
          kind: "mono-input",
          text,
          chars: pRow
        }
      },
      {
        id: `${id2}-mapping`,
        titleKey: "simulation.monoalphabetic.mapping.title",
        descKey: decrypt ? "simulation.monoalphabetic.mapping.dDesc" : "simulation.monoalphabetic.mapping.desc",
        phase: "transform",
        view: {
          kind: "mono-sub-grid",
          gridRows
        }
      },
      {
        id: `${id2}-chars`,
        titleKey: decrypt ? "simulation.monoalphabetic.chars.dTitle" : "simulation.monoalphabetic.chars.title",
        descKey: "simulation.monoalphabetic.chars.desc",
        phase: "transform",
        view: {
          kind: "mono-chars",
          pRow,
          mRow
        }
      },
      {
        id: `${id2}-result`,
        titleKey: decrypt ? "simulation.monoalphabetic.result.dTitle" : "simulation.monoalphabetic.result.title",
        descKey: "simulation.monoalphabetic.result.desc",
        phase: "output",
        view: {
          kind: "result",
          text: finalText,
          chars: mRow
        }
      }
    ];
  },
  View({ view, ctx }) {
    switch (view.kind) {
      case "mono-key": {
        const sub = String(view.sub);
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DataBlock, { label: "alphabet", value: ALPHABET, tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FlowArrow, { op: "maps to" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DataBlock, { label: "substitution", value: sub, tone: "key", big: true })
        ] });
      }
      case "mono-input": {
        const chars = view.chars;
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CharRows, { rows: [{ label: "Input", cells: chars }] }) });
      }
      case "mono-sub-grid": {
        const gridRows = view.gridRows;
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CharRows, { rows: gridRows, size: "sm" }) });
      }
      case "mono-chars": {
        const pR = view.pRow;
        const mR = view.mRow;
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CharRows, { rows: [
          { label: "P", cells: pR },
          { label: "C", cells: mR }
        ] }) });
      }
      case "result": {
        const chars = view.chars;
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CharRows, { rows: [{ label: ctx.operation === "decrypt" ? "P" : "C", cells: chars }] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DataBlock, { label: "result", value: String(view.text), tone: "output", big: true })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/vigenere.tsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
var id3 = "vigenere";
var vigenereEngine = {
  id: id3,
  nameKey: "simulation.vigenere.name",
  demoInputs: { text: "ATTACKATDAWN", key: "LEMON" },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const key = String(ctx.inputs.key ?? "LEMON");
    const { chars, knownLetters } = vigenereChars(text, key, decrypt);
    const pRow = chars.map((c) => ({
      ch: c.raw,
      tone: c.note === "ignored" ? "muted" : "input",
      note: c.note
    }));
    const kRow = chars.map((c) => ({
      ch: c.note === "ignored" ? "" : c.keyValue !== void 0 ? ALPHABET[c.keyValue] : "",
      tone: c.note === "ignored" ? "muted" : "key",
      note: c.note
    }));
    const cRow = chars.map((c) => ({
      ch: c.mapped,
      tone: c.note === "ignored" ? "muted" : "output",
      note: c.note
    }));
    const finalText = chars.filter((c) => c.note !== "ignored").map((c) => c.mapped).join("");
    const sign = decrypt ? "-" : "+";
    const vRow = chars.map((c) => ({
      ch: c.value >= 0 ? String(c.value) : "",
      tone: c.note === "ignored" ? "muted" : "input",
      note: ""
    }));
    const kvRow = chars.map((c) => ({
      ch: c.keyValue !== void 0 ? String(c.keyValue) : "",
      tone: c.note === "ignored" ? "muted" : "key",
      note: ""
    }));
    const cvRow = chars.map((c) => {
      if (c.value < 0 || c.keyValue === void 0) return { ch: "", tone: "muted", note: "" };
      const v = decrypt ? (c.value - c.keyValue + 260) % 26 : (c.value + c.keyValue) % 26;
      return { ch: String(v), tone: "transform", note: "" };
    });
    return [
      {
        id: `${id3}-key`,
        titleKey: "simulation.vigenere.key.title",
        descKey: "simulation.vigenere.key.desc",
        phase: "key",
        view: { kind: "vig-key", key: knownLetters }
      },
      {
        id: `${id3}-input`,
        titleKey: "simulation.vigenere.input.title",
        descKey: "simulation.vigenere.input.desc",
        phase: "input",
        view: { kind: "vig-input", text, chars: pRow }
      },
      {
        id: `${id3}-rail`,
        titleKey: "simulation.vigenere.rail.title",
        descKey: "simulation.vigenere.rail.desc",
        phase: "transform",
        view: { kind: "vig-rail", key: knownLetters, text: text.toUpperCase().replace(/[^A-Z]/g, "") }
      },
      {
        id: `${id3}-chars`,
        titleKey: decrypt ? "simulation.vigenere.chars.dTitle" : "simulation.vigenere.chars.title",
        descKey: decrypt ? "simulation.vigenere.chars.dDesc" : "simulation.vigenere.chars.desc",
        descArgs: { sign },
        phase: "transform",
        view: { kind: "rows", rows: [
          { label: "P", cells: pRow },
          { label: "K", cells: kRow },
          { label: `${sign}  mod 26`, cells: cvRow },
          { label: "P val", cells: vRow },
          { label: "K val", cells: kvRow },
          { label: "C", cells: cRow }
        ] }
      },
      {
        id: `${id3}-result`,
        titleKey: decrypt ? "simulation.vigenere.result.dTitle" : "simulation.vigenere.result.title",
        descKey: "simulation.vigenere.result.desc",
        phase: "output",
        view: { kind: "result", text: finalText, chars: cRow }
      }
    ];
  },
  View({ view, ctx }) {
    switch (view.kind) {
      case "vig-key": {
        const key = String(view.key);
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DataBlock, { label: "key", value: key, tone: "key", big: true }) });
      }
      case "vig-input": {
        const chars = view.chars;
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CharRows, { rows: [{ label: "Input", cells: chars }] }) });
      }
      case "vig-rail": {
        const key = String(view.key);
        const letters = String(view.text);
        const repeated = (key + key.repeat(Math.ceil(letters.length / key.length))).slice(0, letters.length);
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "lab-rail", dir: "ltr", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "lab-rail-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "lab-rail-rowlabel", children: "P" }),
            letters.split("").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "lab-cell lab-cell-sm tone-input", children: ch }, i))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "lab-rail-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "lab-rail-rowlabel", children: "K" }),
            repeated.split("").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "lab-cell lab-cell-sm tone-key", children: ch }, i))
          ] })
        ] }) });
      }
      case "rows":
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CharRows, { rows: view.rows }) });
      case "result": {
        const chars = view.chars;
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CharRows, { rows: [{ label: ctx.operation === "decrypt" ? "P" : "C", cells: chars }] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DataBlock, { label: "result", value: String(view.text), tone: "output", big: true })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/playfair.tsx
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var id4 = "playfair";
var playfairEngine = {
  id: id4,
  nameKey: "simulation.playfair.name",
  demoInputs: { text: "HELLOWORLD", keyword: "MONARCHY" },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const keyword = String(ctx.inputs.keyword ?? "MONARCHY");
    const { square, pairs, notes, steps, result } = playfairPairs(text, keyword, decrypt);
    return [
      {
        id: `${id4}-square`,
        titleKey: "simulation.playfair.square.title",
        descKey: "simulation.playfair.square.desc",
        phase: "key",
        view: { kind: "pf-square", square, keyword }
      },
      {
        id: `${id4}-digraphs`,
        titleKey: "simulation.playfair.digraphs.title",
        descKey: "simulation.playfair.digraphs.desc",
        phase: "input",
        view: { kind: "pf-digraphs", pairs, notes }
      },
      {
        id: `${id4}-encrypt`,
        titleKey: decrypt ? "simulation.playfair.encrypt.dTitle" : "simulation.playfair.encrypt.title",
        descKey: decrypt ? "simulation.playfair.encrypt.dDesc" : "simulation.playfair.encrypt.desc",
        phase: "transform",
        view: { kind: "pf-encrypt", square, steps }
      },
      {
        id: `${id4}-result`,
        titleKey: decrypt ? "simulation.playfair.result.dTitle" : "simulation.playfair.result.title",
        descKey: "simulation.playfair.result.desc",
        phase: "output",
        view: { kind: "result", text: result }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "pf-square": {
        const square = view.square;
        const keyword = String(view.keyword);
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DataBlock, { label: "keyword", value: keyword, tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(MatrixGrid, { matrix: square, tone: "internal" })
        ] });
      }
      case "pf-digraphs": {
        const pairs = view.pairs;
        const notes = view.notes;
        const cells = pairs.map((p, i) => ({
          ch: p,
          tone: "input",
          note: notes[i]
        }));
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CharRows, { rows: [{ label: "Digraphs", cells }], size: "lg" }) });
      }
      case "pf-encrypt": {
        const square = view.square;
        const steps = view.steps;
        const highlight = [];
        if (steps.length > 0) {
          const s = steps[0];
          highlight.push([s.ra, s.ca], [s.rb, s.cb]);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(MatrixGrid, { matrix: square, highlight, tone: "internal" }),
          steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DataBlock, { label: "rule", value: steps[0].rule, tone: "transform" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CharRows, { rows: [{
              label: "out",
              cells: [{ ch: steps[0].out, tone: "output" }]
            }], size: "lg" })
          ] })
        ] });
      }
      case "result": {
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DataBlock, { label: "result", value: String(view.text), tone: "output", big: true }) });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/hill.tsx
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var id5 = "hill";
var hillEngine = {
  id: id5,
  nameKey: "simulation.hill.name",
  educationalKey: "simulation.hill.educational",
  demoInputs: { text: "HELP", matrix: [[3, 3], [2, 5]] },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const matrix = ctx.inputs.matrix;
    const { blocks, padded, determin, detInv, inverse, valid } = hillBlocks(matrix, text, decrypt);
    const workingMatrix = decrypt ? valid ? inverse : matrix : matrix;
    const finalText = blocks.map((b) => b.map((c) => c.mapped).join("")).join("");
    const blockDisplays = blocks.map((b) => {
      const inputVec = b.map((c) => c.v);
      const outputVec = b.map((c) => c.out);
      return {
        chars: b.map((c) => c.ch),
        inputVec,
        midProducts: b.map((c) => c.out),
        outputVec,
        outputChars: b.map((c) => c.mapped)
      };
    });
    return [
      {
        id: `${id5}-matrix`,
        titleKey: decrypt ? "simulation.hill.matrix.dTitle" : "simulation.hill.matrix.title",
        descKey: decrypt ? "simulation.hill.matrix.dDesc" : "simulation.hill.matrix.desc",
        descArgs: { n: String(matrix.length) },
        phase: "key",
        view: {
          kind: "hill-matrix",
          matrix: workingMatrix,
          decrypt,
          valid,
          determin,
          detInv,
          originalMatrix: matrix
        }
      },
      {
        id: `${id5}-prepare`,
        titleKey: "simulation.hill.prepare.title",
        descKey: "simulation.hill.prepare.desc",
        descArgs: { n: String(matrix.length) },
        phase: "input",
        view: {
          kind: "hill-prepare",
          blocks: blockDisplays,
          padded,
          n: matrix.length
        }
      },
      {
        id: `${id5}-compute`,
        titleKey: decrypt ? "simulation.hill.compute.dTitle" : "simulation.hill.compute.title",
        descKey: decrypt ? "simulation.hill.compute.dDesc" : "simulation.hill.compute.desc",
        phase: "transform",
        view: {
          kind: "hill-compute",
          matrix: workingMatrix,
          blocks: blockDisplays
        }
      },
      {
        id: `${id5}-result`,
        titleKey: decrypt ? "simulation.hill.result.dTitle" : "simulation.hill.result.title",
        descKey: "simulation.hill.result.desc",
        phase: "output",
        view: { kind: "result", text: finalText }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "hill-matrix": {
        const matrix = view.matrix;
        const decrypt = Boolean(view.decrypt);
        const valid = Boolean(view.valid);
        const determin = Number(view.determin);
        const detInv = view.detInv;
        const originalMatrix = view.originalMatrix;
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "lab-stage-view", children: [
          decrypt && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DataBlock, { label: "K (key)", value: JSON.stringify(originalMatrix), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(FlowArrow, {}),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              DataBlock,
              {
                label: "det",
                value: detInv !== null ? `${determin}, det^-1 = ${detInv}` : `${determin} (not invertible)`,
                tone: valid ? "internal" : "muted"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(FlowArrow, {})
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(MatrixGrid, { matrix, tone: decrypt ? "transform" : "key" }),
          !decrypt && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DataBlock, { label: "C = K * P mod 26", value: "", tone: "internal" })
        ] });
      }
      case "hill-prepare": {
        const blocks = view.blocks;
        const padded = Number(view.padded);
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "lab-stage-view", children: [
          blocks.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CharRows, { rows: [{
            label: `block ${i + 1}`,
            cells: b.chars.map((ch) => ({ ch, tone: "input" }))
          }] }, i)),
          padded > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DataBlock, { label: "padding", value: `${padded} X(s) added`, tone: "muted" })
        ] });
      }
      case "hill-compute": {
        const blocks = view.blocks;
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "lab-stage-view", children: blocks.map((b, bi) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CharRows, { rows: [
            { label: "P", cells: b.inputVec.map((v) => ({ ch: String(v), tone: "input" })) },
            { label: "C", cells: b.outputVec.map((v) => ({ ch: String(v), tone: "output" })) },
            { label: "out", cells: b.outputChars.map((ch) => ({ ch, tone: "output" })) }
          ] }),
          bi < blocks.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(FlowArrow, {})
        ] }, bi)) });
      }
      case "result": {
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DataBlock, { label: "result", value: String(view.text), tone: "output", big: true }) });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/railFence.tsx
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var id6 = "rail_fence";
var railFenceEngine = {
  id: id6,
  nameKey: "simulation.rail_fence.name",
  demoInputs: { text: "HELLOWORLD", rails: 3 },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const rails = Number(ctx.inputs.rails ?? 3);
    if (decrypt) {
      const { plaintext, positions: positions2, counts } = railFenceDecrypt(text, rails);
      const grid2 = Array.from(
        { length: rails },
        () => Array(text.length).fill(".")
      );
      const cursor = counts.map(() => 0);
      const reconstructed = positions2.map((r) => {
        const ch = text[cursor[r]] ?? "";
        cursor[r]++;
        return ch;
      });
      reconstructed.forEach((ch, col) => {
        grid2[positions2[col]][col] = ch;
      });
      return [
        {
          id: `${id6}-config`,
          titleKey: "simulation.rail_fence.config.title",
          descKey: "simulation.rail_fence.config.desc",
          descArgs: { rails: String(rails) },
          phase: "key",
          view: { kind: "rf-config", rails, cycle: 2 * (rails - 1) }
        },
        {
          id: `${id6}-positions`,
          titleKey: "simulation.rail_fence.positions.title",
          descKey: "simulation.rail_fence.positions.desc",
          descArgs: { rails: String(rails), counts: counts.join(", ") },
          phase: "input",
          view: { kind: "rf-positions", rails, counts, text }
        },
        {
          id: `${id6}-rebuild`,
          titleKey: "simulation.rail_fence.rebuild.title",
          descKey: "simulation.rail_fence.rebuild.desc",
          phase: "transform",
          view: { kind: "rf-rebuild", grid: grid2, rails }
        },
        {
          id: `${id6}-result`,
          titleKey: "simulation.rail_fence.result.dTitle",
          descKey: "simulation.rail_fence.result.dDesc",
          phase: "output",
          view: { kind: "result", text: plaintext }
        }
      ];
    }
    const { positions, ciphertext, rows, cycle } = railFenceEncrypt(text, rails);
    const grid = Array.from(
      { length: rails },
      () => Array(text.length).fill(null)
    );
    text.split("").forEach((ch, col) => {
      grid[positions[col]][col] = ch;
    });
    const displayGrid = grid.map((row) => row.map((c) => c ?? "."));
    return [
      {
        id: `${id6}-config`,
        titleKey: "simulation.rail_fence.config.title",
        descKey: "simulation.rail_fence.config.desc",
        descArgs: { rails: String(rails) },
        phase: "key",
        view: { kind: "rf-config", rails, cycle }
      },
      {
        id: `${id6}-pattern`,
        titleKey: "simulation.rail_fence.pattern.title",
        descKey: "simulation.rail_fence.pattern.desc",
        phase: "input",
        view: { kind: "rf-pattern", displayGrid, rails, text }
      },
      {
        id: `${id6}-read`,
        titleKey: "simulation.rail_fence.read.title",
        descKey: "simulation.rail_fence.read.desc",
        phase: "transform",
        view: { kind: "rf-read", rows }
      },
      {
        id: `${id6}-result`,
        titleKey: "simulation.rail_fence.result.title",
        descKey: "simulation.rail_fence.result.desc",
        phase: "output",
        view: { kind: "result", text: ciphertext }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "rf-config": {
        const rails = Number(view.rails);
        const cycle = Number(view.cycle);
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DataBlock, { label: "rails", value: String(rails), tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DataBlock, { label: "cycle", value: String(cycle), tone: "internal" })
        ] });
      }
      case "rf-pattern": {
        const displayGrid = view.displayGrid;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MatrixGrid, { matrix: displayGrid, tone: "internal" }) });
      }
      case "rf-read": {
        const rows = view.rows;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(CharRows, { rows: rows.map((r, i) => ({
          label: `rail ${i + 1}`,
          cells: r.split("").map((ch) => ({ ch, tone: "transform" }))
        })) }) });
      }
      case "rf-positions": {
        const counts = view.counts;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "lab-stage-view", children: counts.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DataBlock, { label: `rail ${i + 1}`, value: `${c} chars`, tone: "internal" }, i)) });
      }
      case "rf-rebuild": {
        const grid = view.grid;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MatrixGrid, { matrix: grid, tone: "internal" }) });
      }
      case "result": {
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DataBlock, { label: "result", value: String(view.text), tone: "output", big: true })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/columnar.tsx
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
var id7 = "columnar";
var columnarEngine = {
  id: id7,
  nameKey: "simulation.columnar.name",
  demoInputs: { text: "HELLOWORLD", key: "ZEBRA" },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const key = String(ctx.inputs.key ?? "ZEBRA");
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, "");
    const order = columnOrder(keyUpper);
    if (decrypt) {
      const { plaintext } = columnarDecrypt(text, keyUpper);
      const cols2 = keyUpper.length;
      const rowsCount = Math.ceil(text.length / cols2);
      const padded = rowsCount * cols2 - text.length;
      const colLengths = Array(cols2).fill(rowsCount);
      let pad = padded;
      for (let i = order.length - 1; i >= 0 && pad > 0; i--) {
        colLengths[order[i]] -= 1;
        pad -= 1;
      }
      const colTexts = [];
      let pos = 0;
      for (let c = 0; c < cols2; c++) {
        colTexts.push(text.slice(pos, pos + colLengths[c]));
        pos += colLengths[c];
      }
      const grid = [];
      for (let r = 0; r < rowsCount; r++) {
        const row = [];
        for (let c = 0; c < cols2; c++) row.push(r < colTexts[c].length ? colTexts[c][r] : ".");
        grid.push(row);
      }
      return [
        {
          id: `${id7}-key`,
          titleKey: "simulation.columnar.key.title",
          descKey: "simulation.columnar.key.desc",
          phase: "key",
          view: { kind: "col-key", key: keyUpper, order }
        },
        {
          id: `${id7}-split`,
          titleKey: "simulation.columnar.split.title",
          descKey: "simulation.columnar.split.desc",
          phase: "input",
          view: { kind: "col-split", key: keyUpper, order, colTexts, colLengths }
        },
        {
          id: `${id7}-rebuild`,
          titleKey: "simulation.columnar.rebuild.title",
          descKey: "simulation.columnar.rebuild.desc",
          phase: "transform",
          view: { kind: "col-rebuild", key: keyUpper, order, grid }
        },
        {
          id: `${id7}-result`,
          titleKey: "simulation.columnar.result.dTitle",
          descKey: "simulation.columnar.result.dDesc",
          phase: "output",
          view: { kind: "result", text: plaintext }
        }
      ];
    }
    const { rows, cols, order: encOrder, columnTexts, ciphertext } = columnarEncrypt(text, keyUpper);
    const gridDisplay = rows.map((row) => row.map((c) => c || "."));
    return [
      {
        id: `${id7}-key`,
        titleKey: "simulation.columnar.key.title",
        descKey: "simulation.columnar.key.desc",
        phase: "key",
        view: { kind: "col-key", key: keyUpper, order: encOrder }
      },
      {
        id: `${id7}-grid`,
        titleKey: "simulation.columnar.grid.title",
        descKey: "simulation.columnar.grid.desc",
        descArgs: { cols: String(cols), rows: String(rows.length) },
        phase: "input",
        view: { kind: "col-grid", grid: gridDisplay, key: keyUpper }
      },
      {
        id: `${id7}-read`,
        titleKey: "simulation.columnar.read.title",
        descKey: "simulation.columnar.read.desc",
        phase: "transform",
        view: { kind: "col-read", columnTexts, order: encOrder, key: keyUpper }
      },
      {
        id: `${id7}-result`,
        titleKey: "simulation.columnar.result.title",
        descKey: "simulation.columnar.result.desc",
        phase: "output",
        view: { kind: "result", text: ciphertext }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "col-key": {
        const key = String(view.key);
        const order = view.order;
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(DataBlock, { label: "key", value: key, tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(DataBlock, { label: "order", value: order.join(", "), tone: "internal" })
        ] });
      }
      case "col-grid": {
        const grid = view.grid;
        const key = String(view.key);
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MatrixGrid, { matrix: grid, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "lab-rail", dir: "ltr", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "lab-rail-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "lab-rail-rowlabel", children: "K" }),
            key.split("").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "lab-cell lab-cell-sm tone-key", children: ch }, i))
          ] }) })
        ] });
      }
      case "col-read": {
        const columnTexts = view.columnTexts;
        const order = view.order;
        const key = String(view.key);
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CharRows, { rows: order.map((c) => ({
          label: `${key[c]}(${c})`,
          cells: columnTexts[c].split("").map((ch) => ({
            ch,
            tone: "transform"
          }))
        })) }) });
      }
      case "col-split": {
        const key = String(view.key);
        const order = view.order;
        const colTexts = view.colTexts;
        const colLengths = view.colLengths;
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CharRows, { rows: order.map((c) => ({
          label: `${key[c]}(${c}) len ${colLengths[c]}`,
          cells: colTexts[c].split("").map((ch) => ({
            ch,
            tone: "transform"
          }))
        })) }) });
      }
      case "col-rebuild": {
        const key = String(view.key);
        const grid = view.grid;
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MatrixGrid, { matrix: grid, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "lab-rail", dir: "ltr", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "lab-rail-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "lab-rail-rowlabel", children: "K" }),
            key.split("").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "lab-cell lab-cell-sm tone-key", children: ch }, i))
          ] }) })
        ] });
      }
      case "result": {
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(DataBlock, { label: "result", value: String(view.text), tone: "output", big: true })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/des.tsx
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
var id8 = "des";
var IP = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7];
var FP = [40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25];
var E_TABLE = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
var P_TABLE = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];
var PC1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4];
var PC2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];
var SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
var SBOXES = [
  [[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7], [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8], [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0], [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]],
  [[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10], [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5], [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15], [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]],
  [[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8], [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1], [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7], [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]],
  [[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15], [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9], [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4], [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]],
  [[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9], [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6], [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14], [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]],
  [[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11], [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8], [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6], [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]],
  [[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1], [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6], [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2], [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]],
  [[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7], [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2], [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8], [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]]
];
var hexToBits = (hex) => {
  const v = BigInt("0x" + hex);
  const n = hex.length * 4;
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(Number(v >> BigInt(i) & 1n));
  return out;
};
var bitsToHex = (bits) => {
  let v = 0n;
  for (const b of bits) v = v << 1n | BigInt(b);
  return v.toString(16).padStart(Math.ceil(bits.length / 4), "0");
};
var perm = (bits, table) => table.map((i) => bits[i - 1]);
var rotl2 = (bits, n) => bits.slice(n).concat(bits.slice(0, n));
var xorBits = (a, b) => a.map((x, i) => x ^ (b[i] ?? 0));
var keySchedule = (keyHex) => {
  const kb = hexToBits(keyHex);
  const permuted = perm(kb, PC1);
  let c = permuted.slice(0, 28);
  let d = permuted.slice(28);
  const rks = [];
  for (const s of SHIFTS) {
    c = rotl2(c, s);
    d = rotl2(d, s);
    rks.push(perm(c.concat(d), PC2));
  }
  return rks;
};
var desRoundF = (right, key) => {
  const expanded = perm(right, E_TABLE);
  const xored = xorBits(expanded, key);
  const sboxOut = [];
  const sboxes = [];
  for (let i = 0; i < 8; i++) {
    const chunk = xored.slice(i * 6, (i + 1) * 6);
    const row = chunk[0] << 1 | (chunk[5] ?? 0);
    const col = (chunk[1] ?? 0) << 3 | (chunk[2] ?? 0) << 2 | (chunk[3] ?? 0) << 1 | (chunk[4] ?? 0);
    const value = SBOXES[i][row]?.[col] ?? 0;
    const fourBits = [
      value >> 3 & 1,
      value >> 2 & 1,
      value >> 1 & 1,
      value & 1
    ];
    sboxOut.push(...fourBits);
    sboxes.push({
      sbox: i + 1,
      sixBits: chunk.join(""),
      row,
      col,
      value,
      fourBits: fourBits.join("")
    });
  }
  const fOut = perm(sboxOut, P_TABLE);
  return { fOut, detail: { round: 0, key: "", expanded: bitsToHex(expanded), xor: bitsToHex(xored), sboxes } };
};
function desLive(blockHex, keyHex, decrypt) {
  const schedule = keySchedule(keyHex);
  const applied = decrypt ? schedule.slice().reverse() : schedule;
  const bb = hexToBits(blockHex);
  const pp = perm(bb, IP);
  let left = pp.slice(0, 32);
  let right = pp.slice(32);
  const roundStates = [{ round: 0, L: bitsToHex(left), R: bitsToHex(right) }];
  const fDetails = [];
  for (let r = 0; r < 16; r++) {
    const { fOut, detail } = desRoundF(right, applied[r] ?? []);
    const leftNew = xorBits(left, fOut);
    detail.round = r + 1;
    detail.key = bitsToHex(applied[r] ?? []);
    fDetails.push(detail);
    left = right;
    right = leftNew;
    roundStates.push({ round: r + 1, L: bitsToHex(left), R: bitsToHex(right) });
  }
  const preOutput = bitsToHex(right.concat(left));
  const output = perm(right.concat(left), FP);
  return {
    roundKeysSchedule: schedule.map(bitsToHex),
    roundKeysApplied: applied.map(bitsToHex),
    roundStates,
    fDetails,
    l0: roundStates[0]?.L ?? "",
    r0: roundStates[0]?.R ?? "",
    preOutput,
    resultHex: bitsToHex(output)
  };
}
var hexStrOf2 = (v) => typeof v === "string" ? v : void 0;
var isRoundStates = (v) => Array.isArray(v);
var roundStatesOf = (rows) => rows.map((r) => ({
  round: typeof r.round === "number" ? r.round : Number(r.round) || 0,
  L: hexStrOf2(r.L) ?? "",
  R: hexStrOf2(r.R) ?? ""
})).filter((r) => r.L && r.R);
var fDetailsOf = (rows) => rows.map((d) => {
  const sboxes = Array.isArray(d.sboxes) ? d.sboxes.map((s) => ({
    sbox: Number(s.sbox) || 0,
    sixBits: hexStrOf2(s.six_bits) ?? "",
    row: Number(s.row) || 0,
    col: Number(s.col) || 0,
    value: Number(s.value) || 0,
    fourBits: hexStrOf2(s.four_bits) ?? ""
  })) : [];
  return {
    round: Number(d.round) || 0,
    key: hexStrOf2(d.key) ?? "",
    expanded: hexStrOf2(d.expanded) ?? "",
    xor: hexStrOf2(d.xor) ?? "",
    sboxes
  };
}).filter((d) => d.expanded);
var desEngine = {
  id: id8,
  nameKey: "simulation.des.name",
  educationalKey: "simulation.des.educational",
  demoInputs: {
    block: "0123456789ABCDEF",
    key: "133457799BBCDFF1"
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const blockHex = String(ctx.inputs.block ?? "0123456789ABCDEF").replace(/\s/g, "");
    const keyHex = String(ctx.inputs.key ?? "133457799BBCDFF1").replace(/\s/g, "");
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    let live = null;
    try {
      live = desLive(blockHex, keyHex, decrypt);
    } catch {
      live = null;
    }
    const boundStates = hasResult && isRoundStates(extra?.round_states) ? roundStatesOf(extra?.round_states) : void 0;
    const boundKeys = hasResult && Array.isArray(extra?.round_keys) ? (extra?.round_keys).map((k) => hexStrOf2(k)).filter((k) => !!k) : void 0;
    const boundF = hasResult && Array.isArray(extra?.f_details) ? fDetailsOf(extra?.f_details) : void 0;
    const roundStates = boundStates ?? live?.roundStates ?? [];
    const l0 = roundStates[0]?.L ?? live?.l0 ?? "";
    const r0 = roundStates[0]?.R ?? live?.r0 ?? "";
    const fDetail0 = boundF && boundF.length > 0 ? boundF[0] : live?.fDetails[0];
    const resultHex = hasResult ? hexStrOf2(ctx.result?.result)?.replace(/\s/g, "") ?? live?.resultHex ?? "" : live?.resultHex ?? "";
    const rkDisplay = boundKeys ?? live?.roundKeysSchedule ?? [];
    return [
      {
        id: `${id8}-input`,
        titleKey: "simulation.des.input.title",
        descKey: "simulation.des.input.desc",
        phase: "input",
        view: { kind: "des-input", block: blockHex, key: keyHex, l0, r0 }
      },
      {
        id: `${id8}-key`,
        titleKey: "simulation.des.key.title",
        descKey: "simulation.des.key.desc",
        phase: "key",
        view: { kind: "des-key", roundKeys: rkDisplay }
      },
      {
        id: `${id8}-f`,
        titleKey: "simulation.des.f.title",
        descKey: "simulation.des.f.desc",
        phase: "transform",
        view: { kind: "des-f", f: fDetail0, l0, r0 }
      },
      {
        id: `${id8}-rounds`,
        titleKey: "simulation.des.rounds.title",
        descKey: "simulation.des.rounds.desc",
        descArgs: { rounds: 16 },
        phase: "internal",
        view: { kind: "des-rounds", states: roundStates }
      },
      {
        id: `${id8}-swap`,
        titleKey: "simulation.des.swap.title",
        descKey: "simulation.des.swap.desc",
        phase: "transform",
        view: { kind: "des-swap", preOutput: live?.preOutput ?? "", resultHex }
      },
      {
        id: `${id8}-result`,
        titleKey: decrypt ? "simulation.des.result.dTitle" : "simulation.des.result.title",
        descKey: "simulation.des.result.desc",
        phase: "output",
        view: { kind: "des-result", hex: resultHex, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "des-input":
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "block", value: hexStrOf2(view.block) ?? "", tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "key", value: hexStrOf2(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "IP" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "L0", value: hexStrOf2(view.l0) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "R0", value: hexStrOf2(view.r0) ?? "", tone: "internal" })
        ] });
      case "des-key": {
        const keys = view.roundKeys;
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "PC-1 \u2192 rotate \u2192 PC-2" }),
          keys.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: `K${i + 1}`, value: k, tone: i % 2 === 0 ? "key" : "internal" }, i))
        ] });
      }
      case "des-f": {
        const f = view.f;
        const l0 = hexStrOf2(view.l0) ?? "";
        const r0 = hexStrOf2(view.r0) ?? "";
        if (!f) return null;
        const newRight = l0 ? (() => {
          const a = BigInt("0x" + l0);
          const b = BigInt("0x" + f.xor.slice(0, 8));
          return (a ^ b).toString(16).padStart(8, "0");
        })() : "";
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "R0", value: r0, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "E" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "E(R0)", value: f.expanded, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "XOR K1" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "E(R0) \u2295 K1", value: f.xor, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "S-boxes" }),
          f.sboxes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            DataBlock,
            {
              label: `S${s.sbox}`,
              value: `${s.sixBits} \u2192 row ${s.row}, col ${s.col} \u2192 ${s.value}`,
              tone: "internal"
            },
            s.sbox
          )),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "P" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "f(R0, K1)", value: newRight, tone: "output" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "XOR L0" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "R1", value: newRight, tone: "output" })
        ] });
      }
      case "des-rounds": {
        const states = view.states;
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "lab-stage-view", children: states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: `R${s.round}`, value: `L ${s.L}   R ${s.R}`, tone: s.round % 2 === 0 ? "internal" : "transform" }, s.round)) });
      }
      case "des-swap":
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "R16L16", value: hexStrOf2(view.preOutput) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowArrow, { op: "FP" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DataBlock, { label: "output", value: hexStrOf2(view.resultHex) ?? "", tone: "output", big: true })
        ] });
      case "des-result":
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          DataBlock,
          {
            label: view.decrypt ? "plaintext" : "ciphertext",
            value: hexStrOf2(view.hex) ?? "",
            tone: "output",
            big: true
          }
        ) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/tripleDes.tsx
var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
var id9 = "triple_des";
var hexStrOf5 = (v) => typeof v === "string" ? v : void 0;
var splitKeys = (keyHex) => {
  const key = hexToBytes(keyHex.replace(/\s/g, ""));
  const k = (start, end) => bytesToHex(new Uint8Array(key.slice(start, end)));
  return { k1: k(0, 8), k2: k(8, 16), k3: k(16, 24) };
};
function tdesLive(blockHex, keyHex, decrypt) {
  const { k1, k2, k3 } = splitKeys(keyHex);
  const etap = decrypt ? [
    { op: "decrypt", key: k3, label: "D(K3)" },
    { op: "encrypt", key: k2, label: "E(K2)" },
    { op: "decrypt", key: k1, label: "D(K1)" }
  ] : [
    { op: "encrypt", key: k1, label: "E(K1)" },
    { op: "decrypt", key: k2, label: "D(K2)" },
    { op: "encrypt", key: k3, label: "E(K3)" }
  ];
  const stages = [];
  let current = blockHex.replace(/\s/g, "");
  for (const e of etap) {
    const out = desLive(current, e.key, e.op === "decrypt").resultHex;
    stages.push({ stage: e.label, operation: e.op, key: e.key, input: current, output: out });
    current = out;
  }
  return {
    k1,
    k2,
    k3,
    stages,
    formula: decrypt ? "P = D(K1, E(K2, D(K3, C)))" : "C = E(K3, D(K2, E(K1, P)))",
    resultHex: current
  };
}
var boundStagesOf = (rows) => rows.map((s) => ({
  stage: hexStrOf5(s.stage) ?? "",
  operation: hexStrOf5(s.operation) ?? "",
  key: hexStrOf5(s.key) ?? "",
  input: hexStrOf5(s.input) ?? "",
  output: hexStrOf5(s.output) ?? ""
})).filter((s) => s.output);
var tripleDesEngine = {
  id: id9,
  nameKey: "simulation.triple_des.name",
  educationalKey: "simulation.triple_des.educational",
  demoInputs: {
    block: "0123456789ABCDEF",
    key: "133457799BBCDFF1133457799BBCDFF1133457799BBCDFF1"
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const blockHex = String(ctx.inputs.block ?? "0123456789ABCDEF").replace(/\s/g, "");
    const keyHex = String(ctx.inputs.key ?? "133457799BBCDFF1133457799BBCDFF1133457799BBCDFF1").replace(/\s/g, "");
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    let live = null;
    try {
      live = tdesLive(blockHex, keyHex, decrypt);
    } catch {
      live = null;
    }
    const boundStages = hasResult && Array.isArray(extra?.stages) ? boundStagesOf(extra?.stages) : void 0;
    const stages = boundStages ?? live?.stages ?? [];
    const k1 = hasResult ? hexStrOf5(extra?.k1) ?? live?.k1 ?? "" : live?.k1 ?? "";
    const k2 = hasResult ? hexStrOf5(extra?.k2) ?? live?.k2 ?? "" : live?.k2 ?? "";
    const k3 = hasResult ? hexStrOf5(extra?.k3) ?? live?.k3 ?? "" : live?.k3 ?? "";
    const formula = hasResult ? hexStrOf5(extra?.formula) ?? live?.formula ?? "" : live?.formula ?? "";
    const resultHex = hasResult ? hexStrOf5(ctx.result?.result)?.replace(/\s/g, "") ?? live?.resultHex ?? "" : live?.resultHex ?? "";
    const stage1 = stages[0];
    const stage2 = stages[1];
    const stage3 = stages[2];
    return [
      {
        id: `${id9}-key`,
        titleKey: "simulation.triple_des.key.title",
        descKey: "simulation.triple_des.key.desc",
        phase: "key",
        view: { kind: "tdes-key", block: blockHex, key: keyHex, k1, k2, k3 }
      },
      {
        id: `${id9}-pass1`,
        titleKey: "simulation.triple_des.pass1.title",
        descKey: "simulation.triple_des.pass1.desc",
        descArgs: { op: stage1?.stage ?? "E(K1)" },
        phase: "transform",
        view: { kind: "tdes-pass", stage: stage1, index: 1 }
      },
      {
        id: `${id9}-pass2`,
        titleKey: "simulation.triple_des.pass2.title",
        descKey: "simulation.triple_des.pass2.desc",
        descArgs: { op: stage2?.stage ?? "D(K2)" },
        phase: "transform",
        view: { kind: "tdes-pass", stage: stage2, index: 2 }
      },
      {
        id: `${id9}-pass3`,
        titleKey: "simulation.triple_des.pass3.title",
        descKey: "simulation.triple_des.pass3.desc",
        descArgs: { op: stage3?.stage ?? "E(K3)" },
        phase: "transform",
        view: { kind: "tdes-pass", stage: stage3, index: 3 }
      },
      {
        id: `${id9}-formula`,
        titleKey: "simulation.triple_des.formula.title",
        descKey: "simulation.triple_des.formula.desc",
        phase: "internal",
        view: { kind: "tdes-formula", formula, decrypt }
      },
      {
        id: `${id9}-result`,
        titleKey: decrypt ? "simulation.triple_des.result.dTitle" : "simulation.triple_des.result.title",
        descKey: "simulation.triple_des.result.desc",
        phase: "output",
        view: { kind: "tdes-result", hex: resultHex, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "tdes-key":
        return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "block", value: hexStrOf5(view.block) ?? "", tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "key (24 bytes)", value: hexStrOf5(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(FlowArrow, { op: "split" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "K1", value: hexStrOf5(view.k1) ?? "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "K2", value: hexStrOf5(view.k2) ?? "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "K3", value: hexStrOf5(view.k3) ?? "", tone: "key" })
        ] });
      case "tdes-pass": {
        const stage = view.stage;
        if (!stage) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "operation", value: stage.stage, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "key", value: stage.key, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "input", value: stage.input, tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "output", value: stage.output, tone: "output", big: true })
        ] });
      }
      case "tdes-formula":
        return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: "EDE chain", value: hexStrOf5(view.formula) ?? "", tone: view.decrypt ? "input" : "output", big: true }) });
      case "tdes-result":
        return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DataBlock, { label: view.decrypt ? "plaintext" : "ciphertext", value: hexStrOf5(view.hex) ?? "", tone: "output", big: true }) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/aes.tsx
var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
var id10 = "aes";
var hx2 = (v) => v.toString(16).padStart(2, "0");
var SBOX = [
  99,
  124,
  119,
  123,
  242,
  107,
  111,
  197,
  48,
  1,
  103,
  43,
  254,
  215,
  171,
  118,
  202,
  130,
  201,
  125,
  250,
  89,
  71,
  240,
  173,
  212,
  162,
  175,
  156,
  164,
  114,
  192,
  183,
  253,
  147,
  38,
  54,
  63,
  247,
  204,
  52,
  165,
  229,
  241,
  113,
  216,
  49,
  21,
  4,
  199,
  35,
  195,
  24,
  150,
  5,
  154,
  7,
  18,
  128,
  226,
  235,
  39,
  178,
  117,
  9,
  131,
  44,
  26,
  27,
  110,
  90,
  160,
  82,
  59,
  214,
  179,
  41,
  227,
  47,
  132,
  83,
  209,
  0,
  237,
  32,
  252,
  177,
  91,
  106,
  203,
  190,
  57,
  74,
  76,
  88,
  207,
  208,
  239,
  170,
  251,
  67,
  77,
  51,
  133,
  69,
  249,
  2,
  127,
  80,
  60,
  159,
  168,
  81,
  163,
  64,
  143,
  146,
  157,
  56,
  245,
  188,
  182,
  218,
  33,
  16,
  255,
  243,
  210,
  205,
  12,
  19,
  236,
  95,
  151,
  68,
  23,
  196,
  167,
  126,
  61,
  100,
  93,
  25,
  115,
  96,
  129,
  79,
  220,
  34,
  42,
  144,
  136,
  70,
  238,
  184,
  20,
  222,
  94,
  11,
  219,
  224,
  50,
  58,
  10,
  73,
  6,
  36,
  92,
  194,
  211,
  172,
  98,
  145,
  149,
  228,
  121,
  231,
  200,
  55,
  109,
  141,
  213,
  78,
  169,
  108,
  86,
  244,
  234,
  101,
  122,
  174,
  8,
  186,
  120,
  37,
  46,
  28,
  166,
  180,
  198,
  232,
  221,
  116,
  31,
  75,
  189,
  139,
  138,
  112,
  62,
  181,
  102,
  72,
  3,
  246,
  14,
  97,
  53,
  87,
  185,
  134,
  193,
  29,
  158,
  225,
  248,
  152,
  17,
  105,
  217,
  142,
  148,
  155,
  30,
  135,
  233,
  206,
  85,
  40,
  223,
  140,
  161,
  137,
  13,
  191,
  230,
  66,
  104,
  65,
  153,
  45,
  15,
  176,
  84,
  187,
  22
];
var INV_SBOX = (() => {
  const s = new Array(256);
  for (let i = 0; i < 256; i++) s[SBOX[i]] = i;
  return s;
})();
var RCON = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154];
var ROUNDS = { 16: 10, 24: 12, 32: 14 };
var xtime = (a) => {
  let v = a << 1;
  if (v & 256) v ^= 283;
  return v & 255;
};
var gfMul = (a, b) => {
  let r = 0;
  let x = a;
  let y = b;
  for (let i = 0; i < 8; i++) {
    if (y & 1) r ^= x;
    y >>= 1;
    x = xtime(x);
  }
  return r & 255;
};
var clone4 = (s) => s.map((row) => row.slice());
var stateFromBlock = (block) => Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_2, c) => block[r + 4 * c]));
var stateToBytes = (s) => {
  const out = new Uint8Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) out[c * 4 + r] = s[r][c];
  return out;
};
var addRoundKey = (s, rk) => {
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) s[r][c] ^= rk[c][r];
  return s;
};
var subBytes = (s) => {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s[r][c] = SBOX[s[r][c]];
  return s;
};
var invSubBytes = (s) => {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s[r][c] = INV_SBOX[s[r][c]];
  return s;
};
var shiftRows = (s) => {
  for (let r = 1; r < 4; r++) s[r] = s[r].slice(r).concat(s[r].slice(0, r));
  return s;
};
var invShiftRows = (s) => {
  for (let r = 1; r < 4; r++) s[r] = s[r].slice(4 - r).concat(s[r].slice(0, 4 - r));
  return s;
};
var mixColumns = (s) => {
  for (let c = 0; c < 4; c++) {
    const a0 = s[0][c], a1 = s[1][c], a2 = s[2][c], a3 = s[3][c];
    s[0][c] = xtime(a0) ^ gfMul(a1, 3) ^ a2 ^ a3;
    s[1][c] = xtime(a1) ^ gfMul(a2, 3) ^ a3 ^ a0;
    s[2][c] = xtime(a2) ^ gfMul(a3, 3) ^ a0 ^ a1;
    s[3][c] = xtime(a3) ^ gfMul(a0, 3) ^ a1 ^ a2;
  }
  return s;
};
var invMixColumns = (s) => {
  for (let c = 0; c < 4; c++) {
    const a0 = s[0][c], a1 = s[1][c], a2 = s[2][c], a3 = s[3][c];
    s[0][c] = gfMul(a0, 14) ^ gfMul(a1, 11) ^ gfMul(a2, 13) ^ gfMul(a3, 9);
    s[1][c] = gfMul(a0, 9) ^ gfMul(a1, 14) ^ gfMul(a2, 11) ^ gfMul(a3, 13);
    s[2][c] = gfMul(a0, 13) ^ gfMul(a1, 9) ^ gfMul(a2, 14) ^ gfMul(a3, 11);
    s[3][c] = gfMul(a0, 11) ^ gfMul(a1, 13) ^ gfMul(a2, 9) ^ gfMul(a3, 14);
  }
  return s;
};
var expandRoundKeys = (key) => {
  const nk = key.length / 4;
  const nr = ROUNDS[key.length];
  const expanded = [];
  for (let i = 0; i < nk; i++) expanded.push([key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]]);
  for (let i = nk; i < 4 * (nr + 1); i++) {
    const temp = expanded[i - 1].slice();
    if (i % nk === 0) {
      const rotated = [temp[1], temp[2], temp[3], temp[0]].map((b) => SBOX[b]);
      rotated[0] ^= RCON[i / nk - 1];
      const prev = expanded[i - nk];
      expanded.push([rotated[0] ^ prev[0], rotated[1] ^ prev[1], rotated[2] ^ prev[2], rotated[3] ^ prev[3]]);
    } else if (nk > 6 && i % nk === 4) {
      const sb = temp.map((b) => SBOX[b]);
      const prev = expanded[i - nk];
      expanded.push([sb[0] ^ prev[0], sb[1] ^ prev[1], sb[2] ^ prev[2], sb[3] ^ prev[3]]);
    } else {
      const prev = expanded[i - nk];
      expanded.push([temp[0] ^ prev[0], temp[1] ^ prev[1], temp[2] ^ prev[2], temp[3] ^ prev[3]]);
    }
  }
  const roundKeys = [];
  for (let i = 0; i < 4 * (nr + 1); i += 4) roundKeys.push(expanded.slice(i, i + 4));
  return { nr, nk, roundKeys };
};
var roundKeyHex = (rk) => bytesToHex(new Uint8Array(rk.flat()));
function aesLive(blockHex, keyHex, decrypt) {
  const block = hexToBytes(blockHex);
  const key = hexToBytes(keyHex);
  if (block.length !== 16) throw new Error("aes block must be 16 bytes");
  const { nr, nk, roundKeys } = expandRoundKeys(key);
  const state = stateFromBlock(block);
  const rkHex = roundKeys.map(roundKeyHex);
  if (!decrypt) {
    addRoundKey(state, roundKeys[0]);
    const initial2 = state.map((row) => row.map(hx2));
    const rounds2 = [];
    for (let rnd = 1; rnd < nr; rnd++) {
      subBytes(state);
      shiftRows(state);
      mixColumns(state);
      addRoundKey(state, roundKeys[rnd]);
      rounds2.push(state.map((row) => row.map(hx2)));
    }
    subBytes(state);
    shiftRows(state);
    addRoundKey(state, roundKeys[nr]);
    return {
      nk,
      nr,
      roundKeysHex: rkHex,
      initial: initial2,
      rounds: rounds2,
      final: state.map((row) => row.map(hx2)),
      resultHex: bytesToHex(stateToBytes(state))
    };
  }
  addRoundKey(state, roundKeys[nr]);
  const initial = state.map((row) => row.map(hx2));
  const rounds = [];
  for (let rnd = nr - 1; rnd >= 1; rnd--) {
    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, roundKeys[rnd]);
    invMixColumns(state);
    rounds.push(state.map((row) => row.map(hx2)));
  }
  invShiftRows(state);
  invSubBytes(state);
  addRoundKey(state, roundKeys[0]);
  return {
    nk,
    nr,
    roundKeysHex: rkHex,
    initial,
    rounds,
    final: state.map((row) => row.map(hx2)),
    resultHex: bytesToHex(stateToBytes(state))
  };
}
function aesRound1Detail(startHex, roundKeyHexStr, decrypt) {
  const s = startHex.map((row) => row.map((c) => parseInt(c, 16)));
  const rk = stateFromBlock(hexToBytes(roundKeyHexStr));
  if (!decrypt) {
    const m12 = subBytes(clone4(s));
    const m22 = shiftRows(clone4(m12));
    const m32 = mixColumns(clone4(m22));
    const m42 = addRoundKey(clone4(m32), rk);
    return {
      a: m12.map((r) => r.map(hx2)),
      b: m22.map((r) => r.map(hx2)),
      c: m32.map((r) => r.map(hx2)),
      d: m42.map((r) => r.map(hx2))
    };
  }
  const m1 = invShiftRows(clone4(s));
  const m2 = invSubBytes(clone4(m1));
  const m3 = addRoundKey(clone4(m2), rk);
  const m4 = invMixColumns(clone4(m3));
  return {
    a: m1.map((r) => r.map(hx2)),
    b: m2.map((r) => r.map(hx2)),
    c: m3.map((r) => r.map(hx2)),
    d: m4.map((r) => r.map(hx2))
  };
}
var isHexMatrix = (v) => Array.isArray(v) && v.every((r) => Array.isArray(r) && r.every((c) => typeof c === "string"));
var hexStrOf = (v) => typeof v === "string" ? v : void 0;
var changedCells = (before, after) => {
  const out = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (before[r]?.[c] !== after[r]?.[c]) out.push([r, c]);
  return out;
};
var sboxGrid = Array.from(
  { length: 16 },
  (_, r) => Array.from({ length: 16 }, (_2, c) => hx2(SBOX[r * 16 + c]))
);
var flatKeysOf = (rows) => rows.map((k) => hexStrOf(k.hex) ?? "").filter(Boolean);
var aesEngine = {
  id: id10,
  nameKey: "simulation.aes.name",
  educationalKey: "simulation.aes.educational",
  demoInputs: {
    block: "00112233445566778899AABBCCDDEEFF",
    key: "000102030405060708090A0B0C0D0E0F"
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const block = String(ctx.inputs.block ?? "00112233445566778899AABBCCDDEEFF").replace(/\s/g, "");
    const key = String(ctx.inputs.key ?? "000102030405060708090A0B0C0D0E0F").replace(/\s/g, "");
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    let live = null;
    try {
      live = aesLive(block, key, decrypt);
    } catch {
      live = null;
    }
    const boundStates = hasResult && Array.isArray(extra?.round_states) ? extra?.round_states : void 0;
    const boundKeys = hasResult && Array.isArray(extra?.round_keys) ? extra?.round_keys : void 0;
    const matrixAt = (i) => {
      const box = boundStates && i < boundStates.length ? boundStates[i] : void 0;
      const m = box && isHexMatrix(box.state_matrix) ? box.state_matrix : void 0;
      if (m) return m;
      if (!live) return void 0;
      if (i === 0) return live.initial;
      if (i === live.nr) return live.final;
      return live.rounds[i - 1];
    };
    const nr = live ? live.nr : boundStates ? boundStates.length - 1 : 10;
    const nk = live ? live.nk : Math.floor(key.length / 8);
    const initial = matrixAt(0);
    const finalState = matrixAt(nr);
    let blockMatrix = initial;
    try {
      blockMatrix = stateFromBlock(hexToBytes(block)).map((row) => row.map(hx2));
    } catch {
      blockMatrix = initial;
    }
    const roundKeysHex = boundKeys ? flatKeysOf(boundKeys) : live?.roundKeysHex ?? [];
    const midStates = [];
    if (boundStates) {
      for (let i = 1; i <= nr - 1; i++) {
        const m = boundStates[i] && isHexMatrix(boundStates[i].state_matrix) ? boundStates[i].state_matrix : void 0;
        if (m) midStates.push(m);
      }
    } else if (live) {
      midStates.push(...live.rounds);
    }
    const firstRoundIdx = decrypt ? Math.max(0, nr - 1) : 1;
    const firstKeyHex = roundKeysHex[firstRoundIdx] ?? "";
    const firstKeyMatrix = firstKeyHex.length === 32 ? stateFromBlock(hexToBytes(firstKeyHex)).map((r) => r.map(hx2)) : void 0;
    const detail = initial && firstKeyHex.length === 32 ? aesRound1Detail(initial, firstKeyHex, decrypt) : void 0;
    const resultHex = hasResult ? hexStrOf(ctx.result?.result)?.replace(/\s/g, "") ?? live?.resultHex ?? "" : live?.resultHex ?? "";
    return [
      {
        id: `${id10}-input`,
        titleKey: "simulation.aes.input.title",
        descKey: "simulation.aes.input.desc",
        descArgs: { nk, nr, bits: nk * 32 },
        phase: "input",
        view: { kind: "aes-input", block, key, state: blockMatrix, nk, nr }
      },
      {
        id: `${id10}-key`,
        titleKey: "simulation.aes.key.title",
        descKey: "simulation.aes.key.desc",
        descArgs: { nk, nr },
        phase: "key",
        view: { kind: "aes-key", roundKeys: roundKeysHex, nk, nr }
      },
      {
        id: `${id10}-addkey`,
        titleKey: "simulation.aes.addkey.title",
        descKey: "simulation.aes.addkey.desc",
        descArgs: { nr },
        phase: "transform",
        view: {
          kind: "aes-addkey",
          before: blockMatrix,
          after: initial,
          roundKey: firstKeyMatrix,
          highlight: blockMatrix && initial ? changedCells(blockMatrix, initial) : []
        }
      },
      {
        id: `${id10}-sbox`,
        titleKey: decrypt ? "simulation.aes.sbox.dTitle" : "simulation.aes.sbox.title",
        descKey: decrypt ? "simulation.aes.sbox.dDesc" : "simulation.aes.sbox.desc",
        phase: "transform",
        view: { kind: "aes-sbox", byteIn: initial, byteOut: detail?.a, decrypt }
      },
      {
        id: `${id10}-round`,
        titleKey: decrypt ? "simulation.aes.round.dTitle" : "simulation.aes.round.title",
        descKey: decrypt ? "simulation.aes.round.dDesc" : "simulation.aes.round.desc",
        descArgs: { nr },
        phase: "transform",
        view: { kind: "aes-round", a: detail?.a, b: detail?.b, c: detail?.c, d: detail?.d, decrypt, roundKey: firstKeyHex }
      },
      {
        id: `${id10}-rounds`,
        titleKey: "simulation.aes.rounds.title",
        descKey: "simulation.aes.rounds.desc",
        descArgs: { count: midStates.length, nr },
        phase: "internal",
        view: { kind: "aes-rounds", rounds: midStates }
      },
      {
        id: `${id10}-final`,
        titleKey: decrypt ? "simulation.aes.final.dTitle" : "simulation.aes.final.title",
        descKey: decrypt ? "simulation.aes.final.dDesc" : "simulation.aes.final.desc",
        descArgs: { nr },
        phase: "output",
        view: { kind: "aes-final", state: finalState, hex: resultHex, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "aes-input":
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DataBlock, { label: "block", value: hexStrOf(view.block) ?? "", tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DataBlock, { label: "key", value: hexStrOf(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: view.state, tone: "input" })
        ] });
      case "aes-key": {
        const keys = view.roundKeys;
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DataBlock, { label: "schedule", value: `Nk = ${Number(view.nk)} words, ${Number(view.nr) + 1} round keys`, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, {}),
          keys.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DataBlock, { label: `K${i}`, value: k, tone: i % 2 === 0 ? "key" : "internal" }, i))
        ] });
      }
      case "aes-addkey": {
        const before = view.before;
        const after = view.after;
        const rk = view.roundKey;
        if (!before || !after) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: before, tone: "input" }),
          rk && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, { op: "XOR" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: rk, tone: "key" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, { op: "AddRoundKey" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: after, highlight: view.highlight, tone: "transform" })
        ] });
      }
      case "aes-sbox": {
        const byteIn = view.byteIn;
        const byteOut = view.byteOut;
        if (!byteIn || !byteOut) return null;
        const target = new Set(byteIn.flat());
        const hl = [];
        sboxGrid.forEach(
          (row, r) => row.forEach((cell, c) => {
            if (target.has(cell)) hl.push([r, c]);
          })
        );
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: byteIn, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, { op: view.decrypt ? "InvSubBytes" : "SubBytes" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: sboxGrid, highlight: hl.slice(0, 64), tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: byteOut, tone: "transform" })
        ] });
      }
      case "aes-round": {
        const a = view.a;
        const b = view.b;
        const c = view.c;
        const d = view.d;
        if (!a || !b || !c || !d) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: a, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, { op: view.decrypt ? "InvShiftRows" : "ShiftRows" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: b, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, { op: view.decrypt ? "InvMixColumns" : "MixColumns" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: c, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, { op: "AddRoundKey" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: d, tone: "output" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DataBlock, { label: "round key", value: hexStrOf(view.roundKey) ?? "", tone: "key" })
        ] });
      }
      case "aes-rounds": {
        const rounds = view.rounds;
        if (!rounds.length) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "lab-stage-view", children: rounds.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DataBlock, { label: `round ${i + 1}`, value: "", tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: m, tone: "internal" })
        ] }, i)) });
      }
      case "aes-final": {
        const state = view.state;
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "lab-stage-view", children: [
          state && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MatrixGrid, { matrix: state, tone: "output" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DataBlock, { label: view.decrypt ? "plaintext" : "ciphertext", value: hexStrOf(view.hex) ?? "", tone: "output", big: true })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/blowfish.tsx
var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
var id11 = "blowfish";
var hexStrOf6 = (v) => typeof v === "string" ? v : void 0;
var w8b = (v) => (v >>> 0).toString(16).padStart(8, "0");
var INIT_P = [
  608135816,
  2242054355,
  320440878,
  57701188,
  2752067618,
  698298832,
  137296536,
  3964562569,
  1160258022,
  953160567,
  3193202383,
  887688300,
  3232508343,
  3380367581,
  1065670069,
  3041331479,
  2450970073,
  2306472731
];
var bigEndianWord = (bytes, offset) => ((bytes[offset] ?? 0) << 24 | (bytes[offset + 1] ?? 0) << 16 | (bytes[offset + 2] ?? 0) << 8 | (bytes[offset + 3] ?? 0)) >>> 0;
var pXorKey = (keyHex) => {
  const key = hexToBytes(keyHex);
  const out = [];
  let j = 0;
  for (let i = 0; i < 18; i++) {
    let word = 0;
    for (let k = 0; k < 4; k++) {
      word = (word << 8 | (key[j] ?? 0)) >>> 0;
      j = (j + 1) % Math.max(1, key.length);
    }
    out.push((INIT_P[i] ?? 0) ^ word);
  }
  return out;
};
function blowfishLive(blockHex, keyHex) {
  const block = hexToBytes(blockHex);
  const L = bigEndianWord(block, 0);
  const R = bigEndianWord(block, 4);
  return { lHex: w8b(L), rHex: w8b(R), pXor: pXorKey(keyHex).map(w8b) };
}
var wordArr = (v) => Array.isArray(v) && v.every((x) => typeof x === "string") ? v : void 0;
var roundStatesOf6 = (rows) => rows.map((r) => ({ round: Number(r.round) || 0, L: hexStrOf6(r.L) ?? "", R: hexStrOf6(r.R) ?? "" })).filter((r) => r.L);
var blowfishEngine = {
  id: id11,
  nameKey: "simulation.blowfish.name",
  educationalKey: "simulation.blowfish.educational",
  demoInputs: {
    block: "0123456789ABCDEF",
    key: "0123456789ABCDEFFEDCBA9876543210"
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const blockHex = String(ctx.inputs.block ?? "0123456789ABCDEF").replace(/\s/g, "");
    const keyHex = String(ctx.inputs.key ?? "0123456789ABCDEFFEDCBA9876543210").replace(/\s/g, "");
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    let live = null;
    try {
      live = blowfishLive(blockHex, keyHex);
    } catch {
      live = null;
    }
    const pArray = hasResult && wordArr(extra?.p_array) ? wordArr(extra?.p_array) : void 0;
    const sHeads = hasResult && Array.isArray(extra?.s_box_heads) ? (extra?.s_box_heads).map(wordArr).filter((w) => !!w) : void 0;
    const boundStates = hasResult && Array.isArray(extra?.round_states) ? roundStatesOf6(extra?.round_states) : void 0;
    const resultHex = hasResult ? hexStrOf6(ctx.result?.result)?.replace(/\s/g, "") ?? "" : "";
    const pxor = live?.pXor ?? pArray ?? [];
    const L = live?.lHex ?? "";
    const byteSplit = L ? [L.slice(0, 2), L.slice(2, 4), L.slice(4, 6), L.slice(6, 8)] : ["", "", "", ""];
    return [
      {
        id: `${id11}-input`,
        titleKey: "simulation.blowfish.input.title",
        descKey: "simulation.blowfish.input.desc",
        phase: "input",
        view: { kind: "blowfish-input", block: blockHex, key: keyHex, L: live?.lHex ?? "", R: live?.rHex ?? "" }
      },
      {
        id: `${id11}-pi`,
        titleKey: "simulation.blowfish.pi.title",
        descKey: "simulation.blowfish.pi.desc",
        phase: "key",
        view: { kind: "blowfish-pi", p: INIT_P.map(w8b) }
      },
      {
        id: `${id11}-ksched`,
        titleKey: "simulation.blowfish.ksched.title",
        descKey: "simulation.blowfish.ksched.desc",
        phase: "key",
        view: { kind: "blowfish-ksched", pXor: pxor, finalP: pArray ?? [] }
      },
      {
        id: `${id11}-f`,
        titleKey: "simulation.blowfish.f.title",
        descKey: "simulation.blowfish.f.desc",
        phase: "transform",
        view: { kind: "blowfish-f", L: live?.lHex ?? "", bytes: byteSplit, sHeads }
      },
      {
        id: `${id11}-rounds`,
        titleKey: "simulation.blowfish.rounds.title",
        descKey: "simulation.blowfish.rounds.desc",
        descArgs: { rounds: 16 },
        phase: "internal",
        view: { kind: "blowfish-rounds", states: boundStates ?? [], L: live?.lHex ?? "", R: live?.rHex ?? "" }
      },
      {
        id: `${id11}-result`,
        titleKey: decrypt ? "simulation.blowfish.result.dTitle" : "simulation.blowfish.result.title",
        descKey: "simulation.blowfish.result.desc",
        phase: "output",
        view: { kind: "blowfish-result", hex: resultHex, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "blowfish-input":
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "block", value: hexStrOf6(view.block) ?? "", tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "key", value: hexStrOf6(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FlowArrow, { op: "big-endian split" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "L", value: hexStrOf6(view.L) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "R", value: hexStrOf6(view.R) ?? "", tone: "internal" })
        ] });
      case "blowfish-pi": {
        const p = view.p;
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "P-array (from first 148 hex digits of \u03C0)", value: `18 words`, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FlowArrow, {}),
          p.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: `P[${i}]`, value: w, tone: i % 2 === 0 ? "key" : "internal" }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "S-boxes", value: "S0..S3, 4 \xD7 256 entries from \u03C0", tone: "muted" })
        ] });
      }
      case "blowfish-ksched": {
        const pXor = view.pXor;
        const finalP = view.finalP;
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FlowArrow, { op: "P[i] \u2295 key-word (key bytes cycled)" }),
          pXor.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: `P'[${i}]`, value: w, tone: "transform" }, i)),
          finalP.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FlowArrow, { op: "re-encrypt zero block" }),
            finalP.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: `P final[${i}]`, value: w, tone: "output" }, i))
          ] })
        ] });
      }
      case "blowfish-f": {
        const bytes = view.bytes;
        const sHeads = view.sHeads;
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "F(R) over L", value: hexStrOf6(view.L) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FlowArrow, { op: "split byte a b c d" }),
          bytes.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: `byte ${i}`, value: b, tone: "internal" }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "F(x)", value: "F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]", tone: "transform", big: true }),
          sHeads && sHeads.map((head, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: `S${i} head`, value: head.join(" "), tone: "key" }, i))
        ] });
      }
      case "blowfish-rounds": {
        const states = view.states;
        if (states.length > 0) {
          return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "lab-stage-view", children: states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: `R${s.round}`, value: `L ${s.L}   R ${s.R}`, tone: s.round % 2 === 0 ? "internal" : "transform" }, s.round)) });
        }
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "L", value: hexStrOf6(view.L) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: "R", value: hexStrOf6(view.R) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FlowArrow, { op: "16 \xD7 (R ^= F(L) \u2295 P[i]; swap)" })
        ] });
      }
      case "blowfish-result":
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DataBlock, { label: view.decrypt ? "plaintext" : "ciphertext", value: hexStrOf6(view.hex) ?? "", tone: "output", big: true }) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/twofish.tsx
var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
var id12 = "twofish";
var w8c = (v) => (v >>> 0).toString(16).padStart(8, "0");
var hexStrOf7 = (v) => typeof v === "string" ? v : void 0;
var leWord = (bytes, offset) => ((bytes[offset] ?? 0) | (bytes[offset + 1] ?? 0) << 8 | (bytes[offset + 2] ?? 0) << 16 | (bytes[offset + 3] ?? 0) << 24) >>> 0;
function twofishLive(blockHex) {
  const block = hexToBytes(blockHex);
  return {
    m0: w8c(leWord(block, 0)),
    m1: w8c(leWord(block, 4)),
    m2: w8c(leWord(block, 8)),
    m3: w8c(leWord(block, 12))
  };
}
var wordArr7 = (v) => Array.isArray(v) && v.every((x) => typeof x === "string") ? v : void 0;
var roundStatesOf7 = (rows) => rows.map((r) => ({
  round: Number(r.round) || 0,
  a: hexStrOf7(r.a) ?? "",
  b: hexStrOf7(r.b) ?? "",
  c: hexStrOf7(r.c) ?? "",
  d: hexStrOf7(r.d) ?? "",
  gA: hexStrOf7(r.g_a),
  gB: hexStrOf7(r.g_b),
  gC: hexStrOf7(r.g_c),
  gD: hexStrOf7(r.g_d)
}));
var twofishEngine = {
  id: id12,
  nameKey: "simulation.twofish.name",
  educationalKey: "simulation.twofish.educational",
  demoInputs: {
    block: "00000000000000000000000000000000",
    key: "0123456789ABCDEFFEDCBA9876543210"
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const blockHex = String(ctx.inputs.block ?? "00000000000000000000000000000000").replace(/\s/g, "");
    const keyHex = String(ctx.inputs.key ?? "0123456789ABCDEFFEDCBA9876543210").replace(/\s/g, "");
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    let live = null;
    try {
      live = twofishLive(blockHex);
    } catch {
      live = null;
    }
    const whitening = hasResult && wordArr7(extra?.whitening_keys) ? wordArr7(extra?.whitening_keys) : void 0;
    const subkeys = hasResult && wordArr7(extra?.round_subkeys) ? wordArr7(extra?.round_subkeys) : void 0;
    const boundStates = hasResult && Array.isArray(extra?.round_states) ? roundStatesOf7(extra?.round_states) : void 0;
    const sboxes = hasResult && Array.isArray(extra?.sboxes) ? (extra?.sboxes).map(wordArr7).filter((w) => !!w) : void 0;
    const resultHex = hasResult ? hexStrOf7(ctx.result?.result)?.replace(/\s/g, "") ?? "" : "";
    const keySize = hasResult && typeof extra?.key_size === "number" ? extra.key_size : keyHex.length / 2 * 8;
    const whitenKeys = decrypt ? (whitening ?? []).slice(4, 8) : (whitening ?? []).slice(0, 4);
    return [
      {
        id: `${id12}-input`,
        titleKey: "simulation.twofish.input.title",
        descKey: "simulation.twofish.input.desc",
        descArgs: { bits: keySize },
        phase: "input",
        view: { kind: "twofish-input", block: blockHex, key: keyHex, m0: live?.m0 ?? "", m1: live?.m1 ?? "", m2: live?.m2 ?? "", m3: live?.m3 ?? "" }
      },
      {
        id: `${id12}-key`,
        titleKey: "simulation.twofish.key.title",
        descKey: "simulation.twofish.key.desc",
        descArgs: { bits: keySize },
        phase: "key",
        view: { kind: "twofish-key", whitening: whitening ?? [], subkeys: subkeys ?? [] }
      },
      {
        id: `${id12}-sboxes`,
        titleKey: "simulation.twofish.sboxes.title",
        descKey: "simulation.twofish.sboxes.desc",
        phase: "key",
        view: { kind: "twofish-sboxes", sboxes: sboxes ?? [] }
      },
      {
        id: `${id12}-whiten`,
        titleKey: "simulation.twofish.whiten.title",
        descKey: "simulation.twofish.whiten.desc",
        phase: "transform",
        view: { kind: "twofish-whiten", m0: live?.m0 ?? "", m1: live?.m1 ?? "", m2: live?.m2 ?? "", m3: live?.m3 ?? "", keys: whitenKeys, decrypt }
      },
      {
        id: `${id12}-rounds`,
        titleKey: "simulation.twofish.rounds.title",
        descKey: "simulation.twofish.rounds.desc",
        descArgs: { rounds: 16 },
        phase: "internal",
        view: { kind: "twofish-rounds", states: boundStates ?? [] }
      },
      {
        id: `${id12}-result`,
        titleKey: decrypt ? "simulation.twofish.result.dTitle" : "simulation.twofish.result.title",
        descKey: "simulation.twofish.result.desc",
        phase: "output",
        view: { kind: "twofish-result", hex: resultHex, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "twofish-input":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "block", value: hexStrOf7(view.block) ?? "", tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "key", value: hexStrOf7(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(FlowArrow, { op: "little-endian words" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "m0", value: hexStrOf7(view.m0) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "m1", value: hexStrOf7(view.m1) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "m2", value: hexStrOf7(view.m2) ?? "", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "m3", value: hexStrOf7(view.m3) ?? "", tone: "internal" })
        ] });
      case "twofish-key": {
        const whitening = view.whitening;
        const subkeys = view.subkeys;
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(FlowArrow, { op: "RS (12,8) code + h() via q0/q1" }),
          whitening.length > 0 ? whitening.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: `w[${i}]`, value: w, tone: i % 2 === 0 ? "key" : "internal" }, i)) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "whitening", value: "w[0..7] \u2014 key schedule", tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(FlowArrow, {}),
          Array.from({ length: 10 }, (_, r) => {
            const keys = subkeys.slice(4 * r, 4 * r + 4);
            return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              DataBlock,
              {
                label: `k round ${r + 1}`,
                value: keys.length > 0 ? r === 9 ? `${keys.join(" ")} \u2026` : keys.join(" ") : "k[0..39]",
                tone: r % 2 === 0 ? "key" : "internal"
              },
              r
            );
          })
        ] });
      }
      case "twofish-sboxes": {
        const sboxes = view.sboxes;
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(FlowArrow, { op: "keyed S-vector \u2192 q0/q1 \u2192 MDS (GF(2^8), 0x169)" }),
          sboxes.length > 0 ? sboxes.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: `S${i} heads`, value: row.slice(0, 8).join(" "), tone: "key" }, i)) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "S-boxes", value: "S0..S3: 4 \xD7 256 MDS-combined entries", tone: "muted" })
        ] });
      }
      case "twofish-whiten": {
        const keys = view.keys;
        const words = [hexStrOf7(view.m0) ?? "", hexStrOf7(view.m1) ?? "", hexStrOf7(view.m2) ?? "", hexStrOf7(view.m3) ?? ""];
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "lab-stage-view", children: [
          words.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: `m${i}`, value: w, tone: "internal" }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(FlowArrow, { op: view.decrypt ? "XOR w[4..7]" : "XOR w[0..3]" }),
          keys.length === 4 ? keys.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: `w${view.decrypt ? 4 + i : i}`, value: k, tone: "key" }, i)) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "whitening", value: "a = m0 \u2295 w0, b = m1 \u2295 w1, c = m2 \u2295 w2, d = m3 \u2295 w3", tone: "muted" })
        ] });
      }
      case "twofish-rounds": {
        const states = view.states;
        if (states.length > 0) {
          return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "lab-stage-view", children: states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            DataBlock,
            {
              label: `R${s.round}`,
              value: `a ${s.a}  b ${s.b}  c ${s.c}  d ${s.d}${s.gA ? `  | g(a) ${s.gA} g(b) ${s.gB}` : ""}${s.gC ? `  | g(c) ${s.gC} g(d) ${s.gD}` : ""}`,
              tone: s.round % 2 === 0 ? "internal" : "transform"
            },
            s.round
          )) });
        }
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(FlowArrow, { op: "16 \xD7 (g() keyed S-boxes + MDS \u2192 PHT \u2192 1-bit rotations)" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: "g(x)", value: "g0(x) = S0[x0] \u2295 S1[x1] \u2295 S2[x2] \u2295 S3[x3]", tone: "muted" })
        ] });
      }
      case "twofish-result":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DataBlock, { label: view.decrypt ? "plaintext" : "ciphertext", value: hexStrOf7(view.hex) ?? "", tone: "output", big: true }) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/chacha20.tsx
var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
var id13 = "chacha20";
var w8 = (v) => (v >>> 0).toString(16).padStart(8, "0");
var rotl3 = (v, s) => (v << s | v >>> 32 - s) >>> 0;
var addMod = (a, b) => a + b >>> 0;
var quarterRound = (s, a, b, c, d) => {
  s[a] = addMod(s[a], s[b]);
  s[d] = rotl3(s[d] ^ s[a], 16);
  s[c] = addMod(s[c], s[d]);
  s[b] = rotl3(s[b] ^ s[c], 12);
  s[a] = addMod(s[a], s[b]);
  s[d] = rotl3(s[d] ^ s[a], 8);
  s[c] = addMod(s[c], s[d]);
  s[b] = rotl3(s[b] ^ s[c], 7);
};
var COLUMNS = [
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15]
];
var DIAGONALS = [
  [0, 5, 10, 15],
  [1, 6, 11, 12],
  [2, 7, 8, 13],
  [3, 4, 9, 14]
];
var CONSTANT_WORDS = [1634760805, 857760878, 2036477234, 1797285236];
var leWords = (bytes) => {
  const out = [];
  for (let i = 0; i < bytes.length; i += 4) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    const b3 = bytes[i + 3] ?? 0;
    out.push((b0 | b1 << 8 | b2 << 16 | b3 << 24) >>> 0);
  }
  return out;
};
var wordsToBytes = (ws) => {
  const out = new Uint8Array(ws.length * 4);
  ws.forEach((w, i) => {
    out[4 * i] = w & 255;
    out[4 * i + 1] = w >>> 8 & 255;
    out[4 * i + 2] = w >>> 16 & 255;
    out[4 * i + 3] = w >>> 24 & 255;
  });
  return out;
};
var initialState = (keyHex, nonceHex, counter) => {
  const key = leWords(hexToBytes(keyHex));
  const nonce = leWords(hexToBytes(nonceHex));
  return CONSTANT_WORDS.concat(key).concat([counter >>> 0]).concat(nonce);
};
var chachaBlock = (keyHex, nonceHex, counter) => {
  const init = initialState(keyHex, nonceHex, counter);
  const working = init.slice();
  const doubleStates = [];
  for (let r = 0; r < 10; r++) {
    for (const q of COLUMNS) quarterRound(working, q[0], q[1], q[2], q[3]);
    for (const q of DIAGONALS) quarterRound(working, q[0], q[1], q[2], q[3]);
    doubleStates.push(working.slice());
  }
  const ks = init.map((w, i) => addMod(w, working[i]));
  return { init, working, ks, doubleStates };
};
var xorBytes = (a, b) => {
  const out = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = (a[i] ?? 0) ^ (b[i] ?? 0);
  return out;
};
function chachaLive(message, keyHex, nonceHex, counter, decrypt) {
  const dataBytes = decrypt ? hexToBytes(message.toLowerCase()) : strToBytes(message);
  const { init, working, ks, doubleStates } = chachaBlock(keyHex.toLowerCase(), nonceHex.toLowerCase(), counter);
  const ksBytes = wordsToBytes(ks);
  const cipherBytes = xorBytes(dataBytes, ksBytes.slice(0, dataBytes.length));
  const blocks = [];
  if (dataBytes.length > 0) {
    blocks.push({ block: 0, counter, keystream: bytesToHex(ksBytes) });
    for (let b = 1; b * 64 < dataBytes.length; b++) {
      const r = chachaBlock(keyHex.toLowerCase(), nonceHex.toLowerCase(), counter + b);
      blocks.push({ block: b, counter: counter + b, keystream: bytesToHex(wordsToBytes(r.ks)) });
    }
  }
  return {
    dataHex: bytesToHex(dataBytes),
    keyHex: keyHex.toLowerCase(),
    nonceHex: nonceHex.toLowerCase(),
    counter,
    initWords: init,
    finalWorking: working,
    afterDouble1: doubleStates[0] ?? working,
    ksWords: ks,
    firstKsHex: bytesToHex(ksBytes),
    resultHex: bytesToHex(cipherBytes),
    blocks
  };
}
var hexStrOf4 = (v) => typeof v === "string" ? v : void 0;
var wordList = (v) => Array.isArray(v) && v.every((x) => typeof x === "string") ? v : void 0;
var wordMatrix = (words) => Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_2, c) => words[r * 4 + c] ?? "--------"));
var chacha20Engine = {
  id: id13,
  nameKey: "simulation.chacha20.name",
  educationalKey: "simulation.chacha20.educational",
  demoInputs: {
    message: "Hello, cryptography!",
    key: "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F",
    nonce: "000000000000004A00000000",
    counter: 1
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const message = String(ctx.inputs.message ?? "Hello, cryptography!");
    const keyHex = String(ctx.inputs.key ?? "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F").replace(/\s/g, "");
    const nonceHex = String(ctx.inputs.nonce ?? "000000000000004A00000000").replace(/\s/g, "");
    const counter = Number(ctx.inputs.counter ?? 1) || 0;
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    let live = null;
    try {
      live = chachaLive(message, keyHex, nonceHex, counter, decrypt);
    } catch {
      live = null;
    }
    const initBound = hasResult && wordList(extra?.initial_state) ? wordList(extra?.initial_state) : void 0;
    const initWords = initBound ?? (live ? live.initWords.map(w8) : []);
    const initMatrix = initWords.length >= 16 ? wordMatrix(initWords) : void 0;
    const blocks = hasResult && Array.isArray(extra?.blocks) ? (extra?.blocks).map((b) => ({
      block: Number(b.block) || 0,
      counter: Number(b.counter) || 0,
      keystream: hexStrOf4(b.keystream) ?? ""
    })) : live?.blocks ?? [];
    const firstKsHex = (blocks[0]?.keystream ?? "") !== "" ? blocks[0]?.keystream ?? "" : live?.firstKsHex ?? "";
    const ksGridBound = firstKsHex.length >= 128 ? wordMatrix((firstKsHex.match(/.{8}/g) ?? []).slice(0, 16)) : void 0;
    let qrAfter = initMatrix;
    if (initMatrix && !initBound && live) {
      const s = live.initWords.slice();
      quarterRound(s, 0, 4, 8, 12);
      qrAfter = wordMatrix(s.map(w8));
    }
    const doubleAfter = live ? wordMatrix(live.afterDouble1.map(w8)) : void 0;
    const workingGrid = live ? wordMatrix(live.finalWorking.map(w8)) : void 0;
    const ksGrid = live ? wordMatrix(live.ksWords.map(w8)) : ksGridBound;
    const resultHex = hasResult ? hexStrOf4(ctx.result?.result) ?? live?.resultHex ?? "" : live?.resultHex ?? "";
    return [
      {
        id: `${id13}-input`,
        titleKey: "simulation.chacha20.input.title",
        descKey: "simulation.chacha20.input.desc",
        phase: "input",
        view: { kind: "chacha-input", message, key: keyHex.toLowerCase(), nonce: nonceHex.toLowerCase(), counter }
      },
      {
        id: `${id13}-state`,
        titleKey: "simulation.chacha20.state.title",
        descKey: "simulation.chacha20.state.desc",
        phase: "internal",
        view: { kind: "chacha-state", grid: initMatrix }
      },
      {
        id: `${id13}-quarter`,
        titleKey: "simulation.chacha20.quarter.title",
        descKey: "simulation.chacha20.quarter.desc",
        phase: "transform",
        view: { kind: "chacha-quarter", grid: initMatrix, after: qrAfter }
      },
      {
        id: `${id13}-double`,
        titleKey: "simulation.chacha20.double.title",
        descKey: "simulation.chacha20.double.desc",
        phase: "transform",
        view: { kind: "chacha-double", grid: initMatrix, after: doubleAfter }
      },
      {
        id: `${id13}-rounds`,
        titleKey: "simulation.chacha20.rounds.title",
        descKey: "simulation.chacha20.rounds.desc",
        phase: "internal",
        view: { kind: "chacha-rounds", working: workingGrid }
      },
      {
        id: `${id13}-keystream`,
        titleKey: "simulation.chacha20.keystream.title",
        descKey: "simulation.chacha20.keystream.desc",
        phase: "transform",
        view: { kind: "chacha-keystream", init: initMatrix, ks: ksGrid, ksHex: firstKsHex }
      },
      {
        id: `${id13}-result`,
        titleKey: "simulation.chacha20.result.title",
        descKey: "simulation.chacha20.result.desc",
        phase: "output",
        view: { kind: "chacha-result", hex: resultHex, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "chacha-input":
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: view.decrypt ? "ciphertext (hex)" : "plaintext", value: hexStrOf4(view.message) ?? "", tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: "key", value: hexStrOf4(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: "nonce", value: hexStrOf4(view.nonce) ?? "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: "counter", value: String(view.counter), tone: "key" })
        ] });
      case "chacha-state": {
        const grid = view.grid;
        if (!grid) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: grid, tone: "internal" }) });
      }
      case "chacha-quarter": {
        const grid = view.grid;
        const after = view.after;
        if (!grid || !after) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: grid, highlight: [[0, 0], [1, 0], [2, 0], [3, 0]], tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(FlowArrow, { op: "quarter_round (0,4,8,12)" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: after, highlight: [[0, 0], [1, 0], [2, 0], [3, 0]], tone: "active" })
        ] });
      }
      case "chacha-double": {
        const grid = view.grid;
        const after = view.after;
        if (!grid || !after) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: grid, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(FlowArrow, { op: "column round + diagonal round" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: after, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: "column round", value: "(0,4,8,12) (1,5,9,13) (2,6,10,14) (3,7,11,15)", tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: "diagonal round", value: "(0,5,10,15) (1,6,11,12) (2,7,8,13) (3,4,9,14)", tone: "muted" })
        ] });
      }
      case "chacha-rounds": {
        const working = view.working;
        if (!working) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(FlowArrow, { op: "10 double rounds (20 rounds)" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: working, tone: "internal" })
        ] });
      }
      case "chacha-keystream": {
        const init = view.init;
        const ks = view.ks;
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "lab-stage-view", children: [
          init && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: init, tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(FlowArrow, { op: "init + working (mod 2^32)" }),
          ks && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MatrixGrid, { matrix: ks, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: "keystream (first 64 bytes)", value: hexStrOf4(view.ksHex) ?? "", tone: "output", big: true })
        ] });
      }
      case "chacha-result":
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DataBlock, { label: view.decrypt ? "plaintext" : "ciphertext", value: hexStrOf4(view.hex) ?? "", tone: "output", big: true }) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/aesGcm.tsx
var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
var id14 = "aes_gcm";
var hexStrOf8 = (v) => typeof v === "string" ? v : void 0;
var aesGcmEngine = {
  id: id14,
  nameKey: "simulation.aes_gcm.name",
  educationalKey: "simulation.aes_gcm.educational",
  demoInputs: {
    plaintext: "Hello, cryptography!",
    ciphertext_hex: "",
    key_hex: "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F",
    nonce_hex: "000000000000000000000000",
    aad: ""
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const plaintext = String(ctx.inputs.plaintext ?? "");
    const ciphertextHex = String(ctx.inputs.ciphertext_hex ?? "").replace(/\s/g, "");
    const keyHex = String(ctx.inputs.key_hex ?? "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F").replace(/\s/g, "");
    const nonceHex = String(ctx.inputs.nonce_hex ?? "000000000000000000000000").replace(/\s/g, "");
    const aad = String(ctx.inputs.aad ?? "");
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    const ciphertextHexB = hasResult ? hexStrOf8(extra?.ciphertext_hex) ?? "" : "";
    const tagHex = hasResult ? hexStrOf8(extra?.tag_hex) ?? "" : "";
    const aadHex = hasResult ? hexStrOf8(extra?.aad_hex) ?? "" : "";
    const nonceHexB = hasResult ? hexStrOf8(extra?.nonce_hex) ?? nonceHex : nonceHex;
    const keySize = hasResult && typeof extra?.key_size === "number" ? extra.key_size : keyHex.length / 2 * 8;
    const plaintextHexB = hasResult ? hexStrOf8(extra?.plaintext_hex) ?? "" : "";
    const auth = hasResult ? hexStrOf8(extra?.authentication) ?? "" : "";
    const combinedHex = hasResult ? hexStrOf8(extra?.combined_hex) ?? "" : "";
    const resultOut = hasResult && typeof ctx.result?.result === "string" ? ctx.result.result : combinedHex;
    return [
      {
        id: `${id14}-input`,
        titleKey: "simulation.aes_gcm.input.title",
        descKey: "simulation.aes_gcm.input.desc",
        descArgs: { bits: keySize },
        phase: "input",
        view: { kind: "agcm-input", plaintext, ciphertext: ciphertextHex, key: keyHex, nonce: nonceHex, aad, decrypt }
      },
      {
        id: `${id14}-stream`,
        titleKey: decrypt ? "simulation.aes_gcm.stream.dTitle" : "simulation.aes_gcm.stream.title",
        descKey: decrypt ? "simulation.aes_gcm.stream.dDesc" : "simulation.aes_gcm.stream.desc",
        phase: "transform",
        view: { kind: "agcm-stream", ct: ciphertextHexB, pt: plaintextHexB, decrypt }
      },
      {
        id: `${id14}-mackey`,
        titleKey: "simulation.aes_gcm.mackey.title",
        descKey: "simulation.aes_gcm.mackey.desc",
        phase: "key",
        view: { kind: "agcm-mackey", nonce: nonceHexB }
      },
      {
        id: `${id14}-ghash`,
        titleKey: "simulation.aes_gcm.ghash.title",
        descKey: "simulation.aes_gcm.ghash.desc",
        phase: "transform",
        view: { kind: "agcm-ghash", aadHex, aad, tagHex, hasAad: hasResult ? aad !== "" || aadHex !== "" : aad !== "" }
      },
      {
        id: `${id14}-verify`,
        titleKey: decrypt ? "simulation.aes_gcm.verify.title" : "simulation.aes_gcm.verify.dTitle",
        descKey: "simulation.aes_gcm.verify.desc",
        phase: "internal",
        view: { kind: "agcm-verify", auth, decrypt, tagHex }
      },
      {
        id: `${id14}-result`,
        titleKey: decrypt ? "simulation.aes_gcm.result.dTitle" : "simulation.aes_gcm.result.title",
        descKey: "simulation.aes_gcm.result.desc",
        phase: "output",
        view: { kind: "agcm-result", out: resultOut, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "agcm-input":
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            DataBlock,
            {
              label: view.decrypt ? "ciphertext (hex, incl. tag)" : "plaintext",
              value: (view.decrypt ? hexStrOf8(view.ciphertext) : hexStrOf8(view.plaintext)) ?? "",
              tone: "input"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "key", value: hexStrOf8(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "nonce", value: hexStrOf8(view.nonce) ?? "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "AAD", value: hexStrOf8(view.aad) ?? "", tone: "internal" })
        ] });
      case "agcm-stream":
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(FlowArrow, { op: view.decrypt ? "AES-CTR decrypt" : "AES-CTR encrypt" }),
          view.decrypt ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "plaintext (hex)", value: hexStrOf8(view.pt) ?? "", tone: "output", big: true }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "ciphertext (hex)", value: hexStrOf8(view.ct) ?? "", tone: "output", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "CTR keystream", value: "E_K(counter \u2016 nonce) XOR plaintext", tone: "muted" })
        ] });
      case "agcm-mackey":
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(FlowArrow, { op: "H = E_K(0^128); J0 = nonce \u2016 0x00000001" }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "nonce", value: hexStrOf8(view.nonce) ?? "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "H subkey", value: "AES-encrypt all-zero block", tone: "internal" })
        ] });
      case "agcm-ghash": {
        const aadH = hexStrOf8(view.aadHex) ?? "";
        const tagH = hexStrOf8(view.tagHex) ?? "";
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(FlowArrow, { op: "GHASH(H, AAD \u2016 ciphertext \u2016 len)" }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "AAD (hex)", value: view.hasAad ? aadH : "\u2014", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "tag", value: tagH, tone: "output", big: true })
        ] });
      }
      case "agcm-verify":
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "lab-stage-view", children: view.decrypt ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "authentication", value: hexStrOf8(view.auth) === "PASS" ? "PASS" : "verify tag before returning plaintext", tone: hexStrOf8(view.auth) === "PASS" ? "output" : "muted", big: true }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DataBlock, { label: "tag", value: `${hexStrOf8(view.tagHex) ?? ""}`, tone: "output" }) });
      case "agcm-result":
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          DataBlock,
          {
            label: view.decrypt ? "plaintext" : "ciphertext \u2016 tag",
            value: hexStrOf8(view.out) ?? "",
            tone: "output",
            big: true
          }
        ) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/chacha20Poly1305.tsx
var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);
var id15 = "chacha20_poly1305";
var hexStrOf9 = (v) => typeof v === "string" ? v : void 0;
var chacha20Poly1305Engine = {
  id: id15,
  nameKey: "simulation.chacha20_poly1305.name",
  educationalKey: "simulation.chacha20_poly1305.educational",
  demoInputs: {
    plaintext: "Hello, cryptography!",
    ciphertext_hex: "",
    key_hex: "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F",
    nonce_hex: "000000000000000000000000",
    aad: ""
  },
  build(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const plaintext = String(ctx.inputs.plaintext ?? "");
    const ciphertextHex = String(ctx.inputs.ciphertext_hex ?? "").replace(/\s/g, "");
    const keyHex = String(ctx.inputs.key_hex ?? "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F").replace(/\s/g, "");
    const nonceHex = String(ctx.inputs.nonce_hex ?? "000000000000000000000000").replace(/\s/g, "");
    const aad = String(ctx.inputs.aad ?? "");
    const extra = ctx.result?.extra;
    const hasResult = !!(ctx.result && ctx.resultMatches);
    const ciphertextHexB = hasResult ? hexStrOf9(extra?.ciphertext_hex) ?? "" : "";
    const tagHex = hasResult ? hexStrOf9(extra?.tag_hex) ?? "" : "";
    const aadHex = hasResult ? hexStrOf9(extra?.aad_hex) ?? "" : "";
    const nonceHexB = hasResult ? hexStrOf9(extra?.nonce_hex) ?? nonceHex : nonceHex;
    const plaintextHexB = hasResult ? hexStrOf9(extra?.plaintext_hex) ?? "" : "";
    const auth = hasResult ? hexStrOf9(extra?.authentication) ?? "" : "";
    const combinedHex = hasResult ? hexStrOf9(extra?.combined_hex) ?? "" : "";
    const resultOut = hasResult && typeof ctx.result?.result === "string" ? ctx.result.result : combinedHex;
    return [
      {
        id: `${id15}-input`,
        titleKey: "simulation.chacha20_poly1305.input.title",
        descKey: "simulation.chacha20_poly1305.input.desc",
        phase: "input",
        view: { kind: "cp-input", plaintext, ciphertext: ciphertextHex, key: keyHex, nonce: nonceHex, aad, decrypt }
      },
      {
        id: `${id15}-stream`,
        titleKey: decrypt ? "simulation.chacha20_poly1305.stream.dTitle" : "simulation.chacha20_poly1305.stream.title",
        descKey: decrypt ? "simulation.chacha20_poly1305.stream.dDesc" : "simulation.chacha20_poly1305.stream.desc",
        phase: "transform",
        view: { kind: "cp-stream", ct: ciphertextHexB, pt: plaintextHexB, decrypt }
      },
      {
        id: `${id15}-mackey`,
        titleKey: "simulation.chacha20_poly1305.mackey.title",
        descKey: "simulation.chacha20_poly1305.mackey.desc",
        phase: "key",
        view: { kind: "cp-mackey", nonce: nonceHexB }
      },
      {
        id: `${id15}-poly`,
        titleKey: "simulation.chacha20_poly1305.poly.title",
        descKey: "simulation.chacha20_poly1305.poly.desc",
        phase: "transform",
        view: { kind: "cp-poly", aadHex, aad, tagHex, hasAad: hasResult ? aad !== "" || aadHex !== "" : aad !== "" }
      },
      {
        id: `${id15}-verify`,
        titleKey: decrypt ? "simulation.chacha20_poly1305.verify.title" : "simulation.chacha20_poly1305.verify.dTitle",
        descKey: "simulation.chacha20_poly1305.verify.desc",
        phase: "internal",
        view: { kind: "cp-verify", auth, decrypt, tagHex }
      },
      {
        id: `${id15}-result`,
        titleKey: decrypt ? "simulation.chacha20_poly1305.result.dTitle" : "simulation.chacha20_poly1305.result.title",
        descKey: "simulation.chacha20_poly1305.result.desc",
        phase: "output",
        view: { kind: "cp-result", out: resultOut, decrypt }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "cp-input":
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            DataBlock,
            {
              label: view.decrypt ? "ciphertext (hex, incl. tag)" : "plaintext",
              value: (view.decrypt ? hexStrOf9(view.ciphertext) : hexStrOf9(view.plaintext)) ?? "",
              tone: "input"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "key", value: hexStrOf9(view.key) ?? "", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "nonce", value: hexStrOf9(view.nonce) ?? "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "AAD", value: hexStrOf9(view.aad) ?? "", tone: "internal" })
        ] });
      case "cp-stream":
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(FlowArrow, { op: view.decrypt ? "ChaCha20 decrypt" : "ChaCha20 encrypt" }),
          view.decrypt ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "plaintext (hex)", value: hexStrOf9(view.pt) ?? "", tone: "output", big: true }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "ciphertext (hex)", value: hexStrOf9(view.ct) ?? "", tone: "output", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "keystream", value: "ChaCha20(key, nonce, counter=1) XOR data", tone: "muted" })
        ] });
      case "cp-mackey":
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(FlowArrow, { op: "Poly1305 key = ChaCha20 block 0 (first 32 bytes)" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "nonce", value: hexStrOf9(view.nonce) ?? "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "one-time key", value: "r, s from keystream block 0", tone: "internal" })
        ] });
      case "cp-poly": {
        const aadH = hexStrOf9(view.aadHex) ?? "";
        const tagH = hexStrOf9(view.tagHex) ?? "";
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(FlowArrow, { op: "Poly1305(r, s, AAD \u2016 ciphertext \u2016 len)" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "AAD (hex)", value: view.hasAad ? aadH : "\u2014", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "tag", value: tagH, tone: "output", big: true })
        ] });
      }
      case "cp-verify":
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "lab-stage-view", children: view.decrypt ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "authentication", value: hexStrOf9(view.auth) === "PASS" ? "PASS" : "verify tag before returning plaintext", tone: hexStrOf9(view.auth) === "PASS" ? "output" : "muted", big: true }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DataBlock, { label: "tag", value: `${hexStrOf9(view.tagHex) ?? ""}`, tone: "output" }) });
      case "cp-result":
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          DataBlock,
          {
            label: view.decrypt ? "plaintext" : "ciphertext \u2016 tag",
            value: hexStrOf9(view.out) ?? "",
            tone: "output",
            big: true
          }
        ) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/sha256.tsx
var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);
var id16 = "sha256";
var sha256Engine = {
  id: id16,
  nameKey: "simulation.sha256.name",
  demoInputs: { message: "Hello, cryptography!" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const bytes = strToBytes(message);
    const detail = sha256Detail(bytes);
    const pad = hashPaddingInfo(bytes, 64, 8, false);
    const samples = [0, 20, 63];
    const len = bytes.length;
    const bits = len * 8;
    return [
      {
        id: `${id16}-input`,
        titleKey: "simulation.sha256.input.title",
        descKey: "simulation.sha256.input.desc",
        descArgs: { len, bits },
        phase: "input",
        view: { kind: "sha256-input", text: message, hex: bytesToHex(bytes), len, bits }
      },
      {
        id: `${id16}-padding`,
        titleKey: "simulation.sha256.padding.title",
        descKey: "simulation.sha256.padding.desc",
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: "transform",
        view: {
          kind: "sha256-padding",
          blocksHex: detail.blocksHex,
          msgLen: len,
          blockCount: pad.blockCount,
          padBytes: pad.padBytes
        }
      },
      {
        id: `${id16}-schedule`,
        titleKey: "simulation.sha256.schedule.title",
        descKey: "simulation.sha256.schedule.desc",
        descArgs: { words: detail.schedule.length },
        phase: "internal",
        view: { kind: "sha256-schedule", schedule: detail.schedule }
      },
      {
        id: `${id16}-rounds`,
        titleKey: "simulation.sha256.rounds.title",
        descKey: "simulation.sha256.rounds.desc",
        descArgs: { rounds: detail.rounds.length, sample: samples.length },
        phase: "internal",
        view: { kind: "sha256-rounds", rounds: detail.rounds, samples }
      },
      {
        id: `${id16}-final`,
        titleKey: "simulation.sha256.final.title",
        descKey: "simulation.sha256.final.desc",
        phase: "output",
        view: { kind: "sha256-final", hInit: detail.hInit, hFinal: detail.hFinal, digest: detail.digest }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "sha256-input":
        return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DataBlock, { label: "message", value: String(view.text), tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DataBlock, { label: "bytes", value: String(view.hex), tone: "input" })
        ] });
      case "sha256-padding": {
        const blocksHex = view.blocksHex;
        const msgLen = Number(view.msgLen);
        return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "lab-rows", children: blocksHex.map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(CharRow, { label: `block ${i}`, cells: blockCells(block, msgLen), size: "sm" }, i)) }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DataBlock, { label: "blocks", value: String(view.blockCount), tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DataBlock, { label: "padding bytes", value: String(view.padBytes), tone: "key" })
        ] });
      }
      case "sha256-schedule": {
        const schedule = view.schedule;
        return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(MatrixGrid, { matrix: chunkWords(schedule, 8), tone: "internal" }) });
      }
      case "sha256-rounds": {
        const rounds = view.rounds;
        const samples = view.samples ?? [0, 20, 63];
        return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "lab-strip", dir: "ltr", children: rounds.map((r) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            "span",
            {
              title: `t = ${r.t}`,
              className: `lab-strip-dot${samples.includes(r.t) ? " lab-strip-dot-active" : ""}`
            },
            r.t
          )) }),
          rounds.filter((r) => samples.includes(r.t)).map((r) => /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "lab-round-sample", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "lab-round-sample-head mono", dir: "ltr", children: [
              "t = ",
              r.t
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(MatrixGrid, { matrix: [r.state] }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "lab-round-sample-meta mono", dir: "ltr", children: [
              "T1=",
              r.t1 ?? "",
              " T2=",
              r.t2 ?? "",
              " W=",
              r.w
            ] })
          ] }, r.t))
        ] });
      }
      case "sha256-final":
        return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(MatrixGrid, { matrix: [view.hInit], tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(MatrixGrid, { matrix: [view.hFinal], tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DataBlock, { label: "digest", value: String(view.digest), tone: "output", big: true })
        ] });
      default:
        return null;
    }
  }
};
function chunkWords(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function blockCells(blockHex, msgLen) {
  const hex = blockHex.match(/.{2}/g) ?? [];
  return hex.map((h, i) => ({
    ch: h,
    tone: i < msgLen ? "internal" : "key"
  }));
}

// src/components/simulation/renderers/sha512.tsx
var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);
var id17 = "sha512";
var SAMPLES = [0, 20, 63];
var sha512Engine = {
  id: id17,
  nameKey: "simulation.sha512.name",
  educationalKey: "simulation.sha512.educational",
  demoInputs: { message: "Hello, cryptography!" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const bytes = strToBytes(message);
    const pad = hashPaddingInfo(bytes, 128, 16, false);
    const len = bytes.length;
    const bits = len * 8;
    const extra = ctx.result?.extra;
    const boundDigest = typeof extra?.digest === "string" ? extra.digest : typeof ctx.result?.result === "string" ? ctx.result.result : "";
    const boundBlocks = Array.isArray(extra?.blocks) ? extra.blocks : [];
    const hInit = Array.isArray(extra?.h_init) ? extra.h_init : [];
    const state = Array.isArray(extra?.state) ? extra.state : [];
    const firstRounds = boundBlocks[0]?.rounds ?? [];
    const hasResult = boundDigest.length > 0;
    return [
      {
        id: `${id17}-input`,
        titleKey: "simulation.sha512.input.title",
        descKey: "simulation.sha512.input.desc",
        descArgs: { len, bits },
        phase: "input",
        view: { kind: "sha512-input", text: message, hex: bytesToHex(bytes), len, bits }
      },
      {
        id: `${id17}-padding`,
        titleKey: "simulation.sha512.padding.title",
        descKey: "simulation.sha512.padding.desc",
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: "transform",
        view: {
          kind: "sha512-padding",
          blocksHex: pad.blocks.map(bytesToHex),
          blockCount: pad.blockCount,
          padBytes: pad.padBytes
        }
      },
      {
        id: `${id17}-rounds`,
        titleKey: "simulation.sha512.rounds.title",
        descKey: "simulation.sha512.rounds.desc",
        descArgs: { rounds: 80 },
        phase: "internal",
        view: { kind: "sha512-rounds", rounds: firstRounds, samples: SAMPLES, hasResult }
      },
      {
        id: `${id17}-state`,
        titleKey: "simulation.sha512.state.title",
        descKey: "simulation.sha512.state.desc",
        phase: "internal",
        view: { kind: "sha512-state", hInit, state, hasResult }
      },
      {
        id: `${id17}-digest`,
        titleKey: "simulation.sha512.digest.title",
        descKey: "simulation.sha512.digest.desc",
        phase: "output",
        view: { kind: "sha512-digest", digest: boundDigest, hasResult }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "sha512-input":
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DataBlock, { label: "message", value: String(view.text), tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DataBlock, { label: "bytes", value: String(view.hex), tone: "input" })
        ] });
      case "sha512-padding": {
        const blocksHex = view.blocksHex;
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "lab-stage-view", children: [
          blocksHex.map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MatrixGrid, { matrix: blockWordRows(block), tone: "internal" }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DataBlock, { label: "blocks", value: String(view.blockCount), tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DataBlock, { label: "padding bytes", value: String(view.padBytes), tone: "key" })
        ] });
      }
      case "sha512-rounds": {
        const rounds = view.rounds;
        const samples = view.samples ?? SAMPLES;
        const hasResult = Boolean(view.hasResult);
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "lab-stage-view", children: hasResult ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "lab-strip", dir: "ltr", children: rounds.map((r) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            "span",
            {
              title: `t = ${r.t}`,
              className: `lab-strip-dot${samples.includes(r.t) ? " lab-strip-dot-active" : ""}`
            },
            r.t
          )) }),
          rounds.filter((r) => samples.includes(r.t)).map((r) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "lab-round-sample", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "lab-round-sample-head mono", dir: "ltr", children: [
              "t = ",
              r.t
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MatrixGrid, { matrix: [r.state] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "lab-round-sample-meta mono", dir: "ltr", children: [
              "W=",
              r.W,
              " T1=",
              r.T1,
              " T2=",
              r.T2
            ] })
          ] }, r.t))
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "lab-strip", dir: "ltr", children: Array.from({ length: 80 }, (_, t) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { title: `t = ${t}`, className: "lab-strip-dot" }, t)) }) });
      }
      case "sha512-state": {
        const hInit = view.hInit ?? [];
        const state = view.state ?? [];
        const hasResult = Boolean(view.hasResult);
        if (!hasResult || hInit.length !== 8 || state.length !== 8) return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "lab-stage-view" });
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MatrixGrid, { matrix: [hInit], tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MatrixGrid, { matrix: [state], tone: "transform" })
        ] });
      }
      case "sha512-digest": {
        const hasResult = Boolean(view.hasResult);
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          DataBlock,
          {
            label: "digest",
            value: String(hasResult ? view.digest : "\u2014"),
            tone: hasResult ? "output" : "muted",
            big: true
          }
        ) });
      }
      default:
        return null;
    }
  }
};
function blockWordRows(blockHex) {
  const words = [];
  for (let i = 0; i < blockHex.length; i += 16) words.push(blockHex.slice(i, i + 16));
  const rows = [];
  for (let i = 0; i < words.length; i += 8) rows.push(words.slice(i, i + 8));
  return rows;
}

// src/components/simulation/renderers/sha1.tsx
var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);
var id18 = "sha1";
var ROUND_STAGES = [
  ["0-19", "Ch(b,c,d) = (b AND c) OR (NOT b AND d)"],
  ["20-39", "Parity: b XOR c XOR d"],
  ["40-59", "Maj(b,c,d) = (b AND c) OR (b AND d) OR (c AND d)"],
  ["60-79", "Parity: b XOR c XOR d"]
];
var sha1Engine = {
  id: id18,
  nameKey: "simulation.sha1.name",
  educationalKey: "simulation.sha1.educational",
  demoInputs: { message: "Hello, cryptography!" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const bytes = strToBytes(message);
    const detail = sha1Detail(bytes);
    const pad = hashPaddingInfo(bytes, 64, 8, false);
    const len = bytes.length;
    const bits = len * 8;
    return [
      {
        id: `${id18}-input`,
        titleKey: "simulation.sha1.input.title",
        descKey: "simulation.sha1.input.desc",
        descArgs: { len, bits },
        phase: "input",
        view: { kind: "sha1-input", text: message, hex: bytesToHex(bytes), len, bits }
      },
      {
        id: `${id18}-padding`,
        titleKey: "simulation.sha1.padding.title",
        descKey: "simulation.sha1.padding.desc",
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: "transform",
        view: {
          kind: "sha1-padding",
          blocksHex: detail.blocksHex,
          msgLen: len,
          blockCount: pad.blockCount,
          padBytes: pad.padBytes
        }
      },
      {
        id: `${id18}-rounds`,
        titleKey: "simulation.sha1.rounds.title",
        descKey: "simulation.sha1.rounds.desc",
        descArgs: { rounds: 80 },
        phase: "internal",
        view: { kind: "sha1-rounds", stages: ROUND_STAGES }
      },
      {
        id: `${id18}-state`,
        titleKey: "simulation.sha1.state.title",
        descKey: "simulation.sha1.state.desc",
        phase: "internal",
        view: { kind: "sha1-state", hInit: detail.hInit, hFinal: detail.hFinal }
      },
      {
        id: `${id18}-digest`,
        titleKey: "simulation.sha1.digest.title",
        descKey: "simulation.sha1.digest.desc",
        phase: "output",
        view: { kind: "sha1-digest", digest: detail.digest }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "sha1-input":
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(DataBlock, { label: "message", value: String(view.text), tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(DataBlock, { label: "bytes", value: String(view.hex), tone: "input" })
        ] });
      case "sha1-padding": {
        const blocksHex = view.blocksHex;
        const msgLen = Number(view.msgLen);
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "lab-rows", children: blocksHex.map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CharRow, { label: `block ${i}`, cells: blockCells2(block, msgLen), size: "sm" }, i)) }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(DataBlock, { label: "blocks", value: String(view.blockCount), tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(DataBlock, { label: "padding bytes", value: String(view.padBytes), tone: "key" })
        ] });
      }
      case "sha1-rounds": {
        const stages = view.stages;
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "lab-strip", dir: "ltr", children: Array.from({ length: 80 }, (_, t) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { title: `t = ${t}`, className: "lab-strip-dot" }, t)) }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(MatrixGrid, { matrix: stages, tone: "internal" })
        ] });
      }
      case "sha1-state":
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(MatrixGrid, { matrix: [view.hInit], tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(MatrixGrid, { matrix: [view.hFinal], tone: "transform" })
        ] });
      case "sha1-digest":
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(DataBlock, { label: "digest", value: String(view.digest), tone: "output", big: true }) });
      default:
        return null;
    }
  }
};
function blockCells2(blockHex, msgLen) {
  const hex = blockHex.match(/.{2}/g) ?? [];
  return hex.map((h, i) => ({
    ch: h,
    tone: i < msgLen ? "internal" : "key"
  }));
}

// src/components/simulation/renderers/md5.tsx
var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);
var id19 = "md5";
var ROUND_LABELS = ["F", "G", "H", "I"];
var md5Engine = {
  id: id19,
  nameKey: "simulation.md5.name",
  educationalKey: "simulation.md5.educational",
  demoInputs: { message: "Hello, cryptography!" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const bytes = strToBytes(message);
    const detail = md5Detail(bytes);
    const pad = hashPaddingInfo(bytes, 64, 8, true);
    const len = bytes.length;
    const bits = len * 8;
    return [
      {
        id: `${id19}-input`,
        titleKey: "simulation.md5.input.title",
        descKey: "simulation.md5.input.desc",
        descArgs: { len, bits },
        phase: "input",
        view: { kind: "md5-input", text: message, hex: bytesToHex(bytes), len, bits }
      },
      {
        id: `${id19}-padding`,
        titleKey: "simulation.md5.padding.title",
        descKey: "simulation.md5.padding.desc",
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: "transform",
        view: {
          kind: "md5-padding",
          blocksHex: detail.blocksHex,
          msgLen: len,
          blockCount: pad.blockCount,
          padBytes: pad.padBytes
        }
      },
      {
        id: `${id19}-rounds`,
        titleKey: "simulation.md5.rounds.title",
        descKey: "simulation.md5.rounds.desc",
        descArgs: { rounds: 4 },
        phase: "internal",
        view: { kind: "md5-rounds" }
      },
      {
        id: `${id19}-state`,
        titleKey: "simulation.md5.state.title",
        descKey: "simulation.md5.state.desc",
        phase: "internal",
        view: { kind: "md5-state", hInit: detail.hInit }
      },
      {
        id: `${id19}-digest`,
        titleKey: "simulation.md5.digest.title",
        descKey: "simulation.md5.digest.desc",
        phase: "output",
        view: { kind: "md5-digest", digest: detail.digest }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "md5-input":
        return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(DataBlock, { label: "message", value: String(view.text), tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(DataBlock, { label: "bytes", value: String(view.hex), tone: "input" })
        ] });
      case "md5-padding": {
        const blocksHex = view.blocksHex;
        const msgLen = Number(view.msgLen);
        return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "lab-rows", children: blocksHex.map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(CharRow, { label: `block ${i}`, cells: blockCells3(block, msgLen), size: "sm" }, i)) }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(DataBlock, { label: "blocks", value: String(view.blockCount), tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(DataBlock, { label: "padding bytes", value: String(view.padBytes), tone: "key" })
        ] });
      }
      case "md5-rounds": {
        return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "lab-stage-view", children: ROUND_LABELS.map((fn, ri) => /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "lab-round-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { className: "lab-round-sample-head mono", dir: "ltr", children: [
            "R",
            ri + 1,
            " (",
            fn,
            ")"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "lab-strip", dir: "ltr", children: Array.from({ length: 16 }, (_, s) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { title: `step ${ri * 16 + s + 1}`, className: "lab-strip-dot" }, s)) })
        ] }, fn)) });
      }
      case "md5-state":
        return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(MatrixGrid, { matrix: [view.hInit], tone: "input" }) });
      case "md5-digest":
        return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(DataBlock, { label: "digest", value: String(view.digest), tone: "output", big: true }) });
      default:
        return null;
    }
  }
};
function blockCells3(blockHex, msgLen) {
  const hex = blockHex.match(/.{2}/g) ?? [];
  return hex.map((h, i) => ({
    ch: h,
    tone: i < msgLen ? "internal" : "key"
  }));
}

// src/components/simulation/renderers/sha3.tsx
var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);
var id20 = "sha3";
var RATES = { "224": 144, "256": 136, "384": 104, "512": 72 };
var DIGEST_BYTES = { "224": 28, "256": 32, "384": 48, "512": 64 };
var sha3Engine = {
  id: id20,
  nameKey: "simulation.sha3.name",
  educationalKey: "simulation.sha3.educational",
  demoInputs: { message: "Hello, cryptography!" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const bytes = strToBytes(message);
    const variant = String(ctx.inputs.variant ?? "256").trim();
    const rate = RATES[variant] ?? 136;
    const digestBytes = DIGEST_BYTES[variant] ?? 32;
    const capacity = 200 - rate;
    const len = bytes.length;
    const extra = ctx.result?.extra;
    const boundDigest = typeof extra?.digest === "string" ? extra.digest : typeof ctx.result?.result === "string" ? ctx.result.result : "";
    const hasResult = boundDigest.length > 0;
    const absorb = Array.isArray(extra?.absorb) ? extra.absorb : [];
    const state = Array.isArray(extra?.state) ? extra.state : [];
    const structuralBlocks = Math.ceil((len + 1) / rate);
    const blockCount = absorb.length > 0 ? absorb.length : structuralBlocks;
    return [
      {
        id: `${id20}-input`,
        titleKey: "simulation.sha3.input.title",
        descKey: "simulation.sha3.input.desc",
        descArgs: { len, variant, rate },
        phase: "input",
        view: { kind: "sha3-input", text: message, hex: bytesToHex(bytes), len, variant, rate }
      },
      {
        id: `${id20}-sponge`,
        titleKey: "simulation.sha3.sponge.title",
        descKey: "simulation.sha3.sponge.desc",
        descArgs: { rate, capacity },
        phase: "internal",
        view: { kind: "sha3-sponge", rate, capacity }
      },
      {
        id: `${id20}-absorb`,
        titleKey: "simulation.sha3.absorb.title",
        descKey: "simulation.sha3.absorb.desc",
        descArgs: { blocks: blockCount },
        phase: "transform",
        view: {
          kind: "sha3-absorb",
          absorb,
          blocks: blockCount,
          rate,
          rateLanes: rate / 8,
          hasResult
        }
      },
      {
        id: `${id20}-squeeze`,
        titleKey: "simulation.sha3.squeeze.title",
        descKey: "simulation.sha3.squeeze.desc",
        descArgs: { digestBytes },
        phase: "internal",
        view: { kind: "sha3-squeeze", state, digestBytes, hasResult }
      },
      {
        id: `${id20}-digest`,
        titleKey: "simulation.sha3.digest.title",
        descKey: "simulation.sha3.digest.desc",
        descArgs: { variant },
        phase: "output",
        view: { kind: "sha3-digest", digest: boundDigest, hasResult }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "sha3-input":
        return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DataBlock, { label: "message", value: String(view.text), tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DataBlock, { label: "bytes", value: String(view.hex), tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DataBlock, { label: "rate", value: String(view.rate), tone: "key" })
        ] });
      case "sha3-sponge": {
        const rate = Number(view.rate);
        const rateLanes = rate / 8;
        const highlight = [];
        for (let i = 0; i < rateLanes; i++) highlight.push([Math.floor(i / 5), i % 5]);
        const lanes = [];
        for (let y = 0; y < 5; y++) {
          const row = [];
          for (let x = 0; x < 5; x++) row.push(0);
          lanes.push(row);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MatrixGrid, { matrix: lanes, highlight, tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DataBlock, { label: "rate region", value: String(rate), tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DataBlock, { label: "capacity", value: String(view.capacity), tone: "key" })
        ] });
      }
      case "sha3-absorb": {
        const absorb = view.absorb;
        const rateLanes = Number(view.rateLanes);
        const blocks = Number(view.blocks);
        const hasResult = Boolean(view.hasResult);
        if (hasResult && absorb.length > 0) {
          return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "lab-stage-view", children: absorb.map((b) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "lab-round-sample", children: [
            /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "lab-round-sample-head mono", dir: "ltr", children: [
              "block ",
              b.block_index
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MatrixGrid, { matrix: [b.lanes_xor], tone: "transform" })
          ] }, b.block_index)) });
        }
        const rows = [];
        for (let i = 0; i < blocks; i++) {
          rows.push(Array.from({ length: rateLanes }, () => "\xB7"));
        }
        return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "lab-stage-view", children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "lab-round-sample", children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "lab-round-sample-head mono", dir: "ltr", children: [
            "block ",
            i
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MatrixGrid, { matrix: [row], tone: "muted" })
        ] }, i)) });
      }
      case "sha3-squeeze": {
        const state = view.state ?? [];
        const digestBytes = Number(view.digestBytes);
        const hasResult = Boolean(view.hasResult);
        const lanes = [];
        for (let y = 0; y < 5; y++) {
          const row = [];
          for (let x = 0; x < 5; x++) row.push(hasResult ? state[y * 5 + x] ?? 0 : 0);
          lanes.push(row);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MatrixGrid, { matrix: lanes, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(FlowArrow, { op: `Keccak-f x24 + squeeze` }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DataBlock, { label: "digest bytes", value: String(digestBytes), tone: "output" })
        ] });
      }
      case "sha3-digest": {
        const hasResult = Boolean(view.hasResult);
        return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
          DataBlock,
          {
            label: "digest",
            value: String(hasResult ? view.digest : "\u2014"),
            tone: hasResult ? "output" : "muted",
            big: true
          }
        ) });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/blake2.tsx
var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);
var id21 = "blake2";
var IV_512 = [
  "6a09e667f3bcc908",
  "bb67ae8584caa73b",
  "3c6ef372fe94f82b",
  "a54ff53a5f1d36f1",
  "510e527fade682d1",
  "9b05688c2b3e6c1f",
  "1f83d9abfb41bd6b",
  "5be0cd19137e2179"
];
var IV_256 = [
  "6a09e667",
  "bb67ae85",
  "3c6ef372",
  "a54ff53a",
  "510e527f",
  "9b05688c",
  "1f83d9ab",
  "5be0cd19"
];
var SIGMA = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8]
];
var blake2Engine = {
  id: id21,
  nameKey: "simulation.blake2.name",
  educationalKey: "simulation.blake2.educational",
  demoInputs: { message: "Hello, cryptography!" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const bytes = strToBytes(message);
    const variant = String(ctx.inputs.variant ?? "512").trim();
    const is512 = variant === "512";
    const rounds = is512 ? 12 : 10;
    const blockBytes = is512 ? 128 : 64;
    const digestBytes = is512 ? 64 : 32;
    const digestBits = digestBytes * 8;
    const param = is512 ? "01010040" : "01010020";
    const iv = is512 ? IV_512 : IV_256;
    const hInit = iv.map((w, i) => i === 0 ? xorHex(w, param) : w);
    const len = bytes.length;
    const extra = ctx.result?.extra;
    const boundDigest = typeof extra?.digest === "string" ? extra.digest : typeof ctx.result?.result === "string" ? ctx.result.result : "";
    const hasResult = boundDigest.length > 0;
    return [
      {
        id: `${id21}-input`,
        titleKey: "simulation.blake2.input.title",
        descKey: "simulation.blake2.input.desc",
        descArgs: { len, variant, rounds, digestBits },
        phase: "input",
        view: {
          kind: "blake2-input",
          text: message,
          hex: bytesToHex(bytes),
          len,
          variant,
          rounds,
          digestBits
        }
      },
      {
        id: `${id21}-param`,
        titleKey: "simulation.blake2.param.title",
        descKey: "simulation.blake2.param.desc",
        phase: "key",
        view: { kind: "blake2-param", param, hInit }
      },
      {
        id: `${id21}-state`,
        titleKey: "simulation.blake2.state.title",
        descKey: "simulation.blake2.state.desc",
        phase: "internal",
        view: { kind: "blake2-state", v: hInit.concat(iv) }
      },
      {
        id: `${id21}-rounds`,
        titleKey: "simulation.blake2.rounds.title",
        descKey: "simulation.blake2.rounds.desc",
        descArgs: { rounds, blockBytes },
        phase: "internal",
        view: { kind: "blake2-rounds", rounds, blockBytes, sigma: SIGMA, is512, hasResult }
      },
      {
        id: `${id21}-digest`,
        titleKey: "simulation.blake2.digest.title",
        descKey: "simulation.blake2.digest.desc",
        phase: "output",
        view: { kind: "blake2-digest", digest: boundDigest, hasResult }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "blake2-input":
        return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DataBlock, { label: "message", value: String(view.text), tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DataBlock, { label: "bytes", value: String(view.hex), tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DataBlock, { label: "variant", value: `blake2${String(view.variant)}`, tone: "key" })
        ] });
      case "blake2-param":
        return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DataBlock, { label: "parameter word", value: String(view.param), tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(MatrixGrid, { matrix: [view.hInit], tone: "internal" })
        ] });
      case "blake2-state": {
        const v = view.v;
        const highlight = [];
        if (v.length === 16) {
          highlight.push([0, 12], [0, 13], [0, 14]);
          if (v[15]) highlight.push([0, 15]);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(MatrixGrid, { matrix: v.length === 16 ? [v.slice(0, 8), v.slice(8, 16)] : [], highlight, tone: "internal" }) });
      }
      case "blake2-rounds": {
        const rounds = Number(view.rounds);
        const sigma = view.sigma;
        const step = Boolean(view.is512) ? 12 : 10;
        return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "lab-strip", dir: "ltr", children: Array.from({ length: rounds }, (_, r) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { title: `round ${r}, sigma row ${r % step}`, className: "lab-strip-dot" }, r)) }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(MatrixGrid, { matrix: sigma.map((row) => row.slice(0, 8)), tone: "internal" })
        ] });
      }
      case "blake2-digest": {
        const hasResult = Boolean(view.hasResult);
        return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          DataBlock,
          {
            label: "digest",
            value: String(hasResult ? view.digest : "\u2014"),
            tone: hasResult ? "output" : "muted",
            big: true
          }
        ) });
      }
      default:
        return null;
    }
  }
};
function xorHex(a, b) {
  return (BigInt(`0x${a}`) ^ BigInt(`0x${b}`)).toString(16).padStart(a.length, "0");
}

// src/components/simulation/renderers/blake3.tsx
var import_jsx_runtime25 = __toESM(require_jsx_runtime(), 1);
var id22 = "blake3";
var blake3Engine = {
  id: id22,
  nameKey: "simulation.blake3.name",
  educationalKey: "simulation.blake3.educational",
  demoInputs: { message: "Hello, cryptography!", length: 32 },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const length = Math.max(1, Math.min(64, Number(ctx.inputs.length ?? 32)));
    const bytes = strToBytes(message);
    const len = bytes.length;
    const bits = length * 8;
    const chunkCount = Math.max(1, Math.ceil(len / 1024));
    const ranges = chunkRanges(len, chunkCount);
    const extra = ctx.result?.extra;
    const boundDigest = typeof extra?.digest === "string" ? extra.digest : typeof ctx.result?.result === "string" ? ctx.result.result : "";
    const hasResult = boundDigest.length > 0;
    const rootCv = Array.isArray(extra?.root_cv) ? extra.root_cv : [];
    const boundChunks = Array.isArray(extra?.chunks) ? extra.chunks : [];
    return [
      {
        id: `${id22}-input`,
        titleKey: "simulation.blake3.input.title",
        descKey: "simulation.blake3.input.desc",
        descArgs: { len, length, bits },
        phase: "input",
        view: {
          kind: "blake3-input",
          text: message,
          hex: bytesToHex(bytes),
          len,
          length,
          bits
        }
      },
      {
        id: `${id22}-chunks`,
        titleKey: "simulation.blake3.chunks.title",
        descKey: "simulation.blake3.chunks.desc",
        descArgs: { chunkCount },
        phase: "transform",
        view: { kind: "blake3-chunks", ranges, chunkCount, boundChunks, len, hasResult }
      },
      {
        id: `${id22}-tree`,
        titleKey: "simulation.blake3.tree.title",
        descKey: "simulation.blake3.tree.desc",
        phase: "internal",
        view: { kind: "blake3-tree", levels: levelCounts(chunkCount), rootCv, treeSize: chunkCount }
      },
      {
        id: `${id22}-xof`,
        titleKey: "simulation.blake3.xof.title",
        descKey: "simulation.blake3.xof.desc",
        descArgs: { length },
        phase: "internal",
        view: { kind: "blake3-xof", length }
      },
      {
        id: `${id22}-digest`,
        titleKey: "simulation.blake3.digest.title",
        descKey: "simulation.blake3.digest.desc",
        descArgs: { length },
        phase: "output",
        view: { kind: "blake3-digest", digest: boundDigest, hasResult }
      }
    ];
  },
  View({ view }) {
    switch (view.kind) {
      case "blake3-input":
        return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DataBlock, { label: "message", value: String(view.text), tone: "input", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DataBlock, { label: "bytes", value: String(view.hex), tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DataBlock, { label: "output length (bytes)", value: String(view.length), tone: "key" })
        ] });
      case "blake3-chunks": {
        const ranges = view.ranges;
        const boundChunks = view.boundChunks ?? [];
        const len = Number(view.len);
        const hasResult = Boolean(view.hasResult);
        return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "lab-tree", dir: "ltr", children: ranges.map((range, i) => /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "lab-tree-node", children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "lab-tree-node-title mono", dir: "ltr", children: [
              "chunk ",
              i,
              " [",
              range,
              "]"
            ] }),
            hasResult && boundChunks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "lab-tree-node-sub mono", dir: "ltr", children: [
              "counter ",
              i,
              " - ",
              boundChunks[i]?.bytes ?? len,
              " bytes"
            ] })
          ] }, i)) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DataBlock, { label: "chunks", value: String(view.chunkCount), tone: "transform" })
        ] });
      }
      case "blake3-tree": {
        const levels = view.levels;
        const rootCv = view.rootCv ?? [];
        return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "lab-tree", dir: "ltr", children: levels.map((count, li) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "lab-tree-row", children: Array.from({ length: count }, (_, ni) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "lab-tree-pill mono", dir: "ltr", children: li === 0 ? `C${ni}` : "P" }, ni)) }, li)) }),
          rootCv.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DataBlock, { label: "root chaining value", value: rootCv.join(" "), tone: "internal" })
        ] });
      }
      case "blake3-xof": {
        const length = Number(view.length);
        return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "lab-strip", dir: "ltr", children: Array.from({ length: 64 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            "span",
            {
              title: `byte ${i}`,
              className: `lab-strip-dot${i < length ? " lab-strip-dot-active" : ""}`
            },
            i
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(FlowArrow, { op: `first ${length} bytes` }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DataBlock, { label: "XOF output length", value: String(length), tone: "output" })
        ] });
      }
      case "blake3-digest": {
        const hasResult = Boolean(view.hasResult);
        return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          DataBlock,
          {
            label: "digest",
            value: String(hasResult ? view.digest : "\u2014"),
            tone: hasResult ? "output" : "muted",
            big: true
          }
        ) });
      }
      default:
        return null;
    }
  }
};
function chunkRanges(len, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const lo = i * 1024;
    const hi = Math.min(len, lo + 1024);
    out.push(`${lo}-${hi}`);
  }
  return out;
}
function levelCounts(count) {
  const out = [];
  let n = count;
  while (true) {
    out.push(n);
    if (n === 1) break;
    n = Math.ceil(n / 2);
  }
  return out;
}

// src/components/simulation/renderers/hmac.tsx
var import_jsx_runtime26 = __toESM(require_jsx_runtime(), 1);
var id23 = "hmac";
var SHA_BLOCK = { sha256: 64, sha512: 128 };
var HASH_NAME = { sha256: "SHA-256", sha512: "SHA-512" };
var pad2 = (v) => v.toString(16).padStart(2, "0");
var hexToNumbers = (hex) => Array.from(hexToBytes(hex));
function hexCells(hex, tone, cap, noteFn) {
  const bytes = hexToNumbers(hex);
  const shown = bytes.slice(0, cap);
  const cells = shown.map((b, i) => ({
    ch: pad2(b),
    tone,
    note: noteFn ? noteFn(b, i) : void 0
  }));
  if (bytes.length > cap) cells.push({ ch: `+${bytes.length - cap}`, tone: "muted" });
  return cells;
}
function constantCells(constant, count, cap) {
  const cells = Array.from({ length: Math.min(count, cap) }, (_, i) => ({
    ch: pad2(constant),
    tone: "muted",
    note: `constant 0x${pad2(constant)} \xB7 byte ${i}`
  }));
  if (count > cap) cells.push({ ch: `+${count - cap}`, tone: "muted" });
  return cells;
}
function xorCells(bytes, constant, cap) {
  const shown = bytes.slice(0, cap);
  const cells = shown.map((b, i) => ({
    ch: pad2(b ^ constant),
    tone: "transform",
    note: `0x${pad2(b)} XOR 0x${pad2(constant)} = 0x${pad2(b ^ constant)} \xB7 byte ${i}`
  }));
  if (bytes.length > cap) cells.push({ ch: `+${bytes.length - cap}`, tone: "muted" });
  return cells;
}
function HashBox({ title, tone, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: `lab-box tone-${tone}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "lab-box-title mono", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "lab-box-body", children })
  ] });
}
function backendString(ctx, field) {
  const extra = ctx.result?.extra;
  const v = extra && typeof extra[field] === "string" ? extra[field] : ctx.result?.result;
  return typeof v === "string" ? v : "";
}
var hmacEngine = {
  id: id23,
  nameKey: "simulation.hmac.name",
  demoInputs: { message: "Important message", key: "super-secret-key" },
  educationalKey: "simulation.hmac.educational",
  build(ctx) {
    const message = String(ctx.inputs.message ?? "");
    const key = String(ctx.inputs.key ?? "");
    const algorithm = String(ctx.inputs.algorithm ?? "sha256");
    const isSha256 = algorithm === "sha256";
    const block = SHA_BLOCK[algorithm] ?? 64;
    const hashName = HASH_NAME[algorithm] ?? "SHA-256";
    const live = isSha256 ? hmacSha256Detail(key, message) : null;
    const boundMac = backendString(ctx, "mac");
    const digest = live ? live.digest : boundMac;
    const structural = !isSha256;
    const keyLen = strToBytes(key).length;
    const msgLen = strToBytes(message).length;
    const stages = [
      {
        id: `${id23}-key`,
        titleKey: "simulation.hmac.key.title",
        descKey: isSha256 ? "simulation.hmac.key.desc" : "simulation.hmac.key.descSha512",
        descArgs: { block, keyLen },
        phase: "key",
        view: {
          kind: "hmac-key",
          structural,
          hashName,
          block,
          keyLen,
          keyTooLong: isSha256 ? Boolean(live?.keyTooLong) : keyLen > block,
          keyPadded: live ? live.keyPadded : ""
        }
      },
      {
        id: `${id23}-xor`,
        titleKey: "simulation.hmac.xor.title",
        descKey: "simulation.hmac.xor.desc",
        descArgs: { block },
        phase: "internal",
        view: { kind: "hmac-xor", structural, keyPadded: live ? live.keyPadded : "" }
      },
      {
        id: `${id23}-inner`,
        titleKey: "simulation.hmac.inner.title",
        descKey: "simulation.hmac.inner.desc",
        descArgs: { msgLen, hashName },
        phase: "internal",
        view: {
          kind: "hmac-inner",
          structural,
          hashName,
          innerMsg: live ? live.innerMsg : "",
          innerDigest: live ? live.innerDigest : ""
        }
      },
      {
        id: `${id23}-outer`,
        titleKey: "simulation.hmac.outer.title",
        descKey: "simulation.hmac.outer.desc",
        descArgs: { hashName, inputBytes: 64 + 32 },
        phase: "transform",
        view: {
          kind: "hmac-outer",
          structural,
          hashName,
          opad: live ? live.opad : "",
          innerDigest: live ? live.innerDigest : "",
          digest
        }
      },
      {
        id: `${id23}-result`,
        titleKey: "simulation.hmac.result.title",
        descKey: "simulation.hmac.result.desc",
        descArgs: { digest: digest || "\u2014" },
        phase: "output",
        view: { kind: "hmac-result", structural, digest }
      }
    ];
    return stages;
  },
  View({ view }) {
    switch (view.kind) {
      case "hmac-key": {
        const structural = Boolean(view.structural);
        const keyLen = Number(view.keyLen);
        const keyTooLong = Boolean(view.keyTooLong);
        const keyPadded = String(view.keyPadded);
        const hashName = String(view.hashName);
        const block = Number(view.block);
        return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "key (bytes)", value: String(keyLen), tone: "key" }),
          structural ? /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_jsx_runtime26.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "K0", value: `${hashName} \xB7 ${block}-byte block`, tone: "key", big: true }),
            keyTooLong && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("p", { className: "lab-note", children: [
              "key length ",
              keyLen,
              " > ",
              block,
              ": the key is hashed once to ",
              hashName === "SHA-512" ? 64 : 32,
              " ",
              "bytes before padding"
            ] })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_jsx_runtime26.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "K0", size: "sm", cells: hexCells(keyPadded, "key", 32) }),
            keyTooLong && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("p", { className: "lab-note", children: [
              "key length ",
              keyLen,
              " > ",
              block,
              ": the key is hashed to 32 bytes once"
            ] })
          ] })
        ] });
      }
      case "hmac-xor": {
        const structural = Boolean(view.structural);
        const keyPadded = String(view.keyPadded);
        if (structural) {
          return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "lab-stage-view", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "inner key", value: "K0 XOR ipad (0x36)", tone: "internal" }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, {}),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "outer key", value: "K0 XOR opad (0x5c)", tone: "internal" })
          ] });
        }
        const padded = hexToNumbers(keyPadded);
        return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "K0", size: "sm", cells: hexCells(keyPadded, "key", 32) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "ipad", size: "sm", cells: constantCells(54, padded.length, 32) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "XOR ipad", size: "sm", cells: xorCells(padded, 54, 32) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, { op: "inner key" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "opad", size: "sm", cells: constantCells(92, padded.length, 32) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "XOR opad", size: "sm", cells: xorCells(padded, 92, 32) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, { op: "outer key" })
        ] });
      }
      case "hmac-inner": {
        const structural = Boolean(view.structural);
        const innerMsg = String(view.innerMsg);
        const innerDigest = String(view.innerDigest);
        const hashName = String(view.hashName);
        if (structural) {
          return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "lab-stage-view", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "input", value: "(K0 XOR ipad) || message", tone: "input" }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, {}),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "inner digest", value: "bound from execution", tone: "internal" })
          ] });
        }
        return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(HashBox, { title: `${hashName} (inner)`, tone: "internal", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "ipad||msg", size: "sm", cells: hexCells(innerMsg, "input", 24) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "inner digest", value: innerDigest, tone: "internal" })
        ] }) });
      }
      case "hmac-outer": {
        const structural = Boolean(view.structural);
        const opad = String(view.opad);
        const innerDigest = String(view.innerDigest);
        const digest = String(view.digest);
        const hashName = String(view.hashName);
        if (structural) {
          return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "lab-stage-view", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "input", value: "(K0 XOR opad) || inner_digest", tone: "input" }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, {}),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "MAC", value: digest || "\u2014", tone: "output", big: true })
          ] });
        }
        return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(HashBox, { title: `${hashName} (outer)`, tone: "transform", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(CharRow, { label: "opad||inner", size: "sm", cells: hexCells(opad, "key", 24) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "inner digest", value: innerDigest, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(HashBox, { title: `${hashName} (inner)`, tone: "internal", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "ipad||msg hashed", value: innerDigest, tone: "internal" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "MAC", value: digest, tone: "output", big: true })
        ] }) });
      }
      case "hmac-result": {
        const structural = Boolean(view.structural);
        const digest = String(view.digest);
        return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DataBlock, { label: "HMAC", value: digest || "\u2014", tone: "output", big: true }),
          structural && digest && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "lab-note", children: "digest bound from server execution" })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/pbkdf2.tsx
var import_jsx_runtime27 = __toESM(require_jsx_runtime(), 1);
var id24 = "pbkdf2";
function hexCells2(hex, tone, cap) {
  const cells = [];
  for (let i = 0; i + 1 < hex.length && cells.length < cap; i += 2) {
    cells.push({ ch: hex.slice(i, i + 2), tone });
  }
  const bytes = hex.length / 2;
  if (bytes > cap) cells.push({ ch: `+${bytes - cap}`, tone: "muted" });
  return cells;
}
function leadingLoopRows(password, salt, count) {
  const saltBytes = strToBytes(salt);
  const base = new Uint8Array(saltBytes.length + 4);
  base.set(saltBytes);
  base[base.length - 4] = 0;
  base[base.length - 3] = 0;
  base[base.length - 2] = 0;
  base[base.length - 1] = 1;
  let ui = hmacSha256(password, base);
  const acc = new Uint8Array(ui.length);
  acc.set(ui);
  const rows = [{ n: 1, u: bytesToHex(ui), xor: bytesToHex(acc) }];
  for (let n = 2; n <= count; n++) {
    ui = hmacSha256(password, ui);
    for (let i = 0; i < acc.length; i++) acc[i] ^= ui[i];
    rows.push({ n, u: bytesToHex(ui), xor: bytesToHex(acc) });
  }
  return rows;
}
var pbkdf2Engine = {
  id: id24,
  nameKey: "simulation.pbkdf2.name",
  demoInputs: { password: "correct horse battery staple", salt: "salty", iterations: 1e3, key_length: 32 },
  educationalKey: "simulation.pbkdf2.educational",
  build(ctx) {
    const password = String(ctx.inputs.password ?? "");
    const salt = String(ctx.inputs.salt ?? "");
    const iterations = Math.max(1, Math.round(Number(ctx.inputs.iterations ?? 1e5)));
    const keyLength = Math.max(1, Math.min(64, Math.round(Number(ctx.inputs.key_length ?? 32))));
    const hashLen = 32;
    const totalBlocks = Math.max(1, Math.ceil(keyLength / hashLen));
    const { dkHex, blockDigests, u1 } = pbkdf2Sha256(password, salt, iterations, keyLength);
    const pwBytes = strToBytes(password).length;
    const saltHex = bytesToHex(strToBytes(salt));
    const saltLen = saltHex.length / 2;
    const shownCount = iterations <= 6 ? iterations : 3;
    const rows = leadingLoopRows(password, salt, shownCount);
    const more = Math.max(0, iterations - shownCount);
    const finalBlock = blockDigests[0] ?? "";
    const stages = [
      {
        id: `${id24}-input`,
        titleKey: "simulation.pbkdf2.input.title",
        descKey: "simulation.pbkdf2.input.desc",
        descArgs: { pwBytes, saltLen },
        phase: "input",
        view: { kind: "pbkdf2-input", pwBytes, saltHex, saltLen }
      },
      {
        id: `${id24}-params`,
        titleKey: "simulation.pbkdf2.params.title",
        descKey: "simulation.pbkdf2.params.desc",
        descArgs: { iterations, keyLength, blocks: totalBlocks },
        phase: "key",
        view: { kind: "pbkdf2-params", iterations, keyLength, hashLen, blocks: totalBlocks }
      },
      {
        id: `${id24}-u1`,
        titleKey: "simulation.pbkdf2.u1.title",
        descKey: "simulation.pbkdf2.u1.desc",
        phase: "transform",
        view: { kind: "pbkdf2-u1", u1 }
      },
      {
        id: `${id24}-loop`,
        titleKey: "simulation.pbkdf2.loop.title",
        descKey: "simulation.pbkdf2.loop.desc",
        descArgs: { shown: shownCount, more, iterations },
        phase: "internal",
        view: { kind: "pbkdf2-loop", rows, more, iterations, finalBlock }
      },
      {
        id: `${id24}-assemble`,
        titleKey: "simulation.pbkdf2.assemble.title",
        descKey: "simulation.pbkdf2.assemble.desc",
        descArgs: { blocks: totalBlocks, keyLength },
        phase: "transform",
        view: { kind: "pbkdf2-assemble", blockDigests, keyLength, dkHex }
      },
      {
        id: `${id24}-result`,
        titleKey: "simulation.pbkdf2.result.title",
        descKey: "simulation.pbkdf2.result.desc",
        descArgs: { keyLength },
        phase: "output",
        view: { kind: "pbkdf2-result", dkHex }
      }
    ];
    return stages;
  },
  View({ view }) {
    switch (view.kind) {
      case "pbkdf2-input": {
        const pwBytes = Number(view.pwBytes);
        const saltHex = String(view.saltHex);
        const saltLen = Number(view.saltLen);
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "password (bytes)", value: String(pwBytes), tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(CharRow, { label: "salt", size: "sm", cells: hexCells2(saltHex, "input", 24) }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "salt (bytes)", value: String(saltLen), tone: "muted" })
        ] });
      }
      case "pbkdf2-params": {
        const iterations = Number(view.iterations);
        const keyLength = Number(view.keyLength);
        const hashLen = Number(view.hashLen);
        const blocks = Number(view.blocks);
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "PRF", value: "HMAC-SHA-256", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "iterations", value: String(iterations), tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "hash size", value: `${hashLen} bytes`, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "output", value: `${blocks} \xD7 ${hashLen} bytes \u2192 ${keyLength}`, tone: "transform" })
        ] });
      }
      case "pbkdf2-u1": {
        const u1 = String(view.u1);
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(CharRow, { label: "U1", size: "sm", cells: hexCells2(u1, "transform", 32) }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "U1 (hex)", value: u1, tone: "internal" })
        ] });
      }
      case "pbkdf2-loop": {
        const rows = view.rows;
        const more = Number(view.more);
        const iterations = Number(view.iterations);
        const finalBlock = String(view.finalBlock);
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "lab-stage-view", children: [
          rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "lab-stage-view", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(CharRow, { label: `U${r.n} = HMAC(password, U${r.n - 1})`, size: "sm", cells: hexCells2(r.u, "transform", 16) }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(CharRow, { label: `T = XOR(U1..U${r.n})`, size: "sm", cells: hexCells2(r.xor, "internal", 16) })
          ] }, r.n)),
          more > 0 && /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("p", { className: "lab-note", children: [
            "+",
            more,
            " more iteration(s) not drawn \u2026"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(CharRow, { label: `DK block (XOR of U1..U${iterations})`, size: "sm", cells: hexCells2(finalBlock, "output", 16) })
        ] });
      }
      case "pbkdf2-assemble": {
        const blockDigests = view.blockDigests;
        const keyLength = Number(view.keyLength);
        const dkHex = String(view.dkHex);
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "lab-stage-view", children: [
          blockDigests.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: `block ${i + 1}`, value: b, tone: "internal" }, i)),
          blockDigests.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(import_jsx_runtime27.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(FlowArrow, {}),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: `concatenated \u2192 truncated to ${keyLength}`, value: dkHex, tone: "output" })
          ] }),
          blockDigests.length === 1 && blockDigests[0] !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "= derived key", value: dkHex, tone: "output" })
        ] });
      }
      case "pbkdf2-result": {
        const dkHex = String(view.dkHex);
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DataBlock, { label: "DK", value: dkHex, tone: "output", big: true }) });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/bcrypt.tsx
var import_jsx_runtime28 = __toESM(require_jsx_runtime(), 1);
var id25 = "bcrypt";
var clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? Math.round(v) : lo));
function backendString2(ctx, field) {
  const extra = ctx.result?.extra;
  const v = extra && typeof extra[field] === "string" ? extra[field] : ctx.result?.result;
  return typeof v === "string" ? v : "";
}
var bcryptEngine = {
  id: id25,
  nameKey: "simulation.bcrypt.name",
  demoInputs: { password: "hunter2", rounds: 12 },
  educationalKey: "simulation.bcrypt.educational",
  build(ctx) {
    const password = String(ctx.inputs.password ?? "");
    const rounds = clampInt(Number(ctx.inputs.rounds ?? 12), 4, 31);
    const iterations = Math.pow(2, rounds);
    const boundHash = backendString2(ctx, "hash");
    const pwBytes = strToBytes(password).length;
    const stages = [
      {
        id: `${id25}-input`,
        titleKey: "simulation.bcrypt.input.title",
        descKey: "simulation.bcrypt.input.desc",
        descArgs: { pwBytes },
        phase: "input",
        view: { kind: "bcrypt-input", pwBytes, tooLong: pwBytes > 72 }
      },
      {
        id: `${id25}-salt`,
        titleKey: "simulation.bcrypt.salt.title",
        descKey: "simulation.bcrypt.salt.desc",
        phase: "key",
        view: { kind: "bcrypt-salt", rounds }
      },
      {
        id: `${id25}-cost`,
        titleKey: "simulation.bcrypt.cost.title",
        descKey: "simulation.bcrypt.cost.desc",
        descArgs: { rounds, iterations },
        phase: "key",
        view: { kind: "bcrypt-cost", rounds, iterations }
      },
      {
        id: `${id25}-schedule`,
        titleKey: "simulation.bcrypt.schedule.title",
        descKey: "simulation.bcrypt.schedule.desc",
        descArgs: { iterations },
        phase: "internal",
        view: { kind: "bcrypt-schedule", iterations }
      },
      {
        id: `${id25}-result`,
        titleKey: "simulation.bcrypt.result.title",
        descKey: "simulation.bcrypt.result.desc",
        descArgs: { rounds },
        phase: "output",
        view: { kind: "bcrypt-result", rounds, hash: boundHash }
      }
    ];
    return stages;
  },
  View({ view }) {
    switch (view.kind) {
      case "bcrypt-input": {
        const pwBytes = Number(view.pwBytes);
        const tooLong = Boolean(view.tooLong);
        return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "password (bytes)", value: String(pwBytes), tone: "input", big: true }),
          tooLong && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "lab-note", children: "bcrypt supports at most 72 bytes; longer passwords are rejected" })
        ] });
      }
      case "bcrypt-salt": {
        const rounds = Number(view.rounds);
        return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "salt", value: "16 bytes \xB7 128-bit (CSPRNG)", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "embedded in", value: `$2b$${rounds}$`, tone: "muted" })
        ] });
      }
      case "bcrypt-cost": {
        const rounds = Number(view.rounds);
        const iterations = Number(view.iterations);
        return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "cost", value: String(rounds), tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(FlowArrow, { op: "2^" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "iterations", value: String(iterations), tone: "transform", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "work factor", value: `2^${rounds} = ${iterations} EksBlowfish rounds`, tone: "internal" })
        ] });
      }
      case "bcrypt-schedule": {
        const iterations = Number(view.iterations);
        return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "EksBlowfish", value: `${iterations} key-schedule passes`, tone: "transform", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
            MatrixGrid,
            {
              matrix: [
                ["P[0..17]", "S0[0..255]", "S1[0..255]", "S2[0..255]", "S3[0..255]"]
              ],
              tone: "internal"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "derive", value: "encrypt 'OrpheanBeholderScryDoubt' \u2192 184-bit hash", tone: "output" })
        ] });
      }
      case "bcrypt-result": {
        const rounds = Number(view.rounds);
        const hash = String(view.hash);
        return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "lab-stage-view", children: [
          hash ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "$2b$ hash", value: hash, tone: "output", big: true }) : /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "$2b$ hash", value: `$2b$${rounds}$<22-char salt><31-char hash>`, tone: "output", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "signature", value: `$2b$${rounds}$`, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DataBlock, { label: "hash bits", value: "184 bits \xB7 24 bytes", tone: "muted" })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/scrypt.tsx
var import_jsx_runtime29 = __toESM(require_jsx_runtime(), 1);
var id26 = "scrypt";
var clampInt2 = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? Math.round(v) : lo));
function backendString3(ctx, field) {
  const extra = ctx.result?.extra;
  const v = extra && typeof extra[field] === "string" ? extra[field] : ctx.result?.result;
  return typeof v === "string" ? v : "";
}
function sampledGrid(cols, rows, active) {
  const highlight = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(r === active[0] && c === active[1] ? "X" : "\xB7");
    highlight.push(row);
  }
  return highlight;
}
var scryptEngine = {
  id: id26,
  nameKey: "simulation.scrypt.name",
  demoInputs: { password: "correct horse battery staple", salt: "salty", n: 16384, r: 8, p: 1, key_length: 32 },
  educationalKey: "simulation.scrypt.educational",
  build(ctx) {
    const password = String(ctx.inputs.password ?? "");
    const salt = String(ctx.inputs.salt ?? "");
    const n = clampInt2(Number(ctx.inputs.n ?? 16384), 2, 1048576);
    const r = clampInt2(Number(ctx.inputs.r ?? 8), 1, 64);
    const p = clampInt2(Number(ctx.inputs.p ?? 1), 1, 16);
    const keyLength = clampInt2(Number(ctx.inputs.key_length ?? 32), 1, 128);
    const boundKey = backendString3(ctx, "key_hex");
    const log2N = Math.log2(n);
    const blockSize = 128 * r;
    const memoryBytes = n * r * 128;
    const memoryKiB = memoryBytes / 1024;
    const memoryMiB = memoryBytes / (1024 * 1024);
    const pwBytes = strToBytes(password).length;
    const saltHex = bytesToHex(strToBytes(salt));
    const saltLen = saltHex.length / 2;
    const stages = [
      {
        id: `${id26}-input`,
        titleKey: "simulation.scrypt.input.title",
        descKey: "simulation.scrypt.input.desc",
        descArgs: { pwBytes, saltLen },
        phase: "input",
        view: { kind: "scrypt-input", pwBytes, saltHex, saltLen }
      },
      {
        id: `${id26}-params`,
        titleKey: "simulation.scrypt.params.title",
        descKey: "simulation.scrypt.params.desc",
        descArgs: { n, log2N, r, p, blockSize, memory: memoryKiB, memoryMiB },
        phase: "key",
        view: {
          kind: "scrypt-params",
          n,
          log2N,
          r,
          p,
          blockSize,
          memoryKiB,
          memoryMiB,
          grid: sampledGrid(24, 8, [4, 6])
        }
      },
      {
        id: `${id26}-pre`,
        titleKey: "simulation.scrypt.pre.title",
        descKey: "simulation.scrypt.pre.desc",
        descArgs: { p, blockSize },
        phase: "transform",
        view: { kind: "scrypt-pre", p, blockSize }
      },
      {
        id: `${id26}-romix`,
        titleKey: "simulation.scrypt.romix.title",
        descKey: "simulation.scrypt.romix.desc",
        descArgs: { n, memory: memoryKiB, memoryMiB },
        phase: "internal",
        view: {
          kind: "scrypt-romix",
          n,
          memoryKiB,
          memoryMiB,
          grid: sampledGrid(24, 8, [2, 3])
        }
      },
      {
        id: `${id26}-post`,
        titleKey: "simulation.scrypt.post.title",
        descKey: "simulation.scrypt.post.desc",
        descArgs: { keyLength, p },
        phase: "transform",
        view: { kind: "scrypt-post", keyLength, p }
      },
      {
        id: `${id26}-result`,
        titleKey: "simulation.scrypt.result.title",
        descKey: "simulation.scrypt.result.desc",
        descArgs: { keyLength },
        phase: "output",
        view: { kind: "scrypt-result", keyHex: boundKey }
      }
    ];
    return stages;
  },
  View({ view }) {
    switch (view.kind) {
      case "scrypt-input": {
        const pwBytes = Number(view.pwBytes);
        const saltHex = String(view.saltHex);
        const saltLen = Number(view.saltLen);
        return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "password (bytes)", value: String(pwBytes), tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "salt (bytes)", value: String(saltLen), tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "salt (hex)", value: saltHex, tone: "muted" })
        ] });
      }
      case "scrypt-params": {
        const n = Number(view.n);
        const log2N = Number(view.log2N);
        const r = Number(view.r);
        const p = Number(view.p);
        const blockSize = Number(view.blockSize);
        const memoryKiB = Number(view.memoryKiB);
        const memoryMiB = Number(view.memoryMiB);
        return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "N", value: String(n), tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "N = 2^log2", value: `2^${log2N}`, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "r \xB7 p", value: `${r} \xB7 ${p}`, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "block size", value: `${blockSize} bytes (128\xB7r)`, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "memory", value: `${memoryKiB} KiB \u2248 ${memoryMiB} MiB`, tone: "transform", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "memory map (sampled)", value: `${n} blocks`, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(MatrixGrid, { matrix: view.grid, highlight: [[4, 6]], tone: "internal" })
        ] });
      }
      case "scrypt-pre": {
        const p = Number(view.p);
        const blockSize = Number(view.blockSize);
        return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "PBKDF2-HMAC-SHA-256", value: "1 iteration", tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "initial blocks", value: `${p} lane(s) \xD7 ${blockSize} bytes`, tone: "internal" })
        ] });
      }
      case "scrypt-romix": {
        const n = Number(view.n);
        const memoryKiB = Number(view.memoryKiB);
        const memoryMiB = Number(view.memoryMiB);
        return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "ROMix (memory-hard)", value: `${n} blocks \xB7 Salsa20/8`, tone: "internal", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "memory working set", value: `${memoryKiB} KiB \u2248 ${memoryMiB} MiB`, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(MatrixGrid, { matrix: view.grid, highlight: [[2, 3]], tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("p", { className: "lab-note", children: [
            "grid is a sparse sample; the real map has ",
            n,
            " blocks"
          ] })
        ] });
      }
      case "scrypt-post": {
        const keyLength = Number(view.keyLength);
        const p = Number(view.p);
        return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "PBKDF2-HMAC-SHA-256", value: "final pass", tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "mix lanes", value: `${p} lane(s)`, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "truncate", value: `first ${keyLength} bytes`, tone: "transform" })
        ] });
      }
      case "scrypt-result": {
        const keyHex = String(view.keyHex);
        return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "lab-stage-view", children: keyHex ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "derived key", value: keyHex, tone: "output", big: true }) : /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(DataBlock, { label: "derived key", value: "run the operation to bind the real key", tone: "output", big: true }) });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/argon2.tsx
var import_jsx_runtime30 = __toESM(require_jsx_runtime(), 1);
var id27 = "argon2";
var clampInt3 = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? Math.round(v) : lo));
function backendString4(ctx, field) {
  const extra = ctx.result?.extra;
  const v = extra && typeof extra[field] === "string" ? extra[field] : ctx.result?.result;
  return typeof v === "string" ? v : "";
}
function laneGrid(passes, lanes) {
  const grid = [];
  for (let r = 0; r < passes; r++) {
    const row = [];
    for (let c = 0; c < lanes; c++) row.push("G");
    grid.push(row);
  }
  return grid;
}
var argon2Engine = {
  id: id27,
  nameKey: "simulation.argon2.name",
  demoInputs: {
    password: "correct horse battery staple",
    time_cost: 3,
    memory_cost: 65536,
    parallelism: 2,
    hash_length: 32,
    variant: "argon2id"
  },
  educationalKey: "simulation.argon2.educational",
  build(ctx) {
    const password = String(ctx.inputs.password ?? "");
    const variant = String(ctx.inputs.variant ?? "argon2id");
    const t = clampInt3(Number(ctx.inputs.time_cost ?? 3), 1, 10);
    const m = clampInt3(Number(ctx.inputs.memory_cost ?? 65536), 8, 1048576);
    const p = clampInt3(Number(ctx.inputs.parallelism ?? 2), 1, 16);
    const hashLength = clampInt3(Number(ctx.inputs.hash_length ?? 32), 1, 64);
    const boundTag = backendString4(ctx, "hash");
    const memoryMiB = m / 1024;
    const blocks = m;
    const cells = Math.floor(m / 4);
    const perLaneBlocks = Math.floor(m / (4 * p)) * 4;
    const stages = [
      {
        id: `${id27}-input`,
        titleKey: "simulation.argon2.input.title",
        descKey: "simulation.argon2.input.desc",
        descArgs: { variant, t, m, p },
        phase: "input",
        view: { kind: "argon2-input", passwordBytes: password.length, variant, t, m, p }
      },
      {
        id: `${id27}-params`,
        titleKey: "simulation.argon2.params.title",
        descKey: "simulation.argon2.params.desc",
        descArgs: { m, memoryMiB, blocks, cells },
        phase: "key",
        view: { kind: "argon2-params", m, memoryMiB, blocks, cells, variant }
      },
      {
        id: `${id27}-core`,
        titleKey: "simulation.argon2.core.title",
        descKey: "simulation.argon2.core.desc",
        descArgs: { p, t, m, perLaneBlocks },
        phase: "internal",
        view: { kind: "argon2-core", p, t, m, perLaneBlocks, grid: laneGrid(t, p) }
      },
      {
        id: `${id27}-tag`,
        titleKey: "simulation.argon2.tag.title",
        descKey: "simulation.argon2.tag.desc",
        descArgs: { hashLength },
        phase: "transform",
        view: { kind: "argon2-tag", hashLength, variant }
      },
      {
        id: `${id27}-result`,
        titleKey: "simulation.argon2.result.title",
        descKey: "simulation.argon2.result.desc",
        descArgs: { variant },
        phase: "output",
        view: { kind: "argon2-result", variant, m, t, p, tag: boundTag }
      }
    ];
    return stages;
  },
  View({ view }) {
    switch (view.kind) {
      case "argon2-input": {
        const passwordBytes = Number(view.passwordBytes);
        const variant = String(view.variant);
        const t = Number(view.t);
        const m = Number(view.m);
        const p = Number(view.p);
        return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "password (bytes)", value: String(passwordBytes), tone: "input" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "variant", value: variant, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "t \xB7 m \xB7 p", value: `${t} \xB7 ${m} KiB \xB7 ${p}`, tone: "key" })
        ] });
      }
      case "argon2-params": {
        const m = Number(view.m);
        const memoryMiB = Number(view.memoryMiB);
        const blocks = Number(view.blocks);
        const cells = Number(view.cells);
        const variant = String(view.variant);
        return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "variant", value: variant, tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "memory", value: `${m} KiB \u2248 ${memoryMiB} MiB`, tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "blocks (1 KiB each)", value: String(blocks), tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "grid cells (\u2248 4 KiB each)", value: String(cells), tone: "internal" })
        ] });
      }
      case "argon2-core": {
        const p = Number(view.p);
        const t = Number(view.t);
        const m = Number(view.m);
        const perLaneBlocks = Number(view.perLaneBlocks);
        return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "matrix", value: `${p} lanes \xD7 ${t} passes`, tone: "transform", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "per lane per pass", value: `${perLaneBlocks} blocks`, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "per pass total", value: `${m} blocks`, tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(MatrixGrid, { matrix: view.grid, tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "lab-note", children: "each cell: G \u2014 BLAKE2b compression (password, salt, lane, pass, index)" })
        ] });
      }
      case "argon2-tag": {
        const hashLength = Number(view.hashLength);
        const variant = String(view.variant);
        return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "final column", value: "XOR of last blocks per lane", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(FlowArrow, { op: "H" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: `tag (${hashLength} bytes)`, value: `${variant} \xB7 BLAKE2b`, tone: "transform", big: true })
        ] });
      }
      case "argon2-result": {
        const variant = String(view.variant);
        const m = Number(view.m);
        const t = Number(view.t);
        const p = Number(view.p);
        const tag = String(view.tag);
        return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "lab-stage-view", children: [
          tag ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "PHC hash", value: tag, tone: "output", big: true }) : /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "PHC hash", value: `$${variant}$v=19$m=${m},t=${t},p=${p}$<salt>$<tag>`, tone: "output", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DataBlock, { label: "structure", value: `$${variant}$v=19$m=${m},t=${t},p=${p}$`, tone: "muted" })
        ] });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/hkdf.tsx
var import_jsx_runtime31 = __toESM(require_jsx_runtime(), 1);
var id28 = "hkdf";
function hexCells3(hex, tone, cap) {
  const cells = [];
  for (let i = 0; i + 1 < hex.length && cells.length < cap; i += 2) {
    cells.push({ ch: hex.slice(i, i + 2), tone });
  }
  const bytes = hex.length / 2;
  if (bytes > cap) cells.push({ ch: `+${bytes - cap}`, tone: "muted" });
  return cells;
}
var hkdfEngine = {
  id: id28,
  nameKey: "simulation.hkdf.name",
  demoInputs: { ikm: "shared secret", salt: "salt", info: "context", length: 32 },
  educationalKey: "simulation.hkdf.educational",
  build(ctx) {
    const ikm = String(ctx.inputs.ikm ?? "");
    const salt = String(ctx.inputs.salt ?? "");
    const info = String(ctx.inputs.info ?? "");
    const length = Math.max(1, Math.round(Number(ctx.inputs.length ?? 32)));
    const { prk, outHex, blocks } = hkdfSha256(ikm, salt, info, length);
    const ikmLen = strToBytes(ikm).length;
    const saltHex = bytesToHex(strToBytes(salt));
    const saltLen = saltHex.length / 2;
    const infoLen = strToBytes(info).length;
    const stages = [
      {
        id: `${id28}-input`,
        titleKey: "simulation.hkdf.input.title",
        descKey: "simulation.hkdf.input.desc",
        descArgs: { ikmLen, saltLen, infoLen, length },
        phase: "input",
        view: { kind: "hkdf-input", ikmLen, saltHex, saltLen, infoLen, length }
      },
      {
        id: `${id28}-extract`,
        titleKey: "simulation.hkdf.extract.title",
        descKey: "simulation.hkdf.extract.desc",
        descArgs: { saltLen, ikmLen },
        phase: "key",
        view: { kind: "hkdf-extract", prk, saltHex }
      },
      {
        id: `${id28}-expand`,
        titleKey: "simulation.hkdf.expand.title",
        descKey: "simulation.hkdf.expand.desc",
        descArgs: { blocks: blocks.length, length },
        phase: "internal",
        view: { kind: "hkdf-expand", blocks, info }
      },
      {
        id: `${id28}-concat`,
        titleKey: "simulation.hkdf.concat.title",
        descKey: "simulation.hkdf.concat.desc",
        descArgs: { blocks: blocks.length, length },
        phase: "transform",
        view: { kind: "hkdf-concat", blocks, length, outHex }
      },
      {
        id: `${id28}-result`,
        titleKey: "simulation.hkdf.result.title",
        descKey: "simulation.hkdf.result.desc",
        descArgs: { length },
        phase: "output",
        view: { kind: "hkdf-result", outHex }
      }
    ];
    return stages;
  },
  View({ view }) {
    switch (view.kind) {
      case "hkdf-input": {
        const ikmLen = Number(view.ikmLen);
        const saltHex = String(view.saltHex);
        const saltLen = Number(view.saltLen);
        const infoLen = Number(view.infoLen);
        const length = Number(view.length);
        return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: "ikm (bytes)", value: String(ikmLen), tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(CharRow, { label: "salt", size: "sm", cells: hexCells3(saltHex, "input", 24) }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: "salt (bytes)", value: String(saltLen), tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: "info (bytes)", value: String(infoLen), tone: "muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: "output length", value: String(length), tone: "transform" })
        ] });
      }
      case "hkdf-extract": {
        const prk = String(view.prk);
        const saltHex = String(view.saltHex);
        return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: "PRK = HMAC-SHA-256(salt, ikm)", value: "", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(CharRow, { label: "salt", size: "sm", cells: hexCells3(saltHex, "key", 24) }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: "PRK (32 bytes)", value: prk, tone: "internal", big: true })
        ] });
      }
      case "hkdf-expand": {
        const blocks = view.blocks;
        const info = String(view.info);
        const shown = blocks.slice(0, 6);
        return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "lab-stage-view", children: [
          shown.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "lab-stage-view", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
              CharRow,
              {
                label: `T${i + 1} = HMAC(PRK, T${i} || info || 0x${(i + 1).toString(16).padStart(2, "0")})`,
                size: "sm",
                cells: hexCells3(b, "transform", 16)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: `T${i + 1}`, value: b, tone: "internal" })
          ] }, i)),
          blocks.length > shown.length && /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("p", { className: "lab-note", children: [
            "+",
            blocks.length - shown.length,
            " further block(s) not drawn \u2026"
          ] }),
          info.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("p", { className: "lab-note", children: [
            "info ",
            JSON.stringify(info),
            " mixed into every T block"
          ] })
        ] });
      }
      case "hkdf-concat": {
        const blocks = view.blocks;
        const length = Number(view.length);
        const outHex = String(view.outHex);
        return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "lab-stage-view", children: [
          blocks.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: `T${i + 1}`, value: b, tone: "internal" }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: `concatenated \u2192 first ${length} bytes`, value: outHex, tone: "output" })
        ] });
      }
      case "hkdf-result": {
        const outHex = String(view.outHex);
        return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(DataBlock, { label: "OKM", value: outHex, tone: "output", big: true }) });
      }
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/ecdh.tsx
var import_jsx_runtime32 = __toESM(require_jsx_runtime(), 1);
var id29 = "ecdh";
function toHex(v) {
  return "0x" + v.toString(16);
}
var CURVES = {
  p256: {
    label: "P-256",
    security: "128",
    fields: [
      { name: "p (prime)", value: "0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff" },
      { name: "a", value: toHex(0xffffffff00000001000000000000000000000000fffffffffffffffffffffffcn) },
      { name: "b", value: toHex(0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604bn) },
      { name: "G (x)", value: toHex(0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296n) },
      { name: "G (y)", value: toHex(0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5n) },
      { name: "n (order)", value: "0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551" }
    ]
  },
  p384: {
    label: "P-384",
    security: "192",
    fields: [
      { name: "p (prime)", value: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff" },
      { name: "a", value: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc" },
      { name: "b", value: "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef" },
      { name: "G (x)", value: "0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7" },
      { name: "G (y)", value: "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f" },
      { name: "n (order)", value: "0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973" }
    ]
  },
  p521: {
    label: "P-521",
    security: "256",
    fields: [
      { name: "p (prime)", value: "0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
      { name: "a", value: "0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc" },
      { name: "b", value: "0x051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00" },
      { name: "G (x)", value: "0xc6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66" },
      { name: "G (y)", value: "0x11839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650" },
      { name: "n (order)", value: "0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409" }
    ]
  }
};
var ecdhEngine = {
  id: id29,
  nameKey: "simulation.ecdh.name",
  educationalKey: "simulation.ecdh.educational",
  demoInputs: { curve: "p256", dA: 8, dB: 11 },
  build(ctx) {
    const curve = String(ctx.inputs.curve ?? "p256");
    const curveParams = CURVES[curve] ?? CURVES.p256;
    const extra = ctx.result?.extra;
    const aliceData = extra?.alice;
    const bobData = extra?.bob;
    const dA = typeof aliceData?.private_scalar === "number" ? Number(aliceData.private_scalar) : ctx.inputs.dA != null ? Number(ctx.inputs.dA) : 8;
    const dB = typeof bobData?.private_scalar === "number" ? Number(bobData.private_scalar) : ctx.inputs.dB != null ? Number(ctx.inputs.dB) : 11;
    const aliceHex = typeof aliceData?.public_hex === "string" ? aliceData.public_hex : null;
    const bobHex = typeof bobData?.public_hex === "string" ? bobData.public_hex : null;
    const sharedHex = typeof extra?.shared_secret_hex === "string" ? extra.shared_secret_hex : null;
    return [
      {
        id: `${id29}-curve`,
        titleKey: "simulation.ecdh.curve.title",
        descKey: "simulation.ecdh.curve.desc",
        descArgs: { curve: curveParams.label },
        phase: "input",
        view: { kind: "ecdh-curve", fields: curveParams.fields, security: curveParams.security }
      },
      {
        id: `${id29}-keys`,
        titleKey: "simulation.ecdh.keys.title",
        descKey: "simulation.ecdh.keys.desc",
        descArgs: { dA, dB },
        phase: "key",
        view: { kind: "ecdh-keys", dA, dB, aliceHex, bobHex }
      },
      {
        id: `${id29}-exchange`,
        titleKey: "simulation.ecdh.exchange.title",
        descKey: "simulation.ecdh.exchange.desc",
        descArgs: {},
        phase: "key",
        view: { kind: "ecdh-exchange", aliceHex, bobHex }
      },
      {
        id: `${id29}-shared`,
        titleKey: "simulation.ecdh.shared.title",
        descKey: "simulation.ecdh.shared.desc",
        descArgs: { s: sharedHex ?? "aB = bA" },
        phase: "output",
        view: { kind: "ecdh-shared", shared: sharedHex }
      }
    ];
  },
  View({ view, ctx }) {
    void ctx;
    switch (view.kind) {
      case "ecdh-curve": {
        const fields = view.fields;
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-ec-curve", dir: "ltr", "aria-hidden": "true", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "lab-ec-axis-y" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "lab-ec-axis-x" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "lab-ec-curve-line" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "lab-ec-base-point", title: "base point G" })
            ] }),
            fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(DataBlock, { label: f.name, value: f.value, tone: "internal" }, f.name))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(DataBlock, { label: "security", value: `~${String(view.security)} bits`, tone: "muted" })
        ] });
      }
      case "ecdh-keys":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-dh-channel", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-agent-card", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "lab-card-title", children: "Alice" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(DataBlock, { label: "dA", value: String(view.dA), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(FlowArrow, { op: "A = dA*G" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
              DataBlock,
              {
                label: "public A",
                value: view.aliceHex ? `${String(view.aliceHex).slice(0, 24)}...` : "dA*G (structural)",
                tone: "output"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-agent-card", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "lab-card-title", children: "Bob" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(DataBlock, { label: "dB", value: String(view.dB), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(FlowArrow, { op: "B = dB*G" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
              DataBlock,
              {
                label: "public B",
                value: view.bobHex ? `${String(view.bobHex).slice(0, 24)}...` : "dB*G (structural)",
                tone: "output"
              }
            )
          ] })
        ] }) });
      case "ecdh-exchange":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-dh-channel", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "lab-card-title", children: "Alice" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                DataBlock,
                {
                  label: "public A (sent)",
                  value: view.aliceHex ? `${String(view.aliceHex).slice(0, 16)}...` : "A",
                  tone: "output"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-dh-wire", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "lab-dh-arrow", children: "A" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "lab-dh-arrow-rev", children: "B" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "lab-card-title", children: "Bob" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                DataBlock,
                {
                  label: "public B (sent)",
                  value: view.bobHex ? `${String(view.bobHex).slice(0, 16)}...` : "B",
                  tone: "output"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
            DataBlock,
            {
              label: "note",
              value: "Only public points cross the wire; an eavesdropper cannot recover dA / dB",
              tone: "muted"
            }
          )
        ] });
      case "ecdh-shared":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-dh-channel", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "lab-card-title", children: "Alice" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                DataBlock,
                {
                  label: "S = dA*B",
                  value: view.shared ? `${String(view.shared).slice(0, 32)}...` : "a (dA*B)",
                  tone: "output",
                  big: true
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "lab-card-title", children: "Bob" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                DataBlock,
                {
                  label: "S = dB*A",
                  value: view.shared ? `${String(view.shared).slice(0, 32)}...` : "a (dB*A)",
                  tone: "output",
                  big: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
            DataBlock,
            {
              label: "shared secret",
              value: view.shared ? String(view.shared) : "x-coordinate of aG*bG",
              tone: "output",
              big: true
            }
          )
        ] });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/x25519.tsx
var import_jsx_runtime33 = __toESM(require_jsx_runtime(), 1);
var id30 = "x25519";
var RFC7748_ALICE = "77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a";
var RFC7748_BOB = "5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb";
function clampNote(hex) {
  const bytes = (hex.match(/.{2}/g) ?? []).slice(0, 32).map((byte) => parseInt(byte, 16));
  const b0 = (bytes[0] ?? 0) & 248;
  const b31 = (bytes[31] ?? 0) & 127 | 64;
  return `clamped: b0=${b0.toString(16).padStart(2, "0")}, b31=${b31.toString(16).padStart(2, "0")}`;
}
var x25519Engine = {
  id: id30,
  nameKey: "simulation.x25519.name",
  educationalKey: "simulation.x25519.educational",
  demoInputs: { a_private: RFC7748_ALICE, b_private: RFC7748_BOB },
  build(ctx) {
    const extra = ctx.result?.extra;
    const aliceData = extra?.alice;
    const bobData = extra?.bob;
    const defaultAlicePriv = typeof aliceData?.private_hex === "string" ? aliceData.private_hex : RFC7748_ALICE;
    const defaultBobPriv = typeof bobData?.private_hex === "string" ? bobData.private_hex : RFC7748_BOB;
    const aPriv = ctx.inputs.a_private ? String(ctx.inputs.a_private) : defaultAlicePriv;
    const bPriv = ctx.inputs.b_private ? String(ctx.inputs.b_private) : defaultBobPriv;
    const aPub = typeof aliceData?.public_hex === "string" ? aliceData.public_hex : "x25(a)";
    const bPub = typeof bobData?.public_hex === "string" ? bobData.public_hex : "x25(b)";
    const sharedHex = typeof extra?.shared_secret_hex === "string" ? extra.shared_secret_hex : null;
    return [
      {
        id: `${id30}-curve`,
        titleKey: "simulation.x25519.curve.title",
        descKey: "simulation.x25519.curve.desc",
        descArgs: {},
        phase: "input",
        view: { kind: "x25519-curve" }
      },
      {
        id: `${id30}-keys`,
        titleKey: "simulation.x25519.keys.title",
        descKey: "simulation.x25519.keys.desc",
        descArgs: {},
        phase: "key",
        view: { kind: "x25519-keys", aPriv, bPriv, aPub, bPub }
      },
      {
        id: `${id30}-ladder`,
        titleKey: "simulation.x25519.ladder.title",
        descKey: "simulation.x25519.ladder.desc",
        descArgs: {},
        phase: "transform",
        view: {
          kind: "x25519-ladder",
          aPriv,
          bPriv,
          clampA: clampNote(aPriv),
          clampB: clampNote(bPriv)
        }
      },
      {
        id: `${id30}-shared`,
        titleKey: "simulation.x25519.shared.title",
        descKey: "simulation.x25519.shared.desc",
        descArgs: {},
        phase: "output",
        view: { kind: "x25519-shared", shared: sharedHex }
      }
    ];
  },
  View({ view, ctx }) {
    void ctx;
    switch (view.kind) {
      case "x25519-curve":
        return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "curve", value: "Curve25519 (Montgomery)", tone: "internal", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "form", value: "y^2 = x^3 + 486662*x^2 + x", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "base point", value: "u = 9 (x-coordinate only)", tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "field prime p", value: "2^255 - 19", tone: "internal" })
        ] }) });
      case "x25519-keys":
        return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-dh-channel", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-agent-card", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "lab-card-title", children: "Alice" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "private (hex)", value: String(view.aPriv), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(FlowArrow, { op: "X25519" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "public", value: String(view.aPub), tone: "output" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-agent-card", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "lab-card-title", children: "Bob" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "private (hex)", value: String(view.bPriv), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(FlowArrow, { op: "X25519" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "public", value: String(view.bPub), tone: "output" })
          ] })
        ] }) });
      case "x25519-ladder":
        return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "Alice clamp", value: String(view.clampA), tone: "transform" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DataBlock, { label: "Bob clamp", value: String(view.clampB), tone: "transform" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "lab-ec-plane", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(FlowArrow, { op: "Montgomery ladder" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
            DataBlock,
            {
              label: "identity",
              value: "[1, u, 1] -> ladder iterations -> u-coordinate result",
              tone: "internal"
            }
          )
        ] });
      case "x25519-shared":
        return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-dh-channel", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "lab-card-title", children: "Alice" }),
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
                DataBlock,
                {
                  label: "S = X25519(a, B)",
                  value: view.shared && String(view.shared).length > 16 ? `${String(view.shared).slice(0, 16)}...` : "X25519(a,B)",
                  tone: "output",
                  big: true
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "lab-card-title", children: "Bob" }),
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
                DataBlock,
                {
                  label: "S = X25519(b, A)",
                  value: view.shared && String(view.shared).length > 16 ? `${String(view.shared).slice(0, 16)}...` : "X25519(b,A)",
                  tone: "output",
                  big: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
            DataBlock,
            {
              label: "shared secret (32 bytes)",
              value: view.shared ? String(view.shared) : "binding unavailable in demo",
              tone: "internal",
              big: true
            }
          )
        ] });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/ecdsa.tsx
var import_jsx_runtime34 = __toESM(require_jsx_runtime(), 1);
var id31 = "ecdsa";
var CURVE_LABEL = {
  p256: "P-256",
  p384: "P-384",
  p521: "P-521"
};
var ecdsaEngine = {
  id: id31,
  nameKey: "simulation.ecdsa.name",
  educationalKey: "simulation.ecdsa.educational",
  demoInputs: { message: "Message to sign", curve: "p256" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "Message to sign");
    const curve = String(ctx.inputs.curve ?? "p256");
    const extra = ctx.result?.extra;
    const rHex = extra && typeof extra.r === "number" ? `0x${Number(extra.r).toString(16)}` : null;
    const sHex = extra && typeof extra.s === "number" ? `0x${Number(extra.s).toString(16)}` : null;
    const sigHex = typeof extra?.signature_hex === "string" ? extra.signature_hex : null;
    const privScalar = typeof extra?.private_scalar === "number" ? Number(extra.private_scalar) : null;
    const pubHex = typeof extra?.public_hex === "string" ? extra.public_hex : null;
    return [
      {
        id: `${id31}-keygen`,
        titleKey: "simulation.ecdsa.keygen.title",
        descKey: "simulation.ecdsa.keygen.desc",
        descArgs: { curve: CURVE_LABEL[curve] ?? curve },
        phase: "key",
        view: { kind: "ecdsa-keygen", priv: privScalar, curve: CURVE_LABEL[curve] ?? curve }
      },
      {
        id: `${id31}-hash`,
        titleKey: "simulation.ecdsa.hash.title",
        descKey: "simulation.ecdsa.hash.desc",
        descArgs: { message },
        phase: "transform",
        view: { kind: "ecdsa-hash", message }
      },
      {
        id: `${id31}-sign`,
        titleKey: "simulation.ecdsa.sign.title",
        descKey: "simulation.ecdsa.sign.desc",
        descArgs: {},
        phase: "transform",
        view: { kind: "ecdsa-sign", rHex, sHex, sigHex }
      },
      {
        id: `${id31}-verify`,
        titleKey: "simulation.ecdsa.verify.title",
        descKey: "simulation.ecdsa.verify.desc",
        descArgs: {},
        phase: "output",
        view: { kind: "ecdsa-verify", pubHex }
      }
    ];
  },
  View({ view, ctx }) {
    void ctx;
    switch (view.kind) {
      case "ecdsa-keygen":
        return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "curve", value: String(view.curve), tone: "internal", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "private scalar d", value: view.priv != null ? String(view.priv) : "random", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(FlowArrow, { op: "Q = d*G" }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "public point Q", value: "(xQ, yQ)", tone: "output" })
        ] }) });
      case "ecdsa-hash":
        return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
            CharRow,
            {
              label: "message",
              cells: String(view.message).split("").map((ch) => ({ ch, tone: "input" }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(FlowArrow, { op: "SHA-256 (truncated to curve order n)" }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "z (int digest)", value: "SHA-256(message)", tone: "transform" })
        ] });
      case "ecdsa-sign":
        return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "k", value: "random per-message", tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "R = k*G", value: "(xR, yR)", tone: "internal" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "r = xR mod n", value: view.rHex ? String(view.rHex) : "structural", tone: "output" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "s = k^-1(z + r*d) mod n", value: view.sHex ? String(view.sHex) : "structural", tone: "output" })
          ] }),
          typeof view.sigHex === "string" && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "lab-ec-plane", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "signature (DER hex)", value: String(view.sigHex), tone: "output", big: true }) })
        ] });
      case "ecdsa-verify":
        return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
              DataBlock,
              {
                label: "verify",
                value: "w = s^-1 mod n; u1 = z*w; u2 = r*w; P = u1*G + u2*Q; OK if P.x mod n == r",
                tone: "internal"
              }
            ),
            typeof view.pubHex === "string" && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "public point", value: String(view.pubHex), tone: "output" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "lab-ec-plane", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(DataBlock, { label: "note", value: "ECDSA signs (authenticates) - it does NOT encrypt the message", tone: "muted" }) })
        ] });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/ed25519.tsx
var import_jsx_runtime35 = __toESM(require_jsx_runtime(), 1);
var id32 = "ed25519";
var DEMO_PUB = "structural A = a*B";
var ed25519Engine = {
  id: id32,
  nameKey: "simulation.ed25519.name",
  educationalKey: "simulation.ed25519.educational",
  demoInputs: { message: "Message to sign", private_hex: "" },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "Message to sign");
    const privateHex = String(ctx.inputs.private_hex ?? "");
    const extra = ctx.result?.extra;
    const pubHex = typeof extra?.public_hex === "string" ? extra.public_hex : null;
    const sigHex = typeof extra?.signature_hex === "string" ? extra.signature_hex : null;
    const boundPrivHex = typeof extra?.private_hex === "string" ? extra.private_hex : null;
    const rHex = sigHex ? sigHex.slice(0, 64) : null;
    const sHex = sigHex && sigHex.length > 64 ? sigHex.slice(64) : null;
    const effectivePriv = privateHex.length > 0 ? privateHex : boundPrivHex ?? "";
    return [
      {
        id: `${id32}-keygen`,
        titleKey: "simulation.ed25519.keygen.title",
        descKey: "simulation.ed25519.keygen.desc",
        descArgs: {},
        phase: "key",
        view: { kind: "ed25519-keygen", privateHex: effectivePriv, pubHex }
      },
      {
        id: `${id32}-hash`,
        titleKey: "simulation.ed25519.hash.title",
        descKey: "simulation.ed25519.hash.desc",
        descArgs: { message },
        phase: "transform",
        view: { kind: "ed25519-hash", message }
      },
      {
        id: `${id32}-derivation`,
        titleKey: "simulation.ed25519.derivation.title",
        descKey: "simulation.ed25519.derivation.desc",
        descArgs: {},
        phase: "transform",
        view: { kind: "ed25519-derivation" }
      },
      {
        id: `${id32}-sign`,
        titleKey: "simulation.ed25519.sign.title",
        descKey: "simulation.ed25519.sign.desc",
        descArgs: {},
        phase: "transform",
        view: { kind: "ed25519-sign", rHex, sHex, sigHex }
      },
      {
        id: `${id32}-result`,
        titleKey: "simulation.ed25519.result.title",
        descKey: "simulation.ed25519.result.desc",
        descArgs: {},
        phase: "output",
        view: { kind: "ed25519-result", sigHex }
      }
    ];
  },
  View({ view, ctx }) {
    void ctx;
    switch (view.kind) {
      case "ed25519-keygen":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "private key (32 bytes)", value: String(view.privateHex) || "(blank = auto)", tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(FlowArrow, { op: "SHA-512 -> clamp -> scalar a" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "public A = a*B", value: view.pubHex ? String(view.pubHex) : DEMO_PUB, tone: "output" })
        ] }) });
      case "ed25519-hash":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "lab-ec-plane", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "message (M)", value: String(view.message), tone: "input", big: true }) }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(FlowArrow, { op: "SHA-512(message)" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "lab-ec-plane", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "nonce r", value: "sha512(prefix || message)", tone: "transform" }) })
        ] });
      case "ed25519-derivation":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "R = r*B", value: "structural (curve point)", tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "h = SHA-512(R || A || M)", value: "structural", tone: "transform" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "S = (r + h*a) mod L", value: "structural", tone: "output" })
        ] }) });
      case "ed25519-sign":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "R (32 bytes)", value: view.rHex ? String(view.rHex) : "structural", tone: "output" }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "S (32 bytes)", value: view.sHex ? String(view.sHex) : "structural", tone: "output" })
          ] }),
          typeof view.sigHex === "string" && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "signature (64 bytes)", value: String(view.sigHex), tone: "output", big: true })
        ] });
      case "ed25519-result":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "scheme", value: "Ed25519 is a SIGNATURE scheme, NOT encryption", tone: "key", big: true }),
          typeof view.sigHex === "string" && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(DataBlock, { label: "signature", value: String(view.sigHex), tone: "output", big: true })
        ] }) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/rsa.tsx
var import_jsx_runtime36 = __toESM(require_jsx_runtime(), 1);
var id33 = "rsa";
function encodeToCells(message) {
  return message.toUpperCase().replace(/[^A-Z]/g, "").split("").map((ch) => ({
    ch,
    tone: "input",
    note: `${ch} -> ${ch.charCodeAt(0) - 64}`
  }));
}
function toBase27Cells(value) {
  const digits = [];
  let x = value;
  while (x > 0) {
    digits.unshift(x % 27);
    x = Math.floor(x / 27);
  }
  return digits.map((v, i) => ({
    ch: v === 0 ? " " : String.fromCharCode(64 + v),
    tone: "transform",
    note: `digit[${i}] = ${v}`
  }));
}
var rsaEngine = {
  id: id33,
  nameKey: "simulation.rsa.name",
  educationalKey: "simulation.rsa.educational",
  demoInputs: { message: "HI", p: 61, q: 53, e: 65537 },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "HI");
    const p = Number(ctx.inputs.p ?? 61);
    const q = Number(ctx.inputs.q ?? 53);
    const eInput = ctx.inputs.e != null ? Number(ctx.inputs.e) : 65537;
    const extra = ctx.result?.extra;
    const pValid = isPrime(p);
    const qValid = isPrime(q);
    const primesDistinct = p !== q;
    const primesOk = pValid && qValid && primesDistinct;
    if (!primesOk) {
      const reasons = [];
      if (!pValid) reasons.push(`p = ${p} is not prime`);
      if (!qValid) reasons.push(`q = ${q} is not prime`);
      if (!primesDistinct) reasons.push("p and q must be distinct");
      return [
        {
          id: `${id33}-error`,
          titleKey: "simulation.rsa.error.title",
          descKey: "simulation.rsa.error.desc",
          descArgs: { reasons: reasons.join("; ") },
          phase: "input",
          view: { kind: "rsa-error", reasons }
        }
      ];
    }
    const keys = rsaKeygen(p, q, eInput);
    const { n, phi, e, d } = keys;
    const encoding = rsaEncode(message);
    const M = encoding.m;
    const tooLarge = M >= n;
    if (tooLarge) {
      return [
        {
          id: `${id33}-error`,
          titleKey: "simulation.rsa.error.title",
          descKey: "simulation.rsa.error.too_large",
          descArgs: { message, n },
          phase: "input",
          view: { kind: "rsa-error", reasons: [`M = ${M} >= n = ${n}: message too long`] }
        }
      ];
    }
    const encryptPow = modPowSteps(BigInt(M), BigInt(e), BigInt(n));
    const C = Number(encryptPow.result);
    let Cp = C;
    let recoveredM = M;
    let decryptResult = "";
    if (extra && typeof extra.cipher === "number") {
      Cp = extra.cipher;
      const decryptPow = modPowSteps(BigInt(Cp), BigInt(d), BigInt(n));
      recoveredM = Number(decryptPow.result);
      decryptResult = rsaDecode(recoveredM);
    } else {
      const decryptPow = modPowSteps(BigInt(C), BigInt(d), BigInt(n));
      recoveredM = Number(decryptPow.result);
      decryptResult = rsaDecode(recoveredM);
      Cp = C;
    }
    const msgCells = encodeToCells(message);
    const m27Cells = toBase27Cells(M);
    const encryptRows = encryptPow.rows.map((r, i) => ({
      label: `bit ${i}`,
      cells: [
        { ch: r.bit, tone: "key", note: `bit = ${r.bit}` },
        { ch: r.square, tone: "transform", note: "squared" },
        ...r.multiply ? [{ ch: r.multiply, tone: "output", note: "multiply" }] : [{ ch: "-", tone: "muted", note: "skip" }]
      ]
    }));
    return [
      {
        id: `${id33}-keygen`,
        titleKey: "simulation.rsa.keygen.title",
        descKey: "simulation.rsa.keygen.desc",
        descArgs: { p, q },
        phase: "key",
        view: {
          kind: "rsa-keygen",
          n,
          phi,
          e,
          d,
          p,
          q,
          gcdCheck: Number(gcdBig(BigInt(e), BigInt(phi))),
          eNote: keys.eNote
        }
      },
      {
        id: `${id33}-encode`,
        titleKey: "simulation.rsa.encode.title",
        descKey: "simulation.rsa.encode.desc",
        descArgs: { message, M },
        phase: "input",
        view: {
          kind: "rsa-encode",
          message,
          M,
          msgCells,
          m27Cells
        }
      },
      {
        id: `${id33}-encrypt`,
        titleKey: "simulation.rsa.encrypt.title",
        descKey: "simulation.rsa.encrypt.desc",
        descArgs: { M, e, n },
        phase: "transform",
        view: {
          kind: "rsa-encrypt",
          M,
          e,
          n,
          C,
          encryptRows,
          bits: encryptPow.bits
        }
      },
      {
        id: `${id33}-decrypt`,
        titleKey: "simulation.rsa.decrypt.title",
        descKey: "simulation.rsa.decrypt.desc",
        descArgs: { C: Cp, d, n },
        phase: "transform",
        view: {
          kind: "rsa-decrypt",
          C: Cp,
          d,
          n,
          M: recoveredM,
          result: decryptResult
        }
      },
      {
        id: `${id33}-result`,
        titleKey: "simulation.rsa.result.title",
        descKey: "simulation.rsa.result.desc",
        descArgs: { out: decryptResult },
        phase: "output",
        view: { kind: "rsa-result", text: decryptResult }
      }
    ];
  },
  View({ view, ctx }) {
    void ctx;
    switch (view.kind) {
      case "rsa-error":
        return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "Error", value: view.reasons.join("; "), tone: "muted", big: true }) });
      case "rsa-keygen":
        return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "p", value: String(view.p), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "q", value: String(view.q), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(FlowArrow, { op: "*" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "n = p x q", value: String(view.n), tone: "internal", big: true })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "phi(n)", value: String(view.phi), tone: "internal" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(FlowArrow, {}),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: `gcd(e, phi)`, value: String(view.gcdCheck), tone: "internal" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "e (public)", value: String(view.e), tone: "key", big: true }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "d (private)", value: String(view.d), tone: "output", big: true })
          ] }),
          Boolean(view.eNote) && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "Note", value: String(view.eNote), tone: "muted" })
        ] });
      case "rsa-encode":
        return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            CharRows,
            {
              rows: [
                { label: "Text", cells: view.msgCells },
                { label: "Base27", cells: view.m27Cells }
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "M (integer)", value: String(view.M), tone: "output", big: true })
        ] });
      case "rsa-encrypt":
        return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "M", value: String(view.M), tone: "input" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "e", value: String(view.e), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "n", value: String(view.n), tone: "internal" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(FlowArrow, { op: "M^e mod n" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "lab-ec-row", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            CharRows,
            {
              rows: view.encryptRows
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "C", value: String(view.C), tone: "output", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "textbook note", value: "Textbook RSA (no padding) - OAEP required in practice", tone: "muted" })
        ] });
      case "rsa-decrypt":
        return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "C", value: String(view.C), tone: "input" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "d", value: String(view.d), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "n", value: String(view.n), tone: "internal" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(FlowArrow, { op: "C^d mod n" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "M'", value: String(view.M), tone: "output" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(FlowArrow, {}),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "Plaintext", value: String(view.result), tone: "output", big: true })
        ] });
      case "rsa-result":
        return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(DataBlock, { label: "Decrypted", value: String(view.text), tone: "output", big: true }) });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/diffieHellman.tsx
var import_jsx_runtime37 = __toESM(require_jsx_runtime(), 1);
var id34 = "diffie_hellman";
var diffieHellmanEngine = {
  id: id34,
  nameKey: "simulation.diffie_hellman.name",
  educationalKey: "simulation.diffie_hellman.educational",
  demoInputs: { p: 23, g: 5, a_private: 6, b_private: 15 },
  build(ctx) {
    const p = Number(ctx.inputs.p ?? 23);
    const g = Number(ctx.inputs.g ?? 5);
    const a = Number(ctx.inputs.a_private ?? 6);
    const b = Number(ctx.inputs.b_private ?? 15);
    const extra = ctx.result?.extra;
    const pValid = isPrime(p);
    const paramsOk = pValid && g >= 2 && g <= p - 1;
    if (!paramsOk) {
      const reason = pValid ? "g out of range" : `p = ${p} not prime`;
      return [
        {
          id: `${id34}-error`,
          titleKey: "simulation.diffie_hellman.error.title",
          descKey: "simulation.diffie_hellman.error.desc",
          descArgs: { p },
          phase: "input",
          view: { kind: "dh-error", reason }
        }
      ];
    }
    const aloud = Math.min(a % (p - 1), 30);
    const bloud = Math.min(b % (p - 1), 30);
    const A = Number(modPowBig(BigInt(g), BigInt(aloud), BigInt(p)));
    const B = Number(modPowBig(BigInt(g), BigInt(bloud), BigInt(p)));
    const sAlice = Number(modPowBig(BigInt(B), BigInt(aloud), BigInt(p)));
    const sBob = Number(modPowBig(BigInt(A), BigInt(bloud), BigInt(p)));
    const boundShared = extra && typeof extra.shared_secret === "number" ? Number(extra.shared_secret) : null;
    const boundAlicePub = extra && typeof extra.alice?.public_value === "number" ? Number(extra.alice.public_value) : null;
    const boundBobPub = extra && typeof extra.bob?.public_value === "number" ? Number(extra.bob.public_value) : null;
    const displayA = boundAlicePub ?? A;
    const displayB = boundBobPub ?? B;
    const displayShared = boundShared ?? sAlice;
    return [
      {
        id: `${id34}-params`,
        titleKey: "simulation.diffie_hellman.params.title",
        descKey: "simulation.diffie_hellman.params.desc",
        descArgs: { p, g },
        phase: "input",
        view: { kind: "dh-params", p, g, primeCheck: pValid }
      },
      {
        id: `${id34}-alice-pub`,
        titleKey: "simulation.diffie_hellman.alicePub.title",
        descKey: "simulation.diffie_hellman.alicePub.desc",
        descArgs: { a: aloud, g, p },
        phase: "transform",
        view: { kind: "dh-party", name: "Alice", priv: aloud, pub: displayA, p, g }
      },
      {
        id: `${id34}-bob-pub`,
        titleKey: "simulation.diffie_hellman.bobPub.title",
        descKey: "simulation.diffie_hellman.bobPub.desc",
        descArgs: { b: bloud, g, p },
        phase: "transform",
        view: { kind: "dh-party", name: "Bob", priv: bloud, pub: displayB, p, g }
      },
      {
        id: `${id34}-exchange`,
        titleKey: "simulation.diffie_hellman.exchange.title",
        descKey: "simulation.diffie_hellman.exchange.desc",
        descArgs: { A: displayA, B: displayB },
        phase: "key",
        view: { kind: "dh-exchange", A: displayA, B: displayB }
      },
      {
        id: `${id34}-shared`,
        titleKey: "simulation.diffie_hellman.shared.title",
        descKey: "simulation.diffie_hellman.shared.desc",
        descArgs: { s: displayShared },
        phase: "output",
        view: { kind: "dh-shared", aPriv: a, bPriv: b, s: displayShared, match: sAlice === sBob }
      }
    ];
  },
  View({ view, ctx }) {
    void ctx;
    switch (view.kind) {
      case "dh-error":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "Error", value: String(view.reason), tone: "muted", big: true }) });
      case "dh-params":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "p (prime)", value: String(view.p), tone: "internal", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "g (generator)", value: String(view.g), tone: "key", big: true })
        ] }) });
      case "dh-party":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-stage-view", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: `lab-card lab-card-${String(view.name).toLowerCase()}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-card-title", children: String(view.name) }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "private", value: String(view.priv), tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(FlowArrow, { op: "g^priv mod p" }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "public", value: String(view.pub), tone: "output", big: true })
        ] }) });
      case "dh-exchange":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-dh-channel", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-card-title", children: "Alice" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "public A", value: String(view.A), tone: "output" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-dh-wire", children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "lab-dh-arrow", children: "A" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "lab-dh-arrow-rev", children: "B" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-card-title", children: "Bob" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "public B", value: String(view.B), tone: "output" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            DataBlock,
            {
              label: "channel",
              value: "public only: A -> Bob, B -> Alice",
              tone: "muted"
            }
          )
        ] });
      case "dh-shared":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-dh-channel", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-card-title", children: "Alice" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "s = B^a mod p", value: String(view.s), tone: "output", big: true })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-ec-plane", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(FlowArrow, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "lab-agent-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "lab-card-title", children: "Bob" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DataBlock, { label: "s = A^b mod p", value: String(view.s), tone: "output", big: true })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            DataBlock,
            {
              label: "shared secret",
              value: view.match ? `MATCH = ${String(view.s)}` : String(view.s),
              tone: "output",
              big: true
            }
          )
        ] });
      default:
        return null;
    }
  }
};

// src/components/simulation/renderers/elgamal.tsx
var import_jsx_runtime38 = __toESM(require_jsx_runtime(), 1);
var id35 = "elgamal";
function demoCompute(message, p, g, x) {
  const pr = Math.max(p, 3);
  const pp = BigInt(pr);
  const gp = BigInt(g);
  const xp = BigInt(x ?? 1);
  const y = Number(modPowBig(gp, xp, pp));
  const msgLetters = upperLetters(message).split("");
  const m = msgLetters.length ? msgLetters.slice(0, 10).reduce((acc, ch) => acc * 27 + (ch.charCodeAt(0) - 64), 0) : 42;
  const k = Math.max(1, (m + 2) % (pr - 1));
  const c1 = Number(modPowBig(gp, BigInt(k), pp));
  const yk = Number(modPowBig(BigInt(y), BigInt(k), pp));
  const c2 = m * yk % pr;
  return { p: pr, g, x: x ?? 1, y, m, k, c1, yk, c2, c1Bound: null, c2Bound: null };
}
function decodeM(c2, c1, x, p) {
  const c1x = Number(modPowBig(BigInt(c1), BigInt(x), BigInt(p)));
  let inv = 0;
  for (let t = 0; t < p; t++) {
    if (c1x * t % p === 1) {
      inv = t;
      break;
    }
  }
  return c2 * inv % p;
}
var elgamalEngine = {
  id: id35,
  nameKey: "simulation.elgamal.name",
  educationalKey: "simulation.elgamal.educational",
  demoInputs: { message: "HI", p: 467, g: 2, x: 127 },
  build(ctx) {
    const message = String(ctx.inputs.message ?? "HI");
    const p0 = ctx.inputs.p != null ? Number(ctx.inputs.p) : 467;
    const g = ctx.inputs.g != null ? Number(ctx.inputs.g) : 2;
    const x = ctx.inputs.x != null ? Number(ctx.inputs.x) : 127;
    const extra = ctx.result?.extra;
    const stepsValues = extra?.steps_values;
    const cipherInfo = extra?.cipher;
    const encParams = ctx.result?.parameters;
    let values;
    if (extra && stepsValues && typeof stepsValues.y === "number") {
      values = {
        p: Number(encParams?.p ?? p0),
        g: Number(encParams?.g ?? g),
        x: Number(encParams?.x ?? x),
        y: Number(stepsValues.y),
        m: Number(stepsValues.m ?? 0),
        k: Number(stepsValues.k ?? 0),
        c1: Number(stepsValues.c1),
        yk: Number(stepsValues.y_k ?? 1),
        c2: Number(stepsValues.c2),
        c1Bound: typeof cipherInfo?.c1 === "number" ? Number(cipherInfo.c1) : null,
        c2Bound: typeof cipherInfo?.c2 === "number" ? Number(cipherInfo.c2) : null
      };
    } else {
      values = demoCompute(message, p0, g, Number.isFinite(x) ? x : null);
    }
    const pr = values.p;
    const useC1 = values.c1Bound ?? values.c1;
    const useC2 = values.c2Bound ?? values.c2;
    let mRecovered = null;
    if (values.c1Bound !== null && values.c2Bound !== null) {
      mRecovered = decodeM(values.c2Bound, values.c1Bound, values.x, pr);
    }
    return [
      {
        id: `${id35}-keygen`,
        titleKey: "simulation.elgamal.keygen.title",
        descKey: "simulation.elgamal.keygen.desc",
        descArgs: { p: pr, g, x: values.x },
        phase: "key",
        view: { kind: "elgamal-keygen", p: pr, g, x: values.x, y: values.y }
      },
      {
        id: `${id35}-encode`,
        titleKey: "simulation.elgamal.encode.title",
        descKey: "simulation.elgamal.encode.desc",
        descArgs: { message, m: values.m, p: pr },
        phase: "input",
        view: { kind: "elgamal-encode", message, m: values.m }
      },
      {
        id: `${id35}-ephemeral`,
        titleKey: "simulation.elgamal.ephemeral.title",
        descKey: "simulation.elgamal.ephemeral.desc",
        descArgs: { k: values.k },
        phase: "key",
        view: { kind: "elgamal-ephemeral", k: values.k, p: pr, g }
      },
      {
        id: `${id35}-encrypt`,
        titleKey: "simulation.elgamal.encrypt.title",
        descKey: "simulation.elgamal.encrypt.desc",
        descArgs: { y: values.y, k: values.k, m: values.m, g, p: pr },
        phase: "transform",
        view: {
          kind: "elgamal-encrypt",
          p: pr,
          g,
          x: values.x,
          y: values.y,
          m: values.m,
          k: values.k,
          c1: useC1,
          yk: values.yk,
          c2: useC2,
          bound: values.c1Bound !== null || values.c2Bound !== null
        }
      },
      {
        id: `${id35}-decrypt`,
        titleKey: "simulation.elgamal.decrypt.title",
        descKey: "simulation.elgamal.decrypt.desc",
        descArgs: { x: values.x, p: pr },
        phase: "transform",
        view: {
          kind: "elgamal-decrypt",
          x: values.x,
          p: pr,
          c1: useC1,
          c2: useC2,
          m: mRecovered
        }
      },
      {
        id: `${id35}-formula`,
        titleKey: "simulation.elgamal.formula.title",
        descKey: ctx.language === "ar" ? "simulation.elgamal.formula.descAr" : "simulation.elgamal.formula.desc",
        descArgs: { p: pr, g, x: values.x },
        phase: "key",
        view: {
          kind: "elgamal-formula",
          p: pr,
          g,
          x: values.x,
          y: values.y
        }
      }
    ];
  },
  View({ view, ctx }) {
    void ctx;
    switch (view.kind) {
      case "elgamal-keygen":
        return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-ec-plane", children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "p", value: String(view.p), tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "g", value: String(view.g), tone: "internal" }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "x (private)", value: String(view.x), tone: "key" }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FlowArrow, { op: "y = g^x mod p" }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "y (public)", value: String(view.y), tone: "output", big: true })
        ] });
      case "elgamal-encode":
        return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
            CharRow,
            {
              label: "text",
              cells: String(view.message).toUpperCase().split("").map((ch) => ({
                ch,
                tone: "input",
                note: `${ch} -> ${ch.charCodeAt(0) - 64}`
              }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "M (integer)", value: String(view.m), tone: "output" })
        ] });
      case "elgamal-ephemeral":
        return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "k (ephemeral)", value: String(view.k), tone: "key", big: true }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "g", value: String(view.g), tone: "internal" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "k", value: String(view.k), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "p", value: String(view.p), tone: "internal" })
          ] })
        ] });
      case "elgamal-encrypt":
        return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "c1 = g^k mod p", value: String(view.c1), tone: "transform", big: true }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FlowArrow, {}),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "c2 = m * y^k mod p", value: String(view.c2), tone: "output", big: true })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "y", value: String(view.y), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "k", value: String(view.k), tone: "key" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "m", value: String(view.m), tone: "input" })
          ] }),
          Boolean(view.bound) && /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "source", value: "backend cipher (bound)", tone: "muted" })
        ] });
      case "elgamal-decrypt":
        return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "c1", value: String(view.c1), tone: "transform" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "c2", value: String(view.c2), tone: "transform" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FlowArrow, { op: "m = c2 * c1^-x mod p" }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
            DataBlock,
            {
              label: "M' (integer)",
              value: view.m != null ? String(view.m) : "-",
              tone: "output",
              big: true
            }
          )
        ] });
      case "elgamal-formula":
        return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-stage-view", children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "lab-ec-plane", children: [
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "y", value: `g^x mod p = ${String(view.y)}`, tone: "output" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "c1", value: "g^k mod p", tone: "transform" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "c2", value: "m * y^k mod p", tone: "output" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(DataBlock, { label: "educational", value: "Parameters shown are small teaching sizes only", tone: "muted" })
        ] });
      default:
        return null;
    }
  }
};

// src/components/simulation3d/adapters/scene.ts
var TONE3 = {
  input: "input",
  key: "key",
  internal: "internal",
  output: "output",
  transform: "transform",
  active: "active",
  muted: "muted",
  error: "error"
};
function tone3(t, fallback = "muted") {
  if (!t) return fallback;
  if (t in TONE3) return TONE3[t];
  return t;
}
function gridCell(c) {
  if (!c) return null;
  return {
    label: c.label,
    tone: tone3(c.tone),
    emphasize: c.emphasize,
    opacity: c.opacity,
    visible: c.visible
  };
}
function hexMatrixGrid(id36, matrix, baseTone, origin, opts = {}) {
  const hl = new Set((opts.highlight ?? []).map(([r, c]) => `${r},${c}`));
  return gridObject(
    id36,
    matrix.map(
      (row, r) => row.map((cell, c) => ({
        label: cell,
        tone: hl.has(`${r},${c}`) ? "active" : baseTone
      }))
    ),
    {
      cellSize: opts.cellSize ?? 1,
      gap: opts.gap ?? 0.16,
      height: opts.height ?? 1.6,
      position: origin
    }
  );
}
function gridObject(id36, rows, opts = {}) {
  const layers = opts.layers?.length ? opts.layers : [
    {
      rows: rows.length,
      cols: Math.max(1, rows[0]?.length ?? 0),
      cellSize: opts.cellSize,
      gap: opts.gap,
      labelScale: opts.labelScale,
      cells: rows.map((r) => r.map(gridCell))
    }
  ];
  return {
    id: id36,
    kind: "grid",
    position: opts.position ?? [0, 0, 0],
    visible: opts.visible ?? true,
    tone: tone3(opts.tone ?? "muted"),
    grid: { layers, height: opts.height }
  };
}
function arrow(id36, from, to, tone = "path", opts = {}) {
  return {
    id: id36,
    kind: "arrow",
    position: [0, 0, 0],
    from,
    to,
    tone: tone3(tone),
    visible: opts.visible ?? true
  };
}
function hexChunks(hex, piece = 2) {
  const h = (hex ?? "").replace(/\s/g, "");
  const out = [];
  for (let i = 0; i < h.length; i += piece) out.push(h.slice(i, i + piece));
  return out;
}
function hexRow(hex, tone, opts = {}) {
  return hexChunks(hex, opts.piece ?? 2).map((label) => ({ label, tone }));
}
function hexStrip(idPrefix, hex, tone, origin, opts = {}) {
  const piece = opts.piece ?? 2;
  const cells = hexRow(hex, tone, { piece });
  const { objects, positions } = charRow(idPrefix, cells, origin, {
    cellSize: opts.cellSize ?? 0.7,
    gap: opts.gap ?? 0.07,
    cubeY: opts.cubeY ?? 0.3,
    glyphY: opts.glyphY ?? 0.95
  });
  const arr = objects;
  arr.objects = objects;
  arr.positions = positions.map((p) => p ? p.position : null);
  return arr;
}
function charRow(idPrefix, chars, origin, opts = {}) {
  const cellSize = opts.cellSize ?? 0.92;
  const gap = opts.gap ?? 0.12;
  const cubeY = opts.cubeY ?? 0.55;
  const glyphY = opts.glyphY ?? 1.25;
  const objects = [];
  const positions = [];
  const step = cellSize + gap;
  const off = (chars.length - 1) * step / 2;
  chars.forEach((c, i) => {
    if (!c) {
      positions.push(null);
      return;
    }
    const pos = [origin[0] - off + i * step, origin[1], origin[2]];
    const t = tone3(c.tone);
    objects.push(
      {
        id: `${idPrefix}-${i}`,
        kind: "box",
        position: [pos[0], origin[1] + cubeY, pos[2]],
        size: [cellSize, cellSize, cellSize],
        tone: t,
        emphasize: c.emphasize ?? false,
        opacity: c.opacity ?? 1,
        visible: c.visible ?? true
      },
      {
        id: `${idPrefix}g-${i}`,
        kind: "glyph",
        position: [pos[0], origin[1] + glyphY, pos[2]],
        label: c.label === " " ? "\xB7" : c.label,
        glyphScale: 0.95,
        tone: t,
        opacity: c.opacity ?? 1,
        visible: c.visible ?? true
      }
    );
    positions.push({ position: pos, cell: c });
  });
  return { objects, positions };
}
function centroid(points) {
  if (points.length === 0) return [0, 0.4, 0];
  let x = 0;
  let y = 0;
  let z = 0;
  for (const p of points) {
    x += p[0];
    y += p[1];
    z += p[2];
  }
  return [x / points.length, y / points.length, z / points.length];
}
var DEFAULT_DIR = [0.78, 0.72, 1];
function fitCamera(points, opts = {}) {
  const target = centroid(points);
  const spread = Math.max(
    2,
    ...points.map((p) => Math.hypot(p[0] - target[0], p[1] - target[1], p[2] - target[2]))
  );
  const distance = opts.distance ?? spread * 2.5 + 6;
  const dir = opts.dir ?? DEFAULT_DIR;
  const d = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  return {
    position: [
      target[0] + dir[0] / d * distance,
      target[1] + dir[1] / d * distance,
      target[2] + dir[2] / d * distance
    ],
    target,
    instant: opts.instant
  };
}
function xPositions(count, span, y = 0, z = 0) {
  const out = [];
  if (count === 1) return [[0, y, z]];
  for (let i = 0; i < count; i++) {
    out.push([-span / 2 + span * i / (count - 1), y, z]);
  }
  return out;
}
function merge(...groups) {
  return groups.flatMap((g) => Array.isArray(g) ? g : [g]);
}
function rows3D(rows, origin, opts = {}) {
  const rowStep = opts.rowStep ?? 2.1;
  const cellSize = opts.cellSize ?? 0.92;
  const gap = opts.gap ?? 0.12;
  const objects = [];
  const cells = [];
  const maxLen = Math.max(0, ...rows.map((r) => (r.cells ?? []).length));
  const step = cellSize + gap;
  const off = (maxLen - 1) * step / 2;
  const y = origin[1] + cellSize / 2;
  const glyphY = origin[1] + cellSize + 0.28;
  rows.forEach((row, ri) => {
    const z = origin[2] + ri * rowStep;
    if (row.label) {
      objects.push({
        id: `rowlabel-${ri}`,
        kind: "glyph",
        position: [origin[0] - off - (opts.labelOffset ?? 1.6), y + 0.35, z],
        label: row.label,
        glyphScale: 0.9,
        tone: "muted"
      });
    }
    const rowCells = [];
    (row.cells ?? []).forEach((c, ci) => {
      if (!c) {
        rowCells.push(null);
        return;
      }
      const x = origin[0] - off + ci * step;
      const t = tone3(c.tone);
      objects.push(
        {
          id: `R${ri}C${ci}`,
          kind: "box",
          position: [x, y, z],
          size: [cellSize, cellSize, cellSize],
          tone: t,
          emphasize: c.emphasize ?? false,
          opacity: c.opacity ?? 1,
          visible: c.visible ?? true
        },
        {
          id: `R${ri}C${ci}g`,
          kind: "glyph",
          position: [x, glyphY, z],
          label: c.label === " " ? "\xB7" : c.label,
          glyphScale: 0.92,
          tone: t,
          opacity: c.opacity ?? 1,
          visible: c.visible ?? true
        }
      );
      rowCells.push([x, y, z]);
    });
    cells.push(rowCells);
  });
  return { objects, cells };
}
function manualGrid(idPrefix, matrix, origin, opts = {}) {
  const cellSize = opts.cellSize ?? 0.9;
  const gap = opts.gap ?? 0.1;
  const stepp = cellSize + gap;
  const rows = matrix.length;
  const cols = Math.max(1, matrix[0]?.length ?? 0);
  const offX = (cols - 1) * stepp / 2;
  const offZ = (rows - 1) * stepp / 2;
  const objects = [];
  const cells = [];
  matrix.forEach((row, r) => {
    const rowCells = [];
    for (let ci = 0; ci < cols; ci++) {
      const c = row[ci];
      const x = origin[0] - offX + ci * stepp;
      const z = origin[2] - offZ + r * stepp;
      rowCells.push([x, origin[1] + 0.12, z]);
      if (!c) continue;
      const t = tone3(c.tone);
      objects.push(
        {
          id: `${idPrefix}-${r}-${ci}`,
          kind: "box",
          position: [x, origin[1] + 0.12, z],
          size: [cellSize, 0.24, cellSize],
          tone: t,
          emphasize: c.emphasize ?? false,
          opacity: c.opacity ?? 1
        },
        {
          id: `${idPrefix}-${r}-${ci}g`,
          kind: "glyph",
          position: [x, origin[1] + 0.62, z],
          label: c.label,
          glyphScale: 0.9,
          tone: t,
          opacity: c.opacity ?? 1
        }
      );
    }
    cells.push(rowCells);
  });
  return { objects, cells };
}
function camToObjects(objects, opts = {}) {
  const xs = [];
  const ys = [];
  const zs = [];
  const touch = (p2, pad = 0.6) => {
    if (!p2) return;
    xs.push(p2[0] + pad, p2[0] - pad);
    ys.push(p2[1] + pad, p2[1] - pad);
    zs.push(p2[2] + pad, p2[2] - pad);
  };
  for (const o of objects) {
    if (o.kind === "grid" && o.grid?.layers) {
      for (const layer of o.grid.layers) {
        const cell = layer.cellSize ?? 1;
        const gap = layer.gap ?? 0.14;
        const w = (Math.max(1, layer.cols) - 1) * (cell + gap) + cell;
        const d2 = (Math.max(1, layer.rows) - 1) * (cell + gap) + cell;
        touch([o.position[0] + w / 2, o.position[1], o.position[2] - d2 / 2]);
        touch([o.position[0] - w / 2, o.position[1], o.position[2] + d2 / 2]);
      }
      continue;
    }
    touch(o.position);
    if (o.kind === "arrow") {
      touch(o.from, 1);
      touch(o.to, 1);
    }
    if (o.kind === "arc" && o.points?.length) {
      for (const p2 of o.points) touch(p2);
    }
  }
  if (xs.length === 0) {
    xs.push(0, 1);
    ys.push(0, 1);
    zs.push(0, 1);
  }
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
  const span = Math.max(
    4,
    Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), Math.max(...zs) - Math.min(...zs))
  );
  const distance = span * 1.35 + 4.5;
  const dir = opts.dir ?? DEFAULT_DIR;
  const d = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  const p = opts.pad ?? 0;
  return {
    position: [cx + dir[0] / d * (distance + p), cy + dir[1] / d * (distance + p), cz + dir[2] / d * (distance + p)],
    target: [cx, cy, cz],
    instant: opts.instant
  };
}
function valuePlate(id36, position, label, value, tone = "internal", opts = {}) {
  const t = tone3(tone);
  return [
    {
      id: id36,
      kind: "box",
      position,
      size: [Math.max(1.2, Math.min(4, 0.35 * Math.max(value.length, label.length) + 1)), 0.5, 1.2],
      tone: t,
      emphasize: opts.emphasize ?? false
    },
    {
      id: `${id36}-lbl`,
      kind: "glyph",
      position: [position[0], position[1] + 0.72, position[2]],
      label,
      glyphScale: 0.55,
      tone: "muted",
      opacity: 0.85
    },
    {
      id: `${id36}-val`,
      kind: "glyph",
      position: [position[0], position[1] - 0.05, position[2]],
      label: value,
      glyphScale: 0.9,
      tone: t
    }
  ];
}

// src/components/simulation3d/adapters/caesar3D.ts
var RING_R = 8;
var GLYPH_Y = 1.15;
var PT_R = 12.2;
var CUBE_Y = 0.55;
var ARC_R = 8.6;
var ARC_Y = 0.35;
var TRAVELER_R = 8.6;
var TRAVELER_Y = 0.5;
var KEY_BLOCK = [-6.4, 3, -3.2];
var KEY_LABEL = [-6.4, 4.6, -3.2];
var MAX_LETTERS = 12;
var TAU = Math.PI * 2;
var DEFAULT_CAMERA = { position: [9.5, 10, 15], target: [0, 0.4, 0] };
var angleOf = (idx) => idx / 26 * TAU;
var ringPoint = (idx, radius, y) => {
  const a = angleOf(idx);
  return [radius * Math.cos(a), y, radius * Math.sin(a)];
};
function buildScene(info, s) {
  const objects = [];
  const n = info.letters.length;
  const sign = info.sign;
  const ptAngle = (i) => {
    if (n <= 1) return Math.PI / 2;
    const span = Math.min(1.05, 0.35 + 0.1 * n);
    return Math.PI / 2 - span + 2 * span * i / (n - 1);
  };
  const ptPos = (i) => [PT_R * Math.cos(ptAngle(i)), CUBE_Y, PT_R * Math.sin(ptAngle(i))];
  const otPos = (i) => [-PT_R * Math.cos(ptAngle(i)), CUBE_Y, -PT_R * Math.sin(ptAngle(i))];
  objects.push({
    id: "ring",
    kind: "ring",
    position: [0, 0, 0],
    ringRadius: RING_R,
    ringTube: 0.22,
    tone: "muted",
    emphasize: s.ringEmphasize ?? false
  });
  for (let i = 0; i < 26; i++) {
    const g = s.glyphs?.[i];
    objects.push({
      id: `glyph-${i}`,
      kind: "glyph",
      position: ringPoint(i, RING_R, GLYPH_Y),
      label: ALPHABET[i],
      glyphScale: 1.1,
      tone: g?.tone ?? "muted",
      emphasize: g?.emphasize ?? false
    });
  }
  objects.push({
    id: "key-block",
    kind: "box",
    position: KEY_BLOCK,
    size: [1.5, 1.2, 1.5],
    tone: "key",
    emphasize: s.keyOn ?? false
  });
  objects.push({
    id: "key-label",
    kind: "glyph",
    position: KEY_LABEL,
    label: String(info.k),
    glyphScale: 1.25,
    tone: "key",
    emphasize: s.keyOn ?? false
  });
  for (let i = 0; i < n; i++) {
    const isActive = i === s.activeLetter;
    const isFaded = s.fadePlain?.includes(i) ?? false;
    const isDim = s.dimPlain?.includes(i) ?? false;
    objects.push({
      id: `pt-${i}`,
      kind: "box",
      position: ptPos(i),
      size: [1.3, 1.3, 1.3],
      tone: isActive ? "active" : "plaintext",
      emphasize: isActive,
      scale: isActive ? [1.25, 1.25, 1.25] : [1, 1, 1],
      opacity: isFaded ? 0.35 : 1
    });
    objects.push({
      id: `ptg-${i}`,
      kind: "glyph",
      position: [ptPos(i)[0], 1.95, ptPos(i)[2]],
      label: info.letters[i].plain,
      glyphScale: 1,
      tone: isActive ? "active" : isDim ? "muted" : "plaintext"
    });
  }
  for (let i = 0; i < n; i++) {
    const revealed = s.revealed?.includes(i) ?? false;
    objects.push({
      id: `ot-${i}`,
      kind: "box",
      position: otPos(i),
      size: [1.3, 1.3, 1.3],
      tone: "output",
      visible: revealed,
      emphasize: revealed
    });
    objects.push({
      id: `otg-${i}`,
      kind: "glyph",
      position: [otPos(i)[0], 1.95, otPos(i)[2]],
      label: info.letters[i].mapped,
      glyphScale: 1,
      tone: "output",
      visible: revealed
    });
  }
  for (let i = 0; i < n; i++) {
    const visible = (s.arcVisible ?? false) && i === s.activeLetter;
    objects.push({
      id: `arc-${i}`,
      kind: "arc",
      position: [0, 0, 0],
      points: arcPoints(info.letters[i].value, sign, info.k),
      ringTube: 0.16,
      tone: "transform",
      visible,
      emphasize: visible
    });
  }
  for (let i = 0; i < n; i++) {
    const visible = s.ptArrows?.includes(i) ?? false;
    const from = ptPos(i);
    const to = ringPoint(info.letters[i].value, RING_R, 1.05);
    objects.push({
      id: `ptar-${i}`,
      kind: "arrow",
      position: [0, 0, 0],
      from: [from[0], 0.3, from[2]],
      to,
      tone: "path",
      visible
    });
  }
  for (let i = 0; i < n; i++) {
    const visible = s.otArrows?.includes(i) ?? false;
    const to = otPos(i);
    const from = ringPoint(info.letters[i].mappedVal, RING_R, 1.05);
    objects.push({
      id: `otar-${i}`,
      kind: "arrow",
      position: [0, 0, 0],
      from,
      to: [to[0], 0.3, to[2]],
      tone: "output",
      visible
    });
  }
  const activeIdx = s.activeLetter ?? -1;
  const travelerVisible = (s.travelerVisible ?? false) && activeIdx >= 0 && activeIdx < n;
  if (travelerVisible) {
    const letter = info.letters[activeIdx];
    const fromIdx = letter.value;
    objects.push({
      id: "traveler",
      kind: "sphere",
      position: [0, TRAVELER_Y, 0],
      size: [0.48, 0.48, 0.48],
      tone: s.travelerAt === "target" ? "complete" : "active",
      emphasize: true,
      orbit: {
        center: [0, 0, 0],
        radius: TRAVELER_R,
        y: TRAVELER_Y,
        fromAngle: angleOf(fromIdx),
        // Unwrapped angle so wrapping letters travel the short path in the
        // shift direction (e.g. Y → B travels +3 forward through Z, A).
        toAngle: s.travelerAt === "target" ? angleOf(fromIdx + sign * info.k) : angleOf(fromIdx)
      }
    });
  }
  objects.push({
    id: "result-arrow",
    kind: "arrow",
    position: [0, 0, 0],
    from: [0, 2.4, PT_R + 0.4],
    to: [0, 2.4, -(PT_R + 0.4)],
    tone: "transform",
    visible: s.resultArrow ?? false
  });
  return objects;
}
function arcPoints(sourceIndex, sign, k) {
  const toIdx = sourceIndex + (sign >= 0 ? 1 : -1) * k;
  const points = [];
  const STEPS = 64;
  for (let f = 0; f <= 1; f += 1 / STEPS) {
    const idx = sourceIndex + (toIdx - sourceIndex) * f;
    const a = idx / 26 * TAU;
    points.push([ARC_R * Math.cos(a), ARC_Y, ARC_R * Math.sin(a)]);
  }
  return points;
}
function baseGlyphs() {
  return Array.from({ length: 26 }, () => ({ tone: "muted" }));
}
var caesar3DAdapter = {
  id: "caesar",
  nameKey: "simulation3d.caesar.name",
  educationalKey: "simulation3d.caesar.educational",
  demoInputs: { text: "HELLO", shift: 3 },
  defaultCamera: DEFAULT_CAMERA,
  getLegend() {
    return [
      { id: "plaintext", labelKey: "simulation3d.legend.input", tone: "plaintext" },
      { id: "key", labelKey: "simulation3d.legend.key", tone: "key" },
      { id: "path", labelKey: "simulation3d.legend.path", tone: "transform" },
      { id: "active", labelKey: "simulation3d.legend.active", tone: "active" },
      { id: "output", labelKey: "simulation3d.legend.output", tone: "output" }
    ];
  },
  buildSteps(ctx) {
    const decrypt = ctx.operation === "decrypt";
    const text = String(ctx.inputs.text ?? "");
    const shift = Number.isFinite(Number(ctx.inputs.shift)) ? Number(ctx.inputs.shift) : 3;
    const { chars, k } = caesarChars(text, shift, decrypt);
    const usable = chars.filter((c) => c.note !== "ignored");
    const fullOut = usable.map((c) => c.mapped.toUpperCase()).join("");
    const truncated = usable.length > MAX_LETTERS;
    const letters = usable.slice(0, MAX_LETTERS).map((c) => {
      const mapped = c.mapped.toUpperCase();
      return {
        plain: c.plain.toUpperCase(),
        value: c.value,
        mapped,
        mappedVal: ALPHABET.indexOf(mapped)
      };
    });
    const sign = decrypt ? -1 : 1;
    const info = { letters, k, sign };
    const steps = [];
    const n = letters.length;
    if (n === 0) {
      steps.push({
        id: "caesar3d-empty",
        titleKey: "simulation3d.caesar.intro.title",
        descKey: "simulation3d.caesar.intro.desc",
        descArgs: { k },
        phase: "input",
        objects: buildScene({ ...info, letters: [] }, { keyOn: true }),
        camera: DEFAULT_CAMERA,
        duration: 0
      });
      return steps;
    }
    const phases = {
      intro: "input",
      key: "key",
      ring: "internal",
      select: "transform",
      move: "transform",
      result: "output"
    };
    const introGlyphs = baseGlyphs();
    const intro = { glyphs: introGlyphs, keyOn: true };
    steps.push({
      id: "caesar3d-intro",
      titleKey: "simulation3d.caesar.intro.title",
      descKey: "simulation3d.caesar.intro.desc",
      descArgs: { k },
      phase: phases.intro,
      objects: buildScene(info, intro),
      camera: DEFAULT_CAMERA,
      duration: 900
    });
    steps.push({
      id: "caesar3d-key",
      titleKey: "simulation3d.caesar.key.title",
      descKey: "simulation3d.caesar.key.desc",
      descArgs: { k },
      phase: phases.key,
      objects: buildScene(info, { ...intro, keyOn: true }),
      duration: 700
    });
    steps.push({
      id: "caesar3d-ring",
      titleKey: "simulation3d.caesar.ring.title",
      descKey: "simulation3d.caesar.ring.desc",
      descArgs: { k, signed: sign > 0 ? `+${k}` : `\u2212${k}` },
      phase: phases.ring,
      objects: buildScene(info, { ...intro, ringEmphasize: true }),
      duration: 900
    });
    const revealed = [];
    const dashed = [];
    for (let i = 0; i < n; i++) {
      const li = letters[i];
      const signed = sign > 0 ? `+${k}` : `\u2212${k}`;
      const selectGlyphs = baseGlyphs();
      selectGlyphs[li.value].tone = "active";
      selectGlyphs[li.value].emphasize = true;
      steps.push({
        id: `caesar3d-l${i}-select`,
        titleKey: "simulation3d.caesar.select.title",
        descKey: "simulation3d.caesar.select.desc",
        titleArgs: { ch: li.plain },
        descArgs: { ch: li.plain, i: li.value, j: li.mappedVal, k: signed },
        phase: phases.select,
        objects: buildScene(info, {
          glyphs: selectGlyphs,
          keyOn: true,
          activeLetter: i,
          travelerVisible: true,
          travelerAt: "source",
          arcVisible: true,
          ptArrows: [i],
          dimPlain: dashed
        }),
        duration: 900
      });
      revealed.push(i);
      const moveGlyphs = baseGlyphs();
      moveGlyphs[li.mappedVal].tone = "complete";
      moveGlyphs[li.mappedVal].emphasize = true;
      steps.push({
        id: `caesar3d-l${i}-move`,
        titleKey: "simulation3d.caesar.move.title",
        descKey: "simulation3d.caesar.move.desc",
        titleArgs: { ch: li.plain, cipher: li.mapped },
        descArgs: { ch: li.plain, i: li.value, j: li.mappedVal, k: signed, cipher: li.mapped },
        phase: phases.move,
        objects: buildScene(info, {
          glyphs: moveGlyphs,
          keyOn: true,
          activeLetter: i,
          travelerVisible: true,
          travelerAt: "target",
          arcVisible: true,
          revealed: revealed.slice(),
          otArrows: [i],
          fadePlain: [i],
          dimPlain: dashed
        }),
        duration: 1100
      });
      dashed.push(i);
    }
    const finalGlyphs = baseGlyphs();
    steps.push({
      id: "caesar3d-result",
      titleKey: "simulation3d.caesar.result.title",
      descKey: "simulation3d.caesar.result.desc",
      descArgs: { out: fullOut },
      phase: phases.result,
      objects: [
        ...buildScene(info, {
          glyphs: finalGlyphs,
          keyOn: true,
          revealed: revealed.slice(),
          resultArrow: true
        }),
        ...valuePlate("caesar-full", [0, -2.8, 12.4], "ciphertext", fullOut || "\xB7", "output", { emphasize: true }),
        ...truncated ? valuePlate("caesar-note", [0, -4.7, 8.4], "note", `ring shows the first ${MAX_LETTERS} letters \xB7 ${usable.length} letters total`, "muted") : []
      ],
      duration: 900
    });
    return steps;
  }
};

// src/components/simulation3d/adapters/from2d.ts
function stagesToSteps(stages, scene, metaFor) {
  return stages.map((st, i) => {
    const objects = scene(st, i);
    const meta = metaFor?.(st, i);
    return {
      id: `3d-${st.id}`,
      titleKey: st.titleKey,
      titleArgs: st.titleArgs,
      descKey: st.descKey,
      descArgs: st.descArgs,
      phase: st.phase,
      objects,
      camera: i === 0 ? camToObjects(objects) : void 0,
      duration: 800,
      ...meta ? { meta } : {}
    };
  });
}
function viewKind(stage) {
  return String(stage.view.kind);
}
var PHASE_LEVEL = {
  input: "concept",
  key: "algorithm",
  transform: "operation",
  internal: "bit",
  output: "algorithm"
};
function humanizeKind(kind) {
  return kind.replace(/[_\-\s]+/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}
function defaultStageMeta(stage) {
  const level = stage.phase ? PHASE_LEVEL[stage.phase] : void 0;
  return {
    level: level ?? "algorithm",
    operation: humanizeKind(viewKind(stage))
  };
}
function rowsViewScene(v, origin = [0, 0, 0]) {
  const rows = v.rows ?? [];
  return rows3D(
    rows.map((r) => ({
      label: r.label,
      cells: (r.cells ?? []).map((c) => ({ label: c.ch, tone: c.tone }))
    })),
    origin
  ).objects;
}
function resultViewScene(v, origin = [0, 0, 0]) {
  const chars = v.chars ?? [];
  const text = String(v.text ?? "");
  const out = [];
  const { objects } = rows3D(
    [{ cells: chars.map((c) => ({ label: c.ch, tone: c.tone })) }],
    origin
  );
  out.push(...objects);
  out.push(
    ...valuePlate(
      "result-value",
      [0, 1.6, 4.6],
      "result",
      text || "\xB7",
      "output",
      { emphasize: true }
    )
  );
  return out;
}
var DEFAULT_LEGEND = [
  { id: "input", labelKey: "simulation3d.legend.input", tone: "input" },
  { id: "plaintext", labelKey: "simulation3d.legend.plaintext", tone: "plaintext" },
  { id: "key", labelKey: "simulation3d.legend.key", tone: "key" },
  { id: "active", labelKey: "simulation3d.legend.active", tone: "active" },
  { id: "transform", labelKey: "simulation3d.legend.transform", tone: "transform" },
  { id: "output", labelKey: "simulation3d.legend.output", tone: "output" }
];
function createAdapterFromEngine(engine, scene, overrides = {}, metaFor) {
  return {
    id: engine.id,
    nameKey: engine.nameKey,
    educationalKey: engine.educationalKey,
    demoInputs: engine.demoInputs,
    buildSteps(ctx) {
      return stagesToSteps(engine.build(ctx), (st) => scene(st), metaFor ?? defaultStageMeta);
    },
    getLegend: () => DEFAULT_LEGEND,
    ...overrides
  };
}

// src/components/simulation3d/adapters/vigenere3D.ts
var MAX_LETTERS2 = 14;
var STEP = 0.92 + 0.12;
function railRows(rows) {
  const n = Math.max(0, ...rows.map((r) => r.parts.length));
  const off = (n - 1) * STEP / 2;
  const objs = [];
  rows.forEach((row, ri) => {
    const z = ri * 2.3;
    objs.push({
      id: `rlabel-${ri}`,
      kind: "glyph",
      position: [-off - 1.7, 1, z],
      label: row.label,
      glyphScale: 0.95,
      tone: "muted"
    });
    row.parts.forEach((c, ci) => {
      const x = -off + ci * STEP;
      objs.push(
        {
          id: `R${ri}C${ci}`,
          kind: "box",
          position: [x, 0.5, z],
          size: [0.92, 0.92, 0.92],
          tone: c.tone
        },
        {
          id: `R${ri}C${ci}g`,
          kind: "glyph",
          position: [x, 1.24, z],
          label: c.label,
          glyphScale: 0.95,
          tone: c.tone
        }
      );
    });
  });
  return objs;
}
var vigenere3DAdapter = createAdapterFromEngine(
  vigenereEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "vig-key": {
        const key = String(v.key);
        const cells = key.split("").map((ch, i) => ({ label: ch, tone: "key", emphasize: i < 2 }));
        return merge(
          railRows([{ label: "K", parts: cells }]),
          valuePlate("key-len", [7, 0.4, 0], "key length", String(key.length), "internal"),
          valuePlate("mod", [9, 0.4, 2.4], "mod 26", "26", "transform"),
          arrow("cycle", [7, 1.4, 0], [9, 1.4, 2.4], "path")
        );
      }
      case "vig-input": {
        const chars = v.chars ?? [];
        return rowsViewScene({ rows: [{ label: "P", cells: chars }] }, [0, 0, 0]);
      }
      case "vig-rail": {
        const key = String(v.key);
        const full = String(v.text);
        const letters = full.slice(0, MAX_LETTERS2);
        const repeated = (key + key.repeat(Math.ceil(letters.length / key.length))).slice(0, letters.length);
        const parts = letters.split("").map((ch) => ({ label: ch, tone: "input" }));
        const objs = railRows([
          { label: "P", parts },
          { label: "K", parts: repeated.split("").map((ch) => ({ label: ch, tone: "key" })) }
        ]);
        const off = (Math.max(letters.length, repeated.length) - 1) * STEP / 2;
        letters.split("").forEach((_, ci) => {
          const x = -off + ci * STEP;
          objs.push(arrow(`ar-${ci}`, [x, 0.5, 2.3], [x, 0.5, 0], "path"));
        });
        if (full.length > MAX_LETTERS2) {
          objs.push(
            ...valuePlate("vig-rail-note", [0, 3.6, -2.6], "note", `first ${MAX_LETTERS2} letters shown \xB7 ${full.length} total`, "muted")
          );
        }
        return objs;
      }
      case "rows":
        return rowsViewScene(v);
      case "result":
        return resultViewScene(v);
      default:
        return [];
    }
  },
  {
    defaultCamera: camToObjects(
      merge(
        ...railRows([
          { label: "P", parts: Array.from({ length: 12 }, () => ({ label: "A", tone: "input" })) },
          { label: "K", parts: Array.from({ length: 12 }, () => ({ label: "A", tone: "key" })) }
        ])
      ),
      { dir: [0.8, 0.85, 1.2] }
    )
  }
);

// src/components/simulation3d/adapters/monoAlphabetic3D.ts
var CELL = 0.6;
var GAP = 0.05;
var STEP2 = CELL + GAP;
var OFF = (26 - 1) * STEP2 / 2;
function row26(idPrefix, letters, tone, z) {
  const objs = [];
  letters.split("").forEach((ch, i) => {
    const x = -OFF + i * STEP2;
    objs.push(
      {
        id: `${idPrefix}-${i}`,
        kind: "box",
        position: [x, 0.3, z],
        size: [CELL, 0.26, CELL],
        tone
      },
      {
        id: `${idPrefix}g-${i}`,
        kind: "glyph",
        position: [x, 0.85, z],
        label: ch,
        glyphScale: 0.7,
        tone
      }
    );
  });
  return objs;
}
var monoAlphabetic3DAdapter = createAdapterFromEngine(
  monoAlphabeticEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "mono-key": {
        const sub = String(v.sub);
        const objs = merge(
          row26("a", ALPHABET, "input", 0),
          row26("s", sub, "key", 2.3)
        );
        const shown = [0, 4, 11, 17, 25];
        for (const i of shown) {
          const x = -OFF + i * STEP2;
          objs.push(arrow(`map-${i}`, [x, 0.65, 2.3], [x, 0.45, 0], "transform"));
        }
        return objs;
      }
      case "mono-input": {
        const chars = v.chars ?? [];
        return merge(
          ...rows3D(
            [{ cells: chars.map((c) => ({ label: c.ch, tone: c.tone })) }],
            [0, 0, 0],
            { rowStep: 2.4 }
          ).objects
        );
      }
      case "mono-sub-grid": {
        const rows = v.gridRows ?? [];
        return merge(
          ...rows3D(
            rows.map((r) => ({
              label: r.label,
              cells: (r.cells ?? []).map((c) => ({ label: c.ch, tone: c.tone }))
            })),
            [0, 0, 0],
            { rowStep: 2.4, cellSize: 0.72, gap: 0.05 }
          ).objects
        );
      }
      case "mono-chars": {
        const pR = v.pRow ?? [];
        const mR = v.mRow ?? [];
        return merge(
          ...rows3D(
            [
              { label: "P", cells: pR.map((c) => ({ label: c.ch, tone: c.tone })) },
              { label: "C", cells: mR.map((c) => ({ label: c.ch, tone: c.tone })) }
            ],
            [0, 0, 0],
            { rowStep: 2.4 }
          ).objects
        );
      }
      case "result":
        return resultViewScene(v);
      default:
        return [];
    }
  },
  {
    defaultCamera: camToObjects(merge(row26("a", ALPHABET, "input", 0), row26("s", ALPHABET, "key", 2.3)), {
      dir: [0.85, 0.9, 1.1]
    })
  }
);

// src/components/simulation3d/adapters/playfair3D.ts
function squareCells(square, keyword, active) {
  const kwSet = new Set(keyword.toUpperCase().split(""));
  return square.map(
    (row, r) => row.map((ch, c) => ({
      label: ch,
      tone: kwSet.has(ch) ? "key" : "internal",
      emphasize: active !== null && (r === active.ra && c === active.ca || r === active.rb && c === active.cb)
    }))
  );
}
var playfair3DAdapter = createAdapterFromEngine(
  playfairEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "pf-square": {
        const square = v.square ?? [];
        const keyword = String(v.keyword);
        const { objects } = manualGrid("sq", squareCells(square, keyword, null), [0, 0, 0], {
          cellSize: 1.15,
          gap: 0.18
        });
        return merge(
          ...objects,
          ...valuePlate("kw", [-2.8, 1.3, 3.6], "keyword", keyword, "key", { emphasize: true })
        );
      }
      case "pf-digraphs": {
        const pairs = v.pairs ?? [];
        return merge(
          ...rows3D(
            [
              {
                label: "digraphs",
                cells: pairs.map((p, i) => ({ label: p, tone: "input", emphasize: i === 0 }))
              }
            ],
            [0, 0, 0],
            { rowStep: 2.4, cellSize: 1.3, gap: 0.08 }
          ).objects
        );
      }
      case "pf-encrypt": {
        const square = v.square ?? [];
        const steps = v.steps ?? [];
        const first = steps[0];
        const { objects, cells } = manualGrid("sq", squareCells(square, "", first), [0, 0, 0], {
          cellSize: 1.15,
          gap: 0.18
        });
        const objs = [...objects];
        const center = [0, 0.3, 0];
        steps.forEach((s, si) => {
          const a = cells[s.ra]?.[s.ca];
          const b = cells[s.rb]?.[s.cb];
          if (!a || !b) return;
          if (s.ra === s.rb) {
            objs.push(arrow(`m-${si}`, [a[0], 0.5, a[2]], [b[0], 0.5, b[2]], "transform"));
          } else if (s.ca === s.cb) {
            objs.push(arrow(`m-${si}`, [a[0], 0.5, a[2]], [b[0], 0.5, b[2]], "transform"));
          } else {
            objs.push(arrow(`m-${si}`, a, b, "path"));
            void center;
          }
        });
        objs.push(...valuePlate("rule", [6.6, 0.3, 0], "rule", first?.rule ?? "", "transform"));
        return objs;
      }
      case "result":
        return resultViewScene(v);
      default:
        return [];
    }
  },
  {
    defaultCamera: camToObjects(
      manualGrid(
        "sq",
        Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ label: "A", tone: "internal" }))),
        [0, 0, 0],
        { cellSize: 1.15, gap: 0.18 }
      ).objects,
      { dir: [0.75, 0.85, 1.3] }
    )
  }
);

// src/components/simulation3d/adapters/hill3D.ts
function matrixCells(matrix, tone) {
  return matrix.map((row) => row.map((val) => ({ label: String(val), tone })));
}
var hill3DAdapter = createAdapterFromEngine(
  hillEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "hill-matrix": {
        const matrix = v.matrix ?? [];
        const decrypt = Boolean(v.decrypt);
        const valid = Boolean(v.valid);
        const determin = Number(v.determin);
        const detInv = v.detInv;
        const originalMatrix = v.originalMatrix ?? [];
        const objs = [];
        if (decrypt) {
          const { objects: orig } = manualGrid("K", matrixCells(originalMatrix, "key"), [-6.5, 0, 0], { cellSize: 1, gap: 0.1 });
          const { objects: inv } = manualGrid("Kinv", matrixCells(matrix, "transform"), [3.5, 0, 0], { cellSize: 1, gap: 0.1 });
          objs.push(
            ...orig,
            ...inv,
            arrow("kinv", [-4.4, 1, 0], [1.9, 1, 0], "path"),
            ...valuePlate(
              "det",
              [8.2, 0.4, 2.4],
              "det",
              detInv !== null ? `${determin} (inv ${detInv})` : `${determin} \xB7 not invertible`,
              valid ? "internal" : "error",
              { emphasize: !valid }
            )
          );
        } else {
          const { objects } = manualGrid("K", matrixCells(matrix, "key"), [0, 0, -1.5], { cellSize: 1, gap: 0.1 });
          objs.push(...objects);
          objs.push(...valuePlate("formula", [4.5, 0.8, -1.5], "C = K \xB7 P mod 26", "", "transform"));
        }
        return objs;
      }
      case "hill-prepare": {
        const blocks = v.blocks ?? [];
        const padded = Number(v.padded);
        const objs = [];
        blocks.slice(0, 4).forEach((b, bi) => {
          const z = bi * 3;
          const x0 = -3.5;
          objs.push(
            ...valuePlate(
              `b${bi}-chars`,
              [x0, 0.3, z],
              `block ${bi + 1}`,
              b.chars.join(""),
              "input"
            ),
            ...valuePlate(
              `b${bi}-vec`,
              [x0 + 5.2, 0.3, z],
              "P vector",
              b.inputVec.join(", "),
              "internal"
            )
          );
        });
        if (padded > 0) {
          objs.push(...valuePlate("pad", [4.5, 1.2, blocks.length * 3], "padding", `${padded} \xD7 X`, "muted"));
        }
        if (blocks.length > 4) {
          objs.push(
            ...valuePlate("hill-prep-note", [0, 3.6, -2.2], "note", `first 4 of ${blocks.length} blocks shown`, "muted")
          );
        }
        return objs;
      }
      case "hill-compute": {
        const matrix = v.matrix ?? [];
        const blocks = v.blocks ?? [];
        const { objects } = manualGrid("K", matrixCells(matrix, "key"), [0.5, 0, -2.4], { cellSize: 1, gap: 0.1 });
        const objs = [...objects];
        blocks.slice(0, 4).forEach((b, bi) => {
          const z = bi * 3;
          objs.push(
            ...rows3D(
              [
                { label: "P", cells: b.chars.map((ch, i) => ({ label: ch, tone: "input", emphasize: i === 0 })) },
                { label: "in", cells: b.inputVec.map((x) => ({ label: String(x), tone: "internal" })) },
                { label: "out", cells: (b.outputVec ?? []).map((x) => ({ label: String(x), tone: "transform" })) },
                { label: "C", cells: b.outputChars.map((ch) => ({ label: ch, tone: "output", emphasize: true })) }
              ],
              [-4.2, 0.2, z],
              { rowStep: 1.9, cellSize: 0.7, gap: 0.06 }
            ).objects
          );
          objs.push(arrow(`in-${bi}`, [3.3, 0.8, z], [1.7, 0.7, -2.4], "transform"));
          objs.push(arrow(`out-${bi}`, [10.6, 0.8, z], [1.7, 0.9, -2.4], "transform"));
        });
        if (blocks.length > 4) {
          objs.push(
            ...valuePlate("hill-compute-note", [0, 4.2, -2.2], "note", `first 4 of ${blocks.length} blocks shown`, "muted")
          );
        }
        return objs;
      }
      case "result":
        return resultViewScene(v);
      default:
        return [];
    }
  },
  {
    defaultCamera: camToObjects(
      manualGrid("K", matrixCells([[3, 3], [2, 5]], "key"), [0, 0, -1.5], { cellSize: 1, gap: 0.1 }).objects,
      { dir: [0.8, 0.9, 1.15] }
    )
  }
);

// src/components/simulation3d/adapters/railFence3D.ts
function zigzagArc(text, rails, label = "zigzag") {
  const n = Math.min(text.length, 14);
  const positions = railPositions(text.length, rails);
  const pts = [];
  for (let i = 0; i < (n || 1); i++) {
    const rail = positions[i] ?? 0;
    pts.push([i * 1.1 - n * 1.1 / 2, rail * 1.7 + 0.3, 0]);
  }
  return { id: label, kind: "arc", position: [0, 0, 0], points: pts, ringTube: 0.18, tone: "path" };
}
function gridFromStrings(grid) {
  return grid.map(
    (row) => row.map(
      (ch) => ch === "." ? { label: "", tone: "muted", opacity: 0.25 } : { label: ch, tone: "active", emphasize: true }
    )
  );
}
var railFence3DAdapter = createAdapterFromEngine(
  railFenceEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "rf-config": {
        const rails = Number(v.rails);
        const cycle = Number(v.cycle);
        const pts = [];
        for (let i = 0; i < cycle; i++) {
          const rail = i < rails ? i : cycle - i;
          pts.push([i * 1.4 - cycle * 1.4 / 2, rail * 1.8 + 0.3, 0]);
        }
        return merge(
          {
            id: "cycle-arc",
            kind: "arc",
            position: [0, 0, 0],
            points: pts,
            ringTube: 0.2,
            tone: "path"
          },
          {
            id: "cycle-ring",
            kind: "ring",
            position: [5.5, 0, 0],
            ringRadius: 2,
            ringTube: 0.14,
            tone: "transform"
          },
          ...valuePlate("rails", [9.2, 0.6, 1.6], "rails", String(rails), "key"),
          ...valuePlate("cycle", [6.8, 0.6, 3.4], "cycle", `${cycle}`, "internal")
        );
      }
      case "rf-pattern":
      case "rf-rebuild": {
        const grid = v.grid ?? v.displayGrid ?? [];
        const { objects } = manualGrid("g", gridFromStrings(grid ?? []), [0, 0, 0], { cellSize: 0.5, gap: 0.02 });
        return objects;
      }
      case "rf-read": {
        const rows = v.rows ?? [];
        return merge(
          ...rows3D(
            rows.map((r, i) => ({
              label: `rail ${i + 1}`,
              cells: r.split("").map((ch) => ({ label: ch, tone: "transform" }))
            })),
            [0, 0, 0],
            { rowStep: 2.5, cellSize: 0.8, gap: 0.06 }
          ).objects
        );
      }
      case "rf-positions": {
        const counts = v.counts ?? [];
        const text = String(v.text ?? "");
        return merge(
          ...rows3D(
            [{
              label: "rail",
              cells: counts.map((c, i) => ({
                label: String(c),
                tone: i % 2 === 0 ? "internal" : "transform"
              }))
            }],
            [0, 0, 0]
          ).objects,
          zigzagArc(text, counts.length, "rf-zig"),
          arrow("zig-goto", [text.length * 0.3, counts.length * 1.7, 0], [6, 0.4, 3.5], "path")
        );
      }
      case "result":
        return resultViewScene(v);
      default:
        return [];
    }
  },
  {
    defaultCamera: camToObjects(
      [zigzagArc("HELLOWORLD1234", 3, "demo")],
      { dir: [0.85, 0.6, 0.9] }
    )
  }
);

// src/components/simulation3d/adapters/columnar3D.ts
function gridCells(grid) {
  return grid.map(
    (row) => row.map(
      (ch) => ch === "." ? { label: "", tone: "muted", opacity: 0.22 } : { label: ch, tone: "internal" }
    )
  );
}
function columnCells(text, tone) {
  return text.split("").map((ch) => [{ label: ch, tone }]);
}
var columnar3DAdapter = createAdapterFromEngine(
  columnarEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "col-key": {
        const key = String(v.key);
        const order = v.order ?? [];
        const objs = [];
        const STEP3 = 1.1;
        key.split("").forEach((ch, ci) => {
          const x = ci * STEP3 - (key.length - 1) * STEP3 / 2;
          objs.push(
            {
              id: `kc-${ci}`,
              kind: "box",
              position: [x, 0.4, 0],
              size: [0.85, 0.24, 0.85],
              tone: "key",
              emphasize: true
            },
            {
              id: `kcg-${ci}`,
              kind: "glyph",
              position: [x, 1, 0],
              label: ch,
              glyphScale: 0.95,
              tone: "key"
            },
            {
              id: `ko-${ci}`,
              kind: "glyph",
              position: [x, 0, 0],
              label: String(order.indexOf(ci)),
              glyphScale: 0.5,
              tone: "internal"
            }
          );
        });
        return objs;
      }
      case "col-grid": {
        const grid = v.grid ?? [];
        const key = String(v.key);
        const { objects, cells } = manualGrid("cg", gridCells(grid), [0, 0, 0], { cellSize: 0.8, gap: 0.1 });
        const objs = [...objects];
        key.split("").forEach((ch, ci) => {
          const x = cells[0][ci]?.[0] ?? 0;
          objs.push(
            {
              id: `hdr-${ci}`,
              kind: "box",
              position: [x, -0.16 - 0.14, cells[0][ci]?.[2] ?? 0],
              size: [0.8, 0.28, 0.8],
              tone: "key",
              emphasize: true
            },
            {
              id: `hdrg-${ci}`,
              kind: "glyph",
              position: [x, -0.16 + 0.28, (cells[0][ci]?.[2] ?? 0) - 0.7],
              label: ch,
              glyphScale: 0.7,
              tone: "key"
            }
          );
        });
        return objs;
      }
      case "col-read":
      case "col-split": {
        const key = String(v.key);
        const order = v.order ?? [];
        const columnTexts = v.columnTexts ?? v.colTexts ?? [];
        const objs = [];
        const STEP3 = 2.6;
        const pts = [];
        order.forEach((colIdx, oi) => {
          const x = oi * STEP3 - (order.length - 1) * STEP3 / 2;
          const col = columnCells(columnTexts[colIdx] ?? "", "transform");
          const { objects } = manualGrid(`col${oi}`, col, [x, 0, 0], { cellSize: 0.85, gap: 0.06 });
          objs.push(
            ...objects,
            {
              id: `lbl-${oi}`,
              kind: "glyph",
              position: [x, -0.55, 0],
              label: `${key[colIdx]}(read ${order.indexOf(colIdx)})`,
              glyphScale: 0.55,
              tone: "key"
            }
          );
          if (col.length > 0) pts.push([x, 0, col.length * 0.91]);
        });
        if (pts.length > 1) {
          objs.push({ id: "readpath", kind: "arc", position: [0, 0, 0], points: pts.map((p) => [p[0], 0.55, p[2]]), ringTube: 0.12, tone: "path" });
        }
        return objs;
      }
      case "col-rebuild": {
        const grid = v.grid ?? [];
        const { objects } = manualGrid("rb", gridCells(grid), [0, 0, 0], { cellSize: 0.85, gap: 0.1 });
        const objs = [...objects];
        grid.forEach((row, r) => {
          row.forEach((ch, ci) => {
            if (ch === ".") return;
            objs.push(
              {
                kind: "sphere",
                id: `rb-dot-${r}-${ci}`,
                position: [-((grid[0]?.length ?? 1) * 0.95) / 2 + ci * 0.95, 1.15, 0],
                size: [0.22, 0.22, 0.22],
                tone: "active",
                emphasize: true
              }
            );
          });
        });
        objs.push(...valuePlate("plain-hint", [(grid[0]?.length ?? 2) / 2, 1.6, grid.length / 2 * 0.95], "rows read", "left \u2192 right", "path"));
        return objs;
      }
      case "result":
        return resultViewScene(v);
      default:
        return [];
    }
  },
  {
    defaultCamera: camToObjects(
      manualGrid(
        "cg",
        gridCells([["A", "B", ".", "C"], ["D", "E", ".", "F"]]),
        [0, 0, 0],
        { cellSize: 0.8, gap: 0.1 }
      ).objects,
      { dir: [0.8, 0.9, 1.1] }
    )
  }
);

// src/components/simulation3d/adapters/des3D.ts
var P_TABLE2 = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];
function bitsToHex32(bits) {
  let v = 0n;
  for (const b of bits) v = v << 1n | BigInt(b & 1);
  return v.toString(16).padStart(8, "0");
}
function xorHex2(a, b) {
  const n = Math.max(a.length, b.length);
  const av = BigInt("0x" + a.padStart(n, "0"));
  const bv = BigInt("0x" + b.padStart(n, "0"));
  return (av ^ bv).toString(16).padStart(n, "0");
}
var des3DAdapter = createAdapterFromEngine(
  desEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "des-input": {
        const block = String(v.block ?? "");
        const key = String(v.key ?? "");
        const l0 = String(v.l0 ?? "");
        const r0 = String(v.r0 ?? "");
        const blockS = hexStrip("blk", block.toUpperCase(), "input", [0, 0.8, -1.6], { piece: 1, cellSize: 0.6, gap: 0.035 });
        const keyS = hexStrip("key", key.toUpperCase(), "key", [0, 0.8, 0.4], { piece: 1, cellSize: 0.6, gap: 0.035 });
        return [
          ...blockS.objects,
          ...keyS.objects,
          ...valuePlate("ip", [0, 2.1, 1.6], "initial permutation", "IP", "transform"),
          ...valuePlate("L0", [-1.7, 0.15, 4], "L0", l0, "internal"),
          ...valuePlate("R0", [1.7, 0.15, 4], "R0", r0, "internal")
        ];
      }
      case "des-key": {
        const keys = v.roundKeys ?? [];
        const objs = [];
        keys.slice(0, 16).forEach((k, i) => {
          const a = i * (Math.PI * 2 / 16);
          const pos = [8 * Math.cos(a), 0.5, 8 * Math.sin(a)];
          objs.push(
            ...valuePlate(`k${i}`, pos, `K${i + 1}`, k.toUpperCase(), i === 0 ? "key" : "internal")
          );
        });
        objs.push({
          id: "key-ring",
          kind: "ring",
          position: [0, 0, 0],
          ringRadius: 8,
          ringTube: 0.12,
          tone: "key"
        });
        objs.push(...valuePlate("pc", [0, 3.4, 0], "key schedule", "PC-1 \u2192 rotate \u2192 PC-2", "transform"));
        return objs;
      }
      case "des-f": {
        const f = v.f ?? {};
        const l0 = String(v.l0 ?? "");
        const r0 = String(v.r0 ?? "");
        const sboxes = Array.isArray(f.sboxes) ? f.sboxes : [];
        if (!sboxes.length) return [];
        const expanded = String(f.expanded ?? "").toUpperCase();
        const xored = String(f.xor ?? "").toUpperCase();
        const bits = sboxes.map((s) => (s.fourBits ?? s.four_bits ?? "").split("").map((x) => Number(x))).flat();
        const permuted = P_TABLE2.map((i) => bits[i - 1] ?? 0);
        const fHex = bitsToHex32(permuted);
        const r1 = xorHex2(l0, fHex);
        const objs = [];
        const stages = [
          ["R0", r0, "internal"],
          ["E(R0)", expanded, "transform"],
          ["E(R0)\u2295K1", xored, "transform"],
          ["f(R0,K1)", fHex, "output"],
          ["\u2295L0 \u2192 R1", r1, "output"]
        ];
        const STEP3 = 4.8;
        stages.forEach((s, i) => {
          const x = (i - (stages.length - 1) / 2) * STEP3;
          objs.push(...valuePlate(`f${i}`, [x, 0.5, -1.8], s[0], s[1], s[2], { emphasize: i === 4 }));
          if (i < stages.length - 1) {
            objs.push(arrow(`fa${i}`, [x + STEP3 / 2 - 0.7, 1.15, -1.8], [x + STEP3 / 2 + 0.7, 1.15, -1.8], "path"));
          }
        });
        const boxIds = sboxes.map((s) => `S${s.sbox}`);
        const outIds = sboxes.map((s) => s.fourBits ?? s.four_bits ?? "");
        objs.push(
          ...valuePlate("sboxtitle", [0, 0.3, 1.6], "S-boxes", "8 \xD7 6\u21924 bits", "transform"),
          ...rows3D(
            [
              { label: "S", cells: boxIds.map((l, i) => ({ label: l, tone: i % 2 === 0 ? "internal" : "transform" })) },
              { cells: outIds.map((l, i) => ({ label: l, tone: i % 2 === 0 ? "transform" : "output" })) }
            ],
            [0, -0.2, 3],
            { rowStep: 1.8, cellSize: 0.85, gap: 0.08 }
          ).objects,
          ...valuePlate("ptitle", [0, -1.35, 7.2], "P-box", "spread 32 bits", "transform")
        );
        return objs;
      }
      case "des-rounds": {
        const states = v.states ?? [];
        const objs = [];
        states.forEach((s, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          objs.push(
            ...valuePlate(
              `r${i}`,
              [col * 5.4 - 13.5, 0.45, row * 3.6 - 3.6],
              `R${s.round}`,
              `L ${s.L.toUpperCase()}  R ${s.R.toUpperCase()}`,
              s.round % 2 === 0 ? "internal" : "transform"
            )
          );
        });
        objs.push(...valuePlate("chain", [0, 3.4, -8.2], "Feistel ladder", "16 rounds \xB7 L=R, R=L\u2295f(R,K)", "transform"));
        return objs;
      }
      case "des-swap": {
        const pre = String(v.preOutput ?? "");
        const resultHex = String(v.resultHex ?? "");
        return merge(
          ...valuePlate("pre", [-3.4, 0.4, 0], "R16L16", pre.toUpperCase(), "internal"),
          ...valuePlate("fp", [0, 0.4, 0], "final permutation", "FP", "transform"),
          ...valuePlate("out", [3.4, 0.4, 0], "output", resultHex.toUpperCase(), "output", { emphasize: true }),
          arrow("swap", [-1.6, 1.2, 0], [1.6, 1.2, 0], "path")
        );
      }
      case "des-result": {
        const hex = String(v.hex ?? "");
        return merge(
          ...hexStrip("out", hex.toUpperCase(), "output", [0, 0.3, 0], { piece: 1, cellSize: 0.62, gap: 0.04 }).objects,
          ...valuePlate("cap", [0, 2.1, 0], v.decrypt ? "plaintext" : "ciphertext", hex.toUpperCase(), "output", { emphasize: true })
        );
      }
      case "result":
        return resultViewScene(v);
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/tripleDes3D.ts
var stagesByIndex = ((v) => v.stage);
var of2 = (s, k) => String(s?.[k] ?? "").toUpperCase();
var tripleDes3DAdapter = createAdapterFromEngine(
  tripleDesEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "tdes-key": {
        const block = String(v.block ?? "").toUpperCase();
        const k1 = String(v.k1 ?? "").toUpperCase();
        const k2 = String(v.k2 ?? "").toUpperCase();
        const k3 = String(v.k3 ?? "").toUpperCase();
        return [
          ...hexStrip("blk", block, "input", [0, 0.9, -1.4], { piece: 1, cellSize: 0.6, gap: 0.035 }).objects,
          ...valuePlate("k1", [-3.6, 0.3, 1.2], "K1", k1, "key"),
          ...valuePlate("k2", [0, 0.3, 1.2], "K2", k2, "key"),
          ...valuePlate("k3", [3.6, 0.3, 1.2], "K3", k3, "key"),
          ...valuePlate("split", [0, 2.6, 1.2], "3DES key", "24 bytes split into K1 \xB7 K2 \xB7 K3", "transform")
        ];
      }
      case "tdes-pass": {
        const s = stagesByIndex(v);
        const idx = Number(v.index ?? 1);
        if (!s) return [];
        const key = of2(s, "key");
        const input = of2(s, "input");
        const output = of2(s, "output");
        const op = String(s.stage ?? "").toUpperCase();
        const posX = -7.2 + (idx - 1) * 3.6;
        return [
          ...valuePlate("both", [posX, 1.2, -1.6], s.operation === "decrypt" ? "decrypt" : "encrypt", op, "transform", { emphasize: true }),
          ...valuePlate("opkey", [posX, -0.4, 2], op, key, "key"),
          ...hexStrip("in", input, "input", [posX, 0.6, 0.6], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          arrow("pass", [posX, 0.6, 2.8], [posX, 0.6, 3.8], "path"),
          ...hexStrip("out", output, "output", [posX, 0.6, 4.4], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          ...valuePlate("stagecap", [posX, 2.9, 1.4], `pass ${idx}`, op, "transform")
        ];
      }
      case "tdes-formula": {
        const formula = String(v.formula ?? "");
        return [
          ...valuePlate("form", [0, 0.4, 0], v.decrypt ? "decrypt" : "encrypt", formula, "transform", { emphasize: true }),
          ...valuePlate("chain", [0, -1.7, 2.6], "EDE chain", "encrypt \xB7 decrypt \xB7 encrypt", "internal")
        ];
      }
      case "tdes-result": {
        const hex = String(v.hex ?? "").toUpperCase();
        return merge(
          ...hexStrip("out", hex, "output", [0, 0.3, 0], { piece: 1, cellSize: 0.62, gap: 0.04 }).objects,
          ...valuePlate("cap", [0, 2.1, 0], v.decrypt ? "plaintext" : "ciphertext", hex, "output", { emphasize: true })
        );
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/aes3D.ts
var hexStr = (v) => typeof v === "string" ? v : "";
var cellsOf = (m) => {
  if (!m) return void 0;
  const entries = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) entries.push([`s${r}${c}`, (m[r]?.[c] ?? "").toUpperCase()]);
  return Object.fromEntries(entries);
};
var diffCells = (before, after, reason) => {
  if (!before || !after) return [];
  const out = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const b = before[r]?.[c];
      const a = after[r]?.[c];
      if (b && a && b !== a) {
        out.push({
          entity: `s${r}${c}`,
          label: `byte (row ${r}, col ${c})`,
          before: b.toUpperCase(),
          after: a.toUpperCase(),
          reason,
          tone: "active"
        });
      }
    }
  }
  return out;
};
var highlightsOf = (before, after) => {
  if (!before || !after) return [];
  const out = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (before[r]?.[c] !== after[r]?.[c]) out.push([r, c]);
  return out;
};
function transitionScene(prefix, before, after, note) {
  return [
    ...before ? [hexMatrixGrid(`${prefix}-b`, before, "internal", [-5.8, 0, 0])] : [],
    ...after ? [hexMatrixGrid(`${prefix}-a`, after, "transform", [5.8, 0, 0], { highlight: highlightsOf(before, after) })] : [],
    arrow(`${prefix}-ar`, [-2.4, 0.8, 0], [3.4, 0.8, 0], "path"),
    ...valuePlate(`${prefix}-cap`, [0, 3.8, 0], "AES round", note, "transform")
  ];
}
var aes3DAdapter = {
  id: aesEngine.id,
  nameKey: aesEngine.nameKey,
  educationalKey: aesEngine.educationalKey,
  demoInputs: aesEngine.demoInputs,
  buildSteps(ctx) {
    const t = ctx.t;
    const stages = aesEngine.build(ctx);
    const input = stages.find((s) => s.id === "aes-input");
    const key = stages.find((s) => s.id === "aes-key");
    const addkey = stages.find((s) => s.id === "aes-addkey");
    const sbox = stages.find((s) => s.id === "aes-sbox");
    const round = stages.find((s) => s.id === "aes-round");
    const rounds = stages.find((s) => s.id === "aes-rounds");
    const final = stages.find((s) => s.id === "aes-final");
    if (!input || !key || !addkey || !sbox || !round || !rounds || !final) return [];
    const v = (kind) => stages.find((s) => s.view?.kind === kind)?.view ?? {};
    const iv = v("aes-input");
    const kv = v("aes-key");
    const av = v("aes-addkey");
    const sv = v("aes-sbox");
    const rv = v("aes-round");
    const mv = v("aes-rounds");
    const fv = v("aes-final");
    const decrypt = ctx.operation === "decrypt";
    const nk = Number(kv.nk ?? 4);
    const nr = Number(kv.nr ?? 10);
    const roundKeys = Array.isArray(kv.roundKeys) ? kv.roundKeys : [];
    const blockMatrix = av.before ?? null;
    const initial = av.after ?? null;
    const firstKeyMatrix = av.roundKey ?? null;
    const addkeyHighlight = av.highlight ?? highlightsOf(blockMatrix ?? void 0, initial ?? void 0);
    const sboxIn = sv.byteIn ?? null;
    const sboxOut = sv.byteOut ?? null;
    const dA = rv.a ?? null;
    const dB = rv.b ?? null;
    const dC = rv.c ?? null;
    const dD = rv.d ?? null;
    const roundKeyHex2 = hexStr(rv.roundKey);
    const midStates = mv.rounds ?? [];
    const finalState = fv.state ?? null;
    const resultHex = hexStr(fv.hex).toUpperCase();
    const blockHex = hexStr(iv.block).toUpperCase();
    const keyHex = hexStr(iv.key).toUpperCase();
    const mk = (st, objects, meta, p = {}) => ({
      id: `3d-${st.id}${p.id ?? ""}`,
      titleKey: p.titleKey ?? st.titleKey,
      titleArgs: p.titleArgs,
      descKey: p.descKey ?? st.descKey,
      descArgs: p.descArgs ?? st.descArgs,
      phase: p.phase ?? st.phase,
      objects,
      camera: p.camera,
      duration: p.duration ?? 800,
      meta
    });
    const steps = [];
    steps.push(
      mk(
        input,
        [
          ...hexStrip("blk", blockHex, "input", [0, 1.6, -3.6], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          ...hexStrip("ky", keyHex, "key", [0, 1.6, -1.4], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          ...blockMatrix ? [hexMatrixGrid("in-state", blockMatrix, "input", [0, 0, -0.5])] : [],
          ...valuePlate("cap", [0, 4.2, 3.2], "state", "block laid column-major", "internal")
        ],
        {
          level: "concept",
          event: "INPUT_CREATED",
          operation: "Setup",
          inputs: { block: blockHex, key: keyHex, "key words (Nk)": String(nk), rounds: String(nr) },
          why: t("simulation3d.aes.whyInput")
        }
      )
    );
    steps.push(
      mk(
        key,
        (() => {
          const objs = [];
          roundKeys.forEach((k, i) => {
            const a = i * (Math.PI * 2 / Math.max(roundKeys.length, 1));
            const pos = [9 * Math.cos(a), 0.5, 9 * Math.sin(a)];
            objs.push(...valuePlate(`k${i}`, pos, `K${i}`, k.toUpperCase(), i === 0 ? "key" : i % 2 === 0 ? "internal" : "transform"));
          });
          objs.push(
            {
              id: "rk-ring",
              kind: "ring",
              position: [0, 0, 0],
              ringRadius: 9,
              ringTube: 0.12,
              tone: "key"
            },
            ...valuePlate("schedule", [0, 2.6, 0], "round keys", `Nk = ${nk} \xB7 ${roundKeys.length} keys`, "key")
          );
          return objs;
        })(),
        {
          level: "algorithm",
          event: "KEY_GENERATED",
          operation: "Key expansion",
          formula: "W[i] = W[i-Nk] \u2295 SubWord(RotWord(W[i-1])) \u2295 Rcon for i \u2261 0 (mod Nk)",
          inputs: { "Nk": String(nk), "rounds (Nr)": String(nr), "derived round keys": String(roundKeys.length) },
          why: t("simulation3d.aes.whyKey")
        }
      )
    );
    steps.push(
      mk(
        addkey,
        [
          ...blockMatrix ? [hexMatrixGrid("ak-b", blockMatrix, "input", [-7.6, 0, 0])] : [],
          ...firstKeyMatrix ? [hexMatrixGrid("ak-k", firstKeyMatrix, "key", [0, 0, 0], { cellSize: 0.9 })] : [],
          ...initial ? [hexMatrixGrid("ak-a", initial, "transform", [7.6, 0, 0], { highlight: addkeyHighlight })] : [],
          arrow("ak-a1", [-5.4, 1, 0], [-2.8, 1, 0], "path"),
          arrow("ak-a2", [2.8, 1, 0], [5.4, 1, 0], "path"),
          ...valuePlate("ak-x1", [-4.1, 2.4, 0], "AddRoundKey", "XOR K0", "transform"),
          ...valuePlate("ak-x2", [4.1, 2.4, 0], "AddRoundKey", "state \u2295 key", "transform")
        ],
        {
          level: "operation",
          event: "XOR_EXECUTED",
          operation: "AddRoundKey(K0)",
          formula: "state[i] = state[i] \u2295 key[i] \u2014 every byte of the block XOR-ed with the first round key",
          stateBefore: cellsOf(blockMatrix ?? void 0),
          stateAfter: cellsOf(initial ?? void 0),
          changedValues: diffCells(blockMatrix ?? void 0, initial ?? void 0, "XOR K0"),
          why: t("simulation3d.aes.whyAddKey")
        }
      )
    );
    if (sboxIn && sboxOut) {
      const targets = new Set(sboxIn.flat());
      const sboxM = Array.from(
        { length: 16 },
        (_, r) => Array.from({ length: 16 }, (_2, c) => `${(r * 16 + c).toString(16).padStart(2, "0").toUpperCase()}`)
      );
      const sboxCells = sboxM.map(
        (row) => row.map((cell) => ({
          label: cell,
          tone: targets.has(cell) ? "active" : "muted"
        }))
      );
      steps.push(
        mk(
          sbox,
          [
            ...sboxIn ? [hexMatrixGrid("sb-in", sboxIn, "internal", [-10.5, 0, 0])] : [],
            {
              id: "sb-grid",
              kind: "grid",
              position: [0, 0, 0],
              tone: "muted",
              grid: {
                height: 1.2,
                layers: [
                  {
                    rows: 16,
                    cols: 16,
                    cellSize: 0.42,
                    gap: 0.05,
                    labelScale: 0.7,
                    cells: sboxCells
                  }
                ]
              }
            },
            ...sboxOut ? [hexMatrixGrid("sb-out", sboxOut, "transform", [10.5, 0, 0])] : [],
            arrow("sb-ar1", [-8.2, 1.2, 0], [-4.4, 1.2, 0], "path"),
            arrow("sb-ar2", [4.4, 1.2, 0], [8.2, 1.2, 0], "path"),
            ...valuePlate("sb-op", [0, 2.6, 0], decrypt ? "InvSubBytes" : "SubBytes", decrypt ? "inv S-box" : "S-box \xB7 16\xD716", "transform")
          ],
          {
            level: "operation",
            event: "SUBSTITUTE_EXECUTED",
            operation: decrypt ? "InvSubBytes" : "SubBytes",
            formula: "each byte b is replaced by S-box[b] \u2014 a nonlinear GF(2\u2078) map",
            stateBefore: cellsOf(sboxIn),
            stateAfter: cellsOf(sboxOut),
            changedValues: diffCells(sboxIn, sboxOut, decrypt ? "inverse S-box" : "S-box"),
            why: t("simulation3d.aes.whySubBytes")
          }
        )
      );
    }
    if (dA && dB && dC && dD) {
      steps.push(
        mk(
          round,
          [
            hexMatrixGrid("r1-a", dA, "internal", [-9.6, 0, 0], { cellSize: 0.85, height: 1.4 }),
            hexMatrixGrid("r1-b", dB, "transform", [-3.2, 0, 0], { cellSize: 0.85, height: 1.4 }),
            hexMatrixGrid("r1-c", dC, "transform", [3.2, 0, 0], { cellSize: 0.85, height: 1.4 }),
            hexMatrixGrid("r1-d", dD, "output", [9.6, 0, 0], { cellSize: 0.85, height: 1.4 }),
            arrow("r1-ar1", [-6.4, 1, 0], [-5.6, 1, 0], "path"),
            arrow("r1-ar2", [0, 1, 0], [0.8, 1, 0], "path"),
            arrow("r1-ar3", [6.4, 1, 0], [7.2, 1, 0], "path"),
            ...valuePlate("r1-op1", [-6.4, 2.7, 0], decrypt ? "InvShiftRows" : "ShiftRows", "rotate rows", "transform"),
            ...valuePlate("r1-op2", [0, 2.7, 0], decrypt ? "InvMixColumns" : "MixColumns", "mix columns", "transform"),
            ...valuePlate("r1-op3", [6.4, 2.7, 0], "AddRoundKey", "XOR round key", "transform"),
            ...roundKeyHex2 ? valuePlate("r1-rk", [0, -2.4, 4.4], "round key", roundKeyHex2, "key") : []
          ],
          {
            level: "bit",
            event: "ROUND_STARTED",
            operation: decrypt ? "First inverse round, magnified" : "First round, magnified",
            formula: decrypt ? "InvShiftRows \u2192 InvSubBytes \u2192 AddRoundKey \u2192 InvMixColumns" : "ShiftRows \u2192 MixColumns \u2192 AddRoundKey",
            inputs: { "round key": roundKeyHex2 || "" },
            why: t("simulation3d.aes.whyRoundDetail")
          }
        )
      );
    }
    if (midStates.length > 0) {
      const overviewObjs = [];
      midStates.forEach((m, i) => {
        const z = (i - (midStates.length - 1) / 2) * 3.4;
        overviewObjs.push(
          hexMatrixGrid(`ov-${i}`, m, i % 2 === 0 ? "internal" : "transform", [0, 0, z], { cellSize: 0.9, height: 1.5 }),
          ...valuePlate(`ovc-${i}`, [0, 3.2, z], `round ${i + 1}`, "", "muted")
        );
      });
      overviewObjs.push(...valuePlate("ov-legend", [0, -1.8, -16], "rounds", `${midStates.length} mid-round states`, "internal"));
      steps.push(
        mk(
          rounds,
          overviewObjs,
          {
            level: "concept",
            event: "ROUND_STARTED",
            operation: "Round journey",
            inputs: { rounds: String(nr - 1), "key words (Nk)": String(nk) },
            why: t("simulation3d.aes.whyRounds")
          }
        )
      );
      midStates.forEach((m, i) => {
        const roundNo = i + 1;
        const prev = roundNo === 1 ? initial ?? midStates[0] : midStates[i - 1];
        const keyIdx = decrypt ? nr - roundNo : roundNo;
        const keyLabel = roundKeys[keyIdx] ?? "";
        const note = decrypt ? `inverse round ${roundNo}/${nr - 1} \xB7 K${keyIdx}` : `round ${roundNo}/${nr - 1} \xB7 K${keyIdx}`;
        steps.push(
          mk(
            rounds,
            transitionScene(`aes-rm${roundNo}`, prev, m, note),
            {
              level: "bit",
              event: "ROUND_COMPLETED",
              operation: decrypt ? `Inverse round ${roundNo} of ${nr - 1} done` : `Round ${roundNo} of ${nr - 1} done`,
              formula: decrypt ? "InvShiftRows \u2192 InvSubBytes \u2192 AddRoundKey(K" + keyIdx + ") \u2192 InvMixColumns" : "SubBytes \u2192 ShiftRows \u2192 MixColumns \u2192 AddRoundKey(K" + keyIdx + ")",
              inputs: keyLabel ? { [`K${keyIdx}`]: keyLabel } : void 0,
              stateBefore: cellsOf(prev),
              stateAfter: cellsOf(m),
              changedValues: diffCells(prev, m, "AES round"),
              why: t("simulation3d.aes.whyRound")
            },
            {
              id: `-round-${roundNo}`,
              titleKey: "simulation3d.aes.roundTitle",
              titleArgs: { n: roundNo, total: nr - 1 },
              descKey: "simulation3d.aes.roundDesc",
              descArgs: { n: roundNo, total: nr - 1 }
            }
          )
        );
      });
    }
    steps.push(
      mk(
        final,
        [
          ...finalState ? [hexMatrixGrid("fn-st", finalState, "output", [-4.2, 0, 0])] : [],
          arrow("fn-ar", [-0.9, 0.6, 0], [1.6, 0.6, 0], "path"),
          ...hexStrip("fn-out", resultHex, "output", [4.2, 0.5, 0], { piece: 1, cellSize: 0.5, gap: 0.028 }).objects,
          ...valuePlate("fn-cap", [4.2, 2.5, 0], decrypt ? "plaintext" : "ciphertext", resultHex, "output", { emphasize: true })
        ],
        {
          level: "concept",
          event: "RESULT_READY",
          operation: decrypt ? "Decrypted plaintext" : "Encrypted ciphertext",
          inputs: { [decrypt ? "plaintext" : "ciphertext"]: resultHex },
          why: t("simulation3d.aes.whyFinal")
        }
      )
    );
    return steps;
  }
};

// src/components/simulation3d/adapters/blowfish3D.ts
var wordPlate = (id36, label, value, tone, x, z, emph = false) => valuePlate(id36, [x, 0.4, z], label, value.toUpperCase(), tone, { emphasize: emph });
var blowfish3DAdapter = createAdapterFromEngine(
  blowfishEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "blowfish-input": {
        const block = String(v.block ?? "").toUpperCase();
        const key = String(v.key ?? "").toUpperCase();
        const L = String(v.L ?? "").toUpperCase();
        const R = String(v.R ?? "").toUpperCase();
        return [
          ...hexStrip("blk", block, "input", [0, 1, -1.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects,
          ...hexStrip("ky", key, "key", [0, 1, 0.8], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects,
          ...wordPlate("L", "L (left word)", L, "internal", -2, 3, true),
          ...wordPlate("R", "R (right word)", R, "internal", 2, 3, true)
        ];
      }
      case "blowfish-pi": {
        const p = v.p ?? [];
        const objs = [];
        p.forEach((w, i) => {
          const a = i * (Math.PI * 2 / Math.max(1, p.length));
          objs.push(...valuePlate(`p${i}`, [10.5 * Math.cos(a), 0.5, 10.5 * Math.sin(a)], `P[${i}]`, w.toUpperCase(), i % 2 === 0 ? "key" : "internal"));
        });
        objs.push(
          {
            id: "pi-ring",
            kind: "ring",
            position: [0, 0, 0],
            ringRadius: 10.5,
            ringTube: 0.12,
            tone: "key"
          },
          ...valuePlate("pi", [0, 3.2, 0], "P-array", "first 148 hex digits of \u03C0", "key"),
          ...valuePlate("sb", [0, -2.4, 10], "S-boxes", "S0..S3 \xB7 4 \xD7 256 entries", "transform")
        );
        return objs;
      }
      case "blowfish-ksched": {
        const pXor = v.pXor ?? [];
        const finalP = v.finalP ?? [];
        const objs = [];
        pXor.slice(0, 18).forEach((w, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          objs.push(...wordPlate(`px${i}`, `P'[${i}]`, w, "transform", col * 3.8 - 9.5, row * 2.7 - 2.7));
        });
        if (finalP.length) {
          finalP.slice(0, 18).forEach((w, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            objs.push(...wordPlate(`pf${i}`, `P \u2022 ${i}`, w, "output", col * 3.8 - 9.5, row * 2.7 + 4.4));
          });
          objs.push(...valuePlate("capf", [0, 3, -3.4], "re-encrypt zero block", "final P-array", "output"));
        }
        objs.push(...valuePlate("cap", [0, 4.6, -6], "key schedule", "P[i] \u2295 key-word (key bytes cycled)", "transform"));
        return objs;
      }
      case "blowfish-f": {
        const L = String(v.L ?? "").toUpperCase();
        const bytes = v.bytes ?? ["", "", "", ""];
        const sHeads = v.sHeads ?? [];
        const objs = [
          ...valuePlate("L", [-4, 1.2, -3.2], "F(R) over L", L, "internal"),
          arrow("fa", [-1.8, 1.4, -3.2], [-1, 1.4, -3.2], "path")
        ];
        const step = 1.15;
        bytes.forEach((b, i) => {
          objs.push(
            {
              id: `b${i}`,
              kind: "box",
              position: [(i - 1.5) * step, 0.55, -3.2],
              size: [0.95, 0.95, 0.95],
              tone: "internal"
            },
            {
              id: `b${i}g`,
              kind: "glyph",
              position: [(i - 1.5) * step, 1.35, -3.2],
              label: b,
              glyphScale: 0.85,
              tone: "internal"
            },
            ...valuePlate(`s${i}`, [(i - 1.5) * step, 0.4, -0.6], `S${i}`, (sHeads[i] ?? []).slice(0, 4).join(" "), "key", { emphasize: false })
          );
        });
        objs.push(
          ...valuePlate("formula", [0, 1.2, -6], "F(x)", "F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]", "transform", { emphasize: true }),
          ...valuePlate("xy", [0, 0.3, 2.2], "op", "\u2295 / + (mod 2\xB3\xB2) \xB7 16 rounds", "path")
        );
        return objs;
      }
      case "blowfish-rounds": {
        const states = v.states ?? [];
        const L = String(v.L ?? "").toUpperCase();
        const R = String(v.R ?? "").toUpperCase();
        if (!states.length) {
          return [
            ...wordPlate("L", "L", L, "internal", -2, 0),
            ...wordPlate("R", "R", R, "internal", 2, 0),
            ...valuePlate("form", [0, 2.4, 0], "Feistel", "16 \xD7 (R ^= F(L) \u2295 P[i]; swap)", "transform")
          ];
        }
        const objs = [];
        states.slice(0, 16).forEach((s, i) => {
          const a = i * (Math.PI * 2 / 16);
          objs.push(...valuePlate(`r${i}`, [9 * Math.cos(a), 0.5, 9 * Math.sin(a)], `R${s.round}`, `L ${s.L.toUpperCase()} \xB7 R ${s.R.toUpperCase()}`, s.round % 2 === 0 ? "internal" : "transform"));
        });
        objs.push(
          {
            id: "bf-ring",
            kind: "ring",
            position: [0, 0, 0],
            ringRadius: 9,
            ringTube: 0.12,
            tone: "path"
          },
          ...valuePlate("cap", [0, 3.2, 0], "rounds", "16-round Feistel", "transform")
        );
        return objs;
      }
      case "blowfish-result": {
        const hex = String(v.hex ?? "").toUpperCase();
        return merge(
          ...hexStrip("out", hex, "output", [0, 0.3, 0], { piece: 1, cellSize: 0.62, gap: 0.04 }).objects,
          ...valuePlate("cap", [0, 2.1, 0], v.decrypt ? "plaintext" : "ciphertext", hex, "output", { emphasize: true })
        );
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/twofish3D.ts
var twofish3DAdapter = createAdapterFromEngine(
  twofishEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "twofish-input": {
        const block = String(v.block ?? "").toUpperCase();
        const key = String(v.key ?? "").toUpperCase();
        const words = ["m0", "m1", "m2", "m3"].map((m) => String(v[m] ?? "").toUpperCase());
        const objs = [
          ...hexStrip("blk", block, "input", [0, 1.2, -2], { cellSize: 0.58, gap: 0.03, glyphY: 2 }).objects,
          ...hexStrip("ky", key, "key", [0, -0.4, -2], { cellSize: 0.58, gap: 0.03, glyphY: 0.4 }).objects
        ];
        words.forEach((w, i) => {
          const x = (i - 1.5) * 3.1;
          objs.push(...valuePlate(`m${i}`, [x, 0.4, 2.2], `m${i}`, w, "internal"));
          if (i < 3) {
            const xn = (i - 0.5) * 3.1;
            objs.push(arrow(`wa${i}`, [x + 1.1, 0.4, 2.2], [xn - 1.1, 0.4, 2.2], "path"));
          }
        });
        objs.push(...valuePlate("cap", [0, 3.2, 2.2], "little-endian words", "block \u2192 m0..m3", "internal"));
        return objs;
      }
      case "twofish-key": {
        const whitening = v.whitening ?? [];
        const subkeys = v.subkeys ?? [];
        const objs = [];
        whitening.slice(0, 8).forEach((w, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          objs.push(...valuePlate(`w${i}`, [col * 3.4 - 5.1, 0.4, row * 2.6 - 1.3], `w[${i}]`, w.toUpperCase(), i % 2 === 0 ? "key" : "internal"));
        });
        for (let r = 0; r < 10; r++) {
          const four = subkeys.slice(4 * r, 4 * r + 4);
          const col = r % 5;
          const row = Math.floor(r / 5);
          objs.push(
            ...valuePlate(
              `sk${r}`,
              [col * 4.2 - 8.4, 0.4, 3.2 + row * 2.6],
              `k \xB7 round ${r + 1}`,
              (four.length ? four : ["\u2014", "\u2014", "\u2014", "\u2014"]).join(" "),
              r % 2 === 0 ? "key" : "internal"
            )
          );
        }
        objs.push(...valuePlate("cap", [0, 4.4, -4.6], "key schedule", "RS (12,8) + h() via q0/q1", "transform"));
        return objs;
      }
      case "twofish-sboxes": {
        const sboxes = v.sboxes ?? [];
        if (!sboxes.length) {
          return [
            ...valuePlate("cap", [0, 0.4, 0], "S-boxes", "S0..S3 \xB7 4 \xD7 256 MDS-combined entries", "key"),
            ...valuePlate("note", [0, -2.2, 2.6], "chain", "q0/q1 \u2192 MDS (GF(2\u2078), 0x169)", "transform")
          ];
        }
        const layersRows = sboxes.map((head) => ({
          cells: head.slice(0, 8).map((cell, c) => ({
            label: cell.toUpperCase(),
            tone: c % 2 === 0 ? "key" : "internal"
          }))
        }));
        return [
          {
            id: "sbox-heads",
            kind: "grid",
            position: [0, 0, 0],
            tone: "key",
            grid: {
              height: 1.2,
              layers: [
                {
                  rows: Math.max(1, sboxes.length),
                  cols: 8,
                  cellSize: 1.5,
                  gap: 0.24,
                  labelScale: 0.72,
                  cells: layersRows.map((r) => r.cells)
                }
              ]
            }
          },
          ...valuePlate("cap", [0, 3.6, 0], "S-vector heads", "q0/q1 \u2192 MDS (GF(2\u2078), 0x169)", "transform")
        ];
      }
      case "twofish-whiten": {
        const words = ["m0", "m1", "m2", "m3"].map((m) => String(v[m] ?? "").toUpperCase());
        const keys = v.keys ?? [];
        const objs = [];
        words.forEach((w, i) => {
          const x = (i - 1.5) * 3.3;
          objs.push(
            ...valuePlate(`m${i}`, [x, 1.1, -1.6], `m${i}`, w, "internal"),
            ...valuePlate(`k${i}`, [x, -0.4, 0.4], `w${v.decrypt ? 4 + i : i}`, (keys[i] ?? "").toUpperCase(), "key"),
            arrow(`x${i}`, [x, 0.4, 1.6], [x, 0.4, 2.8], "path")
          );
        });
        objs.push(...valuePlate("cap", [0, 3.6, 1.2], v.decrypt ? "de-whitening" : "whitening", "a=m0\u2295w0 \xB7 b=m1\u2295w1 \xB7 c=m2\u2295w2 \xB7 d=m3\u2295w3", "transform"));
        return objs;
      }
      case "twofish-rounds": {
        const states = v.states ?? [];
        if (!states.length) {
          return [
            ...valuePlate("cap", [0, 0.4, 0], "rounds", "16 \xD7 (g() keyed S-boxes + MDS \u2192 PHT \u2192 1-bit rotations)", "transform"),
            ...valuePlate("g", [0, -2, 1.6], "g(x)", "g(x) = S0[x0] \u2295 S1[x1] \u2295 S2[x2] \u2295 S3[x3]", "key")
          ];
        }
        const objs = [];
        states.slice(0, 16).forEach((s, i) => {
          const a = i * (Math.PI * 2 / 16);
          objs.push(
            ...valuePlate(
              `r${i}`,
              [9.4 * Math.cos(a), 0.5, 9.4 * Math.sin(a)],
              `R${s.round}`,
              `a ${s.a.toUpperCase()} \xB7 b ${s.b.toUpperCase()} \xB7 c ${s.c.toUpperCase()} \xB7 d ${s.d.toUpperCase()}`,
              s.round % 2 === 0 ? "internal" : "transform"
            )
          );
        });
        objs.push(
          {
            id: "twf-ring",
            kind: "ring",
            position: [0, 0, 0],
            ringRadius: 9.4,
            ringTube: 0.12,
            tone: "path"
          },
          ...valuePlate("cap", [0, 3.2, 0], "rounds", "16-round Feistel \xB7 4 words", "transform")
        );
        return objs;
      }
      case "twofish-result": {
        const hex = String(v.hex ?? "").toUpperCase();
        return [
          ...hexStrip("out", hex, "output", [0, 0.3, 0], { piece: 1, cellSize: 0.58, gap: 0.03 }).objects,
          ...valuePlate("cap", [0, 2.1, 0], v.decrypt ? "plaintext" : "ciphertext", hex, "output", { emphasize: true })
        ];
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/chacha203D.ts
var w82 = (v) => (v >>> 0).toString(16).padStart(8, "0");
var rotl4 = (v, s) => (v << s | v >>> 32 - s) >>> 0;
var addMod2 = (a, b) => a + b >>> 0;
function quarterRound2(s, a, b, c, d) {
  s[a] = addMod2(s[a], s[b]);
  s[d] = rotl4(s[d] ^ s[a], 16);
  s[c] = addMod2(s[c], s[d]);
  s[b] = rotl4(s[b] ^ s[c], 12);
  s[a] = addMod2(s[a], s[b]);
  s[d] = rotl4(s[d] ^ s[a], 8);
  s[c] = addMod2(s[c], s[d]);
  s[b] = rotl4(s[b] ^ s[c], 7);
}
var COLUMNS2 = [
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15]
];
var DIAGONALS2 = [
  [0, 5, 10, 15],
  [1, 6, 11, 12],
  [2, 7, 8, 13],
  [3, 4, 9, 14]
];
var CONSTANT_WORDS2 = [1634760805, 857760878, 2036477234, 1797285236];
var leWords2 = (bytes) => {
  const out = [];
  for (let i = 0; i < bytes.length; i += 4) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    const b3 = bytes[i + 3] ?? 0;
    out.push((b0 | b1 << 8 | b2 << 16 | b3 << 24) >>> 0);
  }
  return out;
};
function initialState2(keyHex, nonceHex, counter) {
  return CONSTANT_WORDS2.concat(leWords2(hexToBytes(keyHex))).concat([counter >>> 0]).concat(leWords2(hexToBytes(nonceHex)));
}
var wordsToHex = (ws) => ws.map(w82);
var wordsFromHex = (ws) => ws.map((w) => parseInt(w, 16) >>> 0);
var matrix4 = (words) => Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_2, c) => words[r * 4 + c] ?? "--------"));
function quarterRoundAfter(buf) {
  const s = buf.slice();
  quarterRound2(s, 0, 4, 8, 12);
  return s;
}
function changedCells2(before, after) {
  const out = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if ((before[r][c] ?? "--------") !== (after[r][c] ?? "--------")) out.push([r, c]);
    }
  }
  return out;
}
var setToHex = (n) => n.toString(16).padStart(8, "0");
function chachaRun(message, keyHex, nonceHex, counter, decrypt) {
  try {
    const init = initialState2(keyHex, nonceHex, counter);
    const working = init.slice();
    const doubles = [];
    for (let r = 0; r < 10; r++) {
      for (const q of COLUMNS2) quarterRound2(working, q[0], q[1], q[2], q[3]);
      for (const q of DIAGONALS2) quarterRound2(working, q[0], q[1], q[2], q[3]);
      doubles.push(working.slice());
    }
    const ks = init.map((w, i) => addMod2(w, working[i]));
    const ksBytes = new Uint8Array(ks.length * 4);
    ks.forEach((w, i) => {
      ksBytes[4 * i] = w & 255;
      ksBytes[4 * i + 1] = w >>> 8 & 255;
      ksBytes[4 * i + 2] = w >>> 16 & 255;
      ksBytes[4 * i + 3] = w >>> 24 & 255;
    });
    const dataBytes = decrypt ? hexToBytes(message.toLowerCase()) : strToBytes(message);
    const cipherBytes = ksBytes.slice(0, dataBytes.length).map((b, i) => b ^ (dataBytes[i] ?? 0));
    return {
      init: wordsToHex(init),
      doubles: doubles.map(wordsToHex),
      final: wordsToHex(working),
      ks: wordsToHex(ks),
      resultHex: bytesToHex(cipherBytes)
    };
  } catch {
    return null;
  }
}
var changedRows = (before, after, reason) => before.map((b, i) => ({
  entity: `w${i}`,
  label: `word ${i}`,
  before: b.toUpperCase(),
  after: (after[i] ?? "--------").toUpperCase(),
  reason,
  tone: "active"
})).filter((r) => r.before !== r.after);
function doubleRoundScene(prefix, before, after, note) {
  return [
    hexMatrixGrid(`${prefix}-b`, before, "internal", [-4.4, 0, 0]),
    hexMatrixGrid(`${prefix}-a`, after, "transform", [4.4, 0, 0], { highlight: changedCells2(before, after) }),
    arrow(`${prefix}-ar`, [-1.4, 0.7, 0], [2.4, 0.7, 0], "path"),
    ...valuePlate(`${prefix}-cap`, [0, 3.8, 0], "double round", note, "transform")
  ];
}
var chacha203DAdapter = {
  id: chacha20Engine.id,
  nameKey: chacha20Engine.nameKey,
  educationalKey: chacha20Engine.educationalKey,
  demoInputs: chacha20Engine.demoInputs,
  buildSteps(ctx) {
    const t = ctx.t;
    const stages = chacha20Engine.build(ctx);
    const input = stages.find((s) => s.id === "chacha20-input");
    const state = stages.find((s) => s.id === "chacha20-state");
    const quarter = stages.find((s) => s.id === "chacha20-quarter");
    const double = stages.find((s) => s.id === "chacha20-double");
    const rounds = stages.find((s) => s.id === "chacha20-rounds");
    const keystream = stages.find((s) => s.id === "chacha20-keystream");
    const result = stages.find((s) => s.id === "chacha20-result");
    if (!input || !state || !quarter || !double || !rounds || !keystream || !result) return [];
    const v = (kind) => stages.find((s) => s.view?.kind === kind)?.view ?? {};
    const iv = v("chacha-input");
    const sv = v("chacha-state");
    const qv = v("chacha-quarter");
    const kv = v("chacha-keystream");
    const rv = v("chacha-result");
    const decrypt = Boolean(rv.decrypt);
    const message = String(iv.message ?? "");
    const keyHex = String(iv.key ?? "").replace(/\s/g, "").toLowerCase();
    const nonceHex = String(iv.nonce ?? "").replace(/\s/g, "").toLowerCase();
    const counter = Number(iv.counter ?? 1) || 0;
    const run = chachaRun(message, keyHex, nonceHex, counter, decrypt);
    const resultHex = String(rv.hex ?? "").toUpperCase();
    const mk = (st, objects, meta, p = {}) => ({
      id: `3d-${st.id}${p.id ?? ""}`,
      titleKey: p.titleKey ?? st.titleKey,
      titleArgs: p.titleArgs,
      descKey: p.descKey ?? st.descKey,
      descArgs: p.descArgs ?? st.descArgs,
      phase: p.phase ?? st.phase,
      objects,
      camera: p.camera,
      duration: p.duration ?? 800,
      meta
    });
    const steps = [];
    steps.push(
      mk(
        input,
        [
          ...hexStrip("msg", message, "input", [-4, 0.8, -2.6], { cellSize: 0.7, gap: 0.08, glyphY: 1.6 }),
          ...hexStrip("ky", keyHex.toUpperCase(), "key", [0, 0.8, 0.2], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.3 }),
          ...hexStrip("nc", nonceHex.toUpperCase(), "key", [0, 0.8, 1.6], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.3 }),
          ...valuePlate("ctr", [4.6, 0.5, 2.2], "counter", String(counter), "key", { emphasize: true }),
          ...valuePlate("cap", [0, 3.2, -2.6], "inputs", "message \xB7 key (32 B) \xB7 nonce \xB7 counter", "internal")
        ],
        {
          level: "concept",
          event: "INPUT_CREATED",
          operation: "Setup",
          inputs: { message, key: keyHex.toUpperCase(), nonce: nonceHex.toUpperCase(), counter: String(counter) },
          why: t("simulation3d.chacha20.whyInput")
        }
      )
    );
    const initGrid = sv.grid ?? (run ? matrix4(run.init) : void 0);
    if (initGrid) {
      steps.push(
        mk(
          state,
          [
            hexMatrixGrid("cc-st", initGrid, "internal", [0, 0, 0]),
            ...valuePlate("cc-cap", [0, 3.7, 3.2], "initial state", "c \xB7 k(8) \xB7 counter \xB7 nonce \xB7 c", "internal"),
            ...valuePlate("cc-rows", [0, -2, 4.6], "layout", "ccckkkkkkxxxx", "muted")
          ],
          {
            level: "algorithm",
            event: "STATE_UPDATED",
            operation: "Assemble state",
            formula: "S[0..3] = c || S[4..11] = key || S[12] = counter || S[13..15] = nonce",
            inputs: run ? { "constant": CONSTANT_WORDS2.map(setToHex).join(" "), "counter": setToHex(counter) } : void 0,
            stateBefore: run ? Object.fromEntries(run.init.map((w, i) => [`w${i}`, w.toUpperCase()])) : void 0,
            why: t("simulation3d.chacha20.whyState")
          }
        )
      );
    }
    const qrBefore = qv.grid ?? initGrid;
    const qrAfterM = qv.after ?? (run ? matrix4(wordsToHex(quarterRoundAfter(wordsFromHex(run.init)))) : void 0);
    if (qrBefore && qrAfterM && run) {
      steps.push(
        mk(
          quarter,
          [
            hexMatrixGrid("cc-qr-b", qrBefore, "internal", [-3.6, 0, 0], { highlight: [[0, 0], [1, 0], [2, 0], [3, 0]] }),
            hexMatrixGrid("cc-qr-a", qrAfterM, "active", [3.6, 0, 0], { highlight: [[0, 0], [1, 0], [2, 0], [3, 0]] }),
            arrow("cc-qr-ar", [-0.2, 0.6, 0], [1.6, 0.6, 0], "path"),
            ...valuePlate("cc-qr-cap", [0, 3.7, 0], "quarter round", "quarter_round(0, 4, 8, 12)", "transform")
          ],
          {
            level: "operation",
            event: "ROTATE_EXECUTED",
            operation: "Quarter round (0,4,8,12)",
            formula: "a+=b \xB7 d=RROTL(d^a,16) \xB7 c+=d \xB7 b=RROTL(b^c,12) \xB7 a+=b \xB7 d=RROTL(d^a,8) \xB7 c+=d \xB7 b=RROTL(b^c,7)",
            changedValues: changedRows(
              qrBefore.flat(),
              qrAfterM.flat(),
              "quarter round"
            ),
            why: t("simulation3d.chacha20.whyQuarter")
          }
        )
      );
    }
    if (run) {
      run.doubles.forEach((afterWords, i) => {
        const beforeWords = i === 0 ? run.init : run.doubles[i - 1];
        const before = matrix4(beforeWords);
        const after = matrix4(afterWords);
        steps.push(
          mk(
            double,
            doubleRoundScene(`cc-dr${i}`, before, after, `double round ${i + 1} / 10`),
            {
              level: i === 0 ? "operation" : "bit",
              event: "ROUND_STARTED",
              operation: `Double round ${i + 1} of 10`,
              formula: "column round: (0,4,8,12) (1,5,9,13) (2,6,10,14) (3,7,11,15) \xB7 diagonal round: (0,5,10,15) (1,6,11,12) (2,7,8,13) (3,4,9,14)",
              inputs: {},
              stateBefore: Object.fromEntries(beforeWords.map((w, x) => [`w${x}`, w.toUpperCase()])),
              stateAfter: Object.fromEntries(afterWords.map((w, x) => [`w${x}`, w.toUpperCase()])),
              changedValues: changedRows(beforeWords, afterWords, "column + diagonal QR"),
              why: t("simulation3d.chacha20.whyDouble")
            },
            {
              id: `-round-${i + 1}`,
              titleKey: "simulation3d.chacha20.doubleTitle",
              titleArgs: { n: i + 1 },
              descKey: "simulation3d.chacha20.doubleDesc",
              descArgs: { n: i + 1 }
            }
          )
        );
      });
      steps.push(
        mk(
          rounds,
          [
            hexMatrixGrid("cc-wrk", matrix4(run.final), "internal", [0, 0, 0]),
            ...valuePlate("cc-wrk-cap", [0, 3.7, 3.2], "working state", "state after all 20 rounds", "transform")
          ],
          {
            level: "algorithm",
            event: "ROUND_COMPLETED",
            operation: "Working state",
            formula: "after 10 \xD7 (column round + diagonal round)",
            inputs: { "double rounds": "10" },
            why: t("simulation3d.chacha20.whyRounds")
          }
        )
      );
      const kGridInit = kv.init ?? matrix4(run.init);
      const kGridKs = kv.ks ?? matrix4(run.ks);
      const ksHex = String(kv.ksHex ?? "");
      steps.push(
        mk(
          keystream,
          [
            hexMatrixGrid("cc-ks-i", kGridInit, "muted", [-5, 0, 0]),
            hexMatrixGrid("cc-ks-z", kGridKs, "transform", [5, 0, 0]),
            arrow("cc-ks-ar1", [-2, 0.7, 0], [-0.4, 0.7, 0], "path"),
            arrow("cc-ks-ar2", [2.2, 0.7, 0], [4, 0.7, 0], "path"),
            ...valuePlate("cc-ks-cap", [0, 3.5, 0], "keystream block", "init + working (mod 2\xB3\xB2)", "transform"),
            ...ksHex ? hexStrip("cc-ksh", ksHex.toUpperCase(), "output", [0, -0.6, 4.6], { piece: 2, cellSize: 0.46, gap: 0.025, glyphY: 0.15 }) : []
          ],
          {
            level: "operation",
            event: "ADD_EXECUTED",
            operation: "Keystream block Z",
            formula: "Z[i] = init[i] + working[i] (mod 2\xB3\xB2)",
            changedValues: changedRows(run.init, run.ks, "init + working (mod 2\xB3\xB2)"),
            why: t("simulation3d.chacha20.whyKeystream")
          }
        )
      );
    } else {
      const fg = sv.grid ?? qv.grid;
      if (fg) {
        steps.push(
          mk(state, [hexMatrixGrid("st", fg, "internal", [0, 0, 0])], {
            level: "algorithm",
            event: "STATE_UPDATED",
            operation: "Initial state"
          })
        );
      }
      steps.push(
        mk(double, [hexMatrixGrid("cc-b", fg ?? [], "internal", [0, 0, 0])], {
          level: "operation",
          event: "ROUND_STARTED",
          operation: "Rounds"
        })
      );
    }
    steps.push(
      mk(
        result,
        merge(
          ...hexStrip("out", resultHex, "output", [0, 0.6, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.3 }),
          ...valuePlate("cc-out-cap", [0, 2.5, 0], decrypt ? "plaintext" : "ciphertext", resultHex, "output", { emphasize: true })
        ),
        {
          level: "concept",
          event: "XOR_EXECUTED",
          operation: decrypt ? "Decrypt (XOR)" : "Encrypt (XOR)",
          formula: decrypt ? "P = C \u2295 Z" : "C = P \u2295 Z",
          inputs: { message, "keystream": "first 64 bytes" },
          outputs: { result: resultHex },
          why: t("simulation3d.chacha20.whyResult")
        }
      )
    );
    return steps;
  }
};

// src/components/simulation3d/adapters/aesGcm3D.ts
var aesGcm3DAdapter = createAdapterFromEngine(
  aesGcmEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "agcm-input": {
        const data = v.decrypt ? String(v.ciphertext ?? "") : String(v.plaintext ?? "");
        const key = String(v.key ?? "");
        const nonce = String(v.nonce ?? "");
        const aad = String(v.aad ?? "");
        return [
          ...data ? hexStrip("data", v.decrypt ? data.toUpperCase() : data, "input", [0, 1, -2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : [quote("nodata", "no input")],
          ...hexStrip("ky", key.toUpperCase(), "key", [0, 1, -0.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...hexStrip("nc", nonce.toUpperCase(), "key", [0, 1, 1], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...aad ? hexStrip("aad", aad, "internal", [0, 1, 2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : [],
          ...valuePlate("cap", [0, 3.4, 0], "inputs", v.decrypt ? "ciphertext \u2016 tag" : "plaintext \xB7 key \xB7 nonce \xB7 aad", "internal")
        ];
      }
      case "agcm-stream": {
        const hex = (v.decrypt ? String(v.pt ?? "") : String(v.ct ?? "")) || "no result yet";
        return [
          ...hexStrip("out", hex.toUpperCase(), "output", [0, 0.8, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate("op", [0, 3.1, 0], v.decrypt ? "AES-CTR decrypt" : "AES-CTR encrypt", "CTR keystream \u2295 block", "transform"),
          ...valuePlate("formula", [0, -1.2, 2.8], "CTR", "E_K(counter \u2016 nonce) XOR plaintext", "muted")
        ];
      }
      case "agcm-mackey": {
        const nonce = String(v.nonce ?? "").toUpperCase();
        return [
          ...hexStrip("nc", nonce, "key", [0, 0.8, -0.8], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate("h", [-4, 0.5, 1.6], "H subkey", "AES-encrypt 0\xB9\xB2\u2078", "internal"),
          ...valuePlate("j0", [4, 0.5, 1.6], "J0", "nonce \u2016 0x00000001", "key"),
          ...valuePlate("cap", [0, 2.8, 1.6], "GHASH setup", "H = E_K(0\xB9\xB2\u2078) \xB7 J0 = nonce\u20161", "transform")
        ];
      }
      case "agcm-ghash": {
        const aadH = String(v.aadHex ?? "");
        const tagH = String(v.tagHex ?? "");
        return [
          ...aadH ? hexStrip("aad", aadH.toUpperCase(), "internal", [0, 0.9, -1.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.55 }).objects : [],
          ...valuePlate("gh", [0, 0.5, 1.4], "GHASH(H, \xB7)", "AAD \u2016 ciphertext \u2016 len", "transform"),
          ...valuePlate("tag", [0, -0.4, 3.4], "tag", tagH.toUpperCase(), "output", { emphasize: true })
        ];
      }
      case "agcm-verify": {
        const auth = String(v.auth ?? "");
        const passed = auth === "PASS";
        const tagH = String(v.tagHex ?? "").toUpperCase();
        return merge(
          ...valuePlate("auth", [0, 0.4, 0], "authentication", passed ? "PASS" : v.decrypt ? "verify tag first" : "tag ready", passed ? "output" : v.decrypt ? "error" : "internal", { emphasize: true }),
          ...valuePlate("tag", [0, -2, 0], "tag", tagH, "output"),
          ...valuePlate("note", [0, 2.9, 0], "timing-safe", "constant-time compare", "muted")
        );
      }
      case "agcm-result": {
        const hex = String(v.out ?? "").toUpperCase();
        return merge(
          ...hexStrip("out", hex, "output", [0, 0.6, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate("cap", [0, 2.7, 0], v.decrypt ? "plaintext" : "ciphertext \u2016 tag", hex, "output", { emphasize: true })
        );
      }
      default:
        return [];
    }
  }
);
function quote(id36, text) {
  return { id: id36, kind: "glyph", position: [0, 1, -2.4], label: text, glyphScale: 0.9, tone: "muted" };
}

// src/components/simulation3d/adapters/chacha20Poly13053D.ts
var chacha20Poly13053DAdapter = createAdapterFromEngine(
  chacha20Poly1305Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "cp-input": {
        const data = v.decrypt ? String(v.ciphertext ?? "") : String(v.plaintext ?? "");
        const key = String(v.key ?? "");
        const nonce = String(v.nonce ?? "");
        const aad = String(v.aad ?? "");
        return [
          ...data ? hexStrip("data", v.decrypt ? data.toUpperCase() : data, "input", [0, 1, -2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : [],
          ...hexStrip("ky", key.toUpperCase(), "key", [0, 1, -0.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...hexStrip("nc", nonce.toUpperCase(), "key", [0, 1, 1], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...aad ? hexStrip("aad", aad, "internal", [0, 1, 2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : [],
          ...valuePlate("cap", [0, 3.4, 0], "inputs", v.decrypt ? "ciphertext \u2016 tag" : "plaintext \xB7 key \xB7 nonce \xB7 aad", "internal")
        ];
      }
      case "cp-stream": {
        const hex = (v.decrypt ? String(v.pt ?? "") : String(v.ct ?? "")) || "no result yet";
        return [
          ...hexStrip("out", hex.toUpperCase(), "output", [0, 0.8, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate("op", [0, 3.1, 0], v.decrypt ? "ChaCha20 decrypt" : "ChaCha20 encrypt", "ChaCha20(key, nonce, ctr=1) \u2295 data", "transform")
        ];
      }
      case "cp-mackey": {
        const nonce = String(v.nonce ?? "").toUpperCase();
        return [
          ...hexStrip("nc", nonce, "key", [0, 0.8, -0.8], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate("rs", [0, 0.6, 1.8], "one-time key", "r, s \u2190 ChaCha20 block 0 first 32 bytes", "key"),
          ...valuePlate("cap", [0, 2.9, 1.8], "Poly1305 key", "block 0 \u2192 r \u2016 s", "transform")
        ];
      }
      case "cp-poly": {
        const aadH = String(v.aadHex ?? "");
        const tagH = String(v.tagHex ?? "");
        return [
          ...aadH ? hexStrip("aad", aadH.toUpperCase(), "internal", [0, 0.9, -1.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.55 }).objects : [],
          ...valuePlate("gh", [0, 0.5, 1.4], "Poly1305(r, s, \xB7)", "AAD \u2016 ciphertext \u2016 len", "transform"),
          ...valuePlate("tag", [0, -0.4, 3.4], "tag", tagH.toUpperCase(), "output", { emphasize: true })
        ];
      }
      case "cp-verify": {
        const auth = String(v.auth ?? "");
        const passed = auth === "PASS";
        const tagH = String(v.tagHex ?? "").toUpperCase();
        return merge(
          ...valuePlate("auth", [0, 0.4, 0], "authentication", passed ? "PASS" : v.decrypt ? "verify tag first" : "tag ready", passed ? "output" : v.decrypt ? "error" : "internal", { emphasize: true }),
          ...valuePlate("tag", [0, -2, 0], "tag", tagH, "output"),
          ...valuePlate("note", [0, 2.9, 0], "timing-safe", "constant-time compare", "muted")
        );
      }
      case "cp-result": {
        const hex = String(v.out ?? "").toUpperCase();
        return merge(
          ...hexStrip("out", hex, "output", [0, 0.6, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate("cap", [0, 2.7, 0], v.decrypt ? "plaintext" : "ciphertext \u2016 tag", hex, "output", { emphasize: true })
        );
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/hash3d.ts
function msgInputScene(text, bytesHex) {
  const chars = (text || "\xB7").split("");
  return [
    ...charRow("msg", chars.map((ch) => ({ label: ch, tone: "input" })), [0, 0.6, -2.2], {
      cellSize: 0.72,
      gap: 0.09
    }).objects,
    ...valuePlate("hex", [0, -0.3, 1.6], "bytes", bytesHex.toUpperCase(), "input")
  ];
}
function padRowsScene(blocksHex, msgLen, opts = {}) {
  const piece = opts.piece ?? 2;
  const blockBytes = opts.msgBytesPerBlock ?? 64;
  const rows = blocksHex.map((block, bi) => ({
    label: `block ${bi}`,
    cells: (block.match(new RegExp(`.{${piece}}`, "g")) ?? []).map((h, i) => ({
      label: h.toUpperCase(),
      tone: bi * blockBytes + i * piece < msgLen ? "internal" : "key"
    }))
  }));
  return rows3D(rows, [0, 0, 0], { rowStep: 2.4, cellSize: 0.52, gap: 0.03 }).objects;
}
function wordLaneScene(idPrefix, words, tone, origin) {
  const cells = (words ?? []).map((w) => ({ label: w.toUpperCase(), tone }));
  return charRow(idPrefix, cells, origin, { cellSize: 0.62, gap: 0.05, cubeY: 0.3, glyphY: 1 }).objects;
}
function roundRingScene(idPrefix, count, opts = {}) {
  const radius = opts.radius ?? 6.5;
  const samples = new Set(opts.samples ?? []);
  const tone = opts.tone ?? "internal";
  const objs = [
    {
      id: `${idPrefix}-orbit`,
      kind: "ring",
      position: [0, 0.4, 0],
      ringRadius: radius,
      ringTube: 0.08,
      tone: "path"
    }
  ];
  for (let i = 0; i < count; i++) {
    const a = i * (Math.PI * 2 / count);
    const r = samples.has(i) ? radius * 0.96 : radius;
    objs.push({
      id: `${idPrefix}-${i}`,
      kind: "sphere",
      position: [r * Math.cos(a), 0.55, r * Math.sin(a)],
      size: samples.has(i) ? [0.5, 0.5, 0.5] : [0.34, 0.34, 0.34],
      tone: samples.has(i) ? "active" : tone,
      emphasize: samples.has(i)
    });
  }
  const cap = opts.note ?? `${count} rounds`;
  objs.push(...valuePlate(`${idPrefix}-cap`, [0, 2.5, -radius * 0.9], "rounds", cap, "transform"));
  return objs;
}
function lanesScene(idPrefix, opts = {}) {
  const rateLanes = opts.rateLanes ?? 0;
  const rows = [];
  for (let y = 0; y < 5; y++) {
    const row = [];
    for (let x = 0; x < 5; x++) {
      const idx = y * 5 + x;
      row.push({ label: opts.values?.[idx] ?? "\xB7", tone: idx < rateLanes ? opts.tone ?? "internal" : "key" });
    }
    rows.push(row);
  }
  return [gridObject(idPrefix, rows, { cellSize: 1.15, gap: 0.14, labelScale: 0.9, height: 1.4 })];
}
function byteCountScene(idPrefix, count, active, note) {
  const gap = 0.16;
  const cellSize = 0.42;
  const off = (count - 1) * (cellSize + gap) / 2;
  const objs = [];
  for (let i = 0; i < count; i++) {
    const on = i < active;
    const x = -off + i * (cellSize + gap);
    objs.push(
      {
        id: `${idPrefix}-${i}`,
        kind: "box",
        position: [x, 0.3, 0],
        size: [cellSize, cellSize, cellSize],
        tone: on ? "output" : "key",
        opacity: on ? 1 : 0.5
      },
      {
        id: `${idPrefix}-${i}g`,
        kind: "glyph",
        position: [x, 0.95, 0],
        label: on ? "\u2022" : "\xB7",
        glyphScale: 0.6,
        tone: on ? "output" : "key",
        opacity: on ? 1 : 0.5
      }
    );
  }
  objs.push(...valuePlate(`${idPrefix}-cap`, [0, 2.5, 1.8], "XOF", note, "output"));
  return objs;
}
function digestScene(hex, deco) {
  const obj = hex.replace(/\s/g, "");
  if (!obj) {
    return [
      ...valuePlate("dg", [0, 1.1, -2.4], "digest", deco.toUpperCase(), "output", { emphasize: true }),
      ...valuePlate("dg-pending", [0, -1.4, 2.2], "result", "\u2014", "muted"),
      ...valuePlate("dg-run", [0, -3, 4.6], "note", "run the algorithm to get the real digest", "muted")
    ];
  }
  return [
    ...valuePlate("dg", [0, 1.1, -2.4], "digest", deco.toUpperCase(), "output", { emphasize: true }),
    ...hexStrip("dgs", obj.toUpperCase(), "output", [0, -1, 2.8], { piece: 2, cellSize: 0.5, gap: 0.03 })
  ];
}

// src/components/simulation3d/adapters/sha2563D.ts
var sha256Adapter = createAdapterFromEngine(
  sha256Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "sha256-input":
        return msgInputScene(String(v.text ?? ""), String(v.hex ?? ""));
      case "sha256-padding": {
        return [
          ...padRowsScene(v.blocksHex ?? [], Number(v.msgLen ?? 0)),
          ...valuePlate("padcap", [0, 1.6, -4.4], "padding", `${Number(v.blockCount)} block(s) \xB7 ${Number(v.padBytes)} pad bytes`, "key")
        ];
      }
      case "sha256-schedule": {
        const schedule = v.schedule ?? [];
        const rows = [];
        for (let i = 0; i < schedule.length; i += 8) rows.push(schedule.slice(i, i + 8));
        return [
          gridObject(
            "schedule",
            rows.map((r) => r.map((w) => ({ label: w.toUpperCase(), tone: "internal" }))),
            { cellSize: 1.35, gap: 0.12, labelScale: 0.85, height: 1.5 }
          ),
          ...valuePlate("schedule-cap", [0, 2.4, -4.6], "message schedule", "W[0..63] \xB7 8\xD78", "internal")
        ];
      }
      case "sha256-rounds": {
        const rounds = v.rounds ?? [];
        const samples = v.samples ?? [];
        const objs = roundRingScene("sha256-rt", rounds.length, { samples });
        rounds.filter((r) => samples.includes(r.t)).forEach((r, i) => {
          const x = (i - (Math.min(samples.length, 3) - 1) / 2) * 4.6;
          objs.push(
            ...valuePlate(`rs${i}`, [x, 1.25, 3.2], `round t = ${r.t}`, `W=${r.w}`, "internal"),
            ...wordLaneScene(`rs${i}-st`, r.state, "transform", [x - 2, -0.7, 3.2])
          );
        });
        return objs;
      }
      case "sha256-final": {
        const hInit = v.hInit ?? [];
        const hFinal = v.hFinal ?? [];
        const digest = String(v.digest ?? "");
        return [
          ...wordLaneScene("h0", hInit, "input", [0, 0.4, -4.8]),
          arrow("f1", [0, 0.5, -3.4], [0, 0.5, -1.6], "path"),
          ...wordLaneScene("h1", hFinal, "transform", [0, 0.4, 0]),
          arrow("f2", [0, 0.5, 1.4], [0, 0.5, 3.2], "path"),
          ...hexStrip("dig", digest.toUpperCase(), "output", [0, 0.55, 4.4], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
          ...valuePlate("hstate", [0, 2.9, -4.6], "state", "h0 \xB7 h1 \xB7 \u2026 \xB7 h7", "input")
        ];
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/sha5123D.ts
var REG_NAMES = ["a", "b", "c", "d", "e", "f", "g", "h"];
function regsOf(words) {
  const out = {};
  REG_NAMES.forEach((n, i) => {
    out[n] = (words[i] ?? "").toUpperCase();
  });
  return out;
}
function roundChanges(prev, cur) {
  const row = (name, before, after, reason) => ({
    entity: name,
    label: `register ${name}`,
    before: before.toUpperCase(),
    after: after.toUpperCase(),
    reason,
    tone: "active"
  });
  return [
    row("a", prev[0], cur[0], "a = T1 + T2"),
    row("b", prev[0], cur[1], "b \u2190 a"),
    row("c", prev[1], cur[2], "c \u2190 b"),
    row("d", prev[2], cur[3], "d \u2190 c"),
    row("e", prev[4], cur[4], "e = d + T1"),
    row("f", prev[4], cur[5], "f \u2190 e"),
    row("g", prev[5], cur[6], "g \u2190 f"),
    row("h", prev[6], cur[7], "h \u2190 g")
  ];
}
function roundCursor(prefix, t, count) {
  const a = t * (Math.PI * 2 / count);
  return [
    {
      id: `${prefix}-ring`,
      kind: "ring",
      position: [0, 0.7, 0],
      ringRadius: 1.7,
      ringTube: 0.05,
      tone: "path"
    },
    {
      id: `${prefix}-dot`,
      kind: "sphere",
      position: [1.7 * Math.cos(a), 0.85, 1.7 * Math.sin(a)],
      size: [0.42, 0.42, 0.42],
      tone: "active",
      emphasize: true
    }
  ];
}
function regLane(prefix, state) {
  const cells = state.map((w, i) => ({
    label: w.toUpperCase(),
    tone: i === 0 || i === 4 ? "active" : "internal",
    emphasize: i === 0 || i === 4
  }));
  return charRow(prefix, cells, [0, 0.95, 1.7], { cellSize: 0.62, gap: 0.05, cubeY: 0.3, glyphY: 1 }).objects;
}
function paddingScene(blocksHex) {
  if (blocksHex.length === 0) return [];
  const objs = [];
  blocksHex.forEach((block, bi) => {
    const words = [];
    for (let i = 0; i < block.length; i += 16) words.push(block.slice(i, i + 16));
    const z = (bi - (blocksHex.length - 1) / 2) * 3.1;
    const rows = [];
    for (let i = 0; i < words.length; i += 8) rows.push(words.slice(i, i + 8));
    objs.push(
      gridObject(
        `blk-${bi}`,
        rows.map((r) => r.map((w) => ({ label: w.toUpperCase(), tone: "internal" }))),
        { cellSize: 1.15, gap: 0.12, labelScale: 0.75, height: 1.3 }
      )
    );
    objs.push(...valuePlate(`blkc-${bi}`, [0, 2.7, z], `block ${bi}`, "512-bit", "muted"));
  });
  return objs;
}
var sha512Adapter = {
  id: sha512Engine.id,
  nameKey: sha512Engine.nameKey,
  educationalKey: sha512Engine.educationalKey,
  demoInputs: sha512Engine.demoInputs,
  getLegend() {
    return [
      { id: "input", labelKey: "simulation3d.legend.input", tone: "input" },
      { id: "key", labelKey: "simulation3d.legend.key", tone: "key" },
      { id: "active", labelKey: "simulation3d.legend.active", tone: "active" },
      { id: "transform", labelKey: "simulation3d.legend.transform", tone: "transform" },
      { id: "internal", labelKey: "simulation3d.legend.internal", tone: "internal" },
      { id: "output", labelKey: "simulation3d.legend.output", tone: "output" },
      { id: "path", labelKey: "simulation3d.legend.path", tone: "path" }
    ];
  },
  buildSteps(ctx) {
    const t = ctx.t;
    const stages = sha512Engine.build(ctx);
    const input = stages.find((s) => s.id === "sha512-input");
    const padding = stages.find((s) => s.id === "sha512-padding");
    const rounds = stages.find((s) => s.id === "sha512-rounds");
    const state = stages.find((s) => s.id === "sha512-state");
    const digest = stages.find((s) => s.id === "sha512-digest");
    if (!input || !padding || !rounds || !state || !digest) return [];
    const surface = (kind) => stages.find((s) => s.view?.kind === kind)?.view ?? {};
    const iv = surface("sha512-input");
    const pv = surface("sha512-padding");
    const sv = surface("sha512-state");
    const dv = surface("sha512-digest");
    const extra = ctx.result?.extra ?? {};
    const blocks = Array.isArray(extra.blocks) ? extra.blocks : [];
    const first = blocks[0];
    const rnd = first?.rounds ?? [];
    const hInit = Array.isArray(sv.hInit) ? sv.hInit : [];
    const finalWords = Array.isArray(sv.state) ? sv.state : [];
    const hasRounds = rnd.length > 0;
    const hasState = hInit.length === 8 && finalWords.length === 8 && Boolean(sv.hasResult);
    const digestHex = String(dv.digest ?? "");
    const hasDigest = digestHex.length > 0 && Boolean(dv.hasResult);
    const mk = (st, objects, meta, extra2 = {}) => ({
      id: `3d-${st.id}${extra2.id ?? ""}`,
      titleKey: extra2.titleKey ?? st.titleKey,
      titleArgs: extra2.titleArgs,
      descKey: extra2.descKey ?? st.descKey,
      descArgs: extra2.descArgs ?? st.descArgs,
      phase: extra2.phase ?? st.phase,
      objects,
      camera: extra2.camera,
      duration: extra2.duration ?? 800,
      meta
    });
    const steps = [];
    const text = String(iv.text ?? "");
    const hex = String(iv.hex ?? "");
    steps.push(
      mk(input, msgInputScene(text, hex), {
        level: "concept",
        event: "INPUT_CREATED",
        operation: "Encode input",
        inputs: { message: text || "\xB7", bytes: hex.toUpperCase() },
        why: t("simulation3d.sha512.whyInput")
      })
    );
    const blocksHex = Array.isArray(pv.blocksHex) ? pv.blocksHex : [];
    steps.push(
      mk(padding, paddingScene(blocksHex), {
        level: "algorithm",
        event: "PADDING_APPLIED",
        operation: "MD padding",
        inputs: {
          "bytes": String(iv.len ?? 0),
          "bits": String(iv.bits ?? 0),
          "blocks": String(Number(pv.blockCount ?? 0)),
          "pad bytes": String(Number(pv.padBytes ?? 0))
        },
        why: t("simulation3d.sha512.whyPadding")
      })
    );
    if (hasRounds) {
      const w0 = rnd.slice(0, 16).map((r) => r.W);
      const sampleExpanded = [16, 20, 63].filter((n) => rnd[n]).map((n) => ({ [n]: rnd[n].W })).reduce((acc, it) => ({ ...acc, ...it }), {});
      steps.push(
        mk(
          rounds,
          [
            ...wordLaneScene("sh-sch", w0, "input", [0, 1, 0.8]),
            ...valuePlate("sh-schcap", [0, 2.8, -1.6], "W[0..15]", "message words", "transform"),
            ...valuePlate("sh-lexp", [0, -1.4, 2.4], "W[16..79]", "\u03C30 + \u03C31 expansion", "key")
          ],
          {
            level: "operation",
            event: "SCHEDULE_READY",
            operation: "Message schedule",
            formula: "W[t] = \u03C30(W[t-15]) + W[t-16] + \u03C31(W[t-2]) + W[t-7]",
            inputs: { "W[0..15]": "block 0 words", \u03C30: "ROTR1 \u2295 ROTR8 \u2295 SHR7", \u03C31: "ROTR19 \u2295 ROTR61 \u2295 SHR6" },
            outputs: sampleExpanded,
            why: t("simulation3d.sha512.whySchedule")
          }
        )
      );
      steps.push(
        mk(
          rounds,
          roundRingScene("sh-ov", 80, { samples: [0, 20, 63], radius: 8.2, note: "80 rounds" }),
          {
            level: "concept",
            event: "ROUND_STARTED",
            operation: "Round traversal",
            inputs: { "working registers": "a,b,c,d,e,f,g,h", rounds: "80" },
            why: t("simulation3d.sha512.whyOverview")
          }
        )
      );
      rnd.forEach((r, i) => {
        const prev = i === 0 ? first?.state_before ?? [] : rnd[i - 1].state;
        const objs = [
          ...roundCursor(`sh-cu-${r.t}`, r.t, 80),
          ...regLane(`sh-rt-${r.t}`, r.state),
          ...valuePlate(`sh-w-${r.t}`, [-3.4, 0.3, -2.8], `W[${r.t}]`, r.W, "key"),
          ...valuePlate(`sh-k-${r.t}`, [-1.1, 0.3, -2.8], `K[${r.t}]`, r.K, "input"),
          ...valuePlate(`sh-t1-${r.t}`, [1.4, 0.3, -2.8], "T1", r.T1, "transform"),
          ...valuePlate(`sh-t2-${r.t}`, [3.7, 0.3, -2.8], "T2", r.T2, "internal")
        ];
        steps.push(
          mk(
            rounds,
            objs,
            {
              level: "operation",
              event: "ROUND_STARTED",
              operation: `Round t = ${r.t} \u2014 compression`,
              formula: "T1 = h + \u03A31(e) + Ch(e,f,g) + K[t] + W[t] \xB7 T2 = \u03A30(a) + Maj(a,b,c) \xB7 a \u2190 T1+T2 \xB7 e \u2190 d+T1",
              inputs: { "W[t]": r.W, "K[t]": r.K },
              outputs: { T1: r.T1, T2: r.T2, "new a": r.state[0] },
              stateBefore: regsOf(prev),
              stateAfter: regsOf(r.state),
              changedValues: roundChanges(prev, r.state),
              highlightedEntities: [`sh-rt-${r.t}-0`, `sh-rt-${r.t}-4`],
              why: t("simulation3d.sha512.whyRound")
            },
            {
              id: `-round-${r.t}`,
              titleKey: "simulation3d.sha512.roundTitle",
              titleArgs: { n: r.t },
              descKey: "simulation3d.sha512.roundDesc",
              descArgs: { n: r.t },
              camera: i === 0 ? fitCamera(objs.map((o) => o.position), { distance: 13 }) : void 0
            }
          )
        );
      });
    } else {
      steps.push(
        mk(
          rounds,
          roundRingScene("sh-ov", 80, { samples: [], radius: 8.2, note: "80 rounds" }),
          {
            level: "concept",
            event: "ROUND_STARTED",
            operation: "Round traversal",
            why: t("simulation3d.sha512.whyOverview")
          }
        )
      );
    }
    const stateObjs = hasState ? [
      ...wordLaneScene("sh-h0", hInit, "input", [0, 0.4, -3.6]),
      arrow("sh-ar", [0, 0.5, -2.2], [0, 0.5, -1.1], "path"),
      ...wordLaneScene("sh-h1", finalWords, "transform", [0, 0.4, 0.6]),
      ...valuePlate("sh-stcap", [0, 2.6, 3.8], "state", "h0..h7 after all blocks", "internal")
    ] : [...wordLaneScene("sh-h0", hInit, "input", [0, 0.4, 0])];
    steps.push(
      mk(state, stateObjs, {
        level: "algorithm",
        event: "STATE_UPDATED",
        operation: "Chaining update",
        formula: "H[i] \u2190 H[i] + compressed word[i]",
        inputs: hasState ? { "chaining in": hInit.join(" ") } : void 0,
        outputs: hasState ? { "chaining out": finalWords.join(" ") } : void 0,
        stateBefore: hasState ? Object.fromEntries(hInit.map((w, i) => [`h${i}`, w.toUpperCase()])) : void 0,
        stateAfter: hasState ? Object.fromEntries(finalWords.map((w, i) => [`h${i}`, w.toUpperCase()])) : void 0,
        changedValues: hasState ? hInit.map((b, i) => ({
          entity: `h${i}`,
          label: `chaining word h${i}`,
          before: b.toUpperCase(),
          after: finalWords[i].toUpperCase(),
          reason: "add compressed block words",
          tone: "transform"
        })) : void 0,
        why: t("simulation3d.sha512.whyState")
      })
    );
    steps.push(
      mk(
        digest,
        digestScene(hasDigest ? digestHex : "\u2014", "SHA-512"),
        {
          level: "concept",
          event: "HASH_FINALIZED",
          operation: "Finalize digest",
          inputs: { digest: hasDigest ? digestHex : "\u2014" },
          why: t("simulation3d.sha512.whyDigest")
        },
        { id: hasDigest ? "" : "-preview" }
      )
    );
    return steps;
  }
};

// src/components/simulation3d/adapters/sha13D.ts
var sha1Adapter = createAdapterFromEngine(
  sha1Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "sha1-input":
        return msgInputScene(String(v.text ?? ""), String(v.hex ?? ""));
      case "sha1-padding":
        return [
          ...padRowsScene(v.blocksHex ?? [], Number(v.msgLen ?? 0)),
          ...valuePlate("padcap", [0, 1.6, -4.4], "padding", `${Number(v.blockCount)} block(s) \xB7 ${Number(v.padBytes)} pad bytes`, "key")
        ];
      case "sha1-rounds":
        return roundRingScene("sha1-rt", 80, { radius: 7.4, note: "f\u2080..f\u2087\u2089" });
      case "sha1-state": {
        const hInit = v.hInit ?? [];
        const hFinal = v.hFinal ?? [];
        return [
          ...wordLaneScene("h0", hInit, "input", [0, 0.4, -3.4]),
          arrow("s1", [0, 0.5, -2.2], [0, 0.5, -1.1], "path"),
          ...wordLaneScene("h1", hFinal, "transform", [0, 0.4, 0.6]),
          ...valuePlate("hstate", [0, 2.4, 3.4], "state", "h0..h4 (160-bit)", "internal")
        ];
      }
      case "sha1-digest":
        return digestScene(String(v.digest ?? ""), "SHA-1");
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/md53D.ts
var md5Adapter = createAdapterFromEngine(
  md5Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "md5-input":
        return msgInputScene(String(v.text ?? ""), String(v.hex ?? ""));
      case "md5-padding":
        return [
          ...padRowsScene(v.blocksHex ?? [], Number(v.msgLen ?? 0)),
          ...valuePlate("padcap", [0, 1.6, -4.4], "padding", `${Number(v.blockCount)} block(s) \xB7 ${Number(v.padBytes)} pad bytes`, "key")
        ];
      case "md5-rounds": {
        const groups = [];
        ["F", "G", "H", "I"].forEach((fn, gi) => {
          const ring = roundRingScene(`md5-${fn}`, 16, {
            radius: 3.2,
            note: `R${gi + 1} \xB7 ${fn}`,
            tone: "transform"
          });
          const shift = [(gi - 1.5) * 7.6, 0, 0];
          ring.forEach((o) => {
            const p = o.position;
            groups.push({ ...o, position: [p[0] + shift[0], p[1], p[2]] });
          });
        });
        groups.push(...valuePlate("rounds-cap", [0, 4.4, 0], "1st pass", "4 \xD7 16 steps = 64", "internal"));
        return groups;
      }
      case "md5-state":
        return [
          ...wordLaneScene("h0", v.hInit ?? [], "input", [0, 0.4, -2.4]),
          ...valuePlate("hstate", [0, 2.5, 2.8], "state", "A B C D \xB7 32-bit words", "internal")
        ];
      case "md5-digest":
        return digestScene(String(v.digest ?? ""), "MD5");
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/sha33D.ts
var sha3Adapter = createAdapterFromEngine(
  sha3Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "sha3-input":
        return [
          ...msgInputScene(String(v.text ?? ""), String(v.hex ?? "")),
          ...valuePlate("rate-cap", [0, 2.6, 4.2], "sponge", `rate ${Number(v.rate)} \xB7 capacity ${200 - Number(v.rate)}`, "key")
        ];
      case "sha3-sponge":
        return [
          ...lanesScene("sponge", { rateLanes: Number(v.rate) / 8 }),
          ...valuePlate("sponge-cap", [0, 3.2, 0], "rate region", `${Number(v.rate)} bytes \xB7 rest capacity (${Number(v.capacity)})`, "transform"),
          ...valuePlate("sponge-note", [0, -2.6, 4.6], "note", "structural 5\xD75 lane grid \xB7 real words appear in absorb / squeeze", "muted")
        ];
      case "sha3-absorb": {
        const absorb = v.absorb ?? [];
        const hasResult = Boolean(v.hasResult);
        const rateLanes = Number(v.rateLanes ?? v.rate) % 25 || 17;
        if (!hasResult || absorb.length === 0) {
          const rows = Array.from({ length: Math.max(1, Number(v.blocks)) }, (_, i) => ({
            label: `block ${i}`,
            cells: Array.from({ length: Math.min(25, Math.max(rateLanes, 1)) }, () => ({ label: "\xB7", tone: "muted" }))
          }));
          return [
            ...rows3D(rows, [0, 0, 0], { rowStep: 2.4, cellSize: 0.7, gap: 0.12 }).objects,
            ...valuePlate("absorb-cap", [0, 2.2, -4], "absorb", `${Number(v.blocks)} block(s) \xB7 rate ${Number(v.rate)}`, "key"),
            ...valuePlate("absorb-note", [0, -2, 4.4], "note", "placeholder \xB7 run the algorithm to see the real absorbed blocks", "muted")
          ];
        }
        const objs = [];
        absorb.forEach((b, i) => {
          const z = (i - (absorb.length - 1) / 2) * 2.6;
          const lanes = (b.lanes_xor ?? []).map((w) => w.toUpperCase());
          if (lanes.length) {
            objs.push(
              ...hexStrip(`ab-${i}`, lanes.join(""), "transform", [0, 0.3, z], {
                piece: 8,
                cellSize: 0.72,
                gap: 0.06
              }).objects
            );
          }
          objs.push(...valuePlate(`abc-${i}`, [0, 2, z], `block ${b.block_index}`, "\u2295 into rate region", "internal"));
        });
        return objs;
      }
      case "sha3-squeeze": {
        const state = v.state ?? [];
        return [
          ...lanesScene("squeeze", { values: state.length === 25 ? state : void 0, tone: "internal" }),
          ...valuePlate("squeeze-cap", [0, 3.4, 0], "Keccak-f", "permute \xD724, then squeeze", "internal"),
          ...valuePlate("out-len", [0, -1.4, 5], "digest bytes", String(v.digestBytes ?? ""), "output"),
          ...state.length !== 25 ? valuePlate("squeeze-note", [0, -3, 4.6], "note", "placeholder lanes \xB7 run the algorithm to see the real permuted state", "muted") : []
        ];
      }
      case "sha3-digest":
        return digestScene(String(v.digest ?? ""), "SHA-3");
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/blake23D.ts
var blake2Adapter = createAdapterFromEngine(
  blake2Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "blake2-input":
        return [
          ...msgInputScene(String(v.text ?? ""), String(v.hex ?? "")),
          ...valuePlate("variant", [0, 2.6, 4.2], "variant", `blake2${String(v.variant)} \xB7 ${Number(v.rounds)} rounds`, "key")
        ];
      case "blake2-param": {
        const hInit = v.hInit ?? [];
        return [
          ...hexStrip("param-word", String(v.param ?? ""), "key", [0, 0.6, -2.6], { piece: 8, cellSize: 0.85 }).objects,
          ...valuePlate("param-cap", [0, 2.7, -2.4], "parameter word", `h[0] \u2295 0x${String(v.param ?? "")}`, "key"),
          ...wordLaneScene("h0", hInit, "internal", [0, 0.4, 2.4]),
          ...valuePlate("ivistate", [0, 2.5, 2.6], "initial h", "IV with parameter word folded in", "internal")
        ];
      }
      case "blake2-state": {
        const list = v.v ?? [];
        const full = list.length === 16;
        const rows = full ? [list.slice(0, 8), list.slice(8, 16)] : [];
        return [
          gridObject(
            "v-state",
            rows.map((r) => r.map((w) => ({ label: w.toUpperCase(), tone: "internal" }))),
            { cellSize: 1.15, gap: 0.1, labelScale: 0.75, height: 1.3 }
          ),
          ...valuePlate("velse", [0, 2.6, -3.8], "v[0..15]", "h \u2295 IV \xB7 IV[12..15] counter bytes", "internal")
        ];
      }
      case "blake2-rounds": {
        const rounds = Number(v.rounds ?? 12);
        const sigma = v.sigma ?? [];
        return [
          ...roundRingScene("blake2-rt", rounds, { radius: 6.2, tone: "transform" }),
          gridObject(
            "sigma",
            sigma.map((r) => r.slice(0, 8).map((n) => ({ label: String(n), tone: "key" }))),
            { cellSize: 0.62, gap: 0.08, labelScale: 0.8, height: 0.9 }
          ),
          ...valuePlate("sigma-cap", [0, 2.5, -5.4], "\u03C3 message schedule", "G mixers use \u03C3[r] rows", "key")
        ];
      }
      case "blake2-digest":
        return digestScene(String(v.digest ?? ""), `blake2${String(v.variant ?? "")}`);
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/blake33D.ts
var blake3Adapter = createAdapterFromEngine(
  blake3Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "blake3-input":
        return [
          ...msgInputScene(String(v.text ?? ""), String(v.hex ?? "")),
          ...valuePlate("olen", [0, 2.6, 4.2], "output length", `${Number(v.length)} bytes (XOF)`, "key")
        ];
      case "blake3-chunks": {
        const ranges = v.ranges ?? [];
        const chunkCount = Math.max(1, Number(v.chunkCount ?? 1));
        const objs = [];
        const span = Math.min(18, Math.max(5, chunkCount * 3));
        ranges.forEach((range, i) => {
          const [x, , z] = xPositions(chunkCount, span)[i];
          objs.push(
            ...valuePlate(`chunk-${i}`, [x, 0.4, z], `chunk ${i}`, `b[${range}]`, "transform")
          );
        });
        objs.push(
          ...valuePlate("chunks-cap", [0, 2.6, -3.4], "chunks", `${chunkCount} chunk(s) of up to 1024 bytes`, "internal")
        );
        return objs;
      }
      case "blake3-tree": {
        const levels = v.levels ?? [];
        const rootCv = v.rootCv ?? [];
        const objs = [];
        const last = levels.length - 1;
        levels.forEach((count, li) => {
          const y = li * 1.7 + 0.3;
          const span = Math.max(3, count * 2.2);
          const positions = xPositions(count, span, y);
          const tone = li === last ? "output" : li === 0 ? "internal" : "transform";
          positions.forEach((p, ci) => {
            objs.push({
              id: `tree-${li}-${ci}`,
              kind: "sphere",
              position: [p[0], y, p[2]],
              size: [li === last ? 0.62 : 0.42, li === last ? 0.62 : 0.42, li === last ? 0.62 : 0.42],
              tone,
              emphasize: li === last
            });
          });
        });
        if (rootCv.length) {
          objs.push(...wordLaneScene("root-cv", rootCv, "output", [0, 0.4, -3.2]));
          objs.push(...valuePlate("rootcap", [0, 2.4, -3.4], "root chaining value", rootCv.length > 1 ? `${rootCv[0].toUpperCase()} \u2026 +${rootCv.length - 1} more` : rootCv[0].toUpperCase(), "internal"));
        }
        return objs;
      }
      case "blake3-xof":
        return byteCountScene("xof", 64, Number(v.length ?? 32), `first ${Number(v.length)} bytes`);
      case "blake3-digest": {
        if (!Boolean(v.hasResult)) {
          return valuePlate("dg", [0, 0.5, 0], "digest", "\u2014", "muted");
        }
        return digestScene(String(v.digest ?? ""), "BLAKE3");
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/hmac3D.ts
function xorBytesHex(hex, constant) {
  const out = [];
  for (let i = 0; i + 1 < hex.length; i += 2) {
    out.push((parseInt(hex.slice(i, i + 2), 16) ^ constant).toString(16).padStart(2, "0"));
  }
  return out.join("");
}
var hmacAdapter = createAdapterFromEngine(
  hmacEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "hmac-key": {
        const structural = Boolean(v.structural);
        const keyPadded = String(v.keyPadded ?? "");
        const hashName = String(v.hashName ?? "");
        const block = Number(v.block ?? 64);
        if (structural) {
          return valuePlate("k0", [0, 0.6, 0], "K0", `${hashName} \xB7 ${block}-byte block`, "key", { emphasize: true });
        }
        return [
          ...hexStrip("k0", keyPadded.toUpperCase(), "key", [0, 0.4, -1.8], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("k0cap", [0, 2.3, 2.2], "K0", `key padded to ${block} bytes`, "key"),
          ...Boolean(v.keyTooLong) ? valuePlate("too-long", [0, -1.1, 3.4], "key too long", "hashed once to fit", "warning") : []
        ];
      }
      case "hmac-xor": {
        const structural = Boolean(v.structural);
        const keyPadded = String(v.keyPadded ?? "");
        if (structural) {
          return [
            ...valuePlate("ax1", [-3.5, 0.6, 0], "inner key", "K0 \u2295 ipad 0x36", "internal"),
            ...valuePlate("ax2", [3.5, 0.6, 0], "outer key", "K0 \u2295 opad 0x5c", "internal")
          ];
        }
        const rows = rows3D(
          [
            { label: "K0", cells: hexCellsOf(keyPadded, "key") },
            { label: "ipad", cells: hexCellsOf(xorBytesHex(keyPadded, 54), "muted") },
            { label: "XOR ipad", cells: hexCellsOf(xorBytesHex(keyPadded, 54), "internal") },
            { label: "opad", cells: hexCellsOf(xorBytesHex(keyPadded, 92), "muted") },
            { label: "XOR opad", cells: hexCellsOf(xorBytesHex(keyPadded, 92), "internal") }
          ],
          [0, 0, 0],
          { rowStep: 2, cellSize: 0.5, gap: 0.03 }
        );
        return [
          ...rows.objects,
          ...valuePlate("xorcap", [0, 3.4, -4], "ipad/opad", "constant XOR tails with the block key", "internal")
        ];
      }
      case "hmac-inner": {
        const innerMsg = String(v.innerMsg ?? "");
        const innerDigest = String(v.innerDigest ?? "");
        if (Boolean(v.structural)) {
          return [
            ...valuePlate("in-msg", [0, 0.6, -3.4], "input", "(K0 \u2295 ipad) \u2225 message", "input"),
            arrow("in-a", [0, 0.6, -1.6], [0, 0.6, 1.6], "path"),
            ...valuePlate("in-dg", [0, 0.6, 3.2], "inner digest", innerDigest || "\u2014", "internal")
          ];
        }
        return [
          ...hexStrip("inner", innerMsg.toUpperCase(), "input", [0, 0.4, -3], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
          arrow("in-a", [0, 0.5, -0.4], [0, 0.5, 1.4], "path"),
          ...hexStrip("innerdg", innerDigest.toUpperCase(), "internal", [0, 0.4, 3], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects
        ];
      }
      case "hmac-outer": {
        const opad = String(v.opad ?? "");
        const innerDigest = String(v.innerDigest ?? "");
        const digest = String(v.digest ?? "");
        if (Boolean(v.structural)) {
          return [
            ...valuePlate("out-msg", [0, 0.6, -3.4], "input", "(K0 \u2295 opad) \u2225 inner_digest", "input"),
            arrow("out-a", [0, 0.6, -1.6], [0, 0.6, 1.6], "path"),
            ...valuePlate("out-dg", [0, 0.6, 3.4], "MAC", digest || "\u2014", "output", { emphasize: true })
          ];
        }
        return [
          ...hexStrip("op", opad.toUpperCase(), "key", [0, 0.4, -3.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...hexStrip("ind", innerDigest.toUpperCase(), "internal", [0, 0.4, -1.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          arrow("out-a", [0, 0.5, 0.2], [0, 0.5, 1.6], "path"),
          ...hexStrip("mac", digest.toUpperCase(), "output", [0, 0.4, 3.2], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("outcap", [0, 2.5, 3.2], "MAC", `${String(v.hashName ?? "SHA-256")} (outer)`, "output")
        ];
      }
      case "hmac-result":
        return digestScene(String(v.digest ?? ""), "HMAC");
      default:
        return [];
    }
  }
);
function hexCellsOf(hex, tone) {
  const out = [];
  for (let i = 0; i + 1 < hex.length; i += 2) {
    out.push({ label: hex.slice(i, i + 2).toUpperCase(), tone });
  }
  return out;
}

// src/components/simulation3d/adapters/pbkdf23D.ts
var pbkdf2Adapter = createAdapterFromEngine(
  pbkdf2Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "pbkdf2-input":
        return [
          ...hexStrip("salt", String(v.saltHex ?? "").toUpperCase(), "input", [0, 0.4, -1.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("pwcap", [0, 2.5, -2.6], "password", `${Number(v.pwBytes)} bytes`, "input"),
          ...valuePlate("saltcap", [0, -1.1, 2.6], "salt", `${Number(v.saltLen)} bytes`, "input")
        ];
      case "pbkdf2-params":
        return [
          ...valuePlate("p1", [-5.4, 0.6, 0], "PRF", "HMAC-SHA-256", "key"),
          ...valuePlate("p2", [-1.8, 0.6, 0], "iterations", String(v.iterations ?? ""), "key", { emphasize: true }),
          ...valuePlate("p3", [2.4, 0.6, 0], "hash size", "32 bytes", "internal"),
          ...valuePlate("p4", [6, 0.6, 0], "output", `${Number(v.blocks)} \xD7 32 \u2192 ${Number(v.keyLength)} bytes`, "transform")
        ];
      case "pbkdf2-u1":
        return [
          ...hexStrip("u1", String(v.u1 ?? "").toUpperCase(), "transform", [0, 0.4, -1.2], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("u1cap", [0, 2.3, 2], "U1", "HMAC(password, salt \u2225 0x00000001)", "internal")
        ];
      case "pbkdf2-loop": {
        const rows = v.rows ?? [];
        const finalBlock = String(v.finalBlock ?? "");
        const more = Number(v.more ?? 0);
        const objs = [];
        rows.forEach((r, i) => {
          const z = i * 3.8;
          objs.push(
            ...hexStrip(`u${r.n}`, r.u.toUpperCase(), "transform", [-3.2, 0.4, z], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
            ...hexStrip(`t${r.n}`, r.xor.toUpperCase(), "internal", [3.4, 0.4, z], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
            arrow(`ua${r.n}`, [0, 0.4, z], [2.2, 0.4, z], "path"),
            ...valuePlate(`rc${r.n}`, [0, 2.4, z], `U${r.n}`, `T = \u2295 U1..U${r.n}`, "muted")
          );
        });
        objs.push(
          arrow("fa", [0, 0.4, rows.length * 3.8 + 0.4], [0, 0.4, rows.length * 3.8 + 2.6], "path"),
          ...hexStrip("final", finalBlock.toUpperCase(), "output", [0, 0.4, rows.length * 3.8 + 3.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("loopcap", [0, 2.6, rows.length * 3.4], "DK block", `${Number(v.iterations)} iterations \xB7 \u2295 of all U`, "output"),
          ...more > 0 ? valuePlate("morecap", [0, -1.6, rows.length * 3.4], "not drawn", `+${more} more iterations`, "muted") : []
        );
        return objs;
      }
      case "pbkdf2-assemble": {
        const blockDigests = v.blockDigests ?? [];
        const dkHex = String(v.dkHex ?? "");
        const objs = [];
        blockDigests.forEach((b, i) => {
          objs.push(
            ...hexStrip(`blk${i}`, b.toUpperCase(), "internal", [-2.4, 0.4, i * 2.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
            ...valuePlate(`blklab${i}`, [-2.4, 2.4, i * 2.6], `block ${i + 1}`, `${b.length / 2} bytes`, "internal")
          );
        });
        const zEnd = Math.max(1, blockDigests.length) * 2.6;
        objs.push(
          arrow("ca", [0.4, 0.4, zEnd - 1.3], [2.8, 0.4, zEnd + 0.5], "path"),
          ...hexStrip("dk", dkHex.toUpperCase(), "output", [3.4, 0.4, zEnd + 0.7], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("dkcap", [3.8, 2.4, zEnd + 1.2], "derived key", `${Number(v.keyLength)} bytes`, "output", { emphasize: true })
        );
        return objs;
      }
      case "pbkdf2-result":
        return digestScene(String(v.dkHex ?? ""), "PBKDF2");
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/bcrypt3D.ts
var bcryptAdapter = createAdapterFromEngine(
  bcryptEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "bcrypt-input": {
        const tooLong = Boolean(v.tooLong);
        return [
          ...valuePlate("pw", [0, 0.6, 0], "password", `${Number(v.pwBytes)} bytes`, "input", { emphasize: true }),
          ...tooLong ? valuePlate("tooolong", [0, -1.4, 2.4], "rejected", "max 72 bytes", "error") : []
        ];
      }
      case "bcrypt-salt":
        return [
          ...valuePlate("saltbox", [0, 0.6, -1.6], "salt", "16 bytes \xB7 128-bit (CSPRNG)", "key", { emphasize: true }),
          ...valuePlate("prefix", [0, 0.6, 2], "embedded", `$2b$${Number(v.rounds)}$`, "muted")
        ];
      case "bcrypt-cost":
        return [
          ...valuePlate("c1", [-3.6, 0.6, 0], "cost", String(v.rounds ?? ""), "key", { emphasize: true }),
          ...valuePlate("c2", [0, 0.6, 0], "iterations", String(v.iterations ?? ""), "transform"),
          ...valuePlate("c3", [3.6, 0.6, 0], "work factor", `2^${Number(v.rounds)} EksBlowfish rounds`, "internal")
        ];
      case "bcrypt-schedule": {
        const head = gridObject(
          "eks-head",
          [["P[18]", "S0[256]", "S1[256]", "S2[256]", "S3[256]"]].map((r) => r.map((label) => ({ label, tone: "internal" }))),
          { cellSize: 1.9, gap: 0.14, labelScale: 0.7, height: 1.2 }
        );
        return [
          head,
          ...valuePlate("eks", [0, 2.6, -4], "EksBlowfish", `${Number(v.iterations)} key-schedule passes`, "transform"),
          ...valuePlate("derive", [0, -0.6, 5], "derive", "encrypt 'OrpheanBeholderScryDoubt' \u2192 184-bit hash", "output")
        ];
      }
      case "bcrypt-result": {
        const hash = String(v.hash ?? "");
        if (hash) return digestScene(hash, "$2b$");
        return valuePlate("ph", [0, 0.6, 0], "$2b$ hash", "run the operation to bind real hash", "output");
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/scrypt3D.ts
function sampleGridObject(id36, matrix, active) {
  return gridObject(
    id36,
    matrix.map(
      (row, r) => row.map((cell, c) => ({
        label: String(cell),
        tone: r === active[0] && c === active[1] ? "active" : "muted"
      }))
    ),
    { cellSize: 0.36, gap: 0.035, labelScale: 0.65, height: 0.8 }
  );
}
var scryptAdapter = createAdapterFromEngine(
  scryptEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "scrypt-input":
        return [
          ...hexStrip("salt", String(v.saltHex ?? "").toUpperCase(), "input", [0, 0.4, -1.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("pwcap", [0, 2.5, -2.8], "password", `${Number(v.pwBytes)} bytes`, "input"),
          ...valuePlate("saltcap", [0, -1.2, 2.8], "salt", `${Number(v.saltLen)} bytes`, "input")
        ];
      case "scrypt-params":
        return [
          ...valuePlate("n1", [-5, 0.6, 0], "N", String(v.n ?? ""), "key", { emphasize: true }),
          ...valuePlate("n2", [0, 0.6, 0], "memory", `${Number(v.memoryKiB)} KiB \u2248 ${Number(v.memoryMiB)} MiB`, "transform"),
          ...valuePlate("n3", [5, 0.6, 0], "block", `${Number(v.blockSize)} bytes (128\xB7r)`, "internal"),
          sampleGridObject("mem-map", v.grid ?? [], [4, 6])
        ];
      case "scrypt-pre":
        return [
          ...valuePlate("p1", [-2.5, 0.6, 0], "PBKDF2", "HMAC-SHA-256 \xB7 1 iteration", "transform"),
          arrow("pa", [-0.4, 0.6, 0], [0.6, 0.6, 0], "path"),
          ...valuePlate("p2", [2.4, 0.6, 0], "initial blocks", `${Number(v.p)} lane(s) \xD7 ${Number(v.blockSize)} bytes`, "internal")
        ];
      case "scrypt-romix": {
        return [
          sampleGridObject("romix-map", v.grid ?? [], [2, 3]),
          ...valuePlate("romix", [0, 2.8, -3], "ROMix", `${Number(v.n)} blocks \xB7 Salsa20/8 \xB7 memory-hard`, "internal"),
          ...valuePlate("mem", [0, -1.2, 4.6], "working set", `${Number(v.memoryKiB)} KiB \u2248 ${Number(v.memoryMiB)} MiB`, "transform")
        ];
      }
      case "scrypt-post":
        return [
          ...valuePlate("p1", [-3.6, 0.6, 0], "PBKDF2", "final pass", "transform"),
          arrow("pa", [-1.9, 0.6, 0], [-1, 0.6, 0], "path"),
          ...valuePlate("p2", [1, 0.6, 0], "mix lanes", `${Number(v.p)} lane(s)`, "internal"),
          arrow("pb", [2.2, 0.6, 0], [3, 0.6, 0], "path"),
          ...valuePlate("p3", [4, 0.6, 0], "truncate", `first ${Number(v.keyLength)} bytes`, "transform")
        ];
      case "scrypt-result": {
        const keyHex = String(v.keyHex ?? "");
        if (keyHex) return digestScene(keyHex, "scrypt");
        return valuePlate("sc", [0, 0.6, 0], "derived key", "run the operation to bind the real key", "output");
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/argon23D.ts
var argon2Adapter = createAdapterFromEngine(
  argon2Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "argon2-input":
        return [
          ...valuePlate("pw", [0, 0.6, -2], "password", `${Number(v.passwordBytes)} bytes`, "input", { emphasize: true }),
          ...valuePlate("variant", [-4.2, 0.6, 1.6], "variant", String(v.variant ?? ""), "key"),
          ...valuePlate("t", [0.4, 0.6, 1.6], "t \xB7 m \xB7 p", `${Number(v.t)} \xB7 ${Number(v.m)} KiB \xB7 ${Number(v.p)}`, "key")
        ];
      case "argon2-params":
        return [
          ...valuePlate("mem", [-2, 0.6, 0], "memory", `${Number(v.m)} KiB \u2248 ${Number(v.memoryMiB)} MiB`, "key", { emphasize: true }),
          ...valuePlate("blocks", [3, 0.6, -0.6], "blocks", `${Number(v.blocks)} \xD7 1 KiB`, "internal"),
          ...valuePlate("cells", [3, -0.7, 1.2], "grid cells", `${Number(v.cells)} (\u22484 KiB each)`, "internal")
        ];
      case "argon2-core": {
        const grid = v.grid ?? [];
        return [
          gridObject(
            "matrix",
            grid.map((r) => r.map(() => ({ label: "G", tone: "transform" }))),
            { cellSize: 0.85, gap: 0.14, labelScale: 0.8, height: 1.1 }
          ),
          ...valuePlate("matrix-cap", [0, 2.9, -4], "matrix", `${Number(v.p)} lanes \xD7 ${Number(v.t)} passes`, "transform"),
          ...valuePlate("per-block", [0, -1.3, 4.8], "per pass", `${Number(v.m)} blocks \xB7 BLAKE2b compression`, "internal")
        ];
      }
      case "argon2-tag":
        return [
          ...valuePlate("fc", [-3.8, 0.6, 0], "final column", "XOR of last blocks per lane", "internal"),
          arrow("ta", [-1.6, 0.6, 0], [-0.6, 0.6, 0], "path"),
          ...valuePlate("tag", [1.6, 0.6, 0], "tag", `${Number(v.hashLength)} bytes \xB7 BLAKE2b`, "transform", { emphasize: true })
        ];
      case "argon2-result": {
        const tag = String(v.tag ?? "");
        if (tag) return digestScene(tag, `${String(v.variant ?? "argon2id")}`);
        return valuePlate("phc", [0, 0.6, 0], "PHC hash", "run the operation to bind real tag", "output");
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/hkdf3D.ts
var hkdfAdapter = createAdapterFromEngine(
  hkdfEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "hkdf-input":
        return [
          ...hexStrip("salt", String(v.saltHex ?? "").toUpperCase(), "input", [0, 0.4, -1.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("ikmcap", [0, 2.6, -3], "ikm", `${Number(v.ikmLen)} bytes`, "key"),
          ...valuePlate("info", [0, -1.3, 2.8], "info \xB7 output", `${Number(v.infoLen)} bytes \xB7 ${Number(v.length)} out`, "transform")
        ];
      case "hkdf-extract": {
        const prk = String(v.prk ?? "");
        return [
          ...hexStrip("salt", String(v.saltHex ?? "").toUpperCase(), "key", [0, 0.4, -2.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("xop", [0, 1.6, -0.2], "PRK", "HMAC-SHA-256(salt, ikm)", "key"),
          arrow("xa", [0, 0.5, 0.4], [0, 0.5, 1.4], "path"),
          ...hexStrip("prk", prk.toUpperCase(), "internal", [0, 0.4, 2.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("prkcap", [0, 2.5, 2.6], "PRK", "32 bytes", "internal", { emphasize: true })
        ];
      }
      case "hkdf-expand": {
        const blocks = v.blocks ?? [];
        const shown = blocks.slice(0, 6);
        const objs = [];
        shown.forEach((b, i) => {
          objs.push(
            ...hexStrip(`t${i}`, b.toUpperCase(), "transform", [0, 0.4, i * 2.4], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
            ...valuePlate(`tc${i}`, [0, 2.4, i * 2.4], `T${i + 1}`, "HMAC(PRK, T\xB7info\xB7counter)", "muted")
          );
        });
        objs.push(
          ...valuePlate("expand-cap", [0, 4, shown.length * 2.2], "expand", `${Number(blocks.length)} block(s)`, "internal"),
          ...blocks.length > shown.length ? valuePlate("more", [0, -1.4, shown.length * 2.2], "not drawn", `+${blocks.length - shown.length} more block(s)`, "muted") : []
        );
        return objs;
      }
      case "hkdf-concat": {
        const blocks = v.blocks ?? [];
        const outHex = String(v.outHex ?? "");
        const objs = [];
        blocks.forEach((b, i) => {
          objs.push(...hexStrip(`tb${i}`, b.toUpperCase(), "internal", [-3.6, 0.4, i * 2.2], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects);
        });
        const zMid = Math.max(1, blocks.length) * 2.2;
        objs.push(
          arrow("ca", [0, 0.4, zMid - 1], [2.6, 0.4, zMid - 0.2], "path"),
          ...hexStrip("okm", outHex.toUpperCase(), "output", [3.6, 0.4, zMid - 0.2], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate("okmcap", [3.6, 2.5, zMid - 0.2], "OKM", `first ${Number(v.length)} bytes`, "output", { emphasize: true })
        );
        return objs;
      }
      case "hkdf-result":
        return digestScene(String(v.outHex ?? ""), "HKDF");
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/rsa3D.ts
var rsaAdapter = createAdapterFromEngine(
  rsaEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "rsa-error":
        return valuePlate("err", [0, 0.6, 0], "Error", (v.reasons ?? []).join(" \xB7 "), "error", { emphasize: true });
      case "rsa-keygen": {
        return [
          ...valuePlate("p", [-6, 0.8, 0], "p", String(v.p ?? ""), "key"),
          ...valuePlate("q", [-2.6, 0.8, 0], "q", String(v.q ?? ""), "key"),
          arrow("k1", [-0.9, 0.8, 0], [0.5, 0.8, 0], "path"),
          ...valuePlate("n", [3.4, 0.8, 0], "n = p\xB7q", String(v.n ?? ""), "internal"),
          ...valuePlate("phi", [-4.3, -0.9, 3], "\u03C6(n)", String(v.phi ?? ""), "internal"),
          ...valuePlate("gcd", [0.6, -0.9, 3], "gcd(e, \u03C6)", String(v.gcdCheck ?? ""), "internal"),
          ...valuePlate("e", [-3, -0.9, 6], "e (public)", String(v.e ?? ""), "key", { emphasize: true }),
          arrow("k2", [-1, -0.9, 6], [0.4, -0.9, 6], "path"),
          ...valuePlate("d", [3, -0.9, 6], "d (private)", String(v.d ?? ""), "output", { emphasize: true }),
          ...v.eNote ? valuePlate("enote", [0, 2.6, 2], "note", String(v.eNote), "muted") : []
        ];
      }
      case "rsa-encode": {
        const msgCells = v.msgCells ?? [];
        const m27Cells = v.m27Cells ?? [];
        return [
          ...charRow("msg", msgCells.map((c) => ({ label: c.ch, tone: c.tone })), [0, 0.7, -3], { cellSize: 0.7, gap: 0.08 }).objects,
          arrow("e1", [0, 0.7, -1.6], [0, 0.7, -0.4], "path"),
          ...charRow("b27", m27Cells.map((c) => ({ label: c.ch, tone: c.tone })), [0, 0.7, 0.6], { cellSize: 0.7, gap: 0.08 }).objects,
          arrow("e2", [0, 0.7, 1.8], [0, 0.7, 3], "path"),
          ...valuePlate("M", [0, 0.7, 4.4], "M (integer)", String(v.M ?? ""), "output", { emphasize: true }),
          ...valuePlate("enc-cap", [0, 3, -3], "encoding", "letters \u2192 integer (A=1..Z=26, base 27)", "input")
        ];
      }
      case "rsa-encrypt": {
        const rows = v.encryptRows ?? [];
        const objs = [];
        if (rows.length) {
          objs.push(
            ...rows3D(
              rows.map((r) => ({
                label: r.label,
                cells: (r.cells ?? []).map((c) => ({ label: c.ch, tone: c.tone === "output" ? "transform" : c.tone }))
              })),
              [3, 0, -3.4],
              { rowStep: 1.7, cellSize: 0.62, gap: 0.1 }
            ).objects
          );
        }
        objs.push(
          ...valuePlate("M", [-6.2, 1.2, -1], "M", String(v.M ?? ""), "input"),
          ...valuePlate("e", [-6.2, 0, 1.2], "e", String(v.e ?? ""), "key"),
          ...valuePlate("n", [-6.2, -1, 3], "n", String(v.n ?? ""), "internal"),
          arrow("x1", [-3.8, 0.4, 1], [-1.4, 0.4, 1], "path"),
          ...valuePlate("op", [1.4, 0.4, 1], "modexp", "M^e mod n \xB7 square-and-multiply", "transform"),
          ...valuePlate("C", [6.4, 0.4, 3], "C", String(v.C ?? ""), "output", { emphasize: true })
        );
        return objs;
      }
      case "rsa-decrypt":
        return [
          ...valuePlate("C", [-6, 1, -1], "C", String(v.C ?? ""), "input"),
          ...valuePlate("d", [-6, -0.1, 1.4], "d", String(v.d ?? ""), "key"),
          ...valuePlate("n", [-6, -1.2, 3.4], "n", String(v.n ?? ""), "internal"),
          arrow("d1", [-4, 0.4, 1.2], [-1.6, 0.4, 1.2], "path"),
          ...valuePlate("dop", [1.6, 0.4, 1.2], "modexp", "C^d mod n", "transform"),
          arrow("d2", [3.8, 0.4, 1.2], [5, 0.4, 1.2], "path"),
          ...valuePlate("Mp", [6.4, 0.7, 1.2], "M'", String(v.M ?? ""), "output"),
          ...valuePlate("plain", [0, -1.6, 5.4], "Plaintext", String(v.result ?? ""), "output", { emphasize: true }),
          ...valuePlate("textbook", [0, 3, -4], "note", "textbook RSA \u2014 no padding; OAEP needed in practice", "muted")
        ];
      case "rsa-result": {
        const text = String(v.text ?? "");
        return [
          ...charRow("out", text.split("").map((ch) => ({ label: ch, tone: "output" })), [0, 0.5, -1.2], { cellSize: 0.8, gap: 0.1 }).objects,
          ...valuePlate("r0", [0, 2.6, 2.6], "Decrypted", text || "\xB7", "output", { emphasize: true })
        ];
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/elgamal3D.ts
var elgamalAdapter = createAdapterFromEngine(
  elgamalEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "elgamal-keygen":
        return [
          ...valuePlate("p", [-5, 0.8, 0], "p", String(v.p ?? ""), "internal"),
          ...valuePlate("g", [-1.6, 0.8, 0], "g", String(v.g ?? ""), "internal"),
          ...valuePlate("x", [1.8, 0.8, 0], "x (private)", String(v.x ?? ""), "key"),
          arrow("kg1", [-0.2, 0.8, 0], [1, 0.8, 0], "path"),
          arrow("kg2", [3.4, 0.8, 0], [4.4, 0.8, 0], "path"),
          ...valuePlate("y", [6.2, 0.8, 0], "y (public)", `g^x mod p = ${String(v.y ?? "")}`, "output", { emphasize: true })
        ];
      case "elgamal-encode": {
        const message = String(v.message ?? "").toUpperCase();
        return [
          ...charRow("msg", message.split("").map((ch) => ({ label: ch, tone: "input" })), [0, 0.7, -2], { cellSize: 0.74, gap: 0.09 }).objects,
          arrow("e1", [0, 0.7, -0.4], [0, 0.7, 0.9], "path"),
          ...valuePlate("m", [0, 0.7, 2.6], "M (integer)", String(v.m ?? ""), "output", { emphasize: true }),
          ...valuePlate("enc-cap", [0, 3, -2.6], "encoding", "letters \u2192 base-27 integer", "input")
        ];
      }
      case "elgamal-ephemeral":
        return [
          ...valuePlate("k", [0, 1.2, -2], "k (ephemeral)", String(v.k ?? ""), "key", { emphasize: true }),
          ...valuePlate("g", [-4, -0.5, 2], "g", String(v.g ?? ""), "internal"),
          ...valuePlate("k2", [0, -0.5, 2], "k", String(v.k ?? ""), "key"),
          ...valuePlate("p", [4, -0.5, 2], "p", String(v.p ?? ""), "internal")
        ];
      case "elgamal-encrypt":
        return [
          ...valuePlate("c1", [-4.6, 1.1, -1.4], "c1 = g^k mod p", String(v.c1 ?? ""), "transform", { emphasize: true }),
          arrow("c1b", [-2, 1.1, -1.4], [-0.8, 1.1, -1.4], "path"),
          ...valuePlate("c2", [2.6, 1.1, -1.4], "c2 = m\xB7y^k mod p", String(v.c2 ?? ""), "output", { emphasize: true }),
          ...valuePlate("y", [-4, -1.2, 2.4], "y", String(v.y ?? ""), "key"),
          ...valuePlate("k", [0, -1.2, 2.4], "k", String(v.k ?? ""), "key"),
          ...valuePlate("m", [4, -1.2, 2.4], "m", String(v.m ?? ""), "input"),
          ...Boolean(v.bound) ? valuePlate("src", [0, 3, -3], "source", "backend cipher (bound)", "muted") : []
        ];
      case "elgamal-decrypt":
        return [
          ...valuePlate("c1", [-5.2, 1, -1.2], "c1", String(v.c1 ?? ""), "transform"),
          ...valuePlate("c2", [-0.6, 1, -1.2], "c2", String(v.c2 ?? ""), "transform"),
          arrow("d1", [1.4, 0.4, 0.4], [3, 0.4, 0.4], "path"),
          ...valuePlate("m", [5, 1.4, 1.4], "M' (integer)", v.m != null ? String(v.m) : "-", "output", { emphasize: true }),
          ...valuePlate("dop", [1.4, -1.3, 3.4], "decrypt", "m = c2 \xB7 c1^-x mod p", "path")
        ];
      case "elgamal-formula":
        return [
          ...valuePlate("y", [-5, 1, -0.6], "y", `g^x mod p = ${String(v.y ?? "")}`, "output"),
          ...valuePlate("c1", [0, 1, 0.6], "c1", "g^k mod p", "transform"),
          ...valuePlate("c2", [5, 1, -0.6], "c2", "m \xB7 y^k mod p", "output"),
          ...valuePlate("edu", [0, -1.9, 4], "educational", "small teaching parameters only", "muted")
        ];
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/ecdh3D.ts
var ecdhAdapter = createAdapterFromEngine(
  ecdhEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "ecdh-curve": {
        const fields = v.fields ?? [];
        const pts = curveHint();
        const objs = [
          {
            id: "curve-hint",
            kind: "arc",
            position: [0, 0, 0],
            points: pts,
            ringTube: 0.14,
            tone: "path"
          },
          {
            id: "base-G",
            kind: "sphere",
            position: [2.4, 1.2, -1.2],
            size: [0.55, 0.55, 0.55],
            tone: "active",
            emphasize: true
          },
          ...valuePlate("bglabel", [2.4, 2.5, -0.4], "G", "base point", "key")
        ];
        fields.slice(0, 6).forEach((f, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = -6 + col * 12;
          const z = -2.6 + row * 4.6;
          const val = f.value.length > 18 ? `${f.value.slice(0, 18)}\u2026` : f.value;
          objs.push(...valuePlate(`f${i}`, [x, -0.3, z], f.name, val, "internal"));
        });
        objs.push(
          ...valuePlate("sec", [6.4, 4, 4.6], "security", `~${String(v.security ?? "")} bits`, "muted"),
          ...valuePlate("note", [-5, 4.4, 4.6], "full constants", "see the 2D lab for exact hex", "muted")
        );
        return objs;
      }
      case "ecdh-keys": {
        const aliceHex = v.aliceHex ? String(v.aliceHex) : null;
        const bobHex = v.bobHex ? String(v.bobHex) : null;
        return [
          ...agentCard("alice", [-7, 0, 0], [
            ...valuePlate("da", [-7, 1.6, -0.6], "dA (private)", String(v.dA ?? ""), "key"),
            arrow("a1", [-7, 0.6, 0.8], [-7, 0.6, 2.2], "path"),
            ...valuePlate("Aa", [-7, 0.6, 4.4], "public A", aliceHex ? `${aliceHex.slice(0, 24)}\u2026` : "dA\xB7G", "output")
          ]),
          ...agentCard("bob", [7, 0, 0], [
            ...valuePlate("db", [7, 1.6, -0.6], "dB (private)", String(v.dB ?? ""), "key"),
            arrow("b1", [7, 0.6, 0.8], [7, 0.6, 2.2], "path"),
            ...valuePlate("Bb", [7, 0.6, 4.4], "public B", bobHex ? `${bobHex.slice(0, 24)}\u2026` : "dB\xB7G", "output")
          ]),
          arrow("wire", [-2, 0.4, 0], [2, 0.4, 0], "path"),
          ...valuePlate("op", [0, 2.2, 0], "keygen", "A = dA\xB7G \xB7 B = dB\xB7G", "transform")
        ];
      }
      case "ecdh-exchange": {
        const aliceHex = v.aliceHex ? String(v.aliceHex) : null;
        const bobHex = v.bobHex ? String(v.bobHex) : null;
        return [
          ...agentCard("alice", [-7, 0, 0], valuePlate("Aex", [-7, 0.7, 1], "public A \u2192", aliceHex ? `${aliceHex.slice(0, 16)}\u2026` : "A", "output")),
          ...agentCard("bob", [7, 0, 0], valuePlate("Bex", [7, 0.7, 1], "\u2192 public B", bobHex ? `${bobHex.slice(0, 16)}\u2026` : "B", "output")),
          arrow("wa", [-4.4, 0.4, -0.8], [-2.6, 0.4, -0.8], "path"),
          arrow("wb", [2.6, 0.4, 0.8], [4.4, 0.4, 0.8], "path"),
          ...valuePlate("chan", [0, 2.6, -1], "channel", "only public points cross the wire", "muted"),
          ...valuePlate("note", [0, 1, 3.4], "note", "eavesdropper cannot recover dA / dB", "muted")
        ];
      }
      case "ecdh-shared": {
        const shared = v.shared ? String(v.shared) : null;
        return [
          ...agentCard("alice", [-7, 0, 0], valuePlate("Sa", [-7, 0.7, 1], "S = dA\xB7B", shared ? `${shared.slice(0, 32)}\u2026` : "dA\xB7B", "output")),
          ...agentCard("bob", [7, 0, 0], valuePlate("Sb", [7, 0.7, 1], "S = dB\xB7A", shared ? `${shared.slice(0, 32)}\u2026` : "dB\xB7A", "output")),
          arrow("wa", [-4.4, 0.6, -0.6], [-2.6, 0.6, -0.6], "path"),
          arrow("wb", [2.6, 0.6, 0.6], [4.4, 0.6, 0.6], "path"),
          ...shared ? [
            ...hexStrip("shared", shared.toUpperCase(), "output", [0, 0.3, 3], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
            ...valuePlate("sharedcap", [0, 2.4, 3], "shared secret", "equal x-coordinate on both sides", "output")
          ] : valuePlate("sharedcap", [0, 1.2, 3], "shared secret", "x-coordinate of dA\xB7dB\xB7G", "output")
        ];
      }
      default:
        return [];
    }
  }
);
function curveHint() {
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = -4 + i * (8 / 24);
    pts.push([t, 0.4 + 1.1 * Math.sin(t * 0.9), 1.8 - 0.28 * t * t / 4]);
  }
  return pts;
}
function agentCard(prefix, origin, inner) {
  return [
    {
      id: `${prefix}-bg`,
      kind: "box",
      position: [origin[0], -0.2, -3.6],
      size: [4.4, 0.16, 9],
      tone: prefix === "alice" ? "input" : "key",
      opacity: 0.12
    },
    ...inner
  ];
}

// src/components/simulation3d/adapters/x255193D.ts
var x25519Adapter = createAdapterFromEngine(
  x25519Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "x25519-curve":
        return [
          ...valuePlate("curve", [0, 0.8, -2.4], "curve", "Curve25519 (Montgomery)", "internal", { emphasize: true }),
          ...valuePlate("form", [-4.4, 0, 1], "form", "y\xB2 = x\xB3 + 486662\xB7x\xB2 + x", "internal"),
          ...valuePlate("base", [4.6, 0, 1], "base point", "u = 9 (x only)", "key"),
          ...valuePlate("p", [0, -1.4, 3.6], "field prime p", "2\xB2\u2075\u2075 \u2212 19", "internal")
        ];
      case "x25519-keys": {
        const aPriv = String(v.aPriv ?? "");
        const bPriv = String(v.bPriv ?? "");
        const aPub = String(v.aPub ?? "");
        const bPub = String(v.bPub ?? "");
        return [
          ...card("alice", [-7, 0, 0], [
            ...valuePlate("ap", [-7, 2.1, -3.6], "Alice", "private \u2192 public", "key"),
            ...hexStrip("aPriv", aPriv.toUpperCase(), "key", [-7, 0.6, -3.8], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
            arrow("a1", [-7, 0.6, -0.8], [-7, 0.6, 0.6], "path"),
            ...valuePlate("aPub", [-7, 0.4, 2.6], "public", aPub.includes("x25") ? aPub : `${aPub.slice(0, 32)}\u2026`, "output")
          ]),
          ...card("bob", [7, 0, 0], [
            ...valuePlate("bp", [7, 2.1, -3.6], "Bob", "private \u2192 public", "key"),
            ...hexStrip("bPriv", bPriv.toUpperCase(), "key", [7, 0.6, -3.8], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
            arrow("b1", [7, 0.6, -0.8], [7, 0.6, 0.6], "path"),
            ...valuePlate("bPub", [7, 0.4, 2.6], "public", bPub.includes("x25") ? bPub : `${bPub.slice(0, 32)}\u2026`, "output")
          ]),
          arrow("wire", [-2, 0.4, 0], [2, 0.4, 0], "path"),
          ...valuePlate("op", [0, 2.6, 0], "X25519", "clamp \u2192 scalar mult \u2192 u-coordinate", "transform")
        ];
      }
      case "x25519-ladder":
        return [
          ...valuePlate("ca", [-4, 0.9, -1.6], "Alice clamp", String(v.clampA ?? ""), "transform"),
          ...valuePlate("cb", [4, 0.9, -1.6], "Bob clamp", String(v.clampB ?? ""), "transform"),
          {
            id: "ladder",
            kind: "ring",
            position: [0, 0, 1.2],
            ringRadius: 2.4,
            ringTube: 0.1,
            tone: "path"
          },
          {
            id: "ladder-dot",
            kind: "sphere",
            position: [2.2, 0.6, 0.7],
            size: [0.4, 0.4, 0.4],
            tone: "active",
            emphasize: true
          },
          ...valuePlate("ladder-op", [0, -1.2, 4], "Montgomery ladder", "[1,u,1] \u2192 iterations \u2192 u", "internal")
        ];
      case "x25519-shared": {
        const shared = v.shared ? String(v.shared) : null;
        return [
          ...card("alice", [-7, 0, 0], valuePlate("Sa", [-7, 0.7, 0], "S = X25519(a, B)", shared ? `${shared.slice(0, 16)}\u2026` : "X25519(a,B)", "output")),
          ...card("bob", [7, 0, 0], valuePlate("Sb", [7, 0.7, 0], "S = X25519(b, A)", shared ? `${shared.slice(0, 16)}\u2026` : "X25519(b,A)", "output")),
          arrow("wa", [-4.4, 0.6, -0.6], [-2.6, 0.6, -0.6], "path"),
          arrow("wb", [2.6, 0.6, 0.6], [4.4, 0.6, 0.6], "path"),
          ...shared ? [
            ...hexStrip("shared", shared.toUpperCase(), "output", [0, 0.3, 3], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
            ...valuePlate("sharedcap", [0, 2.3, 3], "shared secret", "32 bytes", "output", { emphasize: true })
          ] : valuePlate("sharedcap", [0, 1.2, 3], "shared secret", "binding unavailable in demo", "muted")
        ];
      }
      default:
        return [];
    }
  }
);
function card(prefix, origin, inner) {
  return [
    {
      id: `${prefix}-bg`,
      kind: "box",
      position: [origin[0], -0.2, -3.6],
      size: [4.4, 0.16, 9],
      tone: prefix === "alice" ? "input" : "key",
      opacity: 0.12
    },
    ...inner
  ];
}

// src/components/simulation3d/adapters/ecdsa3D.ts
var ecdsaAdapter = createAdapterFromEngine(
  ecdsaEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "ecdsa-keygen":
        return [
          ...valuePlate("curve", [0, 1.2, -2.4], "curve", String(v.curve ?? ""), "internal"),
          ...valuePlate("d", [-4.4, 0, 0.4], "private scalar d", v.priv != null ? String(v.priv) : "random", "key"),
          arrow("kg1", [-2.4, 0.5, 0.4], [-0.8, 0.5, 0.4], "path"),
          ...valuePlate("Q", [2.6, 0.5, 0.4], "public point Q", "Q = d\xB7G", "output", { emphasize: true }),
          ...valuePlate("note", [0, -1.6, 3.6], "authenticates", "signs \u2014 does NOT encrypt", "muted")
        ];
      case "ecdsa-hash": {
        const message = String(v.message ?? "");
        return [
          ...charRow("msg", message.split("").map((ch) => ({ label: ch, tone: "input" })), [0, 0.7, -2.6], { cellSize: 0.72, gap: 0.09 }).objects,
          arrow("h1", [0, 0.7, -0.4], [0, 0.7, 1.2], "path"),
          ...valuePlate("z", [0, 0.7, 2.8], "z (int digest)", "SHA-256(msg) mod n", "transform", { emphasize: true })
        ];
      }
      case "ecdsa-sign": {
        const rHex = v.rHex ? String(v.rHex) : null;
        const sHex = v.sHex ? String(v.sHex) : null;
        const sigHex = typeof v.sigHex === "string" ? String(v.sigHex) : null;
        return [
          ...valuePlate("k", [-5.4, 1, -0.6], "k", "random per-message", "key"),
          ...valuePlate("R", [-1.6, 1, -0.6], "R = k\xB7G", "(xR, yR)", "internal"),
          ...valuePlate("r", [2.6, 1, -0.6], "r = xR mod n", rHex ?? "structural", "output"),
          ...valuePlate("s", [6.4, 0.2, -0.6], "s", sHex ?? "structural", "output"),
          ...valuePlate("formula", [3, -1.4, 2.4], "s = k\u207B\xB9(z + r\xB7d) mod n", "", "internal"),
          ...sigHex ? [
            ...hexStrip("sig", sigHex.toUpperCase(), "output", [0, 0.4, 4.4], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
            ...valuePlate("sigcap", [0, 2.5, 4.4], "signature", "DER hex", "output", { emphasize: true })
          ] : []
        ];
      }
      case "ecdsa-verify": {
        const pubHex = typeof v.pubHex === "string" ? String(v.pubHex) : null;
        return [
          ...valuePlate("verify", [0, 1.2, -2], "verify", "w = s\u207B\xB9 \xB7 u1 = z\xB7w \xB7 u2 = r\xB7w", "internal"),
          arrow("v1", [0, 1.2, -0.4], [0, 1.2, 1.2], "path"),
          ...valuePlate("check", [0, 1.2, 2.6], "P = u1\xB7G + u2\xB7Q", "OK if P.x mod n == r", "transform", { emphasize: true }),
          ...pubHex ? [
            ...valuePlate("pubcap", [0, 2.6, 4.4], "public point", `${pubHex.slice(0, 32)}\u2026`, "output"),
            ...hexStrip("pub", pubHex.toUpperCase(), "output", [0, 0.4, 4.4], { piece: 2, cellSize: 0.3, gap: 0.018 }).objects
          ] : []
        ];
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/ed255193D.ts
var ed25519Adapter = createAdapterFromEngine(
  ed25519Engine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "ed25519-keygen": {
        const privateHex = String(v.privateHex ?? "");
        const pubHex = typeof v.pubHex === "string" ? String(v.pubHex) : null;
        return [
          ...privateHex ? [
            ...hexStrip("priv", privateHex.toUpperCase(), "key", [0, 0.5, -3.8], { piece: 2, cellSize: 0.4, gap: 0.022 }).objects,
            ...valuePlate("privcap", [0, 2.5, -3.8], "private key", "32 bytes", "key")
          ] : [...valuePlate("privcap", [0, 1, -3.4], "private key", "(blank = auto)", "key")],
          arrow("k1", [0, 0.7, -1.4], [0, 0.7, 0], "path"),
          ...valuePlate("deriv", [0, 0.7, 1.8], "SHA-512 \u2192 clamp \u2192 scalar a", "", "transform"),
          arrow("k2", [0, 0.7, 3.6], [0, 0.7, 5], "path"),
          ...valuePlate("A", [0, 0.7, 6.4], "public A = a\xB7B", pubHex ?? "structural", "output", { emphasize: true })
        ];
      }
      case "ed25519-hash": {
        const message = String(v.message ?? "");
        return [
          ...charRow("msg", message.split("").map((ch) => ({ label: ch, tone: "input" })), [0, 0.7, -2.4], { cellSize: 0.72, gap: 0.09 }).objects,
          arrow("h1", [0, 0.7, -0.2], [0, 0.7, 1.2], "path"),
          ...valuePlate("r", [0, 0.7, 2.6], "nonce r", "SHA-512(prefix \u2225 message)", "transform", { emphasize: true })
        ];
      }
      case "ed25519-derivation":
        return [
          ...valuePlate("R", [-5, 1, -0.6], "R = r\xB7B", "curve point", "internal"),
          ...valuePlate("h", [0, 1, -0.6], "h = SHA-512(R \u2225 A \u2225 M)", "structural", "transform"),
          ...valuePlate("S", [5, 1, -0.6], "S = (r + h\xB7a) mod L", "structural", "output", { emphasize: true })
        ];
      case "ed25519-sign": {
        const rHex = v.rHex ? String(v.rHex) : null;
        const sHex = v.sHex ? String(v.sHex) : null;
        const sigHex = typeof v.sigHex === "string" ? String(v.sigHex) : null;
        return [
          ...valuePlate("R", [-3.4, 1, -1], "R (32 bytes)", rHex ?? "structural", "output"),
          ...valuePlate("S", [3.4, 1, -1], "S (32 bytes)", sHex ?? "structural", "output"),
          ...sigHex ? [
            ...hexStrip("sig", sigHex.toUpperCase(), "output", [0, 0.3, 2.4], { piece: 2, cellSize: 0.4, gap: 0.022 }).objects,
            ...valuePlate("sigcap", [0, 2.5, 2.4], "signature", "64 bytes", "output", { emphasize: true })
          ] : []
        ];
      }
      case "ed25519-result": {
        const sigHex = typeof v.sigHex === "string" ? String(v.sigHex) : null;
        return [
          ...valuePlate("scheme", [0, 1.4, -2], "scheme", "Ed25519 signs \u2014 NOT encryption", "key", { emphasize: true }),
          ...sigHex ? [
            ...hexStrip("sig", sigHex.toUpperCase(), "output", [0, 0.2, 2.2], { piece: 2, cellSize: 0.4, gap: 0.022 }).objects,
            ...valuePlate("sigcap", [0, 2.4, 2.2], "signature", "64 bytes", "output", { emphasize: true })
          ] : valuePlate("sigcap", [0, 0.6, 2.4], "signature", "run the operation to bind real signature", "muted")
        ];
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/adapters/diffieHellman3D.ts
var diffieHellmanAdapter = createAdapterFromEngine(
  diffieHellmanEngine,
  (stage) => {
    const v = stage.view;
    switch (v.kind) {
      case "dh-error":
        return [...valuePlate("err", [0, 1.2, 0], "invalid parameters", String(v.reason ?? ""), "error", { emphasize: true })];
      case "dh-params":
        return [
          ...valuePlate("p", [-4, 1.2, 0], "p (prime)", String(v.p ?? ""), "internal"),
          ...valuePlate("g", [4, 1.2, 0], "g (generator)", String(v.g ?? ""), "key"),
          ...valuePlate("pub", [0, -1.6, 3], "public domain", "shared by both parties", "muted")
        ];
      case "dh-party": {
        const name = String(v.name ?? "");
        const priv = String(v.priv ?? "");
        const pub = String(v.pub ?? "");
        return [
          {
            id: `dhp-${name.toLowerCase()}-bg`,
            kind: "box",
            position: [-4.6, -0.3, 0.6],
            size: [4.6, 0.16, 8.6],
            tone: "internal",
            opacity: 0.14
          },
          ...valuePlate(`dhp-${name.toLowerCase()}-name`, [-4.6, 2.4, -3], "party", name, "path"),
          ...valuePlate(`dhp-${name.toLowerCase()}-priv`, [-4.6, 1, -1], "private", priv, "key"),
          arrow(`dhp-${name.toLowerCase()}-ar`, [-5.6, 0.4, 0.5], [-3.6, 0.4, 0.5], "path"),
          ...valuePlate(`dhp-${name.toLowerCase()}-op`, [-4.6, 0.4, 2.4], "compute", "g^priv mod p", "transform"),
          ...valuePlate(`dhp-${name.toLowerCase()}-pub`, [-4.6, 0.4, 4.8], "public", pub, "output", { emphasize: true })
        ];
      }
      case "dh-exchange": {
        const A = String(v.A ?? "");
        const B = String(v.B ?? "");
        const card2 = (prefix, origin) => [
          {
            id: `${prefix}-bg`,
            kind: "box",
            position: [origin[0], -0.3, 0.6],
            size: [4.6, 0.16, 8.6],
            tone: prefix === "alice" ? "input" : "key",
            opacity: 0.14
          },
          ...valuePlate(`${prefix}-name`, [origin[0], 2.4, -3], "party", prefix === "alice" ? "Alice" : "Bob", "path"),
          ...valuePlate(`${prefix}-pub`, [origin[0], 0.7, 1], "public", prefix === "alice" ? A : B, "output")
        ];
        return [
          ...card2("alice", [-6.4, 0, 0]),
          ...card2("bob", [6.4, 0, 0]),
          arrow("xa", [-2.4, 0.6, -0.6], [-0.8, 0.6, -0.6], "path"),
          arrow("xb", [0.8, 0.6, 0.6], [2.4, 0.6, 0.6], "path"),
          ...valuePlate("chan", [0, 2.2, -1.6], "channel", "public values only", "muted"),
          ...valuePlate("note", [0, 1, 3.4], "note", "private exponents never leave their owners", "muted")
        ];
      }
      case "dh-shared": {
        const s = String(v.s ?? "");
        const match = Boolean(v.match);
        return [
          ...valuePlate("sa", [-5, 1, -0.8], "s = B^a mod p", s, "output"),
          ...valuePlate("sb", [5, 1, -0.8], "s = A^b mod p", s, "output"),
          arrow("fa", [-1.6, 0.5, 0.2], [1.6, 0.5, 0.2], "path"),
          ...valuePlate("sig", [0, -1.4, 3], "shared secret", match ? `MATCH = ${s}` : s, "output", { emphasize: true })
        ];
      }
      default:
        return [];
    }
  }
);

// src/components/simulation3d/registry3d.ts
var REGISTRY = {
  [caesar3DAdapter.id]: caesar3DAdapter,
  [vigenere3DAdapter.id]: vigenere3DAdapter,
  [monoAlphabetic3DAdapter.id]: monoAlphabetic3DAdapter,
  [playfair3DAdapter.id]: playfair3DAdapter,
  [hill3DAdapter.id]: hill3DAdapter,
  [railFence3DAdapter.id]: railFence3DAdapter,
  [columnar3DAdapter.id]: columnar3DAdapter,
  [des3DAdapter.id]: des3DAdapter,
  [tripleDes3DAdapter.id]: tripleDes3DAdapter,
  [aes3DAdapter.id]: aes3DAdapter,
  [blowfish3DAdapter.id]: blowfish3DAdapter,
  [twofish3DAdapter.id]: twofish3DAdapter,
  [chacha203DAdapter.id]: chacha203DAdapter,
  [aesGcm3DAdapter.id]: aesGcm3DAdapter,
  [chacha20Poly13053DAdapter.id]: chacha20Poly13053DAdapter,
  [sha256Adapter.id]: sha256Adapter,
  [sha512Adapter.id]: sha512Adapter,
  [sha1Adapter.id]: sha1Adapter,
  [md5Adapter.id]: md5Adapter,
  [sha3Adapter.id]: sha3Adapter,
  [blake2Adapter.id]: blake2Adapter,
  [blake3Adapter.id]: blake3Adapter,
  [hmacAdapter.id]: hmacAdapter,
  [pbkdf2Adapter.id]: pbkdf2Adapter,
  [bcryptAdapter.id]: bcryptAdapter,
  [scryptAdapter.id]: scryptAdapter,
  [argon2Adapter.id]: argon2Adapter,
  [hkdfAdapter.id]: hkdfAdapter,
  [rsaAdapter.id]: rsaAdapter,
  [elgamalAdapter.id]: elgamalAdapter,
  [ecdhAdapter.id]: ecdhAdapter,
  [x25519Adapter.id]: x25519Adapter,
  [ecdsaAdapter.id]: ecdsaAdapter,
  [ed25519Adapter.id]: ed25519Adapter,
  [diffieHellmanAdapter.id]: diffieHellmanAdapter
};
function getAll3DAdapters() {
  return { ...REGISTRY };
}

// scripts/audit/run.ts
var norm = (s) => String(s ?? "").toUpperCase().replace(/[\s\-_]/g, "");
function displayedFromObjects(objects) {
  const out = [];
  for (const o of objects) {
    if (!o.label) continue;
    if (o.tone === "output" || o.tone === "complete") out.push(norm(o.label));
  }
  return out;
}
function metaOutputStrings(meta) {
  if (!meta) return [];
  const out = [];
  if (meta.outputs)
    for (const v of Object.values(meta.outputs)) out.push(norm(v));
  if (meta.changedValues)
    for (const cv of meta.changedValues) out.push(norm(cv.after));
  return out;
}
function byteChunks(hex) {
  if (hex.length < 2 || hex.length % 2 !== 0) return null;
  if (!/^[0-9A-F]+$/.test(hex)) return null;
  const out = [];
  for (let i = 0; i < hex.length; i += 2) out.push(hex.slice(i, i + 2));
  return out;
}
function chunks2(expected) {
  if (expected.length < 2 || expected.length % 2 !== 0) return null;
  const out = [];
  for (let i = 0; i < expected.length; i += 2) out.push(expected.slice(i, i + 2));
  return out;
}
function containment(displayed, expected) {
  if (!expected) return null;
  if (displayed.has(expected)) return "exact";
  const chunks = byteChunks(expected);
  if (chunks !== null && chunks.length > 1) {
    if (chunks.every((b) => displayed.has(b))) return "bytes";
  }
  const generic = chunks2(expected);
  if (generic !== null && generic.length > 1) {
    if (generic.every((c) => displayed.has(c))) return "chunks";
  }
  const hexOnly = (s) => s.replace(/[^0-9A-F]/g, "");
  for (const d of displayed) {
    const clean = hexOnly(d);
    if (clean.length >= 6 && expected.startsWith(clean)) return "prefix";
  }
  return null;
}
var ENGINE_MAP = {
  caesar: caesarEngine,
  monoalphabetic: monoAlphabeticEngine,
  vigenere: vigenereEngine,
  playfair: playfairEngine,
  hill: hillEngine,
  rail_fence: railFenceEngine,
  columnar: columnarEngine,
  des: desEngine,
  triple_des: tripleDesEngine,
  aes: aesEngine,
  blowfish: blowfishEngine,
  twofish: twofishEngine,
  chacha20: chacha20Engine,
  aes_gcm: aesGcmEngine,
  chacha20_poly1305: chacha20Poly1305Engine,
  sha256: sha256Engine,
  sha512: sha512Engine,
  sha1: sha1Engine,
  md5: md5Engine,
  sha3: sha3Engine,
  blake2: blake2Engine,
  blake3: blake3Engine,
  hmac: hmacEngine,
  pbkdf2: pbkdf2Engine,
  bcrypt: bcryptEngine,
  scrypt: scryptEngine,
  argon2: argon2Engine,
  hkdf: hkdfEngine,
  diffie_hellman: diffieHellmanEngine,
  ecdh: ecdhEngine,
  x25519: x25519Engine,
  rsa: rsaEngine,
  elgamal: elgamalEngine,
  ecdsa: ecdsaEngine,
  ed25519: ed25519Engine
};
function engineExpected(id36, fixture, operation) {
  const eng = ENGINE_MAP[id36];
  if (!eng) return null;
  const ctx = {
    id: id36,
    operation,
    inputs: fixture.inputs,
    demo: false,
    language: "en",
    dir: "ltr",
    theme: "dark",
    result: toAlgoResult(fixture),
    resultMatches: true,
    t: (k) => k
  };
  try {
    const stages = eng.build(ctx);
    if (!stages.length) return null;
    const last = stages[stages.length - 1];
    const v = last?.view;
    if (!v) return null;
    const keys = [
      "result",
      "hex",
      "text",
      "ciphertext",
      "cipher",
      "digest",
      "shared",
      "shared_secret",
      "mac",
      "derived",
      "out",
      "signature",
      "hash"
    ];
    for (const k of keys) {
      const val = v[k];
      if (val != null && String(val).trim()) return norm(String(val));
    }
    return null;
  } catch {
    return null;
  }
}
function toAlgoResult(f) {
  return {
    algorithm: f.algorithm,
    operation: f.operation,
    input: JSON.stringify(f.inputs),
    parameters: f.inputs,
    result: f.result,
    extra: f.extra,
    steps: []
  };
}
function main() {
  const __dir = (0, import_node_path.dirname)(process.argv[1]);
  const AUDIT_DIR = (0, import_node_path.resolve)(__dir);
  const FIXTURE_PATH = (0, import_node_path.resolve)(AUDIT_DIR, "../fixtures/audit.json");
  const REPORT_DIR = (0, import_node_path.resolve)(AUDIT_DIR, "..");
  const REPORT_JSON = (0, import_node_path.resolve)(REPORT_DIR, "fixtures/audit-report.json");
  const REPORT_MD = (0, import_node_path.resolve)(REPORT_DIR, "3d-audit-report.md");
  const raw = JSON.parse((0, import_node_fs.readFileSync)(FIXTURE_PATH, "utf-8"));
  const adapters = getAll3DAdapters();
  const results = [];
  for (const [id36, fixture] of Object.entries(raw.fixtures)) {
    const adapter = adapters[id36];
    const detail = {
      adapter: id36,
      status: "PASS"
    };
    if (!adapter) {
      detail.status = "ERROR";
      detail.buildError = `no 3D adapter registered for "${id36}"`;
      results.push(detail);
      continue;
    }
    const ctx = {
      id: id36,
      operation: raw.operations[id36]?.operation ?? fixture.operation,
      inputs: fixture.inputs,
      demo: false,
      language: "en",
      dir: "ltr",
      theme: "dark",
      result: toAlgoResult(fixture),
      resultMatches: true,
      t: (k) => k
    };
    let steps;
    try {
      steps = adapter.buildSteps(ctx);
    } catch (err2) {
      detail.status = "ERROR";
      detail.buildError = String(err2);
      results.push(detail);
      continue;
    }
    if (!steps.length) {
      detail.status = "ERROR";
      detail.buildError = "adapter returned 0 steps";
      results.push(detail);
      continue;
    }
    const displayedAllSet = /* @__PURE__ */ new Set();
    for (const step of steps) {
      for (const lbl of displayedFromObjects(step.objects ?? []))
        displayedAllSet.add(lbl);
      for (const lbl of metaOutputStrings(step.meta))
        displayedAllSet.add(lbl);
    }
    detail.displayedAll = [...displayedAllSet];
    const lastStep = steps[steps.length - 1];
    const displayedFinalSet = /* @__PURE__ */ new Set();
    for (const lbl of displayedFromObjects(lastStep.objects ?? []))
      displayedFinalSet.add(lbl);
    for (const lbl of metaOutputStrings(lastStep.meta))
      displayedFinalSet.add(lbl);
    detail.displayedFinal = [...displayedFinalSet];
    const expectedFixture = norm(fixture.result_str);
    detail.expectedFixture = expectedFixture;
    const fixAll = containment(displayedAllSet, expectedFixture);
    const fixFinal = containment(displayedFinalSet, expectedFixture);
    detail.fixtureInAll = fixAll !== null;
    detail.fixtureInFinal = fixFinal !== null;
    const expectedEng = engineExpected(id36, fixture, ctx.operation);
    if (expectedEng !== null) {
      detail.expectedEngine = expectedEng;
      const engAll = containment(displayedAllSet, expectedEng);
      const engFinal = containment(displayedFinalSet, expectedEng);
      detail.engineInAll = engAll !== null;
      detail.engineInFinal = engFinal !== null;
    }
    const hasMeta = steps.some((s) => s.meta != null);
    detail.metaOutputsPresent = hasMeta;
    if (fixture.roundtrip) detail.fixtureRoundtrip = fixture.roundtrip.ok;
    const fixtureOk = detail.fixtureInAll && detail.fixtureInFinal;
    const engineOk = expectedEng === null || detail.engineInAll && detail.engineInFinal;
    if (!fixtureOk && !engineOk) {
      detail.status = "FAIL";
    } else if (!fixtureOk && engineOk) {
    } else if (fixtureOk && !engineOk && expectedEng !== null) {
      detail.status = "WARN";
    }
    if (detail.fixtureRoundtrip === false) {
      detail.status = detail.status === "PASS" ? "WARN" : detail.status;
    }
    results.push(detail);
  }
  (0, import_node_fs.mkdirSync)(REPORT_DIR, { recursive: true });
  (0, import_node_fs.writeFileSync)(
    REPORT_JSON,
    JSON.stringify(
      { generated: raw.generated, results },
      null,
      2
    ),
    "utf-8"
  );
  const lines = [
    "# 3D Audit Report",
    "",
    `Generated: ${raw.generated}`,
    "",
    "| Algorithm | Status | Fixture in All | Fixture in Final | Engine in All | Engine in Final | Meta | Roundtrip |",
    "|-----------|--------|----------------|------------------|---------------|-----------------|------|-----------|"
  ];
  for (const r of results) {
    const icon = r.status === "PASS" ? "PASS" : r.status === "FAIL" ? "FAIL" : r.status === "WARN" ? "WARN" : "ERROR";
    lines.push(
      `| ${r.adapter} | ${icon} | ${r.fixtureInAll ? "Y" : "N"} | ${r.fixtureInFinal ? "Y" : "N"} | ${r.engineInAll == null ? "\u2014" : r.engineInAll ? "Y" : "N"} | ${r.engineInFinal == null ? "\u2014" : r.engineInFinal ? "Y" : "N"} | ${r.metaOutputsPresent ? "Y" : "N"} | ${r.fixtureRoundtrip == null ? "\u2014" : r.fixtureRoundtrip ? "Y" : "N"} |`
    );
  }
  const pass = results.filter((r) => r.status === "PASS").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  const warn = results.filter((r) => r.status === "WARN").length;
  const err = results.filter((r) => r.status === "ERROR").length;
  lines.push(
    "",
    `**Totals:** ${pass} PASS, ${fail} FAIL, ${warn} WARN, ${err} ERROR (of ${results.length})`
  );
  if (fail > 0) {
    lines.push("", "## FAIL details", "");
    for (const r of results.filter((r2) => r2.status === "FAIL")) {
      lines.push(`### ${r.adapter}`);
      lines.push(
        `- expected fixture result: \`${r.expectedFixture}\`  inAll=${r.fixtureInAll}  inFinal=${r.fixtureInFinal}`
      );
      if (r.expectedEngine !== null)
        lines.push(
          `- expected engine result:  \`${r.expectedEngine}\`  inAll=${r.engineInAll}  inFinal=${r.engineInFinal}`
        );
      lines.push(`- displayedAll: \`${r.displayedAll.join(", ")}\``);
      lines.push(`- displayedFinal: \`${r.displayedFinal.join(", ")}\``);
      lines.push("");
    }
  }
  if (err > 0) {
    lines.push("", "## ERROR details", "");
    for (const r of results.filter((r2) => r2.status === "ERROR"))
      lines.push(`- **${r.adapter}**: ${r.buildError}`);
    lines.push("");
  }
  (0, import_node_fs.writeFileSync)(REPORT_MD, lines.join("\n"), "utf-8");
  console.log(`
3D AUDIT: ${pass} PASS, ${fail} FAIL, ${warn} WARN, ${err} ERROR`);
  if (fail > 0) {
    console.log("\nFAIL:");
    for (const r of results.filter((r2) => r2.status === "FAIL"))
      console.log(`  ${r.adapter} \u2014 expected fixture \`${r.expectedFixture}\` NOT in final: [${r.displayedFinal.join(", ")}]`);
  }
  if (err > 0) {
    console.log("\nERROR:");
    for (const r of results.filter((r2) => r2.status === "ERROR"))
      console.log(`  ${r.adapter} \u2014 ${r.buildError}`);
  }
  console.log(`
JSON \u2192 ${REPORT_JSON}`);
  console.log(`MD   \u2192 ${REPORT_MD}`);
  process.exit(fail + err > 0 ? 1 : 0);
}
main();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
