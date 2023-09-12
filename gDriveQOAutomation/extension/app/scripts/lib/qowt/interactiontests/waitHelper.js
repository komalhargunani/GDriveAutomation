// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview General utility module to reduce code duplication and improve
 * readability of interaction test modules.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
(function () {
  var globalObject = this;

define([
  'qowtRoot/third_party/hooker/hooker',
  'qowtRoot/commands/commandManager',
  'qowtRoot/controls/document/fieldManager',
  'qowtRoot/controls/document/paginator',
  'qowtRoot/commands/contentCheckers/docChecker',
  'qowtRoot/tools/text/textTool',
  'qowtRoot/unittests/utils/fakeKeyboard',
  'qowtRoot/utils/mockKeyboard/keyboard',
  'qowtRoot/utils/mockMouse',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/tools/sheet/sheetTabTool',
  'qowtRoot/promise/deferred',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/tools/point/thumbnailStripTool',
  'qowtRoot/tools/shape/shapeTool',
  'qowtRoot/widgets/point/slidesContainer'
], function(
  Hooker,
  CommandManager,
  FieldManager,
  Paginator,
  DocChecker,
  TextTool,
  FakeKeyboard,
  Keyboard,
  MockMouse,
  PubSub,
  TypeUtils,
  SheetCellTool,
  SheetTextTool,
  SheetTabTool,
  Deferred,
  PromiseUtils,
  ThumbnailStripTool,
  ShapeTool,
  SlidesContainer) {

  'use strict';

  /**
   * Hook in to the command manager in order to know
   * when it gets started. This is reset on every test
   * and works in conjunction with the eventsHandled function
   * below
   */
  globalObject.beforeEach(function() {
    Hooker.hook(CommandManager, 'addCommand', {
      post: function() {
        globalObject.__cmdMgrStarted = true;
      }
    });
  });
  globalObject.afterEach(function() {
    Hooker.unhook(CommandManager);
    delete globalObject.__cmdMgrStarted;
  });

  var _api = {

    /**
     * Wait until the text tool has become active
     * and the command manager queue is empty before
     * any interaction that would cause commands to
     * be added to the command manager.
     */
    docReadyToTest: function() {
      waitsFor(function() {
        return TextTool.isActive() && FieldManager.hasUpdatedFields() &&
            CommandManager.isEmpty();
      }, 'document to be test ready', 10000);
    },

    paginatorIdle: function() {
      return _api.pagination();
    },

    pagination: function() {
      // Guarantee that the waitsFor blocks are always run in the next macrotask
      // TODO(dtilley): waitsFor blocks might already be guaranteed to run in
      // the next macrotask; check this;
      waits(1);

      if (Paginator.isIdle) {
        // legacy paginator check
        waitsFor(Paginator.isIdle, 'paginator idle', 10000);
      }
      else {
        // new polymer word style pagination check
        waitsFor(function() {
          var pendingFlow = document.querySelector('[pending-flow]');
          return pendingFlow === null;
        }, 'pagination done', 10000);
      }
    },

    /**
     * Wait until the sheet cell tool has become active
     * and the command manager queue is empty before
     * any interaction that would cause commands to
     * be added to the command manager.
     */
    sheetReadyToTest: function() {
      waitsFor(function() {
        return SheetCellTool.isActive() && CommandManager.isEmpty();
      }, 'sheet to be test ready', 10000);
    },

    /**
     * Waits until thumbnail strip tool gets active and the commandManager
     * queue is empty because any interaction would cause commands to be added
     * to the commandManager queue.
     */
    presentationReadyToTest: function() {
      waitsFor(function() {
        // Currently, thumbnailStrip tool is the first tool that is
        // activated when the presentation is loaded. Hence, we check for
        // its activation and the commandManager queue in order to assert
        // whether the presentation is ready for testing or not.
        return ThumbnailStripTool.isActive() && CommandManager.isEmpty();
      },'presentation to be test ready', 7000);
    },

    /**
     * Waits until thumbnail is updated after edits and the commandManager
     * queue is empty because any interaction would cause commands to be added
     * to the commandManager queue.
     *
     * Should be used before verifying updated contents in thumbnail
     */
    waitsForThumbnailUpdate: function() {
      waitsFor(function() {
            return SlidesContainer.isThumbnailUpdated() &&
                CommandManager.isEmpty();},
          'thumbnail update after edit', 7000);
    },


    /**
     * Execute a function in a runs block and then wait for the command
     * manager to process all the commands that are generated.
     * @param {Function} editFunc This is a function that causes commands
     *        to be queued, generally this is some sort of simulated user
     *        edit, but could just use the command manager directly to
     *        add a command to the queue.
     * @param {String} opt_editDescription Optional description of the
     *        passed function, this will be used when logging timeouts.
     */
    runsEdit: function(editFunc, opt_editDescription) {
      if (!TypeUtils.isFunction(editFunc)) {
        throw new Error('runsEdit must be passed a function');
      }
      opt_editDescription = opt_editDescription || 'Anonymous edit function';
      // Wait flag.
      var complete = false;
      runs(function() {
        // doResolveOnEmpty returns a promise,
        // once it is done we flip the wait flag.
        CommandManager.__doResolveOnEmpty(editFunc).then(function() {
          complete = true;
        }).catch(PromiseUtils.throwAndEscapeChain);
      });
      // Wait for a minute for the flag to flip,
      // ie. A single edit function that takes over 50 seconds
      // to execute (including all communication with the Core)
      // will timeout and fail the test.
      waitsFor(function() {
        return complete;
      }, opt_editDescription, 50000);

      // and make sure our doc checker is finished verifying the document
      // integrity
      _api.docCheckerIdle();
    },

    /**
     * For just about any E2E test we do something in the UI, which
     * preferably mimics end user behaviour (eg click a button or
     * type some text). We should then wait for QOWT and Core to be
     * done dealing with those events.
     * Some events however (eg click) are asynchronous. So we can not
     * simply wait for commandManager to be idle, because DIRECTLY
     * after the click, the commandManager IS still idle; it hasn't
     * even started yet!
     * This eventsHandled is slightly 'smarter'. It works in conjunction
     * with a hook in the globalBeforeEach (see above), which ensures a flag is
     * set once the command manager STARTs doing something. We first
     * wait for that flag to have been set, and THEN we wait for
     * the command manager to be idle. Once it is, we reset the original
     * flag, so that further calls to eventsHandled can be used.
     */
    eventsHandled: function() {
      function cmdMgrStarted() {
        return globalObject.__cmdMgrStarted;
      }
      function cmdMgrDone() {
        if (CommandManager.isEmpty()) {
          // reset the started flag, and return true (we are done)
          delete globalObject.__cmdMgrStarted;
          return true;
        }
        return false;
      }
      // TODO dtilley: Once all E2E tests have migrated to the mock keyboard
      // remove the fake keyboard wait functions.
      waitsFor(FakeKeyboard.isIdleOrNotStarted, 'fake keyboard', 7000);
      waitsFor(Keyboard.isIdleOrNotStarted, 'mock keyboard', 7000);
      waitsFor(cmdMgrStarted, 'command manager to start', 30000);
      waitsFor(cmdMgrDone, 'command manager to be done', 30000);
    },

    // Make sure these timeouts are long enough, so that when you run
    // a number of tests in parallel and they get slower, we dont blow up
    commandManagerIdle: function() {
      waitsFor(CommandManager.isEmpty, 'command manager idle', 7000);
    },

    // TODO dtilley: Remove this once all E2E tests have
    // been migrated to the mock keyboard.
    fakeKeyboardIdle: function() {
      waitsFor(FakeKeyboard.isIdle, 'fake keyboard', 7000);
    },

    mockKeyboard: function() {
      waitsFor(Keyboard.isIdle, 'mock keyboard', 7000);
    },

    textToolActive: function() {
      waitsFor(TextTool.isActive, 'text tool', 7000);
    },

    overlayToBeShown: function() {
      waitsFor(function() {
        return document.querySelector('qowt-selection-overlay') !== null &&
          document.querySelector('qowt-e-square') !== null;
      }, 'overlay to be shown', 7000);
    },

    overlayToBeRemoved: function() {
      waitsFor(function() {
        return document.querySelector('qowt-selection-overlay') === null;
      }, 'overlay to be removed', 7000);
    },

    // TODO dtilley: Find E2E tests that still use this and change
    // to use the toolbarInitialized and actionAndSignal functions.
    toolbarModelUpdate: function() {
      console.warn('! toolbarModelUpdate function is deprecated');
      waits(500);
    },

    /**
     * Waits until the modal dialog with given title is shown
     * @param {String} expectedTitle - the title on the dialog
     */
    dialogWithTitleToBeShown: function(expectedTitle) {
      waitsFor(function() {
        var dialog = document.querySelector('dialog');
        var header = dialog && dialog.querySelector('header');
        var dialogTitle = header && header.textContent;
        return dialogTitle && dialogTitle === expectedTitle;
      }, 'modal dialog to be shown', 3000);
    },

    /**
     * Waits until the share modal dialog is shown on screen
     */
    shareDialogShown: function() {
      _api.dialogWithTitleToBeShown('Edit with others');
    },

    /**
     * Call this to mock out PromiseUtils.delay, and control the flow of time
     * for code that utilizes it. It is similar to jasmine.Clock.tick, but
     * with Promises, jasmine.Clock.tick() does not make forward progress, for
     * it does not force microtask execution, just setTimeout callbacks.
     *
     * This class provides numerous wrappers around waitsFor, which is
     * necessary to make this at all useful. All the work happens in between
     * poll iterations of waitsFor.
     *
     * @returns {Object} an object with waitsFor wrappers.
     */
    mockPromiseUtilsDelay: function() {
      var queue = [];
      var timeElapsed = 0;
      var promiseId = 0;

      spyOn(PromiseUtils, 'delay').andCallFake(
        function(opt_timeout, opt_value) {
          var delayDeferred = new Deferred();
          var timeout = opt_timeout || 0;
          queue.push({
            timeValue: timeout + timeElapsed,
            resolve: delayDeferred.resolve.bind(delayDeferred, opt_value),
            promiseId: promiseId++
          });
          return delayDeferred.promise;
      });

      /**
       * Elapses time on our mock timer. tick_(100) resolves any delay
       * promises that are scheduled for 100ms out. Another call to
       * tick_(100) resolves delay promises that were either
       *  - Scheduled for 200 ms out
       *  - scheduled for 100 ms out after the first call to tick_
       * tick_(0) is valid and is quite useful. It essentially moves forward
       * one turn.
       *
       * @param opt_time {Number} number of milliseconds to elapse.
       */
      function tick_(opt_time) {
        opt_time = opt_time || 0;
        timeElapsed += opt_time;
        queue.sort(function(a, b) {
          return (a.timeValue - b.timeValue) || (a.promiseId - b.promiseId);
        });
        while ((queue.length > 0) && (queue[0].timeValue <= timeElapsed)) {
          var item = queue.shift();
          item.resolve();
        }
      }

      /**
       * @param conditionFn {Function} function must return true the first
       *     poll iteration *after* we need to stop waiting
       * @param tickInterval {Number} the amount to pass to tick_ on every
       *     poll iteration
       * @param msg {String} the message for waitsFor
       * @param opt_timeout {Number} the timeout for waitsFor
       */
      function wrappedWaitsFor_(conditionFn, tickInterval, msg, opt_timeout) {
        opt_timeout = opt_timeout || kDefaultTimeout_;

        waitsFor(function() {
          if (conditionFn()) {
            return true;
          } else {
            tick_(tickInterval);
            return false;
          }
        }, msg, opt_timeout);
      }

      var kDefaultTimeout_ = 10000;


      return {
        /**
         * Waits for the exact specified number of turns to elapse,
         * from the standpoint of code that uses PromiseUtils.delay.
         *
         * For example:
         *
         * var mockDelay = WaitHelper.useMockDelay();
         * runs(setupFn);
         * mockDelay.waitsTurns(3); // wait exactly 3 turns
         * runs(expectationsFn);
         *
         * @param opt_nTurns {Number} the number of turns. 1 is default.
         * @param opt_msg {String} the wait message
         * @param opt_timeout {Number} the timeout for test failure.
         */
        waitsTurns: function(opt_nTurns, opt_msg, opt_timeout) {
          opt_nTurns = opt_nTurns || 1;
          opt_msg = opt_msg || 'waiting ' + opt_nTurns + ' turns';

          var counter = 0;
          wrappedWaitsFor_(function() {
            return counter++ === opt_nTurns;
          }, 0, opt_msg, opt_timeout);
        },

        /**
         * Equivalent to jasmine.Clock.tick. Elapses the timer the time
         * specified. All of the handlers will run in one turn.
         *
         * For example:
         *
         * var mockDelay = WaitHelper.useMockDelay();
         * runs(setupFn);
         * mockDelay.waitsTime(150); // wait 150 ms
         * runs(expectationsFn)
         *
         * @param opt_timeMs {Number} milliseconds to wait, default is 0.
         * @param opt_msg {String} the wait message
         * @param opt_timeout {Number} the timeout for test failure.
         */
        waitsTime: function(opt_timeMs, opt_msg, opt_timeout) {
          opt_timeMs = opt_timeMs || 0;
          opt_msg = opt_msg || 'waiting ' + opt_timeMs + ' ms';

          var counter = 0;
          wrappedWaitsFor_(function() {
            return counter++ === 1;
          }, opt_timeMs, opt_msg, opt_timeout);
        },

        /**
         * Like jasmine waitsFor, but synchronizes your polling with the
         * promise's progress. The condition function is called exactly
         * once per turn, from the perspective of any code relying on
         * Promises.delay. This is done by only ticking the mock timer on
         * poll iterations. Once condition function returns true, no more
         * progress is made.
         *
         * var mockDelay = WaitHelper.useMockDelay();
         * runs(setupFn);
         * mockDelay.waitsFor(condition);
         * runs(expectationsFn)
         *
         * @param conditionFn {Number} milliseconds to wait, default is 0.
         * @param opt_msg {String} the wait message
         * @param opt_timeout {Number} the timeout for test failure.
         */
        waitsFor: function(conditionFn, msg, opt_timeout) {
          wrappedWaitsFor_(conditionFn, 0, msg, opt_timeout);
        }
      };
    },

    /**
     * Execute a function supplied in a runs block, and wait for a specific
     * signal that the action caused. Eg. apply Bold and wait for the toolbar
     * to update itself.
     * @param {Function} editFunc The edit encased in a function.
     * @param {String} signalName The signal to wait for after the action.
     * @param {String} opt_timeoutMsg optional msg to display when it times out
     */
    runsAndSignal: function(editFunc, signalName, opt_timeoutMsg) {
      var waiter;
      runs(function() {
        waiter = _api.createWaiter(signalName);
      });
      runs(editFunc);
      runs(function() {
        _api.waiterDone(waiter, opt_timeoutMsg);
      });
    },

    runsAndSignalImmutable: function(editFunc, signalName, opt_timeoutMsg) {
      var waiter;
      runs(function() {
        waiter = _api.createWaiter(signalName);
      });
      runs(editFunc);
      runs(function() {
        _api.waiterDone(Object.assign({}, waiter), opt_timeoutMsg);
      });
    },

    /**
     * Waits until all of the specified text has been
     * entered and all of it has been auto-saved.
     * This method handles the case when the system is
     * busy and there are large gaps between each character
     * of the text being entered, which may cause intermediate
     * auto-saves to occur. This method will not complete until
     * an auto-save has occurred following entry of the final
     * character of text.
     *
     * This method can be used by Word tests.
     *
     * @param {string} text The text to be entered and auto-saved.
     *                      This must be a string with at least one character.
     */
    autoSaveAllText: function(text) {
      expect(text).toBeDefined();
      expect(text.length).toBeGreaterThan(0);
      var done = false;
      var numCharsProcessed = 0;
      var saveFailures = 0;
      var token1 = PubSub.subscribe('qowt:cmdtextTxEndStop', function() {
        ++numCharsProcessed;
      });
      var token2 = PubSub.subscribe('qowt:cmdsaveFileStop', function() {
        if(numCharsProcessed === text.length) {
          done = true;
        }
      });
      var token3 = PubSub.subscribe('qowt:ss:savingFailed', function() {
        ++saveFailures;
      });

      runs(function() {
        FakeKeyboard.typeText(text);
      });

      waitsFor(function() {
        return done;
      }, 'wait for auto-save after all text entered', 7000);

      runs(function() {
        expect(saveFailures).toBe(0);
        PubSub.unsubscribe(token1);
        PubSub.unsubscribe(token2);
        PubSub.unsubscribe(token3);
      });
    },

    sheetCellToolActive: function() {
      waitsFor(SheetCellTool.isActive, 'sheet cell tool activation', 7000);
    },

    sheetTextToolActive: function() {
      waitsFor(SheetTextTool.isActive, 'sheet text tool activation', 7000);
    },

    sheetTabToolActive: function() {
      waitsFor(SheetTabTool.isActive, 'sheet tab tool activation', 7000);
    },

    gaStatesToMatch: function(states) {
      var expectedString = states.join(', ');
      function statesToMatch() {
        var actual = globalObject.parent.__gaMock.appViews;
        var actualString = actual.join(', ');
        return actualString === expectedString;
      }
      waitsFor(statesToMatch, 'ga states to match', 2000);
    },


    /**
     * Create a waiter object for a specific signal from the PubSub.
     * @param {String} signal The event name.
     * @param {Function} opt_filterFunc An optional filter function that
     *                                  receives the signal and signalData.
     *
     * var EventWaiter = WaitFor.createWaiter(
     *         'qowt:event',
     *         function(signal, signalData) {
     *           return !!((signal === 'qowt:event') &&
     *                     (signalData.type === 'text'));
     *         });
     * waitsFor(EventWaiter.isDone, 'event to complete', 10000);
     *
     * @return {Object}
     */
    createWaiter: function(signal, opt_filterFunc) {
      return new WaiterModule(signal, opt_filterFunc);
    },

    waiterDone: function(waiterObj, timeoutMsg) {
      if (waiterObj && TypeUtils.isFunction(waiterObj.isDone)) {
        waitsFor(
            // Note: The Jasmine function waitsFor applies the function
            // to the current spec, so we have to bind it to its own object.
            waiterObj.isDone.bind(waiterObj),
            timeoutMsg || ('waiter.' + waiterObj.signal + ' object to be done'),
            10000);
      }
    },

    /**
     * Simulates the click on the menu-button of the Toolbar and waits till the
     * toolbar model gets updated in case the Core is not modified by user
     * click action
     *
     * @param menuButton - Menu-button DOM element
     * @param {String} opt_timeoutMsg optional msg to display when it times out
     */
    TransientModelUpdateOnMenuClick: function (menuButton, opt_timeoutMsg) {
      _simulateClickOnToolbar(menuButton,
          'qowt:transientModelUpdate:toolbarDone', opt_timeoutMsg);
    },

    /**
     * Simulates the click on the menu-button of the Toolbar and waits till the
     * toolbar model gets updated in case the Core is modified by user click
     * action
     *
     * @param menuButton - Menu-button DOM element
     * @param {String} opt_timeoutMsg optional msg to display when it times out
     */
    ToolbarModelUpdateOnMenuClick: function (menuButton, opt_timeoutMsg) {
      _simulateClickOnToolbar(menuButton, 'qowt:modelUpdate:toolbarDone',
          opt_timeoutMsg);
    },

    ToolbarUpdateAfterSelectionChangeOnMenuClick:
        function(menuButton, opt_timeoutMsg) {
      _simulateClickOnToolbar(menuButton, 'qowt:selectionChanged:toolbarDone',
          opt_timeoutMsg);
    },

    /**
     * Waits until shape tool get active or 7 seconds.
     */
    shapeToolActive: function() {
      waitsFor(ShapeTool.isActive, 'shape tool', 7000);
    },

    /**
     * Simulates the click on the menu-button of the toolbar and waits till
     * toolbar model gets updated.
     *
     * @param {String} menuButton - Menu-button DOM element
     * @param {String} event_name - The event name.
     * @param {String} opt_timeoutMsg optional msg to display when it times out
     */
    simulateClickOnToolbar: function(menuButton, event_name, opt_timeoutMsg) {
      _simulateClickOnToolbar(menuButton, event_name, opt_timeoutMsg);
    },

    docCheckerIdle: function() {
      waitsFor(function() {
        return DocChecker.isIdle();
      }, 'waiting for doc checker to finish', 50000);
    }
  };

  // PRIVATE ===================================================================

  function WaiterModule(signal, filter) {
    this.signal = signal;
    this.filter = TypeUtils.isFunction(filter) ? filter : undefined;
    this.received = false;
    this.token = PubSub.subscribe(this.signal, function(signal, signalData) {
      if (this.filter === undefined ||
         (this.filter && this.filter(signal, signalData))) {
        this.received = true;
        PubSub.unsubscribe(this.token);
      }
    }.bind(this),
    {after: true, once: false});
  }

  WaiterModule.prototype = {
    __proto__: Object.prototype,
    isDone: function() {
      return this.received;
    },
    reset: function() {
      this.received = false;
    }
  };

  /**
   * Simulates the click on the menu-button of the Toolbar and waits till the
   * toolbar model gets updated.
   *
   * @param menuItem - menu-button DOM element
   * @param signal   - signal indicating toolbar model is updated completely
   * @param {String} opt_timeoutMsg optional msg to display when it times out
   */
  function _simulateClickOnToolbar(menuButton, signal, opt_timeoutMsg) {
    _api.runsAndSignal(
        function () {
          MockMouse.click(menuButton);
        },
        signal, opt_timeoutMsg
    );
  }

  return _api;

});
})();
