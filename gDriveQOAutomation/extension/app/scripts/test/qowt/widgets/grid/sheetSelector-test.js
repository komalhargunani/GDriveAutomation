define([
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/device',
  'qowtRoot/widgets/grid/sheetSelector'
], function(
    SheetModel,
    PubSub,
    Device,
    SheetSelector) {

  'use strict';

  describe('Sheet - SheetSelector Widget', function() {
    var sandbox_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
    });


    afterEach(function() {
      sandbox_.restore();
    });

    describe('sheet selector test for touch-enabled device', function() {
      var widget_, selectorElement_, sheetSelector_;

      beforeEach(function() {
        sheetSelector_ = document.createElement('div');
        sheetSelector_.classList.add('qowt-sheet-selector');
        sheetSelector_.style.position = 'absolute';
        document.body.appendChild(sheetSelector_);
        widget_ = SheetSelector;
        widget_.init();

        sandbox_.stub(Device, 'isTouchDevice', (function() {
          return true;
        }));
        widget_.appendTo(sheetSelector_);
      });


      afterEach(function() {
        widget_.destroy();
        widget_ = undefined;
        selectorElement_ = undefined;
        document.body.removeChild(sheetSelector_);
        sheetSelector_ = undefined;
      });


      describe('Creation', function() {
        it('should create draggable tabs if device is touch-enabled.',
            function() {
              assert.isTrue(sheetSelector_.classList.contains('draggable'));

              var selectorWrapper = sheetSelector_.getElementsByClassName(
                  'qowt-sheet-selector-wrapper')[0];
              assert.isDefined(selectorWrapper);

              selectorElement_ = sheetSelector_.getElementsByClassName(
                  'qowt-sheet-selector-element')[0];
              assert.isDefined(selectorElement_);
            });


        it('should create scrollable buttons for touch-enabled devices.',
            function() {
              assert.isTrue(sheetSelector_.classList.contains(
                  'scroll-inactive'));

              selectorElement_ = sheetSelector_.getElementsByClassName(
                  'qowt-sheet-selector-element')[0];
              assert.isDefined(selectorElement_);

              var scrollableContainer = sheetSelector_.getElementsByClassName(
                  'qowt-sheet-scroll-btn-container')[0];
              assert.isDefined(scrollableContainer);

              var arraySlice = Array.prototype.slice;
              var scrollableButtons = arraySlice.call(scrollableContainer.
                  getElementsByClassName('qowt-sheet-scroll-btn'), 0);
              assert.strictEqual(scrollableButtons.length, 2);
              assert.isTrue(scrollableButtons[0].classList.contains('left'));
              assert.isTrue(scrollableButtons[1].classList.contains('right'));
            });
      });


      describe('Publishing of Signals', function() {
        beforeEach(function() {
          widget_.createTab('Sheet 1');
          widget_.createTab('Sheet 2');
          selectorElement_ = document.getElementsByClassName(
              'qowt-sheet-selector-element')[0];

          widget_.setActiveTab(0);
          SheetModel.activeSheetIndex = 0;

          sandbox_.stub(PubSub, 'publish');
        });


        afterEach(function() {
          widget_.removeTab('Sheet 1');
          widget_.removeTab('Sheet 2');
        });


        it('should publish a "qowt:sheet:requestFocus" signal if the user ' +
            'touches on a tab that is not active', function() {
              var evt = document.createEvent('Event');
              evt.changedTouches = getChangedTouches_();
              evt.initEvent('touchend');
              selectorElement_.childNodes[1].dispatchEvent(evt);

              var expectedSignalData = {
                sheetIndex: 1,
                selectionEvent: evt,
                contentType: 'sheetTab'
              };
              assert(PubSub.publish.calledWith('qowt:sheet:requestFocus',
                  expectedSignalData));
            });


        it('should not publish a "qowt:sheet:requestFocus" signal if the ' +
            'user touches a tab that is already active', function() {
              var evt = document.createEvent('Event');
              evt.initEvent('touchleave');
              selectorElement_.childNodes[0].dispatchEvent(evt);
              assert(PubSub.publish.notCalled);
            });

        var getChangedTouches_ = function() {
          var changedTouches = [];
          changedTouches[0] = {
            clientX: 861.5,
            clientY: 396.5
          };
          return changedTouches;
        };
      });
    });

    describe('Switch to next and previous sheet tests', function() {
      var sheetTabs_;

      beforeEach(function() {
        // mock sheet tab length
        sheetTabs_ = SheetSelector.getSheetTabs();
        sheetTabs_.length = 3;
        sandbox_.stub(PubSub, 'publish');
      });


      afterEach(function() {
        sheetTabs_ = undefined;
        sandbox_.restore();
      });


      it('Should switch to next sheet from first sheet', function() {
        setActiveTab_(0);

        SheetSelector.switchToNextSheet();
        verifyActiveSheet_(1, true);
      });

      it('Should not move to previous sheet if first sheet is active',
          function() {
            setActiveTab_(0);

            SheetSelector.switchToPreviousSheet();
            verifyActiveSheet_(0, false);
          });

      it('Should switch to previous sheet from second sheet', function() {
        setActiveTab_(1);

        SheetSelector.switchToPreviousSheet();
        verifyActiveSheet_(0, true);
      });

      it('Should switch to next sheet from second sheet', function() {
        setActiveTab_(1);

        SheetSelector.switchToNextSheet();
        verifyActiveSheet_(2, true);
      });

      it('Should switch to previous sheet from third sheet', function() {
        setActiveTab_(2);

        SheetSelector.switchToPreviousSheet();
        verifyActiveSheet_(1, true);
      });

      it('Should not switch to next sheet if last sheet is active',
          function() {
            setActiveTab_(2);

            SheetSelector.switchToNextSheet();
            verifyActiveSheet_(2, false);
          });


      var setActiveTab_ = function(sheetIndex) {
        assert.isDefined(SheetSelector, 'sheetSelector is not defined');

        SheetSelector.setActiveTab(sheetIndex);
        assert.equal(SheetSelector.getActiveTab(), sheetIndex,
            'Expected Sheet is not active');
      };


      /**
       * Verifies the active sheet Index
       *
       * @param {Number} expectedSheetIndex  - zero based sheet index
       * @param {boolean} expectSheetChange - true, if active sheet is suppose
       *                                      to change otherwise false
       * @private
       */
      var verifyActiveSheet_ = function(expectedSheetIndex, expectSheetChange) {
        assert.equal(SheetSelector.getActiveTab(), expectedSheetIndex,
            'Expected Sheet is not active');

        if (expectSheetChange) {
          assert.isTrue(PubSub.publish.calledWith('qowt:doAction', {
            'action': 'changeSheet',
            'context': {
              contentType: 'sheet',
              newSheetIndex: expectedSheetIndex
            }
          }), 'Change Sheet Action has not been called');
        } else {
          assert.isFalse(PubSub.publish.calledWith('qowt:doAction', {
            'action': 'changeSheet',
            'context': {
              contentType: 'sheet',
              newSheetIndex: expectedSheetIndex
            }
          }), 'Change Sheet Action has been called');
        }
      };
    });
  });
});
