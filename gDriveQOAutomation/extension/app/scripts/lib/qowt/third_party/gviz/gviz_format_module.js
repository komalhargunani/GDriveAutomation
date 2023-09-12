// Copyright 2014 Google Inc. All Rights Reserved.
/*jsl:ignore*/
define([], function() {
// INPUT (javascript/closure/base.js)
var $jscomp = {scope:{}}, goog = goog || {};
goog.global = this;
goog.isDef = function(val) {
  return void 0 !== val;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
  parts[0] in cur || !cur.execScript || cur.execScript("var " + parts[0]);
  for (var part;parts.length && (part = parts.shift());) {
    !parts.length && goog.isDef(opt_object) ? cur[part] = opt_object : cur = cur[part] ? cur[part] : cur[part] = {};
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  goog.exportPath_(name, value);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(name) {
  goog.exportPath_(name);
};
goog.module = function(name) {
  if (!goog.isString(name) || !name) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return null != goog.moduleLoaderState_;
};
goog.module.exportTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw Error("goog.module.exportTestMethods must be called from within a goog.module");
  }
  goog.moduleLoaderState_.exportTestMethods = !0;
};
goog.setTestOnly = function(opt_message) {
  if (!goog.DEBUG) {
    throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function() {
};
goog.getObjectByName = function(name, opt_obj) {
  for (var parts = name.split("."), cur = opt_obj || goog.global, part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global, x;
  for (x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    for (var provide, require, path = relPath.replace(/\\/g, "/"), deps = goog.dependencies_, i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path, deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0;require = requires[j];j++) {
      path in deps.requires || (deps.requires[path] = {}), deps.requires[path][require] = !0;
    }
  }
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(msg) {
  goog.global.console && goog.global.console.error(msg);
};
goog.require = function() {
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue) {
  return opt_returnValue;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor);
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !1;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var doc = goog.global.document;
  return "undefined" != typeof doc && "write" in doc;
}, goog.findBasePath_ = function() {
  if (goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var doc = goog.global.document, scripts = doc.getElementsByTagName("script"), i = scripts.length - 1;0 <= i;--i) {
        var src = scripts[i].src, qmark = src.lastIndexOf("?"), l = -1 == qmark ? src.length : qmark;
        if ("base.js" == src.substr(l - 7, 7)) {
          goog.basePath = src.substr(0, l - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(src, opt_sourceText) {
  var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  importScript(src, opt_sourceText) && (goog.dependencies_.written[src] = !0);
}, goog.IS_OLD_IE_ = goog.global.document && goog.global.document.all && !goog.global.atob, goog.importModule_ = function(src) {
  var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';
  goog.importScript_("", bootstrap) && (goog.dependencies_.written[src] = !0);
}, goog.queuedModules_ = [], goog.retrieveAndExecModule_ = function(src) {
  var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_, scriptText = null, xhr = new goog.global.XMLHttpRequest;
  xhr.onload = function() {
    scriptText = this.responseText;
  };
  xhr.open("get", src, !1);
  xhr.send();
  scriptText = xhr.responseText;
  if (null != scriptText) {
    var execModuleScript = goog.wrapModule_(src, scriptText), isOldIE = goog.IS_OLD_IE_;
    isOldIE ? goog.queuedModules_.push(execModuleScript) : importScript(src, execModuleScript);
    goog.dependencies_.written[src] = !0;
  } else {
    throw Error("load of " + src + "failed");
  }
}, goog.wrapModule_ = function(srcUrl, scriptText) {
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + scriptText + "\n;return exports});\n//# sourceURL=" + srcUrl + "\n";
}, goog.loadQueuedModules_ = function() {
  var count = goog.queuedModules_.length;
  if (0 < count) {
    var queue = goog.queuedModules_;
    goog.queuedModules_ = [];
    for (var i = 0;i < count;i++) {
      var entry = queue[i];
      goog.globalEval(entry);
    }
  }
}, goog.loadModule = function(moduleDef) {
  try {
    goog.moduleLoaderState_ = {moduleName:void 0, exportTestMethods:!1};
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(goog.global, {});
    } else {
      if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
      } else {
        throw Error("Invalid module definition");
      }
    }
    Object.seal && Object.seal(exports);
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw Error('Invalid module name "' + moduleName + '"');
    }
    goog.loadedModules_[moduleName] = exports;
    if (goog.moduleLoaderState_.exportTestMethods) {
      for (var entry in exports) {
        if (0 === entry.indexOf("test", 0) || "tearDown" == entry || "setup" == entry) {
          goog.global[entry] = exports[entry];
        }
      }
    }
  } finally {
    goog.moduleLoaderState_ = null;
  }
}, goog.loadModuleFromSource_ = function(JSCompiler_OptimizeArgumentsArray_p0) {
  var exports = {};
  eval(JSCompiler_OptimizeArgumentsArray_p0);
  return exports;
}, goog.writeScriptTag_ = function(src, opt_sourceText) {
  if (goog.inHtmlDocument_()) {
    var doc = goog.global.document;
    if ("complete" == doc.readyState) {
      var isDeps = /\bdeps.js$/.test(src);
      if (isDeps) {
        return!1;
      }
      throw Error('Cannot write "' + src + '" after document load');
    }
    var isOldIE = goog.IS_OLD_IE_;
    if (void 0 === opt_sourceText) {
      if (isOldIE) {
        var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
        doc.write('<script type="text/javascript" src="' + src + '"' + state + ">\x3c/script>");
      } else {
        doc.write('<script type="text/javascript" src="' + src + '">\x3c/script>');
      }
    } else {
      doc.write('<script type="text/javascript">' + opt_sourceText + "\x3c/script>");
    }
    return!0;
  }
  return!1;
}, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function(script, scriptIndex) {
  "complete" == script.readyState && goog.lastNonModuleScriptIndex_ == scriptIndex && goog.loadQueuedModules_();
  return!0;
}, goog.writeScripts_ = function() {
  function visitNode(path) {
    if (!(path in deps.written)) {
      if (!(path in deps.visited) && (deps.visited[path] = !0, path in deps.requires)) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      path in seenScript || (seenScript[path] = !0, scripts.push(path));
    }
  }
  var scripts = [], seenScript = {}, deps = goog.dependencies_, path$$0;
  for (path$$0 in goog.included_) {
    deps.written[path$$0] || visitNode(path$$0);
  }
  for (var i = 0;i < scripts.length;i++) {
    path$$0 = scripts[i], goog.dependencies_.written[path$$0] = !0;
  }
  var moduleState = goog.moduleLoaderState_;
  goog.moduleLoaderState_ = null;
  for (i = 0;i < scripts.length;i++) {
    if (path$$0 = scripts[i]) {
      deps.pathIsModule[path$$0] ? goog.importModule_(goog.basePath + path$$0) : goog.importScript_(goog.basePath + path$$0);
    } else {
      throw goog.moduleLoaderState_ = moduleState, Error("Undefined script input");
    }
  }
  goog.moduleLoaderState_ = moduleState;
}, goog.getPathFromDeps_ = function(rule) {
  return rule in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[rule] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(value) {
  var s = typeof value;
  if ("object" == s) {
    if (value) {
      if (value instanceof Array) {
        return "array";
      }
      if (value instanceof Object) {
        return s;
      }
      var className = Object.prototype.toString.call(value);
      if ("[object Window]" == className) {
        return "object";
      }
      if ("[object Array]" == className || "number" == typeof value.length && "undefined" != typeof value.splice && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == className || "undefined" != typeof value.call && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == s && "undefined" == typeof value.call) {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return null === val;
};
goog.isDefAndNotNull = function(val) {
  return null != val;
};
goog.isArray = function(val) {
  return "array" == goog.typeOf(val);
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return "array" == type || "object" == type && "number" == typeof val.length;
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && "function" == typeof val.getFullYear;
};
goog.isString = function(val) {
  return "string" == typeof val;
};
goog.isBoolean = function(val) {
  return "boolean" == typeof val;
};
goog.isNumber = function(val) {
  return "number" == typeof val;
};
goog.isFunction = function(val) {
  return "function" == goog.typeOf(val);
};
goog.isObject = function(val) {
  var type = typeof val;
  return "object" == type && null != val || "function" == type;
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return!!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  "removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw Error();
  }
  if (2 < arguments.length) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  }
  return function() {
    return fn.apply(selfObj, arguments);
  };
};
goog.bind = function(fn, selfObj, var_args) {
  goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document, scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = !1;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  }, renameByParts = function(cssName) {
    for (var parts = cssName.split("-"), mapped = [], i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  }, rename;
  rename = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? getMapping : renameByParts : function(a) {
    return a;
  };
  return opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.getMsg = function(str, opt_values) {
  opt_values && (str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
    return key in opt_values ? opt_values[key] : match;
  }));
  return str;
};
goog.getMsgWithFallback = function(a) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1));
  }
  for (var args = Array.prototype.slice.call(arguments, 2), foundCaller = !1, ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = !0;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
goog.MODIFY_FUNCTION_PROTOTYPES = !1;
goog.MODIFY_FUNCTION_PROTOTYPES && (Function.prototype.bind = Function.prototype.bind || function(selfObj, var_args) {
  if (1 < arguments.length) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(this, selfObj);
    return goog.bind.apply(null, args);
  }
  return goog.bind(this, selfObj);
}, Function.prototype.partial = function(var_args) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this, null);
  return goog.bind.apply(null, args);
}, Function.prototype.inherits = function(parentCtor) {
  goog.inherits(this, parentCtor);
}, Function.prototype.mixin = function(source) {
  goog.mixin(this.prototype, source);
});
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor, statics = def.statics;
  constructor && constructor != Object.prototype.constructor || (constructor = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  superClass && goog.inherits(cls, superClass);
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  null != statics && (statics instanceof Function ? statics(cls) : goog.defineClass.applyProperties_(cls, statics));
  return cls;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    var wrappedCtr = function() {
      var instance = ctr.apply(this, arguments) || this;
      this.constructor === wrappedCtr && Object.seal(instance);
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(target, source) {
  for (var key in source) {
    Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
};
goog.tagUnsealableClass = function() {
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
// INPUT (javascript/gviz/devel/jsapi/jsapi_bootstrap.js)
var google = google || window.google || {};
google.visualization = google.visualization || (window.google && window.google.visualization) || {};
// INPUT (javascript/closure/deps.js)
// INPUT (javascript/closure/debug/error.js)
goog.debug = {};
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = Error().stack;
    stack && (this.stack = stack);
  }
  opt_msg && (this.message = String(opt_msg));
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
// INPUT (javascript/closure/dom/nodetype.js)
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
// INPUT (javascript/closure/string/string.js)
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return 0 == str.lastIndexOf(prefix, 0);
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return 0 <= l && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return 0 == goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length));
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return 0 == goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length));
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  for (var splitParts = str.split("%s"), returnString = "", subsArguments = Array.prototype.slice.call(arguments, 1);subsArguments.length && 1 < splitParts.length;) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str);
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str));
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return " " == ch;
};
goog.string.isUnicodeChar = function(ch) {
  return 1 == ch.length && " " <= ch && "~" >= ch || "\u0080" <= ch && "\ufffd" >= ch;
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase(), test2 = String(str2).toLowerCase();
  return test1 < test2 ? -1 : test1 == test2 ? 0 : 1;
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return-1;
  }
  if (!str2) {
    return 1;
  }
  for (var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_), tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_), count = Math.min(tokens1.length, tokens2.length), i = 0;i < count;i++) {
    var a = tokens1[i], b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  return tokens1.length != tokens2.length ? tokens1.length - tokens2.length : str1 < str2 ? -1 : 1;
};
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (str = str.replace(goog.string.E_RE_, "&#101;"));
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    -1 != str.indexOf("&") && (str = str.replace(goog.string.AMP_RE_, "&amp;"));
    -1 != str.indexOf("<") && (str = str.replace(goog.string.LT_RE_, "&lt;"));
    -1 != str.indexOf(">") && (str = str.replace(goog.string.GT_RE_, "&gt;"));
    -1 != str.indexOf('"') && (str = str.replace(goog.string.QUOT_RE_, "&quot;"));
    -1 != str.indexOf("'") && (str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != str.indexOf("\x00") && (str = str.replace(goog.string.NULL_RE_, "&#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != str.indexOf("e") && (str = str.replace(goog.string.E_RE_, "&#101;"));
  }
  return str;
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  return goog.string.contains(str, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(str) : goog.string.unescapePureXmlEntities_(str) : str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  return goog.string.contains(str, "&") ? goog.string.unescapeEntitiesUsingDom_(str, document) : str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, div;
  div = opt_document ? opt_document.createElement("div") : goog.global.document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if ("#" == entity.charAt(0)) {
      var n = Number("0" + entity.substr(1));
      isNaN(n) || (value = String.fromCharCode(n));
    }
    value || (div.innerHTML = s + " ", value = div.firstChild.nodeValue.slice(0, -1));
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if ("#" == entity.charAt(0)) {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  for (var length = quoteChars.length, i = 0;i < length;i++) {
    var quoteChar = 1 == length ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  str.length > chars && (str = str.substring(0, chars - 3) + "...");
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  if (opt_trailingChars && str.length > chars) {
    opt_trailingChars > chars && (opt_trailingChars = chars);
    var endPoint = str.length - opt_trailingChars, startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2), endPos = str.length - half, half = half + chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  }
  for (var sb = ['"'], i = 0;i < s.length;i++) {
    var ch = s.charAt(i), cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (31 < cc && 127 > cc ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join("");
};
goog.string.escapeString = function(str) {
  for (var sb = [], i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c, cc = c.charCodeAt(0);
  if (31 < cc && 127 > cc) {
    rv = c;
  } else {
    if (256 > cc) {
      if (rv = "\\x", 16 > cc || 256 < cc) {
        rv += "0";
      }
    } else {
      rv = "\\u", 4096 > cc && (rv += "0");
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return-1 != str.indexOf(subString);
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  0 <= index && index < s.length && 0 < stringLength && (resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength));
  return resultStr;
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(string, length) {
  return Array(length + 1).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num), index = s.indexOf(".");
  -1 == index && (index = s.length);
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return null == obj ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  for (var order = 0, v1Subs = goog.string.trim(String(version1)).split("."), v2Subs = goog.string.trim(String(version2)).split("."), subCount = Math.max(v1Subs.length, v2Subs.length), subIdx = 0;0 == order && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "", v2Sub = v2Subs[subIdx] || "", v1CompParser = RegExp("(\\d*)(\\D*)", "g"), v2CompParser = RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""], v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if (0 == v1Comp[0].length && 0 == v2Comp[0].length) {
        break;
      }
      var v1CompNum = 0 == v1Comp[1].length ? 0 : parseInt(v1Comp[1], 10), v2CompNum = 0 == v2Comp[1].length ? 0 : parseInt(v2Comp[1], 10), order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(0 == v1Comp[2].length, 0 == v2Comp[2].length) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (0 == order);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  for (var result = 0, i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i), result %= goog.string.HASHCODE_MAX_;
  }
  return result;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  return 0 == num && goog.string.isEmpty(str) ? NaN : num;
};
goog.string.isLowerCamelCase = function(str) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return/^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s", delimiters = delimiters ? "|[" + delimiters + "]+" : "", regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.parseInt = function(value) {
  isFinite(value) && (value = String(value));
  return goog.isString(value) ? /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10) : NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  for (var parts = str.split(separator), returnVal = [];0 < limit && parts.length;) {
    returnVal.push(parts.shift()), limit--;
  }
  parts.length && returnVal.push(parts.join(separator));
  return returnVal;
};
// INPUT (javascript/closure/asserts/asserts.js)
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    var message = message + (": " + givenMessage), args = givenArgs
  } else {
    defaultMessage && (message += ": " + defaultMessage, args = defaultArgs);
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = errorHandler);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !condition && goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(value) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(value) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(value) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  !goog.asserts.ENABLE_ASSERTS || goog.isObject(value) && value.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  !goog.asserts.ENABLE_ASSERTS || value instanceof type || goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3));
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
// INPUT (javascript/closure/array/array.js)
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = null == opt_fromIndex ? 0 : 0 > opt_fromIndex ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    return goog.isString(obj) && 1 == obj.length ? arr.indexOf(obj, fromIndex) : -1;
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(null != arr.length);
  var fromIndex = null == opt_fromIndex ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = null == opt_fromIndex ? arr.length - 1 : opt_fromIndex;
  0 > fromIndex && (fromIndex = Math.max(0, arr.length + fromIndex));
  if (goog.isString(arr)) {
    return goog.isString(obj) && 1 == obj.length ? arr.lastIndexOf(obj, fromIndex) : -1;
  }
  for (var i = fromIndex;0 <= i;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;0 <= i;--i) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = [], resLength = 0, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      f.call(opt_obj, val, i, arr) && (res[resLength++] = val);
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = Array(l), arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    i in arr2 && (res[i] = f.call(opt_obj, arr2[i], i, arr));
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(null != arr.length);
  opt_obj && (f = goog.bind(f, opt_obj));
  return goog.array.ARRAY_PROTOTYPE_.reduce.call(arr, f, val);
} : function(arr, f, val$$0, opt_obj) {
  var rval = val$$0;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(null != arr.length);
  opt_obj && (f = goog.bind(f, opt_obj));
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
} : function(arr, f, val$$0, opt_obj) {
  var rval = val$$0;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return!0;
    }
  }
  return!1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return!1;
    }
  }
  return!0;
};
goog.array.count = function(arr$$0, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr$$0, function(element, index, arr) {
    f.call(opt_obj, element, index, arr) && ++count;
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;0 <= i;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.contains = function(arr, obj) {
  return 0 <= goog.array.indexOf(arr, obj);
};
goog.array.isEmpty = function(arr) {
  return 0 == arr.length;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;0 <= i;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  goog.array.contains(arr, obj) || arr.push(obj);
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  2 == arguments.length || 0 > (i = goog.array.indexOf(arr, opt_obj2)) ? arr.push(obj) : goog.array.insertAt(arr, obj, i);
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj), rv;
  (rv = 0 <= i) && goog.array.removeAt(arr, i);
  return rv;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(null != arr.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return 0 <= i ? (goog.array.removeAt(arr, i), !0) : !1;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    f.call(opt_obj, val, index, arr) && goog.array.removeAt(arr, index) && removedCount++;
  });
  return removedCount;
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (0 < length) {
    for (var rv = Array(length), i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i], isArrayLike;
    if (goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && Object.prototype.hasOwnProperty.call(arr2, "callee")) {
      arr1.push.apply(arr1, arr2);
    } else {
      if (isArrayLike) {
        for (var len1 = arr1.length, len2 = arr2.length, j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j];
        }
      } else {
        arr1.push(arr2);
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(null != arr.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start) : goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  for (var returnArray = opt_rv || arr, defaultHashFn = function() {
    return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
  }, hashFn = opt_hashFn || defaultHashFn, seen = {}, cursorInsert = 0, cursorRead = 0;cursorRead < arr.length;) {
    var current = arr[cursorRead++], key = hashFn(current);
    Object.prototype.hasOwnProperty.call(seen, key) || (seen[key] = !0, returnArray[cursorInsert++] = current);
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, !1, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, !0, void 0, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  for (var left = 0, right = arr.length, found;left < right;) {
    var middle = left + right >> 1, compareResult;
    compareResult = isEvaluator ? compareFn.call(opt_selfObj, arr[middle], middle, arr) : compareFn(opt_target, arr[middle]);
    0 < compareResult ? left = middle + 1 : (right = middle, found = !compareResult);
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  for (var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, stableCompareFn);
  for (i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value;
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key]);
  });
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  for (var compare = opt_compareFn || goog.array.defaultCompare, i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (0 < compareResult || 0 == compareResult && opt_strict) {
      return!1;
    }
  }
  return!0;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return!1;
  }
  for (var l = arr1.length, equalsFn = opt_equalsFn || goog.array.defaultCompareEquality, i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return!1;
    }
  }
  return!0;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  for (var compare = opt_compareFn || goog.array.defaultCompare, l = Math.min(arr1.length, arr2.length), i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (0 != result) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return 0 > index ? (goog.array.insertAt(array, value, -(index + 1)), !0) : !1;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return 0 <= index ? goog.array.removeAt(array, index) : !1;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  for (var buckets = {}, i = 0;i < array.length;i++) {
    var value = array[i], key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [], start = 0, end = startOrEnd, step = opt_step || 1;
  void 0 !== opt_end && (start = startOrEnd, end = opt_end);
  if (0 > step * (end - start)) {
    return[];
  }
  if (0 < step) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  for (var array = [], i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  for (var result = [], i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    goog.isArray(element) ? result.push.apply(result, goog.array.flatten.apply(null, element)) : result.push(element);
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(null != array.length);
  array.length && (n %= array.length, 0 < n ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n)) : 0 > n && goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n)));
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(0 <= fromIndex && fromIndex < arr.length);
  goog.asserts.assert(0 <= toIndex && toIndex < arr.length);
  var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return[];
  }
  for (var result = [], i = 0;;i++) {
    for (var value = [], j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if (i >= arr.length) {
        return result;
      }
      value.push(arr[i]);
    }
    result.push(value);
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  for (var randFn = opt_randFn || Math.random, i = arr.length - 1;0 < i;i--) {
    var j = Math.floor(randFn() * (i + 1)), tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
// INPUT (javascript/closure/debug/relativetimeprovider.js)
goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now();
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(timeStamp) {
  this.relativeTimeStart_ = timeStamp;
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now());
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_;
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_;
};
// INPUT (javascript/closure/debug/formatter.js)
goog.debug.Formatter = function(opt_prefix) {
  this.prefix_ = opt_prefix || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance();
};
goog.debug.Formatter.prototype.appendNewline = !0;
goog.debug.Formatter.prototype.showAbsoluteTime = !0;
goog.debug.Formatter.prototype.showRelativeTime = !0;
goog.debug.Formatter.prototype.showLoggerName = !0;
goog.debug.Formatter.prototype.showExceptionText = !1;
goog.debug.Formatter.prototype.showSeverityLevel = !1;
goog.debug.Formatter.getDateTimeStamp_ = function(logRecord) {
  var time = new Date(logRecord.getMillis());
  return goog.debug.Formatter.getTwoDigitString_(time.getFullYear() - 2E3) + goog.debug.Formatter.getTwoDigitString_(time.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(time.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(time.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(time.getMilliseconds() / 10));
};
goog.debug.Formatter.getTwoDigitString_ = function(n) {
  return 10 > n ? "0" + n : String(n);
};
goog.debug.Formatter.getRelativeTime_ = function(logRecord, relativeTimeStart) {
  var ms = logRecord.getMillis() - relativeTimeStart, sec = ms / 1E3, str = sec.toFixed(3), spacesToPrepend = 0;
  if (1 > sec) {
    spacesToPrepend = 2;
  } else {
    for (;100 > sec;) {
      spacesToPrepend++, sec *= 10;
    }
  }
  for (;0 < spacesToPrepend--;) {
    str = " " + str;
  }
  return str;
};
goog.debug.HtmlFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = !0;
goog.debug.HtmlFormatter.prototype.formatRecord = function(logRecord) {
  var className;
  switch(logRecord.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      className = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      className = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      className = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      className = "dbg-i";
      break;
    default:
      className = "dbg-f";
  }
  var sb = [];
  sb.push(this.prefix_, " ");
  this.showAbsoluteTime && sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  this.showRelativeTime && sb.push("[", goog.string.whitespaceEscape(goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get())), "s] ");
  this.showLoggerName && sb.push("[", goog.string.htmlEscape(logRecord.getLoggerName()), "] ");
  this.showSeverityLevel && sb.push("[", goog.string.htmlEscape(logRecord.getLevel().name), "] ");
  sb.push('<span class="', className, '">', goog.string.newLineToBr(goog.string.whitespaceEscape(goog.string.htmlEscape(logRecord.getMessage()))));
  this.showExceptionText && logRecord.getException() && sb.push("<br>", goog.string.newLineToBr(goog.string.whitespaceEscape(logRecord.getExceptionText() || "")));
  sb.push("</span>");
  this.appendNewline && sb.push("<br>");
  return sb.join("");
};
goog.debug.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(logRecord) {
  var sb = [];
  sb.push(this.prefix_, " ");
  this.showAbsoluteTime && sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  this.showRelativeTime && sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  this.showLoggerName && sb.push("[", logRecord.getLoggerName(), "] ");
  this.showSeverityLevel && sb.push("[", logRecord.getLevel().name, "] ");
  sb.push(logRecord.getMessage());
  this.showExceptionText && logRecord.getException() && sb.push("\n", logRecord.getExceptionText());
  this.appendNewline && sb.push("\n");
  return sb.join("");
};
// INPUT (javascript/closure/structs/collection.js)
goog.structs = {};
goog.structs.Collection = function() {
};
// INPUT (javascript/closure/functions/functions.js)
goog.functions = {};
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue) {
  return opt_returnValue;
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  };
};
goog.functions.fail = function(err) {
  return function() {
    throw err;
  };
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
  };
};
goog.functions.nth = function(n) {
  return function() {
    return arguments[n];
  };
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.compose = function(fn, var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    var result;
    length && (result = functions[length - 1].apply(this, arguments));
    for (var i = length - 2;0 <= i;i--) {
      result = functions[i].call(this, result);
    }
    return result;
  };
};
goog.functions.sequence = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var result, i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
  };
};
goog.functions.and = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (!functions[i].apply(this, arguments)) {
        return!1;
      }
    }
    return!0;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (functions[i].apply(this, arguments)) {
        return!0;
      }
    }
    return!1;
  };
};
goog.functions.not = function(f) {
  return function() {
    return!f.apply(this, arguments);
  };
};
goog.functions.create = function(constructor, var_args) {
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp;
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(fn) {
  var called = !1, value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    called || (value = fn(), called = !0);
    return value;
  };
};
// INPUT (javascript/closure/math/math.js)
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return 0 > r * b ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1E-6);
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
};
goog.math.standardAngleInRadians = function(angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
  return 180 * angleRadians / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  180 < d ? d -= 360 : -180 >= d && (d = 360 + d);
  return d;
};
goog.math.sign = function(x) {
  return 0 == x ? 0 : 0 > x ? -1 : 1;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  for (var compare = opt_compareFn || function(a, b) {
    return a == b;
  }, collect = opt_collectorFn || function(i1) {
    return array1[i1];
  }, length1 = array1.length, length2 = array2.length, arr = [], i = 0;i < length1 + 1;i++) {
    arr[i] = [], arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      compare(array1[i - 1], array2[j - 1]) ? arr[i][j] = arr[i - 1][j - 1] + 1 : arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
    }
  }
  for (var result = [], i = length1, j = length2;0 < i && 0 < j;) {
    compare(array1[i - 1], array2[j - 1]) ? (result.unshift(collect(i - 1, j - 1)), i--, j--) : arr[i - 1][j] > arr[i][j - 1] ? i-- : j--;
  }
  return result;
};
goog.math.sum = function(var_args) {
  return goog.array.reduce(arguments, function(sum, value) {
    return sum + value;
  }, 0);
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
  var sampleSize = arguments.length;
  if (2 > sampleSize) {
    return 0;
  }
  var mean = goog.math.average.apply(null, arguments), variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
  return variance;
};
goog.math.standardDeviation = function(var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
  return isFinite(num) && 0 == num % 1;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.log10Floor = function(num) {
  if (0 < num) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat("1e" + x) > num);
  }
  return 0 == num ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || 0 < opt_epsilon);
  return Math.floor(num + (opt_epsilon || 2E-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || 0 < opt_epsilon);
  return Math.ceil(num - (opt_epsilon || 2E-15));
};
// INPUT (javascript/closure/iter/iter.js)
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this;
};
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if ("function" == typeof iterable.__iterator__) {
    return iterable.__iterator__(!1);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0, newIter = new goog.iter.Iterator;
    newIter.next = function() {
      for (;;) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if (i in iterable) {
          return iterable[i++];
        }
        i++;
      }
    };
    return newIter;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach(iterable, f, opt_obj);
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable);
    try {
      for (;;) {
        f.call(opt_obj, iterable.next(), void 0, iterable);
      }
    } catch (ex$$0) {
      if (ex$$0 !== goog.iter.StopIteration) {
        throw ex$$0;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
  newIter.next = function() {
    for (;;) {
      var val = iterator.next();
      if (f.call(opt_obj, val, void 0, iterator)) {
        return val;
      }
    }
  };
  return newIter;
};
goog.iter.filterFalse = function(iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj);
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0, stop = startOrStop, step = opt_step || 1;
  1 < arguments.length && (start = startOrStop, stop = opt_stop);
  if (0 == step) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (0 < step && start >= stop || 0 > step && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
  };
  return newIter;
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
};
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, void 0, iterator);
  };
  return newIter;
};
goog.iter.reduce = function(iterable, f, val$$0, opt_obj) {
  var rval = val$$0;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    for (;;) {
      if (f.call(opt_obj, iterable.next(), void 0, iterable)) {
        return!0;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return!1;
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    for (;;) {
      if (!f.call(opt_obj, iterable.next(), void 0, iterable)) {
        return!1;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return!0;
};
goog.iter.chain = function(var_args) {
  var iterator = goog.iter.toIterator(arguments), iter = new goog.iter.Iterator, current = null;
  iter.next = function() {
    for (;;) {
      if (null == current) {
        var it = iterator.next();
        current = goog.iter.toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
  };
  return iter;
};
goog.iter.chainFromIterable = function(iterable) {
  return goog.iter.chain.apply(void 0, iterable);
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, dropping = !0;
  newIter.next = function() {
    for (;;) {
      var val = iterator.next();
      if (!dropping || !f.call(opt_obj, val, void 0, iterator)) {
        return dropping = !1, val;
      }
    }
  };
  return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, taking = !0;
  newIter.next = function() {
    for (;;) {
      if (taking) {
        var val = iterator.next();
        if (f.call(opt_obj, val, void 0, iterator)) {
          return val;
        }
        taking = !1;
      } else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return newIter;
};
goog.iter.toArray = function(iterable) {
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray(iterable);
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val);
  });
  return array;
};
goog.iter.equals = function(iterable1, iterable2) {
  var fillValue = {}, pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2);
  return goog.iter.every(pairs, function(pair) {
    return pair[0] == pair[1];
  });
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next();
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue;
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return!arr.length;
  });
  if (someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var iter = new goog.iter.Iterator, arrays = arguments, indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if (indicies) {
      for (var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      }), i = indicies.length - 1;0 <= i;i--) {
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }
        if (0 == i) {
          indicies = null;
          break;
        }
        indicies[i] = 0;
      }
      return retVal;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable), cache = [], cacheIndex = 0, iter = new goog.iter.Iterator, useCache = !1;
  iter.next = function() {
    var returnElement = null;
    if (!useCache) {
      try {
        return returnElement = baseIterator.next(), cache.push(returnElement), returnElement;
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = !0;
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement;
  };
  return iter;
};
goog.iter.count = function(opt_start, opt_step) {
  var counter = opt_start || 0, step = goog.isDef(opt_step) ? opt_step : 1, iter = new goog.iter.Iterator;
  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
  };
  return iter;
};
goog.iter.repeat = function(value) {
  var iter = new goog.iter.Iterator;
  iter.next = goog.functions.constant(value);
  return iter;
};
goog.iter.accumulate = function(iterable) {
  var iterator = goog.iter.toIterator(iterable), total = 0, iter = new goog.iter.Iterator;
  iter.next = function() {
    return total += iterator.next();
  };
  return iter;
};
goog.iter.zip = function(var_args) {
  var args = arguments, iter = new goog.iter.Iterator;
  if (0 < args.length) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var arr = goog.array.map(iterators, function(it) {
        return it.next();
      });
      return arr;
    };
  }
  return iter;
};
goog.iter.zipLongest = function(fillValue, var_args) {
  var args = goog.array.slice(arguments, 1), iter = new goog.iter.Iterator;
  if (0 < args.length) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var iteratorsHaveValues = !1, arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next(), iteratorsHaveValues = !0;
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });
      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration;
      }
      return arr;
    };
  }
  return iter;
};
goog.iter.compress = function(iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors);
  return goog.iter.filter(iterable, function() {
    return!!selectorIterator.next();
  });
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
  this.iterator = goog.iter.toIterator(iterable);
  this.keyFunc = opt_keyFunc || goog.functions.identity;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  for (;this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return[this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
  for (var arr = [];this.currentKey == targetKey;) {
    arr.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return arr;
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
};
goog.iter.starMap = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator;
  iter.next = function() {
    var args = goog.iter.toArray(iterator.next());
    return f.apply(opt_obj, goog.array.concat(args, void 0, iterator));
  };
  return iter;
};
goog.iter.tee = function(iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable), num = goog.isNumber(opt_num) ? opt_num : 2, buffers = goog.array.map(goog.array.range(num), function() {
    return[];
  }), addNextIteratorValueToBuffers = function() {
    var val = iterator.next();
    goog.array.forEach(buffers, function(buffer) {
      buffer.push(val);
    });
  }, createIterator = function(buffer) {
    var iter = new goog.iter.Iterator;
    iter.next = function() {
      goog.array.isEmpty(buffer) && addNextIteratorValueToBuffers();
      goog.asserts.assert(!goog.array.isEmpty(buffer));
      return buffer.shift();
    };
    return iter;
  };
  return goog.array.map(buffers, createIterator);
};
goog.iter.enumerate = function(iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable);
};
goog.iter.limit = function(iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && 0 <= limitSize);
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator, remaining = limitSize;
  iter.next = function() {
    if (0 < remaining--) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && 0 <= count);
  for (var iterator = goog.iter.toIterator(iterable);0 < count--;) {
    goog.iter.nextOrValue(iterator, null);
  }
  return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && 0 <= start);
  var iterator = goog.iter.consume(iterable, start);
  goog.isNumber(opt_end) && (goog.asserts.assert(goog.math.isInt(opt_end) && opt_end >= start), iterator = goog.iter.limit(iterator, opt_end - start));
  return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable), length = goog.isNumber(opt_length) ? opt_length : elements.length, sets = goog.array.repeat(elements, length), product = goog.iter.product.apply(void 0, sets);
  return goog.iter.filter(product, function(arr) {
    return!goog.iter.hasDuplicates_(arr);
  });
};
goog.iter.combinations = function(iterable, length) {
  function getIndexFromElements(index) {
    return elements[index];
  }
  var elements = goog.iter.toArray(iterable), indexes = goog.iter.range(elements.length), indexIterator = goog.iter.permutations(indexes, length), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  }), iter = new goog.iter.Iterator;
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
  function getIndexFromElements(index) {
    return elements[index];
  }
  var elements = goog.iter.toArray(iterable), indexes = goog.array.range(elements.length), sets = goog.array.repeat(indexes, length), indexIterator = goog.iter.product.apply(void 0, sets), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  }), iter = new goog.iter.Iterator;
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
// INPUT (javascript/closure/object/object.js)
goog.object = {};
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    f.call(opt_obj, obj[key], key, obj) && (res[key] = obj[key]);
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return!0;
    }
  }
  return!1;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return!1;
    }
  }
  return!0;
};
goog.object.getCount = function(obj) {
  var rv = 0, key;
  for (key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  for (var isArrayLike = goog.isArrayLike(var_args), keys = isArrayLike ? var_args : arguments, i = isArrayLike ? 0 : 1;i < keys.length && (obj = obj[keys[i]], goog.isDef(obj));i++) {
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return!0;
    }
  }
  return!1;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return!1;
  }
  return!0;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  (rv = key in obj) && delete obj[key];
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  return key in obj ? obj[key] : opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.equals = function(a, b) {
  if (!goog.array.equals(goog.object.getKeys(a), goog.object.getKeys(b))) {
    return!1;
  }
  for (var k in a) {
    if (a[k] !== b[k]) {
      return!1;
    }
  }
  return!0;
};
goog.object.clone = function(obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {}, key;
  for (key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(target, var_args) {
  for (var key, source, i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var rv = {}, i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var rv = {}, i = 0;i < argLength;i++) {
    rv[arguments[i]] = !0;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  Object.isFrozen && !Object.isFrozen(obj) && (result = Object.create(obj), Object.freeze(result));
  return result;
};
goog.object.isImmutableView = function(obj) {
  return!!Object.isFrozen && Object.isFrozen(obj);
};
// INPUT (javascript/closure/structs/map.js)
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var argLength = arguments.length;
  if (1 < argLength) {
    if (argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else {
    opt_map && this.addAll(opt_map);
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var rv = [], i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key]);
  }
  return rv;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key);
};
goog.structs.Map.prototype.containsValue = function(val) {
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return!0;
    }
  }
  return!1;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return!0;
  }
  if (this.count_ != otherMap.getCount()) {
    return!1;
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var key, i = 0;key = this.keys_[i];i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return!1;
    }
  }
  return!0;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key) ? (delete this.map_[key], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var srcIndex = 0, destIndex = 0;srcIndex < this.keys_.length;) {
      var key = this.keys_[srcIndex];
      goog.structs.Map.hasKey_(this.map_, key) && (this.keys_[destIndex++] = key);
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
  if (this.count_ != this.keys_.length) {
    for (var seen = {}, destIndex = srcIndex = 0;srcIndex < this.keys_.length;) {
      key = this.keys_[srcIndex], goog.structs.Map.hasKey_(seen, key) || (this.keys_[destIndex++] = key, seen[key] = 1), srcIndex++;
    }
    this.keys_.length = destIndex;
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  return goog.structs.Map.hasKey_(this.map_, key) ? this.map_[key] : opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
  goog.structs.Map.hasKey_(this.map_, key) || (this.count_++, this.keys_.push(key), this.version_++);
  this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  map instanceof goog.structs.Map ? (keys = map.getKeys(), values = map.getValues()) : (keys = goog.object.getKeys(map), values = goog.object.getValues(map));
  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
  for (var keys = this.getKeys(), i = 0;i < keys.length;i++) {
    var key = keys[i], value = this.get(key);
    f.call(opt_obj, value, key, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  for (var transposed = new goog.structs.Map, i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i], value = this.map_[key];
    transposed.set(value, key);
  }
  return transposed;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var obj = {}, i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key];
  }
  return obj;
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0);
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0, keys = this.keys_, map = this.map_, version = this.version_, selfObj = this, newIter = new goog.iter.Iterator;
  newIter.next = function() {
    for (;;) {
      if (version != selfObj.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if (i >= keys.length) {
        throw goog.iter.StopIteration;
      }
      var key = keys[i++];
      return opt_keys ? key : map[key];
    }
  };
  return newIter;
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
// INPUT (javascript/closure/structs/structs.js)
goog.structs.getCount = function(col) {
  return "function" == typeof col.getCount ? col.getCount() : goog.isArrayLike(col) || goog.isString(col) ? col.length : goog.object.getCount(col);
};
goog.structs.getValues = function(col) {
  if ("function" == typeof col.getValues) {
    return col.getValues();
  }
  if (goog.isString(col)) {
    return col.split("");
  }
  if (goog.isArrayLike(col)) {
    for (var rv = [], l = col.length, i = 0;i < l;i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog.object.getValues(col);
};
goog.structs.getKeys = function(col) {
  if ("function" == typeof col.getKeys) {
    return col.getKeys();
  }
  if ("function" != typeof col.getValues) {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      for (var rv = [], l = col.length, i = 0;i < l;i++) {
        rv.push(i);
      }
      return rv;
    }
    return goog.object.getKeys(col);
  }
};
goog.structs.contains = function(col, val) {
  return "function" == typeof col.contains ? col.contains(val) : "function" == typeof col.containsValue ? col.containsValue(val) : goog.isArrayLike(col) || goog.isString(col) ? goog.array.contains(col, val) : goog.object.containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
  return "function" == typeof col.isEmpty ? col.isEmpty() : goog.isArrayLike(col) || goog.isString(col) ? goog.array.isEmpty(col) : goog.object.isEmpty(col);
};
goog.structs.clear = function(col) {
  "function" == typeof col.clear ? col.clear() : goog.isArrayLike(col) ? goog.array.clear(col) : goog.object.clear(col);
};
goog.structs.forEach = function(col, f, opt_obj) {
  if ("function" == typeof col.forEach) {
    col.forEach(f, opt_obj);
  } else {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach(col, f, opt_obj);
    } else {
      for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
        f.call(opt_obj, values[i], keys && keys[i], col);
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if ("function" == typeof col.filter) {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj);
  }
  var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      f.call(opt_obj, values[i], keys[i], col) && (rv[keys[i]] = values[i]);
    }
  } else {
    for (rv = [], i = 0;i < l;i++) {
      f.call(opt_obj, values[i], void 0, col) && rv.push(values[i]);
    }
  }
  return rv;
};
goog.structs.map = function(col, f, opt_obj) {
  if ("function" == typeof col.map) {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj);
  }
  var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col);
    }
  } else {
    for (rv = [], i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], void 0, col);
    }
  }
  return rv;
};
goog.structs.some = function(col, f, opt_obj) {
  if ("function" == typeof col.some) {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return!0;
    }
  }
  return!1;
};
goog.structs.every = function(col, f, opt_obj) {
  if ("function" == typeof col.every) {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return!1;
    }
  }
  return!0;
};
// INPUT (javascript/closure/structs/set.js)
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  opt_values && this.addAll(opt_values);
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  return "object" == type && val || "function" == type ? "o" + goog.getUid(val) : type.substr(0, 1) + val;
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element);
};
goog.structs.Set.prototype.addAll = function(col) {
  for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    this.add(values[i]);
  }
};
goog.structs.Set.prototype.removeAll = function(col) {
  for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    this.remove(values[i]);
  }
};
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.containsAll = function(col) {
  return goog.structs.every(col, this.contains, this);
};
goog.structs.Set.prototype.intersection = function(col) {
  for (var result = new goog.structs.Set, values = goog.structs.getValues(col), i = 0;i < values.length;i++) {
    var value = values[i];
    this.contains(value) && result.add(value);
  }
  return result;
};
goog.structs.Set.prototype.difference = function(col) {
  var result = this.clone();
  result.removeAll(col);
  return result;
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col);
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if (this.getCount() > colCount) {
    return!1;
  }
  !(col instanceof goog.structs.Set) && 5 < colCount && (col = new goog.structs.Set(col));
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value);
  });
};
goog.structs.Set.prototype.__iterator__ = function() {
  return this.map_.__iterator__(!1);
};
// INPUT (javascript/closure/labs/useragent/util.js)
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(userAgent, str);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(userAgent, str);
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  for (var versionRegExp = RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), data = [], match;match = versionRegExp.exec(userAgent);) {
    data.push([match[1], match[2], match[3] || void 0]);
  }
  return data;
};
// INPUT (javascript/closure/labs/useragent/browser.js)
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS");
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return!goog.labs.userAgent.browser.isChrome() && goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  function lookUpValueWithKeys(keys) {
    var key = goog.array.find(keys, versionMapHasKey);
    return versionMap[key] || "";
  }
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString), versionMap = {};
  goog.array.forEach(versionTuples, function(tuple) {
    var key = tuple[0], value = tuple[1];
    versionMap[key] = value;
  });
  var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap);
  if (goog.labs.userAgent.browser.isOpera()) {
    return lookUpValueWithKeys(["Version", "Opera", "OPR"]);
  }
  if (goog.labs.userAgent.browser.isChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS"]);
  }
  var tuple = versionTuples[2];
  return tuple && tuple[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version);
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "", msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if ("7.0" == msie[1]) {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};
// INPUT (javascript/closure/labs/useragent/engine.js)
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit");
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident();
};
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString), engineTuple = tuples[1];
    if (engineTuple) {
      return "Gecko" == engineTuple[0] ? goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox") : engineTuple[1];
    }
    var browserTuple = tuples[0], info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version);
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair$$0 = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair$$0 && pair$$0[1] || "";
};
// INPUT (javascript/closure/useragent/useragent.js)
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
  var ua = goog.userAgent.getUserAgentString();
  goog.userAgent.detectedAndroid_ = !!ua && goog.string.contains(ua, "Android");
  goog.userAgent.detectedIPhone_ = !!ua && goog.string.contains(ua, "iPhone");
  goog.userAgent.detectedIPad_ = !!ua && goog.string.contains(ua, "iPad");
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if (goog.userAgent.OPERA && goog.global.opera) {
    var operaVersion = goog.global.opera.version;
    return goog.isFunction(operaVersion) ? operaVersion() : operaVersion;
  }
  goog.userAgent.GECKO ? re = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (re = /WebKit\/(\S+)/);
  if (re) {
    var arr = re.exec(goog.userAgent.getUserAgentString()), version = arr ? arr[1] : ""
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global.document;
  return doc ? doc.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, version));
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var doc = goog.global.document;
  if (doc && goog.userAgent.IE) {
    var mode = goog.userAgent.getDocumentMode_();
    return mode || ("CSS1Compat" == doc.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5);
  }
}();
// INPUT (javascript/closure/debug/debug.js)
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global, oldErrorHandler = target.onerror, retVal = !!opt_cancel;
  goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3") && (retVal = !retVal);
  target.onerror = function(message, url, line, opt_col, opt_error) {
    oldErrorHandler && oldErrorHandler(message, url, line, opt_col, opt_error);
    logFunc({message:message, fileName:url, line:line, col:opt_col, error:opt_error});
    return retVal;
  };
};
goog.debug.expose = function(obj, opt_showFn) {
  if ("undefined" == typeof obj) {
    return "undefined";
  }
  if (null == obj) {
    return "NULL";
  }
  var str = [], x;
  for (x in obj) {
    if (opt_showFn || !goog.isFunction(obj[x])) {
      var s = x + " = ";
      try {
        s += obj[x];
      } catch (e) {
        s += "*** " + e + " ***";
      }
      str.push(s);
    }
  }
  return str.join("\n");
};
goog.debug.deepExpose = function(obj$$0, opt_showFn) {
  var str$$0 = [], helper = function(obj, space, parentSeen) {
    var nestspace = space + "  ", seen = new goog.structs.Set(parentSeen), indentMultiline = function(str) {
      return str.replace(/\n/g, "\n" + space);
    };
    try {
      if (goog.isDef(obj)) {
        if (goog.isNull(obj)) {
          str$$0.push("NULL");
        } else {
          if (goog.isString(obj)) {
            str$$0.push('"' + indentMultiline(obj) + '"');
          } else {
            if (goog.isFunction(obj)) {
              str$$0.push(indentMultiline(String(obj)));
            } else {
              if (goog.isObject(obj)) {
                if (seen.contains(obj)) {
                  str$$0.push("*** reference loop detected ***");
                } else {
                  seen.add(obj);
                  str$$0.push("{");
                  for (var x in obj) {
                    if (opt_showFn || !goog.isFunction(obj[x])) {
                      str$$0.push("\n"), str$$0.push(nestspace), str$$0.push(x + " = "), helper(obj[x], nestspace, seen);
                    }
                  }
                  str$$0.push("\n" + space + "}");
                }
              } else {
                str$$0.push(obj);
              }
            }
          }
        }
      } else {
        str$$0.push("undefined");
      }
    } catch (e) {
      str$$0.push("*** " + e + " ***");
    }
  };
  helper(obj$$0, "", new goog.structs.Set);
  return str$$0.join("");
};
goog.debug.exposeArray = function(arr) {
  for (var str = [], i = 0;i < arr.length;i++) {
    goog.isArray(arr[i]) ? str.push(goog.debug.exposeArray(arr[i])) : str.push(arr[i]);
  }
  return "[ " + str.join(", ") + " ]";
};
goog.debug.exposeException = function(err, opt_fn) {
  try {
    var e = goog.debug.normalizeErrorObject(err), error = "Message: " + goog.string.htmlEscape(e.message) + '\nUrl: <a href="view-source:' + e.fileName + '" target="_new">' + e.fileName + "</a>\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(e.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(opt_fn) + "-> ");
    return error;
  } catch (e2) {
    return "Exception trying to expose exception! You win, we lose. " + e2;
  }
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  if (goog.isString(err)) {
    return{message:err, name:"Unknown error", lineNumber:"Not available", fileName:href, stack:"Not available"};
  }
  var lineNumber, fileName, threwError = !1;
  try {
    lineNumber = err.lineNumber || err.line || "Not available";
  } catch (e) {
    lineNumber = "Not available", threwError = !0;
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || goog.global.$googDebugFname || href;
  } catch (e$$0) {
    fileName = "Not available", threwError = !0;
  }
  return!threwError && err.lineNumber && err.fileName && err.stack && err.message && err.name ? err : {message:err.message || "Not available", name:err.name || "UnknownError", lineNumber:lineNumber, fileName:fileName, stack:err.stack || "Not available"};
};
goog.debug.enhanceError = function(err, opt_message) {
  var error;
  "string" == typeof err ? (error = Error(err), Error.captureStackTrace && Error.captureStackTrace(error, goog.debug.enhanceError)) : error = err;
  error.stack || (error.stack = goog.debug.getStacktrace(goog.debug.enhanceError));
  if (opt_message) {
    for (var x = 0;error["message" + x];) {
      ++x;
    }
    error["message" + x] = String(opt_message);
  }
  return error;
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  if (goog.STRICT_MODE_COMPATIBLE) {
    var stack = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (stack) {
      return stack;
    }
  }
  for (var sb = [], fn = arguments.callee.caller, depth = 0;fn && (!opt_depth || depth < opt_depth);) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller;
    } catch (e) {
      sb.push("[exception trying to get caller]\n");
      break;
    }
    depth++;
    if (depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break;
    }
  }
  opt_depth && depth >= opt_depth ? sb.push("[...reached max depth limit...]") : sb.push("[end]");
  return sb.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(fn) {
  var tempErr = Error();
  if (Error.captureStackTrace) {
    return Error.captureStackTrace(tempErr, fn), String(tempErr.stack);
  }
  try {
    throw tempErr;
  } catch (e) {
    tempErr = e;
  }
  var stack = tempErr.stack;
  return stack ? String(stack) : null;
};
goog.debug.getStacktrace = function(opt_fn) {
  var stack;
  if (goog.STRICT_MODE_COMPATIBLE) {
    var contextFn = opt_fn || goog.debug.getStacktrace;
    stack = goog.debug.getNativeStackTrace_(contextFn);
  }
  stack || (stack = goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, []));
  return stack;
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if (goog.array.contains(visited, fn)) {
    sb.push("[...circular reference...]");
  } else {
    if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + "(");
      for (var args = fn.arguments, i = 0;args && i < args.length;i++) {
        0 < i && sb.push(", ");
        var argDesc, arg = args[i];
        switch(typeof arg) {
          case "object":
            argDesc = arg ? "object" : "null";
            break;
          case "string":
            argDesc = arg;
            break;
          case "number":
            argDesc = String(arg);
            break;
          case "boolean":
            argDesc = arg ? "true" : "false";
            break;
          case "function":
            argDesc = (argDesc = goog.debug.getFunctionName(arg)) ? argDesc : "[fn]";
            break;
          default:
            argDesc = typeof arg;
        }
        40 < argDesc.length && (argDesc = argDesc.substr(0, 40) + "...");
        sb.push(argDesc);
      }
      visited.push(fn);
      sb.push(")\n");
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited));
      } catch (e) {
        sb.push("[exception trying to get caller]\n");
      }
    } else {
      fn ? sb.push("[...long stack...]") : sb.push("[end]");
    }
  }
  return sb.join("");
};
goog.debug.setFunctionResolver = function(resolver) {
  goog.debug.fnNameResolver_ = resolver;
};
goog.debug.getFunctionName = function(fn) {
  if (goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn];
  }
  if (goog.debug.fnNameResolver_) {
    var name = goog.debug.fnNameResolver_(fn);
    if (name) {
      return goog.debug.fnNameCache_[fn] = name;
    }
  }
  var functionSource = String(fn);
  if (!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource);
    if (matches) {
      var method = matches[1];
      goog.debug.fnNameCache_[functionSource] = method;
    } else {
      goog.debug.fnNameCache_[functionSource] = "[Anonymous]";
    }
  }
  return goog.debug.fnNameCache_[functionSource];
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.fnNameCache_ = {};
// INPUT (javascript/closure/debug/logrecord.js)
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
};
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && ("number" == typeof opt_sequenceNumber || goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
  delete this.exceptionText_;
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_;
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
};
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception;
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_;
};
goog.debug.LogRecord.prototype.setExceptionText = function(text) {
  this.exceptionText_ = text;
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level;
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
};
// INPUT (javascript/closure/debug/logbuffer.js)
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_;
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if (this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret;
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY;
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1;
};
// INPUT (javascript/closure/debug/logger.js)
goog.debug.Logger = function(name) {
  this.name_ = name;
  this.handlers_ = this.children_ = this.level_ = this.parent_ = null;
};
goog.debug.Logger.ROOT_LOGGER_NAME = "";
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(name, value) {
  this.name = name;
  this.value = value;
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for (var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level, goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level;
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value];
  }
  for (var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
};
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name);
};
goog.debug.Logger.logToProfilers = function(msg) {
  goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(msg) : goog.global.console.markTimeline && goog.global.console.markTimeline(msg));
  goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(msg);
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};
goog.debug.Logger.prototype.addHandler = function(handler) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(handler)) : (goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootHandlers_.push(handler)));
};
goog.debug.Logger.prototype.removeHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return!!handlers && goog.array.remove(handlers, handler);
  }
  return!1;
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
  this.children_ || (this.children_ = {});
  return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(level) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? this.level_ = level : (goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootLevel_ = level));
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF;
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail("Root logger has no level set.");
  return null;
};
goog.debug.Logger.prototype.isLoggable = function(level) {
  return goog.debug.LOGGING_ENABLED && level.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(level) && (goog.isFunction(msg) && (msg = msg()), this.doLogRecord_(this.getLogRecord(level, msg, opt_exception, goog.debug.Logger.prototype.log)));
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception, opt_fnStackContext) {
  var logRecord = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_) : new goog.debug.LogRecord(level, String(msg), this.name_);
  opt_exception && (logRecord.setException(opt_exception), logRecord.setExceptionText(goog.debug.exposeException(opt_exception, opt_fnStackContext || goog.debug.Logger.prototype.getLogRecord)));
  return logRecord;
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
};
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception);
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
};
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception);
};
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINE, msg, opt_exception);
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  goog.debug.Logger.logToProfilers("log:" + logRecord.getMessage());
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    for (var target = this;target;) {
      target.callPublish_(logRecord), target = target.getParent();
    }
  } else {
    for (var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if (this.handlers_) {
    for (var i = 0, handler;handler = this.handlers_[i];i++) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent;
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  goog.debug.LogManager.rootLogger_ || (goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(goog.debug.Logger.ROOT_LOGGER_NAME), goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] = goog.debug.LogManager.rootLogger_, goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG));
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_;
};
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  var ret = goog.debug.LogManager.loggers_[name];
  return ret || goog.debug.LogManager.createLogger_(name);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot();
    logger.severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")");
  };
};
goog.debug.LogManager.createLogger_ = function(name) {
  var logger = new goog.debug.Logger(name);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf("."), parentName = name.substr(0, lastDotIndex), leafName = name.substr(lastDotIndex + 1), parentLogger = goog.debug.LogManager.getLogger(parentName);
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger);
  }
  return goog.debug.LogManager.loggers_[name] = logger;
};
// INPUT (javascript/closure/debug/console.js)
goog.debug.Console = function() {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
  this.formatter_ = new goog.debug.TextFormatter;
  this.formatter_.showAbsoluteTime = !1;
  this.formatter_.showExceptionText = !1;
  this.isCapturing_ = this.formatter_.appendNewline = !1;
  this.logBuffer_ = "";
  this.filteredLoggers_ = {};
};
goog.debug.Console.prototype.getFormatter = function() {
  return this.formatter_;
};
goog.debug.Console.prototype.setCapturing = function(capturing) {
  if (capturing != this.isCapturing_) {
    var rootLogger = goog.debug.LogManager.getRoot();
    capturing ? rootLogger.addHandler(this.publishHandler_) : rootLogger.removeHandler(this.publishHandler_);
    this.isCapturing_ = capturing;
  }
};
goog.debug.Console.prototype.addLogRecord = function(logRecord) {
  if (!this.filteredLoggers_[logRecord.getLoggerName()]) {
    var record = this.formatter_.formatRecord(logRecord), console = goog.debug.Console.console_;
    if (console) {
      switch(logRecord.getLevel()) {
        case goog.debug.Logger.Level.SHOUT:
          goog.debug.Console.logToConsole_(console, "info", record);
          break;
        case goog.debug.Logger.Level.SEVERE:
          goog.debug.Console.logToConsole_(console, "error", record);
          break;
        case goog.debug.Logger.Level.WARNING:
          goog.debug.Console.logToConsole_(console, "warn", record);
          break;
        default:
          goog.debug.Console.logToConsole_(console, "debug", record);
      }
    } else {
      this.logBuffer_ += record;
    }
  }
};
goog.debug.Console.instance = null;
goog.debug.Console.console_ = goog.global.console;
goog.debug.Console.setConsole = function(console) {
  goog.debug.Console.console_ = console;
};
goog.debug.Console.autoInstall = function() {
  goog.debug.Console.instance || (goog.debug.Console.instance = new goog.debug.Console);
  goog.global.location && -1 != goog.global.location.href.indexOf("Debug=true") && goog.debug.Console.instance.setCapturing(!0);
};
goog.debug.Console.show = function() {
  alert(goog.debug.Console.instance.logBuffer_);
};
goog.debug.Console.logToConsole_ = function(console, fnName, record) {
  if (console[fnName]) {
    console[fnName](record);
  } else {
    console.log(record);
  }
};
// INPUT (javascript/closure/math/coordinate.js)
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0;
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return "(" + this.x + ", " + this.y + ")";
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1;
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x, dy = a.y - b.y;
  return dx * dx + dy * dy;
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
goog.math.Coordinate.prototype.translate = function(tx, opt_ty) {
  tx instanceof goog.math.Coordinate ? (this.x += tx.x, this.y += tx.y) : (this.x += tx, goog.isNumber(opt_ty) && (this.y += opt_ty));
  return this;
};
goog.math.Coordinate.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.x *= sx;
  this.y *= sy;
  return this;
};
// INPUT (javascript/closure/math/size.js)
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height;
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1;
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return "(" + this.width + " x " + this.height + ")";
});
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height);
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height;
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area();
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height;
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Size.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.width *= sx;
  this.height *= sy;
  return this;
};
// INPUT (javascript/closure/dom/browserfeature.js)
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE, LEGACY_IE_RANGES:goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)};
// INPUT (javascript/closure/dom/tagname.js)
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
// INPUT (javascript/closure/dom/dom.js)
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper);
};
goog.dom.getDocument = function() {
  return document;
};
goog.dom.getElement = function(element) {
  return goog.dom.getElementHelper_(document, element);
};
goog.dom.getElementHelper_ = function(doc, element) {
  return goog.isString(element) ? doc.getElementById(element) : element;
};
goog.dom.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(document, id);
};
goog.dom.getRequiredElementHelper_ = function(doc, id) {
  goog.asserts.assertString(id);
  var element = goog.dom.getElementHelper_(doc, id);
  return element = goog.asserts.assertElement(element, "No element found with id: " + id);
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el);
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  return goog.dom.canUseQuerySelector_(parent) ? parent.querySelectorAll("." + className) : goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el);
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document, retVal = null;
  return(retVal = goog.dom.canUseQuerySelector_(parent) ? parent.querySelector("." + className) : goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)[0]) || null;
};
goog.dom.getRequiredElementByClass = function(className, opt_root) {
  var retValue = goog.dom.getElementByClass(className, opt_root);
  return goog.asserts.assert(retValue, "No element found with className: " + className);
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return!(!parent.querySelectorAll || !parent.querySelector);
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc, tagName = opt_tag && "*" != opt_tag ? opt_tag.toUpperCase() : "";
  if (goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? "." + opt_class : "");
    return parent.querySelectorAll(query);
  }
  if (opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if (tagName) {
      for (var arrayLike = {}, len = 0, i = 0, el;el = els[i];i++) {
        tagName == el.nodeName && (arrayLike[len++] = el);
      }
      arrayLike.length = len;
      return arrayLike;
    }
    return els;
  }
  els = parent.getElementsByTagName(tagName || "*");
  if (opt_class) {
    arrayLike = {};
    for (i = len = 0;el = els[i];i++) {
      var className = el.className;
      "function" == typeof className.split && goog.array.contains(className.split(/\s+/), opt_class) && (arrayLike[len++] = el);
    }
    arrayLike.length = len;
    return arrayLike;
  }
  return els;
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    "style" == key ? element.style.cssText = val : "class" == key ? element.className = val : "for" == key ? element.htmlFor = val : key in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val) : goog.string.startsWith(key, "aria-") || goog.string.startsWith(key, "data-") ? element.setAttribute(key, val) : element[key] = val;
  });
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window);
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document, el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight);
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document, height = 0;
  if (doc) {
    var body = doc.body, docEl = doc.documentElement;
    if (!docEl || !body) {
      return 0;
    }
    var vh = goog.dom.getViewportSize_(win).height;
    if (goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight;
    } else {
      var sh = docEl.scrollHeight, oh = docEl.offsetHeight;
      docEl.clientHeight != oh && (sh = body.scrollHeight, oh = body.offsetHeight);
      height = sh > vh ? sh > oh ? sh : oh : sh < oh ? sh : oh;
    }
  }
  return height;
};
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll();
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc), win = goog.dom.getWindow_(doc);
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && win.pageYOffset != el.scrollTop ? new goog.math.Coordinate(el.scrollLeft, el.scrollTop) : new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop);
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body || doc.documentElement;
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window;
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView;
};
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments);
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0], attributes = args[1];
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    attributes.name && tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"');
    if (attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      delete clone.type;
      attributes = clone;
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("");
  }
  var element = doc.createElement(tagName);
  attributes && (goog.isString(attributes) ? element.className = attributes : goog.isArray(attributes) ? element.className = attributes.join(" ") : goog.dom.setProperties(element, attributes));
  2 < args.length && goog.dom.append_(doc, element, args, 2);
  return element;
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    child && parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child);
  }
  for (var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg) ? goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.toArray(arg) : arg, childHandler) : childHandler(arg);
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return document.createElement(name);
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(String(content));
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  for (var rowHtml = ["<tr>"], i = 0;i < columns;i++) {
    rowHtml.push(fillWithNbsp ? "<td>&nbsp;</td>" : "<td></td>");
  }
  rowHtml.push("</tr>");
  for (var rowHtml = rowHtml.join(""), totalHtml = ["<table>"], i = 0;i < rows;i++) {
    totalHtml.push(rowHtml);
  }
  totalHtml.push("</table>");
  var elem = doc.createElement(goog.dom.TagName.DIV);
  elem.innerHTML = totalHtml.join("");
  return elem.removeChild(elem.firstChild);
};
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString);
};
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (tempDiv.innerHTML = "<br>" + htmlString, tempDiv.removeChild(tempDiv.firstChild)) : tempDiv.innerHTML = htmlString;
  if (1 == tempDiv.childNodes.length) {
    return tempDiv.removeChild(tempDiv.firstChild);
  }
  for (var fragment = doc.createDocumentFragment();tempDiv.firstChild;) {
    fragment.appendChild(tempDiv.firstChild);
  }
  return fragment;
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
};
goog.dom.isCss1CompatMode_ = function(doc) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == doc.compatMode;
};
goog.dom.canHaveChildren = function(node) {
  if (node.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1;
  }
  switch(node.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return!1;
  }
  return!0;
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child);
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1);
};
goog.dom.removeChildren = function(node) {
  for (var child;child = node.firstChild;) {
    node.removeChild(child);
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  refNode.parentNode && refNode.parentNode.insertBefore(newNode, refNode);
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  refNode.parentNode && refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null);
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  parent && parent.replaceChild(newNode, oldNode);
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (element.removeNode) {
      return element.removeNode(!1);
    }
    for (;child = element.firstChild;) {
      parent.insertBefore(child, element);
    }
    return goog.dom.removeNode(element);
  }
};
goog.dom.getChildren = function(element) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != element.children ? element.children : goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT;
  });
};
goog.dom.getFirstElementChild = function(node) {
  return void 0 != node.firstElementChild ? node.firstElementChild : goog.dom.getNextElementNode_(node.firstChild, !0);
};
goog.dom.getLastElementChild = function(node) {
  return void 0 != node.lastElementChild ? node.lastElementChild : goog.dom.getNextElementNode_(node.lastChild, !1);
};
goog.dom.getNextElementSibling = function(node) {
  return void 0 != node.nextElementSibling ? node.nextElementSibling : goog.dom.getNextElementNode_(node.nextSibling, !0);
};
goog.dom.getPreviousElementSibling = function(node) {
  return void 0 != node.previousElementSibling ? node.previousElementSibling : goog.dom.getNextElementNode_(node.previousSibling, !1);
};
goog.dom.getNextElementNode_ = function(node, forward) {
  for (;node && node.nodeType != goog.dom.NodeType.ELEMENT;) {
    node = forward ? node.nextSibling : node.previousSibling;
  }
  return node;
};
goog.dom.getNextNode = function(node) {
  if (!node) {
    return null;
  }
  if (node.firstChild) {
    return node.firstChild;
  }
  for (;node && !node.nextSibling;) {
    node = node.parentNode;
  }
  return node ? node.nextSibling : null;
};
goog.dom.getPreviousNode = function(node) {
  if (!node) {
    return null;
  }
  if (!node.previousSibling) {
    return node.parentNode;
  }
  for (node = node.previousSibling;node && node.lastChild;) {
    node = node.lastChild;
  }
  return node;
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && 0 < obj.nodeType;
};
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT;
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj.window == obj;
};
goog.dom.getParentElement = function(element) {
  var parent;
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    var isIe9 = goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10");
    if (!(isIe9 && goog.global.SVGElement && element instanceof goog.global.SVGElement) && (parent = element.parentElement)) {
      return parent;
    }
  }
  parent = element.parentNode;
  return goog.dom.isElement(parent) ? parent : null;
};
goog.dom.contains = function(parent, descendant) {
  if (parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant);
  }
  if ("undefined" != typeof parent.compareDocumentPosition) {
    return parent == descendant || Boolean(parent.compareDocumentPosition(descendant) & 16);
  }
  for (;descendant && parent != descendant;) {
    descendant = descendant.parentNode;
  }
  return descendant == parent;
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if (node1 == node2) {
    return 0;
  }
  if (node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1;
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if (node1.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1;
    }
    if (node2.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }
  if ("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT, isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if (isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex;
    }
    var parent1 = node1.parentNode, parent2 = node2.parentNode;
    return parent1 == parent2 ? goog.dom.compareSiblingOrder_(node1, node2) : !isElement1 && goog.dom.contains(parent1, node2) ? -1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2) : !isElement2 && goog.dom.contains(parent2, node1) ? goog.dom.compareParentsDescendantNodeIe_(node2, node1) : (isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex);
  }
  var doc = goog.dom.getOwnerDocument(node1), range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(!0);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(!0);
  return range1.compareBoundaryPoints(goog.global.Range.START_TO_END, range2);
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if (parent == node) {
    return-1;
  }
  for (var sibling = node;sibling.parentNode != parent;) {
    sibling = sibling.parentNode;
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode);
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  for (var s = node2;s = s.previousSibling;) {
    if (s == node1) {
      return-1;
    }
  }
  return 1;
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if (!count) {
    return null;
  }
  if (1 == count) {
    return arguments[0];
  }
  var paths = [], minLength = Infinity;
  for (i = 0;i < count;i++) {
    for (var ancestors = [], node = arguments[i];node;) {
      ancestors.unshift(node), node = node.parentNode;
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length);
  }
  var output = null;
  for (i = 0;i < minLength;i++) {
    for (var first = paths[0][i], j = 1;j < count;j++) {
      if (first != paths[j][i]) {
        return output;
      }
    }
    output = first;
  }
  return output;
};
goog.dom.getOwnerDocument = function(node) {
  goog.asserts.assert(node, "Node cannot be null or undefined.");
  return node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document;
};
goog.dom.getFrameContentDocument = function(frame) {
  var doc = frame.contentDocument || frame.contentWindow.document;
  return doc;
};
goog.dom.getFrameContentWindow = function(frame) {
  return frame.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(frame));
};
goog.dom.setTextContent = function(node, text) {
  goog.asserts.assert(null != node, "goog.dom.setTextContent expects a non-null value for node");
  if ("textContent" in node) {
    node.textContent = text;
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      node.data = text;
    } else {
      if (node.firstChild && node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (;node.lastChild != node.firstChild;) {
          node.removeChild(node.lastChild);
        }
        node.firstChild.data = text;
      } else {
        goog.dom.removeChildren(node);
        var doc = goog.dom.getOwnerDocument(node);
        node.appendChild(doc.createTextNode(String(text)));
      }
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  if ("outerHTML" in element) {
    return element.outerHTML;
  }
  var doc = goog.dom.getOwnerDocument(element), div = doc.createElement("div");
  div.appendChild(element.cloneNode(!0));
  return div.innerHTML;
};
goog.dom.findNode = function(root, p) {
  var rv = [], found = goog.dom.findNodes_(root, p, rv, !0);
  return found ? rv[0] : void 0;
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, !1);
  return rv;
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if (null != root) {
    for (var child = root.firstChild;child;) {
      if (p(child) && (rv.push(child), findOne) || goog.dom.findNodes_(child, p, rv, findOne)) {
        return!0;
      }
      child = child.nextSibling;
    }
  }
  return!1;
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  return goog.dom.hasSpecifiedTabIndex_(element) && goog.dom.isTabIndexFocusable_(element);
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  enable ? element.tabIndex = 0 : (element.tabIndex = -1, element.removeAttribute("tabIndex"));
};
goog.dom.isFocusable = function(element) {
  var focusable;
  return(focusable = goog.dom.nativelySupportsFocus_(element) ? !element.disabled && (!goog.dom.hasSpecifiedTabIndex_(element) || goog.dom.isTabIndexFocusable_(element)) : goog.dom.isFocusableTabIndex(element)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(element) : focusable;
};
goog.dom.hasSpecifiedTabIndex_ = function(element) {
  var attrNode = element.getAttributeNode("tabindex");
  return goog.isDefAndNotNull(attrNode) && attrNode.specified;
};
goog.dom.isTabIndexFocusable_ = function(element) {
  var index = element.tabIndex;
  return goog.isNumber(index) && 0 <= index && 32768 > index;
};
goog.dom.nativelySupportsFocus_ = function(element) {
  return element.tagName == goog.dom.TagName.A || element.tagName == goog.dom.TagName.INPUT || element.tagName == goog.dom.TagName.TEXTAREA || element.tagName == goog.dom.TagName.SELECT || element.tagName == goog.dom.TagName.BUTTON;
};
goog.dom.hasNonZeroBoundingRect_ = function(element) {
  var rect = goog.isFunction(element.getBoundingClientRect) ? element.getBoundingClientRect() : {height:element.offsetHeight, width:element.offsetWidth};
  return goog.isDefAndNotNull(rect) && 0 < rect.height && 0 < rect.width;
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText);
  } else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, !0);
    textContent = buf.join("");
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (textContent = textContent.replace(/ +/g, " "));
  " " != textContent && (textContent = textContent.replace(/^\s*/, ""));
  return textContent;
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, !1);
  return buf.join("");
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if (!(node.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      normalizeWhitespace ? buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : buf.push(node.nodeValue);
    } else {
      if (node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName]);
      } else {
        for (var child = node.firstChild;child;) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace), child = child.nextSibling;
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length;
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  for (var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body, buf = [];node && node != root;) {
    for (var cur = node;cur = cur.previousSibling;) {
      buf.unshift(goog.dom.getTextContent(cur));
    }
    node = node.parentNode;
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length;
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  for (var stack = [parent], pos = 0, cur = null;0 < stack.length && pos < offset;) {
    if (cur = stack.pop(), !(cur.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if (cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), pos = pos + text.length
      } else {
        if (cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length;
        } else {
          for (var i = cur.childNodes.length - 1;0 <= i;i--) {
            stack.push(cur.childNodes[i]);
          }
        }
      }
    }
  }
  goog.isObject(opt_result) && (opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0, opt_result.node = cur);
  return cur;
};
goog.dom.isNodeList = function(val) {
  if (val && "number" == typeof val.length) {
    if (goog.isObject(val)) {
      return "function" == typeof val.item || "string" == typeof val.item;
    }
    if (goog.isFunction(val)) {
      return "function" == typeof val.item;
    }
  }
  return!1;
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class) {
  if (!opt_tag && !opt_class) {
    return null;
  }
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return goog.dom.getAncestor(element, function(node) {
    return(!tagName || node.nodeName == tagName) && (!opt_class || goog.isString(node.className) && goog.array.contains(node.className.split(/\s+/), opt_class));
  }, !0);
};
goog.dom.getAncestorByClass = function(element, className) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, className);
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  opt_includeNode || (element = element.parentNode);
  for (var ignoreSearchSteps = null == opt_maxSearchSteps, steps = 0;element && (ignoreSearchSteps || steps <= opt_maxSearchSteps);) {
    if (matcher(element)) {
      return element;
    }
    element = element.parentNode;
    steps++;
  }
  return null;
};
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement;
  } catch (e) {
  }
  return null;
};
goog.dom.getPixelRatio = function() {
  var win = goog.dom.getWindow(), isFirefoxMobile = goog.userAgent.GECKO && goog.userAgent.MOBILE;
  return goog.isDef(win.devicePixelRatio) && !isFirefoxMobile ? win.devicePixelRatio : win.matchMedia ? goog.dom.matchesPixelRatio_(.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1 : 1;
};
goog.dom.matchesPixelRatio_ = function(pixelRatio) {
  var win = goog.dom.getWindow(), query = "(-webkit-min-device-pixel-ratio: " + pixelRatio + "),(min--moz-device-pixel-ratio: " + pixelRatio + "),(min-resolution: " + pixelRatio + "dppx)";
  return win.matchMedia(query).matches ? pixelRatio : 0;
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document;
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  return goog.dom.getElementHelper_(this.document_, element);
};
goog.dom.DomHelper.prototype.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(this.document_, id);
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el);
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc);
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc);
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(className, opt_root) {
  var root = opt_root || this.document_;
  return goog.dom.getRequiredElementByClass(className, root);
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow());
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
};
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments);
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name);
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(String(content));
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString);
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
};
goog.dom.DomHelper.prototype.getActiveElement = function(opt_doc) {
  return goog.dom.getActiveElement(opt_doc || this.document_);
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
// INPUT (javascript/closure/dom/vendor.js)
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
  return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null;
};
goog.dom.vendor.getVendorPrefix = function() {
  return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null;
};
goog.dom.vendor.getPrefixedPropertyName = function(propertyName, opt_object) {
  if (opt_object && propertyName in opt_object) {
    return propertyName;
  }
  var prefix = goog.dom.vendor.getVendorJsPrefix();
  if (prefix) {
    var prefix = prefix.toLowerCase(), prefixedPropertyName = prefix + goog.string.toTitleCase(propertyName);
    return!goog.isDef(opt_object) || prefixedPropertyName in opt_object ? prefixedPropertyName : null;
  }
  return null;
};
goog.dom.vendor.getPrefixedEventType = function(eventType) {
  var prefix = goog.dom.vendor.getVendorJsPrefix() || "";
  return(prefix + eventType).toLowerCase();
};
// INPUT (javascript/closure/math/box.js)
goog.math.Box = function(top, right, bottom, left) {
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.left = left;
};
goog.math.Box.boundingBox = function(var_args) {
  for (var box = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), i = 1;i < arguments.length;i++) {
    var coord = arguments[i];
    box.top = Math.min(box.top, coord.y);
    box.right = Math.max(box.right, coord.x);
    box.bottom = Math.max(box.bottom, coord.y);
    box.left = Math.min(box.left, coord.x);
  }
  return box;
};
goog.math.Box.prototype.getWidth = function() {
  return this.right - this.left;
};
goog.math.Box.prototype.getHeight = function() {
  return this.bottom - this.top;
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left);
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)";
});
goog.math.Box.prototype.contains = function(other) {
  return goog.math.Box.contains(this, other);
};
goog.math.Box.prototype.expand = function(top, opt_right, opt_bottom, opt_left) {
  goog.isObject(top) ? (this.top -= top.top, this.right += top.right, this.bottom += top.bottom, this.left -= top.left) : (this.top -= top, this.right += opt_right, this.bottom += opt_bottom, this.left -= opt_left);
  return this;
};
goog.math.Box.prototype.expandToInclude = function(box) {
  this.left = Math.min(this.left, box.left);
  this.top = Math.min(this.top, box.top);
  this.right = Math.max(this.right, box.right);
  this.bottom = Math.max(this.bottom, box.bottom);
};
goog.math.Box.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1;
};
goog.math.Box.contains = function(box, other) {
  return box && other ? other instanceof goog.math.Box ? other.left >= box.left && other.right <= box.right && other.top >= box.top && other.bottom <= box.bottom : other.x >= box.left && other.x <= box.right && other.y >= box.top && other.y <= box.bottom : !1;
};
goog.math.Box.relativePositionX = function(box, coord) {
  return coord.x < box.left ? coord.x - box.left : coord.x > box.right ? coord.x - box.right : 0;
};
goog.math.Box.relativePositionY = function(box, coord) {
  return coord.y < box.top ? coord.y - box.top : coord.y > box.bottom ? coord.y - box.bottom : 0;
};
goog.math.Box.distance = function(box, coord) {
  var x = goog.math.Box.relativePositionX(box, coord), y = goog.math.Box.relativePositionY(box, coord);
  return Math.sqrt(x * x + y * y);
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
};
goog.math.Box.intersectsWithPadding = function(a, b, padding) {
  return a.left <= b.right + padding && b.left <= a.right + padding && a.top <= b.bottom + padding && b.top <= a.bottom + padding;
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this;
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this;
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this;
};
goog.math.Box.prototype.translate = function(tx, opt_ty) {
  tx instanceof goog.math.Coordinate ? (this.left += tx.x, this.right += tx.x, this.top += tx.y, this.bottom += tx.y) : (this.left += tx, this.right += tx, goog.isNumber(opt_ty) && (this.top += opt_ty, this.bottom += opt_ty));
  return this;
};
goog.math.Box.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.right *= sx;
  this.top *= sy;
  this.bottom *= sy;
  return this;
};
// INPUT (javascript/closure/math/rect.js)
goog.math.Rect = function(x, y, w, h) {
  this.left = x;
  this.top = y;
  this.width = w;
  this.height = h;
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height);
};
goog.math.Rect.prototype.toBox = function() {
  var right = this.left + this.width, bottom = this.top + this.height;
  return new goog.math.Box(this.top, right, bottom, this.left);
};
goog.math.Rect.createFromBox = function(box) {
  return new goog.math.Rect(box.left, box.top, box.right - box.left, box.bottom - box.top);
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)";
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1;
};
goog.math.Rect.prototype.intersection = function(rect) {
  var x0 = Math.max(this.left, rect.left), x1 = Math.min(this.left + this.width, rect.left + rect.width);
  if (x0 <= x1) {
    var y0 = Math.max(this.top, rect.top), y1 = Math.min(this.top + this.height, rect.top + rect.height);
    if (y0 <= y1) {
      return this.left = x0, this.top = y0, this.width = x1 - x0, this.height = y1 - y0, !0;
    }
  }
  return!1;
};
goog.math.Rect.intersection = function(a, b) {
  var x0 = Math.max(a.left, b.left), x1 = Math.min(a.left + a.width, b.left + b.width);
  if (x0 <= x1) {
    var y0 = Math.max(a.top, b.top), y1 = Math.min(a.top + a.height, b.top + b.height);
    if (y0 <= y1) {
      return new goog.math.Rect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  return null;
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height;
};
goog.math.Rect.prototype.intersects = function(rect) {
  return goog.math.Rect.intersects(this, rect);
};
goog.math.Rect.difference = function(a, b) {
  var intersection = goog.math.Rect.intersection(a, b);
  if (!intersection || !intersection.height || !intersection.width) {
    return[a.clone()];
  }
  var result = [], top = a.top, height = a.height, ar = a.left + a.width, ab = a.top + a.height, br = b.left + b.width, bb = b.top + b.height;
  b.top > a.top && (result.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), top = b.top, height -= b.top - a.top);
  bb < ab && (result.push(new goog.math.Rect(a.left, bb, a.width, ab - bb)), height = bb - top);
  b.left > a.left && result.push(new goog.math.Rect(a.left, top, b.left - a.left, height));
  br < ar && result.push(new goog.math.Rect(br, top, ar - br, height));
  return result;
};
goog.math.Rect.prototype.difference = function(rect) {
  return goog.math.Rect.difference(this, rect);
};
goog.math.Rect.prototype.boundingRect = function(rect) {
  var right = Math.max(this.left + this.width, rect.left + rect.width), bottom = Math.max(this.top + this.height, rect.top + rect.height);
  this.left = Math.min(this.left, rect.left);
  this.top = Math.min(this.top, rect.top);
  this.width = right - this.left;
  this.height = bottom - this.top;
};
goog.math.Rect.boundingRect = function(a, b) {
  if (!a || !b) {
    return null;
  }
  var clone = a.clone();
  clone.boundingRect(b);
  return clone;
};
goog.math.Rect.prototype.contains = function(another) {
  return another instanceof goog.math.Rect ? this.left <= another.left && this.left + this.width >= another.left + another.width && this.top <= another.top && this.top + this.height >= another.top + another.height : another.x >= this.left && another.x <= this.left + this.width && another.y >= this.top && another.y <= this.top + this.height;
};
goog.math.Rect.prototype.squaredDistance = function(point) {
  var dx = point.x < this.left ? this.left - point.x : Math.max(point.x - (this.left + this.width), 0), dy = point.y < this.top ? this.top - point.y : Math.max(point.y - (this.top + this.height), 0);
  return dx * dx + dy * dy;
};
goog.math.Rect.prototype.distance = function(point) {
  return Math.sqrt(this.squaredDistance(point));
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top);
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2);
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Rect.prototype.translate = function(tx, opt_ty) {
  tx instanceof goog.math.Coordinate ? (this.left += tx.x, this.top += tx.y) : (this.left += tx, goog.isNumber(opt_ty) && (this.top += opt_ty));
  return this;
};
goog.math.Rect.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.width *= sx;
  this.top *= sy;
  this.height *= sy;
  return this;
};
// INPUT (javascript/closure/style/style.js)
goog.style = {};
goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS = !1;
goog.style.setStyle = function(element, style, opt_value) {
  if (goog.isString(style)) {
    goog.style.setStyle_(element, opt_value, style);
  } else {
    for (var key in style) {
      goog.style.setStyle_(element, style[key], key);
    }
  }
};
goog.style.setStyle_ = function(element, value, style) {
  var propertyName = goog.style.getVendorJsStyleName_(element, style);
  propertyName && (element.style[propertyName] = value);
};
goog.style.getVendorJsStyleName_ = function(element, style) {
  var camelStyle = goog.string.toCamelCase(style);
  if (void 0 === element.style[camelStyle]) {
    var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(camelStyle);
    if (void 0 !== element.style[prefixedStyle]) {
      return prefixedStyle;
    }
  }
  return camelStyle;
};
goog.style.getVendorStyleName_ = function(element, style) {
  var camelStyle = goog.string.toCamelCase(style);
  if (void 0 === element.style[camelStyle]) {
    var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(camelStyle);
    if (void 0 !== element.style[prefixedStyle]) {
      return goog.dom.vendor.getVendorPrefix() + "-" + style;
    }
  }
  return style;
};
goog.style.getStyle = function(element, property) {
  var styleValue = element.style[goog.string.toCamelCase(property)];
  return "undefined" !== typeof styleValue ? styleValue : element.style[goog.style.getVendorJsStyleName_(element, property)] || "";
};
goog.style.getComputedStyle = function(element, property) {
  var doc = goog.dom.getOwnerDocument(element);
  if (doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if (styles) {
      return styles[property] || styles.getPropertyValue(property) || "";
    }
  }
  return "";
};
goog.style.getCascadedStyle = function(element, style) {
  return element.currentStyle ? element.currentStyle[style] : null;
};
goog.style.getStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) || goog.style.getCascadedStyle(element, style) || element.style && element.style[style];
};
goog.style.getComputedBoxSizing = function(element) {
  return goog.style.getStyle_(element, "boxSizing") || goog.style.getStyle_(element, "MozBoxSizing") || goog.style.getStyle_(element, "WebkitBoxSizing") || null;
};
goog.style.getComputedPosition = function(element) {
  return goog.style.getStyle_(element, "position");
};
goog.style.getBackgroundColor = function(element) {
  return goog.style.getStyle_(element, "backgroundColor");
};
goog.style.getComputedOverflowX = function(element) {
  return goog.style.getStyle_(element, "overflowX");
};
goog.style.getComputedOverflowY = function(element) {
  return goog.style.getStyle_(element, "overflowY");
};
goog.style.getComputedZIndex = function(element) {
  return goog.style.getStyle_(element, "zIndex");
};
goog.style.getComputedTextAlign = function(element) {
  return goog.style.getStyle_(element, "textAlign");
};
goog.style.getComputedCursor = function(element) {
  return goog.style.getStyle_(element, "cursor");
};
goog.style.getComputedTransform = function(element) {
  var property = goog.style.getVendorStyleName_(element, "transform");
  return goog.style.getStyle_(element, property) || goog.style.getStyle_(element, "transform");
};
goog.style.setPosition = function(el, arg1, opt_arg2) {
  var x, y, buggyGeckoSubPixelPos = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersionOrHigher("1.9");
  arg1 instanceof goog.math.Coordinate ? (x = arg1.x, y = arg1.y) : (x = arg1, y = opt_arg2);
  el.style.left = goog.style.getPixelStyleValue_(x, buggyGeckoSubPixelPos);
  el.style.top = goog.style.getPixelStyleValue_(y, buggyGeckoSubPixelPos);
};
goog.style.getPosition = function(element) {
  return new goog.math.Coordinate(element.offsetLeft, element.offsetTop);
};
goog.style.getClientViewportElement = function(opt_node) {
  var doc;
  doc = opt_node ? goog.dom.getOwnerDocument(opt_node) : goog.dom.getDocument();
  return!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(doc).isCss1CompatMode() ? doc.documentElement : doc.body;
};
goog.style.getViewportPageOffset = function(doc) {
  var body = doc.body, documentElement = doc.documentElement, scrollLeft = body.scrollLeft || documentElement.scrollLeft, scrollTop = body.scrollTop || documentElement.scrollTop;
  return new goog.math.Coordinate(scrollLeft, scrollTop);
};
goog.style.getBoundingClientRect_ = function(el) {
  var rect;
  try {
    rect = el.getBoundingClientRect();
  } catch (e) {
    return{left:0, top:0, right:0, bottom:0};
  }
  if (goog.userAgent.IE && el.ownerDocument.body) {
    var doc = el.ownerDocument;
    rect.left -= doc.documentElement.clientLeft + doc.body.clientLeft;
    rect.top -= doc.documentElement.clientTop + doc.body.clientTop;
  }
  return rect;
};
goog.style.getOffsetParent = function(element) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return element.offsetParent;
  }
  for (var doc = goog.dom.getOwnerDocument(element), positionStyle = goog.style.getStyle_(element, "position"), skipStatic = "fixed" == positionStyle || "absolute" == positionStyle, parent = element.parentNode;parent && parent != doc;parent = parent.parentNode) {
    if (positionStyle = goog.style.getStyle_(parent, "position"), skipStatic = skipStatic && "static" == positionStyle && parent != doc.documentElement && parent != doc.body, !skipStatic && (parent.scrollWidth > parent.clientWidth || parent.scrollHeight > parent.clientHeight || "fixed" == positionStyle || "absolute" == positionStyle || "relative" == positionStyle)) {
      return parent;
    }
  }
  return null;
};
goog.style.getVisibleRectForElement = function(element) {
  for (var visibleRect = new goog.math.Box(0, Infinity, Infinity, 0), dom = goog.dom.getDomHelper(element), body = dom.getDocument().body, documentElement = dom.getDocument().documentElement, scrollEl = dom.getDocumentScrollElement(), el = element;el = goog.style.getOffsetParent(el);) {
    if (!(goog.userAgent.IE && 0 == el.clientWidth || goog.userAgent.WEBKIT && 0 == el.clientHeight && el == body) && el != body && el != documentElement && "visible" != goog.style.getStyle_(el, "overflow")) {
      var pos = goog.style.getPageOffset(el), client = goog.style.getClientLeftTop(el);
      pos.x += client.x;
      pos.y += client.y;
      visibleRect.top = Math.max(visibleRect.top, pos.y);
      visibleRect.right = Math.min(visibleRect.right, pos.x + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom, pos.y + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.x);
    }
  }
  var scrollX = scrollEl.scrollLeft, scrollY = scrollEl.scrollTop;
  visibleRect.left = Math.max(visibleRect.left, scrollX);
  visibleRect.top = Math.max(visibleRect.top, scrollY);
  var winSize = dom.getViewportSize();
  visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
  visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
  return 0 <= visibleRect.top && 0 <= visibleRect.left && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null;
};
goog.style.getContainerOffsetToScrollInto = function(element, container, opt_center) {
  var elementPos = goog.style.getPageOffset(element), containerPos = goog.style.getPageOffset(container), containerBorder = goog.style.getBorderBox(container), relX = elementPos.x - containerPos.x - containerBorder.left, relY = elementPos.y - containerPos.y - containerBorder.top, spaceX = container.clientWidth - element.offsetWidth, spaceY = container.clientHeight - element.offsetHeight, scrollLeft = container.scrollLeft, scrollTop = container.scrollTop;
  opt_center ? (scrollLeft += relX - spaceX / 2, scrollTop += relY - spaceY / 2) : (scrollLeft += Math.min(relX, Math.max(relX - spaceX, 0)), scrollTop += Math.min(relY, Math.max(relY - spaceY, 0)));
  return new goog.math.Coordinate(scrollLeft, scrollTop);
};
goog.style.scrollIntoContainerView = function(element, container, opt_center) {
  var offset = goog.style.getContainerOffsetToScrollInto(element, container, opt_center);
  container.scrollLeft = offset.x;
  container.scrollTop = offset.y;
};
goog.style.getClientLeftTop = function(el) {
  if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("1.9")) {
    var left = parseFloat(goog.style.getComputedStyle(el, "borderLeftWidth"));
    if (goog.style.isRightToLeft(el)) {
      var scrollbarWidth = el.offsetWidth - el.clientWidth - left - parseFloat(goog.style.getComputedStyle(el, "borderRightWidth")), left = left + scrollbarWidth
    }
    return new goog.math.Coordinate(left, parseFloat(goog.style.getComputedStyle(el, "borderTopWidth")));
  }
  return new goog.math.Coordinate(el.clientLeft, el.clientTop);
};
goog.style.getPageOffset = function(el) {
  var box, doc = goog.dom.getOwnerDocument(el), positionStyle = goog.style.getStyle_(el, "position");
  goog.asserts.assertObject(el, "Parameter is required");
  var BUGGY_GECKO_BOX_OBJECT = !goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS && goog.userAgent.GECKO && doc.getBoxObjectFor && !el.getBoundingClientRect && "absolute" == positionStyle && (box = doc.getBoxObjectFor(el)) && (0 > box.screenX || 0 > box.screenY), pos = new goog.math.Coordinate(0, 0), viewportElement = goog.style.getClientViewportElement(doc);
  if (el == viewportElement) {
    return pos;
  }
  if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || el.getBoundingClientRect) {
    box = goog.style.getBoundingClientRect_(el);
    var scrollCoord = goog.dom.getDomHelper(doc).getDocumentScroll();
    pos.x = box.left + scrollCoord.x;
    pos.y = box.top + scrollCoord.y;
  } else {
    if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) {
      box = doc.getBoxObjectFor(el);
      var vpBox = doc.getBoxObjectFor(viewportElement);
      pos.x = box.screenX - vpBox.screenX;
      pos.y = box.screenY - vpBox.screenY;
    } else {
      var parent = el;
      do {
        pos.x += parent.offsetLeft;
        pos.y += parent.offsetTop;
        parent != el && (pos.x += parent.clientLeft || 0, pos.y += parent.clientTop || 0);
        if (goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(parent)) {
          pos.x += doc.body.scrollLeft;
          pos.y += doc.body.scrollTop;
          break;
        }
        parent = parent.offsetParent;
      } while (parent && parent != el);
      if (goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == positionStyle) {
        pos.y -= doc.body.offsetTop;
      }
      for (parent = el;(parent = goog.style.getOffsetParent(parent)) && parent != doc.body && parent != viewportElement;) {
        pos.x -= parent.scrollLeft, goog.userAgent.OPERA && "TR" == parent.tagName || (pos.y -= parent.scrollTop);
      }
    }
  }
  return pos;
};
goog.style.getPageOffsetLeft = function(el) {
  return goog.style.getPageOffset(el).x;
};
goog.style.getPageOffsetTop = function(el) {
  return goog.style.getPageOffset(el).y;
};
goog.style.getFramedPageOffset = function(el, relativeWin) {
  var position = new goog.math.Coordinate(0, 0), currentWin = goog.dom.getWindow(goog.dom.getOwnerDocument(el)), currentEl = el;
  do {
    var offset = currentWin == relativeWin ? goog.style.getPageOffset(currentEl) : goog.style.getClientPositionForElement_(goog.asserts.assert(currentEl));
    position.x += offset.x;
    position.y += offset.y;
  } while (currentWin && currentWin != relativeWin && (currentEl = currentWin.frameElement) && (currentWin = currentWin.parent));
  return position;
};
goog.style.translateRectForAnotherFrame = function(rect, origBase, newBase) {
  if (origBase.getDocument() != newBase.getDocument()) {
    var body = origBase.getDocument().body, pos = goog.style.getFramedPageOffset(body, newBase.getWindow()), pos = goog.math.Coordinate.difference(pos, goog.style.getPageOffset(body));
    !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || origBase.isCss1CompatMode() || (pos = goog.math.Coordinate.difference(pos, origBase.getDocumentScroll()));
    rect.left += pos.x;
    rect.top += pos.y;
  }
};
goog.style.getRelativePosition = function(a, b) {
  var ap = goog.style.getClientPosition(a), bp = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(ap.x - bp.x, ap.y - bp.y);
};
goog.style.getClientPositionForElement_ = function(el) {
  var pos;
  if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || el.getBoundingClientRect) {
    var box = goog.style.getBoundingClientRect_(el);
    pos = new goog.math.Coordinate(box.left, box.top);
  } else {
    var scrollCoord = goog.dom.getDomHelper(el).getDocumentScroll(), pageCoord = goog.style.getPageOffset(el);
    pos = new goog.math.Coordinate(pageCoord.x - scrollCoord.x, pageCoord.y - scrollCoord.y);
  }
  return goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(12) ? goog.math.Coordinate.sum(pos, goog.style.getCssTranslation(el)) : pos;
};
goog.style.getClientPosition = function(el) {
  goog.asserts.assert(el);
  if (el.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_(el);
  }
  var isAbstractedEvent = goog.isFunction(el.getBrowserEvent), be = el, targetEvent = el;
  el.targetTouches && el.targetTouches.length ? targetEvent = el.targetTouches[0] : isAbstractedEvent && be.getBrowserEvent().targetTouches && be.getBrowserEvent().targetTouches.length && (targetEvent = be.getBrowserEvent().targetTouches[0]);
  return new goog.math.Coordinate(targetEvent.clientX, targetEvent.clientY);
};
goog.style.setPageOffset = function(el, x, opt_y) {
  var cur = goog.style.getPageOffset(el);
  x instanceof goog.math.Coordinate && (opt_y = x.y, x = x.x);
  var dx = x - cur.x, dy = opt_y - cur.y;
  goog.style.setPosition(el, el.offsetLeft + dx, el.offsetTop + dy);
};
goog.style.setSize = function(element, w, opt_h) {
  var h;
  if (w instanceof goog.math.Size) {
    h = w.height, w = w.width;
  } else {
    if (void 0 == opt_h) {
      throw Error("missing height argument");
    }
    h = opt_h;
  }
  goog.style.setWidth(element, w);
  goog.style.setHeight(element, h);
};
goog.style.getPixelStyleValue_ = function(value, round) {
  "number" == typeof value && (value = (round ? Math.round(value) : value) + "px");
  return value;
};
goog.style.setHeight = function(element, height) {
  element.style.height = goog.style.getPixelStyleValue_(height, !0);
};
goog.style.setWidth = function(element, width) {
  element.style.width = goog.style.getPixelStyleValue_(width, !0);
};
goog.style.getSize = function(element) {
  return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, element);
};
goog.style.evaluateWithTemporaryDisplay_ = function(fn, element) {
  if ("none" != goog.style.getStyle_(element, "display")) {
    return fn(element);
  }
  var style = element.style, originalDisplay = style.display, originalVisibility = style.visibility, originalPosition = style.position;
  style.visibility = "hidden";
  style.position = "absolute";
  style.display = "inline";
  var retVal = fn(element);
  style.display = originalDisplay;
  style.position = originalPosition;
  style.visibility = originalVisibility;
  return retVal;
};
goog.style.getSizeWithDisplay_ = function(element) {
  var offsetWidth = element.offsetWidth, offsetHeight = element.offsetHeight, webkitOffsetsZero = goog.userAgent.WEBKIT && !offsetWidth && !offsetHeight;
  if ((!goog.isDef(offsetWidth) || webkitOffsetsZero) && element.getBoundingClientRect) {
    var clientRect = goog.style.getBoundingClientRect_(element);
    return new goog.math.Size(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
  }
  return new goog.math.Size(offsetWidth, offsetHeight);
};
goog.style.getTransformedSize = function(element) {
  if (!element.getBoundingClientRect) {
    return null;
  }
  var clientRect = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, element);
  return new goog.math.Size(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
};
goog.style.getBounds = function(element) {
  var o = goog.style.getPageOffset(element), s = goog.style.getSize(element);
  return new goog.math.Rect(o.x, o.y, s.width, s.height);
};
goog.style.toCamelCase = function(selector) {
  return goog.string.toCamelCase(String(selector));
};
goog.style.toSelectorCase = function(selector) {
  return goog.string.toSelectorCase(selector);
};
goog.style.getOpacity = function(el) {
  var style = el.style, result = "";
  if ("opacity" in style) {
    result = style.opacity;
  } else {
    if ("MozOpacity" in style) {
      result = style.MozOpacity;
    } else {
      if ("filter" in style) {
        var match = style.filter.match(/alpha\(opacity=([\d.]+)\)/);
        match && (result = String(match[1] / 100));
      }
    }
  }
  return "" == result ? result : Number(result);
};
goog.style.setOpacity = function(el, alpha) {
  var style = el.style;
  "opacity" in style ? style.opacity = alpha : "MozOpacity" in style ? style.MozOpacity = alpha : "filter" in style && (style.filter = "" === alpha ? "" : "alpha(opacity=" + 100 * alpha + ")");
};
goog.style.setTransparentBackgroundImage = function(el, src) {
  var style = el.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '", sizingMethod="crop")' : (style.backgroundImage = "url(" + src + ")", style.backgroundPosition = "top left", style.backgroundRepeat = "no-repeat");
};
goog.style.clearTransparentBackgroundImage = function(el) {
  var style = el.style;
  "filter" in style ? style.filter = "" : style.backgroundImage = "none";
};
goog.style.showElement = function(el, display) {
  goog.style.setElementShown(el, display);
};
goog.style.setElementShown = function(el, isShown) {
  el.style.display = isShown ? "" : "none";
};
goog.style.isElementShown = function(el) {
  return "none" != el.style.display;
};
goog.style.installStyles = function(stylesString, opt_node) {
  var dh = goog.dom.getDomHelper(opt_node), styleSheet = null, doc = dh.getDocument();
  if (goog.userAgent.IE && doc.createStyleSheet) {
    styleSheet = doc.createStyleSheet(), goog.style.setStyles(styleSheet, stylesString);
  } else {
    var head = dh.getElementsByTagNameAndClass("head")[0];
    if (!head) {
      var body = dh.getElementsByTagNameAndClass("body")[0], head = dh.createDom("head");
      body.parentNode.insertBefore(head, body);
    }
    styleSheet = dh.createDom("style");
    goog.style.setStyles(styleSheet, stylesString);
    dh.appendChild(head, styleSheet);
  }
  return styleSheet;
};
goog.style.uninstallStyles = function(styleSheet) {
  var node = styleSheet.ownerNode || styleSheet.owningElement || styleSheet;
  goog.dom.removeNode(node);
};
goog.style.setStyles = function(element, stylesString) {
  goog.userAgent.IE && goog.isDef(element.cssText) ? element.cssText = stylesString : element.innerHTML = stylesString;
};
goog.style.setPreWrap = function(el) {
  var style = el.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (style.whiteSpace = "pre", style.wordWrap = "break-word") : style.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap";
};
goog.style.setInlineBlock = function(el) {
  var style = el.style;
  style.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (style.zoom = "1", style.display = "inline") : style.display = goog.userAgent.GECKO ? goog.userAgent.isVersionOrHigher("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block";
};
goog.style.isRightToLeft = function(el) {
  return "rtl" == goog.style.getStyle_(el, "direction");
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(el) {
  return goog.style.unselectableStyle_ ? "none" == el.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == el.getAttribute("unselectable") : !1;
};
goog.style.setUnselectable = function(el, unselectable, opt_noRecurse) {
  var descendants = opt_noRecurse ? null : el.getElementsByTagName("*"), name = goog.style.unselectableStyle_;
  if (name) {
    var value = unselectable ? "none" : "";
    el.style[name] = value;
    if (descendants) {
      for (var i = 0, descendant;descendant = descendants[i];i++) {
        descendant.style[name] = value;
      }
    }
  } else {
    if (goog.userAgent.IE || goog.userAgent.OPERA) {
      if (value = unselectable ? "on" : "", el.setAttribute("unselectable", value), descendants) {
        for (i = 0;descendant = descendants[i];i++) {
          descendant.setAttribute("unselectable", value);
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(element) {
  return new goog.math.Size(element.offsetWidth, element.offsetHeight);
};
goog.style.setBorderBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element), isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if (!goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || isCss1CompatMode && goog.userAgent.isVersionOrHigher("8")) {
    goog.style.setBoxSizingSize_(element, size, "border-box");
  } else {
    var style = element.style;
    if (isCss1CompatMode) {
      var paddingBox = goog.style.getPaddingBox(element), borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right;
      style.pixelHeight = size.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom;
    } else {
      style.pixelWidth = size.width, style.pixelHeight = size.height;
    }
  }
};
goog.style.getContentBoxSize = function(element) {
  var doc = goog.dom.getOwnerDocument(element), ieCurrentStyle = goog.userAgent.IE && element.currentStyle;
  if (ieCurrentStyle && goog.dom.getDomHelper(doc).isCss1CompatMode() && "auto" != ieCurrentStyle.width && "auto" != ieCurrentStyle.height && !ieCurrentStyle.boxSizing) {
    var width = goog.style.getIePixelValue_(element, ieCurrentStyle.width, "width", "pixelWidth"), height = goog.style.getIePixelValue_(element, ieCurrentStyle.height, "height", "pixelHeight");
    return new goog.math.Size(width, height);
  }
  var borderBoxSize = goog.style.getBorderBoxSize(element), paddingBox = goog.style.getPaddingBox(element), borderBox = goog.style.getBorderBox(element);
  return new goog.math.Size(borderBoxSize.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right, borderBoxSize.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom);
};
goog.style.setContentBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element), isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if (!goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || isCss1CompatMode && goog.userAgent.isVersionOrHigher("8")) {
    goog.style.setBoxSizingSize_(element, size, "content-box");
  } else {
    var style = element.style;
    if (isCss1CompatMode) {
      style.pixelWidth = size.width, style.pixelHeight = size.height;
    } else {
      var paddingBox = goog.style.getPaddingBox(element), borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width + borderBox.left + paddingBox.left + paddingBox.right + borderBox.right;
      style.pixelHeight = size.height + borderBox.top + paddingBox.top + paddingBox.bottom + borderBox.bottom;
    }
  }
};
goog.style.setBoxSizingSize_ = function(element, size, boxSizing) {
  var style = element.style;
  goog.userAgent.GECKO ? style.MozBoxSizing = boxSizing : goog.userAgent.WEBKIT ? style.WebkitBoxSizing = boxSizing : style.boxSizing = boxSizing;
  style.width = Math.max(size.width, 0) + "px";
  style.height = Math.max(size.height, 0) + "px";
};
goog.style.getIePixelValue_ = function(element, value, name, pixelName) {
  if (/^\d+px?$/.test(value)) {
    return parseInt(value, 10);
  }
  var oldStyleValue = element.style[name], oldRuntimeValue = element.runtimeStyle[name];
  element.runtimeStyle[name] = element.currentStyle[name];
  element.style[name] = value;
  var pixelValue = element.style[pixelName];
  element.style[name] = oldStyleValue;
  element.runtimeStyle[name] = oldRuntimeValue;
  return pixelValue;
};
goog.style.getIePixelDistance_ = function(element, propName) {
  var value = goog.style.getCascadedStyle(element, propName);
  return value ? goog.style.getIePixelValue_(element, value, "left", "pixelLeft") : 0;
};
goog.style.getBox_ = function(element, stylePrefix) {
  if (goog.userAgent.IE) {
    var left = goog.style.getIePixelDistance_(element, stylePrefix + "Left"), right = goog.style.getIePixelDistance_(element, stylePrefix + "Right"), top = goog.style.getIePixelDistance_(element, stylePrefix + "Top"), bottom = goog.style.getIePixelDistance_(element, stylePrefix + "Bottom");
    return new goog.math.Box(top, right, bottom, left);
  }
  left = goog.style.getComputedStyle(element, stylePrefix + "Left");
  right = goog.style.getComputedStyle(element, stylePrefix + "Right");
  top = goog.style.getComputedStyle(element, stylePrefix + "Top");
  bottom = goog.style.getComputedStyle(element, stylePrefix + "Bottom");
  return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left));
};
goog.style.getPaddingBox = function(element) {
  return goog.style.getBox_(element, "padding");
};
goog.style.getMarginBox = function(element) {
  return goog.style.getBox_(element, "margin");
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(element, prop) {
  if ("none" == goog.style.getCascadedStyle(element, prop + "Style")) {
    return 0;
  }
  var width = goog.style.getCascadedStyle(element, prop + "Width");
  return width in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[width] : goog.style.getIePixelValue_(element, width, "left", "pixelLeft");
};
goog.style.getBorderBox = function(element) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    var left = goog.style.getIePixelBorder_(element, "borderLeft"), right = goog.style.getIePixelBorder_(element, "borderRight"), top = goog.style.getIePixelBorder_(element, "borderTop"), bottom = goog.style.getIePixelBorder_(element, "borderBottom");
    return new goog.math.Box(top, right, bottom, left);
  }
  left = goog.style.getComputedStyle(element, "borderLeftWidth");
  right = goog.style.getComputedStyle(element, "borderRightWidth");
  top = goog.style.getComputedStyle(element, "borderTopWidth");
  bottom = goog.style.getComputedStyle(element, "borderBottomWidth");
  return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left));
};
goog.style.getFontFamily = function(el) {
  var doc = goog.dom.getOwnerDocument(el), font = "";
  if (doc.body.createTextRange && goog.dom.contains(doc, el)) {
    var range = doc.body.createTextRange();
    range.moveToElementText(el);
    try {
      font = range.queryCommandValue("FontName");
    } catch (e) {
      font = "";
    }
  }
  font || (font = goog.style.getStyle_(el, "fontFamily"));
  var fontsArray = font.split(",");
  1 < fontsArray.length && (font = fontsArray[0]);
  return goog.string.stripQuotes(font, "\"'");
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(value) {
  var units = value.match(goog.style.lengthUnitRegex_);
  return units && units[0] || null;
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(el) {
  var fontSize = goog.style.getStyle_(el, "fontSize"), sizeUnits = goog.style.getLengthUnits(fontSize);
  if (fontSize && "px" == sizeUnits) {
    return parseInt(fontSize, 10);
  }
  if (goog.userAgent.IE) {
    if (sizeUnits in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(el, fontSize, "left", "pixelLeft");
    }
    if (el.parentNode && el.parentNode.nodeType == goog.dom.NodeType.ELEMENT && sizeUnits in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      var parentElement = el.parentNode, parentSize = goog.style.getStyle_(parentElement, "fontSize");
      return goog.style.getIePixelValue_(parentElement, fontSize == parentSize ? "1em" : fontSize, "left", "pixelLeft");
    }
  }
  var sizeElement = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(el, sizeElement);
  fontSize = sizeElement.offsetHeight;
  goog.dom.removeNode(sizeElement);
  return fontSize;
};
goog.style.parseStyleAttribute = function(value) {
  var result = {};
  goog.array.forEach(value.split(/\s*;\s*/), function(pair) {
    var keyValue = pair.split(/\s*:\s*/);
    2 == keyValue.length && (result[goog.string.toCamelCase(keyValue[0].toLowerCase())] = keyValue[1]);
  });
  return result;
};
goog.style.toStyleAttribute = function(obj) {
  var buffer = [];
  goog.object.forEach(obj, function(value, key) {
    buffer.push(goog.string.toSelectorCase(key), ":", value, ";");
  });
  return buffer.join("");
};
goog.style.setFloat = function(el, value) {
  el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = value;
};
goog.style.getFloat = function(el) {
  return el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || "";
};
goog.style.getScrollbarWidth = function(opt_className) {
  var outerDiv = goog.dom.createElement("div");
  opt_className && (outerDiv.className = opt_className);
  outerDiv.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  var innerDiv = goog.dom.createElement("div");
  goog.style.setSize(innerDiv, "200px", "200px");
  outerDiv.appendChild(innerDiv);
  goog.dom.appendChild(goog.dom.getDocument().body, outerDiv);
  var width = outerDiv.offsetWidth - outerDiv.clientWidth;
  goog.dom.removeNode(outerDiv);
  return width;
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(element) {
  var transform = goog.style.getComputedTransform(element);
  if (!transform) {
    return new goog.math.Coordinate(0, 0);
  }
  var matches = transform.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  return matches ? new goog.math.Coordinate(parseFloat(matches[1]), parseFloat(matches[2])) : new goog.math.Coordinate(0, 0);
};
// INPUT (javascript/closure/debug/divconsole.js)
goog.debug.DivConsole = function(element) {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
  this.formatter_ = new goog.debug.HtmlFormatter;
  this.isCapturing_ = this.formatter_.showAbsoluteTime = !1;
  this.element_ = element;
  this.elementOwnerDocument_ = this.element_.ownerDocument || this.element_.document;
  this.installStyles();
};
goog.debug.DivConsole.prototype.installStyles = function() {
  goog.style.installStyles(".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}", this.element_);
  this.element_.className += " logdiv";
};
goog.debug.DivConsole.prototype.setCapturing = function(capturing) {
  if (capturing != this.isCapturing_) {
    var rootLogger = goog.debug.LogManager.getRoot();
    capturing ? rootLogger.addHandler(this.publishHandler_) : rootLogger.removeHandler(this.publishHandler_);
    this.isCapturing_ = capturing;
  }
};
goog.debug.DivConsole.prototype.addLogRecord = function(logRecord) {
  var scroll = 100 >= this.element_.scrollHeight - this.element_.scrollTop - this.element_.clientHeight, div = this.elementOwnerDocument_.createElement("div");
  div.className = "logmsg";
  div.innerHTML = this.formatter_.formatRecord(logRecord);
  this.element_.appendChild(div);
  scroll && (this.element_.scrollTop = this.element_.scrollHeight);
};
goog.debug.DivConsole.prototype.getFormatter = function() {
  return this.formatter_;
};
goog.debug.DivConsole.prototype.clear = function() {
  this.element_.innerHTML = "";
};
// INPUT (javascript/closure/log/log.js)
goog.log = {};
goog.log.ENABLED = goog.debug.LOGGING_ENABLED;
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME;
goog.log.Logger = goog.debug.Logger;
goog.log.Level = goog.debug.Logger.Level;
goog.log.LogRecord = goog.debug.LogRecord;
goog.log.getLogger = function(name, opt_level) {
  if (goog.log.ENABLED) {
    var logger = goog.debug.LogManager.getLogger(name);
    opt_level && logger && logger.setLevel(opt_level);
    return logger;
  }
  return null;
};
goog.log.addHandler = function(logger, handler) {
  goog.log.ENABLED && logger && logger.addHandler(handler);
};
goog.log.removeHandler = function(logger, handler) {
  return goog.log.ENABLED && logger ? logger.removeHandler(handler) : !1;
};
goog.log.log = function(logger, level, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.log(level, msg, opt_exception);
};
goog.log.error = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.severe(msg, opt_exception);
};
goog.log.warning = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.warning(msg, opt_exception);
};
goog.log.info = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.info(msg, opt_exception);
};
goog.log.fine = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.fine(msg, opt_exception);
};
// INPUT (javascript/closure/uri/utils.js)
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = "";
  opt_scheme && (out += opt_scheme + ":");
  opt_domain && (out += "//", opt_userInfo && (out += opt_userInfo + "@"), out += opt_domain, opt_port && (out += ":" + opt_port));
  opt_path && (out += opt_path);
  opt_queryData && (out += "?" + opt_queryData);
  opt_fragment && (out += "#" + opt_fragment);
  return out;
};
goog.uri.utils.splitRe_ = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(uri) {
  goog.uri.utils.phishingProtection_();
  return uri.match(goog.uri.utils.splitRe_);
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
  if (goog.uri.utils.needsPhishingProtection_) {
    goog.uri.utils.needsPhishingProtection_ = !1;
    var location = goog.global.location;
    if (location) {
      var href = location.href;
      if (href) {
        var domain = goog.uri.utils.getDomain(href);
        if (domain && domain != location.hostname) {
          throw goog.uri.utils.needsPhishingProtection_ = !0, Error();
        }
      }
    }
  }
};
goog.uri.utils.decodeIfPossible_ = function(uri, opt_preserveReserved) {
  return uri ? opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri) : uri;
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null;
};
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri);
};
goog.uri.utils.getEffectiveScheme = function(uri) {
  var scheme = goog.uri.utils.getScheme(uri);
  if (!scheme && self.location) {
    var protocol = self.location.protocol, scheme = protocol.substr(0, protocol.length - 1)
  }
  return scheme ? scheme.toLowerCase() : "";
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri);
};
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri));
};
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri);
};
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri), !0);
};
goog.uri.utils.getPort = function(uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null;
};
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri);
};
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri), !0);
};
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri);
};
goog.uri.utils.getFragmentEncoded = function(uri) {
  var hashIndex = uri.indexOf("#");
  return 0 > hashIndex ? null : uri.substr(hashIndex + 1);
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "");
};
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri));
};
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.removeFragment = function(uri) {
  var hashIndex = uri.indexOf("#");
  return 0 > hashIndex ? uri : uri.substr(0, hashIndex);
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1), pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  if (goog.DEBUG && (0 <= uri.indexOf("#") || 0 <= uri.indexOf("?"))) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + uri + "]");
  }
};
goog.uri.utils.appendQueryData_ = function(buffer) {
  if (buffer[1]) {
    var baseUri = buffer[0], hashIndex = baseUri.indexOf("#");
    0 <= hashIndex && (buffer.push(baseUri.substr(hashIndex)), buffer[0] = baseUri = baseUri.substr(0, hashIndex));
    var questionIndex = baseUri.indexOf("?");
    0 > questionIndex ? buffer[1] = "?" : questionIndex == baseUri.length - 1 && (buffer[1] = void 0);
  }
  return buffer.join("");
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if (goog.isArray(value)) {
    goog.asserts.assertArray(value);
    for (var j = 0;j < value.length;j++) {
      goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs);
    }
  } else {
    null != value && pairs.push("&", key, "" === value ? "" : "=", goog.string.urlEncode(value));
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(0 == Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
  for (var i = opt_startIndex || 0;i < keysAndValues.length;i += 2) {
    goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for (var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1));
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map));
};
goog.uri.utils.appendParam = function(uri, key, opt_value) {
  var paramArr = [uri, "&", key];
  goog.isDefAndNotNull(opt_value) && paramArr.push("=", goog.string.urlEncode(opt_value));
  return goog.uri.utils.appendQueryData_(paramArr);
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
  for (var index = startIndex, keyLength = keyEncoded.length;0 <= (index = uri.indexOf(keyEncoded, index)) && index < hashOrEndIndex;) {
    var precedingChar = uri.charCodeAt(index - 1);
    if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }
  return-1;
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return 0 <= goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_));
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
  if (0 > foundIndex) {
    return null;
  }
  var endPosition = uri.indexOf("&", foundIndex);
  if (0 > endPosition || endPosition > hashOrEndIndex) {
    endPosition = hashOrEndIndex;
  }
  foundIndex += keyEncoded.length + 1;
  return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex));
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), position = 0, foundIndex, result = [];0 <= (foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex));) {
    position = uri.indexOf("&", foundIndex);
    if (0 > position || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)));
  }
  return result;
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), position = 0, foundIndex, buffer = [];0 <= (foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex));) {
    buffer.push(uri.substring(position, foundIndex)), position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex);
  }
  buffer.push(uri.substr(position));
  return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1");
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value);
};
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
  goog.string.endsWith(baseUri, "/") && (baseUri = baseUri.substr(0, baseUri.length - 1));
  goog.string.startsWith(path, "/") && (path = path.substr(1));
  return goog.string.buildString(baseUri, "/", path);
};
goog.uri.utils.setPath = function(uri, path) {
  goog.string.startsWith(path, "/") || (path = "/" + path);
  var parts = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(parts[goog.uri.utils.ComponentIndex.SCHEME], parts[goog.uri.utils.ComponentIndex.USER_INFO], parts[goog.uri.utils.ComponentIndex.DOMAIN], parts[goog.uri.utils.ComponentIndex.PORT], path, parts[goog.uri.utils.ComponentIndex.QUERY_DATA], parts[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
};
// INPUT (javascript/closure/color/names.js)
goog.color = {};
goog.color.names = {aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4", azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000", blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a", burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e", coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c", cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b", 
darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b", darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc", darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b", darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3", deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969", dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0", 
forestgreen:"#228b22", fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700", goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f", grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c", indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa", lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6", lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3", 
lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a", lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899", lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32", linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa", mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370db", mediumseagreen:"#3cb371", mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a", 
mediumturquoise:"#48d1cc", mediumvioletred:"#c71585", midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5", navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000", olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6", palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#db7093", papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb", plum:"#dda0dd", powderblue:"#b0e0e6", 
purple:"#800080", red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513", salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee", sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd", slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f", steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8", tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3", white:"#ffffff", whitesmoke:"#f5f5f5", 
yellow:"#ffff00", yellowgreen:"#9acd32"};
// INPUT (javascript/closure/color/color.js)
goog.color.parse = function(str) {
  var result = {};
  str = String(str);
  var maybeHex = goog.color.prependHashIfNecessaryHelper(str);
  if (goog.color.isValidHexColor_(maybeHex)) {
    return result.hex = goog.color.normalizeHex(maybeHex), result.type = "hex", result;
  }
  var rgb = goog.color.isValidRgbColor_(str);
  if (rgb.length) {
    return result.hex = goog.color.rgbArrayToHex(rgb), result.type = "rgb", result;
  }
  if (goog.color.names) {
    var hex = goog.color.names[str.toLowerCase()];
    if (hex) {
      return result.hex = hex, result.type = "named", result;
    }
  }
  throw Error(str + " is not a valid color string");
};
goog.color.isValidColor = function(str) {
  var maybeHex = goog.color.prependHashIfNecessaryHelper(str);
  return!!(goog.color.isValidHexColor_(maybeHex) || goog.color.isValidRgbColor_(str).length || goog.color.names && goog.color.names[str.toLowerCase()]);
};
goog.color.parseRgb = function(str) {
  var rgb = goog.color.isValidRgbColor_(str);
  if (!rgb.length) {
    throw Error(str + " is not a valid RGB color");
  }
  return rgb;
};
goog.color.hexToRgbStyle = function(hexColor) {
  return goog.color.rgbStyle_(goog.color.hexToRgb(hexColor));
};
goog.color.hexTripletRe_ = /#(.)(.)(.)/;
goog.color.normalizeHex = function(hexColor) {
  if (!goog.color.isValidHexColor_(hexColor)) {
    throw Error("'" + hexColor + "' is not a valid hex color");
  }
  4 == hexColor.length && (hexColor = hexColor.replace(goog.color.hexTripletRe_, "#$1$1$2$2$3$3"));
  return hexColor.toLowerCase();
};
goog.color.hexToRgb = function(hexColor) {
  hexColor = goog.color.normalizeHex(hexColor);
  var r = parseInt(hexColor.substr(1, 2), 16), g = parseInt(hexColor.substr(3, 2), 16), b = parseInt(hexColor.substr(5, 2), 16);
  return[r, g, b];
};
goog.color.rgbToHex = function(r, g, b) {
  r = Number(r);
  g = Number(g);
  b = Number(b);
  if (isNaN(r) || 0 > r || 255 < r || isNaN(g) || 0 > g || 255 < g || isNaN(b) || 0 > b || 255 < b) {
    throw Error('"(' + r + "," + g + "," + b + '") is not a valid RGB color');
  }
  var hexR = goog.color.prependZeroIfNecessaryHelper(r.toString(16)), hexG = goog.color.prependZeroIfNecessaryHelper(g.toString(16)), hexB = goog.color.prependZeroIfNecessaryHelper(b.toString(16));
  return "#" + hexR + hexG + hexB;
};
goog.color.rgbArrayToHex = function(rgb) {
  return goog.color.rgbToHex(rgb[0], rgb[1], rgb[2]);
};
goog.color.rgbToHsl = function(r, g, b) {
  var normR = r / 255, normG = g / 255, normB = b / 255, max = Math.max(normR, normG, normB), min = Math.min(normR, normG, normB), h = 0, s = 0, l = .5 * (max + min);
  max != min && (max == normR ? h = 60 * (normG - normB) / (max - min) : max == normG ? h = 60 * (normB - normR) / (max - min) + 120 : max == normB && (h = 60 * (normR - normG) / (max - min) + 240), s = 0 < l && .5 >= l ? (max - min) / (2 * l) : (max - min) / (2 - 2 * l));
  return[Math.round(h + 360) % 360, s, l];
};
goog.color.rgbArrayToHsl = function(rgb) {
  return goog.color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
};
goog.color.hueToRgb_ = function(v1, v2, vH) {
  0 > vH ? vH += 1 : 1 < vH && (vH -= 1);
  return 1 > 6 * vH ? v1 + 6 * (v2 - v1) * vH : 1 > 2 * vH ? v2 : 2 > 3 * vH ? v1 + (v2 - v1) * (2 / 3 - vH) * 6 : v1;
};
goog.color.hslToRgb = function(h, s, l) {
  var r = 0, g = 0, b = 0, normH = h / 360;
  if (0 == s) {
    r = g = b = 255 * l;
  } else {
    var temp1 = 0, temp2 = 0, temp2 = .5 > l ? l * (1 + s) : l + s - s * l, temp1 = 2 * l - temp2, r = 255 * goog.color.hueToRgb_(temp1, temp2, normH + 1 / 3), g = 255 * goog.color.hueToRgb_(temp1, temp2, normH), b = 255 * goog.color.hueToRgb_(temp1, temp2, normH - 1 / 3)
  }
  return[Math.round(r), Math.round(g), Math.round(b)];
};
goog.color.hslArrayToRgb = function(hsl) {
  return goog.color.hslToRgb(hsl[0], hsl[1], hsl[2]);
};
goog.color.validHexColorRe_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
goog.color.isValidHexColor_ = function(str) {
  return goog.color.validHexColorRe_.test(str);
};
goog.color.normalizedHexColorRe_ = /^#[0-9a-f]{6}$/;
goog.color.isNormalizedHexColor_ = function(str) {
  return goog.color.normalizedHexColorRe_.test(str);
};
goog.color.rgbColorRe_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
goog.color.isValidRgbColor_ = function(str) {
  var regExpResultArray = str.match(goog.color.rgbColorRe_);
  if (regExpResultArray) {
    var r = Number(regExpResultArray[1]), g = Number(regExpResultArray[2]), b = Number(regExpResultArray[3]);
    if (0 <= r && 255 >= r && 0 <= g && 255 >= g && 0 <= b && 255 >= b) {
      return[r, g, b];
    }
  }
  return[];
};
goog.color.prependZeroIfNecessaryHelper = function(hex) {
  return 1 == hex.length ? "0" + hex : hex;
};
goog.color.prependHashIfNecessaryHelper = function(str) {
  return "#" == str.charAt(0) ? str : "#" + str;
};
goog.color.rgbStyle_ = function(rgb) {
  return "rgb(" + rgb.join(",") + ")";
};
goog.color.hsvToRgb = function(h, s, brightness) {
  var red = 0, green = 0, blue = 0;
  if (0 == s) {
    blue = green = red = brightness;
  } else {
    var sextant = Math.floor(h / 60), remainder = h / 60 - sextant, val1 = brightness * (1 - s), val2 = brightness * (1 - s * remainder), val3 = brightness * (1 - s * (1 - remainder));
    switch(sextant) {
      case 1:
        red = val2;
        green = brightness;
        blue = val1;
        break;
      case 2:
        red = val1;
        green = brightness;
        blue = val3;
        break;
      case 3:
        red = val1;
        green = val2;
        blue = brightness;
        break;
      case 4:
        red = val3;
        green = val1;
        blue = brightness;
        break;
      case 5:
        red = brightness;
        green = val1;
        blue = val2;
        break;
      case 6:
      ;
      case 0:
        red = brightness, green = val3, blue = val1;
    }
  }
  return[Math.floor(red), Math.floor(green), Math.floor(blue)];
};
goog.color.rgbToHsv = function(red, green, blue) {
  var max = Math.max(Math.max(red, green), blue), min = Math.min(Math.min(red, green), blue), hue, saturation, value = max;
  if (min == max) {
    saturation = hue = 0;
  } else {
    var delta = max - min;
    saturation = delta / max;
    hue = red == max ? (green - blue) / delta : green == max ? 2 + (blue - red) / delta : 4 + (red - green) / delta;
    hue *= 60;
    0 > hue && (hue += 360);
    360 < hue && (hue -= 360);
  }
  return[hue, saturation, value];
};
goog.color.rgbArrayToHsv = function(rgb) {
  return goog.color.rgbToHsv(rgb[0], rgb[1], rgb[2]);
};
goog.color.hsvArrayToRgb = function(hsv) {
  return goog.color.hsvToRgb(hsv[0], hsv[1], hsv[2]);
};
goog.color.hexToHsl = function(hex) {
  var rgb = goog.color.hexToRgb(hex);
  return goog.color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
};
goog.color.hslToHex = function(h, s, l) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(h, s, l));
};
goog.color.hslArrayToHex = function(hsl) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(hsl[0], hsl[1], hsl[2]));
};
goog.color.hexToHsv = function(hex) {
  return goog.color.rgbArrayToHsv(goog.color.hexToRgb(hex));
};
goog.color.hsvToHex = function(h, s, v) {
  return goog.color.rgbArrayToHex(goog.color.hsvToRgb(h, s, v));
};
goog.color.hsvArrayToHex = function(hsv) {
  return goog.color.hsvToHex(hsv[0], hsv[1], hsv[2]);
};
goog.color.hslDistance = function(hsl1, hsl2) {
  var sl1, sl2;
  sl1 = .5 >= hsl1[2] ? hsl1[1] * hsl1[2] : hsl1[1] * (1 - hsl1[2]);
  sl2 = .5 >= hsl2[2] ? hsl2[1] * hsl2[2] : hsl2[1] * (1 - hsl2[2]);
  var h1 = hsl1[0] / 360, h2 = hsl2[0] / 360, dh = 2 * (h1 - h2) * Math.PI;
  return(hsl1[2] - hsl2[2]) * (hsl1[2] - hsl2[2]) + sl1 * sl1 + sl2 * sl2 - 2 * sl1 * sl2 * Math.cos(dh);
};
goog.color.blend = function(rgb1, rgb2, factor) {
  factor = goog.math.clamp(factor, 0, 1);
  return[Math.round(factor * rgb1[0] + (1 - factor) * rgb2[0]), Math.round(factor * rgb1[1] + (1 - factor) * rgb2[1]), Math.round(factor * rgb1[2] + (1 - factor) * rgb2[2])];
};
goog.color.darken = function(rgb, factor) {
  var black = [0, 0, 0];
  return goog.color.blend(black, rgb, factor);
};
goog.color.lighten = function(rgb, factor) {
  var white = [255, 255, 255];
  return goog.color.blend(white, rgb, factor);
};
goog.color.highContrast = function(prime, suggestions) {
  for (var suggestionsWithDiff = [], i = 0;i < suggestions.length;i++) {
    suggestionsWithDiff.push({color:suggestions[i], diff:goog.color.yiqBrightnessDiff_(suggestions[i], prime) + goog.color.colorDiff_(suggestions[i], prime)});
  }
  suggestionsWithDiff.sort(function(a, b) {
    return b.diff - a.diff;
  });
  return suggestionsWithDiff[0].color;
};
goog.color.yiqBrightness_ = function(rgb) {
  return Math.round((299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2]) / 1E3);
};
goog.color.yiqBrightnessDiff_ = function(rgb1, rgb2) {
  return Math.abs(goog.color.yiqBrightness_(rgb1) - goog.color.yiqBrightness_(rgb2));
};
goog.color.colorDiff_ = function(rgb1, rgb2) {
  return Math.abs(rgb1[0] - rgb2[0]) + Math.abs(rgb1[1] - rgb2[1]) + Math.abs(rgb1[2] - rgb2[2]);
};
// INPUT (javascript/gviz/devel/canviz/date-tick-definition.js)
var gviz = {canviz:{}};
gviz.canviz.DateTickDefinition = {};
// INPUT (javascript/closure/math/range.js)
goog.math.Range = function(a, b) {
  this.start = a < b ? a : b;
  this.end = a < b ? b : a;
};
goog.math.Range.fromPair = function(pair) {
  goog.asserts.assert(2 == pair.length);
  return new goog.math.Range(pair[0], pair[1]);
};
goog.math.Range.prototype.clone = function() {
  return new goog.math.Range(this.start, this.end);
};
goog.math.Range.prototype.getLength = function() {
  return this.end - this.start;
};
goog.math.Range.prototype.includePoint = function(point) {
  this.start = Math.min(this.start, point);
  this.end = Math.max(this.end, point);
};
goog.math.Range.prototype.includeRange = function(range) {
  this.start = Math.min(this.start, range.start);
  this.end = Math.max(this.end, range.end);
};
goog.DEBUG && (goog.math.Range.prototype.toString = function() {
  return "[" + this.start + ", " + this.end + "]";
});
goog.math.Range.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.start == b.start && a.end == b.end : !1;
};
goog.math.Range.intersection = function(a, b) {
  var c0 = Math.max(a.start, b.start), c1 = Math.min(a.end, b.end);
  return c0 <= c1 ? new goog.math.Range(c0, c1) : null;
};
goog.math.Range.hasIntersection = function(a, b) {
  return Math.max(a.start, b.start) <= Math.min(a.end, b.end);
};
goog.math.Range.boundingRange = function(a, b) {
  return new goog.math.Range(Math.min(a.start, b.start), Math.max(a.end, b.end));
};
goog.math.Range.contains = function(a, b) {
  return a.start <= b.start && a.end >= b.end;
};
goog.math.Range.containsPoint = function(range, p) {
  return range.start <= p && range.end >= p;
};
// INPUT (javascript/gviz/devel/graphics/dom-structure.js)
gviz.graphics = {};
// INPUT (javascript/gviz/devel/graphics/logical-name.js)
gviz.graphics.logicalname = {};
gviz.graphics.logicalname.LOGICAL_NAME_ATTRIBUTE_ = "logicalname";
gviz.graphics.logicalname.DEFAULT_NAME = "_default_";
gviz.graphics.logicalname.setLogicalName = function(element, name) {
  element && (element[gviz.graphics.logicalname.LOGICAL_NAME_ATTRIBUTE_] = name);
};
gviz.graphics.logicalname.getLogicalName = function(element) {
  var namedElement = goog.dom.getAncestor(element, function(e) {
    return goog.isDefAndNotNull(e[gviz.graphics.logicalname.LOGICAL_NAME_ATTRIBUTE_]);
  }, !0);
  return namedElement ? namedElement[gviz.graphics.logicalname.LOGICAL_NAME_ATTRIBUTE_] : gviz.graphics.logicalname.DEFAULT_NAME;
};
// INPUT (javascript/gviz/devel/graphics/util.js)
gviz.graphics.util = {};
gviz.graphics.util.NO_COLOR = "none";
gviz.graphics.util.parseColor = function(color) {
  return color == gviz.graphics.util.NO_COLOR || "" == color || "transparent" == color ? gviz.graphics.util.NO_COLOR : goog.color.parse(color).hex;
};
gviz.graphics.util.grayOutColor = function(color) {
  if (color == gviz.graphics.util.NO_COLOR) {
    return gviz.graphics.util.NO_COLOR;
  }
  var colorRgb = goog.color.hexToRgb(color), value = Math.round((colorRgb[0] + colorRgb[1] + colorRgb[2]) / 3);
  return goog.color.rgbToHex(value, value, value);
};
gviz.graphics.util.createBoldTextStyle = function(textStyle, defaultBold) {
  textStyle = goog.object.clone(textStyle);
  goog.isDefAndNotNull(textStyle.bold) || (textStyle.bold = defaultBold);
  return textStyle;
};
gviz.graphics.util.createDom = function(domHelper, definition) {
  var element = domHelper.createDom(definition.name, definition.properties);
  domHelper.setProperties(element, {style:definition.style});
  if (goog.isDefAndNotNull(definition.content)) {
    var childrenDef = goog.isArray(definition.content) ? definition.content : [definition.content];
    goog.array.forEach(childrenDef, function(childDef) {
      if (goog.isString(childDef)) {
        domHelper.appendChild(element, domHelper.createTextNode(childDef));
      } else {
        var child;
        child = goog.isString(childDef.content) && childDef.rawHtml ? domHelper.htmlToDocumentFragment(childDef.content) : gviz.graphics.util.createDom(domHelper, childDef);
        domHelper.appendChild(element, child);
      }
    });
  }
  goog.isDefAndNotNull(definition.id) && gviz.graphics.logicalname.setLogicalName(element, definition.id);
  return element;
};
// INPUT (javascript/gviz/devel/jsapi/common/util.js)
gviz.util = {};
gviz.util.roughlyEquals = function(a, b, opt_threshold) {
  var threshold = goog.isDefAndNotNull(opt_threshold) ? opt_threshold : 1E-5;
  goog.asserts.assert(0 <= threshold);
  return a == b || Math.abs(a - b) <= threshold;
};
gviz.util.deepExtend = function(target, var_args) {
  target = target || {};
  if (2 == arguments.length) {
    var other = arguments[1], p;
    for (p in other) {
      if (goog.isArray(other[p])) {
        target[p] = goog.array.clone(other[p]);
      } else {
        if ("object" === typeof target[p] && null != target[p]) {
          target[p] = gviz.util.deepExtend(target[p], other[p]);
        } else {
          if ("object" === typeof other[p] && null != other[p]) {
            target[p] = gviz.util.deepExtend({}, other[p]);
          } else {
            if (null == target[p] || null != other[p]) {
              target[p] = other[p];
            }
          }
        }
      }
    }
  } else {
    if (2 < arguments.length) {
      for (var i = 1, leni = arguments.length;i < leni;i++) {
        target = gviz.util.deepExtend(target, arguments[i]);
      }
    }
  }
  return target;
};
gviz.util.blendHexColors = function(color1, color2, factor) {
  return color1 && color1 != gviz.graphics.util.NO_COLOR ? color2 && color2 != gviz.graphics.util.NO_COLOR ? goog.color.rgbArrayToHex(goog.color.blend(goog.color.hexToRgb(color1), goog.color.hexToRgb(color2), factor)) : color1 : color2;
};
gviz.util.extendRangeToInclude = function(range, value) {
  if (!goog.isDefAndNotNull(value)) {
    return range;
  }
  var valueRange = new goog.math.Range(value, value);
  return range ? goog.math.Range.boundingRange(range, valueRange) : valueRange;
};
gviz.util.getOverridenRange = function(range, min, max) {
  var newMin = goog.isDefAndNotNull(min) ? min : range && goog.isDefAndNotNull(max) && max < range.start ? max : range ? range.start : null, newMax = goog.isDefAndNotNull(max) ? max : range && goog.isDefAndNotNull(min) && min > range.end ? min : range ? range.end : null;
  return goog.isDefAndNotNull(newMin) && goog.isDefAndNotNull(newMax) ? new goog.math.Range(newMin, newMax) : null;
};
gviz.util.calcBoundingBox = function(boxes) {
  if (0 == boxes.length) {
    return null;
  }
  for (var boundingBox = boxes[0].clone(), i = 1;i < boxes.length;i++) {
    boundingBox.expandToInclude(boxes[i]);
  }
  return boundingBox;
};
gviz.util.findClosestValue = function(arr, val) {
  goog.asserts.assert(!goog.array.isEmpty(arr));
  var i = goog.array.binarySearch(arr, val);
  if (0 <= i) {
    return val;
  }
  i = -(i + 1);
  if (0 == i) {
    return arr[0];
  }
  if (i == arr.length) {
    return goog.array.peek(arr);
  }
  var a = arr[i - 1], b = arr[i];
  return Math.abs(val - a) <= Math.abs(val - b) ? a : b;
};
// INPUT (javascript/gviz/devel/graphics/pattern.js)
gviz.graphics.Pattern = function(style, color, opt_bgcolor) {
  this.style_ = style;
  this.color_ = gviz.graphics.util.parseColor(color);
  var bgcolor = goog.isDefAndNotNull(opt_bgcolor) ? opt_bgcolor : "#ffffff";
  this.bgcolor_ = gviz.graphics.util.parseColor(bgcolor);
};
gviz.graphics.Pattern.Style = {PRIMARY_DIAGONAL_STRIPES:"primarydiagonalstripes", SECONDARY_DIAGONAL_STRIPES:"secondarydiagonalstripes"};
gviz.graphics.Pattern.prototype.getStyle = function() {
  return this.style_;
};
gviz.graphics.Pattern.prototype.getColor = function() {
  return this.color_;
};
gviz.graphics.Pattern.prototype.getBackgroundColor = function() {
  return this.bgcolor_;
};
gviz.graphics.Pattern.prototype.clone = function() {
  var newPattern = new gviz.graphics.Pattern(this.style_, this.color_, this.bgcolor_);
  return newPattern;
};
gviz.graphics.Pattern.prototype.grayOut = function() {
  var newPattern = new gviz.graphics.Pattern(this.style_, gviz.graphics.util.grayOutColor(this.color_), gviz.graphics.util.grayOutColor(this.bgcolor_));
  return newPattern;
};
gviz.graphics.Pattern.equals = function(a, b) {
  return a === b ? !0 : null == a || null == b ? !1 : a.bgcolor_ == b.bgcolor_ && a.color_ == b.color_ && a.style_ == b.style_;
};
// INPUT (javascript/gviz/devel/graphics/brush.js)
gviz.graphics.Brush = function(opt_brushProps) {
  var brushProps = opt_brushProps || {};
  this.fill_ = gviz.graphics.util.NO_COLOR;
  goog.isDefAndNotNull(brushProps.fill) && this.setFill(brushProps.fill);
  this.fillOpacity_ = gviz.graphics.Brush.DEFAULT_FILL_OPACITY;
  goog.isDefAndNotNull(brushProps.fillOpacity) && this.setFillOpacity(brushProps.fillOpacity);
  this.stroke_ = gviz.graphics.util.NO_COLOR;
  goog.isDefAndNotNull(brushProps.stroke) && this.setStroke(brushProps.stroke);
  this.strokeWidth_ = gviz.graphics.Brush.DEFAULT_STROKE_WIDTH;
  goog.isDefAndNotNull(brushProps.strokeWidth) && this.setStrokeWidth(brushProps.strokeWidth);
  this.strokeOpacity_ = gviz.graphics.Brush.DEFAULT_STROKE_OPACITY;
  goog.isDefAndNotNull(brushProps.strokeOpacity) && this.setStrokeOpacity(brushProps.strokeOpacity);
  this.strokeDashStyle_ = gviz.graphics.Brush.DEFAULT_STROKE_DASH_STYLE;
  goog.isDefAndNotNull(brushProps.strokeDashStyle) && this.setStrokeDashStyle(brushProps.strokeDashStyle);
  this.radiusX_ = goog.isDefAndNotNull(brushProps.rx) ? brushProps.rx : null;
  this.radiusY_ = goog.isDefAndNotNull(brushProps.ry) ? brushProps.ry : null;
  this.gradient_ = null;
  brushProps.gradient && (this.gradient_ = goog.object.clone(brushProps.gradient), this.gradient_.color1 = gviz.graphics.util.parseColor(this.gradient_.color1), this.gradient_.color2 = gviz.graphics.util.parseColor(this.gradient_.color2));
  this.pattern_ = null;
  brushProps.pattern && this.setPattern(brushProps.pattern);
  this.shadow_ = null;
};
gviz.graphics.Brush.prototype.getProperties = function() {
  return{fill:this.getFill(), fillOpacity:this.getFillOpacity(), stroke:this.getStroke(), strokeWidth:this.getStrokeWidth(), strokeOpacity:this.getStrokeOpacity(), strokeDashStyle:this.getStrokeDashStyle(), rx:this.getRadiusX(), ry:this.getRadiusY(), gradient:goog.object.unsafeClone(this.getGradient()), pattern:goog.object.unsafeClone(this.getPattern())};
};
gviz.graphics.Brush.prototype.toJSON = function() {
  var gradient = this.gradient_ || null;
  gradient && (gradient = {color1:gradient.color1, color2:gradient.color2, opacity1:gradient.opacity1, opacity2:gradient.opacity2, x1:gradient.x1, y1:gradient.y1, x2:gradient.x2, y2:gradient.y2, useObjectBoundingBoxUnits:gradient.useObjectBoundingBoxUnits, sharpTransition:gradient.sharpTransition});
  var pattern = this.getPattern() || null;
  pattern && (pattern = {style:pattern.getStyle(), color:pattern.getColor(), bgcolor:pattern.getBackgroundColor()});
  var ret = {fill:this.getFill(), fillOpacity:this.getFillOpacity(), stroke:this.getStroke(), strokeWidth:this.getStrokeWidth(), strokeOpacity:this.getStrokeOpacity(), strokeDashStyle:this.getStrokeDashStyle(), rx:this.getRadiusX(), ry:this.getRadiusY(), gradient:gradient, pattern:pattern};
  return "undefined" !== typeof JSON && JSON.stringify ? JSON.stringify(ret) : goog.json.serialize(ret);
};
gviz.graphics.Brush.prototype.clone = function() {
  return new gviz.graphics.Brush(this.getProperties());
};
gviz.graphics.Brush.prototype.grayOut = function() {
  var newBrush = this.clone();
  newBrush.setFill(gviz.graphics.util.grayOutColor(this.fill_));
  newBrush.setStroke(gviz.graphics.util.grayOutColor(this.stroke_));
  if (this.gradient_) {
    var newGradient = goog.object.clone(this.gradient_);
    newGradient.color1 = gviz.graphics.util.grayOutColor(this.gradient_.color1);
    newGradient.color2 = gviz.graphics.util.grayOutColor(this.gradient_.color2);
    newBrush.gradient = newGradient;
  }
  this.pattern_ && newBrush.setPattern(this.pattern_.grayOut());
  return newBrush;
};
gviz.graphics.Brush.DEFAULT_STROKE_WIDTH = 1;
gviz.graphics.Brush.DEFAULT_STROKE_OPACITY = 1;
gviz.graphics.Brush.StrokeDashStyleType = {SOLID:"solid", DASH:"dash"};
gviz.graphics.Brush.DEFAULT_STROKE_DASH_STYLE = gviz.graphics.Brush.StrokeDashStyleType.SOLID;
gviz.graphics.Brush.DEFAULT_FILL_OPACITY = 1;
gviz.graphics.Brush.isTransparent_ = function(color) {
  return!goog.isDefAndNotNull(color) || color == gviz.graphics.util.NO_COLOR;
};
gviz.graphics.Brush.prototype.setFill = function(fill) {
  this.fill_ = gviz.graphics.util.parseColor(fill);
};
gviz.graphics.Brush.prototype.getFill = function() {
  return this.fill_;
};
gviz.graphics.Brush.prototype.setFillOpacity = function(fillOpacity) {
  this.fillOpacity_ = goog.math.clamp(fillOpacity, 0, 1);
};
gviz.graphics.Brush.prototype.getFillOpacity = function() {
  return this.fillOpacity_;
};
gviz.graphics.Brush.prototype.setStroke = function(stroke, opt_strokeWidth) {
  this.stroke_ = gviz.graphics.util.parseColor(stroke);
  goog.isDefAndNotNull(opt_strokeWidth) && this.setStrokeWidth(opt_strokeWidth);
};
gviz.graphics.Brush.prototype.getStroke = function() {
  return this.stroke_;
};
gviz.graphics.Brush.prototype.setStrokeWidth = function(strokeWidth) {
  this.strokeWidth_ = strokeWidth;
};
gviz.graphics.Brush.prototype.getStrokeWidth = function() {
  return this.strokeWidth_;
};
gviz.graphics.Brush.prototype.getVisibleStrokeWidth = function() {
  return this.hasStroke() ? this.getStrokeWidth() : 0;
};
gviz.graphics.Brush.prototype.setStrokeOpacity = function(strokeOpacity) {
  this.strokeOpacity_ = goog.math.clamp(strokeOpacity, 0, 1);
};
gviz.graphics.Brush.prototype.getStrokeOpacity = function() {
  return this.strokeOpacity_;
};
gviz.graphics.Brush.prototype.setStrokeDashStyle = function(strokeDashStyle) {
  this.strokeDashStyle_ = strokeDashStyle;
};
gviz.graphics.Brush.prototype.getStrokeDashStyle = function() {
  return this.strokeDashStyle_;
};
gviz.graphics.Brush.prototype.setGradient = function(gradient) {
  this.gradient_ = gradient;
};
gviz.graphics.Brush.prototype.getGradient = function() {
  return this.gradient_;
};
gviz.graphics.Brush.prototype.setPattern = function(pattern) {
  this.pattern_ = pattern;
};
gviz.graphics.Brush.prototype.getPattern = function() {
  return this.pattern_;
};
gviz.graphics.Brush.prototype.getRadiusX = function() {
  return this.radiusX_;
};
gviz.graphics.Brush.prototype.getRadiusY = function() {
  return this.radiusY_;
};
gviz.graphics.Brush.prototype.hasShadow = function() {
  return null != this.shadow_;
};
gviz.graphics.Brush.prototype.setShadow = function(shadow) {
  this.shadow_ = shadow;
};
gviz.graphics.Brush.prototype.getShadow = function() {
  return this.shadow_;
};
gviz.graphics.Brush.prototype.hasFill = function() {
  return 0 < this.fillOpacity_ && (!gviz.graphics.Brush.isTransparent_(this.fill_) || goog.isDefAndNotNull(this.gradient_) || goog.isDefAndNotNull(this.pattern_));
};
gviz.graphics.Brush.prototype.hasStroke = function() {
  return 0 < this.strokeWidth_ && 0 < this.strokeOpacity_ && !gviz.graphics.Brush.isTransparent_(this.stroke_);
};
gviz.graphics.Brush.prototype.strokeHasDashStyle = function() {
  return this.strokeDashStyle_ != gviz.graphics.Brush.StrokeDashStyleType.SOLID;
};
gviz.graphics.Brush.prototype.isTransparent = function() {
  return!this.hasFill() && !this.hasStroke();
};
gviz.graphics.Brush.prototype.isFillOpaque = function() {
  return this.hasFill() && 1 <= this.fillOpacity_;
};
gviz.graphics.Brush.prototype.isStrokeOpaque = function() {
  return this.hasStroke() && 1 <= this.strokeOpacity_;
};
gviz.graphics.Brush.TRANSPARENT_BRUSH = new gviz.graphics.Brush({fillOpacity:0, fill:"white", strokeOpacity:0, stroke:"white"});
gviz.graphics.Brush.createFillBrush = function(color, opt_opacity) {
  var opacity = goog.isDefAndNotNull(opt_opacity) ? opt_opacity : 1;
  return new gviz.graphics.Brush({stroke:"none", fill:color, fillOpacity:opacity});
};
gviz.graphics.Brush.createStrokeBrush = function(color, width, opt_whiteFill, opt_opacity) {
  var whiteFill = goog.isDefAndNotNull(opt_whiteFill) ? opt_whiteFill : !1;
  return new gviz.graphics.Brush({stroke:color, strokeWidth:width, strokeOpacity:goog.isDefAndNotNull(opt_opacity) ? opt_opacity : 1, fill:whiteFill ? "#fff" : "none"});
};
gviz.graphics.Brush.blendFills = function(foreBrush, backBrush) {
  return foreBrush.isFillOpaque() ? foreBrush.getFill() : backBrush.isFillOpaque() ? foreBrush.hasFill() ? gviz.util.blendHexColors(foreBrush.getFill(), backBrush.getFill(), foreBrush.getFillOpacity()) : backBrush.getFill() : null;
};
gviz.graphics.Brush.equals = function(a, b) {
  return a === b ? !0 : null == a || null == b ? !1 : a.fill_ == b.fill_ && a.fillOpacity_ == b.fillOpacity_ && a.stroke_ == b.stroke_ && a.strokeWidth_ == b.strokeWidth_ && a.strokeOpacity_ == b.strokeOpacity_ && a.strokeDashStyle_ == b.strokeDashStyle_ && a.radiusX_ == b.radiusX_ && a.radiusY_ == b.radiusY_ && gviz.graphics.Brush.gradientEquals(a.gradient, b.gradient) && gviz.graphics.Pattern.equals(a.pattern_, b.pattern_);
};
gviz.graphics.Brush.gradientEquals = function(a, b) {
  return a === b ? !0 : null == a || null == b ? !1 : a.color1 == b.color1 && a.color2 == b.color2 && a.x1 == b.x1 && a.y1 == b.y1 && a.x2 == b.x2 && a.y2 == b.y2 && a.useObjectBoundingBoxUnits === b.useObjectBoundingBoxUnits;
};
// INPUT (javascript/gviz/devel/graphics/text-style.js)
gviz.graphics.TextStyleToJSON = function(textStyle) {
  var ret = {fontName:textStyle.fontName, fontSize:textStyle.fontSize, color:textStyle.color, auraColor:textStyle.auraColor, bold:textStyle.bold, italic:textStyle.italic, underline:textStyle.underline};
  return "undefined" !== typeof JSON && JSON.stringify ? JSON.stringify(ret) : goog.json.serialize(ret);
};
// INPUT (javascript/closure/i18n/datetimesymbols.js)
goog.i18n = {};
goog.i18n.DateTimeSymbols_en_ISO = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, y MMMM dd", "y MMMM d", "y MMM d", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss v", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_af = {ERAS:["v.C.", "n.C."], ERANAMES:["voor Christus", "na Christus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "), STANDALONEWEEKDAYS:"Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "), SHORTWEEKDAYS:"So Ma Di Wo Do Vr Sa".split(" "), STANDALONESHORTWEEKDAYS:"So Ma Di Wo Do Vr Sa".split(" "), NARROWWEEKDAYS:"SMDWDVS".split(""), STANDALONENARROWWEEKDAYS:"SMDWDVS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1ste kwartaal", "2de kwartaal", "3de kwartaal", "4de kwartaal"], AMPMS:["vm.", "nm."], DATEFORMATS:["EEEE dd MMMM y", 
"dd MMMM y", "dd MMM y", "y-MM-dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_am = {ERAS:["\u12d3/\u12d3", "\u12d3/\u121d"], ERANAMES:["\u12d3\u1218\u1270 \u12d3\u1208\u121d", "\u12d3\u1218\u1270 \u121d\u1215\u1228\u1275"], NARROWMONTHS:"\u1303\u134c\u121b\u12a4\u121c\u1301\u1301\u12a6\u1234\u12a6\u1296\u12f2".split(""), STANDALONENARROWMONTHS:"\u1303\u134c\u121b\u12a4\u121c\u1301\u1301\u12a6\u1234\u12a6\u1296\u12f2".split(""), MONTHS:"\u1303\u1295\u12e9\u12c8\u122a \u134c\u1265\u1229\u12c8\u122a \u121b\u122d\u127d \u12a4\u1355\u122a\u120d \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235\u1275 \u1234\u1355\u1274\u121d\u1260\u122d \u12a6\u12ad\u1270\u12cd\u1260\u122d \u1296\u126c\u121d\u1260\u122d \u12f2\u1234\u121d\u1260\u122d".split(" "), 
STANDALONEMONTHS:"\u1303\u1295\u12e9\u12c8\u122a \u134c\u1265\u1229\u12c8\u122a \u121b\u122d\u127d \u12a4\u1355\u122a\u120d \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235\u1275 \u1234\u1355\u1274\u121d\u1260\u122d \u12a6\u12ad\u1276\u1260\u122d \u1296\u126c\u121d\u1260\u122d \u12f2\u1234\u121d\u1260\u122d".split(" "), SHORTMONTHS:"\u1303\u1295\u12e9 \u134c\u1265\u1229 \u121b\u122d\u127d \u12a4\u1355\u122a \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235 \u1234\u1355\u1274 \u12a6\u12ad\u1270 \u1296\u126c\u121d \u12f2\u1234\u121d".split(" "), 
STANDALONESHORTMONTHS:"\u1303\u1295\u12e9 \u134c\u1265\u1229 \u121b\u122d\u127d \u12a4\u1355\u122a \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235 \u1234\u1355\u1274 \u12a6\u12ad\u1276 \u1296\u126c\u121d \u12f2\u1234\u121d".split(" "), WEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230\u129e \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), STANDALONEWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230\u129e \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), 
SHORTWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230 \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), STANDALONESHORTWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230 \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), NARROWWEEKDAYS:"\u12a5\u1230\u121b\u1228\u1210\u12d3\u1245".split(""), STANDALONENARROWWEEKDAYS:"\u12a5\u1230\u121b\u1228\u1210\u12d3\u1245".split(""), SHORTQUARTERS:["\u1229\u12651", 
"\u1229\u12652", "\u1229\u12653", "\u1229\u12654"], QUARTERS:["1\u129b\u12cd \u1229\u1265", "\u1201\u1208\u1270\u129b\u12cd \u1229\u1265", "3\u129b\u12cd \u1229\u1265", "4\u129b\u12cd \u1229\u1265"], AMPMS:["\u1325\u12cb\u1275", "\u12a8\u1230\u12d3\u1275"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ar = {ZERODIGIT:1632, ERAS:["\u0642.\u0645", "\u0645"], ERANAMES:["\u0642\u0628\u0644 \u0627\u0644\u0645\u064a\u0644\u0627\u062f", "\u0645\u064a\u0644\u0627\u062f\u064a"], NARROWMONTHS:"\u064a\u0641\u0645\u0623\u0648\u0646\u0644\u063a\u0633\u0643\u0628\u062f".split(""), STANDALONENARROWMONTHS:"\u064a\u0641\u0645\u0623\u0648\u0646\u0644\u063a\u0633\u0643\u0628\u062f".split(""), MONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), 
STANDALONEWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), SHORTWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), NARROWWEEKDAYS:"\u062d\u0646\u062b\u0631\u062e\u062c\u0633".split(""), STANDALONENARROWWEEKDAYS:"\u062d\u0646\u062b\u0631\u062e\u062c\u0633".split(""), SHORTQUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", 
"\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], QUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], 
AMPMS:["\u0635", "\u0645"], DATEFORMATS:["EEEE\u060c d MMMM\u060c y", "d MMMM\u060c y", "dd\u200f/MM\u200f/y", "d\u200f/M\u200f/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:5, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:4};
goog.i18n.DateTimeSymbols_az = {ERAS:["e.\u0259.", "b.e."], ERANAMES:["eram\u0131zdan \u0259vv\u0259l", "bizim eram\u0131z\u0131n"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"yanvar fevral mart aprel may iyun iyul avqust sentyabr oktyabr noyabr dekabr".split(" "), STANDALONEMONTHS:"Yanvar Fevral Mart Aprel May \u0130yun \u0130yul Avqust Sentyabr Oktyabr Noyabr Dekabr".split(" "), SHORTMONTHS:"yan fev mar apr may iyn iyl avq sen okt noy dek".split(" "), 
STANDALONESHORTMONTHS:"yan fev mar apr may iyn iyl avq sen okt noy dek".split(" "), WEEKDAYS:"bazar;bazar ert\u0259si;\u00e7\u0259r\u015f\u0259nb\u0259 ax\u015fam\u0131;\u00e7\u0259r\u015f\u0259nb\u0259;c\u00fcm\u0259 ax\u015fam\u0131;c\u00fcm\u0259;\u015f\u0259nb\u0259".split(";"), STANDALONEWEEKDAYS:"bazar;bazar ert\u0259si;\u00e7\u0259r\u015f\u0259nb\u0259 ax\u015fam\u0131;\u00e7\u0259r\u015f\u0259nb\u0259;c\u00fcm\u0259 ax\u015fam\u0131;c\u00fcm\u0259;\u015f\u0259nb\u0259".split(";"), SHORTWEEKDAYS:"B. B.E. \u00c7.A. \u00c7. C.A. C \u015e.".split(" "), 
STANDALONESHORTWEEKDAYS:"B. B.E. \u00c7.A. \u00c7. C.A. C \u015e.".split(" "), NARROWWEEKDAYS:"7123456".split(""), STANDALONENARROWWEEKDAYS:"7123456".split(""), SHORTQUARTERS:["1-ci kv.", "2-ci kv.", "3-c\u00fc kv.", "4-c\u00fc kv."], QUARTERS:["1-ci kvartal", "2-ci kvartal", "3-c\u00fc kvartal", "4-c\u00fc kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["d MMMM y, EEEE", "d MMMM y", "d MMM y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", 
"{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_bg = {ERAS:["\u043f\u0440.\u0425\u0440.", "\u0441\u043b.\u0425\u0440."], ERANAMES:["\u043f\u0440.\u0425\u0440.", "\u0441\u043b.\u0425\u0440."], NARROWMONTHS:"\u044f\u0444\u043c\u0430\u043c\u044e\u044e\u0430\u0441\u043e\u043d\u0434".split(""), STANDALONENARROWMONTHS:"\u044f\u0444\u043c\u0430\u043c\u044e\u044e\u0430\u0441\u043e\u043d\u0434".split(""), MONTHS:"\u044f\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), 
STANDALONEMONTHS:"\u044f\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), SHORTMONTHS:"\u044f\u043d. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442 \u0430\u043f\u0440. \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u044f\u043d. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442 \u0430\u043f\u0440. \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), WEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u044f\u0434\u0430 \u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a \u043f\u0435\u0442\u044a\u043a \u0441\u044a\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u044f\u0434\u0430 \u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a \u043f\u0435\u0442\u044a\u043a \u0441\u044a\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u043d\u0434 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u043d\u0434 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), 
NARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), STANDALONENARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), SHORTQUARTERS:["1 \u0442\u0440\u0438\u043c.", "2 \u0442\u0440\u0438\u043c.", "3 \u0442\u0440\u0438\u043c.", "4 \u0442\u0440\u0438\u043c."], QUARTERS:["1-\u0432\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "2-\u0440\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "3-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", 
"4-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435"], AMPMS:["\u043f\u0440.\u043e\u0431.", "\u0441\u043b.\u043e\u0431."], DATEFORMATS:["EEEE, d MMMM y '\u0433'.", "d MMMM y '\u0433'.", "d.MM.y '\u0433'.", "d.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_bn = {ZERODIGIT:2534, ERAS:["\u0996\u09cd\u09b0\u09bf\u09b8\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], ERANAMES:["\u0996\u09cd\u09b0\u09bf\u09b8\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], NARROWMONTHS:"\u099c\u09be \u09ab\u09c7 \u09ae\u09be \u098f \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1 \u0986 \u09b8\u09c7 \u0985 \u09a8 \u09a1\u09bf".split(" "), STANDALONENARROWMONTHS:"\u099c\u09be \u09ab\u09c7 \u09ae\u09be \u098f \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1 \u0986 \u09b8\u09c7 \u0985 \u09a8 \u09a1\u09bf".split(" "), 
MONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
STANDALONEMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
SHORTMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
STANDALONESHORTMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
WEEKDAYS:"\u09b0\u09ac\u09bf\u09ac\u09be\u09b0 \u09b8\u09cb\u09ae\u09ac\u09be\u09b0 \u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0 \u09ac\u09c1\u09a7\u09ac\u09be\u09b0 \u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0 \u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b6\u09a8\u09bf\u09ac\u09be\u09b0".split(" "), STANDALONEWEEKDAYS:"\u09b0\u09ac\u09bf\u09ac\u09be\u09b0 \u09b8\u09cb\u09ae\u09ac\u09be\u09b0 \u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0 \u09ac\u09c1\u09a7\u09ac\u09be\u09b0 \u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0 \u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b6\u09a8\u09bf\u09ac\u09be\u09b0".split(" "), 
SHORTWEEKDAYS:"\u09b0\u09ac\u09bf \u09b8\u09cb\u09ae \u09ae\u0999\u09cd\u0997\u09b2 \u09ac\u09c1\u09a7 \u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf \u09b6\u09c1\u0995\u09cd\u09b0 \u09b6\u09a8\u09bf".split(" "), STANDALONESHORTWEEKDAYS:"\u09b0\u09ac\u09bf \u09b8\u09cb\u09ae \u09ae\u0999\u09cd\u0997\u09b2 \u09ac\u09c1\u09a7 \u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf \u09b6\u09c1\u0995\u09cd\u09b0 \u09b6\u09a8\u09bf".split(" "), NARROWWEEKDAYS:"\u09b0 \u09b8\u09cb \u09ae \u09ac\u09c1 \u09ac\u09c3 \u09b6\u09c1 \u09b6".split(" "), 
STANDALONENARROWWEEKDAYS:"\u09b0 \u09b8\u09cb \u09ae \u09ac\u09c1 \u09ac\u09c3 \u09b6\u09c1 \u09b6".split(" "), SHORTQUARTERS:["\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e7", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e8", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e9", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09ea"], QUARTERS:["\u09aa\u09cd\u09b0\u09a5\u09ae \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", 
"\u09a4\u09c3\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5 \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:4, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_br = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"Genver C\u02bchwevrer Meurzh Ebrel Mae Mezheven Gouere Eost Gwengolo Here Du Kerzu".split(" "), STANDALONEMONTHS:"Genver C\u02bchwevrer Meurzh Ebrel Mae Mezheven Gouere Eost Gwengolo Here Du Kerzu".split(" "), SHORTMONTHS:"Gen C\u02bchwe Meur Ebr Mae Mezh Goue Eost Gwen Here Du Ker".split(" "), STANDALONESHORTMONTHS:"Gen C\u02bchwe Meur Ebr Mae Mezh Goue Eost Gwen Here Du Ker".split(" "), 
WEEKDAYS:"Sul Lun Meurzh Merc\u02bcher Yaou Gwener Sadorn".split(" "), STANDALONEWEEKDAYS:"Sul Lun Meurzh Merc\u02bcher Yaou Gwener Sadorn".split(" "), SHORTWEEKDAYS:"sul lun meu. mer. yaou gwe. sad.".split(" "), STANDALONESHORTWEEKDAYS:"sul lun meu. mer. yaou gwe. sad.".split(" "), NARROWWEEKDAYS:"su lu mz mc ya gw sa".split(" "), STANDALONENARROWWEEKDAYS:"su lu mz mc ya gw sa".split(" "), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["AM", "PM"], DATEFORMATS:["y MMMM d, EEEE", 
"y MMMM d", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ca = {ERAS:["aC", "dC"], ERANAMES:["abans de Crist", "despr\u00e9s de Crist"], NARROWMONTHS:"GN FB M\u00c7 AB MG JN JL AG ST OC NV DS".split(" "), STANDALONENARROWMONTHS:"GN FB M\u00c7 AB MG JN JL AG ST OC NV DS".split(" "), MONTHS:"gener febrer mar\u00e7 abril maig juny juliol agost setembre octubre novembre desembre".split(" "), STANDALONEMONTHS:"gener febrer mar\u00e7 abril maig juny juliol agost setembre octubre novembre desembre".split(" "), SHORTMONTHS:"gen. feb. mar\u00e7 abr. maig juny jul. ag. set. oct. nov. des.".split(" "), 
STANDALONESHORTMONTHS:"gen. feb. mar\u00e7 abr. maig juny jul. ag. set. oct. nov. des.".split(" "), WEEKDAYS:"diumenge dilluns dimarts dimecres dijous divendres dissabte".split(" "), STANDALONEWEEKDAYS:"diumenge dilluns dimarts dimecres dijous divendres dissabte".split(" "), SHORTWEEKDAYS:"dg. dl. dt. dc. dj. dv. ds.".split(" "), STANDALONESHORTWEEKDAYS:"dg. dl. dt. dc. dj. dv. ds.".split(" "), NARROWWEEKDAYS:"dg dl dt dc dj dv ds".split(" "), STANDALONENARROWWEEKDAYS:"dg dl dt dc dj dv ds".split(" "), 
SHORTQUARTERS:["1T", "2T", "3T", "4T"], QUARTERS:["1r trimestre", "2n trimestre", "3r trimestre", "4t trimestre"], AMPMS:["a. m.", "p. m."], DATEFORMATS:["EEEE, d MMMM 'de' y", "d MMMM 'de' y", "dd/MM/y", "d/M/yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_chr = {ERAS:["\u13a4\u13d3\u13b7\u13b8", "\u13a4\u13b6\u13d0\u13c5"], ERANAMES:["\u13cf \u13e5\u13cc \u13be\u13d5\u13b2\u13cd\u13ac\u13be", "\u13a0\u13a9\u13c3\u13ae\u13b5\u13d3\u13cd\u13d7\u13f1 \u13a0\u13d5\u13d8\u13f1\u13cd\u13ac \u13f1\u13b0\u13e9 \u13e7\u13d3\u13c2\u13b8\u13a2\u13cd\u13d7"], NARROWMONTHS:"\u13a4\u13a7\u13a0\u13a7\u13a0\u13d5\u13ab\u13a6\u13da\u13da\u13c5\u13a5".split(""), STANDALONENARROWMONTHS:"\u13a4\u13a7\u13a0\u13a7\u13a0\u13d5\u13ab\u13a6\u13da\u13da\u13c5\u13a5".split(""), 
MONTHS:"\u13a4\u13c3\u13b8\u13d4\u13c5 \u13a7\u13a6\u13b5 \u13a0\u13c5\u13f1 \u13a7\u13ec\u13c2 \u13a0\u13c2\u13cd\u13ac\u13d8 \u13d5\u13ad\u13b7\u13f1 \u13ab\u13f0\u13c9\u13c2 \u13a6\u13b6\u13c2 \u13da\u13b5\u13cd\u13d7 \u13da\u13c2\u13c5\u13d7 \u13c5\u13d3\u13d5\u13c6 \u13a5\u13cd\u13a9\u13f1".split(" "), STANDALONEMONTHS:"\u13a4\u13c3\u13b8\u13d4\u13c5 \u13a7\u13a6\u13b5 \u13a0\u13c5\u13f1 \u13a7\u13ec\u13c2 \u13a0\u13c2\u13cd\u13ac\u13d8 \u13d5\u13ad\u13b7\u13f1 \u13ab\u13f0\u13c9\u13c2 \u13a6\u13b6\u13c2 \u13da\u13b5\u13cd\u13d7 \u13da\u13c2\u13c5\u13d7 \u13c5\u13d3\u13d5\u13c6 \u13a5\u13cd\u13a9\u13f1".split(" "), 
SHORTMONTHS:"\u13a4\u13c3 \u13a7\u13a6 \u13a0\u13c5 \u13a7\u13ec \u13a0\u13c2 \u13d5\u13ad \u13ab\u13f0 \u13a6\u13b6 \u13da\u13b5 \u13da\u13c2 \u13c5\u13d3 \u13a5\u13cd".split(" "), STANDALONESHORTMONTHS:"\u13a4\u13c3 \u13a7\u13a6 \u13a0\u13c5 \u13a7\u13ec \u13a0\u13c2 \u13d5\u13ad \u13ab\u13f0 \u13a6\u13b6 \u13da\u13b5 \u13da\u13c2 \u13c5\u13d3 \u13a5\u13cd".split(" "), WEEKDAYS:"\u13a4\u13be\u13d9\u13d3\u13c6\u13cd\u13ac \u13a4\u13be\u13d9\u13d3\u13c9\u13c5\u13af \u13d4\u13b5\u13c1\u13a2\u13a6 \u13e6\u13a2\u13c1\u13a2\u13a6 \u13c5\u13a9\u13c1\u13a2\u13a6 \u13e7\u13be\u13a9\u13b6\u13cd\u13d7 \u13a4\u13be\u13d9\u13d3\u13c8\u13d5\u13be".split(" "), 
STANDALONEWEEKDAYS:"\u13a4\u13be\u13d9\u13d3\u13c6\u13cd\u13ac \u13a4\u13be\u13d9\u13d3\u13c9\u13c5\u13af \u13d4\u13b5\u13c1\u13a2\u13a6 \u13e6\u13a2\u13c1\u13a2\u13a6 \u13c5\u13a9\u13c1\u13a2\u13a6 \u13e7\u13be\u13a9\u13b6\u13cd\u13d7 \u13a4\u13be\u13d9\u13d3\u13c8\u13d5\u13be".split(" "), SHORTWEEKDAYS:"\u13c6\u13cd\u13ac \u13c9\u13c5\u13af \u13d4\u13b5\u13c1 \u13e6\u13a2\u13c1 \u13c5\u13a9\u13c1 \u13e7\u13be\u13a9 \u13c8\u13d5\u13be".split(" "), STANDALONESHORTWEEKDAYS:"\u13c6\u13cd\u13ac \u13c9\u13c5\u13af \u13d4\u13b5\u13c1 \u13e6\u13a2\u13c1 \u13c5\u13a9\u13c1 \u13e7\u13be\u13a9 \u13c8\u13d5\u13be".split(" "), 
NARROWWEEKDAYS:"\u13c6\u13c9\u13d4\u13e6\u13c5\u13e7\u13a4".split(""), STANDALONENARROWWEEKDAYS:"\u13c6\u13c9\u13d4\u13e6\u13c5\u13e7\u13a4".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["\u13cc\u13be\u13b4", "\u13d2\u13af\u13f1\u13a2\u13d7\u13e2"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_cs = {ERAS:["p\u0159. n. l.", "n. l."], ERANAMES:["p\u0159. n. l.", "n. l."], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"l\u00fabdk\u010d\u010dsz\u0159lp".split(""), MONTHS:"ledna \u00fanora b\u0159ezna dubna kv\u011btna \u010dervna \u010dervence srpna z\u00e1\u0159\u00ed \u0159\u00edjna listopadu prosince".split(" "), STANDALONEMONTHS:"leden \u00fanor b\u0159ezen duben kv\u011bten \u010derven \u010dervenec srpen z\u00e1\u0159\u00ed \u0159\u00edjen listopad prosinec".split(" "), 
SHORTMONTHS:"led \u00fano b\u0159e dub kv\u011b \u010dvn \u010dvc srp z\u00e1\u0159 \u0159\u00edj lis pro".split(" "), STANDALONESHORTMONTHS:"led \u00fano b\u0159e dub kv\u011b \u010dvn \u010dvc srp z\u00e1\u0159 \u0159\u00edj lis pro".split(" "), WEEKDAYS:"ned\u011ble pond\u011bl\u00ed \u00fater\u00fd st\u0159eda \u010dtvrtek p\u00e1tek sobota".split(" "), STANDALONEWEEKDAYS:"ned\u011ble pond\u011bl\u00ed \u00fater\u00fd st\u0159eda \u010dtvrtek p\u00e1tek sobota".split(" "), SHORTWEEKDAYS:"ne po \u00fat st \u010dt p\u00e1 so".split(" "), 
STANDALONESHORTWEEKDAYS:"ne po \u00fat st \u010dt p\u00e1 so".split(" "), NARROWWEEKDAYS:"NP\u00daS\u010cPS".split(""), STANDALONENARROWWEEKDAYS:"NP\u00daS\u010cPS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. \u010dtvrtlet\u00ed", "2. \u010dtvrtlet\u00ed", "3. \u010dtvrtlet\u00ed", "4. \u010dtvrtlet\u00ed"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. M. y", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", 
"{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_cy = {ERAS:["CC", "OC"], ERANAMES:["Cyn Crist", "Oed Crist"], NARROWMONTHS:"I Ch M E M M G A M H T Rh".split(" "), STANDALONENARROWMONTHS:"I Ch M E M M G A M H T Rh".split(" "), MONTHS:"Ionawr Chwefror Mawrth Ebrill Mai Mehefin Gorffennaf Awst Medi Hydref Tachwedd Rhagfyr".split(" "), STANDALONEMONTHS:"Ionawr Chwefror Mawrth Ebrill Mai Mehefin Gorffennaf Awst Medi Hydref Tachwedd Rhagfyr".split(" "), SHORTMONTHS:"Ion Chwef Mawrth Ebrill Mai Meh Gorff Awst Medi Hyd Tach Rhag".split(" "), 
STANDALONESHORTMONTHS:"Ion Chw Maw Ebr Mai Meh Gor Awst Medi Hyd Tach Rhag".split(" "), WEEKDAYS:"Dydd Sul;Dydd Llun;Dydd Mawrth;Dydd Mercher;Dydd Iau;Dydd Gwener;Dydd Sadwrn".split(";"), STANDALONEWEEKDAYS:"Dydd Sul;Dydd Llun;Dydd Mawrth;Dydd Mercher;Dydd Iau;Dydd Gwener;Dydd Sadwrn".split(";"), SHORTWEEKDAYS:"Sul Llun Maw Mer Iau Gwen Sad".split(" "), STANDALONESHORTWEEKDAYS:"Sul Llun Maw Mer Iau Gwe Sad".split(" "), NARROWWEEKDAYS:"S Ll M M I G S".split(" "), STANDALONENARROWWEEKDAYS:"S Ll M M I G S".split(" "), 
SHORTQUARTERS:["Ch1", "Ch2", "Ch3", "Ch4"], QUARTERS:["Chwarter 1af", "2il chwarter", "3ydd chwarter", "4ydd chwarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'am' {0}", "{1} 'am' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_da = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar marts april maj juni juli august september oktober november december".split(" "), STANDALONEMONTHS:"januar februar marts april maj juni juli august september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mar. apr. maj jun. jul. aug. sep. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr maj jun jul aug sep okt nov dec".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n. man. tir. ons. tor. fre. l\u00f8r.".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8n man tir ons tor fre l\u00f8r".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", 
"4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE 'den' d. MMMM y", "d. MMM y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} 'kl.' {0}", "{1} 'kl.' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), STANDALONEMONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), SHORTMONTHS:"Jan. Feb. M\u00e4rz Apr. Mai Juni Juli Aug. Sep. Okt. Nov. Dez.".split(" "), STANDALONESHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), 
WEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), STANDALONEWEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), SHORTWEEKDAYS:"So. Mo. Di. Mi. Do. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"So Mo Di Mi Do Fr Sa".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], 
DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_AT = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"J\u00e4nner Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), STANDALONEMONTHS:"J\u00e4nner Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), SHORTMONTHS:"J\u00e4n. Feb. M\u00e4rz Apr. Mai Juni Juli Aug. Sep. Okt. Nov. Dez.".split(" "), 
STANDALONESHORTMONTHS:"J\u00e4n Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), WEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), STANDALONEWEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), SHORTWEEKDAYS:"So. Mo. Di. Mi. Do. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"So Mo Di Mi Do Fr Sa".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], 
QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_CH = goog.i18n.DateTimeSymbols_de;
goog.i18n.DateTimeSymbols_el = {ERAS:["\u03c0.\u03a7.", "\u03bc.\u03a7."], ERANAMES:["\u03c0.\u03a7.", "\u03bc.\u03a7."], NARROWMONTHS:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""), STANDALONENARROWMONTHS:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""), MONTHS:"\u0399\u03b1\u03bd\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u039c\u03b1\u03c1\u03c4\u03af\u03bf\u03c5 \u0391\u03c0\u03c1\u03b9\u03bb\u03af\u03bf\u03c5 \u039c\u03b1\u0390\u03bf\u03c5 \u0399\u03bf\u03c5\u03bd\u03af\u03bf\u03c5 \u0399\u03bf\u03c5\u03bb\u03af\u03bf\u03c5 \u0391\u03c5\u03b3\u03bf\u03cd\u03c3\u03c4\u03bf\u03c5 \u03a3\u03b5\u03c0\u03c4\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u039f\u03ba\u03c4\u03c9\u03b2\u03c1\u03af\u03bf\u03c5 \u039d\u03bf\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u0394\u03b5\u03ba\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5".split(" "), 
STANDALONEMONTHS:"\u0399\u03b1\u03bd\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u039c\u03ac\u03c1\u03c4\u03b9\u03bf\u03c2 \u0391\u03c0\u03c1\u03af\u03bb\u03b9\u03bf\u03c2 \u039c\u03ac\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bd\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bb\u03b9\u03bf\u03c2 \u0391\u03cd\u03b3\u03bf\u03c5\u03c3\u03c4\u03bf\u03c2 \u03a3\u03b5\u03c0\u03c4\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u039f\u03ba\u03c4\u03ce\u03b2\u03c1\u03b9\u03bf\u03c2 \u039d\u03bf\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u0394\u03b5\u03ba\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2".split(" "), 
SHORTMONTHS:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03b1\u03c1 \u0391\u03c0\u03c1 \u039c\u03b1\u0390 \u0399\u03bf\u03c5\u03bd \u0399\u03bf\u03c5\u03bb \u0391\u03c5\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03b5 \u0394\u03b5\u03ba".split(" "), STANDALONESHORTMONTHS:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03ac\u03c1 \u0391\u03c0\u03c1 \u039c\u03ac\u03b9 \u0399\u03bf\u03cd\u03bd \u0399\u03bf\u03cd\u03bb \u0391\u03cd\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03ad \u0394\u03b5\u03ba".split(" "), 
WEEKDAYS:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "), STANDALONEWEEKDAYS:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "), 
SHORTWEEKDAYS:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03af \u03a4\u03b5\u03c4 \u03a0\u03ad\u03bc \u03a0\u03b1\u03c1 \u03a3\u03ac\u03b2".split(" "), STANDALONESHORTWEEKDAYS:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03af \u03a4\u03b5\u03c4 \u03a0\u03ad\u03bc \u03a0\u03b1\u03c1 \u03a3\u03ac\u03b2".split(" "), NARROWWEEKDAYS:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""), STANDALONENARROWWEEKDAYS:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""), SHORTQUARTERS:["\u03a41", 
"\u03a42", "\u03a43", "\u03a44"], QUARTERS:["1\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "2\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "3\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "4\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf"], AMPMS:["\u03c0.\u03bc.", "\u03bc.\u03bc."], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} - {0}", "{1} - {0}", "{1} - {0}", "{1} - {0}"], 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_AU = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/MM/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_GB = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["am", "pm"], 
DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en_IE = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["a.m.", "p.m."], 
DATEFORMATS:["EEEE d MMMM y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_en_IN = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "dd-MMM-y", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_SG = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_US = goog.i18n.DateTimeSymbols_en;
goog.i18n.DateTimeSymbols_en_ZA = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "dd MMM y", "y/MM/dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_es = {ERAS:["a. C.", "d. C."], ERANAMES:["antes de Cristo", "anno D\u00f3mini"], NARROWMONTHS:"EFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"EFMAMJJASOND".split(""), MONTHS:"enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "), STANDALONEMONTHS:"Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre".split(" "), SHORTMONTHS:"ene. feb. mar. abr. may. jun. jul. ago. sept. oct. nov. dic.".split(" "), 
STANDALONESHORTMONTHS:"Ene. Feb. Mar. Abr. May. Jun. Jul. Ago. Sept. Oct. Nov. Dic.".split(" "), WEEKDAYS:"domingo lunes martes mi\u00e9rcoles jueves viernes s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"Domingo Lunes Martes Mi\u00e9rcoles Jueves Viernes S\u00e1bado".split(" "), SHORTWEEKDAYS:"dom. lun. mar. mi\u00e9. jue. vie. s\u00e1b.".split(" "), STANDALONESHORTWEEKDAYS:"Dom. Lun. Mar. Mi\u00e9. Jue. Vie. S\u00e1b.".split(" "), NARROWWEEKDAYS:"DLMXJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMXJVS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1.er trimestre", "2.\u00ba trimestre", "3.er trimestre", "4.\u00ba trimestre"], AMPMS:["a. m.", "p. m."], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "d/M/y", "d/M/yy"], TIMEFORMATS:["H:mm:ss (zzzz)", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_es_419 = goog.i18n.DateTimeSymbols_es;
goog.i18n.DateTimeSymbols_es_ES = goog.i18n.DateTimeSymbols_es;
goog.i18n.DateTimeSymbols_et = {ERAS:["e.m.a.", "m.a.j."], ERANAMES:["enne meie aega", "meie aja j\u00e4rgi"], NARROWMONTHS:"JVMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JVMAMJJASOND".split(""), MONTHS:"jaanuar veebruar m\u00e4rts aprill mai juuni juuli august september oktoober november detsember".split(" "), STANDALONEMONTHS:"jaanuar veebruar m\u00e4rts aprill mai juuni juuli august september oktoober november detsember".split(" "), SHORTMONTHS:"jaan veebr m\u00e4rts apr mai juuni juuli aug sept okt nov dets".split(" "), 
STANDALONESHORTMONTHS:"jaan veebr m\u00e4rts apr mai juuni juuli aug sept okt nov dets".split(" "), WEEKDAYS:"p\u00fchap\u00e4ev esmasp\u00e4ev teisip\u00e4ev kolmap\u00e4ev neljap\u00e4ev reede laup\u00e4ev".split(" "), STANDALONEWEEKDAYS:"p\u00fchap\u00e4ev esmasp\u00e4ev teisip\u00e4ev kolmap\u00e4ev neljap\u00e4ev reede laup\u00e4ev".split(" "), SHORTWEEKDAYS:"PETKNRL".split(""), STANDALONESHORTWEEKDAYS:"PETKNRL".split(""), NARROWWEEKDAYS:"PETKNRL".split(""), STANDALONENARROWWEEKDAYS:"PETKNRL".split(""), 
SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["H:mm.ss zzzz", "H:mm.ss z", "H:mm.ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_eu = {ERAS:["K.a.", "K.o."], ERANAMES:["K.a.", "K.o."], NARROWMONTHS:"UOMAMEUAIUAA".split(""), STANDALONENARROWMONTHS:"UOMAMEUAIUAA".split(""), MONTHS:"urtarrilak otsailak martxoak apirilak maiatzak ekainak uztailak abuztuak irailak urriak azaroak abenduak".split(" "), STANDALONEMONTHS:"urtarrila otsaila martxoa apirila maiatza ekaina uztaila abuztua iraila urria azaroa abendua".split(" "), SHORTMONTHS:"urt. ots. mar. api. mai. eka. uzt. abu. ira. urr. aza. abe.".split(" "), 
STANDALONESHORTMONTHS:"urt. ots. mar. api. mai. eka. uzt. abu. ira. urr. aza. abe.".split(" "), WEEKDAYS:"igandea astelehena asteartea asteazkena osteguna ostirala larunbata".split(" "), STANDALONEWEEKDAYS:"igandea astelehena asteartea asteazkena osteguna ostirala larunbata".split(" "), SHORTWEEKDAYS:"ig. al. ar. az. og. or. lr.".split(" "), STANDALONESHORTWEEKDAYS:"ig. al. ar. az. og. or. lr.".split(" "), NARROWWEEKDAYS:"IAAAOOL".split(""), STANDALONENARROWWEEKDAYS:"IAAAOOL".split(""), SHORTQUARTERS:["1Hh", 
"2Hh", "3Hh", "4Hh"], QUARTERS:["1. hiruhilekoa", "2. hiruhilekoa", "3. hiruhilekoa", "4. hiruhilekoa"], AMPMS:["AM", "PM"], DATEFORMATS:["y('e')'ko' MMMM d, EEEE", "y('e')'ko' MMMM d", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fa = {ZERODIGIT:1776, ERAS:["\u0642.\u0645.", "\u0645."], ERANAMES:["\u0642\u0628\u0644 \u0627\u0632 \u0645\u06cc\u0644\u0627\u062f", "\u0645\u06cc\u0644\u0627\u062f\u06cc"], NARROWMONTHS:"\u0698\u0641\u0645\u0622\u0645\u0698\u0698\u0627\u0633\u0627\u0646\u062f".split(""), STANDALONENARROWMONTHS:"\u0698\u0641\u0645\u0622\u0645\u0698\u0698\u0627\u0633\u0627\u0646\u062f".split(""), MONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647\u0654 \u0641\u0648\u0631\u06cc\u0647\u0654 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647\u0654 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647\u0654 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647 \u0641\u0648\u0631\u06cc\u0647 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647\u0654 \u0641\u0648\u0631\u06cc\u0647\u0654 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647\u0654 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647\u0654 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647 \u0641\u0648\u0631\u06cc\u0647 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), 
STANDALONEWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), SHORTWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), 
STANDALONESHORTWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), NARROWWEEKDAYS:"\u06cc\u062f\u0633\u0686\u067e\u062c\u0634".split(""), STANDALONENARROWWEEKDAYS:"\u06cc\u062f\u0633\u0686\u067e\u062c\u0634".split(""), SHORTQUARTERS:["\u0633\u200c\u0645\u06f1", "\u0633\u200c\u0645\u06f2", 
"\u0633\u200c\u0645\u06f3", "\u0633\u200c\u0645\u06f4"], QUARTERS:["\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0627\u0648\u0644", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u062f\u0648\u0645", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0633\u0648\u0645", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0686\u0647\u0627\u0631\u0645"], AMPMS:["\u0642\u0628\u0644\u200c\u0627\u0632\u0638\u0647\u0631", "\u0628\u0639\u062f\u0627\u0632\u0638\u0647\u0631"], DATEFORMATS:["EEEE d MMMM y", 
"d MMMM y", "d MMM y", "y/M/d"], TIMEFORMATS:["H:mm:ss (zzzz)", "H:mm:ss (z)", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}\u060c \u0633\u0627\u0639\u062a {0}", "{1}\u060c \u0633\u0627\u0639\u062a {0}", "{1}\u060c\u200f {0}", "{1}\u060c\u200f {0}"], FIRSTDAYOFWEEK:5, WEEKENDRANGE:[3, 4], FIRSTWEEKCUTOFFDAY:4};
goog.i18n.DateTimeSymbols_fi = {ERAS:["eKr.", "jKr."], ERANAMES:["ennen Kristuksen syntym\u00e4\u00e4", "j\u00e4lkeen Kristuksen syntym\u00e4n"], NARROWMONTHS:"THMHTKHESLMJ".split(""), STANDALONENARROWMONTHS:"THMHTKHESLMJ".split(""), MONTHS:"tammikuuta helmikuuta maaliskuuta huhtikuuta toukokuuta kes\u00e4kuuta hein\u00e4kuuta elokuuta syyskuuta lokakuuta marraskuuta joulukuuta".split(" "), STANDALONEMONTHS:"tammikuu helmikuu maaliskuu huhtikuu toukokuu kes\u00e4kuu hein\u00e4kuu elokuu syyskuu lokakuu marraskuu joulukuu".split(" "), 
SHORTMONTHS:"tammikuuta helmikuuta maaliskuuta huhtikuuta toukokuuta kes\u00e4kuuta hein\u00e4kuuta elokuuta syyskuuta lokakuuta marraskuuta joulukuuta".split(" "), STANDALONESHORTMONTHS:"tammi helmi maalis huhti touko kes\u00e4 hein\u00e4 elo syys loka marras joulu".split(" "), WEEKDAYS:"sunnuntaina maanantaina tiistaina keskiviikkona torstaina perjantaina lauantaina".split(" "), STANDALONEWEEKDAYS:"sunnuntai maanantai tiistai keskiviikko torstai perjantai lauantai".split(" "), SHORTWEEKDAYS:"su ma ti ke to pe la".split(" "), 
STANDALONESHORTWEEKDAYS:"su ma ti ke to pe la".split(" "), NARROWWEEKDAYS:"SMTKTPL".split(""), STANDALONENARROWWEEKDAYS:"SMTKTPL".split(""), SHORTQUARTERS:["1. nelj.", "2. nelj.", "3. nelj.", "4. nelj."], QUARTERS:["1. nelj\u00e4nnes", "2. nelj\u00e4nnes", "3. nelj\u00e4nnes", "4. nelj\u00e4nnes"], AMPMS:["ap.", "ip."], DATEFORMATS:["cccc d. MMMM y", "d. MMMM y", "d.M.y", "d.M.y"], TIMEFORMATS:["H.mm.ss zzzz", "H.mm.ss z", "H.mm.ss", "H.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fil = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"EPMAMHHASOND".split(""), STANDALONENARROWMONTHS:"EPMAMHHASOND".split(""), MONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), STANDALONEMONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), SHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), STANDALONESHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), 
WEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), STANDALONEWEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), SHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), STANDALONESHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), NARROWWEEKDAYS:"LLMMHBS".split(""), STANDALONENARROWWEEKDAYS:"LLMMHBS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ika-1 quarter", "ika-2 quarter", "ika-3 quarter", "ika-4 na quarter"], AMPMS:["AM", 
"PM"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'ng' {0}", "{1} 'ng' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_fr = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), STANDALONEMONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), SHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), 
STANDALONESHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), WEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), STANDALONEWEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), SHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), STANDALONESHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fr_CA = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), STANDALONEMONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), SHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), 
STANDALONESHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), WEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), STANDALONEWEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), SHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), STANDALONESHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "y-MM-dd", "yy-MM-dd"], TIMEFORMATS:["HH 'h' mm 'min' ss 's' zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_gl = {ERAS:["a.C.", "d.C."], ERANAMES:["antes de Cristo", "despois de Cristo"], NARROWMONTHS:"XFMAMXXASOND".split(""), STANDALONENARROWMONTHS:"XFMAMXXASOND".split(""), MONTHS:"xaneiro febreiro marzo abril maio xu\u00f1o xullo agosto setembro outubro novembro decembro".split(" "), STANDALONEMONTHS:"Xaneiro Febreiro Marzo Abril Maio Xu\u00f1o Xullo Agosto Setembro Outubro Novembro Decembro".split(" "), SHORTMONTHS:"xan feb mar abr mai xu\u00f1 xul ago set out nov dec".split(" "), 
STANDALONESHORTMONTHS:"Xan Feb Mar Abr Mai Xu\u00f1 Xul Ago Set Out Nov Dec".split(" "), WEEKDAYS:"domingo luns martes m\u00e9rcores xoves venres s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"Domingo Luns Martes M\u00e9rcores Xoves Venres S\u00e1bado".split(" "), SHORTWEEKDAYS:"dom lun mar m\u00e9r xov ven s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"Dom Lun Mar M\u00e9r Xov Ven S\u00e1b".split(" "), NARROWWEEKDAYS:"DLMMXVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMXVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1o trimestre", "2o trimestre", "3o trimestre", "4o trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "d MMM, y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_gsw = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli Auguscht Sept\u00e4mber Oktoober Nov\u00e4mber Dez\u00e4mber".split(" "), STANDALONEMONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli Auguscht Sept\u00e4mber Oktoober Nov\u00e4mber Dez\u00e4mber".split(" "), SHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), 
STANDALONESHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), WEEKDAYS:"Sunntig M\u00e4\u00e4ntig Ziischtig Mittwuch Dunschtig Friitig Samschtig".split(" "), STANDALONEWEEKDAYS:"Sunntig M\u00e4\u00e4ntig Ziischtig Mittwuch Dunschtig Friitig Samschtig".split(" "), SHORTWEEKDAYS:"Su. M\u00e4. Zi. Mi. Du. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"Su. M\u00e4. Zi. Mi. Du. Fr. Sa.".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nam."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_gu = {ERAS:["\u0a88\u0ab8\u0ac1\u0aa8\u0abe \u0a9c\u0aa8\u0acd\u0aae \u0aaa\u0ab9\u0ac7\u0ab2\u0abe", "\u0a87\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8"], ERANAMES:["\u0a88\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8 \u0aaa\u0ac2\u0ab0\u0acd\u0ab5\u0ac7", "\u0a87\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8"], NARROWMONTHS:"\u0a9c\u0abe \u0aab\u0ac7 \u0aae\u0abe \u0a8f \u0aae\u0ac7 \u0a9c\u0ac2 \u0a9c\u0ac1 \u0a91 \u0ab8 \u0a91 \u0aa8 \u0aa1\u0abf".split(" "), STANDALONENARROWMONTHS:"\u0a9c\u0abe \u0aab\u0ac7 \u0aae\u0abe \u0a8f \u0aae\u0ac7 \u0a9c\u0ac2 \u0a9c\u0ac1 \u0a91 \u0ab8 \u0a91 \u0aa8 \u0aa1\u0abf".split(" "), 
MONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0a91\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 \u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0".split(" "), STANDALONEMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0a91\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 \u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0".split(" "), 
SHORTMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7 \u0a91\u0a95\u0acd\u0a9f\u0acb \u0aa8\u0ab5\u0ac7 \u0aa1\u0abf\u0ab8\u0ac7".split(" "), STANDALONESHORTMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97 \u0ab8\u0aaa\u0acd\u0a9f\u0ac7 \u0a91\u0a95\u0acd\u0a9f\u0acb \u0aa8\u0ab5\u0ac7 \u0aa1\u0abf\u0ab8\u0ac7".split(" "), 
WEEKDAYS:"\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0 \u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0 \u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0 \u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0 \u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0 \u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0 \u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0".split(" "), STANDALONEWEEKDAYS:"\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0 \u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0 \u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0 \u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0 \u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0 \u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0 \u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0".split(" "), 
SHORTWEEKDAYS:"\u0ab0\u0ab5\u0abf \u0ab8\u0acb\u0aae \u0aae\u0a82\u0a97\u0ab3 \u0aac\u0ac1\u0aa7 \u0a97\u0ac1\u0ab0\u0ac1 \u0ab6\u0ac1\u0a95\u0acd\u0ab0 \u0ab6\u0aa8\u0abf".split(" "), STANDALONESHORTWEEKDAYS:"\u0ab0\u0ab5\u0abf \u0ab8\u0acb\u0aae \u0aae\u0a82\u0a97\u0ab3 \u0aac\u0ac1\u0aa7 \u0a97\u0ac1\u0ab0\u0ac1 \u0ab6\u0ac1\u0a95\u0acd\u0ab0 \u0ab6\u0aa8\u0abf".split(" "), NARROWWEEKDAYS:"\u0ab0 \u0ab8\u0acb \u0aae\u0a82 \u0aac\u0ac1 \u0a97\u0ac1 \u0ab6\u0ac1 \u0ab6".split(" "), STANDALONENARROWWEEKDAYS:"\u0ab0 \u0ab8\u0acb \u0aae\u0a82 \u0aac\u0ac1 \u0a97\u0ac1 \u0ab6\u0ac1 \u0ab6".split(" "), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0aaa\u0ab9\u0ac7\u0ab2\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8", "\u0aac\u0ac0\u0a9c\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8", "\u0aa4\u0acd\u0ab0\u0ac0\u0a9c\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8", "\u0a9a\u0acb\u0aa5\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-MM-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", 
"hh:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_haw = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"Ianuali Pepeluali Malaki \u02bbApelila Mei Iune Iulai \u02bbAukake Kepakemapa \u02bbOkakopa Nowemapa Kekemapa".split(" "), STANDALONEMONTHS:"Ianuali Pepeluali Malaki \u02bbApelila Mei Iune Iulai \u02bbAukake Kepakemapa \u02bbOkakopa Nowemapa Kekemapa".split(" "), SHORTMONTHS:"Ian. Pep. Mal. \u02bbAp. Mei Iun. Iul. \u02bbAu. Kep. \u02bbOk. Now. Kek.".split(" "), 
STANDALONESHORTMONTHS:"Ian. Pep. Mal. \u02bbAp. Mei Iun. Iul. \u02bbAu. Kep. \u02bbOk. Now. Kek.".split(" "), WEEKDAYS:"L\u0101pule Po\u02bbakahi Po\u02bbalua Po\u02bbakolu Po\u02bbah\u0101 Po\u02bbalima Po\u02bbaono".split(" "), STANDALONEWEEKDAYS:"L\u0101pule Po\u02bbakahi Po\u02bbalua Po\u02bbakolu Po\u02bbah\u0101 Po\u02bbalima Po\u02bbaono".split(" "), SHORTWEEKDAYS:"LP P1 P2 P3 P4 P5 P6".split(" "), STANDALONESHORTWEEKDAYS:"LP P1 P2 P3 P4 P5 P6".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), 
STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_he = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), 
STANDALONEMONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), SHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), 
STANDALONESHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), WEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), 
STANDALONEWEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), SHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), 
STANDALONESHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), NARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), STANDALONENARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", 
"\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e6", "\u05d0\u05d7\u05d4\u05f4\u05e6"], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "d \u05d1MMM y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} \u05d1\u05e9\u05e2\u05d4 {0}", 
"{1} \u05d1\u05e9\u05e2\u05d4 {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_hi = {ERAS:["\u0908\u0938\u093e-\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u094d\u0935\u0940"], ERANAMES:["\u0908\u0938\u093e-\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u094d\u0935\u0940"], NARROWMONTHS:"\u091c \u092b\u093c \u092e\u093e \u0905 \u092e \u091c\u0942 \u091c\u0941 \u0905 \u0938\u093f \u0905 \u0928 \u0926\u093f".split(" "), STANDALONENARROWMONTHS:"\u091c \u092b\u093c \u092e\u093e \u0905 \u092e \u091c\u0942 \u091c\u0941 \u0905 \u0938\u093f \u0905 \u0928 \u0926\u093f".split(" "), 
MONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u093c\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u0902\u092c\u0930 \u0905\u0915\u094d\u091f\u0942\u092c\u0930 \u0928\u0935\u0902\u092c\u0930 \u0926\u093f\u0938\u0902\u092c\u0930".split(" "), STANDALONEMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u093c\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u0902\u092c\u0930 \u0905\u0915\u094d\u091f\u0942\u092c\u0930 \u0928\u0935\u0902\u092c\u0930 \u0926\u093f\u0938\u0902\u092c\u0930".split(" "), 
SHORTMONTHS:"\u091c\u0928 \u092b\u093c\u0930 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e \u0905\u0917 \u0938\u093f\u0924\u0902 \u0905\u0915\u094d\u091f\u0942 \u0928\u0935\u0902 \u0926\u093f\u0938\u0902".split(" "), STANDALONESHORTMONTHS:"\u091c\u0928 \u092b\u093c\u0930 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e \u0905\u0917 \u0938\u093f\u0924\u0902 \u0905\u0915\u094d\u091f\u0942 \u0928\u0935\u0902 \u0926\u093f\u0938\u0902".split(" "), 
WEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0932\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), STANDALONEWEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0932\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), 
SHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0932 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), STANDALONESHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0932 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), NARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), STANDALONENARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), 
SHORTQUARTERS:["\u0924\u093f1", "\u0924\u093f2", "\u0924\u093f3", "\u0924\u093f4"], QUARTERS:["\u092a\u0939\u0932\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u0942\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u0924\u0940\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u094c\u0925\u0940 \u0924\u093f\u092e\u093e\u0939\u0940"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd-MM-y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", 
"h:mm a"], DATETIMEFORMATS:["{1} \u0915\u094b {0}", "{1} \u0915\u094b {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_hr = {ERAS:["pr. Kr.", "p. Kr."], ERANAMES:["Prije Krista", "Poslije Krista"], NARROWMONTHS:"1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12.".split(" "), STANDALONENARROWMONTHS:"1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12.".split(" "), MONTHS:"sije\u010dnja velja\u010de o\u017eujka travnja svibnja lipnja srpnja kolovoza rujna listopada studenoga prosinca".split(" "), STANDALONEMONTHS:"sije\u010danj velja\u010da o\u017eujak travanj svibanj lipanj srpanj kolovoz rujan listopad studeni prosinac".split(" "), 
SHORTMONTHS:"sij velj o\u017eu tra svi lip srp kol ruj lis stu pro".split(" "), STANDALONESHORTMONTHS:"sij velj o\u017eu tra svi lip srp kol ruj lis stu pro".split(" "), WEEKDAYS:"nedjelja ponedjeljak utorak srijeda \u010detvrtak petak subota".split(" "), STANDALONEWEEKDAYS:"nedjelja ponedjeljak utorak srijeda \u010detvrtak petak subota".split(" "), SHORTWEEKDAYS:"ned pon uto sri \u010det pet sub".split(" "), STANDALONESHORTWEEKDAYS:"ned pon uto sri \u010det pet sub".split(" "), NARROWWEEKDAYS:"NPUS\u010cPS".split(""), 
STANDALONENARROWWEEKDAYS:"npus\u010dps".split(""), SHORTQUARTERS:["1kv", "2kv", "3kv", "4kv"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y.", "d. MMMM y.", "d. MMM y.", "d.M.yy."], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'u' {0}", "{1} 'u' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_hu = {ERAS:["i. e.", "i. sz."], ERANAMES:["id\u0151sz\u00e1m\u00edt\u00e1sunk el\u0151tt", "id\u0151sz\u00e1m\u00edt\u00e1sunk szerint"], NARROWMONTHS:"J F M \u00c1 M J J A Sz O N D".split(" "), STANDALONENARROWMONTHS:"J F M \u00c1 M J J A Sz O N D".split(" "), MONTHS:"janu\u00e1r febru\u00e1r m\u00e1rcius \u00e1prilis m\u00e1jus j\u00fanius j\u00falius augusztus szeptember okt\u00f3ber november december".split(" "), STANDALONEMONTHS:"janu\u00e1r febru\u00e1r m\u00e1rcius \u00e1prilis m\u00e1jus j\u00fanius j\u00falius augusztus szeptember okt\u00f3ber november december".split(" "), 
SHORTMONTHS:"jan. febr. m\u00e1rc. \u00e1pr. m\u00e1j. j\u00fan. j\u00fal. aug. szept. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"jan. febr. m\u00e1rc. \u00e1pr. m\u00e1j. j\u00fan. j\u00fal. aug. szept. okt. nov. dec.".split(" "), WEEKDAYS:"vas\u00e1rnap h\u00e9tf\u0151 kedd szerda cs\u00fct\u00f6rt\u00f6k p\u00e9ntek szombat".split(" "), STANDALONEWEEKDAYS:"vas\u00e1rnap h\u00e9tf\u0151 kedd szerda cs\u00fct\u00f6rt\u00f6k p\u00e9ntek szombat".split(" "), SHORTWEEKDAYS:"V H K Sze Cs P Szo".split(" "), 
STANDALONESHORTWEEKDAYS:"V H K Sze Cs P Szo".split(" "), NARROWWEEKDAYS:"V H K Sz Cs P Sz".split(" "), STANDALONENARROWWEEKDAYS:"V H K Sz Cs P Sz".split(" "), SHORTQUARTERS:["N1", "N2", "N3", "N4"], QUARTERS:["I. negyed\u00e9v", "II. negyed\u00e9v", "III. negyed\u00e9v", "IV. negyed\u00e9v"], AMPMS:["de.", "du."], DATEFORMATS:["y. MMMM d., EEEE", "y. MMMM d.", "y. MMM d.", "y. MM. dd."], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", 
"{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_hy = {ERAS:["\u0574.\u0569.\u0561.", "\u0574.\u0569."], ERANAMES:["\u0574.\u0569.\u0561.", "\u0574.\u0569."], NARROWMONTHS:"\u0540\u0553\u0544\u0531\u0544\u0540\u0540\u0555\u054d\u0540\u0546\u0534".split(""), STANDALONENARROWMONTHS:"\u0540\u0553\u0544\u0531\u0544\u0540\u0540\u0555\u054d\u0540\u0546\u0534".split(""), MONTHS:"\u0570\u0578\u0582\u0576\u057e\u0561\u0580\u056b \u0583\u0565\u057f\u0580\u057e\u0561\u0580\u056b \u0574\u0561\u0580\u057f\u056b \u0561\u057a\u0580\u056b\u056c\u056b \u0574\u0561\u0575\u056b\u057d\u056b \u0570\u0578\u0582\u0576\u056b\u057d\u056b \u0570\u0578\u0582\u056c\u056b\u057d\u056b \u0585\u0563\u0578\u057d\u057f\u0578\u057d\u056b \u057d\u0565\u057a\u057f\u0565\u0574\u0562\u0565\u0580\u056b \u0570\u0578\u056f\u057f\u0565\u0574\u0562\u0565\u0580\u056b \u0576\u0578\u0575\u0565\u0574\u0562\u0565\u0580\u056b \u0564\u0565\u056f\u057f\u0565\u0574\u0562\u0565\u0580\u056b".split(" "), 
STANDALONEMONTHS:"\u0570\u0578\u0582\u0576\u057e\u0561\u0580 \u0583\u0565\u057f\u0580\u057e\u0561\u0580 \u0574\u0561\u0580\u057f \u0561\u057a\u0580\u056b\u056c \u0574\u0561\u0575\u056b\u057d \u0570\u0578\u0582\u0576\u056b\u057d \u0570\u0578\u0582\u056c\u056b\u057d \u0585\u0563\u0578\u057d\u057f\u0578\u057d \u057d\u0565\u057a\u057f\u0565\u0574\u0562\u0565\u0580 \u0570\u0578\u056f\u057f\u0565\u0574\u0562\u0565\u0580 \u0576\u0578\u0575\u0565\u0574\u0562\u0565\u0580 \u0564\u0565\u056f\u057f\u0565\u0574\u0562\u0565\u0580".split(" "), 
SHORTMONTHS:"\u0570\u0576\u057e \u0583\u057f\u057e \u0574\u0580\u057f \u0561\u057a\u0580 \u0574\u0575\u057d \u0570\u0576\u057d \u0570\u056c\u057d \u0585\u0563\u057d \u057d\u057a\u057f \u0570\u056f\u057f \u0576\u0575\u0574 \u0564\u056f\u057f".split(" "), STANDALONESHORTMONTHS:"\u0570\u0576\u057e \u0583\u057f\u057e \u0574\u0580\u057f \u0561\u057a\u0580 \u0574\u0575\u057d \u0570\u0576\u057d \u0570\u056c\u057d \u0585\u0563\u057d \u057d\u057a\u057f \u0570\u056f\u057f \u0576\u0575\u0574 \u0564\u056f\u057f".split(" "), 
WEEKDAYS:"\u056f\u056b\u0580\u0561\u056f\u056b \u0565\u0580\u056f\u0578\u0582\u0577\u0561\u0562\u0569\u056b \u0565\u0580\u0565\u0584\u0577\u0561\u0562\u0569\u056b \u0579\u0578\u0580\u0565\u0584\u0577\u0561\u0562\u0569\u056b \u0570\u056b\u0576\u0563\u0577\u0561\u0562\u0569\u056b \u0578\u0582\u0580\u0562\u0561\u0569 \u0577\u0561\u0562\u0561\u0569".split(" "), STANDALONEWEEKDAYS:"\u056f\u056b\u0580\u0561\u056f\u056b \u0565\u0580\u056f\u0578\u0582\u0577\u0561\u0562\u0569\u056b \u0565\u0580\u0565\u0584\u0577\u0561\u0562\u0569\u056b \u0579\u0578\u0580\u0565\u0584\u0577\u0561\u0562\u0569\u056b \u0570\u056b\u0576\u0563\u0577\u0561\u0562\u0569\u056b \u0578\u0582\u0580\u0562\u0561\u0569 \u0577\u0561\u0562\u0561\u0569".split(" "), 
SHORTWEEKDAYS:"\u056f\u056b\u0580 \u0565\u0580\u056f \u0565\u0580\u0584 \u0579\u0580\u0584 \u0570\u0576\u0563 \u0578\u0582\u0580 \u0577\u0562\u0569".split(" "), STANDALONESHORTWEEKDAYS:"\u056f\u056b\u0580 \u0565\u0580\u056f \u0565\u0580\u0584 \u0579\u0580\u0584 \u0570\u0576\u0563 \u0578\u0582\u0580 \u0577\u0562\u0569".split(" "), NARROWWEEKDAYS:"\u053f \u0535 \u0535 \u0549 \u0540 \u0548\u0582 \u0547".split(" "), STANDALONENARROWWEEKDAYS:"\u053f \u0535 \u0535 \u0549 \u0540 \u0548\u0582 \u0547".split(" "), 
SHORTQUARTERS:["1-\u056b\u0576 \u0565\u057c\u0574\u057d.", "2-\u0580\u0564 \u0565\u057c\u0574\u057d.", "3-\u0580\u0564 \u0565\u057c\u0574\u057d.", "4-\u0580\u0564 \u0565\u057c\u0574\u057d."], QUARTERS:["1-\u056b\u0576 \u0565\u057c\u0561\u0574\u057d\u0575\u0561\u056f", "2-\u0580\u0564 \u0565\u057c\u0561\u0574\u057d\u0575\u0561\u056f", "3-\u0580\u0564 \u0565\u057c\u0561\u0574\u057d\u0575\u0561\u056f", "4-\u0580\u0564 \u0565\u057c\u0561\u0574\u057d\u0575\u0561\u056f"], AMPMS:["\u056f\u0565\u057d\u0585\u0580\u056b\u0581 \u0561\u057c\u0561\u057b", 
"\u056f\u0565\u057d\u0585\u0580\u056b\u0581 \u0570\u0565\u057f\u0578"], DATEFORMATS:["y\u0569. MMMM d, EEEE", "dd MMMM, y\u0569.", "dd MMM, y \u0569.", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss, zzzz", "H:mm:ss, z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_id = {ERAS:["SM", "M"], ERANAMES:["SM", "M"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), STANDALONEWEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), SHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), NARROWWEEKDAYS:"MSSRKJS".split(""), STANDALONENARROWWEEKDAYS:"MSSRKJS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["Kuartal ke-1", "Kuartal ke-2", "Kuartal ke-3", "Kuartal ke-4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM y", 
"d MMMM y", "d MMM y", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_in = {ERAS:["SM", "M"], ERANAMES:["SM", "M"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), STANDALONEWEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), SHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), NARROWWEEKDAYS:"MSSRKJS".split(""), STANDALONENARROWWEEKDAYS:"MSSRKJS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["Kuartal ke-1", "Kuartal ke-2", "Kuartal ke-3", "Kuartal ke-4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM y", 
"d MMMM y", "d MMM y", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_is = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["fyrir Krist", "eftir Krist"], NARROWMONTHS:"JFMAMJJ\u00c1SOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJ\u00c1SOND".split(""), MONTHS:"jan\u00faar febr\u00faar mars apr\u00edl ma\u00ed j\u00fan\u00ed j\u00fal\u00ed \u00e1g\u00fast september okt\u00f3ber n\u00f3vember desember".split(" "), STANDALONEMONTHS:"jan\u00faar febr\u00faar mars apr\u00edl ma\u00ed j\u00fan\u00ed j\u00fal\u00ed \u00e1g\u00fast september okt\u00f3ber n\u00f3vember desember".split(" "), 
SHORTMONTHS:"jan. feb. mar. apr. ma\u00ed j\u00fan. j\u00fal. \u00e1g\u00fa. sep. okt. n\u00f3v. des.".split(" "), STANDALONESHORTMONTHS:"jan. feb. mar. apr. ma\u00ed j\u00fan. j\u00fal. \u00e1g\u00fa. sep. okt. n\u00f3v. des.".split(" "), WEEKDAYS:"sunnudagur m\u00e1nudagur \u00feri\u00f0judagur mi\u00f0vikudagur fimmtudagur f\u00f6studagur laugardagur".split(" "), STANDALONEWEEKDAYS:"sunnudagur m\u00e1nudagur \u00feri\u00f0judagur mi\u00f0vikudagur fimmtudagur f\u00f6studagur laugardagur".split(" "), 
SHORTWEEKDAYS:"sun. m\u00e1n. \u00feri. mi\u00f0. fim. f\u00f6s. lau.".split(" "), STANDALONESHORTWEEKDAYS:"sun. m\u00e1n. \u00feri. mi\u00f0. fim. f\u00f6s. lau.".split(" "), NARROWWEEKDAYS:"SM\u00deMFFL".split(""), STANDALONENARROWWEEKDAYS:"SM\u00deMFFL".split(""), SHORTQUARTERS:["F1", "F2", "F3", "F4"], QUARTERS:["1. fj\u00f3r\u00f0ungur", "2. fj\u00f3r\u00f0ungur", "3. fj\u00f3r\u00f0ungur", "4. fj\u00f3r\u00f0ungur"], AMPMS:["f.h.", "e.h."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d. MMM y", 
"d.M.y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'kl.' {0}", "{1} 'kl.' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_it = {ERAS:["aC", "dC"], ERANAMES:["a.C.", "d.C."], NARROWMONTHS:"GFMAMGLASOND".split(""), STANDALONENARROWMONTHS:"GFMAMGLASOND".split(""), MONTHS:"gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre".split(" "), STANDALONEMONTHS:"Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre".split(" "), SHORTMONTHS:"gen feb mar apr mag giu lug ago set ott nov dic".split(" "), STANDALONESHORTMONTHS:"gen feb mar apr mag giu lug ago set ott nov dic".split(" "), 
WEEKDAYS:"domenica luned\u00ec marted\u00ec mercoled\u00ec gioved\u00ec venerd\u00ec sabato".split(" "), STANDALONEWEEKDAYS:"Domenica Luned\u00ec Marted\u00ec Mercoled\u00ec Gioved\u00ec Venerd\u00ec Sabato".split(" "), SHORTWEEKDAYS:"dom lun mar mer gio ven sab".split(" "), STANDALONESHORTWEEKDAYS:"dom lun mar mer gio ven sab".split(" "), NARROWWEEKDAYS:"DLMMGVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMGVS".split(""), SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1\u00ba trimestre", "2\u00ba trimestre", 
"3\u00ba trimestre", "4\u00ba trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "dd MMMM y", "dd/MMM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_iw = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), 
STANDALONEMONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), SHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), 
STANDALONESHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), WEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), 
STANDALONEWEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), SHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), 
STANDALONESHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), NARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), STANDALONENARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", 
"\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e6", "\u05d0\u05d7\u05d4\u05f4\u05e6"], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "d \u05d1MMM y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} \u05d1\u05e9\u05e2\u05d4 {0}", 
"{1} \u05d1\u05e9\u05e2\u05d4 {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ja = {ERAS:["\u7d00\u5143\u524d", "\u897f\u66a6"], ERANAMES:["\u7d00\u5143\u524d", "\u897f\u66a6"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), 
STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u65e5\u66dc\u65e5 \u6708\u66dc\u65e5 \u706b\u66dc\u65e5 \u6c34\u66dc\u65e5 \u6728\u66dc\u65e5 \u91d1\u66dc\u65e5 \u571f\u66dc\u65e5".split(" "), STANDALONEWEEKDAYS:"\u65e5\u66dc\u65e5 \u6708\u66dc\u65e5 \u706b\u66dc\u65e5 \u6c34\u66dc\u65e5 \u6728\u66dc\u65e5 \u91d1\u66dc\u65e5 \u571f\u66dc\u65e5".split(" "), SHORTWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), 
STANDALONESHORTWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), NARROWWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u7b2c1\u56db\u534a\u671f", "\u7b2c2\u56db\u534a\u671f", "\u7b2c3\u56db\u534a\u671f", "\u7b2c4\u56db\u534a\u671f"], AMPMS:["\u5348\u524d", "\u5348\u5f8c"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", 
"y/MM/dd", "y/MM/dd"], TIMEFORMATS:["H\u6642mm\u5206ss\u79d2 zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ka = {ERAS:["\u10eb\u10d5. \u10ec.", "\u10d0\u10ee. \u10ec."], ERANAMES:["\u10eb\u10d5\u10d4\u10da\u10d8 \u10ec\u10d4\u10da\u10d7\u10d0\u10e6\u10e0\u10d8\u10ea\u10ee\u10d5\u10d8\u10d7", "\u10d0\u10ee\u10d0\u10da\u10d8 \u10ec\u10d4\u10da\u10d7\u10d0\u10e6\u10e0\u10d8\u10ea\u10ee\u10d5\u10d8\u10d7"], NARROWMONTHS:"\u10d8\u10d7\u10db\u10d0\u10db\u10d8\u10d8\u10d0\u10e1\u10dd\u10dc\u10d3".split(""), STANDALONENARROWMONTHS:"\u10d8\u10d7\u10db\u10d0\u10db\u10d8\u10d8\u10d0\u10e1\u10dd\u10dc\u10d3".split(""), 
MONTHS:"\u10d8\u10d0\u10dc\u10d5\u10d0\u10e0\u10d8 \u10d7\u10d4\u10d1\u10d4\u10e0\u10d5\u10d0\u10da\u10d8 \u10db\u10d0\u10e0\u10e2\u10d8 \u10d0\u10de\u10e0\u10d8\u10da\u10d8 \u10db\u10d0\u10d8\u10e1\u10d8 \u10d8\u10d5\u10dc\u10d8\u10e1\u10d8 \u10d8\u10d5\u10da\u10d8\u10e1\u10d8 \u10d0\u10d2\u10d5\u10d8\u10e1\u10e2\u10dd \u10e1\u10d4\u10e5\u10e2\u10d4\u10db\u10d1\u10d4\u10e0\u10d8 \u10dd\u10e5\u10e2\u10dd\u10db\u10d1\u10d4\u10e0\u10d8 \u10dc\u10dd\u10d4\u10db\u10d1\u10d4\u10e0\u10d8 \u10d3\u10d4\u10d9\u10d4\u10db\u10d1\u10d4\u10e0\u10d8".split(" "), 
STANDALONEMONTHS:"\u10d8\u10d0\u10dc\u10d5\u10d0\u10e0\u10d8 \u10d7\u10d4\u10d1\u10d4\u10e0\u10d5\u10d0\u10da\u10d8 \u10db\u10d0\u10e0\u10e2\u10d8 \u10d0\u10de\u10e0\u10d8\u10da\u10d8 \u10db\u10d0\u10d8\u10e1\u10d8 \u10d8\u10d5\u10dc\u10d8\u10e1\u10d8 \u10d8\u10d5\u10da\u10d8\u10e1\u10d8 \u10d0\u10d2\u10d5\u10d8\u10e1\u10e2\u10dd \u10e1\u10d4\u10e5\u10e2\u10d4\u10db\u10d1\u10d4\u10e0\u10d8 \u10dd\u10e5\u10e2\u10dd\u10db\u10d1\u10d4\u10e0\u10d8 \u10dc\u10dd\u10d4\u10db\u10d1\u10d4\u10e0\u10d8 \u10d3\u10d4\u10d9\u10d4\u10db\u10d1\u10d4\u10e0\u10d8".split(" "), 
SHORTMONTHS:"\u10d8\u10d0\u10dc \u10d7\u10d4\u10d1 \u10db\u10d0\u10e0 \u10d0\u10de\u10e0 \u10db\u10d0\u10d8 \u10d8\u10d5\u10dc \u10d8\u10d5\u10da \u10d0\u10d2\u10d5 \u10e1\u10d4\u10e5 \u10dd\u10e5\u10e2 \u10dc\u10dd\u10d4 \u10d3\u10d4\u10d9".split(" "), STANDALONESHORTMONTHS:"\u10d8\u10d0\u10dc \u10d7\u10d4\u10d1 \u10db\u10d0\u10e0 \u10d0\u10de\u10e0 \u10db\u10d0\u10d8 \u10d8\u10d5\u10dc \u10d8\u10d5\u10da \u10d0\u10d2\u10d5 \u10e1\u10d4\u10e5 \u10dd\u10e5\u10e2 \u10dc\u10dd\u10d4 \u10d3\u10d4\u10d9".split(" "), 
WEEKDAYS:"\u10d9\u10d5\u10d8\u10e0\u10d0 \u10dd\u10e0\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10e1\u10d0\u10db\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10dd\u10d7\u10ee\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10ee\u10e3\u10d7\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10de\u10d0\u10e0\u10d0\u10e1\u10d9\u10d4\u10d5\u10d8 \u10e8\u10d0\u10d1\u10d0\u10d7\u10d8".split(" "), STANDALONEWEEKDAYS:"\u10d9\u10d5\u10d8\u10e0\u10d0 \u10dd\u10e0\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10e1\u10d0\u10db\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10dd\u10d7\u10ee\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10ee\u10e3\u10d7\u10e8\u10d0\u10d1\u10d0\u10d7\u10d8 \u10de\u10d0\u10e0\u10d0\u10e1\u10d9\u10d4\u10d5\u10d8 \u10e8\u10d0\u10d1\u10d0\u10d7\u10d8".split(" "), 
SHORTWEEKDAYS:"\u10d9\u10d5\u10d8 \u10dd\u10e0\u10e8 \u10e1\u10d0\u10db \u10dd\u10d7\u10ee \u10ee\u10e3\u10d7 \u10de\u10d0\u10e0 \u10e8\u10d0\u10d1".split(" "), STANDALONESHORTWEEKDAYS:"\u10d9\u10d5\u10d8 \u10dd\u10e0\u10e8 \u10e1\u10d0\u10db \u10dd\u10d7\u10ee \u10ee\u10e3\u10d7 \u10de\u10d0\u10e0 \u10e8\u10d0\u10d1".split(" "), NARROWWEEKDAYS:"\u10d9\u10dd\u10e1\u10dd\u10ee\u10de\u10e8".split(""), STANDALONENARROWWEEKDAYS:"\u10d9\u10dd\u10e1\u10dd\u10ee\u10de\u10e8".split(""), SHORTQUARTERS:["I \u10d9\u10d5.", 
"II \u10d9\u10d5.", "III \u10d9\u10d5.", "IV \u10d9\u10d5."], QUARTERS:["I \u10d9\u10d5\u10d0\u10e0\u10e2\u10d0\u10da\u10d8", "II \u10d9\u10d5\u10d0\u10e0\u10e2\u10d0\u10da\u10d8", "III \u10d9\u10d5\u10d0\u10e0\u10e2\u10d0\u10da\u10d8", "IV \u10d9\u10d5\u10d0\u10e0\u10e2\u10d0\u10da\u10d8"], AMPMS:["\u10d3\u10d8\u10da\u10d8\u10e1", "\u10e1\u10d0\u10e6\u10d0\u10db\u10dd\u10e1"], DATEFORMATS:["EEEE, dd MMMM, y", "d MMMM, y", "d MMM, y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", 
"HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1}, {0}", "{1} {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_kk = {ERAS:["\u0431.\u0437.\u0434.", "\u0431.\u0437."], ERANAMES:["\u0431.\u0437.\u0434.", "\u0431.\u0437."], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u049b\u0430\u04a3\u0442\u0430\u0440 \u0430\u049b\u043f\u0430\u043d \u043d\u0430\u0443\u0440\u044b\u0437 \u0441\u04d9\u0443\u0456\u0440 \u043c\u0430\u043c\u044b\u0440 \u043c\u0430\u0443\u0441\u044b\u043c \u0448\u0456\u043b\u0434\u0435 \u0442\u0430\u043c\u044b\u0437 \u049b\u044b\u0440\u043a\u04af\u0439\u0435\u043a \u049b\u0430\u0437\u0430\u043d \u049b\u0430\u0440\u0430\u0448\u0430 \u0436\u0435\u043b\u0442\u043e\u049b\u0441\u0430\u043d".split(" "), 
STANDALONEMONTHS:"\u049b\u0430\u04a3\u0442\u0430\u0440 \u0430\u049b\u043f\u0430\u043d \u043d\u0430\u0443\u0440\u044b\u0437 \u0441\u04d9\u0443\u0456\u0440 \u043c\u0430\u043c\u044b\u0440 \u043c\u0430\u0443\u0441\u044b\u043c \u0448\u0456\u043b\u0434\u0435 \u0442\u0430\u043c\u044b\u0437 \u049b\u044b\u0440\u043a\u04af\u0439\u0435\u043a \u049b\u0430\u0437\u0430\u043d \u049b\u0430\u0440\u0430\u0448\u0430 \u0436\u0435\u043b\u0442\u043e\u049b\u0441\u0430\u043d".split(" "), SHORTMONTHS:"\u049b\u0430\u04a3. \u0430\u049b\u043f. \u043d\u0430\u0443. \u0441\u04d9\u0443. \u043c\u0430\u043c. \u043c\u0430\u0443. \u0448\u0456\u043b. \u0442\u0430\u043c. \u049b\u044b\u0440. \u049b\u0430\u0437. \u049b\u0430\u0440. \u0436\u0435\u043b\u0442.".split(" "), 
STANDALONESHORTMONTHS:"\u049b\u0430\u04a3. \u0430\u049b\u043f. \u043d\u0430\u0443. \u0441\u04d9\u0443. \u043c\u0430\u043c. \u043c\u0430\u0443. \u0448\u0456\u043b. \u0442\u0430\u043c. \u049b\u044b\u0440. \u049b\u0430\u0437. \u049b\u0430\u0440. \u0436\u0435\u043b\u0442.".split(" "), WEEKDAYS:"\u0436\u0435\u043a\u0441\u0435\u043d\u0431\u0456 \u0434\u04af\u0439\u0441\u0435\u043d\u0431\u0456 \u0441\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0441\u04d9\u0440\u0441\u0435\u043d\u0431\u0456 \u0431\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0436\u04b1\u043c\u0430 \u0441\u0435\u043d\u0431\u0456".split(" "), 
STANDALONEWEEKDAYS:"\u0436\u0435\u043a\u0441\u0435\u043d\u0431\u0456 \u0434\u04af\u0439\u0441\u0435\u043d\u0431\u0456 \u0441\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0441\u04d9\u0440\u0441\u0435\u043d\u0431\u0456 \u0431\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0436\u04b1\u043c\u0430 \u0441\u0435\u043d\u0431\u0456".split(" "), SHORTWEEKDAYS:"\u0436\u0441. \u0434\u0441. \u0441\u0441. \u0441\u0440. \u0431\u0441. \u0436\u043c. \u0441\u0431.".split(" "), STANDALONESHORTWEEKDAYS:"\u0436\u0441. \u0434\u0441. \u0441\u0441. \u0441\u0440. \u0431\u0441. \u0436\u043c. \u0441\u0431.".split(" "), 
NARROWWEEKDAYS:"\u0416\u0414\u0421\u0421\u0411\u0416\u0421".split(""), STANDALONENARROWWEEKDAYS:"\u0416\u0414\u0421\u0421\u0411\u0416\u0421".split(""), SHORTQUARTERS:["1-\u0442\u043e\u049b\u0441\u0430\u043d", "2-\u0442\u043e\u049b\u0441\u0430\u043d", "3-\u0442\u043e\u049b\u0441\u0430\u043d", "4-\u0442\u043e\u049b\u0441\u0430\u043d"], QUARTERS:["1-\u0456\u043d\u0448\u0456 \u0442\u043e\u049b\u0441\u0430\u043d", "2-\u0456\u043d\u0448\u0456 \u0442\u043e\u049b\u0441\u0430\u043d", "3-\u0456\u043d\u0448\u0456 \u0442\u043e\u049b\u0441\u0430\u043d", 
"4-\u0456\u043d\u0448\u0456 \u0442\u043e\u049b\u0441\u0430\u043d"], AMPMS:["\u0442\u04af\u0441\u043a\u0435 \u0434\u0435\u0439\u0456\u043d", "\u0442\u04af\u0441\u0442\u0435\u043d \u043a\u0435\u0439\u0456\u043d"], DATEFORMATS:["EEEE, d MMMM y '\u0436'.", "d MMMM y '\u0436'.", "dd.MM.y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_km = {ERAS:["\u1798\u17bb\u1793 \u1782.\u179f.", "\u1782.\u179f."], ERANAMES:["\u1798\u17bb\u1793\u200b\u1782\u17d2\u179a\u17b7\u179f\u17d2\u178f\u179f\u1780\u179a\u17b6\u1787", "\u1782\u17d2\u179a\u17b7\u179f\u17d2\u178f\u179f\u1780\u179a\u17b6\u1787"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u1798\u1780\u179a\u17b6 \u1780\u17bb\u1798\u17d2\u1797\u17c8 \u1798\u17b8\u1793\u17b6 \u1798\u17c1\u179f\u17b6 \u17a7\u179f\u1797\u17b6 \u1798\u17b7\u1790\u17bb\u1793\u17b6 \u1780\u1780\u17d2\u1780\u178a\u17b6 \u179f\u17b8\u17a0\u17b6 \u1780\u1789\u17d2\u1789\u17b6 \u178f\u17bb\u179b\u17b6 \u179c\u17b7\u1785\u17d2\u1786\u17b7\u1780\u17b6 \u1792\u17d2\u1793\u17bc".split(" "), 
STANDALONEMONTHS:"\u1798\u1780\u179a\u17b6 \u1780\u17bb\u1798\u17d2\u1797\u17c8 \u1798\u17b8\u1793\u17b6 \u1798\u17c1\u179f\u17b6 \u17a7\u179f\u1797\u17b6 \u1798\u17b7\u1790\u17bb\u1793\u17b6 \u1780\u1780\u17d2\u1780\u178a\u17b6 \u179f\u17b8\u17a0\u17b6 \u1780\u1789\u17d2\u1789\u17b6 \u178f\u17bb\u179b\u17b6 \u179c\u17b7\u1785\u17d2\u1786\u17b7\u1780\u17b6 \u1792\u17d2\u1793\u17bc".split(" "), SHORTMONTHS:"\u1798\u1780\u179a\u17b6 \u1780\u17bb\u1798\u17d2\u1797\u17c8 \u1798\u17b8\u1793\u17b6 \u1798\u17c1\u179f\u17b6 \u17a7\u179f\u1797\u17b6 \u1798\u17b7\u1790\u17bb\u1793\u17b6 \u1780\u1780\u17d2\u1780\u178a\u17b6 \u179f\u17b8\u17a0\u17b6 \u1780\u1789\u17d2\u1789\u17b6 \u178f\u17bb\u179b\u17b6 \u179c\u17b7\u1785\u17d2\u1786\u17b7\u1780\u17b6 \u1792\u17d2\u1793\u17bc".split(" "), 
STANDALONESHORTMONTHS:"\u1798\u1780\u179a\u17b6 \u1780\u17bb\u1798\u17d2\u1797\u17c8 \u1798\u17b8\u1793\u17b6 \u1798\u17c1\u179f\u17b6 \u17a7\u179f\u1797\u17b6 \u1798\u17b7\u1790\u17bb\u1793\u17b6 \u1780\u1780\u17d2\u1780\u178a\u17b6 \u179f\u17b8\u17a0\u17b6 \u1780\u1789\u17d2\u1789\u17b6 \u178f\u17bb\u179b\u17b6 \u179c\u17b7\u1785\u17d2\u1786\u17b7\u1780\u17b6 \u1792\u17d2\u1793\u17bc".split(" "), WEEKDAYS:"\u17a2\u17b6\u1791\u17b7\u178f\u17d2\u1799 \u1785\u1793\u17d2\u1791 \u17a2\u1784\u17d2\u1782\u17b6\u179a \u1796\u17bb\u1792 \u1796\u17d2\u179a\u17a0\u179f\u17d2\u1794\u178f\u17b7\u17cd \u179f\u17bb\u1780\u17d2\u179a \u179f\u17c5\u179a\u17cd".split(" "), 
STANDALONEWEEKDAYS:"\u17a2\u17b6\u1791\u17b7\u178f\u17d2\u1799 \u1785\u1793\u17d2\u1791 \u17a2\u1784\u17d2\u1782\u17b6\u179a \u1796\u17bb\u1792 \u1796\u17d2\u179a\u17a0\u179f\u17d2\u1794\u178f\u17b7\u17cd \u179f\u17bb\u1780\u17d2\u179a \u179f\u17c5\u179a\u17cd".split(" "), SHORTWEEKDAYS:"\u17a2\u17b6\u1791\u17b7\u178f\u17d2\u1799 \u1785\u1793\u17d2\u1791 \u17a2\u1784\u17d2\u1782\u17b6\u179a \u1796\u17bb\u1792 \u1796\u17d2\u179a\u17a0\u179f\u17d2\u1794\u178f\u17b7\u17cd \u179f\u17bb\u1780\u17d2\u179a \u179f\u17c5\u179a\u17cd".split(" "), 
STANDALONESHORTWEEKDAYS:"\u17a2\u17b6\u1791\u17b7\u178f\u17d2\u1799 \u1785\u1793\u17d2\u1791 \u17a2\u1784\u17d2\u1782\u17b6\u179a \u1796\u17bb\u1792 \u1796\u17d2\u179a\u17a0\u179f\u17d2\u1794\u178f\u17b7\u17cd \u179f\u17bb\u1780\u17d2\u179a \u179f\u17c5\u179a\u17cd".split(" "), NARROWWEEKDAYS:"1234567".split(""), STANDALONENARROWWEEKDAYS:"1234567".split(""), SHORTQUARTERS:["\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f \u17e1", "\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f \u17e2", "\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f \u17e3", 
"\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f \u17e4"], QUARTERS:["\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f\u1791\u17b8 \u17e1", "\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f\u1791\u17b8 \u17e2", "\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f\u1791\u17b8 \u17e3", "\u178f\u17d2\u179a\u17b8\u1798\u17b6\u179f\u1791\u17b8 \u17e4"], AMPMS:["\u1796\u17d2\u179a\u17b9\u1780", "\u179b\u17d2\u1784\u17b6\u1785"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "d/M/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", 
"h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_kn = {ERAS:["\u0c95\u0ccd\u0cb0\u0cbf.\u0caa\u0cc2", "\u0c9c\u0cbe\u0cb9\u0cc0"], ERANAMES:["\u0c88\u0cb8\u0caa\u0cc2\u0cb5\u0cef.", "\u0c95\u0ccd\u0cb0\u0cbf\u0cb8\u0ccd\u0ca4 \u0cb6\u0c95"], NARROWMONTHS:"\u0c9c \u0cab\u0cc6 \u0cae\u0cbe \u0c8f \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1 \u0c86 \u0cb8\u0cc6 \u0c85 \u0ca8 \u0ca1\u0cbf".split(" "), STANDALONENARROWMONTHS:"\u0c9c \u0cab\u0cc6 \u0cae\u0cbe \u0c8f \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1 \u0c86 \u0cb8\u0cc6 \u0c85 \u0ca8 \u0ca1\u0cbf".split(" "), 
MONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cbf \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cbf \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8f\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc7 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), STANDALONEMONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cbf \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cbf \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8f\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc7 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), 
SHORTMONTHS:"\u0c9c\u0ca8. \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cc1. \u0cae\u0cbe \u0c8f\u0caa\u0ccd\u0cb0\u0cbf. \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1. \u0c86\u0c97. \u0cb8\u0cc6\u0caa\u0ccd\u0c9f\u0cc6\u0c82. \u0c85\u0c95\u0ccd\u0c9f\u0ccb. \u0ca8\u0cb5\u0cc6\u0c82. \u0ca1\u0cbf\u0cb8\u0cc6\u0c82.".split(" "), STANDALONESHORTMONTHS:"\u0c9c\u0ca8. \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cc1. \u0cae\u0cbe \u0c8f\u0caa\u0ccd\u0cb0\u0cbf. \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1. \u0c86\u0c97. \u0cb8\u0cc6\u0caa\u0ccd\u0c9f\u0cc6\u0c82. \u0c85\u0c95\u0ccd\u0c9f\u0ccb. \u0ca8\u0cb5\u0cc6\u0c82. \u0ca1\u0cbf\u0cb8\u0cc6\u0c82.".split(" "), 
WEEKDAYS:"\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0 \u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0 \u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0 \u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0 \u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0 \u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0".split(" "), STANDALONEWEEKDAYS:"\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0 \u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0 \u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0 \u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0 \u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0 \u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0".split(" "), 
SHORTWEEKDAYS:"\u0cb0. \u0cb8\u0ccb. \u0cae\u0c82. \u0cac\u0cc1. \u0c97\u0cc1. \u0cb6\u0cc1. \u0cb6\u0ca8\u0cbf.".split(" "), STANDALONESHORTWEEKDAYS:"\u0cb0\u0cb5\u0cbf \u0cb8\u0ccb\u0cae \u0cae\u0c82\u0c97\u0cb3 \u0cac\u0cc1\u0ca7 \u0c97\u0cc1\u0cb0\u0cc1 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0 \u0cb6\u0ca8\u0cbf".split(" "), NARROWWEEKDAYS:"\u0cb0 \u0cb8\u0ccb \u0cae\u0c82 \u0cac\u0cc1 \u0c97\u0cc1 \u0cb6\u0cc1 \u0cb6".split(" "), STANDALONENARROWWEEKDAYS:"\u0cb0 \u0cb8\u0ccb \u0cae\u0c82 \u0cac\u0cc1 \u0c97\u0cc1 \u0cb6\u0cc1 \u0cb6".split(" "), 
SHORTQUARTERS:["\u0ca4\u0ccd\u0cb0\u0cc8 1", "\u0ca4\u0ccd\u0cb0\u0cc8 2", "\u0ca4\u0ccd\u0cb0\u0cc8 3", "\u0ca4\u0ccd\u0cb0\u0cc8 4"], QUARTERS:["1 \u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95", "2\u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95", "3 \u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95", "4 \u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95"], AMPMS:["AM", "PM"], DATEFORMATS:["d MMMM y, EEEE", "d MMMM y", 
"d MMM y", "d-M-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", "hh:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ko = {ERAS:["\uae30\uc6d0\uc804", "\uc11c\uae30"], ERANAMES:["\uc11c\ub825\uae30\uc6d0\uc804", "\uc11c\ub825\uae30\uc6d0"], NARROWMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), STANDALONENARROWMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), MONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), 
STANDALONEMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), SHORTMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), STANDALONESHORTMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), WEEKDAYS:"\uc77c\uc694\uc77c \uc6d4\uc694\uc77c \ud654\uc694\uc77c \uc218\uc694\uc77c \ubaa9\uc694\uc77c \uae08\uc694\uc77c \ud1a0\uc694\uc77c".split(" "), 
STANDALONEWEEKDAYS:"\uc77c\uc694\uc77c \uc6d4\uc694\uc77c \ud654\uc694\uc77c \uc218\uc694\uc77c \ubaa9\uc694\uc77c \uae08\uc694\uc77c \ud1a0\uc694\uc77c".split(" "), SHORTWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), STANDALONESHORTWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), NARROWWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), STANDALONENARROWWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), SHORTQUARTERS:["1\ubd84\uae30", "2\ubd84\uae30", 
"3\ubd84\uae30", "4\ubd84\uae30"], QUARTERS:["\uc81c 1/4\ubd84\uae30", "\uc81c 2/4\ubd84\uae30", "\uc81c 3/4\ubd84\uae30", "\uc81c 4/4\ubd84\uae30"], AMPMS:["\uc624\uc804", "\uc624\ud6c4"], DATEFORMATS:["y\ub144 M\uc6d4 d\uc77c EEEE", "y\ub144 M\uc6d4 d\uc77c", "y. M. d.", "yy. M. d."], TIMEFORMATS:["a h\uc2dc m\ubd84 s\ucd08 zzzz", "a h\uc2dc m\ubd84 s\ucd08 z", "a h:mm:ss", "a h:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ky = {ERAS:["\u0431.\u0437. \u0447.", "\u0431.\u0437."], ERANAMES:["\u0431.\u0437. \u0447\u0435\u0439\u0438\u043d", "\u0431.\u0437."], NARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), STANDALONENARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), MONTHS:"\u044f\u043d\u0432\u0430\u0440\u044c \u0444\u0435\u0432\u0440\u0430\u043b\u044c \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0435\u043b\u044c \u043c\u0430\u0439 \u0438\u044e\u043d\u044c \u0438\u044e\u043b\u044c \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u043e\u043a\u0442\u044f\u0431\u0440\u044c \u043d\u043e\u044f\u0431\u0440\u044c \u0434\u0435\u043a\u0430\u0431\u0440\u044c".split(" "), 
STANDALONEMONTHS:"\u044f\u043d\u0432\u0430\u0440\u044c \u0444\u0435\u0432\u0440\u0430\u043b\u044c \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0435\u043b\u044c \u043c\u0430\u0439 \u0438\u044e\u043d\u044c \u0438\u044e\u043b\u044c \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u043e\u043a\u0442\u044f\u0431\u0440\u044c \u043d\u043e\u044f\u0431\u0440\u044c \u0434\u0435\u043a\u0430\u0431\u0440\u044c".split(" "), SHORTMONTHS:"\u044f\u043d\u0432. \u0444\u0435\u0432. \u043c\u0430\u0440. \u0430\u043f\u0440. \u043c\u0430\u0439 \u0438\u044e\u043d. \u0438\u044e\u043b. \u0430\u0432\u0433. \u0441\u0435\u043d. \u043e\u043a\u0442. \u043d\u043e\u044f. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u044f\u043d\u0432. \u0444\u0435\u0432. \u043c\u0430\u0440. \u0430\u043f\u0440. \u043c\u0430\u0439 \u0438\u044e\u043d. \u0438\u044e\u043b. \u0430\u0432\u0433. \u0441\u0435\u043d. \u043e\u043a\u0442. \u043d\u043e\u044f. \u0434\u0435\u043a.".split(" "), WEEKDAYS:"\u0416\u0435\u043a \u0414\u04af\u0439 \u0428\u0435\u0439 \u0428\u0430\u0440 \u0411\u0435\u0439 \u0416\u0443\u043c \u0418\u0448\u043c".split(" "), STANDALONEWEEKDAYS:"\u0416\u0435\u043a\u0448\u0435\u043c\u0431\u0438 \u0414\u04af\u0439\u0448\u04e9\u043c\u0431\u04af \u0428\u0435\u0439\u0448\u0435\u043c\u0431\u0438 \u0428\u0430\u0440\u0448\u0435\u043c\u0431\u0438 \u0411\u0435\u0439\u0448\u0435\u043c\u0431\u0438 \u0416\u0443\u043c\u0430 \u0418\u0448\u0435\u043c\u0431\u0438".split(" "), 
SHORTWEEKDAYS:"\u0416\u043a \u0414\u0448 \u0428\u0435 \u0428\u0430 \u0411\u0448 \u0416\u043c \u0418\u0448".split(" "), STANDALONESHORTWEEKDAYS:"\u0416\u0435\u043a \u0414\u04af\u0439 \u0428\u0435\u0439 \u0428\u0430\u0440 \u0411\u0435\u0439 \u0416\u0443\u043c \u0418\u0448\u043c".split(" "), NARROWWEEKDAYS:"\u0416\u0414\u0428\u0428\u0411\u0416\u0418".split(""), STANDALONENARROWWEEKDAYS:"\u0416\u0414\u0428\u0428\u0411\u0416\u0418".split(""), SHORTQUARTERS:["1-\u0447\u0435\u0439.", "2-\u0447\u0435\u0439.", 
"3-\u0447\u0435\u0439.", "4-\u0447\u0435\u0439."], QUARTERS:["1-\u0447\u0435\u0439\u0440\u0435\u043a", "2-\u0447\u0435\u0439\u0440\u0435\u043a", "3-\u0447\u0435\u0439\u0440\u0435\u043a", "4-\u0447\u0435\u0439\u0440\u0435\u043a"], AMPMS:["\u0442\u04af\u0448\u043a\u04e9 \u0447\u0435\u0439\u0438\u043d\u043a\u0438", "\u0442\u04af\u0448\u0442\u04e9\u043d \u043a\u0438\u0439\u0438\u043d\u043a\u0438"], DATEFORMATS:["EEEE, d-MMMM, y-'\u0436'.", "d-MMMM, y-'\u0436'.", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", 
"HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ln = {ERAS:["lib\u00f3so ya", "nsima ya Y"], ERANAMES:["Yambo ya Y\u00e9zu Kr\u00eds", "Nsima ya Y\u00e9zu Kr\u00eds"], NARROWMONTHS:"yfmamyyas\u0254nd".split(""), STANDALONENARROWMONTHS:"yfmamyyas\u0254nd".split(""), MONTHS:"s\u00e1nz\u00e1 ya yambo;s\u00e1nz\u00e1 ya m\u00edbal\u00e9;s\u00e1nz\u00e1 ya m\u00eds\u00e1to;s\u00e1nz\u00e1 ya m\u00ednei;s\u00e1nz\u00e1 ya m\u00edt\u00e1no;s\u00e1nz\u00e1 ya mot\u00f3b\u00e1;s\u00e1nz\u00e1 ya nsambo;s\u00e1nz\u00e1 ya mwambe;s\u00e1nz\u00e1 ya libwa;s\u00e1nz\u00e1 ya z\u00f3mi;s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301;s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9".split(";"), 
STANDALONEMONTHS:"s\u00e1nz\u00e1 ya yambo;s\u00e1nz\u00e1 ya m\u00edbal\u00e9;s\u00e1nz\u00e1 ya m\u00eds\u00e1to;s\u00e1nz\u00e1 ya m\u00ednei;s\u00e1nz\u00e1 ya m\u00edt\u00e1no;s\u00e1nz\u00e1 ya mot\u00f3b\u00e1;s\u00e1nz\u00e1 ya nsambo;s\u00e1nz\u00e1 ya mwambe;s\u00e1nz\u00e1 ya libwa;s\u00e1nz\u00e1 ya z\u00f3mi;s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301;s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9".split(";"), SHORTMONTHS:"yan fbl msi apl mai yun yul agt stb \u0254tb nvb dsb".split(" "), 
STANDALONESHORTMONTHS:"yan fbl msi apl mai yun yul agt stb \u0254tb nvb dsb".split(" "), WEEKDAYS:"eyenga;mok\u0254l\u0254 mwa yambo;mok\u0254l\u0254 mwa m\u00edbal\u00e9;mok\u0254l\u0254 mwa m\u00eds\u00e1to;mok\u0254l\u0254 ya m\u00edn\u00e9i;mok\u0254l\u0254 ya m\u00edt\u00e1no;mp\u0254\u0301s\u0254".split(";"), STANDALONEWEEKDAYS:"eyenga;mok\u0254l\u0254 mwa yambo;mok\u0254l\u0254 mwa m\u00edbal\u00e9;mok\u0254l\u0254 mwa m\u00eds\u00e1to;mok\u0254l\u0254 ya m\u00edn\u00e9i;mok\u0254l\u0254 ya m\u00edt\u00e1no;mp\u0254\u0301s\u0254".split(";"), 
SHORTWEEKDAYS:"eye ybo mbl mst min mtn mps".split(" "), STANDALONESHORTWEEKDAYS:"eye ybo mbl mst min mtn mps".split(" "), NARROWWEEKDAYS:"eymmmmp".split(""), STANDALONENARROWWEEKDAYS:"eymmmmp".split(""), SHORTQUARTERS:["SM1", "SM2", "SM3", "SM4"], QUARTERS:["s\u00e1nz\u00e1 m\u00eds\u00e1to ya yambo", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00edbal\u00e9", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00eds\u00e1to", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00ednei"], AMPMS:["nt\u0254\u0301ng\u0254\u0301", 
"mp\u00f3kwa"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "d/M/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_lo = {ERAS:["\u0e81\u0ec8\u0ead\u0e99 \u0e84.\u0eaa.", "\u0e84.\u0eaa."], ERANAMES:["\u0e81\u0ec8\u0ead\u0e99 \u0e84.\u0eaa.", "\u0e84.\u0eaa."], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u0ea1\u0eb1\u0e87\u0e81\u0ead\u0e99 \u0e81\u0eb8\u0ea1\u0e9e\u0eb2 \u0ea1\u0eb5\u0e99\u0eb2 \u0ec0\u0ea1\u0eaa\u0eb2 \u0e9e\u0eb6\u0e94\u0eaa\u0eb0\u0e9e\u0eb2 \u0ea1\u0eb4\u0e96\u0eb8\u0e99\u0eb2 \u0e81\u0ecd\u0ea5\u0eb0\u0e81\u0ebb\u0e94 \u0eaa\u0eb4\u0e87\u0eab\u0eb2 \u0e81\u0eb1\u0e99\u0e8d\u0eb2 \u0e95\u0eb8\u0ea5\u0eb2 \u0e9e\u0eb0\u0e88\u0eb4\u0e81 \u0e97\u0eb1\u0e99\u0ea7\u0eb2".split(" "), 
STANDALONEMONTHS:"\u0ea1\u0eb1\u0e87\u0e81\u0ead\u0e99 \u0e81\u0eb8\u0ea1\u0e9e\u0eb2 \u0ea1\u0eb5\u0e99\u0eb2 \u0ec0\u0ea1\u0eaa\u0eb2 \u0e9e\u0eb6\u0e94\u0eaa\u0eb0\u0e9e\u0eb2 \u0ea1\u0eb4\u0e96\u0eb8\u0e99\u0eb2 \u0e81\u0ecd\u0ea5\u0eb0\u0e81\u0ebb\u0e94 \u0eaa\u0eb4\u0e87\u0eab\u0eb2 \u0e81\u0eb1\u0e99\u0e8d\u0eb2 \u0e95\u0eb8\u0ea5\u0eb2 \u0e9e\u0eb0\u0e88\u0eb4\u0e81 \u0e97\u0eb1\u0e99\u0ea7\u0eb2".split(" "), SHORTMONTHS:"\u0ea1.\u0e81. \u0e81.\u0e9e. \u0ea1.\u0e99. \u0ea1.\u0eaa. \u0e9e.\u0e9e. \u0ea1\u0eb4.\u0e96. \u0e81.\u0ea5. \u0eaa.\u0eab. \u0e81.\u0e8d. \u0e95.\u0ea5. \u0e9e.\u0e88. \u0e97.\u0ea7.".split(" "), 
STANDALONESHORTMONTHS:"\u0ea1.\u0e81. \u0e81.\u0e9e. \u0ea1.\u0e99. \u0ea1.\u0eaa. \u0e9e.\u0e9e. \u0ea1\u0eb4.\u0e96. \u0e81.\u0ea5. \u0eaa.\u0eab. \u0e81.\u0e8d. \u0e95.\u0ea5. \u0e9e.\u0e88. \u0e97.\u0ea7.".split(" "), WEEKDAYS:"\u0ea7\u0eb1\u0e99\u0ead\u0eb2\u0e97\u0eb4\u0e94 \u0ea7\u0eb1\u0e99\u0e88\u0eb1\u0e99 \u0ea7\u0eb1\u0e99\u0ead\u0eb1\u0e87\u0e84\u0eb2\u0e99 \u0ea7\u0eb1\u0e99\u0e9e\u0eb8\u0e94 \u0ea7\u0eb1\u0e99\u0e9e\u0eb0\u0eab\u0eb1\u0e94 \u0ea7\u0eb1\u0e99\u0eaa\u0eb8\u0e81 \u0ea7\u0eb1\u0e99\u0ec0\u0eaa\u0ebb\u0eb2".split(" "), 
STANDALONEWEEKDAYS:"\u0ea7\u0eb1\u0e99\u0ead\u0eb2\u0e97\u0eb4\u0e94 \u0ea7\u0eb1\u0e99\u0e88\u0eb1\u0e99 \u0ea7\u0eb1\u0e99\u0ead\u0eb1\u0e87\u0e84\u0eb2\u0e99 \u0ea7\u0eb1\u0e99\u0e9e\u0eb8\u0e94 \u0ea7\u0eb1\u0e99\u0e9e\u0eb0\u0eab\u0eb1\u0e94 \u0ea7\u0eb1\u0e99\u0eaa\u0eb8\u0e81 \u0ea7\u0eb1\u0e99\u0ec0\u0eaa\u0ebb\u0eb2".split(" "), SHORTWEEKDAYS:"\u0ea7\u0eb1\u0e99\u0ead\u0eb2\u0e97\u0eb4\u0e94 \u0ea7\u0eb1\u0e99\u0e88\u0eb1\u0e99 \u0ea7\u0eb1\u0e99\u0ead\u0eb1\u0e87\u0e84\u0eb2\u0e99 \u0ea7\u0eb1\u0e99\u0e9e\u0eb8\u0e94 \u0ea7\u0eb1\u0e99\u0e9e\u0eb0\u0eab\u0eb1\u0e94 \u0ea7\u0eb1\u0e99\u0eaa\u0eb8\u0e81 \u0ea7\u0eb1\u0e99\u0ec0\u0eaa\u0ebb\u0eb2".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0ea7\u0eb1\u0e99\u0ead\u0eb2\u0e97\u0eb4\u0e94 \u0ea7\u0eb1\u0e99\u0e88\u0eb1\u0e99 \u0ea7\u0eb1\u0e99\u0ead\u0eb1\u0e87\u0e84\u0eb2\u0e99 \u0ea7\u0eb1\u0e99\u0e9e\u0eb8\u0e94 \u0ea7\u0eb1\u0e99\u0e9e\u0eb0\u0eab\u0eb1\u0e94 \u0ea7\u0eb1\u0e99\u0eaa\u0eb8\u0e81 \u0ea7\u0eb1\u0e99\u0ec0\u0eaa\u0ebb\u0eb2".split(" "), NARROWWEEKDAYS:"1234567".split(""), STANDALONENARROWWEEKDAYS:"\u0e97 \u0e88 \u0e84 \u200b\u0e9e\u0eb8 \u0e9e \u200b\u0eaa\u0eb8 \u0eaa".split(" "), SHORTQUARTERS:["\u0e95\u0ea11", 
"\u0e95\u0ea12", "\u0e95\u0ea13", "\u0e95\u0ea14"], QUARTERS:["\u0ec4\u0e95\u0ea3\u0ea1\u0eb2\u0e94 1", "\u0ec4\u0e95\u0ea3\u0ea1\u0eb2\u0e94 2", "\u0ec4\u0e95\u0ea3\u0ea1\u0eb2\u0e94 3", "\u0ec4\u0e95\u0ea3\u0ea1\u0eb2\u0e94 4"], AMPMS:["\u0e81\u0ec8\u0ead\u0e99\u0e97\u0ec8\u0ebd\u0e87", "\u0eab\u0ebc\u0eb1\u0e87\u0e97\u0ec8\u0ebd\u0e87"], DATEFORMATS:["EEEE \u0e97\u0eb5 d MMMM G y", "d MMMM y", "d MMM y", "d/M/y"], TIMEFORMATS:["H \u0ec2\u0ea1\u0e87 m \u0e99\u0eb2\u0e97\u0eb5 ss \u0ea7\u0eb4\u0e99\u0eb2\u0e97\u0eb5 zzzz", 
"H \u0ec2\u0ea1\u0e87 m \u0e99\u0eb2\u0e97\u0eb5 ss \u0ea7\u0eb4\u0e99\u0eb2\u0e97\u0eb5 z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_lt = {ERAS:["pr. Kr.", "po Kr."], ERANAMES:["prie\u0161 Krist\u0173", "po Kristaus"], NARROWMONTHS:"SVKBGBLRRSLG".split(""), STANDALONENARROWMONTHS:"SVKBGBLRRSLG".split(""), MONTHS:"sausis vasaris kovas balandis gegu\u017e\u0117 bir\u017eelis liepa rugpj\u016btis rugs\u0117jis spalis lapkritis gruodis".split(" "), STANDALONEMONTHS:"sausis vasaris kovas balandis gegu\u017e\u0117 bir\u017eelis liepa rugpj\u016btis rugs\u0117jis spalis lapkritis gruodis".split(" "), SHORTMONTHS:"saus. vas. kov. bal. geg. bir\u017e. liep. rugp. rugs. spal. lapkr. gruod.".split(" "), 
STANDALONESHORTMONTHS:"saus. vas. kov. bal. geg. bir\u017e. liep. rugp. rugs. spal. lapkr. gruod.".split(" "), WEEKDAYS:"sekmadienis pirmadienis antradienis tre\u010diadienis ketvirtadienis penktadienis \u0161e\u0161tadienis".split(" "), STANDALONEWEEKDAYS:"sekmadienis pirmadienis antradienis tre\u010diadienis ketvirtadienis penktadienis \u0161e\u0161tadienis".split(" "), SHORTWEEKDAYS:"sk pr an tr kt pn \u0161t".split(" "), STANDALONESHORTWEEKDAYS:"sk pr an tr kt pn \u0161t".split(" "), NARROWWEEKDAYS:"SPATKP\u0160".split(""), 
STANDALONENARROWWEEKDAYS:"SPATKP\u0160".split(""), SHORTQUARTERS:["I k.", "II k.", "III k.", "IV k."], QUARTERS:["I ketvirtis", "II ketvirtis", "III ketvirtis", "IV ketvirtis"], AMPMS:["prie\u0161piet", "popiet"], DATEFORMATS:["y 'm'. MMMM d 'd'., EEEE", "y 'm'. MMMM d 'd'.", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_lv = {ERAS:["p.m.\u0113.", "m.\u0113."], ERANAMES:["pirms m\u016bsu \u0113ras", "m\u016bsu \u0113r\u0101"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janv\u0101ris febru\u0101ris marts apr\u012blis maijs j\u016bnijs j\u016blijs augusts septembris oktobris novembris decembris".split(" "), STANDALONEMONTHS:"Janv\u0101ris Febru\u0101ris Marts Apr\u012blis Maijs J\u016bnijs J\u016blijs Augusts Septembris Oktobris Novembris Decembris".split(" "), 
SHORTMONTHS:"janv. febr. marts apr. maijs j\u016bn. j\u016bl. aug. sept. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"Janv. Febr. Marts Apr. Maijs J\u016bn. J\u016bl. Aug. Sept. Okt. Nov. Dec.".split(" "), WEEKDAYS:"sv\u0113tdiena pirmdiena otrdiena tre\u0161diena ceturtdiena piektdiena sestdiena".split(" "), STANDALONEWEEKDAYS:"Sv\u0113tdiena Pirmdiena Otrdiena Tre\u0161diena Ceturtdiena Piektdiena Sestdiena".split(" "), SHORTWEEKDAYS:"Sv Pr Ot Tr Ce Pk Se".split(" "), STANDALONESHORTWEEKDAYS:"Sv Pr Ot Tr Ce Pk Se".split(" "), 
NARROWWEEKDAYS:"SPOTCPS".split(""), STANDALONENARROWWEEKDAYS:"SPOTCPS".split(""), SHORTQUARTERS:["C1", "C2", "C3", "C4"], QUARTERS:["1. ceturksnis", "2. ceturksnis", "3. ceturksnis", "4. ceturksnis"], AMPMS:["priek\u0161pusdien\u0101", "p\u0113cpusdien\u0101"], DATEFORMATS:["EEEE, y. 'gada' d. MMMM", "y. 'gada' d. MMMM", "y. 'gada' d. MMM", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_mk = {ERAS:["\u043f\u0440.\u043d.\u0435.", "\u043d.\u0435."], ERANAMES:["\u043f\u0440.\u043d.\u0435.", "\u043d.\u0435."], NARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), STANDALONENARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), MONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d\u0438 \u0458\u0443\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), 
STANDALONEMONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d\u0438 \u0458\u0443\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), SHORTMONTHS:"\u0458\u0430\u043d. \u0444\u0435\u0432. \u043c\u0430\u0440. \u0430\u043f\u0440. \u043c\u0430\u0458 \u0458\u0443\u043d. \u0458\u0443\u043b. \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u0458\u0430\u043d. \u0444\u0435\u0432. \u043c\u0430\u0440. \u0430\u043f\u0440. \u043c\u0430\u0458 \u0458\u0443\u043d. \u0458\u0443\u043b. \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), WEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u043e\u043a \u043f\u0435\u0442\u043e\u043a \u0441\u0430\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u043e\u043a \u043f\u0435\u0442\u043e\u043a \u0441\u0430\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u043d\u0435\u0434. \u043f\u043e\u043d. \u0432\u0442. \u0441\u0440\u0435. \u0447\u0435\u0442. \u043f\u0435\u0442. \u0441\u0430\u0431.".split(" "), STANDALONESHORTWEEKDAYS:"\u043d\u0435\u0434. \u043f\u043e\u043d. \u0432\u0442. \u0441\u0440\u0435. \u0447\u0435\u0442. \u043f\u0435\u0442. \u0441\u0430\u0431.".split(" "), 
NARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), STANDALONENARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u043f\u0440\u0432\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0432\u0442\u043e\u0440\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0442\u0440\u0435\u0442\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0447\u0435\u0442\u0432\u0440\u0442\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435"], 
AMPMS:["\u043f\u0440\u0435\u0442\u043f\u043b\u0430\u0434\u043d\u0435", "\u043f\u043e\u043f\u043b\u0430\u0434\u043d\u0435"], DATEFORMATS:["EEEE, dd MMMM y '\u0433'.", "dd MMMM y '\u0433'.", "dd.M.y", "dd.M.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ml = {ERAS:["\u0d15\u0d4d\u0d30\u0d3f.\u0d2e\u0d42", "\u0d0e\u0d21\u0d3f"], ERANAMES:["\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d41\u0d4d \u0d2e\u0d41\u0d2e\u0d4d\u0d2a\u0d4d\u200c", "\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d4d \u0d2a\u0d3f\u0d7b\u0d2a\u0d4d"], NARROWMONTHS:"\u0d1c \u0d2b\u0d46 \u0d2e\u0d3e \u0d0f \u0d2e\u0d47 \u0d1c\u0d42 \u0d1c\u0d42 \u0d13 \u0d38\u0d46 \u0d12 \u0d28 \u0d21\u0d3f".split(" "), STANDALONENARROWMONTHS:"\u0d1c \u0d2b\u0d46 \u0d2e\u0d3e \u0d0f \u0d2e\u0d47 \u0d1c\u0d42 \u0d1c\u0d42 \u0d13 \u0d38\u0d46 \u0d12 \u0d28 \u0d21\u0d3f".split(" "), 
MONTHS:"\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f \u0d2e\u0d3e\u0d7c\u0d1a\u0d4d\u0d1a\u0d4d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d7d \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d06\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d7c \u0d12\u0d15\u0d4d\u200c\u0d1f\u0d4b\u0d2c\u0d7c \u0d28\u0d35\u0d02\u0d2c\u0d7c \u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d7c".split(" "), STANDALONEMONTHS:"\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f \u0d2e\u0d3e\u0d7c\u0d1a\u0d4d\u0d1a\u0d4d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d7d \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d06\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d7c \u0d12\u0d15\u0d4d\u200c\u0d1f\u0d4b\u0d2c\u0d7c \u0d28\u0d35\u0d02\u0d2c\u0d7c \u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d7c".split(" "), 
SHORTMONTHS:"\u0d1c\u0d28\u0d41 \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41 \u0d2e\u0d3e\u0d7c \u0d0f\u0d2a\u0d4d\u0d30\u0d3f \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d13\u0d17 \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02 \u0d12\u0d15\u0d4d\u0d1f\u0d4b \u0d28\u0d35\u0d02 \u0d21\u0d3f\u0d38\u0d02".split(" "), STANDALONESHORTMONTHS:"\u0d1c\u0d28\u0d41 \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41 \u0d2e\u0d3e\u0d7c \u0d0f\u0d2a\u0d4d\u0d30\u0d3f \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d13\u0d17 \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02 \u0d12\u0d15\u0d4d\u0d1f\u0d4b \u0d28\u0d35\u0d02 \u0d21\u0d3f\u0d38\u0d02".split(" "), 
WEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u0d1a \u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a".split(" "), STANDALONEWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a".split(" "), 
SHORTWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d7c \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d7e \u0d1a\u0d4a\u0d35\u0d4d\u0d35 \u0d2c\u0d41\u0d27\u0d7b \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02 \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f \u0d36\u0d28\u0d3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d7c \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d7e \u0d1a\u0d4a\u0d35\u0d4d\u0d35 \u0d2c\u0d41\u0d27\u0d7b \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02 \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f \u0d36\u0d28\u0d3f".split(" "), NARROWWEEKDAYS:"\u0d1e\u0d3e \u0d24\u0d3f \u0d1a\u0d4a \u0d2c\u0d41 \u0d35\u0d4d\u0d2f\u0d3e \u0d35\u0d46 \u0d36".split(" "), 
STANDALONENARROWWEEKDAYS:"\u0d1e\u0d3e \u0d24\u0d3f \u0d1a\u0d4a \u0d2c\u0d41 \u0d35\u0d4d\u0d2f\u0d3e \u0d35\u0d46 \u0d36".split(" "), SHORTQUARTERS:["\u0d12\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d30\u0d23\u0d4d\u0d1f\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d2e\u0d42\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d28\u0d3e\u0d32\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02"], QUARTERS:["\u0d12\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d30\u0d23\u0d4d\u0d1f\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", 
"\u0d2e\u0d42\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d28\u0d3e\u0d32\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02"], AMPMS:["AM", "PM"], DATEFORMATS:["y, MMMM d, EEEE", "y, MMMM d", "y, MMM d", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_mn = {ERAS:["\u041c\u042d\u04e8", "\u041c\u042d"], ERANAMES:["\u043c\u0430\u043d\u0430\u0439 \u044d\u0440\u0438\u043d\u0438\u0439 \u04e9\u043c\u043d\u04e9\u0445", "\u043c\u0430\u043d\u0430\u0439 \u044d\u0440\u0438\u043d\u0438\u0439"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u041d\u044d\u0433\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0425\u043e\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0413\u0443\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0414\u04e9\u0440\u04e9\u0432\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0422\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0417\u0443\u0440\u0433\u0430\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0414\u043e\u043b\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u041d\u0430\u0439\u043c\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0415\u0441\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0410\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0410\u0440\u0432\u0430\u043d \u043d\u044d\u0433\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0410\u0440\u0432\u0430\u043d \u0445\u043e\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440".split(";"), 
STANDALONEMONTHS:"\u041d\u044d\u0433\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0425\u043e\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0413\u0443\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0414\u04e9\u0440\u04e9\u0432\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0422\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0417\u0443\u0440\u0433\u0430\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0414\u043e\u043b\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u041d\u0430\u0439\u043c\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0415\u0441\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0410\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440;\u0410\u0440\u0432\u0430\u043d \u043d\u044d\u0433\u0434\u04af\u0433\u044d\u044d\u0440 \u0441\u0430\u0440;\u0410\u0440\u0432\u0430\u043d \u0445\u043e\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440".split(";"), 
SHORTMONTHS:"1-\u0440 \u0441\u0430\u0440;2-\u0440 \u0441\u0430\u0440;3-\u0440 \u0441\u0430\u0440;4-\u0440 \u0441\u0430\u0440;5-\u0440 \u0441\u0430\u0440;6-\u0440 \u0441\u0430\u0440;7-\u0440 \u0441\u0430\u0440;8-\u0440 \u0441\u0430\u0440;9-\u0440 \u0441\u0430\u0440;10-\u0440 \u0441\u0430\u0440;11-\u0440 \u0441\u0430\u0440;12-\u0440 \u0441\u0430\u0440".split(";"), STANDALONESHORTMONTHS:"1-\u0440 \u0441\u0430\u0440;2-\u0440 \u0441\u0430\u0440;3-\u0440 \u0441\u0430\u0440;4-\u0440 \u0441\u0430\u0440;5-\u0440 \u0441\u0430\u0440;6-\u0440 \u0441\u0430\u0440;7-\u0440 \u0441\u0430\u0440;8-\u0440 \u0441\u0430\u0440;9-\u0440 \u0441\u0430\u0440;10-\u0440 \u0441\u0430\u0440;11-\u0440 \u0441\u0430\u0440;12-\u0440 \u0441\u0430\u0440".split(";"), 
WEEKDAYS:"\u043d\u044f\u043c \u0434\u0430\u0432\u0430\u0430 \u043c\u044f\u0433\u043c\u0430\u0440 \u043b\u0445\u0430\u0433\u0432\u0430 \u043f\u04af\u0440\u044d\u0432 \u0431\u0430\u0430\u0441\u0430\u043d \u0431\u044f\u043c\u0431\u0430".split(" "), STANDALONEWEEKDAYS:"\u043d\u044f\u043c \u0434\u0430\u0432\u0430\u0430 \u043c\u044f\u0433\u043c\u0430\u0440 \u043b\u0445\u0430\u0433\u0432\u0430 \u043f\u04af\u0440\u044d\u0432 \u0431\u0430\u0430\u0441\u0430\u043d \u0431\u044f\u043c\u0431\u0430".split(" "), 
SHORTWEEKDAYS:"\u041d\u044f \u0414\u0430 \u041c\u044f \u041b\u0445 \u041f\u04af \u0411\u0430 \u0411\u044f".split(" "), STANDALONESHORTWEEKDAYS:"\u041d\u044f \u0414\u0430 \u041c\u044f \u041b\u0445 \u041f\u04af \u0411\u0430 \u0411\u044f".split(" "), NARROWWEEKDAYS:"1234567".split(""), STANDALONENARROWWEEKDAYS:"1234567".split(""), SHORTQUARTERS:["\u04231", "\u04232", "\u04233", "\u04234"], QUARTERS:["1-\u0440 \u0443\u043b\u0438\u0440\u0430\u043b", "2-\u0440 \u0443\u043b\u0438\u0440\u0430\u043b", "3-\u0440 \u0443\u043b\u0438\u0440\u0430\u043b", 
"4-\u0440 \u0443\u043b\u0438\u0440\u0430\u043b"], AMPMS:["\u04ae\u04e8", "\u04ae\u0425"], DATEFORMATS:["EEEE, y '\u043e\u043d\u044b' MMMM '\u0441\u0430\u0440\u044b\u043d' dd", "y '\u043e\u043d\u044b' MMMM '\u0441\u0430\u0440\u044b\u043d' d", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_mr = {ZERODIGIT:2406, ERAS:["\u0908\u0938\u093e\u092a\u0942\u0930\u094d\u0935", "\u0938\u0928"], ERANAMES:["\u0908\u0938\u0935\u0940\u0938\u0928\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u0935\u0940\u0938\u0928"], NARROWMONTHS:"\u091c\u093e \u092b\u0947 \u092e\u093e \u090f \u092e\u0947 \u091c\u0942 \u091c\u0941 \u0911 \u0938 \u0911 \u0928\u094b \u0921\u093f".split(" "), STANDALONENARROWMONTHS:"\u091c\u093e \u092b\u0947 \u092e\u093e \u090f \u092e\u0947 \u091c\u0942 \u091c\u0941 \u0911 \u0938 \u0911 \u0928\u094b \u0921\u093f".split(" "), 
MONTHS:"\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917\u0938\u094d\u091f \u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930 \u0921\u093f\u0938\u0947\u0902\u092c\u0930".split(" "), STANDALONEMONTHS:"\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917\u0938\u094d\u091f \u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930 \u0921\u093f\u0938\u0947\u0902\u092c\u0930".split(" "), 
SHORTMONTHS:"\u091c\u093e\u0928\u0947 \u092b\u0947\u092c\u094d\u0930\u0941 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917 \u0938\u092a\u094d\u091f\u0947\u0902 \u0911\u0915\u094d\u091f\u094b \u0928\u094b\u0935\u094d\u0939\u0947\u0902 \u0921\u093f\u0938\u0947\u0902".split(" "), STANDALONESHORTMONTHS:"\u091c\u093e\u0928\u0947 \u092b\u0947\u092c\u094d\u0930\u0941 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917 \u0938\u092a\u094d\u091f\u0947\u0902 \u0911\u0915\u094d\u091f\u094b \u0928\u094b\u0935\u094d\u0939\u0947\u0902 \u0921\u093f\u0938\u0947\u0902".split(" "), 
WEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0933\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), STANDALONEWEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0933\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), 
SHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0933 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), STANDALONESHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0933 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), NARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), STANDALONENARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), 
SHORTQUARTERS:["\u0924\u093f1", "\u0924\u093f2", "\u0924\u093f3", "\u0924\u093f4"], QUARTERS:["\u092a\u094d\u0930\u0925\u092e \u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u094d\u0935\u093f\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", "\u0924\u0943\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u0924\u0941\u0930\u094d\u0925 \u0924\u093f\u092e\u093e\u0939\u0940"], AMPMS:["[AM]", "[PM]"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", 
"h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} '\u0930\u094b\u091c\u0940' {0}", "{1} '\u0930\u094b\u091c\u0940' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ms = {ERAS:["S.M.", "TM"], ERANAMES:["S.M.", "TM"], NARROWMONTHS:"JFMAMJJOSOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJOSOND".split(""), MONTHS:"Januari Februari Mac April Mei Jun Julai Ogos September Oktober November Disember".split(" "), STANDALONEMONTHS:"Januari Februari Mac April Mei Jun Julai Ogos September Oktober November Disember".split(" "), SHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ogo Sep Okt Nov Dis".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ogo Sep Okt Nov Dis".split(" "), 
WEEKDAYS:"Ahad Isnin Selasa Rabu Khamis Jumaat Sabtu".split(" "), STANDALONEWEEKDAYS:"Ahad Isnin Selasa Rabu Khamis Jumaat Sabtu".split(" "), SHORTWEEKDAYS:"Ahd Isn Sel Rab Kha Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Ahd Isn Sel Rab Kha Jum Sab".split(" "), NARROWWEEKDAYS:"AISRKJS".split(""), STANDALONENARROWWEEKDAYS:"AISRKJS".split(""), SHORTQUARTERS:["S1", "S2", "S3", "S4"], QUARTERS:["Suku pertama", "Suku Ke-2", "Suku Ke-3", "Suku Ke-4"], AMPMS:["PG", "PTG"], DATEFORMATS:["EEEE, d MMMM y", 
"d MMMM y", "d MMM y", "d/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_mt = {ERAS:["QK", "WK"], ERANAMES:["Qabel Kristu", "Wara Kristu"], NARROWMONTHS:"JFMAM\u0120LASOND".split(""), STANDALONENARROWMONTHS:"JFMAM\u0120LASOND".split(""), MONTHS:"Jannar Frar Marzu April Mejju \u0120unju Lulju Awwissu Settembru Ottubru Novembru Di\u010bembru".split(" "), STANDALONEMONTHS:"Jannar Frar Marzu April Mejju \u0120unju Lulju Awwissu Settembru Ottubru Novembru Di\u010bembru".split(" "), SHORTMONTHS:"Jan Fra Mar Apr Mej \u0120un Lul Aww Set Ott Nov Di\u010b".split(" "), 
STANDALONESHORTMONTHS:"Jan Fra Mar Apr Mej \u0120un Lul Aww Set Ott Nov Di\u010b".split(" "), WEEKDAYS:"Il-\u0126add It-Tnejn It-Tlieta L-Erbg\u0127a Il-\u0126amis Il-\u0120img\u0127a Is-Sibt".split(" "), STANDALONEWEEKDAYS:"Il-\u0126add It-Tnejn It-Tlieta L-Erbg\u0127a Il-\u0126amis Il-\u0120img\u0127a Is-Sibt".split(" "), SHORTWEEKDAYS:"\u0126ad Tne Tli Erb \u0126am \u0120im Sib".split(" "), STANDALONESHORTWEEKDAYS:"\u0126ad Tne Tli Erb \u0126am \u0120im Sib".split(" "), NARROWWEEKDAYS:"\u0126TTE\u0126\u0120S".split(""), 
STANDALONENARROWWEEKDAYS:"\u0126TTE\u0126\u0120S".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["K1", "K2", "K3", "K4"], AMPMS:["QN", "WN"], DATEFORMATS:["EEEE, d 'ta'\u2019 MMMM y", "d 'ta'\u2019 MMMM y", "dd MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_my = {ZERODIGIT:4160, ERAS:["\u1018\u102e\u1005\u102e", "\u1021\u1031\u1012\u102e"], ERANAMES:["\u1001\u101b\u1005\u103a\u1010\u1031\u102c\u103a \u1019\u1015\u1031\u102b\u103a\u1019\u102e\u1000\u102c\u101c", "\u1001\u101b\u1005\u103a\u1010\u1031\u102c\u103a \u1015\u1031\u102b\u103a\u1011\u103d\u1014\u103a\u1038\u1015\u103c\u102e\u1038\u1000\u102c\u101c"], NARROWMONTHS:"\u1007\u1016\u1019\u1027\u1019\u1007\u1007\u1029\u1005\u1021\u1014\u1012".split(""), STANDALONENARROWMONTHS:"\u1007\u1016\u1019\u1027\u1019\u1007\u1007\u1029\u1005\u1021\u1014\u1012".split(""), 
MONTHS:"\u1007\u1014\u103a\u1014\u101d\u102b\u101b\u102e \u1016\u1031\u1016\u1031\u102c\u103a\u101d\u102b\u101b\u102e \u1019\u1010\u103a \u1027\u1015\u103c\u102e \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030\u101c\u102d\u102f\u1004\u103a \u1029\u1002\u102f\u1010\u103a \u1005\u1000\u103a\u1010\u1004\u103a\u1018\u102c \u1021\u1031\u102c\u1000\u103a\u1010\u102d\u102f\u1018\u102c \u1014\u102d\u102f\u101d\u1004\u103a\u1018\u102c \u1012\u102e\u1007\u1004\u103a\u1018\u102c".split(" "), STANDALONEMONTHS:"\u1007\u1014\u103a\u1014\u101d\u102b\u101b\u102e \u1016\u1031\u1016\u1031\u102c\u103a\u101d\u102b\u101b\u102e \u1019\u1010\u103a \u1027\u1015\u103c\u102e \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030\u101c\u102d\u102f\u1004\u103a \u1029\u1002\u102f\u1010\u103a \u1005\u1000\u103a\u1010\u1004\u103a\u1018\u102c \u1021\u1031\u102c\u1000\u103a\u1010\u102d\u102f\u1018\u102c \u1014\u102d\u102f\u101d\u1004\u103a\u1018\u102c \u1012\u102e\u1007\u1004\u103a\u1018\u102c".split(" "), 
SHORTMONTHS:"\u1007\u1014\u103a\u1014\u101d\u102b\u101b\u102e \u1016\u1031\u1016\u1031\u102c\u103a\u101d\u102b\u101b\u102e \u1019\u1010\u103a \u1027\u1015\u103c\u102e \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030\u101c\u102d\u102f\u1004\u103a \u1029\u1002\u102f\u1010\u103a \u1005\u1000\u103a\u1010\u1004\u103a\u1018\u102c \u1021\u1031\u102c\u1000\u103a\u1010\u102d\u102f\u1018\u102c \u1014\u102d\u102f\u101d\u1004\u103a\u1018\u102c \u1012\u102e\u1007\u1004\u103a\u1018\u102c".split(" "), STANDALONESHORTMONTHS:"\u1007\u1014\u103a\u1014\u101d\u102b\u101b\u102e \u1016\u1031\u1016\u1031\u102c\u103a\u101d\u102b\u101b\u102e \u1019\u1010\u103a \u1027\u1015\u103c\u102e \u1019\u1031 \u1007\u103d\u1014\u103a \u1007\u1030\u101c\u102d\u102f\u1004\u103a \u1029\u1002\u102f\u1010\u103a \u1005\u1000\u103a\u1010\u1004\u103a\u1018\u102c \u1021\u1031\u102c\u1000\u103a\u1010\u102d\u102f\u1018\u102c \u1014\u102d\u102f\u101d\u1004\u103a\u1018\u102c \u1012\u102e\u1007\u1004\u103a\u1018\u102c".split(" "), 
WEEKDAYS:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "), STANDALONEWEEKDAYS:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "), 
SHORTWEEKDAYS:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "), STANDALONESHORTWEEKDAYS:"\u1010\u1014\u1004\u103a\u1039\u1002\u1014\u103d\u1031 \u1010\u1014\u1004\u103a\u1039\u101c\u102c \u1021\u1004\u103a\u1039\u1002\u102b \u1017\u102f\u1012\u1039\u1013\u101f\u1030\u1038 \u1000\u103c\u102c\u101e\u1015\u1010\u1031\u1038 \u101e\u1031\u102c\u1000\u103c\u102c \u1005\u1014\u1031".split(" "), 
NARROWWEEKDAYS:"\u1010\u1010\u1021\u1017\u1000\u101e\u1005".split(""), STANDALONENARROWWEEKDAYS:"\u1010\u1010\u1021\u1017\u1000\u101e\u1005".split(""), SHORTQUARTERS:["\u1015\u1011\u1019 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a", "\u1012\u102f\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a", "\u1010\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a", "\u1005\u1010\u102f\u1010\u1039\u1011 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a"], QUARTERS:["\u1015\u1011\u1019 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a", 
"\u1012\u102f\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a", "\u1010\u1010\u102d\u101a \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a", "\u1005\u1010\u102f\u1010\u1039\u1011 \u101e\u102f\u1036\u1038\u101c\u1015\u1010\u103a"], AMPMS:["\u1014\u1036\u1014\u1000\u103a", "\u100a\u1014\u1031"], DATEFORMATS:["EEEE, y MMMM dd", "y MMMM d", "y MMM d", "yy/MM/dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1}\u1019\u103e\u102c {0}", "{1} {0}", 
"{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_nb = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), STANDALONEMONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), SHORTMONTHS:"jan. feb. mar. apr. mai jun. jul. aug. sep. okt. nov. des.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr mai jun jul aug sep okt nov des".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n. man. tir. ons. tor. fre. l\u00f8r.".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8. ma. ti. on. to. fr. l\u00f8.".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", 
"4. kvartal"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. MMM y", "dd.MM.yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} 'kl.' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ne = {ZERODIGIT:2406, ERAS:["\u0908\u0938\u093e \u092a\u0942\u0930\u094d\u0935", "\u0938\u0928\u094d"], ERANAMES:["\u0908\u0938\u093e \u092a\u0942\u0930\u094d\u0935", "\u0938\u0928\u094d"], NARROWMONTHS:"\u0967 \u0968 \u0969 \u096a \u096b \u096c \u096d \u096e \u096f \u0967\u0966 \u0967\u0967 \u0967\u0968".split(" "), STANDALONENARROWMONTHS:"\u0967 \u0968 \u0969 \u096a \u096b \u096c \u096d \u096e \u096f \u0967\u0966 \u0967\u0967 \u0967\u0968".split(" "), MONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0905\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0941\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u091f \u0938\u0947\u092a\u094d\u091f\u0947\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u092d\u0947\u092e\u094d\u092c\u0930 \u0921\u093f\u0938\u0947\u092e\u094d\u092c\u0930".split(" "), 
STANDALONEMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0905\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0941\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u091f \u0938\u0947\u092a\u094d\u091f\u0947\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u092d\u0947\u092e\u094d\u092c\u0930 \u0921\u093f\u0938\u0947\u092e\u094d\u092c\u0930".split(" "), SHORTMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0905\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0941\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u091f \u0938\u0947\u092a\u094d\u091f\u0947\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u092d\u0947\u092e\u094d\u092c\u0930 \u0921\u093f\u0938\u0947\u092e\u094d\u092c\u0930".split(" "), 
STANDALONESHORTMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0905\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0941\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u091f \u0938\u0947\u092a\u094d\u091f\u0947\u092e\u094d\u092c\u0930 \u0905\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u092d\u0947\u092e\u094d\u092c\u0930 \u0921\u093f\u0938\u0947\u092e\u094d\u092c\u0930".split(" "), WEEKDAYS:"\u0906\u0907\u0924\u092c\u093e\u0930 \u0938\u094b\u092e\u092c\u093e\u0930 \u092e\u0919\u094d\u0917\u0932\u092c\u093e\u0930 \u092c\u0941\u0927\u092c\u093e\u0930 \u092c\u093f\u0939\u0940\u092c\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u092c\u093e\u0930 \u0936\u0928\u093f\u092c\u093e\u0930".split(" "), 
STANDALONEWEEKDAYS:"\u0906\u0907\u0924\u092c\u093e\u0930 \u0938\u094b\u092e\u092c\u093e\u0930 \u092e\u0919\u094d\u0917\u0932\u092c\u093e\u0930 \u092c\u0941\u0927\u092c\u093e\u0930 \u092c\u093f\u0939\u0940\u092c\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u092c\u093e\u0930 \u0936\u0928\u093f\u092c\u093e\u0930".split(" "), SHORTWEEKDAYS:"\u0906\u0907\u0924 \u0938\u094b\u092e \u092e\u0919\u094d\u0917\u0932 \u092c\u0941\u0927 \u092c\u093f\u0939\u0940 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0906\u0907\u0924 \u0938\u094b\u092e \u092e\u0919\u094d\u0917\u0932 \u092c\u0941\u0927 \u092c\u093f\u0939\u0940 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), NARROWWEEKDAYS:"\u0906 \u0938\u094b \u092e \u092c\u0941 \u092c\u093f \u0936\u0941 \u0936".split(" "), STANDALONENARROWWEEKDAYS:"\u0906 \u0938\u094b \u092e \u092c\u0941 \u092c\u093f \u0936\u0941 \u0936".split(" "), SHORTQUARTERS:["\u092a\u0939\u093f\u0932\u094b \u0938\u0924\u094d\u0930", "\u0926\u094b\u0938\u094d\u0930\u094b \u0938\u0924\u094d\u0930", 
"\u0924\u0947\u0938\u094d\u0930\u094b \u0938\u0924\u094d\u0930", "\u091a\u094c\u0925\u094b \u0938\u0924\u094d\u0930"], QUARTERS:["\u092a\u0939\u093f\u0932\u094b \u0938\u0924\u094d\u0930", "\u0926\u094b\u0938\u094d\u0930\u094b \u0938\u0924\u094d\u0930", "\u0924\u0947\u0938\u094d\u0930\u094b \u0938\u0924\u094d\u0930", "\u091a\u094c\u0925\u094b \u0938\u0924\u094d\u0930"], AMPMS:["\u092a\u0942\u0930\u094d\u0935 \u092e\u0927\u094d\u092f\u093e\u0928\u094d\u0939", "\u0909\u0924\u094d\u0924\u0930 \u092e\u0927\u094d\u092f\u093e\u0928\u094d\u0939"], 
DATEFORMATS:["y MMMM d, EEEE", "y MMMM d", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_nl = {ERAS:["v.Chr.", "n.Chr."], ERANAMES:["Voor Christus", "na Christus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januari februari maart april mei juni juli augustus september oktober november december".split(" "), STANDALONEMONTHS:"januari februari maart april mei juni juli augustus september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mrt. apr. mei jun. jul. aug. sep. okt. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"jan feb mrt apr mei jun jul aug sep okt nov dec".split(" "), WEEKDAYS:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "), STANDALONEWEEKDAYS:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "), SHORTWEEKDAYS:"zo ma di wo do vr za".split(" "), STANDALONESHORTWEEKDAYS:"zo ma di wo do vr za".split(" "), NARROWWEEKDAYS:"ZMDWDVZ".split(""), STANDALONENARROWWEEKDAYS:"ZMDWDVZ".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1e kwartaal", 
"2e kwartaal", "3e kwartaal", "4e kwartaal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd-MM-yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_no = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), STANDALONEMONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), SHORTMONTHS:"jan. feb. mar. apr. mai jun. jul. aug. sep. okt. nov. des.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr mai jun jul aug sep okt nov des".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n. man. tir. ons. tor. fre. l\u00f8r.".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8. ma. ti. on. to. fr. l\u00f8.".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", 
"4. kvartal"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. MMM y", "dd.MM.yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} 'kl.' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_no_NO = goog.i18n.DateTimeSymbols_no;
goog.i18n.DateTimeSymbols_or = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"\u0b1c\u0b3e \u0b2b\u0b47 \u0b2e\u0b3e \u0b05 \u0b2e\u0b47 \u0b1c\u0b41 \u0b1c\u0b41 \u0b05 \u0b38\u0b47 \u0b05 \u0b28 \u0b21\u0b3f".split(" "), STANDALONENARROWMONTHS:"\u0b1c\u0b3e \u0b2b\u0b47 \u0b2e\u0b3e \u0b05 \u0b2e\u0b47 \u0b1c\u0b41 \u0b1c\u0b41 \u0b05 \u0b38\u0b47 \u0b05 \u0b28 \u0b21\u0b3f".split(" "), MONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
STANDALONEMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
SHORTMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), STANDALONESHORTMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
WEEKDAYS:"\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30 \u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30 \u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30 \u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30 \u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30 \u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30 \u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30".split(" "), STANDALONEWEEKDAYS:"\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30 \u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30 \u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30 \u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30 \u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30 \u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30 \u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30".split(" "), 
SHORTWEEKDAYS:"\u0b30\u0b2c\u0b3f \u0b38\u0b4b\u0b2e \u0b2e\u0b19\u0b4d\u0b17\u0b33 \u0b2c\u0b41\u0b27 \u0b17\u0b41\u0b30\u0b41 \u0b36\u0b41\u0b15\u0b4d\u0b30 \u0b36\u0b28\u0b3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0b30\u0b2c\u0b3f \u0b38\u0b4b\u0b2e \u0b2e\u0b19\u0b4d\u0b17\u0b33 \u0b2c\u0b41\u0b27 \u0b17\u0b41\u0b30\u0b41 \u0b36\u0b41\u0b15\u0b4d\u0b30 \u0b36\u0b28\u0b3f".split(" "), NARROWWEEKDAYS:"\u0b30 \u0b38\u0b4b \u0b2e \u0b2c\u0b41 \u0b17\u0b41 \u0b36\u0b41 \u0b36".split(" "), STANDALONENARROWWEEKDAYS:"\u0b30 \u0b38\u0b4b \u0b2e \u0b2c\u0b41 \u0b17\u0b41 \u0b36\u0b41 \u0b36".split(" "), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_pa = {ERAS:["\u0a08. \u0a2a\u0a42.", "\u0a38\u0a70\u0a28"], ERANAMES:["\u0a08. \u0a2a\u0a42.", "\u0a38\u0a70\u0a28"], NARROWMONTHS:"\u0a1c \u0a2b\u0a3c \u0a2e\u0a3e \u0a05 \u0a2e \u0a1c\u0a42 \u0a1c\u0a41 \u0a05 \u0a38 \u0a05 \u0a28 \u0a26".split(" "), STANDALONENARROWMONTHS:"\u0a1c \u0a2b\u0a3c \u0a2e\u0a3e \u0a05 \u0a2e \u0a1c\u0a42 \u0a1c\u0a41 \u0a05 \u0a38 \u0a05 \u0a28 \u0a26".split(" "), MONTHS:"\u0a1c\u0a28\u0a35\u0a30\u0a40 \u0a2b\u0a3c\u0a30\u0a35\u0a30\u0a40 \u0a2e\u0a3e\u0a30\u0a1a \u0a05\u0a2a\u0a4d\u0a30\u0a48\u0a32 \u0a2e\u0a08 \u0a1c\u0a42\u0a28 \u0a1c\u0a41\u0a32\u0a3e\u0a08 \u0a05\u0a17\u0a38\u0a24 \u0a38\u0a24\u0a70\u0a2c\u0a30 \u0a05\u0a15\u0a24\u0a42\u0a2c\u0a30 \u0a28\u0a35\u0a70\u0a2c\u0a30 \u0a26\u0a38\u0a70\u0a2c\u0a30".split(" "), 
STANDALONEMONTHS:"\u0a1c\u0a28\u0a35\u0a30\u0a40 \u0a2b\u0a3c\u0a30\u0a35\u0a30\u0a40 \u0a2e\u0a3e\u0a30\u0a1a \u0a05\u0a2a\u0a4d\u0a30\u0a48\u0a32 \u0a2e\u0a08 \u0a1c\u0a42\u0a28 \u0a1c\u0a41\u0a32\u0a3e\u0a08 \u0a05\u0a17\u0a38\u0a24 \u0a38\u0a24\u0a70\u0a2c\u0a30 \u0a05\u0a15\u0a24\u0a42\u0a2c\u0a30 \u0a28\u0a35\u0a70\u0a2c\u0a30 \u0a26\u0a38\u0a70\u0a2c\u0a30".split(" "), SHORTMONTHS:"\u0a1c\u0a28\u0a35\u0a30\u0a40 \u0a2b\u0a3c\u0a30\u0a35\u0a30\u0a40 \u0a2e\u0a3e\u0a30\u0a1a \u0a05\u0a2a\u0a4d\u0a30\u0a48\u0a32 \u0a2e\u0a08 \u0a1c\u0a42\u0a28 \u0a1c\u0a41\u0a32\u0a3e\u0a08 \u0a05\u0a17\u0a38\u0a24 \u0a38\u0a24\u0a70\u0a2c\u0a30 \u0a05\u0a15\u0a24\u0a42\u0a2c\u0a30 \u0a28\u0a35\u0a70\u0a2c\u0a30 \u0a26\u0a38\u0a70\u0a2c\u0a30".split(" "), 
STANDALONESHORTMONTHS:"\u0a1c\u0a28\u0a35\u0a30\u0a40 \u0a2b\u0a3c\u0a30\u0a35\u0a30\u0a40 \u0a2e\u0a3e\u0a30\u0a1a \u0a05\u0a2a\u0a4d\u0a30\u0a48\u0a32 \u0a2e\u0a08 \u0a1c\u0a42\u0a28 \u0a1c\u0a41\u0a32\u0a3e\u0a08 \u0a05\u0a17\u0a38\u0a24 \u0a38\u0a24\u0a70\u0a2c\u0a30 \u0a05\u0a15\u0a24\u0a42\u0a2c\u0a30 \u0a28\u0a35\u0a70\u0a2c\u0a30 \u0a26\u0a38\u0a70\u0a2c\u0a30".split(" "), WEEKDAYS:"\u0a10\u0a24\u0a35\u0a3e\u0a30 \u0a38\u0a4b\u0a2e\u0a35\u0a3e\u0a30 \u0a2e\u0a70\u0a17\u0a32\u0a35\u0a3e\u0a30 \u0a2c\u0a41\u0a27\u0a35\u0a3e\u0a30 \u0a35\u0a40\u0a30\u0a35\u0a3e\u0a30 \u0a38\u0a3c\u0a41\u0a71\u0a15\u0a30\u0a35\u0a3e\u0a30 \u0a38\u0a3c\u0a28\u0a40\u0a35\u0a3e\u0a30".split(" "), 
STANDALONEWEEKDAYS:"\u0a10\u0a24\u0a35\u0a3e\u0a30 \u0a38\u0a4b\u0a2e\u0a35\u0a3e\u0a30 \u0a2e\u0a70\u0a17\u0a32\u0a35\u0a3e\u0a30 \u0a2c\u0a41\u0a27\u0a35\u0a3e\u0a30 \u0a35\u0a40\u0a30\u0a35\u0a3e\u0a30 \u0a38\u0a3c\u0a41\u0a71\u0a15\u0a30\u0a35\u0a3e\u0a30 \u0a38\u0a3c\u0a28\u0a40\u0a35\u0a3e\u0a30".split(" "), SHORTWEEKDAYS:"\u0a10\u0a24. \u0a38\u0a4b\u0a2e. \u0a2e\u0a70\u0a17\u0a32. \u0a2c\u0a41\u0a27. \u0a35\u0a40\u0a30. \u0a38\u0a3c\u0a41\u0a71\u0a15\u0a30. \u0a38\u0a3c\u0a28\u0a40.".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0a10\u0a24. \u0a38\u0a4b\u0a2e. \u0a2e\u0a70\u0a17\u0a32. \u0a2c\u0a41\u0a27. \u0a35\u0a40\u0a30. \u0a38\u0a3c\u0a41\u0a71\u0a15\u0a30. \u0a38\u0a3c\u0a28\u0a40.".split(" "), NARROWWEEKDAYS:"\u0a10 \u0a38\u0a4b \u0a2e\u0a70 \u0a2c\u0a41\u0a71 \u0a35\u0a40 \u0a38\u0a3c\u0a41\u0a71 \u0a38\u0a3c".split(" "), STANDALONENARROWWEEKDAYS:"\u0a10 \u0a38\u0a4b \u0a2e\u0a70 \u0a2c\u0a41\u0a71 \u0a35\u0a40 \u0a38\u0a3c\u0a41\u0a71 \u0a38\u0a3c".split(" "), SHORTQUARTERS:["\u0a2a\u0a0a\u0a06", 
"\u0a05\u0a71\u0a27\u0a3e", "\u0a2a\u0a4c\u0a23\u0a3e", "\u0a2a\u0a42\u0a30\u0a3e"], QUARTERS:["\u0a2a\u0a0a\u0a06", "\u0a05\u0a71\u0a27\u0a3e", "\u0a2a\u0a4c\u0a23\u0a3e", "\u0a2a\u0a42\u0a30\u0a3e"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_pl = {ERAS:["p.n.e.", "n.e."], ERANAMES:["p.n.e.", "n.e."], NARROWMONTHS:"slmkmclswplg".split(""), STANDALONENARROWMONTHS:"slmkmclswplg".split(""), MONTHS:"stycznia lutego marca kwietnia maja czerwca lipca sierpnia wrze\u015bnia pa\u017adziernika listopada grudnia".split(" "), STANDALONEMONTHS:"stycze\u0144 luty marzec kwiecie\u0144 maj czerwiec lipiec sierpie\u0144 wrzesie\u0144 pa\u017adziernik listopad grudzie\u0144".split(" "), SHORTMONTHS:"sty lut mar kwi maj cze lip sie wrz pa\u017a lis gru".split(" "), 
STANDALONESHORTMONTHS:"sty lut mar kwi maj cze lip sie wrz pa\u017a lis gru".split(" "), WEEKDAYS:"niedziela poniedzia\u0142ek wtorek \u015broda czwartek pi\u0105tek sobota".split(" "), STANDALONEWEEKDAYS:"niedziela poniedzia\u0142ek wtorek \u015broda czwartek pi\u0105tek sobota".split(" "), SHORTWEEKDAYS:"niedz. pon. wt. \u015br. czw. pt. sob.".split(" "), STANDALONESHORTWEEKDAYS:"niedz. pon. wt. \u015br. czw. pt. sob.".split(" "), NARROWWEEKDAYS:"NPW\u015aCPS".split(""), STANDALONENARROWWEEKDAYS:"NPW\u015aCPS".split(""), 
SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["I kwarta\u0142", "II kwarta\u0142", "III kwarta\u0142", "IV kwarta\u0142"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd.MM.y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_pt = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janeiro fevereiro mar\u00e7o abril maio junho julho agosto setembro outubro novembro dezembro".split(" "), STANDALONEMONTHS:"janeiro fevereiro mar\u00e7o abril maio junho julho agosto setembro outubro novembro dezembro".split(" "), SHORTMONTHS:"jan fev mar abr mai jun jul ago set out nov dez".split(" "), 
STANDALONESHORTMONTHS:"jan fev mar abr mai jun jul ago set out nov dez".split(" "), WEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), SHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), NARROWWEEKDAYS:"DSTQQSS".split(""), STANDALONENARROWWEEKDAYS:"DSTQQSS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1\u00ba trimestre", "2\u00ba trimestre", "3\u00ba trimestre", "4\u00ba trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_pt_BR = goog.i18n.DateTimeSymbols_pt;
goog.i18n.DateTimeSymbols_pt_PT = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Janeiro Fevereiro Mar\u00e7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "), STANDALONEMONTHS:"Janeiro Fevereiro Mar\u00e7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "), SHORTMONTHS:"Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" "), 
STANDALONESHORTMONTHS:"Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" "), WEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), SHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), NARROWWEEKDAYS:"DSTQQSS".split(""), STANDALONENARROWWEEKDAYS:"DSTQQSS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1.\u00ba trimestre", "2.\u00ba trimestre", "3.\u00ba trimestre", "4.\u00ba trimestre"], AMPMS:["da manh\u00e3", "da tarde"], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} '\u00e0s' {0}", "{1} '\u00e0s' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ro = {ERAS:["\u00ee.Hr.", "d.Hr."], ERANAMES:["\u00eenainte de Hristos", "dup\u0103 Hristos"], NARROWMONTHS:"IFMAMIIASOND".split(""), STANDALONENARROWMONTHS:"IFMAMIIASOND".split(""), MONTHS:"ianuarie februarie martie aprilie mai iunie iulie august septembrie octombrie noiembrie decembrie".split(" "), STANDALONEMONTHS:"ianuarie februarie martie aprilie mai iunie iulie august septembrie octombrie noiembrie decembrie".split(" "), SHORTMONTHS:"ian. feb. mar. apr. mai iun. iul. aug. sept. oct. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"ian. feb. mar. apr. mai iun. iul. aug. sept. oct. nov. dec.".split(" "), WEEKDAYS:"duminic\u0103 luni mar\u021bi miercuri joi vineri s\u00e2mb\u0103t\u0103".split(" "), STANDALONEWEEKDAYS:"duminic\u0103 luni mar\u021bi miercuri joi vineri s\u00e2mb\u0103t\u0103".split(" "), SHORTWEEKDAYS:"Dum Lun Mar Mie Joi Vin S\u00e2m".split(" "), STANDALONESHORTWEEKDAYS:"Dum Lun Mar Mie Joi Vin S\u00e2m".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), 
SHORTQUARTERS:["trim. I", "trim. II", "trim. III", "trim. IV"], QUARTERS:["trimestrul I", "trimestrul al II-lea", "trimestrul al III-lea", "trimestrul al IV-lea"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd.MM.y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ru = {ERAS:["\u0434\u043e \u043d. \u044d.", "\u043d. \u044d."], ERANAMES:["\u0434\u043e \u043d.\u044d.", "\u043d.\u044d."], NARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), STANDALONENARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), MONTHS:"\u044f\u043d\u0432\u0430\u0440\u044f \u0444\u0435\u0432\u0440\u0430\u043b\u044f \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440\u0435\u043b\u044f \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433\u0443\u0441\u0442\u0430 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f \u043e\u043a\u0442\u044f\u0431\u0440\u044f \u043d\u043e\u044f\u0431\u0440\u044f \u0434\u0435\u043a\u0430\u0431\u0440\u044f".split(" "), 
STANDALONEMONTHS:"\u042f\u043d\u0432\u0430\u0440\u044c \u0424\u0435\u0432\u0440\u0430\u043b\u044c \u041c\u0430\u0440\u0442 \u0410\u043f\u0440\u0435\u043b\u044c \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433\u0443\u0441\u0442 \u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u041e\u043a\u0442\u044f\u0431\u0440\u044c \u041d\u043e\u044f\u0431\u0440\u044c \u0414\u0435\u043a\u0430\u0431\u0440\u044c".split(" "), SHORTMONTHS:"\u044f\u043d\u0432. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440. \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433. \u0441\u0435\u043d\u0442. \u043e\u043a\u0442. \u043d\u043e\u044f\u0431. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u042f\u043d\u0432. \u0424\u0435\u0432\u0440. \u041c\u0430\u0440\u0442 \u0410\u043f\u0440. \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433. \u0421\u0435\u043d\u0442. \u041e\u043a\u0442. \u041d\u043e\u044f\u0431. \u0414\u0435\u043a.".split(" "), WEEKDAYS:"\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0433 \u043f\u044f\u0442\u043d\u0438\u0446\u0430 \u0441\u0443\u0431\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0412\u0442\u043e\u0440\u043d\u0438\u043a \u0421\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440\u0433 \u041f\u044f\u0442\u043d\u0438\u0446\u0430 \u0421\u0443\u0431\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u0432\u0441 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u0412\u0441 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), 
NARROWWEEKDAYS:"\u0432\u0441 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONENARROWWEEKDAYS:"\u0412\u041f\u0412\u0421\u0427\u041f\u0421".split(""), SHORTQUARTERS:["1-\u0439 \u043a\u0432.", "2-\u0439 \u043a\u0432.", "3-\u0439 \u043a\u0432.", "4-\u0439 \u043a\u0432."], QUARTERS:["1-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "2-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "3-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "4-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], 
AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y '\u0433'.", "d MMMM y '\u0433'.", "d MMM y '\u0433'.", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_si = {ERAS:["\u0d9a\u0dca\u200d\u0dbb\u0dd2.\u0db4\u0dd6.", "\u0d9a\u0dca\u200d\u0dbb\u0dd2.\u0dc0."], ERANAMES:["\u0d9a\u0dca\u200d\u0dbb\u0dd2\u0dc3\u0dca\u0dad\u0dd4 \u0db4\u0dd6\u0dbb\u0dca\u200d\u0dc0", "\u0d9a\u0dca\u200d\u0dbb\u0dd2\u0dc3\u0dca\u0dad\u0dd4 \u0dc0\u0dbb\u0dca\u200d\u0dc2"], NARROWMONTHS:"\u0da2 \u0db4\u0dd9 \u0db8\u0dcf \u0d85 \u0db8\u0dd0 \u0da2\u0dd6 \u0da2\u0dd6 \u0d85 \u0dc3\u0dd0 \u0d94 \u0db1\u0dd9 \u0daf\u0dd9".split(" "), STANDALONENARROWMONTHS:"\u0da2 \u0db4\u0dd9 \u0db8\u0dcf \u0d85 \u0db8\u0dd0 \u0da2\u0dd6 \u0da2\u0dd6 \u0d85 \u0dc3\u0dd0 \u0d94 \u0db1\u0dd9 \u0daf\u0dd9".split(" "), 
MONTHS:"\u0da2\u0db1\u0dc0\u0dcf\u0dbb\u0dd2 \u0db4\u0dd9\u0db6\u0dbb\u0dc0\u0dcf\u0dbb\u0dd2 \u0db8\u0dcf\u0dbb\u0dca\u0dad\u0dd4 \u0d85\u0db4\u0dca\u200d\u0dbb\u0dda\u0dbd\u0dca \u0db8\u0dd0\u0dba\u0dd2 \u0da2\u0dd6\u0db1\u0dd2 \u0da2\u0dd6\u0dbd\u0dd2 \u0d85\u0d9c\u0ddd\u0dc3\u0dca\u0dad\u0dd4 \u0dc3\u0dd0\u0db4\u0dca\u0dad\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca \u0d94\u0d9a\u0dca\u0dad\u0ddd\u0db6\u0dbb\u0dca \u0db1\u0ddc\u0dc0\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca \u0daf\u0dd9\u0dc3\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca".split(" "), 
STANDALONEMONTHS:"\u0da2\u0db1\u0dc0\u0dcf\u0dbb\u0dd2 \u0db4\u0dd9\u0db6\u0dbb\u0dc0\u0dcf\u0dbb\u0dd2 \u0db8\u0dcf\u0dbb\u0dca\u0dad\u0dd4 \u0d85\u0db4\u0dca\u200d\u0dbb\u0dda\u0dbd\u0dca \u0db8\u0dd0\u0dba\u0dd2 \u0da2\u0dd6\u0db1\u0dd2 \u0da2\u0dd6\u0dbd\u0dd2 \u0d85\u0d9c\u0ddd\u0dc3\u0dca\u0dad\u0dd4 \u0dc3\u0dd0\u0db4\u0dca\u0dad\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca \u0d94\u0d9a\u0dca\u0dad\u0ddd\u0db6\u0dbb\u0dca \u0db1\u0ddc\u0dc0\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca \u0daf\u0dd9\u0dc3\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca".split(" "), 
SHORTMONTHS:"\u0da2\u0db1 \u0db4\u0dd9\u0db6 \u0db8\u0dcf\u0dbb\u0dca\u0dad\u0dd4 \u0d85\u0db4\u0dca\u200d\u0dbb\u0dda\u0dbd\u0dca \u0db8\u0dd0\u0dba\u0dd2 \u0da2\u0dd6\u0db1\u0dd2 \u0da2\u0dd6\u0dbd\u0dd2 \u0d85\u0d9c\u0ddd \u0dc3\u0dd0\u0db4\u0dca \u0d94\u0d9a\u0dca \u0db1\u0ddc\u0dc0\u0dd0 \u0daf\u0dd9\u0dc3\u0dd0".split(" "), STANDALONESHORTMONTHS:"\u0da2\u0db1 \u0db4\u0dd9\u0db6 \u0db8\u0dcf\u0dbb\u0dca \u0d85\u0db4\u0dca\u200d\u0dbb\u0dda\u0dbd\u0dca \u0db8\u0dd0\u0dba\u0dd2 \u0da2\u0dd6\u0db1\u0dd2 \u0da2\u0dd6\u0dbd\u0dd2 \u0d85\u0d9c\u0ddd \u0dc3\u0dd0\u0db4\u0dca \u0d94\u0d9a\u0dca \u0db1\u0ddc\u0dc0\u0dd0 \u0daf\u0dd9\u0dc3\u0dd0".split(" "), 
WEEKDAYS:"\u0d89\u0dbb\u0dd2\u0daf\u0dcf \u0dc3\u0db3\u0dd4\u0daf\u0dcf \u0d85\u0d9f\u0dc4\u0dbb\u0dd4\u0dc0\u0dcf\u0daf\u0dcf \u0db6\u0daf\u0dcf\u0daf\u0dcf \u0db6\u0dca\u200d\u0dbb\u0dc4\u0dc3\u0dca\u0db4\u0dad\u0dd2\u0db1\u0dca\u0daf\u0dcf \u0dc3\u0dd2\u0d9a\u0dd4\u0dbb\u0dcf\u0daf\u0dcf \u0dc3\u0dd9\u0db1\u0dc3\u0dd4\u0dbb\u0dcf\u0daf\u0dcf".split(" "), STANDALONEWEEKDAYS:"\u0d89\u0dbb\u0dd2\u0daf\u0dcf \u0dc3\u0db3\u0dd4\u0daf\u0dcf \u0d85\u0d9f\u0dc4\u0dbb\u0dd4\u0dc0\u0dcf\u0daf\u0dcf \u0db6\u0daf\u0dcf\u0daf\u0dcf \u0db6\u0dca\u200d\u0dbb\u0dc4\u0dc3\u0dca\u0db4\u0dad\u0dd2\u0db1\u0dca\u0daf\u0dcf \u0dc3\u0dd2\u0d9a\u0dd4\u0dbb\u0dcf\u0daf\u0dcf \u0dc3\u0dd9\u0db1\u0dc3\u0dd4\u0dbb\u0dcf\u0daf\u0dcf".split(" "), 
SHORTWEEKDAYS:"\u0d89\u0dbb\u0dd2\u0daf\u0dcf \u0dc3\u0db3\u0dd4\u0daf\u0dcf \u0d85\u0d9f\u0dc4 \u0db6\u0daf\u0dcf\u0daf\u0dcf \u0db6\u0dca\u200d\u0dbb\u0dc4\u0dc3\u0dca \u0dc3\u0dd2\u0d9a\u0dd4 \u0dc3\u0dd9\u0db1".split(" "), STANDALONESHORTWEEKDAYS:"\u0d89\u0dbb\u0dd2\u0daf\u0dcf \u0dc3\u0db3\u0dd4\u0daf\u0dcf \u0d85\u0d9f\u0dc4 \u0db6\u0daf\u0dcf\u0daf\u0dcf \u0db6\u0dca\u200d\u0dbb\u0dc4\u0dc3\u0dca \u0dc3\u0dd2\u0d9a\u0dd4 \u0dc3\u0dd9\u0db1".split(" "), NARROWWEEKDAYS:"\u0d89 \u0dc3 \u0d85 \u0db6 \u0db6\u0dca\u200d\u0dbb \u0dc3\u0dd2 \u0dc3\u0dd9".split(" "), 
STANDALONENARROWWEEKDAYS:"\u0d89 \u0dc3 \u0d85 \u0db6 \u0db6\u0dca\u200d\u0dbb \u0dc3\u0dd2 \u0dc3\u0dd9".split(" "), SHORTQUARTERS:["\u0d9a\u0dcf\u0dbb\u0dca:1", "\u0d9a\u0dcf\u0dbb\u0dca:2", "\u0d9a\u0dcf\u0dbb\u0dca:3", "\u0d9a\u0dcf\u0dbb\u0dca:4"], QUARTERS:["1 \u0dc0\u0db1 \u0d9a\u0dcf\u0dbb\u0dca\u0dad\u0dd4\u0dc0", "2 \u0dc0\u0db1 \u0d9a\u0dcf\u0dbb\u0dca\u0dad\u0dd4\u0dc0", "3 \u0dc0\u0db1 \u0d9a\u0dcf\u0dbb\u0dca\u0dad\u0dd4\u0dc0", "4 \u0dc0\u0db1 \u0d9a\u0dcf\u0dbb\u0dca\u0dad\u0dd4\u0dc0"], 
AMPMS:["\u0db4\u0dd9.\u0dc0.", "\u0db4.\u0dc0."], DATEFORMATS:["y MMMM d, EEEE", "y MMMM d", "y MMM d", "y-MM-dd"], TIMEFORMATS:["a h.mm.ss zzzz", "a h.mm.ss z", "a h.mm.ss", "a h.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sk = {ERAS:["pred n.l.", "n.l."], ERANAMES:["pred n.l.", "n.l."], NARROWMONTHS:"jfmamjjasond".split(""), STANDALONENARROWMONTHS:"jfmamjjasond".split(""), MONTHS:"janu\u00e1ra febru\u00e1ra marca apr\u00edla m\u00e1ja j\u00fana j\u00fala augusta septembra okt\u00f3bra novembra decembra".split(" "), STANDALONEMONTHS:"janu\u00e1r febru\u00e1r marec apr\u00edl m\u00e1j j\u00fan j\u00fal august september okt\u00f3ber november december".split(" "), SHORTMONTHS:"jan feb mar apr m\u00e1j j\u00fan j\u00fal aug sep okt nov dec".split(" "), 
STANDALONESHORTMONTHS:"jan feb mar apr m\u00e1j j\u00fan j\u00fal aug sep okt nov dec".split(" "), WEEKDAYS:"nede\u013ea pondelok utorok streda \u0161tvrtok piatok sobota".split(" "), STANDALONEWEEKDAYS:"nede\u013ea pondelok utorok streda \u0161tvrtok piatok sobota".split(" "), SHORTWEEKDAYS:"ne po ut st \u0161t pi so".split(" "), STANDALONESHORTWEEKDAYS:"ne po ut st \u0161t pi so".split(" "), NARROWWEEKDAYS:"NPUS\u0160PS".split(""), STANDALONENARROWWEEKDAYS:"NPUS\u0160PS".split(""), SHORTQUARTERS:["Q1", 
"Q2", "Q3", "Q4"], QUARTERS:["1. \u0161tvr\u0165rok", "2. \u0161tvr\u0165rok", "3. \u0161tvr\u0165rok", "4. \u0161tvr\u0165rok"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d.M.y", "d.M.y"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sl = {ERAS:["pr. n. \u0161t.", "po Kr."], ERANAMES:["pred na\u0161im \u0161tetjem", "na\u0161e \u0161tetje"], NARROWMONTHS:"jfmamjjasond".split(""), STANDALONENARROWMONTHS:"jfmamjjasond".split(""), MONTHS:"januar februar marec april maj junij julij avgust september oktober november december".split(" "), STANDALONEMONTHS:"januar februar marec april maj junij julij avgust september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mar. apr. maj jun. jul. avg. sep. okt. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"jan feb mar apr maj jun jul avg sep okt nov dec".split(" "), WEEKDAYS:"nedelja ponedeljek torek sreda \u010detrtek petek sobota".split(" "), STANDALONEWEEKDAYS:"nedelja ponedeljek torek sreda \u010detrtek petek sobota".split(" "), SHORTWEEKDAYS:"ned. pon. tor. sre. \u010det. pet. sob.".split(" "), STANDALONESHORTWEEKDAYS:"ned pon tor sre \u010det pet sob".split(" "), NARROWWEEKDAYS:"npts\u010dps".split(""), STANDALONENARROWWEEKDAYS:"npts\u010dps".split(""), SHORTQUARTERS:["Q1", 
"Q2", "Q3", "Q4"], QUARTERS:["1. \u010detrtletje", "2. \u010detrtletje", "3. \u010detrtletje", "4. \u010detrtletje"], AMPMS:["dop.", "pop."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "d. MMM y", "d. MM. yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sq = {ERAS:["p.e.r.", "e.r."], ERANAMES:["para er\u00ebs s\u00eb re", "er\u00ebs s\u00eb re"], NARROWMONTHS:"JSMPMQKGSTND".split(""), STANDALONENARROWMONTHS:"JSMPMQKGSTND".split(""), MONTHS:"janar shkurt mars prill maj qershor korrik gusht shtator tetor n\u00ebntor dhjetor".split(" "), STANDALONEMONTHS:"janar shkurt mars prill maj qershor korrik gusht shtator tetor n\u00ebntor dhjetor".split(" "), SHORTMONTHS:"Jan Shk Mar Pri Maj Qer Kor Gsh Sht Tet N\u00ebn Dhj".split(" "), 
STANDALONESHORTMONTHS:"Jan Shk Mar Pri Maj Qer Kor Gsh Sht Tet N\u00ebn Dhj".split(" "), WEEKDAYS:"e diel;e h\u00ebn\u00eb;e mart\u00eb;e m\u00ebrkur\u00eb;e enjte;e premte;e shtun\u00eb".split(";"), STANDALONEWEEKDAYS:"e diel;e h\u00ebn\u00eb;e mart\u00eb;e m\u00ebrkur\u00eb;e enjte;e premte;e shtun\u00eb".split(";"), SHORTWEEKDAYS:"Die H\u00ebn Mar M\u00ebr Enj Pre Sht".split(" "), STANDALONESHORTWEEKDAYS:"Die H\u00ebn Mar M\u00ebr Enj Pre Sht".split(" "), NARROWWEEKDAYS:"DHMMEPS".split(""), STANDALONENARROWWEEKDAYS:"DHMMEPS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["tremujori i par\u00eb", "tremujori i dyt\u00eb", "tremujori i tret\u00eb", "tremujori i kat\u00ebrt"], AMPMS:["paradite", "pasdite"], DATEFORMATS:["EEEE, dd MMMM y", "dd MMMM y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'n\u00eb' {0}", "{1} 'n\u00eb' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sr = {ERAS:["\u043f. \u043d. \u0435.", "\u043d. \u0435."], ERANAMES:["\u041f\u0440\u0435 \u043d\u043e\u0432\u0435 \u0435\u0440\u0435", "\u041d\u043e\u0432\u0435 \u0435\u0440\u0435"], NARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), STANDALONENARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), MONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440 \u0444\u0435\u0431\u0440\u0443\u0430\u0440 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440 \u043e\u043a\u0442\u043e\u0431\u0430\u0440 \u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440 \u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440".split(" "), 
STANDALONEMONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440 \u0444\u0435\u0431\u0440\u0443\u0430\u0440 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440 \u043e\u043a\u0442\u043e\u0431\u0430\u0440 \u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440 \u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440".split(" "), SHORTMONTHS:"\u0458\u0430\u043d \u0444\u0435\u0431 \u043c\u0430\u0440 \u0430\u043f\u0440 \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433 \u0441\u0435\u043f \u043e\u043a\u0442 \u043d\u043e\u0432 \u0434\u0435\u0446".split(" "), 
STANDALONESHORTMONTHS:"\u0458\u0430\u043d \u0444\u0435\u0431 \u043c\u0430\u0440 \u0430\u043f\u0440 \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433 \u0441\u0435\u043f \u043e\u043a\u0442 \u043d\u043e\u0432 \u0434\u0435\u0446".split(" "), WEEKDAYS:"\u043d\u0435\u0434\u0435\u0459\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a \u0443\u0442\u043e\u0440\u0430\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a \u043f\u0435\u0442\u0430\u043a \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u043d\u0435\u0434\u0435\u0459\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a \u0443\u0442\u043e\u0440\u0430\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a \u043f\u0435\u0442\u0430\u043a \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u043d\u0435\u0434 \u043f\u043e\u043d \u0443\u0442\u043e \u0441\u0440\u0435 \u0447\u0435\u0442 \u043f\u0435\u0442 \u0441\u0443\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u043d\u0435\u0434 \u043f\u043e\u043d \u0443\u0442\u043e \u0441\u0440\u0435 \u0447\u0435\u0442 \u043f\u0435\u0442 \u0441\u0443\u0431".split(" "), 
NARROWWEEKDAYS:"\u043d\u043f\u0443\u0441\u0447\u043f\u0441".split(""), STANDALONENARROWWEEKDAYS:"\u043d\u043f\u0443\u0441\u0447\u043f\u0441".split(""), SHORTQUARTERS:["\u041a1", "\u041a2", "\u041a3", "\u041a4"], QUARTERS:["\u041f\u0440\u0432\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0414\u0440\u0443\u0433\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0422\u0440\u0435\u045b\u0435 \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", 
"\u0427\u0435\u0442\u0432\u0440\u0442\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435"], AMPMS:["\u043f\u0440\u0435 \u043f\u043e\u0434\u043d\u0435", "\u043f\u043e\u043f\u043e\u0434\u043d\u0435"], DATEFORMATS:["EEEE, dd. MMMM y.", "dd. MMMM y.", "dd.MM.y.", "d.M.yy."], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sv = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f\u00f6re Kristus", "efter Kristus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januari februari mars april maj juni juli augusti september oktober november december".split(" "), STANDALONEMONTHS:"Januari Februari Mars April Maj Juni Juli Augusti September Oktober November December".split(" "), SHORTMONTHS:"jan feb mar apr maj jun jul aug sep okt nov dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Maj Jun Jul Aug Sep Okt Nov Dec".split(" "), 
WEEKDAYS:"s\u00f6ndag m\u00e5ndag tisdag onsdag torsdag fredag l\u00f6rdag".split(" "), STANDALONEWEEKDAYS:"S\u00f6ndag M\u00e5ndag Tisdag Onsdag Torsdag Fredag L\u00f6rdag".split(" "), SHORTWEEKDAYS:"s\u00f6n m\u00e5n tis ons tors fre l\u00f6r".split(" "), STANDALONESHORTWEEKDAYS:"S\u00f6n M\u00e5n Tis Ons Tor Fre L\u00f6r".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1:a kvartalet", "2:a kvartalet", 
"3:e kvartalet", "4:e kvartalet"], AMPMS:["fm", "em"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "y-MM-dd"], TIMEFORMATS:["'kl'. HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sw = {ERAS:["KK", "BK"], ERANAMES:["Kabla ya Kristo", "Baada ya Kristo"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Machi Aprili Mei Juni Julai Agosti Septemba Oktoba Novemba Desemba".split(" "), STANDALONEMONTHS:"Januari Februari Machi Aprili Mei Juni Julai Agosti Septemba Oktoba Novemba Desemba".split(" "), SHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), STANDALONEWEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), SHORTWEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), STANDALONESHORTWEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), NARROWWEEKDAYS:"2345AI1".split(""), STANDALONENARROWWEEKDAYS:"2345AI1".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Robo 1", 
"Robo 2", "Robo 3", "Robo 4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ta = {ERAS:["\u0b95\u0bbf.\u0bae\u0bc1.", "\u0b95\u0bbf.\u0baa\u0bbf."], ERANAMES:["\u0b95\u0bbf\u0bb1\u0bbf\u0bb8\u0bcd\u0ba4\u0bc1\u0bb5\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0bae\u0bc1\u0ba9\u0bcd", "\u0b85\u0ba9\u0bcb \u0b9f\u0bcb\u0bae\u0bbf\u0ba9\u0bbf"], NARROWMONTHS:"\u0b9c \u0baa\u0bbf \u0bae\u0bbe \u0b8f \u0bae\u0bc7 \u0b9c\u0bc2 \u0b9c\u0bc2 \u0b86 \u0b9a\u0bc6 \u0b85 \u0ba8 \u0b9f\u0bbf".split(" "), STANDALONENARROWMONTHS:"\u0b9c \u0baa\u0bbf \u0bae\u0bbe \u0b8f \u0bae\u0bc7 \u0b9c\u0bc2 \u0b9c\u0bc2 \u0b86 \u0b9a\u0bc6 \u0b85 \u0ba8 \u0b9f\u0bbf".split(" "), 
MONTHS:"\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf \u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf \u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd \u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bcd \u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd \u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd".split(" "), STANDALONEMONTHS:"\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf \u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf \u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd \u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bc1 \u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd \u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd".split(" "), 
SHORTMONTHS:"\u0b9c\u0ba9. \u0baa\u0bbf\u0baa\u0bcd. \u0bae\u0bbe\u0bb0\u0bcd. \u0b8f\u0baa\u0bcd. \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95. \u0b9a\u0bc6\u0baa\u0bcd. \u0b85\u0b95\u0bcd. \u0ba8\u0bb5. \u0b9f\u0bbf\u0b9a.".split(" "), STANDALONESHORTMONTHS:"\u0b9c\u0ba9. \u0baa\u0bbf\u0baa\u0bcd. \u0bae\u0bbe\u0bb0\u0bcd. \u0b8f\u0baa\u0bcd. \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95. \u0b9a\u0bc6\u0baa\u0bcd. \u0b85\u0b95\u0bcd. \u0ba8\u0bb5. \u0b9f\u0bbf\u0b9a.".split(" "), 
WEEKDAYS:"\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1 \u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd \u0baa\u0bc1\u0ba4\u0ba9\u0bcd \u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd \u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf \u0b9a\u0ba9\u0bbf".split(" "), STANDALONEWEEKDAYS:"\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1 \u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd \u0baa\u0bc1\u0ba4\u0ba9\u0bcd \u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd \u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf \u0b9a\u0ba9\u0bbf".split(" "), 
SHORTWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), STANDALONESHORTWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), NARROWWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), STANDALONENARROWWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), SHORTQUARTERS:["\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc11", 
"\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc12", "\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc13", "\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc14"], QUARTERS:["\u0bae\u0bc1\u0ba4\u0bb2\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0b87\u0bb0\u0ba3\u0bcd\u0b9f\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0bae\u0bc2\u0ba9\u0bcd\u0bb1\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0ba8\u0bbe\u0ba9\u0bcd\u0b95\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1"], 
AMPMS:["\u0bae\u0bc1\u0bb1\u0bcd\u0baa\u0b95\u0bb2\u0bcd", "\u0baa\u0bbf\u0bb1\u0bcd\u0baa\u0b95\u0bb2\u0bcd"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_te = {ERAS:["\u0c15\u0c4d\u0c30\u0c40\u0c2a\u0c42", "\u0c15\u0c4d\u0c30\u0c40\u0c36"], ERANAMES:["\u0c08\u0c38\u0c3e\u0c2a\u0c42\u0c30\u0c4d\u0c35.", "\u0c38\u0c28\u0c4d."], NARROWMONTHS:"\u0c1c \u0c2b\u0c3f \u0c2e\u0c3e \u0c0f \u0c2e\u0c47 \u0c1c\u0c42 \u0c1c\u0c41 \u0c06 \u0c38\u0c46 \u0c05 \u0c28 \u0c21\u0c3f".split(" "), STANDALONENARROWMONTHS:"\u0c1c \u0c2b\u0c3f \u0c2e\u0c3e \u0c0f \u0c2e\u0c47 \u0c1c\u0c42 \u0c1c\u0c41 \u0c06 \u0c38\u0c46 \u0c05 \u0c28 \u0c21\u0c3f".split(" "), 
MONTHS:"\u0c1c\u0c28\u0c35\u0c30\u0c3f \u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0e\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c41\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), STANDALONEMONTHS:"\u0c1c\u0c28\u0c35\u0c30\u0c3f \u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0e\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c42\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), 
SHORTMONTHS:"\u0c1c\u0c28 \u0c2b\u0c3f\u0c2c\u0c4d\u0c30 \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0f\u0c2a\u0c4d\u0c30\u0c3f \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c41\u0c32\u0c48 \u0c06\u0c17 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02 \u0c05\u0c15\u0c4d\u0c1f\u0c4b \u0c28\u0c35\u0c02 \u0c21\u0c3f\u0c38\u0c46\u0c02".split(" "), STANDALONESHORTMONTHS:"\u0c1c\u0c28 \u0c2b\u0c3f\u0c2c\u0c4d\u0c30 \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0f\u0c2a\u0c4d\u0c30\u0c3f \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c41\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02 \u0c05\u0c15\u0c4d\u0c1f\u0c4b \u0c28\u0c35\u0c02 \u0c21\u0c3f\u0c38\u0c46\u0c02".split(" "), 
WEEKDAYS:"\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02 \u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02 \u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02 \u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02 \u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02".split(" "), STANDALONEWEEKDAYS:"\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02 \u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02 \u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02 \u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02 \u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02".split(" "), 
SHORTWEEKDAYS:"\u0c06\u0c26\u0c3f \u0c38\u0c4b\u0c2e \u0c2e\u0c02\u0c17\u0c33 \u0c2c\u0c41\u0c27 \u0c17\u0c41\u0c30\u0c41 \u0c36\u0c41\u0c15\u0c4d\u0c30 \u0c36\u0c28\u0c3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0c06\u0c26\u0c3f \u0c38\u0c4b\u0c2e \u0c2e\u0c02\u0c17\u0c33 \u0c2c\u0c41\u0c27 \u0c17\u0c41\u0c30\u0c41 \u0c36\u0c41\u0c15\u0c4d\u0c30 \u0c36\u0c28\u0c3f".split(" "), NARROWWEEKDAYS:"\u0c06 \u0c38\u0c4b \u0c2e \u0c2c\u0c41 \u0c17\u0c41 \u0c36\u0c41 \u0c36".split(" "), STANDALONENARROWWEEKDAYS:"\u0c06 \u0c38\u0c4b \u0c2e \u0c2c\u0c41 \u0c17\u0c41 \u0c36\u0c41 \u0c36".split(" "), 
SHORTQUARTERS:["\u0c24\u0c4d\u0c30\u0c481", "\u0c24\u0c4d\u0c30\u0c482", "\u0c24\u0c4d\u0c30\u0c483", "\u0c24\u0c4d\u0c30\u0c484"], QUARTERS:["1\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02", "2\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02", "3\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02", "4\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02"], AMPMS:["AM", "PM"], DATEFORMATS:["d MMMM y EEEE", "d MMMM y", "d MMM y", "dd-MM-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", 
"h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_th = {ERAS:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19 \u0e04.\u0e28.", "\u0e04.\u0e28."], ERANAMES:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a", "\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a"], NARROWMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), 
STANDALONENARROWMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), MONTHS:"\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21 \u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c \u0e21\u0e35\u0e19\u0e32\u0e04\u0e21 \u0e40\u0e21\u0e29\u0e32\u0e22\u0e19 \u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21 \u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19 \u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21 \u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21 \u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19 \u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21".split(" "), 
STANDALONEMONTHS:"\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21 \u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c \u0e21\u0e35\u0e19\u0e32\u0e04\u0e21 \u0e40\u0e21\u0e29\u0e32\u0e22\u0e19 \u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21 \u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19 \u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21 \u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21 \u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19 \u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21".split(" "), 
SHORTMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), STANDALONESHORTMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), WEEKDAYS:"\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c \u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18 \u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35 \u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c".split(" "), 
STANDALONEWEEKDAYS:"\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c \u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18 \u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35 \u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c".split(" "), SHORTWEEKDAYS:"\u0e2d\u0e32. \u0e08. \u0e2d. \u0e1e. \u0e1e\u0e24. \u0e28. \u0e2a.".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0e2d\u0e32. \u0e08. \u0e2d. \u0e1e. \u0e1e\u0e24. \u0e28. \u0e2a.".split(" "), NARROWWEEKDAYS:"\u0e2d\u0e32 \u0e08 \u0e2d \u0e1e \u0e1e\u0e24 \u0e28 \u0e2a".split(" "), STANDALONENARROWWEEKDAYS:"\u0e2d\u0e32 \u0e08 \u0e2d \u0e1e \u0e1e\u0e24 \u0e28 \u0e2a".split(" "), SHORTQUARTERS:["\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 1", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 2", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 3", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 4"], QUARTERS:["\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 1", 
"\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 2", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 3", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 4"], AMPMS:["\u0e01\u0e48\u0e2d\u0e19\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07", "\u0e2b\u0e25\u0e31\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07"], DATEFORMATS:["EEEE\u0e17\u0e35\u0e48 d MMMM G y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 mm \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 zzzz", "H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 mm \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 z", 
"HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_tl = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"EPMAMHHASOND".split(""), STANDALONENARROWMONTHS:"EPMAMHHASOND".split(""), MONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), STANDALONEMONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), SHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), STANDALONESHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), 
WEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), STANDALONEWEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), SHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), STANDALONESHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), NARROWWEEKDAYS:"LLMMHBS".split(""), STANDALONENARROWWEEKDAYS:"LLMMHBS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ika-1 quarter", "ika-2 quarter", "ika-3 quarter", "ika-4 na quarter"], AMPMS:["AM", 
"PM"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'ng' {0}", "{1} 'ng' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_tr = {ERAS:["M\u00d6", "MS"], ERANAMES:["Milattan \u00d6nce", "Milattan Sonra"], NARROWMONTHS:"O\u015eMNMHTAEEKA".split(""), STANDALONENARROWMONTHS:"O\u015eMNMHTAEEKA".split(""), MONTHS:"Ocak \u015eubat Mart Nisan May\u0131s Haziran Temmuz A\u011fustos Eyl\u00fcl Ekim Kas\u0131m Aral\u0131k".split(" "), STANDALONEMONTHS:"Ocak \u015eubat Mart Nisan May\u0131s Haziran Temmuz A\u011fustos Eyl\u00fcl Ekim Kas\u0131m Aral\u0131k".split(" "), SHORTMONTHS:"Oca \u015eub Mar Nis May Haz Tem A\u011fu Eyl Eki Kas Ara".split(" "), 
STANDALONESHORTMONTHS:"Oca \u015eub Mar Nis May Haz Tem A\u011fu Eyl Eki Kas Ara".split(" "), WEEKDAYS:"Pazar Pazartesi Sal\u0131 \u00c7ar\u015famba Per\u015fembe Cuma Cumartesi".split(" "), STANDALONEWEEKDAYS:"Pazar Pazartesi Sal\u0131 \u00c7ar\u015famba Per\u015fembe Cuma Cumartesi".split(" "), SHORTWEEKDAYS:"Paz Pzt Sal \u00c7ar Per Cum Cmt".split(" "), STANDALONESHORTWEEKDAYS:"Paz Pzt Sal \u00c7ar Per Cum Cmt".split(" "), NARROWWEEKDAYS:"PPS\u00c7PCC".split(""), STANDALONENARROWWEEKDAYS:"PPS\u00c7PCC".split(""), 
SHORTQUARTERS:["\u00c71", "\u00c72", "\u00c73", "\u00c74"], QUARTERS:["1. \u00e7eyrek", "2. \u00e7eyrek", "3. \u00e7eyrek", "4. \u00e7eyrek"], AMPMS:["\u00d6\u00d6", "\u00d6S"], DATEFORMATS:["d MMMM y EEEE", "d MMMM y", "d MMM y", "d MM y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_uk = {ERAS:["\u0434\u043e \u043d.\u0435.", "\u043d.\u0435."], ERANAMES:["\u0434\u043e \u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438", "\u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438"], NARROWMONTHS:"\u0421\u041b\u0411\u041a\u0422\u0427\u041b\u0421\u0412\u0416\u041b\u0413".split(""), STANDALONENARROWMONTHS:"\u0421\u041b\u0411\u041a\u0422\u0427\u041b\u0421\u0412\u0416\u041b\u0413".split(""), MONTHS:"\u0441\u0456\u0447\u043d\u044f \u043b\u044e\u0442\u043e\u0433\u043e \u0431\u0435\u0440\u0435\u0437\u043d\u044f \u043a\u0432\u0456\u0442\u043d\u044f \u0442\u0440\u0430\u0432\u043d\u044f \u0447\u0435\u0440\u0432\u043d\u044f \u043b\u0438\u043f\u043d\u044f \u0441\u0435\u0440\u043f\u043d\u044f \u0432\u0435\u0440\u0435\u0441\u043d\u044f \u0436\u043e\u0432\u0442\u043d\u044f \u043b\u0438\u0441\u0442\u043e\u043f\u0430\u0434\u0430 \u0433\u0440\u0443\u0434\u043d\u044f".split(" "), 
STANDALONEMONTHS:"\u0421\u0456\u0447\u0435\u043d\u044c \u041b\u044e\u0442\u0438\u0439 \u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c \u041a\u0432\u0456\u0442\u0435\u043d\u044c \u0422\u0440\u0430\u0432\u0435\u043d\u044c \u0427\u0435\u0440\u0432\u0435\u043d\u044c \u041b\u0438\u043f\u0435\u043d\u044c \u0421\u0435\u0440\u043f\u0435\u043d\u044c \u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c \u0416\u043e\u0432\u0442\u0435\u043d\u044c \u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434 \u0413\u0440\u0443\u0434\u0435\u043d\u044c".split(" "), 
SHORTMONTHS:"\u0441\u0456\u0447. \u043b\u044e\u0442. \u0431\u0435\u0440. \u043a\u0432\u0456\u0442. \u0442\u0440\u0430\u0432. \u0447\u0435\u0440\u0432. \u043b\u0438\u043f. \u0441\u0435\u0440\u043f. \u0432\u0435\u0440. \u0436\u043e\u0432\u0442. \u043b\u0438\u0441\u0442. \u0433\u0440\u0443\u0434.".split(" "), STANDALONESHORTMONTHS:"\u0421\u0456\u0447 \u041b\u044e\u0442 \u0411\u0435\u0440 \u041a\u0432\u0456 \u0422\u0440\u0430 \u0427\u0435\u0440 \u041b\u0438\u043f \u0421\u0435\u0440 \u0412\u0435\u0440 \u0416\u043e\u0432 \u041b\u0438\u0441 \u0413\u0440\u0443".split(" "), 
WEEKDAYS:"\u043d\u0435\u0434\u0456\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0432\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0441\u0435\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0435\u0440 \u043f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), STANDALONEWEEKDAYS:"\u041d\u0435\u0434\u0456\u043b\u044f \u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0421\u0435\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440 \u041f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f \u0421\u0443\u0431\u043e\u0442\u0430".split(" "), 
SHORTWEEKDAYS:"\u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), NARROWWEEKDAYS:"\u041d\u041f\u0412\u0421\u0427\u041f\u0421".split(""), STANDALONENARROWWEEKDAYS:"\u041d\u041f\u0412\u0421\u0427\u041f\u0421".split(""), SHORTQUARTERS:["I \u043a\u0432.", "II \u043a\u0432.", "III \u043a\u0432.", "IV \u043a\u0432."], QUARTERS:["I \u043a\u0432\u0430\u0440\u0442\u0430\u043b", 
"II \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "III \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "IV \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], AMPMS:["\u0434\u043f", "\u043f\u043f"], DATEFORMATS:["EEEE, d MMMM y '\u0440'.", "d MMMM y '\u0440'.", "d MMM y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ur = {ERAS:["\u0642 \u0645", "\u0639\u06cc\u0633\u0648\u06cc \u0633\u0646"], ERANAMES:["\u0642\u0628\u0644 \u0645\u0633\u06cc\u062d", "\u0639\u06cc\u0633\u0648\u06cc \u0633\u0646"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), 
STANDALONEWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), SHORTWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), STANDALONESHORTWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), 
NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["\u067e\u06c1\u0644\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062f\u0648\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062a\u06cc\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u0686\u0648\u062a\u0647\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc"], QUARTERS:["\u067e\u06c1\u0644\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062f\u0648\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", 
"\u062a\u06cc\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u0686\u0648\u062a\u0647\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc"], AMPMS:["\u0642\u0628\u0644 \u062f\u0648\u067e\u06c1\u0631", "\u0628\u0639\u062f \u062f\u0648\u067e\u06c1\u0631"], DATEFORMATS:["EEEE\u060c d MMMM\u060c y", "d MMMM\u060c y", "d MMM\u060c y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 
6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_uz = {ERAS:["M.A.", "E"], ERANAMES:["M.A.", "E"], NARROWMONTHS:"YFMAMIIASOND".split(""), STANDALONENARROWMONTHS:"YFMAMIIASOND".split(""), MONTHS:"Yanvar Fevral Mart Aprel May Iyun Iyul Avgust Sentyabr Oktyabr Noyabr Dekabr".split(" "), STANDALONEMONTHS:"Yanvar Fevral Mart Aprel May Iyun Iyul Avgust Sentyabr Oktyabr Noyabr Dekabr".split(" "), SHORTMONTHS:"Yanv Fev Mar Apr May Iyun Iyul Avg Sen Okt Noya Dek".split(" "), STANDALONESHORTMONTHS:"Yanv Fev Mar Apr May Iyun Iyul Avg Sen Okt Noya Dek".split(" "), 
WEEKDAYS:"yakshanba dushanba seshanba chorshanba payshanba juma shanba".split(" "), STANDALONEWEEKDAYS:"yakshanba dushanba seshanba chorshanba payshanba juma shanba".split(" "), SHORTWEEKDAYS:"Yaksh Dush Sesh Chor Pay Jum Shan".split(" "), STANDALONESHORTWEEKDAYS:"Yaksh Dush Sesh Chor Pay Jum Shan".split(" "), NARROWWEEKDAYS:"YDSCPJS".split(""), STANDALONENARROWWEEKDAYS:"YDSCPJS".split(""), SHORTQUARTERS:["1-ch", "2-ch", "3-ch", "4-ch"], QUARTERS:["1-chorak", "2-chorak", "3-chorak", "4-chorak"], 
AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, y MMMM dd", "y MMMM d", "y MMM d", "yy/MM/dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_vi = {ERAS:["tr. CN", "sau CN"], ERANAMES:["tr. CN", "sau CN"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"th\u00e1ng 1;th\u00e1ng 2;th\u00e1ng 3;th\u00e1ng 4;th\u00e1ng 5;th\u00e1ng 6;th\u00e1ng 7;th\u00e1ng 8;th\u00e1ng 9;th\u00e1ng 10;th\u00e1ng 11;th\u00e1ng 12".split(";"), STANDALONEMONTHS:"Th\u00e1ng 1;Th\u00e1ng 2;Th\u00e1ng 3;Th\u00e1ng 4;Th\u00e1ng 5;Th\u00e1ng 6;Th\u00e1ng 7;Th\u00e1ng 8;Th\u00e1ng 9;Th\u00e1ng 10;Th\u00e1ng 11;Th\u00e1ng 12".split(";"), 
SHORTMONTHS:"thg 1;thg 2;thg 3;thg 4;thg 5;thg 6;thg 7;thg 8;thg 9;thg 10;thg 11;thg 12".split(";"), STANDALONESHORTMONTHS:"Thg 1;Thg 2;Thg 3;Thg 4;Thg 5;Thg 6;Thg 7;Thg 8;Thg 9;Thg 10;Thg 11;Thg 12".split(";"), WEEKDAYS:"Ch\u1ee7 Nh\u1eadt;Th\u1ee9 Hai;Th\u1ee9 Ba;Th\u1ee9 T\u01b0;Th\u1ee9 N\u0103m;Th\u1ee9 S\u00e1u;Th\u1ee9 B\u1ea3y".split(";"), STANDALONEWEEKDAYS:"Ch\u1ee7 Nh\u1eadt;Th\u1ee9 Hai;Th\u1ee9 Ba;Th\u1ee9 T\u01b0;Th\u1ee9 N\u0103m;Th\u1ee9 S\u00e1u;Th\u1ee9 B\u1ea3y".split(";"), SHORTWEEKDAYS:"CN;Th 2;Th 3;Th 4;Th 5;Th 6;Th 7".split(";"), 
STANDALONESHORTWEEKDAYS:"CN;Th 2;Th 3;Th 4;Th 5;Th 6;Th 7".split(";"), NARROWWEEKDAYS:"CN T2 T3 T4 T5 T6 T7".split(" "), STANDALONENARROWWEEKDAYS:"CN T2 T3 T4 T5 T6 T7".split(" "), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Qu\u00fd 1", "Qu\u00fd 2", "Qu\u00fd 3", "Qu\u00fd 4"], AMPMS:["SA", "CH"], DATEFORMATS:["EEEE, 'ng\u00e0y' dd MMMM 'n\u0103m' y", "'Ng\u00e0y' dd 'th\u00e1ng' MM 'n\u0103m' y", "dd-MM-y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{0} {1}", 
"{0} {1}", "{0} {1}", "{0} {1}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_zh = {ERAS:["\u516c\u5143\u524d", "\u516c\u5143"], ERANAMES:["\u516c\u5143\u524d", "\u516c\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), STANDALONEMONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), 
SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), 
SHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), STANDALONESHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63\u5ea6", "2\u5b63\u5ea6", "3\u5b63\u5ea6", "4\u5b63\u5ea6"], QUARTERS:["\u7b2c\u4e00\u5b63\u5ea6", 
"\u7b2c\u4e8c\u5b63\u5ea6", "\u7b2c\u4e09\u5b63\u5ea6", "\u7b2c\u56db\u5b63\u5ea6"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", "yy/M/d"], TIMEFORMATS:["zzzzah:mm:ss", "zah:mm:ss", "ah:mm:ss", "ah:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zh_CN = goog.i18n.DateTimeSymbols_zh;
goog.i18n.DateTimeSymbols_zh_HK = {ERAS:["\u897f\u5143\u524d", "\u897f\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), 
STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), SHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), 
STANDALONESHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", "\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", 
"y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", "d/M/yy"], TIMEFORMATS:["ah:mm:ss [zzzz]", "ah:mm:ss [z]", "ah:mm:ss", "ah:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1}{0}", "{1}{0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zh_TW = {ERAS:["\u897f\u5143\u524d", "\u897f\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), 
STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), SHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), 
STANDALONESHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", "\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", 
"y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", "y/M/d"], TIMEFORMATS:["zzzzah\u6642mm\u5206ss\u79d2", "zah\u6642mm\u5206ss\u79d2", "ah:mm:ss", "ah:mm"], DATETIMEFORMATS:["{1}{0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zu = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januwari Februwari Mashi Apreli Meyi Juni Julayi Agasti Septhemba Okthoba Novemba Disemba".split(" "), STANDALONEMONTHS:"uJanuwari uFebruwari uMashi u-Apreli uMeyi uJuni uJulayi uAgasti uSepthemba u-Okthoba uNovemba uDisemba".split(" "), SHORTMONTHS:"Jan Feb Mas Apr Mey Jun Jul Aga Sep Okt Nov Dis".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mas Apr Mey Jun Jul Aga Sep Okt Nov Dis".split(" "), 
WEEKDAYS:"Sonto Msombuluko Lwesibili Lwesithathu Lwesine Lwesihlanu Mgqibelo".split(" "), STANDALONEWEEKDAYS:"Sonto Msombuluko Lwesibili Lwesithathu Lwesine Lwesihlanu Mgqibelo".split(" "), SHORTWEEKDAYS:"Son Mso Bil Tha Sin Hla Mgq".split(" "), STANDALONESHORTWEEKDAYS:"Son Mso Bil Tha Sin Hla Mgq".split(" "), NARROWWEEKDAYS:"SMTTSHM".split(""), STANDALONENARROWWEEKDAYS:"SMBTSHM".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ikota engu-1", "ikota engu-2", "ikota engu-3", "ikota engu-4"], 
AMPMS:["Ekuseni", "Ntambama"], DATEFORMATS:["EEEE dd MMMM y", "d MMMM y", "d MMM y", "y-MM-dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols = "af" == goog.LOCALE ? goog.i18n.DateTimeSymbols_af : "am" == goog.LOCALE ? goog.i18n.DateTimeSymbols_am : "ar" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ar : "az" == goog.LOCALE ? goog.i18n.DateTimeSymbols_az : "bg" == goog.LOCALE ? goog.i18n.DateTimeSymbols_bg : "bn" == goog.LOCALE ? goog.i18n.DateTimeSymbols_bn : "br" == goog.LOCALE ? goog.i18n.DateTimeSymbols_br : "ca" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ca : "chr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_chr : 
"cs" == goog.LOCALE ? goog.i18n.DateTimeSymbols_cs : "cy" == goog.LOCALE ? goog.i18n.DateTimeSymbols_cy : "da" == goog.LOCALE ? goog.i18n.DateTimeSymbols_da : "de" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de : "de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de_AT : "de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de : "el" == goog.LOCALE ? goog.i18n.DateTimeSymbols_el : "en" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en : "en_AU" == goog.LOCALE || 
"en-AU" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_AU : "en_GB" == goog.LOCALE || "en-GB" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_GB : "en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_IE : "en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_IN : "en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_SG : "en_US" == goog.LOCALE || "en-US" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en : "en_ZA" == goog.LOCALE || 
"en-ZA" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_ZA : "es" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es : "es_419" == goog.LOCALE || "es-419" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es : "es_ES" == goog.LOCALE || "es-ES" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es : "et" == goog.LOCALE ? goog.i18n.DateTimeSymbols_et : "eu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_eu : "fa" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fa : "fi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fi : "fil" == goog.LOCALE ? 
goog.i18n.DateTimeSymbols_fil : "fr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fr : "fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fr_CA : "gl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gl : "gsw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gsw : "gu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gu : "haw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_haw : "he" == goog.LOCALE ? goog.i18n.DateTimeSymbols_he : "hi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hi : "hr" == goog.LOCALE ? 
goog.i18n.DateTimeSymbols_hr : "hu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hu : "hy" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hy : "id" == goog.LOCALE ? goog.i18n.DateTimeSymbols_id : "in" == goog.LOCALE ? goog.i18n.DateTimeSymbols_in : "is" == goog.LOCALE ? goog.i18n.DateTimeSymbols_is : "it" == goog.LOCALE ? goog.i18n.DateTimeSymbols_it : "iw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_iw : "ja" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ja : "ka" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ka : 
"kk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_kk : "km" == goog.LOCALE ? goog.i18n.DateTimeSymbols_km : "kn" == goog.LOCALE ? goog.i18n.DateTimeSymbols_kn : "ko" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ko : "ky" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ky : "ln" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ln : "lo" == goog.LOCALE ? goog.i18n.DateTimeSymbols_lo : "lt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_lt : "lv" == goog.LOCALE ? goog.i18n.DateTimeSymbols_lv : "mk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mk : 
"ml" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ml : "mn" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mn : "mr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mr : "ms" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ms : "mt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mt : "my" == goog.LOCALE ? goog.i18n.DateTimeSymbols_my : "nb" == goog.LOCALE ? goog.i18n.DateTimeSymbols_nb : "ne" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ne : "nl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_nl : "no" == goog.LOCALE ? goog.i18n.DateTimeSymbols_no : 
"no_NO" == goog.LOCALE || "no-NO" == goog.LOCALE ? goog.i18n.DateTimeSymbols_no : "or" == goog.LOCALE ? goog.i18n.DateTimeSymbols_or : "pa" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pa : "pl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pl : "pt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt : "pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt : "pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt_PT : "ro" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ro : 
"ru" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ru : "si" == goog.LOCALE ? goog.i18n.DateTimeSymbols_si : "sk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sk : "sl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sl : "sq" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sq : "sr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sr : "sv" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sv : "sw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sw : "ta" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ta : "te" == goog.LOCALE ? goog.i18n.DateTimeSymbols_te : 
"th" == goog.LOCALE ? goog.i18n.DateTimeSymbols_th : "tl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_tl : "tr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_tr : "uk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_uk : "ur" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ur : "uz" == goog.LOCALE ? goog.i18n.DateTimeSymbols_uz : "vi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_vi : "zh" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh : "zh_CN" == goog.LOCALE || "zh-CN" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh : 
"zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh_HK : "zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh_TW : "zu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zu : goog.i18n.DateTimeSymbols_en;
// INPUT (javascript/closure/date/datelike.js)
goog.date = {};
// INPUT (javascript/closure/date/date.js)
goog.date.weekDay = {MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6};
goog.date.month = {JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11};
goog.date.formatMonthAndYear = function(monthName, yearNum) {
  var MSG_MONTH_AND_YEAR = monthName + (" " + yearNum);
  return MSG_MONTH_AND_YEAR;
};
goog.date.splitDateStringRegex_ = /^(\d{4})(?:(?:-?(\d{2})(?:-?(\d{2}))?)|(?:-?(\d{3}))|(?:-?W(\d{2})(?:-?([1-7]))?))?$/;
goog.date.splitTimeStringRegex_ = /^(\d{2})(?::?(\d{2})(?::?(\d{2})(\.\d+)?)?)?$/;
goog.date.splitTimezoneStringRegex_ = /Z|(?:([-+])(\d{2})(?::?(\d{2}))?)$/;
goog.date.splitDurationRegex_ = /^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
goog.date.MS_PER_DAY = 864E5;
goog.date.isLeapYear = function(year) {
  return 0 == year % 4 && (0 != year % 100 || 0 == year % 400);
};
goog.date.isLongIsoYear = function(year) {
  var n = 5 * year + 12 - 4 * (Math.floor(year / 100) - Math.floor(year / 400)), n = n + (Math.floor((year - 100) / 400) - Math.floor((year - 102) / 400)), n = n + (Math.floor((year - 200) / 400) - Math.floor((year - 199) / 400));
  return 5 > n % 28;
};
goog.date.getNumberOfDaysInMonth = function(year, month) {
  switch(month) {
    case goog.date.month.FEB:
      return goog.date.isLeapYear(year) ? 29 : 28;
    case goog.date.month.JUN:
    ;
    case goog.date.month.SEP:
    ;
    case goog.date.month.NOV:
    ;
    case goog.date.month.APR:
      return 30;
  }
  return 31;
};
goog.date.isSameDay = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getDate() == now.getDate() && goog.date.isSameMonth(date, now);
};
goog.date.isSameMonth = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getMonth() == now.getMonth() && goog.date.isSameYear(date, now);
};
goog.date.isSameYear = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getFullYear() == now.getFullYear();
};
goog.date.getWeekNumber = function(year, month, date, opt_weekDay, opt_firstDayOfWeek) {
  var d = new Date(year, month, date), cutoff = opt_weekDay || goog.date.weekDay.THU, firstday = opt_firstDayOfWeek || goog.date.weekDay.MON, isoday = (d.getDay() + 6) % 7, daypos = (isoday - firstday + 7) % 7, cutoffpos = (cutoff - firstday + 7) % 7, cutoffSameWeek = d.valueOf() + (cutoffpos - daypos) * goog.date.MS_PER_DAY, jan1 = (new Date((new Date(cutoffSameWeek)).getFullYear(), 0, 1)).valueOf();
  return Math.floor(Math.round((cutoffSameWeek - jan1) / goog.date.MS_PER_DAY) / 7) + 1;
};
goog.date.min = function(date1, date2) {
  return date1 < date2 ? date1 : date2;
};
goog.date.max = function(date1, date2) {
  return date1 > date2 ? date1 : date2;
};
goog.date.fromIsoString = function(formatted) {
  var ret = new goog.date.DateTime(2E3);
  return goog.date.setIso8601DateTime(ret, formatted) ? ret : null;
};
goog.date.setIso8601DateTime = function(dateTime, formatted) {
  formatted = goog.string.trim(formatted);
  var delim = -1 == formatted.indexOf("T") ? " " : "T", parts = formatted.split(delim);
  return goog.date.setIso8601DateOnly_(dateTime, parts[0]) && (2 > parts.length || goog.date.setIso8601TimeOnly_(dateTime, parts[1]));
};
goog.date.setIso8601DateOnly_ = function(d, formatted) {
  var parts = formatted.match(goog.date.splitDateStringRegex_);
  if (!parts) {
    return!1;
  }
  var year = Number(parts[1]), month = Number(parts[2]), date = Number(parts[3]), dayOfYear = Number(parts[4]), week = Number(parts[5]), dayOfWeek = Number(parts[6]) || 1;
  d.setFullYear(year);
  if (dayOfYear) {
    d.setDate(1);
    d.setMonth(0);
    var offset = dayOfYear - 1;
    d.add(new goog.date.Interval(goog.date.Interval.DAYS, offset));
  } else {
    week ? goog.date.setDateFromIso8601Week_(d, week, dayOfWeek) : (month && (d.setDate(1), d.setMonth(month - 1)), date && d.setDate(date));
  }
  return!0;
};
goog.date.setDateFromIso8601Week_ = function(d, week, dayOfWeek) {
  d.setMonth(0);
  d.setDate(1);
  var jsDay = d.getDay(), jan1WeekDay = jsDay || 7, startDelta = 4 >= jan1WeekDay ? 1 - jan1WeekDay : 8 - jan1WeekDay, absoluteDays = Number(dayOfWeek) + 7 * (Number(week) - 1), delta = startDelta + absoluteDays - 1, interval = new goog.date.Interval(goog.date.Interval.DAYS, delta);
  d.add(interval);
};
goog.date.setIso8601TimeOnly_ = function(d, formatted) {
  var parts = formatted.match(goog.date.splitTimezoneStringRegex_), offset = 0;
  parts && ("Z" != parts[0] && (offset = 60 * parts[2] + Number(parts[3]), offset *= "-" == parts[1] ? 1 : -1), offset -= d.getTimezoneOffset(), formatted = formatted.substr(0, formatted.length - parts[0].length));
  parts = formatted.match(goog.date.splitTimeStringRegex_);
  if (!parts) {
    return!1;
  }
  d.setHours(Number(parts[1]));
  d.setMinutes(Number(parts[2]) || 0);
  d.setSeconds(Number(parts[3]) || 0);
  d.setMilliseconds(parts[4] ? 1E3 * parts[4] : 0);
  0 != offset && d.setTime(d.getTime() + 6E4 * offset);
  return!0;
};
goog.date.Interval = function(opt_years, opt_months, opt_days, opt_hours, opt_minutes, opt_seconds) {
  if (goog.isString(opt_years)) {
    var type = opt_years, interval = opt_months;
    this.years = type == goog.date.Interval.YEARS ? interval : 0;
    this.months = type == goog.date.Interval.MONTHS ? interval : 0;
    this.days = type == goog.date.Interval.DAYS ? interval : 0;
    this.hours = type == goog.date.Interval.HOURS ? interval : 0;
    this.minutes = type == goog.date.Interval.MINUTES ? interval : 0;
    this.seconds = type == goog.date.Interval.SECONDS ? interval : 0;
  } else {
    this.years = opt_years || 0, this.months = opt_months || 0, this.days = opt_days || 0, this.hours = opt_hours || 0, this.minutes = opt_minutes || 0, this.seconds = opt_seconds || 0;
  }
};
goog.date.Interval.fromIsoString = function(duration) {
  var parts = duration.match(goog.date.splitDurationRegex_);
  if (!parts) {
    return null;
  }
  var timeEmpty = !(parts[6] || parts[7] || parts[8]), dateTimeEmpty = timeEmpty && !(parts[2] || parts[3] || parts[4]);
  if (dateTimeEmpty || timeEmpty && parts[5]) {
    return null;
  }
  var negative = parts[1], years = parseInt(parts[2], 10) || 0, months = parseInt(parts[3], 10) || 0, days = parseInt(parts[4], 10) || 0, hours = parseInt(parts[6], 10) || 0, minutes = parseInt(parts[7], 10) || 0, seconds = parseFloat(parts[8]) || 0;
  return negative ? new goog.date.Interval(-years, -months, -days, -hours, -minutes, -seconds) : new goog.date.Interval(years, months, days, hours, minutes, seconds);
};
goog.date.Interval.prototype.toIsoString = function(opt_verbose) {
  var minField = Math.min(this.years, this.months, this.days, this.hours, this.minutes, this.seconds), maxField = Math.max(this.years, this.months, this.days, this.hours, this.minutes, this.seconds);
  if (0 > minField && 0 < maxField) {
    return null;
  }
  if (!opt_verbose && 0 == minField && 0 == maxField) {
    return "PT0S";
  }
  var res = [];
  0 > minField && res.push("-");
  res.push("P");
  (this.years || opt_verbose) && res.push(Math.abs(this.years) + "Y");
  (this.months || opt_verbose) && res.push(Math.abs(this.months) + "M");
  (this.days || opt_verbose) && res.push(Math.abs(this.days) + "D");
  if (this.hours || this.minutes || this.seconds || opt_verbose) {
    res.push("T"), (this.hours || opt_verbose) && res.push(Math.abs(this.hours) + "H"), (this.minutes || opt_verbose) && res.push(Math.abs(this.minutes) + "M"), (this.seconds || opt_verbose) && res.push(Math.abs(this.seconds) + "S");
  }
  return res.join("");
};
goog.date.Interval.prototype.equals = function(other) {
  return other.years == this.years && other.months == this.months && other.days == this.days && other.hours == this.hours && other.minutes == this.minutes && other.seconds == this.seconds;
};
goog.date.Interval.prototype.clone = function() {
  return new goog.date.Interval(this.years, this.months, this.days, this.hours, this.minutes, this.seconds);
};
goog.date.Interval.YEARS = "y";
goog.date.Interval.MONTHS = "m";
goog.date.Interval.DAYS = "d";
goog.date.Interval.HOURS = "h";
goog.date.Interval.MINUTES = "n";
goog.date.Interval.SECONDS = "s";
goog.date.Interval.prototype.getInverse = function() {
  return this.times(-1);
};
goog.date.Interval.prototype.times = function(n) {
  return new goog.date.Interval(this.years * n, this.months * n, this.days * n, this.hours * n, this.minutes * n, this.seconds * n);
};
goog.date.Interval.prototype.add = function(interval) {
  this.years += interval.years;
  this.months += interval.months;
  this.days += interval.days;
  this.hours += interval.hours;
  this.minutes += interval.minutes;
  this.seconds += interval.seconds;
};
goog.date.Date = function(opt_year, opt_month, opt_date) {
  goog.isNumber(opt_year) ? (this.date = this.buildDate_(opt_year, opt_month || 0, opt_date || 1), this.maybeFixDst_(opt_date || 1)) : goog.isObject(opt_year) ? (this.date = this.buildDate_(opt_year.getFullYear(), opt_year.getMonth(), opt_year.getDate()), this.maybeFixDst_(opt_year.getDate())) : (this.date = new Date(goog.now()), this.date.setHours(0), this.date.setMinutes(0), this.date.setSeconds(0), this.date.setMilliseconds(0));
};
goog.date.Date.prototype.buildDate_ = function(fullYear, month, date) {
  var d = new Date(fullYear, month, date);
  0 <= fullYear && 100 > fullYear && d.setFullYear(d.getFullYear() - 1900);
  return d;
};
goog.date.Date.prototype.firstDayOfWeek_ = goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK;
goog.date.Date.prototype.firstWeekCutOffDay_ = goog.i18n.DateTimeSymbols.FIRSTWEEKCUTOFFDAY;
goog.date.Date.prototype.clone = function() {
  var date = new goog.date.Date(this.date);
  date.firstDayOfWeek_ = this.firstDayOfWeek_;
  date.firstWeekCutOffDay_ = this.firstWeekCutOffDay_;
  return date;
};
goog.date.Date.prototype.getFullYear = function() {
  return this.date.getFullYear();
};
goog.date.Date.prototype.getYear = function() {
  return this.getFullYear();
};
goog.date.Date.prototype.getMonth = function() {
  return this.date.getMonth();
};
goog.date.Date.prototype.getDate = function() {
  return this.date.getDate();
};
goog.date.Date.prototype.getTime = function() {
  return this.date.getTime();
};
goog.date.Date.prototype.getDay = function() {
  return this.date.getDay();
};
goog.date.Date.prototype.getIsoWeekday = function() {
  return(this.getDay() + 6) % 7;
};
goog.date.Date.prototype.getUTCFullYear = function() {
  return this.date.getUTCFullYear();
};
goog.date.Date.prototype.getUTCMonth = function() {
  return this.date.getUTCMonth();
};
goog.date.Date.prototype.getUTCDate = function() {
  return this.date.getUTCDate();
};
goog.date.Date.prototype.getUTCDay = function() {
  return this.date.getDay();
};
goog.date.Date.prototype.getUTCHours = function() {
  return this.date.getUTCHours();
};
goog.date.Date.prototype.getUTCMinutes = function() {
  return this.date.getUTCMinutes();
};
goog.date.Date.prototype.getFirstDayOfWeek = function() {
  return this.firstDayOfWeek_;
};
goog.date.Date.prototype.getFirstWeekCutOffDay = function() {
  return this.firstWeekCutOffDay_;
};
goog.date.Date.prototype.getNumberOfDaysInMonth = function() {
  return goog.date.getNumberOfDaysInMonth(this.getFullYear(), this.getMonth());
};
goog.date.Date.prototype.getWeekNumber = function() {
  return goog.date.getWeekNumber(this.getFullYear(), this.getMonth(), this.getDate(), this.firstWeekCutOffDay_, this.firstDayOfWeek_);
};
goog.date.Date.prototype.getDayOfYear = function() {
  for (var dayOfYear = this.getDate(), year = this.getFullYear(), m = this.getMonth() - 1;0 <= m;m--) {
    dayOfYear += goog.date.getNumberOfDaysInMonth(year, m);
  }
  return dayOfYear;
};
goog.date.Date.prototype.getTimezoneOffset = function() {
  return this.date.getTimezoneOffset();
};
goog.date.Date.prototype.getTimezoneOffsetString = function() {
  var tz, offset = this.getTimezoneOffset();
  if (0 == offset) {
    tz = "Z";
  } else {
    var n = Math.abs(offset) / 60, h = Math.floor(n), m = 60 * (n - h);
    tz = (0 < offset ? "-" : "+") + goog.string.padNumber(h, 2) + ":" + goog.string.padNumber(m, 2);
  }
  return tz;
};
goog.date.Date.prototype.set = function(date) {
  this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
goog.date.Date.prototype.setFullYear = function(year) {
  this.date.setFullYear(year);
};
goog.date.Date.prototype.setYear = function(year) {
  this.setFullYear(year);
};
goog.date.Date.prototype.setMonth = function(month) {
  this.date.setMonth(month);
};
goog.date.Date.prototype.setDate = function(date) {
  this.date.setDate(date);
};
goog.date.Date.prototype.setTime = function(ms) {
  this.date.setTime(ms);
};
goog.date.Date.prototype.setUTCFullYear = function(year) {
  this.date.setUTCFullYear(year);
};
goog.date.Date.prototype.setUTCMonth = function(month) {
  this.date.setUTCMonth(month);
};
goog.date.Date.prototype.setUTCDate = function(date) {
  this.date.setUTCDate(date);
};
goog.date.Date.prototype.setFirstDayOfWeek = function(day) {
  this.firstDayOfWeek_ = day;
};
goog.date.Date.prototype.setFirstWeekCutOffDay = function(day) {
  this.firstWeekCutOffDay_ = day;
};
goog.date.Date.prototype.add = function(interval) {
  if (interval.years || interval.months) {
    var month = this.getMonth() + interval.months + 12 * interval.years, year = this.getYear() + Math.floor(month / 12), month = month % 12;
    0 > month && (month += 12);
    var daysInTargetMonth = goog.date.getNumberOfDaysInMonth(year, month), date = Math.min(daysInTargetMonth, this.getDate());
    this.setDate(1);
    this.setFullYear(year);
    this.setMonth(month);
    this.setDate(date);
  }
  if (interval.days) {
    var noon = new Date(this.getYear(), this.getMonth(), this.getDate(), 12), result = new Date(noon.getTime() + 864E5 * interval.days);
    this.setDate(1);
    this.setFullYear(result.getFullYear());
    this.setMonth(result.getMonth());
    this.setDate(result.getDate());
    this.maybeFixDst_(result.getDate());
  }
};
goog.date.Date.prototype.toIsoString = function(opt_verbose, opt_tz) {
  var str = [this.getFullYear(), goog.string.padNumber(this.getMonth() + 1, 2), goog.string.padNumber(this.getDate(), 2)];
  return str.join(opt_verbose ? "-" : "") + (opt_tz ? this.getTimezoneOffsetString() : "");
};
goog.date.Date.prototype.equals = function(other) {
  return!(!other || this.getYear() != other.getYear() || this.getMonth() != other.getMonth() || this.getDate() != other.getDate());
};
goog.date.Date.prototype.toString = function() {
  return this.toIsoString();
};
goog.date.Date.prototype.maybeFixDst_ = function(expected) {
  if (this.getDate() != expected) {
    var dir = this.getDate() < expected ? 1 : -1;
    this.date.setUTCHours(this.date.getUTCHours() + dir);
  }
};
goog.date.Date.prototype.valueOf = function() {
  return this.date.valueOf();
};
goog.date.Date.compare = function(date1, date2) {
  return date1.getTime() - date2.getTime();
};
goog.date.DateTime = function(opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds, opt_milliseconds) {
  this.date = goog.isNumber(opt_year) ? new Date(opt_year, opt_month || 0, opt_date || 1, opt_hours || 0, opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0) : new Date(opt_year ? opt_year.getTime() : goog.now());
};
goog.inherits(goog.date.DateTime, goog.date.Date);
goog.date.DateTime.fromTimestamp = function(timestamp) {
  var date = new goog.date.DateTime;
  date.setTime(timestamp);
  return date;
};
goog.date.DateTime.fromRfc822String = function(formatted) {
  var date = new Date(formatted);
  return isNaN(date.getTime()) ? null : new goog.date.DateTime(date);
};
goog.date.DateTime.prototype.getHours = function() {
  return this.date.getHours();
};
goog.date.DateTime.prototype.getMinutes = function() {
  return this.date.getMinutes();
};
goog.date.DateTime.prototype.getSeconds = function() {
  return this.date.getSeconds();
};
goog.date.DateTime.prototype.getMilliseconds = function() {
  return this.date.getMilliseconds();
};
goog.date.DateTime.prototype.getUTCDay = function() {
  return this.date.getUTCDay();
};
goog.date.DateTime.prototype.getUTCHours = function() {
  return this.date.getUTCHours();
};
goog.date.DateTime.prototype.getUTCMinutes = function() {
  return this.date.getUTCMinutes();
};
goog.date.DateTime.prototype.getUTCSeconds = function() {
  return this.date.getUTCSeconds();
};
goog.date.DateTime.prototype.getUTCMilliseconds = function() {
  return this.date.getUTCMilliseconds();
};
goog.date.DateTime.prototype.setHours = function(hours) {
  this.date.setHours(hours);
};
goog.date.DateTime.prototype.setMinutes = function(minutes) {
  this.date.setMinutes(minutes);
};
goog.date.DateTime.prototype.setSeconds = function(seconds) {
  this.date.setSeconds(seconds);
};
goog.date.DateTime.prototype.setMilliseconds = function(ms) {
  this.date.setMilliseconds(ms);
};
goog.date.DateTime.prototype.setUTCHours = function(hours) {
  this.date.setUTCHours(hours);
};
goog.date.DateTime.prototype.setUTCMinutes = function(minutes) {
  this.date.setUTCMinutes(minutes);
};
goog.date.DateTime.prototype.setUTCSeconds = function(seconds) {
  this.date.setUTCSeconds(seconds);
};
goog.date.DateTime.prototype.setUTCMilliseconds = function(ms) {
  this.date.setUTCMilliseconds(ms);
};
goog.date.DateTime.prototype.add = function(interval) {
  goog.date.Date.prototype.add.call(this, interval);
  interval.hours && this.setHours(this.date.getHours() + interval.hours);
  interval.minutes && this.setMinutes(this.date.getMinutes() + interval.minutes);
  interval.seconds && this.setSeconds(this.date.getSeconds() + interval.seconds);
};
goog.date.DateTime.prototype.toIsoString = function(opt_verbose, opt_tz) {
  var dateString = goog.date.Date.prototype.toIsoString.call(this, opt_verbose);
  return opt_verbose ? dateString + " " + goog.string.padNumber(this.getHours(), 2) + ":" + goog.string.padNumber(this.getMinutes(), 2) + ":" + goog.string.padNumber(this.getSeconds(), 2) + (opt_tz ? this.getTimezoneOffsetString() : "") : dateString + "T" + goog.string.padNumber(this.getHours(), 2) + goog.string.padNumber(this.getMinutes(), 2) + goog.string.padNumber(this.getSeconds(), 2) + (opt_tz ? this.getTimezoneOffsetString() : "");
};
goog.date.DateTime.prototype.equals = function(other) {
  return this.getTime() == other.getTime();
};
goog.date.DateTime.prototype.toString = function() {
  return this.toIsoString();
};
goog.date.DateTime.prototype.clone = function() {
  var date = new goog.date.DateTime(this.date);
  date.setFirstDayOfWeek(this.getFirstDayOfWeek());
  date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());
  return date;
};
// INPUT (javascript/closure/memoize/memoize.js)
goog.memoize = function(f, opt_serializer) {
  var serializer = opt_serializer || goog.memoize.simpleSerializer;
  return function() {
    if (goog.memoize.ENABLE_MEMOIZE) {
      var thisOrGlobal = this || goog.global, cache = thisOrGlobal[goog.memoize.CACHE_PROPERTY_] || (thisOrGlobal[goog.memoize.CACHE_PROPERTY_] = {}), key = serializer(goog.getUid(f), arguments);
      return cache.hasOwnProperty(key) ? cache[key] : cache[key] = f.apply(this, arguments);
    }
    return f.apply(this, arguments);
  };
};
goog.memoize.ENABLE_MEMOIZE = !0;
goog.memoize.clearCache = function(cacheOwner) {
  cacheOwner[goog.memoize.CACHE_PROPERTY_] = {};
};
goog.memoize.CACHE_PROPERTY_ = "closure_memoize_cache_";
goog.memoize.simpleSerializer = function(functionUid, args) {
  for (var context = [functionUid], i = args.length - 1;0 <= i;--i) {
    context.push(typeof args[i], args[i]);
  }
  return context.join("\x0B");
};
// INPUT (javascript/gviz/devel/jsapi/common/object.js)
gviz.object = {};
gviz.object.unsafeEquals = function(obj1, obj2) {
  if (!goog.isDefAndNotNull(obj1) && !goog.isDefAndNotNull(obj2)) {
    return obj1 === obj2;
  }
  if (obj1 === obj2) {
    return!0;
  }
  var type1 = goog.typeOf(obj1), type2 = goog.typeOf(obj2);
  if (type1 != type2) {
    return!1;
  }
  var obj1IsDateLike = goog.isDateLike(obj1), obj2IsDateLike = goog.isDateLike(obj2);
  if (obj1IsDateLike != obj2IsDateLike) {
    return!1;
  }
  switch(type1) {
    case "object":
      if (obj1IsDateLike && obj2IsDateLike) {
        return 0 == goog.date.Date.compare(obj1, obj2);
      }
      for (var key1 in obj1) {
        if (obj1.hasOwnProperty(key1) && (!obj2.hasOwnProperty(key1) || !gviz.object.unsafeEquals(obj1[key1], obj2[key1]))) {
          return!1;
        }
      }
      for (var key2 in obj2) {
        if (obj2.hasOwnProperty(key2) && !obj1.hasOwnProperty(key2)) {
          return!1;
        }
      }
      return!0;
    case "array":
      if (obj1.length != obj2.length) {
        return!1;
      }
      for (var i = 0;i < obj1.length;++i) {
        if (!gviz.object.unsafeEquals(obj1[i], obj2[i])) {
          return!1;
        }
      }
      return!0;
    case "function":
      return!0;
    case "string":
    ;
    case "number":
    ;
    case "boolean":
      return!1;
    default:
      throw Error("Error while comparing " + obj1 + " and " + obj2 + ": unexpected type of obj1 " + type1);;
  }
};
gviz.object.unsafeClone = function(obj) {
  if (goog.isDateLike(obj)) {
    var ret = new Date;
    ret.setTime(obj.valueOf());
    return ret;
  }
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = gviz.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
gviz.object.clone = function(obj) {
  if (goog.isDateLike(obj)) {
    var ret = new Date;
    ret.setTime(obj.valueOf());
    return ret;
  }
  return goog.object.clone(obj);
};
gviz.object.findValuesRecursive = function(obj$$0, f, opt_this) {
  function helper(obj, predicate, results) {
    for (var property in obj) {
      obj.hasOwnProperty(property) && ("object" === typeof obj[property] ? helper(obj[property], predicate, results) : f.call(opt_this, obj[property], property, obj) && results.push(obj[property]));
    }
    return results;
  }
  return helper(obj$$0, goog.memoize(f), []);
};
gviz.object.getObjectByName = function(name, opt_obj) {
  for (var parts = name.split("."), cur = opt_obj || goog.global, i = 0;i < parts.length;i++) {
    var part = parts[i];
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
// INPUT (javascript/gviz/devel/jsapi/common/options.js)
gviz.Options = function(layers) {
  this.layers_ = layers || [{}];
};
gviz.Options.prototype.insertLayer = function(layerIndex, srcOptions) {
  goog.array.insertAt(this.layers_, srcOptions, layerIndex);
};
gviz.Options.prototype.mergeLayer = function(srcOptions) {
  gviz.Options.merge_(this.layers_[0], srcOptions);
};
gviz.Options.merge_ = function(dstOptions, srcOptions) {
  for (var option in srcOptions) {
    goog.isObject(srcOptions[option]) && dstOptions[option] ? gviz.Options.merge_(dstOptions[option], srcOptions[option]) : dstOptions[option] = srcOptions[option];
  }
};
gviz.Options.flattenHelper_ = function(dstOptions, srcOptions) {
  goog.object.forEach(srcOptions, function(value, property) {
    goog.isObject(value) && !goog.isArray(value) ? (dstOptions[property] = dstOptions[property] || {}, gviz.Options.flattenHelper_(dstOptions[property], value)) : goog.isDefAndNotNull(value) && (dstOptions[property] = value);
  });
};
gviz.Options.prototype.flattenLayers = function(opt_dstOptions) {
  var dstOptions = opt_dstOptions || {};
  goog.array.forEachRight(this.layers_, function(layer) {
    gviz.Options.flattenHelper_(dstOptions, layer);
  });
  return dstOptions;
};
gviz.Options.getValue = function(options, optionPath, opt_func) {
  if (goog.isString(optionPath)) {
    return gviz.Options.getValueFromSpecificPath_(options, optionPath, opt_func);
  }
  for (var i = 0;i < optionPath.length;++i) {
    var value = gviz.Options.getValueFromSpecificPath_(options, optionPath[i], opt_func);
    if (goog.isDefAndNotNull(value)) {
      return value;
    }
  }
  return null;
};
gviz.Options.getValueFromSpecificPath_ = function(options, optionPath, opt_func) {
  var value = gviz.object.getObjectByName(optionPath, options);
  return goog.isDefAndNotNull(value) && goog.isFunction(opt_func) ? opt_func(value) : value;
};
gviz.Options.prototype.inferValue = function(optionPath, opt_defaultValue, opt_func) {
  for (var value = null, i = 0;i < this.layers_.length;i++) {
    if (value = gviz.Options.getValue(this.layers_[i], optionPath, opt_func), goog.isDefAndNotNull(value)) {
      return value;
    }
  }
  value = opt_defaultValue;
  return goog.isDef(value) ? value : null;
};
gviz.Options.extendObjectValue_ = function(obj, options, optionPath, opt_func) {
  goog.isString(optionPath) && (optionPath = [optionPath]);
  for (var i = optionPath.length - 1;0 <= i;--i) {
    var optionValue = gviz.Options.getValueFromSpecificPath_(options, optionPath[i], opt_func) || {};
    goog.object.extend(obj, optionValue);
  }
};
gviz.Options.prototype.inferObjectValue = function(optionPath, opt_defaultValue, opt_func) {
  for (var result = goog.isDefAndNotNull(opt_defaultValue) ? goog.object.clone(opt_defaultValue) : {}, i = this.layers_.length - 1;0 <= i;i--) {
    gviz.Options.extendObjectValue_(result, this.layers_[i], optionPath, opt_func);
  }
  return result;
};
gviz.Options.prototype.inferEntireObjectValue = function(optionPath, opt_defaultValue) {
  var result = goog.isDefAndNotNull(opt_defaultValue) ? goog.object.clone(opt_defaultValue) : {};
  goog.isString(optionPath) && (optionPath = [optionPath]);
  for (var i = this.layers_.length - 1;0 <= i;i--) {
    for (var j = optionPath.length - 1;0 <= j;--j) {
      var optionValue = gviz.Options.getValueFromSpecificPath_(this.layers_[i], optionPath[j]) || {};
      gviz.util.deepExtend(result, optionValue);
    }
  }
  return result;
};
gviz.Options.convertToBoolean = function(value) {
  if (!goog.isDefAndNotNull(value)) {
    return null;
  }
  if ("boolean" == typeof value) {
    return value;
  }
  var s = String(value);
  return "1" == s || "true" == s.toLowerCase() ? !0 : "0" == s || "false" == s.toLowerCase() ? !1 : null;
};
gviz.Options.prototype.inferBooleanValue = function(optionPath, opt_defaultValue) {
  var value = this.inferOptionalBooleanValue(optionPath);
  if (goog.isDefAndNotNull(value)) {
    return value;
  }
  goog.isDef(opt_defaultValue) || (opt_defaultValue = !1);
  return opt_defaultValue;
};
gviz.Options.prototype.inferOptionalBooleanValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToBoolean);
};
gviz.Options.convertToNumber = function(value) {
  if (!goog.isDefAndNotNull(value)) {
    return null;
  }
  if ("number" == typeof value) {
    return value;
  }
  var res = goog.string.toNumber(String(value));
  return isNaN(res) ? null : res;
};
gviz.Options.convertToNumberArray = function(value) {
  return goog.isDefAndNotNull(value) ? goog.isArray(value) ? goog.array.map(value, gviz.Options.convertToNumber) : null : null;
};
gviz.Options.convertDateToNumber = function(value) {
  if (!goog.isDefAndNotNull(value)) {
    return null;
  }
  if (goog.isNumber(value)) {
    return value;
  }
  var numberValue = Number(value);
  return isNaN(numberValue) ? null : numberValue;
};
gviz.Options.prototype.inferNumberValue = function(optionPath, opt_defaultValue) {
  var value = this.inferOptionalNumberValue(optionPath);
  if (goog.isDefAndNotNull(value)) {
    return value;
  }
  goog.isDef(opt_defaultValue) || (opt_defaultValue = 0);
  return opt_defaultValue;
};
gviz.Options.prototype.inferNumberFromDateValue = function(optionPath, opt_defaultValue) {
  var value = this.inferOptionalNumberFromDateValue(optionPath);
  if (goog.isDefAndNotNull(value)) {
    return value;
  }
  goog.isDef(opt_defaultValue) || (opt_defaultValue = 0);
  return opt_defaultValue;
};
gviz.Options.prototype.inferOptionalNumberValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToNumber);
};
gviz.Options.prototype.inferOptionalNumberArrayValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToNumberArray);
};
gviz.Options.prototype.inferOptionalNumberFromDateValue = function(optionPath) {
  var value = this.inferValue(optionPath, null, gviz.Options.convertDateToNumber);
  return value;
};
gviz.Options.convertToNonNegativeNumber = function(value) {
  var num = gviz.Options.convertToNumber(value);
  return goog.isDefAndNotNull(num) && 0 <= num ? num : null;
};
gviz.Options.prototype.inferNonNegativeNumberValue = function(optionPath, opt_defaultValue) {
  var value = this.inferOptionalNonNegativeNumberValue(optionPath);
  if (goog.isDefAndNotNull(value)) {
    return value;
  }
  goog.isDef(opt_defaultValue) || (opt_defaultValue = 0);
  return opt_defaultValue;
};
gviz.Options.prototype.inferOptionalNonNegativeNumberValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToNonNegativeNumber);
};
gviz.Options.convertToRatioNumber = function(value) {
  var num = gviz.Options.convertToNonNegativeNumber(value);
  return goog.isDefAndNotNull(num) ? goog.math.clamp(num, 0, 1) : null;
};
gviz.Options.prototype.inferRatioNumberValue = function(optionPath, opt_defaultValue) {
  var value = this.inferOptionalRatioNumberValue(optionPath);
  if (goog.isDefAndNotNull(value)) {
    return value;
  }
  goog.isDef(opt_defaultValue) || (opt_defaultValue = 0);
  return opt_defaultValue;
};
gviz.Options.prototype.inferOptionalRatioNumberValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToRatioNumber);
};
gviz.Options.convertToString = function(value) {
  return goog.isDefAndNotNull(value) ? String(value) : null;
};
gviz.Options.prototype.inferStringValue = function(optionPath, opt_defaultValue) {
  goog.isDef(opt_defaultValue) || (opt_defaultValue = "");
  return this.inferValue(optionPath, opt_defaultValue, gviz.Options.convertToString);
};
gviz.Options.prototype.inferOptionalStringValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToString);
};
gviz.Options.convertToColor = function(value, opt_additionalValues) {
  var res = gviz.Options.convertToString(value);
  if (!res) {
    return null;
  }
  var additionalValues = opt_additionalValues || [];
  if (goog.array.contains(additionalValues, res)) {
    return res;
  }
  try {
    return gviz.graphics.util.parseColor(res);
  } catch (e) {
    return null;
  }
};
gviz.Options.prototype.inferColorValue = function(optionPath, defaultValue) {
  return this.inferValue(optionPath, defaultValue, gviz.Options.convertToColor);
};
gviz.Options.prototype.inferExtendedColorValue = function(optionPath, additionalValues, defaultValue) {
  return this.inferValue(optionPath, defaultValue, function(value) {
    return gviz.Options.convertToColor(value, additionalValues);
  });
};
gviz.Options.prototype.inferOptionalColorValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToColor);
};
gviz.Options.prototype.inferStringArrayValue = function(optionPath, opt_defaultValue) {
  var value = this.inferOptionalStringArrayValue(optionPath);
  if (null != value) {
    return value;
  }
  goog.isDef(opt_defaultValue) || (opt_defaultValue = []);
  return opt_defaultValue;
};
gviz.Options.prototype.inferOptionalStringArrayValue = function(optionPath) {
  return this.inferValue(optionPath, null, gviz.Options.convertToStringArray);
};
gviz.Options.convertToStringArray = function(value) {
  return goog.isDefAndNotNull(value) ? goog.isArray(value) ? goog.array.map(value, String) : null : null;
};
gviz.Options.convertToEnum = function(enumObj, value) {
  var strValue = gviz.Options.convertToString(value);
  return goog.object.containsValue(enumObj, strValue) ? strValue : null;
};
gviz.Options.prototype.inferEnumValue = function(optionPath, enumObj, opt_defaultValue) {
  return this.inferValue(optionPath, opt_defaultValue, goog.bind(gviz.Options.convertToEnum, null, enumObj));
};
gviz.Options.convertToEnumOrThrow = function(enumObj, message, value) {
  if (!goog.isDefAndNotNull(value)) {
    return null;
  }
  var strValue = gviz.Options.convertToString(value);
  if (goog.object.containsValue(enumObj, strValue)) {
    return strValue;
  }
  throw Error(message);
};
gviz.Options.prototype.inferOptionalEnumValue = function(optionPath, enumObj) {
  return this.inferValue(optionPath, null, goog.bind(gviz.Options.convertToEnum, null, enumObj));
};
gviz.Options.prototype.inferWholeObjectValue = function(optionPath, opt_defaultValue) {
  goog.isDef(opt_defaultValue) || (opt_defaultValue = null);
  return this.inferValue(optionPath, opt_defaultValue);
};
gviz.Options.prototype.inferBrushValue = function(optionPath, opt_defaultValue) {
  var defaultBrushProps = opt_defaultValue ? opt_defaultValue.getProperties() : null, brushProps = this.inferObjectValue(optionPath, defaultBrushProps, function(obj) {
    goog.isObject(obj) || (obj = {fill:obj});
    var brushPropsObj = {}, fill = gviz.Options.convertToColor(obj.fill);
    goog.isDefAndNotNull(fill) && (brushPropsObj.fill = fill);
    var fillOpacity = gviz.Options.convertToRatioNumber(obj.fillOpacity);
    goog.isDefAndNotNull(fillOpacity) && (brushPropsObj.fillOpacity = fillOpacity);
    var stroke = gviz.Options.convertToColor(obj.stroke);
    goog.isDefAndNotNull(stroke) && (brushPropsObj.stroke = stroke);
    var strokeWidth = gviz.Options.convertToNonNegativeNumber(obj.strokeWidth);
    goog.isDefAndNotNull(strokeWidth) && (brushPropsObj.strokeWidth = strokeWidth);
    var strokeOpacity = gviz.Options.convertToRatioNumber(obj.strokeOpacity);
    goog.isDefAndNotNull(strokeOpacity) && (brushPropsObj.strokeOpacity = strokeOpacity);
    var strokeDashStyle = gviz.Options.convertToNumberArray(obj.strokeDashStyle);
    goog.isDefAndNotNull(strokeDashStyle) && goog.isArray(strokeDashStyle) && (brushPropsObj.strokeDashStyle = strokeDashStyle);
    var rx = gviz.Options.convertToNumber(obj.rx);
    goog.isDefAndNotNull(rx) && (brushPropsObj.rx = rx);
    var ry = gviz.Options.convertToNumber(obj.ry);
    goog.isDefAndNotNull(ry) && (brushPropsObj.ry = ry);
    var gradient = obj.gradient;
    if (gradient && goog.isDefAndNotNull(gradient.color1) && goog.isDefAndNotNull(gradient.color2) && goog.isDefAndNotNull(gradient.x1) && goog.isDefAndNotNull(gradient.y1) && goog.isDefAndNotNull(gradient.x2) && goog.isDefAndNotNull(gradient.y2)) {
      var gradientObj = {};
      gradientObj.color1 = gviz.Options.convertToColor(gradient.color1);
      gradientObj.color2 = gviz.Options.convertToColor(gradient.color2);
      gradientObj.opacity1 = gviz.Options.convertToRatioNumber(gradient.opacity1);
      gradientObj.opacity2 = gviz.Options.convertToRatioNumber(gradient.opacity2);
      gradientObj.x1 = gradient.x1;
      gradientObj.y1 = gradient.y1;
      gradientObj.x2 = gradient.x2;
      gradientObj.y2 = gradient.y2;
      gradientObj.useObjectBoundingBoxUnits = gviz.Options.convertToBoolean(gradient.useObjectBoundingBoxUnits);
      brushPropsObj.gradient = gradientObj;
    }
    return brushPropsObj;
  }), brush = new gviz.graphics.Brush(brushProps), transparentBrush = gviz.graphics.Brush.TRANSPARENT_BRUSH;
  brush.hasFill() || (brush.setFill(transparentBrush.getFill()), brush.setFillOpacity(transparentBrush.getFillOpacity()));
  brush.hasStroke() || (brush.setStroke(transparentBrush.getStroke()), brush.setStrokeOpacity(transparentBrush.getStrokeOpacity()));
  return brush;
};
gviz.Options.convertToTextStyle = function(object, opt_additionalColorValues) {
  var textStyle = {}, color = gviz.Options.convertToColor(object.color, opt_additionalColorValues);
  goog.isDefAndNotNull(color) && (textStyle.color = color);
  var opacity = gviz.Options.convertToRatioNumber(object.opacity);
  goog.isDefAndNotNull(opacity) && (textStyle.opacity = opacity);
  var auraColor = gviz.Options.convertToColor(object.auraColor, opt_additionalColorValues);
  goog.isDefAndNotNull(auraColor) && (textStyle.auraColor = auraColor);
  var auraWidth = gviz.Options.convertToNonNegativeNumber(object.auraWidth);
  auraWidth && (textStyle.auraWidth = auraWidth);
  var fontName = gviz.Options.convertToString(object.fontName);
  fontName && (textStyle.fontName = fontName);
  var fontSize = gviz.Options.convertToNonNegativeNumber(object.fontSize);
  fontSize && (textStyle.fontSize = fontSize);
  var bold = gviz.Options.convertToBoolean(object.bold);
  goog.isDefAndNotNull(bold) && (textStyle.bold = bold);
  var italic = gviz.Options.convertToBoolean(object.italic);
  goog.isDefAndNotNull(italic) && (textStyle.italic = italic);
  var underline = gviz.Options.convertToBoolean(object.underline);
  goog.isDefAndNotNull(underline) && (textStyle.underline = underline);
  return textStyle;
};
gviz.Options.prototype.inferTextStyleValue = function(optionPath, opt_defaultValue) {
  return this.inferObjectValue(optionPath, opt_defaultValue, function(value) {
    var object = value;
    return gviz.Options.convertToTextStyle(object);
  });
};
gviz.Options.prototype.inferExtendedColorTextStyleValue = function(optionPath, additionalColorValues, opt_defaultValue) {
  return this.inferObjectValue(optionPath, opt_defaultValue, function(value) {
    var object = value;
    return gviz.Options.convertToTextStyle(object, additionalColorValues);
  });
};
gviz.Options.prototype.inferDateTicksUnitConfigValue = function(optionPath, opt_defaultValue) {
  var result = this.inferObjectValue(optionPath, opt_defaultValue);
  return gviz.Options.convertToDateTicksUnitConfig(result);
};
gviz.Options.convertToDateTicksUnitConfig = function(object) {
  var unitConfig = {format:object.format, interval:object.interval};
  return unitConfig;
};
gviz.Options.convertAbsOrPercentageToNumber = function(whole, value) {
  goog.asserts.assert(goog.math.isFiniteNumber(whole));
  var result = null, absolute = gviz.Options.convertToNumber(value);
  if (goog.isDefAndNotNull(absolute)) {
    result = absolute;
  } else {
    var strValue = gviz.Options.convertToString(value);
    if (goog.isDefAndNotNull(strValue) && goog.string.endsWith(strValue, "%")) {
      var percentageStr = goog.string.removeAt(strValue, strValue.length - 1, 1), percentage = goog.string.toNumber(percentageStr), result = whole * percentage / 100
    }
  }
  goog.isDefAndNotNull(result) && (result = goog.math.clamp(result, 0, whole));
  return result;
};
gviz.Options.prototype.inferAbsOrPercentageValue = function(optionPath, whole, opt_defaultValue) {
  var value = this.inferOptionalAbsOrPercentageValue(optionPath, whole);
  if (goog.isDefAndNotNull(value)) {
    return value;
  }
  goog.isDef(opt_defaultValue) || (opt_defaultValue = 0);
  return opt_defaultValue;
};
gviz.Options.prototype.inferOptionalAbsOrPercentageValue = function(optionPath, whole) {
  return this.inferValue(optionPath, null, goog.bind(gviz.Options.convertAbsOrPercentageToNumber, null, whole));
};
gviz.Options.SelectionMode = {MULTIPLE:"multiple", SINGLE:"single"};
gviz.Options.TooltipTrigger = {NONE:"none", FOCUS:"focus", SELECTION:"selection", BOTH:"both"};
gviz.Options.CrosshairTrigger = {NONE:"none", FOCUS:"focus", SELECTION:"selection", BOTH:"both"};
gviz.Options.CrosshairOrientation = {HORIZONTAL:"horizontal", VERTICAL:"vertical", BOTH:"both"};
// INPUT (javascript/gviz/devel/jsapi/packages/util/requestserializer.js)
gviz.util.RequestSerializer = function() {
  this.activeRequests_ = !1;
  this.queuedRequests_ = [];
};
goog.addSingletonGetter(gviz.util.RequestSerializer);
gviz.util.RequestSerializer.prototype.loadApi = function(moduleName, moduleVersion, settings) {
  var self = this, cb = settings.callback;
  settings.callback = function() {
    var ret = cb.apply(this, arguments);
    0 < self.queuedRequests_.length ? (self.queuedRequests_.shift()(), self.activeRequests_ = !0) : self.activeRequests_ = !1;
    return ret;
  };
  var boundLoad = goog.bind(google.load, goog.global.google, moduleName, moduleVersion, settings);
  this.activeRequests_ ? this.queuedRequests_.push(boundLoad) : (this.activeRequests_ = !0, boundLoad());
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/viscommon.js)
gviz.util.VisCommon = {};
gviz.util.VisCommon.DEFAULT_WIDTH_ = 400;
gviz.util.VisCommon.DEFAULT_HEIGHT_ = 200;
gviz.util.VisCommon.DEFAULT_MIN_WIDTH_ = 30;
gviz.util.VisCommon.DEFAULT_MIN_HEIGHT_ = 30;
gviz.util.VisCommon.HASHCODE_MAX_ = 67108864;
gviz.util.VisCommon.DEFAULT_APIS_BASE_ = "//ajax.googleapis.com/ajax";
gviz.util.VisCommon.DEFAULT_STATIC_PATH_ = "/static/modules/gviz/";
gviz.util.VisCommon.DEFAULT_VERSION_ = "1.0";
gviz.util.VisCommon.getWidth = function(container, options, opt_default) {
  return options.inferOptionalNonNegativeNumberValue("width") || goog.style.getContentBoxSize(container).width || opt_default || gviz.util.VisCommon.DEFAULT_WIDTH_;
};
gviz.util.VisCommon.getHeight = function(container, options, opt_default) {
  return options.inferOptionalNonNegativeNumberValue("height") || goog.style.getContentBoxSize(container).height || opt_default || gviz.util.VisCommon.DEFAULT_HEIGHT_;
};
gviz.util.VisCommon.getDesiredWidth = function(opt_container, opt_options, opt_default, opt_max, opt_min) {
  var res;
  return opt_options && (res = opt_options.width, goog.isString(res) && goog.string.isNumeric(res) && (res = parseInt(res, 10)), "number" == typeof res && res >= (opt_min || gviz.util.VisCommon.DEFAULT_MIN_WIDTH_) && (!opt_max || res <= opt_max)) || opt_container && (res = opt_container.clientWidth, res >= (opt_min || gviz.util.VisCommon.DEFAULT_MIN_WIDTH_) && (!opt_max || res <= opt_max)) ? res : opt_default || gviz.util.VisCommon.DEFAULT_WIDTH_;
};
gviz.util.VisCommon.getDesiredHeight = function(opt_container, opt_options, opt_default, opt_max, opt_min) {
  var res;
  return opt_options && (res = opt_options.height, goog.isString(res) && goog.string.isNumeric(res) && (res = parseInt(res, 10)), "number" == typeof res && res >= (opt_min || gviz.util.VisCommon.DEFAULT_MIN_HEIGHT_) && (!opt_max || res <= opt_max)) || opt_container && (res = opt_container.clientHeight, res >= (opt_min || gviz.util.VisCommon.DEFAULT_MIN_HEIGHT_) && (!opt_max || res <= opt_max)) ? res : opt_default || gviz.util.VisCommon.DEFAULT_HEIGHT_;
};
gviz.util.VisCommon.getDesiredColors = function(opt_options, opt_default) {
  var colors = opt_options && opt_options.colors;
  if (!colors || 0 == colors.length) {
    var color = opt_options && opt_options.color, colors = color ? [color] : opt_default
  }
  return colors;
};
gviz.util.VisCommon.getModulePath = function() {
  var modulePath = goog.getObjectByName("google.visualization.ModulePath");
  if (goog.isDefAndNotNull(modulePath)) {
    return modulePath;
  }
  var apisBase = goog.getObjectByName("google.loader.GoogleApisBase");
  goog.isDefAndNotNull(apisBase) || (apisBase = gviz.util.VisCommon.DEFAULT_APIS_BASE_);
  var version = goog.getObjectByName("google.visualization.Version");
  goog.isDefAndNotNull(version) || (version = gviz.util.VisCommon.DEFAULT_VERSION_);
  return apisBase + gviz.util.VisCommon.DEFAULT_STATIC_PATH_ + version;
};
gviz.util.VisCommon.getHead = function() {
  if (0 == document.getElementsByTagName("head").length) {
    var htmlElement = document.getElementsByTagName("html")[0], bodyElement = document.getElementsByTagName("body")[0], headElement = document.createElement("head");
    htmlElement.insertBefore(headElement, bodyElement);
  }
  return document.getElementsByTagName("head")[0];
};
gviz.util.VisCommon.addCssToDom = function(relativePath) {
  for (var modulePath = gviz.util.VisCommon.getModulePath(), cssHref = modulePath + relativePath, links = document.getElementsByTagName("LINK"), ind = 0;ind < links.length;ind++) {
    if (links[ind] && links[ind].getAttribute("href") && links[ind].getAttribute("href") === cssHref) {
      return;
    }
  }
  var cssLink = document.createElement("link");
  cssLink.href = cssHref;
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";
  var head = gviz.util.VisCommon.getHead();
  head.appendChild(cssLink);
};
gviz.util.VisCommon.loadMapsApiCallbacks_ = [];
gviz.util.VisCommon.loadMapsApi = function(callback) {
  function callbackWrapper() {
    if (gviz.util.VisCommon.isMapsApiV3Loaded()) {
      var callbacks = gviz.util.VisCommon.loadMapsApiCallbacks_;
      gviz.util.VisCommon.loadMapsApiCallbacks_ = [];
      goog.array.forEach(callbacks, function(aCallback) {
        aCallback();
      });
    } else {
      throw Error("Error: cannot load Maps API.");
    }
  }
  if (gviz.util.VisCommon.isMapsApiV3Loaded()) {
    callback();
  } else {
    if (gviz.util.VisCommon.loadMapsApiCallbacks_.push(callback), 1 == gviz.util.VisCommon.loadMapsApiCallbacks_.length) {
      var otherParams = "sensor=false";
      gviz.util.VisCommon.isGoogleDomainSSL() && (otherParams += "&client=google-gviz");
      google.load("maps", "3", {callback:callbackWrapper, other_params:otherParams});
    }
  }
};
gviz.util.VisCommon.isGoogleDomainSSL = function(opt_url) {
  var location = opt_url || gviz.util.VisCommon.getLocation();
  if (!goog.string.isEmptySafe(location)) {
    if ("https" != goog.uri.utils.getScheme(location)) {
      return!1;
    }
    var domain = goog.uri.utils.getDomain(location);
    if (!goog.string.isEmptySafe(domain)) {
      var isGoogleCom = /\.google\.com$/.test(domain), isAjaxApis = /^ajax\.googleapis\.com$/.test(domain);
      return isGoogleCom || isAjaxApis;
    }
  }
  return!1;
};
gviz.util.VisCommon.getLocation = function() {
  return goog.global.location.href;
};
gviz.util.VisCommon.isMapsApiV3Loaded = function() {
  return!!goog.getObjectByName("google.maps.DirectionsService");
};
gviz.util.VisCommon.checkScriptPresent = function(prefix) {
  for (var scripts = document.getElementsByTagName("SCRIPT"), ind = 0;ind < scripts.length;ind++) {
    if (scripts[ind] && scripts[ind].src && goog.string.startsWith(scripts[ind].src, prefix)) {
      return!0;
    }
  }
  return!1;
};
gviz.util.VisCommon.appendScript = function(url) {
  var head = gviz.util.VisCommon.getHead(), script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  head.appendChild(script);
};
gviz.util.VisCommon.getLocale = function(pkgName) {
  var locale = null, google = goog.global.google, localeObj = google && google.visualization && google.visualization.Locale;
  localeObj && localeObj.packages && localeObj.packages[pkgName] && (locale = localeObj.locale);
  return locale;
};
gviz.util.VisCommon.getLoadedLanguage = function() {
  var locale = null, loadArgs = goog.getObjectByName("google.visualization.LoadArgs");
  loadArgs && goog.uri.utils.hasParam(loadArgs, "hl") && (locale = goog.uri.utils.getParamValue(loadArgs, "hl"));
  return locale;
};
gviz.util.VisCommon.getHash = function(obj) {
  return gviz.util.VisCommon.getHash_(obj, 1);
};
gviz.util.VisCommon.getHash_ = function(obj, seed) {
  var HASH_MAX = gviz.util.VisCommon.HASHCODE_MAX_, type = goog.typeOf(obj);
  seed = (31 * seed + goog.string.hashCode(type)) % HASH_MAX;
  switch(type) {
    case "object":
      if (obj.constructor == Date) {
        seed = (31 * seed + goog.string.hashCode("date")) % HASH_MAX, seed = gviz.util.VisCommon.getHash_(obj.getTime(), seed);
      } else {
        var orderedSet = gviz.util.VisCommon.getOrderedKeySet_(obj), key;
        for (key in orderedSet) {
          seed = gviz.util.VisCommon.getHash_(obj[key], gviz.util.VisCommon.getHash_(key, seed));
        }
      }
      break;
    case "array":
      for (var i = 0;i < obj.length;i++) {
        seed = gviz.util.VisCommon.getHash_(obj[i], gviz.util.VisCommon.getHash_(String(i), seed));
      }
      break;
    default:
      seed = (31 * seed + goog.string.hashCode(String(obj))) % HASH_MAX;
  }
  return seed;
};
gviz.util.VisCommon.getOrderedKeySet_ = function(obj) {
  var arr = goog.object.getKeys(obj);
  goog.array.sort(arr);
  return goog.object.createSet(arr);
};
gviz.util.VisCommon.validateContainer = function(container) {
  if (!goog.dom.isNodeLike(container)) {
    throw Error("Container is not defined");
  }
  goog.asserts.assert(container);
  return container;
};
gviz.util.VisCommon.DEFAULT_LOG_DIV_ID = "gviz-log-div";
gviz.util.VisCommon.LOGGER_DIV_CONSOLES_ = {};
gviz.util.VisCommon.createLogger = function(className, opt_divName) {
  var logger = goog.log.getLogger(className, goog.debug.Logger.Level.ALL);
  if (goog.DEBUG && logger) {
    goog.debug.Console.instance = goog.debug.Console.instance || new goog.debug.Console;
    goog.debug.Console.instance.setCapturing(!0);
    var divName = goog.isDefAndNotNull(opt_divName) ? opt_divName : gviz.util.VisCommon.DEFAULT_LOG_DIV_ID, div = goog.dom.getElement(divName);
    if (div && !gviz.util.VisCommon.LOGGER_DIV_CONSOLES_[divName]) {
      var console = new goog.debug.DivConsole(div);
      console.setCapturing(!0);
      gviz.util.VisCommon.LOGGER_DIV_CONSOLES_[divName] = console;
    }
  }
  return logger;
};
gviz.util.VisCommon.resolveConstructor = function(type) {
  var result = goog.array.find(goog.array.map(["google.visualization." + type, "google.charts." + type, type], function(path) {
    return goog.getObjectByName(path);
  }), goog.isFunction);
  return null != result ? result : null;
};
gviz.util.VisCommon.loadApi = function(moduleName, moduleVersion, opt_Settings) {
  opt_Settings = opt_Settings ? opt_Settings : {callback:goog.nullFunction};
  opt_Settings.callback = opt_Settings.callback || goog.nullFunction;
  var lang = gviz.util.VisCommon.getLoadedLanguage();
  lang && !opt_Settings.language && (opt_Settings.language = lang);
  gviz.util.RequestSerializer.getInstance().loadApi(moduleName, moduleVersion, opt_Settings);
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/arrowformat.js)
google.visualization.TableArrowFormat = function(opt_options) {
  this.options_ = opt_options || {};
  gviz.util.VisCommon.addCssToDom("/util/format.css");
};
google.visualization.TableArrowFormat.CSS_PREFIX_ = "google-visualization-formatters-arrow-";
google.visualization.TableArrowFormat.CSS_CLASS_ = {UP_GREEN:"ug", DOWN_RED:"dr", EMPTY_TRANSPARENT:"empty"};
google.visualization.TableArrowFormat.prototype.format = function(dataTable, columnIndex) {
  if ("number" == dataTable.getColumnType(columnIndex)) {
    for (var options = this.options_, base = options.base || 0, row = 0;row < dataTable.getNumberOfRows();row++) {
      var value = dataTable.getValue(row, columnIndex), className = null, className = value < base ? google.visualization.TableArrowFormat.CSS_PREFIX_ + google.visualization.TableArrowFormat.CSS_CLASS_.DOWN_RED : value > base ? google.visualization.TableArrowFormat.CSS_PREFIX_ + google.visualization.TableArrowFormat.CSS_CLASS_.UP_GREEN : google.visualization.TableArrowFormat.CSS_PREFIX_ + google.visualization.TableArrowFormat.CSS_CLASS_.EMPTY_TRANSPARENT;
      dataTable.setProperty(row, columnIndex, "className", className);
    }
  }
};
// INPUT (javascript/closure/json/json.js)
goog.json = {};
goog.json.USE_NATIVE_JSON = !1;
goog.json.isValid = function(s) {
  if (/^\s*$/.test(s)) {
    return!1;
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g, simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
  var o = String(s);
  if (goog.json.isValid(o)) {
    try {
      return eval("(" + o + ")");
    } catch (ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
  return eval("(" + s + ")");
};
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global.JSON.stringify : function(object, opt_replacer) {
  return(new goog.json.Serializer(opt_replacer)).serialize(object);
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer;
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(object, sb) {
  switch(typeof object) {
    case "string":
      this.serializeString_(object, sb);
      break;
    case "number":
      this.serializeNumber_(object, sb);
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if (null == object) {
        sb.push("null");
        break;
      }
      if (goog.isArray(object)) {
        this.serializeArray(object, sb);
        break;
      }
      this.serializeObject_(object, sb);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);;
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if (c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c];
    }
    var cc = c.charCodeAt(0), rv = "\\u";
    16 > cc ? rv += "000" : 256 > cc ? rv += "00" : 4096 > cc && (rv += "0");
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16);
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : "null");
};
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  for (var sep = "", i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "", key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      "function" != typeof value && (sb.push(sep), this.serializeString_(key, sb), sb.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb), sep = ",");
    }
  }
  sb.push("}");
};
// INPUT (javascript/gviz/devel/jsapi/common/json.js)
gviz.json = {};
gviz.UNSAFE_EVAL = !0;
gviz.json.serialize = function(obj) {
  return goog.json.serialize(gviz.json.clone(obj));
};
gviz.json.deserialize = function(json) {
  goog.json.parse(json);
  return gviz.json.unsafeDeserialize(json);
};
gviz.json.unsafeDeserialize = function(json) {
  if (gviz.UNSAFE_EVAL) {
    var notJson = gviz.json.insertDateConstructor_(json), notJson = "(" + notJson + ")";
    return eval(notJson);
  }
  return goog.json.unsafeParse(json);
};
gviz.json.globalEval = function(js) {
  goog.globalEval(gviz.json.insertDateConstructor_(js));
};
gviz.json.clone = function(obj) {
  var cloneObj = gviz.json.filteredClone_(obj, gviz.json.serializeDate_);
  return cloneObj;
};
gviz.json.filteredClone_ = function(src, filter) {
  src = filter(src);
  var type = goog.typeOf(src), result;
  if ("object" == type || "array" == type) {
    result = "array" == type ? [] : {};
    for (var key in src) {
      if (!goog.string.contains(key, "___clazz$") && src.hasOwnProperty(key)) {
        var value = gviz.json.filteredClone_(src[key], filter);
        goog.isDef(value) && (result[key] = value);
      }
    }
  } else {
    result = src;
  }
  return result;
};
gviz.json.insertDateConstructor_ = function(json) {
  var reggie = /"(Date\([\d,\s]*\))"/g;
  return json.replace(reggie, function(wholeMatch, group1) {
    return "new " + group1;
  });
};
gviz.json.serializeDate_ = function(src) {
  var result = src;
  goog.isDateLike(result) && (goog.asserts.assert(!isNaN(result.getTime()), "Invalid Date"), result = 0 !== result.getMilliseconds() ? [result.getFullYear(), result.getMonth(), result.getDate(), result.getHours(), result.getMinutes(), result.getSeconds(), result.getMilliseconds()] : 0 !== result.getSeconds() || 0 !== result.getMinutes() || 0 !== result.getHours() ? [result.getFullYear(), result.getMonth(), result.getDate(), result.getHours(), result.getMinutes(), result.getSeconds()] : [result.getFullYear(), 
  result.getMonth(), result.getDate()], result = "Date(" + result.join(", ") + ")");
  return result;
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/column-types.js)
google.visualization.ColumnType = {BOOLEAN:"boolean", NUMBER:"number", STRING:"string", DATE:"date", TIMEOFDAY:"timeofday", DATETIME:"datetime"};
// INPUT (javascript/gviz/devel/canviz/axis/milliseconds.js)
gviz.canviz.axis = {};
gviz.canviz.axis.Milliseconds = {};
gviz.canviz.axis.Milliseconds.MILLISECOND = 1;
gviz.canviz.axis.Milliseconds.SECOND = 1E3;
gviz.canviz.axis.Milliseconds.MINUTE = 60 * gviz.canviz.axis.Milliseconds.SECOND;
gviz.canviz.axis.Milliseconds.HOUR = 60 * gviz.canviz.axis.Milliseconds.MINUTE;
gviz.canviz.axis.Milliseconds.DAY = 24 * gviz.canviz.axis.Milliseconds.HOUR;
gviz.canviz.axis.Milliseconds.WEEK = 7 * gviz.canviz.axis.Milliseconds.DAY;
gviz.canviz.axis.Milliseconds.MONTH = 30.436875 * gviz.canviz.axis.Milliseconds.DAY;
gviz.canviz.axis.Milliseconds.QUARTER = 91.310625 * gviz.canviz.axis.Milliseconds.DAY;
gviz.canviz.axis.Milliseconds.YEAR = 365.2425 * gviz.canviz.axis.Milliseconds.DAY;
gviz.canviz.axis.Milliseconds.TIME_UNITS = [gviz.canviz.axis.Milliseconds.MILLISECOND, gviz.canviz.axis.Milliseconds.SECOND, gviz.canviz.axis.Milliseconds.MINUTE, gviz.canviz.axis.Milliseconds.HOUR, gviz.canviz.axis.Milliseconds.DAY, gviz.canviz.axis.Milliseconds.WEEK, gviz.canviz.axis.Milliseconds.MONTH, gviz.canviz.axis.Milliseconds.QUARTER, gviz.canviz.axis.Milliseconds.YEAR];
gviz.canviz.axis.Milliseconds.TIME_UNIT = {MILLISECOND:"MILLISECOND", SECOND:"SECOND", MINUTE:"MINUTE", HOUR:"HOUR", DAY:"DAY", WEEK:"WEEK", MONTH:"MONTH", QUARTER:"QUARTER", YEAR:"YEAR"};
gviz.canviz.axis.Milliseconds.getFinestUnit = function(unitA, unitB) {
  return gviz.canviz.axis.Milliseconds.millisecondsForName(unitA) > gviz.canviz.axis.Milliseconds.millisecondsForName(unitB) ? unitB : unitA;
};
gviz.canviz.axis.Milliseconds.closestUnit = function(time) {
  time = Math.abs(time);
  for (var timeUnits = gviz.canviz.axis.Milliseconds.TIME_UNITS, i = timeUnits.length - 1;0 < i && time < timeUnits[i];) {
    i--;
  }
  timeUnits[i + 1] - time <= time - timeUnits[i] && i++;
  return timeUnits[i];
};
gviz.canviz.axis.Milliseconds.millisecondsForName = function(name) {
  switch(name) {
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.MILLISECOND:
      return gviz.canviz.axis.Milliseconds.MILLISECOND;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.SECOND:
      return gviz.canviz.axis.Milliseconds.SECOND;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.MINUTE:
      return gviz.canviz.axis.Milliseconds.MINUTE;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.HOUR:
      return gviz.canviz.axis.Milliseconds.HOUR;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.DAY:
      return gviz.canviz.axis.Milliseconds.DAY;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.WEEK:
      return gviz.canviz.axis.Milliseconds.WEEK;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.MONTH:
      return gviz.canviz.axis.Milliseconds.MONTH;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.QUARTER:
      return gviz.canviz.axis.Milliseconds.QUARTER;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.YEAR:
      return gviz.canviz.axis.Milliseconds.YEAR;
    default:
      goog.asserts.assert(!1, "Unknown time duration: " + name);
  }
  return 0;
};
// INPUT (javascript/closure/i18n/timezone.js)
goog.i18n.TimeZone = function() {
};
goog.i18n.TimeZone.MILLISECONDS_PER_HOUR_ = 36E5;
goog.i18n.TimeZone.NameType = {STD_SHORT_NAME:0, STD_LONG_NAME:1, DLT_SHORT_NAME:2, DLT_LONG_NAME:3};
goog.i18n.TimeZone.createTimeZone = function(timeZoneData) {
  if ("number" == typeof timeZoneData) {
    return goog.i18n.TimeZone.createSimpleTimeZone_(timeZoneData);
  }
  var tz = new goog.i18n.TimeZone;
  tz.timeZoneId_ = timeZoneData.id;
  tz.standardOffset_ = -timeZoneData.std_offset;
  tz.tzNames_ = timeZoneData.names;
  tz.transitions_ = timeZoneData.transitions;
  return tz;
};
goog.i18n.TimeZone.createSimpleTimeZone_ = function(timeZoneOffsetInMinutes) {
  var tz = new goog.i18n.TimeZone;
  tz.standardOffset_ = timeZoneOffsetInMinutes;
  tz.timeZoneId_ = goog.i18n.TimeZone.composePosixTimeZoneID_(timeZoneOffsetInMinutes);
  var str = goog.i18n.TimeZone.composeUTCString_(timeZoneOffsetInMinutes);
  tz.tzNames_ = [str, str];
  tz.transitions_ = [];
  return tz;
};
goog.i18n.TimeZone.composeGMTString_ = function(offset) {
  var parts = ["GMT"];
  parts.push(0 >= offset ? "+" : "-");
  offset = Math.abs(offset);
  parts.push(goog.string.padNumber(Math.floor(offset / 60) % 100, 2), ":", goog.string.padNumber(offset % 60, 2));
  return parts.join("");
};
goog.i18n.TimeZone.composePosixTimeZoneID_ = function(offset) {
  if (0 == offset) {
    return "Etc/GMT";
  }
  var parts = ["Etc/GMT", 0 > offset ? "-" : "+"];
  offset = Math.abs(offset);
  parts.push(Math.floor(offset / 60) % 100);
  offset %= 60;
  0 != offset && parts.push(":", goog.string.padNumber(offset, 2));
  return parts.join("");
};
goog.i18n.TimeZone.composeUTCString_ = function(offset) {
  if (0 == offset) {
    return "UTC";
  }
  var parts = ["UTC", 0 > offset ? "+" : "-"];
  offset = Math.abs(offset);
  parts.push(Math.floor(offset / 60) % 100);
  offset %= 60;
  0 != offset && parts.push(":", offset);
  return parts.join("");
};
goog.i18n.TimeZone.prototype.getTimeZoneData = function() {
  return{id:this.timeZoneId_, std_offset:-this.standardOffset_, names:goog.array.clone(this.tzNames_), transitions:goog.array.clone(this.transitions_)};
};
goog.i18n.TimeZone.prototype.getDaylightAdjustment = function(date) {
  for (var timeInMs = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()), timeInHours = timeInMs / goog.i18n.TimeZone.MILLISECONDS_PER_HOUR_, index = 0;index < this.transitions_.length && timeInHours >= this.transitions_[index];) {
    index += 2;
  }
  return 0 == index ? 0 : this.transitions_[index - 1];
};
goog.i18n.TimeZone.prototype.getGMTString = function(date) {
  return goog.i18n.TimeZone.composeGMTString_(this.getOffset(date));
};
goog.i18n.TimeZone.prototype.getLongName = function(date) {
  return this.tzNames_[this.isDaylightTime(date) ? goog.i18n.TimeZone.NameType.DLT_LONG_NAME : goog.i18n.TimeZone.NameType.STD_LONG_NAME];
};
goog.i18n.TimeZone.prototype.getOffset = function(date) {
  return this.standardOffset_ - this.getDaylightAdjustment(date);
};
goog.i18n.TimeZone.prototype.getRFCTimeZoneString = function(date) {
  var offset = -this.getOffset(date), parts = [0 > offset ? "-" : "+"], offset = Math.abs(offset);
  parts.push(goog.string.padNumber(Math.floor(offset / 60) % 100, 2), goog.string.padNumber(offset % 60, 2));
  return parts.join("");
};
goog.i18n.TimeZone.prototype.getShortName = function(date) {
  return this.tzNames_[this.isDaylightTime(date) ? goog.i18n.TimeZone.NameType.DLT_SHORT_NAME : goog.i18n.TimeZone.NameType.STD_SHORT_NAME];
};
goog.i18n.TimeZone.prototype.getTimeZoneId = function() {
  return this.timeZoneId_;
};
goog.i18n.TimeZone.prototype.isDaylightTime = function(date) {
  return 0 < this.getDaylightAdjustment(date);
};
// INPUT (javascript/closure/i18n/datetimeformat.js)
goog.i18n.DateTimeFormat = function(pattern, opt_dateTimeSymbols) {
  goog.asserts.assert(goog.isDef(pattern), "Pattern must be defined");
  goog.asserts.assert(goog.isDef(opt_dateTimeSymbols) || goog.isDef(goog.i18n.DateTimeSymbols), "goog.i18n.DateTimeSymbols or explicit symbols must be defined");
  this.patternParts_ = [];
  this.dateTimeSymbols_ = opt_dateTimeSymbols || goog.i18n.DateTimeSymbols;
  "number" == typeof pattern ? this.applyStandardPattern_(pattern) : this.applyPattern_(pattern);
};
goog.i18n.DateTimeFormat.Format = {FULL_DATE:0, LONG_DATE:1, MEDIUM_DATE:2, SHORT_DATE:3, FULL_TIME:4, LONG_TIME:5, MEDIUM_TIME:6, SHORT_TIME:7, FULL_DATETIME:8, LONG_DATETIME:9, MEDIUM_DATETIME:10, SHORT_DATETIME:11};
goog.i18n.DateTimeFormat.TOKENS_ = [/^\'(?:[^\']|\'\')*\'/, /^(?:G+|y+|M+|k+|S+|E+|a+|h+|K+|H+|c+|L+|Q+|d+|m+|s+|v+|w+|z+|Z+)/, /^[^\'GyMkSEahKHcLQdmsvwzZ]+/];
goog.i18n.DateTimeFormat.PartTypes_ = {QUOTED_STRING:0, FIELD:1, LITERAL:2};
goog.i18n.DateTimeFormat.prototype.applyPattern_ = function(pattern) {
  for (;pattern;) {
    for (var i = 0;i < goog.i18n.DateTimeFormat.TOKENS_.length;++i) {
      var m = pattern.match(goog.i18n.DateTimeFormat.TOKENS_[i]);
      if (m) {
        var part = m[0];
        pattern = pattern.substring(part.length);
        i == goog.i18n.DateTimeFormat.PartTypes_.QUOTED_STRING && ("''" == part ? part = "'" : (part = part.substring(1, part.length - 1), part = part.replace(/\'\'/, "'")));
        this.patternParts_.push({text:part, type:i});
        break;
      }
    }
  }
};
goog.i18n.DateTimeFormat.prototype.format = function(date, opt_timeZone) {
  if (!date) {
    throw Error("The date to format must be non-null.");
  }
  var diff = opt_timeZone ? 6E4 * (date.getTimezoneOffset() - opt_timeZone.getOffset(date)) : 0, dateForDate = diff ? new Date(date.getTime() + diff) : date, dateForTime = dateForDate;
  opt_timeZone && dateForDate.getTimezoneOffset() != date.getTimezoneOffset() && (diff += 0 < diff ? -goog.date.MS_PER_DAY : goog.date.MS_PER_DAY, dateForTime = new Date(date.getTime() + diff));
  for (var out = [], i = 0;i < this.patternParts_.length;++i) {
    var text = this.patternParts_[i].text;
    goog.i18n.DateTimeFormat.PartTypes_.FIELD == this.patternParts_[i].type ? out.push(this.formatField_(text, date, dateForDate, dateForTime, opt_timeZone)) : out.push(text);
  }
  return out.join("");
};
goog.i18n.DateTimeFormat.prototype.applyStandardPattern_ = function(formatType) {
  var pattern;
  if (4 > formatType) {
    pattern = this.dateTimeSymbols_.DATEFORMATS[formatType];
  } else {
    if (8 > formatType) {
      pattern = this.dateTimeSymbols_.TIMEFORMATS[formatType - 4];
    } else {
      if (12 > formatType) {
        pattern = this.dateTimeSymbols_.DATETIMEFORMATS[formatType - 8], pattern = pattern.replace("{1}", this.dateTimeSymbols_.DATEFORMATS[formatType - 8]), pattern = pattern.replace("{0}", this.dateTimeSymbols_.TIMEFORMATS[formatType - 8]);
      } else {
        this.applyStandardPattern_(goog.i18n.DateTimeFormat.Format.MEDIUM_DATETIME);
        return;
      }
    }
  }
  this.applyPattern_(pattern);
};
goog.i18n.DateTimeFormat.prototype.localizeNumbers_ = function(input) {
  return goog.i18n.DateTimeFormat.localizeNumbers(input, this.dateTimeSymbols_);
};
goog.i18n.DateTimeFormat.localizeNumbers = function(input, opt_dateTimeSymbols) {
  input = String(input);
  var dateTimeSymbols = opt_dateTimeSymbols || goog.i18n.DateTimeSymbols;
  if (void 0 === dateTimeSymbols.ZERODIGIT) {
    return input;
  }
  for (var parts = [], i = 0;i < input.length;i++) {
    var c = input.charCodeAt(i);
    parts.push(48 <= c && 57 >= c ? String.fromCharCode(dateTimeSymbols.ZERODIGIT + c - 48) : input.charAt(i));
  }
  return parts.join("");
};
goog.i18n.DateTimeFormat.prototype.formatEra_ = function(count, date) {
  var value = 0 < date.getFullYear() ? 1 : 0;
  return 4 <= count ? this.dateTimeSymbols_.ERANAMES[value] : this.dateTimeSymbols_.ERAS[value];
};
goog.i18n.DateTimeFormat.prototype.formatYear_ = function(count, date) {
  var value = date.getFullYear();
  0 > value && (value = -value);
  2 == count && (value %= 100);
  return this.localizeNumbers_(goog.string.padNumber(value, count));
};
goog.i18n.DateTimeFormat.prototype.formatMonth_ = function(count, date) {
  var value = date.getMonth();
  switch(count) {
    case 5:
      return this.dateTimeSymbols_.NARROWMONTHS[value];
    case 4:
      return this.dateTimeSymbols_.MONTHS[value];
    case 3:
      return this.dateTimeSymbols_.SHORTMONTHS[value];
    default:
      return this.localizeNumbers_(goog.string.padNumber(value + 1, count));
  }
};
goog.i18n.DateTimeFormat.validateDateHasTime_ = function(date) {
  if (!(date.getHours && date.getSeconds && date.getMinutes)) {
    throw Error("The date to format has no time (probably a goog.date.Date). Use Date or goog.date.DateTime, or use a pattern without time fields.");
  }
};
goog.i18n.DateTimeFormat.prototype.format24Hours_ = function(count, date) {
  goog.i18n.DateTimeFormat.validateDateHasTime_(date);
  return this.localizeNumbers_(goog.string.padNumber(date.getHours() || 24, count));
};
goog.i18n.DateTimeFormat.prototype.formatFractionalSeconds_ = function(count, date) {
  var value = date.getTime() % 1E3 / 1E3;
  return this.localizeNumbers_(value.toFixed(Math.min(3, count)).substr(2) + (3 < count ? goog.string.padNumber(0, count - 3) : ""));
};
goog.i18n.DateTimeFormat.prototype.formatDayOfWeek_ = function(count, date) {
  var value = date.getDay();
  return 4 <= count ? this.dateTimeSymbols_.WEEKDAYS[value] : this.dateTimeSymbols_.SHORTWEEKDAYS[value];
};
goog.i18n.DateTimeFormat.prototype.formatAmPm_ = function(count, date) {
  goog.i18n.DateTimeFormat.validateDateHasTime_(date);
  var hours = date.getHours();
  return this.dateTimeSymbols_.AMPMS[12 <= hours && 24 > hours ? 1 : 0];
};
goog.i18n.DateTimeFormat.prototype.format1To12Hours_ = function(count, date) {
  goog.i18n.DateTimeFormat.validateDateHasTime_(date);
  return this.localizeNumbers_(goog.string.padNumber(date.getHours() % 12 || 12, count));
};
goog.i18n.DateTimeFormat.prototype.format0To11Hours_ = function(count, date) {
  goog.i18n.DateTimeFormat.validateDateHasTime_(date);
  return this.localizeNumbers_(goog.string.padNumber(date.getHours() % 12, count));
};
goog.i18n.DateTimeFormat.prototype.format0To23Hours_ = function(count, date) {
  goog.i18n.DateTimeFormat.validateDateHasTime_(date);
  return this.localizeNumbers_(goog.string.padNumber(date.getHours(), count));
};
goog.i18n.DateTimeFormat.prototype.formatStandaloneDay_ = function(count, date) {
  var value = date.getDay();
  switch(count) {
    case 5:
      return this.dateTimeSymbols_.STANDALONENARROWWEEKDAYS[value];
    case 4:
      return this.dateTimeSymbols_.STANDALONEWEEKDAYS[value];
    case 3:
      return this.dateTimeSymbols_.STANDALONESHORTWEEKDAYS[value];
    default:
      return this.localizeNumbers_(goog.string.padNumber(value, 1));
  }
};
goog.i18n.DateTimeFormat.prototype.formatStandaloneMonth_ = function(count, date) {
  var value = date.getMonth();
  switch(count) {
    case 5:
      return this.dateTimeSymbols_.STANDALONENARROWMONTHS[value];
    case 4:
      return this.dateTimeSymbols_.STANDALONEMONTHS[value];
    case 3:
      return this.dateTimeSymbols_.STANDALONESHORTMONTHS[value];
    default:
      return this.localizeNumbers_(goog.string.padNumber(value + 1, count));
  }
};
goog.i18n.DateTimeFormat.prototype.formatQuarter_ = function(count, date) {
  var value = Math.floor(date.getMonth() / 3);
  return 4 > count ? this.dateTimeSymbols_.SHORTQUARTERS[value] : this.dateTimeSymbols_.QUARTERS[value];
};
goog.i18n.DateTimeFormat.prototype.formatDate_ = function(count, date) {
  return this.localizeNumbers_(goog.string.padNumber(date.getDate(), count));
};
goog.i18n.DateTimeFormat.prototype.formatMinutes_ = function(count, date) {
  goog.i18n.DateTimeFormat.validateDateHasTime_(date);
  return this.localizeNumbers_(goog.string.padNumber(date.getMinutes(), count));
};
goog.i18n.DateTimeFormat.prototype.formatSeconds_ = function(count, date) {
  goog.i18n.DateTimeFormat.validateDateHasTime_(date);
  return this.localizeNumbers_(goog.string.padNumber(date.getSeconds(), count));
};
goog.i18n.DateTimeFormat.prototype.formatWeekOfYear_ = function(count, date) {
  var weekNum = goog.date.getWeekNumber(date.getFullYear(), date.getMonth(), date.getDate(), this.dateTimeSymbols_.FIRSTWEEKCUTOFFDAY, this.dateTimeSymbols_.FIRSTDAYOFWEEK);
  return this.localizeNumbers_(goog.string.padNumber(weekNum, count));
};
goog.i18n.DateTimeFormat.prototype.formatTimeZoneRFC_ = function(count, date, opt_timeZone) {
  opt_timeZone = opt_timeZone || goog.i18n.TimeZone.createTimeZone(date.getTimezoneOffset());
  return 4 > count ? opt_timeZone.getRFCTimeZoneString(date) : this.localizeNumbers_(opt_timeZone.getGMTString(date));
};
goog.i18n.DateTimeFormat.prototype.formatTimeZone_ = function(count, date, opt_timeZone) {
  opt_timeZone = opt_timeZone || goog.i18n.TimeZone.createTimeZone(date.getTimezoneOffset());
  return 4 > count ? opt_timeZone.getShortName(date) : opt_timeZone.getLongName(date);
};
goog.i18n.DateTimeFormat.prototype.formatTimeZoneId_ = function(date, opt_timeZone) {
  opt_timeZone = opt_timeZone || goog.i18n.TimeZone.createTimeZone(date.getTimezoneOffset());
  return opt_timeZone.getTimeZoneId();
};
goog.i18n.DateTimeFormat.prototype.formatField_ = function(patternStr, date, dateForDate, dateForTime, opt_timeZone) {
  var count = patternStr.length;
  switch(patternStr.charAt(0)) {
    case "G":
      return this.formatEra_(count, dateForDate);
    case "y":
      return this.formatYear_(count, dateForDate);
    case "M":
      return this.formatMonth_(count, dateForDate);
    case "k":
      return this.format24Hours_(count, dateForTime);
    case "S":
      return this.formatFractionalSeconds_(count, dateForTime);
    case "E":
      return this.formatDayOfWeek_(count, dateForDate);
    case "a":
      return this.formatAmPm_(count, dateForTime);
    case "h":
      return this.format1To12Hours_(count, dateForTime);
    case "K":
      return this.format0To11Hours_(count, dateForTime);
    case "H":
      return this.format0To23Hours_(count, dateForTime);
    case "c":
      return this.formatStandaloneDay_(count, dateForDate);
    case "L":
      return this.formatStandaloneMonth_(count, dateForDate);
    case "Q":
      return this.formatQuarter_(count, dateForDate);
    case "d":
      return this.formatDate_(count, dateForDate);
    case "m":
      return this.formatMinutes_(count, dateForTime);
    case "s":
      return this.formatSeconds_(count, dateForTime);
    case "v":
      return this.formatTimeZoneId_(date, opt_timeZone);
    case "w":
      return this.formatWeekOfYear_(count, dateForTime);
    case "z":
      return this.formatTimeZone_(count, date, opt_timeZone);
    case "Z":
      return this.formatTimeZoneRFC_(count, date, opt_timeZone);
    default:
      return "";
  }
};
// INPUT (javascript/closure/i18n/datetimepatterns.js)
goog.i18n.DateTimePatterns_af = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_am = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE\u1363 MMM d y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ar = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/\u200fM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM\u060c y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE\u060c d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE\u060c d MMM\u060c y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_az = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"d MMM, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"d MMM y, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_bg = {YEAR_FULL:"y '\u0433'.", YEAR_FULL_WITH_ERA:"y '\u0433'. G", YEAR_MONTH_ABBR:"MM.y '\u0433'.", YEAR_MONTH_FULL:"MMMM y '\u0433'.", MONTH_DAY_ABBR:"d.MM", MONTH_DAY_FULL:"d MMMM", MONTH_DAY_SHORT:"d.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d.MM.y '\u0433'.", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d.MM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d.MM.y '\u0433'.", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_bn = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_br = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"MM-dd", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ca = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLL y", YEAR_MONTH_FULL:"LLLL 'de' y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_chr = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"MMM d, y", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, MMM d, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_cs = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLLL y", YEAR_MONTH_FULL:"LLLL y", MONTH_DAY_ABBR:"d. M.", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d. M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. M. y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. M.", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d. M. y", DAY_ABBR:"d."};
goog.i18n.DateTimePatterns_cy = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_da = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d. MMM y", DAY_ABBR:"d."};
goog.i18n.DateTimePatterns_de = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_de_AT = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_de_CH = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_el = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLL y", YEAR_MONTH_FULL:"LLLL y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"MMM d, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, MMM d, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en_AU = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd/MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en_GB = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd/MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en_IE = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en_IN = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd/MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en_SG = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd/MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en_US = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"MMM d, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, MMM d, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_en_ZA = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"dd MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"MM/dd", MONTH_DAY_MEDIUM:"dd MMMM", MONTH_DAY_YEAR_MEDIUM:"dd MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE dd MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, dd MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_es = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM 'de' y", YEAR_MONTH_FULL:"MMMM 'de' y", MONTH_DAY_ABBR:"d 'de' MMM", MONTH_DAY_FULL:"dd 'de' MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d 'de' MMMM", MONTH_DAY_YEAR_MEDIUM:"d 'de' MMM 'de' y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d 'de' MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d 'de' MMMM 'de' y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_es_419 = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM 'de' y", YEAR_MONTH_FULL:"MMMM 'de' y", MONTH_DAY_ABBR:"d 'de' MMM", MONTH_DAY_FULL:"dd 'de' MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d 'de' MMMM", MONTH_DAY_YEAR_MEDIUM:"d 'de' MMM 'de' y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d 'de' MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d 'de' MMMM 'de' y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_es_ES = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM 'de' y", YEAR_MONTH_FULL:"MMMM 'de' y", MONTH_DAY_ABBR:"d 'de' MMM", MONTH_DAY_FULL:"dd 'de' MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d 'de' MMMM", MONTH_DAY_YEAR_MEDIUM:"d 'de' MMM 'de' y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d 'de' MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d 'de' MMMM 'de' y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_et = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_eu = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y('e')'ko' MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_fa = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d LLL", MONTH_DAY_FULL:"dd LLLL", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"d LLLL", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d LLL", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_fi = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLL y", YEAR_MONTH_FULL:"LLLL y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"ccc d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d. MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_fil = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"MMM d, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, MMM d, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_fr = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_fr_CA = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"M-d", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_gl = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d-M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_gsw = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_gu = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_haw = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_he = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d \u05d1MMM", MONTH_DAY_FULL:"dd \u05d1MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d \u05d1MMMM", MONTH_DAY_YEAR_MEDIUM:"d \u05d1MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d \u05d1MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d \u05d1MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_hi = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_hr = {YEAR_FULL:"y.", YEAR_FULL_WITH_ERA:"y. G", YEAR_MONTH_ABBR:"LLL y.", YEAR_MONTH_FULL:"LLLL y.", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d. M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y.", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y.", DAY_ABBR:"d."};
goog.i18n.DateTimePatterns_hu = {YEAR_FULL:"y.", YEAR_FULL_WITH_ERA:"G y.", YEAR_MONTH_ABBR:"y. MMM", YEAR_MONTH_FULL:"y. MMMM", MONTH_DAY_ABBR:"MMM d.", MONTH_DAY_FULL:"MMMM dd.", MONTH_DAY_SHORT:"M. d.", MONTH_DAY_MEDIUM:"MMMM d.", MONTH_DAY_YEAR_MEDIUM:"y. MMM d.", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d., EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y. MMM d., EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_hy = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y\u0569.", YEAR_MONTH_ABBR:"y\u0569. LLL", YEAR_MONTH_FULL:"y\u0569. LLLL", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y\u0569.", WEEKDAY_MONTH_DAY_MEDIUM:"d MMM, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y\u0569. MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_id = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_in = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_is = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_it = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_iw = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d \u05d1MMM", MONTH_DAY_FULL:"dd \u05d1MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d \u05d1MMMM", MONTH_DAY_YEAR_MEDIUM:"d \u05d1MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d \u05d1MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d \u05d1MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ja = {YEAR_FULL:"y\u5e74", YEAR_FULL_WITH_ERA:"Gy\u5e74", YEAR_MONTH_ABBR:"y\u5e74M\u6708", YEAR_MONTH_FULL:"y\u5e74M\u6708", MONTH_DAY_ABBR:"M\u6708d\u65e5", MONTH_DAY_FULL:"M\u6708dd\u65e5", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"M\u6708d\u65e5", MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5", WEEKDAY_MONTH_DAY_MEDIUM:"M\u6708d\u65e5(EEE)", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5(EEE)", DAY_ABBR:"d\u65e5"};
goog.i18n.DateTimePatterns_ka = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM, y", YEAR_MONTH_FULL:"MMMM, y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d.M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_kk = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd-MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_km = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y \u1793\u17c3 G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d-M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_kn = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d, MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"d MMM, y EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ko = {YEAR_FULL:"y\ub144", YEAR_FULL_WITH_ERA:"G y\ub144", YEAR_MONTH_ABBR:"y\ub144 MMM", YEAR_MONTH_FULL:"y\ub144 MMMM", MONTH_DAY_ABBR:"MMM d\uc77c", MONTH_DAY_FULL:"MMMM dd\uc77c", MONTH_DAY_SHORT:"M. d.", MONTH_DAY_MEDIUM:"MMMM d\uc77c", MONTH_DAY_YEAR_MEDIUM:"y\ub144 MMM d\uc77c", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d\uc77c (EEE)", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y\ub144 MMM d\uc77c (EEE)", DAY_ABBR:"d\uc77c"};
goog.i18n.DateTimePatterns_ky = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y-'\u0436'.", YEAR_MONTH_ABBR:"y-'\u0436'. MMM", YEAR_MONTH_FULL:"y-'\u0436'. MMMM", MONTH_DAY_ABBR:"d-MMM", MONTH_DAY_FULL:"dd-MMMM", MONTH_DAY_SHORT:"dd-MM", MONTH_DAY_MEDIUM:"d-MMMM", MONTH_DAY_YEAR_MEDIUM:"y-'\u0436'. d-MMM", WEEKDAY_MONTH_DAY_MEDIUM:"d-MMM, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y-'\u0436'. d-MMM, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ln = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_lo = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_lt = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"MM-d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"dd"};
goog.i18n.DateTimePatterns_lv = {YEAR_FULL:"y. 'g'.", YEAR_FULL_WITH_ERA:"G y. 'g'.", YEAR_MONTH_ABBR:"y. 'g'. MMM", YEAR_MONTH_FULL:"y. 'g'. MMMM", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"dd.MM.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"y. 'g'. d. MMM", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, y. 'g'. d. MMM", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_mk = {YEAR_FULL:"y '\u0433'.", YEAR_FULL_WITH_ERA:"y '\u0433'. G", YEAR_MONTH_ABBR:"MMM y '\u0433'.", YEAR_MONTH_FULL:"MMMM y '\u0433'.", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d.M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y '\u0433'.", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y '\u0433'.", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ml = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_mn = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M-d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"EEE MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, y MMM d", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_mo = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_mr = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d, MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ms = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d-M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_mt = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"MM-dd", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_my = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, y MMM d", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_nb = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d. MMM y", DAY_ABBR:"d."};
goog.i18n.DateTimePatterns_ne = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"MM-dd", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_nl = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d-M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_no = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d. MMM y", DAY_ABBR:"d."};
goog.i18n.DateTimePatterns_no_NO = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d. MMM y", DAY_ABBR:"d."};
goog.i18n.DateTimePatterns_or = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"d-M", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_pa = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_pl = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLL y", YEAR_MONTH_FULL:"LLLL y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_pt = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM 'de' y", YEAR_MONTH_FULL:"MMMM 'de' y", MONTH_DAY_ABBR:"d 'de' MMM", MONTH_DAY_FULL:"dd 'de' MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d 'de' MMMM", MONTH_DAY_YEAR_MEDIUM:"d 'de' MMM 'de' y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d 'de' MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d 'de' MMM 'de' y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_pt_BR = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM 'de' y", YEAR_MONTH_FULL:"MMMM 'de' y", MONTH_DAY_ABBR:"d 'de' MMM", MONTH_DAY_FULL:"dd 'de' MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d 'de' MMMM", MONTH_DAY_YEAR_MEDIUM:"d 'de' MMM 'de' y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d 'de' MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d 'de' MMM 'de' y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_pt_PT = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MM/y", YEAR_MONTH_FULL:"MMMM 'de' y", MONTH_DAY_ABBR:"d/MM", MONTH_DAY_FULL:"dd 'de' MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d 'de' MMMM", MONTH_DAY_YEAR_MEDIUM:"d/MM/y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d/MM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d/MM/y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ro = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ru = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLL y", YEAR_MONTH_FULL:"LLLL y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y '\u0433'.", WEEKDAY_MONTH_DAY_MEDIUM:"ccc, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_sh = {YEAR_FULL:"y.", YEAR_FULL_WITH_ERA:"y. G", YEAR_MONTH_ABBR:"MMM y.", YEAR_MONTH_FULL:"MMMM y.", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y.", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y.", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_si = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M-d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_sk = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLL y", YEAR_MONTH_FULL:"LLLL y", MONTH_DAY_ABBR:"d. MMM.", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d.M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d.M.y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM.", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y", DAY_ABBR:"d."};
goog.i18n.DateTimePatterns_sl = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d. M.", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_sq = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_sr = {YEAR_FULL:"y.", YEAR_FULL_WITH_ERA:"y. G", YEAR_MONTH_ABBR:"MMM y.", YEAR_MONTH_FULL:"MMMM y.", MONTH_DAY_ABBR:"d. MMM", MONTH_DAY_FULL:"dd. MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d. MMMM", MONTH_DAY_YEAR_MEDIUM:"d. MMM y.", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d. MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d. MMM y.", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_sv = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_sw = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d-M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, MMM d, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ta = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_te = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d, MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d, MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_th = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_tl = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"MMM d, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, MMM d, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_tr = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd/MM", MONTH_DAY_MEDIUM:"dd MMMM", MONTH_DAY_YEAR_MEDIUM:"dd MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"d MMMM EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"d MMM y EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_uk = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"LLL y", YEAR_MONTH_FULL:"LLLL y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd.MM", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, d MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_ur = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"d MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"d MMMM", MONTH_DAY_YEAR_MEDIUM:"d MMM\u060c y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE\u060c d MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE\u060c d MMM\u060c y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_uz = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"G y", YEAR_MONTH_ABBR:"y MMM", YEAR_MONTH_FULL:"y MMMM", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"MM-dd", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"y MMM d", WEEKDAY_MONTH_DAY_MEDIUM:"MMM d, EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y MMM d, EEE", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_vi = {YEAR_FULL:"'N\u0103m' y", YEAR_FULL_WITH_ERA:"'N\u0103m' y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"dd MMM", MONTH_DAY_FULL:"dd MMMM", MONTH_DAY_SHORT:"dd-M", MONTH_DAY_MEDIUM:"dd MMMM", MONTH_DAY_YEAR_MEDIUM:"dd MMM, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, dd MMM", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, dd MMM y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns_zh = {YEAR_FULL:"y\u5e74", YEAR_FULL_WITH_ERA:"Gy\u5e74", YEAR_MONTH_ABBR:"y\u5e74M\u6708", YEAR_MONTH_FULL:"y\u5e74M\u6708", MONTH_DAY_ABBR:"M\u6708d\u65e5", MONTH_DAY_FULL:"M\u6708dd\u65e5", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"M\u6708d\u65e5", MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5", WEEKDAY_MONTH_DAY_MEDIUM:"M\u6708d\u65e5EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5EEE", DAY_ABBR:"d\u65e5"};
goog.i18n.DateTimePatterns_zh_CN = {YEAR_FULL:"y\u5e74", YEAR_FULL_WITH_ERA:"Gy\u5e74", YEAR_MONTH_ABBR:"y\u5e74M\u6708", YEAR_MONTH_FULL:"y\u5e74M\u6708", MONTH_DAY_ABBR:"M\u6708d\u65e5", MONTH_DAY_FULL:"M\u6708dd\u65e5", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"M\u6708d\u65e5", MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5", WEEKDAY_MONTH_DAY_MEDIUM:"M\u6708d\u65e5EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5EEE", DAY_ABBR:"d\u65e5"};
goog.i18n.DateTimePatterns_zh_HK = {YEAR_FULL:"y\u5e74", YEAR_FULL_WITH_ERA:"G y \u5e74", YEAR_MONTH_ABBR:"y \u5e74 M \u6708", YEAR_MONTH_FULL:"y \u5e74 M \u6708", MONTH_DAY_ABBR:"M\u6708d\u65e5", MONTH_DAY_FULL:"M\u6708dd\u65e5", MONTH_DAY_SHORT:"d/M", MONTH_DAY_MEDIUM:"M\u6708d\u65e5", MONTH_DAY_YEAR_MEDIUM:"y \u5e74 M \u6708 d \u65e5", WEEKDAY_MONTH_DAY_MEDIUM:"M\u6708d\u65e5 (EEE)", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y \u5e74 M \u6708 d \u65e5 (EEE)", DAY_ABBR:"d\u65e5"};
goog.i18n.DateTimePatterns_zh_TW = {YEAR_FULL:"y\u5e74", YEAR_FULL_WITH_ERA:"G y \u5e74", YEAR_MONTH_ABBR:"y\u5e74M\u6708", YEAR_MONTH_FULL:"y\u5e74M\u6708", MONTH_DAY_ABBR:"M\u6708d\u65e5", MONTH_DAY_FULL:"M\u6708dd\u65e5", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"M\u6708d\u65e5", MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5", WEEKDAY_MONTH_DAY_MEDIUM:"M\u6708d\u65e5EEE", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"y\u5e74M\u6708d\u65e5EEE", DAY_ABBR:"d\u65e5"};
goog.i18n.DateTimePatterns_zu = {YEAR_FULL:"y", YEAR_FULL_WITH_ERA:"y G", YEAR_MONTH_ABBR:"MMM y", YEAR_MONTH_FULL:"MMMM y", MONTH_DAY_ABBR:"MMM d", MONTH_DAY_FULL:"MMMM dd", MONTH_DAY_SHORT:"M/d", MONTH_DAY_MEDIUM:"MMMM d", MONTH_DAY_YEAR_MEDIUM:"MMM d, y", WEEKDAY_MONTH_DAY_MEDIUM:"EEE, MMM d", WEEKDAY_MONTH_DAY_YEAR_MEDIUM:"EEE, MMM d, y", DAY_ABBR:"d"};
goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en;
"af" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_af);
"am" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_am);
"ar" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ar);
"az" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_az);
"bg" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_bg);
"bn" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_bn);
"br" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_br);
"ca" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ca);
"chr" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_chr);
"cs" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_cs);
"cy" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_cy);
"da" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_da);
"de" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_de);
if ("de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_de_AT;
}
if ("de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_de_CH;
}
"el" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_el);
"en" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en);
if ("en_AU" == goog.LOCALE || "en-AU" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en_AU;
}
if ("en_GB" == goog.LOCALE || "en-GB" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en_GB;
}
if ("en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en_IE;
}
if ("en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en_IN;
}
if ("en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en_SG;
}
if ("en_US" == goog.LOCALE || "en-US" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en_US;
}
if ("en_ZA" == goog.LOCALE || "en-ZA" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_en_ZA;
}
"es" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_es);
if ("es_419" == goog.LOCALE || "es-419" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_es_419;
}
if ("es_ES" == goog.LOCALE || "es-ES" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_es_ES;
}
"et" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_et);
"eu" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_eu);
"fa" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_fa);
"fi" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_fi);
"fil" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_fil);
"fr" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_fr);
if ("fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_fr_CA;
}
"gl" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_gl);
"gsw" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_gsw);
"gu" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_gu);
"haw" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_haw);
"he" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_he);
"hi" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_hi);
"hr" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_hr);
"hu" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_hu);
"hy" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_hy);
"id" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_id);
"in" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_in);
"is" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_is);
"it" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_it);
"iw" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_iw);
"ja" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ja);
"ka" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ka);
"kk" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_kk);
"km" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_km);
"kn" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_kn);
"ko" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ko);
"ky" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ky);
"ln" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ln);
"lo" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_lo);
"lt" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_lt);
"lv" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_lv);
"mk" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_mk);
"ml" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ml);
"mn" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_mn);
"mo" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_mo);
"mr" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_mr);
"ms" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ms);
"mt" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_mt);
"my" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_my);
"nb" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_nb);
"ne" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ne);
"nl" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_nl);
"no" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_no);
if ("no_NO" == goog.LOCALE || "no-NO" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_no_NO;
}
"or" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_or);
"pa" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_pa);
"pl" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_pl);
"pt" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_pt);
if ("pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_pt_BR;
}
if ("pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_pt_PT;
}
"ro" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ro);
"ru" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ru);
"sh" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_sh);
"si" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_si);
"sk" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_sk);
"sl" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_sl);
"sq" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_sq);
"sr" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_sr);
"sv" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_sv);
"sw" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_sw);
"ta" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ta);
"te" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_te);
"th" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_th);
"tl" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_tl);
"tr" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_tr);
"uk" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_uk);
"ur" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_ur);
"uz" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_uz);
"vi" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_vi);
"zh" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_zh);
if ("zh_CN" == goog.LOCALE || "zh-CN" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_zh_CN;
}
if ("zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_zh_HK;
}
if ("zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE) {
  goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_zh_TW;
}
"zu" == goog.LOCALE && (goog.i18n.DateTimePatterns = goog.i18n.DateTimePatterns_zu);
// INPUT (javascript/closure/i18n/compactnumberformatsymbols.js)
goog.i18n.CompactNumberFormatSymbols_af = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"0"}, 1E5:{other:"0"}, 1E6:{other:"0\u00a0m"}, 1E7:{other:"00\u00a0m"}, 1E8:{other:"000\u00a0m"}, 1E9:{other:"0\u00a0mjd"}, 1E10:{other:"00\u00a0mjd"}, 1E11:{other:"000\u00a0mjd"}, 1E12:{other:"0\u00a0bn"}, 1E13:{other:"00\u00a0bn"}, 1E14:{other:"000\u00a0bn"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 duisend"}, 1E4:{other:"00 duisend"}, 1E5:{other:"000 duisend"}, 1E6:{other:"0 miljoen"}, 1E7:{other:"00 miljoen"}, 
1E8:{other:"000 miljoen"}, 1E9:{other:"0 miljard"}, 1E10:{other:"00 miljard"}, 1E11:{other:"000 miljard"}, 1E12:{other:"0 biljoen"}, 1E13:{other:"00 biljoen"}, 1E14:{other:"000 biljoen"}}};
goog.i18n.CompactNumberFormatSymbols_af_ZA = goog.i18n.CompactNumberFormatSymbols_af;
goog.i18n.CompactNumberFormatSymbols_am = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u123a"}, 1E4:{other:"00\u00a0\u123a"}, 1E5:{other:"000\u00a0\u123a"}, 1E6:{other:"0\u00a0\u121c\u1275\u122d"}, 1E7:{other:"00\u00a0\u121c\u1275\u122d"}, 1E8:{other:"000\u00a0\u121c\u1275\u122d"}, 1E9:{other:"0\u00a0\u1262"}, 1E10:{other:"00\u00a0\u1262"}, 1E11:{other:"000\u00a0\u1262"}, 1E12:{other:"0\u00a0\u1275"}, 1E13:{other:"00\u00a0\u1275"}, 1E14:{other:"000\u00a0\u1275"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u123a"}, 
1E4:{other:"00 \u123a"}, 1E5:{other:"000 \u123a"}, 1E6:{other:"0 \u121a\u120a\u12ee\u1295"}, 1E7:{other:"00 \u121a\u120a\u12ee\u1295"}, 1E8:{other:"000 \u121a\u120a\u12ee\u1295"}, 1E9:{other:"0 \u1262\u120a\u12ee\u1295"}, 1E10:{other:"00 \u1262\u120a\u12ee\u1295"}, 1E11:{other:"000 \u1262\u120a\u12ee\u1295"}, 1E12:{other:"0 \u1275\u122a\u120a\u12ee\u1295"}, 1E13:{other:"00 \u1275\u122a\u120a\u12ee\u1295"}, 1E14:{other:"000 \u1275\u122a\u120a\u12ee\u1295"}}};
goog.i18n.CompactNumberFormatSymbols_am_ET = goog.i18n.CompactNumberFormatSymbols_am;
goog.i18n.CompactNumberFormatSymbols_ar = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0623\u0644\u0641"}, 1E4:{other:"00\u00a0\u0623\u0644\u0641"}, 1E5:{other:"000\u00a0\u0623\u0644\u0641"}, 1E6:{other:"0\u00a0\u0645\u0644\u064a\u0648"}, 1E7:{other:"00\u00a0\u0645\u0644\u064a\u0648"}, 1E8:{other:"000\u00a0\u0645\u0644\u064a\u0648"}, 1E9:{other:"0\u00a0\u0628\u0644\u064a\u0648"}, 1E10:{other:"00\u00a0\u0628\u0644\u064a\u0648"}, 1E11:{other:"000\u00a0\u0628\u0644\u064a\u0648"}, 1E12:{other:"0\u00a0\u062a\u0631\u0644\u064a\u0648"}, 
1E13:{other:"00\u00a0\u062a\u0631\u0644\u064a\u0648"}, 1E14:{other:"000\u00a0\u062a\u0631\u0644\u064a\u0648"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0623\u0644\u0641"}, 1E4:{other:"00 \u0623\u0644\u0641"}, 1E5:{other:"000 \u0623\u0644\u0641"}, 1E6:{other:"0 \u0645\u0644\u064a\u0648\u0646"}, 1E7:{other:"00 \u0645\u0644\u064a\u0648\u0646"}, 1E8:{other:"000 \u0645\u0644\u064a\u0648\u0646"}, 1E9:{other:"0 \u0628\u0644\u064a\u0648\u0646"}, 1E10:{other:"00 \u0628\u0644\u064a\u0648\u0646"}, 1E11:{other:"000 \u0628\u0644\u064a\u0648\u0646"}, 
1E12:{other:"0 \u062a\u0631\u064a\u0644\u064a\u0648\u0646"}, 1E13:{other:"00 \u062a\u0631\u064a\u0644\u064a\u0648\u0646"}, 1E14:{other:"000 \u062a\u0631\u064a\u0644\u064a\u0648\u0646"}}};
goog.i18n.CompactNumberFormatSymbols_ar_001 = goog.i18n.CompactNumberFormatSymbols_ar;
goog.i18n.CompactNumberFormatSymbols_az = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 
1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_az_Cyrl_AZ = goog.i18n.CompactNumberFormatSymbols_az;
goog.i18n.CompactNumberFormatSymbols_az_Latn_AZ = goog.i18n.CompactNumberFormatSymbols_az;
goog.i18n.CompactNumberFormatSymbols_bg = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0445\u0438\u043b."}, 1E4:{other:"00\u00a0\u0445\u0438\u043b."}, 1E5:{other:"000\u00a0\u0445\u0438\u043b."}, 1E6:{other:"0\u00a0\u043c\u043b\u043d."}, 1E7:{other:"00\u00a0\u043c\u043b\u043d."}, 1E8:{other:"000\u00a0\u043c\u043b\u043d."}, 1E9:{other:"0\u00a0\u043c\u043b\u0440\u0434."}, 1E10:{other:"00\u00a0\u043c\u043b\u0440\u0434."}, 1E11:{other:"000\u00a0\u043c\u043b\u0440\u0434."}, 1E12:{other:"0\u00a0\u0442\u0440\u043b\u043d."}, 
1E13:{other:"00\u00a0\u0442\u0440\u043b\u043d."}, 1E14:{other:"000\u00a0\u0442\u0440\u043b\u043d."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0445\u0438\u043b\u044f\u0434\u0438"}, 1E4:{other:"00 \u0445\u0438\u043b\u044f\u0434\u0438"}, 1E5:{other:"000 \u0445\u0438\u043b\u044f\u0434\u0438"}, 1E6:{other:"0 \u043c\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E7:{other:"00 \u043c\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E8:{other:"000 \u043c\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E9:{other:"0 \u043c\u0438\u043b\u0438\u0430\u0440\u0434\u0430"}, 
1E10:{other:"00 \u043c\u0438\u043b\u0438\u0430\u0440\u0434\u0430"}, 1E11:{other:"000 \u043c\u0438\u043b\u0438\u0430\u0440\u0434\u0430"}, 1E12:{other:"0 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E13:{other:"00 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E14:{other:"000 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0430"}}};
goog.i18n.CompactNumberFormatSymbols_bg_BG = goog.i18n.CompactNumberFormatSymbols_bg;
goog.i18n.CompactNumberFormatSymbols_bn = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"0\u00a0\u09b2\u09be\u0996"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u09b9\u09be\u099c\u09be\u09b0"}, 1E4:{other:"00 \u09b9\u09be\u099c\u09be\u09b0"}, 1E5:{other:"0 \u09b2\u09be\u0996"}, 1E6:{other:"0 \u09ae\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 
1E7:{other:"00 \u09ae\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 1E8:{other:"000 \u09ae\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 1E9:{other:"0 \u09ac\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 1E10:{other:"00 \u09ac\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 1E11:{other:"000 \u09ac\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 1E12:{other:"0 \u099f\u09cd\u09b0\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 1E13:{other:"00 \u099f\u09cd\u09b0\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}, 1E14:{other:"000 \u099f\u09cd\u09b0\u09bf\u09b2\u09bf\u09af\u09bc\u09a8"}}};
goog.i18n.CompactNumberFormatSymbols_bn_BD = goog.i18n.CompactNumberFormatSymbols_bn;
goog.i18n.CompactNumberFormatSymbols_br = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_br_FR = goog.i18n.CompactNumberFormatSymbols_br;
goog.i18n.CompactNumberFormatSymbols_ca = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0m"}, 1E4:{other:"00m"}, 1E5:{other:"000m"}, 1E6:{other:"0M"}, 1E7:{other:"00\u00a0M"}, 1E8:{other:"000\u00a0M"}, 1E9:{other:"0000\u00a0M"}, 1E10:{other:"00mM"}, 1E11:{other:"000mM"}, 1E12:{other:"0B"}, 1E13:{other:"00\u00a0B"}, 1E14:{other:"000\u00a0B"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 milers"}, 1E4:{other:"00 milers"}, 1E5:{other:"000 milers"}, 1E6:{other:"0 milions"}, 1E7:{other:"00 milions"}, 1E8:{other:"000 milions"}, 
1E9:{other:"0 milers de milions"}, 1E10:{other:"00 milers de milions"}, 1E11:{other:"000 milers de milions"}, 1E12:{other:"0 bilions"}, 1E13:{other:"00 bilions"}, 1E14:{other:"000 bilions"}}};
goog.i18n.CompactNumberFormatSymbols_ca_AD = goog.i18n.CompactNumberFormatSymbols_ca;
goog.i18n.CompactNumberFormatSymbols_ca_ES = goog.i18n.CompactNumberFormatSymbols_ca;
goog.i18n.CompactNumberFormatSymbols_ca_ES_VALENCIA = goog.i18n.CompactNumberFormatSymbols_ca;
goog.i18n.CompactNumberFormatSymbols_ca_FR = goog.i18n.CompactNumberFormatSymbols_ca;
goog.i18n.CompactNumberFormatSymbols_ca_IT = goog.i18n.CompactNumberFormatSymbols_ca;
goog.i18n.CompactNumberFormatSymbols_chr = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_chr_US = goog.i18n.CompactNumberFormatSymbols_chr;
goog.i18n.CompactNumberFormatSymbols_cs = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tis."}, 1E4:{other:"00\u00a0tis."}, 1E5:{other:"000\u00a0tis."}, 1E6:{other:"0\u00a0mil."}, 1E7:{other:"00\u00a0mil."}, 1E8:{other:"000\u00a0mil."}, 1E9:{other:"0\u00a0mld."}, 1E10:{other:"00\u00a0mld."}, 1E11:{other:"000\u00a0mld."}, 1E12:{other:"0\u00a0bil."}, 1E13:{other:"00\u00a0bil."}, 1E14:{other:"000\u00a0bil."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tis\u00edc"}, 1E4:{other:"00 tis\u00edc"}, 
1E5:{other:"000 tis\u00edc"}, 1E6:{other:"0 milion\u016f"}, 1E7:{other:"00 milion\u016f"}, 1E8:{other:"000 milion\u016f"}, 1E9:{other:"0 miliard"}, 1E10:{other:"00 miliard"}, 1E11:{other:"000 miliard"}, 1E12:{other:"0 bilion\u016f"}, 1E13:{other:"00 bilion\u016f"}, 1E14:{other:"000 bilion\u016f"}}};
goog.i18n.CompactNumberFormatSymbols_cs_CZ = goog.i18n.CompactNumberFormatSymbols_cs;
goog.i18n.CompactNumberFormatSymbols_cy = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mil"}, 1E4:{other:"00 mil"}, 1E5:{other:"000 mil"}, 1E6:{other:"0 miliwn"}, 1E7:{other:"00 miliwn"}, 1E8:{other:"000 miliwn"}, 1E9:{other:"0 biliwn"}, 
1E10:{other:"00 biliwn"}, 1E11:{other:"000 biliwn"}, 1E12:{other:"0 triliwn"}, 1E13:{other:"00 triliwn"}, 1E14:{other:"000 triliwn"}}};
goog.i18n.CompactNumberFormatSymbols_cy_GB = goog.i18n.CompactNumberFormatSymbols_cy;
goog.i18n.CompactNumberFormatSymbols_da = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0td"}, 1E4:{other:"00\u00a0td"}, 1E5:{other:"000\u00a0td"}, 1E6:{other:"0\u00a0mio"}, 1E7:{other:"00\u00a0mio"}, 1E8:{other:"000\u00a0mio"}, 1E9:{other:"0\u00a0mia"}, 1E10:{other:"00\u00a0mia"}, 1E11:{other:"000\u00a0mia"}, 1E12:{other:"0\u00a0bill"}, 1E13:{other:"00\u00a0bill"}, 1E14:{other:"000\u00a0bill"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tusind"}, 1E4:{other:"00 tusind"}, 1E5:{other:"000 tusind"}, 
1E6:{other:"0 millioner"}, 1E7:{other:"00 millioner"}, 1E8:{other:"000 millioner"}, 1E9:{other:"0 milliarder"}, 1E10:{other:"00 milliarder"}, 1E11:{other:"000 milliarder"}, 1E12:{other:"0 billioner"}, 1E13:{other:"00 billioner"}, 1E14:{other:"000 billioner"}}};
goog.i18n.CompactNumberFormatSymbols_da_DK = goog.i18n.CompactNumberFormatSymbols_da;
goog.i18n.CompactNumberFormatSymbols_da_GL = goog.i18n.CompactNumberFormatSymbols_da;
goog.i18n.CompactNumberFormatSymbols_de = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0Tsd"}, 1E4:{other:"00\u00a0Tsd"}, 1E5:{other:"000\u00a0Tsd"}, 1E6:{other:"0\u00a0Mio"}, 1E7:{other:"00\u00a0Mio"}, 1E8:{other:"000\u00a0Mio"}, 1E9:{other:"0\u00a0Mrd"}, 1E10:{other:"00\u00a0Mrd"}, 1E11:{other:"000\u00a0Mrd"}, 1E12:{other:"0\u00a0Bio"}, 1E13:{other:"00\u00a0Bio"}, 1E14:{other:"000\u00a0Bio"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 Tausend"}, 1E4:{other:"00 Tausend"}, 1E5:{other:"000 Tausend"}, 
1E6:{other:"0 Millionen"}, 1E7:{other:"00 Millionen"}, 1E8:{other:"000 Millionen"}, 1E9:{other:"0 Milliarden"}, 1E10:{other:"00 Milliarden"}, 1E11:{other:"000 Milliarden"}, 1E12:{other:"0 Billionen"}, 1E13:{other:"00 Billionen"}, 1E14:{other:"000 Billionen"}}};
goog.i18n.CompactNumberFormatSymbols_de_AT = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0Tsd"}, 1E4:{other:"00\u00a0Tsd"}, 1E5:{other:"000\u00a0Tsd"}, 1E6:{other:"0\u00a0Mio"}, 1E7:{other:"00\u00a0Mio"}, 1E8:{other:"000\u00a0Mio"}, 1E9:{other:"0\u00a0Mrd"}, 1E10:{other:"00\u00a0Mrd"}, 1E11:{other:"000\u00a0Mrd"}, 1E12:{other:"0\u00a0Bio"}, 1E13:{other:"00\u00a0Bio"}, 1E14:{other:"000\u00a0Bio"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 Tausend"}, 1E4:{other:"00 Tausend"}, 1E5:{other:"000 Tausend"}, 
1E6:{other:"0 Millionen"}, 1E7:{other:"00 Millionen"}, 1E8:{other:"000 Millionen"}, 1E9:{other:"0 Milliarden"}, 1E10:{other:"00 Milliarden"}, 1E11:{other:"000 Milliarden"}, 1E12:{other:"0 Billionen"}, 1E13:{other:"00 Billionen"}, 1E14:{other:"000 Billionen"}}};
goog.i18n.CompactNumberFormatSymbols_de_BE = goog.i18n.CompactNumberFormatSymbols_de;
goog.i18n.CompactNumberFormatSymbols_de_CH = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0Tsd"}, 1E4:{other:"00\u00a0Tsd"}, 1E5:{other:"000\u00a0Tsd"}, 1E6:{other:"0\u00a0Mio"}, 1E7:{other:"00\u00a0Mio"}, 1E8:{other:"000\u00a0Mio"}, 1E9:{other:"0\u00a0Mrd"}, 1E10:{other:"00\u00a0Mrd"}, 1E11:{other:"000\u00a0Mrd"}, 1E12:{other:"0\u00a0Bio"}, 1E13:{other:"00\u00a0Bio"}, 1E14:{other:"000\u00a0Bio"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 Tausend"}, 1E4:{other:"00 Tausend"}, 1E5:{other:"000 Tausend"}, 
1E6:{other:"0 Millionen"}, 1E7:{other:"00 Millionen"}, 1E8:{other:"000 Millionen"}, 1E9:{other:"0 Milliarden"}, 1E10:{other:"00 Milliarden"}, 1E11:{other:"000 Milliarden"}, 1E12:{other:"0 Billionen"}, 1E13:{other:"00 Billionen"}, 1E14:{other:"000 Billionen"}}};
goog.i18n.CompactNumberFormatSymbols_de_DE = goog.i18n.CompactNumberFormatSymbols_de;
goog.i18n.CompactNumberFormatSymbols_de_LU = goog.i18n.CompactNumberFormatSymbols_de;
goog.i18n.CompactNumberFormatSymbols_el = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u03c7\u03b9\u03bb."}, 1E4:{other:"00\u00a0\u03c7\u03b9\u03bb."}, 1E5:{other:"000\u00a0\u03c7\u03b9\u03bb."}, 1E6:{other:"0\u00a0\u03b5\u03ba."}, 1E7:{other:"00\u00a0\u03b5\u03ba."}, 1E8:{other:"000\u00a0\u03b5\u03ba."}, 1E9:{other:"0\u00a0\u03b4\u03b9\u03c3."}, 1E10:{other:"00\u00a0\u03b4\u03b9\u03c3."}, 1E11:{other:"000\u00a0\u03b4\u03b9\u03c3."}, 1E12:{other:"0\u00a0\u03c4\u03c1\u03b9\u03c3."}, 1E13:{other:"00\u00a0\u03c4\u03c1\u03b9\u03c3."}, 
1E14:{other:"000\u00a0\u03c4\u03c1\u03b9\u03c3."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u03c7\u03b9\u03bb\u03b9\u03ac\u03b4\u03b5\u03c2"}, 1E4:{other:"00 \u03c7\u03b9\u03bb\u03b9\u03ac\u03b4\u03b5\u03c2"}, 1E5:{other:"000 \u03c7\u03b9\u03bb\u03b9\u03ac\u03b4\u03b5\u03c2"}, 1E6:{other:"0 \u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 1E7:{other:"00 \u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 1E8:{other:"000 \u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 
1E9:{other:"0 \u03b4\u03b9\u03c3\u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 1E10:{other:"00 \u03b4\u03b9\u03c3\u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 1E11:{other:"000 \u03b4\u03b9\u03c3\u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 1E12:{other:"0 \u03c4\u03c1\u03b9\u03c3\u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 1E13:{other:"00 \u03c4\u03c1\u03b9\u03c3\u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}, 
1E14:{other:"000 \u03c4\u03c1\u03b9\u03c3\u03b5\u03ba\u03b1\u03c4\u03bf\u03bc\u03bc\u03cd\u03c1\u03b9\u03b1"}}};
goog.i18n.CompactNumberFormatSymbols_el_GR = goog.i18n.CompactNumberFormatSymbols_el;
goog.i18n.CompactNumberFormatSymbols_en = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 thousand"}, 1E4:{other:"00 thousand"}, 1E5:{other:"000 thousand"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 1E9:{other:"0 billion"}, 
1E10:{other:"00 billion"}, 1E11:{other:"000 billion"}, 1E12:{other:"0 trillion"}, 1E13:{other:"00 trillion"}, 1E14:{other:"000 trillion"}}};
goog.i18n.CompactNumberFormatSymbols_en_001 = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_AS = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_AU = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 thousand"}, 1E4:{other:"00 thousand"}, 1E5:{other:"000 thousand"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 1E9:{other:"0 billion"}, 
1E10:{other:"00 billion"}, 1E11:{other:"000 billion"}, 1E12:{other:"0 trillion"}, 1E13:{other:"00 trillion"}, 1E14:{other:"000 trillion"}}};
goog.i18n.CompactNumberFormatSymbols_en_DG = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_FM = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_GB = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 thousand"}, 1E4:{other:"00 thousand"}, 1E5:{other:"000 thousand"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 1E9:{other:"0 billion"}, 
1E10:{other:"00 billion"}, 1E11:{other:"000 billion"}, 1E12:{other:"0 trillion"}, 1E13:{other:"00 trillion"}, 1E14:{other:"000 trillion"}}};
goog.i18n.CompactNumberFormatSymbols_en_GU = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_IE = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 thousand"}, 1E4:{other:"00 thousand"}, 1E5:{other:"000 thousand"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 1E9:{other:"0 billion"}, 
1E10:{other:"00 billion"}, 1E11:{other:"000 billion"}, 1E12:{other:"0 trillion"}, 1E13:{other:"00 trillion"}, 1E14:{other:"000 trillion"}}};
goog.i18n.CompactNumberFormatSymbols_en_IN = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 thousand"}, 1E4:{other:"00 thousand"}, 1E5:{other:"000 thousand"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 1E9:{other:"0 billion"}, 
1E10:{other:"00 billion"}, 1E11:{other:"000 billion"}, 1E12:{other:"0 trillion"}, 1E13:{other:"00 trillion"}, 1E14:{other:"000 trillion"}}};
goog.i18n.CompactNumberFormatSymbols_en_IO = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_MH = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_MP = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_PR = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_PW = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_SG = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 thousand"}, 1E4:{other:"00 thousand"}, 1E5:{other:"000 thousand"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 1E9:{other:"0 billion"}, 
1E10:{other:"00 billion"}, 1E11:{other:"000 billion"}, 1E12:{other:"0 trillion"}, 1E13:{other:"00 trillion"}, 1E14:{other:"000 trillion"}}};
goog.i18n.CompactNumberFormatSymbols_en_TC = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_UM = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_US = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_VG = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_VI = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_en_ZA = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 thousand"}, 1E4:{other:"00 thousand"}, 1E5:{other:"000 thousand"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 1E9:{other:"0 billion"}, 
1E10:{other:"00 billion"}, 1E11:{other:"000 billion"}, 1E12:{other:"0 trillion"}, 1E13:{other:"00 trillion"}, 1E14:{other:"000 trillion"}}};
goog.i18n.CompactNumberFormatSymbols_en_ZW = goog.i18n.CompactNumberFormatSymbols_en;
goog.i18n.CompactNumberFormatSymbols_es = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0000\u00a0M"}, 1E10:{other:"00MRD"}, 1E11:{other:"000MRD"}, 1E12:{other:"0B"}, 1E13:{other:"00B"}, 1E14:{other:"000B"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mil"}, 1E4:{other:"00 mil"}, 1E5:{other:"000 mil"}, 1E6:{other:"0 millones"}, 1E7:{other:"00 millones"}, 1E8:{other:"000 millones"}, 1E9:{other:"0 mil millones"}, 
1E10:{other:"00 mil millones"}, 1E11:{other:"000 mil millones"}, 1E12:{other:"0 billones"}, 1E13:{other:"00 billones"}, 1E14:{other:"000 billones"}}};
goog.i18n.CompactNumberFormatSymbols_es_419 = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"00k"}, 1E5:{other:"000k"}, 1E6:{other:"0\u00a0M"}, 1E7:{other:"00\u00a0M"}, 1E8:{other:"000\u00a0M"}, 1E9:{other:"0k\u00a0M"}, 1E10:{other:"00k\u00a0M"}, 1E11:{other:"000k\u00a0M"}, 1E12:{other:"0\u00a0B"}, 1E13:{other:"00\u00a0B"}, 1E14:{other:"000\u00a0B"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mil"}, 1E4:{other:"00 mil"}, 1E5:{other:"000 mil"}, 1E6:{other:"0 millones"}, 1E7:{other:"00 millones"}, 
1E8:{other:"000 millones"}, 1E9:{other:"0 mil millones"}, 1E10:{other:"00 mil millones"}, 1E11:{other:"000 mil millones"}, 1E12:{other:"0 billones"}, 1E13:{other:"00 billones"}, 1E14:{other:"000 billones"}}};
goog.i18n.CompactNumberFormatSymbols_es_EA = goog.i18n.CompactNumberFormatSymbols_es;
goog.i18n.CompactNumberFormatSymbols_es_ES = goog.i18n.CompactNumberFormatSymbols_es;
goog.i18n.CompactNumberFormatSymbols_es_IC = goog.i18n.CompactNumberFormatSymbols_es;
goog.i18n.CompactNumberFormatSymbols_et = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tuh"}, 1E4:{other:"00\u00a0tuh"}, 1E5:{other:"000\u00a0tuh"}, 1E6:{other:"0\u00a0mln"}, 1E7:{other:"00\u00a0mln"}, 1E8:{other:"000\u00a0mln"}, 1E9:{other:"0\u00a0mld"}, 1E10:{other:"00\u00a0mld"}, 1E11:{other:"000\u00a0mld"}, 1E12:{other:"0\u00a0trl"}, 1E13:{other:"00\u00a0trl"}, 1E14:{other:"000\u00a0trl"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tuhat"}, 1E4:{other:"00 tuhat"}, 1E5:{other:"000 tuhat"}, 
1E6:{other:"0 miljonit"}, 1E7:{other:"00 miljonit"}, 1E8:{other:"000 miljonit"}, 1E9:{other:"0 miljardit"}, 1E10:{other:"00 miljardit"}, 1E11:{other:"000 miljardit"}, 1E12:{other:"0 triljonit"}, 1E13:{other:"00 triljonit"}, 1E14:{other:"000 triljonit"}}};
goog.i18n.CompactNumberFormatSymbols_et_EE = goog.i18n.CompactNumberFormatSymbols_et;
goog.i18n.CompactNumberFormatSymbols_eu = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0000"}, 1E4:{other:"00000"}, 1E5:{other:"000000"}, 1E6:{other:"0\u00a0M"}, 1E7:{other:"00\u00a0M"}, 1E8:{other:"000\u00a0M"}, 1E9:{other:"0000\u00a0M"}, 1E10:{other:"00000\u00a0M"}, 1E11:{other:"000000\u00a0M"}, 1E12:{other:"0\u00a0B"}, 1E13:{other:"00\u00a0B"}, 1E14:{other:"000\u00a0B"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0000"}, 1E4:{other:"00000"}, 1E5:{other:"000000"}, 1E6:{other:"0 milioi"}, 1E7:{other:"00 milioi"}, 
1E8:{other:"000 milioi"}, 1E9:{other:"0000 milioi"}, 1E10:{other:"00000 milioi"}, 1E11:{other:"000000 milioi"}, 1E12:{other:"0 bilioi"}, 1E13:{other:"00 bilioi"}, 1E14:{other:"000 bilioi"}}};
goog.i18n.CompactNumberFormatSymbols_eu_ES = goog.i18n.CompactNumberFormatSymbols_eu;
goog.i18n.CompactNumberFormatSymbols_fa = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0647\u0632\u0627\u0631"}, 1E4:{other:"00 \u0647\u0632\u0627\u0631"}, 1E5:{other:"000 \u0647\u0632\u0627\u0631"}, 1E6:{other:"0 \u0645\u06cc\u0644\u06cc\u0648\u0646"}, 
1E7:{other:"00 \u0645\u06cc\u0644\u06cc\u0648\u0646"}, 1E8:{other:"000 \u0645\u06cc\u0644\u06cc\u0648\u0646"}, 1E9:{other:"0 \u0645\u06cc\u0644\u06cc\u0627\u0631\u062f"}, 1E10:{other:"00 \u0645\u06cc\u0644\u06cc\u0627\u0631\u062f"}, 1E11:{other:"000 \u0645\u06cc\u0644\u06cc\u0627\u0631\u062f"}, 1E12:{other:"0 \u0647\u0632\u0627\u0631 \u0645\u06cc\u0644\u06cc\u0627\u0631\u062f"}, 1E13:{other:"00 \u0647\u0632\u0627\u0631 \u0645\u06cc\u0644\u06cc\u0627\u0631\u062f"}, 1E14:{other:"000 \u0647\u0632\u0627\u0631 \u0645\u06cc\u0644\u06cc\u0627\u0631\u062f"}}};
goog.i18n.CompactNumberFormatSymbols_fa_IR = goog.i18n.CompactNumberFormatSymbols_fa;
goog.i18n.CompactNumberFormatSymbols_fi = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0t."}, 1E4:{other:"00\u00a0t."}, 1E5:{other:"000\u00a0t."}, 1E6:{other:"0\u00a0milj."}, 1E7:{other:"00\u00a0milj."}, 1E8:{other:"000\u00a0milj."}, 1E9:{other:"0\u00a0mrd."}, 1E10:{other:"00\u00a0mrd."}, 1E11:{other:"000\u00a0mrd."}, 1E12:{other:"0\u00a0bilj."}, 1E13:{other:"00\u00a0bilj."}, 1E14:{other:"000\u00a0bilj."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tuhatta"}, 1E4:{other:"00 tuhatta"}, 1E5:{other:"000 tuhatta"}, 
1E6:{other:"0 miljoonaa"}, 1E7:{other:"00 miljoonaa"}, 1E8:{other:"000 miljoonaa"}, 1E9:{other:"0 miljardia"}, 1E10:{other:"00 miljardia"}, 1E11:{other:"000 miljardia"}, 1E12:{other:"0 biljoonaa"}, 1E13:{other:"00 biljoonaa"}, 1E14:{other:"000 biljoonaa"}}};
goog.i18n.CompactNumberFormatSymbols_fi_FI = goog.i18n.CompactNumberFormatSymbols_fi;
goog.i18n.CompactNumberFormatSymbols_fil = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 libo"}, 1E4:{other:"00 libo"}, 1E5:{other:"000 libo"}, 1E6:{other:"0 milyon"}, 1E7:{other:"00 milyon"}, 1E8:{other:"000 milyon"}, 1E9:{other:"0 bilyon"}, 
1E10:{other:"00 bilyon"}, 1E11:{other:"000 bilyon"}, 1E12:{other:"0 trilyon"}, 1E13:{other:"00 trilyon"}, 1E14:{other:"000 trilyon"}}};
goog.i18n.CompactNumberFormatSymbols_fil_PH = goog.i18n.CompactNumberFormatSymbols_fil;
goog.i18n.CompactNumberFormatSymbols_fr = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0k"}, 1E4:{other:"00\u00a0k"}, 1E5:{other:"000\u00a0k"}, 1E6:{other:"0\u00a0M"}, 1E7:{other:"00\u00a0M"}, 1E8:{other:"000\u00a0M"}, 1E9:{other:"0\u00a0Md"}, 1E10:{other:"00\u00a0Md"}, 1E11:{other:"000\u00a0Md"}, 1E12:{other:"0\u00a0Bn"}, 1E13:{other:"00\u00a0Bn"}, 1E14:{other:"000\u00a0Bn"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mille"}, 1E4:{other:"00 mille"}, 1E5:{other:"000 mille"}, 1E6:{other:"0 millions"}, 
1E7:{other:"00 millions"}, 1E8:{other:"000 millions"}, 1E9:{other:"0 milliards"}, 1E10:{other:"00 milliards"}, 1E11:{other:"000 milliards"}, 1E12:{other:"0 billions"}, 1E13:{other:"00 billions"}, 1E14:{other:"000 billions"}}};
goog.i18n.CompactNumberFormatSymbols_fr_BL = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_CA = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0k"}, 1E4:{other:"00\u00a0k"}, 1E5:{other:"000\u00a0k"}, 1E6:{other:"0\u00a0M"}, 1E7:{other:"00\u00a0M"}, 1E8:{other:"000\u00a0M"}, 1E9:{other:"0\u00a0Md"}, 1E10:{other:"00\u00a0Md"}, 1E11:{other:"000\u00a0Md"}, 1E12:{other:"0\u00a0Bn"}, 1E13:{other:"00\u00a0Bn"}, 1E14:{other:"000\u00a0Bn"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mille"}, 1E4:{other:"00 mille"}, 1E5:{other:"000 mille"}, 1E6:{other:"0 millions"}, 
1E7:{other:"00 millions"}, 1E8:{other:"000 millions"}, 1E9:{other:"0 milliards"}, 1E10:{other:"00 milliards"}, 1E11:{other:"000 milliards"}, 1E12:{other:"0 billions"}, 1E13:{other:"00 billions"}, 1E14:{other:"000 billions"}}};
goog.i18n.CompactNumberFormatSymbols_fr_FR = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_GF = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_GP = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_MC = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_MF = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_MQ = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_PM = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_RE = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_fr_YT = goog.i18n.CompactNumberFormatSymbols_fr;
goog.i18n.CompactNumberFormatSymbols_gl = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0k\u00a0M"}, 1E10:{other:"00k\u00a0M"}, 1E11:{other:"000k\u00a0M"}, 1E12:{other:"0\u00a0B"}, 1E13:{other:"00\u00a0B"}, 1E14:{other:"000\u00a0B"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mil"}, 1E4:{other:"00 mil"}, 1E5:{other:"000 mil"}, 1E6:{other:"0 mill\u00f3ns"}, 1E7:{other:"00 mill\u00f3ns"}, 
1E8:{other:"000 mill\u00f3ns"}, 1E9:{other:"0 mil mill\u00f3ns"}, 1E10:{other:"00 mil mill\u00f3ns"}, 1E11:{other:"000 mil mill\u00f3ns"}, 1E12:{other:"0 bill\u00f3ns"}, 1E13:{other:"00 bill\u00f3ns"}, 1E14:{other:"000 bill\u00f3ns"}}};
goog.i18n.CompactNumberFormatSymbols_gl_ES = goog.i18n.CompactNumberFormatSymbols_gl;
goog.i18n.CompactNumberFormatSymbols_gsw = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tsd"}, 1E4:{other:"00\u00a0tsd"}, 1E5:{other:"000\u00a0tsd"}, 1E6:{other:"0\u00a0Mio"}, 1E7:{other:"00\u00a0Mio"}, 1E8:{other:"000\u00a0Mio"}, 1E9:{other:"0\u00a0Mrd"}, 1E10:{other:"00\u00a0Mrd"}, 1E11:{other:"000\u00a0Mrd"}, 1E12:{other:"0\u00a0Bio"}, 1E13:{other:"00\u00a0Bio"}, 1E14:{other:"000\u00a0Bio"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tausend"}, 1E4:{other:"00 tausend"}, 1E5:{other:"000 tausend"}, 
1E6:{other:"0 Millionen"}, 1E7:{other:"00 Millionen"}, 1E8:{other:"000 Millionen"}, 1E9:{other:"0 Milliarden"}, 1E10:{other:"00 Milliarden"}, 1E11:{other:"000 Milliarden"}, 1E12:{other:"0 Billionen"}, 1E13:{other:"00 Billionen"}, 1E14:{other:"000 Billionen"}}};
goog.i18n.CompactNumberFormatSymbols_gsw_CH = goog.i18n.CompactNumberFormatSymbols_gsw;
goog.i18n.CompactNumberFormatSymbols_gsw_LI = goog.i18n.CompactNumberFormatSymbols_gsw;
goog.i18n.CompactNumberFormatSymbols_gu = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0ab9\u0a9c\u0abe\u0ab0"}, 1E4:{other:"00\u00a0\u0ab9\u0a9c\u0abe\u0ab0"}, 1E5:{other:"0\u00a0\u0ab2\u0abe\u0a96"}, 1E6:{other:"00\u00a0\u0ab2\u0abe\u0a96"}, 1E7:{other:"0\u00a0\u0a95\u0ab0\u0acb\u0aa1"}, 1E8:{other:"00\u00a0\u0a95\u0ab0\u0acb\u0aa1"}, 1E9:{other:"0\u00a0\u0a85\u0aac\u0a9c"}, 1E10:{other:"00\u00a0\u0a85\u0aac\u0a9c"}, 1E11:{other:"0\u00a0\u0aa8\u0abf\u0a96\u0ab0\u0acd\u0ab5"}, 1E12:{other:"0\u00a0\u0aae\u0ab9\u0abe\u0aaa\u0aa6\u0acd\u0aae"}, 
1E13:{other:"0\u00a0\u0ab6\u0a82\u0a95\u0ac1"}, 1E14:{other:"0\u00a0\u0a9c\u0ab2\u0aa7\u0abf"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0ab9\u0a9c\u0abe\u0ab0"}, 1E4:{other:"00 \u0ab9\u0a9c\u0abe\u0ab0"}, 1E5:{other:"0 \u0ab2\u0abe\u0a96"}, 1E6:{other:"00 \u0ab2\u0abe\u0a96"}, 1E7:{other:"0 \u0a95\u0ab0\u0acb\u0aa1"}, 1E8:{other:"00 \u0a95\u0ab0\u0acb\u0aa1"}, 1E9:{other:"0 \u0a85\u0aac\u0a9c"}, 1E10:{other:"00 \u0a85\u0aac\u0a9c"}, 1E11:{other:"0 \u0aa8\u0abf\u0a96\u0ab0\u0acd\u0ab5"}, 1E12:{other:"0 \u0aae\u0ab9\u0abe\u0aaa\u0aa6\u0acd\u0aae"}, 
1E13:{other:"0 \u0ab6\u0a82\u0a95\u0ac1"}, 1E14:{other:"0 \u0a9c\u0ab2\u0aa7\u0abf"}}};
goog.i18n.CompactNumberFormatSymbols_gu_IN = goog.i18n.CompactNumberFormatSymbols_gu;
goog.i18n.CompactNumberFormatSymbols_haw = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_haw_US = goog.i18n.CompactNumberFormatSymbols_haw;
goog.i18n.CompactNumberFormatSymbols_he = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"\u200f0\u00a0\u05d0\u05dc\u05e3"}, 1E4:{other:"\u200f00\u00a0\u05d0\u05dc\u05e3"}, 1E5:{other:"\u200f000\u00a0\u05d0\u05dc\u05e3"}, 1E6:{other:"\u200f0\u00a0\u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E7:{other:"\u200f00\u00a0\u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E8:{other:"\u200f000\u00a0\u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 
1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"\u200f0 \u05d0\u05dc\u05e3"}, 1E4:{other:"\u200f00 \u05d0\u05dc\u05e3"}, 1E5:{other:"\u200f000 \u05d0\u05dc\u05e3"}, 1E6:{other:"\u200f0 \u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E7:{other:"\u200f00 \u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E8:{other:"\u200f000 \u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E9:{other:"\u200f0 \u05de\u05d9\u05dc\u05d9\u05d0\u05e8\u05d3"}, 1E10:{other:"\u200f00 \u05de\u05d9\u05dc\u05d9\u05d0\u05e8\u05d3"}, 1E11:{other:"\u200f000 \u05de\u05d9\u05dc\u05d9\u05d0\u05e8\u05d3"}, 
1E12:{other:"\u200f0 \u05d8\u05e8\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E13:{other:"\u200f00 \u05d8\u05e8\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E14:{other:"\u200f000 \u05d8\u05e8\u05d9\u05dc\u05d9\u05d5\u05df"}}};
goog.i18n.CompactNumberFormatSymbols_he_IL = goog.i18n.CompactNumberFormatSymbols_he;
goog.i18n.CompactNumberFormatSymbols_hi = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"0"}, 1E5:{other:"0L"}, 1E6:{other:"00L"}, 1E7:{other:"0Cr"}, 1E8:{other:"00Cr"}, 1E9:{other:"000Cr"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0939\u091c\u093c\u093e\u0930"}, 1E4:{other:"00 \u0939\u091c\u093c\u093e\u0930"}, 1E5:{other:"0 \u0932\u093e\u0916"}, 1E6:{other:"00 \u0932\u093e\u0916"}, 
1E7:{other:"0 \u0915\u0930\u094b\u0921\u093c"}, 1E8:{other:"00 \u0915\u0930\u094b\u0921\u093c"}, 1E9:{other:"0 \u0905\u0930\u092c"}, 1E10:{other:"00 \u0905\u0930\u092c"}, 1E11:{other:"0 \u0916\u0930\u092c"}, 1E12:{other:"00 \u0916\u0930\u092c"}, 1E13:{other:"000 \u0916\u0930\u092c"}, 1E14:{other:"0000 \u0916\u0930\u092c"}}};
goog.i18n.CompactNumberFormatSymbols_hi_IN = goog.i18n.CompactNumberFormatSymbols_hi;
goog.i18n.CompactNumberFormatSymbols_hr = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tis."}, 1E4:{other:"00\u00a0tis."}, 1E5:{other:"000\u00a0tis."}, 1E6:{other:"0\u00a0mil."}, 1E7:{other:"00\u00a0mil."}, 1E8:{other:"000\u00a0mil."}, 1E9:{other:"0\u00a0mlr."}, 1E10:{other:"00\u00a0mlr."}, 1E11:{other:"000\u00a0mlr."}, 1E12:{other:"0\u00a0bil."}, 1E13:{other:"00\u00a0bil."}, 1E14:{other:"000\u00a0bil."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tisu\u0107a"}, 1E4:{other:"00 tisu\u0107a"}, 
1E5:{other:"000 tisu\u0107a"}, 1E6:{other:"0 milijuna"}, 1E7:{other:"00 milijuna"}, 1E8:{other:"000 milijuna"}, 1E9:{other:"0 milijardi"}, 1E10:{other:"00 milijardi"}, 1E11:{other:"000 milijardi"}, 1E12:{other:"0 bilijuna"}, 1E13:{other:"00 bilijuna"}, 1E14:{other:"000 bilijuna"}}};
goog.i18n.CompactNumberFormatSymbols_hr_HR = goog.i18n.CompactNumberFormatSymbols_hr;
goog.i18n.CompactNumberFormatSymbols_hu = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0E"}, 1E4:{other:"00\u00a0E"}, 1E5:{other:"000\u00a0E"}, 1E6:{other:"0\u00a0M"}, 1E7:{other:"00\u00a0M"}, 1E8:{other:"000\u00a0M"}, 1E9:{other:"0\u00a0Mrd"}, 1E10:{other:"00\u00a0Mrd"}, 1E11:{other:"000\u00a0Mrd"}, 1E12:{other:"0\u00a0B"}, 1E13:{other:"00\u00a0B"}, 1E14:{other:"000\u00a0B"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 ezer"}, 1E4:{other:"00 ezer"}, 1E5:{other:"000 ezer"}, 1E6:{other:"0 milli\u00f3"}, 
1E7:{other:"00 milli\u00f3"}, 1E8:{other:"000 milli\u00f3"}, 1E9:{other:"0 milli\u00e1rd"}, 1E10:{other:"00 milli\u00e1rd"}, 1E11:{other:"000 milli\u00e1rd"}, 1E12:{other:"0 billi\u00f3"}, 1E13:{other:"00 billi\u00f3"}, 1E14:{other:"000 billi\u00f3"}}};
goog.i18n.CompactNumberFormatSymbols_hu_HU = goog.i18n.CompactNumberFormatSymbols_hu;
goog.i18n.CompactNumberFormatSymbols_hy = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0570\u0566\u0580"}, 1E4:{other:"00\u00a0\u0570\u0566\u0580"}, 1E5:{other:"000\u00a0\u0570\u0566\u0580"}, 1E6:{other:"0\u00a0\u0574\u056c\u0576"}, 1E7:{other:"00\u00a0\u0574\u056c\u0576"}, 1E8:{other:"000\u00a0\u0574\u056c\u0576"}, 1E9:{other:"0\u00a0\u0574\u056c\u0580\u0564"}, 1E10:{other:"00\u00a0\u0574\u056c\u0580\u0564"}, 1E11:{other:"000\u00a0\u0574\u056c\u0580\u0564"}, 1E12:{other:"0\u00a0\u057f\u0580\u056c\u0576"}, 
1E13:{other:"00\u00a0\u057f\u0580\u056c\u0576"}, 1E14:{other:"000\u00a0\u057f\u0580\u056c\u0576"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0570\u0561\u0566\u0561\u0580"}, 1E4:{other:"00 \u0570\u0561\u0566\u0561\u0580"}, 1E5:{other:"000 \u0570\u0561\u0566\u0561\u0580"}, 1E6:{other:"0 \u0574\u056b\u056c\u056b\u0578\u0576"}, 1E7:{other:"00 \u0574\u056b\u056c\u056b\u0578\u0576"}, 1E8:{other:"000 \u0574\u056b\u056c\u056b\u0578\u0576"}, 1E9:{other:"0 \u0574\u056b\u056c\u056b\u0561\u0580\u0564"}, 
1E10:{other:"00 \u0574\u056b\u056c\u056b\u0561\u0580\u0564"}, 1E11:{other:"000 \u0574\u056b\u056c\u056b\u0561\u0580\u0564"}, 1E12:{other:"0 \u057f\u0580\u056b\u056c\u056b\u0578\u0576"}, 1E13:{other:"00 \u057f\u0580\u056b\u056c\u056b\u0578\u0576"}, 1E14:{other:"000 \u057f\u0580\u056b\u056c\u056b\u0578\u0576"}}};
goog.i18n.CompactNumberFormatSymbols_hy_AM = goog.i18n.CompactNumberFormatSymbols_hy;
goog.i18n.CompactNumberFormatSymbols_id = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"00\u00a0rb"}, 1E5:{other:"000\u00a0rb"}, 1E6:{other:"0\u00a0jt"}, 1E7:{other:"00\u00a0jt"}, 1E8:{other:"000\u00a0jt"}, 1E9:{other:"0\u00a0M"}, 1E10:{other:"00\u00a0M"}, 1E11:{other:"000\u00a0M"}, 1E12:{other:"0\u00a0T"}, 1E13:{other:"00\u00a0T"}, 1E14:{other:"000\u00a0T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 ribu"}, 1E4:{other:"00 ribu"}, 1E5:{other:"000 ribu"}, 1E6:{other:"0 juta"}, 1E7:{other:"00 juta"}, 
1E8:{other:"000 juta"}, 1E9:{other:"0 miliar"}, 1E10:{other:"00 miliar"}, 1E11:{other:"000 miliar"}, 1E12:{other:"0 triliun"}, 1E13:{other:"00 triliun"}, 1E14:{other:"000 triliun"}}};
goog.i18n.CompactNumberFormatSymbols_id_ID = goog.i18n.CompactNumberFormatSymbols_id;
goog.i18n.CompactNumberFormatSymbols_in = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"00\u00a0rb"}, 1E5:{other:"000\u00a0rb"}, 1E6:{other:"0\u00a0jt"}, 1E7:{other:"00\u00a0jt"}, 1E8:{other:"000\u00a0jt"}, 1E9:{other:"0\u00a0M"}, 1E10:{other:"00\u00a0M"}, 1E11:{other:"000\u00a0M"}, 1E12:{other:"0\u00a0T"}, 1E13:{other:"00\u00a0T"}, 1E14:{other:"000\u00a0T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 ribu"}, 1E4:{other:"00 ribu"}, 1E5:{other:"000 ribu"}, 1E6:{other:"0 juta"}, 1E7:{other:"00 juta"}, 
1E8:{other:"000 juta"}, 1E9:{other:"0 miliar"}, 1E10:{other:"00 miliar"}, 1E11:{other:"000 miliar"}, 1E12:{other:"0 triliun"}, 1E13:{other:"00 triliun"}, 1E14:{other:"000 triliun"}}};
goog.i18n.CompactNumberFormatSymbols_is = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u00fe."}, 1E4:{other:"00\u00a0\u00fe."}, 1E5:{other:"000\u00a0\u00fe."}, 1E6:{other:"0\u00a0m."}, 1E7:{other:"00\u00a0m."}, 1E8:{other:"000\u00a0m."}, 1E9:{other:"0\u00a0ma."}, 1E10:{other:"00\u00a0ma."}, 1E11:{other:"000\u00a0ma."}, 1E12:{other:"0\u00a0bn"}, 1E13:{other:"00\u00a0bn"}, 1E14:{other:"000\u00a0bn"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u00fe\u00fasund"}, 1E4:{other:"00 \u00fe\u00fasund"}, 
1E5:{other:"000 \u00fe\u00fasund"}, 1E6:{other:"0 millj\u00f3nir"}, 1E7:{other:"00 millj\u00f3nir"}, 1E8:{other:"000 millj\u00f3nir"}, 1E9:{other:"0 milljar\u00f0ar"}, 1E10:{other:"00 milljar\u00f0ar"}, 1E11:{other:"000 milljar\u00f0ar"}, 1E12:{other:"0 billj\u00f3nir"}, 1E13:{other:"00 billj\u00f3nir"}, 1E14:{other:"000 billj\u00f3nir"}}};
goog.i18n.CompactNumberFormatSymbols_is_IS = goog.i18n.CompactNumberFormatSymbols_is;
goog.i18n.CompactNumberFormatSymbols_it = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"0"}, 1E5:{other:"0"}, 1E6:{other:"0\u00a0Mln"}, 1E7:{other:"00\u00a0Mln"}, 1E8:{other:"000\u00a0Mln"}, 1E9:{other:"0\u00a0Mld"}, 1E10:{other:"00\u00a0Mld"}, 1E11:{other:"000\u00a0Mld"}, 1E12:{other:"0\u00a0Bln"}, 1E13:{other:"00\u00a0Bln"}, 1E14:{other:"000\u00a0Bln"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 migliaia"}, 1E4:{other:"00 migliaia"}, 1E5:{other:"000 migliaia"}, 1E6:{other:"0 milioni"}, 
1E7:{other:"00 milioni"}, 1E8:{other:"000 milioni"}, 1E9:{other:"0 miliardi"}, 1E10:{other:"00 miliardi"}, 1E11:{other:"000 miliardi"}, 1E12:{other:"0 bilioni"}, 1E13:{other:"00 bilioni"}, 1E14:{other:"000 bilioni"}}};
goog.i18n.CompactNumberFormatSymbols_it_IT = goog.i18n.CompactNumberFormatSymbols_it;
goog.i18n.CompactNumberFormatSymbols_it_SM = goog.i18n.CompactNumberFormatSymbols_it;
goog.i18n.CompactNumberFormatSymbols_iw = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"\u200f0\u00a0\u05d0\u05dc\u05e3"}, 1E4:{other:"\u200f00\u00a0\u05d0\u05dc\u05e3"}, 1E5:{other:"\u200f000\u00a0\u05d0\u05dc\u05e3"}, 1E6:{other:"\u200f0\u00a0\u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E7:{other:"\u200f00\u00a0\u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E8:{other:"\u200f000\u00a0\u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 
1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"\u200f0 \u05d0\u05dc\u05e3"}, 1E4:{other:"\u200f00 \u05d0\u05dc\u05e3"}, 1E5:{other:"\u200f000 \u05d0\u05dc\u05e3"}, 1E6:{other:"\u200f0 \u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E7:{other:"\u200f00 \u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E8:{other:"\u200f000 \u05de\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E9:{other:"\u200f0 \u05de\u05d9\u05dc\u05d9\u05d0\u05e8\u05d3"}, 1E10:{other:"\u200f00 \u05de\u05d9\u05dc\u05d9\u05d0\u05e8\u05d3"}, 1E11:{other:"\u200f000 \u05de\u05d9\u05dc\u05d9\u05d0\u05e8\u05d3"}, 
1E12:{other:"\u200f0 \u05d8\u05e8\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E13:{other:"\u200f00 \u05d8\u05e8\u05d9\u05dc\u05d9\u05d5\u05df"}, 1E14:{other:"\u200f000 \u05d8\u05e8\u05d9\u05dc\u05d9\u05d5\u05df"}}};
goog.i18n.CompactNumberFormatSymbols_ja = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u5343"}, 1E4:{other:"0\u4e07"}, 1E5:{other:"00\u4e07"}, 1E6:{other:"000\u4e07"}, 1E7:{other:"0000\u4e07"}, 1E8:{other:"0\u5104"}, 1E9:{other:"00\u5104"}, 1E10:{other:"000\u5104"}, 1E11:{other:"0000\u5104"}, 1E12:{other:"0\u5146"}, 1E13:{other:"00\u5146"}, 1E14:{other:"000\u5146"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0\u5343"}, 1E4:{other:"0\u4e07"}, 1E5:{other:"00\u4e07"}, 1E6:{other:"000\u4e07"}, 1E7:{other:"0000\u4e07"}, 
1E8:{other:"0\u5104"}, 1E9:{other:"00\u5104"}, 1E10:{other:"000\u5104"}, 1E11:{other:"0000\u5104"}, 1E12:{other:"0\u5146"}, 1E13:{other:"00\u5146"}, 1E14:{other:"000\u5146"}}};
goog.i18n.CompactNumberFormatSymbols_ja_JP = goog.i18n.CompactNumberFormatSymbols_ja;
goog.i18n.CompactNumberFormatSymbols_ka = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u10d0\u10d7."}, 1E4:{other:"00\u00a0\u10d0\u10d7."}, 1E5:{other:"000\u00a0\u10d0\u10d7."}, 1E6:{other:"0\u00a0\u10db\u10da\u10dc."}, 1E7:{other:"00\u00a0\u10db\u10da\u10dc."}, 1E8:{other:"000\u00a0\u10db\u10da\u10dc."}, 1E9:{other:"0\u00a0\u10db\u10da\u10e0\u10d3."}, 1E10:{other:"00\u00a0\u10db\u10da\u10e0\u10d3."}, 1E11:{other:"000\u00a0\u10db\u10da\u10e0."}, 1E12:{other:"0\u00a0\u10e2\u10e0\u10da."}, 1E13:{other:"00\u00a0\u10e2\u10e0\u10da."}, 
1E14:{other:"000\u00a0\u10e2\u10e0\u10da."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u10d0\u10d7\u10d0\u10e1\u10d8"}, 1E4:{other:"00 \u10d0\u10d7\u10d0\u10e1\u10d8"}, 1E5:{other:"000 \u10d0\u10d7\u10d0\u10e1\u10d8"}, 1E6:{other:"0 \u10db\u10d8\u10da\u10d8\u10dd\u10dc\u10d8"}, 1E7:{other:"00 \u10db\u10d8\u10da\u10d8\u10dd\u10dc\u10d8"}, 1E8:{other:"000 \u10db\u10d8\u10da\u10d8\u10dd\u10dc\u10d8"}, 1E9:{other:"0 \u10db\u10d8\u10da\u10d8\u10d0\u10e0\u10d3\u10d8"}, 1E10:{other:"00 \u10db\u10d8\u10da\u10d8\u10d0\u10e0\u10d3\u10d8"}, 
1E11:{other:"000 \u10db\u10d8\u10da\u10d8\u10d0\u10e0\u10d3\u10d8"}, 1E12:{other:"0 \u10e2\u10e0\u10d8\u10da\u10d8\u10dd\u10dc\u10d8"}, 1E13:{other:"00 \u10e2\u10e0\u10d8\u10da\u10d8\u10dd\u10dc\u10d8"}, 1E14:{other:"000 \u10e2\u10e0\u10d8\u10da\u10d8\u10dd\u10dc\u10d8"}}};
goog.i18n.CompactNumberFormatSymbols_ka_GE = goog.i18n.CompactNumberFormatSymbols_ka;
goog.i18n.CompactNumberFormatSymbols_kk = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u043c\u044b\u04a3"}, 1E4:{other:"00\u00a0\u043c\u044b\u04a3"}, 1E5:{other:"000\u00a0\u043c\u044b\u04a3"}, 1E6:{other:"0\u00a0\u043c\u043b\u043d"}, 1E7:{other:"00\u00a0\u043c\u043b\u043d"}, 1E8:{other:"000\u00a0\u043c\u043b\u043d"}, 1E9:{other:"0\u00a0\u043c\u043b\u0440\u0434"}, 1E10:{other:"00\u00a0\u043c\u043b\u0440\u0434"}, 1E11:{other:"000\u00a0\u043c\u043b\u0440\u0434"}, 1E12:{other:"0\u00a0\u0442\u0440\u043b\u043d"}, 
1E13:{other:"00\u00a0\u0442\u0440\u043b\u043d"}, 1E14:{other:"000\u00a0\u0442\u0440\u043b\u043d"}}};
goog.i18n.CompactNumberFormatSymbols_kk_Cyrl_KZ = goog.i18n.CompactNumberFormatSymbols_kk;
goog.i18n.CompactNumberFormatSymbols_km = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u1796"}, 1E4:{other:"0\u1798"}, 1E5:{other:"0\u179f"}, 1E6:{other:"0\u179b"}, 1E7:{other:"00\u179b"}, 1E8:{other:"000\u179b"}, 1E9:{other:"0\u1796.\u179b"}, 1E10:{other:"00\u1796.\u179b"}, 1E11:{other:"000\u1796.\u179b"}, 1E12:{other:"0\u179b.\u179b"}, 1E13:{other:"00\u179b.\u179b"}, 1E14:{other:"000\u179b.\u179b"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0\u1796\u17b6\u1793\u17cb"}, 1E4:{other:"0\u1798\u17c9\u17ba\u1793"}, 
1E5:{other:"0\u179f\u17c2\u1793"}, 1E6:{other:"0\u179b\u17b6\u1793"}, 1E7:{other:"00\u179b\u17b6\u1793"}, 1E8:{other:"000\u179b\u17b6\u1793"}, 1E9:{other:"0\u1796\u17b6\u1793\u17cb\u179b\u17b6\u1793"}, 1E10:{other:"00\u1796\u17b6\u1793\u17cb\u179b\u17b6\u1793"}, 1E11:{other:"000\u1796\u17b6\u1793\u17cb\u179b\u17b6\u1793"}, 1E12:{other:"0\u179b\u17b6\u1793\u179b\u17b6\u1793"}, 1E13:{other:"00\u179b\u17b6\u1793\u179b\u17b6\u1793"}, 1E14:{other:"000\u179b\u17b6\u1793\u179b\u17b6\u1793"}}};
goog.i18n.CompactNumberFormatSymbols_km_KH = goog.i18n.CompactNumberFormatSymbols_km;
goog.i18n.CompactNumberFormatSymbols_kn = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0cb8\u0cbe\u0cb5\u0cbf\u0cb0"}, 1E4:{other:"00 \u0cb8\u0cbe\u0cb5\u0cbf\u0cb0"}, 1E5:{other:"000 \u0cb8\u0cbe\u0cb5\u0cbf\u0cb0"}, 1E6:{other:"0 \u0cae\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd"}, 
1E7:{other:"00 \u0cae\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd"}, 1E8:{other:"000 \u0cae\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd"}, 1E9:{other:"0 \u0cac\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd"}, 1E10:{other:"00 \u0cac\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd"}, 1E11:{other:"000 \u0cac\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd"}, 1E12:{other:"0 \u0c9f\u0ccd\u0cb0\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd\u200c"}, 1E13:{other:"00 \u0c9f\u0ccd\u0cb0\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd\u200c"}, 1E14:{other:"000 \u0c9f\u0ccd\u0cb0\u0cbf\u0cb2\u0cbf\u0caf\u0ca8\u0ccd\u200c"}}};
goog.i18n.CompactNumberFormatSymbols_kn_IN = goog.i18n.CompactNumberFormatSymbols_kn;
goog.i18n.CompactNumberFormatSymbols_ko = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0000"}, 1E4:{other:"0\ub9cc"}, 1E5:{other:"00\ub9cc"}, 1E6:{other:"000\ub9cc"}, 1E7:{other:"0000\ub9cc"}, 1E8:{other:"0\uc5b5"}, 1E9:{other:"00\uc5b5"}, 1E10:{other:"000\uc5b5"}, 1E11:{other:"0000\uc5b5"}, 1E12:{other:"0\uc870"}, 1E13:{other:"00\uc870"}, 1E14:{other:"000\uc870"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0000"}, 1E4:{other:"0\ub9cc"}, 1E5:{other:"00\ub9cc"}, 1E6:{other:"000\ub9cc"}, 1E7:{other:"0000\ub9cc"}, 
1E8:{other:"0\uc5b5"}, 1E9:{other:"00\uc5b5"}, 1E10:{other:"000\uc5b5"}, 1E11:{other:"0000\uc5b5"}, 1E12:{other:"0\uc870"}, 1E13:{other:"00\uc870"}, 1E14:{other:"000\uc870"}}};
goog.i18n.CompactNumberFormatSymbols_ko_KR = goog.i18n.CompactNumberFormatSymbols_ko;
goog.i18n.CompactNumberFormatSymbols_ky = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u043c\u0438\u04ca"}, 1E4:{other:"00\u00a0\u043c\u0438\u04ca"}, 1E5:{other:"000\u00a0\u043c\u0438\u04ca"}, 1E6:{other:"0\u00a0\u043c\u043b\u043d"}, 1E7:{other:"00\u00a0\u043c\u043b\u043d"}, 1E8:{other:"000\u00a0\u043c\u043b\u043d"}, 1E9:{other:"0\u00a0\u043c\u043b\u0434"}, 1E10:{other:"00\u00a0\u043c\u043b\u0434"}, 1E11:{other:"000\u00a0\u043c\u043b\u0434"}, 1E12:{other:"0\u00a0\u0442\u0440\u043d"}, 1E13:{other:"00\u00a0\u0442\u0440\u043d"}, 
1E14:{other:"000\u00a0\u0442\u0440\u043d"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u043c\u0438\u04ca"}, 1E4:{other:"00 \u043c\u0438\u04ca"}, 1E5:{other:"000 \u043c\u0438\u04ca"}, 1E6:{other:"0 \u043c\u0438\u043b\u043b\u0438\u043e\u043d"}, 1E7:{other:"00 \u043c\u0438\u043b\u043b\u0438\u043e\u043d"}, 1E8:{other:"000 \u043c\u0438\u043b\u043b\u0438\u043e\u043d"}, 1E9:{other:"0 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434"}, 1E10:{other:"00 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434"}, 
1E11:{other:"000 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434"}, 1E12:{other:"0 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d"}, 1E13:{other:"00 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d"}, 1E14:{other:"000 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d"}}};
goog.i18n.CompactNumberFormatSymbols_ky_Cyrl_KG = goog.i18n.CompactNumberFormatSymbols_ky;
goog.i18n.CompactNumberFormatSymbols_ln = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_ln_CD = goog.i18n.CompactNumberFormatSymbols_ln;
goog.i18n.CompactNumberFormatSymbols_lo = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u0e9e\u0eb1\u0e99"}, 1E4:{other:"00\u0e9e\u0eb1\u0e99"}, 1E5:{other:"000\u0e9e\u0eb1\u0e99"}, 1E6:{other:"0\u0ea5\u0ec9\u0eb2\u0e99"}, 1E7:{other:"00\u0ea5\u0ec9\u0eb2\u0e99"}, 1E8:{other:"000\u0ea5\u0ec9\u0eb2\u0e99"}, 1E9:{other:"0\u0e95\u0eb7\u0ec9"}, 1E10:{other:"00\u0e95\u0eb7\u0ec9"}, 1E11:{other:"000\u0e95\u0eb7\u0ec9"}, 1E12:{other:"0000\u0e95\u0eb7\u0ec9"}, 1E13:{other:"00\u0e9e\u0eb1\u0e99\u0e95\u0eb7\u0ec9"}, 
1E14:{other:"000\u0e9e\u0eb1\u0e99\u0e95\u0eb7\u0ec9"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0\u0e9e\u0eb1\u0e99"}, 1E4:{other:"00\u0e9e\u0eb1\u0e99"}, 1E5:{other:"000\u0e9e\u0eb1\u0e99"}, 1E6:{other:"0\u0ea5\u0ec9\u0eb2\u0e99"}, 1E7:{other:"00\u0ea5\u0ec9\u0eb2\u0e99"}, 1E8:{other:"000\u0ea5\u0ec9\u0eb2\u0e99"}, 1E9:{other:"0\u0e9e\u0eb1\u0e99\u0ea5\u0ec9\u0eb2\u0e99"}, 1E10:{other:"00\u0e9e\u0eb1\u0e99\u0ea5\u0ec9\u0eb2\u0e99"}, 1E11:{other:"000\u0e9e\u0eb1\u0e99\u0ea5\u0ec9\u0eb2\u0e99"}, 
1E12:{other:"0000\u0e9e\u0eb1\u0e99\u0ea5\u0ec9\u0eb2\u0e99"}, 1E13:{other:"00\u0ea5\u0ec9\u0eb2\u0e99\u0ea5\u0ec9\u0eb2\u0e99"}, 1E14:{other:"000\u0ea5\u0ec9\u0eb2\u0e99\u0ea5\u0ec9\u0eb2\u0e99"}}};
goog.i18n.CompactNumberFormatSymbols_lo_LA = goog.i18n.CompactNumberFormatSymbols_lo;
goog.i18n.CompactNumberFormatSymbols_lt = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0t\u016bkst."}, 1E4:{other:"00\u00a0t\u016bkst."}, 1E5:{other:"000\u00a0t\u016bkst."}, 1E6:{other:"0\u00a0mln."}, 1E7:{other:"00\u00a0mln."}, 1E8:{other:"000\u00a0mln."}, 1E9:{other:"0\u00a0mlrd."}, 1E10:{other:"00\u00a0mlrd."}, 1E11:{other:"000\u00a0mlrd."}, 1E12:{other:"0\u00a0trln."}, 1E13:{other:"00\u00a0trln."}, 1E14:{other:"000\u00a0trln."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 t\u016bkstan\u010di\u0173"}, 
1E4:{other:"00 t\u016bkstan\u010di\u0173"}, 1E5:{other:"000 t\u016bkstan\u010di\u0173"}, 1E6:{other:"0 milijon\u0173"}, 1E7:{other:"00 milijon\u0173"}, 1E8:{other:"000 milijon\u0173"}, 1E9:{other:"0 milijard\u0173"}, 1E10:{other:"00 milijard\u0173"}, 1E11:{other:"000 milijard\u0173"}, 1E12:{other:"0 trilijon\u0173"}, 1E13:{other:"00 trilijon\u0173"}, 1E14:{other:"000 trilijon\u0173"}}};
goog.i18n.CompactNumberFormatSymbols_lt_LT = goog.i18n.CompactNumberFormatSymbols_lt;
goog.i18n.CompactNumberFormatSymbols_lv = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0t\u016bkst."}, 1E4:{other:"00\u00a0t\u016bkst."}, 1E5:{other:"000\u00a0t\u016bkst."}, 1E6:{other:"0\u00a0milj."}, 1E7:{other:"00\u00a0milj."}, 1E8:{other:"000\u00a0milj."}, 1E9:{other:"0\u00a0mljrd."}, 1E10:{other:"00\u00a0mljrd."}, 1E11:{other:"000\u00a0mljrd."}, 1E12:{other:"0\u00a0trilj."}, 1E13:{other:"00\u00a0trilj."}, 1E14:{other:"000\u00a0trilj."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 t\u016bksto\u0161i"}, 
1E4:{other:"00 t\u016bksto\u0161i"}, 1E5:{other:"000 t\u016bksto\u0161i"}, 1E6:{other:"0 miljoni"}, 1E7:{other:"00 miljoni"}, 1E8:{other:"000 miljoni"}, 1E9:{other:"0 miljardi"}, 1E10:{other:"00 miljardi"}, 1E11:{other:"000 miljardi"}, 1E12:{other:"0 triljoni"}, 1E13:{other:"00 triljoni"}, 1E14:{other:"000 triljoni"}}};
goog.i18n.CompactNumberFormatSymbols_lv_LV = goog.i18n.CompactNumberFormatSymbols_lv;
goog.i18n.CompactNumberFormatSymbols_mk = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0438\u043b\u0458."}, 1E4:{other:"00\u00a0\u0438\u043b\u0458."}, 1E5:{other:"000\u00a0\u0438\u043b\u0458."}, 1E6:{other:"0\u00a0\u043c\u0438\u043b."}, 1E7:{other:"00\u00a0\u043c\u0438\u043b."}, 1E8:{other:"000\u00a0\u043c\u0438\u043b."}, 1E9:{other:"0\u00a0\u043c\u0438\u043b\u0458."}, 1E10:{other:"00\u00a0\u043c\u0438\u043b\u0458."}, 1E11:{other:"000\u00a0\u043c\u0438\u043b\u0458."}, 1E12:{other:"0\u00a0\u0442\u0440\u0438\u043b."}, 
1E13:{other:"00\u00a0\u0442\u0440\u0438\u043b."}, 1E14:{other:"000\u00a0\u0442\u0440\u0438\u043b."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0438\u043b\u0458\u0430\u0434\u0438"}, 1E4:{other:"00 \u0438\u043b\u0458\u0430\u0434\u0438"}, 1E5:{other:"000 \u0438\u043b\u0458\u0430\u0434\u0438"}, 1E6:{other:"0 \u043c\u0438\u043b\u0438\u043e\u043d\u0438"}, 1E7:{other:"00 \u043c\u0438\u043b\u0438\u043e\u043d\u0438"}, 1E8:{other:"000 \u043c\u0438\u043b\u0438\u043e\u043d\u0438"}, 1E9:{other:"0 \u043c\u0438\u043b\u0438\u0458\u0430\u0440\u0434\u0438"}, 
1E10:{other:"00 \u043c\u0438\u043b\u0438\u0458\u0430\u0440\u0434\u0438"}, 1E11:{other:"000 \u043c\u0438\u043b\u0438\u0458\u0430\u0440\u0434\u0438"}, 1E12:{other:"0 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0438"}, 1E13:{other:"00 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0438"}, 1E14:{other:"000 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0438"}}};
goog.i18n.CompactNumberFormatSymbols_mk_MK = goog.i18n.CompactNumberFormatSymbols_mk;
goog.i18n.CompactNumberFormatSymbols_ml = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0d06\u0d2f\u0d3f\u0d30\u0d02"}, 1E4:{other:"00 \u0d06\u0d2f\u0d3f\u0d30\u0d02"}, 1E5:{other:"000 \u0d06\u0d2f\u0d3f\u0d30\u0d02"}, 1E6:{other:"0 \u0d26\u0d36\u0d32\u0d15\u0d4d\u0d37\u0d02"}, 
1E7:{other:"00 \u0d26\u0d36\u0d32\u0d15\u0d4d\u0d37\u0d02"}, 1E8:{other:"000 \u0d26\u0d36\u0d32\u0d15\u0d4d\u0d37\u0d02"}, 1E9:{other:"0 \u0d32\u0d15\u0d4d\u0d37\u0d02 \u0d15\u0d4b\u0d1f\u0d3f"}, 1E10:{other:"00 \u0d32\u0d15\u0d4d\u0d37\u0d02 \u0d15\u0d4b\u0d1f\u0d3f"}, 1E11:{other:"000 \u0d32\u0d15\u0d4d\u0d37\u0d02 \u0d15\u0d4b\u0d1f\u0d3f"}, 1E12:{other:"0 \u0d1f\u0d4d\u0d30\u0d3f\u0d32\u0d4d\u0d2f\u0d7a"}, 1E13:{other:"00 \u0d1f\u0d4d\u0d30\u0d3f\u0d32\u0d4d\u0d2f\u0d7a"}, 1E14:{other:"000 \u0d1f\u0d4d\u0d30\u0d3f\u0d32\u0d4d\u0d2f\u0d7a"}}};
goog.i18n.CompactNumberFormatSymbols_ml_IN = goog.i18n.CompactNumberFormatSymbols_ml;
goog.i18n.CompactNumberFormatSymbols_mn = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u043c\u044f\u043d\u0433\u0430"}, 1E4:{other:"00\u00a0\u043c\u044f\u043d\u0433\u0430"}, 1E5:{other:"000\u00a0\u043c\u044f\u043d\u0433\u0430"}, 1E6:{other:"0\u00a0\u0441\u0430\u044f"}, 1E7:{other:"00\u00a0\u0441\u0430\u044f"}, 1E8:{other:"000\u00a0\u0441\u0430\u044f"}, 1E9:{other:"0\u00a0\u0442\u044d\u0440\u0431\u0443\u043c"}, 1E10:{other:"00\u00a0\u0442\u044d\u0440\u0431\u0443\u043c"}, 1E11:{other:"000B"}, 
1E12:{other:"0\u00a0\u0438\u0445\u00a0\u043d\u0430\u044f\u0434"}, 1E13:{other:"00\u0438\u0445\u00a0\u043d\u0430\u044f\u0434"}, 1E14:{other:"000\u0418\u041d"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u043c\u044f\u043d\u0433\u0430"}, 1E4:{other:"00 \u043c\u044f\u043d\u0433\u0430"}, 1E5:{other:"000 \u043c\u044f\u043d\u0433\u0430"}, 1E6:{other:"0 \u0441\u0430\u044f"}, 1E7:{other:"00 \u0441\u0430\u044f"}, 1E8:{other:"000 \u0441\u0430\u044f"}, 1E9:{other:"0 \u0442\u044d\u0440\u0431\u0443\u043c"}, 
1E10:{other:"00 \u0442\u044d\u0440\u0431\u0443\u043c"}, 1E11:{other:"000 \u0442\u044d\u0440\u0431\u0443\u043c"}, 1E12:{other:"0 \u0438\u0445 \u043d\u0430\u044f\u0434"}, 1E13:{other:"00 \u0438\u0445 \u043d\u0430\u044f\u0434"}, 1E14:{other:"000 \u0438\u0445 \u043d\u0430\u044f\u0434"}}};
goog.i18n.CompactNumberFormatSymbols_mn_Cyrl_MN = goog.i18n.CompactNumberFormatSymbols_mn;
goog.i18n.CompactNumberFormatSymbols_mr = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0939\u091c\u093e\u0930"}, 1E4:{other:"00 \u0939\u091c\u093e\u0930"}, 1E5:{other:"000 \u0939\u091c\u093e\u0930"}, 1E6:{other:"0 \u0926\u0936\u0932\u0915\u094d\u0937"}, 
1E7:{other:"00 \u0926\u0936\u0932\u0915\u094d\u0937"}, 1E8:{other:"000 \u0926\u0936\u0932\u0915\u094d\u0937"}, 1E9:{other:"0 \u092e\u0939\u093e\u092a\u0926\u094d\u092e"}, 1E10:{other:"00 \u092e\u0939\u093e\u092a\u0926\u094d\u092e"}, 1E11:{other:"000 \u092e\u0939\u093e\u092a\u0926\u094d\u092e"}, 1E12:{other:"0 \u0916\u0930\u092c"}, 1E13:{other:"00 \u0916\u0930\u092c"}, 1E14:{other:"000 \u0916\u0930\u092c"}}};
goog.i18n.CompactNumberFormatSymbols_mr_IN = goog.i18n.CompactNumberFormatSymbols_mr;
goog.i18n.CompactNumberFormatSymbols_ms = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0J"}, 1E7:{other:"00J"}, 1E8:{other:"000J"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 ribu"}, 1E4:{other:"00 ribu"}, 1E5:{other:"000 ribu"}, 1E6:{other:"0 juta"}, 1E7:{other:"00 juta"}, 1E8:{other:"000 juta"}, 1E9:{other:"0 bilion"}, 1E10:{other:"00 bilion"}, 
1E11:{other:"000 bilion"}, 1E12:{other:"0 trilion"}, 1E13:{other:"00 trilion"}, 1E14:{other:"000 trilion"}}};
goog.i18n.CompactNumberFormatSymbols_ms_Latn_MY = goog.i18n.CompactNumberFormatSymbols_ms;
goog.i18n.CompactNumberFormatSymbols_mt = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_mt_MT = goog.i18n.CompactNumberFormatSymbols_mt;
goog.i18n.CompactNumberFormatSymbols_my = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u1011\u1031\u102c\u1004\u103a"}, 1E4:{other:"0\u101e\u1031\u102c\u1004\u103a\u1038"}, 1E5:{other:"0\u101e\u102d\u1014\u103a\u1038"}, 1E6:{other:"0\u101e\u1014\u103a\u1038"}, 1E7:{other:"0\u1000\u102f\u100b\u1031"}, 1E8:{other:"00\u1000\u102f\u100b\u1031"}, 1E9:{other:"\u1000\u102f\u100b\u1031000"}, 1E10:{other:"\u1000\u102f\u100b\u10310000"}, 1E11:{other:"0000\u1000\u102f\u100b\u1031"}, 1E12:{other:"\u1000\u102f\u100b\u10310\u101e\u102d\u1014\u103a\u1038"}, 
1E13:{other:"\u1000\u102f\u100b\u10310\u101e\u1014\u103a\u1038"}, 1E14:{other:"0\u1000\u1031\u102c\u100b\u102d"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0\u1011\u1031\u102c\u1004\u103a"}, 1E4:{other:"0\u101e\u1031\u102c\u1004\u103a\u1038"}, 1E5:{other:"0\u101e\u102d\u1014\u103a\u1038"}, 1E6:{other:"0\u101e\u1014\u103a\u1038"}, 1E7:{other:"0\u1000\u102f\u100b\u1031"}, 1E8:{other:"00\u1000\u102f\u100b\u1031"}, 1E9:{other:"000\u1000\u102f\u100b\u1031"}, 1E10:{other:"0000\u1000\u102f\u100b\u1031"}, 
1E11:{other:"00000\u1000\u102f\u100b\u1031"}, 1E12:{other:"000000\u1000\u102f\u100b\u1031"}, 1E13:{other:"0000000\u1000\u102f\u100b\u1031"}, 1E14:{other:"0\u1000\u1031\u102c\u100b\u102d"}}};
goog.i18n.CompactNumberFormatSymbols_my_MM = goog.i18n.CompactNumberFormatSymbols_my;
goog.i18n.CompactNumberFormatSymbols_nb = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0K"}, 1E4:{other:"00\u00a0K"}, 1E5:{other:"000\u00a0K"}, 1E6:{other:"0\u00a0mill"}, 1E7:{other:"00\u00a0mill"}, 1E8:{other:"000\u00a0mill"}, 1E9:{other:"0\u00a0mrd"}, 1E10:{other:"00\u00a0mrd"}, 1E11:{other:"000\u00a0mrd"}, 1E12:{other:"0\u00a0bill"}, 1E13:{other:"00\u00a0bill"}, 1E14:{other:"000\u00a0bill"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tusen"}, 1E4:{other:"00 tusen"}, 1E5:{other:"000 tusen"}, 
1E6:{other:"0 millioner"}, 1E7:{other:"00 millioner"}, 1E8:{other:"000 millioner"}, 1E9:{other:"0 milliarder"}, 1E10:{other:"00 milliarder"}, 1E11:{other:"000 milliarder"}, 1E12:{other:"0 billioner"}, 1E13:{other:"00 billioner"}, 1E14:{other:"000 billioner"}}};
goog.i18n.CompactNumberFormatSymbols_nb_NO = goog.i18n.CompactNumberFormatSymbols_nb;
goog.i18n.CompactNumberFormatSymbols_nb_SJ = goog.i18n.CompactNumberFormatSymbols_nb;
goog.i18n.CompactNumberFormatSymbols_ne = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0939\u091c\u093e\u0930"}, 1E4:{other:"00\u00a0\u0939\u091c\u093e\u0930"}, 1E5:{other:"0\u00a0\u0932\u093e\u0916"}, 1E6:{other:"00\u00a0\u0932\u093e\u0916"}, 1E7:{other:"0\u00a0\u0915\u0930\u094b\u0921"}, 1E8:{other:"00\u00a0\u0915\u0930\u094b\u0921"}, 1E9:{other:"0\u00a0\u0905\u0930\u092c"}, 1E10:{other:"00\u00a0\u0905\u0930\u092c"}, 1E11:{other:"0\u00a0\u0916\u0930\u092c"}, 1E12:{other:"00\u00a0\u0916\u0930\u092c"}, 
1E13:{other:"0\u00a0\u0936\u0902\u0916"}, 1E14:{other:"00\u00a0\u0936\u0902\u0916"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0939\u091c\u093e\u0930"}, 1E4:{other:"00 \u0939\u091c\u093e\u0930"}, 1E5:{other:"0 \u0932\u093e\u0916"}, 1E6:{other:"0 \u0915\u0930\u094b\u0921"}, 1E7:{other:"00 \u0915\u0930\u094b\u0921"}, 1E8:{other:"000 \u0915\u0930\u094b\u0921"}, 1E9:{other:"0 \u0905\u0930\u094d\u092c"}, 1E10:{other:"00 \u0905\u0930\u094d\u092c"}, 1E11:{other:"0 \u0916\u0930\u092c"}, 1E12:{other:"0T"}, 
1E13:{other:"0 \u0936\u0902\u0916"}, 1E14:{other:"00 \u0936\u0902\u0916"}}};
goog.i18n.CompactNumberFormatSymbols_ne_NP = goog.i18n.CompactNumberFormatSymbols_ne;
goog.i18n.CompactNumberFormatSymbols_nl = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0\u00a0mln."}, 1E7:{other:"00\u00a0mln."}, 1E8:{other:"000\u00a0mln."}, 1E9:{other:"0\u00a0mld."}, 1E10:{other:"00\u00a0mld."}, 1E11:{other:"000\u00a0mld."}, 1E12:{other:"0\u00a0bln."}, 1E13:{other:"00\u00a0bln."}, 1E14:{other:"000\u00a0bln."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 duizend"}, 1E4:{other:"00 duizend"}, 1E5:{other:"000 duizend"}, 1E6:{other:"0 miljoen"}, 
1E7:{other:"00 miljoen"}, 1E8:{other:"000 miljoen"}, 1E9:{other:"0 miljard"}, 1E10:{other:"00 miljard"}, 1E11:{other:"000 miljard"}, 1E12:{other:"0 biljoen"}, 1E13:{other:"00 biljoen"}, 1E14:{other:"000 biljoen"}}};
goog.i18n.CompactNumberFormatSymbols_nl_NL = goog.i18n.CompactNumberFormatSymbols_nl;
goog.i18n.CompactNumberFormatSymbols_no = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0K"}, 1E4:{other:"00\u00a0K"}, 1E5:{other:"000\u00a0K"}, 1E6:{other:"0\u00a0mill"}, 1E7:{other:"00\u00a0mill"}, 1E8:{other:"000\u00a0mill"}, 1E9:{other:"0\u00a0mrd"}, 1E10:{other:"00\u00a0mrd"}, 1E11:{other:"000\u00a0mrd"}, 1E12:{other:"0\u00a0bill"}, 1E13:{other:"00\u00a0bill"}, 1E14:{other:"000\u00a0bill"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tusen"}, 1E4:{other:"00 tusen"}, 1E5:{other:"000 tusen"}, 
1E6:{other:"0 millioner"}, 1E7:{other:"00 millioner"}, 1E8:{other:"000 millioner"}, 1E9:{other:"0 milliarder"}, 1E10:{other:"00 milliarder"}, 1E11:{other:"000 milliarder"}, 1E12:{other:"0 billioner"}, 1E13:{other:"00 billioner"}, 1E14:{other:"000 billioner"}}};
goog.i18n.CompactNumberFormatSymbols_no_NO = goog.i18n.CompactNumberFormatSymbols_no;
goog.i18n.CompactNumberFormatSymbols_or = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0G"}, 1E10:{other:"00G"}, 1E11:{other:"000G"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_or_IN = goog.i18n.CompactNumberFormatSymbols_or;
goog.i18n.CompactNumberFormatSymbols_pa = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0a39\u0a1c\u0a3c\u0a3e\u0a30"}, 1E4:{other:"00\u00a0\u0a39\u0a1c\u0a3c\u0a3e\u0a30"}, 1E5:{other:"0\u00a0\u0a32\u0a71\u0a16"}, 1E6:{other:"00\u00a0\u0a32\u0a71\u0a16"}, 1E7:{other:"0\u00a0\u0a15\u0a30\u0a4b\u0a5c"}, 1E8:{other:"00\u00a0\u0a15\u0a30\u0a4b\u0a5c"}, 1E9:{other:"0\u00a0\u0a05\u0a30\u0a2c"}, 1E10:{other:"00\u00a0\u0a05\u0a30\u0a2c"}, 1E11:{other:"0\u00a0\u0a16\u0a30\u0a2c"}, 1E12:{other:"00\u00a0\u0a16\u0a30\u0a2c"}, 
1E13:{other:"0\u00a0\u0a28\u0a40\u0a32"}, 1E14:{other:"00\u00a0\u0a28\u0a40\u0a32"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0a39\u0a1c\u0a3c\u0a3e\u0a30"}, 1E4:{other:"00 \u0a39\u0a1c\u0a3c\u0a3e\u0a30"}, 1E5:{other:"0 \u0a32\u0a71\u0a16"}, 1E6:{other:"00 \u0a32\u0a71\u0a16"}, 1E7:{other:"0 \u0a15\u0a30\u0a4b\u0a5c"}, 1E8:{other:"00 \u0a15\u0a30\u0a4b\u0a5c"}, 1E9:{other:"0 \u0a05\u0a30\u0a2c"}, 1E10:{other:"00 \u0a05\u0a30\u0a2c"}, 1E11:{other:"0 \u0a16\u0a30\u0a2c"}, 1E12:{other:"00 \u0a16\u0a30\u0a2c"}, 
1E13:{other:"0 \u0a28\u0a40\u0a32"}, 1E14:{other:"00 \u0a28\u0a40\u0a32"}}};
goog.i18n.CompactNumberFormatSymbols_pa_Guru_IN = goog.i18n.CompactNumberFormatSymbols_pa;
goog.i18n.CompactNumberFormatSymbols_pl = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tys."}, 1E4:{other:"00\u00a0tys."}, 1E5:{other:"000\u00a0tys."}, 1E6:{other:"0\u00a0mln"}, 1E7:{other:"00\u00a0mln"}, 1E8:{other:"000\u00a0mln"}, 1E9:{other:"0\u00a0mld"}, 1E10:{other:"00\u00a0mld"}, 1E11:{other:"000\u00a0mld"}, 1E12:{other:"0\u00a0bln"}, 1E13:{other:"00\u00a0bln"}, 1E14:{other:"000\u00a0bln"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tysi\u0105ca"}, 1E4:{other:"00 tysi\u0105ca"}, 1E5:{other:"000 tysi\u0105ca"}, 
1E6:{other:"0 miliona"}, 1E7:{other:"00 miliona"}, 1E8:{other:"000 miliona"}, 1E9:{other:"0 miliarda"}, 1E10:{other:"00 miliarda"}, 1E11:{other:"000 miliarda"}, 1E12:{other:"0 biliona"}, 1E13:{other:"00 biliona"}, 1E14:{other:"000 biliona"}}};
goog.i18n.CompactNumberFormatSymbols_pl_PL = goog.i18n.CompactNumberFormatSymbols_pl;
goog.i18n.CompactNumberFormatSymbols_pt = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0mil"}, 1E4:{other:"00\u00a0mil"}, 1E5:{other:"000\u00a0mil"}, 1E6:{other:"0\u00a0mi"}, 1E7:{other:"00\u00a0mi"}, 1E8:{other:"000\u00a0mi"}, 1E9:{other:"0\u00a0bi"}, 1E10:{other:"00\u00a0bi"}, 1E11:{other:"000\u00a0bi"}, 1E12:{other:"0\u00a0tri"}, 1E13:{other:"00\u00a0tri"}, 1E14:{other:"000\u00a0tri"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mil"}, 1E4:{other:"00 mil"}, 1E5:{other:"000 mil"}, 1E6:{other:"0 milh\u00f5es"}, 
1E7:{other:"00 milh\u00f5es"}, 1E8:{other:"000 milh\u00f5es"}, 1E9:{other:"0 bilh\u00f5es"}, 1E10:{other:"00 bilh\u00f5es"}, 1E11:{other:"000 bilh\u00f5es"}, 1E12:{other:"0 trilh\u00f5es"}, 1E13:{other:"00 trilh\u00f5es"}, 1E14:{other:"000 trilh\u00f5es"}}};
goog.i18n.CompactNumberFormatSymbols_pt_BR = goog.i18n.CompactNumberFormatSymbols_pt;
goog.i18n.CompactNumberFormatSymbols_pt_PT = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0mil"}, 1E4:{other:"00\u00a0mil"}, 1E5:{other:"000\u00a0mil"}, 1E6:{other:"0\u00a0M"}, 1E7:{other:"00\u00a0M"}, 1E8:{other:"000\u00a0M"}, 1E9:{other:"0\u00a0MM"}, 1E10:{other:"00\u00a0MM"}, 1E11:{other:"000\u00a0MM"}, 1E12:{other:"0\u00a0Bi"}, 1E13:{other:"00\u00a0Bi"}, 1E14:{other:"000\u00a0Bi"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mil"}, 1E4:{other:"00 mil"}, 1E5:{other:"000 mil"}, 1E6:{other:"0 milh\u00f5es"}, 
1E7:{other:"00 milh\u00f5es"}, 1E8:{other:"000 milh\u00f5es"}, 1E9:{other:"0 mil milh\u00f5es"}, 1E10:{other:"00 mil milh\u00f5es"}, 1E11:{other:"000 mil milh\u00f5es"}, 1E12:{other:"0 bili\u00f5es"}, 1E13:{other:"00 bili\u00f5es"}, 1E14:{other:"000 bili\u00f5es"}}};
goog.i18n.CompactNumberFormatSymbols_ro = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0K"}, 1E4:{other:"00\u00a0K"}, 1E5:{other:"000\u00a0K"}, 1E6:{other:"0\u00a0mil."}, 1E7:{other:"00\u00a0mil."}, 1E8:{other:"000\u00a0mil."}, 1E9:{other:"0\u00a0mld."}, 1E10:{other:"00\u00a0mld."}, 1E11:{other:"000\u00a0mld."}, 1E12:{other:"0\u00a0tril."}, 1E13:{other:"00\u00a0tril."}, 1E14:{other:"000\u00a0tril."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 de mii"}, 1E4:{other:"00 de mii"}, 1E5:{other:"000 de mii"}, 
1E6:{other:"0 de milioane"}, 1E7:{other:"00 de milioane"}, 1E8:{other:"000 de milioane"}, 1E9:{other:"0 de miliarde"}, 1E10:{other:"00 de miliarde"}, 1E11:{other:"000 de miliarde"}, 1E12:{other:"0 de trilioane"}, 1E13:{other:"00 de trilioane"}, 1E14:{other:"000 de trilioane"}}};
goog.i18n.CompactNumberFormatSymbols_ro_RO = goog.i18n.CompactNumberFormatSymbols_ro;
goog.i18n.CompactNumberFormatSymbols_ru = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0442\u044b\u0441."}, 1E4:{other:"00\u00a0\u0442\u044b\u0441."}, 1E5:{other:"000\u00a0\u0442\u044b\u0441."}, 1E6:{other:"0\u00a0\u043c\u043b\u043d"}, 1E7:{other:"00\u00a0\u043c\u043b\u043d"}, 1E8:{other:"000\u00a0\u043c\u043b\u043d"}, 1E9:{other:"0\u00a0\u043c\u043b\u0440\u0434"}, 1E10:{other:"00\u00a0\u043c\u043b\u0440\u0434"}, 1E11:{other:"000\u00a0\u043c\u043b\u0440\u0434"}, 1E12:{other:"0\u00a0\u0442\u0440\u043b\u043d"}, 
1E13:{other:"00\u00a0\u0442\u0440\u043b\u043d"}, 1E14:{other:"000\u00a0\u0442\u0440\u043b\u043d"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0442\u044b\u0441\u044f\u0447\u0438"}, 1E4:{other:"00 \u0442\u044b\u0441\u044f\u0447\u0438"}, 1E5:{other:"000 \u0442\u044b\u0441\u044f\u0447\u0438"}, 1E6:{other:"0 \u043c\u0438\u043b\u043b\u0438\u043e\u043d\u0430"}, 1E7:{other:"00 \u043c\u0438\u043b\u043b\u0438\u043e\u043d\u0430"}, 1E8:{other:"000 \u043c\u0438\u043b\u043b\u0438\u043e\u043d\u0430"}, 1E9:{other:"0 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434\u0430"}, 
1E10:{other:"00 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434\u0430"}, 1E11:{other:"000 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434\u0430"}, 1E12:{other:"0 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d\u0430"}, 1E13:{other:"00 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d\u0430"}, 1E14:{other:"000 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d\u0430"}}};
goog.i18n.CompactNumberFormatSymbols_ru_RU = goog.i18n.CompactNumberFormatSymbols_ru;
goog.i18n.CompactNumberFormatSymbols_si = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"\u0db8\u0dd20"}, 1E7:{other:"\u0db8\u0dd200"}, 1E8:{other:"\u0db8\u0dd2000"}, 1E9:{other:"\u0db6\u0dd20"}, 1E10:{other:"\u0db6\u0dd200"}, 1E11:{other:"\u0db6\u0dd2000"}, 1E12:{other:"\u0da7\u0dca\u200d\u0dbb\u0dd20"}, 1E13:{other:"\u0da7\u0dca\u200d\u0dbb\u0dd200"}, 1E14:{other:"\u0da7\u0dca\u200d\u0dbb\u0dd2000"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0K"}, 
1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"\u0db8\u0dd2\u0dbd\u0dd2\u0dba\u0db1 0"}, 1E7:{other:"\u0db8\u0dd2\u0dbd\u0dd2\u0dba\u0db1 00"}, 1E8:{other:"\u0db8\u0dd2\u0dbd\u0dd2\u0dba\u0db1 000"}, 1E9:{other:"\u0db6\u0dd2\u0dbd\u0dd2\u0dba\u0db1 0"}, 1E10:{other:"\u0db6\u0dd2\u0dbd\u0dd2\u0dba\u0db1 00"}, 1E11:{other:"\u0db6\u0dd2\u0dbd\u0dd2\u0dba\u0db1 000"}, 1E12:{other:"\u0da7\u0dca\u200d\u0dbb\u0dd2\u0dbd\u0dd2\u0dba\u0db1 0"}, 1E13:{other:"\u0da7\u0dca\u200d\u0dbb\u0dd2\u0dbd\u0dd2\u0dba\u0db1 00"}, 
1E14:{other:"\u0da7\u0dca\u200d\u0dbb\u0dd2\u0dbd\u0dd2\u0dba\u0db1 000"}}};
goog.i18n.CompactNumberFormatSymbols_si_LK = goog.i18n.CompactNumberFormatSymbols_si;
goog.i18n.CompactNumberFormatSymbols_sk = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tis."}, 1E4:{other:"00\u00a0tis."}, 1E5:{other:"000\u00a0tis."}, 1E6:{other:"0\u00a0mil."}, 1E7:{other:"00\u00a0mil."}, 1E8:{other:"000\u00a0mil."}, 1E9:{other:"0\u00a0mld."}, 1E10:{other:"00\u00a0mld."}, 1E11:{other:"000\u00a0mld."}, 1E12:{other:"0\u00a0bil."}, 1E13:{other:"00\u00a0bil."}, 1E14:{other:"000\u00a0bil."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tis\u00edc"}, 1E4:{other:"00 tis\u00edc"}, 
1E5:{other:"000 tis\u00edc"}, 1E6:{other:"0 mili\u00f3nov"}, 1E7:{other:"00 mili\u00f3nov"}, 1E8:{other:"000 mili\u00f3nov"}, 1E9:{other:"0 miliard"}, 1E10:{other:"00 mili\u00e1rd"}, 1E11:{other:"000 mili\u00e1rd"}, 1E12:{other:"0 bili\u00f3nov"}, 1E13:{other:"00 bili\u00f3nov"}, 1E14:{other:"000 bili\u00f3nov"}}};
goog.i18n.CompactNumberFormatSymbols_sk_SK = goog.i18n.CompactNumberFormatSymbols_sk;
goog.i18n.CompactNumberFormatSymbols_sl = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tis."}, 1E4:{other:"00\u00a0tis."}, 1E5:{other:"000\u00a0tis."}, 1E6:{other:"0\u00a0mio."}, 1E7:{other:"00\u00a0mio."}, 1E8:{other:"000\u00a0mio."}, 1E9:{other:"0\u00a0mrd."}, 1E10:{other:"00\u00a0mrd."}, 1E11:{other:"000\u00a0mrd."}, 1E12:{other:"0\u00a0bil."}, 1E13:{other:"00\u00a0bil."}, 1E14:{other:"000\u00a0bil."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tiso\u010d"}, 1E4:{other:"00 tiso\u010d"}, 
1E5:{other:"000 tiso\u010d"}, 1E6:{other:"0 milijonov"}, 1E7:{other:"00 milijonov"}, 1E8:{other:"000 milijonov"}, 1E9:{other:"0 milijard"}, 1E10:{other:"00 milijard"}, 1E11:{other:"000 milijard"}, 1E12:{other:"0 bilijonov"}, 1E13:{other:"00 bilijonov"}, 1E14:{other:"000 bilijonov"}}};
goog.i18n.CompactNumberFormatSymbols_sl_SI = goog.i18n.CompactNumberFormatSymbols_sl;
goog.i18n.CompactNumberFormatSymbols_sq = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0mij\u00eb"}, 1E4:{other:"00\u00a0mij\u00eb"}, 1E5:{other:"000\u00a0mij\u00eb"}, 1E6:{other:"0\u00a0Mln"}, 1E7:{other:"00\u00a0Mln"}, 1E8:{other:"000\u00a0Mln"}, 1E9:{other:"0\u00a0Mld"}, 1E10:{other:"00\u00a0Mld"}, 1E11:{other:"000\u00a0Mld"}, 1E12:{other:"0\u00a0Bln"}, 1E13:{other:"00\u00a0Bln"}, 1E14:{other:"000\u00a0Bln"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 mij\u00eb"}, 1E4:{other:"00 mij\u00eb"}, 
1E5:{other:"000 mij\u00eb"}, 1E6:{other:"0 milion"}, 1E7:{other:"00 milion"}, 1E8:{other:"000 milion"}, 1E9:{other:"0 miliard"}, 1E10:{other:"00 miliard"}, 1E11:{other:"000 miliard"}, 1E12:{other:"0 bilion"}, 1E13:{other:"00 bilion"}, 1E14:{other:"000 bilion"}}};
goog.i18n.CompactNumberFormatSymbols_sq_AL = goog.i18n.CompactNumberFormatSymbols_sq;
goog.i18n.CompactNumberFormatSymbols_sr = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"00\u00a0\u0445\u0438\u0459"}, 1E5:{other:"000\u00a0\u0445\u0438\u0459"}, 1E6:{other:"0\u00a0\u043c\u0438\u043b"}, 1E7:{other:"00\u00a0\u043c\u0438\u043b"}, 1E8:{other:"000\u00a0\u043c\u0438\u043b"}, 1E9:{other:"0\u00a0\u043c\u043b\u0440\u0434"}, 1E10:{other:"00\u00a0\u043c\u043b\u0440\u0434"}, 1E11:{other:"000\u00a0\u043c\u043b\u0440\u0434"}, 1E12:{other:"0\u00a0\u0431\u0438\u043b"}, 1E13:{other:"00\u00a0\u0431\u0438\u043b"}, 
1E14:{other:"000\u00a0\u0431\u0438\u043b"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0445\u0438\u0459\u0430\u0434\u0430"}, 1E4:{other:"00 \u0445\u0438\u0459\u0430\u0434\u0430"}, 1E5:{other:"000 \u0445\u0438\u0459\u0430\u0434\u0430"}, 1E6:{other:"0 \u043c\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E7:{other:"00 \u043c\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E8:{other:"000 \u043c\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E9:{other:"0 \u043c\u0438\u043b\u0438\u0458\u0430\u0440\u0434\u0438"}, 1E10:{other:"00 \u043c\u0438\u043b\u0438\u0458\u0430\u0440\u0434\u0438"}, 
1E11:{other:"000 \u043c\u0438\u043b\u0438\u0458\u0430\u0440\u0434\u0438"}, 1E12:{other:"0 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E13:{other:"00 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0430"}, 1E14:{other:"000 \u0442\u0440\u0438\u043b\u0438\u043e\u043d\u0430"}}};
goog.i18n.CompactNumberFormatSymbols_sr_Cyrl_RS = goog.i18n.CompactNumberFormatSymbols_sr;
goog.i18n.CompactNumberFormatSymbols_sv = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0tn"}, 1E4:{other:"00\u00a0tn"}, 1E5:{other:"000\u00a0tn"}, 1E6:{other:"0\u00a0mn"}, 1E7:{other:"00\u00a0mn"}, 1E8:{other:"000\u00a0mn"}, 1E9:{other:"0\u00a0md"}, 1E10:{other:"00\u00a0md"}, 1E11:{other:"000\u00a0md"}, 1E12:{other:"0\u00a0bn"}, 1E13:{other:"00\u00a0bn"}, 1E14:{other:"000\u00a0bn"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 tusen"}, 1E4:{other:"00 tusen"}, 1E5:{other:"000 tusen"}, 1E6:{other:"0 miljoner"}, 
1E7:{other:"00 miljoner"}, 1E8:{other:"000 miljoner"}, 1E9:{other:"0 miljarder"}, 1E10:{other:"00 miljarder"}, 1E11:{other:"000 miljarder"}, 1E12:{other:"0 biljoner"}, 1E13:{other:"00 biljoner"}, 1E14:{other:"000 biljoner"}}};
goog.i18n.CompactNumberFormatSymbols_sv_SE = goog.i18n.CompactNumberFormatSymbols_sv;
goog.i18n.CompactNumberFormatSymbols_sw = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"elfu\u00a00"}, 1E4:{other:"elfu\u00a000"}, 1E5:{other:"laki0"}, 1E6:{other:"M0"}, 1E7:{other:"M00"}, 1E8:{other:"M000"}, 1E9:{other:"B0"}, 1E10:{other:"B00"}, 1E11:{other:"B000"}, 1E12:{other:"T0"}, 1E13:{other:"T00"}, 1E14:{other:"T000"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"Elfu 0"}, 1E4:{other:"Elfu 00"}, 1E5:{other:"Elfu 000"}, 1E6:{other:"Milioni 0"}, 1E7:{other:"Milioni 00"}, 1E8:{other:"Milioni 000"}, 
1E9:{other:"Bilioni 0"}, 1E10:{other:"Bilioni 00"}, 1E11:{other:"Bilioni 000"}, 1E12:{other:"Trilioni 0"}, 1E13:{other:"Trilioni 00"}, 1E14:{other:"Trilioni 000"}}};
goog.i18n.CompactNumberFormatSymbols_sw_TZ = goog.i18n.CompactNumberFormatSymbols_sw;
goog.i18n.CompactNumberFormatSymbols_ta = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u0b86"}, 1E4:{other:"00\u0b86"}, 1E5:{other:"000\u0b86"}, 1E6:{other:"0\u0bae\u0bbf"}, 1E7:{other:"00\u0bae\u0bbf"}, 1E8:{other:"000\u0bae\u0bbf"}, 1E9:{other:"0\u0baa\u0bbf"}, 1E10:{other:"00\u0baa\u0bbf"}, 1E11:{other:"000\u0baa\u0bbf"}, 1E12:{other:"0\u0b9f\u0bbf"}, 1E13:{other:"00\u0b9f\u0bbf"}, 1E14:{other:"000\u0b9f\u0bbf"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0b86\u0baf\u0bbf\u0bb0\u0bae\u0bcd"}, 
1E4:{other:"00 \u0b86\u0baf\u0bbf\u0bb0\u0bae\u0bcd"}, 1E5:{other:"000 \u0b86\u0baf\u0bbf\u0bb0\u0bae\u0bcd"}, 1E6:{other:"0 \u0bae\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 1E7:{other:"00 \u0bae\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 1E8:{other:"000 \u0bae\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 1E9:{other:"0 \u0baa\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 1E10:{other:"00 \u0baa\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 1E11:{other:"000 \u0baa\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 
1E12:{other:"0 \u0b9f\u0bbf\u0bb0\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 1E13:{other:"00 \u0b9f\u0bbf\u0bb0\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}, 1E14:{other:"000 \u0b9f\u0bbf\u0bb0\u0bbf\u0bb2\u0bcd\u0bb2\u0bbf\u0baf\u0ba9\u0bcd"}}};
goog.i18n.CompactNumberFormatSymbols_ta_IN = goog.i18n.CompactNumberFormatSymbols_ta;
goog.i18n.CompactNumberFormatSymbols_te = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u0c35\u0c47"}, 1E4:{other:"00\u0c35\u0c47"}, 1E5:{other:"000\u0c35\u0c47"}, 1E6:{other:"0\u0c2e\u0c3f"}, 1E7:{other:"00\u0c2e\u0c3f"}, 1E8:{other:"000\u0c2e\u0c3f"}, 1E9:{other:"0\u0c2c\u0c3f"}, 1E10:{other:"00\u0c2c\u0c3f"}, 1E11:{other:"000\u0c2c\u0c3f"}, 1E12:{other:"0\u0c1f\u0c4d\u0c30\u0c3f"}, 1E13:{other:"00\u0c1f\u0c4d\u0c30\u0c3f"}, 1E14:{other:"000\u0c1f\u0c4d\u0c30\u0c3f"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0c35\u0c47\u0c32\u0c41"}, 
1E4:{other:"00 \u0c35\u0c47\u0c32\u0c41"}, 1E5:{other:"000 \u0c35\u0c47\u0c32\u0c41"}, 1E6:{other:"0 \u0c2e\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 1E7:{other:"00 \u0c2e\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 1E8:{other:"000 \u0c2e\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 1E9:{other:"0 \u0c2c\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 1E10:{other:"00 \u0c2c\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 1E11:{other:"000 \u0c2c\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 1E12:{other:"0 \u0c1f\u0c4d\u0c30\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 
1E13:{other:"00 \u0c1f\u0c4d\u0c30\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}, 1E14:{other:"000 \u0c1f\u0c4d\u0c30\u0c3f\u0c32\u0c3f\u0c2f\u0c28\u0c4d"}}};
goog.i18n.CompactNumberFormatSymbols_te_IN = goog.i18n.CompactNumberFormatSymbols_te;
goog.i18n.CompactNumberFormatSymbols_th = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0e1e."}, 1E4:{other:"0\u00a0\u0e21."}, 1E5:{other:"0\u00a0\u0e2a."}, 1E6:{other:"0\u00a0\u0e25."}, 1E7:{other:"00\u00a0\u0e25."}, 1E8:{other:"000\u00a0\u0e25."}, 1E9:{other:"0\u00a0\u0e1e.\u0e25."}, 1E10:{other:"0\u00a0\u0e21.\u0e25."}, 1E11:{other:"0\u00a0\u0e2a.\u0e25."}, 1E12:{other:"0\u00a0\u0e25.\u0e25."}, 1E13:{other:"00\u00a0\u0e25.\u0e25."}, 1E14:{other:"000\u00a0\u0e25.\u0e25."}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0e1e\u0e31\u0e19"}, 
1E4:{other:"0 \u0e2b\u0e21\u0e37\u0e48\u0e19"}, 1E5:{other:"0 \u0e41\u0e2a\u0e19"}, 1E6:{other:"0 \u0e25\u0e49\u0e32\u0e19"}, 1E7:{other:"00 \u0e25\u0e49\u0e32\u0e19"}, 1E8:{other:"000 \u0e25\u0e49\u0e32\u0e19"}, 1E9:{other:"0 \u0e1e\u0e31\u0e19\u0e25\u0e49\u0e32\u0e19"}, 1E10:{other:"0 \u0e2b\u0e21\u0e37\u0e48\u0e19\u0e25\u0e49\u0e32\u0e19"}, 1E11:{other:"0 \u0e41\u0e2a\u0e19\u0e25\u0e49\u0e32\u0e19"}, 1E12:{other:"0 \u0e25\u0e49\u0e32\u0e19\u0e25\u0e49\u0e32\u0e19"}, 1E13:{other:"00 \u0e25\u0e49\u0e32\u0e19\u0e25\u0e49\u0e32\u0e19"}, 
1E14:{other:"000 \u0e25\u0e49\u0e32\u0e19\u0e25\u0e49\u0e32\u0e19"}}};
goog.i18n.CompactNumberFormatSymbols_th_TH = goog.i18n.CompactNumberFormatSymbols_th;
goog.i18n.CompactNumberFormatSymbols_tl = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 libo"}, 1E4:{other:"00 libo"}, 1E5:{other:"000 libo"}, 1E6:{other:"0 milyon"}, 1E7:{other:"00 milyon"}, 1E8:{other:"000 milyon"}, 1E9:{other:"0 bilyon"}, 
1E10:{other:"00 bilyon"}, 1E11:{other:"000 bilyon"}, 1E12:{other:"0 trilyon"}, 1E13:{other:"00 trilyon"}, 1E14:{other:"000 trilyon"}}};
goog.i18n.CompactNumberFormatSymbols_tr = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0"}, 1E4:{other:"00\u00a0B"}, 1E5:{other:"000\u00a0B"}, 1E6:{other:"0\u00a0Mn"}, 1E7:{other:"00\u00a0Mn"}, 1E8:{other:"000\u00a0Mn"}, 1E9:{other:"0\u00a0Mr"}, 1E10:{other:"00\u00a0Mr"}, 1E11:{other:"000\u00a0Mr"}, 1E12:{other:"0\u00a0Tn"}, 1E13:{other:"00\u00a0Tn"}, 1E14:{other:"000\u00a0Tn"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 bin"}, 1E4:{other:"00 bin"}, 1E5:{other:"000 bin"}, 1E6:{other:"0 milyon"}, 
1E7:{other:"00 milyon"}, 1E8:{other:"000 milyon"}, 1E9:{other:"0 milyar"}, 1E10:{other:"00 milyar"}, 1E11:{other:"000 milyar"}, 1E12:{other:"0 trilyon"}, 1E13:{other:"00 trilyon"}, 1E14:{other:"000 trilyon"}}};
goog.i18n.CompactNumberFormatSymbols_tr_TR = goog.i18n.CompactNumberFormatSymbols_tr;
goog.i18n.CompactNumberFormatSymbols_uk = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u0442\u0438\u0441"}, 1E4:{other:"00\u00a0\u0442\u0438\u0441"}, 1E5:{other:"000\u00a0\u0442\u0438\u0441"}, 1E6:{other:"0\u00a0\u043c\u043b\u043d"}, 1E7:{other:"00\u00a0\u043c\u043b\u043d"}, 1E8:{other:"000\u00a0\u043c\u043b\u043d"}, 1E9:{other:"0\u00a0\u043c\u043b\u0440\u0434"}, 1E10:{other:"00\u00a0\u043c\u043b\u0440\u0434"}, 1E11:{other:"000\u00a0\u043c\u043b\u0440\u0434"}, 1E12:{other:"0\u00a0\u0442\u0440\u043b\u043d"}, 
1E13:{other:"00\u00a0\u0442\u0440\u043b\u043d"}, 1E14:{other:"000\u00a0\u0442\u0440\u043b\u043d"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u0442\u0438\u0441\u044f\u0447\u0456"}, 1E4:{other:"00 \u0442\u0438\u0441\u044f\u0447\u0456"}, 1E5:{other:"000 \u0442\u0438\u0441\u044f\u0447\u0456"}, 1E6:{other:"0 \u043c\u0456\u043b\u044c\u0439\u043e\u043d\u0430"}, 1E7:{other:"00 \u043c\u0456\u043b\u044c\u0439\u043e\u043d\u0430"}, 1E8:{other:"000 \u043c\u0456\u043b\u044c\u0439\u043e\u043d\u0430"}, 1E9:{other:"0 \u043c\u0456\u043b\u044c\u044f\u0440\u0434\u0430"}, 
1E10:{other:"00 \u043c\u0456\u043b\u044c\u044f\u0440\u0434\u0430"}, 1E11:{other:"000 \u043c\u0456\u043b\u044c\u044f\u0440\u0434\u0430"}, 1E12:{other:"0 \u0442\u0440\u0438\u043b\u044c\u0439\u043e\u043d\u0430"}, 1E13:{other:"00 \u0442\u0440\u0438\u043b\u044c\u0439\u043e\u043d\u0430"}, 1E14:{other:"000 \u0442\u0440\u0438\u043b\u044c\u0439\u043e\u043d\u0430"}}};
goog.i18n.CompactNumberFormatSymbols_uk_UA = goog.i18n.CompactNumberFormatSymbols_uk;
goog.i18n.CompactNumberFormatSymbols_ur = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0\u06c1\u0632\u0627\u0631"}, 1E4:{other:"00\u00a0\u06c1\u0632\u0627\u0631"}, 1E5:{other:"0\u00a0\u0644\u0627\u06a9\u06be"}, 1E6:{other:"00\u00a0\u0644\u0627\u06a9\u06be"}, 1E7:{other:"0\u00a0\u06a9\u0631\u0648\u0691"}, 1E8:{other:"00\u00a0\u06a9\u0631\u0648\u0691"}, 1E9:{other:"0\u00a0\u0627\u0631\u0628"}, 1E10:{other:"00\u00a0\u0627\u0631\u0628"}, 1E11:{other:"0\u00a0\u06a9\u06be\u0631\u0628"}, 1E12:{other:"00\u00a0\u06a9\u06be\u0631\u0628"}, 
1E13:{other:"00T"}, 1E14:{other:"000T"}}};
goog.i18n.CompactNumberFormatSymbols_ur_PK = goog.i18n.CompactNumberFormatSymbols_ur;
goog.i18n.CompactNumberFormatSymbols_uz = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0ming"}, 1E4:{other:"00ming"}, 1E5:{other:"000ming"}, 1E6:{other:"0mln"}, 1E7:{other:"00mln"}, 1E8:{other:"000mln"}, 1E9:{other:"0mlrd"}, 1E10:{other:"00mlrd"}, 1E11:{other:"000mlrd"}, 1E12:{other:"0trln"}, 1E13:{other:"00trln"}, 1E14:{other:"000trln"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 ming"}, 1E4:{other:"00 ming"}, 1E5:{other:"000 ming"}, 1E6:{other:"0 million"}, 1E7:{other:"00 million"}, 1E8:{other:"000 million"}, 
1E9:{other:"0 milliard"}, 1E10:{other:"00 milliard"}, 1E11:{other:"000 milliard"}, 1E12:{other:"0 trilion"}, 1E13:{other:"00 trilion"}, 1E14:{other:"000 trilion"}}};
goog.i18n.CompactNumberFormatSymbols_uz_Latn_UZ = goog.i18n.CompactNumberFormatSymbols_uz;
goog.i18n.CompactNumberFormatSymbols_vi = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u00a0N"}, 1E4:{other:"00\u00a0N"}, 1E5:{other:"000\u00a0N"}, 1E6:{other:"0\u00a0Tr"}, 1E7:{other:"00\u00a0Tr"}, 1E8:{other:"000\u00a0Tr"}, 1E9:{other:"0\u00a0T"}, 1E10:{other:"00\u00a0T"}, 1E11:{other:"000\u00a0T"}, 1E12:{other:"0\u00a0NT"}, 1E13:{other:"00\u00a0NT"}, 1E14:{other:"000\u00a0NT"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 ngh\u00ecn"}, 1E4:{other:"00 ngh\u00ecn"}, 1E5:{other:"000 ngh\u00ecn"}, 
1E6:{other:"0 tri\u1ec7u"}, 1E7:{other:"00 tri\u1ec7u"}, 1E8:{other:"000 tri\u1ec7u"}, 1E9:{other:"0 t\u1ef7"}, 1E10:{other:"00 t\u1ef7"}, 1E11:{other:"000 t\u1ef7"}, 1E12:{other:"0 ngh\u00ecn t\u1ef7"}, 1E13:{other:"00 ngh\u00ecn t\u1ef7"}, 1E14:{other:"000 ngh\u00ecn t\u1ef7"}}};
goog.i18n.CompactNumberFormatSymbols_vi_VN = goog.i18n.CompactNumberFormatSymbols_vi;
goog.i18n.CompactNumberFormatSymbols_zh = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0\u5343"}, 1E4:{other:"0\u4e07"}, 1E5:{other:"00\u4e07"}, 1E6:{other:"000\u4e07"}, 1E7:{other:"0000\u4e07"}, 1E8:{other:"0\u4ebf"}, 1E9:{other:"00\u4ebf"}, 1E10:{other:"000\u4ebf"}, 1E11:{other:"0000\u4ebf"}, 1E12:{other:"0\u5146"}, 1E13:{other:"00\u5146"}, 1E14:{other:"000\u5146"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0\u5343"}, 1E4:{other:"0\u4e07"}, 1E5:{other:"00\u4e07"}, 1E6:{other:"000\u4e07"}, 1E7:{other:"0000\u4e07"}, 
1E8:{other:"0\u4ebf"}, 1E9:{other:"00\u4ebf"}, 1E10:{other:"000\u4ebf"}, 1E11:{other:"0000\u4ebf"}, 1E12:{other:"0\u5146"}, 1E13:{other:"00\u5146"}, 1E14:{other:"000\u5146"}}};
goog.i18n.CompactNumberFormatSymbols_zh_CN = goog.i18n.CompactNumberFormatSymbols_zh;
goog.i18n.CompactNumberFormatSymbols_zh_HK = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u5343"}, 1E4:{other:"0\u842c"}, 1E5:{other:"00\u842c"}, 1E6:{other:"000\u842c"}, 1E7:{other:"0000\u842c"}, 1E8:{other:"0\u5104"}, 1E9:{other:"00\u5104"}, 
1E10:{other:"000\u5104"}, 1E11:{other:"0000\u5104"}, 1E12:{other:"0\u5146"}, 1E13:{other:"00\u5146"}, 1E14:{other:"000\u5146"}}};
goog.i18n.CompactNumberFormatSymbols_zh_Hans_CN = goog.i18n.CompactNumberFormatSymbols_zh;
goog.i18n.CompactNumberFormatSymbols_zh_TW = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 \u5343"}, 1E4:{other:"0\u842c"}, 1E5:{other:"00\u842c"}, 1E6:{other:"000\u842c"}, 1E7:{other:"0000\u842c"}, 1E8:{other:"0\u5104"}, 1E9:{other:"00\u5104"}, 
1E10:{other:"000\u5104"}, 1E11:{other:"0000\u5104"}, 1E12:{other:"0\u5146"}, 1E13:{other:"00\u5146"}, 1E14:{other:"000\u5146"}}};
goog.i18n.CompactNumberFormatSymbols_zu = {COMPACT_DECIMAL_SHORT_PATTERN:{1E3:{other:"0K"}, 1E4:{other:"00K"}, 1E5:{other:"000K"}, 1E6:{other:"0M"}, 1E7:{other:"00M"}, 1E8:{other:"000M"}, 1E9:{other:"0B"}, 1E10:{other:"00B"}, 1E11:{other:"000B"}, 1E12:{other:"0T"}, 1E13:{other:"00T"}, 1E14:{other:"000T"}}, COMPACT_DECIMAL_LONG_PATTERN:{1E3:{other:"0 inkulungwane"}, 1E4:{other:"00 inkulungwane"}, 1E5:{other:"000 inkulungwane"}, 1E6:{other:"0 isigidi"}, 1E7:{other:"00 isigidi"}, 1E8:{other:"000 isigidi"}, 
1E9:{other:"0 isigidi sezigidi"}, 1E10:{other:"00 isigidi sezigidi"}, 1E11:{other:"000 isigidi sezigidi"}, 1E12:{other:"0 isigidintathu"}, 1E13:{other:"00 isigidintathu"}, 1E14:{other:"000 isigidintathu"}}};
goog.i18n.CompactNumberFormatSymbols_zu_ZA = goog.i18n.CompactNumberFormatSymbols_zu;
goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
"af" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_af);
if ("af_ZA" == goog.LOCALE || "af-ZA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_af;
}
"am" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_am);
if ("am_ET" == goog.LOCALE || "am-ET" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_am;
}
"ar" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ar);
if ("ar_001" == goog.LOCALE || "ar-001" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ar;
}
"az" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_az);
if ("az_Cyrl_AZ" == goog.LOCALE || "az-Cyrl-AZ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_az;
}
if ("az_Latn_AZ" == goog.LOCALE || "az-Latn-AZ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_az;
}
"bg" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_bg);
if ("bg_BG" == goog.LOCALE || "bg-BG" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_bg;
}
"bn" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_bn);
if ("bn_BD" == goog.LOCALE || "bn-BD" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_bn;
}
"br" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_br);
if ("br_FR" == goog.LOCALE || "br-FR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_br;
}
"ca" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ca);
if ("ca_AD" == goog.LOCALE || "ca-AD" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ca;
}
if ("ca_ES" == goog.LOCALE || "ca-ES" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ca;
}
if ("ca_ES_VALENCIA" == goog.LOCALE || "ca-ES-VALENCIA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ca;
}
if ("ca_FR" == goog.LOCALE || "ca-FR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ca;
}
if ("ca_IT" == goog.LOCALE || "ca-IT" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ca;
}
"chr" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_chr);
if ("chr_US" == goog.LOCALE || "chr-US" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_chr;
}
"cs" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_cs);
if ("cs_CZ" == goog.LOCALE || "cs-CZ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_cs;
}
"cy" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_cy);
if ("cy_GB" == goog.LOCALE || "cy-GB" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_cy;
}
"da" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_da);
if ("da_DK" == goog.LOCALE || "da-DK" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_da;
}
if ("da_GL" == goog.LOCALE || "da-GL" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_da;
}
"de" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_de);
if ("de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_de_AT;
}
if ("de_BE" == goog.LOCALE || "de-BE" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_de;
}
if ("de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_de_CH;
}
if ("de_DE" == goog.LOCALE || "de-DE" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_de;
}
if ("de_LU" == goog.LOCALE || "de-LU" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_de;
}
"el" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_el);
if ("el_GR" == goog.LOCALE || "el-GR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_el;
}
"en" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en);
if ("en_001" == goog.LOCALE || "en-001" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_AS" == goog.LOCALE || "en-AS" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_AU" == goog.LOCALE || "en-AU" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en_AU;
}
if ("en_DG" == goog.LOCALE || "en-DG" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_FM" == goog.LOCALE || "en-FM" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_GB" == goog.LOCALE || "en-GB" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en_GB;
}
if ("en_GU" == goog.LOCALE || "en-GU" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en_IE;
}
if ("en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en_IN;
}
if ("en_IO" == goog.LOCALE || "en-IO" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_MH" == goog.LOCALE || "en-MH" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_MP" == goog.LOCALE || "en-MP" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_PR" == goog.LOCALE || "en-PR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_PW" == goog.LOCALE || "en-PW" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en_SG;
}
if ("en_TC" == goog.LOCALE || "en-TC" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_UM" == goog.LOCALE || "en-UM" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_US" == goog.LOCALE || "en-US" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_VG" == goog.LOCALE || "en-VG" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_VI" == goog.LOCALE || "en-VI" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
if ("en_ZA" == goog.LOCALE || "en-ZA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en_ZA;
}
if ("en_ZW" == goog.LOCALE || "en-ZW" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_en;
}
"es" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_es);
if ("es_419" == goog.LOCALE || "es-419" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_es_419;
}
if ("es_EA" == goog.LOCALE || "es-EA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_es;
}
if ("es_ES" == goog.LOCALE || "es-ES" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_es;
}
if ("es_IC" == goog.LOCALE || "es-IC" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_es;
}
"et" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_et);
if ("et_EE" == goog.LOCALE || "et-EE" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_et;
}
"eu" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_eu);
if ("eu_ES" == goog.LOCALE || "eu-ES" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_eu;
}
"fa" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fa);
if ("fa_IR" == goog.LOCALE || "fa-IR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fa;
}
"fi" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fi);
if ("fi_FI" == goog.LOCALE || "fi-FI" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fi;
}
"fil" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fil);
if ("fil_PH" == goog.LOCALE || "fil-PH" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fil;
}
"fr" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr);
if ("fr_BL" == goog.LOCALE || "fr-BL" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr_CA;
}
if ("fr_FR" == goog.LOCALE || "fr-FR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_GF" == goog.LOCALE || "fr-GF" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_GP" == goog.LOCALE || "fr-GP" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_MC" == goog.LOCALE || "fr-MC" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_MF" == goog.LOCALE || "fr-MF" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_MQ" == goog.LOCALE || "fr-MQ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_PM" == goog.LOCALE || "fr-PM" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_RE" == goog.LOCALE || "fr-RE" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
if ("fr_YT" == goog.LOCALE || "fr-YT" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_fr;
}
"gl" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_gl);
if ("gl_ES" == goog.LOCALE || "gl-ES" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_gl;
}
"gsw" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_gsw);
if ("gsw_CH" == goog.LOCALE || "gsw-CH" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_gsw;
}
if ("gsw_LI" == goog.LOCALE || "gsw-LI" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_gsw;
}
"gu" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_gu);
if ("gu_IN" == goog.LOCALE || "gu-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_gu;
}
"haw" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_haw);
if ("haw_US" == goog.LOCALE || "haw-US" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_haw;
}
"he" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_he);
if ("he_IL" == goog.LOCALE || "he-IL" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_he;
}
"hi" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hi);
if ("hi_IN" == goog.LOCALE || "hi-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hi;
}
"hr" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hr);
if ("hr_HR" == goog.LOCALE || "hr-HR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hr;
}
"hu" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hu);
if ("hu_HU" == goog.LOCALE || "hu-HU" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hu;
}
"hy" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hy);
if ("hy_AM" == goog.LOCALE || "hy-AM" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_hy;
}
"id" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_id);
if ("id_ID" == goog.LOCALE || "id-ID" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_id;
}
"in" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_in);
"is" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_is);
if ("is_IS" == goog.LOCALE || "is-IS" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_is;
}
"it" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_it);
if ("it_IT" == goog.LOCALE || "it-IT" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_it;
}
if ("it_SM" == goog.LOCALE || "it-SM" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_it;
}
"iw" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_iw);
"ja" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ja);
if ("ja_JP" == goog.LOCALE || "ja-JP" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ja;
}
"ka" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ka);
if ("ka_GE" == goog.LOCALE || "ka-GE" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ka;
}
"kk" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_kk);
if ("kk_Cyrl_KZ" == goog.LOCALE || "kk-Cyrl-KZ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_kk;
}
"km" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_km);
if ("km_KH" == goog.LOCALE || "km-KH" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_km;
}
"kn" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_kn);
if ("kn_IN" == goog.LOCALE || "kn-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_kn;
}
"ko" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ko);
if ("ko_KR" == goog.LOCALE || "ko-KR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ko;
}
"ky" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ky);
if ("ky_Cyrl_KG" == goog.LOCALE || "ky-Cyrl-KG" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ky;
}
"ln" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ln);
if ("ln_CD" == goog.LOCALE || "ln-CD" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ln;
}
"lo" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_lo);
if ("lo_LA" == goog.LOCALE || "lo-LA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_lo;
}
"lt" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_lt);
if ("lt_LT" == goog.LOCALE || "lt-LT" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_lt;
}
"lv" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_lv);
if ("lv_LV" == goog.LOCALE || "lv-LV" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_lv;
}
"mk" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mk);
if ("mk_MK" == goog.LOCALE || "mk-MK" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mk;
}
"ml" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ml);
if ("ml_IN" == goog.LOCALE || "ml-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ml;
}
"mn" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mn);
if ("mn_Cyrl_MN" == goog.LOCALE || "mn-Cyrl-MN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mn;
}
"mr" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mr);
if ("mr_IN" == goog.LOCALE || "mr-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mr;
}
"ms" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ms);
if ("ms_Latn_MY" == goog.LOCALE || "ms-Latn-MY" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ms;
}
"mt" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mt);
if ("mt_MT" == goog.LOCALE || "mt-MT" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_mt;
}
"my" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_my);
if ("my_MM" == goog.LOCALE || "my-MM" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_my;
}
"nb" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_nb);
if ("nb_NO" == goog.LOCALE || "nb-NO" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_nb;
}
if ("nb_SJ" == goog.LOCALE || "nb-SJ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_nb;
}
"ne" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ne);
if ("ne_NP" == goog.LOCALE || "ne-NP" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ne;
}
"nl" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_nl);
if ("nl_NL" == goog.LOCALE || "nl-NL" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_nl;
}
"no" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_no);
if ("no_NO" == goog.LOCALE || "no-NO" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_no;
}
"or" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_or);
if ("or_IN" == goog.LOCALE || "or-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_or;
}
"pa" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_pa);
if ("pa_Guru_IN" == goog.LOCALE || "pa-Guru-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_pa;
}
"pl" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_pl);
if ("pl_PL" == goog.LOCALE || "pl-PL" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_pl;
}
"pt" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_pt);
if ("pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_pt;
}
if ("pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_pt_PT;
}
"ro" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ro);
if ("ro_RO" == goog.LOCALE || "ro-RO" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ro;
}
"ru" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ru);
if ("ru_RU" == goog.LOCALE || "ru-RU" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ru;
}
"si" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_si);
if ("si_LK" == goog.LOCALE || "si-LK" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_si;
}
"sk" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sk);
if ("sk_SK" == goog.LOCALE || "sk-SK" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sk;
}
"sl" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sl);
if ("sl_SI" == goog.LOCALE || "sl-SI" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sl;
}
"sq" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sq);
if ("sq_AL" == goog.LOCALE || "sq-AL" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sq;
}
"sr" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sr);
if ("sr_Cyrl_RS" == goog.LOCALE || "sr-Cyrl-RS" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sr;
}
"sv" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sv);
if ("sv_SE" == goog.LOCALE || "sv-SE" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sv;
}
"sw" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sw);
if ("sw_TZ" == goog.LOCALE || "sw-TZ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_sw;
}
"ta" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ta);
if ("ta_IN" == goog.LOCALE || "ta-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ta;
}
"te" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_te);
if ("te_IN" == goog.LOCALE || "te-IN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_te;
}
"th" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_th);
if ("th_TH" == goog.LOCALE || "th-TH" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_th;
}
"tl" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_tl);
"tr" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_tr);
if ("tr_TR" == goog.LOCALE || "tr-TR" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_tr;
}
"uk" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_uk);
if ("uk_UA" == goog.LOCALE || "uk-UA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_uk;
}
"ur" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ur);
if ("ur_PK" == goog.LOCALE || "ur-PK" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_ur;
}
"uz" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_uz);
if ("uz_Latn_UZ" == goog.LOCALE || "uz-Latn-UZ" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_uz;
}
"vi" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_vi);
if ("vi_VN" == goog.LOCALE || "vi-VN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_vi;
}
"zh" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_zh);
if ("zh_CN" == goog.LOCALE || "zh-CN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_zh;
}
if ("zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_zh_HK;
}
if ("zh_Hans_CN" == goog.LOCALE || "zh-Hans-CN" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_zh;
}
if ("zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_zh_TW;
}
"zu" == goog.LOCALE && (goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_zu);
if ("zu_ZA" == goog.LOCALE || "zu-ZA" == goog.LOCALE) {
  goog.i18n.CompactNumberFormatSymbols = goog.i18n.CompactNumberFormatSymbols_zu;
}
;
// INPUT (javascript/closure/i18n/currency.js)
goog.i18n.currency = {};
goog.i18n.currency.PRECISION_MASK_ = 7;
goog.i18n.currency.POSITION_FLAG_ = 16;
goog.i18n.currency.SPACE_FLAG_ = 32;
goog.i18n.currency.tier2Enabled_ = !1;
goog.i18n.currency.addTier2Support = function() {
  if (!goog.i18n.currency.tier2Enabled_) {
    for (var key in goog.i18n.currency.CurrencyInfoTier2) {
      goog.i18n.currency.CurrencyInfo[key] = goog.i18n.currency.CurrencyInfoTier2[key];
    }
    goog.i18n.currency.tier2Enabled_ = !0;
  }
};
goog.i18n.currency.getGlobalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode], patternNum = info[0];
  return currencyCode == info[1] ? goog.i18n.currency.getCurrencyPattern_(patternNum, info[1]) : currencyCode + " " + goog.i18n.currency.getCurrencyPattern_(patternNum, info[1]);
};
goog.i18n.currency.getGlobalCurrencySign = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return currencyCode == info[1] ? currencyCode : currencyCode + " " + info[1];
};
goog.i18n.currency.getLocalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[1]);
};
goog.i18n.currency.getLocalCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][1];
};
goog.i18n.currency.getPortableCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[2]);
};
goog.i18n.currency.getPortableCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][2];
};
goog.i18n.currency.isPrefixSignPosition = function(currencyCode) {
  return 0 == (goog.i18n.currency.CurrencyInfo[currencyCode][0] & goog.i18n.currency.POSITION_FLAG_);
};
goog.i18n.currency.getCurrencyPattern_ = function(patternNum, sign) {
  var strParts = ["#,##0"], precision = patternNum & goog.i18n.currency.PRECISION_MASK_;
  if (0 < precision) {
    strParts.push(".");
    for (var i = 0;i < precision;i++) {
      strParts.push("0");
    }
  }
  0 == (patternNum & goog.i18n.currency.POSITION_FLAG_) ? (strParts.unshift(patternNum & goog.i18n.currency.SPACE_FLAG_ ? "' " : "'"), strParts.unshift(sign), strParts.unshift("'")) : strParts.push(patternNum & goog.i18n.currency.SPACE_FLAG_ ? " '" : "'", sign, "'");
  return strParts.join("");
};
goog.i18n.currency.adjustPrecision = function(pattern, currencyCode) {
  var strParts = ["0"], info = goog.i18n.currency.CurrencyInfo[currencyCode], precision = info[0] & goog.i18n.currency.PRECISION_MASK_;
  if (0 < precision) {
    strParts.push(".");
    for (var i = 0;i < precision;i++) {
      strParts.push("0");
    }
  }
  return pattern.replace(/0.00/g, strParts.join(""));
};
goog.i18n.currency.CurrencyInfo = {AED:[2, "dh", "\u062f.\u0625.", "DH"], ALL:[0, "Lek", "Lek"], AUD:[2, "$", "AU$"], BDT:[2, "\u09f3", "Tk"], BGN:[2, "lev", "lev"], BRL:[2, "R$", "R$"], CAD:[2, "$", "C$"], CDF:[2, "FrCD", "CDF"], CHF:[2, "CHF", "CHF"], CLP:[0, "$", "CL$"], CNY:[2, "\u00a5", "RMB\u00a5"], COP:[0, "$", "COL$"], CRC:[0, "\u20a1", "CR\u20a1"], CZK:[50, "K\u010d", "K\u010d"], DKK:[18, "kr", "kr"], DOP:[2, "$", "RD$"], EGP:[2, "\u00a3", "LE"], ETB:[2, "Birr", "Birr"], EUR:[2, "\u20ac", 
"\u20ac"], GBP:[2, "\u00a3", "GB\u00a3"], HKD:[2, "$", "HK$"], HRK:[2, "kn", "kn"], HUF:[0, "Ft", "Ft"], IDR:[0, "Rp", "Rp"], ILS:[2, "\u20aa", "IL\u20aa"], INR:[2, "\u20b9", "Rs"], IRR:[0, "Rial", "IRR"], ISK:[0, "kr", "kr"], JMD:[2, "$", "JA$"], JPY:[0, "\u00a5", "JP\u00a5"], KRW:[0, "\u20a9", "KR\u20a9"], LKR:[2, "Rs", "SLRs"], LTL:[2, "Lt", "Lt"], LVL:[2, "Ls", "Ls"], MNT:[0, "\u20ae", "MN\u20ae"], MXN:[2, "$", "Mex$"], MYR:[2, "RM", "RM"], NOK:[50, "kr", "NOkr"], PAB:[2, "B/.", "B/."], PEN:[2, 
"S/.", "S/."], PHP:[2, "\u20b1", "Php"], PKR:[0, "Rs", "PKRs."], PLN:[50, "z\u0142", "z\u0142"], RON:[2, "RON", "RON"], RSD:[0, "din", "RSD"], RUB:[50, "\u0440\u0443\u0431.", "\u0440\u0443\u0431."], SAR:[2, "Rial", "Rial"], SEK:[2, "kr", "kr"], SGD:[2, "$", "S$"], THB:[2, "\u0e3f", "THB"], TRY:[2, "TL", "YTL"], TWD:[2, "NT$", "NT$"], TZS:[0, "TSh", "TSh"], UAH:[2, "\u20b4", "UAH"], USD:[2, "$", "US$"], UYU:[2, "$", "$U"], VND:[0, "\u20ab", "VN\u20ab"], YER:[0, "Rial", "Rial"], ZAR:[2, "R", "ZAR"]};
goog.i18n.currency.CurrencyInfoTier2 = {AFN:[48, "Af.", "AFN"], AMD:[0, "Dram", "dram"], AOA:[2, "Kz", "Kz"], ARS:[2, "$", "AR$"], AWG:[2, "Afl.", "Afl."], AZN:[2, "man.", "man."], BAM:[2, "KM", "KM"], BBD:[2, "$", "Bds$"], BHD:[3, "din", "din"], BIF:[0, "FBu", "FBu"], BMD:[2, "$", "BD$"], BND:[2, "$", "B$"], BOB:[2, "Bs", "Bs"], BSD:[2, "$", "BS$"], BTN:[2, "Nu.", "Nu."], BWP:[2, "P", "pula"], BYR:[0, "BYR", "BYR"], BZD:[2, "$", "BZ$"], CUC:[1, "$", "CUC$"], CUP:[2, "$", "CU$"], CVE:[2, "CVE", "Esc"], 
DJF:[0, "Fdj", "Fdj"], DZD:[2, "din", "din"], ERN:[2, "Nfk", "Nfk"], FJD:[2, "$", "FJ$"], FKP:[2, "\u00a3", "FK\u00a3"], GEL:[2, "GEL", "GEL"], GHS:[2, "GHS", "GHS"], GIP:[2, "\u00a3", "GI\u00a3"], GMD:[2, "GMD", "GMD"], GNF:[0, "FG", "FG"], GTQ:[2, "Q", "GTQ"], GYD:[0, "$", "GY$"], HNL:[2, "L", "HNL"], HTG:[2, "HTG", "HTG"], IQD:[0, "din", "IQD"], JOD:[3, "din", "JOD"], KES:[2, "Ksh", "Ksh"], KGS:[2, "KGS", "KGS"], KHR:[2, "Riel", "KHR"], KMF:[0, "CF", "KMF"], KPW:[0, "\u20a9KP", "KPW"], KWD:[3, 
"din", "KWD"], KYD:[2, "$", "KY$"], KZT:[2, "\u20b8", "KZT"], LAK:[0, "\u20ad", "\u20ad"], LBP:[0, "L\u00a3", "LBP"], LRD:[2, "$", "L$"], LSL:[2, "LSL", "LSL"], LYD:[3, "din", "LD"], MAD:[2, "dh", "MAD"], MDL:[2, "MDL", "MDL"], MGA:[0, "Ar", "MGA"], MKD:[2, "din", "MKD"], MMK:[0, "K", "MMK"], MOP:[2, "MOP", "MOP$"], MRO:[0, "MRO", "MRO"], MUR:[0, "MURs", "MURs"], MWK:[2, "MWK", "MWK"], MZN:[2, "MTn", "MTn"], NAD:[2, "$", "N$"], NGN:[2, "\u20a6", "NG\u20a6"], NIO:[2, "C$", "C$"], NPR:[2, "Rs", "NPRs"], 
NZD:[2, "$", "NZ$"], OMR:[3, "Rial", "OMR"], PGK:[2, "PGK", "PGK"], PYG:[0, "Gs", "PYG"], QAR:[2, "Rial", "QR"], RWF:[0, "RF", "RF"], SBD:[2, "$", "SI$"], SCR:[2, "SCR", "SCR"], SDG:[2, "SDG", "SDG"], SHP:[2, "\u00a3", "SH\u00a3"], SLL:[0, "SLL", "SLL"], SOS:[0, "SOS", "SOS"], SRD:[2, "$", "SR$"], STD:[0, "Db", "Db"], SYP:[0, "\u00a3", "SY\u00a3"], SZL:[2, "SZL", "SZL"], TJS:[2, "Som", "TJS"], TND:[3, "din", "DT"], TOP:[2, "T$", "T$"], TTD:[2, "$", "TT$"], UGX:[0, "UGX", "UGX"], UZS:[0, "so\u02bcm", 
"UZS"], VEF:[2, "Bs", "Bs"], VUV:[0, "VUV", "VUV"], WST:[2, "WST", "WST"], XAF:[0, "FCFA", "FCFA"], XCD:[2, "$", "EC$"], XOF:[0, "CFA", "CFA"], XPF:[0, "FCFP", "FCFP"], ZMK:[0, "ZMK", "ZMK"]};
// INPUT (javascript/closure/i18n/numberformatsymbols.js)
goog.i18n.NumberFormatSymbols_af = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"ZAR"};
goog.i18n.NumberFormatSymbols_af_ZA = goog.i18n.NumberFormatSymbols_af;
goog.i18n.NumberFormatSymbols_am = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"ETB"};
goog.i18n.NumberFormatSymbols_am_ET = goog.i18n.NumberFormatSymbols_am;
goog.i18n.NumberFormatSymbols_ar = {DECIMAL_SEP:"\u066b", GROUP_SEP:"\u066c", PERCENT:"\u066a", ZERO_DIGIT:"\u0660", PLUS_SIGN:"\u200f+", MINUS_SIGN:"\u200f-", EXP_SYMBOL:"\u0627\u0633", PERMILL:"\u0609", INFINITY:"\u221e", NAN:"\u0644\u064a\u0633\u00a0\u0631\u0642\u0645", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"EGP"};
goog.i18n.NumberFormatSymbols_ar_001 = goog.i18n.NumberFormatSymbols_ar;
goog.i18n.NumberFormatSymbols_az = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"AZN"};
goog.i18n.NumberFormatSymbols_az_Cyrl_AZ = goog.i18n.NumberFormatSymbols_az;
goog.i18n.NumberFormatSymbols_az_Latn_AZ = goog.i18n.NumberFormatSymbols_az;
goog.i18n.NumberFormatSymbols_bg = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"BGN"};
goog.i18n.NumberFormatSymbols_bg_BG = goog.i18n.NumberFormatSymbols_bg;
goog.i18n.NumberFormatSymbols_bn = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"\u09e6", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u09b8\u0982\u0996\u09cd\u09af\u09be\u00a0\u09a8\u09be", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"#,##,##0.00\u00a4", DEF_CURRENCY_CODE:"BDT"};
goog.i18n.NumberFormatSymbols_bn_BD = goog.i18n.NumberFormatSymbols_bn;
goog.i18n.NumberFormatSymbols_br = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_br_FR = goog.i18n.NumberFormatSymbols_br;
goog.i18n.NumberFormatSymbols_ca = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_ca_AD = goog.i18n.NumberFormatSymbols_ca;
goog.i18n.NumberFormatSymbols_ca_ES = goog.i18n.NumberFormatSymbols_ca;
goog.i18n.NumberFormatSymbols_ca_ES_VALENCIA = goog.i18n.NumberFormatSymbols_ca;
goog.i18n.NumberFormatSymbols_ca_FR = goog.i18n.NumberFormatSymbols_ca;
goog.i18n.NumberFormatSymbols_ca_IT = goog.i18n.NumberFormatSymbols_ca;
goog.i18n.NumberFormatSymbols_chr = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"USD"};
goog.i18n.NumberFormatSymbols_chr_US = goog.i18n.NumberFormatSymbols_chr;
goog.i18n.NumberFormatSymbols_cs = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"CZK"};
goog.i18n.NumberFormatSymbols_cs_CZ = goog.i18n.NumberFormatSymbols_cs;
goog.i18n.NumberFormatSymbols_cy = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"GBP"};
goog.i18n.NumberFormatSymbols_cy_GB = goog.i18n.NumberFormatSymbols_cy;
goog.i18n.NumberFormatSymbols_da = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"DKK"};
goog.i18n.NumberFormatSymbols_da_DK = goog.i18n.NumberFormatSymbols_da;
goog.i18n.NumberFormatSymbols_da_GL = goog.i18n.NumberFormatSymbols_da;
goog.i18n.NumberFormatSymbols_de = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_de_AT = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_de_BE = goog.i18n.NumberFormatSymbols_de;
goog.i18n.NumberFormatSymbols_de_CH = {DECIMAL_SEP:".", GROUP_SEP:"'", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00;\u00a4-#,##0.00", DEF_CURRENCY_CODE:"CHF"};
goog.i18n.NumberFormatSymbols_de_DE = goog.i18n.NumberFormatSymbols_de;
goog.i18n.NumberFormatSymbols_de_LU = goog.i18n.NumberFormatSymbols_de;
goog.i18n.NumberFormatSymbols_el = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"e", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_el_GR = goog.i18n.NumberFormatSymbols_el;
goog.i18n.NumberFormatSymbols_en = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"USD"};
goog.i18n.NumberFormatSymbols_en_001 = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_AS = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_AU = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"AUD"};
goog.i18n.NumberFormatSymbols_en_DG = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_FM = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_GB = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"GBP"};
goog.i18n.NumberFormatSymbols_en_GU = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_IE = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_en_IN = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_en_IO = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_MH = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_MP = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_PR = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_PW = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_SG = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"SGD"};
goog.i18n.NumberFormatSymbols_en_TC = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_UM = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_US = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_VG = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_VI = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_en_ZA = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"ZAR"};
goog.i18n.NumberFormatSymbols_en_ZW = goog.i18n.NumberFormatSymbols_en;
goog.i18n.NumberFormatSymbols_es = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_es_419 = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"MXN"};
goog.i18n.NumberFormatSymbols_es_EA = goog.i18n.NumberFormatSymbols_es;
goog.i18n.NumberFormatSymbols_es_ES = goog.i18n.NumberFormatSymbols_es;
goog.i18n.NumberFormatSymbols_es_IC = goog.i18n.NumberFormatSymbols_es;
goog.i18n.NumberFormatSymbols_et = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"\u00d710^", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_et_EE = goog.i18n.NumberFormatSymbols_et;
goog.i18n.NumberFormatSymbols_eu = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"%\u00a0#,##0", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_eu_ES = goog.i18n.NumberFormatSymbols_eu;
goog.i18n.NumberFormatSymbols_fa = {DECIMAL_SEP:"\u066b", GROUP_SEP:"\u066c", PERCENT:"\u066a", ZERO_DIGIT:"\u06f0", PLUS_SIGN:"\u200e+\u200e", MINUS_SIGN:"\u200e\u2212", EXP_SYMBOL:"\u00d7\u06f1\u06f0^", PERMILL:"\u0609", INFINITY:"\u221e", NAN:"\u0646\u0627\u0639\u062f\u062f", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u200e\u00a4#,##0.00", DEF_CURRENCY_CODE:"IRR"};
goog.i18n.NumberFormatSymbols_fa_IR = goog.i18n.NumberFormatSymbols_fa;
goog.i18n.NumberFormatSymbols_fi = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"\u2212", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"ep\u00e4luku", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_fi_FI = goog.i18n.NumberFormatSymbols_fi;
goog.i18n.NumberFormatSymbols_fil = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"PHP"};
goog.i18n.NumberFormatSymbols_fil_PH = goog.i18n.NumberFormatSymbols_fil;
goog.i18n.NumberFormatSymbols_fr = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_fr_BL = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_CA = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"CAD"};
goog.i18n.NumberFormatSymbols_fr_FR = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_GF = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_GP = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_MC = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_MF = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_MQ = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_PM = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_RE = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_fr_YT = goog.i18n.NumberFormatSymbols_fr;
goog.i18n.NumberFormatSymbols_gl = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_gl_ES = goog.i18n.NumberFormatSymbols_gl;
goog.i18n.NumberFormatSymbols_gsw = {DECIMAL_SEP:".", GROUP_SEP:"\u2019", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"\u2212", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"CHF"};
goog.i18n.NumberFormatSymbols_gsw_CH = goog.i18n.NumberFormatSymbols_gsw;
goog.i18n.NumberFormatSymbols_gsw_LI = goog.i18n.NumberFormatSymbols_gsw;
goog.i18n.NumberFormatSymbols_gu = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"\u00a4#,##,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_gu_IN = goog.i18n.NumberFormatSymbols_gu;
goog.i18n.NumberFormatSymbols_haw = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"USD"};
goog.i18n.NumberFormatSymbols_haw_US = goog.i18n.NumberFormatSymbols_haw;
goog.i18n.NumberFormatSymbols_he = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"\u200e+", MINUS_SIGN:"\u200e-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"ILS"};
goog.i18n.NumberFormatSymbols_he_IL = goog.i18n.NumberFormatSymbols_he;
goog.i18n.NumberFormatSymbols_hi = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"\u00a4#,##,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_hi_IN = goog.i18n.NumberFormatSymbols_hi;
goog.i18n.NumberFormatSymbols_hr = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"HRK"};
goog.i18n.NumberFormatSymbols_hr_HR = goog.i18n.NumberFormatSymbols_hr;
goog.i18n.NumberFormatSymbols_hu = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"HUF"};
goog.i18n.NumberFormatSymbols_hu_HU = goog.i18n.NumberFormatSymbols_hu;
goog.i18n.NumberFormatSymbols_hy = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#0%", CURRENCY_PATTERN:"#0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"AMD"};
goog.i18n.NumberFormatSymbols_hy_AM = goog.i18n.NumberFormatSymbols_hy;
goog.i18n.NumberFormatSymbols_id = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"IDR"};
goog.i18n.NumberFormatSymbols_id_ID = goog.i18n.NumberFormatSymbols_id;
goog.i18n.NumberFormatSymbols_in = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"IDR"};
goog.i18n.NumberFormatSymbols_is = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"ISK"};
goog.i18n.NumberFormatSymbols_is_IS = goog.i18n.NumberFormatSymbols_is;
goog.i18n.NumberFormatSymbols_it = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_it_IT = goog.i18n.NumberFormatSymbols_it;
goog.i18n.NumberFormatSymbols_it_SM = goog.i18n.NumberFormatSymbols_it;
goog.i18n.NumberFormatSymbols_iw = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"\u200e+", MINUS_SIGN:"\u200e-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"ILS"};
goog.i18n.NumberFormatSymbols_ja = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"JPY"};
goog.i18n.NumberFormatSymbols_ja_JP = goog.i18n.NumberFormatSymbols_ja;
goog.i18n.NumberFormatSymbols_ka = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u10d0\u10e0\u00a0\u10d0\u10e0\u10d8\u10e1\u00a0\u10e0\u10d8\u10ea\u10ee\u10d5\u10d8", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"GEL"};
goog.i18n.NumberFormatSymbols_ka_GE = goog.i18n.NumberFormatSymbols_ka;
goog.i18n.NumberFormatSymbols_kk = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"KZT"};
goog.i18n.NumberFormatSymbols_kk_Cyrl_KZ = goog.i18n.NumberFormatSymbols_kk;
goog.i18n.NumberFormatSymbols_km = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"KHR"};
goog.i18n.NumberFormatSymbols_km_KH = goog.i18n.NumberFormatSymbols_km;
goog.i18n.NumberFormatSymbols_kn = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"\u0c88", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_kn_IN = goog.i18n.NumberFormatSymbols_kn;
goog.i18n.NumberFormatSymbols_ko = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"KRW"};
goog.i18n.NumberFormatSymbols_ko_KR = goog.i18n.NumberFormatSymbols_ko;
goog.i18n.NumberFormatSymbols_ky = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u0441\u0430\u043d\u00a0\u044d\u043c\u0435\u0441", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"KGS"};
goog.i18n.NumberFormatSymbols_ky_Cyrl_KG = goog.i18n.NumberFormatSymbols_ky;
goog.i18n.NumberFormatSymbols_ln = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"CDF"};
goog.i18n.NumberFormatSymbols_ln_CD = goog.i18n.NumberFormatSymbols_ln;
goog.i18n.NumberFormatSymbols_lo = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u0e9a\u0ecd\u0ec8\u0ec1\u0ea1\u0ec8\u0e99\u0ec2\u0e95\u0ec0\u0ea5\u0e81", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00;\u00a4-#,##0.00", DEF_CURRENCY_CODE:"LAK"};
goog.i18n.NumberFormatSymbols_lo_LA = goog.i18n.NumberFormatSymbols_lo;
goog.i18n.NumberFormatSymbols_lt = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"\u2212", EXP_SYMBOL:"\u00d710^", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"LTL"};
goog.i18n.NumberFormatSymbols_lt_LT = goog.i18n.NumberFormatSymbols_lt;
goog.i18n.NumberFormatSymbols_lv = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"nav\u00a0skaitlis", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_lv_LV = goog.i18n.NumberFormatSymbols_lv;
goog.i18n.NumberFormatSymbols_mk = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"MKD"};
goog.i18n.NumberFormatSymbols_mk_MK = goog.i18n.NumberFormatSymbols_mk;
goog.i18n.NumberFormatSymbols_ml = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"#,##,##0.00\u00a4", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_ml_IN = goog.i18n.NumberFormatSymbols_ml;
goog.i18n.NumberFormatSymbols_mn = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"MNT"};
goog.i18n.NumberFormatSymbols_mn_Cyrl_MN = goog.i18n.NumberFormatSymbols_mn;
goog.i18n.NumberFormatSymbols_mr = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"\u0966", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"[#E0]", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_mr_IN = goog.i18n.NumberFormatSymbols_mr;
goog.i18n.NumberFormatSymbols_ms = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"MYR"};
goog.i18n.NumberFormatSymbols_ms_Latn_MY = goog.i18n.NumberFormatSymbols_ms;
goog.i18n.NumberFormatSymbols_mt = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_mt_MT = goog.i18n.NumberFormatSymbols_mt;
goog.i18n.NumberFormatSymbols_my = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"\u1040", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u1002\u100f\u1014\u103a\u1038\u1019\u101f\u102f\u1010\u103a\u101e\u1031\u102c", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"MMK"};
goog.i18n.NumberFormatSymbols_my_MM = goog.i18n.NumberFormatSymbols_my;
goog.i18n.NumberFormatSymbols_nb = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"\u2212", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"NOK"};
goog.i18n.NumberFormatSymbols_nb_NO = goog.i18n.NumberFormatSymbols_nb;
goog.i18n.NumberFormatSymbols_nb_SJ = goog.i18n.NumberFormatSymbols_nb;
goog.i18n.NumberFormatSymbols_ne = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"\u0966", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"NPR"};
goog.i18n.NumberFormatSymbols_ne_NP = goog.i18n.NumberFormatSymbols_ne;
goog.i18n.NumberFormatSymbols_nl = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00;\u00a4\u00a0#,##0.00-", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_nl_NL = goog.i18n.NumberFormatSymbols_nl;
goog.i18n.NumberFormatSymbols_no = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"\u2212", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"NOK"};
goog.i18n.NumberFormatSymbols_no_NO = goog.i18n.NumberFormatSymbols_no;
goog.i18n.NumberFormatSymbols_or = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_or_IN = goog.i18n.NumberFormatSymbols_or;
goog.i18n.NumberFormatSymbols_pa = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"\u00a4#,##,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_pa_Guru_IN = goog.i18n.NumberFormatSymbols_pa;
goog.i18n.NumberFormatSymbols_pl = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"PLN"};
goog.i18n.NumberFormatSymbols_pl_PL = goog.i18n.NumberFormatSymbols_pl;
goog.i18n.NumberFormatSymbols_pt = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"BRL"};
goog.i18n.NumberFormatSymbols_pt_BR = goog.i18n.NumberFormatSymbols_pt;
goog.i18n.NumberFormatSymbols_pt_PT = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_ro = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"RON"};
goog.i18n.NumberFormatSymbols_ro_RO = goog.i18n.NumberFormatSymbols_ro;
goog.i18n.NumberFormatSymbols_ru = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u043d\u0435\u00a0\u0447\u0438\u0441\u043b\u043e", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"RUB"};
goog.i18n.NumberFormatSymbols_ru_RU = goog.i18n.NumberFormatSymbols_ru;
goog.i18n.NumberFormatSymbols_si = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"LKR"};
goog.i18n.NumberFormatSymbols_si_LK = goog.i18n.NumberFormatSymbols_si;
goog.i18n.NumberFormatSymbols_sk = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_sk_SK = goog.i18n.NumberFormatSymbols_sk;
goog.i18n.NumberFormatSymbols_sl = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"e", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"EUR"};
goog.i18n.NumberFormatSymbols_sl_SI = goog.i18n.NumberFormatSymbols_sl;
goog.i18n.NumberFormatSymbols_sq = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"ALL"};
goog.i18n.NumberFormatSymbols_sq_AL = goog.i18n.NumberFormatSymbols_sq;
goog.i18n.NumberFormatSymbols_sr = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"RSD"};
goog.i18n.NumberFormatSymbols_sr_Cyrl_RS = goog.i18n.NumberFormatSymbols_sr;
goog.i18n.NumberFormatSymbols_sv = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"\u2212", EXP_SYMBOL:"\u00d710^", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u00a4\u00a4\u00a4", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0\u00a0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"SEK"};
goog.i18n.NumberFormatSymbols_sv_SE = goog.i18n.NumberFormatSymbols_sv;
goog.i18n.NumberFormatSymbols_sw = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"TZS"};
goog.i18n.NumberFormatSymbols_sw_TZ = goog.i18n.NumberFormatSymbols_sw;
goog.i18n.NumberFormatSymbols_ta = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_ta_IN = goog.i18n.NumberFormatSymbols_ta;
goog.i18n.NumberFormatSymbols_te = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"INR"};
goog.i18n.NumberFormatSymbols_te_IN = goog.i18n.NumberFormatSymbols_te;
goog.i18n.NumberFormatSymbols_th = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"THB"};
goog.i18n.NumberFormatSymbols_th_TH = goog.i18n.NumberFormatSymbols_th;
goog.i18n.NumberFormatSymbols_tl = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"PHP"};
goog.i18n.NumberFormatSymbols_tr = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"%#,##0", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"TRY"};
goog.i18n.NumberFormatSymbols_tr_TR = goog.i18n.NumberFormatSymbols_tr;
goog.i18n.NumberFormatSymbols_uk = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"\u0415", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u041d\u0435\u00a0\u0447\u0438\u0441\u043b\u043e", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"UAH"};
goog.i18n.NumberFormatSymbols_uk_UA = goog.i18n.NumberFormatSymbols_uk;
goog.i18n.NumberFormatSymbols_ur = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"\u200e+", MINUS_SIGN:"\u200e-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00\u200e", DEF_CURRENCY_CODE:"PKR"};
goog.i18n.NumberFormatSymbols_ur_PK = goog.i18n.NumberFormatSymbols_ur;
goog.i18n.NumberFormatSymbols_uz = {DECIMAL_SEP:",", GROUP_SEP:"\u00a0", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"UZS"};
goog.i18n.NumberFormatSymbols_uz_Latn_UZ = goog.i18n.NumberFormatSymbols_uz;
goog.i18n.NumberFormatSymbols_vi = {DECIMAL_SEP:",", GROUP_SEP:".", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"#,##0.00\u00a0\u00a4", DEF_CURRENCY_CODE:"VND"};
goog.i18n.NumberFormatSymbols_vi_VN = goog.i18n.NumberFormatSymbols_vi;
goog.i18n.NumberFormatSymbols_zh = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4\u00a0#,##0.00", DEF_CURRENCY_CODE:"CNY"};
goog.i18n.NumberFormatSymbols_zh_CN = goog.i18n.NumberFormatSymbols_zh;
goog.i18n.NumberFormatSymbols_zh_HK = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u975e\u6578\u503c", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"HKD"};
goog.i18n.NumberFormatSymbols_zh_Hans_CN = goog.i18n.NumberFormatSymbols_zh;
goog.i18n.NumberFormatSymbols_zh_TW = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"\u975e\u6578\u503c", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"TWD"};
goog.i18n.NumberFormatSymbols_zu = {DECIMAL_SEP:".", GROUP_SEP:",", PERCENT:"%", ZERO_DIGIT:"0", PLUS_SIGN:"+", MINUS_SIGN:"-", EXP_SYMBOL:"E", PERMILL:"\u2030", INFINITY:"\u221e", NAN:"I-NaN", DECIMAL_PATTERN:"#,##0.###", SCIENTIFIC_PATTERN:"#E0", PERCENT_PATTERN:"#,##0%", CURRENCY_PATTERN:"\u00a4#,##0.00", DEF_CURRENCY_CODE:"ZAR"};
goog.i18n.NumberFormatSymbols_zu_ZA = goog.i18n.NumberFormatSymbols_zu;
goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
"af" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_af);
if ("af_ZA" == goog.LOCALE || "af-ZA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_af;
}
"am" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_am);
if ("am_ET" == goog.LOCALE || "am-ET" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_am;
}
"ar" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ar);
if ("ar_001" == goog.LOCALE || "ar-001" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ar;
}
"az" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_az);
if ("az_Cyrl_AZ" == goog.LOCALE || "az-Cyrl-AZ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_az;
}
if ("az_Latn_AZ" == goog.LOCALE || "az-Latn-AZ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_az;
}
"bg" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bg);
if ("bg_BG" == goog.LOCALE || "bg-BG" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bg;
}
"bn" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bn);
if ("bn_BD" == goog.LOCALE || "bn-BD" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bn;
}
"br" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_br);
if ("br_FR" == goog.LOCALE || "br-FR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_br;
}
"ca" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ca);
if ("ca_AD" == goog.LOCALE || "ca-AD" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ca;
}
if ("ca_ES" == goog.LOCALE || "ca-ES" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ca;
}
if ("ca_ES_VALENCIA" == goog.LOCALE || "ca-ES-VALENCIA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ca;
}
if ("ca_FR" == goog.LOCALE || "ca-FR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ca;
}
if ("ca_IT" == goog.LOCALE || "ca-IT" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ca;
}
"chr" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_chr);
if ("chr_US" == goog.LOCALE || "chr-US" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_chr;
}
"cs" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_cs);
if ("cs_CZ" == goog.LOCALE || "cs-CZ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_cs;
}
"cy" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_cy);
if ("cy_GB" == goog.LOCALE || "cy-GB" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_cy;
}
"da" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_da);
if ("da_DK" == goog.LOCALE || "da-DK" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_da;
}
if ("da_GL" == goog.LOCALE || "da-GL" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_da;
}
"de" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de);
if ("de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de_AT;
}
if ("de_BE" == goog.LOCALE || "de-BE" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de;
}
if ("de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de_CH;
}
if ("de_DE" == goog.LOCALE || "de-DE" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de;
}
if ("de_LU" == goog.LOCALE || "de-LU" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de;
}
"el" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_el);
if ("el_GR" == goog.LOCALE || "el-GR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_el;
}
"en" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en);
if ("en_001" == goog.LOCALE || "en-001" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_AS" == goog.LOCALE || "en-AS" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_AU" == goog.LOCALE || "en-AU" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_AU;
}
if ("en_DG" == goog.LOCALE || "en-DG" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_FM" == goog.LOCALE || "en-FM" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_GB" == goog.LOCALE || "en-GB" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_GB;
}
if ("en_GU" == goog.LOCALE || "en-GU" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_IE;
}
if ("en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_IN;
}
if ("en_IO" == goog.LOCALE || "en-IO" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_MH" == goog.LOCALE || "en-MH" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_MP" == goog.LOCALE || "en-MP" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_PR" == goog.LOCALE || "en-PR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_PW" == goog.LOCALE || "en-PW" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_SG;
}
if ("en_TC" == goog.LOCALE || "en-TC" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_UM" == goog.LOCALE || "en-UM" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_US" == goog.LOCALE || "en-US" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_VG" == goog.LOCALE || "en-VG" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_VI" == goog.LOCALE || "en-VI" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
if ("en_ZA" == goog.LOCALE || "en-ZA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_ZA;
}
if ("en_ZW" == goog.LOCALE || "en-ZW" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}
"es" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es);
if ("es_419" == goog.LOCALE || "es-419" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es_419;
}
if ("es_EA" == goog.LOCALE || "es-EA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es;
}
if ("es_ES" == goog.LOCALE || "es-ES" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es;
}
if ("es_IC" == goog.LOCALE || "es-IC" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es;
}
"et" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_et);
if ("et_EE" == goog.LOCALE || "et-EE" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_et;
}
"eu" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_eu);
if ("eu_ES" == goog.LOCALE || "eu-ES" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_eu;
}
"fa" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fa);
if ("fa_IR" == goog.LOCALE || "fa-IR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fa;
}
"fi" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fi);
if ("fi_FI" == goog.LOCALE || "fi-FI" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fi;
}
"fil" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fil);
if ("fil_PH" == goog.LOCALE || "fil-PH" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fil;
}
"fr" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr);
if ("fr_BL" == goog.LOCALE || "fr-BL" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr_CA;
}
if ("fr_FR" == goog.LOCALE || "fr-FR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_GF" == goog.LOCALE || "fr-GF" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_GP" == goog.LOCALE || "fr-GP" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_MC" == goog.LOCALE || "fr-MC" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_MF" == goog.LOCALE || "fr-MF" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_MQ" == goog.LOCALE || "fr-MQ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_PM" == goog.LOCALE || "fr-PM" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_RE" == goog.LOCALE || "fr-RE" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
if ("fr_YT" == goog.LOCALE || "fr-YT" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}
"gl" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gl);
if ("gl_ES" == goog.LOCALE || "gl-ES" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gl;
}
"gsw" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gsw);
if ("gsw_CH" == goog.LOCALE || "gsw-CH" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gsw;
}
if ("gsw_LI" == goog.LOCALE || "gsw-LI" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gsw;
}
"gu" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gu);
if ("gu_IN" == goog.LOCALE || "gu-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gu;
}
"haw" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_haw);
if ("haw_US" == goog.LOCALE || "haw-US" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_haw;
}
"he" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_he);
if ("he_IL" == goog.LOCALE || "he-IL" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_he;
}
"hi" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hi);
if ("hi_IN" == goog.LOCALE || "hi-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hi;
}
"hr" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hr);
if ("hr_HR" == goog.LOCALE || "hr-HR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hr;
}
"hu" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hu);
if ("hu_HU" == goog.LOCALE || "hu-HU" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hu;
}
"hy" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hy);
if ("hy_AM" == goog.LOCALE || "hy-AM" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hy;
}
"id" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_id);
if ("id_ID" == goog.LOCALE || "id-ID" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_id;
}
"in" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_in);
"is" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_is);
if ("is_IS" == goog.LOCALE || "is-IS" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_is;
}
"it" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_it);
if ("it_IT" == goog.LOCALE || "it-IT" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_it;
}
if ("it_SM" == goog.LOCALE || "it-SM" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_it;
}
"iw" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_iw);
"ja" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ja);
if ("ja_JP" == goog.LOCALE || "ja-JP" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ja;
}
"ka" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ka);
if ("ka_GE" == goog.LOCALE || "ka-GE" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ka;
}
"kk" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_kk);
if ("kk_Cyrl_KZ" == goog.LOCALE || "kk-Cyrl-KZ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_kk;
}
"km" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_km);
if ("km_KH" == goog.LOCALE || "km-KH" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_km;
}
"kn" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_kn);
if ("kn_IN" == goog.LOCALE || "kn-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_kn;
}
"ko" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ko);
if ("ko_KR" == goog.LOCALE || "ko-KR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ko;
}
"ky" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ky);
if ("ky_Cyrl_KG" == goog.LOCALE || "ky-Cyrl-KG" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ky;
}
"ln" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ln);
if ("ln_CD" == goog.LOCALE || "ln-CD" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ln;
}
"lo" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lo);
if ("lo_LA" == goog.LOCALE || "lo-LA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lo;
}
"lt" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lt);
if ("lt_LT" == goog.LOCALE || "lt-LT" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lt;
}
"lv" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lv);
if ("lv_LV" == goog.LOCALE || "lv-LV" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lv;
}
"mk" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mk);
if ("mk_MK" == goog.LOCALE || "mk-MK" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mk;
}
"ml" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ml);
if ("ml_IN" == goog.LOCALE || "ml-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ml;
}
"mn" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mn);
if ("mn_Cyrl_MN" == goog.LOCALE || "mn-Cyrl-MN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mn;
}
"mr" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mr);
if ("mr_IN" == goog.LOCALE || "mr-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mr;
}
"ms" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ms);
if ("ms_Latn_MY" == goog.LOCALE || "ms-Latn-MY" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ms;
}
"mt" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mt);
if ("mt_MT" == goog.LOCALE || "mt-MT" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mt;
}
"my" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_my);
if ("my_MM" == goog.LOCALE || "my-MM" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_my;
}
"nb" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_nb);
if ("nb_NO" == goog.LOCALE || "nb-NO" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_nb;
}
if ("nb_SJ" == goog.LOCALE || "nb-SJ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_nb;
}
"ne" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ne);
if ("ne_NP" == goog.LOCALE || "ne-NP" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ne;
}
"nl" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_nl);
if ("nl_NL" == goog.LOCALE || "nl-NL" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_nl;
}
"no" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_no);
if ("no_NO" == goog.LOCALE || "no-NO" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_no;
}
"or" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_or);
if ("or_IN" == goog.LOCALE || "or-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_or;
}
"pa" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pa);
if ("pa_Guru_IN" == goog.LOCALE || "pa-Guru-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pa;
}
"pl" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pl);
if ("pl_PL" == goog.LOCALE || "pl-PL" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pl;
}
"pt" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pt);
if ("pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pt;
}
if ("pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pt_PT;
}
"ro" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ro);
if ("ro_RO" == goog.LOCALE || "ro-RO" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ro;
}
"ru" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ru);
if ("ru_RU" == goog.LOCALE || "ru-RU" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ru;
}
"si" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_si);
if ("si_LK" == goog.LOCALE || "si-LK" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_si;
}
"sk" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sk);
if ("sk_SK" == goog.LOCALE || "sk-SK" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sk;
}
"sl" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sl);
if ("sl_SI" == goog.LOCALE || "sl-SI" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sl;
}
"sq" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sq);
if ("sq_AL" == goog.LOCALE || "sq-AL" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sq;
}
"sr" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sr);
if ("sr_Cyrl_RS" == goog.LOCALE || "sr-Cyrl-RS" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sr;
}
"sv" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sv);
if ("sv_SE" == goog.LOCALE || "sv-SE" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sv;
}
"sw" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sw);
if ("sw_TZ" == goog.LOCALE || "sw-TZ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sw;
}
"ta" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ta);
if ("ta_IN" == goog.LOCALE || "ta-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ta;
}
"te" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_te);
if ("te_IN" == goog.LOCALE || "te-IN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_te;
}
"th" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_th);
if ("th_TH" == goog.LOCALE || "th-TH" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_th;
}
"tl" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_tl);
"tr" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_tr);
if ("tr_TR" == goog.LOCALE || "tr-TR" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_tr;
}
"uk" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_uk);
if ("uk_UA" == goog.LOCALE || "uk-UA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_uk;
}
"ur" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ur);
if ("ur_PK" == goog.LOCALE || "ur-PK" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ur;
}
"uz" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_uz);
if ("uz_Latn_UZ" == goog.LOCALE || "uz-Latn-UZ" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_uz;
}
"vi" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_vi);
if ("vi_VN" == goog.LOCALE || "vi-VN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_vi;
}
"zh" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh);
if ("zh_CN" == goog.LOCALE || "zh-CN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh;
}
if ("zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh_HK;
}
if ("zh_Hans_CN" == goog.LOCALE || "zh-Hans-CN" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh;
}
if ("zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh_TW;
}
"zu" == goog.LOCALE && (goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zu);
if ("zu_ZA" == goog.LOCALE || "zu-ZA" == goog.LOCALE) {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zu;
}
;
// INPUT (javascript/closure/i18n/numberformat.js)
goog.i18n.NumberFormat = function(pattern, opt_currency, opt_currencyStyle) {
  this.intlCurrencyCode_ = opt_currency || goog.i18n.NumberFormatSymbols.DEF_CURRENCY_CODE;
  this.currencyStyle_ = opt_currencyStyle || goog.i18n.NumberFormat.CurrencyStyle.LOCAL;
  this.maximumIntegerDigits_ = 40;
  this.minimumIntegerDigits_ = 1;
  this.significantDigits_ = 0;
  this.maximumFractionDigits_ = 3;
  this.minExponentDigits_ = this.minimumFractionDigits_ = 0;
  this.showTrailingZeros_ = this.useSignForPositiveExponent_ = !1;
  this.positiveSuffix_ = this.positivePrefix_ = "";
  this.negativePrefix_ = "-";
  this.negativeSuffix_ = "";
  this.multiplier_ = 1;
  this.groupingSize_ = 3;
  this.useExponentialNotation_ = this.decimalSeparatorAlwaysShown_ = !1;
  this.compactStyle_ = goog.i18n.NumberFormat.CompactStyle.NONE;
  this.baseFormattingNumber_ = null;
  "number" == typeof pattern ? this.applyStandardPattern_(pattern) : this.applyPattern_(pattern);
};
goog.i18n.NumberFormat.Format = {DECIMAL:1, SCIENTIFIC:2, PERCENT:3, CURRENCY:4, COMPACT_SHORT:5, COMPACT_LONG:6};
goog.i18n.NumberFormat.CurrencyStyle = {LOCAL:0, PORTABLE:1, GLOBAL:2};
goog.i18n.NumberFormat.CompactStyle = {NONE:0, SHORT:1, LONG:2};
goog.i18n.NumberFormat.enforceAsciiDigits_ = !1;
goog.i18n.NumberFormat.setEnforceAsciiDigits = function(doEnforce) {
  goog.i18n.NumberFormat.enforceAsciiDigits_ = doEnforce;
};
goog.i18n.NumberFormat.isEnforceAsciiDigits = function() {
  return goog.i18n.NumberFormat.enforceAsciiDigits_;
};
goog.i18n.NumberFormat.prototype.setMinimumFractionDigits = function(min) {
  if (0 < this.significantDigits_ && 0 < min) {
    throw Error("Can't combine significant digits and minimum fraction digits");
  }
  this.minimumFractionDigits_ = min;
  return this;
};
goog.i18n.NumberFormat.prototype.setMaximumFractionDigits = function(max) {
  this.maximumFractionDigits_ = max;
  return this;
};
goog.i18n.NumberFormat.prototype.setSignificantDigits = function(number) {
  if (0 < this.minimumFractionDigits_ && 0 <= number) {
    throw Error("Can't combine significant digits and minimum fraction digits");
  }
  this.significantDigits_ = number;
  return this;
};
goog.i18n.NumberFormat.prototype.getSignificantDigits = function() {
  return this.significantDigits_;
};
goog.i18n.NumberFormat.prototype.setShowTrailingZeros = function(showTrailingZeros) {
  this.showTrailingZeros_ = showTrailingZeros;
  return this;
};
goog.i18n.NumberFormat.prototype.setBaseFormatting = function(baseFormattingNumber) {
  goog.asserts.assert(goog.isNull(baseFormattingNumber) || isFinite(baseFormattingNumber));
  this.baseFormattingNumber_ = baseFormattingNumber;
  return this;
};
goog.i18n.NumberFormat.prototype.getBaseFormatting = function() {
  return this.baseFormattingNumber_;
};
goog.i18n.NumberFormat.prototype.applyPattern_ = function(pattern) {
  this.pattern_ = pattern.replace(/ /g, "\u00a0");
  var pos = [0];
  this.positivePrefix_ = this.parseAffix_(pattern, pos);
  var trunkStart = pos[0];
  this.parseTrunk_(pattern, pos);
  var trunkLen = pos[0] - trunkStart;
  this.positiveSuffix_ = this.parseAffix_(pattern, pos);
  pos[0] < pattern.length && pattern.charAt(pos[0]) == goog.i18n.NumberFormat.PATTERN_SEPARATOR_ ? (pos[0]++, this.negativePrefix_ = this.parseAffix_(pattern, pos), pos[0] += trunkLen, this.negativeSuffix_ = this.parseAffix_(pattern, pos)) : (this.negativePrefix_ = this.positivePrefix_ + this.negativePrefix_, this.negativeSuffix_ += this.positiveSuffix_);
};
goog.i18n.NumberFormat.prototype.applyStandardPattern_ = function(patternType) {
  switch(patternType) {
    case goog.i18n.NumberFormat.Format.DECIMAL:
      this.applyPattern_(goog.i18n.NumberFormatSymbols.DECIMAL_PATTERN);
      break;
    case goog.i18n.NumberFormat.Format.SCIENTIFIC:
      this.applyPattern_(goog.i18n.NumberFormatSymbols.SCIENTIFIC_PATTERN);
      break;
    case goog.i18n.NumberFormat.Format.PERCENT:
      this.applyPattern_(goog.i18n.NumberFormatSymbols.PERCENT_PATTERN);
      break;
    case goog.i18n.NumberFormat.Format.CURRENCY:
      this.applyPattern_(goog.i18n.currency.adjustPrecision(goog.i18n.NumberFormatSymbols.CURRENCY_PATTERN, this.intlCurrencyCode_));
      break;
    case goog.i18n.NumberFormat.Format.COMPACT_SHORT:
      this.applyCompactStyle_(goog.i18n.NumberFormat.CompactStyle.SHORT);
      break;
    case goog.i18n.NumberFormat.Format.COMPACT_LONG:
      this.applyCompactStyle_(goog.i18n.NumberFormat.CompactStyle.LONG);
      break;
    default:
      throw Error("Unsupported pattern type.");;
  }
};
goog.i18n.NumberFormat.prototype.applyCompactStyle_ = function(style) {
  this.compactStyle_ = style;
  this.applyPattern_(goog.i18n.NumberFormatSymbols.DECIMAL_PATTERN);
  this.setMinimumFractionDigits(0);
  this.setMaximumFractionDigits(2);
  this.setSignificantDigits(2);
};
goog.i18n.NumberFormat.prototype.parse = function(text, opt_pos) {
  var pos = opt_pos || [0];
  if (this.compactStyle_ != goog.i18n.NumberFormat.CompactStyle.NONE) {
    throw Error("Parsing of compact numbers is unimplemented");
  }
  var ret = NaN;
  text = text.replace(/ /g, "\u00a0");
  var gotPositive = text.indexOf(this.positivePrefix_, pos[0]) == pos[0], gotNegative = text.indexOf(this.negativePrefix_, pos[0]) == pos[0];
  gotPositive && gotNegative && (this.positivePrefix_.length > this.negativePrefix_.length ? gotNegative = !1 : this.positivePrefix_.length < this.negativePrefix_.length && (gotPositive = !1));
  gotPositive ? pos[0] += this.positivePrefix_.length : gotNegative && (pos[0] += this.negativePrefix_.length);
  text.indexOf(goog.i18n.NumberFormatSymbols.INFINITY, pos[0]) == pos[0] ? (pos[0] += goog.i18n.NumberFormatSymbols.INFINITY.length, ret = Infinity) : ret = this.parseNumber_(text, pos);
  if (gotPositive) {
    if (text.indexOf(this.positiveSuffix_, pos[0]) != pos[0]) {
      return NaN;
    }
    pos[0] += this.positiveSuffix_.length;
  } else {
    if (gotNegative) {
      if (text.indexOf(this.negativeSuffix_, pos[0]) != pos[0]) {
        return NaN;
      }
      pos[0] += this.negativeSuffix_.length;
    }
  }
  return gotNegative ? -ret : ret;
};
goog.i18n.NumberFormat.prototype.parseNumber_ = function(text, pos) {
  var sawDecimal = !1, sawExponent = !1, sawDigit = !1, scale = 1, decimal = goog.i18n.NumberFormatSymbols.DECIMAL_SEP, grouping = goog.i18n.NumberFormatSymbols.GROUP_SEP, exponentChar = goog.i18n.NumberFormatSymbols.EXP_SYMBOL;
  if (this.compactStyle_ != goog.i18n.NumberFormat.CompactStyle.NONE) {
    throw Error("Parsing of compact style numbers is not implemented");
  }
  for (var normalizedText = "";pos[0] < text.length;pos[0]++) {
    var ch = text.charAt(pos[0]), digit = this.getDigit_(ch);
    if (0 <= digit && 9 >= digit) {
      normalizedText += digit, sawDigit = !0;
    } else {
      if (ch == decimal.charAt(0)) {
        if (sawDecimal || sawExponent) {
          break;
        }
        normalizedText += ".";
        sawDecimal = !0;
      } else {
        if (ch == grouping.charAt(0) && ("\u00a0" != grouping.charAt(0) || pos[0] + 1 < text.length && 0 <= this.getDigit_(text.charAt(pos[0] + 1)))) {
          if (sawDecimal || sawExponent) {
            break;
          }
        } else {
          if (ch == exponentChar.charAt(0)) {
            if (sawExponent) {
              break;
            }
            normalizedText += "E";
            sawExponent = !0;
          } else {
            if ("+" == ch || "-" == ch) {
              normalizedText += ch;
            } else {
              if (ch == goog.i18n.NumberFormatSymbols.PERCENT.charAt(0)) {
                if (1 != scale) {
                  break;
                }
                scale = 100;
                if (sawDigit) {
                  pos[0]++;
                  break;
                }
              } else {
                if (ch == goog.i18n.NumberFormatSymbols.PERMILL.charAt(0)) {
                  if (1 != scale) {
                    break;
                  }
                  scale = 1E3;
                  if (sawDigit) {
                    pos[0]++;
                    break;
                  }
                } else {
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
  return parseFloat(normalizedText) / scale;
};
goog.i18n.NumberFormat.prototype.format = function(number) {
  if (isNaN(number)) {
    return goog.i18n.NumberFormatSymbols.NAN;
  }
  var parts = [], baseFormattingNumber = goog.isNull(this.baseFormattingNumber_) ? number : this.baseFormattingNumber_, unit = this.getUnitAfterRounding_(baseFormattingNumber, number);
  number /= Math.pow(10, unit.divisorBase);
  parts.push(unit.prefix);
  var isNegative = 0 > number || 0 == number && 0 > 1 / number;
  parts.push(isNegative ? this.negativePrefix_ : this.positivePrefix_);
  isFinite(number) ? (number *= isNegative ? -1 : 1, number *= this.multiplier_, this.useExponentialNotation_ ? this.subformatExponential_(number, parts) : this.subformatFixed_(number, this.minimumIntegerDigits_, parts)) : parts.push(goog.i18n.NumberFormatSymbols.INFINITY);
  parts.push(isNegative ? this.negativeSuffix_ : this.positiveSuffix_);
  parts.push(unit.suffix);
  return parts.join("");
};
goog.i18n.NumberFormat.prototype.roundNumber_ = function(number) {
  var power = Math.pow(10, this.maximumFractionDigits_), shiftedNumber = 0 >= this.significantDigits_ ? Math.round(number * power) : Math.round(this.roundToSignificantDigits_(number * power, this.significantDigits_, this.maximumFractionDigits_)), intValue, fracValue;
  isFinite(shiftedNumber) ? (intValue = Math.floor(shiftedNumber / power), fracValue = Math.floor(shiftedNumber - intValue * power)) : (intValue = number, fracValue = 0);
  return{intValue:intValue, fracValue:fracValue};
};
goog.i18n.NumberFormat.prototype.subformatFixed_ = function(number, minIntDigits, parts) {
  if (this.minimumFractionDigits_ > this.maximumFractionDigits_) {
    throw Error("Min value must be less than max value");
  }
  var rounded = this.roundNumber_(number), power = Math.pow(10, this.maximumFractionDigits_), intValue = rounded.intValue, fracValue = rounded.fracValue, numIntDigits = 0 == intValue ? 0 : this.intLog10_(intValue) + 1, fractionPresent = 0 < this.minimumFractionDigits_ || 0 < fracValue || this.showTrailingZeros_ && numIntDigits < this.significantDigits_, minimumFractionDigits = this.minimumFractionDigits_;
  fractionPresent && (minimumFractionDigits = this.showTrailingZeros_ && 0 < this.significantDigits_ ? this.significantDigits_ - numIntDigits : this.minimumFractionDigits_);
  for (var intPart = "", translatableInt = intValue;1E20 < translatableInt;) {
    intPart = "0" + intPart, translatableInt = Math.round(translatableInt / 10);
  }
  var intPart = translatableInt + intPart, decimal = goog.i18n.NumberFormatSymbols.DECIMAL_SEP, grouping = goog.i18n.NumberFormatSymbols.GROUP_SEP, zeroCode = goog.i18n.NumberFormat.enforceAsciiDigits_ ? 48 : goog.i18n.NumberFormatSymbols.ZERO_DIGIT.charCodeAt(0), digitLen = intPart.length;
  if (0 < intValue || 0 < minIntDigits) {
    for (var i = digitLen;i < minIntDigits;i++) {
      parts.push(String.fromCharCode(zeroCode));
    }
    for (i = 0;i < digitLen;i++) {
      parts.push(String.fromCharCode(zeroCode + 1 * intPart.charAt(i))), 1 < digitLen - i && 0 < this.groupingSize_ && 1 == (digitLen - i) % this.groupingSize_ && parts.push(grouping);
    }
  } else {
    fractionPresent || parts.push(String.fromCharCode(zeroCode));
  }
  (this.decimalSeparatorAlwaysShown_ || fractionPresent) && parts.push(decimal);
  for (var fracPart = "" + (fracValue + power), fracLen = fracPart.length;"0" == fracPart.charAt(fracLen - 1) && fracLen > minimumFractionDigits + 1;) {
    fracLen--;
  }
  for (i = 1;i < fracLen;i++) {
    parts.push(String.fromCharCode(zeroCode + 1 * fracPart.charAt(i)));
  }
};
goog.i18n.NumberFormat.prototype.addExponentPart_ = function(exponent, parts) {
  parts.push(goog.i18n.NumberFormatSymbols.EXP_SYMBOL);
  0 > exponent ? (exponent = -exponent, parts.push(goog.i18n.NumberFormatSymbols.MINUS_SIGN)) : this.useSignForPositiveExponent_ && parts.push(goog.i18n.NumberFormatSymbols.PLUS_SIGN);
  for (var exponentDigits = "" + exponent, zeroChar = goog.i18n.NumberFormat.enforceAsciiDigits_ ? "0" : goog.i18n.NumberFormatSymbols.ZERO_DIGIT, i = exponentDigits.length;i < this.minExponentDigits_;i++) {
    parts.push(zeroChar);
  }
  parts.push(exponentDigits);
};
goog.i18n.NumberFormat.prototype.subformatExponential_ = function(number, parts) {
  if (0 == number) {
    this.subformatFixed_(number, this.minimumIntegerDigits_, parts), this.addExponentPart_(0, parts);
  } else {
    var exponent = goog.math.safeFloor(Math.log(number) / Math.log(10));
    number /= Math.pow(10, exponent);
    var minIntDigits = this.minimumIntegerDigits_;
    if (1 < this.maximumIntegerDigits_ && this.maximumIntegerDigits_ > this.minimumIntegerDigits_) {
      for (;0 != exponent % this.maximumIntegerDigits_;) {
        number *= 10, exponent--;
      }
      minIntDigits = 1;
    } else {
      1 > this.minimumIntegerDigits_ ? (exponent++, number /= 10) : (exponent -= this.minimumIntegerDigits_ - 1, number *= Math.pow(10, this.minimumIntegerDigits_ - 1));
    }
    this.subformatFixed_(number, minIntDigits, parts);
    this.addExponentPart_(exponent, parts);
  }
};
goog.i18n.NumberFormat.prototype.getDigit_ = function(ch) {
  var code = ch.charCodeAt(0);
  if (48 <= code && 58 > code) {
    return code - 48;
  }
  var zeroCode = goog.i18n.NumberFormatSymbols.ZERO_DIGIT.charCodeAt(0);
  return zeroCode <= code && code < zeroCode + 10 ? code - zeroCode : -1;
};
goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_ = "0";
goog.i18n.NumberFormat.PATTERN_GROUPING_SEPARATOR_ = ",";
goog.i18n.NumberFormat.PATTERN_DECIMAL_SEPARATOR_ = ".";
goog.i18n.NumberFormat.PATTERN_PER_MILLE_ = "\u2030";
goog.i18n.NumberFormat.PATTERN_PERCENT_ = "%";
goog.i18n.NumberFormat.PATTERN_DIGIT_ = "#";
goog.i18n.NumberFormat.PATTERN_SEPARATOR_ = ";";
goog.i18n.NumberFormat.PATTERN_EXPONENT_ = "E";
goog.i18n.NumberFormat.PATTERN_PLUS_ = "+";
goog.i18n.NumberFormat.PATTERN_MINUS_ = "-";
goog.i18n.NumberFormat.PATTERN_CURRENCY_SIGN_ = "\u00a4";
goog.i18n.NumberFormat.QUOTE_ = "'";
goog.i18n.NumberFormat.prototype.parseAffix_ = function(pattern, pos) {
  for (var affix = "", inQuote = !1, len = pattern.length;pos[0] < len;pos[0]++) {
    var ch = pattern.charAt(pos[0]);
    if (ch == goog.i18n.NumberFormat.QUOTE_) {
      pos[0] + 1 < len && pattern.charAt(pos[0] + 1) == goog.i18n.NumberFormat.QUOTE_ ? (pos[0]++, affix += "'") : inQuote = !inQuote;
    } else {
      if (inQuote) {
        affix += ch;
      } else {
        switch(ch) {
          case goog.i18n.NumberFormat.PATTERN_DIGIT_:
          ;
          case goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_:
          ;
          case goog.i18n.NumberFormat.PATTERN_GROUPING_SEPARATOR_:
          ;
          case goog.i18n.NumberFormat.PATTERN_DECIMAL_SEPARATOR_:
          ;
          case goog.i18n.NumberFormat.PATTERN_SEPARATOR_:
            return affix;
          case goog.i18n.NumberFormat.PATTERN_CURRENCY_SIGN_:
            if (pos[0] + 1 < len && pattern.charAt(pos[0] + 1) == goog.i18n.NumberFormat.PATTERN_CURRENCY_SIGN_) {
              pos[0]++, affix += this.intlCurrencyCode_;
            } else {
              switch(this.currencyStyle_) {
                case goog.i18n.NumberFormat.CurrencyStyle.LOCAL:
                  affix += goog.i18n.currency.getLocalCurrencySign(this.intlCurrencyCode_);
                  break;
                case goog.i18n.NumberFormat.CurrencyStyle.GLOBAL:
                  affix += goog.i18n.currency.getGlobalCurrencySign(this.intlCurrencyCode_);
                  break;
                case goog.i18n.NumberFormat.CurrencyStyle.PORTABLE:
                  affix += goog.i18n.currency.getPortableCurrencySign(this.intlCurrencyCode_);
              }
            }
            break;
          case goog.i18n.NumberFormat.PATTERN_PERCENT_:
            if (1 != this.multiplier_) {
              throw Error("Too many percent/permill");
            }
            this.multiplier_ = 100;
            affix += goog.i18n.NumberFormatSymbols.PERCENT;
            break;
          case goog.i18n.NumberFormat.PATTERN_PER_MILLE_:
            if (1 != this.multiplier_) {
              throw Error("Too many percent/permill");
            }
            this.multiplier_ = 1E3;
            affix += goog.i18n.NumberFormatSymbols.PERMILL;
            break;
          default:
            affix += ch;
        }
      }
    }
  }
  return affix;
};
goog.i18n.NumberFormat.prototype.parseTrunk_ = function(pattern, pos) {
  for (var decimalPos = -1, digitLeftCount = 0, zeroDigitCount = 0, digitRightCount = 0, groupingCount = -1, len = pattern.length, loop = !0;pos[0] < len && loop;pos[0]++) {
    var ch = pattern.charAt(pos[0]);
    switch(ch) {
      case goog.i18n.NumberFormat.PATTERN_DIGIT_:
        0 < zeroDigitCount ? digitRightCount++ : digitLeftCount++;
        0 <= groupingCount && 0 > decimalPos && groupingCount++;
        break;
      case goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_:
        if (0 < digitRightCount) {
          throw Error('Unexpected "0" in pattern "' + pattern + '"');
        }
        zeroDigitCount++;
        0 <= groupingCount && 0 > decimalPos && groupingCount++;
        break;
      case goog.i18n.NumberFormat.PATTERN_GROUPING_SEPARATOR_:
        groupingCount = 0;
        break;
      case goog.i18n.NumberFormat.PATTERN_DECIMAL_SEPARATOR_:
        if (0 <= decimalPos) {
          throw Error('Multiple decimal separators in pattern "' + pattern + '"');
        }
        decimalPos = digitLeftCount + zeroDigitCount + digitRightCount;
        break;
      case goog.i18n.NumberFormat.PATTERN_EXPONENT_:
        if (this.useExponentialNotation_) {
          throw Error('Multiple exponential symbols in pattern "' + pattern + '"');
        }
        this.useExponentialNotation_ = !0;
        this.minExponentDigits_ = 0;
        pos[0] + 1 < len && pattern.charAt(pos[0] + 1) == goog.i18n.NumberFormat.PATTERN_PLUS_ && (pos[0]++, this.useSignForPositiveExponent_ = !0);
        for (;pos[0] + 1 < len && pattern.charAt(pos[0] + 1) == goog.i18n.NumberFormat.PATTERN_ZERO_DIGIT_;) {
          pos[0]++, this.minExponentDigits_++;
        }
        if (1 > digitLeftCount + zeroDigitCount || 1 > this.minExponentDigits_) {
          throw Error('Malformed exponential pattern "' + pattern + '"');
        }
        loop = !1;
        break;
      default:
        pos[0]--, loop = !1;
    }
  }
  if (0 == zeroDigitCount && 0 < digitLeftCount && 0 <= decimalPos) {
    var n = decimalPos;
    0 == n && n++;
    digitRightCount = digitLeftCount - n;
    digitLeftCount = n - 1;
    zeroDigitCount = 1;
  }
  if (0 > decimalPos && 0 < digitRightCount || 0 <= decimalPos && (decimalPos < digitLeftCount || decimalPos > digitLeftCount + zeroDigitCount) || 0 == groupingCount) {
    throw Error('Malformed pattern "' + pattern + '"');
  }
  var totalDigits = digitLeftCount + zeroDigitCount + digitRightCount;
  this.maximumFractionDigits_ = 0 <= decimalPos ? totalDigits - decimalPos : 0;
  0 <= decimalPos && (this.minimumFractionDigits_ = digitLeftCount + zeroDigitCount - decimalPos, 0 > this.minimumFractionDigits_ && (this.minimumFractionDigits_ = 0));
  var effectiveDecimalPos = 0 <= decimalPos ? decimalPos : totalDigits;
  this.minimumIntegerDigits_ = effectiveDecimalPos - digitLeftCount;
  this.useExponentialNotation_ && (this.maximumIntegerDigits_ = digitLeftCount + this.minimumIntegerDigits_, 0 == this.maximumFractionDigits_ && 0 == this.minimumIntegerDigits_ && (this.minimumIntegerDigits_ = 1));
  this.groupingSize_ = Math.max(0, groupingCount);
  this.decimalSeparatorAlwaysShown_ = 0 == decimalPos || decimalPos == totalDigits;
};
goog.i18n.NumberFormat.NULL_UNIT_ = {prefix:"", suffix:"", divisorBase:0};
goog.i18n.NumberFormat.prototype.getUnitFor_ = function(base, plurality) {
  var table = this.compactStyle_ == goog.i18n.NumberFormat.CompactStyle.SHORT ? goog.i18n.CompactNumberFormatSymbols.COMPACT_DECIMAL_SHORT_PATTERN : goog.i18n.CompactNumberFormatSymbols.COMPACT_DECIMAL_LONG_PATTERN;
  if (3 > base) {
    return goog.i18n.NumberFormat.NULL_UNIT_;
  }
  base = Math.min(14, base);
  var patterns = table[Math.pow(10, base)];
  if (!patterns) {
    return goog.i18n.NumberFormat.NULL_UNIT_;
  }
  var pattern = patterns[plurality];
  if (!pattern || "0" == pattern) {
    return goog.i18n.NumberFormat.NULL_UNIT_;
  }
  var parts = /([^0]*)(0+)(.*)/.exec(pattern);
  return parts ? {prefix:parts[1], suffix:parts[3], divisorBase:base - (parts[2].length - 1)} : goog.i18n.NumberFormat.NULL_UNIT_;
};
goog.i18n.NumberFormat.prototype.getUnitAfterRounding_ = function(formattingNumber, pluralityNumber) {
  if (this.compactStyle_ == goog.i18n.NumberFormat.CompactStyle.NONE) {
    return goog.i18n.NumberFormat.NULL_UNIT_;
  }
  formattingNumber = Math.abs(formattingNumber);
  pluralityNumber = Math.abs(pluralityNumber);
  var initialPlurality = this.pluralForm_(formattingNumber), base = 1 >= formattingNumber ? 0 : this.intLog10_(formattingNumber), initialDivisor = this.getUnitFor_(base, initialPlurality).divisorBase, pluralityAttempt = pluralityNumber / Math.pow(10, initialDivisor), pluralityRounded = this.roundNumber_(pluralityAttempt), formattingAttempt = formattingNumber / Math.pow(10, initialDivisor), formattingRounded = this.roundNumber_(formattingAttempt), finalPlurality = this.pluralForm_(pluralityRounded.intValue + 
  pluralityRounded.fracValue);
  return this.getUnitFor_(initialDivisor + this.intLog10_(formattingRounded.intValue), finalPlurality);
};
goog.i18n.NumberFormat.prototype.intLog10_ = function(number) {
  for (var i = 0;1 <= (number /= 10);) {
    i++;
  }
  return i;
};
goog.i18n.NumberFormat.prototype.roundToSignificantDigits_ = function(number, significantDigits, scale) {
  if (!number) {
    return number;
  }
  var digits = this.intLog10_(number), magnitude = significantDigits - digits - 1;
  if (magnitude < -scale) {
    var point = Math.pow(10, scale);
    return Math.round(number / point) * point;
  }
  var power = Math.pow(10, magnitude), shifted = Math.round(number * power);
  return shifted / power;
};
goog.i18n.NumberFormat.prototype.pluralForm_ = function() {
  return "other";
};
goog.i18n.NumberFormat.prototype.isCurrencyCodeBeforeValue = function() {
  var posCurrSymbol = this.pattern_.indexOf("\u00a4"), posPound = this.pattern_.indexOf("#"), posZero = this.pattern_.indexOf("0"), posCurrValue = Number.MAX_VALUE;
  0 <= posPound && posPound < posCurrValue && (posCurrValue = posPound);
  0 <= posZero && posZero < posCurrValue && (posCurrValue = posZero);
  return posCurrSymbol < posCurrValue;
};
// INPUT (javascript/gviz/devel/jsapi/common/i18n/i18n.js)
gviz.i18n = {};
gviz.USE_I18N_SHIM = !1;
gviz.i18n.DateTimeFormat = gviz.USE_I18N_SHIM ? charts.i18n.DateTimeFormat : goog.i18n.DateTimeFormat;
gviz.i18n.DateTimeFormat.prototype.format = gviz.USE_I18N_SHIM ? charts.i18n.DateTimeFormat.prototype.format : goog.i18n.DateTimeFormat.prototype.format;
gviz.i18n.DateTimeFormat.Format = gviz.USE_I18N_SHIM ? charts.i18n.DateTimeFormat.Format : goog.i18n.DateTimeFormat.Format;
gviz.i18n.DateTimePatterns = gviz.USE_I18N_SHIM ? charts.i18n.DateTimePatterns : goog.i18n.DateTimePatterns;
gviz.i18n.DateTimeSymbols = gviz.USE_I18N_SHIM ? charts.i18n.DateTimeSymbols : goog.i18n.DateTimeSymbols;
gviz.i18n.NumberFormat = gviz.USE_I18N_SHIM ? charts.i18n.NumberFormat : goog.i18n.NumberFormat;
gviz.i18n.NumberFormat.Format = gviz.USE_I18N_SHIM ? charts.i18n.NumberFormat.Format : goog.i18n.NumberFormat.Format;
gviz.i18n.NumberFormat.prototype.format = gviz.USE_I18N_SHIM ? charts.i18n.NumberFormat.prototype.format : goog.i18n.NumberFormat.prototype.format;
gviz.i18n.NumberFormat.setEnforceAsciiDigits = gviz.USE_I18N_SHIM ? charts.i18n.NumberFormat.setEnforceAsciiDigits : goog.i18n.NumberFormat.setEnforceAsciiDigits;
gviz.i18n.NumberFormat.isEnforceAsciiDigits = gviz.USE_I18N_SHIM ? charts.i18n.NumberFormat.isEnforceAsciiDigits : goog.i18n.NumberFormat.isEnforceAsciiDigits;
gviz.i18n.NumberFormatSymbols = gviz.USE_I18N_SHIM ? charts.i18n.NumberFormatSymbols : goog.i18n.NumberFormatSymbols;
gviz.i18n.TimeZone = gviz.USE_I18N_SHIM ? charts.i18n.TimeZone : goog.i18n.TimeZone;
gviz.i18n.TimeZone.createTimeZone = gviz.USE_I18N_SHIM ? charts.i18n.TimeZone.createTimeZone : goog.i18n.TimeZone.createTimeZone;
// INPUT (javascript/gviz/devel/jsapi/common/types/value.js)
// INPUT (javascript/gviz/devel/jsapi/packages/core/idatatable.js)
google.visualization.IDataTable = function() {
  this.invalidateColumnRefMap();
};
google.visualization.IDataTable.prototype.invalidateColumnRefMap = function() {
  this.columnRefMap_ = null;
};
google.visualization.IDataTable.prototype.rebuildColumnRefMap = function() {
  this.columnRefMap_ = {};
  for (var numColumns = this.getNumberOfColumns(), i = 0;i < numColumns;i++) {
    var columnId = this.getColumnId(i);
    null == columnId || "" === columnId || columnId in this.columnRefMap_ || (this.columnRefMap_[columnId] = i);
  }
  for (i = 0;i < numColumns;i++) {
    var columnLabel = this.getColumnLabel(i);
    null == columnLabel || "" === columnLabel || columnLabel in this.columnRefMap_ || (this.columnRefMap_[columnLabel] = i);
  }
};
google.visualization.IDataTable.prototype.getColumnIndex = function(column) {
  if (goog.isNumber(column)) {
    var numColumns = this.getNumberOfColumns();
    return 0 > column && column >= numColumns ? -1 : column;
  }
  this.columnRefMap_ || this.rebuildColumnRefMap();
  var columnIndex = this.columnRefMap_[column];
  return null == columnIndex ? -1 : columnIndex;
};
google.visualization.IDataTable.prototype.getStringValue = function(rowIndex, columnIndex) {
  var columnType = this.getColumnType(columnIndex);
  if (columnType !== google.visualization.ColumnType.STRING) {
    throw Error("Column " + columnIndex + " must be of type string, was " + columnType);
  }
  return this.getValue(rowIndex, columnIndex);
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/format.js)
google.visualization.Format = function() {
};
google.visualization.Format.prototype.formatValue = function(value) {
  return this.formatValue_(value);
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/dateformat.js)
google.visualization.DateFormat = function(opt_options) {
  this.init(opt_options);
};
goog.inherits(google.visualization.DateFormat, google.visualization.Format);
google.visualization.DateFormat.prototype.init = function(opt_options) {
  var defaults = {formatType:google.visualization.DateFormat.FormatType.SHORT, valueType:google.visualization.DateFormat.ValueType.DATETIME}, options = new gviz.Options([opt_options || {}, defaults]);
  this.pattern_ = options.inferValue("pattern");
  this.formatter_ = null;
  this.formatType_ = options.inferOptionalEnumValue("formatType", google.visualization.DateFormat.FormatType);
  this.valueType_ = options.inferOptionalEnumValue("valueType", google.visualization.DateFormat.ValueType);
  this.clearMinutes_ = options.inferBooleanValue("clearMinutes", !1);
  this.timeZone_ = null;
  var timeZone = options.inferOptionalNumberValue("timeZone");
  null != timeZone && (this.timeZone_ = gviz.i18n.TimeZone.createTimeZone(60 * -timeZone));
};
google.visualization.DateFormat.Format = gviz.i18n.DateTimeFormat.Format;
google.visualization.DateFormat.Patterns = gviz.i18n.DateTimePatterns;
google.visualization.DateFormat.FormatType = {FULL:"full", LONG:"long", MEDIUM:"medium", SHORT:"short"};
google.visualization.DateFormat.ValueType = {DATE:"date", DATETIME:"datetime", TIME:"time"};
google.visualization.DateFormat.dontLocalizeDigits = function() {
  gviz.i18n.DateTimeSymbols.ZERODIGIT = void 0;
};
google.visualization.DateFormat.combinePattern_ = function(valueType, formatType) {
  switch(valueType) {
    case google.visualization.DateFormat.ValueType.DATE:
      switch(formatType) {
        case google.visualization.DateFormat.FormatType.FULL:
          return gviz.i18n.DateTimeFormat.Format.FULL_DATE;
        case google.visualization.DateFormat.FormatType.LONG:
          return gviz.i18n.DateTimeFormat.Format.LONG_DATE;
        case google.visualization.DateFormat.FormatType.MEDIUM:
          return gviz.i18n.DateTimeFormat.Format.MEDIUM_DATE;
        case google.visualization.DateFormat.FormatType.SHORT:
          return gviz.i18n.DateTimeFormat.Format.SHORT_DATE;
      }
    ;
    case google.visualization.DateFormat.ValueType.DATETIME:
      switch(formatType) {
        case google.visualization.DateFormat.FormatType.FULL:
          return gviz.i18n.DateTimeFormat.Format.FULL_DATETIME;
        case google.visualization.DateFormat.FormatType.LONG:
          return gviz.i18n.DateTimeFormat.Format.LONG_DATETIME;
        case google.visualization.DateFormat.FormatType.MEDIUM:
          return gviz.i18n.DateTimeFormat.Format.MEDIUM_DATETIME;
        case google.visualization.DateFormat.FormatType.SHORT:
          return gviz.i18n.DateTimeFormat.Format.SHORT_DATETIME;
      }
    ;
    case google.visualization.DateFormat.ValueType.TIME:
      switch(formatType) {
        case google.visualization.DateFormat.FormatType.FULL:
          return gviz.i18n.DateTimeFormat.Format.FULL_TIME;
        case google.visualization.DateFormat.FormatType.LONG:
          return gviz.i18n.DateTimeFormat.Format.LONG_TIME;
        case google.visualization.DateFormat.FormatType.MEDIUM:
          return gviz.i18n.DateTimeFormat.Format.MEDIUM_TIME;
        case google.visualization.DateFormat.FormatType.SHORT:
          return gviz.i18n.DateTimeFormat.Format.SHORT_TIME;
      }
    ;
    default:
      return gviz.i18n.DateTimeFormat.Format.FULL_DATETIME;
  }
};
google.visualization.DateFormat.prototype.setTimeUnit = function(timeUnit) {
  this.setTimeUnit_(timeUnit);
};
google.visualization.DateFormat.prototype.setTimeUnit_ = function(timeUnit) {
  var pattern;
  switch(timeUnit) {
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.YEAR:
      pattern = gviz.i18n.DateTimePatterns.YEAR_FULL;
      break;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.QUARTER:
      pattern = "Q yyyy";
      break;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.MONTH:
      pattern = gviz.i18n.DateTimePatterns.YEAR_MONTH_ABBR;
      break;
    case gviz.canviz.axis.Milliseconds.TIME_UNIT.DAY:
      pattern = gviz.i18n.DateTimeFormat.Format.SHORT_DATE;
      break;
    default:
      pattern = gviz.i18n.DateTimeFormat.Format.SHORT_DATETIME;
  }
  this.init({pattern:pattern, timeZone:0});
};
google.visualization.DateFormat.prototype.format = function(dataTable, columnIndex) {
  var valueType = gviz.Options.convertToEnum(google.visualization.DateFormat.ValueType, dataTable.getColumnType(columnIndex));
  if (valueType == google.visualization.DateFormat.ValueType.DATE || valueType == google.visualization.DateFormat.ValueType.DATETIME) {
    for (var formatter = this.createFormatter_(valueType), numberOfRows = dataTable.getNumberOfRows(), r = 0;r < numberOfRows;r++) {
      var value = dataTable.getValue(r, columnIndex), formattedValue = this.formatValueWithFormatter_(formatter, value);
      dataTable.setFormattedValue(r, columnIndex, formattedValue);
    }
  }
};
google.visualization.DateFormat.prototype.formatValue_ = function(value) {
  this.formatter_ || (this.formatter_ = this.createFormatter_(this.valueType_));
  return this.formatValueWithFormatter_(this.formatter_, value);
};
google.visualization.DateFormat.prototype.createFormatter_ = function(valueType) {
  var pattern = this.pattern_;
  goog.isDefAndNotNull(pattern) || (pattern = google.visualization.DateFormat.combinePattern_(valueType, this.formatType_));
  return new gviz.i18n.DateTimeFormat(pattern);
};
google.visualization.DateFormat.prototype.formatValueWithFormatter_ = function(formatter, value) {
  if (goog.isNull(value)) {
    return "";
  }
  var timeZone = this.timeZone_;
  null == timeZone && (timeZone = gviz.i18n.TimeZone.createTimeZone(value.getTimezoneOffset()));
  var toFormat = new Date(value.getTime());
  this.clearMinutes_ && toFormat.setMinutes(0);
  return formatter.format(toFormat, timeZone);
};
google.visualization.DateFormat.overrideFormatValue = function(cb) {
  google.visualization.DateFormat.prototype.formatValue_ = function(value) {
    return cb.call(this, value, this.pattern_);
  };
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/numberformat.js)
google.visualization.NumberFormat = function(opt_options) {
  var defaults = {decimalSymbol:google.visualization.NumberFormat.DECIMAL_SEP, groupingSymbol:google.visualization.NumberFormat.GROUP_SEP, fractionDigits:2, negativeParens:!1, prefix:"", suffix:"", scaleFactor:1}, options = new gviz.Options([opt_options || {}, defaults]);
  this.fractionDigits_ = options.inferNonNegativeNumberValue("fractionDigits");
  opt_options && goog.isNumber(opt_options.fractionDigits) && isNaN(opt_options.fractionDigits) && (this.fractionDigits_ = NaN);
  this.decimalSymbol_ = options.inferStringValue("decimalSymbol");
  this.groupingSymbol_ = options.inferStringValue("groupingSymbol");
  this.prefix_ = options.inferStringValue("prefix");
  this.suffix_ = options.inferStringValue("suffix");
  this.negativeColor_ = options.inferOptionalColorValue("negativeColor");
  this.negativeParens_ = options.inferBooleanValue("negativeParens");
  (this.pattern_ = options.inferOptionalStringValue("pattern")) && this.pattern_.toLowerCase() in google.visualization.NumberFormat.PRESETS_ && (this.pattern_ = google.visualization.NumberFormat.PRESETS_[this.pattern_.toLowerCase()]);
  this.scaleFactor_ = options.inferNumberValue("scaleFactor");
  if (0 >= this.scaleFactor_) {
    throw Error("Scale factor must be a positive number.");
  }
};
goog.inherits(google.visualization.NumberFormat, google.visualization.Format);
google.visualization.NumberFormat.PRESETS_ = {decimal:gviz.i18n.NumberFormat.Format.DECIMAL, scientific:gviz.i18n.NumberFormat.Format.SCIENTIFIC, percent:gviz.i18n.NumberFormat.Format.PERCENT, currency:gviz.i18n.NumberFormat.Format.CURRENCY, "short":gviz.i18n.NumberFormat.Format.COMPACT_SHORT, "long":gviz.i18n.NumberFormat.Format.COMPACT_LONG};
google.visualization.NumberFormat.useNativeCharactersIfAvailable_ = !1;
google.visualization.NumberFormat.useNativeCharactersIfAvailable = function(flag) {
  google.visualization.NumberFormat.useNativeCharactersIfAvailable_ = flag;
};
google.visualization.NumberFormat.DECIMAL_SEP = gviz.i18n.NumberFormatSymbols.DECIMAL_SEP;
google.visualization.NumberFormat.GROUP_SEP = gviz.i18n.NumberFormatSymbols.GROUP_SEP;
google.visualization.NumberFormat.DECIMAL_PATTERN = gviz.i18n.NumberFormatSymbols.DECIMAL_PATTERN;
google.visualization.NumberFormat.prototype.format = function(dataTable, columnIndex) {
  if ("number" == dataTable.getColumnType(columnIndex)) {
    for (var row = 0;row < dataTable.getNumberOfRows();row++) {
      var value = dataTable.getValue(row, columnIndex);
      if (null != value) {
        var formattedValue = this.formatValue(value);
        dataTable.setFormattedValue(row, columnIndex, formattedValue);
        !goog.string.isEmptySafe(this.negativeColor_) && 0 > value && dataTable.setProperty(row, columnIndex, "style", "color:" + this.negativeColor_ + ";");
      }
    }
  }
};
google.visualization.NumberFormat.prototype.formatValue_ = function(value) {
  var formattedValue = null, scaledValue = value / this.scaleFactor_;
  if (goog.isNull(this.pattern_)) {
    if (isNaN(this.fractionDigits_)) {
      return String(value);
    }
    var valueToFormat = scaledValue;
    this.negativeParens_ && (valueToFormat = Math.abs(valueToFormat));
    formattedValue = this.formatValueNonICU_(valueToFormat);
    formattedValue = this.applyPrefixAndSuffix(formattedValue);
    this.negativeParens_ && 0 > value && (formattedValue = "(" + formattedValue + ")");
  } else {
    var numFormat = new gviz.i18n.NumberFormat(this.pattern_), prevEnforceAsciiDigits = gviz.i18n.NumberFormat.isEnforceAsciiDigits();
    gviz.i18n.NumberFormat.setEnforceAsciiDigits(!google.visualization.NumberFormat.useNativeCharactersIfAvailable_);
    formattedValue = this.applyPrefixAndSuffix(numFormat.format(scaledValue));
    gviz.i18n.NumberFormat.setEnforceAsciiDigits(prevEnforceAsciiDigits);
  }
  return formattedValue;
};
google.visualization.NumberFormat.prototype.formatValueNonICU_ = function(value) {
  0 == this.fractionDigits_ && (value = Math.round(value));
  var formattedValue = [];
  0 > value && (value = -value, formattedValue.push("-"));
  var multiplier = Math.pow(10, this.fractionDigits_), intValue = Math.round(value * multiplier), whole = String(Math.floor(intValue / multiplier)), decimal = String(intValue % multiplier);
  if (3 < whole.length && this.groupingSymbol_) {
    var l = whole.length % 3;
    0 < l && (formattedValue.push(whole.substring(0, l), this.groupingSymbol_), whole = whole.substring(l));
    for (;3 < whole.length;) {
      formattedValue.push(whole.substring(0, 3), this.groupingSymbol_), whole = whole.substring(3);
    }
  }
  formattedValue.push(whole);
  0 < this.fractionDigits_ && (formattedValue.push(this.decimalSymbol_), decimal.length < this.fractionDigits_ && (decimal = "0000000000000000" + decimal), formattedValue.push(decimal.substring(decimal.length - this.fractionDigits_)));
  return formattedValue.join("");
};
google.visualization.NumberFormat.prototype.applyPrefixAndSuffix = function(value) {
  return this.prefix_ + value + this.suffix_;
};
google.visualization.NumberFormat.overrideFormatValue = function(cb) {
  google.visualization.NumberFormat.prototype.formatValue_ = function(value) {
    return this.applyPrefixAndSuffix(cb.call(this, value / this.scaleFactor_, this.pattern_));
  };
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/datautils.js)
google.visualization.datautils = {};
google.visualization.datautils.normalizeDataTable = function(dataTable) {
  var data;
  return data = null == dataTable ? null : goog.isFunction(dataTable.getTableProperties) ? dataTable : goog.isArray(dataTable) ? google.visualization.datautils.arrayToDataTable(dataTable) : new google.visualization.DataTable(dataTable);
};
google.visualization.datautils.parseCell = function(cell) {
  var result = {};
  if ("object" != goog.typeOf(cell) || goog.isDateLike(cell)) {
    result.v = goog.isDefAndNotNull(cell) ? cell : null, result.f = null;
  } else {
    result.v = "undefined" == typeof cell.v ? null : cell.v;
    var t = typeof cell.f;
    if ("undefined" == t || "null" == t) {
      result.f = null;
    } else {
      if ("string" == t) {
        result.f = cell.f;
      } else {
        throw Error("Formatted value ('f'), if specified, must be a string.");
      }
    }
    t = typeof cell.p;
    if ("object" == t) {
      result.p = cell.p;
    } else {
      if ("null" != t && "undefined" != t) {
        throw Error("Properties ('p'), if specified, must be an Object.");
      }
    }
  }
  return{v:result.v, f:result.f, p:result.p};
};
google.visualization.datautils.validateColumnFilters = function(data, columnFilters) {
  if (!goog.isFunction(columnFilters)) {
    if (!goog.isArrayLike(columnFilters) || 0 == columnFilters.length) {
      throw Error("columnFilters must be a non-empty array");
    }
    for (var tmpIndexMap = {}, i = 0;i < columnFilters.length;i++) {
      if ("object" != typeof columnFilters[i] || !("column" in columnFilters[i])) {
        if (!("value" in columnFilters[i] || "minValue" in columnFilters[i] || "maxValue" in columnFilters[i])) {
          throw Error("columnFilters[" + i + '] must have properties "column" and "value", "minValue"or "maxValue"');
        }
        if ("value" in columnFilters[i] && ("minValue" in columnFilters[i] || "maxValue" in columnFilters[i])) {
          throw Error("columnFilters[" + i + '] must specify either "value" or range properties ("minValue" and/or "maxValue"');
        }
      }
      var column = columnFilters[i].column;
      google.visualization.datautils.validateColumnReference(data, column);
      var colIndex = data.getColumnIndex(column);
      if (colIndex in tmpIndexMap) {
        throw Error("Column " + column + " is duplicate in columnFilters.");
      }
      google.visualization.datautils.validateTypeMatch(data, colIndex, columnFilters[i].value);
      tmpIndexMap[colIndex] = !0;
    }
  }
};
google.visualization.datautils.validateColumnSet = function(data, calcFunctionNames, columns) {
  for (var i = 0;i < columns.length;i++) {
    var col = columns[i];
    if (goog.isNumber(col) || goog.isString(col)) {
      google.visualization.datautils.validateColumnReference(data, col);
    } else {
      if (goog.isObject(col)) {
        var sourceColumn = col.sourceColumn, calc = col.calc;
        if (goog.isString(calc)) {
          if (!calcFunctionNames || calcFunctionNames && !goog.array.contains(calcFunctionNames, calc)) {
            throw Error('Unknown function "' + calc + '"');
          }
          goog.isDefAndNotNull(sourceColumn) && google.visualization.datautils.validateColumnReference(data, sourceColumn);
        }
      } else {
        throw Error("Invalid column input, expected either a number, string, or an object.");
      }
    }
  }
};
google.visualization.datautils.validateSingleSortColumnsObject_ = function(data, sortColumnsObject, title) {
  if ("object" == typeof sortColumnsObject && "column" in sortColumnsObject) {
    if ("desc" in sortColumnsObject && "boolean" != typeof sortColumnsObject.desc) {
      throw Error('Property "desc" in ' + title + " must be boolean.");
    }
    if ("compare" in sortColumnsObject && !goog.isFunction(sortColumnsObject.compare)) {
      throw Error('Property "compare" in ' + title + " must be a function.");
    }
  } else {
    throw Error(title + ' must be an object with a "column" property.');
  }
  google.visualization.datautils.validateColumnReference(data, sortColumnsObject.column);
};
google.visualization.datautils.standardizeSortColumns = function(data, getValue, sortColumns) {
  var comparisonFunction = function(i1, i2) {
    for (var colIndex = 0;colIndex < sortColumns.length;colIndex++) {
      var sortColumn = sortColumns[colIndex], col = sortColumn.column, v1 = getValue(i1, col), v2 = getValue(i2, col), cmp;
      cmp = sortColumn.compare ? null === v1 ? null === v2 ? 0 : -1 : null === v2 ? 1 : sortColumn.compare(v1, v2) : google.visualization.datautils.compareValues(data.getColumnType(col), v1, v2);
      if (0 != cmp) {
        var order = sortColumn.desc ? -1 : 1;
        return cmp * order;
      }
    }
    return 0;
  };
  if (goog.isFunction(sortColumns)) {
    comparisonFunction = sortColumns;
  } else {
    if (goog.isNumber(sortColumns) || goog.isString(sortColumns)) {
      google.visualization.datautils.validateColumnReference(data, sortColumns);
      var colIndex$$0 = data.getColumnIndex(sortColumns);
      sortColumns = [{column:colIndex$$0}];
    } else {
      if (goog.isObject(sortColumns)) {
        if (goog.isArrayLike(sortColumns)) {
          if (1 > sortColumns.length) {
            throw Error("sortColumns is an empty array. Must have at least one element.");
          }
          for (var tmpIndexMap = {}, standardizedSortColumns = [], i = 0;i < sortColumns.length;i++) {
            var sortColumn = sortColumns[i];
            if (goog.isNumber(sortColumn) || goog.isString(sortColumn)) {
              google.visualization.datautils.validateColumnReference(data, sortColumn), colIndex$$0 = data.getColumnIndex(sortColumn), sortColumn = {column:colIndex$$0};
            } else {
              if (goog.isObject(sortColumn)) {
                colIndex$$0 = sortColumn.column, google.visualization.datautils.validateSingleSortColumnsObject_(data, sortColumn, "sortColumns[" + i + "]");
              } else {
                throw Error("sortColumns is an array, but not composed of only objects or numbers.");
              }
            }
            if (colIndex$$0 in tmpIndexMap) {
              throw Error("Column index " + colIndex$$0 + " is duplicated in sortColumns.");
            }
            tmpIndexMap[colIndex$$0] = !0;
            standardizedSortColumns.push(sortColumn);
          }
          sortColumns = standardizedSortColumns;
        } else {
          google.visualization.datautils.validateSingleSortColumnsObject_(data, sortColumns, "sortColumns"), sortColumns = [sortColumns];
        }
      }
    }
  }
  return comparisonFunction;
};
google.visualization.datautils.forEachCell = function(data, handler) {
  var rows = data.getNumberOfRows();
  google.visualization.datautils.forEachColumn(data, function(column) {
    for (var row = 0;row < rows;row++) {
      handler(row, column);
    }
  });
};
google.visualization.datautils.forEachColumn = function(data, handler) {
  for (var columns = data.getNumberOfColumns(), column = 0;column < columns;column++) {
    handler(column);
  }
};
google.visualization.datautils.validateRowIndex = function(data, rowIndex) {
  var numRows = data.getNumberOfRows();
  if (0 < numRows) {
    if (Math.floor(rowIndex) !== rowIndex || 0 > rowIndex || rowIndex >= numRows) {
      throw Error("Invalid row index " + rowIndex + ". Should be in the range [0-" + (numRows - 1) + "].");
    }
  } else {
    throw Error("Table has no rows.");
  }
};
google.visualization.datautils.validateColumnReference = function(data, columnReference) {
  data.getColumnIndex(columnReference);
  goog.isNumber(columnReference) ? google.visualization.datautils.validateColumnIndex(data, columnReference) : (goog.asserts.assert(goog.isString(columnReference)), google.visualization.datautils.validateColumnIdOrLabel(data, columnReference));
};
google.visualization.datautils.validateColumnIdOrLabel = function(data, columnId) {
  var columnIndex = data.getColumnIndex(columnId);
  if (-1 === columnIndex) {
    throw Error('Invalid column id "' + columnId + '"');
  }
};
google.visualization.datautils.validateColumnIndex = function(data, columnIndex) {
  var numCols = data.getNumberOfColumns();
  if (0 < numCols) {
    if (Math.floor(columnIndex) !== columnIndex || 0 > columnIndex || columnIndex >= numCols) {
      throw Error("Invalid column index " + columnIndex + ". Should be an integer in the range [0-" + (numCols - 1) + "].");
    }
  } else {
    throw Error("Table has no columns.");
  }
};
google.visualization.datautils.validateTypeMatch = function(data, columnIndex, value) {
  var columnType = data.getColumnType(columnIndex), res = google.visualization.datautils.checkValueType(value, columnType);
  if (!res) {
    throw Error("Type mismatch. Value " + value + " does not match type " + columnType + " in column index " + columnIndex);
  }
};
google.visualization.datautils.checkValueType = function(value, columnType) {
  if (null == value) {
    return!0;
  }
  var valueType = typeof value;
  switch(columnType) {
    case google.visualization.ColumnType.NUMBER:
      if ("number" == valueType) {
        return!0;
      }
      break;
    case google.visualization.ColumnType.STRING:
      if ("string" == valueType) {
        return!0;
      }
      break;
    case google.visualization.ColumnType.BOOLEAN:
      if ("boolean" == valueType) {
        return!0;
      }
      break;
    case google.visualization.ColumnType.DATE:
    ;
    case google.visualization.ColumnType.DATETIME:
      if (goog.isDateLike(value)) {
        return!0;
      }
      break;
    case google.visualization.ColumnType.TIMEOFDAY:
      if (goog.isArrayLike(value) && 2 < value.length && 5 > value.length) {
        for (var isGood = !0, i = 0;i < value.length;i++) {
          var part = value[i];
          if ("number" != typeof part || part != Math.floor(part)) {
            isGood = !1;
            break;
          }
        }
        if (0 > value[0] || 0 > value[1] || 59 < value[1] || 0 > value[2] || 59 < value[2]) {
          isGood = !1;
        }
        4 == value.length && (0 > value[3] || 999 < value[3]) && (isGood = !1);
        if (isGood) {
          return!0;
        }
      }
    ;
  }
  return!1;
};
google.visualization.datautils.compareValues = function(type, val1, val2) {
  if (null == val1) {
    return null == val2 ? 0 : -1;
  }
  if (null == val2) {
    return 1;
  }
  switch(type) {
    case google.visualization.ColumnType.TIMEOFDAY:
      for (var i = 0;3 > i;i++) {
        if (val1[i] < val2[i]) {
          return-1;
        }
        if (val2[i] < val1[i]) {
          return 1;
        }
      }
      var milli1 = 4 > val1.length ? 0 : val1[3], milli2 = 4 > val2.length ? 0 : val2[3];
      return milli1 < milli2 ? -1 : milli2 < milli1 ? 1 : 0;
    default:
      return val1 < val2 ? -1 : val2 < val1 ? 1 : 0;
  }
};
google.visualization.datautils.getColumnRange = function(data, column) {
  google.visualization.datautils.validateColumnReference(data, column);
  var columnIndex = data.getColumnIndex(column), columnType = data.getColumnType(columnIndex), min = null, max = null, rowIndex, val, numRows = data.getNumberOfRows();
  for (rowIndex = 0;rowIndex < numRows;rowIndex++) {
    if (val = data.getValue(rowIndex, columnIndex), goog.isDefAndNotNull(val)) {
      max = min = val;
      break;
    }
  }
  if (null == min) {
    return{min:null, max:null};
  }
  for (rowIndex++;rowIndex < numRows;rowIndex++) {
    val = data.getValue(rowIndex, columnIndex), goog.isDefAndNotNull(val) && (0 > google.visualization.datautils.compareValues(columnType, val, min) ? min = val : 0 > google.visualization.datautils.compareValues(columnType, max, val) && (max = val));
  }
  return{min:min, max:max};
};
google.visualization.datautils.getSortedRows = function(data, sortColumns) {
  for (var getValue = function(rowIndex, colIndex) {
    return data.getValue(rowIndex, colIndex);
  }, comparisonFunction = google.visualization.datautils.standardizeSortColumns(data, getValue, sortColumns), indicesArray = [], numRows = data.getNumberOfRows(), i = 0;i < numRows;i++) {
    indicesArray.push(i);
  }
  goog.array.stableSort(indicesArray, comparisonFunction);
  return indicesArray;
};
google.visualization.datautils.getDistinctValues = function(data, column) {
  google.visualization.datautils.validateColumnReference(data, column);
  var columnIndex = data.getColumnIndex(column), nr = data.getNumberOfRows();
  if (0 == nr) {
    return[];
  }
  for (var values = [], i = 0;i < nr;++i) {
    values.push(data.getValue(i, columnIndex));
  }
  var columnType = data.getColumnType(columnIndex);
  goog.array.stableSort(values, function(val1, val2) {
    return google.visualization.datautils.compareValues(columnType, val1, val2);
  });
  var prevVal = values[0], result = [];
  result.push(prevVal);
  for (i = 1;i < values.length;i++) {
    var curVal = values[i];
    0 != google.visualization.datautils.compareValues(columnType, curVal, prevVal) && result.push(curVal);
    prevVal = curVal;
  }
  return result;
};
google.visualization.datautils.isFilterMatch = function(data, columnFilters, rowIndex) {
  if (goog.isFunction(columnFilters)) {
    return columnFilters(data, rowIndex);
  }
  for (var i = 0;i < columnFilters.length;i++) {
    var columnFilter = columnFilters[i], columnIndex = columnFilter.column, cellValue = data.getValue(rowIndex, columnIndex), columnType = data.getColumnType(columnIndex);
    if ("value" in columnFilter) {
      if (0 !== google.visualization.datautils.compareValues(columnType, cellValue, columnFilter.value)) {
        return!1;
      }
    } else {
      if (goog.isDefAndNotNull(columnFilter.minValue) || goog.isDefAndNotNull(columnFilter.maxValue)) {
        if (null == cellValue || goog.isDefAndNotNull(columnFilter.minValue) && 0 > google.visualization.datautils.compareValues(columnType, cellValue, columnFilter.minValue) || goog.isDefAndNotNull(columnFilter.maxValue) && 0 < google.visualization.datautils.compareValues(columnType, cellValue, columnFilter.maxValue)) {
          return!1;
        }
      }
    }
    if (goog.isFunction(columnFilter.test) && !columnFilter.test(cellValue, rowIndex, columnIndex, data)) {
      return!1;
    }
  }
  return!0;
};
google.visualization.datautils.getFilteredRows = function(data, columnFilters) {
  google.visualization.datautils.validateColumnFilters(data, columnFilters);
  for (var filteredIndices = [], numRows = data.getNumberOfRows(), i = 0;i < numRows;i++) {
    google.visualization.datautils.isFilterMatch(data, columnFilters, i) && filteredIndices.push(i);
  }
  return filteredIndices;
};
google.visualization.datautils.getDefaultFormattedValue = function(value, type) {
  var formattedValue, formatter;
  switch(type) {
    case google.visualization.ColumnType.TIMEOFDAY:
      var dateValue = new Date(1970, 0, 1, value[0], value[1], value[2], value[3] || 0), pattern = "HH:mm";
      if (value[2] || value[3]) {
        pattern += ":ss";
      }
      value[3] && (pattern += ".SSS");
      formatter = new google.visualization.DateFormat({pattern:pattern});
      formattedValue = formatter.formatValue(dateValue);
      break;
    case google.visualization.ColumnType.DATE:
      formatter = new google.visualization.DateFormat({formatType:"medium", valueType:"date"});
      formattedValue = formatter.formatValue(value);
      break;
    case google.visualization.ColumnType.DATETIME:
      formatter = new google.visualization.DateFormat({formatType:"medium", valueType:"datetime"});
      formattedValue = formatter.formatValue(value);
      break;
    case google.visualization.ColumnType.NUMBER:
      formatter = new google.visualization.NumberFormat({fractionDigits:NaN});
      formattedValue = formatter.formatValue(value);
      break;
    default:
      formattedValue = goog.isDefAndNotNull(value) ? String(value) : "";
  }
  return formattedValue;
};
google.visualization.datautils.arrayToDataTableJSON = function(array, opt_noHeaders) {
  var tableSpec = {};
  if (!goog.isArray(array)) {
    throw Error("Not an array");
  }
  if (0 < array.length) {
    var hasHeaders = !opt_noHeaders, columns, columnCount;
    if (hasHeaders) {
      columns = goog.array.map(array[0], function(header) {
        if (goog.isString(header)) {
          return{label:header};
        }
        if (goog.isObject(header)) {
          return goog.object.clone(header);
        }
        throw Error("Unknown header type: " + header);
      });
    } else {
      columns = [];
      columnCount = 0;
      goog.isArray(array[0]) ? columnCount = array[0].length : goog.isObject(array[0]) && goog.object.containsKey(array[0], "c") && goog.isArray(array[0].c) && (columnCount = array[0].c.length);
      for (var i = 0;i < columnCount;i++) {
        columns.push({type:void 0});
      }
    }
    tableSpec.cols = columns;
    tableSpec.rows = [];
    columnCount = columns.length;
    for (var columnTypes = Array(columns.length), rows = hasHeaders ? goog.array.slice(array, 1) : array, rowIndex = 0;rowIndex < rows.length;rowIndex++) {
      var row = rows[rowIndex];
      if (goog.isArray(row)) {
        row = {c:row};
      } else {
        if (!goog.isObject(row) || !goog.object.containsKey(row, "c")) {
          throw Error("Invalid row type for row " + rowIndex);
        }
      }
      if (row.c.length !== columns.length) {
        throw Error("Row " + rowIndex + " has " + row.c.length + " columns, but must have " + columns.length);
      }
      row.c = goog.array.clone(row.c);
      tableSpec.rows.push(row);
      for (var columnIndex = 0;columnIndex < columnCount;columnIndex++) {
        var type = "string", value = row.c[columnIndex];
        goog.isObject(value) && (goog.object.containsKey(value, "v") || goog.object.containsKey(value, "f")) ? value = value.v : row.c[columnIndex] = {v:value};
        if (!(goog.isDefAndNotNull(columns[columnIndex].type) || goog.isDefAndNotNull(columnTypes[columnIndex]) && "date" !== columnTypes[columnIndex]) && goog.isDefAndNotNull(value)) {
          if (goog.isString(value)) {
            type = "string";
          } else {
            if (goog.isNumber(value)) {
              type = "number";
            } else {
              if (goog.isArray(value)) {
                type = "timeofday";
              } else {
                if (goog.isBoolean(value)) {
                  type = "boolean";
                } else {
                  if (goog.isDateLike(value)) {
                    var newValue = new Date(value), offset = newValue.getHours() + newValue.getMinutes() + newValue.getSeconds() + newValue.getMilliseconds(), type = 0 !== offset ? "datetime" : "date"
                  } else {
                    throw Error("Unknown type of value in " + rowIndex + "," + columnIndex);
                  }
                }
              }
            }
          }
          columnTypes[columnIndex] = type;
        }
      }
    }
    goog.array.forEach(tableSpec.cols, function(column, index) {
      goog.isDefAndNotNull(column.type) || (column.type = columnTypes[index] || "string");
    });
  }
  return tableSpec;
};
google.visualization.datautils.arrayToDataTable = function(array, opt_noHeaders) {
  return new google.visualization.DataTable(google.visualization.datautils.arrayToDataTableJSON(array, opt_noHeaders));
};
google.visualization.arrayToDataTable = google.visualization.datautils.arrayToDataTable;
google.visualization.datautils.dataTableToCsv = function(dataTable) {
  for (var result = "", row = 0;row < dataTable.getNumberOfRows();row++) {
    for (var column = 0;column < dataTable.getNumberOfColumns();column++) {
      0 < column && (result += ",");
      var value = dataTable.getFormattedValue(row, column), value = value.replace(RegExp('"', "g"), '""'), hasComma = -1 != value.indexOf(","), hasNewline = -1 != value.indexOf("\n"), hasQuote = -1 != value.indexOf('"');
      if (hasComma || hasNewline || hasQuote) {
        value = '"' + value + '"';
      }
      result += value;
    }
    result += "\n";
  }
  return result;
};
google.visualization.datautils.findNonNullValueInColumn = function(data, rowIndex, columnIndex, isAbove) {
  for (var value = null, numberOfRows = data.getNumberOfRows(), ind = rowIndex;(isAbove ? 0 <= ind : ind < numberOfRows) && goog.isNull(value);) {
    value = data.getValue(ind, columnIndex), ind += isAbove ? -1 : 1;
  }
  return value;
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/gvizguard.js)
gviz.USE_GUARD = !0;
google.visualization.Guard = gviz.USE_GUARD;
// INPUT (javascript/gviz/devel/jsapi/packages/core/responseversion.js)
google.visualization.ResponseVersion = {VERSION_0_5:"0.5", VERSION_0_6:"0.6"};
// INPUT (javascript/gviz/devel/jsapi/packages/core/datatable.js)
google.visualization.DataTable = function(opt_data, opt_version) {
  google.visualization.IDataTable.call(this);
  this.version_ = opt_version === google.visualization.ResponseVersion.VERSION_0_5 ? google.visualization.ResponseVersion.VERSION_0_5 : google.visualization.ResponseVersion.VERSION_0_6;
  if (!goog.isFunction(this.getTableProperties)) {
    throw Error('You called google.visualization.DataTable() without the "new" keyword');
  }
  opt_data ? (goog.isString(opt_data) ? opt_data = gviz.json.deserialize(opt_data) : google.visualization.DataTable.normalizeDates_(opt_data), this.dataCols_ = [], this.dataRows_ = [], this.tableProperties_ = opt_data.p || null, goog.isDefAndNotNull(opt_data.cols) && goog.array.forEach(opt_data.cols, goog.bind(function(column) {
    this.addColumn(column);
  }, this)), goog.isDefAndNotNull(opt_data.rows) && (this.dataRows_ = opt_data.rows)) : (this.dataCols_ = [], this.dataRows_ = [], this.tableProperties_ = null);
  this.invalidateEntireCellCache_();
};
goog.inherits(google.visualization.DataTable, google.visualization.IDataTable);
google.visualization.DataTable.normalizeDates_ = function(data) {
  for (var columns = data.cols || [], rows = data.rows || [], numberOfColumns = columns.length, column = 0;column < numberOfColumns;column++) {
    var type = columns[column].type;
    if (type == google.visualization.ColumnType.DATE || type == google.visualization.ColumnType.DATETIME) {
      for (var numberOfRows = rows.length, row = 0;row < numberOfRows;row++) {
        var cell = rows[row].c[column];
        if (cell) {
          var value = cell.v;
          if (goog.isDateLike(value)) {
            return;
          }
          goog.isString(value) && (cell = gviz.json.serialize(cell), cell = gviz.json.deserialize(cell), rows[row].c[column] = cell);
        }
      }
    }
  }
};
google.visualization.DataTable.prototype.dataCols_ = null;
google.visualization.DataTable.prototype.version_ = null;
google.visualization.DataTable.prototype.dataRows_ = null;
google.visualization.DataTable.prototype.tableProperties_ = null;
google.visualization.DataTable.prototype.cache_ = null;
google.visualization.DataTable.prototype.getNumberOfRows = function() {
  return this.dataRows_.length;
};
google.visualization.DataTable.prototype.getNumberOfColumns = function() {
  return this.dataCols_.length;
};
google.visualization.DataTable.prototype.getColumnId = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  return this.dataCols_[columnIndex].id || "";
};
google.visualization.DataTable.prototype.getColumnLabel = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  return this.dataCols_[columnIndex].label || "";
};
google.visualization.DataTable.prototype.getColumnPattern = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  return this.dataCols_[columnIndex].pattern;
};
google.visualization.DataTable.prototype.getColumnRole = function(columnIndex) {
  var role = this.getColumnProperty(columnIndex, "role");
  return role = goog.isString(role) ? role : "";
};
google.visualization.DataTable.prototype.getColumnType = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var colType = this.dataCols_[columnIndex].type;
  return colType;
};
google.visualization.DataTable.prototype.getValue = function(rowIndex, columnIndex) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var cell = this.getCell_(rowIndex, columnIndex), result = null;
  cell && (result = cell.v, result = goog.isDef(result) ? result : null);
  return result;
};
google.visualization.DataTable.prototype.getCell_ = function(rowIndex, columnIndex) {
  return this.dataRows_[rowIndex].c[columnIndex];
};
google.visualization.DataTable.prototype.getCellCache_ = function(rowIndex, columnIndex) {
  this.cache_[rowIndex] = this.cache_[rowIndex] || [];
  var rowCache = this.cache_[rowIndex], cellCache = rowCache[columnIndex] || {};
  return rowCache[columnIndex] = cellCache;
};
google.visualization.DataTable.prototype.invalidateCellCache_ = function(rowIndex, columnIndex) {
  var rowCache = this.cache_[rowIndex];
  rowCache && rowCache[columnIndex] && (rowCache[columnIndex] = {});
};
google.visualization.DataTable.prototype.invalidateEntireCellCache_ = function() {
  this.cache_ = [];
};
google.visualization.DataTable.prototype.getFormattedValue = function(rowIndex, columnIndex) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var cell = this.getCell_(rowIndex, columnIndex), formattedValue = "";
  if (cell) {
    if ("undefined" != typeof cell.f && null != cell.f) {
      formattedValue = cell.f;
    } else {
      var cellCache = this.getCellCache_(rowIndex, columnIndex);
      if (goog.isDef(cellCache.formattedValue)) {
        formattedValue = cellCache.formattedValue;
      } else {
        var value = this.getValue(rowIndex, columnIndex);
        goog.isNull(value) || (formattedValue = google.visualization.datautils.getDefaultFormattedValue(value, this.getColumnType(columnIndex)));
        cellCache.formattedValue = formattedValue;
      }
    }
  }
  return formattedValue;
};
google.visualization.DataTable.prototype.getProperty = function(rowIndex, columnIndex, property) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var cell = this.getCell_(rowIndex, columnIndex), properties = cell && cell.p;
  return properties && property in properties ? properties[property] : null;
};
google.visualization.DataTable.prototype.getProperties = function(rowIndex, columnIndex) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var cell = this.getCell_(rowIndex, columnIndex);
  cell || (cell = {v:null, f:null}, this.dataRows_[rowIndex].c[columnIndex] = cell);
  cell.p || (cell.p = {});
  return cell.p;
};
google.visualization.DataTable.prototype.getTableProperties = function() {
  return this.tableProperties_;
};
google.visualization.DataTable.prototype.getTableProperty = function(property) {
  var properties = this.tableProperties_;
  return properties && property in properties ? properties[property] : null;
};
google.visualization.DataTable.prototype.setTableProperties = function(properties) {
  this.tableProperties_ = properties;
};
google.visualization.DataTable.prototype.setTableProperty = function(property, value) {
  this.tableProperties_ || (this.tableProperties_ = {});
  this.tableProperties_[property] = value;
};
google.visualization.DataTable.prototype.setValue = function(rowIndex, columnIndex, value) {
  this.setCell(rowIndex, columnIndex, value, void 0, void 0);
};
google.visualization.DataTable.prototype.setFormattedValue = function(rowIndex, columnIndex, formattedValue) {
  this.setCell(rowIndex, columnIndex, void 0, formattedValue, void 0);
};
google.visualization.DataTable.prototype.setProperties = function(rowIndex, columnIndex, properties) {
  this.setCell(rowIndex, columnIndex, void 0, void 0, properties);
};
google.visualization.DataTable.prototype.setProperty = function(rowIndex, columnIndex, property, value) {
  var properties = this.getProperties(rowIndex, columnIndex);
  properties[property] = value;
};
google.visualization.DataTable.prototype.setCell = function(rowIndex, columnIndex, opt_value, opt_formattedValue, opt_properties) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  this.invalidateCellCache_(rowIndex, columnIndex);
  var cell = this.getCell_(rowIndex, columnIndex);
  cell || (cell = {}, this.dataRows_[rowIndex].c[columnIndex] = cell);
  if ("undefined" != typeof opt_value) {
    var colType = this.getColumnType(columnIndex);
    colType == google.visualization.ColumnType.NUMBER && goog.isString(opt_value) && !isNaN(opt_value) ? cell.v = Number(opt_value) : (google.visualization.datautils.validateTypeMatch(this, columnIndex, opt_value), cell.v = opt_value);
  }
  "undefined" != typeof opt_formattedValue && (cell.f = opt_formattedValue);
  goog.isDef(opt_properties) && (cell.p = goog.isObject(opt_properties) ? opt_properties : {});
};
google.visualization.DataTable.prototype.setRowProperties = function(rowIndex, properties) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  var row = this.dataRows_[rowIndex];
  row.p = properties;
};
google.visualization.DataTable.prototype.setRowProperty = function(rowIndex, property, value) {
  var properties = this.getRowProperties(rowIndex);
  properties[property] = value;
};
google.visualization.DataTable.prototype.getRowProperty = function(rowIndex, property) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  var row = this.dataRows_[rowIndex], properties = row && row.p;
  return properties && property in properties ? properties[property] : null;
};
google.visualization.DataTable.prototype.getRowProperties = function(rowIndex) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  var row = this.dataRows_[rowIndex];
  row.p || (row.p = {});
  return row.p;
};
google.visualization.DataTable.prototype.setColumnLabel = function(columnIndex, newLabel) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var column = this.dataCols_[columnIndex];
  column.label = newLabel;
};
google.visualization.DataTable.prototype.setColumnProperties = function(columnIndex, properties) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var column = this.dataCols_[columnIndex];
  column.p = properties;
};
google.visualization.DataTable.prototype.setColumnProperty = function(columnIndex, property, value) {
  var properties = this.getColumnProperties(columnIndex);
  properties[property] = value;
};
google.visualization.DataTable.prototype.getColumnProperty = function(columnIndex, property) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var column = this.dataCols_[columnIndex], properties = column && column.p;
  return properties && property in properties ? properties[property] : null;
};
google.visualization.DataTable.prototype.getColumnProperties = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var column = this.dataCols_[columnIndex];
  column.p || (column.p = {});
  return column.p;
};
google.visualization.DataTable.prototype.insertColumn = function(atColIndex, specification, opt_label, opt_id) {
  atColIndex !== this.dataCols_.length && (this.invalidateEntireCellCache_(), google.visualization.datautils.validateColumnIndex(this, atColIndex));
  if (!goog.isObject(specification)) {
    var label = opt_label || "", id = opt_id || "";
    specification = {id:id, label:label, pattern:"", type:specification};
  }
  var type = specification.type;
  if (!goog.object.contains(google.visualization.ColumnType, type)) {
    throw Error("Invalid type, " + type + ', for column "' + (specification.label || specification.id || atColIndex) + '".');
  }
  var role = specification.role;
  if (specification.role) {
    var properties = specification.p || {};
    goog.isDefAndNotNull(properties.role) || (properties.role = role, specification.p = properties);
  }
  this.dataCols_.splice(atColIndex, 0, specification);
  this.invalidateColumnRefMap();
  for (var i = 0;i < this.dataRows_.length;i++) {
    this.dataRows_[i].c.splice(atColIndex, 0, {v:null, f:null});
  }
};
google.visualization.DataTable.prototype.addColumn = function(specification, opt_label, opt_id) {
  this.insertColumn(this.dataCols_.length, specification, opt_label, opt_id);
  return this.dataCols_.length - 1;
};
google.visualization.DataTable.prototype.parseCell_ = function(columnIndex, cell) {
  var result = google.visualization.datautils.parseCell(cell);
  google.visualization.datautils.validateTypeMatch(this, columnIndex, result.v);
  return result;
};
google.visualization.DataTable.MAX_NUMBER_OF_ROWS_TO_INSERT_AT_ONCE_ = 1E4;
google.visualization.DataTable.prototype.insertRows = function(atRowIndex, numOrArray) {
  atRowIndex !== this.dataRows_.length && (this.invalidateEntireCellCache_(), google.visualization.datautils.validateRowIndex(this, atRowIndex));
  var rowsToAdd;
  if (goog.isArray(numOrArray)) {
    rowsToAdd = numOrArray;
  } else {
    if ("number" == typeof numOrArray) {
      if (numOrArray != Math.floor(numOrArray) || 0 > numOrArray) {
        throw Error("Invalid value for numOrArray: " + numOrArray + ". If numOrArray is a number it should be a nonnegative integer.");
      }
      rowsToAdd = goog.array.repeat(null, numOrArray);
    } else {
      throw Error("Invalid value for numOrArray. Should be a number or an array of arrays of cells.");
    }
  }
  for (var newRows = [], i = 0;i < rowsToAdd.length;i++) {
    var row = rowsToAdd[i], newRowContent = [];
    if (null === row) {
      for (var col = 0;col < this.dataCols_.length;col++) {
        newRowContent.push({v:null, f:null});
      }
    } else {
      if (goog.isArray(row)) {
        if (row.length != this.dataCols_.length) {
          throw Error("Row given with size different than " + this.dataCols_.length + " (the number of columns in the table).");
        }
        for (var j = 0;j < row.length;j++) {
          newRowContent.push(this.parseCell_(j, row[j]));
        }
      } else {
        throw Error("Every row given must be either null or an array.");
      }
    }
    var newRow = {};
    newRow.c = newRowContent;
    newRows.push(newRow);
    newRows.length == google.visualization.DataTable.MAX_NUMBER_OF_ROWS_TO_INSERT_AT_ONCE_ && (goog.array.insertArrayAt(this.dataRows_, newRows, atRowIndex), atRowIndex += newRows.length, newRows = []);
  }
  goog.array.insertArrayAt(this.dataRows_, newRows, atRowIndex);
  return atRowIndex + newRows.length - 1;
};
google.visualization.DataTable.prototype.addRows = function(numOrArray) {
  if ("number" == typeof numOrArray || goog.isArray(numOrArray)) {
    return this.insertRows(this.dataRows_.length, numOrArray);
  }
  throw Error("Argument given to addRows must be either a number or an array");
};
google.visualization.DataTable.prototype.addRow = function(opt_cellArray) {
  var cellArray = opt_cellArray;
  if (goog.isArray(cellArray)) {
    return this.addRows([cellArray]);
  }
  if (goog.isDefAndNotNull(cellArray)) {
    throw Error("If argument is given to addRow, it must be an array, or null");
  }
  return this.addRows(1);
};
google.visualization.DataTable.prototype.getColumnRange = function(columnIndex) {
  return google.visualization.datautils.getColumnRange(this, columnIndex);
};
google.visualization.DataTable.prototype.getSortedRows = function(sortColumns) {
  return google.visualization.datautils.getSortedRows(this, sortColumns);
};
google.visualization.DataTable.prototype.sort = function(sortColumns) {
  this.invalidateEntireCellCache_();
  var getValue = function(row, colIndex) {
    var cell = row.c[colIndex], value = cell ? cell.v : null;
    return value;
  }, comparisonFunction = google.visualization.datautils.standardizeSortColumns(this, getValue, sortColumns);
  goog.array.stableSort(this.dataRows_, comparisonFunction);
};
google.visualization.DataTable.prototype.getUnderlyingTableColumnIndex = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  return columnIndex;
};
google.visualization.DataTable.prototype.getUnderlyingTableRowIndex = function(rowIndex) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  return rowIndex;
};
google.visualization.DataTable.prototype.clone = function() {
  return new google.visualization.DataTable(this.toPOJO());
};
google.visualization.DataTable.prototype.toPOJO = function() {
  var obj = {cols:this.dataCols_, rows:this.dataRows_, p:this.tableProperties_}, data = gviz.json.clone(obj);
  return data;
};
google.visualization.DataTable.prototype.toJSON = function() {
  return goog.json.serialize(this.toPOJO());
};
google.visualization.DataTable.prototype.getDistinctValues = function(column) {
  return google.visualization.datautils.getDistinctValues(this, column);
};
google.visualization.DataTable.prototype.getFilteredRows = function(columnFilters) {
  return google.visualization.datautils.getFilteredRows(this, columnFilters);
};
google.visualization.DataTable.prototype.removeRows = function(fromRowIndex, numRows) {
  0 >= numRows || (this.invalidateEntireCellCache_(), google.visualization.datautils.validateRowIndex(this, fromRowIndex), fromRowIndex + numRows > this.dataRows_.length && (numRows = this.dataRows_.length - fromRowIndex), this.dataRows_.splice(fromRowIndex, numRows));
};
google.visualization.DataTable.prototype.removeRow = function(rowIndex) {
  this.removeRows(rowIndex, 1);
};
google.visualization.DataTable.prototype.removeColumns = function(fromColIndex, numCols) {
  if (!(0 >= numCols)) {
    this.invalidateEntireCellCache_();
    google.visualization.datautils.validateColumnIndex(this, fromColIndex);
    fromColIndex + numCols > this.dataCols_.length && (numCols = this.dataCols_.length - fromColIndex);
    this.dataCols_.splice(fromColIndex, numCols);
    this.invalidateColumnRefMap();
    for (var i = 0;i < this.dataRows_.length;i++) {
      this.dataRows_[i].c.splice(fromColIndex, numCols);
    }
  }
};
google.visualization.DataTable.prototype.removeColumn = function(colIndex) {
  this.removeColumns(colIndex, 1);
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/barformat.js)
google.visualization.BarFormat = function(opt_options) {
  this.options_ = opt_options || {};
  google.visualization.BarFormat.imagePathPrefix_ || (google.visualization.BarFormat.imagePathPrefix_ = gviz.util.VisCommon.getModulePath() + "/util/bar_");
};
google.visualization.BarFormat.DEFAULT_BAR_WIDTH_ = 100;
google.visualization.BarFormat.CUSTOM_PROPERTY_KEY_ = "_bar_format_old_value";
google.visualization.BarFormat.imagePathPrefix_ = null;
google.visualization.BarFormat.ImageType_ = {BORDER:"s", GREEN:"g", BLUE:"b", RED:"r", WHITE:"w", ZERO:"z"};
google.visualization.BarFormat.colorTypeByName_ = {red:google.visualization.BarFormat.ImageType_.RED, blue:google.visualization.BarFormat.ImageType_.BLUE, green:google.visualization.BarFormat.ImageType_.GREEN};
google.visualization.BarFormat.addBar_ = function(type, width, html) {
  0 < width && html.push('<img style="padding: 0" src="', google.visualization.BarFormat.imagePathPrefix_, type, '.png" height="12" width="', width, '" />');
};
google.visualization.BarFormat.prototype.format = function(dataTable, columnIndex) {
  if ("number" == dataTable.getColumnType(columnIndex)) {
    var options = this.options_, min = options.min, max = options.max, range = null;
    if (null == min || null == max) {
      range = dataTable.getColumnRange(columnIndex), null == max && (max = range.max), null == min && (min = Math.min(0, range.min));
    }
    min >= max && (range = range || dataTable.getColumnRange(columnIndex), max = range.max, min = range.min);
    min == max && (0 == min ? max = 1 : 0 < min ? min = 0 : max = 0);
    var range = max - min, base = options.base || 0, base = Math.max(min, Math.min(max, base)), width = options.width || google.visualization.BarFormat.DEFAULT_BAR_WIDTH_, showValue = options.showValue;
    null == showValue && (showValue = !0);
    for (var negativeWidth = Math.round((base - min) / range * width), positiveWidth = width - negativeWidth, row = 0;row < dataTable.getNumberOfRows();row++) {
      var value = dataTable.getValue(row, columnIndex), html = [], clippedValue = Math.max(min, Math.min(max, value)), offset = Math.ceil((clippedValue - min) / range * width);
      html.push('<span style="padding: 0; float: left; white-space: nowrap;">');
      google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.BORDER, 1, html);
      var imageTypePositive = google.visualization.BarFormat.getTypeByColor_(options.colorPositive, google.visualization.BarFormat.ImageType_.BLUE), imageTypeNegative = google.visualization.BarFormat.getTypeByColor_(options.colorNegative, google.visualization.BarFormat.ImageType_.RED), zeroLineWidth = options.drawZeroLine ? 1 : 0;
      0 < negativeWidth ? clippedValue < base ? (google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.WHITE, offset, html), google.visualization.BarFormat.addBar_(imageTypeNegative, negativeWidth - offset, html), 0 < zeroLineWidth && google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.ZERO, zeroLineWidth, html), google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.WHITE, positiveWidth, html)) : (google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.WHITE, 
      negativeWidth, html), 0 < zeroLineWidth && google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.ZERO, zeroLineWidth, html), google.visualization.BarFormat.addBar_(imageTypePositive, offset - negativeWidth, html), google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.WHITE, width - offset, html)) : (google.visualization.BarFormat.addBar_(imageTypePositive, offset, html), google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.WHITE, 
      width - offset, html));
      google.visualization.BarFormat.addBar_(google.visualization.BarFormat.ImageType_.BORDER, 1, html);
      var originalFormattedValue = dataTable.getProperty(row, columnIndex, google.visualization.BarFormat.CUSTOM_PROPERTY_KEY_);
      null == originalFormattedValue && (originalFormattedValue = dataTable.getFormattedValue(row, columnIndex), dataTable.setProperty(row, columnIndex, google.visualization.BarFormat.CUSTOM_PROPERTY_KEY_, originalFormattedValue));
      showValue && (html.push("\u00a0"), html.push(originalFormattedValue));
      html.push("</span>\u00a0");
      dataTable.setFormattedValue(row, columnIndex, html.join(""));
    }
  }
};
google.visualization.BarFormat.getTypeByColor_ = function(color, defaultType) {
  color = (color || "").toLowerCase();
  return google.visualization.BarFormat.colorTypeByName_[color] || defaultType;
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/colorformat.js)
gviz.format = {};
gviz.format.ColorRange = function(from, to, color, bgcolor) {
  goog.isDateLike(from) && (from = from.getTime());
  goog.isDateLike(to) && (to = to.getTime());
  goog.isArray(from) && (from = google.visualization.ColorFormat.getTimeOfDayMillis(from));
  goog.isArray(to) && (to = google.visualization.ColorFormat.getTimeOfDayMillis(to));
  this.from_ = from;
  this.to_ = to;
  this.color_ = color;
  this.bgcolor_ = bgcolor;
};
gviz.format.ColorRange.prototype.contains = function(value) {
  var from = this.from_, to = this.to_;
  if (null == value) {
    return null == from && null == to;
  }
  goog.isDateLike(value) ? value = value.getTime() : goog.isArray(value) && (value = google.visualization.ColorFormat.getTimeOfDayMillis(value));
  return(null == from || value >= from) && (null == to || value < to);
};
gviz.format.ColorRange.prototype.getColor = function() {
  return this.color_;
};
gviz.format.ColorRange.prototype.getBackgroundColor = function() {
  return this.bgcolor_;
};
gviz.format.ColorRange.prototype.getFrom = function() {
  return this.from_;
};
gviz.format.GradientColorRange = function(from, to, color, fromBgColor, toBgColor) {
  gviz.format.ColorRange.call(this, from, to, color, "");
  this.rangeSize_ = to - from;
  0 >= this.rangeSize_ && (this.rangeSize_ = 1);
  this.fromColor_ = goog.color.hexToRgb(goog.color.parse(fromBgColor).hex);
  this.toColor_ = goog.color.hexToRgb(goog.color.parse(toBgColor).hex);
};
goog.inherits(gviz.format.GradientColorRange, gviz.format.ColorRange);
gviz.format.GradientColorRange.prototype.getBackgroundColor = function(value) {
  if (!goog.isNumber(value)) {
    return "";
  }
  var factor = 1 - (value - this.getFrom()) / this.rangeSize_, rgb = goog.color.blend(this.fromColor_, this.toColor_, factor);
  return goog.color.rgbToHex(rgb[0], rgb[1], rgb[2]);
};
google.visualization.ColorFormat = function() {
  this.ranges_ = [];
};
google.visualization.ColorFormat.prototype.addRange = function(from, to, color, bgcolor) {
  this.ranges_.push(new gviz.format.ColorRange(from, to, color, bgcolor));
};
google.visualization.ColorFormat.prototype.addGradientRange = function(from, to, color, fromBgColor, toBgColor) {
  this.ranges_.push(new gviz.format.GradientColorRange(from, to, color, fromBgColor, toBgColor));
};
google.visualization.ColorFormat.prototype.format = function(dataTable, columnIndex) {
  var type = dataTable.getColumnType(columnIndex);
  if ("number" == type || "string" == type || "date" == type || "datetime" == type || "timeofday" == type) {
    for (var row = 0;row < dataTable.getNumberOfRows();row++) {
      for (var value = dataTable.getValue(row, columnIndex), styles = "", i = 0;i < this.ranges_.length;i++) {
        var range = this.ranges_[i];
        if (range.contains(value)) {
          var color = range.getColor(), bgcolor = range.getBackgroundColor(value);
          color && (styles += "color:" + color + ";");
          bgcolor && (styles += "background-color:" + bgcolor + ";");
          break;
        }
      }
      dataTable.setProperty(row, columnIndex, "style", styles);
    }
  }
};
google.visualization.ColorFormat.getTimeOfDayMillis = function(value) {
  return 36E5 * value[0] + 6E4 * value[1] + 1E3 * value[2] + (4 == value.length ? value[3] : 0);
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/patternformat.js)
google.visualization.TablePatternFormat = function(pattern) {
  this.pattern_ = pattern || "";
};
google.visualization.TablePatternFormat.replacer_ = function(rowIndex, dataTable, srcColumnIndices, matchStr, idxStr, offset, pattern) {
  return 0 < offset && "\\" == pattern[offset - 1] ? matchStr : dataTable.getFormattedValue(rowIndex, srcColumnIndices[parseInt(idxStr, 10)]);
};
google.visualization.TablePatternFormat.prototype.format = function(dataTable, srcColumnIndices, opt_dstColumnIndex, opt_propertyName) {
  var dstColumnIdx = srcColumnIndices[0];
  null != opt_dstColumnIndex && "number" == goog.typeOf(opt_dstColumnIndex) && (dstColumnIdx = opt_dstColumnIndex);
  for (var propertyName = opt_propertyName || null, r = 0;r < dataTable.getNumberOfRows();r++) {
    var formattedValue = this.pattern_.replace(/{(\d+)}/g, goog.partial(google.visualization.TablePatternFormat.replacer_, r, dataTable, srcColumnIndices)), formattedValue = formattedValue.replace(/\\(.)/g, "$1");
    propertyName ? dataTable.setProperty(r, dstColumnIdx, propertyName, formattedValue) : dataTable.setFormattedValue(r, dstColumnIdx, formattedValue);
  }
};
// INPUT (javascript/gviz/devel/jsapi/packages/format/googleapis_exports.js)
goog.exportSymbol("google.visualization.NumberFormat", google.visualization.NumberFormat);
goog.exportProperty(google.visualization.NumberFormat.prototype, "format", google.visualization.NumberFormat.prototype.format);
goog.exportProperty(google.visualization.NumberFormat.prototype, "formatValue", google.visualization.NumberFormat.prototype.formatValue);
goog.exportSymbol("google.visualization.NumberFormat.useNativeCharactersIfAvailable", google.visualization.NumberFormat.useNativeCharactersIfAvailable);
goog.exportSymbol("google.visualization.NumberFormat.DECIMAL_SEP", google.visualization.NumberFormat.DECIMAL_SEP);
goog.exportSymbol("google.visualization.NumberFormat.GROUP_SEP", google.visualization.NumberFormat.GROUP_SEP);
goog.exportSymbol("google.visualization.NumberFormat.DECIMAL_PATTERN", google.visualization.NumberFormat.DECIMAL_PATTERN);
goog.exportSymbol("google.visualization.ColorFormat", google.visualization.ColorFormat);
goog.exportProperty(google.visualization.ColorFormat.prototype, "format", google.visualization.ColorFormat.prototype.format);
goog.exportProperty(google.visualization.ColorFormat.prototype, "addRange", google.visualization.ColorFormat.prototype.addRange);
goog.exportProperty(google.visualization.ColorFormat.prototype, "addGradientRange", google.visualization.ColorFormat.prototype.addGradientRange);
goog.exportSymbol("google.visualization.BarFormat", google.visualization.BarFormat);
goog.exportProperty(google.visualization.BarFormat.prototype, "format", google.visualization.BarFormat.prototype.format);
goog.exportSymbol("google.visualization.ArrowFormat", google.visualization.TableArrowFormat);
goog.exportProperty(google.visualization.TableArrowFormat.prototype, "format", google.visualization.TableArrowFormat.prototype.format);
goog.exportSymbol("google.visualization.PatternFormat", google.visualization.TablePatternFormat);
goog.exportProperty(google.visualization.TablePatternFormat.prototype, "format", google.visualization.TablePatternFormat.prototype.format);
goog.exportSymbol("google.visualization.DateFormat", google.visualization.DateFormat);
goog.exportProperty(google.visualization.DateFormat.dontLocalizeDigits, "dontLocalizeDigits", google.visualization.DateFormat.dontLocalizeDigits);
goog.exportProperty(google.visualization.DateFormat.prototype, "format", google.visualization.DateFormat.prototype.format);
goog.exportProperty(google.visualization.DateFormat.prototype, "formatValue", google.visualization.DateFormat.prototype.formatValue);
goog.exportSymbol("google.visualization.NumberFormat", google.visualization.NumberFormat);
goog.exportProperty(google.visualization.NumberFormat.prototype, "format", google.visualization.NumberFormat.prototype.format);
goog.exportSymbol("google.visualization.TableColorFormat", google.visualization.ColorFormat);
goog.exportSymbol("google.visualization.TableBarFormat", google.visualization.BarFormat);
goog.exportProperty(google.visualization.BarFormat.prototype, "format", google.visualization.BarFormat.prototype.format);
goog.exportSymbol("google.visualization.TableArrowFormat", google.visualization.TableArrowFormat);
goog.exportProperty(google.visualization.TableArrowFormat.prototype, "format", google.visualization.TableArrowFormat.prototype.format);
goog.exportSymbol("google.visualization.TablePatternFormat", google.visualization.TablePatternFormat);
goog.exportProperty(google.visualization.TablePatternFormat.prototype, "format", google.visualization.TablePatternFormat.prototype.format);
goog.exportSymbol("google.visualization.TableDateFormat", google.visualization.DateFormat);
goog.exportSymbol("goog", goog);
goog.exportSymbol("gviz", gviz);
goog.exportSymbol("google.visualization.datautils.validateColumnIndex", google. visualization.datautils.validateColumnIndex);
goog.exportSymbol("google.visualization.datautils.validateRowIndex", google.    visualization.datautils.validateRowIndex);
goog.exportSymbol("google.visualization.IDataTable", google.visualization.      IDataTable);
goog.exportSymbol("google.visualization.DataTable", google.visualization.       DataTable);
goog.exportSymbol("google.visualization.datautils.arrayToDataTable", google.    visualization.datautils.arrayToDataTable);
goog.exportSymbol("$jscomp", $jscomp);
;window.google&&window.google.loader&&window.google.loader.eval&&window.google.loader.eval.visualization&&(window.google.loader.eval.visualization=function(){eval(arguments[0])});
});
/*jsl:END*/
