/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {
	/*global setTimeout,clearTimeout*/
	var cjsRequire, vertx, setTimer, clearTimer;

	cjsRequire = require;

	// QO MOD: commonJs modules coverted for requireJs use can have
	// issues when dynamically loading more modules via require(..)
	// In this case, when.js doesn't need vertx, so we are commenting it out
	// try {
	// 	vertx = cjsRequire('vertx');
	// 	setTimer = function (f, ms) { return vertx.setTimer(ms, f); };
	// 	clearTimer = vertx.cancelTimer;
	// } catch (e) {
		setTimer = setTimeout;
		clearTimer = clearTimeout;
	// }

	return {
		set: setTimer,
		clear: clearTimer
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
