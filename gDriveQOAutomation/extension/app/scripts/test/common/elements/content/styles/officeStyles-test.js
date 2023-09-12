/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mocha unit test for <qowt-office-styles>
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

(function() {
  describe('qowt-office-styles element', function() {
    var id = 'Heading1';
    var name = 'Heading 1';
    var cssClassName = 'qowt-stl-Heading1';
    var type = 'par';
    var rpr = {
      bld: true
    };
    var style = {
      id: id,
      type: type,
      name: name,
      isDefault: true,
      rpr: rpr
    };

    var officeStyles;

    beforeEach(function() {
      officeStyles = new QowtOfficeStyles();
      document.head.appendChild(officeStyles);
      officeStyles.reset();
    });

    afterEach(function() {
      officeStyles.parentNode.removeChild(officeStyles);
    });

    it('should be a QowtOfficeStyles instance.', function() {
      assert.instanceOf(officeStyles, QowtOfficeStyles,
                        'should be a QowtOfficeStyles.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(officeStyles.isQowtElement, 'should be a QowtElement.');
    });

    it('should have required methods defined when upgraded.', function() {
      var functions = [
        'add', 'hasStyle', 'getStyle', 'getId', 'getName', 'getType',
        'getFormatting', 'getResolvedFormatting', 'getDefaultStyleId',
        'getDefaultStyleName', 'styleUsesContextualSpacing', 'getStyleNames',
        'forEach',  'getCssRules', 'writeStyles', 'reset'
      ];
      assertHasFunctions(officeStyles, functions);
    });

    describe('add', function() {

      it('should add a style correctly', function() {
        officeStyles.add(style);
        assert.equal(officeStyles.getStyle(id), style,
               'style in the element same as the style added');
      });

      it('should not add a style with undefined id', function() {
        var invalidStyle = JSON.parse(JSON.stringify(style));
        invalidStyle.id = undefined;
        assert.throw(function(){officeStyles.add(invalidStyle);}, Error);
      });

      it('should not add a style with empty id string', function() {
        var invalidStyle = JSON.parse(JSON.stringify(style));
        invalidStyle.id = '';
        assert.throw(function(){officeStyles.add(invalidStyle);}, Error);
      });

      it('should not add a style with undefined type', function() {
        var invalidStyle = JSON.parse(JSON.stringify(style));
        invalidStyle.type = undefined;
        assert.throw(function(){officeStyles.add(invalidStyle);}, Error);
      });

      it('should not add a style with empty type string', function() {
        var invalidStyle = JSON.parse(JSON.stringify(style));
        invalidStyle.type = '';
        assert.throw(function(){officeStyles.add(invalidStyle);}, Error);
      });

      it('should add a style correctly with no defined name', function() {
        var styleNoName = JSON.parse(JSON.stringify(style));
        styleNoName.name = undefined;
        officeStyles.add(styleNoName);
        assert.equal(officeStyles.getStyle(id), styleNoName,
               'style in the element same as the style added');
      });

    });

    describe('get APIs', function() {
      beforeEach(function() {
        officeStyles.add(style);
      });

      afterEach(function() {
        officeStyles.reset();
      });

      it('should get name of the style added', function() {
        assert.equal(officeStyles.getName(id), name,
               'name of the styles should be same');
      });

      it('should get type of the style added', function() {
        assert.equal(officeStyles.getType(id), type,
               'type of the styles should be same');
      });

      it('should get id of the style name', function() {
        assert.equal(officeStyles.getId(name), id,
               'id of the styles should be same');
      });

      it('should get css classname the style', function() {
        assert.equal(officeStyles.getCssClassName(id), cssClassName,
               'css classname of the styles should be same');
      });

      it('should get formatting of the style added', function() {
        assert.deepEqual(officeStyles.getFormatting(id).rpr, rpr,
               'text formatting properties should be same');
      });
    });


   describe('list of styles added', function() {
      beforeEach(function() {
        // generate a few more styles.
        var style1 = JSON.parse(JSON.stringify(style));
        style1.id += '1';
        style1.name += '1';
        var style2 = JSON.parse(JSON.stringify(style));
        style2.id += '2';
        style2.name += '2';
        officeStyles.add(style);
        officeStyles.add(style1);
        officeStyles.add(style2);
      });

      afterEach(function() {
        officeStyles.reset();
      });

      it('should get style names', function() {
        var names = officeStyles.getStyleNames();
        assert.isDefined(names, 'names of styles should be defined');
        assert.equal(names.length, 3, 'there should be three styles names');
      });

      it('should get default style id', function() {
        assert.equal(officeStyles.getDefaultStyleId(), id,
               'default style id should be equal to the id.');
      });

      it('should get default style name', function() {
        assert.equal(officeStyles.getDefaultStyleName(), name,
               'default style name should be equal to name');
      });
    });

    describe('CSS creation', function() {
      // NOTE These are more than just unit tests -
      // but these are useful tests nonetheless to check
      // that key functionality is correct.
      var runProp = {
        bld: true
      };
      var docDefaults = {
        id: 'docDefaults',
        name: 'docDefaults',
        isDefault: false,
        rpr: runProp,
        type: 'defaults'
      };
      var isDefault = {
        id: 'Normal',
        name: 'Normal',
        isDefault: true,
        rpr: runProp,
        type: 'par'
      };
      var notDefault = {
        id: 'Heading1',
        name: 'Heading 1',
        rpr: runProp,
        isDefault: false,
        type: 'par'
      };

      it('should write out the CSS rules, 2007 style defaults', function() {
        officeStyles.add(docDefaults);
        officeStyles.add(isDefault);
        officeStyles.add(notDefault);
        officeStyles.writeStyles();

        var allCssRules = officeStyles.getCssRules();
        var expectedCssRules =
            '.qowt-root p {font-weight:bold;} ' +
            '.qowt-root .qowt-stl-docDefaults {font-weight:bold;} ' +
            '.qowt-root p:not([class*=qowt-stl-]) ' +
            '{font-weight:bold;} ' +
            '.qowt-root .qowt-stl-Normal {font-weight:bold;} ' +
            '.qowt-root .qowt-stl-Heading1 {font-weight:bold;} ';
        assert.equal(allCssRules, expectedCssRules, 'css rules should be same');
      });

      it('should write out the CSS rules, 2003 style defaults', function() {
        officeStyles.add(isDefault);
        officeStyles.add(notDefault);
        officeStyles.writeStyles();

        var allCssRules = officeStyles.getCssRules();
        var expectedCssRules =
            '.qowt-root p:not([class*=qowt-stl-]) ' +
            '{font-weight:bold;} ' +
            '.qowt-root .qowt-stl-Normal {font-weight:bold;} ' +
            '.qowt-root .qowt-stl-Heading1 {font-weight:bold;} ';
        assert.equal(allCssRules, expectedCssRules, 'css rules should be same');
      });

    });

    function assertHasFunctions(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], funcName);
      });
    }

  });
})();
