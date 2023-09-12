define([
  'qowtRoot/controls/point/animation/animationRequestHandler',
  'qowtRoot/controls/point/slide',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/point',
  'qowtRoot/models/transientAction',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/widgets/drawing/ghostShape',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(AnimationRequestHandler,
            SlideControl,
            ErrorCatcher,
            Features,
            PubSub,
            PointModel,
            TransientActionModel,
            SelectionManager,
            GhostShape,
            WidgetFactory,
            SlidesContainer,
            ThumbnailStrip) {

  'use strict';

  describe('Slide Control Tests', function() {

    var dummyNode_, shapeNode_, shapeWidget_, textNode_, shapeTextBodyWidget_,
        sandbox_ = sinon.sandbox.create();
    beforeEach(function() {
      sandbox_.spy(PubSub, 'subscribe');
      sandbox_.spy(SlidesContainer, 'init');
      sandbox_.stub(GhostShape, 'init');
      sandbox_.stub(GhostShape, 'appendTo');
      dummyNode_ = document.createElement('div');
      dummyNode_.setAttribute('qowt-divtype', 'slide');
      sandbox_.stub(SlidesContainer, 'node').returns(dummyNode_);

      // While initializing the slidesContainer, a PaperToast element is created
      // The PaperToast adds an iron-announcer in document's body. Stubbing this
      // here as it is not required in this test and to avoid leaking of nodes.
      sandbox_.stub(Polymer.IronA11yAnnouncer, 'requestAvailability');

      // Mock a shape node
      shapeNode_ = document.createElement('div');
      shapeNode_.setAttribute('qowt-divtype', 'shape');

      // Mock a shape widget
      shapeWidget_ = {
        getWidgetElement: function() { return shapeNode_; },
        select: function() {},
        deselect: function() {},
        getShapeTextBodyWidget: function() { return shapeTextBodyWidget_; },
        getOffsets: function() {return {x: 0, y: 0};},
        getExtents: function() {return {cx: 0, cy: 0};},
        isFlippedHorizontal: function() {},
        isFlippedVertical: function() {}
      };

      // Mock a text box node
      textNode_ = document.createElement('div');
      textNode_.setAttribute('qowt-divtype', 'textBox');

      // Mock a shapeTextBodyWidget
      shapeTextBodyWidget_ = {
        getWidgetElement: function() { return textNode_; },
        activate: function() {},
        deactivate: function() {}
      };

      // Fake widget factory's create method
      sandbox_.stub(WidgetFactory, 'create', function(config) {
        if (config.fromNode.getAttribute('qowt-divtype') === 'shape' ||
            config.fromNode.getAttribute('qowt-divtype') === 'grFrm') {
          return shapeWidget_;
        } else if (config.fromNode.getAttribute('qowt-divtype') ===
            'textBox') {
          return shapeTextBodyWidget_;
        }
      });

      SlideControl.init();
    });
    afterEach(function() {
      sandbox_.restore();
      shapeNode_ = undefined;
      textNode_ = undefined;
      shapeWidget_ = undefined;
      shapeTextBodyWidget_ = undefined;
      dummyNode_ = undefined;
    });

    describe('on mouseenter', function() {
      var evt_;
      beforeEach(function() {
        evt_ = document.createEvent('Event');
        evt_.initEvent('mouseenter', true, false);
      });

      afterEach(function() {
        evt_ = undefined;
      });

      it('should set cursor to crosshair if transientAction is initAddShape',
        function() {
          var dummyTransientAction = {action: 'initAddShape'};
          sandbox_.stub(TransientActionModel, 'getPendingTransientActions').
              returns(dummyTransientAction);
          dummyNode_.dispatchEvent(evt_);
          assert.strictEqual(dummyNode_.style.cursor, 'crosshair',
              'cursor style set to crosshair');
        });
      it('should set cursor to default if transientAction is empty',
          function() {
            sandbox_.stub(TransientActionModel, 'getPendingTransientActions').
                returns({});
            dummyNode_.dispatchEvent(evt_);
            assert.strictEqual(dummyNode_.style.cursor, 'default',
                'cursor style set to default');
          });
      it('should set cursor to default if transientAction is other than ' +
          'initAddShape', function() {
            var dummyTransientAction = {action: 'xyz'};
            sandbox_.stub(TransientActionModel, 'getPendingTransientActions').
            returns(dummyTransientAction);
            dummyNode_.dispatchEvent(evt_);
            assert.strictEqual(dummyNode_.style.cursor, 'default',
                'cursor style set to default');
          });
    });

    describe('on mousedown', function() {
      var evt_;
      beforeEach(function() {
        sandbox_.stub(Features, 'isEnabled').returns(true);

        evt_ = document.createEvent('Event');
        evt_.initEvent('mousedown', true, false);
      });

      afterEach(function() {
        evt_ = undefined;
      });

      describe('no pending transient actions', function() {
        beforeEach(function() {
          sandbox_.stub(TransientActionModel, 'getPendingTransientActions').
              returns({});
        });
        it('should clear slide selection and activate slide tool upon ' +
            'mousedown on slide ', function() {
          sandbox_.stub(PubSub, 'publish');
          dummyNode_.dispatchEvent(evt_);
          assert.strictEqual(PubSub.publish.getCall(0).args[0],
              'qowt:clearSlideSelection', 'slide selection cleared');
          assert.strictEqual(PubSub.publish.getCall(1).args[0],
              'qowt:requestFocus', 'focus requested');
          assert.strictEqual(PubSub.publish.getCall(1).args[1].contentType,
              'slide', 'focus requested with contentType slide');
        });

        it('should not select shape within group shape', function() {
          dummyNode_.setAttribute('qowt-divtype', 'shape');
          var groupShapeDiv = document.createElement('div');
          groupShapeDiv.setAttribute('qowt-divtype', 'groupShape');
          groupShapeDiv.appendChild(dummyNode_);

          sandbox_.stub(shapeWidget_, 'select');

          dummyNode_.dispatchEvent(evt_);
          assert.isTrue(shapeWidget_.select.notCalled, 'shape not selected');
        });

        it('should select a shape on mousedown on shape', function() {
          dummyNode_.setAttribute('qowt-divtype', 'shape');

          sandbox_.stub(shapeWidget_, 'select');
          dummyNode_.dispatchEvent(evt_);

          assert.isTrue(shapeWidget_.select.calledOnce, 'shape selected');
        });

        it('should select a chart on mousedown', function() {
          dummyNode_.setAttribute('qowt-divtype', 'grFrm');
          sandbox_.stub(shapeWidget_, 'select');

          // Simulate a mousedown event
          dummyNode_.dispatchEvent(evt_);

          assert.isTrue(shapeWidget_.select.calledOnce, 'shape selected');
        });

        it('should select shape widget when mousedown on shapes having no ' +
            'text body. e.g. a generic body placeholder with image as content',
            function() {
              dummyNode_.setAttribute('qowt-divtype', 'shape');

              sandbox_.stub(shapeWidget_, 'select');
              sandbox_.stub(shapeTextBodyWidget_, 'activate');

              // Simulate a mousedown event
              dummyNode_.dispatchEvent(evt_);

              assert.isTrue(shapeWidget_.select.calledOnce, 'shape selected');
              assert.isTrue(shapeTextBodyWidget_.activate.notCalled,
                  'shapeTextBody not activated');
            });

        it('should select shape on mousedown on text', function() {
          dummyNode_.setAttribute('qowt-divtype', 'textBox');
          shapeNode_.appendChild(dummyNode_);

          sandbox_.stub(shapeWidget_, 'select');

          // Simulate a mousedown event
          dummyNode_.dispatchEvent(evt_);

          assert.isTrue(shapeWidget_.select.calledOnce, 'shape selected');
        });

        it('should activate text body widget on mousedown on text', function() {
          dummyNode_.setAttribute('qowt-divtype', 'textBox');
          shapeNode_.appendChild(dummyNode_);

          sandbox_.stub(shapeTextBodyWidget_, 'activate');

          // Simulate a mousedown event
          dummyNode_.dispatchEvent(evt_);

          assert.isTrue(shapeTextBodyWidget_.activate.calledOnce,
              'shape text body activated');
        });

        it('should activate text body widget on mousedown on table cell',
            function() {
              var tableCell = document.createElement('div');
              tableCell.setAttribute('qowt-divtype', 'tableCell');

              dummyNode_.setAttribute('qowt-divtype', 'textBox');
              tableCell.appendChild(dummyNode_);
              shapeNode_.appendChild(tableCell);
              sandbox_.stub(shapeTextBodyWidget_, 'activate');

              // Simulate a mousedown event
              dummyNode_.dispatchEvent(evt_);

              assert.isTrue(shapeTextBodyWidget_.activate.calledOnce,
                  'shape text body activated');
            });
      });

      describe('with initAddShape as pending transient action', function() {
        beforeEach(function() {
          var addShapeTransientAction = {
            action: 'initAddShape',
            context: {
              prstId: 88,
              isTxtBox: true
            }
          };
          sandbox_.stub(TransientActionModel, 'getPendingTransientActions').
              returns(addShapeTransientAction);
        });
        it('should clear slide selection and activate slide tool upon ' +
            'mousedown on slide ', function() {
          sandbox_.stub(PubSub, 'publish');
          dummyNode_.dispatchEvent(evt_);
          assert.strictEqual(PubSub.publish.getCall(0).args[0],
              'qowt:clearSlideSelection', 'slide selection cleared');
          assert.strictEqual(PubSub.publish.getCall(1).args[0],
              'qowt:requestFocus', 'focus requested');
          assert.strictEqual(PubSub.publish.getCall(1).args[1].contentType,
              'slide', 'focus requested with contentType slide');
        });

      });
    });

    describe('on click', function() {
      var clickEvt_;
      beforeEach(function() {
        clickEvt_ = document.createEvent('Event');
        clickEvt_.initEvent('click', true, false);
      });

      afterEach(function() {
        clickEvt_ = undefined;
      });

      describe('in viewer mode', function() {
        beforeEach(function() {
          sandbox_.stub(Features, 'isEnabled').returns(false);
          sandbox_.stub(window, 'open');
          sandbox_.stub(SlidesContainer, 'showToast');
        });

        it('should open the link if the a span containing a supported link ' +
            'is clicked', function() {
              dummyNode_.getLink = function() {return 'www.google.com';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.calledOnce, 'link opened');
              assert.strictEqual(window.open.getCall(0).args[0],
                  'www.google.com', 'window.open called with correct link');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to an .exe file) is clicked', function() {
              dummyNode_.getLink = function() {return 'xyz.exe';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to an .pptx file) is clicked', function() {
              dummyNode_.getLink = function() {return 'xyz.pptx';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to an slide) is clicked', function() {
              dummyNode_.getLink = function() {return 'ppt/slides/xyz';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to a file) is clicked', function() {
              dummyNode_.getLink = function() {return 'file:xyz';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to a file/folder) is clicked', function() {
              dummyNode_.getLink = function() {return '../xyz';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(an action context) is clicked', function() {
              dummyNode_.getLink = function() {return 'ppaction://';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });
      });

      describe('in slideShowMode', function() {
        beforeEach(function() {
          PointModel.slideShowMode = true;
          sandbox_.stub(window, 'open');
          sandbox_.stub(SlidesContainer, 'showToast');
        });

        afterEach(function() {
          PointModel.slideShowMode = false;
        });

        it('should open the link if the a span containing a link is clicked',
            function() {
              dummyNode_.getLink = function() {return 'www.google.com';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.calledOnce, 'link opened');
              assert.strictEqual(window.open.getCall(0).args[0],
                  'www.google.com', 'window.open called with correct link');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to an .exe file) is clicked', function() {
              dummyNode_.getLink = function() {return 'xyz.exe';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to an .pptx file) is clicked', function() {
              dummyNode_.getLink = function() {return 'xyz.pptx';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to a slide) is clicked', function() {
              dummyNode_.getLink = function() {return 'ppt/slides/xyz';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to a file) is clicked', function() {
              dummyNode_.getLink = function() {return 'file:xyz';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should not open the link if the a span containing a unsupported ' +
            'link(to a file/folder) is clicked', function() {
              dummyNode_.getLink = function() {return '../xyz';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should play animation if available when user is in slide show ' +
            'mode on clicked', function() {
              sandbox_.stub(AnimationRequestHandler, 'isAnimationToBePlayed').
                  returns(true);
              sandbox_.stub(AnimationRequestHandler, 'playOnClick');
              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(AnimationRequestHandler.playOnClick.calledOnce,
                  'animation played');
            });


        it('should not open the link if the a span containing a unsupported ' +
            'link(an action context) is clicked', function() {
              dummyNode_.getLink = function() {return 'ppaction://';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
              assert.isTrue(SlidesContainer.showToast.called,
                  'toast shown');
            });

        it('should publish selection event for thumbnail when user is in ' +
            'slide show mode on click', function() {
              sandbox_.stub(PubSub, 'publish');
              dummyNode_.dispatchEvent(clickEvt_);
              assert.strictEqual(PubSub.publish.lastCall.args[0],
                  'qowt:doAction');
              assert.strictEqual(PubSub.publish.lastCall.args[1].action,
                  'slideSelect');
            });
      });

      describe('in editor mode', function() {
        it('should not open the link if the a span containing a link is ' +
            'clicked in editor mode', function() {
              sandbox_.stub(Features, 'isEnabled').returns(true);
              sandbox_.stub(window, 'open');

              dummyNode_.getLink = function() {return 'www.google.com';};

              dummyNode_.dispatchEvent(clickEvt_);
              assert.isTrue(window.open.notCalled, 'link not opened');
            });
      });
    });

    describe('on keydown', function() {
      var event_;
      beforeEach(function() {
        sandbox_.stub(Features, 'isEnabled').returns(true);

        event_ = document.createEvent('Event');
        event_.initEvent('keydown', true, false);
      });

      afterEach(function() {
        event_ = undefined;
      });
      it('should move shape when shape is selected and arrow key is pressed',
          function() {
            sandbox_.stub(PubSub, 'publish');
            var dummySlideWidget = {
              getSlideIndex: function() {
                return 1;
              }
            };
            sandbox_.stub(SlidesContainer, 'getCurrentSlideWidget').returns(
                dummySlideWidget);
            var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
            var currentSlideIndex = currentSlideWidget.getSlideIndex();
            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'shape',
              scope: shapeNode_
            });
            event_.keyCode = 37;
            document.dispatchEvent(event_);
            // get the published a qowt:doAction signal
            var qowtRequestActionSignal =
                  PubSub.publish.args.filter(function(item) {
                    return item[0] === 'qowt:requestAction';
                  })[0];
            assert.strictEqual(qowtRequestActionSignal[0],
                'qowt:requestAction');
            assert.strictEqual(qowtRequestActionSignal[1].action,
                'modifyTransform');
            assert.strictEqual(qowtRequestActionSignal[1].
                context.command.sn, currentSlideIndex + 1);
          });

      it('should throw silent error on move shape when shape is selected ' +
          'and arrow key is pressed and selection scope is undefined',
          function() {
            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'shape'
            });
            sandbox_.stub(ErrorCatcher, 'handleError');

            event_.keyCode = 37;
            document.dispatchEvent(event_);

            assert.isTrue(ErrorCatcher.handleError.calledOnce,
                'handle error called');
          });

      it('should delete shape when selected and backspace key is pressed',
          function() {
            sandbox_.stub(PubSub, 'publish');

            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'shape',
              scope: shapeNode_
            });

            event_.keyCode = 8;
            document.dispatchEvent(event_);

            assert.strictEqual(PubSub.publish.lastCall.args[0],
                'qowt:requestAction');
            assert.strictEqual(PubSub.publish.lastCall.args[1].action,
                'deleteShape');
          });

      it('should delete shape when selected and delete key is pressed',
          function() {
            sandbox_.stub(PubSub, 'publish');

            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'shape',
              scope: shapeNode_
            });

            event_.keyCode = 46;
            document.dispatchEvent(event_);

            assert.strictEqual(PubSub.publish.lastCall.args[0],
                'qowt:requestAction');
            assert.strictEqual(PubSub.publish.lastCall.args[1].action,
                'deleteShape');
          });

      it('should not delete chart when chart is selected and ' +
          'delete key is pressed', function() {
            sandbox_.stub(PubSub, 'publish');

            shapeNode_.setAttribute('qowt-divtype', 'grFrm');

            //Mock the SelectionManager
            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'shape',
              scope: shapeNode_
            });
            event_.keyCode = 46;
            document.dispatchEvent(event_);

            assert.isTrue(PubSub.publish.notCalled, 'no event published');
          });

      it('should throw silent error when shape is selected and delete key is' +
          ' pressed and selection scope is undefined', function() {
            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'shape'
            });
            sandbox_.stub(ErrorCatcher, 'handleError');
            event_.keyCode = 46;
            document.dispatchEvent(event_);

            assert.isTrue(ErrorCatcher.handleError.calledOnce,
                'handle error called');
          });

      it('should move to next slide upon down key press', function() {
        sandbox_.stub(ThumbnailStrip, 'selectedIndex').returns(1);
        sandbox_.stub(PubSub, 'publish');
        sandbox_.stub(SelectionManager, 'getSelection').returns({
          contentType: 'slide'
        });

        event_.keyCode = 40;
        document.dispatchEvent(event_);

        // get the published a qowt:doAction signal
        var qowtDoActionSignal =
              PubSub.publish.args.filter(function(item){
                return item[0] === "qowt:doAction";
              })[0];

        assert.strictEqual(qowtDoActionSignal[0], 'qowt:doAction');
        assert.strictEqual(qowtDoActionSignal[1].action, 'slideSelect');
        assert.strictEqual(qowtDoActionSignal[1].context.index, 2);
      });

      it('should move to next slide upon right key press', function() {
        sandbox_.stub(ThumbnailStrip, 'selectedIndex').returns(1);
        sandbox_.stub(PubSub, 'publish');
        sandbox_.stub(SelectionManager, 'getSelection').returns({
          contentType: 'slide'
        });

        event_.keyCode = 39;
        document.dispatchEvent(event_);

        // get the published a qowt:doAction signal
        var qowtDoActionSignal =
              PubSub.publish.args.filter(function(item){
                return item[0] === "qowt:doAction";
              })[0];

        assert.strictEqual(qowtDoActionSignal[0], 'qowt:doAction');
        assert.strictEqual(qowtDoActionSignal[1].action, 'slideSelect');
        assert.strictEqual(qowtDoActionSignal[1].context.index, 2);
      });

      it('should move to previous slide upon up key press', function() {
        sandbox_.stub(ThumbnailStrip, 'selectedIndex').returns(2);
        sandbox_.stub(PubSub, 'publish');
        sandbox_.stub(SelectionManager, 'getSelection').returns({
          contentType: 'slide'
        });

        event_.keyCode = 38;
        document.dispatchEvent(event_);

        // get the published a qowt:doAction signal
        var qowtDoActionSignal =
              PubSub.publish.args.filter(function(item){
                return item[0] === "qowt:doAction";
              })[0];

        assert.strictEqual(qowtDoActionSignal[0], 'qowt:doAction');
        assert.strictEqual(qowtDoActionSignal[1].action, 'slideSelect');
        assert.strictEqual(qowtDoActionSignal[1].context.index, 1);
      });

      it('should move to previous slide upon left key press', function() {
        sandbox_.stub(ThumbnailStrip, 'selectedIndex').returns(2);
        sandbox_.stub(PubSub, 'publish');
        sandbox_.stub(SelectionManager, 'getSelection').returns({
          contentType: 'slide'
        });

        event_.keyCode = 37;
        document.dispatchEvent(event_);

        // get the published a qowt:doAction signal
        var qowtDoActionSignal =
              PubSub.publish.args.filter(function(item){
                return item[0] === "qowt:doAction";
              })[0];

        assert.strictEqual(qowtDoActionSignal[0], 'qowt:doAction');
        assert.strictEqual(qowtDoActionSignal[1].action, 'slideSelect');
        assert.strictEqual(qowtDoActionSignal[1].context.index, 1);
      });

      it('should not scroll the thumbnail strip to the last slide on space ' +
          'key press when contentType of event is slide', function() {
            sandbox_.stub(ThumbnailStrip, 'selectedIndex').returns(1);
            sandbox_.stub(PubSub, 'publish');
            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'slide'
            });

            event_.keyCode = 32;
            document.dispatchEvent(event_);

            assert.isTrue(PubSub.publish.notCalled, 'no event published');
          });

      it('should not scroll the thumbnail strip to the last slide on ' +
          'backspace key press when contentType of event is slide', function() {
            sandbox_.stub(ThumbnailStrip, 'selectedIndex').returns(1);
            sandbox_.stub(PubSub, 'publish');
            sandbox_.stub(SelectionManager, 'getSelection').returns({
              contentType: 'slide'
            });

            event_.keyCode = 8;
            document.dispatchEvent(event_);

            assert.isTrue(PubSub.publish.notCalled, 'no event published');
          });
    });
  });
});
