// Copyright 2014 Google Inc. All Rights Reserved.
/*jsl:ignore*/
define([
  'qowtRoot/third_party/gviz/gviz_format_module'
  ], function() {
// INPUT (javascript/gviz/devel/jsapi/packages/core/queryresponse.js)
google.visualization.QueryResponse = function(responseObj) {
  this.responseVersion_ = google.visualization.QueryResponse.getVersionFromResponse(responseObj);
  this.executionStatus_ = responseObj.status;
  this.errors_ = [];
  this.warnings_ = [];
  this.warnings_ = responseObj.warnings || [];
  this.errors_ = responseObj.errors || [];
  google.visualization.QueryResponse.sanitizeMessages_(this.warnings_);
  google.visualization.QueryResponse.sanitizeMessages_(this.errors_);
  this.executionStatus_ != google.visualization.QueryResponse.ExecutionStatus.ERROR && (this.signature_ = responseObj.sig, this.dataTable_ = new google.visualization.DataTable(responseObj.table, this.responseVersion_));
};
google.visualization.QueryResponse.sanitizeMessages_ = function(messages) {
  for (var i = 0;i < messages.length;i++) {
    var detailed_message = messages[i].detailed_message;
    detailed_message && (messages[i].detailed_message = google.visualization.QueryResponse.escapeDetailedMessage_(detailed_message));
  }
};
google.visualization.QueryResponse.generateSimpleWarningsErrorsArray_ = function(responseObj) {
  return[{reason:responseObj.reason, message:responseObj.message, detailed_message:google.visualization.QueryResponse.escapeDetailedMessage_(responseObj.detailed_message)}];
};
google.visualization.QueryResponse.DETAILED_MESSAGE_A_TAG_REGEXP_ = /^[^<]*(<a(( )+target=('_blank')?("_blank")?)?( )+(href=('[^']*')?("[^"]*")?)>[^<]*<\/a>[^<]*)*$/;
google.visualization.QueryResponse.BAD_JAVASCRIPT_REGEXP_ = /javascript((s)?( )?)*:/;
google.visualization.QueryResponse.escapeDetailedMessage_ = function(message) {
  return message ? message.match(google.visualization.QueryResponse.DETAILED_MESSAGE_A_TAG_REGEXP_) && !message.match(google.visualization.QueryResponse.BAD_JAVASCRIPT_REGEXP_) ? message : message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;") : "";
};
google.visualization.QueryResponse.getVersionFromResponse = function(responseObj) {
  var responseVersion = responseObj.version || google.visualization.ResponseVersion.VERSION_0_6;
  return goog.object.contains(google.visualization.ResponseVersion, responseVersion) ? responseVersion : google.visualization.ResponseVersion.VERSION_0_6;
};
google.visualization.QueryResponse.ExecutionStatus = {OK:"ok", WARNING:"warning", ERROR:"error"};
google.visualization.QueryResponse.prototype.signature_ = null;
google.visualization.QueryResponse.prototype.dataTable_ = null;
google.visualization.QueryResponse.prototype.getVersion = function() {
  return this.responseVersion_;
};
google.visualization.QueryResponse.prototype.isError = function() {
  return this.executionStatus_ == google.visualization.QueryResponse.ExecutionStatus.ERROR;
};
google.visualization.QueryResponse.prototype.hasWarning = function() {
  return this.executionStatus_ == google.visualization.QueryResponse.ExecutionStatus.WARNING;
};
google.visualization.QueryResponse.prototype.containsReason = function(reason) {
  for (var i = 0;i < this.errors_.length;i++) {
    if (this.errors_[i].reason == reason) {
      return!0;
    }
  }
  for (i = 0;i < this.warnings_.length;i++) {
    if (this.warnings_[i].reason == reason) {
      return!0;
    }
  }
  return!1;
};
google.visualization.QueryResponse.prototype.getDataSignature = function() {
  return this.signature_;
};
google.visualization.QueryResponse.prototype.getDataTable = function() {
  return this.dataTable_;
};
google.visualization.QueryResponse.prototype.getErrorsOrWarningsProperties_ = function(property) {
  return this.isError() && this.errors_ && this.errors_[0] && this.errors_[0][property] ? this.errors_[0][property] : this.hasWarning() && this.warnings_ && this.warnings_[0] && this.warnings_[0][property] ? this.warnings_[0][property] : null;
};
google.visualization.QueryResponse.prototype.getReasons = function() {
  var reason = this.getErrorsOrWarningsProperties_("reason");
  return goog.isDefAndNotNull(reason) && "" != reason ? [reason] : [];
};
google.visualization.QueryResponse.prototype.getMessage = function() {
  return this.getErrorsOrWarningsProperties_("message") || "";
};
google.visualization.QueryResponse.prototype.getDetailedMessage = function() {
  return this.getErrorsOrWarningsProperties_("detailed_message") || "";
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/errors.js)
google.visualization.errors = {};
google.visualization.errors.EXTERNAL_CLASS_NAME_ = "google-visualization-errors";
google.visualization.errors.ERROR_ID_PREFIX_ = google.visualization.errors.EXTERNAL_CLASS_NAME_ + "-";
google.visualization.errors.INTERNAL_ERROR_MSG_PREFIX_ = google.visualization.errors.EXTERNAL_CLASS_NAME_ + ":";
google.visualization.errors.ALL_ERRORS_DIV_ID_PREFIX_ = google.visualization.errors.EXTERNAL_CLASS_NAME_ + "-all-";
google.visualization.errors.CONTAINER_NULL_MSG_ = google.visualization.errors.INTERNAL_ERROR_MSG_PREFIX_ + " container is null";
google.visualization.errors.ERROR_STYLE_ = "background-color: #c00000; color: white; padding: 2px;";
google.visualization.errors.WARNING_STYLE_ = "background-color: #fff4c2; color: black; white-space: nowrap; padding: 2px; border: 1px solid black;";
google.visualization.errors.WRAPPER_STYLE_ = "font: normal 0.8em arial,sans-serif; margin-bottom: 5px;";
google.visualization.errors.REMOVE_ELEMENT_STYLE_ = "font-size: 1.1em; color: #0000cc; font-weight: bold; cursor: pointer; padding-left: 10px; color: black;text-align: right; vertical-align: top;";
google.visualization.errors.errorsCounterId_ = 0;
google.visualization.errors.addError = function(container, message, opt_detailedMessage, opt_options) {
  if (!google.visualization.errors.validateContainer_(container)) {
    throw Error(google.visualization.errors.CONTAINER_NULL_MSG_ + ". message: " + message);
  }
  var params = google.visualization.errors.initUserParams_(message, opt_detailedMessage, opt_options), errorMessage = params.errorMessage, detailedMessage = params.detailedMessage, options = params.options, showInTooltip = goog.isDefAndNotNull(options.showInTooltip) ? !!options.showInTooltip : !0, type = "warning" == options.type ? "warning" : "error", style = "error" == type ? google.visualization.errors.ERROR_STYLE_ : google.visualization.errors.WARNING_STYLE_, style = style + (options.style ? 
  options.style : ""), removable = !!options.removable, dom = goog.dom.getDomHelper(), errorDiv = dom.createDom("span", {style:style}, dom.createTextNode(errorMessage)), elementId = google.visualization.errors.ERROR_ID_PREFIX_ + google.visualization.errors.errorsCounterId_++, errorWrapperDiv = dom.createDom("div", {id:elementId, style:google.visualization.errors.WRAPPER_STYLE_}, errorDiv);
  if (detailedMessage) {
    if (showInTooltip) {
      errorDiv.title = detailedMessage;
    } else {
      var details = document.createElement("span");
      details.innerHTML = detailedMessage;
      dom.appendChild(errorWrapperDiv, dom.createDom("div", {style:"padding: 2px"}, details));
    }
  }
  if (removable) {
    var removeSpan = dom.createDom("span", {style:google.visualization.errors.REMOVE_ELEMENT_STYLE_}, dom.createTextNode("\u00d7"));
    removeSpan.onclick = goog.partial(google.visualization.errors.handleRemove_, errorWrapperDiv);
    dom.appendChild(errorDiv, removeSpan);
  }
  google.visualization.errors.addElement_(container, errorWrapperDiv);
  options.removeDuplicates && google.visualization.errors.removeDuplicates_(container, errorWrapperDiv);
  var logger = gviz.util.VisCommon.createLogger("Google Charts");
  "warning" === type ? goog.log.warning(logger, errorMessage) : goog.log.error(logger, errorMessage);
  return elementId;
};
google.visualization.errors.removeAll = function(container) {
  if (!google.visualization.errors.validateContainer_(container)) {
    throw Error(google.visualization.errors.CONTAINER_NULL_MSG_);
  }
  var errorsDiv = google.visualization.errors.getErrorsDivFromContainer_(container, !1);
  errorsDiv && (errorsDiv.style.display = "none", goog.dom.removeChildren(errorsDiv));
};
google.visualization.errors.addErrorFromQueryResponse = function(container, response) {
  if (!google.visualization.errors.validateContainer_(container)) {
    throw Error(google.visualization.errors.CONTAINER_NULL_MSG_);
  }
  if (!response) {
    var msg = google.visualization.errors.INTERNAL_ERROR_MSG_PREFIX_ + " response is null";
    throw Error(msg);
  }
  if (!response.isError() && !response.hasWarning()) {
    return null;
  }
  var reasons = response.getReasons(), showInTooltip = !0;
  response.isError() && (showInTooltip = !(goog.array.contains(reasons, "user_not_authenticated") || goog.array.contains(reasons, "invalid_query")));
  var message = response.getMessage(), detailedMessage = response.getDetailedMessage(), options = {showInTooltip:showInTooltip};
  options.type = response.isError() ? "error" : "warning";
  options.removeDuplicates = !0;
  return google.visualization.errors.addError(container, message, detailedMessage, options);
};
google.visualization.errors.removeError = function(id) {
  var element = document.getElementById(id);
  return google.visualization.errors.validateErrorElement_(element) ? (google.visualization.errors.handleRemove_(element), !0) : !1;
};
google.visualization.errors.getContainer = function(errorId) {
  var element = document.getElementById(errorId);
  return google.visualization.errors.validateErrorElement_(element) ? element.parentNode.parentNode : null;
};
google.visualization.errors.createProtectedCallback = function(callback, handler) {
  return function() {
    if (goog.DEBUG) {
      callback.apply(null, arguments);
    } else {
      try {
        callback.apply(null, arguments);
      } catch (x) {
        goog.isFunction(handler) ? handler(x) : google.visualization.errors.addError(handler, x.message);
      }
    }
  };
};
google.visualization.errors.handleRemove_ = function(element) {
  var allErrorsDiv = element.parentNode;
  goog.dom.removeNode(element);
  0 == allErrorsDiv.childNodes.length && (allErrorsDiv.style.display = "none");
};
google.visualization.errors.validateErrorElement_ = function(element) {
  if (goog.dom.isNodeLike(element) && element.id && goog.string.startsWith(element.id, google.visualization.errors.ERROR_ID_PREFIX_)) {
    var allErrorsDiv = element.parentNode;
    if (allErrorsDiv && allErrorsDiv.id && goog.string.startsWith(allErrorsDiv.id, google.visualization.errors.ALL_ERRORS_DIV_ID_PREFIX_) && allErrorsDiv.parentNode) {
      return!0;
    }
  }
  return!1;
};
google.visualization.errors.initUserParams_ = function(message, opt_detailedMessage, opt_options) {
  var errorMessage = goog.isDefAndNotNull(message) && message ? message : "error", detailedMessage = "", options = {}, numArgs = arguments.length;
  2 == numArgs ? opt_detailedMessage && "object" == goog.typeOf(opt_detailedMessage) ? options = opt_detailedMessage : detailedMessage = goog.isDefAndNotNull(opt_detailedMessage) ? opt_detailedMessage : detailedMessage : 3 == numArgs && (detailedMessage = goog.isDefAndNotNull(opt_detailedMessage) ? opt_detailedMessage : detailedMessage, options = opt_options || {});
  errorMessage = goog.string.trim(errorMessage);
  detailedMessage = goog.string.trim(detailedMessage);
  return{errorMessage:errorMessage, detailedMessage:detailedMessage, options:options};
};
google.visualization.errors.validateContainer_ = function(container) {
  return goog.isDefAndNotNull(container) && goog.dom.isNodeLike(container);
};
google.visualization.errors.getErrorsDivFromContainer_ = function(container, createNew) {
  for (var childs = container.childNodes, errorsDiv = null, dom = goog.dom.getDomHelper(), i = 0;i < childs.length;i++) {
    if (childs[i].id && goog.string.startsWith(childs[i].id, google.visualization.errors.ALL_ERRORS_DIV_ID_PREFIX_)) {
      errorsDiv = childs[i];
      dom.removeNode(errorsDiv);
      break;
    }
  }
  if (!errorsDiv && createNew) {
    var id = google.visualization.errors.ALL_ERRORS_DIV_ID_PREFIX_ + google.visualization.errors.errorsCounterId_++, errorsDiv = goog.dom.createDom("div", {id:id, style:"display: none; padding-top: 2px"}, null)
  }
  if (errorsDiv) {
    var firstChild = container.firstChild;
    firstChild ? dom.insertSiblingBefore(errorsDiv, firstChild) : dom.appendChild(container, errorsDiv);
  }
  return errorsDiv;
};
google.visualization.errors.addElement_ = function(container, domElement) {
  var errorsDiv = google.visualization.errors.getErrorsDivFromContainer_(container, !0);
  errorsDiv.style.display = "block";
  goog.dom.appendChild(errorsDiv, domElement);
};
google.visualization.errors.forEachErrorElement_ = function(container, handler) {
  var errorsDiv = google.visualization.errors.getErrorsDivFromContainer_(container, !0), errors = errorsDiv && errorsDiv.childNodes;
  goog.array.forEach(errors, function(errorDiv) {
    google.visualization.errors.validateErrorElement_(errorDiv) && handler(errorDiv);
  });
};
google.visualization.errors.removeDuplicates_ = function(container, errorDiv) {
  var idRegExp = /id="?google-visualization-errors-[0-9]*"?/, errorDivOuterHtml = goog.dom.getOuterHtml(errorDiv), errorDivOuterHtml = errorDivOuterHtml.replace(idRegExp, ""), elementsToRemove = [];
  google.visualization.errors.forEachErrorElement_(container, function(el) {
    if (el != errorDiv) {
      var elOuterHtml = goog.dom.getOuterHtml(el), elOuterHtml = elOuterHtml.replace(idRegExp, "");
      elOuterHtml == errorDivOuterHtml && elementsToRemove.push(el);
    }
  });
  goog.array.forEach(elementsToRemove, google.visualization.errors.handleRemove_);
  return elementsToRemove.length;
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/coreutils.js)
gviz.coreutils = {};
gviz.coreutils.getHead = function() {
  if (0 == document.getElementsByTagName("head").length) {
    var htmlElement = document.getElementsByTagName("html")[0], bodyElement = document.getElementsByTagName("body")[0], headElement = document.createElement("head");
    htmlElement.insertBefore(headElement, bodyElement);
  }
  return document.getElementsByTagName("head")[0];
};
gviz.coreutils.appendScript = function(url) {
  var head = gviz.coreutils.getHead(), script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  head.appendChild(script);
};
gviz.coreutils.removeUriParams = function(uri) {
  var question = uri.indexOf("?");
  0 < question && (uri = uri.substring(0, question));
  var hash = uri.indexOf("#");
  0 < hash && (uri = uri.substring(0, hash));
  return uri;
};
gviz.coreutils.getDefaultResponseValidator = function(container) {
  return function(response) {
    google.visualization.errors.removeAll(container);
    var isError = response.isError();
    isError && google.visualization.errors.addErrorFromQueryResponse(container, response);
    return!isError;
  };
};
// INPUT (javascript/closure/debug/entrypointregistry.js)
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    for (var monitors = goog.debug.entryPointRegistry.monitors_, i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for (var transformer = goog.bind(monitor.wrap, monitor), i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  for (var transformer = goog.bind(monitor.unwrap, monitor), i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  monitors.length--;
};
// INPUT (javascript/closure/disposable/idisposable.js)
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
// INPUT (javascript/closure/disposable/disposable.js)
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.instances_[goog.getUid(this)] = this);
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [], id;
  for (id in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(id) && ret.push(goog.Disposable.instances_[Number(id)]);
  }
  return ret;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var uid = goog.getUid(this);
    if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[uid];
  }
};
goog.Disposable.prototype.registerDisposable = function(disposable) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));
};
goog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.isDef(opt_scope) ? goog.bind(callback, opt_scope) : callback);
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    for (;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(obj) {
  return obj && "function" == typeof obj.isDisposed ? obj.isDisposed() : !1;
};
goog.dispose = function(obj) {
  obj && "function" == typeof obj.dispose && obj.dispose();
};
goog.disposeAll = function(var_args) {
  for (var i = 0, len = arguments.length;i < len;++i) {
    var disposable = arguments[i];
    goog.isArrayLike(disposable) ? goog.disposeAll.apply(null, disposable) : goog.dispose(disposable);
  }
};
// INPUT (javascript/closure/events/eventid.js)
goog.events = {};
goog.events.EventId = function(eventId) {
  this.id = eventId;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
// INPUT (javascript/closure/events/event.js)
goog.events.Event = function(type, opt_target) {
  this.type = type instanceof goog.events.EventId ? String(type) : type;
  this.currentTarget = this.target = opt_target;
  this.defaultPrevented = this.propagationStopped_ = !1;
  this.returnValue_ = !0;
};
goog.events.Event.prototype.disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1;
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation();
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault();
};
// INPUT (javascript/closure/reflect/reflect.js)
goog.reflect = {};
goog.reflect.object = function(type, object) {
  return object;
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    return goog.reflect.sinkValue(obj[prop]), !0;
  } catch (e) {
  }
  return!1;
};
// INPUT (javascript/closure/events/browserfeature.js)
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || 
!goog.global.navigator.msMaxTouchPoints)};
// INPUT (javascript/closure/events/eventtype.js)
goog.events.getVendorPrefixedName_ = function(eventName) {
  return goog.userAgent.WEBKIT ? "webkit" + eventName : goog.userAgent.OPERA ? "o" + eventName.toLowerCase() : eventName.toLowerCase();
};
goog.events.EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", 
SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", 
ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), 
ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", 
MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXTINPUT:"textinput", 
COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", 
DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument", DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified"};
// INPUT (javascript/closure/events/browserevent.js)
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  goog.events.Event.call(this, opt_e ? opt_e.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.platformModifierKey = !1;
  this.event_ = null;
  opt_e && this.init(opt_e, opt_currentTarget);
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  this.target = e.target || e.srcElement;
  this.currentTarget = opt_currentTarget;
  var relatedTarget = e.relatedTarget;
  relatedTarget ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(relatedTarget, "nodeName") || (relatedTarget = null)) : type == goog.events.EventType.MOUSEOVER ? relatedTarget = e.fromElement : type == goog.events.EventType.MOUSEOUT && (relatedTarget = e.toElement);
  this.relatedTarget = relatedTarget;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== e.offsetX ? e.offsetX : e.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== e.offsetY ? e.offsetY : e.layerY;
  this.clientX = void 0 !== e.clientX ? e.clientX : e.pageX;
  this.clientY = void 0 !== e.clientY ? e.clientY : e.pageY;
  this.screenX = e.screenX || 0;
  this.screenY = e.screenY || 0;
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || ("keypress" == type ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  e.defaultPrevented && this.preventDefault();
};
goog.events.BrowserEvent.prototype.isButton = function(button) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == button : "click" == this.type ? button == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[button]);
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0;
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if (be.preventDefault) {
    be.preventDefault();
  } else {
    if (be.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if (be.ctrlKey || 112 <= be.keyCode && 123 >= be.keyCode) {
          be.keyCode = -1;
        }
      } catch (ex) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_;
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
};
// INPUT (javascript/closure/events/listenable.js)
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0;
};
goog.events.Listenable.isImplementedBy = function(obj) {
  return!(!obj || !obj[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
};
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return++goog.events.ListenableKey.counter_;
};
// INPUT (javascript/closure/events/listener.js)
goog.events.Listener = function(listener, proxy, src, type, capture, opt_handler) {
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.key = goog.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = !1;
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = !0;
  this.handler = this.src = this.proxy = this.listener = null;
};
// INPUT (javascript/closure/events/listenermap.js)
goog.events.ListenerMap = function(src) {
  this.src = src;
  this.listeners = {};
  this.typeCount_ = 0;
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_;
};
goog.events.ListenerMap.prototype.add = function(type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString(), listenerArray = this.listeners[typeStr];
  listenerArray || (listenerArray = this.listeners[typeStr] = [], this.typeCount_++);
  var listenerObj, index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  -1 < index ? (listenerObj = listenerArray[index], callOnce || (listenerObj.callOnce = !1)) : (listenerObj = new goog.events.Listener(listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope), listenerObj.callOnce = callOnce, listenerArray.push(listenerObj));
  return listenerObj;
};
goog.events.ListenerMap.prototype.remove = function(type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  if (!(typeStr in this.listeners)) {
    return!1;
  }
  var listenerArray = this.listeners[typeStr], index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (-1 < index) {
    var listenerObj = listenerArray[index];
    listenerObj.markAsRemoved();
    goog.array.removeAt(listenerArray, index);
    0 == listenerArray.length && (delete this.listeners[typeStr], this.typeCount_--);
    return!0;
  }
  return!1;
};
goog.events.ListenerMap.prototype.removeByKey = function(listener) {
  var type = listener.type;
  if (!(type in this.listeners)) {
    return!1;
  }
  var removed = goog.array.remove(this.listeners[type], listener);
  removed && (listener.markAsRemoved(), 0 == this.listeners[type].length && (delete this.listeners[type], this.typeCount_--));
  return removed;
};
goog.events.ListenerMap.prototype.removeAll = function(opt_type) {
  var typeStr = opt_type && opt_type.toString(), count = 0, type;
  for (type in this.listeners) {
    if (!typeStr || type == typeStr) {
      for (var listenerArray = this.listeners[type], i = 0;i < listenerArray.length;i++) {
        ++count, listenerArray[i].markAsRemoved();
      }
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return count;
};
goog.events.ListenerMap.prototype.getListeners = function(type, capture) {
  var listenerArray = this.listeners[type.toString()], rv = [];
  if (listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      var listenerObj = listenerArray[i];
      listenerObj.capture == capture && rv.push(listenerObj);
    }
  }
  return rv;
};
goog.events.ListenerMap.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()], i = -1;
  listenerArray && (i = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, capture, opt_listenerScope));
  return-1 < i ? listenerArray[i] : null;
};
goog.events.ListenerMap.prototype.hasListener = function(opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type), typeStr = hasType ? opt_type.toString() : "", hasCapture = goog.isDef(opt_capture);
  return goog.object.some(this.listeners, function(listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      if (!(hasType && listenerArray[i].type != typeStr || hasCapture && listenerArray[i].capture != opt_capture)) {
        return!0;
      }
    }
    return!1;
  });
};
goog.events.ListenerMap.findListenerIndex_ = function(listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0;i < listenerArray.length;++i) {
    var listenerObj = listenerArray[i];
    if (!listenerObj.removed && listenerObj.listener == listener && listenerObj.capture == !!opt_useCapture && listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return-1;
};
// INPUT (javascript/closure/events/events.js)
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  return goog.events.Listenable.isImplementedBy(src) ? src.listen(type, listener, opt_capt, opt_handler) : goog.events.listen_(src, type, listener, !1, opt_capt, opt_handler);
};
goog.events.listen_ = function(src, type, listener, callOnce, opt_capt, opt_handler) {
  if (!type) {
    throw Error("Invalid event type");
  }
  var capture = !!opt_capt;
  if (capture && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      return goog.asserts.fail("Can not register capture listener in IE8-."), null;
    }
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
      return null;
    }
  }
  var listenerMap = goog.events.getListenerMap_(src);
  listenerMap || (src[goog.events.LISTENER_MAP_PROP_] = listenerMap = new goog.events.ListenerMap(src));
  var listenerObj = listenerMap.add(type, listener, callOnce, opt_capt, opt_handler);
  if (listenerObj.proxy) {
    return listenerObj;
  }
  var proxy = goog.events.getProxy();
  listenerObj.proxy = proxy;
  proxy.src = src;
  proxy.listener = listenerObj;
  src.addEventListener ? src.addEventListener(type.toString(), proxy, capture) : src.attachEvent(goog.events.getOnString_(type.toString()), proxy);
  goog.events.listenerCountEstimate_++;
  return listenerObj;
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_, f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.listener, eventObject);
  } : function(eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.listener, eventObject);
    if (!v) {
      return v;
    }
  };
  return f;
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  return goog.events.Listenable.isImplementedBy(src) ? src.listenOnce(type, listener, opt_capt, opt_handler) : goog.events.listen_(src, type, listener, !0, opt_capt, opt_handler);
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten(type, listener, opt_capt, opt_handler);
  }
  if (!src) {
    return!1;
  }
  var capture = !!opt_capt, listenerMap = goog.events.getListenerMap_(src);
  if (listenerMap) {
    var listenerObj = listenerMap.getListener(type, listener, capture, opt_handler);
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj);
    }
  }
  return!1;
};
goog.events.unlistenByKey = function(key) {
  if (goog.isNumber(key)) {
    return!1;
  }
  var listener = key;
  if (!listener || listener.removed) {
    return!1;
  }
  var src = listener.src;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener);
  }
  var type = listener.type, proxy = listener.proxy;
  src.removeEventListener ? src.removeEventListener(type, proxy, listener.capture) : src.detachEvent && src.detachEvent(goog.events.getOnString_(type), proxy);
  goog.events.listenerCountEstimate_--;
  var listenerMap = goog.events.getListenerMap_(src);
  listenerMap ? (listenerMap.removeByKey(listener), 0 == listenerMap.getTypeCount() && (listenerMap.src = null, src[goog.events.LISTENER_MAP_PROP_] = null)) : listener.markAsRemoved();
  return!0;
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
};
goog.events.removeAll = function(obj, opt_type) {
  if (!obj) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.removeAllListeners(opt_type);
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  if (!listenerMap) {
    return 0;
  }
  var count = 0, typeStr = opt_type && opt_type.toString(), type;
  for (type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      for (var listeners = listenerMap.listeners[type].concat(), i = 0;i < listeners.length;++i) {
        goog.events.unlistenByKey(listeners[i]) && ++count;
      }
    }
  }
  return count;
};
goog.events.removeAllNativeListeners = function() {
  return goog.events.listenerCountEstimate_ = 0;
};
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  }
  if (!obj) {
    return[];
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  return listenerMap ? listenerMap.getListeners(type, capture) : [];
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  listener = goog.events.wrapListener(listener);
  var capture = !!opt_capt;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }
  if (!src) {
    return null;
  }
  var listenerMap = goog.events.getListenerMap_(src);
  return listenerMap ? listenerMap.getListener(type, listener, capture, opt_handler) : null;
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  return!!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
};
goog.events.expose = function(e) {
  var str = [], key;
  for (key in e) {
    e[key] && e[key].id ? str.push(key + " = " + e[key] + " (" + e[key].id + ")") : str.push(key + " = " + e[key]);
  }
  return str.join("\n");
};
goog.events.getOnString_ = function(type) {
  return type in goog.events.onStringMap_ ? goog.events.onStringMap_[type] : goog.events.onStringMap_[type] = goog.events.onString_ + type;
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  return goog.events.Listenable.isImplementedBy(obj) ? obj.fireListeners(type, capture, eventObject) : goog.events.fireListeners_(obj, type, capture, eventObject);
};
goog.events.fireListeners_ = function(obj, type, capture, eventObject) {
  var retval = 1, listenerMap = goog.events.getListenerMap_(obj);
  if (listenerMap) {
    var listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      for (var listenerArray = listenerArray.concat(), i = 0;i < listenerArray.length;i++) {
        var listener = listenerArray[i];
        listener && listener.capture == capture && !listener.removed && (retval &= !1 !== goog.events.fireListener(listener, eventObject));
      }
    }
  }
  return Boolean(retval);
};
goog.events.fireListener = function(listener, eventObject) {
  var listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
  listener.callOnce && goog.events.unlistenByKey(listener);
  return listenerFn.call(listenerHandler, eventObject);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(src, e) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(src), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return src.dispatchEvent(e);
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_);
};
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  if (listener.removed) {
    return!0;
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || goog.getObjectByName("window.event"), evt = new goog.events.BrowserEvent(ieEvent, this), retval = !0;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(ieEvent)) {
        goog.events.markIeEvent_(ieEvent);
        for (var ancestors = [], parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent);
        }
        for (var type = listener.type, i = ancestors.length - 1;!evt.propagationStopped_ && 0 <= i;i--) {
          evt.currentTarget = ancestors[i], retval &= goog.events.fireListeners_(ancestors[i], type, !0, evt);
        }
        for (i = 0;!evt.propagationStopped_ && i < ancestors.length;i++) {
          evt.currentTarget = ancestors[i], retval &= goog.events.fireListeners_(ancestors[i], type, !1, evt);
        }
      }
    } else {
      retval = goog.events.fireListener(listener, evt);
    }
    return retval;
  }
  return goog.events.fireListener(listener, new goog.events.BrowserEvent(opt_evt, this));
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = !1;
  if (0 == e.keyCode) {
    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = !0;
    }
  }
  if (useReturnValue || void 0 == e.returnValue) {
    e.returnValue = !0;
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return 0 > e.keyCode || void 0 != e.returnValue;
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_];
  return listenerMap instanceof goog.events.ListenerMap ? listenerMap : null;
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
goog.events.wrapListener = function(listener) {
  goog.asserts.assert(listener, "Listener can not be null.");
  if (goog.isFunction(listener)) {
    return listener;
  }
  goog.asserts.assert(listener.handleEvent, "An object listener must have handleEvent method.");
  listener[goog.events.LISTENER_WRAPPER_PROP_] || (listener[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
    return listener.handleEvent(e);
  });
  return listener[goog.events.LISTENER_WRAPPER_PROP_];
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_);
});
// INPUT (javascript/closure/events/eventtarget.js)
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
};
goog.events.EventTarget.prototype.setParentEventTarget = function(parent) {
  this.parentEventTarget_ = parent;
};
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  this.assertInitialized_();
  var ancestorsTree, ancestor = this.getParentEventTarget();
  if (ancestor) {
    ancestorsTree = [];
    for (var ancestorCount = 1;ancestor;ancestor = ancestor.getParentEventTarget()) {
      ancestorsTree.push(ancestor), goog.asserts.assert(++ancestorCount < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, e, ancestorsTree);
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
goog.events.EventTarget.prototype.listen = function(type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(type), listener, !1, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.listenOnce = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(String(type), listener, !0, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlisten = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(String(type), listener, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlistenByKey = function(key) {
  return this.eventTargetListeners_.removeByKey(key);
};
goog.events.EventTarget.prototype.removeAllListeners = function(opt_type) {
  return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(opt_type) : 0;
};
goog.events.EventTarget.prototype.fireListeners = function(type, capture, eventObject) {
  var listenerArray = this.eventTargetListeners_.listeners[String(type)];
  if (!listenerArray) {
    return!0;
  }
  for (var listenerArray = listenerArray.concat(), rv = !0, i = 0;i < listenerArray.length;++i) {
    var listener = listenerArray[i];
    if (listener && !listener.removed && listener.capture == capture) {
      var listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
      listener.callOnce && this.unlistenByKey(listener);
      rv = !1 !== listenerFn.call(listenerHandler, eventObject) && rv;
    }
  }
  return rv && 0 != eventObject.returnValue_;
};
goog.events.EventTarget.prototype.getListeners = function(type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture);
};
goog.events.EventTarget.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(String(type), listener, capture, opt_listenerScope);
};
goog.events.EventTarget.prototype.hasListener = function(opt_type, opt_capture) {
  var id = goog.isDef(opt_type) ? String(opt_type) : void 0;
  return this.eventTargetListeners_.hasListener(id, opt_capture);
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
};
goog.events.EventTarget.dispatchEventInternal_ = function(target, e, opt_ancestorsTree) {
  var type = e.type || e;
  if (goog.isString(e)) {
    e = new goog.events.Event(e, target);
  } else {
    if (e instanceof goog.events.Event) {
      e.target = e.target || target;
    } else {
      var oldEvent = e;
      e = new goog.events.Event(type, target);
      goog.object.extend(e, oldEvent);
    }
  }
  var rv = !0, currentTarget;
  if (opt_ancestorsTree) {
    for (var i = opt_ancestorsTree.length - 1;!e.propagationStopped_ && 0 <= i;i--) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i], rv = currentTarget.fireListeners(type, !0, e) && rv;
    }
  }
  e.propagationStopped_ || (currentTarget = e.currentTarget = target, rv = currentTarget.fireListeners(type, !0, e) && rv, e.propagationStopped_ || (rv = currentTarget.fireListeners(type, !1, e) && rv));
  if (opt_ancestorsTree) {
    for (i = 0;!e.propagationStopped_ && i < opt_ancestorsTree.length;i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i], rv = currentTarget.fireListeners(type, !1, e) && rv;
    }
  }
  return rv;
};
// INPUT (javascript/closure/async/nexttick.js)
goog.async = {};
goog.async.throwException = function(exception) {
  goog.global.setTimeout(function() {
    throw exception;
  }, 0);
};
goog.async.nextTick = function(callback, opt_context) {
  var cb = callback;
  opt_context && (cb = goog.bind(callback, opt_context));
  cb = goog.async.nextTick.wrapCallback_(cb);
  !goog.isFunction(goog.global.setImmediate) || goog.global.Window && goog.global.Window.prototype.setImmediate == goog.global.setImmediate ? (goog.async.nextTick.setImmediate_ || (goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_()), goog.async.nextTick.setImmediate_(cb)) : goog.global.setImmediate(cb);
};
goog.async.nextTick.getSetImmediateEmulator_ = function() {
  var Channel = goog.global.MessageChannel;
  "undefined" === typeof Channel && "undefined" !== typeof window && window.postMessage && window.addEventListener && (Channel = function() {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "";
    document.documentElement.appendChild(iframe);
    var win = iframe.contentWindow, doc = win.document;
    doc.open();
    doc.write("");
    doc.close();
    var message = "callImmediate" + Math.random(), origin = "file:" == win.location.protocol ? "*" : win.location.protocol + "//" + win.location.host, onmessage = goog.bind(function(e) {
      if (e.origin == origin || e.data == message) {
        this.port1.onmessage();
      }
    }, this);
    win.addEventListener("message", onmessage, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      win.postMessage(message, origin);
    }};
  });
  if ("undefined" !== typeof Channel && !goog.labs.userAgent.browser.isIE()) {
    var channel = new Channel, head = {}, tail = head;
    channel.port1.onmessage = function() {
      head = head.next;
      var cb = head.cb;
      head.cb = null;
      cb();
    };
    return function(cb) {
      tail.next = {cb:cb};
      tail = tail.next;
      channel.port2.postMessage(0);
    };
  }
  return "undefined" !== typeof document && "onreadystatechange" in document.createElement("script") ? function(cb) {
    var script = document.createElement("script");
    script.onreadystatechange = function() {
      script.onreadystatechange = null;
      script.parentNode.removeChild(script);
      script = null;
      cb();
      cb = null;
    };
    document.documentElement.appendChild(script);
  } : function(cb) {
    goog.global.setTimeout(cb, 0);
  };
};
goog.async.nextTick.wrapCallback_ = goog.functions.identity;
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.async.nextTick.wrapCallback_ = transformer;
});
// INPUT (javascript/closure/testing/watchers.js)
goog.testing = {};
goog.testing.watchers = {};
goog.testing.watchers.resetWatchers_ = [];
goog.testing.watchers.signalClockReset = function() {
  for (var watchers = goog.testing.watchers.resetWatchers_, i = 0;i < watchers.length;i++) {
    goog.testing.watchers.resetWatchers_[i]();
  }
};
goog.testing.watchers.watchClockReset = function(fn) {
  goog.testing.watchers.resetWatchers_.push(fn);
};
// INPUT (javascript/closure/async/run.js)
goog.async.run = function(callback, opt_context) {
  goog.async.run.schedule_ || goog.async.run.initializeRunner_();
  goog.async.run.workQueueScheduled_ || (goog.async.run.schedule_(), goog.async.run.workQueueScheduled_ = !0);
  goog.async.run.workQueue_.push(new goog.async.run.WorkItem_(callback, opt_context));
};
goog.async.run.initializeRunner_ = function() {
  if (goog.global.Promise && goog.global.Promise.resolve) {
    var promise = goog.global.Promise.resolve();
    goog.async.run.schedule_ = function() {
      promise.then(goog.async.run.processWorkQueue);
    };
  } else {
    goog.async.run.schedule_ = function() {
      goog.async.nextTick(goog.async.run.processWorkQueue);
    };
  }
};
goog.async.run.forceNextTick = function() {
  goog.async.run.schedule_ = function() {
    goog.async.nextTick(goog.async.run.processWorkQueue);
  };
};
goog.async.run.workQueueScheduled_ = !1;
goog.async.run.workQueue_ = [];
goog.DEBUG && (goog.async.run.resetQueue_ = function() {
  goog.async.run.workQueueScheduled_ = !1;
  goog.async.run.workQueue_ = [];
}, goog.testing.watchers.watchClockReset(goog.async.run.resetQueue_));
goog.async.run.processWorkQueue = function() {
  for (;goog.async.run.workQueue_.length;) {
    var workItems = goog.async.run.workQueue_;
    goog.async.run.workQueue_ = [];
    for (var i = 0;i < workItems.length;i++) {
      var workItem = workItems[i];
      try {
        workItem.fn.call(workItem.scope);
      } catch (e) {
        goog.async.throwException(e);
      }
    }
  }
  goog.async.run.workQueueScheduled_ = !1;
};
goog.async.run.WorkItem_ = function(fn, scope) {
  this.fn = fn;
  this.scope = scope;
};
// INPUT (javascript/closure/promise/resolver.js)
goog.promise = {};
goog.promise.Resolver = function() {
};
// INPUT (javascript/closure/promise/thenable.js)
goog.Thenable = function() {
};
goog.Thenable.prototype.then = function() {
};
goog.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
goog.Thenable.addImplementation = function(ctor) {
  goog.exportProperty(ctor.prototype, "then", ctor.prototype.then);
  ctor.prototype[goog.Thenable.IMPLEMENTED_BY_PROP] = !0;
};
goog.Thenable.isImplementedBy = function(object) {
  if (!object) {
    return!1;
  }
  try {
    return!!object[goog.Thenable.IMPLEMENTED_BY_PROP];
  } catch (e) {
    return!1;
  }
};
// INPUT (javascript/closure/promise/promise.js)
goog.Promise = function(resolver, opt_context) {
  this.state_ = goog.Promise.State_.PENDING;
  this.result_ = void 0;
  this.callbackEntries_ = this.parent_ = null;
  this.executing_ = !1;
  0 < goog.Promise.UNHANDLED_REJECTION_DELAY ? this.unhandledRejectionId_ = 0 : 0 == goog.Promise.UNHANDLED_REJECTION_DELAY && (this.hadUnhandledRejection_ = !1);
  goog.Promise.LONG_STACK_TRACES && (this.stack_ = [], this.addStackTrace_(Error("created")), this.currentStep_ = 0);
  try {
    var self = this;
    resolver.call(opt_context, function(value) {
      self.resolve_(goog.Promise.State_.FULFILLED, value);
    }, function(reason) {
      if (goog.DEBUG && !(reason instanceof goog.Promise.CancellationError)) {
        try {
          if (reason instanceof Error) {
            throw reason;
          }
          throw Error("Promise rejected.");
        } catch (e) {
        }
      }
      self.resolve_(goog.Promise.State_.REJECTED, reason);
    });
  } catch (e$$0) {
    this.resolve_(goog.Promise.State_.REJECTED, e$$0);
  }
};
goog.Promise.LONG_STACK_TRACES = !1;
goog.Promise.UNHANDLED_REJECTION_DELAY = 0;
goog.Promise.State_ = {PENDING:0, BLOCKED:1, FULFILLED:2, REJECTED:3};
goog.Promise.resolve = function(opt_value) {
  return new goog.Promise(function(resolve) {
    resolve(opt_value);
  });
};
goog.Promise.reject = function(opt_reason) {
  return new goog.Promise(function(resolve, reject) {
    reject(opt_reason);
  });
};
goog.Promise.race = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    promises.length || resolve(void 0);
    for (var i = 0, promise;promise = promises[i];i++) {
      promise.then(resolve, reject);
    }
  });
};
goog.Promise.all = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toFulfill = promises.length, values = [];
    if (toFulfill) {
      for (var onFulfill = function(index, value) {
        toFulfill--;
        values[index] = value;
        0 == toFulfill && resolve(values);
      }, onReject = function(reason) {
        reject(reason);
      }, i = 0, promise;promise = promises[i];i++) {
        promise.then(goog.partial(onFulfill, i), onReject);
      }
    } else {
      resolve(values);
    }
  });
};
goog.Promise.firstFulfilled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toReject = promises.length, reasons = [];
    if (toReject) {
      for (var onFulfill = function(value) {
        resolve(value);
      }, onReject = function(index, reason) {
        toReject--;
        reasons[index] = reason;
        0 == toReject && reject(reasons);
      }, i = 0, promise;promise = promises[i];i++) {
        promise.then(onFulfill, goog.partial(onReject, i));
      }
    } else {
      resolve(void 0);
    }
  });
};
goog.Promise.withResolver = function() {
  var resolve, reject, promise = new goog.Promise(function(rs, rj) {
    resolve = rs;
    reject = rj;
  });
  return new goog.Promise.Resolver_(promise, resolve, reject);
};
goog.Promise.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
  null != opt_onFulfilled && goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  null != opt_onRejected && goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
  return this.addChildPromise_(goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null, goog.isFunction(opt_onRejected) ? opt_onRejected : null, opt_context);
};
goog.Thenable.addImplementation(goog.Promise);
goog.Promise.prototype.thenCatch = function(onRejected, opt_context) {
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("thenCatch"));
  return this.addChildPromise_(null, onRejected, opt_context);
};
goog.Promise.prototype.cancel = function(opt_message) {
  this.state_ == goog.Promise.State_.PENDING && goog.async.run(function() {
    var err = new goog.Promise.CancellationError(opt_message);
    this.cancelInternal_(err);
  }, this);
};
goog.Promise.prototype.cancelInternal_ = function(err) {
  this.state_ == goog.Promise.State_.PENDING && (this.parent_ ? this.parent_.cancelChild_(this, err) : this.resolve_(goog.Promise.State_.REJECTED, err));
};
goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
  if (this.callbackEntries_) {
    for (var childCount = 0, childIndex = -1, i = 0, entry;entry = this.callbackEntries_[i];i++) {
      var child = entry.child;
      if (child && (childCount++, child == childPromise && (childIndex = i), 0 <= childIndex && 1 < childCount)) {
        break;
      }
    }
    if (0 <= childIndex) {
      if (this.state_ == goog.Promise.State_.PENDING && 1 == childCount) {
        this.cancelInternal_(err);
      } else {
        var callbackEntry = this.callbackEntries_.splice(childIndex, 1)[0];
        this.executeCallback_(callbackEntry, goog.Promise.State_.REJECTED, err);
      }
    }
  }
};
goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
  this.callbackEntries_ && this.callbackEntries_.length || this.state_ != goog.Promise.State_.FULFILLED && this.state_ != goog.Promise.State_.REJECTED || this.scheduleCallbacks_();
  this.callbackEntries_ || (this.callbackEntries_ = []);
  this.callbackEntries_.push(callbackEntry);
};
goog.Promise.prototype.addChildPromise_ = function(onFulfilled, onRejected, opt_context) {
  var callbackEntry = {child:null, onFulfilled:null, onRejected:null};
  callbackEntry.child = new goog.Promise(function(resolve, reject) {
    callbackEntry.onFulfilled = onFulfilled ? function(value) {
      try {
        var result = onFulfilled.call(opt_context, value);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    } : resolve;
    callbackEntry.onRejected = onRejected ? function(reason) {
      try {
        var result = onRejected.call(opt_context, reason);
        !goog.isDef(result) && reason instanceof goog.Promise.CancellationError ? reject(reason) : resolve(result);
      } catch (err) {
        reject(err);
      }
    } : reject;
  });
  callbackEntry.child.parent_ = this;
  this.addCallbackEntry_(callbackEntry);
  return callbackEntry.child;
};
goog.Promise.prototype.unblockAndFulfill_ = function(value) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.FULFILLED, value);
};
goog.Promise.prototype.unblockAndReject_ = function(reason) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.REJECTED, reason);
};
goog.Promise.prototype.resolve_ = function(state, x) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    if (this == x) {
      state = goog.Promise.State_.REJECTED, x = new TypeError("Promise cannot resolve to itself");
    } else {
      if (goog.Thenable.isImplementedBy(x)) {
        this.state_ = goog.Promise.State_.BLOCKED;
        x.then(this.unblockAndFulfill_, this.unblockAndReject_, this);
        return;
      }
      if (goog.isObject(x)) {
        try {
          var then = x.then;
          if (goog.isFunction(then)) {
            this.tryThen_(x, then);
            return;
          }
        } catch (e) {
          state = goog.Promise.State_.REJECTED, x = e;
        }
      }
    }
    this.result_ = x;
    this.state_ = state;
    this.scheduleCallbacks_();
    state != goog.Promise.State_.REJECTED || x instanceof goog.Promise.CancellationError || goog.Promise.addUnhandledRejection_(this, x);
  }
};
goog.Promise.prototype.tryThen_ = function(thenable, then) {
  this.state_ = goog.Promise.State_.BLOCKED;
  var promise = this, called = !1, resolve = function(value) {
    called || (called = !0, promise.unblockAndFulfill_(value));
  }, reject = function(reason) {
    called || (called = !0, promise.unblockAndReject_(reason));
  };
  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
};
goog.Promise.prototype.scheduleCallbacks_ = function() {
  this.executing_ || (this.executing_ = !0, goog.async.run(this.executeCallbacks_, this));
};
goog.Promise.prototype.executeCallbacks_ = function() {
  for (;this.callbackEntries_ && this.callbackEntries_.length;) {
    var entries = this.callbackEntries_;
    this.callbackEntries_ = [];
    for (var i = 0;i < entries.length;i++) {
      goog.Promise.LONG_STACK_TRACES && this.currentStep_++, this.executeCallback_(entries[i], this.state_, this.result_);
    }
  }
  this.executing_ = !1;
};
goog.Promise.prototype.executeCallback_ = function(callbackEntry, state, result) {
  if (state == goog.Promise.State_.FULFILLED) {
    callbackEntry.onFulfilled(result);
  } else {
    this.removeUnhandledRejection_(), callbackEntry.onRejected(result);
  }
};
goog.Promise.prototype.addStackTrace_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && goog.isString(err.stack)) {
    var trace = err.stack.split("\n", 4)[3], message = err.message, message = message + Array(11 - message.length).join(" ");
    this.stack_.push(message + trace);
  }
};
goog.Promise.prototype.appendLongStack_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && err && goog.isString(err.stack) && this.stack_.length) {
    for (var longTrace = ["Promise trace:"], promise = this;promise;promise = promise.parent_) {
      for (var i = this.currentStep_;0 <= i;i--) {
        longTrace.push(promise.stack_[i]);
      }
      longTrace.push("Value: [" + (promise.state_ == goog.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] <" + String(promise.result_) + ">");
    }
    err.stack += "\n\n" + longTrace.join("\n");
  }
};
goog.Promise.prototype.removeUnhandledRejection_ = function() {
  if (0 < goog.Promise.UNHANDLED_REJECTION_DELAY) {
    for (var p = this;p && p.unhandledRejectionId_;p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_), p.unhandledRejectionId_ = 0;
    }
  } else {
    if (0 == goog.Promise.UNHANDLED_REJECTION_DELAY) {
      for (p = this;p && p.hadUnhandledRejection_;p = p.parent_) {
        p.hadUnhandledRejection_ = !1;
      }
    }
  }
};
goog.Promise.addUnhandledRejection_ = function(promise, reason) {
  0 < goog.Promise.UNHANDLED_REJECTION_DELAY ? promise.unhandledRejectionId_ = goog.global.setTimeout(function() {
    promise.appendLongStack_(reason);
    goog.Promise.handleRejection_.call(null, reason);
  }, goog.Promise.UNHANDLED_REJECTION_DELAY) : 0 == goog.Promise.UNHANDLED_REJECTION_DELAY && (promise.hadUnhandledRejection_ = !0, goog.async.run(function() {
    promise.hadUnhandledRejection_ && (promise.appendLongStack_(reason), goog.Promise.handleRejection_.call(null, reason));
  }));
};
goog.Promise.handleRejection_ = goog.async.throwException;
goog.Promise.setUnhandledRejectionHandler = function(handler) {
  goog.Promise.handleRejection_ = handler;
};
goog.Promise.CancellationError = function(opt_message) {
  goog.debug.Error.call(this, opt_message);
};
goog.inherits(goog.Promise.CancellationError, goog.debug.Error);
goog.Promise.CancellationError.prototype.name = "cancel";
goog.Promise.Resolver_ = function(promise, resolve, reject) {
  this.promise = promise;
  this.resolve = resolve;
  this.reject = reject;
};
// INPUT (javascript/closure/timer/timer.js)
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now();
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.INVALID_TIMEOUT_ID_ = -1;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = .8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop();
};
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    var elapsed = goog.now() - this.last_;
    0 < elapsed && elapsed < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()));
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK);
};
goog.Timer.prototype.start = function() {
  this.enabled = !0;
  this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now());
};
goog.Timer.prototype.stop = function() {
  this.enabled = !1;
  this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null);
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if (goog.isFunction(listener)) {
    opt_handler && (listener = goog.bind(listener, opt_handler));
  } else {
    if (listener && "function" == typeof listener.handleEvent) {
      listener = goog.bind(listener.handleEvent, listener);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  return opt_delay > goog.Timer.MAX_TIMEOUT_ ? goog.Timer.INVALID_TIMEOUT_ID_ : goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0);
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId);
};
goog.Timer.promise = function(delay, opt_result) {
  var timerKey = null;
  return(new goog.Promise(function(resolve, reject) {
    timerKey = goog.Timer.callOnce(function() {
      resolve(opt_result);
    }, delay);
    timerKey == goog.Timer.INVALID_TIMEOUT_ID_ && reject(Error("Failed to schedule timer."));
  })).thenCatch(function(error) {
    goog.Timer.clear(timerKey);
    throw error;
  });
};
// INPUT (javascript/closure/net/errorcode.js)
goog.net = {};
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(errorCode) {
  switch(errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return "No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return "Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return "File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return "Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return "Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return "An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return "Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return "Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return "Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
};
// INPUT (javascript/closure/net/eventtype.js)
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress"};
// INPUT (javascript/closure/net/httpstatus.js)
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, PRECONDITION_REQUIRED:428, TOO_MANY_REQUESTS:429, REQUEST_HEADER_FIELDS_TOO_LARGE:431, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, NETWORK_AUTHENTICATION_REQUIRED:511, QUIRK_IE_NO_CONTENT:1223};
goog.net.HttpStatus.isSuccess = function(status) {
  switch(status) {
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.CREATED:
    ;
    case goog.net.HttpStatus.ACCEPTED:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.PARTIAL_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
    ;
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return!0;
    default:
      return!1;
  }
};
// INPUT (javascript/closure/net/xhrlike.js)
goog.net.XhrLike = function() {
};
goog.net.XhrLike.prototype.open = function() {
};
goog.net.XhrLike.prototype.send = function() {
};
goog.net.XhrLike.prototype.abort = function() {
};
goog.net.XhrLike.prototype.setRequestHeader = function() {
};
goog.net.XhrLike.prototype.getResponseHeader = function() {
};
goog.net.XhrLike.prototype.getAllResponseHeaders = function() {
};
// INPUT (javascript/closure/net/xmlhttpfactory.js)
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions());
};
// INPUT (javascript/closure/net/wrapperxmlhttpfactory.js)
goog.net.WrapperXmlHttpFactory = function(xhrFactory, optionsFactory) {
  this.xhrFactory_ = xhrFactory;
  this.optionsFactory_ = optionsFactory;
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_();
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_();
};
// INPUT (javascript/closure/net/xmlhttp.js)
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance();
};
goog.net.XmlHttp.ASSUME_NATIVE_XHR = !1;
goog.net.XmlHttpDefines = {};
goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR = !1;
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions();
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.setFactory = function(factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(goog.asserts.assert(factory), goog.asserts.assert(optionsFactory)));
};
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory;
};
goog.net.DefaultXmlHttpFactory = function() {
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var progId = this.getProgId_();
  return progId ? new ActiveXObject(progId) : new XMLHttpRequest;
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var progId = this.getProgId_(), options = {};
  progId && (options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = !0, options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = !0);
  return options;
};
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if (goog.net.XmlHttp.ASSUME_NATIVE_XHR || goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR) {
    return "";
  }
  if (!this.ieProgId_ && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for (var ACTIVE_X_IDENTS = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], i = 0;i < ACTIVE_X_IDENTS.length;i++) {
      var candidate = ACTIVE_X_IDENTS[i];
      try {
        return new ActiveXObject(candidate), this.ieProgId_ = candidate;
      } catch (e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.ieProgId_;
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
// INPUT (javascript/closure/net/xhrio.js)
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.events.EventTarget.call(this);
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
  this.active_ = !1;
  this.xhrOptions_ = this.xhr_ = null;
  this.lastError_ = this.lastMethod_ = this.lastUri_ = "";
  this.inAbort_ = this.inOpen_ = this.inSend_ = this.errorDispatched_ = !1;
  this.timeoutInterval_ = 0;
  this.timeoutId_ = null;
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
  this.useXhr2Timeout_ = this.withCredentials_ = !1;
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.log.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.XHR2_TIMEOUT_ = "timeout";
goog.net.XhrIo.XHR2_ON_TIMEOUT_ = "ontimeout";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval, opt_withCredentials) {
  var x = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(x);
  opt_callback && x.listen(goog.net.EventType.COMPLETE, opt_callback);
  x.listenOnce(goog.net.EventType.READY, x.cleanupSend_);
  opt_timeoutInterval && x.setTimeoutInterval(opt_timeoutInterval);
  opt_withCredentials && x.setWithCredentials(opt_withCredentials);
  x.send(url, opt_method, opt_content, opt_headers);
  return x;
};
goog.net.XhrIo.cleanup = function() {
  for (var instances = goog.net.XhrIo.sendInstances_;instances.length;) {
    instances.pop().dispose();
  }
};
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
};
goog.net.XhrIo.prototype.cleanupSend_ = function() {
  this.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, this);
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
};
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials;
};
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  if (this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.lastUri_ + "; newUri=" + url);
  }
  var method = opt_method ? opt_method.toUpperCase() : "GET";
  this.lastUri_ = url;
  this.lastError_ = "";
  this.lastMethod_ = method;
  this.errorDispatched_ = !1;
  this.active_ = !0;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  try {
    goog.log.fine(this.logger_, this.formatMsg_("Opening Xhr")), this.inOpen_ = !0, this.xhr_.open(method, String(url), !0), this.inOpen_ = !1;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Error opening Xhr: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return;
  }
  var content = opt_content || "", headers = this.headers.clone();
  opt_headers && goog.structs.forEach(opt_headers, function(value, key) {
    headers.set(key, value);
  });
  var contentTypeKey = goog.array.find(headers.getKeys(), goog.net.XhrIo.isContentTypeHeader_), contentIsFormData = goog.global.FormData && content instanceof goog.global.FormData;
  !goog.array.contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, method) || contentTypeKey || contentIsFormData || headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE);
  headers.forEach(function(value, key) {
    this.xhr_.setRequestHeader(key, value);
  }, this);
  this.responseType_ && (this.xhr_.responseType = this.responseType_);
  goog.object.containsKey(this.xhr_, "withCredentials") && (this.xhr_.withCredentials = this.withCredentials_);
  try {
    this.cleanUpTimeoutTimer_(), 0 < this.timeoutInterval_ && (this.useXhr2Timeout_ = goog.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_), goog.log.fine(this.logger_, this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete, xhr2 " + this.useXhr2Timeout_)), this.useXhr2Timeout_ ? (this.xhr_[goog.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_, this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = goog.bind(this.timeout_, this)) : this.timeoutId_ = goog.Timer.callOnce(this.timeout_, this.timeoutInterval_, 
    this)), goog.log.fine(this.logger_, this.formatMsg_("Sending request")), this.inSend_ = !0, this.xhr_.send(content), this.inSend_ = !1;
  } catch (err$$0) {
    goog.log.fine(this.logger_, this.formatMsg_("Send error: " + err$$0.message)), this.error_(goog.net.ErrorCode.EXCEPTION, err$$0);
  }
};
goog.net.XhrIo.shouldUseXhr2Timeout_ = function(xhr) {
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher(9) && goog.isNumber(xhr[goog.net.XhrIo.XHR2_TIMEOUT_]) && goog.isDef(xhr[goog.net.XhrIo.XHR2_ON_TIMEOUT_]);
};
goog.net.XhrIo.isContentTypeHeader_ = function(header) {
  return goog.string.caseInsensitiveEquals(goog.net.XhrIo.CONTENT_TYPE_HEADER, header);
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
};
goog.net.XhrIo.prototype.timeout_ = function() {
  "undefined" != typeof goog && this.xhr_ && (this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting", goog.log.fine(this.logger_, this.formatMsg_(this.lastError_)), this.dispatchEvent(goog.net.EventType.TIMEOUT), this.abort(goog.net.ErrorCode.TIMEOUT));
};
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = !1;
  this.xhr_ && (this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1);
  this.lastError_ = err;
  this.dispatchErrors_();
  this.cleanUpXhr_();
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  this.errorDispatched_ || (this.errorDispatched_ = !0, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ERROR));
};
goog.net.XhrIo.prototype.abort = function() {
  this.xhr_ && this.active_ && (goog.log.fine(this.logger_, this.formatMsg_("Aborting")), this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ABORT), this.cleanUpXhr_());
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  this.xhr_ && (this.active_ && (this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1), this.cleanUpXhr_(!0));
  goog.net.XhrIo.superClass_.disposeInternal.call(this);
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (!this.isDisposed()) {
    if (this.inOpen_ || this.inSend_ || this.inAbort_) {
      this.onReadyStateChangeHelper_();
    } else {
      this.onReadyStateChangeEntryPoint_();
    }
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if (this.active_ && "undefined" != typeof goog) {
    if (this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && 2 == this.getStatus()) {
      goog.log.fine(this.logger_, this.formatMsg_("Local request error detected and ignored"));
    } else {
      if (this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.callOnce(this.onReadyStateChange_, 0, this);
      } else {
        if (this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE), this.isComplete()) {
          goog.log.fine(this.logger_, this.formatMsg_("Request complete"));
          this.active_ = !1;
          try {
            this.isSuccess() ? (this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.SUCCESS)) : (this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]", this.dispatchErrors_());
          } finally {
            this.cleanUpXhr_();
          }
        }
      }
    }
  }
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if (this.xhr_) {
    this.cleanUpTimeoutTimer_();
    var xhr = this.xhr_, clearedOnReadyStateChange = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhrOptions_ = this.xhr_ = null;
    opt_fromDispose || this.dispatchEvent(goog.net.EventType.READY);
    try {
      xhr.onreadystatechange = clearedOnReadyStateChange;
    } catch (e) {
      goog.log.error(this.logger_, "Problem encountered resetting onreadystatechange: " + e.message);
    }
  }
};
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function() {
  this.xhr_ && this.useXhr2Timeout_ && (this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = null);
  goog.isNumber(this.timeoutId_) && (goog.Timer.clear(this.timeoutId_), this.timeoutId_ = null);
};
goog.net.XhrIo.prototype.isActive = function() {
  return!!this.xhr_;
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};
goog.net.XhrIo.prototype.isSuccess = function() {
  var status = this.getStatus();
  return goog.net.HttpStatus.isSuccess(status) || 0 === status && !this.isLastUriEffectiveSchemeHttp_();
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var scheme = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(scheme);
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1;
  } catch (e) {
    return-1;
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : "";
  } catch (e) {
    return goog.log.fine(this.logger_, "Can not get status: " + e.message), "";
  }
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : "";
  } catch (e) {
    return goog.log.fine(this.logger_, "Can not get responseText: " + e.message), "";
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(key) : void 0;
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : "";
};
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_);
};
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]";
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
});
// INPUT (javascript/closure/uri/uri.js)
goog.Uri = function(opt_uri, opt_ignoreCase) {
  var m;
  opt_uri instanceof goog.Uri ? (this.ignoreCase_ = goog.isDef(opt_ignoreCase) ? opt_ignoreCase : opt_uri.getIgnoreCase(), this.setScheme(opt_uri.getScheme()), this.setUserInfo(opt_uri.getUserInfo()), this.setDomain(opt_uri.getDomain()), this.setPort(opt_uri.getPort()), this.setPath(opt_uri.getPath()), this.setQueryData(opt_uri.getQueryData().clone()), this.setFragment(opt_uri.getFragment())) : opt_uri && (m = goog.uri.utils.split(String(opt_uri))) ? (this.ignoreCase_ = !!opt_ignoreCase, this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || 
  "", !0), this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", !0), this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(m[goog.uri.utils.ComponentIndex.PORT]), this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(m[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!opt_ignoreCase, this.queryData_ = new goog.Uri.QueryData(null, null, 
  this.ignoreCase_));
};
goog.Uri.preserveParameterTypesCompatibilityFlag = !1;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = !1;
goog.Uri.prototype.ignoreCase_ = !1;
goog.Uri.prototype.toString = function() {
  var out = [], scheme = this.getScheme();
  scheme && out.push(goog.Uri.encodeSpecialChars_(scheme, goog.Uri.reDisallowedInSchemeOrUserInfo_, !0), ":");
  var domain = this.getDomain();
  if (domain) {
    out.push("//");
    var userInfo = this.getUserInfo();
    userInfo && out.push(goog.Uri.encodeSpecialChars_(userInfo, goog.Uri.reDisallowedInSchemeOrUserInfo_, !0), "@");
    out.push(goog.Uri.removeDoubleEncoding_(goog.string.urlEncode(domain)));
    var port = this.getPort();
    null != port && out.push(":", String(port));
  }
  var path = this.getPath();
  path && (this.hasDomain() && "/" != path.charAt(0) && out.push("/"), out.push(goog.Uri.encodeSpecialChars_(path, "/" == path.charAt(0) ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_, !0)));
  var query = this.getEncodedQuery();
  query && out.push("?", query);
  var fragment = this.getFragment();
  fragment && out.push("#", goog.Uri.encodeSpecialChars_(fragment, goog.Uri.reDisallowedInFragment_));
  return out.join("");
};
goog.Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone(), overridden = relativeUri.hasScheme();
  overridden ? absoluteUri.setScheme(relativeUri.getScheme()) : overridden = relativeUri.hasUserInfo();
  overridden ? absoluteUri.setUserInfo(relativeUri.getUserInfo()) : overridden = relativeUri.hasDomain();
  overridden ? absoluteUri.setDomain(relativeUri.getDomain()) : overridden = relativeUri.hasPort();
  var path = relativeUri.getPath();
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
  } else {
    if (overridden = relativeUri.hasPath()) {
      if ("/" != path.charAt(0)) {
        if (this.hasDomain() && !this.hasPath()) {
          path = "/" + path;
        } else {
          var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          -1 != lastSlashIndex && (path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path);
        }
      }
      path = goog.Uri.removeDotSegments(path);
    }
  }
  overridden ? absoluteUri.setPath(path) : overridden = relativeUri.hasQuery();
  overridden ? absoluteUri.setQueryData(relativeUri.getDecodedQuery()) : overridden = relativeUri.hasFragment();
  overridden && absoluteUri.setFragment(relativeUri.getFragment());
  return absoluteUri;
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this);
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_;
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  if (this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme, !0) : newScheme) {
    this.scheme_ = this.scheme_.replace(/:$/, "");
  }
  return this;
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_;
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this;
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_;
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_;
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain, !0) : newDomain;
  return this;
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_;
};
goog.Uri.prototype.getPort = function() {
  return this.port_;
};
goog.Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  if (newPort) {
    newPort = Number(newPort);
    if (isNaN(newPort) || 0 > newPort) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort;
  } else {
    this.port_ = null;
  }
  return this;
};
goog.Uri.prototype.hasPort = function() {
  return null != this.port_;
};
goog.Uri.prototype.getPath = function() {
  return this.path_;
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath, !0) : newPath;
  return this;
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_;
};
goog.Uri.prototype.hasQuery = function() {
  return "" !== this.queryData_.toString();
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  queryData instanceof goog.Uri.QueryData ? (this.queryData_ = queryData, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (opt_decode || (queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(queryData, null, this.ignoreCase_));
  return this;
};
goog.Uri.prototype.setQuery = function(newQuery, opt_decode) {
  return this.setQueryData(newQuery, opt_decode);
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString();
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString();
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_;
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery();
};
goog.Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  this.queryData_.set(key, value);
  return this;
};
goog.Uri.prototype.setParameterValues = function(key, values) {
  this.enforceReadOnly();
  goog.isArray(values) || (values = [String(values)]);
  this.queryData_.setValues(key, values);
  return this;
};
goog.Uri.prototype.getParameterValue = function(paramName) {
  return this.queryData_.get(paramName);
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_;
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this;
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_;
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this;
};
goog.Uri.prototype.removeParameter = function(key) {
  this.enforceReadOnly();
  this.queryData_.remove(key);
  return this;
};
goog.Uri.prototype.enforceReadOnly = function() {
  if (this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  this.queryData_ && this.queryData_.setIgnoreCase(ignoreCase);
  return this;
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_;
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase);
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new goog.Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri;
};
goog.Uri.resolve = function(base, rel) {
  base instanceof goog.Uri || (base = goog.Uri.parse(base));
  rel instanceof goog.Uri || (rel = goog.Uri.parse(rel));
  return base.resolve(rel);
};
goog.Uri.removeDotSegments = function(path) {
  if (".." == path || "." == path) {
    return "";
  }
  if (goog.string.contains(path, "./") || goog.string.contains(path, "/.")) {
    for (var leadingSlash = goog.string.startsWith(path, "/"), segments = path.split("/"), out = [], pos = 0;pos < segments.length;) {
      var segment = segments[pos++];
      "." == segment ? leadingSlash && pos == segments.length && out.push("") : ".." == segment ? ((1 < out.length || 1 == out.length && "" != out[0]) && out.pop(), leadingSlash && pos == segments.length && out.push("")) : (out.push(segment), leadingSlash = !0);
    }
    return out.join("/");
  }
  return path;
};
goog.Uri.decodeOrEmpty_ = function(val, opt_preserveReserved) {
  return val ? opt_preserveReserved ? decodeURI(val) : decodeURIComponent(val) : "";
};
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra, opt_removeDoubleEncoding) {
  if (goog.isString(unescapedPart)) {
    var encoded = encodeURI(unescapedPart).replace(extra, goog.Uri.encodeChar_);
    opt_removeDoubleEncoding && (encoded = goog.Uri.removeDoubleEncoding_(encoded));
    return encoded;
  }
  return null;
};
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16);
};
goog.Uri.removeDoubleEncoding_ = function(doubleEncodedString) {
  return doubleEncodedString.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = goog.uri.utils.split(uri1String), pieces2 = goog.uri.utils.split(uri2String);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
  this.encodedQuery_ = opt_query || null;
  this.ignoreCase_ = !!opt_ignoreCase;
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if (!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_)) {
    for (var pairs = this.encodedQuery_.split("&"), i = 0;i < pairs.length;i++) {
      var indexOfEquals = pairs[i].indexOf("="), name = null, value = null;
      0 <= indexOfEquals ? (name = pairs[i].substring(0, indexOfEquals), value = pairs[i].substring(indexOfEquals + 1)) : name = pairs[i];
      name = goog.string.urlDecode(name);
      name = this.getKeyName_(name);
      this.add(name, value ? goog.string.urlDecode(value) : "");
    }
  }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if ("undefined" == typeof keys) {
    throw Error("Keys are undefined");
  }
  for (var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase), values = goog.structs.getValues(map), i = 0;i < keys.length;i++) {
    var key = keys[i], value = values[i];
    goog.isArray(value) ? queryData.setValues(key, value) : queryData.add(key, value);
  }
  return queryData;
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
  if (keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  for (var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase), i = 0;i < keys.length;i++) {
    queryData.add(keys[i], values[i]);
  }
  return queryData;
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_;
};
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  var values = this.keyMap_.get(key);
  values || this.keyMap_.set(key, values = []);
  values.push(value);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key) ? (this.invalidateCache_(), this.count_ -= this.keyMap_.get(key).length, this.keyMap_.remove(key)) : !1;
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0;
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return 0 == this.count_;
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key);
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return goog.array.contains(vals, value);
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  for (var vals = this.keyMap_.getValues(), keys = this.keyMap_.getKeys(), rv = [], i = 0;i < keys.length;i++) {
    for (var val = vals[i], j = 0;j < val.length;j++) {
      rv.push(keys[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv = [];
  if (goog.isString(opt_key)) {
    this.containsKey(opt_key) && (rv = goog.array.concat(rv, this.keyMap_.get(this.getKeyName_(opt_key))));
  } else {
    for (var values = this.keyMap_.getValues(), i = 0;i < values.length;i++) {
      rv = goog.array.concat(rv, values[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  this.containsKey(key) && (this.count_ -= this.keyMap_.get(key).length);
  this.keyMap_.set(key, [value]);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  var values = key ? this.getValues(key) : [];
  return goog.Uri.preserveParameterTypesCompatibilityFlag ? 0 < values.length ? values[0] : opt_default : 0 < values.length ? String(values[0]) : opt_default;
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.remove(key);
  0 < values.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(key), goog.array.clone(values)), this.count_ += values.length);
};
goog.Uri.QueryData.prototype.toString = function() {
  if (this.encodedQuery_) {
    return this.encodedQuery_;
  }
  if (!this.keyMap_) {
    return "";
  }
  for (var sb = [], keys = this.keyMap_.getKeys(), i = 0;i < keys.length;i++) {
    for (var key = keys[i], encodedKey = goog.string.urlEncode(key), val = this.getValues(key), j = 0;j < val.length;j++) {
      var param = encodedKey;
      "" !== val[j] && (param += "=" + goog.string.urlEncode(val[j]));
      sb.push(param);
    }
  }
  return this.encodedQuery_ = sb.join("&");
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  return goog.Uri.decodeOrEmpty_(this.toString());
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null;
};
goog.Uri.QueryData.prototype.clone = function() {
  var rv = new goog.Uri.QueryData;
  rv.encodedQuery_ = this.encodedQuery_;
  this.keyMap_ && (rv.keyMap_ = this.keyMap_.clone(), rv.count_ = this.count_);
  return rv;
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  this.ignoreCase_ && (keyName = keyName.toLowerCase());
  return keyName;
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  var resetKeys = ignoreCase && !this.ignoreCase_;
  resetKeys && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), this.keyMap_.forEach(function(value, key) {
    var lowerCase = key.toLowerCase();
    key != lowerCase && (this.remove(key), this.setValues(lowerCase, value));
  }, this));
  this.ignoreCase_ = ignoreCase;
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
  for (var i = 0;i < arguments.length;i++) {
    var data = arguments[i];
    goog.structs.forEach(data, function(value, key) {
      this.add(key, value);
    }, this);
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/trixutils.js)
gviz.trixUtils = {};
gviz.trixUtils.TRIX_PATH_REG_ = {PREFIX:/\/spreadsheet/, SUFFIX:/\/(ccc|tq|pub)$/};
gviz.trixUtils.TRIX_DOMAIN_REG_ = {OLD:/^spreadsheets?[0-9]?\.google\.com$/, NEW:/^docs\.google\.com*$/, TEST:/^(trix|spreadsheets|docs|webdrive)(-[a-z]+)?\.(corp|sandbox)\.google\.com/, LOCAL:/^(\w*\.){1,2}corp\.google\.com$/};
gviz.trixUtils.RITZ_PATH_REG_ = {PREFIX:/\/spreadsheets(\/d\/[^/]+)?/, SUFFIX:/\/(edit|gviz\/tq|)$/};
gviz.trixUtils.RITZ_DOMAIN_REG_ = {PROD:/^docs\.google\.com*$/, TEST:/^docs\.sandbox\.google\.com*$/, LOCAL:/^(\w*\.){1,2}corp\.google\.com$/};
gviz.trixUtils.DASHER_DOMAIN_REG_ = {DASHER:/^\/a\/([\w-]+\.)+\w+/, OPT_DASHER:/^(\/a\/([\w-]+\.)+\w+)?/};
gviz.trixUtils.HEADERS_PARAM_KEYWORD_ = "headers";
gviz.trixUtils.QUERY_PARAM_KEYWORD_ = "tq";
gviz.trixUtils.RANGE_PARAM_KEYWORD_ = "range";
gviz.trixUtils.RANGE_MATCH_REG_ = /^[a-z]+\d+\:[a-z]+\d+$/i;
gviz.trixUtils.CELL_MATCH_REG_ = /^[a-z]+\d+$/i;
gviz.trixUtils.generateA1String = function(left, top, width, height) {
  var a = left, one = top, b = a + width - 1, two = one + height - 1;
  goog.asserts.assert(26 >= b, "Columns > Z not supported.");
  a = String.fromCharCode(64 + a);
  b = String.fromCharCode(64 + b);
  return a + one + ":" + b + two;
};
gviz.trixUtils.isTrixUrl = function(url) {
  var domain = goog.uri.utils.getDomain(url), domainReg = gviz.trixUtils.TRIX_DOMAIN_REG_, isOldDomain = domainReg.OLD.test(domain), isTestDomain = domainReg.TEST.test(domain), isLocalDomain = domainReg.LOCAL.test(domain), isNewDomain = domainReg.NEW.test(domain), path = goog.uri.utils.getPath(url), pathReg = gviz.trixUtils.TRIX_PATH_REG_, oldPathReg = new RegExp(gviz.trixUtils.DASHER_DOMAIN_REG_.OPT_DASHER.source + pathReg.SUFFIX.source), newPathReg = new RegExp(gviz.trixUtils.DASHER_DOMAIN_REG_.OPT_DASHER.source + 
  pathReg.PREFIX.source + pathReg.SUFFIX.source), isNewPath = newPathReg.test(path), isMixedPath = isNewPath || oldPathReg.test(path);
  return isNewDomain && isNewPath || (isTestDomain || isLocalDomain || isOldDomain) && isMixedPath;
};
gviz.trixUtils.isRitzUrl = function(url) {
  var domain = goog.uri.utils.getDomain(url), domainReg = gviz.trixUtils.RITZ_DOMAIN_REG_, isTestDomain = domainReg.TEST.test(domain), isLocalDomain = domainReg.LOCAL.test(domain), isProdDomain = domainReg.PROD.test(domain), path = goog.uri.utils.getPath(url), pathReg = gviz.trixUtils.RITZ_PATH_REG_, fullPathReg = new RegExp(gviz.trixUtils.DASHER_DOMAIN_REG_.OPT_DASHER.source + pathReg.PREFIX.source + pathReg.SUFFIX.source), isRitzPath = fullPathReg.test(path);
  return(isProdDomain || isTestDomain || isLocalDomain) && isRitzPath;
};
gviz.trixUtils.isTrixLocalMachineUrl = function(url) {
  var domain = goog.uri.utils.getDomain(url), hasPort = null != goog.uri.utils.getPort(url), domainReg = gviz.trixUtils.TRIX_DOMAIN_REG_, isTestDomain = domainReg.TEST.test(domain), isLocalDomain = domainReg.LOCAL.test(domain);
  return isLocalDomain && !isTestDomain && hasPort;
};
gviz.trixUtils.isRitzLocalMachineUrl = function(url) {
  var domain = goog.uri.utils.getDomain(url), hasPort = !goog.isNull(goog.uri.utils.getPort(url)), domainReg = gviz.trixUtils.RITZ_DOMAIN_REG_, isLocalDomain = domainReg.LOCAL.test(domain);
  return isLocalDomain && hasPort;
};
gviz.trixUtils.isTrixDasherUrl = function(url) {
  var isTrixUrl = gviz.trixUtils.isTrixUrl(url), path = goog.uri.utils.getPath(url), isDasher = gviz.trixUtils.DASHER_DOMAIN_REG_.DASHER.test(path);
  return isTrixUrl && isDasher;
};
gviz.trixUtils.isRitzDasherUrl = function(url) {
  var isRitzUrl = gviz.trixUtils.isRitzUrl(url), path = goog.uri.utils.getPath(url), isDasher = gviz.trixUtils.DASHER_DOMAIN_REG_.DASHER.test(path);
  return isRitzUrl && isDasher;
};
gviz.trixUtils.getHeadersFromUrl = function(url) {
  return goog.uri.utils.getParamValue(url, gviz.trixUtils.HEADERS_PARAM_KEYWORD_);
};
gviz.trixUtils.setHeadersInUrl = function(url, value) {
  return goog.uri.utils.setParam(url, gviz.trixUtils.HEADERS_PARAM_KEYWORD_, value);
};
gviz.trixUtils.getQueryFromUrl = function(url) {
  return goog.uri.utils.getParamValue(url, gviz.trixUtils.QUERY_PARAM_KEYWORD_);
};
gviz.trixUtils.getRangeFromUrl = function(url) {
  return goog.uri.utils.getParamValue(url, gviz.trixUtils.RANGE_PARAM_KEYWORD_);
};
gviz.trixUtils.colStringToIndex_ = function(colString) {
  for (var col = 0, magnitude = 1, i = colString.length - 1;0 <= i;i--) {
    var charCode = colString.charCodeAt(i), col = col + magnitude * (charCode - 64), magnitude = 26 * magnitude
  }
  return col;
};
gviz.trixUtils.a1ToCellPos_ = function(a1CellStr) {
  if (!gviz.trixUtils.CELL_MATCH_REG_.test(a1CellStr)) {
    return null;
  }
  a1CellStr = a1CellStr.toUpperCase();
  for (var rowString, colString = "", i = 0;i < a1CellStr.length;i++) {
    var charCode = a1CellStr.charCodeAt(i);
    if (65 > charCode || 90 < charCode) {
      colString = a1CellStr.substring(0, i);
      rowString = a1CellStr.substring(i);
      break;
    }
  }
  var col = gviz.trixUtils.colStringToIndex_(colString), row = parseInt(rowString, 10);
  return isNaN(row) || 0 >= row || 0 > col ? null : new goog.math.Coordinate(col, row);
};
gviz.trixUtils.a1RangeToSize = function(rangeString) {
  if (!gviz.trixUtils.RANGE_MATCH_REG_.test(rangeString)) {
    return null;
  }
  rangeString = rangeString.toUpperCase();
  var splittedRange = rangeString.split(":"), rangeFirst = splittedRange[0], rangeSecond = splittedRange[1], firstCoor = gviz.trixUtils.a1ToCellPos_(rangeFirst), secondCoor = gviz.trixUtils.a1ToCellPos_(rangeSecond);
  return new goog.math.Size(Math.abs(secondCoor.x - firstCoor.x) + 1, Math.abs(secondCoor.y - firstCoor.y) + 1);
};
// INPUT (research/infovis/javascript/csv.js)
var vis = {csv:{}};
vis.csv.ParserOptions = {};
vis.csv.defaultOptions_ = {firstLineIsHeader:!1};
vis.csv.ParseError = function(message, text, lineno, col) {
  var lines = text.split(/\r?\n/), line = lines[lineno];
  this.message = message + " at line " + (lineno + 1) + ":\n" + line;
  var blanks = -1 == col ? line.length : col;
  this.message += "\n" + goog.string.repeat(" ", blanks) + "^";
};
goog.inherits(vis.csv.ParseError, Error);
goog.exportSymbol("vis.csv.ParseError", vis.csv.ParseError);
vis.csv.ParseError.prototype.name = "ParseError";
vis.csv.Parser = function(opt_options) {
  this.options_ = opt_options || {};
  goog.object.forEach(vis.csv.defaultOptions_, function(v, k) {
    goog.object.setIfUndefined(this.options_, k, v);
  }, this);
};
goog.exportSymbol("vis.csv.Parser", vis.csv.Parser);
vis.csv.Parser.prototype.parse = function(text) {
  function pushBack(c) {
    "<CRLF>" == c && (line--, col = lastcol);
    pbToken = c;
  }
  function nextToken() {
    lastcol = col;
    if (null != pbToken) {
      var c = pbToken;
      "<CRLF>" == c && (line++, col = 0);
      pbToken = null;
      return c;
    }
    if (n >= len) {
      return "<EOF>";
    }
    c = text.charAt(n++);
    col++;
    var iscrlf = !1;
    "\n" == c ? iscrlf = !0 : "\r" == c && (n < len && "\n" == text.charAt(n) && n++, iscrlf = !0);
    return iscrlf ? (line++, col = 0, "<CRLF>") : c;
  }
  function readQuotedField() {
    for (var start = n, end = null, t = nextToken();"<EOF>" != t;t = nextToken()) {
      if ('"' == t) {
        if (end = n - 1, t = nextToken(), '"' == t) {
          end = null;
        } else {
          if ("," == t || "<EOF>" == t || "<CRLF>" == t) {
            "<CRLF>" == t && pushBack(t);
            break;
          }
          throw new vis.csv.ParseError('Unexpected character "' + t + '" after quote mark', text, line, col - 1);
        }
      }
    }
    if (null == end) {
      throw new vis.csv.ParseError("Unexpected end of text after open quote", text, line, col);
    }
    return text.substring(start, end).replace(/""/g, '"');
  }
  function readField() {
    var start = n, didSeeComma = sawComma;
    sawComma = !1;
    var t = nextToken();
    if ("<EMPTY>" == t) {
      return "<EOR>";
    }
    if ("<EOF>" == t || "<CRLF>" == t) {
      return didSeeComma ? (pushBack("<EMPTY>"), "") : "<EOR>";
    }
    if ('"' == t) {
      return readQuotedField();
    }
    for (;"<EOF>" != t && "," != t && "<CRLF>" != t;t = nextToken()) {
      if ('"' == t) {
        throw new vis.csv.ParseError("Unexpected quote mark", text, line, col - 1);
      }
    }
    "," == t && (sawComma = !0);
    "<EOF>" != t && "<CRLF>" != t || pushBack(t);
    return text.substring(start, "<EOF>" == t ? n : n - 1).replace(/[\r\n]+/g, "");
  }
  function readRecord() {
    if (n >= len) {
      return "<EOF>";
    }
    for (var record = [], field = readField();"<EOR>" != field;field = readField()) {
      record.push(field);
    }
    return record;
  }
  var useObjects = this.options_.firstLineIsHeader, len = text.length, n = 0, line = 0, col = 0, lastcol = 0, pbToken = null, sawComma = !1, headers = [], result = [], expectedFieldCount = null;
  useObjects && (headers = readRecord(), expectedFieldCount = headers.length);
  for (var record$$0 = readRecord();"<EOF>" != record$$0;record$$0 = readRecord()) {
    null == expectedFieldCount && (expectedFieldCount = record$$0.length);
    if (record$$0.length != expectedFieldCount) {
      throw new vis.csv.ParseError("Record has " + record$$0.length + " field" + (1 == record$$0.length ? "" : "s") + ", but expected " + expectedFieldCount, text, line - 1, -1);
    }
    if (useObjects) {
      for (var obj = {}, i = 0;i < record$$0.length;i++) {
        obj[headers[i]] = record$$0[i];
      }
      result.push(obj);
    } else {
      result.push(record$$0);
    }
  }
  return result;
};
goog.exportProperty(vis.csv.Parser.prototype, "parse", vis.csv.Parser.prototype.parse);
// INPUT (javascript/gviz/devel/jsapi/packages/util/converters/csvtodatatable.js)
gviz.CsvToDataTable = function(csvText, colTypes, opt_colHeader) {
  this.parser_ = new vis.csv.Parser;
  this.hasHeader_ = goog.isDefAndNotNull(opt_colHeader) ? opt_colHeader : !1;
  this.csvText_ = csvText;
  this.validateTypes_(colTypes);
  this.types_ = colTypes;
  this.columns_ = [];
};
gviz.CsvToDataTable.prototype.createDataTable = function() {
  var csvRows = this.parser_.parse(this.csvText_), dataTable = new google.visualization.DataTable;
  csvRows && 0 < csvRows.length && (this.createColumns_(csvRows, dataTable), this.createRows_(csvRows, dataTable));
  return dataTable;
};
gviz.CsvToDataTable.prototype.createColumns_ = function(csvRows, dataTable) {
  for (var cols = [], types = this.types_, t = 0, len = types.length;t < len;t++) {
    cols.push({type:types[t], label:[]});
  }
  if (this.hasHeader_) {
    for (var c = 0, len = cols.length;c < len;c++) {
      cols[c].label.push(csvRows[0][c]);
    }
  }
  for (var i = 0, len = cols.length;i < len;i++) {
    var col = cols[i];
    dataTable.addColumn(col.type, col.label.join(" "));
  }
  this.columns_ = cols;
};
gviz.CsvToDataTable.prototype.createRows_ = function(csvRows, dataTable) {
  for (var cols = this.columns_, startRow = this.hasHeader_ ? 1 : 0, r = startRow, numRows = csvRows.length;r < numRows;r++) {
    dataTable.addRow();
    for (var c = 0, len = cols.length;c < len;c++) {
      var value = csvRows[r][c], type = cols[c].type;
      dataTable.setCell(r - startRow, c, this.getTypedValue_(value, type));
    }
  }
};
gviz.CsvToDataTable.prototype.validateTypes_ = function(types) {
  for (var t = 0;t < types.length;t++) {
    var type = types[t];
    if (!gviz.CsvToDataTable.SupportedTypes_[type]) {
      throw Error("Unsupported type: " + type);
    }
  }
};
gviz.CsvToDataTable.prototype.getTypedValue_ = function(value, type) {
  return gviz.CsvToDataTable.SupportedTypes_[type](value);
};
gviz.CsvToDataTable.SupportedTypes_ = {number:function(value) {
  return gviz.CsvToDataTable.convertToNumber_(value);
}, string:function(value) {
  return value;
}, "boolean":function(value) {
  return "true" === value.toLowerCase();
}, date:function(value) {
  return new Date(value);
}, datetime:function(value) {
  return new Date(value);
}, timeofday:function(value) {
  return value.split(",");
}};
gviz.CsvToDataTable.convertToNumber_ = function(val) {
  var num = parseFloat(val);
  if (isNaN(num)) {
    throw Error("Not a number " + val);
  }
  return num;
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/abstractquery.js)
gviz.AbstractQuery = function() {
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/query.js)
google.visualization.Query = function(dataSourceUrl, opt_options) {
  var options = opt_options || {};
  this.parseCsv_ = goog.isDef(options.csvColumns);
  this.columnSpec_ = options.csvColumns;
  this.hasHeader_ = !!options.csvHasHeader;
  this.sendMethod_ = options.sendMethod || google.visualization.Query.SEND_METHOD_.AUTO;
  this.xhrWithCredentials_ = !!options.xhrWithCredentials;
  if (!goog.object.contains(google.visualization.Query.SEND_METHOD_, this.sendMethod_)) {
    throw Error("Send method not supported: " + this.sendMethod_);
  }
  this.makeRequestParams_ = options.makeRequestParams_ || {};
  gviz.trixUtils.isRitzUrl(dataSourceUrl) ? dataSourceUrl = this.normalizeRitzUrl_(dataSourceUrl) : gviz.trixUtils.isTrixUrl(dataSourceUrl) && (dataSourceUrl = this.normalizeTrixUrl_(dataSourceUrl));
  this.isDasherUrl_ = gviz.trixUtils.isTrixDasherUrl(dataSourceUrl) || gviz.trixUtils.isRitzDasherUrl(dataSourceUrl);
  this.dataSourceUrl = dataSourceUrl;
  this.requestId = google.visualization.Query.nextId_++;
  google.visualization.Query.allQueries_.push(this);
};
google.visualization.Query.SEND_METHOD_ = {XHR:"xhr", XHRPOST:"xhrpost", SCRIPT_INJECTION:"scriptInjection", MAKE_REQUEST:"makeRequest", AUTO:"auto"};
google.visualization.Query.AUTH_HEADER_MAP_ = new goog.structs.Map({"X-DataSource-Auth":"a"});
google.visualization.Query.nextId_ = 0;
google.visualization.Query.pendingRequests_ = {};
google.visualization.Query.REQUIRE_GAIA_PARAM_ = "requireauth";
google.visualization.Query.prototype.timeoutSeconds_ = 30;
google.visualization.Query.allQueries_ = [];
google.visualization.Query.gadgets_ = goog.global.gadgets;
google.visualization.Query.refreshAllQueries = function() {
  for (var i = 0;i < google.visualization.Query.allQueries_.length;i++) {
    var q = google.visualization.Query.allQueries_[i];
    q.refreshable_ && q.sendQuery_();
  }
};
google.visualization.Query.prototype.normalizeTrixUrl_ = function(url) {
  var uri = new goog.Uri(url);
  433 == uri.getPort() && uri.setPort(null);
  var path = uri.getPath(), path = path.replace(/\/ccc$/, "/tq");
  /\/pub$/.test(path) && (path = path.replace(/\/pub$/, "/tq"), uri.setParameterValue("pub", "1"));
  uri.setPath(path);
  var isLocalMachineTrix = gviz.trixUtils.isTrixLocalMachineUrl(url);
  uri.setScheme(isLocalMachineTrix ? "http" : "https");
  return uri.toString();
};
google.visualization.Query.prototype.normalizeRitzUrl_ = function(url) {
  var uri = new goog.Uri(url);
  433 == uri.getPort() && uri.setPort(null);
  var path = uri.getPath(), path = path.replace(/\/edit$/, "/gviz/tq");
  uri.setPath(path);
  var isLocalMachineRitz = gviz.trixUtils.isRitzLocalMachineUrl(url);
  uri.setScheme(isLocalMachineRitz ? "http" : "https");
  return uri.toString();
};
google.visualization.Query.storePendingRequest = function(reqId, query) {
  google.visualization.Query.pendingRequests_[reqId] = query;
};
google.visualization.Query.overrideUrlParameters = function(url, newParameters) {
  var hashSignIndex = url.indexOf("#");
  -1 != hashSignIndex && (url = url.substring(0, hashSignIndex));
  var questionMarkIndex = url.indexOf("?"), urlPrefix = "", urlParams = "", originalParameters = [];
  -1 == questionMarkIndex ? urlPrefix = url : (urlPrefix = url.substring(0, questionMarkIndex), urlParams = url.substring(questionMarkIndex + 1), originalParameters = urlParams.split("&"));
  var i, parameterList = [];
  for (i = 0;i < originalParameters.length;i++) {
    var nameAndValuePair = originalParameters[i].split("="), param = {};
    param.name = nameAndValuePair[0];
    param.originalParamText = originalParameters[i];
    parameterList.push(param);
  }
  for (var name in newParameters) {
    var value = newParameters[name], found = !1;
    for (i = 0;i < parameterList.length;i++) {
      if (parameterList[i].name == name) {
        parameterList[i].originalParamText = name + "=" + encodeURIComponent(value);
        found = !0;
        break;
      }
    }
    if (!found) {
      var newParam = {};
      newParam.name = name;
      newParam.originalParamText = name + "=" + encodeURIComponent(value);
      parameterList.push(newParam);
    }
  }
  var newUrl = urlPrefix;
  if (0 < parameterList.length) {
    var newUrl = newUrl + "?", paramStringsArray = [];
    for (i = 0;i < parameterList.length;i++) {
      paramStringsArray.push(parameterList[i].originalParamText);
    }
    newUrl += paramStringsArray.join("&");
  }
  return newUrl;
};
google.visualization.Query.prototype.interpretCsv_ = function(responseText) {
  var converter = new gviz.CsvToDataTable(responseText, this.columnSpec_, this.hasHeader_);
  return converter.createDataTable();
};
google.visualization.Query.prototype.setXhrResponse = function(requestId, e) {
  if (e.target.isSuccess()) {
    var responseText = goog.string.trim(e.target.getResponseText()), response;
    if (this.parseCsv_) {
      var table = this.interpretCsv_(responseText), responseObj = {};
      responseObj.table = table.toJSON();
      responseObj.version = google.visualization.QueryResponse.getVersionFromResponse(responseObj);
      responseObj.reqId = requestId;
      google.visualization.Query.setResponse(responseObj);
    } else {
      responseText.match(/^({.*})$/) ? (response = gviz.json.unsafeDeserialize(responseText), google.visualization.Query.setResponse(response)) : gviz.json.globalEval(responseText);
    }
  } else {
    if (this.responseHandler) {
      this.setErrorResponse("google.visualization.Query", e.target.getLastError());
    } else {
      throw Error("google.visualization.Query: " + e.target.getLastError());
    }
  }
};
google.visualization.Query.setResponse = function(response) {
  google.visualization.QueryResponse.getVersionFromResponse(response);
  var requestId = response.reqId, query = google.visualization.Query.pendingRequests_[requestId];
  if (query) {
    google.visualization.Query.pendingRequests_[requestId] = null, query.handleResponse_(response);
  } else {
    throw Error("Missing query for request id: " + requestId);
  }
};
google.visualization.Query.prototype.responseHandler = null;
google.visualization.Query.prototype.refreshTimerId_ = null;
google.visualization.Query.prototype.timeoutTimerId_ = null;
google.visualization.Query.prototype.query_ = null;
google.visualization.Query.prototype.handlerType_ = null;
google.visualization.Query.prototype.handlerParameters_ = null;
google.visualization.Query.prototype.refreshable_ = !0;
google.visualization.Query.prototype.refreshInterval_ = 0;
google.visualization.Query.prototype.lastSignature_ = null;
google.visualization.Query.prototype.isActive = !1;
google.visualization.Query.prototype.setRefreshInterval = function(intervalSeconds) {
  if ("number" != typeof intervalSeconds || 0 > intervalSeconds) {
    throw Error("Refresh interval must be a non-negative number");
  }
  this.refreshInterval_ = intervalSeconds;
  this.resetRefreshTimer_();
};
google.visualization.Query.prototype.clearTimeoutTimer_ = function() {
  this.timeoutTimerId_ && (window.clearTimeout(this.timeoutTimerId_), this.timeoutTimerId_ = null);
};
google.visualization.Query.prototype.timeoutReached_ = function() {
  this.setErrorResponse("timeout", "Request timed out");
};
google.visualization.Query.prototype.setErrorResponse = function(reason, errorMessage, opt_detailedMessage) {
  var response = {version:google.visualization.ResponseVersion.VERSION_0_6, status:google.visualization.QueryResponse.ExecutionStatus.ERROR, errors:[{reason:reason, message:errorMessage, detailed_message:opt_detailedMessage}]};
  this.handleResponse_(response);
};
google.visualization.Query.prototype.addModifiersToUrl = function(url) {
  var parametersToAdd = {};
  this.query_ && (parametersToAdd.tq = String(this.query_));
  var additionalParameters = "reqId:" + String(this.requestId), signature = this.lastSignature_;
  signature && (additionalParameters += ";sig:" + signature);
  this.handlerType_ && (additionalParameters += ";type:" + this.handlerType_);
  parametersToAdd.tqx = additionalParameters;
  if (this.handlerParameters_) {
    var paramStringsArray = [], p;
    for (p in this.handlerParameters_) {
      paramStringsArray.push(p + ":" + this.handlerParameters_[p]);
    }
    parametersToAdd.tqh = paramStringsArray.join(";");
  }
  url = google.visualization.Query.overrideUrlParameters(url, parametersToAdd);
  if (this.refreshInterval_) {
    var uri = new goog.Uri(url);
    goog.userAgent.WEBKIT && uri.makeUnique();
    url = uri.toString();
  }
  return url;
};
google.visualization.Query.prototype.sendQuery_ = function() {
  var url = this.addModifiersToUrl(this.dataSourceUrl), sendMethodOptions = {};
  google.visualization.Query.pendingRequests_[String(this.requestId)] = this;
  var sendMethod = this.sendMethod_, xhrHttpMethod = "GET";
  "xhrpost" == sendMethod && (sendMethod = "xhr", xhrHttpMethod = "POST");
  if ("auto" == sendMethod) {
    var sendMethodAndOpts = google.visualization.Query.extractSendMethodAndOptsFromUrl_(url), sendMethod = sendMethodAndOpts.sendMethod, sendMethodOptions = sendMethodAndOpts.options
  }
  if ("makeRequest" == sendMethod) {
    if (google.visualization.Query.isMakeRequestDefined_()) {
      this.sendMakeRequestQuery_(url, this.makeRequestParams_);
    } else {
      throw Error("gadgets.io.makeRequest is not defined.");
    }
  } else {
    if ("xhr" == sendMethod || "auto" == sendMethod && google.visualization.Query.isSameDomainUrl_(goog.global.location.href, url)) {
      var postContent = void 0, httpUrl = url;
      if ("POST" == xhrHttpMethod) {
        var a = url.split("?");
        1 <= a.length && (httpUrl = a[0]);
        2 <= a.length && (postContent = a[1]);
      }
      goog.net.XhrIo.send(httpUrl, goog.bind(goog.partial(this.setXhrResponse, this.requestId), this), xhrHttpMethod, postContent, google.visualization.Query.AUTH_HEADER_MAP_, void 0, this.xhrWithCredentials_ || !!sendMethodOptions.xhrWithCredentials);
    } else {
      if (this.parseCsv_) {
        throw Error("CSV files on other domains are not supported. Please use sendMethod: 'xhr' or 'auto' and serve your .csv file from the same domain as this page.");
      }
      var body = document.getElementsByTagName("body")[0], isFreshQuery = goog.isNull(this.lastSignature_);
      if (this.isDasherUrl_ && isFreshQuery) {
        var img = document.createElement("img");
        this.prepareAuthImg_(img, url);
        goog.dom.appendChild(body, img);
      } else {
        this.appendScript_(url);
      }
    }
  }
};
google.visualization.Query.prototype.prepareAuthImg_ = function(img, url) {
  var self = this;
  img.onerror = function() {
    self.appendScript_(url);
  };
  img.onload = function() {
    self.appendScript_(url);
  };
  img.style.display = "none";
  var imgUrl = url + "&" + google.visualization.Query.REQUIRE_GAIA_PARAM_ + "=1&" + (new Date).getTime();
  img.src = imgUrl;
};
google.visualization.Query.extractSendMethodAndOptsFromUrl_ = function(url) {
  var userSendMethod, options = {};
  if (/[?&]alt=gviz(&[^&]*)*$/.test(url)) {
    userSendMethod = google.visualization.Query.SEND_METHOD_.MAKE_REQUEST;
  } else {
    var userSendMethodAndOpts = goog.uri.utils.getParamValue(url, "tqrt") || google.visualization.Query.SEND_METHOD_.AUTO, userSendMethodAndOpts = userSendMethodAndOpts.split(":");
    userSendMethod = userSendMethodAndOpts[0];
    "xhr" !== userSendMethod && "xhrpost" !== userSendMethod || !goog.array.contains(userSendMethodAndOpts, "withCredentials") || (options.xhrWithCredentials = !0);
    goog.object.contains(google.visualization.Query.SEND_METHOD_, userSendMethod) || (userSendMethod = google.visualization.Query.SEND_METHOD_.AUTO);
  }
  return{sendMethod:userSendMethod, options:options};
};
google.visualization.Query.isMakeRequestDefined_ = function() {
  return!!goog.getObjectByName("gadgets.io.makeRequest");
};
google.visualization.Query.isSameDomainUrl_ = function(location, url) {
  return goog.uri.utils.haveSameDomain(location, (new goog.Uri(location)).resolve(new goog.Uri(url)).toString());
};
google.visualization.Query.prototype.sendMakeRequestQuery_ = function(url, params) {
  var gadgets = google.visualization.Query.gadgets_;
  null == params[gadgets.io.RequestParameters.CONTENT_TYPE] && (params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT);
  null == params[gadgets.io.RequestParameters.AUTHORIZATION] && (params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED);
  null == params.OAUTH_ENABLE_PRIVATE_NETWORK && (params.OAUTH_ENABLE_PRIVATE_NETWORK = !0);
  null == params.OAUTH_ADD_EMAIL && (params.OAUTH_ADD_EMAIL = !0);
  gadgets.io.makeRequest(url, goog.bind(this.handleMakeRequestResponse_, this), params);
  this.startCountDown();
};
google.visualization.Query.prototype.handleMakeRequestResponse_ = function(makeRequestResponse) {
  if (null != makeRequestResponse && makeRequestResponse.data) {
    gviz.json.globalEval(makeRequestResponse.data);
  } else {
    var detailedMessage = "";
    if (makeRequestResponse && makeRequestResponse.errors) {
      var errors = makeRequestResponse.errors, detailedMessage = errors.join(" ")
    }
    this.setErrorResponse("make_request_failed", "gadgets.io.makeRequest failed", detailedMessage);
  }
};
google.visualization.Query.prototype.appendScript_ = function(url) {
  this.startCountDown();
  gviz.coreutils.appendScript(url);
  this.resetRefreshTimer_();
};
google.visualization.Query.prototype.startCountDown = function() {
  var self = this;
  this.clearTimeoutTimer_();
  this.timeoutTimerId_ = window.setTimeout(function() {
    self.timeoutReached_();
  }, 1E3 * this.timeoutSeconds_);
};
google.visualization.Query.prototype.stopRefreshTimer_ = function() {
  this.refreshTimerId_ && (window.clearTimeout(this.refreshTimerId_), this.refreshTimerId_ = null);
};
google.visualization.Query.prototype.resetRefreshTimer_ = function() {
  this.stopRefreshTimer_();
  if (0 != this.refreshInterval_ && this.refreshable_ && this.isActive) {
    var self = this;
    this.refreshTimerId_ = window.setTimeout(function() {
      self.sendQuery_();
    }, 1E3 * this.refreshInterval_);
  }
};
google.visualization.Query.prototype.send = function(responseHandler) {
  this.isActive = !0;
  this.responseHandler = responseHandler;
  this.sendQuery_();
};
google.visualization.Query.prototype.makeRequest = function(responseHandler, opt_params) {
  this.isActive = !0;
  this.responseHandler = responseHandler;
  this.sendMethod = "makeRequest";
  this.makeRequestParams_ = opt_params || {};
  this.sendQuery_();
};
google.visualization.Query.prototype.abort = function() {
  this.isActive = !1;
  this.clearTimeoutTimer_();
  this.stopRefreshTimer_();
};
google.visualization.Query.prototype.handleResponse_ = function(responseObj) {
  this.clearTimeoutTimer_();
  var queryResponse = new google.visualization.QueryResponse(responseObj);
  if (!queryResponse.containsReason("not_modified")) {
    this.lastSignature_ = queryResponse.isError() ? null : queryResponse.getDataSignature();
    var responseHandler = this.responseHandler;
    responseHandler.call(responseHandler, queryResponse);
  }
};
google.visualization.Query.prototype.setTimeout = function(timeoutSeconds) {
  if ("number" != typeof timeoutSeconds || isNaN(timeoutSeconds) || 0 >= timeoutSeconds) {
    throw Error("Timeout must be a positive number");
  }
  this.timeoutSeconds_ = timeoutSeconds;
};
google.visualization.Query.prototype.setRefreshable = function(refreshable) {
  if ("boolean" != typeof refreshable) {
    throw Error("Refreshable must be a boolean");
  }
  return this.refreshable_ = refreshable;
};
google.visualization.Query.prototype.setQuery = function(queryString) {
  if ("string" != typeof queryString) {
    throw Error("queryString must be a string");
  }
  this.query_ = queryString;
};
google.visualization.Query.prototype.setHandlerType = function(handlerType) {
  this.handlerType_ = handlerType;
  null != handlerType && this.setHandlerParameter("type", handlerType);
};
google.visualization.Query.prototype.setHandlerParameter = function(name, value) {
  name = name.replace(/\\/g, "\\\\");
  value = value.replace(/\\/g, "\\\\");
  name = name.replace(/:/g, "\\c");
  value = value.replace(/:/g, "\\c");
  name = name.replace(/;/g, "\\s");
  value = value.replace(/;/g, "\\s");
  this.handlerParameters_ || (this.handlerParameters_ = {});
  this.handlerParameters_[name] = value;
};
// INPUT (javascript/gviz/devel/jsapi/common/gadgethelper/gadgethelper.js)
google.visualization.GadgetHelper = function() {
  google.visualization.GadgetHelper.initialized_ || (google.visualization.GadgetHelper.initialized_ = !0, goog.global.IDIModule && goog.global.IDIModule.registerListener(google.visualization.Query.refreshAllQueries, {pollingInterval:google.visualization.GadgetHelper.POLLING_INTERVAL_}), goog.global.gadgets && (google.visualization.GadgetHelper.verifyRelayUrl_(google.visualization.GadgetHelper.DEFAULT_RELAY_PATH_), this.registerRpcPoll_()));
  var body = goog.dom.getElementsByTagNameAndClass("body")[0];
  this.responseValidator = gviz.coreutils.getDefaultResponseValidator(body);
};
google.visualization.GadgetHelper.PREF_NAME_SOURCE_URL_ = "_table_query_url";
google.visualization.GadgetHelper.DEFAULT_RELAY_PATH_ = "..";
google.visualization.GadgetHelper.PREF_NAME_REFRESH_INTERVAL_ = "_table_query_refresh_interval";
google.visualization.GadgetHelper.initialized_ = !1;
google.visualization.GadgetHelper.prototype.pollLimit_ = 200;
google.visualization.GadgetHelper.POLLING_INTERVAL_ = 100;
google.visualization.GadgetHelper.RPC_JS_URL_ = "//www-opensocial.googleusercontent.com/gadgets/rpc/rpc.v.js";
google.visualization.GadgetHelper.rpcLoaded_ = function() {
  return!!goog.global.gadgets && !!goog.global.gadgets.rpc;
};
google.visualization.GadgetHelper.prototype.registerRpcPoll_ = function() {
  if (google.visualization.GadgetHelper.rpcLoaded_()) {
    var gadgets = goog.global.gadgets;
    goog.isFunction(gadgets.rpc.register) && gadgets.rpc.register("refresh", google.visualization.Query.refreshAllQueries);
  } else {
    0 < this.pollLimit_ && (this.pollLimit_--, window.setTimeout(goog.bind(this.registerRpcPoll_, this), google.visualization.GadgetHelper.POLLING_INTERVAL_));
  }
};
google.visualization.GadgetHelper.prototype.createQueryFromPrefs = function(prefs) {
  var url = prefs.getString(google.visualization.GadgetHelper.PREF_NAME_SOURCE_URL_), lowercaseUrl = url.toLowerCase();
  if (0 == lowercaseUrl.indexOf("http%") || 0 == lowercaseUrl.indexOf("https%")) {
    url = decodeURIComponent(url);
  }
  var query = new google.visualization.Query(url), interval = prefs.getInt(google.visualization.GadgetHelper.PREF_NAME_REFRESH_INTERVAL_);
  query.setRefreshInterval(interval);
  return query;
};
google.visualization.GadgetHelper.prototype.validateResponse = function(response) {
  return this.responseValidator(response);
};
google.visualization.GadgetHelper.verifyRelayUrl_ = function(path) {
  if (google.visualization.GadgetHelper.rpcLoaded_()) {
    var gadgets = goog.global.gadgets;
    try {
      gadgets.rpc.getRelayUrl(path) || gadgets.rpc.setRelayUrl(path, "http://dummy.com");
    } catch (err) {
      goog.isFunction(gadgets.rpc.setRelayUrl) && gadgets.rpc.setRelayUrl(path, "http://dummy.com");
    }
  }
};
goog.global.gadgets && !google.visualization.GadgetHelper.rpcLoaded_() && gviz.coreutils.appendScript(google.visualization.GadgetHelper.RPC_JS_URL_);
google.visualization.GadgetHelper.verifyRelayUrl_(google.visualization.GadgetHelper.DEFAULT_RELAY_PATH_);
// INPUT (javascript/gviz/devel/jsapi/packages/core/events.js)
google.visualization.events = {};
google.visualization.events.addListener = goog.global.__gvizguard__ ? goog.getObjectByName("google.visualization.events.addListener") : function(eventSource, eventName, eventHandler) {
  var eventTarget = google.visualization.events.getEventTarget_(eventSource), key = goog.events.listen(eventTarget, eventName, google.visualization.events.createEventHandler_(eventHandler));
  return new google.visualization.events.EventListener_(key);
};
google.visualization.events.addOneTimeListener = goog.global.__gvizguard__ ? goog.getObjectByName("google.visualization.events.addOneTimeListener") : function(eventSource, eventName, eventHandler) {
  var eventTarget = google.visualization.events.getEventTarget_(eventSource), listenFunction = goog.events.listenOnce, key = listenFunction(eventTarget, eventName, google.visualization.events.createEventHandler_(eventHandler));
  return new google.visualization.events.EventListener_(key);
};
google.visualization.events.trigger = goog.global.__gvizguard__ ? goog.getObjectByName("google.visualization.events.trigger") : function(eventSource, eventName, eventDetails) {
  var eventTarget = google.visualization.events.getEventTarget_(eventSource), event = new google.visualization.events.Event_(eventName, eventDetails);
  goog.events.dispatchEvent(eventTarget, event);
};
google.visualization.events.removeListener = goog.global.__gvizguard__ ? goog.getObjectByName("google.visualization.events.removeListener") : function(listener) {
  var key = listener && goog.isFunction(listener.getKey) && listener.getKey();
  return key ? goog.events.unlistenByKey(key) : !1;
};
google.visualization.events.removeAllListeners = goog.global.__gvizguard__ ? goog.getObjectByName("google.visualization.events.removeAllListeners") : function(eventSource) {
  var eventTarget = google.visualization.events.getEventTarget_(eventSource), numListners = goog.events.removeAll(eventTarget);
  google.visualization.events.clearEventTarget_(eventSource);
  return numListners;
};
google.visualization.events.EVENT_TARGET_KEY_ = "__eventTarget";
google.visualization.events.getEventTarget_ = function(eventSource) {
  var eventTarget = eventSource[google.visualization.events.EVENT_TARGET_KEY_];
  return goog.isDefAndNotNull(eventTarget) ? eventTarget : google.visualization.events.createEventTarget_(eventSource);
};
google.visualization.events.createEventTarget_ = function(eventSource) {
  var eventTarget = new goog.events.EventTarget;
  return eventSource[google.visualization.events.EVENT_TARGET_KEY_] = eventTarget;
};
google.visualization.events.clearEventTarget_ = function(eventSource) {
  goog.dispose(eventSource[google.visualization.events.EVENT_TARGET_KEY_]);
  eventSource[google.visualization.events.EVENT_TARGET_KEY_] = void 0;
};
google.visualization.events.createEventHandler_ = function(eventHandler) {
  return function(e) {
    e && e.getEventProperties ? eventHandler(e.getEventProperties()) : eventHandler();
  };
};
google.visualization.events.EventListener_ = function(key) {
  this.key_ = key;
};
google.visualization.events.EventListener_.prototype.getKey = function() {
  return this.key_;
};
google.visualization.events.Event_ = function(type, properties) {
  goog.events.Event.call(this, type);
  this.properties_ = properties;
};
goog.inherits(google.visualization.events.Event_, goog.events.Event);
google.visualization.events.Event_.prototype.getEventProperties = function() {
  return this.properties_;
};
google.visualization.events.EventDebugger = function(level) {
  if (level !== goog.log.Level.OFF) {
    var logger = gviz.util.VisCommon.createLogger("EventDebugger");
    logger && logger.setLevel(level);
    var orig_listen = goog.events.listen, orig_unlistenByKey = goog.events.unlistenByKey, allListeners = [];
    goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
      if (goog.isArray(type)) {
        for (var i = 0;i < type.length;i++) {
          goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
        }
        return null;
      }
      var key = orig_listen(src, type, listener, opt_capt, opt_handler);
      key.proxy && (allListeners.push(key), goog.log.info(logger, "listen: " + allListeners.length + " " + key.type + " " + key.src));
      return key;
    };
    goog.events.unlistenByKey = function(key) {
      goog.array.remove(allListeners, key);
      key.proxy && goog.log.info(logger, "unlisten:" + allListeners.length + " " + key.type + " " + key.src);
      return orig_unlistenByKey(key);
    };
  }
};
goog.DEBUG && google.visualization.events.EventDebugger(goog.log.Level.OFF);
// INPUT (javascript/gviz/devel/jsapi/packages/core/predefined.js)
gviz.predefined = {};
gviz.predefined.emptyString = function() {
  return "";
};
gviz.predefined.error = function(data, row, options) {
  var column = options.sourceColumn, error = options.magnitude;
  if (!goog.isNumber(column) || !goog.isNumber(error)) {
    return null;
  }
  var value = data.getValue(row, column);
  return goog.isNumber(value) ? "percent" == options.errorType ? value + error / 100 * value : value + error : null;
};
gviz.predefined.stringify = function(data, row, options) {
  var column = options.sourceColumn;
  return goog.isNumber(column) ? data.getFormattedValue(row, column) : "";
};
gviz.predefined.fillFromTop = function(data, row, options) {
  var column = options.sourceColumn;
  return goog.isNumber(column) ? google.visualization.datautils.findNonNullValueInColumn(data, row, column, !0) : null;
};
gviz.predefined.fillFromBottom = function(data, row, options) {
  var column = options.sourceColumn;
  return goog.isNumber(column) ? google.visualization.datautils.findNonNullValueInColumn(data, row, column, !1) : null;
};
gviz.predefined.identity = function(data, row, options) {
  var column = options.sourceColumn;
  return goog.isNumber(column) ? data.getValue(row, column) : null;
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/dataview.js)
google.visualization.DataView = function(dataTable) {
  google.visualization.IDataTable.call(this);
  this.dataTable_ = dataTable;
  for (var colIndices = [], numCols = dataTable.getNumberOfColumns(), c = 0;c < numCols;c++) {
    colIndices.push(c);
  }
  this.columns_ = colIndices;
  this.isAllRows_ = !0;
  this.rowIndices_ = null;
  this.calcColumnsCache_ = [];
  this.cacheIsDirty_ = !0;
};
goog.inherits(google.visualization.DataView, google.visualization.IDataTable);
google.visualization.DataView.prototype.getDataTable = function() {
  return this.dataTable_;
};
google.visualization.DataView.prototype.normalizeColumns_ = function(data, columns) {
  for (var i = 0;i < columns.length;i++) {
    var column = columns[i];
    if (goog.isString(column)) {
      columns[i] = this.getColumnIndex(column);
    } else {
      if (goog.isObject(column)) {
        columns[i] = column = goog.object.unsafeClone(column);
        var role = column.role;
        if (role) {
          var properties = column.properties || {};
          properties.role = role;
          column.properties = properties;
        }
        var sourceColumn = column.sourceColumn;
        goog.isString(sourceColumn) && (sourceColumn = column.sourceColumn = this.getColumnIndex(sourceColumn));
        goog.isNumber(sourceColumn) && (google.visualization.datautils.validateColumnIndex(data, sourceColumn), column.calc = column.calc || "identity", column.type = column.type || data.getColumnType(sourceColumn));
      }
    }
  }
  return columns;
};
google.visualization.DataView.prototype.resetCalcColumnsCache_ = function() {
  for (var i = 0;i < this.columns_.length;i++) {
    var col = this.columns_[i];
    goog.isObject(col) && (this.calcColumnsCache_[i] = []);
  }
  this.cacheIsDirty_ = !1;
};
google.visualization.DataView.prototype.invalidateCalcColumnsCache_ = function() {
  this.cacheIsDirty_ = !0;
  this.invalidateColumnRefMap();
};
google.visualization.DataView.prototype.initRowIndices_ = function() {
  for (var rowIndices = [], numRows = this.dataTable_.getNumberOfRows(), r = 0;r < numRows;r++) {
    rowIndices.push(r);
  }
  this.rowIndices_ = rowIndices;
  this.invalidateCalcColumnsCache_();
};
google.visualization.DataView.prototype.setColumns = function(columns) {
  google.visualization.datautils.validateColumnSet(this.dataTable_, goog.object.getKeys(google.visualization.DataView.FUNCTIONS_), columns);
  this.columns_ = this.normalizeColumns_(this.dataTable_, columns);
  this.invalidateCalcColumnsCache_();
};
google.visualization.DataView.prototype.standardizeRowIndices_ = function(arg0, opt_arg1) {
  if (goog.isArray(arg0)) {
    if (goog.isDef(opt_arg1)) {
      throw Error("If the first parameter is an array, no second parameter is expected");
    }
    for (var i = 0;i < arg0.length;i++) {
      google.visualization.datautils.validateRowIndex(this.dataTable_, arg0[i]);
    }
    return goog.array.clone(arg0);
  }
  if ("number" == goog.typeOf(arg0)) {
    if ("number" == !goog.typeOf(opt_arg1)) {
      throw Error("If first parameter is a number, second parameter must be specified and be a number.");
    }
    if (arg0 > opt_arg1) {
      throw Error("The first parameter (min) must be smaller than or equal to the second parameter (max).");
    }
    google.visualization.datautils.validateRowIndex(this.dataTable_, arg0);
    google.visualization.datautils.validateRowIndex(this.dataTable_, opt_arg1);
    for (var result = [], i = arg0;i <= opt_arg1;i++) {
      result.push(i);
    }
    return result;
  }
  throw Error("First parameter must be a number or an array.");
};
google.visualization.DataView.prototype.setRows = function(arg0, opt_arg1) {
  this.rowIndices_ = this.standardizeRowIndices_(arg0, opt_arg1);
  this.isAllRows_ = !1;
  this.invalidateCalcColumnsCache_();
};
google.visualization.DataView.prototype.getViewColumns = function() {
  var cols = goog.object.unsafeClone(this.columns_);
  return cols;
};
google.visualization.DataView.prototype.getViewRows = function() {
  if (this.isAllRows_) {
    for (var result = [], numRows = this.dataTable_.getNumberOfRows(), i = 0;i < numRows;i++) {
      result.push(i);
    }
    return result;
  }
  return goog.array.clone(this.rowIndices_);
};
google.visualization.DataView.prototype.hideColumns = function(colIndices) {
  this.setColumns(goog.array.filter(this.columns_, function(e) {
    return!goog.array.contains(colIndices, e);
  }));
  this.invalidateCalcColumnsCache_();
};
google.visualization.DataView.prototype.hideRows = function(arg0, opt_arg1) {
  var rowIndices = this.standardizeRowIndices_(arg0, opt_arg1);
  this.isAllRows_ && (this.initRowIndices_(), this.isAllRows_ = !1);
  this.setRows(goog.array.filter(this.rowIndices_, function(e) {
    return!goog.array.contains(rowIndices, e);
  }));
  this.invalidateCalcColumnsCache_();
};
google.visualization.DataView.prototype.getViewColumnIndex = function(tableColumnIndex) {
  for (var i = 0;i < this.columns_.length;i++) {
    var column = this.columns_[i];
    if (column == tableColumnIndex || goog.isObject(column) && column.sourceColumn == tableColumnIndex) {
      return i;
    }
  }
  return-1;
};
google.visualization.DataView.prototype.getViewRowIndex = function(tableRowIndex) {
  return this.isAllRows_ ? 0 > tableRowIndex || tableRowIndex >= this.dataTable_.getNumberOfRows() ? -1 : tableRowIndex : goog.array.indexOf(this.rowIndices_, tableRowIndex);
};
google.visualization.DataView.prototype.getTableColumnIndex = function(viewColumnIndex) {
  google.visualization.datautils.validateColumnIndex(this, viewColumnIndex);
  var col = this.columns_[viewColumnIndex];
  return goog.isNumber(col) ? col : goog.isObject(col) && goog.isNumber(col.sourceColumn) ? col.sourceColumn : -1;
};
google.visualization.DataView.prototype.getUnderlyingTableColumnIndex = function(viewColumnIndex) {
  var columnIndex = this.getTableColumnIndex(viewColumnIndex);
  return-1 == columnIndex ? columnIndex : columnIndex = this.dataTable_.getUnderlyingTableColumnIndex(columnIndex);
};
google.visualization.DataView.prototype.getTableRowIndex = function(viewRowIndex) {
  google.visualization.datautils.validateRowIndex(this, viewRowIndex);
  return this.isAllRows_ ? viewRowIndex : this.rowIndices_[viewRowIndex];
};
google.visualization.DataView.prototype.getUnderlyingTableRowIndex = function(viewRowIndex) {
  var rowIndex = this.getTableRowIndex(viewRowIndex);
  return rowIndex = this.dataTable_.getUnderlyingTableRowIndex(rowIndex);
};
google.visualization.DataView.prototype.getNumberOfRows = function() {
  return this.isAllRows_ ? this.dataTable_.getNumberOfRows() : this.rowIndices_.length;
};
google.visualization.DataView.prototype.getNumberOfColumns = function() {
  return this.columns_.length;
};
google.visualization.DataView.prototype.getColumnId = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var col = this.columns_[columnIndex];
  return goog.isNumber(col) ? this.dataTable_.getColumnId(col) : col.id || "";
};
google.visualization.DataView.prototype.getColumnLabel = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var col = this.columns_[columnIndex];
  return goog.isNumber(col) ? this.dataTable_.getColumnLabel(col) : col.label || "";
};
google.visualization.DataView.prototype.getColumnPattern = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var col = this.columns_[columnIndex];
  return goog.isNumber(col) ? this.dataTable_.getColumnPattern(col) : null;
};
google.visualization.DataView.prototype.getColumnRole = function(columnIndex) {
  var role = this.getColumnProperty(columnIndex, "role");
  return role = goog.isString(role) ? role : "";
};
google.visualization.DataView.prototype.getColumnType = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var col = this.columns_[columnIndex];
  return goog.isNumber(col) ? this.dataTable_.getColumnType(col) : col.type;
};
google.visualization.DataView.prototype.calcCell_ = function(innerRowIndex, columnIndex) {
  this.cacheIsDirty_ && this.resetCalcColumnsCache_();
  var cachedCell = this.calcColumnsCache_[columnIndex][innerRowIndex];
  if (goog.isDef(cachedCell)) {
    return cachedCell;
  }
  var retCell = null, col = this.columns_[columnIndex], calc = col.calc;
  goog.isString(calc) ? (calc = google.visualization.DataView.FUNCTIONS_[calc], retCell = calc(this.dataTable_, innerRowIndex, col)) : goog.isFunction(calc) && (retCell = calc.call(null, this.dataTable_, innerRowIndex));
  retCell = google.visualization.datautils.parseCell(retCell);
  this.validateCellType_(retCell, col.type);
  return this.calcColumnsCache_[columnIndex][innerRowIndex] = retCell;
};
google.visualization.DataView.prototype.validateCellType_ = function(cell, columnType) {
  var value = cell.v;
  if (goog.string.isEmptySafe(columnType)) {
    throw Error('"type" must be specified');
  }
  if (!google.visualization.datautils.checkValueType(value, columnType)) {
    throw Error("Type mismatch. Value " + value + " does not match type " + columnType);
  }
};
google.visualization.DataView.prototype.getCell_ = function(rowIndex, columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var col = this.columns_[columnIndex], cell = null, innerRowIndex = this.getTableRowIndex(rowIndex);
  if (goog.isObject(col)) {
    cell = this.calcCell_(innerRowIndex, columnIndex), cell.p = goog.isObject(cell.p) ? cell.p : {};
  } else {
    if (goog.isNumber(col)) {
      cell = {v:this.dataTable_.getValue(innerRowIndex, col), f:null, p:null};
    } else {
      throw Error("Invalid column definition: " + cell);
    }
  }
  return cell;
};
google.visualization.DataView.prototype.getValue = function(rowIndex, columnIndex) {
  return this.getCell_(rowIndex, columnIndex).v;
};
google.visualization.DataView.prototype.getFormattedValue = function(rowIndex, columnIndex) {
  var cell = this.getCell_(rowIndex, columnIndex);
  if (!goog.isDefAndNotNull(cell.f)) {
    var col = this.columns_[columnIndex];
    if (goog.isObject(col)) {
      var type = this.getColumnType(columnIndex);
      cell.f = null != cell.v ? google.visualization.datautils.getDefaultFormattedValue(cell.v, type) : "";
    } else {
      if (goog.isNumber(col)) {
        var innerRowIndex = this.getTableRowIndex(rowIndex);
        cell.f = this.dataTable_.getFormattedValue(innerRowIndex, col);
      }
    }
  }
  return cell.f;
};
google.visualization.DataView.prototype.getProperty = function(rowIndex, columnIndex, property) {
  var res = this.getProperties(rowIndex, columnIndex)[property];
  return goog.isDef(res) ? res : null;
};
google.visualization.DataView.prototype.getProperties = function(rowIndex, columnIndex) {
  var cell = this.getCell_(rowIndex, columnIndex);
  if (!cell.p) {
    var innerRowIndex = this.getTableRowIndex(rowIndex), innerColIndex = this.getTableColumnIndex(columnIndex);
    return this.dataTable_.getProperties(innerRowIndex, innerColIndex);
  }
  return cell.p;
};
google.visualization.DataView.prototype.getColumnProperty = function(columnIndex, property) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var col = this.columns_[columnIndex];
  return goog.isNumber(col) ? this.dataTable_.getColumnProperty(col, property) : this.getColumnProperties(columnIndex)[property] || null;
};
google.visualization.DataView.prototype.getColumnProperties = function(columnIndex) {
  google.visualization.datautils.validateColumnIndex(this, columnIndex);
  var col = this.columns_[columnIndex];
  return goog.isNumber(col) ? this.dataTable_.getColumnProperties(col) : col.properties || {};
};
google.visualization.DataView.prototype.getTableProperty = function(property) {
  return this.dataTable_.getTableProperty(property);
};
google.visualization.DataView.prototype.getTableProperties = function() {
  return this.dataTable_.getTableProperties();
};
google.visualization.DataView.prototype.getRowProperty = function(rowIndex, property) {
  var innerRowIndex = this.getTableRowIndex(rowIndex);
  return this.dataTable_.getRowProperty(innerRowIndex, property);
};
google.visualization.DataView.prototype.getRowProperties = function(rowIndex) {
  google.visualization.datautils.validateRowIndex(this, rowIndex);
  var innerRowIndex = this.getTableRowIndex(rowIndex);
  return this.dataTable_.getRowProperties(innerRowIndex);
};
google.visualization.DataView.prototype.getColumnRange = function(columnIndex) {
  return google.visualization.datautils.getColumnRange(this, columnIndex);
};
google.visualization.DataView.prototype.getDistinctValues = function(columnIndex) {
  return google.visualization.datautils.getDistinctValues(this, columnIndex);
};
google.visualization.DataView.prototype.getSortedRows = function(sortColumns) {
  return google.visualization.datautils.getSortedRows(this, sortColumns);
};
google.visualization.DataView.prototype.getFilteredRows = function(columnFilters) {
  return google.visualization.datautils.getFilteredRows(this, columnFilters);
};
google.visualization.DataView.prototype.toDataTable = function() {
  var dataTable = this.dataTable_;
  goog.isFunction(dataTable.toDataTable) && (dataTable = dataTable.toDataTable());
  var result = dataTable.toPOJO(), numberOfColumns = this.getNumberOfColumns(), numberOfRows = this.getNumberOfRows(), toColumnIndex, toRowIndex, viewColumn, columns = [], rows = [];
  for (toColumnIndex = 0;toColumnIndex < numberOfColumns;toColumnIndex++) {
    viewColumn = this.columns_[toColumnIndex];
    var columnSpecification;
    if (goog.isObject(viewColumn)) {
      columnSpecification = goog.object.clone(viewColumn), delete columnSpecification.calc, delete columnSpecification.sourceColumn;
    } else {
      if (goog.isNumber(viewColumn)) {
        columnSpecification = result.cols[viewColumn];
      } else {
        throw Error("Invalid DataView column type.");
      }
    }
    columns.push(columnSpecification);
  }
  for (toRowIndex = 0;toRowIndex < numberOfRows;toRowIndex++) {
    var fromRowIndex = this.isAllRows_ ? toRowIndex : this.rowIndices_[toRowIndex], row = result.rows[fromRowIndex], cells = [];
    for (toColumnIndex = 0;toColumnIndex < numberOfColumns;toColumnIndex++) {
      viewColumn = this.columns_[toColumnIndex];
      var cell;
      if (goog.isObject(viewColumn)) {
        cell = {v:this.getValue(toRowIndex, toColumnIndex)};
      } else {
        if (goog.isNumber(viewColumn)) {
          cell = row.c[this.columns_[toColumnIndex]];
        } else {
          throw Error("Invalid DataView column type.");
        }
      }
      cells.push(cell);
    }
    row.c = cells;
    rows.push(row);
  }
  result.cols = columns;
  result.rows = rows;
  return result = new google.visualization.DataTable(result);
};
google.visualization.DataView.prototype.toPOJO = function() {
  for (var ret = {}, cols = [], i = 0;i < this.columns_.length;i++) {
    var col = this.columns_[i];
    goog.isObject(col) && !goog.isString(col.calc) || cols.push(col);
  }
  goog.array.isEmpty(cols) || (ret.columns = cols);
  this.isAllRows_ || (ret.rows = goog.array.clone(this.rowIndices_));
  return ret;
};
google.visualization.DataView.prototype.toJSON = function() {
  return gviz.json.serialize(this.toPOJO());
};
google.visualization.DataView.fromJSON = function(data, viewAsJson) {
  goog.isString(viewAsJson) && (viewAsJson = gviz.json.deserialize(viewAsJson));
  var view = new google.visualization.DataView(data), columns = viewAsJson.columns, rows = viewAsJson.rows;
  goog.isDefAndNotNull(columns) && view.setColumns(columns);
  goog.isDefAndNotNull(rows) && view.setRows(rows);
  return view;
};
google.visualization.DataView.FUNCTIONS_ = {emptyString:gviz.predefined.emptyString, error:gviz.predefined.error, stringify:gviz.predefined.stringify, fillFromTop:gviz.predefined.fillFromTop, fillFromBottom:gviz.predefined.fillFromBottom, identity:gviz.predefined.identity};
// INPUT (javascript/gviz/devel/jsapi/common/error-handler.js)
gviz.ErrorHandler = function(visualization, container, opt_createFloatingDiv) {
  this.visualization_ = visualization;
  this.container_ = container;
  var computedPosition = goog.style.getComputedPosition(container);
  "" != computedPosition && "static" != computedPosition || goog.style.setStyle(container, "position", "relative");
  this.errorDiv_ = null;
  var createFloatingDiv = !!opt_createFloatingDiv;
  createFloatingDiv && (this.errorDiv_ = goog.dom.createDom("div", {style:"position: absolute; top: 0; left: 0; z-index: 1;"}));
};
gviz.ErrorHandler.prototype.getTargetElement_ = function() {
  return this.errorDiv_ ? (this.errorDiv_.parentNode != this.container_ && goog.dom.appendChild(this.container_, this.errorDiv_), this.errorDiv_) : this.container_;
};
gviz.ErrorHandler.prototype.addError = function(message) {
  this.addMessage_(message, "error");
};
gviz.ErrorHandler.prototype.addWarning = function(message) {
  this.addMessage_(message, "warning");
};
gviz.ErrorHandler.prototype.addMessage_ = function(message, type) {
  var element = this.getTargetElement_(), errorOptions = {removable:!0, type:type}, id = google.visualization.errors.addError(element, message, null, errorOptions), eventOptions = {id:id, message:message, detailedMessage:"", options:errorOptions};
  google.visualization.events.trigger(this.visualization_, "error", eventOptions);
};
gviz.ErrorHandler.prototype.removeAll = function() {
  var element = this.getTargetElement_();
  google.visualization.errors.removeAll(element);
};
gviz.ErrorHandler.prototype.safeExecute = function(func, opt_obj) {
  if (goog.DEBUG) {
    return func.call(opt_obj);
  }
  try {
    return func.call(opt_obj);
  } catch (e) {
    this.addError(e.message);
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/async-helper.js)
gviz.AsyncHelper = function(errorHandler) {
  this.errorHandler_ = errorHandler;
  this.isCanceled_ = !1;
};
gviz.AsyncHelper.prototype.wrapCallback = function(func, opt_obj) {
  return goog.bind(function() {
    if (!this.isCanceled_) {
      var args = arguments;
      this.errorHandler_.safeExecute(function() {
        func.apply(opt_obj, args);
      });
    }
  }, this);
};
gviz.AsyncHelper.prototype.cancelPendingCallbacks = function() {
  this.isCanceled_ = !0;
};
// INPUT (javascript/gviz/devel/jsapi/common/abstract-visualization.js)
google.visualization.AbstractVisualization = function(container) {
  goog.Disposable.call(this);
  this.container = gviz.util.VisCommon.validateContainer(container);
  this.errorHandler = new gviz.ErrorHandler(this, this.container);
  this.asyncHelper_ = null;
  this.fontWaitResolver = this.maybeCreateResolver();
};
goog.inherits(google.visualization.AbstractVisualization, goog.Disposable);
google.visualization.AbstractVisualization.prototype.getContainer = function() {
  return this.container;
};
google.visualization.AbstractVisualization.prototype.maybeCreateResolver = function() {
  return goog.Promise.withResolver();
};
google.visualization.AbstractVisualization.prototype.draw = function(dataTable, opt_options, opt_state) {
  this.errorHandler.safeExecute(goog.bind(function() {
    this.draw_(dataTable, opt_options, opt_state);
  }, this));
};
google.visualization.AbstractVisualization.prototype.draw_ = function(dataTable, opt_options, opt_state) {
  if (!dataTable) {
    throw Error("Data table is not defined.");
  }
  if (!goog.isFunction(dataTable.getTableProperties)) {
    var whatIsIt = "the wrong type of data";
    goog.isArray(dataTable) ? whatIsIt = "an Array" : goog.isString(dataTable) && (whatIsIt = "a String");
    throw Error("You called the draw() method with " + whatIsIt + " rather than a DataTable or DataView");
  }
  this.fontWaitResolver && this.fontWaitResolver.promise.cancel();
  this.fontWaitResolver = this.maybeCreateResolver();
  this.asyncHelper_ && this.asyncHelper_.cancelPendingCallbacks();
  this.asyncHelper_ = new gviz.AsyncHelper(this.errorHandler);
  var asyncWrapper = goog.bind(this.asyncHelper_.wrapCallback, this.asyncHelper_);
  this.drawInternal(asyncWrapper, dataTable, opt_options, opt_state);
};
google.visualization.AbstractVisualization.prototype.clearChart = function() {
  this.asyncHelper_ && (this.asyncHelper_.cancelPendingCallbacks(), this.asyncHelper_ = null);
  this.fontWaitResolver && this.fontWaitResolver.promise && (this.fontWaitResolver.promise.cancel(), this.fontWaitResolver = null);
  this.clearInternal();
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/querywrapper.js)
google.visualization.QueryWrapper = function(query, abstractVisualization, options, container) {
  this.query_ = query;
  this.visualization_ = abstractVisualization;
  this.options_ = options || {};
  this.container_ = container;
  this.errorHandler_ = null;
  container && (this.errorHandler_ = this.defaultErrorHandler_ = gviz.coreutils.getDefaultResponseValidator(container));
  if (!(abstractVisualization && "draw" in abstractVisualization) || "function" != typeof abstractVisualization.draw) {
    throw Error("Visualization must have a draw method.");
  }
};
google.visualization.QueryWrapper.prototype.defaultErrorHandler_ = null;
google.visualization.QueryWrapper.prototype.customResponseHandler_ = null;
google.visualization.QueryWrapper.prototype.customPostResponseHandler_ = null;
google.visualization.QueryWrapper.prototype.dataTable_ = null;
google.visualization.QueryWrapper.prototype.setOptions = function(options) {
  this.options_ = options || {};
};
google.visualization.QueryWrapper.prototype.draw = function() {
  this.dataTable_ && this.visualization_.draw(this.dataTable_, this.options_);
};
google.visualization.QueryWrapper.prototype.setCustomErrorHandler = function(customErrorHandler) {
  var container = this.container_;
  this.errorHandler_ = customErrorHandler ? customErrorHandler : container ? this.errorHandler_ = this.defaultErrorHandler_ : null;
};
google.visualization.QueryWrapper.prototype.sendAndDraw = function() {
  if (!this.errorHandler_) {
    throw Error("If no container was supplied, a custom error handler must be supplied instead.");
  }
  var query = this.query_, self = this;
  query.send(function(response) {
    var customResponseHandler = self.customResponseHandler_;
    customResponseHandler && customResponseHandler(response);
    self.handleResponse_(response);
    var customPostResponseHandler = self.customPostResponseHandler_;
    customPostResponseHandler && customPostResponseHandler(response);
  });
};
google.visualization.QueryWrapper.prototype.handleResponse_ = function(response) {
  var nonNullErrorHandler = this.errorHandler_;
  nonNullErrorHandler(response) && (this.dataTable_ = response.getDataTable(), this.visualization_.draw(this.dataTable_, this.options_));
};
google.visualization.QueryWrapper.prototype.setCustomResponseHandler = function(handler) {
  if (null != handler) {
    if ("function" != typeof handler) {
      throw Error("Custom response handler must be a function.");
    }
    this.customResponseHandler_ = handler;
  }
};
google.visualization.QueryWrapper.prototype.setCustomPostResponseHandler = function(handler) {
  if (null != handler) {
    if ("function" != typeof handler) {
      throw Error("Custom post response handler must be a function.");
    }
    this.customPostResponseHandler_ = handler;
  }
};
google.visualization.QueryWrapper.prototype.abort = function() {
  this.query_.abort();
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/customquery.js)
google.visualization.CustomQuery = function(requestHandler, dataSourceUrl) {
  this.dataSourceUrl_ = dataSourceUrl;
  this.requestHandler_ = requestHandler;
};
google.visualization.CustomQuery.prototype.send = function(responseHandler) {
  this.responseHandler = responseHandler;
  this.sendQuery_();
};
google.visualization.CustomQuery.prototype.addModifiersToUrl_ = function(url) {
  var parametersToAdd = {}, additionalParameters, signature = this.lastSignature_;
  signature && (additionalParameters = "sig:" + signature);
  additionalParameters && (parametersToAdd.tqx = additionalParameters, url = google.visualization.Query.overrideUrlParameters(url, parametersToAdd));
  return url;
};
google.visualization.CustomQuery.prototype.sendQuery_ = function() {
  var url = this.addModifiersToUrl_(this.dataSourceUrl_);
  this.requestHandler_.call(this, goog.bind(this.handleResponse_, this), url);
};
google.visualization.CustomQuery.prototype.handleResponse_ = function(responseObj) {
  var queryResponse = new google.visualization.QueryResponse(responseObj);
  if (!queryResponse.containsReason("not_modified")) {
    this.lastSignature_ = queryResponse.isError() ? null : queryResponse.getDataSignature();
    var responseHandler = this.responseHandler;
    responseHandler.call(responseHandler, queryResponse);
  }
};
// INPUT (javascript/gviz/devel/jsapi/packages/core/parsedquery.js)
gviz.ParsedQuery = function(parsedQueryObj) {
  this.table_ = parsedQueryObj.table || null;
  this.selection_ = parsedQueryObj.selection || null;
  this.group_ = parsedQueryObj.group || null;
  this.options_ = parsedQueryObj.options || null;
  this.labels_ = parsedQueryObj.labels || null;
  this.format_ = parsedQueryObj.format || null;
};
gviz.ParsedQuery.Column = function(columnObj) {
  this.columnId_ = columnObj.columnId;
};
gviz.ParsedQuery.Column.AggregationType = {SUM:"sum", COUNT:"count", MIN:"min", MAX:"max", AVG:"avg"};
gviz.ParsedQuery.Column.prototype.getColumnId = function() {
  return this.columnId_;
};
gviz.ParsedQuery.prototype.getTable = function() {
  return this.table_;
};
gviz.ParsedQuery.prototype.getSelection = function() {
  return this.selection_;
};
gviz.ParsedQuery.prototype.getOptions = function() {
  return this.options_;
};
gviz.ParsedQuery.prototype.getLabels = function() {
  return this.labels_;
};
gviz.ParsedQuery.prototype.getFormat = function() {
  return this.format_;
};
// INPUT (javascript/closure/structs/queue.js)
goog.structs.Queue = function() {
  this.front_ = [];
  this.back_ = [];
};
goog.structs.Queue.prototype.maybeFlip_ = function() {
  goog.array.isEmpty(this.front_) && (this.front_ = this.back_, this.front_.reverse(), this.back_ = []);
};
goog.structs.Queue.prototype.enqueue = function(element) {
  this.back_.push(element);
};
goog.structs.Queue.prototype.dequeue = function() {
  this.maybeFlip_();
  return this.front_.pop();
};
goog.structs.Queue.prototype.peek = function() {
  this.maybeFlip_();
  return goog.array.peek(this.front_);
};
goog.structs.Queue.prototype.getCount = function() {
  return this.front_.length + this.back_.length;
};
goog.structs.Queue.prototype.isEmpty = function() {
  return goog.array.isEmpty(this.front_) && goog.array.isEmpty(this.back_);
};
goog.structs.Queue.prototype.clear = function() {
  this.front_ = [];
  this.back_ = [];
};
goog.structs.Queue.prototype.contains = function(obj) {
  return goog.array.contains(this.front_, obj) || goog.array.contains(this.back_, obj);
};
goog.structs.Queue.prototype.remove = function(obj) {
  var index = goog.array.lastIndexOf(this.front_, obj);
  if (0 > index) {
    return goog.array.remove(this.back_, obj);
  }
  goog.array.removeAt(this.front_, index);
  return!0;
};
goog.structs.Queue.prototype.getValues = function() {
  for (var res = [], i = this.front_.length - 1;0 <= i;--i) {
    res.push(this.front_[i]);
  }
  for (var len = this.back_.length, i = 0;i < len;++i) {
    res.push(this.back_[i]);
  }
  return res;
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/batchgeocoder.js)
gviz.util.BatchGeocoder = function() {
  this.logger_ = goog.log.getLogger("gviz.util.BatchGeocoder", goog.debug.Logger.Level.ALL);
  if (!goog.getObjectByName("google.maps.Geocoder")) {
    throw Error("your page is missing the google maps API");
  }
  this.geocoder_ = new google.maps.Geocoder;
  this.cache_ = {};
  this.cache_[goog.json.serialize({address:""})] = {response:[], status:google.maps.GeocoderStatus.ZERO_RESULTS};
  this.activeRequests_ = new goog.structs.Set;
  this.requestHandlerMap_ = new goog.structs.Map;
  this.pendingRequests_ = new goog.structs.Queue;
};
goog.addSingletonGetter(gviz.util.BatchGeocoder);
gviz.util.BatchGeocoder.MAX_REQUESTS = 400;
gviz.util.BatchGeocoder.BatchRequest = function(requests, callback, opt_batchSize) {
  this.requests_ = requests || [];
  this.requestPointer_ = 0;
  this.callback_ = callback;
  this.cancelled_ = !1;
  this.responses_ = new goog.structs.Map;
  this.batchSize_ = opt_batchSize || this.requests_.length;
};
gviz.util.BatchGeocoder.BatchRequest.prototype.getRequests = function() {
  return this.requests_;
};
gviz.util.BatchGeocoder.BatchRequest.prototype.isCancelled = function() {
  return this.cancelled_;
};
gviz.util.BatchGeocoder.BatchRequest.prototype.cancel = function() {
  this.cancelled_ = !0;
};
gviz.util.BatchGeocoder.BatchRequest.prototype.finish = function(request, response) {
  var serializedRequest = goog.json.serialize(request);
  this.responses_.containsKey(serializedRequest) || this.responses_.set(serializedRequest, response);
  var batchedResponses = [];
  if (!this.cancelled_) {
    for (var size = this.requests_.length, i = this.requestPointer_;i < size;i++) {
      var addr = goog.json.serialize(this.requests_[i]);
      if (!this.responses_.containsKey(addr)) {
        break;
      }
      var res = this.responses_.get(addr);
      goog.isDefAndNotNull(res) && (res = res.response);
      batchedResponses.push(res);
    }
    batchedResponses.length < this.batchSize_ && this.requestPointer_ + batchedResponses.length < size || (this.requestPointer_ += batchedResponses.length, this.callback_(batchedResponses), this.requestPointer_ >= this.requests_.length && this.cancel());
  }
};
gviz.util.BatchGeocoder.RequestGroup = function() {
  this.requests_ = [];
  this.geocoder_ = null;
};
gviz.util.BatchGeocoder.RequestGroup.prototype.add = function(request) {
  this.requests_.push(request);
};
gviz.util.BatchGeocoder.RequestGroup.prototype.create = function(requests, callback, opt_batchSize) {
  if (goog.isDefAndNotNull(this.geocoder_)) {
    var request = new gviz.util.BatchGeocoder.BatchRequest(requests, callback, opt_batchSize);
    this.add(request);
    this.geocoder_.geocode(request);
  } else {
    gviz.util.VisCommon.loadMapsApi(goog.bind(function() {
      goog.isDefAndNotNull(this.geocoder_) || (this.geocoder_ = gviz.util.BatchGeocoder.getInstance());
      this.create(requests, callback, opt_batchSize);
    }, this));
  }
};
gviz.util.BatchGeocoder.RequestGroup.prototype.cancel = function() {
  goog.array.forEach(this.requests_, function(request) {
    request.cancel();
  });
  this.requests_ = [];
};
gviz.util.BatchGeocoder.prototype.geocode = function(request) {
  var addresses = request.getRequests();
  goog.array.forEach(addresses, goog.bind(function(address) {
    var serializedAddress = goog.json.serialize(address);
    if (serializedAddress in this.cache_) {
      var response = this.cache_[serializedAddress];
      request.finish(address, response);
    } else {
      this.requestHandlerMap_.containsKey(serializedAddress) || (this.pendingRequests_.enqueue(address), this.requestHandlerMap_.set(serializedAddress, [])), this.requestHandlerMap_.get(serializedAddress).push(request);
    }
  }, this));
  this.geocodeNextRequest_();
};
gviz.util.BatchGeocoder.prototype.geocodeNextRequest_ = function() {
  if (0 !== this.pendingRequests_.getCount() || 0 !== this.activeRequests_.getCount()) {
    var address = 0 < this.activeRequests_.getCount() ? goog.json.parse(this.activeRequests_.getValues()[0]) : this.pendingRequests_.peek(), serializedAddress = goog.json.serialize(address);
    if (serializedAddress in this.cache_) {
      var requests = this.requestHandlerMap_.get(serializedAddress), response = this.cache_[serializedAddress];
      this.pendingRequests_.dequeue();
      this.handleRequestResolved_(address, response.response, response.status);
      this.requestHandlerMap_.remove(serializedAddress);
    } else {
      0 === this.activeRequests_.getCount() && 0 < this.pendingRequests_.getCount() ? (this.pendingRequests_.dequeue(), requests = this.requestHandlerMap_.get(serializedAddress), goog.array.every(requests, function(request) {
        return request.isCancelled();
      }) ? this.handleRequestResolved_(address, null, null) : (this.activeRequests_.add(serializedAddress), this.doGeocode_(address, goog.bind(this.handleRequestResolved_, this, address)))) : 0 < this.activeRequests_.getCount() && this.doGeocode_(address, goog.bind(this.handleRequestResolved_, this, address));
    }
  }
};
gviz.util.BatchGeocoder.prototype.doGeocode_ = function(address, callback) {
  if (goog.isObject(address) && (address = goog.object.unsafeClone(address), address.bounds)) {
    var bounds = address.bounds;
    address.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.lo.lat, bounds.lo.lng), new google.maps.LatLng(bounds.hi.lat, bounds.hi.lng));
  }
  this.geocoder_.geocode(address, callback);
};
gviz.util.BatchGeocoder.prototype.completeRequest_ = function(request, response) {
  var serializedRequest = goog.json.serialize(request), requests = this.requestHandlerMap_.get(serializedRequest);
  goog.isDefAndNotNull(requests) && goog.array.forEach(requests, function(req) {
    req.isCancelled() || req.finish(request, response);
  });
  this.activeRequests_.remove(serializedRequest);
  this.requestHandlerMap_.remove(serializedRequest);
};
gviz.util.BatchGeocoder.prototype.handleRequestResolved_ = function(request, response, status) {
  var delay = 0, requestType = request.latLng ? "latLng" : "address", requestString = request[requestType];
  if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
    goog.log.info(this.logger_, "query refused, retrying: " + requestString), delay = 520;
  } else {
    if (status == google.maps.GeocoderStatus.OK) {
      var serializedRequest = goog.json.serialize(request);
      goog.log.info(this.logger_, "Added " + serializedRequest + " to the cache.");
      var responseObject = {response:response, status:status};
      this.cache_[serializedRequest] = responseObject;
      var responseString = "address" == requestType ? response[0].geometry.location.toString() : response[0].formatted_address;
      goog.log.info(this.logger_, "geocoding response for " + requestString + ": " + responseString);
      this.completeRequest_(request, responseObject);
    } else {
      goog.log.warning(this.logger_, "error " + status + " in geocoding " + requestString), this.completeRequest_(request, {response:null, status:status});
    }
  }
  this.isCanceled_ = !1;
  goog.Timer.callOnce(goog.bind(this.geocodeNextRequest_, this), delay, this);
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/dataformat.js)
gviz.DataFormat = function() {
};
gviz.DataFormat.MAX_ROWS_FOR_DETECTION = 20;
gviz.DataFormat.MAX_ROWS_FOR_GEO_DETECTION = 10;
gviz.DataFormat.prototype.validateDataTable = function(dataTable) {
  if (!(goog.isObject(dataTable) && goog.isFunction(dataTable.getNumberOfColumns) && goog.isFunction(dataTable.getNumberOfRows))) {
    throw Error("Invalid data table.");
  }
};
gviz.DataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? Fitness.MEDIUM : Fitness.NONE;
};
gviz.DataFormat.prototype.isEnumLike = function(dataTable, column) {
  if (!this.matchType(dataTable, column, "string")) {
    return!1;
  }
  for (var set = {}, countDistinct = 0, n = Math.min(dataTable.getNumberOfRows(), gviz.DataFormat.MAX_ROWS_FOR_DETECTION), row = 0;row < n;row++) {
    var value = dataTable.getValue(row, column);
    set[value] || countDistinct++;
    set[value] = !0;
  }
  return 10 > countDistinct;
};
gviz.DataFormat.prototype.matchType = function(dataTable, index, type) {
  return dataTable.getNumberOfColumns() > index && type == dataTable.getColumnType(index);
};
gviz.DataFormat.prototype.matchTypes = function(dataTable, index, types) {
  for (var i = 0;i < types.length;i++) {
    if (this.matchType(dataTable, index, types[i])) {
      return!0;
    }
  }
  return!1;
};
gviz.DataFormat.prototype.indexOf = function(dataTable, type) {
  for (var i = 0;i < dataTable.getNumberOfColumns();i++) {
    if (dataTable.getColumnType(i) == type) {
      return i;
    }
  }
  return-1;
};
gviz.DataFormat.prototype.columnsTypesMatch = function(dataTable, columnNumbers, columnTypes) {
  goog.asserts.assert(columnNumbers.length == columnTypes.length);
  for (var i = 0;i < columnNumbers.length;++i) {
    var columnNumber = columnNumbers[i];
    if (columnNumber >= dataTable.getNumberOfColumns() || dataTable.getColumnType(columnNumber) != columnTypes[i]) {
      return!1;
    }
  }
  return!0;
};
gviz.DataFormat.prototype.checkPositiveColumn = function(dataTable, index) {
  return this.matchType(dataTable, index, "number") ? this.checkColumn(dataTable, index, function(value) {
    return 0 <= value;
  }) : !1;
};
gviz.DataFormat.prototype.checkColumn = function(dataTable, index, checkValue) {
  for (var numRows = Math.min(dataTable.getNumberOfRows(), gviz.DataFormat.MAX_ROWS_FOR_DETECTION), i = 0;i < numRows;i++) {
    var value = dataTable.getValue(i, index);
    if (null != value && !checkValue(value)) {
      return!1;
    }
  }
  return!0;
};
gviz.DataFormat.prototype.checkLatLng = function(dataTable, index, index2) {
  if (!this.matchType(dataTable, index, "number") || !this.matchType(dataTable, index2, "number")) {
    return!1;
  }
  var lat = goog.bind(this.checkLatValue_, this), lng = goog.bind(this.checkLngValue_, this);
  return this.checkColumn(dataTable, index, lat) && this.checkColumn(dataTable, index2, lng);
};
gviz.DataFormat.prototype.checkLatValue_ = function(value) {
  var markerRange = new goog.math.Range(-90, 90);
  return goog.math.Range.containsPoint(markerRange, value) && !goog.math.isInt(value);
};
gviz.DataFormat.prototype.checkLngValue_ = function(value) {
  var markerRange = new goog.math.Range(-180, 180);
  return goog.math.Range.containsPoint(markerRange, value) && !goog.math.isInt(value);
};
gviz.DataFormat.prototype.forEachColumn = function(view, handler) {
  for (var n = view.getNumberOfColumns(), i = 0;i < n;i++) {
    handler(i);
  }
};
gviz.DataFormat.prototype.hasParents = function(dataTable) {
  for (var nodes = dataTable.getDistinctValues(0), numRows = Math.min(dataTable.getNumberOfRows(), gviz.DataFormat.MAX_ROWS_FOR_DETECTION), parents = 0, i = 0;i < numRows;i++) {
    var value = dataTable.getValue(i, 1);
    value && !goog.array.contains(nodes, value) || parents++;
  }
  return.6 < parents / numRows;
};
gviz.DataFormat.Fitness = {HIGH:3, MEDIUM:2, LOW:1, NONE:0};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/nightingale/bar-dataformat.js)
gviz.nightingale = {};
gviz.nightingale.BarDataFormat = function() {
};
goog.inherits(gviz.nightingale.BarDataFormat, gviz.DataFormat);
gviz.nightingale.BarDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.nightingale.BarDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (2 > numCols) {
    throw Error("Invalid data table format: must have at least 2 columns.");
  }
  for (var first = !0, roles = [], i = 0;i < numCols;i++) {
    var role = dataTable.getColumnRole(i);
    goog.string.isEmpty(role) && (first ? (role = "domain", first = !1) : role = "data");
    roles.push(role);
  }
  if ("domain" !== roles[0]) {
    throw Error("Invalid data format: first column must be domain.");
  }
  var domainGroups = this.groupColumns(roles, ["domain", "data"]);
  return{roles:domainGroups.roles, domains:goog.array.map(domainGroups.groups, function(domainGroup) {
    return{domainColumn:domainGroup.column, roles:domainGroup.roles, series:goog.array.map(domainGroup.groups, function(dataGroup) {
      return{dataColumn:dataGroup.column, roles:dataGroup.roles};
    })};
  })};
};
gviz.nightingale.BarDataFormat.prototype.groupColumns = function(roles, hierarchyRoles) {
  for (var output = {groups:[], roles:{}}, path = [output], roleIndex = -1, columnIndex = 0;columnIndex < roles.length;columnIndex++) {
    var columnRole = roles[columnIndex], hierarchyRoleIndex = goog.array.indexOf(hierarchyRoles, columnRole), newGroup = null;
    0 <= hierarchyRoleIndex && (newGroup = {column:columnIndex, role:columnRole, groups:[], roles:{}});
    if (0 <= hierarchyRoleIndex && hierarchyRoleIndex < roleIndex) {
      for (var indexDifference = roleIndex - hierarchyRoleIndex, j = 0;j <= indexDifference;j++) {
        path.pop();
      }
      var roleIndex = hierarchyRoleIndex, lastPathItem = path[path.length - 1];
      path.push(newGroup);
      lastPathItem.groups.push(newGroup);
    } else {
      0 <= roleIndex && columnRole === hierarchyRoles[roleIndex] ? (path.pop(), lastPathItem = path[path.length - 1], path.push(newGroup), lastPathItem.groups.push(newGroup)) : roleIndex + 1 < hierarchyRoles.length && columnRole === hierarchyRoles[roleIndex + 1] ? (lastPathItem = path[path.length - 1], roleIndex++, path.push(newGroup), lastPathItem.groups.push(newGroup)) : (lastPathItem = path[path.length - 1], columnRole in lastPathItem.roles || (lastPathItem.roles[columnRole] = []), lastPathItem.roles[columnRole].push(columnIndex))
      ;
    }
  }
  return output;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/annotatedtimelinedataformat.js)
gviz.AnnotatedTimeLineDataFormat = function() {
};
goog.inherits(gviz.AnnotatedTimeLineDataFormat, gviz.DataFormat);
gviz.AnnotatedTimeLineDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var n = dataTable.getNumberOfColumns();
  if (2 > n) {
    return!1;
  }
  var first = dataTable.getColumnType(0);
  if ("date" != first && "datetime" != first) {
    return!1;
  }
  var second = dataTable.getColumnType(1);
  if ("number" != second) {
    return!1;
  }
  for (var consecutiveStringColumns = 0, i = 1;i < n;i++) {
    var type = dataTable.getColumnType(i);
    if ("number" == type) {
      consecutiveStringColumns = 0;
    } else {
      if ("string" == type) {
        if (consecutiveStringColumns++, 2 < consecutiveStringColumns) {
          return!1;
        }
      } else {
        return!1;
      }
    }
  }
  return!0;
};
gviz.AnnotatedTimeLineDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  if (!this.exactMatch(dataTable)) {
    return Fitness.NONE;
  }
  var goodDistribution = !1, hasAnnotations = 0 < this.indexOf(dataTable, "string"), numRows = dataTable.getNumberOfRows(), rowIndex = dataTable.getSortedRows(0);
  if (50 < numRows) {
    goodDistribution = !0;
  } else {
    for (var minDistance = Number.MAX_VALUE, maxDistance = Number.MIN_VALUE, i = 1;i < numRows;i++) {
      var dist = Math.abs(dataTable.getValue(rowIndex[i - 1], 0) - dataTable.getValue(rowIndex[i], 0)), minDistance = 0 < dist && dist < minDistance ? dist : minDistance, maxDistance = dist > maxDistance ? dist : maxDistance
    }
    goodDistribution = 0 != minDistance && 50 < maxDistance / minDistance ? !0 : !1;
  }
  return hasAnnotations && goodDistribution ? Fitness.HIGH : hasAnnotations || goodDistribution ? Fitness.MEDIUM : Fitness.LOW;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/corechartdataformat.js)
gviz.CoreChartDataFormat = function(opt_dataFormatOptions) {
  var dataFormatOptions = opt_dataFormatOptions || {};
  this.annotate_ = !!dataFormatOptions.annotate;
};
goog.inherits(gviz.CoreChartDataFormat, gviz.DataFormat);
gviz.CoreChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var i = 0, n = dataTable.getNumberOfColumns();
  if (1 > n) {
    return!1;
  }
  if (!this.matchType(dataTable, 0, "number") && (i++, this.annotate_)) {
    for (;i < n && this.matchType(dataTable, i, "string");) {
      i++;
    }
  }
  for (var series = null;i < n;) {
    var type = dataTable.getColumnType(i);
    if ("number" == type) {
      series = {};
    } else {
      if (this.annotate_ && "string" == type) {
        if (!series) {
          return!1;
        }
      } else {
        if ("boolean" == type) {
          if (!series || series.certainty) {
            return!1;
          }
          series.certainty = i;
        } else {
          return!1;
        }
      }
    }
    i++;
  }
  return!goog.isNull(series);
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/areachartdataformat.js)
gviz.AreaChartDataFormat = function(opt_dataFormatOptions) {
  this.isStacked_ = opt_dataFormatOptions && opt_dataFormatOptions.isStacked || !1;
  gviz.CoreChartDataFormat.call(this, opt_dataFormatOptions);
};
goog.inherits(gviz.AreaChartDataFormat, gviz.CoreChartDataFormat);
gviz.AreaChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  if (!gviz.AreaChartDataFormat.superClass_.exactMatch.call(this, dataTable)) {
    return!1;
  }
  var numCols = dataTable.getNumberOfColumns();
  if (this.isStacked_) {
    for (var i = 1;i < numCols;i++) {
      if (this.matchType(dataTable, i, "number") && !this.checkPositiveColumn(dataTable, i)) {
        return!1;
      }
    }
  }
  return!0;
};
gviz.AreaChartDataFormat.prototype.calculateFitness = function(dataTable) {
  for (var Fitness = gviz.DataFormat.Fitness, numCols = dataTable.getNumberOfColumns(), numRows = dataTable.getNumberOfRows(), numNumericCols = 0, hasNegativeValue = !1, i = 0;i < numCols;i++) {
    this.matchType(dataTable, i, "number") && (numNumericCols++, this.checkPositiveColumn(dataTable, i) || (hasNegativeValue = !0));
  }
  return this.exactMatch(dataTable) ? 1 == numRows || hasNegativeValue || this.matchType(dataTable, 0, "string") ? Fitness.LOW : 2 < numNumericCols && this.isStacked_ ? Fitness.HIGH : 1 != numNumericCols || this.isStacked_ ? Fitness.LOW : Fitness.MEDIUM : Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/bubblechartdataformat.js)
gviz.BubbleChartDataFormat = function() {
};
goog.inherits(gviz.BubbleChartDataFormat, gviz.DataFormat);
gviz.BubbleChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  return 3 > numCols || 5 < numCols || !this.matchType(dataTable, 0, "string") || !this.matchType(dataTable, 1, "number") || !this.matchType(dataTable, 2, "number") || 3 < numCols && !this.matchType(dataTable, 3, "string") || 4 < numCols && !this.matchType(dataTable, 4, "number") ? !1 : !0;
};
gviz.BubbleChartDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? this.isEnumLike(dataTable, 3) ? Fitness.HIGH : this.matchType(dataTable, 3, "string") ? Fitness.LOW : Fitness.MEDIUM : Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/bubblesdataformat.js)
gviz.BubblesDataFormat = function() {
};
goog.inherits(gviz.BubblesDataFormat, gviz.DataFormat);
gviz.BubblesDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.BubblesDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (2 !== numCols && 3 !== numCols) {
    throw Error("Invalid data table format: must have 2 or 3 columns.");
  }
  var nameCol = 1, valueCol = 2;
  2 === numCols && (nameCol--, valueCol--);
  this.verifyType_(dataTable, 0, "string");
  this.verifyType_(dataTable, nameCol, "string");
  this.verifyType_(dataTable, valueCol, "number");
  return{nameCol:nameCol, categoryCol:0, valueCol:valueCol};
};
gviz.BubblesDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  if (!this.matchType(dataTable, index, type)) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/fw/data/column-info.js)
gviz.fw = {};
gviz.fw.data = {};
gviz.fw.data.ColumnInfo = function(index) {
  this.index_ = index;
  this.roles_ = new goog.structs.Map;
};
gviz.fw.data.ColumnInfo.prototype.index = function() {
  return this.index_;
};
gviz.fw.data.ColumnInfo.prototype.addRoleColumn = function(role, index) {
  this.roles_.set(role, index);
};
gviz.fw.data.ColumnInfo.prototype.columnForRole = function(role) {
  return this.roles_.get(role);
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/calendardataformat.js)
gviz.CalendarDataFormat = function() {
};
goog.inherits(gviz.CalendarDataFormat, gviz.DataFormat);
gviz.CalendarDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.CalendarDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  for (var columnInfos = [], numCols = dataTable.getNumberOfColumns(), i = 0;i < numCols;++i) {
    var role = dataTable.getColumnRole(i);
    if ("" === role) {
      columnInfos.push(new gviz.fw.data.ColumnInfo(i));
    } else {
      if (1 > columnInfos.length) {
        throw Error("At least 1 data column must come before any role column.");
      }
      goog.array.peek(columnInfos).addRoleColumn(role, i);
    }
  }
  if (2 != columnInfos.length) {
    throw Error("Invalid data table format: must have 2 data columns.");
  }
  var dateCol = columnInfos[0], valueCol = columnInfos[1];
  this.verifyType_(dataTable, dateCol.index(), "date|datetime");
  this.verifyType_(dataTable, valueCol.index(), "number");
  return{dateCol:dateCol, valueCol:valueCol};
};
gviz.CalendarDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  var matches = goog.array.some(type.split("|"), function(t) {
    return this.matchType(dataTable, index, t);
  }, this);
  if (!matches) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/candlestickdataformat.js)
gviz.CandlestickDataFormat = function() {
};
goog.inherits(gviz.CandlestickDataFormat, gviz.DataFormat);
gviz.CandlestickDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (5 > numCols || 6 < numCols) {
    return!1;
  }
  var typesMatch = this.matchType(dataTable, 0, "string") && this.matchType(dataTable, 1, "number") && this.matchType(dataTable, 2, "number") && this.matchType(dataTable, 3, "number") && this.matchType(dataTable, 4, "number");
  if (!typesMatch || 6 == numCols && !this.matchType(dataTable, 5, "string")) {
    return!1;
  }
  for (var numRows = Math.min(dataTable.getNumberOfRows(), gviz.DataFormat.MAX_ROWS_FOR_DETECTION), i = 0;i < numRows;i++) {
    var low = dataTable.getValue(i, 1), open = dataTable.getValue(i, 2), close = dataTable.getValue(i, 3), high = dataTable.getValue(i, 4);
    if (low != Math.min(low, open, close, high) || high != Math.max(low, open, close, high)) {
      return!1;
    }
  }
  return!0;
};
gviz.CandlestickDataFormat.prototype.calculateFitness = function(dataTable) {
  return this.exactMatch(dataTable) ? gviz.DataFormat.Fitness.HIGH : gviz.DataFormat.Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/circlesdataformat.js)
gviz.CirclesDataFormat = function() {
};
goog.inherits(gviz.CirclesDataFormat, gviz.DataFormat);
gviz.CirclesDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.CirclesDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (3 != numCols) {
    throw Error("Invalid data table format: must have 3 columns.");
  }
  this.verifyType_(dataTable, 0, "string");
  this.verifyType_(dataTable, 1, "number");
  this.verifyType_(dataTable, 2, "string");
  return{nameCol:0, parentCol:2, valueCol:1};
};
gviz.CirclesDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  if (!this.matchType(dataTable, index, type)) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/combochartdataformat.js)
gviz.ComboChartDataFormat = function() {
  gviz.CoreChartDataFormat.call(this);
};
goog.inherits(gviz.ComboChartDataFormat, gviz.CoreChartDataFormat);
gviz.ComboChartDataFormat.prototype.calculateFitness = function(dataTable) {
  var hasStringLabels = this.matchType(dataTable, 0, "number"), numberOfNumericColumns = dataTable.getNumberOfColumns();
  hasStringLabels || numberOfNumericColumns--;
  return this.exactMatch(dataTable) ? 2 > numberOfNumericColumns ? gviz.DataFormat.Fitness.LOW : gviz.DataFormat.Fitness.MEDIUM : gviz.DataFormat.Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/ganttdataformat.js)
gviz.GanttDataFormat = function() {
  this.error_ = null;
};
goog.inherits(gviz.GanttDataFormat, gviz.DataFormat);
gviz.GanttDataFormat.prototype.exactMatch = function(dataTable) {
  return!!this.buildFormat_(dataTable);
};
gviz.GanttDataFormat.prototype.analyzeTable = function(dataTable) {
  var result = this.buildFormat_(dataTable);
  if (goog.isDefAndNotNull(result)) {
    return result;
  }
  throw Error(this.error_);
};
gviz.GanttDataFormat.prototype.buildFormat_ = function(dataTable) {
  var idCol = new gviz.fw.data.ColumnInfo(0), nameCol = new gviz.fw.data.ColumnInfo(1), startCol = new gviz.fw.data.ColumnInfo(2), endCol = new gviz.fw.data.ColumnInfo(3), durationCol = new gviz.fw.data.ColumnInfo(4), percentCol = new gviz.fw.data.ColumnInfo(5), dependenciesCol = new gviz.fw.data.ColumnInfo(6);
  return this.verifyType_(dataTable, idCol.index(), "string") && this.verifyType_(dataTable, nameCol.index(), "string") && this.verifyType_(dataTable, startCol.index(), "date") && this.verifyType_(dataTable, endCol.index(), "date") && this.verifyType_(dataTable, durationCol.index(), "number") && this.verifyType_(dataTable, percentCol.index(), "number") && this.verifyType_(dataTable, dependenciesCol.index(), "string") ? {idCol:idCol, nameCol:nameCol, startCol:startCol, endCol:endCol, durationCol:durationCol, 
  percentCol:percentCol, dependenciesCol:dependenciesCol} : null;
};
gviz.GanttDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  return this.matchType(dataTable, index, type) ? !0 : (this.error_ = "Invalid data table format: column #" + index + " must be of type '" + type + "'.", !1);
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/gaugedataformat.js)
gviz.GaugeDataFormat = function() {
};
goog.inherits(gviz.GaugeDataFormat, gviz.DataFormat);
gviz.GaugeDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  return this.exactMatchColumnGauge_(dataTable) || this.exactMatchRowGauge_(dataTable);
};
gviz.GaugeDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? 1 < dataTable.getNumberOfRows() ? Fitness.MEDIUM : Fitness.HIGH : Fitness.NONE;
};
gviz.GaugeDataFormat.prototype.exactMatchColumnGauge_ = function(dataTable) {
  var numCols = dataTable.getNumberOfColumns();
  if (1 > numCols || 2 < numCols) {
    return!1;
  }
  var match = !0;
  2 == numCols && (match = match && this.matchType(dataTable, 0, "string"));
  var valuesColumn = numCols - 1;
  return match = match && this.checkPositiveColumn(dataTable, valuesColumn);
};
gviz.GaugeDataFormat.prototype.exactMatchRowGauge_ = function(dataTable) {
  var numCols = dataTable.getNumberOfColumns(), numRows = dataTable.getNumberOfRows();
  if (0 == numCols || 1 != numRows) {
    return!1;
  }
  for (var match = !0, i = 0;i < numCols;i++) {
    if (!this.matchType(dataTable, i, "number")) {
      match = !1;
      break;
    }
  }
  return match;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/geochartdataformat.js)
gviz.GeoChartDataFormat = function() {
};
goog.inherits(gviz.GeoChartDataFormat, gviz.DataFormat);
gviz.GeoChartDataFormat.AddressType = {LATLNG:"latlng", REGIONCODE:"regioncode", ADDRESS:"address"};
gviz.GeoChartDataFormat.DisplayMode = {REGIONS:"regions", MARKERS:"markers", TEXT:"text", AUTO:"auto"};
gviz.GeoChartDataFormat.prototype.exactMatch = function(dataTable) {
  var numCols = dataTable.getNumberOfColumns();
  if (1 > numCols || 2 < numCols) {
    return!1;
  }
  var match = this.matchType(dataTable, 0, "string");
  2 == numCols && (match = match && this.matchType(dataTable, 1, "number"));
  return match;
};
gviz.GeoChartDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? Fitness.LOW : Fitness.NONE;
};
gviz.GeoChartDataFormat.prototype.analyzeTable = function(dataTable, opt_displayMode, opt_errorHandler) {
  try {
    return this.analyzeTable_(dataTable, opt_displayMode);
  } catch (e) {
    return opt_errorHandler && opt_errorHandler.addError("Incompatible data table: " + e), null;
  }
};
gviz.GeoChartDataFormat.prototype.analyzeTable_ = function(dataTable, opt_displayMode) {
  var displayMode = opt_displayMode || gviz.GeoChartDataFormat.DisplayMode.AUTO, nextColumn = 0, addressType, regionColumn = -1, addressColumn = -1, latColumn = -1, lngColumn = -1, hasLatLng = this.columnsTypesMatch(dataTable, [nextColumn, nextColumn + 1], ["number", "number"]);
  if (hasLatLng) {
    addressType = gviz.GeoChartDataFormat.AddressType.LATLNG;
    latColumn = nextColumn;
    lngColumn = nextColumn + 1;
    nextColumn += 2;
    if (displayMode === gviz.GeoChartDataFormat.DisplayMode.REGIONS) {
      throw Error("displayMode must be set to Markers when using lat/long addresses.");
    }
    displayMode === gviz.GeoChartDataFormat.DisplayMode.AUTO && (displayMode = gviz.GeoChartDataFormat.DisplayMode.MARKERS);
  } else {
    if (this.columnsTypesMatch(dataTable, [nextColumn], ["string"])) {
      switch(displayMode) {
        case gviz.GeoChartDataFormat.DisplayMode.AUTO:
          this.guessIsAddress_(dataTable, nextColumn) ? (addressType = gviz.GeoChartDataFormat.AddressType.ADDRESS, displayMode = gviz.GeoChartDataFormat.DisplayMode.MARKERS, addressColumn = nextColumn) : (addressType = gviz.GeoChartDataFormat.AddressType.REGIONCODE, displayMode = gviz.GeoChartDataFormat.DisplayMode.REGIONS, regionColumn = nextColumn);
          break;
        case gviz.GeoChartDataFormat.DisplayMode.REGIONS:
          addressType = gviz.GeoChartDataFormat.AddressType.REGIONCODE;
          regionColumn = nextColumn;
          break;
        case gviz.GeoChartDataFormat.DisplayMode.MARKERS:
        ;
        case gviz.GeoChartDataFormat.DisplayMode.TEXT:
          addressType = gviz.GeoChartDataFormat.AddressType.ADDRESS;
          addressColumn = nextColumn;
          break;
        default:
          throw Error("Unknown displayMode: " + displayMode);;
      }
      nextColumn += 1;
    } else {
      throw Error("Unknown address type.");
    }
  }
  var locationNameColumn = null;
  this.columnsTypesMatch(dataTable, [nextColumn], ["string"]) && "tooltip" != dataTable.getColumnProperty(nextColumn, "role") && (locationNameColumn = nextColumn++);
  var colorMetricsColumn = null, sizeMetricsColumn = null;
  this.columnsTypesMatch(dataTable, [nextColumn], ["number"]) && (colorMetricsColumn = nextColumn++, this.columnsTypesMatch(dataTable, [nextColumn], ["number"]) && (sizeMetricsColumn = nextColumn++));
  var tooltipColumn = null;
  this.columnsTypesMatch(dataTable, [nextColumn], ["string"]) && "tooltip" == dataTable.getColumnProperty(nextColumn, "role") && (tooltipColumn = nextColumn++);
  addressType != gviz.GeoChartDataFormat.AddressType.REGIONCODE && null != colorMetricsColumn && null == sizeMetricsColumn && (sizeMetricsColumn = colorMetricsColumn);
  if (dataTable.getNumberOfColumns() != nextColumn) {
    throw Error("Table contains more columns than expected (Expecting " + nextColumn + " columns)");
  }
  return{addressType:addressType, displayMode:displayMode, regionColumn:regionColumn, addressColumn:addressColumn, latColumn:latColumn, lngColumn:lngColumn, locationNameColumn:locationNameColumn, colorMetricsColumn:colorMetricsColumn, sizeMetricsColumn:sizeMetricsColumn, tooltipColumn:tooltipColumn};
};
gviz.GeoChartDataFormat.prototype.guessIsAddress_ = function() {
  return!1;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/helloworlddataformat.js)
gviz.HelloWorldDataFormat = function() {
};
goog.inherits(gviz.HelloWorldDataFormat, gviz.DataFormat);
gviz.HelloWorldDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.HelloWorldDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (5 != numCols) {
    throw Error("Invalid data table format: must have 5 columns.");
  }
  this.verifyType_(dataTable, 0, "number");
  this.verifyType_(dataTable, 1, "number");
  this.verifyType_(dataTable, 2, "number");
  this.verifyType_(dataTable, 3, "number");
  this.verifyType_(dataTable, 4, "string");
  return{xColumn:0, yColumn:1, sizeColumn:2, angleColumn:3, colorColumn:4};
};
gviz.HelloWorldDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  if (!this.matchType(dataTable, index, type)) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/histogramdataformat.js)
gviz.HistogramDataFormat = function(opt_dataFormatOptions) {
  gviz.CoreChartDataFormat.call(this, opt_dataFormatOptions);
};
goog.inherits(gviz.HistogramDataFormat, gviz.CoreChartDataFormat);
gviz.HistogramDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  if (!gviz.HistogramDataFormat.superClass_.exactMatch.call(this, dataTable)) {
    return!1;
  }
  var numCols = dataTable.getNumberOfColumns();
  if (this.isStacked_) {
    for (var i = 1;i < numCols;i++) {
      if (this.matchType(dataTable, i, "number") && !this.checkPositiveColumn(dataTable, i)) {
        return!1;
      }
    }
  }
  return!0;
};
gviz.HistogramDataFormat.prototype.calculateFitness = function(dataTable) {
  for (var Fitness = gviz.DataFormat.Fitness, numCols = dataTable.getNumberOfColumns(), numRows = dataTable.getNumberOfRows(), numNumericCols = 0, numDateCols = 0, i = 0;i < numCols;i++) {
    this.matchType(dataTable, i, "number") ? numNumericCols++ : this.matchType(dataTable, i, "date") && numDateCols++;
  }
  return this.exactMatch(dataTable) ? 10 > numRows ? Fitness.LOW : 2 > numNumericCols && 0 == numDateCols ? Fitness.HIGH : Fitness.MEDIUM : Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/mapdataformat.js)
gviz.MapDataFormat = function() {
};
goog.inherits(gviz.MapDataFormat, gviz.DataFormat);
gviz.MapDataFormat.prototype.exactMatch = function(dataTable) {
  return this.exactMatchLatLng(dataTable) || this.exactMatchAddress(dataTable);
};
gviz.MapDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness, latMatch = this.exactMatchLatLng(dataTable), addressMatch = this.exactMatchAddress(dataTable);
  return latMatch || addressMatch ? addressMatch ? Fitness.LOW : Fitness.HIGH : Fitness.NONE;
};
gviz.MapDataFormat.prototype.exactMatchLatLng = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (2 > numCols || 3 < numCols) {
    return!1;
  }
  var match = this.matchType(dataTable, 0, "number"), match = match && this.matchType(dataTable, 1, "number");
  3 == numCols && (match = match && this.matchType(dataTable, 2, "string"));
  return match && this.checkLatLng(dataTable, 0, 1);
};
gviz.MapDataFormat.prototype.exactMatchAddress = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  return 1 > numCols || 2 < numCols || !this.matchType(dataTable, 0, "string") || 2 == numCols && !this.matchType(dataTable, 1, "string") ? !1 : !0;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/motionchartdataformat.js)
gviz.MotionChartDataFormat = function() {
};
goog.inherits(gviz.MotionChartDataFormat, gviz.DataFormat);
gviz.MotionChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var n = dataTable.getNumberOfColumns();
  if (3 > n) {
    return!1;
  }
  var first = dataTable.getColumnType(0);
  if ("string" != first) {
    return!1;
  }
  var second = dataTable.getColumnType(1);
  if ("number" != second && "date" != second && "string" != second || "string" == second && !this.checkWeekColumn_(dataTable, 1) && !this.checkQuarterColumn_(dataTable, 1) || "number" == second && !this.checkColumn(dataTable, 1, function(value) {
    return goog.math.isInt(value);
  })) {
    return!1;
  }
  for (var i = 2;i < n;i++) {
    var type = dataTable.getColumnType(i);
    if ("number" != type && "string" != type) {
      return!1;
    }
  }
  return!0;
};
gviz.MotionChartDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? this.matchType(dataTable, 1, "number") && !this.checkYearColumn_(dataTable, 1) ? Fitness.LOW : Fitness.HIGH : Fitness.NONE;
};
gviz.MotionChartDataFormat.prototype.checkYearColumn_ = function(dataTable, index) {
  return this.checkColumn(dataTable, index, function(value) {
    return 1900 < value && 2100 > value;
  });
};
gviz.MotionChartDataFormat.prototype.checkWeekColumn_ = function(dataTable, index) {
  return this.checkColumn(dataTable, index, function(value) {
    if (7 != value.length) {
      return!1;
    }
    var year = value.substring(0, 3);
    if (isNaN(year) || "W" != value.charAt(4)) {
      return!1;
    }
    var week = value.substring(6, 7);
    return isNaN(week) ? !1 : !0;
  });
};
gviz.MotionChartDataFormat.prototype.checkQuarterColumn_ = function(dataTable, index) {
  return this.checkColumn(dataTable, index, function(value) {
    if (6 != value.length) {
      return!1;
    }
    var year = value.substring(0, 3);
    if (isNaN(year) || "Q" != value.charAt(4)) {
      return!1;
    }
    var quarter = value.charAt(5);
    return isNaN(quarter) ? !1 : !0;
  });
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/orgchartdataformat.js)
gviz.OrgChartDataFormat = function() {
};
goog.inherits(gviz.OrgChartDataFormat, gviz.DataFormat);
gviz.OrgChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (2 > numCols || 3 < numCols) {
    return!1;
  }
  var match = this.matchType(dataTable, 0, "string") && this.matchType(dataTable, 1, "string");
  3 == numCols && (match = match && this.matchType(dataTable, 2, "string"));
  return match && this.hasParents(dataTable);
};
gviz.OrgChartDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? Fitness.HIGH : Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/piechartdataformat.js)
gviz.PieChartDataFormat = function() {
};
goog.inherits(gviz.PieChartDataFormat, gviz.DataFormat);
gviz.PieChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (1 > numCols || 2 < numCols) {
    return!1;
  }
  var match = this.matchType(dataTable, numCols - 1, "number");
  return match = match && this.checkPositiveColumn(dataTable, numCols - 1);
};
gviz.PieChartDataFormat.prototype.addsToWhole_ = function(dataTable) {
  for (var total = 0, i = 0;i < dataTable.getNumberOfRows();i++) {
    total += dataTable.getValue(i, 1);
  }
  return 97 < total && 103 > total || .97 < total && 1.03 > total ? !0 : !1;
};
gviz.PieChartDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? 1 == dataTable.getNumberOfRows() ? Fitness.LOW : !this.matchType(dataTable, 0, "string") || 25 < dataTable.getNumberOfRows() || !this.addsToWhole_(dataTable) ? Fitness.MEDIUM : Fitness.HIGH : Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/radarchartdataformat.js)
gviz.RadarChartDataFormat = function() {
};
goog.inherits(gviz.RadarChartDataFormat, gviz.DataFormat);
gviz.RadarChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (0 == numCols) {
    return!1;
  }
  for (var startIndex = this.matchType(dataTable, 0, "string") ? 1 : 0, match = numCols > startIndex, i = startIndex;i < numCols;i++) {
    if (!this.matchType(dataTable, i, "number")) {
      match = !1;
      break;
    }
  }
  return match;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/sankeydataformat.js)
gviz.SankeyDataFormat = function() {
};
goog.inherits(gviz.SankeyDataFormat, gviz.DataFormat);
gviz.SankeyDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.SankeyDataFormat.prototype.analyzeTable = function(dataTable) {
  if (goog.isArray(dataTable)) {
    return this.analyzeMultipleTables_(dataTable);
  }
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (3 !== numCols) {
    throw Error("Invalid data table format: must have 3 columns.");
  }
  this.verifyType_("datatable", dataTable, 0, "string");
  this.verifyType_("datatable", dataTable, 1, "string");
  this.verifyType_("datatable", dataTable, 2, "number");
  return this.makeFormat_(0, 1, 2, dataTable);
};
gviz.SankeyDataFormat.prototype.makeFormat_ = function(fromCol, toCol, valueCol, dataTable) {
  for (var nodeMap = new goog.structs.Map, nodes = [], links = [], i = 0, len = dataTable.getNumberOfRows();i < len;++i) {
    var fromValue = dataTable.getStringValue(i, fromCol), toValue = dataTable.getStringValue(i, toCol);
    goog.asserts.assert(!goog.isNull(fromValue));
    goog.asserts.assert(!goog.isNull(toValue));
    var from = this.getNodeIndex(nodeMap, nodes, fromValue), to = this.getNodeIndex(nodeMap, nodes, toValue), value = dataTable.getValue(i, valueCol);
    links.push({source:from, target:to, value:value});
  }
  return{links:links, nodes:nodes};
};
gviz.SankeyDataFormat.prototype.analyzeMultipleTables_ = function(dataTables) {
  var linkTable = dataTables[0], nodeTable = dataTables[1], numCols = linkTable.getNumberOfColumns();
  if (3 !== numCols) {
    throw Error("Invalid linkTable format: must have 3 columns.");
  }
  this.verifyType_("linktable", linkTable, 0, "number");
  this.verifyType_("linktable", linkTable, 1, "number");
  this.verifyType_("linktable", linkTable, 2, "number");
  numCols = nodeTable.getNumberOfColumns();
  if (1 !== numCols && 2 !== numCols) {
    throw Error("Invalid nodeTable format: must have 1 or 2 columns.");
  }
  this.verifyType_("nodetable", nodeTable, 0, "string");
  2 === numCols && this.verifyType_("nodetable", nodeTable, 1, "string");
  for (var nodes = [], links = [], i = 0, len = linkTable.getNumberOfRows();i < len;++i) {
    var from = linkTable.getValue(i, 0), to = linkTable.getValue(i, 1), value = linkTable.getValue(i, 2);
    links.push({source:from, target:to, value:value});
  }
  i = 0;
  for (len = nodeTable.getNumberOfRows();i < len;++i) {
    nodes.push({name:nodeTable.getValue(i, 0), category:2 === numCols ? nodeTable.getValue(i, 1) : ""});
  }
  return{links:links, nodes:nodes};
};
gviz.SankeyDataFormat.prototype.getNodeIndex = function(nodeMap, nodes, key) {
  if (nodeMap.containsKey(key)) {
    return nodeMap.get(key);
  }
  nodeMap.set(key, nodes.length);
  nodes.push({name:key, category:""});
  return nodes.length - 1;
};
gviz.SankeyDataFormat.prototype.verifyType_ = function(tableName, dataTable, index, type) {
  if (!this.matchType(dataTable, index, type)) {
    throw Error("Invalid format in " + tableName + ": column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/scatterchartdataformat.js)
gviz.ScatterChartDataFormat = function() {
};
goog.inherits(gviz.ScatterChartDataFormat, gviz.DataFormat);
gviz.ScatterChartDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var n = dataTable.getNumberOfColumns();
  if (2 > n || this.matchType(dataTable, 0, "boolean") || this.matchType(dataTable, 0, "string")) {
    return!1;
  }
  for (var i = 1, numberOfDataSeries = 0, numberOfConsecutiveBooleanColumns = 0;i < n;) {
    var type = dataTable.getColumnType(i);
    if ("number" == type) {
      numberOfDataSeries++, numberOfConsecutiveBooleanColumns = 0;
    } else {
      if ("boolean" == type) {
        if (numberOfConsecutiveBooleanColumns++, 0 == numberOfDataSeries || 1 < numberOfConsecutiveBooleanColumns) {
          return!1;
        }
      } else {
        return!1;
      }
    }
    i++;
  }
  return 0 < numberOfDataSeries;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/sparklinedataformat.js)
gviz.SparkLineDataFormat = function() {
};
goog.inherits(gviz.SparkLineDataFormat, gviz.DataFormat);
gviz.SparkLineDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  for (var match = !0, numCols = dataTable.getNumberOfColumns(), i = 0;i < numCols;i++) {
    if (!this.matchType(dataTable, i, "number")) {
      match = !1;
      break;
    }
  }
  return match;
};
gviz.SparkLineDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? 2 > dataTable.getNumberOfColumns() ? Fitness.LOW : Fitness.MEDIUM : Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/streamgraphdataformat.js)
gviz.StreamgraphDataFormat = function() {
};
goog.inherits(gviz.StreamgraphDataFormat, gviz.DataFormat);
gviz.StreamgraphDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.StreamgraphDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (1 > numCols) {
    throw Error("Invalid data table format: must have at least 1 column.");
  }
  this.verifyType_(dataTable, 0, "date");
  for (var valueCols = [], i = 1;i < numCols;i++) {
    this.verifyType_(dataTable, i, "number"), valueCols.push(i);
  }
  return{dateCol:0, valueCols:valueCols};
};
gviz.StreamgraphDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  if (!this.matchType(dataTable, index, type)) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/sunburstdataformat.js)
gviz.SunburstDataFormat = function() {
};
goog.inherits(gviz.SunburstDataFormat, gviz.DataFormat);
gviz.SunburstDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.SunburstDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (3 != numCols) {
    throw Error("Invalid data table format: must have 3 columns.");
  }
  this.verifyType_(dataTable, 0, "string");
  this.verifyType_(dataTable, 1, "number");
  this.verifyType_(dataTable, 2, "string");
  return{nameCol:0, parentCol:2, valueCol:1};
};
gviz.SunburstDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  if (!this.matchType(dataTable, index, type)) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/tabledataformat.js)
gviz.TableDataFormat = function() {
};
goog.inherits(gviz.TableDataFormat, gviz.DataFormat);
gviz.TableDataFormat.prototype.exactMatch = function() {
  return!0;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/tabletextdataformat.js)
gviz.TableTextDataFormat = function() {
};
goog.inherits(gviz.TableTextDataFormat, gviz.DataFormat);
gviz.TableTextDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.TableTextDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (2 > numCols) {
    throw Error("Invalid data table format: must have at least 2 columns.");
  }
  return{numColumns:numCols};
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/timelinedataformat.js)
gviz.TimelineDataFormat = function(opt_options) {
  this.options_ = opt_options || new gviz.Options([]);
};
goog.inherits(gviz.TimelineDataFormat, gviz.DataFormat);
gviz.TimelineDataFormat.VALID_TYPES = ["date", "number", "datetime"];
gviz.TimelineDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.TimelineDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  for (var colReps = [], numCols = dataTable.getNumberOfColumns(), i = 0;i < numCols;++i) {
    var role = dataTable.getColumnRole(i);
    if ("" === role) {
      colReps.push({index:i, roles:{}});
    } else {
      if (1 > colReps.length) {
        throw Error("At least 1 data column must come before any role columns");
      }
      var rep = goog.array.peek(colReps);
      rep.roles[role] = i;
    }
  }
  numCols = colReps.length;
  if (3 !== numCols && 4 !== numCols) {
    throw Error("Invalid data table format: must have 3 or 4 data columns.");
  }
  var hasLabelColumn = 4 == numCols;
  this.verifyType_(dataTable, colReps[0].index, "string");
  hasLabelColumn && this.verifyType_(dataTable, colReps[1].index, "string");
  this.verifyType_(dataTable, colReps[hasLabelColumn ? 2 : 1].index, gviz.TimelineDataFormat.VALID_TYPES);
  this.verifyType_(dataTable, colReps[hasLabelColumn ? 3 : 2].index, gviz.TimelineDataFormat.VALID_TYPES);
  if (4 === numCols) {
    var swap = !this.options_.inferBooleanValue("timeline.taskMajor", !0);
    return{nameCol:colReps[swap ? 1 : 0], labelCol:colReps[swap ? 0 : 1], startCol:colReps[2], endCol:colReps[3]};
  }
  return{nameCol:colReps[0], labelCol:null, startCol:colReps[1], endCol:colReps[2]};
};
gviz.TimelineDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  goog.isArray(type) || (type = [type]);
  if (!this.matchTypes(dataTable, index, type)) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/timetextdataformat.js)
gviz.TimeTextDataFormat = function() {
};
goog.inherits(gviz.TimeTextDataFormat, gviz.DataFormat);
gviz.TimeTextDataFormat.prototype.exactMatch = function(dataTable) {
  try {
    this.analyzeTable(dataTable);
  } catch (e) {
    return!1;
  }
  return!0;
};
gviz.TimeTextDataFormat.prototype.analyzeTable = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (2 > numCols) {
    throw Error("Invalid data table format: must have 2 columns.");
  }
  this.verifyType_(dataTable, 0, "date");
  this.verifyType_(dataTable, 1, "number");
  return{depColumn:0, indepColumn:1};
};
gviz.TimeTextDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  goog.isArray(type) || (type = [type]);
  if (!this.matchTypes(dataTable, index, type)) {
    throw Error("Invalid data table format: column #" + index + " must be of type '" + type + "'.");
  }
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/treemapdataformat.js)
gviz.TreeMapDataFormat = function() {
};
goog.inherits(gviz.TreeMapDataFormat, gviz.DataFormat);
gviz.TreeMapDataFormat.prototype.exactMatch = function(dataTable) {
  this.validateDataTable(dataTable);
  var numCols = dataTable.getNumberOfColumns();
  if (2 > numCols || 4 < numCols) {
    return!1;
  }
  var match = this.matchType(dataTable, 0, "string") && this.matchType(dataTable, 1, "string");
  2 < numCols && (match = match && this.checkPositiveColumn(dataTable, 2)) && 3 < numCols && (match = match && this.matchType(dataTable, 3, "number"));
  return match && this.hasParents(dataTable);
};
gviz.TreeMapDataFormat.prototype.calculateFitness = function(dataTable) {
  var Fitness = gviz.DataFormat.Fitness;
  return this.exactMatch(dataTable) ? Fitness.HIGH : Fitness.NONE;
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/dataformat/wordclouddataformat.js)
gviz.WordcloudDataFormat = function() {
  this.error_ = null;
};
goog.inherits(gviz.WordcloudDataFormat, gviz.DataFormat);
gviz.WordcloudDataFormat.prototype.exactMatch = function(dataTable) {
  return this.buildFormat_(dataTable);
};
gviz.WordcloudDataFormat.prototype.analyzeTable = function(dataTable) {
  var result = this.buildFormat_(dataTable);
  if (result) {
    return{};
  }
  throw Error(this.error_);
};
gviz.WordcloudDataFormat.prototype.buildFormat_ = function(dataTable) {
  for (var numColumns = dataTable.getNumberOfColumns(), i = 0;i < numColumns;i++) {
    if (0 == this.verifyType_(dataTable, i, "string")) {
      return!1;
    }
  }
  return!0;
};
gviz.WordcloudDataFormat.prototype.verifyType_ = function(dataTable, index, type) {
  return this.matchType(dataTable, index, type) ? !0 : (this.error_ = "Invalid data table format: column #" + index + " must be of type '" + type + "'.", !1);
};
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/chartselection.js)
gviz.ChartSelection = function(opt_chartTypes) {
  this.chartTypes_ = goog.isArray(opt_chartTypes) ? opt_chartTypes : goog.object.getValues(gviz.ChartSelection.ChartType);
};
gviz.ChartSelection.removeColumnsWithRoles = function(data) {
  for (var columns = [], i = 0;i < data.getNumberOfColumns();i++) {
    var role = data.getColumnProperty(i, "role");
    null != role && "" != role || columns.push(i);
  }
  if (columns.length == data.getNumberOfColumns()) {
    return data;
  }
  var result = new google.visualization.DataView(data);
  result.setColumns(columns);
  return result;
};
gviz.ChartSelection.prototype.calculateChartTypes = function(dataTable) {
  var scores = [];
  goog.object.forEach(this.chartTypes_, function(chartType) {
    var typeMetadata = gviz.ChartSelection.CHART_TYPES[chartType], format = typeMetadata && typeMetadata.format;
    if (format) {
      var fit = format.calculateFitness(dataTable);
      fit != gviz.DataFormat.Fitness.NONE && scores.push({type:chartType, fitness:fit, coolness:typeMetadata.coolness});
    }
  });
  gviz.ChartSelection.sortScores_(scores);
  return goog.array.map(scores, function(score) {
    return score.type;
  });
};
gviz.ChartSelection.sortScores_ = function(scores) {
  goog.array.stableSort(scores, function(left, right) {
    var diff = left.fitness - right.fitness;
    0 == diff && (diff = left.coolness - right.coolness);
    return diff = -diff;
  });
};
gviz.ChartSelection.Coolness = {HIGH:3, MEDIUM:2, LOW:1, TABLE:0};
gviz.ChartSelection.ChartType = {ANNOTATED_TIME_LINE:"AnnotatedTimeLine", AREA_CHART:"AreaChart", BAR_CHART:"BarChart", BUBBLE_CHART:"BubbleChart", CANDLESTICK_CHART:"CandlestickChart", COLUMN_CHART:"ColumnChart", COMBO_CHART:"ComboChart", GAUGE:"Gauge", GEOCHART:"GeoChart", HISTOGRAM:"Histogram", IMAGE_RADAR_CHART:"ImageRadarChart", IMAGE_SPARK_LINE:"ImageSparkLine", MOTION_CHART:"MotionChart", LINE_CHART:"LineChart", PIE_CHART:"PieChart", MAP:"Map", ORG_CHART:"OrgChart", SCATTER_CHART:"ScatterChart", 
STACKED_AREA_CHART:"AreaChart-stacked", STEPPED_AREA_CHART:"SteppedAreaChart", TABLE:"Table", TIMELINE:"Timeline", TREE_MAP:"TreeMap", WORD_TREE:"WordTree"};
gviz.ChartSelection.CHART_TYPES = goog.object.create(gviz.ChartSelection.ChartType.ANNOTATED_TIME_LINE, {format:new gviz.AnnotatedTimeLineDataFormat, coolness:gviz.ChartSelection.Coolness.HIGH}, gviz.ChartSelection.ChartType.AREA_CHART, {format:new gviz.AreaChartDataFormat({annotate:!0}), coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.BAR_CHART, {format:new gviz.CoreChartDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.BUBBLE_CHART, 
{format:new gviz.BubbleChartDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.CANDLESTICK_CHART, {format:new gviz.CandlestickDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.COLUMN_CHART, {format:new gviz.CoreChartDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.COMBO_CHART, {format:new gviz.ComboChartDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.GAUGE, 
{format:new gviz.GaugeDataFormat, coolness:gviz.ChartSelection.Coolness.LOW}, gviz.ChartSelection.ChartType.GEOCHART, {format:new gviz.GeoChartDataFormat, coolness:gviz.ChartSelection.Coolness.HIGH}, gviz.ChartSelection.ChartType.HISTOGRAM, {format:new gviz.HistogramDataFormat, coolness:gviz.ChartSelection.Coolness.HIGH}, gviz.ChartSelection.ChartType.LINE_CHART, {format:new gviz.CoreChartDataFormat({annotate:!0}), coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.IMAGE_RADAR_CHART, 
{format:new gviz.RadarChartDataFormat, coolness:gviz.ChartSelection.Coolness.LOW}, gviz.ChartSelection.ChartType.IMAGE_SPARK_LINE, {format:new gviz.SparkLineDataFormat, coolness:gviz.ChartSelection.Coolness.LOW}, gviz.ChartSelection.ChartType.MAP, {format:new gviz.MapDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.MOTION_CHART, {format:new gviz.MotionChartDataFormat, coolness:gviz.ChartSelection.Coolness.HIGH}, gviz.ChartSelection.ChartType.ORG_CHART, {format:new gviz.OrgChartDataFormat, 
coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.PIE_CHART, {format:new gviz.PieChartDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.SCATTER_CHART, {format:new gviz.ScatterChartDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.STACKED_AREA_CHART, {format:new gviz.AreaChartDataFormat({isStacked:!0}), coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.STEPPED_AREA_CHART, 
{format:new gviz.AreaChartDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.TABLE, {format:new gviz.TableDataFormat, coolness:gviz.ChartSelection.Coolness.TABLE}, gviz.ChartSelection.ChartType.TIMELINE, {format:new gviz.TimelineDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.TREE_MAP, {format:new gviz.TreeMapDataFormat, coolness:gviz.ChartSelection.Coolness.MEDIUM}, gviz.ChartSelection.ChartType.WORD_TREE, {format:new gviz.GeoChartDataFormat, 
coolness:gviz.ChartSelection.Coolness.MEDIUM});
// INPUT (javascript/gviz/devel/jsapi/common/chartselection/googleapis_exports.js)
goog.exportSymbol("google.visualization.ChartSelection", gviz.ChartSelection);
goog.exportProperty(gviz.ChartSelection.prototype, "calculateChartTypes", gviz.ChartSelection.prototype.calculateChartTypes);
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/packages.js)
gviz.packages = {};
gviz.packages.MAP = {"google.charts.Bar":"bar", AnnotatedTimeLine:"annotatedtimeline", AnnotationChart:"annotationchart", AreaChart:"corechart", BarChart:"corechart", BubbleChart:"corechart", CandlestickChart:"corechart", ColumnChart:"corechart", ComboChart:"corechart", Gauge:"gauge", GeoChart:"geochart", GeoMap:"geomap", Histogram:"corechart", ImageAreaChart:"imageareachart", ImageBarChart:"imagebarchart", ImageCandlestickChart:"imagechart", ImageChart:"imagechart", ImageLineChart:"imagelinechart", 
ImagePieChart:"imagepiechart", ImageSparkLine:"imagesparkline", IntensityMap:"intensitymap", LineChart:"corechart", Map:"map", MotionChart:"motionchart", OrgChart:"orgchart", PieChart:"corechart", RangeSelector:"corechart", ScatterChart:"corechart", SparklineChart:"corechart", SteppedAreaChart:"corechart", Table:"table", Timeline:"timeline", TreeMap:"treemap", StringFilter:"controls", DateRangeFilter:"controls", NumberRangeFilter:"controls", CategoryFilter:"controls", ChartRangeFilter:"controls", 
NumberRangeSetter:"controls", ColumnSelector:"controls", Dashboard:"controls"};
gviz.packages.isCoreChart = function(type) {
  return "corechart" == gviz.packages.getPackage(type);
};
gviz.packages.getPackage = function(type) {
  return gviz.packages.MAP[type] || null;
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/patterns.js)
gviz.patterns = {};
gviz.patterns.applyPatternOptions = function(type, data, options) {
  if (gviz.patterns.canApplyPatterns(options)) {
    if ("BubbleChart" == type) {
      gviz.patterns.applyBubbleChartPatternOptions_(data, options);
    } else {
      for (var vAxes = options.vAxes || [{}, {}], hAxis = options.hAxis || {}, vAxis = vAxes[0] || {}, rAxis = vAxes[1] || {}, vAxisPatterns = [], rAxisPatterns = [], cols = data && data.getNumberOfColumns() || 0, c = 0;c < cols;c++) {
        if ("number" == data.getColumnType(c)) {
          var pattern = data.getColumnPattern(c), targetAxis = gviz.patterns.getTargetAxis_(c, type, data, options);
          switch(targetAxis) {
            case null:
              break;
            case 0:
              vAxisPatterns.push(pattern);
              break;
            case 1:
              rAxisPatterns.push(pattern);
              break;
            default:
              goog.asserts.assert(!1, "targetAxisIndex should be 0, 1 or null");
          }
        }
      }
      if ("BarChart" == type) {
        var hAxisPatterns = vAxisPatterns;
        gviz.patterns.setAxisFormat(hAxis, hAxisPatterns);
      } else {
        gviz.patterns.setAxisFormat(vAxis, vAxisPatterns), gviz.patterns.setAxisFormat(rAxis, rAxisPatterns);
      }
      if (0 < cols && "string" != data.getColumnType(0)) {
        var domainAxis = "BarChart" == type ? vAxis : hAxis, pattern = data.getColumnPattern(0);
        gviz.patterns.setAxisFormat(domainAxis, [pattern]);
      }
      vAxes[0] = vAxis;
      vAxes[1] = rAxis;
      options.vAxes = vAxes;
      options.hAxis = hAxis;
    }
  }
};
gviz.patterns.canApplyPatterns = function(options) {
  var useFormatFromData = options.useFormatFromData;
  if (goog.isBoolean(useFormatFromData) && !useFormatFromData) {
    return!1;
  }
  for (var axisNames = ["vAxis", "targetAxis", "targetAxes.0", "targetAxes.1", "domainAxis"], i = 0;i < axisNames.length;i++) {
    if (goog.getObjectByName(axisNames[i] + ".format", options)) {
      return!1;
    }
  }
  return!0;
};
gviz.patterns.setAxisFormat = function(axis, patterns) {
  var useFormatFromData = axis.useFormatFromData;
  if ((!goog.isBoolean(useFormatFromData) || useFormatFromData) && goog.string.isEmptySafe(axis.format) && (patterns = goog.array.filter(patterns, function(pattern) {
    return!goog.string.isEmptySafe(pattern);
  }), goog.array.removeDuplicates(patterns), 1 == patterns.length)) {
    var pattern$$0 = gviz.patterns.normalizePattern_(patterns[0]);
    axis.format = pattern$$0;
  }
};
gviz.patterns.applyBubbleChartPatternOptions_ = function(data, options) {
  if (!(3 > data.getNumberOfColumns())) {
    var xPattern = data.getColumnPattern(1), hAxis = options.hAxis || {};
    gviz.patterns.setAxisFormat(hAxis, [xPattern]);
    options.hAxis = hAxis;
    var yPattern = data.getColumnPattern(2), vAxes = options.vAxes || {}, vAxis = vAxes[0] || {};
    gviz.patterns.setAxisFormat(vAxis, [yPattern]);
    vAxes[0] = vAxis;
    options.vAxes = vAxes;
  }
};
gviz.patterns.getTargetAxis_ = function(i, chartType, dataTable, drawOptions) {
  if (0 == i) {
    return null;
  }
  i--;
  var series = drawOptions.series || {}, serie = series[i] || {};
  return serie.targetAxisIndex || 0;
};
gviz.patterns.normalizePattern_ = function(pattern) {
  goog.string.isEmptySafe(pattern) || (pattern = pattern.replace(/\d/g, "0"), pattern = pattern.replace(/#{10,}/, goog.string.repeat("#", 10)));
  return pattern;
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/trendlines.js)
gviz.trendlines = {};
gviz.trendlines.applyTrendLineOption = function(wrapper) {
  if (wrapper.getOption("addTrendLine")) {
    var dataTable = wrapper.getDataTable();
    if ("ScatterChart" == wrapper.getType() && 2 == dataTable.getNumberOfColumns()) {
      var view = gviz.trendlines.createTrendView_(dataTable);
      wrapper.setDataTable(view);
      wrapper.setOption("series.1.lineWidth", 2);
      wrapper.setOption("series.1.pointSize", 0);
      wrapper.setOption("series.1.visibleInLegend", !1);
    }
    wrapper.setOption("addTrendLine", null);
  }
};
gviz.trendlines.createTrendView_ = function(dataTable) {
  var trendline = gviz.trendlines.computeSlopeAndIntercept_(dataTable), view = new google.visualization.DataView(dataTable);
  view.setColumns([0, 1, {type:"number", calc:function(data, row) {
    var coordinate = gviz.trendlines.getCoordinate_(dataTable, row);
    return null != coordinate ? trendline.slope * coordinate.x + trendline.intercept : null;
  }}]);
  return view;
};
gviz.trendlines.computeMean_ = function(dataTable) {
  for (var n = dataTable.getNumberOfRows(), sum = new goog.math.Coordinate, i = 0;i < n;i++) {
    var value = gviz.trendlines.getCoordinate_(dataTable, i);
    null != value && (sum.x += value.x, sum.y += value.y);
  }
  return new goog.math.Coordinate(sum.x / n, sum.y / n);
};
gviz.trendlines.computeSlopeAndIntercept_ = function(dataTable) {
  for (var mean = gviz.trendlines.computeMean_(dataTable), numerator = 0, denominator = 0, i = 0;i < dataTable.getNumberOfRows();i++) {
    var value = gviz.trendlines.getCoordinate_(dataTable, i);
    if (null != value) {
      var diff = new goog.math.Coordinate(value.x - mean.x, value.y - mean.y), numerator = numerator + diff.x * diff.y, denominator = denominator + diff.x * diff.x
    }
  }
  var result = {};
  result.slope = numerator / denominator || 1;
  result.intercept = mean.y - result.slope * mean.x;
  return result;
};
gviz.trendlines.getCoordinate_ = function(data, row) {
  var x = data.getValue(row, 0), y = data.getValue(row, 1);
  return null == x || null == y ? null : new goog.math.Coordinate(x, y);
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/extensions.js)
gviz.extensions = {};
gviz.extensions.applyPatternOptions = function(wrapper) {
  gviz.patterns.applyPatternOptions(wrapper.getType(), wrapper.getDataTable(), wrapper.getOptions());
};
gviz.extensions.applyTrendLineOption = function(wrapper) {
  gviz.trendlines.applyTrendLineOption(wrapper);
};
gviz.extensions.deserializeView = function(wrapper) {
  var dataTable = wrapper.getDataTable(), view = wrapper.getView();
  if (goog.isArray(view)) {
    for (var i = 0;i < view.length;i++) {
      goog.asserts.assert(dataTable), dataTable = google.visualization.DataView.fromJSON(dataTable, view[i]);
    }
  } else {
    goog.isDefAndNotNull(view) && (goog.asserts.assert(dataTable), dataTable = google.visualization.DataView.fromJSON(dataTable, view));
  }
  wrapper.setView(null);
  goog.asserts.assert(dataTable);
  wrapper.setDataTable(dataTable);
};
gviz.extensions.hackLabelsColumn = function(wrapper) {
  var type = wrapper.getType();
  if (gviz.packages.isCoreChart(type) && "ScatterChart" != type) {
    var data = wrapper.getDataTable(), hasLabelsColumn = wrapper.getOption("hasLabelsColumn");
    if (null != hasLabelsColumn) {
      for (var viewColumns = [{calc:hasLabelsColumn ? "stringify" : "emptyString", sourceColumn:0, type:"string"}], first = hasLabelsColumn ? 1 : 0, numberOfColumns = data.getNumberOfColumns(), i = first;i < numberOfColumns;i++) {
        viewColumns.push(i);
      }
      data = new google.visualization.DataView(data);
      data.setColumns(viewColumns);
      wrapper.setOption("hasLabelsColumn", null);
      wrapper.setDataTable(data);
    }
  }
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/chartwrapper.js)
gviz.Wrapper = function(wrapperKind, opt_specification) {
  goog.Disposable.call(this);
  var specification = opt_specification || {};
  goog.isString(specification) && (specification = gviz.json.deserialize(specification));
  this.containerId_ = specification.containerId || null;
  this.wrapperKind_ = wrapperKind;
  this.type_ = specification[wrapperKind + "Type"] || null;
  this.name_ = specification[wrapperKind + "Name"] || null;
  this.nextVisualization = this.visualization = this.loadingVisualization = null;
  this.dataSourceUrl_ = specification.dataSourceUrl || null;
  this.dataTable_ = null;
  this.setDataTable(specification.dataTable);
  this.options_ = specification.options || {};
  this.state_ = specification.state || {};
  var packages = specification.packages;
  this.packages_ = goog.isDef(packages) ? packages : null;
  this.query_ = specification.query || null;
  this.refreshInterval_ = specification.refreshInterval || null;
  this.view_ = specification.view || null;
  this.customRequestHandler_ = null;
  this.extensions_ = [gviz.extensions.deserializeView, gviz.extensions.hackLabelsColumn, gviz.extensions.applyPatternOptions, gviz.extensions.applyTrendLineOption];
  this.isDefaultVisualization_ = specification.isDefaultVisualization || !goog.isDef(specification.isDefaultVisualization);
};
goog.inherits(gviz.Wrapper, goog.Disposable);
gviz.Wrapper.Kind = {CHART:"chart", CONTROL:"control", DASHBOARD:"dashboard"};
gviz.Wrapper.prototype.recentDataTable_ = null;
gviz.Wrapper.prototype.visualizationEventListeners_ = null;
gviz.Wrapper.prototype.container_ = null;
gviz.Wrapper.isNullOrUndefined = function(value) {
  return!goog.isDefAndNotNull(value);
};
gviz.Wrapper.prototype.clone = function() {
  var wrapper = new this.constructor(this.toJSON());
  wrapper.customRequestHandler_ = this.customRequestHandler_;
  return wrapper;
};
gviz.Wrapper.prototype.disposeInternal = function() {
  this.clear();
  gviz.Wrapper.superClass_.disposeInternal.call(this);
};
gviz.Wrapper.prototype.clear = function() {
  this.clearVisualization();
};
gviz.Wrapper.prototype.draw = function(opt_container) {
  var container = goog.dom.getElement(opt_container || "");
  if (!goog.dom.isNodeLike(container)) {
    var id = this.getContainerId(), container = goog.dom.getElement(id);
    if (!goog.dom.isNodeLike(container)) {
      throw Error("The container #" + id + " is null or not defined.");
    }
  }
  this.container_ = container;
  try {
    if (!goog.isDefAndNotNull(this.getType())) {
      throw Error("The " + this.wrapperKind_ + " type is not defined.");
    }
    if (gviz.util.VisCommon.resolveConstructor(this.getType())) {
      this.drawAfterApiLoad_(container);
    } else {
      var draw = goog.bind(this.drawAfterApiLoad_, this, container), draw = google.visualization.errors.createProtectedCallback(draw, goog.bind(this.handleError_, this, container));
      this.loadApi_(draw);
    }
  } catch (x) {
    this.handleError_(container, x);
  }
};
gviz.Wrapper.prototype.toJSON = function() {
  return gviz.json.serialize(this.internalToPOJO_(this.getDataTable()));
};
gviz.Wrapper.prototype.toPOJO = function() {
  return this.internalToPOJO_(this.recentDataTable_ || this.getDataTable());
};
gviz.Wrapper.prototype.internalToPOJO_ = function(dataTable) {
  var packages = this.getPackages(), dataTableObj = void 0;
  goog.isNull(dataTable) || (dataTableObj = goog.isFunction(dataTable.toDataTable) ? dataTable.toDataTable().toPOJO() : dataTable.toPOJO());
  var jsonObj = {containerId:this.getContainerId() || void 0, dataSourceUrl:this.getDataSourceUrl() || void 0, dataTable:dataTableObj, options:this.getOptions() || void 0, state:this.getState() || void 0, packages:goog.isNull(packages) ? void 0 : packages, refreshInterval:this.getRefreshInterval() || void 0, query:this.getQuery() || void 0, view:this.getView() || void 0, isDefaultVisualization:this.isDefaultVisualization()};
  jsonObj[this.wrapperKind_ + "Type"] = this.getType() || void 0;
  jsonObj[this.wrapperKind_ + "Name"] = this.getName() || void 0;
  this.addToJson(jsonObj);
  return jsonObj;
};
gviz.Wrapper.prototype.addToJson = function() {
};
gviz.Wrapper.prototype.getDataSourceUrl = function() {
  return this.dataSourceUrl_;
};
gviz.Wrapper.prototype.getDataTable = function() {
  return this.dataTable_;
};
gviz.Wrapper.prototype.getType = function() {
  return this.type_;
};
gviz.Wrapper.prototype.getName = function() {
  return this.name_;
};
gviz.Wrapper.prototype.getVisualization = function() {
  return this.visualization;
};
gviz.Wrapper.prototype.getContainerId = function() {
  return this.containerId_;
};
gviz.Wrapper.prototype.getQuery = function() {
  return this.query_;
};
gviz.Wrapper.prototype.getRefreshInterval = function() {
  return this.refreshInterval_;
};
gviz.Wrapper.prototype.getOption = function(key, opt_default) {
  return gviz.Wrapper.getOption_(this.options_, key, opt_default);
};
gviz.Wrapper.getOption_ = function(options, key, opt_default) {
  var result = -1 == key.indexOf(".") ? options[key] : goog.getObjectByName(key, options);
  opt_default = goog.isDef(opt_default) ? opt_default : null;
  return result = goog.isDefAndNotNull(result) ? result : opt_default;
};
gviz.Wrapper.prototype.getOptions = function() {
  return this.options_;
};
gviz.Wrapper.prototype.getState = function() {
  return this.state_;
};
gviz.Wrapper.prototype.isDefaultVisualization = function() {
  return this.isDefaultVisualization_;
};
gviz.Wrapper.prototype.setDataSourceUrl = function(dataSourceUrl) {
  this.dataSourceUrl_ = dataSourceUrl;
};
gviz.Wrapper.prototype.setCustomRequestHandler = function(requestHandler) {
  this.customRequestHandler_ = requestHandler;
};
gviz.Wrapper.prototype.getCustomRequestHandler = function() {
  return this.customRequestHandler_;
};
gviz.Wrapper.prototype.setDataTable = function(dataTable) {
  this.dataTable_ = google.visualization.datautils.normalizeDataTable(dataTable);
};
gviz.Wrapper.prototype.setType = function(type) {
  this.type_ = type;
};
gviz.Wrapper.prototype.setName = function(name) {
  this.name_ = name;
};
gviz.Wrapper.prototype.setContainerId = function(containerId) {
  this.containerId_ = containerId;
};
gviz.Wrapper.prototype.setQuery = function(query) {
  this.query_ = query;
};
gviz.Wrapper.prototype.setRefreshInterval = function(refreshInterval) {
  this.refreshInterval_ = refreshInterval;
};
gviz.Wrapper.prototype.setOption = function(key, value) {
  gviz.Wrapper.setOption_(this.options_, key, value);
};
gviz.Wrapper.setOption_ = function(options, key, value) {
  if (null == value) {
    if (!goog.isNull(gviz.Wrapper.getOption_(options, key))) {
      var path = key.split(".");
      if (1 < path.length) {
        key = path.pop();
        var object = gviz.Wrapper.getOption_(options, path.join("."));
        goog.asserts.assert(goog.isObject(object));
        options = object;
      }
      delete options[key];
    }
  } else {
    goog.exportSymbol(key, value, options);
  }
};
gviz.Wrapper.prototype.setOptions = function(options) {
  this.options_ = options || {};
};
gviz.Wrapper.prototype.getAccessors = function() {
  return gviz.Wrapper.propertyAccessors_;
};
gviz.Wrapper.prototype.setProperty = function(key, value) {
  var path = key.split(".");
  if (0 < path.length) {
    var topKey = path.shift(), accessors = this.getAccessors(), accessor = accessors[topKey];
    if (accessor) {
      if (0 === path.length) {
        accessor.set.apply(this, value);
      } else {
        var obj = accessor.get.apply(this);
        gviz.Wrapper.setOption_(obj, path.join("."), value);
      }
    }
  }
};
gviz.Wrapper.prototype.setState = function(state) {
  this.state_ = state || {};
};
gviz.Wrapper.prototype.setPackages = function(packages) {
  this.packages_ = packages;
};
gviz.Wrapper.prototype.setView = function(view) {
  this.view_ = view;
};
gviz.Wrapper.prototype.setVisualization = function(visualization) {
  visualization != this.visualization && (this.nextVisualization = visualization);
};
gviz.Wrapper.prototype.setIsDefaultVisualization = function(isDefault) {
  this.isDefaultVisualization_ = isDefault;
};
gviz.Wrapper.prototype.getSnapshot = function() {
  return new this.constructor(this.toPOJO());
};
gviz.Wrapper.prototype.getView = function() {
  return this.view_;
};
gviz.Wrapper.prototype.getPackages = function() {
  return this.packages_;
};
gviz.Wrapper.prototype.handleError_ = function(container, e) {
  var message = e && e.message || "error", id = google.visualization.errors.addError(container, message);
  google.visualization.events.trigger(this, "error", {id:id, message:message});
};
gviz.Wrapper.prototype.handleQueryResponseError_ = function(container, response) {
  var message = response.getMessage(), detailedMessage = response.getDetailedMessage(), id = google.visualization.errors.addErrorFromQueryResponse(container, response);
  google.visualization.events.trigger(this, "error", {id:id, message:message, detailedMessage:detailedMessage});
};
gviz.Wrapper.prototype.computePackages_ = function() {
  var result = this.getPackages();
  if (!goog.isDefAndNotNull(result)) {
    var type = this.getType(), type = type.replace("google.visualization.", ""), result = gviz.packages.getPackage(type);
    if (!goog.isDefAndNotNull(result)) {
      throw Error("Invalid visualization type: " + type);
    }
  }
  goog.isString(result) && (result = [result]);
  return result;
};
gviz.Wrapper.prototype.drawFromDataTable = function(container, dataTable) {
  var constructor = gviz.util.VisCommon.resolveConstructor(this.getType());
  if (!constructor) {
    throw Error("Invalid " + this.wrapperKind_ + " type: " + this.getType());
  }
  this.nextVisualization && (this.clearVisualization(), this.visualization = this.nextVisualization, this.nextVisualization = null);
  var visualization;
  this.visualization && this.visualization.constructor == constructor && this.sameContainer_(container, this.visualization) ? visualization = this.visualization : (this.clearVisualization(), visualization = new constructor(container));
  this.loadingVisualization && this.loadingVisualization != visualization && goog.isFunction(this.loadingVisualization.clearChart) && this.loadingVisualization.clearChart();
  this.loadingVisualization = visualization;
  this.handleVisualizationEvents_(visualization);
  this.recentDataTable_ = dataTable;
  for (var clonedOptions = gviz.object.unsafeClone(this.getOptions()), delegate = new google.visualization.ChartWrapper({chartType:this.getType(), dataTable:dataTable, options:clonedOptions, view:this.getView()}), i = 0;i < this.extensions_.length;i++) {
    this.extensions_[i](delegate);
  }
  visualization.draw(delegate.getDataTable(), delegate.getOptions(), this.getState());
};
gviz.Wrapper.prototype.pushView = function(view) {
  goog.isArray(this.view_) ? this.view_.push(view) : goog.isNull(this.view_) ? this.view_ = [view] : this.view_ = [this.view_, view];
};
gviz.Wrapper.prototype.drawFromQueryResponse_ = function(container, response) {
  if (response.isError()) {
    this.handleQueryResponseError_(container, response);
  } else {
    var dataTable = response.getDataTable();
    this.drawFromDataTable(container, dataTable);
  }
};
gviz.Wrapper.prototype.handleVisualizationEvents_ = function(visualization) {
  var eventTypes = ["ready", "select", "error", "statechange"], self = this;
  this.clearVisualizationEventListeners_();
  var eventListeners = [];
  goog.array.forEach(eventTypes, function(eventType) {
    var listener = google.visualization.events.addListener(visualization, eventType, function(JSCompiler_OptimizeArgumentsArray_p1) {
      "ready" == eventType && (self.loadingVisualization = null, self.visualization = visualization);
      "ready" != eventType && "statechange" != eventType || !goog.isFunction(visualization.getState) || self.setState(visualization.getState.call(visualization));
      google.visualization.events.trigger(self, eventType, JSCompiler_OptimizeArgumentsArray_p1);
    });
    eventListeners.push(listener);
  });
  this.visualizationEventListeners_ = eventListeners;
};
gviz.Wrapper.prototype.loadApi_ = function(onLoad) {
  var packages = this.computePackages_(), options = {packages:packages, callback:onLoad}, version = goog.getObjectByName("google.visualization.Version");
  goog.isNull(version) && (version = "1.0");
  gviz.util.VisCommon.loadApi("visualization", version, options);
};
gviz.Wrapper.prototype.drawAfterApiLoad_ = function(container) {
  var dataTable = this.getDataTable();
  if (dataTable) {
    this.drawFromDataTable(container, dataTable);
  } else {
    if (this.hasDataSourceUrl_()) {
      var callback = goog.bind(this.drawFromQueryResponse_, this, container), callback = google.visualization.errors.createProtectedCallback(callback, goog.bind(this.handleError_, this, container));
      this.sendQuery(callback, !0);
    } else {
      throw Error("Cannot draw chart: no data specified.");
    }
  }
};
gviz.Wrapper.prototype.hasDataSourceUrl_ = function() {
  return null != this.getDataSourceUrl();
};
gviz.Wrapper.prototype.sendQuery = function(callback, opt_enableRefresh) {
  var enableRefresh = goog.isBoolean(opt_enableRefresh) ? opt_enableRefresh : !1, url = this.getDataSourceUrl() || "", query = new google.visualization.Query(url), refreshInterval = this.getRefreshInterval();
  refreshInterval && enableRefresh && query.setRefreshInterval(refreshInterval);
  var selectStatement = this.getQuery();
  selectStatement && query.setQuery(selectStatement);
  query.send(callback);
};
gviz.Wrapper.prototype.clearVisualization = function() {
  this.visualization && goog.isFunction(this.visualization.clearChart) && this.visualization.clearChart();
  goog.dispose(this.visualization);
  this.visualization = null;
};
gviz.Wrapper.prototype.clearVisualizationEventListeners_ = function() {
  goog.isArray(this.visualizationEventListeners_) && (goog.array.forEach(this.visualizationEventListeners_, function(listener) {
    google.visualization.events.removeListener(listener);
  }), this.visualizationEventListeners_ = null);
};
gviz.Wrapper.prototype.sameContainer_ = function(container, visualization) {
  return visualization && goog.isFunction(visualization.getContainer) ? visualization.getContainer() == container : !1;
};
gviz.Wrapper.propertyAccessors_ = {name:{get:gviz.Wrapper.prototype.getName, set:gviz.Wrapper.prototype.setName}, type:{get:gviz.Wrapper.prototype.getType, set:gviz.Wrapper.prototype.setType}, containerId:{get:gviz.Wrapper.prototype.getContainerId, set:gviz.Wrapper.prototype.setContainerId}, options:{get:gviz.Wrapper.prototype.getOptions, set:gviz.Wrapper.prototype.setOptions}, state:{get:gviz.Wrapper.prototype.getState, set:gviz.Wrapper.prototype.setState}, dataSourceUrl:{get:gviz.Wrapper.prototype.getDataSourceUrl, 
set:gviz.Wrapper.prototype.setDataSourceUrl}, dataTable:{get:gviz.Wrapper.prototype.getDataTable, set:gviz.Wrapper.prototype.setDataTable}, refreshInterval:{get:gviz.Wrapper.prototype.getRefreshInterval, set:gviz.Wrapper.prototype.setRefreshInterval}, query:{get:gviz.Wrapper.prototype.getQuery, set:gviz.Wrapper.prototype.setQuery}, view:{get:gviz.Wrapper.prototype.getView, set:gviz.Wrapper.prototype.setView}};
google.visualization.ChartWrapper = function(opt_specification) {
  gviz.Wrapper.call(this, gviz.Wrapper.Kind.CHART, opt_specification);
};
goog.inherits(google.visualization.ChartWrapper, gviz.Wrapper);
google.visualization.ChartWrapper.prototype.getChart = gviz.Wrapper.prototype.getVisualization;
google.visualization.ChartWrapper.prototype.setChart = gviz.Wrapper.prototype.setVisualization;
google.visualization.ChartWrapper.prototype.setChartType = gviz.Wrapper.prototype.setType;
google.visualization.ChartWrapper.prototype.getChartType = gviz.Wrapper.prototype.getType;
google.visualization.ChartWrapper.prototype.setChartName = gviz.Wrapper.prototype.setName;
google.visualization.ChartWrapper.prototype.getChartName = gviz.Wrapper.prototype.getName;
google.visualization.ControlWrapper = function(opt_specification) {
  gviz.Wrapper.call(this, gviz.Wrapper.Kind.CONTROL, opt_specification);
};
goog.inherits(google.visualization.ControlWrapper, gviz.Wrapper);
google.visualization.ControlWrapper.prototype.getControl = gviz.Wrapper.prototype.getVisualization;
google.visualization.ControlWrapper.prototype.setControlType = gviz.Wrapper.prototype.setType;
google.visualization.ControlWrapper.prototype.getControlType = gviz.Wrapper.prototype.getType;
google.visualization.ControlWrapper.prototype.setControlName = gviz.Wrapper.prototype.setName;
google.visualization.ControlWrapper.prototype.getControlName = gviz.Wrapper.prototype.getName;
// INPUT (javascript/gviz/devel/jsapi/common/types/wrapper.js)
gviz.ChartWrapperType = {};
gviz.ControlWrapperType = {};
// INPUT (javascript/gviz/devel/jsapi/common/event-types.js)
gviz.ChartEventType = {READY:"ready", ANIMATION_FRAME_FINISH:"animationframefinish", ANIMATION_FINISH:"animationfinish", SELECT:"select", CLICK:"click", RIGHT_CLICK:"rightclick", DBL_CLICK:"dblclick", SCROLL:"scroll", DRAG_START:"dragstart", DRAG:"drag", DRAG_END:"dragend", FOCUS_IN:"onmouseover", FOCUS_OUT:"onmouseout", MOUSE_UP:"onmouseup", MOUSE_DOWN:"onmousedown", MOUSE_OVER:"onmouseover", MOUSE_OUT:"onmouseout", MOUSE_MOVE:"onmousemove", REMOVE_SERIE:"removeserie", RANGE_CHANGE:"rangechange", 
ROLL_UP:"rollup"};
gviz.ControlEventType = {READY:"ready", ERROR:"error", UI_CHANGE:"uichange", STATE_CHANGE:"statechange"};
// INPUT (javascript/closure/events/eventhandler.js)
goog.events.EventHandler = function(opt_scope) {
  goog.Disposable.call(this);
  this.handler_ = opt_scope;
  this.keys_ = {};
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(src, type, opt_fn, opt_capture) {
  return this.listen_(src, type, opt_fn, opt_capture);
};
goog.events.EventHandler.prototype.listenWithScope = function(src, type, fn, capture, scope) {
  return this.listen_(src, type, fn, capture, scope);
};
goog.events.EventHandler.prototype.listen_ = function(src, type, opt_fn, opt_capture, opt_scope) {
  goog.isArray(type) || (type && (goog.events.EventHandler.typeArray_[0] = type.toString()), type = goog.events.EventHandler.typeArray_);
  for (var i = 0;i < type.length;i++) {
    var listenerObj = goog.events.listen(src, type[i], opt_fn || this.handleEvent, opt_capture || !1, opt_scope || this.handler_ || this);
    if (!listenerObj) {
      break;
    }
    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
  }
  return this;
};
goog.events.EventHandler.prototype.listenOnce = function(src, type, opt_fn, opt_capture) {
  return this.listenOnce_(src, type, opt_fn, opt_capture);
};
goog.events.EventHandler.prototype.listenOnce_ = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      this.listenOnce_(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listenerObj = goog.events.listenOnce(src, type, opt_fn || this.handleEvent, opt_capture, opt_scope || this.handler_ || this);
    if (!listenerObj) {
      return this;
    }
    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
  }
  return this;
};
goog.events.EventHandler.prototype.listenWithWrapper = function(src, wrapper, listener, opt_capt) {
  return this.listenWithWrapper_(src, wrapper, listener, opt_capt);
};
goog.events.EventHandler.prototype.listenWithWrapper_ = function(src, wrapper, listener, opt_capt, opt_scope) {
  wrapper.listen(src, listener, opt_capt, opt_scope || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.unlisten = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      this.unlisten(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listener = goog.events.getListener(src, type, opt_fn || this.handleEvent, opt_capture, opt_scope || this.handler_ || this);
    listener && (goog.events.unlistenByKey(listener), delete this.keys_[listener.key]);
  }
  return this;
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_scope) {
  wrapper.unlisten(src, listener, opt_capt, opt_scope || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.removeAll = function() {
  goog.object.forEach(this.keys_, goog.events.unlistenByKey);
  this.keys_ = {};
};
goog.events.EventHandler.prototype.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll();
};
goog.events.EventHandler.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
// INPUT (javascript/gviz/devel/jsapi/packages/controls/controlui.js)
gviz.controls = {};
gviz.controls.ui = {};
gviz.controls.ui.ControlUi = function(container) {
  goog.Disposable.call(this);
  this.container_ = container;
  this.eventHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(gviz.controls.ui.ControlUi, goog.Disposable);
gviz.controls.ui.ControlUi.prototype.disposeInternal = function() {
  this.clear();
  gviz.controls.ui.ControlUi.superClass_.disposeInternal.call(this);
};
gviz.controls.ui.ControlUi.prototype.clear = function() {
  this.eventHandler_.removeAll();
  goog.dispose(this.eventHandler_);
  goog.dom.removeChildren(this.container_);
};
gviz.controls.ui.ControlUi.prototype.getContainer = function() {
  return this.container_;
};
gviz.controls.ui.ControlUi.prototype.addEventListener = function(src, type, callback, opt_capture, opt_handler) {
  opt_handler ? this.eventHandler_.listenWithScope(src, type, callback, opt_capture, opt_handler) : this.eventHandler_.listen(src, type, callback, opt_capture);
};
gviz.controls.ui.ControlUi.prototype.draw = function() {
};
gviz.controls.ui.ControlUi.prototype.getState = function() {
  return{};
};
// INPUT (javascript/gviz/devel/jsapi/packages/controls/control.js)
google.visualization.ControlUi = {};
google.visualization.Control = function(container) {
  goog.Disposable.call(this);
  this.container_ = gviz.util.VisCommon.validateContainer(container);
  this.errorHandler_ = new gviz.ErrorHandler(this, this.container_);
  this.dependencies_ = [];
};
goog.inherits(google.visualization.Control, goog.Disposable);
google.visualization.Control.prototype.disposeInternal = function() {
  this.clear();
  google.visualization.Control.superClass_.disposeInternal.call(this);
};
google.visualization.Control.prototype.clear = function() {
  this.disposeUi_();
};
google.visualization.Control.prototype.data_ = null;
google.visualization.Control.prototype.userOptions_ = null;
google.visualization.Control.prototype.options_ = null;
google.visualization.Control.prototype.ui_ = null;
google.visualization.Control.prototype.uiListener_ = null;
google.visualization.Control.prototype.userState_ = null;
google.visualization.Control.prototype.state_ = null;
google.visualization.Control.prototype.initialState_ = null;
google.visualization.Control.prototype.getDataTable = function() {
  return this.data_;
};
google.visualization.Control.prototype.getOptions = function() {
  return this.options_;
};
google.visualization.Control.prototype.getDefaultOptions = function() {
  return{};
};
google.visualization.Control.prototype.getUiOptions = function(data, options) {
  return options.inferWholeObjectValue("ui", {});
};
google.visualization.Control.prototype.getDefaultUiClass = function() {
  return "";
};
google.visualization.Control.prototype.setDependencies = function(dependencies) {
  this.dependencies_ = dependencies;
};
google.visualization.Control.prototype.getDependencies = function() {
  return this.dependencies_;
};
google.visualization.Control.prototype.prepareDraw = function() {
};
google.visualization.Control.prototype.getState = function() {
  return this.state_ ? gviz.json.deserialize(gviz.json.serialize(this.state_)) : null;
};
google.visualization.Control.prototype.draw = function(data, options, state) {
  this.data_ = data;
  this.userOptions_ = options || {};
  this.userState_ = state || {};
  this.errorHandler_.safeExecute(this.drawInternal_, this);
};
google.visualization.Control.prototype.drawInternal_ = function() {
  this.data_ && (this.prepareState_(), this.prepareOptions_(), this.prepareDraw(this.data_, this.options_, this.state_), this.drawUi_(), google.visualization.events.trigger(this, gviz.ControlEventType.READY, null));
};
google.visualization.Control.prototype.prepareOptions_ = function() {
  this.options_ = new gviz.Options([this.userOptions_, this.getDefaultOptions() || {}]);
};
google.visualization.Control.prototype.prepareState_ = function() {
  this.state_ = this.userState_ || {};
  if (!goog.isObject(this.state_)) {
    throw Error("Control state must be an object.");
  }
  this.initialState_ = this.initialState_ || this.state_;
};
google.visualization.Control.prototype.drawUi_ = function() {
  this.disposeUi_();
  this.ui_ = this.createUiInstance_();
  if (!this.ui_) {
    throw Error("Invalid Ui instance.");
  }
  this.uiListener_ = google.visualization.events.addListener(this.ui_, gviz.ControlEventType.UI_CHANGE, goog.bind(this.uiChanged_, this));
  this.ui_.draw(this.state_, this.getUiOptions(this.data_, this.options_));
  this.state_ = this.ui_.getState();
};
google.visualization.Control.prototype.disposeUi_ = function() {
  this.uiListener_ && (google.visualization.events.removeListener(this.uiListener_), goog.dispose(this.uiListener_), this.uiListener_ = null);
  goog.dispose(this.ui_);
  this.ui_ = null;
  goog.dom.removeChildren(this.container_);
};
google.visualization.Control.prototype.createUiInstance_ = function() {
  var ctorName = this.options_.inferStringValue("ui.type", this.getDefaultUiClass()), ctorFunction = gviz.util.VisCommon.resolveConstructor(ctorName);
  return ctorFunction ? new ctorFunction(this.container_) : null;
};
google.visualization.Control.prototype.uiChanged_ = function(evt) {
  this.state_ = this.ui_.getState();
  this.handleUiChangeEvent(this.state_, evt);
};
google.visualization.Control.prototype.handleUiChangeEvent = function(state, evt) {
  google.visualization.events.trigger(this, gviz.ControlEventType.STATE_CHANGE, evt);
};
google.visualization.Control.prototype.resetControl = function() {
  this.errorHandler_.safeExecute(this.resetControlInternal_, this);
};
google.visualization.Control.prototype.resetControlInternal_ = function() {
  this.initialState_ && (this.userState_ = this.initialState_, this.drawInternal_());
};
// INPUT (javascript/gviz/devel/jsapi/packages/controls/dag.js)
gviz.controls.DAG = function() {
  this.nodes_ = new goog.structs.Map;
  this.forwardEdges_ = new goog.structs.Map;
  this.backwardEdges_ = new goog.structs.Map;
};
gviz.controls.DAG.prototype.addEdge = function(parentNode, childNode) {
  this.containsEdge(parentNode, childNode) || (this.addNode_(parentNode), this.addNode_(childNode), this.addEdgeInternal_(parentNode, childNode, this.forwardEdges_), this.addEdgeInternal_(childNode, parentNode, this.backwardEdges_));
};
gviz.controls.DAG.prototype.removeEdge = function(parentNode, childNode) {
  this.containsEdge(parentNode, childNode) && (this.removeEdgeInternal_(parentNode, childNode, this.forwardEdges_), this.removeEdgeInternal_(childNode, parentNode, this.backwardEdges_), this.isIsolated_(parentNode) && this.removeNode_(parentNode), this.isIsolated_(childNode) && this.removeNode_(childNode));
};
gviz.controls.DAG.prototype.clear = function() {
  this.nodes_.clear();
  this.forwardEdges_.clear();
  this.backwardEdges_.clear();
};
gviz.controls.DAG.prototype.isEmpty = function() {
  return this.nodes_.isEmpty();
};
gviz.controls.DAG.prototype.isValid = function() {
  try {
    return this.topologicalSort(), !0;
  } catch (ex) {
    return!1;
  }
};
gviz.controls.DAG.prototype.getCount = function() {
  return this.nodes_.getCount();
};
gviz.controls.DAG.prototype.getValues = function() {
  return this.nodes_.getValues();
};
gviz.controls.DAG.prototype.contains = function(node) {
  return this.nodes_.containsKey(this.getKey_(node));
};
gviz.controls.DAG.prototype.containsEdge = function(parentNode, childNode) {
  var parentNodeKey = this.getKey_(parentNode);
  return this.forwardEdges_.containsKey(parentNodeKey) && this.forwardEdges_.get(parentNodeKey).contains(this.getKey_(childNode));
};
gviz.controls.DAG.prototype.isRoot = function(node) {
  return this.contains(node) ? !this.backwardEdges_.containsKey(this.getKey_(node)) : !1;
};
gviz.controls.DAG.prototype.getParents = function(node) {
  if (!this.contains(node)) {
    return null;
  }
  var parentKeys = this.backwardEdges_.get(this.getKey_(node));
  return parentKeys ? goog.structs.map(parentKeys, function(parentKey) {
    return this.nodes_.get(parentKey);
  }, this) : null;
};
gviz.controls.DAG.prototype.getChildren = function(node) {
  if (!this.contains(node)) {
    return null;
  }
  var childKeys = this.forwardEdges_.get(this.getKey_(node));
  return childKeys ? goog.structs.map(childKeys, function(childKey) {
    return this.nodes_.get(childKey);
  }, this) : null;
};
gviz.controls.DAG.prototype.getRoots = function() {
  if (this.nodes_.isEmpty()) {
    return[];
  }
  var roots = [];
  goog.structs.forEach(this.forwardEdges_, function(unused_value, key) {
    this.backwardEdges_.containsKey(key) || roots.push(this.nodes_.get(key));
  }, this);
  if (0 == roots.length) {
    throw Error("Invalid state: DAG has not root node(s).");
  }
  return roots;
};
gviz.controls.DAG.prototype.topologicalSort = function() {
  for (var backwardEdges = this.deepClone_(this.backwardEdges_), topsort = [], keysToProcess = goog.array.map(this.getRoots(), function(root) {
    return this.getKey_(root);
  }, this);0 < keysToProcess.length;) {
    for (var newRoots = [], i = 0;i < keysToProcess.length;i++) {
      var key = keysToProcess[i];
      topsort.push(this.nodes_.get(key));
      var childrenKeys = this.forwardEdges_.get(key);
      childrenKeys && goog.structs.forEach(childrenKeys, function(childKey) {
        backwardEdges.get(childKey).remove(key);
        backwardEdges.get(childKey).isEmpty() && (backwardEdges.remove(childKey), newRoots.push(childKey));
      });
    }
    keysToProcess = newRoots;
  }
  if (topsort.length != this.nodes_.getCount()) {
    throw Error("cycle detected");
  }
  return topsort;
};
gviz.controls.DAG.prototype.clone = function() {
  return this.isEmpty() ? new gviz.controls.DAG : gviz.controls.DAG.prototype.extractSubgraph.apply(this, this.getRoots());
};
gviz.controls.DAG.prototype.extractSubgraph = function(var_args) {
  var subgraph = new gviz.controls.DAG;
  if (0 == arguments.length) {
    return subgraph;
  }
  for (var i = 0;i < arguments.length;i++) {
    var parentNode = arguments[i];
    this.recursivelyBuildSubgraph_(parentNode, subgraph);
  }
  return subgraph;
};
gviz.controls.DAG.prototype.recursivelyBuildSubgraph_ = function(node, graph) {
  var children = this.getChildren(node);
  children && goog.structs.forEach(children, function(childNode) {
    graph.addEdge(node, childNode);
    this.recursivelyBuildSubgraph_(childNode, graph);
  }, this);
};
gviz.controls.DAG.prototype.isSubgraphDetachable = function(node) {
  for (var subgraph = this.extractSubgraph(node), subgraphNodes = subgraph.getValues(), i = 0;i < subgraphNodes.length;i++) {
    var subgraphNode = subgraphNodes[i];
    if (subgraphNode != node && subgraph.getParents(subgraphNode).length != this.getParents(subgraphNode).length) {
      return!1;
    }
  }
  return!0;
};
gviz.controls.DAG.prototype.getKey_ = function(val) {
  var type = typeof val;
  return "object" == type && val || "function" == type ? "o" + goog.getUid(val) : type.substr(0, 1) + val;
};
gviz.controls.DAG.prototype.addNode_ = function(node) {
  this.nodes_.set(this.getKey_(node), node);
};
gviz.controls.DAG.prototype.removeNode_ = function(node) {
  this.nodes_.remove(this.getKey_(node));
};
gviz.controls.DAG.prototype.addEdgeInternal_ = function(startNode, endNode, edgeMap) {
  var edgesFromStartNode = edgeMap.get(this.getKey_(startNode));
  edgesFromStartNode || (edgesFromStartNode = new goog.structs.Set, edgeMap.set(this.getKey_(startNode), edgesFromStartNode));
  edgesFromStartNode.add(this.getKey_(endNode));
};
gviz.controls.DAG.prototype.removeEdgeInternal_ = function(startNode, endNode, edgeMap) {
  goog.asserts.assert(edgeMap.containsKey(this.getKey_(startNode)));
  var edgesFromStartNode = edgeMap.get(this.getKey_(startNode));
  edgesFromStartNode.remove(this.getKey_(endNode));
  edgesFromStartNode.isEmpty() && edgeMap.remove(this.getKey_(startNode));
};
gviz.controls.DAG.prototype.isIsolated_ = function(node) {
  return!this.forwardEdges_.containsKey(this.getKey_(node)) && !this.backwardEdges_.containsKey(this.getKey_(node));
};
gviz.controls.DAG.prototype.deepClone_ = function(edgesMap) {
  var cloneMap = new goog.structs.Map;
  goog.structs.forEach(edgesMap, function(endNodeKeys, startNodekey) {
    cloneMap.set(startNodekey, endNodeKeys.clone());
  });
  return cloneMap;
};
// INPUT (javascript/gviz/devel/jsapi/packages/controls/choreographer.js)
google.visualization.Choreographer = function(container) {
  goog.Disposable.call(this);
  this.participantsGraph_ = new gviz.controls.DAG;
  this.incomingData_ = null;
  this.listeners_ = [];
  this.errorHandler_ = new gviz.ErrorHandler(this, container);
  this.drawIteration_ = null;
};
goog.inherits(google.visualization.Choreographer, goog.Disposable);
google.visualization.Choreographer.prototype.disposeInternal = function() {
  this.clear();
  google.visualization.Choreographer.superClass_.disposeInternal.call(this);
};
google.visualization.Choreographer.prototype.clear = function() {
  goog.array.forEach(this.listeners_, function(listener) {
    google.visualization.events.removeListener(listener);
  });
  this.listeners_ = [];
  this.drawIteration_ = null;
  this.participantsGraph_.clear();
};
google.visualization.Choreographer.prototype.handleError_ = function(message) {
  if (goog.DEBUG) {
    throw Error(message);
  }
  this.errorHandler_.addError(message);
};
google.visualization.Choreographer.prototype.bind = function(control, participant) {
  if (google.visualization.Choreographer.looksLikeControl_(control)) {
    if (google.visualization.Choreographer.looksLikeParticipant_(participant)) {
      var controlUid = goog.getUid(control), participantUid = goog.getUid(participant);
      if (participantUid == controlUid) {
        this.handleError_("Cannot bind a control to itself.");
      } else {
        var newParticipants = [];
        this.participantsGraph_.contains(control) || newParticipants.push(control);
        this.participantsGraph_.contains(participant) || newParticipants.push(participant);
        this.participantsGraph_.addEdge(control, participant);
        if (this.areBindingsValid_()) {
          for (var i = 0;i < newParticipants.length;i++) {
            this.listeners_.push(google.visualization.events.addListener(newParticipants[i], gviz.ControlEventType.STATE_CHANGE, goog.bind(this.handleParticipantStateChange_, this, newParticipants[i]))), this.listeners_.push(google.visualization.events.addListener(newParticipants[i], gviz.ControlEventType.READY, goog.bind(this.handleParticipantReady_, this, newParticipants[i]))), this.listeners_.push(google.visualization.events.addListener(newParticipants[i], gviz.ControlEventType.ERROR, goog.bind(this.handleParticipantError_, 
            this, newParticipants[i])));
          }
        } else {
          this.participantsGraph_.removeEdge(control, participant);
        }
      }
    } else {
      this.handleError_(participant + " does not fit either the Control or Visualization specification.");
    }
  } else {
    this.handleError_(control + " does not fit the Control specification.");
  }
};
google.visualization.Choreographer.prototype.draw = function(dataTable) {
  if (dataTable && !this.participantsGraph_.isEmpty()) {
    this.incomingData_ = google.visualization.datautils.normalizeDataTable(dataTable);
    this.drawIteration_ = new gviz.controls.DrawIteration_(this);
    for (var rootParticipants = this.participantsGraph_.getRoots(), i = 0;i < rootParticipants.length;i++) {
      rootParticipants[i].setDataTable(this.incomingData_);
    }
    this.drawIteration_.start(rootParticipants);
  }
};
google.visualization.Choreographer.prototype.areBindingsValid_ = function() {
  return this.participantsGraph_.isValid() ? !0 : (this.handleError_("The requested control and participant cannot be bound together, as this would introduce a dependency cycle"), !1);
};
google.visualization.Choreographer.looksLikeParticipant_ = function(wrapper) {
  return goog.isObject(wrapper) && goog.isFunction(wrapper.draw) && goog.isFunction(wrapper.setDataTable);
};
google.visualization.Choreographer.looksLikeControl_ = function(wrapper) {
  return google.visualization.Choreographer.looksLikeParticipant_(wrapper) && goog.isFunction(wrapper.getControl);
};
google.visualization.Choreographer.prototype.isValidControl_ = function(wrapper) {
  var controlObj = wrapper.getControl();
  return goog.isObject(controlObj) ? goog.isFunction(controlObj.applyOperator) ? this.participantsGraph_.isSubgraphDetachable(wrapper) : goog.isFunction(controlObj.apply) ? !0 : !1 : !1;
};
google.visualization.Choreographer.prototype.handleParticipantStateChange_ = function(participant) {
  goog.asserts.assert(this.participantsGraph_.contains(participant));
  this.drawIteration_ = this.drawIteration_ || new gviz.controls.DrawIteration_(this);
  this.drawIteration_.handleParticipantChanged(participant);
};
google.visualization.Choreographer.prototype.handleParticipantReady_ = function(participant) {
  goog.asserts.assert(this.participantsGraph_.contains(participant));
  google.visualization.Choreographer.looksLikeControl_(participant) && !this.isValidControl_(participant) ? this.handleError_(participant + " does not fit the Control specification while handling 'ready' event.") : (this.drawIteration_ = this.drawIteration_ || new gviz.controls.DrawIteration_(this), this.drawIteration_.handleParticipantChanged(participant));
};
google.visualization.Choreographer.prototype.handleParticipantError_ = function(participant) {
  goog.asserts.assert(this.participantsGraph_.contains(participant));
  this.drawIteration_ && this.drawIteration_.handleError(participant);
};
google.visualization.Choreographer.prototype.drawIterationCompleted_ = function(success) {
  goog.asserts.assert(this.drawIteration_);
  success ? google.visualization.events.trigger(this, gviz.ControlEventType.READY, null) : this.handleError_("One or more participants failed to draw()");
  this.drawIteration_ = null;
};
google.visualization.Choreographer.prototype.mergeDataViews = function(dataviews) {
  goog.asserts.assert(0 < dataviews.length);
  if (1 == dataviews.length) {
    return dataviews[0];
  }
  var masterView = dataviews[0], otherViews = goog.array.slice(dataviews, 1), rowIntersection = this.computeRowIntersection_(masterView, otherViews), columnIntersection = this.computeColumnIntersection_(masterView, otherViews), outputView = new google.visualization.DataView(masterView);
  outputView.setRows(rowIntersection);
  outputView.setColumns(columnIntersection);
  return outputView;
};
google.visualization.Choreographer.prototype.computeRowIntersection_ = function(masterDataview, dataviews) {
  goog.asserts.assert(0 < dataviews.length);
  for (var rowSet = new goog.structs.Set(this.getIncomingTableRowIndexes_(dataviews[0])), i = 1;i < dataviews.length && (rowSet = rowSet.intersection(this.getIncomingTableRowIndexes_(dataviews[i])), !rowSet.isEmpty());i++) {
  }
  for (var rowIntersection = [], r = 0;r < masterDataview.getNumberOfRows();r++) {
    rowSet.contains(this.getIncomingTableRowIndex_(masterDataview, r)) && rowIntersection.push(r);
  }
  return rowIntersection;
};
google.visualization.Choreographer.prototype.computeColumnIntersection_ = function(masterDataview, dataviews) {
  goog.asserts.assert(0 < dataviews.length);
  for (var columnSet = new goog.structs.Set(this.getIncomingTableColumnIndexes_(dataviews[0])), i = 1;i < dataviews.length && (columnSet = columnSet.intersection(this.getIncomingTableColumnIndexes_(dataviews[i])), !columnSet.isEmpty());i++) {
  }
  for (var columnIntersection = [], c = 0;c < masterDataview.getNumberOfColumns();c++) {
    columnSet.contains(this.getIncomingTableColumnIndex_(masterDataview, c)) && columnIntersection.push(c);
  }
  return columnIntersection;
};
google.visualization.Choreographer.prototype.getIncomingTableRowIndexes_ = function(dataview) {
  for (var indexes = [], i = 0;i < dataview.getNumberOfRows();i++) {
    var index = this.getIncomingTableRowIndex_(dataview, i);
    null != index && indexes.push(index);
  }
  return indexes;
};
google.visualization.Choreographer.prototype.getIncomingTableRowIndex_ = function(dataview, i) {
  for (var rowIndex = i, dv = dataview;dv !== this.incomingData_;) {
    rowIndex = dv.getTableRowIndex(rowIndex), dv = dv.getDataTable();
  }
  return rowIndex;
};
google.visualization.Choreographer.prototype.getIncomingTableColumnIndexes_ = function(dataview) {
  for (var indexes = [], i = 0;i < dataview.getNumberOfColumns();i++) {
    var index = this.getIncomingTableColumnIndex_(dataview, i);
    null != index && indexes.push(index);
  }
  return indexes;
};
google.visualization.Choreographer.prototype.getIncomingTableColumnIndex_ = function(dataview, i) {
  for (var columnIndex = i, dv = dataview;dv !== this.incomingData_ && -1 !== columnIndex;) {
    columnIndex = dv.getTableColumnIndex(columnIndex), dv = dv.getDataTable();
  }
  -1 == columnIndex && (columnIndex = null);
  return columnIndex;
};
gviz.controls.DrawIteration_ = function(choreographer) {
  this.choreographer_ = choreographer;
  this.participantsGraph_ = choreographer.participantsGraph_.clone();
  this.stateMap_ = {};
  for (var allParticipants = this.participantsGraph_.getValues(), i = 0;i < allParticipants.length;i++) {
    this.transition_(allParticipants[i], gviz.controls.DrawIteration_.State.READY);
  }
};
gviz.controls.DrawIteration_.State = {PENDING:"pending", DRAWING:"drawing", READY:"ready", ERROR:"error"};
gviz.controls.DrawIteration_.prototype.start = function(roots) {
  gviz.controls.DrawIteration_.prototype.markAllDependenciesAsPending_.apply(this, roots);
  for (var i = 0;i < roots.length;i++) {
    this.draw_(roots[i]);
  }
};
gviz.controls.DrawIteration_.prototype.handleParticipantChanged = function(participant) {
  if (this.participantsGraph_.contains(participant)) {
    switch(this.getState_(participant)) {
      case gviz.controls.DrawIteration_.State.PENDING:
        break;
      case gviz.controls.DrawIteration_.State.ERROR:
        break;
      case gviz.controls.DrawIteration_.State.DRAWING:
        this.transition_(participant, gviz.controls.DrawIteration_.State.READY);
        this.drawDependencies_(participant);
        break;
      case gviz.controls.DrawIteration_.State.READY:
        this.markAllDependenciesAsPending_(participant);
        this.drawDependencies_(participant);
        break;
      default:
        goog.asserts.fail("Invalid participant state: " + this.getState_(participant));
    }
    this.checkIfIterationFinished_();
  }
};
gviz.controls.DrawIteration_.prototype.handleError = function(participant) {
  if (this.participantsGraph_.contains(participant)) {
    switch(this.getState_(participant)) {
      case gviz.controls.DrawIteration_.State.PENDING:
      ;
      case gviz.controls.DrawIteration_.State.READY:
      ;
      case gviz.controls.DrawIteration_.State.ERROR:
        break;
      case gviz.controls.DrawIteration_.State.DRAWING:
        this.transition_(participant, gviz.controls.DrawIteration_.State.ERROR);
        this.abortAllDependencies_(participant);
        break;
      default:
        goog.asserts.fail("Invalid participant state:" + this.getState_(participant));
    }
    this.checkIfIterationFinished_();
  }
};
gviz.controls.DrawIteration_.prototype.checkIfIterationFinished_ = function() {
  var errorParticipants = 0, success = goog.object.every(this.stateMap_, function(state) {
    if (state == gviz.controls.DrawIteration_.State.ERROR) {
      errorParticipants++;
    } else {
      if (state != gviz.controls.DrawIteration_.State.READY) {
        return!1;
      }
    }
    return!0;
  }, this);
  success && this.choreographer_.drawIterationCompleted_(0 == errorParticipants);
};
gviz.controls.DrawIteration_.prototype.getState_ = function(participant) {
  return this.stateMap_[goog.getUid(participant)];
};
gviz.controls.DrawIteration_.prototype.transition_ = function(participant, state) {
  this.stateMap_[goog.getUid(participant)] = state;
};
gviz.controls.DrawIteration_.prototype.markAllDependenciesAsPending_ = function(var_args) {
  for (var subgraph = gviz.controls.DAG.prototype.extractSubgraph.apply(this.participantsGraph_, arguments), subgraphParticipants = subgraph.getValues(), i = 0;i < subgraphParticipants.length;i++) {
    subgraph.isRoot(subgraphParticipants[i]) || this.transition_(subgraphParticipants[i], gviz.controls.DrawIteration_.State.PENDING);
  }
};
gviz.controls.DrawIteration_.prototype.abortAllDependencies_ = function(participant) {
  for (var dependencies = this.participantsGraph_.extractSubgraph(participant).getValues(), i = 1;i < dependencies.length;i++) {
    this.transition_(dependencies[i], gviz.controls.DrawIteration_.State.ERROR);
  }
};
gviz.controls.DrawIteration_.prototype.draw_ = function(participant) {
  this.transition_(participant, gviz.controls.DrawIteration_.State.DRAWING);
  var protectedDraw = google.visualization.errors.createProtectedCallback(function() {
    participant.draw();
  }, goog.bind(this.handleError, this, participant));
  goog.Timer.callOnce(protectedDraw);
};
gviz.controls.DrawIteration_.prototype.drawDependencies_ = function(participant) {
  var childParticipants = this.participantsGraph_.getChildren(participant);
  if (childParticipants) {
    var control = participant.getControl();
    control.setDependencies && control.setDependencies(childParticipants);
    for (var i = 0;i < childParticipants.length;i++) {
      var child = childParticipants[i];
      if (this.allParentsAreReady_(child)) {
        var mergedData = this.computeMergedView_(child);
        child.setDataTable(mergedData);
        this.draw_(child);
      }
    }
  }
};
gviz.controls.DrawIteration_.prototype.allParentsAreReady_ = function(participant) {
  var parents = this.participantsGraph_.getParents(participant);
  if (!parents) {
    return!0;
  }
  for (var i = 0;i < parents.length;i++) {
    if (this.getState_(parents[i]) != gviz.controls.DrawIteration_.State.READY) {
      return!1;
    }
  }
  return!0;
};
gviz.controls.DrawIteration_.prototype.computeMergedView_ = function(participant) {
  var affectingDataviews = goog.array.map(this.participantsGraph_.getParents(participant), function(parentParticipant) {
    var control = parentParticipant.getControl();
    if (goog.isFunction(control.apply)) {
      return control.apply.call(control);
    }
    goog.asserts.fail("Invalid Control in draw iteration: " + control);
  });
  return this.choreographer_.mergeDataViews(affectingDataviews);
};
// INPUT (javascript/gviz/devel/jsapi/packages/controls/dashboard.js)
google.visualization.Dashboard = function(container) {
  goog.Disposable.call(this);
  this.container_ = container;
  this.choreographer_ = new google.visualization.Choreographer(container);
  this.bindEvents_();
};
goog.inherits(google.visualization.Dashboard, goog.Disposable);
google.visualization.Dashboard.prototype.disposeInternal = function() {
  this.clear();
  goog.dispose(this.readyListener_);
  goog.dispose(this.errorListener_);
  goog.dispose(this.choreographer_);
  google.visualization.Dashboard.superClass_.disposeInternal.call(this);
};
google.visualization.Dashboard.prototype.clear = function() {
  google.visualization.events.removeListener(this.readyListener_);
  google.visualization.events.removeListener(this.errorListener_);
  this.choreographer_.clear();
};
google.visualization.Dashboard.prototype.bind = function(controls, participants) {
  goog.isArray(controls) || (controls = [controls]);
  goog.isArray(participants) || (participants = [participants]);
  for (var c = 0;c < controls.length;c++) {
    for (var p = 0;p < participants.length;p++) {
      this.choreographer_.bind(controls[c], participants[p]);
    }
  }
  return this;
};
google.visualization.Dashboard.prototype.draw = function(dataTable) {
  this.choreographer_.draw(dataTable);
};
google.visualization.Dashboard.prototype.getContainer = function() {
  return this.container_;
};
google.visualization.Dashboard.prototype.bindEvents_ = function() {
  goog.dispose(this.readyListener_);
  this.readyListener_ = google.visualization.events.addListener(this.choreographer_, gviz.ControlEventType.READY, goog.bind(this.handleChoreographerEvent_, this, gviz.ControlEventType.READY));
  goog.dispose(this.errorListener_);
  this.errorListener_ = google.visualization.events.addListener(this.choreographer_, gviz.ControlEventType.ERROR, goog.bind(this.handleChoreographerEvent_, this, gviz.ControlEventType.ERROR));
};
google.visualization.Dashboard.prototype.handleChoreographerEvent_ = function(eventType, opt_payload) {
  google.visualization.events.trigger(this, eventType, opt_payload || null);
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/dashboardwrapper.js)
google.visualization.DashboardWrapper = function(opt_specification) {
  gviz.Wrapper.call(this, gviz.Wrapper.Kind.DASHBOARD, opt_specification);
  var spec = opt_specification || {};
  goog.isString(spec) && (spec = gviz.json.deserialize(spec));
  this.wrappers_ = spec.wrappers || null;
  this.bindings_ = spec.bindings || null;
  this.setType(spec.dashboardType || "Dashboard");
  this.initWrappersAndBindings_();
};
goog.inherits(google.visualization.DashboardWrapper, gviz.Wrapper);
google.visualization.DashboardWrapper.prototype.drawFromDataTable = function(container, dataTable) {
  goog.dispose(this.visualization);
  container = gviz.util.VisCommon.validateContainer(container);
  for (var dashboard = new google.visualization.Dashboard(container), bindings = this.bindings_ || [], wrappers = this.wrappers_, numBindings = bindings.length, getWrapper = function(index) {
    return wrappers[index];
  }, i = 0;i < numBindings;i++) {
    var controls = goog.array.map(bindings[i].controls, getWrapper), participants = goog.array.map(bindings[i].participants, getWrapper);
    dashboard.bind(controls, participants);
  }
  this.visualization = dashboard;
  google.visualization.DashboardWrapper.superClass_.drawFromDataTable.call(this, container, dataTable);
};
google.visualization.DashboardWrapper.prototype.addToJson = function(jsonObj) {
  jsonObj.wrappers = this.wrappers_ ? goog.array.map(this.wrappers_, function(wrapper) {
    return wrapper.toJSON();
  }) : void 0;
  jsonObj.bindings = this.bindings_ || void 0;
};
google.visualization.DashboardWrapper.prototype.setWrappers = function(wrappers) {
  this.wrappers_ = wrappers || null;
  this.initWrappersAndBindings_();
};
google.visualization.DashboardWrapper.prototype.getWrappers = function() {
  return this.wrappers_;
};
google.visualization.DashboardWrapper.prototype.setBindings = function(bindings) {
  this.bindings_ = bindings || null;
  this.initWrappersAndBindings_();
};
google.visualization.DashboardWrapper.prototype.getBindings = function() {
  return this.bindings_;
};
google.visualization.DashboardWrapper.prototype.getDashboard = gviz.Wrapper.prototype.getVisualization;
google.visualization.DashboardWrapper.prototype.setDashboardName = gviz.Wrapper.prototype.setName;
google.visualization.DashboardWrapper.prototype.getDashboardName = gviz.Wrapper.prototype.getName;
google.visualization.DashboardWrapper.prototype.initWrappersAndBindings_ = function() {
  var wrappersSpec = this.wrappers_;
  if (!goog.isNull(wrappersSpec) && !goog.isArray(wrappersSpec)) {
    var wrappersArray = [];
    goog.object.forEach(wrappersSpec, function(wrapper, name) {
      this.isWrapperLike_(wrapper) || (wrapper = google.visualization.createWrapper(wrapper));
      wrapper.setName(name);
      wrappersArray.push(wrapper);
    }, this);
    wrappersSpec = wrappersArray;
  }
  var bindingsSpec = this.bindings_;
  google.visualization.DashboardWrapper.isEmptyArraySafe_(wrappersSpec) && google.visualization.DashboardWrapper.isEmptyArraySafe_(bindingsSpec) || (this.wrappers_ = goog.array.map(wrappersSpec, this.normalizeWrapper_, this), this.bindings_ = goog.array.map(bindingsSpec, this.normalizeBinding_, this));
};
google.visualization.DashboardWrapper.prototype.normalizeWrapper_ = function(wrapper) {
  this.isWrapperLike_(wrapper) || (wrapper = google.visualization.createWrapper(wrapper));
  wrapper.setDataTable(null);
  wrapper.setDataSourceUrl(null);
  return wrapper;
};
google.visualization.DashboardWrapper.prototype.normalizeBinding_ = function(binding) {
  var controls = binding.controls, participants = binding.participants;
  if (google.visualization.DashboardWrapper.isEmptyArraySafe_(controls) || google.visualization.DashboardWrapper.isEmptyArraySafe_(participants)) {
    throw Error("invalid binding: " + binding);
  }
  controls = goog.array.map(controls, this.findBindingWrapperIndex_, this);
  participants = goog.array.map(participants, this.findBindingWrapperIndex_, this);
  return{controls:controls, participants:participants};
};
google.visualization.DashboardWrapper.prototype.findBindingWrapperIndex_ = function(arg) {
  var wrapper = arg;
  if (this.isInputWrapperLike_(arg)) {
    return this.isWrapperLike_(wrapper) || (wrapper = google.visualization.createWrapper(wrapper)), this.wrappers_.push(wrapper), this.wrappers_.length - 1;
  }
  var names = this.getWrappersNames_(), index = goog.string.isEmptySafe(wrapper) ? -1 : goog.array.indexOf(names, wrapper);
  if (-1 == index) {
    throw Error("Invalid wrapper name: " + wrapper);
  }
  return index;
};
google.visualization.DashboardWrapper.prototype.isWrapperLike_ = function(wrapper) {
  return goog.isFunction(wrapper.toJSON);
};
google.visualization.DashboardWrapper.prototype.isInputWrapperLike_ = function(wrapper) {
  var objectLike = /^{.*}$/;
  return goog.isObject(wrapper) || goog.isString(wrapper) && objectLike.test(wrapper);
};
google.visualization.DashboardWrapper.prototype.getWrappersNames_ = function() {
  return goog.array.map(this.wrappers_, function(wrapper) {
    return wrapper.getName();
  });
};
google.visualization.DashboardWrapper.isEmptyArraySafe_ = function(arr) {
  return goog.isArray(arr) ? goog.array.isEmpty(arr) : !0;
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/context.js)
google.visualization.context = {};
gviz.context = {};
google.visualization.drawChart = function(specification, opt_container) {
  google.visualization.createWrapper(specification).draw(opt_container);
};
google.visualization.drawFromUrl = function(container, opt_url) {
  var url = new goog.Uri(opt_url || document.location.href), json = url.getParameterValue("json"), specification;
  goog.isDefAndNotNull(json) ? specification = json : (specification = {}, goog.array.forEach(url.getQueryData().getKeys(), function(key) {
    var value = url.getParameterValue(key);
    try {
      goog.isDefAndNotNull(value) && (value = gviz.json.deserialize(value));
    } catch (x) {
    }
    specification[key] = value;
  }), specification.options = goog.object.unsafeClone(specification));
  google.visualization.drawChart(specification, container);
};
google.visualization.createUrl = function(specification, opt_pageUrl) {
  goog.isString(specification) && (specification = gviz.json.deserialize(specification));
  var result = [], value, key;
  for (key in specification) {
    if ("options" == key) {
      var options = specification[key], option;
      for (option in options) {
        value = options[option], goog.isString(value) || (value = gviz.json.serialize(value)), result.push(option + "=" + goog.string.urlEncode(value));
      }
    } else {
      value = specification[key], goog.isString(value) || (value = goog.isFunction(value.toJSON) ? value.toJSON() : gviz.json.serialize(value)), result.push(key + "=" + goog.string.urlEncode(value));
    }
  }
  var chartHtmlPage = gviz.util.VisCommon.getModulePath() + "/chart.html", chartHtmlPage = gviz.context.removeProtocol_(chartHtmlPage), pageUrl = opt_pageUrl || chartHtmlPage, result = pageUrl + "?" + result.join("&"), result = result.replace(/'/g, "%27");
  return result = result.replace(/"/g, "%22");
};
google.visualization.createSnippet = function(specification) {
  var bootstrapUrl = gviz.util.VisCommon.getModulePath() + "/chart.js", bootstrapUrl = gviz.context.removeProtocol_(bootstrapUrl), res = '<script type="text/javascript" src="' + bootstrapUrl + '">\n', json = google.visualization.createWrapper(specification).toJSON(), json = json.replace(/</g, "&lt;"), json = json.replace(/>/g, "&gt;"), res = res + json;
  return res += "\n\x3c/script>";
};
google.visualization.createWrapper = function(specification) {
  specification = specification || {};
  goog.isString(specification) && (specification = gviz.json.deserialize(specification));
  return specification.controlType ? new google.visualization.ControlWrapper(specification) : specification.dashboardType ? new google.visualization.DashboardWrapper(specification) : new google.visualization.ChartWrapper(specification);
};
gviz.context.removeProtocol_ = function(url) {
  return url.replace(/^https?:/, "");
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/converters/feedtodatatable.js)
gviz.FeedToDataTable = function() {
  gviz.FeedToDataTable.prototype.namespaceMap_ = null;
  gviz.FeedToDataTable.prototype.defaultNamespacePrefix_ = null;
  this.columns_ = [];
};
gviz.FeedToDataTable.getKnownFeedTypeNameFromXmlDoc = function(feed) {
  return gviz.FeedToDataTable.getKnownFeedTypeNameFromRunner_(new gviz.FeedToDataTable.DomFeedRunner_(feed));
};
gviz.FeedToDataTable.getKnownFeedTypeNameFromJson = function(feed) {
  return gviz.FeedToDataTable.getKnownFeedTypeNameFromRunner_(new gviz.FeedToDataTable.JsonFeedRunner_(feed));
};
gviz.FeedToDataTable.prototype.addColumn = function(path, type, opt_label, opt_id) {
  if (!gviz.FeedToDataTable.FeedRunner_.isValidColumnType(type)) {
    throw Error("Invalid type: " + type);
  }
  this.columns_.push(new gviz.FeedToDataTable.ColumnDefinition(path, type, opt_label, opt_id));
};
gviz.FeedToDataTable.getKnownFeedTypeNameFromRunner_ = function(runner) {
  var feedDefinition;
  try {
    feedDefinition = gviz.FeedToDataTable.getKnownFeedDefinitionFromRunner_(runner);
  } catch (e) {
    return null;
  }
  return feedDefinition.getFeedTypeName();
};
gviz.FeedToDataTable.getKnownFeedDefinitionFromRunner_ = function(runner) {
  var feedUrl = runner.findFeedUrl();
  if (!feedUrl) {
    throw Error("Unable to determine feed type because it lacks a self link");
  }
  var feedDefinition = gviz.FeedToDataTable.KnownFeeds.findFeedDefinition(feedUrl);
  if (!feedDefinition) {
    throw Error("Not a known feed url: " + feedUrl);
  }
  return feedDefinition;
};
gviz.FeedToDataTable.ColumnDefinition = function(path, type, opt_label, opt_id) {
  this.path_ = path;
  this.type_ = type;
  this.label_ = opt_label;
  this.id_ = opt_id;
};
gviz.FeedToDataTable.ColumnDefinition.prototype.getPath = function() {
  return this.path_;
};
gviz.FeedToDataTable.ColumnDefinition.prototype.getType = function() {
  return this.type_;
};
gviz.FeedToDataTable.ColumnDefinition.prototype.getLabel = function() {
  return this.label_;
};
gviz.FeedToDataTable.ColumnDefinition.prototype.getId = function() {
  return this.id_;
};
gviz.FeedToDataTable.FeedDefinition = function(rowPath, columns) {
  this.columns_ = columns;
};
gviz.FeedToDataTable.KnownFeedDefinition = function(feedTypeName, urlPattern, rowPath, columns) {
  gviz.FeedToDataTable.FeedDefinition.call(this, rowPath, columns);
  this.feedTypeName_ = feedTypeName;
  this.urlPattern_ = urlPattern;
};
goog.inherits(gviz.FeedToDataTable.KnownFeedDefinition, gviz.FeedToDataTable.FeedDefinition);
gviz.FeedToDataTable.KnownFeedDefinition.prototype.getFeedTypeName = function() {
  return this.feedTypeName_;
};
gviz.FeedToDataTable.KnownFeedDefinition.prototype.getUrlPattern = function() {
  return this.urlPattern_;
};
gviz.FeedToDataTable.FeedRunner_ = function(feed) {
  this.feed_ = feed;
};
gviz.FeedToDataTable.FeedRunner_.DEFAULT_NAMESPACE_PREFIX_ = "atom";
gviz.FeedToDataTable.FeedRunner_.isValidColumnType = function(columnType) {
  return null != gviz.FeedToDataTable.FeedRunner_.TYPE_CONVERTERS_[columnType];
};
gviz.FeedToDataTable.FeedRunner_.prototype.findFeedUrl = function() {
  this.feedUrl_ = null;
  this.visitXPath("atom:feed/atom:link/@rel", this.checkLink_);
  return this.feedUrl_;
};
gviz.FeedToDataTable.FeedRunner_.prototype.checkLink_ = function(node) {
  if ("self" != node.getValue()) {
    return!1;
  }
  this.visitXPath("../@href", this.getLink_, node);
  return!0;
};
gviz.FeedToDataTable.FeedRunner_.prototype.getLink_ = function(node) {
  this.feedUrl_ = node.getValue();
  return!0;
};
gviz.FeedToDataTable.FeedRunner_.BOOLEAN_STRINGS_ = {"true":!0, "false":!1, t:!0, f:!1, yes:!0, no:!1, 1:!0, 0:!1};
gviz.FeedToDataTable.FeedRunner_.parseBoolean_ = function(s) {
  if (!s) {
    return null;
  }
  var v = gviz.FeedToDataTable.FeedRunner_.BOOLEAN_STRINGS_[s.toLowerCase()];
  if (null == v) {
    throw Error("Invalid boolean value: " + s);
  }
  return v;
};
gviz.FeedToDataTable.FeedRunner_.parseNumber_ = function(s) {
  if (!s) {
    return null;
  }
  var v = parseFloat(s);
  if (isNaN(v)) {
    throw Error("Invalid number value: " + s);
  }
  return v;
};
gviz.FeedToDataTable.FeedRunner_.parseString_ = function(s) {
  return s;
};
gviz.FeedToDataTable.FeedRunner_.parseIsoDate_ = function(s) {
  if (!s) {
    return null;
  }
  var closureDate = goog.date.fromIsoString(s);
  if (null == closureDate) {
    throw Error("Invalid datetime value: " + s);
  }
  var v = new Date;
  v.setTime(closureDate.getTime());
  return v;
};
gviz.FeedToDataTable.FeedRunner_.TYPE_CONVERTERS_ = {"boolean":gviz.FeedToDataTable.FeedRunner_.parseBoolean_, number:gviz.FeedToDataTable.FeedRunner_.parseNumber_, string:gviz.FeedToDataTable.FeedRunner_.parseString_, date:gviz.FeedToDataTable.FeedRunner_.parseIsoDate_, datetime:gviz.FeedToDataTable.FeedRunner_.parseIsoDate_};
gviz.FeedToDataTable.DomFeedRunner_ = function(feed, opt_namespaceMap, opt_defaultNamespacePrefix) {
  if (null == feed) {
    throw Error("Null feed");
  }
  gviz.FeedToDataTable.FeedRunner_.call(this, new gviz.FeedToDataTable.DomFeedNode_(feed));
  this.feedDocument_ = feed;
  this.namespaceMap_ = opt_namespaceMap || {};
  if (!opt_namespaceMap) {
    var top = feed.documentElement;
    if (top) {
      var attributes = top.attributes;
      if (attributes) {
        for (var nAttributes = attributes.length, i = 0;i < nAttributes;i++) {
          var attribute = attributes.item(i), match = this.XMLNS_ATTRIBUTE_NAME_REGEXP_.exec(attribute.nodeName);
          if (match) {
            var prefix = match[1] || opt_defaultNamespacePrefix || gviz.FeedToDataTable.FeedRunner_.DEFAULT_NAMESPACE_PREFIX_, value = attribute.nodeValue, oldValue = this.namespaceMap_[prefix];
            if (null != oldValue && oldValue != value) {
              throw Error("namespace prefix " + prefix + " is overloaded to both " + oldValue + " and " + value);
            }
            this.namespaceMap_[prefix] = value;
          }
        }
      }
    }
  }
  if ("undefined" != typeof feed.selectNodes && "undefined" != typeof feed.setProperty) {
    this.selectNodes_ = this.selectNodesForIE_;
    feed.setProperty("SelectionLanguage", "XPath");
    var namespaceArray = [];
    for (prefix in this.namespaceMap_) {
      namespaceArray.push("xmlns:" + prefix + "='" + this.namespaceMap_[prefix] + "'");
    }
    var namespaceString = namespaceArray.join(" ");
    feed.setProperty("SelectionNamespaces", namespaceString);
  } else {
    if (feed.implementation.hasFeature("XPath", "3.0")) {
      this.selectNodes_ = this.selectNodesForNonIE_, this.resolveNamespace_ = gviz.FeedToDataTable.DomFeedRunner_.createResolver_(this.namespaceMap_);
    } else {
      throw Error("No browser support for XPath 3.0");
    }
  }
};
goog.inherits(gviz.FeedToDataTable.DomFeedRunner_, gviz.FeedToDataTable.FeedRunner_);
gviz.FeedToDataTable.DomFeedRunner_.prototype.XMLNS_ATTRIBUTE_NAME_REGEXP_ = /^xmlns(?::(.+))?$/i;
gviz.FeedToDataTable.DomFeedRunner_.prototype.visitXPath = function(path, handler, opt_contextNode) {
  for (var contextNode = opt_contextNode || this.feed_, nodes = this.selectNodes_(path, contextNode.getDomNode()), nNodes = nodes.length, i = 0;i < nNodes && !handler.call(this, new gviz.FeedToDataTable.DomFeedNode_(nodes[i]));i++) {
  }
};
gviz.FeedToDataTable.DomFeedRunner_.prototype.selectNodesForIE_ = function(path, contextNode) {
  return contextNode.selectNodes(path);
};
gviz.FeedToDataTable.DomFeedRunner_.prototype.selectNodesForNonIE_ = function(path, contextNode) {
  for (var nodes = this.feedDocument_.evaluate(path, contextNode, this.resolveNamespace_, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), results = [], count = nodes.snapshotLength, i = 0;i < count;i++) {
    results.push(nodes.snapshotItem(i));
  }
  return results;
};
gviz.FeedToDataTable.DomFeedRunner_.createResolver_ = function(map) {
  return function(prefix) {
    return map[prefix];
  };
};
gviz.FeedToDataTable.JsonFeedRunner_ = function(feed, opt_defaultNamespacePrefix) {
  if (null == feed) {
    throw Error("Null feed");
  }
  gviz.FeedToDataTable.FeedRunner_.call(this, new gviz.FeedToDataTable.JsonFeedNode_(feed));
  this.defaultNamespacePrefix_ = (opt_defaultNamespacePrefix || gviz.FeedToDataTable.FeedRunner_.DEFAULT_NAMESPACE_PREFIX_) + ":";
};
goog.inherits(gviz.FeedToDataTable.JsonFeedRunner_, gviz.FeedToDataTable.FeedRunner_);
gviz.FeedToDataTable.JsonFeedRunner_.buildXPathRegExp_ = function() {
  return/^(?:(?:(?:@)?[_a-z0-9-]+(?::[_a-z0-9-]+)?|\.|\.\.)(?:\/(?:(?:@)?[_a-z0-9-]+(?::[_a-z0-9-]+)?|\.|\.\.))*)?$/i;
};
gviz.FeedToDataTable.JsonFeedRunner_.XPATH_REGEXP_ = gviz.FeedToDataTable.JsonFeedRunner_.buildXPathRegExp_();
gviz.FeedToDataTable.JsonFeedRunner_.prototype.visitXPath = function(path, handler, opt_contextNode) {
  var steps = path.split("/");
  steps[steps.length - 1] || steps.pop();
  var contextNode = opt_contextNode || this.feed_;
  this.visitXSteps_(steps, 0, handler, contextNode);
};
gviz.FeedToDataTable.JsonFeedRunner_.prototype.visitXSteps_ = function(steps, stepIndex, handler, curNode) {
  for (var numberOfSteps = steps.length;stepIndex < numberOfSteps;) {
    var step = steps[stepIndex++];
    if ("." != step) {
      if (".." == step) {
        if (curNode = curNode.getParent(), null == curNode) {
          return!1;
        }
      } else {
        if (0 == step.indexOf("@")) {
          var attribText = curNode.getAttributeValue(step.substring(1));
          if (null == attribText) {
            return!1;
          }
          curNode = new gviz.FeedToDataTable.JsonFeedNode_(attribText, curNode);
        } else {
          var child = curNode.getChild(step);
          if (null == child && (0 == step.indexOf(this.defaultNamespacePrefix_) && (child = curNode.getChild(step.substring(this.defaultNamespacePrefix_.length))), null == child)) {
            return!1;
          }
          if (child.constructor == curNode.jsonNode_.constructor) {
            curNode = new gviz.FeedToDataTable.JsonFeedNode_(child, curNode);
          } else {
            for (var n = child.length, i = 0;i < n;i++) {
              var subElement = child[i];
              if (null != subElement || "object" == typeof subElement) {
                var nextNode = new gviz.FeedToDataTable.JsonFeedNode_(subElement, curNode);
                if (this.visitXSteps_(steps, stepIndex, handler, nextNode)) {
                  return!0;
                }
              }
            }
            return!1;
          }
        }
      }
    }
  }
  return handler.call(this, curNode);
};
gviz.FeedToDataTable.FeedNode_ = function() {
};
gviz.FeedToDataTable.DomFeedNode_ = function(domNode) {
  this.domNode_ = domNode;
};
gviz.FeedToDataTable.DomFeedNode_.prototype.getValue = function(opt_includeChildText) {
  var value = this.domNode_.nodeValue;
  if (null == value && opt_includeChildText) {
    for (var child = this.domNode_.firstChild;child;) {
      if (3 == child.nodeType) {
        return child.nodeValue;
      }
      child = child.nextSibling;
    }
  }
  return value;
};
gviz.FeedToDataTable.DomFeedNode_.prototype.getAttributeValue = function(attributeName) {
  var attributes = this.domNode_.attributes;
  if (attributes) {
    var attribute = attributes.getNamedItem(attributeName);
    if (attribute) {
      return attribute.nodeValue;
    }
  }
  return null;
};
gviz.FeedToDataTable.DomFeedNode_.prototype.getDomNode = function() {
  return this.domNode_;
};
gviz.FeedToDataTable.JsonFeedNode_ = function(jsonNode, opt_parentNode) {
  this.jsonNode_ = jsonNode;
  this.parentNode_ = opt_parentNode || null;
};
gviz.FeedToDataTable.JsonFeedNode_.prototype.getValue = function(opt_includeChildText) {
  if (this.isText_()) {
    return this.jsonNode_;
  }
  if (opt_includeChildText) {
    var text = this.jsonNode_.$t;
    if (null != text) {
      return text;
    }
  }
  return null;
};
gviz.FeedToDataTable.JsonFeedNode_.prototype.getAttributeValue = function(attributeName) {
  return this.getChild(attributeName, !0);
};
gviz.FeedToDataTable.JsonFeedNode_.prototype.getParent = function() {
  return this.parentNode_;
};
gviz.FeedToDataTable.JsonFeedNode_.prototype.getChild = function(name, opt_attribute) {
  if (this.isText_()) {
    return null;
  }
  var child = this.jsonNode_[name.replace(":", "$")];
  return null == child || typeof child != (opt_attribute ? "string" : "object") ? null : child;
};
gviz.FeedToDataTable.JsonFeedNode_.prototype.isText_ = function() {
  return "string" == typeof this.jsonNode_;
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/converters/htmltodatatable.js)
gviz.HtmlToDataTable = function(tableElement, colTypes, opt_numHeaders) {
  if (!tableElement || "TABLE" != tableElement.tagName) {
    throw Error("Not a table element");
  }
  this.numHeaders_ = goog.isDefAndNotNull(opt_numHeaders) ? opt_numHeaders : 1;
  this.tableElement_ = tableElement;
  this.validateTypes_(colTypes);
  this.types_ = colTypes;
  this.columns_ = [];
};
gviz.HtmlToDataTable.prototype.createDataTable = function() {
  var htmlRows = this.getHtmlRows_(), dataTable = new google.visualization.DataTable;
  htmlRows && 0 < htmlRows.length && (this.createColumns_(htmlRows, dataTable), this.createRows_(htmlRows, dataTable));
  return dataTable;
};
gviz.HtmlToDataTable.prototype.getHtmlRows_ = function() {
  var table = this.tableElement_, firstChild = table.firstChild;
  if (!firstChild) {
    return null;
  }
  var htmlRows = "TBODY" == table.firstChild.tagName ? table.firstChild.childNodes : table.childNodes;
  if (!htmlRows) {
    return null;
  }
  this.numHeaders_ = Math.min(htmlRows.length, this.numHeaders_);
  return htmlRows;
};
gviz.HtmlToDataTable.prototype.createColumns_ = function(htmlRows, dataTable) {
  for (var cols = [], types = this.types_, t = 0;t < types.length;t++) {
    cols.push({type:types[t], label:[]});
  }
  for (var numHeaders = this.numHeaders_, r = 0;r < numHeaders;r++) {
    var htmlRow = htmlRows[r].childNodes;
    if (htmlRow.length < cols.length) {
      throw Error("Html row is too short: " + r);
    }
    for (var c = 0;c < cols.length;c++) {
      cols[c].label.push(htmlRow[c].textContent);
    }
  }
  for (var i = 0;i < cols.length;i++) {
    var col = cols[i];
    dataTable.addColumn(col.type, col.label.join(" "));
  }
  this.columns_ = cols;
};
gviz.HtmlToDataTable.prototype.createRows_ = function(htmlRows, dataTable) {
  for (var cols = this.columns_, numHeaders = this.numHeaders_, r = numHeaders;r < htmlRows.length;r++) {
    var htmlRow = htmlRows[r].childNodes;
    if (htmlRow.length < cols.length) {
      throw Error("Html row is too short: " + r);
    }
    dataTable.addRow();
    for (var c = 0;c < cols.length;c++) {
      var value = htmlRow[c].textContent, type = cols[c].type;
      dataTable.setCell(r - numHeaders, c, this.getTypedValue_(value, type));
    }
  }
};
gviz.HtmlToDataTable.prototype.validateTypes_ = function(types) {
  for (var t = 0;t < types.length;t++) {
    var type = types[t];
    if (!gviz.HtmlToDataTable.SupportedTypes_[type]) {
      throw Error("Unsupported type: " + type);
    }
  }
};
gviz.HtmlToDataTable.prototype.getTypedValue_ = function(value, type) {
  return gviz.HtmlToDataTable.SupportedTypes_[type](value);
};
gviz.HtmlToDataTable.SupportedTypes_ = {number:function(value) {
  return gviz.HtmlToDataTable.convertToNumber_(value);
}, string:function(value) {
  return value;
}, "boolean":function(value) {
  return "true" == value;
}, date:function() {
  throw Error("Unspported type");
}, datetime:function() {
  throw Error("Unspported type");
}, timeofday:function() {
  throw Error("Unspported type");
}};
gviz.HtmlToDataTable.convertToNumber_ = function(val) {
  var num = parseFloat(val);
  if (isNaN(num)) {
    throw Error("Not a number " + val);
  }
  return num;
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/converters/knownfeeds.js)
gviz.FeedToDataTable.KnownFeeds = {};
gviz.FeedToDataTable.KnownFeeds.findFeedDefinition = function(feedUrl) {
  for (var knownFeeds = gviz.FeedToDataTable.KnownFeeds.LIST_, n = knownFeeds.length, i = 0;i < n;i++) {
    if (feedUrl.match(knownFeeds[i].getUrlPattern())) {
      return knownFeeds[i];
    }
  }
  return null;
};
gviz.FeedToDataTable.KnownFeeds.LIST_ = [new gviz.FeedToDataTable.KnownFeedDefinition("Google Analytics Visitor Feed", /^http:\/\/www\.google\.com\/analytics\/feeds\/visitor\//, "atom:feed/atom:entry", [new gviz.FeedToDataTable.ColumnDefinition("analytics:date/analytics:year", "number", "Year", "c_year"), new gviz.FeedToDataTable.ColumnDefinition("analytics:date/analytics:month", "number", "Month", "c_month"), new gviz.FeedToDataTable.ColumnDefinition("analytics:date/analytics:dayOfMonth", "number", 
"Day", "c_day"), new gviz.FeedToDataTable.ColumnDefinition("analytics:date/analytics:weekOfYear", "number", "Week", "c_week"), new gviz.FeedToDataTable.ColumnDefinition("analytics:visits", "number", "Visits", "c_visits"), new gviz.FeedToDataTable.ColumnDefinition("analytics:visitors", "number", "Visitors", "c_visitors"), new gviz.FeedToDataTable.ColumnDefinition("analytics:newVisitors", "number", "New Visitors", "c_newVisitors"), new gviz.FeedToDataTable.ColumnDefinition("analytics:pageviews", "number", 
"Pageviews", "c_pageviews"), new gviz.FeedToDataTable.ColumnDefinition("analytics:timeOnSite", "number", "Time on Site", "c_timeOnSite"), new gviz.FeedToDataTable.ColumnDefinition("analytics:bounceRate", "number", "Bounce Rate", "c_bounceRate")]), new gviz.FeedToDataTable.KnownFeedDefinition("Google Analytics Traffic Source Feed", /^http:\/\/www\.google\.com\/analytics\/feeds\/traffic\//, "atom:feed/atom:entry/analytics:trafficSource", [new gviz.FeedToDataTable.ColumnDefinition("../analytics:date/analytics:year", 
"number", "Year", "c_year"), new gviz.FeedToDataTable.ColumnDefinition("../analytics:date/analytics:month", "number", "Month", "c_month"), new gviz.FeedToDataTable.ColumnDefinition("../analytics:date/analytics:dayOfMonth", "number", "Day", "c_day"), new gviz.FeedToDataTable.ColumnDefinition("../analytics:date/analytics:weekOfYear", "number", "Week", "c_week"), new gviz.FeedToDataTable.ColumnDefinition("@trafficType", "string", "Traffic Type", "c_trafficType"), new gviz.FeedToDataTable.ColumnDefinition("analytics:visits", 
"number", "Visits", "c_visits"), new gviz.FeedToDataTable.ColumnDefinition("analytics:pageviewsPerVisit", "number", "Pageviews / Visit", "c_pageviewsPerVisit"), new gviz.FeedToDataTable.ColumnDefinition("analytics:timeOnSite", "number", "Time on Site", "c_timeOnSite"), new gviz.FeedToDataTable.ColumnDefinition("analytics:newVisitPercentage", "number", "New Visitor %", "c_newVisitPercentage"), new gviz.FeedToDataTable.ColumnDefinition("analytics:bounceRate", "number", "Bounce Rate", "c_bounceRate")]), 
new gviz.FeedToDataTable.KnownFeedDefinition("Google Analytics Keywords Overview Feed", /^http:\/\/www\.google\.com\/analytics\/feeds\/keywords\//, "atom:feed/atom:entry", [new gviz.FeedToDataTable.ColumnDefinition("analytics:keyword", "string", "Keyword", "c_keyword"), new gviz.FeedToDataTable.ColumnDefinition("analytics:visits", "number", "Visits", "c_visits"), new gviz.FeedToDataTable.ColumnDefinition("analytics:pageviewsPerVisit", "number", "Pageviews / Visit", "c_pageviewsPerVisit"), new gviz.FeedToDataTable.ColumnDefinition("analytics:timeOnSite", 
"number", "Time on Site", "c_timeOnSite"), new gviz.FeedToDataTable.ColumnDefinition("analytics:newVisitPercentage", "number", "New Visitor %", "c_newVisitPercentage"), new gviz.FeedToDataTable.ColumnDefinition("analytics:bounceRate", "number", "Bounce Rate", "c_bounceRate")]), new gviz.FeedToDataTable.KnownFeedDefinition("Google Analytics Content Overview Feed", /^http:\/\/www\.google\.com\/analytics\/feeds\/content\//, "atom:feed/atom:entry", [new gviz.FeedToDataTable.ColumnDefinition("analytics:url", 
"string", "URL", "c_url"), new gviz.FeedToDataTable.ColumnDefinition("analytics:pageviews", "number", "Pageviews", "c_pageviews"), new gviz.FeedToDataTable.ColumnDefinition("analytics:timeOnPage", "number", "Time on Page", "c_timeOnPage"), new gviz.FeedToDataTable.ColumnDefinition("analytics:uniqueViews", "number", "Unique Views", "c_uniqueViews"), new gviz.FeedToDataTable.ColumnDefinition("analytics:bounceRate", "number", "Bounce Rate", "c_bounceRate"), new gviz.FeedToDataTable.ColumnDefinition("analytics:exitRate", 
"number", "Exit Rate", "c_exitRate"), new gviz.FeedToDataTable.ColumnDefinition("analytics:dollarIndex", "number", "Dollar Index", "c_dollarIndex")]), new gviz.FeedToDataTable.KnownFeedDefinition("Google Analytics Goal Overview Feed", /^http:\/\/www\.google\.com\/analytics\/feeds\/goals\//, "atom:feed/atom:entry", [new gviz.FeedToDataTable.ColumnDefinition("analytics:goal", "string", "Goal", "c_goal"), new gviz.FeedToDataTable.ColumnDefinition("analytics:conversions", "number", "Conversions", "c_conversions"), 
new gviz.FeedToDataTable.ColumnDefinition("analytics:conversionRate", "number", "Conversion Rate", "c_conversionRate"), new gviz.FeedToDataTable.ColumnDefinition("analytics:abandonmentRate", "number", "Abandonment Rate", "c_abandonmentRate")]), new gviz.FeedToDataTable.KnownFeedDefinition("Google Trends Query Frequency Feed", /^http:\/\/(?:www|trends)\.google\.com\/trends\/api\/freq\?/, "atom:feed/atom:entry/trends:dp", [new gviz.FeedToDataTable.ColumnDefinition("../trends:query", "string", "Query", 
"c_query"), new gviz.FeedToDataTable.ColumnDefinition("../trends:loc", "string", "Location", "c_location"), new gviz.FeedToDataTable.ColumnDefinition("@aggval", "string", "Data Point", "c_dataPoint"), new gviz.FeedToDataTable.ColumnDefinition(".", "number", "Frequency", "c_frequency"), new gviz.FeedToDataTable.ColumnDefinition("@stderror", "string", "Standard Error", "c_stderror")])];
// INPUT (javascript/gviz/devel/jsapi/packages/util/data.js)
google.visualization.data = {};
google.visualization.data.copyDataTableColumn_ = function(targetDt, sourceDt, index) {
  var dataType = sourceDt.getColumnType(index), colId = sourceDt.getColumnId(index), colLabel = sourceDt.getColumnLabel(index), colIdx = targetDt.addColumn(dataType, colLabel, colId);
  targetDt.setColumnProperties(colIdx, sourceDt.getColumnProperties(index));
  return colIdx;
};
google.visualization.data.join = function(dt1, dt2, joinMethod, keys, dt1Columns, dt2Columns) {
  keys = goog.array.map(keys, function(key) {
    var idx1 = dt1.getColumnIndex(key[0]), idx2 = dt2.getColumnIndex(key[1]);
    return[idx1, idx2];
  });
  dt1Columns = goog.array.map(dt1Columns, goog.bind(dt1.getColumnIndex, dt1));
  dt2Columns = goog.array.map(dt2Columns, goog.bind(dt2.getColumnIndex, dt2));
  var includeLeft = "left" == joinMethod || "full" == joinMethod, includeRight = "right" == joinMethod || "full" == joinMethod, resultDt = new google.visualization.DataTable, types = [];
  goog.array.forEach(keys, function(key) {
    var type1 = dt1.getColumnType(key[0]), type2 = dt2.getColumnType(key[1]);
    if (type1 != type2) {
      throw Error("Key types do not match:" + type1 + ", " + type2);
    }
    google.visualization.data.copyDataTableColumn_(resultDt, dt1, key[0]);
    types.push(type1);
  });
  var sortColumns1 = [], sortColumns2 = [];
  goog.array.forEach(keys, function(key) {
    sortColumns1.push({column:key[0]});
    sortColumns2.push({column:key[1]});
  });
  var sortedIndices1 = dt1.getSortedRows(sortColumns1), sortedIndices2 = dt2.getSortedRows(sortColumns2);
  goog.array.forEach(dt1Columns, function(idx) {
    google.visualization.data.copyDataTableColumn_(resultDt, dt1, idx);
  });
  goog.array.forEach(dt2Columns, function(idx) {
    google.visualization.data.copyDataTableColumn_(resultDt, dt2, idx);
  });
  for (var isRightRowEmitted = !1, i = 0, j = 0, resultRowIdx = 0;i < sortedIndices1.length || j < sortedIndices2.length;) {
    var compareKeysResult = 0, rowIdx = [];
    if (j >= sortedIndices2.length) {
      if (includeLeft) {
        rowIdx[0] = sortedIndices1[i], compareKeysResult = -1;
      } else {
        break;
      }
    } else {
      if (i >= sortedIndices1.length) {
        if (includeRight) {
          rowIdx[1] = sortedIndices2[j], compareKeysResult = 1;
        } else {
          break;
        }
      } else {
        rowIdx[0] = sortedIndices1[i];
        rowIdx[1] = sortedIndices2[j];
        for (var keyIdx = 0;keyIdx < keys.length;keyIdx++) {
          var key1 = dt1.getValue(rowIdx[0], keys[keyIdx][0]), key2 = dt2.getValue(rowIdx[1], keys[keyIdx][1]), compareKeysResult = google.visualization.datautils.compareValues(types[keyIdx], key1, key2);
          if (0 != compareKeysResult) {
            break;
          }
        }
      }
    }
    if (isRightRowEmitted && 0 != compareKeysResult) {
      isRightRowEmitted = !1, j++;
    } else {
      if (-1 == compareKeysResult && includeLeft || 1 == compareKeysResult && includeRight || 0 == compareKeysResult) {
        resultDt.addRow();
        var sourceDt, dtIdx;
        -1 == compareKeysResult && includeLeft || 0 == compareKeysResult && "right" != joinMethod ? (sourceDt = dt1, dtIdx = 0) : (sourceDt = dt2, dtIdx = 1);
        goog.array.forEach(keys, function(key, count) {
          "full" == joinMethod ? resultDt.setValue(resultRowIdx, count, sourceDt.getValue(rowIdx[dtIdx], key[dtIdx])) : resultDt.setCell(resultRowIdx, count, sourceDt.getValue(rowIdx[dtIdx], key[dtIdx]), sourceDt.getFormattedValue(rowIdx[dtIdx], key[dtIdx]), sourceDt.getProperties(rowIdx[dtIdx], key[dtIdx]));
        });
        if (-1 == compareKeysResult && includeLeft || 0 == compareKeysResult) {
          var baseColIdx = keys.length;
          goog.array.forEach(dt1Columns, function(idx, count) {
            resultDt.setCell(resultRowIdx, count + baseColIdx, dt1.getValue(rowIdx[0], idx), dt1.getFormattedValue(rowIdx[0], idx), dt1.getProperties(rowIdx[0], idx));
          });
        }
        if (1 == compareKeysResult && includeRight || 0 == compareKeysResult) {
          baseColIdx = dt1Columns.length + keys.length, goog.array.forEach(dt2Columns, function(idx, count) {
            resultDt.setCell(resultRowIdx, count + baseColIdx, dt2.getValue(rowIdx[1], idx), dt2.getFormattedValue(rowIdx[1], idx), dt2.getProperties(rowIdx[1], idx));
          });
        }
        resultRowIdx++;
      }
      1 == compareKeysResult ? j++ : i++;
      0 == compareKeysResult && (isRightRowEmitted = !0);
    }
  }
  return resultDt;
};
google.visualization.data.sum = function(values) {
  for (var res = 0, i = 0;i < values.length;i++) {
    res += values[i];
  }
  return res;
};
google.visualization.data.count = function(values) {
  return values.length;
};
google.visualization.data.avg = function(values) {
  return google.visualization.data.sum(values) / values.length;
};
google.visualization.data.min = function(values) {
  if (0 == values.length) {
    return null;
  }
  for (var min = values[0], i = 1;i < values.length;i++) {
    var val = values[i];
    null != val && val < min && (min = val);
  }
  return min;
};
google.visualization.data.max = function(values) {
  if (0 == values.length) {
    return null;
  }
  for (var max = values[0], i = 1;i < values.length;i++) {
    var val = values[i];
    null != val && val > max && (max = val);
  }
  return max;
};
google.visualization.data.month = function(date) {
  return date.getMonth() + 1;
};
google.visualization.data.group = function(dt, keys, opt_columns) {
  var calc = function(colIdx, modifier, dt, rowIdx) {
    return modifier.call(null, dt.getValue(rowIdx, colIdx));
  }, keyIndices = [], keyModifiers = [];
  goog.array.forEach(keys, function(key) {
    if (goog.isNumber(key)) {
      keyIndices.push(key);
    } else {
      if ("object" == goog.typeOf(key)) {
        var keyIdx = key.column, keyIdx = dt.getColumnIndex(keyIdx);
        "modifier" in key && keyModifiers.push([keyIdx, {calc:goog.partial(calc, keyIdx, key.modifier), type:key.type, label:key.label, id:key.id}]);
        keyIndices.push(keyIdx);
      }
    }
  });
  if (!goog.array.isEmpty(keyModifiers)) {
    for (var view = new google.visualization.DataView(dt), viewCols = view.getViewColumns(), numberOfRows = dt.getNumberOfRows(), r = 0;r < numberOfRows;r++) {
      goog.array.forEach(keyModifiers, function(keyModifier) {
        viewCols[keyModifier[0]] = keyModifier[1];
      });
    }
    view.setColumns(viewCols);
    dt = view;
  }
  var result = new google.visualization.DataTable, types = [];
  goog.array.forEach(keyIndices, function(keyIdx, idx) {
    var type = dt.getColumnType(keyIdx), label = keys[idx].label || dt.getColumnLabel(keyIdx), id = goog.isDefAndNotNull(keys[idx].id) ? keys[idx].id : dt.getColumnId(keyIdx);
    result.addColumn(type, label, id);
    types.push(type);
  });
  var columns = opt_columns || [];
  goog.array.forEach(columns, function(c) {
    var colIdx = dt.getColumnIndex(c.column), label = c.label || dt.getColumnLabel(colIdx), id = goog.isDefAndNotNull(c.id) ? c.id : dt.getColumnId(colIdx);
    result.addColumn(c.type, label, id);
  });
  var sortColumns = [];
  goog.array.forEach(keyIndices, function(keyIdx) {
    sortColumns.push({column:keyIdx});
  });
  for (var sortedIndices = dt.getSortedRows(sortColumns), columnValues = [], i = 0;i < columns.length;i++) {
    columnValues.push([]);
  }
  for (i = 0;i < sortedIndices.length;i++) {
    goog.array.forEach(columns, function(c, idx) {
      columnValues[idx].push(dt.getValue(sortedIndices[i], dt.getColumnIndex(c.column)));
    });
    var nextKeyMatches = !1;
    if (i < sortedIndices.length - 1) {
      for (var nextKeyMatches = !0, j = 0;j < keyIndices.length;j++) {
        var key1 = dt.getValue(sortedIndices[i], keyIndices[j]), key2 = dt.getValue(sortedIndices[i + 1], keyIndices[j]);
        if (0 != google.visualization.datautils.compareValues(types[j], key1, key2)) {
          nextKeyMatches = !1;
          break;
        }
      }
    }
    if (!nextKeyMatches) {
      var rowIdx$$0 = result.addRow();
      goog.array.forEach(keyIndices, function(keyIdx, colIdx) {
        result.setValue(rowIdx$$0, colIdx, dt.getValue(sortedIndices[i], keyIdx));
      });
      var baseColIdx = keys.length;
      goog.array.forEach(columns, function(c, idx) {
        var value = c.aggregation.call(null, columnValues[idx]);
        result.setValue(rowIdx$$0, baseColIdx + idx, value);
      });
      for (var k = 0;k < columns.length;k++) {
        columnValues[k] = [];
      }
    }
  }
  return result;
};
// INPUT (javascript/gviz/devel/jsapi/packages/util/context/googleapis_exports.js)
goog.exportSymbol("google.visualization.drawChart", google.visualization.drawChart);
goog.exportSymbol("google.visualization.drawFromUrl", google.visualization.drawFromUrl);
goog.exportSymbol("google.visualization.createUrl", google.visualization.createUrl);
goog.exportSymbol("google.visualization.createSnippet", google.visualization.createSnippet);
goog.exportSymbol("google.visualization.createWrapper", google.visualization.createWrapper);
goog.exportSymbol("google.visualization.ChartWrapper", google.visualization.ChartWrapper);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "clear", google.visualization.ChartWrapper.prototype.clear);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "draw", google.visualization.ChartWrapper.prototype.draw);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "clone", google.visualization.ChartWrapper.prototype.clone);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "toJSON", google.visualization.ChartWrapper.prototype.toJSON);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getSnapshot", google.visualization.ChartWrapper.prototype.getSnapshot);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getDataSourceUrl", google.visualization.ChartWrapper.prototype.getDataSourceUrl);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getDataTable", google.visualization.ChartWrapper.prototype.getDataTable);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getChartName", google.visualization.ChartWrapper.prototype.getChartName);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getChartType", google.visualization.ChartWrapper.prototype.getChartType);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getChart", google.visualization.ChartWrapper.prototype.getChart);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getContainerId", google.visualization.ChartWrapper.prototype.getContainerId);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getPackages", google.visualization.ChartWrapper.prototype.getPackages);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getQuery", google.visualization.ChartWrapper.prototype.getQuery);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getRefreshInterval", google.visualization.ChartWrapper.prototype.getRefreshInterval);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getView", google.visualization.ChartWrapper.prototype.getView);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getOption", google.visualization.ChartWrapper.prototype.getOption);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getOptions", google.visualization.ChartWrapper.prototype.getOptions);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getState", google.visualization.ChartWrapper.prototype.getState);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "getCustomRequestHandler", google.visualization.ChartWrapper.prototype.getCustomRequestHandler);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "isDefaultVisualization", google.visualization.ChartWrapper.prototype.isDefaultVisualization);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "pushView", google.visualization.ChartWrapper.prototype.pushView);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "sendQuery", google.visualization.ChartWrapper.prototype.sendQuery);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setDataSourceUrl", google.visualization.ChartWrapper.prototype.setDataSourceUrl);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setDataTable", google.visualization.ChartWrapper.prototype.setDataTable);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setChart", google.visualization.ChartWrapper.prototype.setChart);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setChartName", google.visualization.ChartWrapper.prototype.setChartName);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setChartType", google.visualization.ChartWrapper.prototype.setChartType);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setContainerId", google.visualization.ChartWrapper.prototype.setContainerId);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setIsDefaultVisualization", google.visualization.ChartWrapper.prototype.setIsDefaultVisualization);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setPackages", google.visualization.ChartWrapper.prototype.setPackages);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setQuery", google.visualization.ChartWrapper.prototype.setQuery);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setRefreshInterval", google.visualization.ChartWrapper.prototype.setRefreshInterval);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setView", google.visualization.ChartWrapper.prototype.setView);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setOption", google.visualization.ChartWrapper.prototype.setOption);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setOptions", google.visualization.ChartWrapper.prototype.setOptions);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setState", google.visualization.ChartWrapper.prototype.setState);
goog.exportProperty(google.visualization.ChartWrapper.prototype, "setCustomRequestHandler", google.visualization.ChartWrapper.prototype.setCustomRequestHandler);
goog.exportSymbol("google.visualization.ControlWrapper", google.visualization.ControlWrapper);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "clear", google.visualization.ControlWrapper.prototype.clear);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "draw", google.visualization.ControlWrapper.prototype.draw);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "toJSON", google.visualization.ControlWrapper.prototype.toJSON);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getSnapshot", google.visualization.ControlWrapper.prototype.getSnapshot);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getDataSourceUrl", google.visualization.ControlWrapper.prototype.getDataSourceUrl);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getDataTable", google.visualization.ControlWrapper.prototype.getDataTable);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getControlName", google.visualization.ControlWrapper.prototype.getControlName);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getControlType", google.visualization.ControlWrapper.prototype.getControlType);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getControl", google.visualization.ControlWrapper.prototype.getControl);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getContainerId", google.visualization.ControlWrapper.prototype.getContainerId);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getPackages", google.visualization.ControlWrapper.prototype.getPackages);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getQuery", google.visualization.ControlWrapper.prototype.getQuery);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getRefreshInterval", google.visualization.ControlWrapper.prototype.getRefreshInterval);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getView", google.visualization.ControlWrapper.prototype.getView);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getOption", google.visualization.ControlWrapper.prototype.getOption);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getOptions", google.visualization.ControlWrapper.prototype.getOptions);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "getState", google.visualization.ControlWrapper.prototype.getState);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "sendQuery", google.visualization.ControlWrapper.prototype.sendQuery);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setDataSourceUrl", google.visualization.ControlWrapper.prototype.setDataSourceUrl);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setDataTable", google.visualization.ControlWrapper.prototype.setDataTable);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setControlName", google.visualization.ControlWrapper.prototype.setControlName);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setControlType", google.visualization.ControlWrapper.prototype.setControlType);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setContainerId", google.visualization.ControlWrapper.prototype.setContainerId);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setPackages", google.visualization.ControlWrapper.prototype.setPackages);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setQuery", google.visualization.ControlWrapper.prototype.setQuery);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setRefreshInterval", google.visualization.ControlWrapper.prototype.setRefreshInterval);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setView", google.visualization.ControlWrapper.prototype.setView);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setOption", google.visualization.ControlWrapper.prototype.setOption);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setOptions", google.visualization.ControlWrapper.prototype.setOptions);
goog.exportProperty(google.visualization.ControlWrapper.prototype, "setState", google.visualization.ControlWrapper.prototype.setState);
goog.exportSymbol("google.visualization.DashboardWrapper", google.visualization.DashboardWrapper);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "clear", google.visualization.DashboardWrapper.prototype.clear);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "draw", google.visualization.DashboardWrapper.prototype.draw);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "toJSON", google.visualization.DashboardWrapper.prototype.toJSON);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getBindings", google.visualization.DashboardWrapper.prototype.getBindings);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getDataSourceUrl", google.visualization.DashboardWrapper.prototype.getDataSourceUrl);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getDataTable", google.visualization.DashboardWrapper.prototype.getDataTable);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getDashboard", google.visualization.DashboardWrapper.prototype.getDashboard);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getDashboardName", google.visualization.DashboardWrapper.prototype.getDashboardName);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getContainerId", google.visualization.DashboardWrapper.prototype.getContainerId);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getPackages", google.visualization.DashboardWrapper.prototype.getPackages);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getQuery", google.visualization.DashboardWrapper.prototype.getQuery);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getRefreshInterval", google.visualization.DashboardWrapper.prototype.getRefreshInterval);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getView", google.visualization.DashboardWrapper.prototype.getView);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getWrappers", google.visualization.DashboardWrapper.prototype.getWrappers);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setBindings", google.visualization.DashboardWrapper.prototype.setBindings);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setDataSourceUrl", google.visualization.DashboardWrapper.prototype.setDataSourceUrl);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setDataTable", google.visualization.DashboardWrapper.prototype.setDataTable);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setDashboardName", google.visualization.DashboardWrapper.prototype.setDashboardName);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setContainerId", google.visualization.DashboardWrapper.prototype.setContainerId);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setPackages", google.visualization.DashboardWrapper.prototype.setPackages);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setQuery", google.visualization.DashboardWrapper.prototype.setQuery);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setRefreshInterval", google.visualization.DashboardWrapper.prototype.setRefreshInterval);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setView", google.visualization.DashboardWrapper.prototype.setView);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "getSnapshot", google.visualization.DashboardWrapper.prototype.getSnapshot);
goog.exportProperty(google.visualization.DashboardWrapper.prototype, "setWrappers", google.visualization.DashboardWrapper.prototype.setWrappers);
// INPUT (javascript/gviz/devel/jsapi/packages/util/googleapis_exports.js)
goog.exportSymbol("google.visualization.data.avg", google.visualization.data.avg);
goog.exportSymbol("google.visualization.data.count", google.visualization.data.count);
goog.exportSymbol("google.visualization.data.group", google.visualization.data.group);
goog.exportSymbol("google.visualization.data.join", google.visualization.data.join);
goog.exportSymbol("google.visualization.data.max", google.visualization.data.max);
goog.exportSymbol("google.visualization.data.min", google.visualization.data.min);
goog.exportSymbol("google.visualization.data.month", google.visualization.data.month);
goog.exportSymbol("google.visualization.data.sum", google.visualization.data.sum);
// INPUT (javascript/gviz/devel/jsapi/packages/core/googleapis_exports.js)
goog.exportSymbol("__gvizguard__", google.visualization.Guard);
goog.exportSymbol("google.visualization.Query", google.visualization.Query);
goog.exportProperty(google.visualization.Query.prototype, "makeRequest", google.visualization.Query.prototype.makeRequest);
goog.exportProperty(google.visualization.Query.prototype, "setRefreshInterval", google.visualization.Query.prototype.setRefreshInterval);
goog.exportProperty(google.visualization.Query.prototype, "setQuery", google.visualization.Query.prototype.setQuery);
goog.exportProperty(google.visualization.Query.prototype, "send", google.visualization.Query.prototype.send);
goog.exportProperty(google.visualization.Query.prototype, "setRefreshable", google.visualization.Query.prototype.setRefreshable);
goog.exportProperty(google.visualization.Query.prototype, "setTimeout", google.visualization.Query.prototype.setTimeout);
goog.exportProperty(google.visualization.Query.prototype, "setHandlerType", google.visualization.Query.prototype.setHandlerType);
goog.exportProperty(google.visualization.Query.prototype, "setHandlerParameter", google.visualization.Query.prototype.setHandlerParameter);
goog.exportProperty(google.visualization.Query, "setResponse", google.visualization.Query.setResponse);
goog.exportProperty(google.visualization.Query.prototype, "abort", google.visualization.Query.prototype.abort);
goog.exportSymbol("google.visualization.CustomQuery", google.visualization.CustomQuery);
goog.exportProperty(google.visualization.CustomQuery.prototype, "send", google.visualization.CustomQuery.prototype.send);
goog.exportSymbol("google.visualization.QueryResponse", google.visualization.QueryResponse);
goog.exportProperty(google.visualization.QueryResponse.prototype, "getDataTable", google.visualization.QueryResponse.prototype.getDataTable);
goog.exportProperty(google.visualization.QueryResponse.prototype, "isError", google.visualization.QueryResponse.prototype.isError);
goog.exportProperty(google.visualization.QueryResponse.prototype, "hasWarning", google.visualization.QueryResponse.prototype.hasWarning);
goog.exportProperty(google.visualization.QueryResponse.prototype, "getReasons", google.visualization.QueryResponse.prototype.getReasons);
goog.exportProperty(google.visualization.QueryResponse.prototype, "getMessage", google.visualization.QueryResponse.prototype.getMessage);
goog.exportProperty(google.visualization.QueryResponse.prototype, "getDetailedMessage", google.visualization.QueryResponse.prototype.getDetailedMessage);
goog.exportSymbol("google.visualization.DataTable", google.visualization.DataTable);
goog.exportProperty(google.visualization.DataTable.prototype, "addColumn", google.visualization.DataTable.prototype.addColumn);
goog.exportProperty(google.visualization.DataTable.prototype, "addRow", google.visualization.DataTable.prototype.addRow);
goog.exportProperty(google.visualization.DataTable.prototype, "addRows", google.visualization.DataTable.prototype.addRows);
goog.exportProperty(google.visualization.DataTable.prototype, "clone", google.visualization.DataTable.prototype.clone);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnId", google.visualization.DataTable.prototype.getColumnId);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnIndex", google.visualization.DataTable.prototype.getColumnIndex);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnLabel", google.visualization.DataTable.prototype.getColumnLabel);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnPattern", google.visualization.DataTable.prototype.getColumnPattern);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnProperty", google.visualization.DataTable.prototype.getColumnProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnProperties", google.visualization.DataTable.prototype.getColumnProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnRange", google.visualization.DataTable.prototype.getColumnRange);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnRole", google.visualization.DataTable.prototype.getColumnRole);
goog.exportProperty(google.visualization.DataTable.prototype, "getColumnType", google.visualization.DataTable.prototype.getColumnType);
goog.exportProperty(google.visualization.DataTable.prototype, "getDistinctValues", google.visualization.DataTable.prototype.getDistinctValues);
goog.exportProperty(google.visualization.DataTable.prototype, "getFilteredRows", google.visualization.DataTable.prototype.getFilteredRows);
goog.exportProperty(google.visualization.DataTable.prototype, "getFormattedValue", google.visualization.DataTable.prototype.getFormattedValue);
goog.exportProperty(google.visualization.DataTable.prototype, "getNumberOfColumns", google.visualization.DataTable.prototype.getNumberOfColumns);
goog.exportProperty(google.visualization.DataTable.prototype, "getNumberOfRows", google.visualization.DataTable.prototype.getNumberOfRows);
goog.exportProperty(google.visualization.DataTable.prototype, "getProperties", google.visualization.DataTable.prototype.getProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "getProperty", google.visualization.DataTable.prototype.getProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "getRowProperty", google.visualization.DataTable.prototype.getRowProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "getRowProperties", google.visualization.DataTable.prototype.getRowProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "getSortedRows", google.visualization.DataTable.prototype.getSortedRows);
goog.exportProperty(google.visualization.DataTable.prototype, "getTableProperty", google.visualization.DataTable.prototype.getTableProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "getTableProperties", google.visualization.DataTable.prototype.getTableProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "getUnderlyingTableColumnIndex", google.visualization.DataTable.prototype.getUnderlyingTableColumnIndex);
goog.exportProperty(google.visualization.DataTable.prototype, "getUnderlyingTableRowIndex", google.visualization.DataTable.prototype.getUnderlyingTableRowIndex);
goog.exportProperty(google.visualization.DataTable.prototype, "getValue", google.visualization.DataTable.prototype.getValue);
goog.exportProperty(google.visualization.DataTable.prototype, "insertColumn", google.visualization.DataTable.prototype.insertColumn);
goog.exportProperty(google.visualization.DataTable.prototype, "insertRows", google.visualization.DataTable.prototype.insertRows);
goog.exportProperty(google.visualization.DataTable.prototype, "removeColumn", google.visualization.DataTable.prototype.removeColumn);
goog.exportProperty(google.visualization.DataTable.prototype, "removeColumns", google.visualization.DataTable.prototype.removeColumns);
goog.exportProperty(google.visualization.DataTable.prototype, "removeRow", google.visualization.DataTable.prototype.removeRow);
goog.exportProperty(google.visualization.DataTable.prototype, "removeRows", google.visualization.DataTable.prototype.removeRows);
goog.exportProperty(google.visualization.DataTable.prototype, "setCell", google.visualization.DataTable.prototype.setCell);
goog.exportProperty(google.visualization.DataTable.prototype, "setColumnLabel", google.visualization.DataTable.prototype.setColumnLabel);
goog.exportProperty(google.visualization.DataTable.prototype, "setColumnProperties", google.visualization.DataTable.prototype.setColumnProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "setColumnProperty", google.visualization.DataTable.prototype.setColumnProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "setFormattedValue", google.visualization.DataTable.prototype.setFormattedValue);
goog.exportProperty(google.visualization.DataTable.prototype, "setProperties", google.visualization.DataTable.prototype.setProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "setProperty", google.visualization.DataTable.prototype.setProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "setRowProperties", google.visualization.DataTable.prototype.setRowProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "setRowProperty", google.visualization.DataTable.prototype.setRowProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "setTableProperties", google.visualization.DataTable.prototype.setTableProperties);
goog.exportProperty(google.visualization.DataTable.prototype, "setTableProperty", google.visualization.DataTable.prototype.setTableProperty);
goog.exportProperty(google.visualization.DataTable.prototype, "setValue", google.visualization.DataTable.prototype.setValue);
goog.exportProperty(google.visualization.DataTable.prototype, "sort", google.visualization.DataTable.prototype.sort);
goog.exportProperty(google.visualization.DataTable.prototype, "toJSON", google.visualization.DataTable.prototype.toJSON);
goog.exportSymbol("google.visualization.DataView", google.visualization.DataView);
goog.exportProperty(google.visualization.DataView, "fromJSON", google.visualization.DataView.fromJSON);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnId", google.visualization.DataView.prototype.getColumnId);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnIndex", google.visualization.DataView.prototype.getColumnIndex);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnLabel", google.visualization.DataView.prototype.getColumnLabel);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnPattern", google.visualization.DataView.prototype.getColumnPattern);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnProperty", google.visualization.DataView.prototype.getColumnProperty);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnProperty", google.visualization.DataView.prototype.getColumnProperty);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnProperties", google.visualization.DataView.prototype.getColumnProperties);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnRange", google.visualization.DataView.prototype.getColumnRange);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnRole", google.visualization.DataView.prototype.getColumnRole);
goog.exportProperty(google.visualization.DataView.prototype, "getColumnType", google.visualization.DataView.prototype.getColumnType);
goog.exportProperty(google.visualization.DataView.prototype, "getDistinctValues", google.visualization.DataView.prototype.getDistinctValues);
goog.exportProperty(google.visualization.DataView.prototype, "getFilteredRows", google.visualization.DataView.prototype.getFilteredRows);
goog.exportProperty(google.visualization.DataView.prototype, "getFormattedValue", google.visualization.DataView.prototype.getFormattedValue);
goog.exportProperty(google.visualization.DataView.prototype, "getNumberOfColumns", google.visualization.DataView.prototype.getNumberOfColumns);
goog.exportProperty(google.visualization.DataView.prototype, "getNumberOfRows", google.visualization.DataView.prototype.getNumberOfRows);
goog.exportProperty(google.visualization.DataView.prototype, "getProperties", google.visualization.DataView.prototype.getProperties);
goog.exportProperty(google.visualization.DataView.prototype, "getProperty", google.visualization.DataView.prototype.getProperty);
goog.exportProperty(google.visualization.DataView.prototype, "getRowProperty", google.visualization.DataView.prototype.getRowProperty);
goog.exportProperty(google.visualization.DataView.prototype, "getRowProperties", google.visualization.DataView.prototype.getRowProperties);
goog.exportProperty(google.visualization.DataView.prototype, "getSortedRows", google.visualization.DataView.prototype.getSortedRows);
goog.exportProperty(google.visualization.DataView.prototype, "getTableColumnIndex", google.visualization.DataView.prototype.getTableColumnIndex);
goog.exportProperty(google.visualization.DataView.prototype, "getUnderlyingTableColumnIndex", google.visualization.DataView.prototype.getUnderlyingTableColumnIndex);
goog.exportProperty(google.visualization.DataView.prototype, "getTableRowIndex", google.visualization.DataView.prototype.getTableRowIndex);
goog.exportProperty(google.visualization.DataView.prototype, "getUnderlyingTableRowIndex", google.visualization.DataView.prototype.getUnderlyingTableRowIndex);
goog.exportProperty(google.visualization.DataView.prototype, "getTableProperty", google.visualization.DataView.prototype.getTableProperty);
goog.exportProperty(google.visualization.DataView.prototype, "getTableProperties", google.visualization.DataView.prototype.getTableProperties);
goog.exportProperty(google.visualization.DataView.prototype, "getValue", google.visualization.DataView.prototype.getValue);
goog.exportProperty(google.visualization.DataView.prototype, "getViewColumnIndex", google.visualization.DataView.prototype.getViewColumnIndex);
goog.exportProperty(google.visualization.DataView.prototype, "getViewColumns", google.visualization.DataView.prototype.getViewColumns);
goog.exportProperty(google.visualization.DataView.prototype, "getViewRowIndex", google.visualization.DataView.prototype.getViewRowIndex);
goog.exportProperty(google.visualization.DataView.prototype, "getViewRows", google.visualization.DataView.prototype.getViewRows);
goog.exportProperty(google.visualization.DataView.prototype, "hideColumns", google.visualization.DataView.prototype.hideColumns);
goog.exportProperty(google.visualization.DataView.prototype, "hideRows", google.visualization.DataView.prototype.hideRows);
goog.exportProperty(google.visualization.DataView.prototype, "setColumns", google.visualization.DataView.prototype.setColumns);
goog.exportProperty(google.visualization.DataView.prototype, "setRows", google.visualization.DataView.prototype.setRows);
goog.exportProperty(google.visualization.DataView.prototype, "toDataTable", google.visualization.DataView.prototype.toDataTable);
goog.exportProperty(google.visualization.DataView.prototype, "toJSON", google.visualization.DataView.prototype.toJSON);
goog.exportSymbol("google.visualization.errors", google.visualization.errors);
goog.exportProperty(google.visualization.errors, "addError", google.visualization.errors.addError);
goog.exportProperty(google.visualization.errors, "removeAll", google.visualization.errors.removeAll);
goog.exportProperty(google.visualization.errors, "removeError", google.visualization.errors.removeError);
goog.exportProperty(google.visualization.errors, "addErrorFromQueryResponse", google.visualization.errors.addErrorFromQueryResponse);
goog.exportProperty(google.visualization.errors, "getContainer", google.visualization.errors.getContainer);
goog.exportProperty(google.visualization.errors, "createProtectedCallback", google.visualization.errors.createProtectedCallback);
goog.exportSymbol("google.visualization.events.addListener", google.visualization.events.addListener);
goog.exportSymbol("google.visualization.events.addOneTimeListener", google.visualization.events.addOneTimeListener);
goog.exportSymbol("google.visualization.events.trigger", google.visualization.events.trigger);
goog.exportSymbol("google.visualization.events.removeListener", google.visualization.events.removeListener);
goog.exportSymbol("google.visualization.events.removeAllListeners", google.visualization.events.removeAllListeners);
goog.exportSymbol("google.visualization.QueryWrapper", google.visualization.QueryWrapper);
goog.exportProperty(google.visualization.QueryWrapper.prototype, "setOptions", google.visualization.QueryWrapper.prototype.setOptions);
goog.exportProperty(google.visualization.QueryWrapper.prototype, "draw", google.visualization.QueryWrapper.prototype.draw);
goog.exportProperty(google.visualization.QueryWrapper.prototype, "setCustomErrorHandler", google.visualization.QueryWrapper.prototype.setCustomErrorHandler);
goog.exportProperty(google.visualization.QueryWrapper.prototype, "sendAndDraw", google.visualization.QueryWrapper.prototype.sendAndDraw);
goog.exportProperty(google.visualization.QueryWrapper.prototype, "setCustomPostResponseHandler", google.visualization.QueryWrapper.prototype.setCustomPostResponseHandler);
goog.exportProperty(google.visualization.QueryWrapper.prototype, "setCustomResponseHandler", google.visualization.QueryWrapper.prototype.setCustomResponseHandler);
goog.exportProperty(google.visualization.QueryWrapper.prototype, "abort", google.visualization.QueryWrapper.prototype.abort);
goog.exportSymbol("google.visualization.arrayToDataTable", google.visualization.datautils.arrayToDataTable);
goog.exportSymbol("google.visualization.datautils.compareValues", google.visualization.datautils.compareValues);
goog.exportSymbol("google.visualization.dataTableToCsv", google.visualization.datautils.dataTableToCsv);
// INPUT (javascript/gviz/devel/jsapi/common/gadgethelper/googleapis_exports.js)
goog.exportSymbol("google.visualization.GadgetHelper", google.visualization.GadgetHelper);
goog.exportProperty(google.visualization.GadgetHelper.prototype, "createQueryFromPrefs", google.visualization.GadgetHelper.prototype.createQueryFromPrefs);
goog.exportProperty(google.visualization.GadgetHelper.prototype, "validateResponse", google.visualization.GadgetHelper.prototype.validateResponse);
;window.google&&window.google.loader&&window.google.loader.eval&&window.google.loader.eval.visualization&&(window.google.loader.eval.visualization=function(){eval(arguments[0])});
});
/*jsl:END*/
