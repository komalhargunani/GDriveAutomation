(function() {
  'use strict';

  // Framework functions used by all of QOWT. This module does not actually
  // export any APIs at the moment, but rather will extend some basic elements
  // with some useful utility functions

  // TODO(dtilley) Investigate replacing this framework with a public one such
  // as Closure etc (or SugarJS?)


  /**
   * Remove all of the elements children
   * @return {Element} The element itself for chaining
   */
  Element.prototype.clear = function() {
    if (this.hasChildNodes()) {
      while (this.childNodes.length >= 1) {
        this.removeChild(this.firstChild);
      }
    }
    return this;
  };


  /**
   * Detach the element from its parent
   * @return {Element} The element itself for chaining
   */
  Element.prototype.removeElm = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
      return this;
    } else {
      return null;
    }
  };


  /**
   * "Curry" parameters into a function
   * @param {?} context What to point 'this' at inside the baked function
   * @param {...*} Any number of parameters to bake into the function
   * @return {function} Function with parameters baked in
   */
  Function.prototype.bake = function(context) {
    var func = this,
        args = [].slice.call(arguments, 1);
    return function() {
      return func.apply(context, args.concat([].slice.call(arguments, 0)));
    };
  };


  /**
   * Ensure all elements have the getElementById method
   * @param {string} tId The ID to search for
   * @return {Element} The first element with given ID or null
   */
  Element.prototype.getElementById = getElmById_;
  DocumentFragment.prototype.getElementById = getElmById_;

  /** @private */
  function getElmById_(tId) {
    var theElm = null;
    if (this.id === tId) {
      return this;
    } else {
      if (this.hasChildNodes()) {
        for (var cei = 0, cet = this.childNodes.length; cei < cet; cei++) {
          if (this.childNodes[cei].nodeType === Node.ELEMENT_NODE) {
            theElm = this.childNodes[cei].getElementById(tId);
            if (theElm && theElm.id === tId) {
              return theElm;
            }
          }
        }
      }
    }
    return theElm;
  }

})();
