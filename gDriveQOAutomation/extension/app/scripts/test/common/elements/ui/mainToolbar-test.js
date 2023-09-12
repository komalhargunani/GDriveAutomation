/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the Main Toolbar widget
 *
 * @author upasana.kumari@quickoffice.com (Upasana Kumari)
 */
define([
  'qowtRoot/configs/point',
  'qowtRoot/configs/sheet',
  'qowtRoot/configs/word',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/env',
  // Need to load all UI widgets so that the MainToolbar can access them as
  // registered widgets via the Factory but no widgets are used directly in
  // this test file.
  'qowtRoot/widgets/ui/_all',
  // Need to load framework for the bake function used in colorDropdown.js
  'qowtRoot/lib/framework/framework'
], function(
    PointConfig,
    SheetConfig,
    WordConfig,
    PubSub,
    EnvModel) {

  'use strict';

  xdescribe('Main Toolbar', function() {

    var dummyNode,
        toolbar,
        testDiv,
        wordToolbarConfig = WordConfig.MAIN_TOOLBAR;

    beforeEach(function() {
      this.stampOutTempl('qowt-main-toolbar-test-template');
      testDiv = this.getTestDiv();
      toolbar = testDiv.querySelector('#testMainToolbar');
      dummyNode = document.createElement('div');
      dummyNode.id = 'dummy';
    });

    afterEach(function() {
      testDiv = undefined;
      dummyNode = undefined;
      toolbar = undefined;
    });

    describe('API', function() {
      it('should throw if mainToolBar.init() called multiple times',
          function() {
            toolbar.app = 'word';
            toolbar.init(dummyNode, wordToolbarConfig);
            assert.throws(function() {
              toolbar.init(dummyNode, wordToolbarConfig);
            }, 'mainToolbar.init() called multiple times.');
      });

      it('should be able to construct the toolbar from the Point config',
          function() {
            toolbar.app = 'point';
            assert.doesNotThrow(function() {
              toolbar.init(dummyNode, PointConfig.MAIN_TOOLBAR);
            }, 'Point toolbar constructed without errors');
      });

      it('should be able to construct the toolbar from the Sheet config',
          function() {
            toolbar.app = 'sheet';
            assert.doesNotThrow(function() {
              toolbar.init(dummyNode, SheetConfig.MAIN_TOOLBAR);
            }, 'Sheet toolbar constructed without errors');
      });

      it('should create toolbar role for button bar in main toolbar',
         function() {
            toolbar.app = 'word';
            toolbar.init(dummyNode, wordToolbarConfig);
            var buttonBarElement = toolbar.$['qowt-main-buttonbar'];
            assert.strictEqual(buttonBarElement.getAttribute('role'), 'toolbar',
              'role is toolbar');
        });

      it('should be able to request toolbar item widgets by item ID',
      function() {
        toolbar.app = 'word';
        toolbar.init(dummyNode, wordToolbarConfig);
        var boldButton = toolbar.getItem('button-bold');
        assert.isDefined(boldButton, 'bold button is defined');
        assert.isTrue(boldButton instanceof QowtBoldButton);
      });

      it('should make subscriptions for its child widgets', function() {
        // Also invoke PubSub.subscribe() when stubbing.
        sinon.stub(PubSub, 'subscribe', PubSub.subscribe);
        toolbar.app = 'word';
        toolbar.init(dummyNode, wordToolbarConfig);
        assert.isTrue(PubSub.subscribe.called);
        PubSub.subscribe.restore();
      });

      it('should clean up everything on destroy', function() {
        // Also invoke PubSub.unsubscribe() when stubbing.
        sinon.stub(PubSub, 'unsubscribe', PubSub.unsubscribe);
        toolbar.app = 'word';
        toolbar.init(dummyNode, wordToolbarConfig);
        Polymer.dom.flush();
        toolbar.destroy();
        var boldButtonWidget = toolbar.getItem('button-bold');
        assert.strictEqual(dummyNode.childNodes.length, 0,
          'parent node has no children');
        assert.isUndefined(boldButtonWidget, 'bold button was destoyed');
        assert.isTrue(PubSub.unsubscribe.called);
        PubSub.unsubscribe.restore();
      });

      it('should set ARIA attributes for button bar and title bar in main ' +
          'toolbar', function() {
        toolbar.app = 'word';
        toolbar.init(dummyNode, wordToolbarConfig);

        //Button bar
        var buttonBarElement = toolbar.$['qowt-main-buttonbar'];
        assert.strictEqual(buttonBarElement.getAttribute('role'), 'toolbar',
            'role is toolbar');
        assert.strictEqual(buttonBarElement.getAttribute('aria-label'),
            'Main', 'Button bar label is Main');

        // Document title
        var titleBarElement = toolbar.$['qowt-main-title-inner'];
        assert.include(titleBarElement.getAttribute('aria-label'),
            'document_title_aria_spoken_word', 'document title matched');
      });

      it('should set ARIA attributes for activity buttons in main toolbar ' +
          'for word.', function() {
        toolbar.app = 'word';
        toolbar.init(dummyNode, wordToolbarConfig);
        //Activity buttons
        var activityBtnContainerElement = toolbar.$.activityButtonContainer;
        var activityButtons = activityBtnContainerElement.childNodes;
        for (var btn = 0; btn < activityButtons.length; btn++) {
          if (activityButtons[btn]) {
            if (activityButtons[btn].nodeName === 'QOWT-SHAREBUTTON') {
              assert.strictEqual(activityButtons[btn].getAttribute('role'),
                  'button', 'role is button');
              assert.strictEqual(activityButtons[btn].
                  getAttribute('aria-label'), 'share_button',
                  'Label is share_button');
            }
            else if (activityButtons[btn].nodeName === 'QOWT-DOWNLOADBUTTON') {
              assert.strictEqual(activityButtons[btn].getAttribute('role'),
                  'button', 'role is button');
              assert.strictEqual(activityButtons[btn].
                  getAttribute('aria-label'), 'download_button',
                 'Label is download_button');
            }
          }
        }
      });

      it('should set ARIA attributes for activity buttons in main toolbar ' +
          'for sheet.', function() {
        toolbar.app = 'sheet';
        toolbar.init(dummyNode, SheetConfig.MAIN_TOOLBAR);
        //Activity buttons
        var activityBtnContainerElement = toolbar.$.activityButtonContainer;
        var activityButtons = activityBtnContainerElement.childNodes;
        for (var btn = 0; btn < activityButtons.length; btn++) {
          if (activityButtons[btn]) {
            if (activityButtons[btn].nodeName === 'QOWT-SHAREBUTTON') {
              assert.strictEqual(activityButtons[btn].getAttribute('role'),
                  'button', 'role is button');
              assert.strictEqual(activityButtons[btn].
                  getAttribute('aria-label'), 'share_button',
                  'Label is share_button');
            }
            else if (activityButtons[btn].nodeName === 'QOWT-DOWNLOADBUTTON') {
              assert.strictEqual(activityButtons[btn].getAttribute('role'),
                  'button', 'role is button');
              assert.strictEqual(activityButtons[btn].
                  getAttribute('aria-label'), 'download_button',
                 'Label is download_button');
            }
          }
        }
      });

      it('should set ARIA attributes for activity buttons in main toolbar ' +
          'for point.', function() {
        toolbar.app = 'point';
        toolbar.init(dummyNode, PointConfig.MAIN_TOOLBAR);
        //Activity buttons
        var activityBtnContainerElement = toolbar.$.activityButtonContainer;
        var activityButtons = activityBtnContainerElement.childNodes;
        for (var btn = 0; btn < activityButtons.length; btn++) {
          if (activityButtons[btn]) {
            if (activityButtons[btn].nodeName === 'QOWT-SHAREBUTTON') {
              assert.strictEqual(activityButtons[btn].getAttribute('role'),
                  'button', 'role is button');
              assert.strictEqual(activityButtons[btn].
                  getAttribute('aria-label'), 'share_button',
                  'Label is share_button');

            } else if (activityButtons[btn].nodeName === 'QOWT-PRESENTBUTTON') {
              assert.strictEqual(activityButtons[btn].getAttribute('role'),
                  'button', 'role is button');
              assert.strictEqual(activityButtons[btn].
                  getAttribute('aria-label'), 'present_button',
                  'Label is present_button');
            }
            else if (activityButtons[btn].nodeName === 'QOWT-DOWNLOADBUTTON') {
              assert.strictEqual(activityButtons[btn].getAttribute('role'),
                  'button', 'role is button');
              assert.strictEqual(activityButtons[btn].
                  getAttribute('aria-label'), 'download_button',
                  'Label is download_button');
            }
          }
        }
      });
    });


    it('should have completely specified word menu items.', function() {
      toolbar.app = 'word';
      Polymer.dom.flush();
      var item = toolbar.$$('#menu-bar');
      return (assertMenuHasWellFormedItemsForApp(item, 'word'));
    });

    it('should have completely specified sheet menu items.', function() {
      toolbar.app = 'sheet';
      Polymer.dom.flush();
      var item = toolbar.$$('#menu-bar');
      return (assertMenuHasWellFormedItemsForApp(item, 'sheet'));
    });

    it('should have completely specified point menu items.', function() {
      toolbar.app = 'point';
      Polymer.dom.flush();
      var item = toolbar.$$('#menu-bar');
      return (assertMenuHasWellFormedItemsForApp(item, 'point'));
    });

    function assertMenuHasWellFormedItemsForApp(menu, desiredApp) {
      menu.app = desiredApp;
      return Promise.resolve().then(function() {
        var items, menuitem, configId, testLabel;

        items = menu.querySelectorAll('qowt-item, qowt-toggle-item');
        assert.isTrue(items.length > 0, 'should be many menu items');
        for (var ix = 0; ix < items.length; ix++) {
          menuitem = items[ix];
          testLabel = menuitem.nodeName + ' ' + menuitem.label + menuitem.id;
          assert.isTrue(menuitem instanceof QowtItem ||
              menuitem instanceof QowtToggleItem,
              testLabel);
          assert.isString(menuitem.label, 'label string');
          // Must have a configId
          configId = menuitem.getAttribute('configId');
          assert.isNotNull(configId);
          assert.isString(configId);

          // Must have an id.
          assert.property(menuitem, 'id', 'has id');
        }
      });
    }
  });

  xdescribe('App - aria test.', function() {
    var dummyNode, toolbar, testDiv;

    afterEach(function() {
      testDiv = undefined;
      dummyNode = undefined;
      toolbar = undefined;
    });

    describe('App - aria test for word.', function() {

      beforeEach(function() {
        EnvModel.app = 'word';
        this.stampOutTempl('qowt-main-toolbar-test-template');
        testDiv = this.getTestDiv();
        createDummyNode(testDiv);
      });

      it('should set ARIA attributes for appIcon in word.', function() {
        toolbar.init(dummyNode, WordConfig.MAIN_TOOLBAR);
        verifyAriaForModule('wordapp_icon_aria_spoken_word', toolbar);
      });

      it('should set correct role for menubar in word.', function() {
        toolbar.app = 'word';
        verifyRoleForMenuBar();
      });
    });

    describe('App - aria test for sheet.', function() {

      beforeEach(function() {
        EnvModel.app = 'sheet';
        this.stampOutTempl('qowt-main-toolbar-test-template');
        testDiv = this.getTestDiv();
        createDummyNode(testDiv);
      });

      it('should set ARIA attributes for appIcon in sheet.', function() {
        toolbar.init(dummyNode, SheetConfig.MAIN_TOOLBAR);
        verifyAriaForModule('sheetapp_icon_aria_spoken_word', toolbar);
      });

      it('should set correct role for menubar in sheet.', function() {
        toolbar.app = 'sheet';
        verifyRoleForMenuBar();
      });
    });

    describe('App - aria test for point.', function() {

      beforeEach(function() {
        EnvModel.app = 'point';
        this.stampOutTempl('qowt-main-toolbar-test-template');
        testDiv = this.getTestDiv();
        createDummyNode(testDiv);
      });

      it('should set ARIA attributes for appIcon in point.', function() {
        toolbar.init(dummyNode, PointConfig.MAIN_TOOLBAR);
        verifyAriaForModule('pointapp_icon_aria_spoken_word', toolbar);
      });

      it('should set correct role for menubar in point.', function() {
        toolbar.app = 'point';
        verifyRoleForMenuBar();
      });
    });

    function createDummyNode(testDiv) {
      toolbar = testDiv.querySelector('#testMainToolbar');
      dummyNode = document.createElement('div');
      dummyNode.id = 'dummy';
    }

    function verifyAriaForModule(ariaLabel, toolbar) {
      var msgLabel = 'label is ' + ariaLabel;
      //app icon element
      var appIconContainer = toolbar.$.appIcon;
      var appIconAnchorElement =
          appIconContainer.querySelector('a.qowt-main-appIcon');
      assert.strictEqual(appIconAnchorElement.getAttribute('role'), 'link',
          'role is link');
      assert.strictEqual(appIconAnchorElement.getAttribute('aria-label'),
          ariaLabel, msgLabel);
    }

    function verifyRoleForMenuBar() {
      Polymer.dom.flush();
      var menuBar = toolbar.$$('#menu-bar');
      assert.isNotNull(menuBar);
      assert.strictEqual(menuBar.getAttribute('role'), 'menubar',
          'role is menubar');
    }
  });

  xdescribe('Tool tip test', function() {

    var dummyNode, toolbar, testDiv, event;

    beforeEach(function() {
      this.stampOutTempl('qowt-main-toolbar-test-template');
      testDiv = this.getTestDiv();
      toolbar = testDiv.querySelector('#testMainToolbar');
      dummyNode = document.createElement('div');
      dummyNode.id = 'dummy';
    });

    afterEach(function() {
      testDiv = undefined;
      dummyNode = undefined;
      toolbar = undefined;
      event = undefined;
    });
    describe('Show and Hide toolTip test for word button', function() {

      it('should display tool tip when mouse over on a button', function() {
        toolbar.app = 'word';
        toolbar.init(dummyNode, WordConfig.MAIN_TOOLBAR);
        Polymer.dom.flush();
        var button = toolbar.getItem('cmd-undo');
        event = {target: button};
        sinon.stub(toolbar.$.tooltip, 'show');
        toolbar.showToolTip(event);
        assert.isTrue(toolbar.$.tooltip.show.calledOnce, 'show method called');
        toolbar.$.tooltip.show.restore();
      });

      it('should hide tool tip when mouse out on a button', function() {
        toolbar.app = 'word';
        sinon.stub(toolbar.$.tooltip, 'hide');
        toolbar.hideToolTip();
        assert.isTrue(toolbar.$.tooltip.hide.calledOnce, 'hide method called');
        toolbar.$.tooltip.hide.restore();
      });
    });

    describe('Show and Hide toolTip test for sheet button', function() {

      it('should display tool tip when mouse over on a button', function() {
        toolbar.app = 'sheet';
        toolbar.init(dummyNode, SheetConfig.MAIN_TOOLBAR);
        Polymer.dom.flush();
        var button = toolbar.getItem('cmd-undo');
        event = {target: button};
        sinon.stub(toolbar.$.tooltip, 'show');
        toolbar.showToolTip(event);
        assert.isTrue(toolbar.$.tooltip.show.calledOnce, 'show method called');
        toolbar.$.tooltip.show.restore();
      });

      it('should hide tool tip when mouse out on a button', function() {
        toolbar.app = 'sheet';
        sinon.stub(toolbar.$.tooltip, 'hide');
        toolbar.hideToolTip();
        assert.isTrue(toolbar.$.tooltip.hide.calledOnce, 'hide method called');
        toolbar.$.tooltip.hide.restore();
      });
    });

    describe('Show and Hide toolTip test for point button', function() {

      it('should display tool tip when mouse over on a button', function() {
        toolbar.app = 'point';
        toolbar.init(dummyNode, PointConfig.MAIN_TOOLBAR);
        Polymer.dom.flush();
        var button = toolbar.getItem('cmd-undo');
        event = {target: button};
        sinon.stub(toolbar.$.tooltip, 'show');
        toolbar.showToolTip(event);
        assert.isTrue(toolbar.$.tooltip.show.calledOnce, 'show method called');
        toolbar.$.tooltip.show.restore();
      });

      it('should hide tool tip when mouse out on a button', function() {
        toolbar.app = 'point';
        sinon.stub(toolbar.$.tooltip, 'hide');
        toolbar.hideToolTip();
        assert.isTrue(toolbar.$.tooltip.hide.calledOnce, 'hide method called');
        toolbar.$.tooltip.hide.restore();
      });
    });

    describe('Show and Hide toolTip test for word dropDown button',
        function() {

          it('should display tool tip when mouse over on a button', function() {
            toolbar.app = 'word';
            toolbar.init(dummyNode, WordConfig.MAIN_TOOLBAR);
            Polymer.dom.flush();
            var dropDown = toolbar.getItem('cmd-fontFace');
            event = {target: dropDown.children[0]};
            sinon.stub(toolbar.$.tooltip, 'show');
            toolbar.showToolTip(event);
            assert.isTrue(toolbar.$.tooltip.show.calledOnce,
                'show method called');
            toolbar.$.tooltip.show.restore();
          });

          it('should hide tool tip when mouse out on a button', function() {
            toolbar.app = 'word';
            sinon.stub(toolbar.$.tooltip, 'hide');
            toolbar.hideToolTip();
            assert.isTrue(toolbar.$.tooltip.hide.calledOnce,
                'hide method called');
            toolbar.$.tooltip.hide.restore();
          });
        });

    describe('Show and Hide toolTip test for sheet dropDown button',
        function() {

          it('should display tool tip when mouse over on a button', function() {
            toolbar.app = 'sheet';
            toolbar.init(dummyNode, SheetConfig.MAIN_TOOLBAR);
            Polymer.dom.flush();
            var dropDown = toolbar.getItem('cmd-backgroundColor');
            event = {target: dropDown.children[0]};
            sinon.stub(toolbar.$.tooltip, 'show');
            toolbar.showToolTip(event);
            assert.isTrue(toolbar.$.tooltip.show.calledOnce,
                'show method called');
            toolbar.$.tooltip.show.restore();
          });

          it('should hide tool tip when mouse out on a button', function() {
            toolbar.app = 'sheet';
            sinon.stub(toolbar.$.tooltip, 'hide');
            toolbar.hideToolTip();
            assert.isTrue(toolbar.$.tooltip.hide.calledOnce,
                'hide method called');
            toolbar.$.tooltip.hide.restore();
          });
        });

    describe('Show and Hide toolTip test for point dropDown button',
        function() {

          it('should display tool tip when mouse over on a button', function() {
            toolbar.app = 'point';
            toolbar.init(dummyNode, PointConfig.MAIN_TOOLBAR);
            Polymer.dom.flush();
            var dropDown = toolbar.getItem('cmd-fontSize');
            event = {target: dropDown.children[0]};
            sinon.stub(toolbar.$.tooltip, 'show');
            toolbar.showToolTip(event);
            assert.isTrue(toolbar.$.tooltip.show.calledOnce,
                'show method called');
            toolbar.$.tooltip.show.restore();
          });

          it('should hide tool tip when mouse out on a button', function() {
            toolbar.app = 'point';
            sinon.stub(toolbar.$.tooltip, 'hide');
            toolbar.hideToolTip();
            assert.isTrue(toolbar.$.tooltip.hide.calledOnce,
                'hide method called');
            toolbar.$.tooltip.hide.restore();
          });
        });

    describe('Show and Hide toolTip test for product icon buttons',
        function() {

          it('should display tool tip when mouse over on product icon',
             function() {
               toolbar.app = 'point';
               toolbar.init(dummyNode, PointConfig.MAIN_TOOLBAR);
               var appIconContainer = toolbar.$.appIcon;
               var appIconNode =
                   appIconContainer.querySelector('a.qowt-main-appIcon');
               event = {target: appIconNode};
               sinon.stub(toolbar.$.tooltip, 'show');
               toolbar.showToolTip(event);
               assert.isTrue(toolbar.$.tooltip.show.calledOnce,
                   'show method called');
               toolbar.$.tooltip.show.restore();
             });

          it('should hide tool tip when mouse out on product icon button',
             function() {
               toolbar.app = 'point';
               sinon.stub(toolbar.$.tooltip, 'hide');
               toolbar.hideToolTip();
               assert.isTrue(toolbar.$.tooltip.hide.calledOnce,
                   'hide method called');
               toolbar.$.tooltip.hide.restore();
             });
        });
  });
  return {};
});
