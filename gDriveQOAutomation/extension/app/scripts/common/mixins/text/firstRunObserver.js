define([], function() {

  'use strict';

  return {

    firstRun_: undefined,
    firstRunStyleObserver_: undefined,

    /**
     * This object consists of functions to be invoked when the first run
     * changes. Subscribers who want to observe the first child must add their
     * respective handler functions to this object.
     */
    onFirstRunChanged_: {},

    /**
     * This function is an observer for the first run's styles changes. It will
     * notify subscribers for first run style changed and will invoke the
     * associated functions
     */
    firstRunStyleChanged: function() {
      for (var prop in this.onFirstRunChanged_) {
        var propFunc = this.onFirstRunChanged_[prop];
        propFunc.call(this);
      }
    },

    observeFirstRun_: function() {

      if (this.firstChild && (this.firstRun_ !== this.firstChild)) {
        if (this.firstRunStyleObserver_) {
          this.firstRunStyleObserver_.disconnect();
          this.firstRunStyleObserver_ = undefined;
        }
        this.firstRun_ = this.firstChild;
        // Notify listeners of change
        this.firstRunStyleChanged();

        if (this.firstRun_) {
          // First child is available so ReSetup the observing.
          // Observe the style change for the first run using mutation
          var config = {attributeFilter: ['style', 'class']};
          this.firstRunStyleObserver_ =
              new MutationObserver(this.firstRunStyleChanged.bind(this));
          this.firstRunStyleObserver_.observe(this.firstChild, config);
        }
      }
    }
  };
});
