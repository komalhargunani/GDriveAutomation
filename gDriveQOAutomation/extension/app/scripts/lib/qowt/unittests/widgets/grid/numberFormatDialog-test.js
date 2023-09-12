/*
 * Test suite for the Number Format Dialog
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/numberFormatDialog',
  'qowtRoot/utils/domListener'
], function(
    PubSub,
    Dialog,
    DomListener) {

  'use strict';

  describe('A number format dialog', function() {
    var rootNode;

    var tabsClass = 'qowt-number-format-tabs';

    var decimalId = 'qowt-number-format-decimal';
    var redId = 'qowt-number-format-negative-red';
    var n123Id = 'qowt-number-format-negative-123';
    var sepaId = 'qowt-number-format-thousand';
    var dateId = 'qowt-number-format-date';
    var symId = 'qowt-number-format-symbol';
    var itemClass = 'qowt-number-format-area-item-left';
    var areaClass = 'qowt-number-format-area';

    beforeEach(function() {
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
      spyOn(DomListener, 'add');
      spyOn(PubSub, 'subscribe').andCallThrough();
      Dialog.init();
    });

    afterEach(function() {
      document.body.removeChild(rootNode);
      rootNode = undefined;
      DomListener.reset();
    });

    // INITIALIZING

    it('should be successfully initialised when init() is called on it',
       function() {
         expect(Dialog).toBeDefined();

         Dialog.appendTo(rootNode);

         expect(PubSub.subscribe.mostRecentCall.args[0]).toBe(
             'qowt:selectionChanged');
         expect(DomListener.add.callCount).toBe(17);

         expect(rootNode.getElementsByClassName(
             'qowt-number-format-dialog').length).toBe(1);
         var node = rootNode.getElementsByClassName(
             'qowt-number-format-dialog')[0];
         expect(node.childNodes.length).toBe(3);

         expect(rootNode.getElementsByClassName(
             'qowt-number-format-title').length).toBe(1);
         node = rootNode.getElementsByClassName('qowt-number-format-title')[0];
         expect(node.childNodes.length).toBe(2);

         expect(rootNode.getElementsByClassName(tabsClass).length).toBe(1);
         node = rootNode.getElementsByClassName(tabsClass)[0];
         expect(node.childNodes.length).toBe(7);

         expect(rootNode.getElementsByClassName(areaClass).length).toBe(1);
         node = rootNode.getElementsByClassName(areaClass)[0];
         expect(node.childNodes.length).toBe(8);
       });

    // GENERAL FORMATS: General, Text

    it('should successfully apply "General" format', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('General');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[0];
      expect(tab.classList.contains('selected')).toBeTruthy();
      var area = rootNode.getElementsByClassName(areaClass)[0];
      expect(area.getElementsByClassName(itemClass)[0].checked).toBeTruthy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('General');
    });

    it('should successfully recognise empty string as \'General\'', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat();

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[0];
      expect(tab.classList.contains('selected')).toBeTruthy();
      var area = rootNode.getElementsByClassName(areaClass)[0];
      expect(area.getElementsByClassName(itemClass)[0].checked).toBeTruthy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('General');
    });

    it('should successfully apply "Text" format', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('@');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[0];
      expect(tab.classList.contains('selected')).toBeTruthy();
      var area = rootNode.getElementsByClassName(areaClass)[0];
      expect(area.getElementsByClassName(itemClass)[1].checked).toBeTruthy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('@');
    });

    // NUMERIC FORMATS: decimals, thousand separator, negative values

    it('should successfully apply "0"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[1];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(0);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0');
    });

    it('should successfully apply "0.0"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0.0');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[1];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(1);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(sepaId);
      expect(elem.checked).toBeFalsy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0.0');
    });

    it('should successfully apply "0.00;[red]0.00"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0.00;[Red]0.00');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[1];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(2);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeTruthy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(sepaId);
      expect(elem.checked).toBeFalsy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0.00;[Red]0.00');
    });

    it('should successfully apply "0.000000_);\\(0.000000\\)"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0.000000_);\\(0.000000\\)');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[1];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(6);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeTruthy();
      elem = rootNode.getElementById(sepaId);
      expect(elem.checked).toBeFalsy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0.000000_);\\(0.000000\\)');
    });

    it('should successfully apply "#,#0.0"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('#,#0.0');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[1];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(1);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(sepaId);
      expect(elem.checked).toBeTruthy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('#,#0.0');
    });

    // CURRENCY: decimals, currency (with different locales), negative

    it('should successfully apply \"$\"#,##0', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('\"$\"#,##0');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[2];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(0);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(0);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('\"$\"#,##0');
    });

    it('should successfully apply dollar with other locale', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('#,##0[$$-2C0A]');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[2];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(0);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(0);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('\"$\"#,##0');
    });

    it('should successfully apply pound sign', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('[$\u00a3-809]#,##0.00');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[2];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(2);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(2);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('[$\u00a3-809]#,##0.00');
    });

    it('should successfully apply euro sign', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('#,##0.0\\ [$\u20AC-1];[Red]#,##0.0\\ [$\u20AC-1]');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[2];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(1);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeTruthy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(1);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('#,##0.0\\ [$\u20AC-1];[Red]#,##0.0\\ [$\u20AC-1]');
    });

    it('should successfully apply euro sign with other locale', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat(
          '#,##0.0\\ [$\u20AC-234];[Red]#,##0.0\\ [$\u20AC-234]');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[2];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(1);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeTruthy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(1);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('#,##0.0\\ [$\u20AC-1];[Red]#,##0.0\\ [$\u20AC-1]');
    });

    it('should successfully apply won', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat(
          '[$\u20A9-412]#,##0.000_);\\([$\u20A9-412]#,##0.000\\)');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[2];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(3);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeTruthy();
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(4);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe(
          '[$\u20A9-412]#,##0.000_);\\([$\u20A9-412]#,##0.000\\)');
    });

    it('should successfully apply currency which is not supported', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('[$FIM-313]#,##0.000_);\\([$FIM-313]#,##0.000\\)');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[2];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(3);
      elem = rootNode.getElementById(redId);
      expect(elem.checked).toBeFalsy();
      elem = rootNode.getElementById(n123Id);
      expect(elem.checked).toBeTruthy();
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(6);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('[$FIM-313]#,##0.000_);\\([$FIM-313]#,##0.000\\)');
    });

    it('should successfully apply same currency as above but with different' +
        'locale', function() {
          Dialog.appendTo(rootNode);
          Dialog.applyFormat('[$FIM-123]#,##0.000_);\\([$FIM-123]#,##0.000\\)');

          var tabs = rootNode.getElementsByClassName(tabsClass)[0];
          var tab = tabs.childNodes[2];
          expect(tab.classList.contains('selected')).toBeTruthy();

          var elem = rootNode.getElementById(decimalId);
          expect(elem.selectedIndex).toBe(3);
          elem = rootNode.getElementById(redId);
          expect(elem.checked).toBeFalsy();
          elem = rootNode.getElementById(n123Id);
          expect(elem.checked).toBeTruthy();
          elem = rootNode.getElementById(symId);
          expect(elem.selectedIndex).toBe(6);

          spyOn(PubSub, 'publish').andCallThrough();
          Dialog.__unitTestSendFormat();
          var code = PubSub.publish.mostRecentCall.args[1].context.value;
          expect(code).toBe('[$FIM-313]#,##0.000_);\\([$FIM-313]#,##0.000\\)');
        });

    // ACCOUNTING: decimals, currency

    it('should successfully apply dollar with one decimal', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat(
          '_(\"$\"* #,##0.0_);_(\"$\"* \\(#,##0.0\\);_(\"$\"* \"-\"?_);_(@_)');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[3];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(1);
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(0);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe(
          '_(\"$\"* #,##0.0_);_(\"$\"* \\(#,##0.0\\);_(\"$\"* \"-\"?_);_(@_)');
    });

    it('should successfully apply euro with three decimals', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('_ * #,##0.000_)\\ [$\u20AC-123]_ ;_ * \\(#,##0.000' +
          '\\)\\ [$\u20AC-123]_ ;_ * \"-\"???_)\\ [$\u20AC-123];_(@_)');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[3];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(3);
      elem = rootNode.getElementById(symId);
      expect(elem.selectedIndex).toBe(1);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('_ * #,##0.000_)\\ [$\u20AC-1]_ ;_ * \\(#,##0.000\\)' +
          '\\ [$\u20AC-1]_ ;_ * \"-\"???_)\\ [$\u20AC-1];_(@_)');
    });

    // DATES: supported (those visible by default or not)

    it('should successfully apply "m/d/yyyy;@"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('m/d/yyyy;@');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[4];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(dateId);
      expect(elem.selectedIndex).toBe(0);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('m/d/yyyy;@');
    });

    it('should successfully apply "m/d/yyyy" without ;@', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('m/d/yyyy');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[4];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(dateId);
      expect(elem.selectedIndex).toBe(0);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('m/d/yyyy;@');
    });

    it('should successfully apply "yyyy\\-mm\\-dd;@"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('yyyy\\-mm\\-dd;@');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[4];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(dateId);
      expect(elem.selectedIndex).toBe(2);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('yyyy\\-mm\\-dd;@');
    });

    it('should successfully apply "yyyy\\-mm\\-dd" without ;@', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('yyyy\\-mm\\-dd');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[4];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(dateId);
      expect(elem.selectedIndex).toBe(2);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('yyyy\\-mm\\-dd;@');
    });

    it('should successfully apply "[$-409]mmmmm;@" (one of the supported but' +
        ' not shown by default types)', function() {
          Dialog.appendTo(rootNode);
          Dialog.applyFormat('[$-409]mmmmm;@');

          var tabs = rootNode.getElementsByClassName(tabsClass)[0];
          var tab = tabs.childNodes[4];
          expect(tab.classList.contains('selected')).toBeTruthy();

          var elem = rootNode.getElementById(dateId);
          expect(elem.selectedIndex).toBe(7);

          spyOn(PubSub, 'publish').andCallThrough();
          Dialog.__unitTestSendFormat();
          var code = PubSub.publish.mostRecentCall.args[1].context.value;
          expect(code).toBe('[$-409]mmmmm;@');
        });

    it('should successfully apply "[$-409]mmmmm\\-yy;@" (one of the supported' +
        ' but not shown by default types)', function() {
          Dialog.appendTo(rootNode);
          Dialog.applyFormat('[$-409]mmmmm\\-yy;@');

          var tabs = rootNode.getElementsByClassName(tabsClass)[0];
          var tab = tabs.childNodes[4];
          expect(tab.classList.contains('selected')).toBeTruthy();

          var elem = rootNode.getElementById(dateId);
          expect(elem.selectedIndex).toBe(8);

          spyOn(PubSub, 'publish').andCallThrough();
          Dialog.__unitTestSendFormat();
          var code = PubSub.publish.mostRecentCall.args[1].context.value;
          expect(code).toBe('[$-409]mmmmm\\-yy;@');
        });

    it('should successfully apply "[$-409]mmm\\-yy;@" (one of the supported' +
        ' but not shown by default types)', function() {
          Dialog.appendTo(rootNode);
          Dialog.applyFormat('[$-409]mmm\\-yy;@');

          var tabs = rootNode.getElementsByClassName(tabsClass)[0];
          var tab = tabs.childNodes[4];
          expect(tab.classList.contains('selected')).toBeTruthy();

          var elem = rootNode.getElementById(dateId);
          expect(elem.selectedIndex).toBe(9);

          spyOn(PubSub, 'publish').andCallThrough();
          Dialog.__unitTestSendFormat();
          var code = PubSub.publish.mostRecentCall.args[1].context.value;
          expect(code).toBe('[$-409]mmm\\-yy;@');
        });

    // PERCENTAGE: decimals

    it('should successfully apply "0%"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0%');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[5];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(0);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0%');
    });

    it('should successfully apply "0.0%"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0.0%');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[5];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(1);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0.0%');
    });

    it('should successfully apply "0.0000%"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0.0000%');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[5];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(4);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0.0000%');
    });

    // SCIENTIFIC: decimals

    it('should successfully apply "0E+00"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0E+00');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[6];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(0);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0E+00');
    });

    it('should successfully apply "0.0E+00"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0.0E+00');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[6];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(1);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0.0E+00');
    });

    it('should successfully apply "0.000E+00"', function() {
      Dialog.appendTo(rootNode);
      Dialog.applyFormat('0.000E+00');

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[6];
      expect(tab.classList.contains('selected')).toBeTruthy();

      var elem = rootNode.getElementById(decimalId);
      expect(elem.selectedIndex).toBe(3);

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('0.000E+00');
    });

    // FRACTION (should be General -> Other)

    it('should successfully recognise \"?/?\" format as \'Other\' ',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('?/?');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('?/?');
       });

    // OTHERS: random strings, non-supported dates, broken currencies etc.

    it('should successfully handle empty object as a parameter', function() {
      Dialog.appendTo(rootNode);

      var param = {};
      Dialog.applyFormat(param);

      var tabs = rootNode.getElementsByClassName(tabsClass)[0];
      var tab = tabs.childNodes[0];
      expect(tab.classList.contains('selected')).toBeTruthy();
      var area = rootNode.getElementsByClassName(areaClass)[0];
      expect(area.getElementsByClassName(itemClass)[0].checked).toBeTruthy();

      spyOn(PubSub, 'publish').andCallThrough();
      Dialog.__unitTestSendFormat();
      var code = PubSub.publish.mostRecentCall.args[1].context.value;
      expect(code).toBe('General');
    });

    it('should successfully handle custom parameter - as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('-');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('-');
       });

    it('should successfully handle custom parameter 5 as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('5');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('5');
       });

    it('should successfully handle custom parameter A as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('A');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('A');
       });

    it('should successfully handle custom parameter [$$ as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('[$$');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('[$$');
       });

    it('should successfully handle custom parameter [$$] as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('[$$]');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('[$$]');
       });

    it('should successfully handle custom parameter [$$-123] as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('[$$-123]');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('[$$-123]');
       });

    it('should successfully handle custom parameter % as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('%');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('%');
       });

    it('should successfully handle custom parameter dddd/yyy/mmm as \'Other\'',
       function() {
         Dialog.appendTo(rootNode);
         Dialog.applyFormat('dddd/yyy/mmm');

         var tabs = rootNode.getElementsByClassName(tabsClass)[0];
         var tab = tabs.childNodes[0];
         expect(tab.classList.contains('selected')).toBeTruthy();
         var area = rootNode.getElementsByClassName(areaClass)[0];
         expect(area.getElementsByClassName(itemClass)[2].checked).toBeTruthy();

         spyOn(PubSub, 'publish').andCallThrough();
         Dialog.__unitTestSendFormat();
         var code = PubSub.publish.mostRecentCall.args[1].context.value;
         expect(code).toBe('dddd/yyy/mmm');
       });

    it('should throw if numberFormatDialog.init() called multiple times',
       function() {
         expect(Dialog.init).toThrow(
             'numberFormatDialog.init() called multiple times.');
       });
  });
});
