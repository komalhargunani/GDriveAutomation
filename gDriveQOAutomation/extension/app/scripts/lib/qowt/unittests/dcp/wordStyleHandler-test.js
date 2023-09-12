define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/wordStyleHandler'
], function(
    TestUtils,
    WordStyleHandler) {

  'use strict';

  describe('Word Style DCP Handler', function() {

    var _testAppendArea, _dcp, _officeStyles;

    beforeEach(function() {
      _testAppendArea = TestUtils.createTestAppendArea();
      _dcp = {
        el: {
          eid : 'Heading1',
          id : 'Heading1',
          etp : 'stl',
          name : 'Heading 1',
          basedOn: 'Normal',
          ppr : {},
          rpr : {},
          type : 'par',
          isDefault: true
        },
        node: _testAppendArea,
        accept: function() {}
      };

      var officeStyles = new QowtOfficeStyles();
      document.head.appendChild(officeStyles);

      _officeStyles = document.getElementById('qowtOfficeStyles');
      expect(_officeStyles).toBeDefined();
      spyOn(_officeStyles, 'add');
    });

    afterEach(function() {
      _testAppendArea.clear();
      _testAppendArea = undefined;
      _officeStyles = undefined;
    });

    it('should extract correct info from the style dcp.', function() {
      WordStyleHandler.visit(_dcp);
      expect(_officeStyles.add.mostRecentCall.args[0].id).toBe('Heading1');
      expect(_officeStyles.add.mostRecentCall.args[0].name).toBe('Heading 1');
      expect(_officeStyles.add.mostRecentCall.args[0].basedOn).toBe('Normal');
      expect(_officeStyles.add.mostRecentCall.args[0].isDefault).toBe(true);
      expect(_officeStyles.add.mostRecentCall.args[0].type).toBe('par');
    });

    it('should include paragraph formatting in the compiled style', function() {
      _dcp.el.ppr = {
        jus: 'R'
      };
      WordStyleHandler.visit(_dcp);
      expect(_officeStyles.add.mostRecentCall.args[0].ppr.jus).toBe('R');
    });

    it('should include character run formatting in the compiled style',
        function() {
          _dcp.el.rpr = {
            udl: true,
            str: true,
            font: 'Times New Roman'
          };
          WordStyleHandler.visit(_dcp);
          expect(_officeStyles.add.mostRecentCall.args[0].rpr.udl).toBe(true);
          expect(_officeStyles.add.mostRecentCall.args[0].rpr.str).toBe(true);
          expect(_officeStyles.add.mostRecentCall.args[0].rpr.font).toBe(
              'Times New Roman');
        });
  });
});
