define(['qowtRoot/models/transientFormatting'], function(TransientFormatting) {
  'use strict';

  describe('Transient Formatting Model', function() {

    var testData = {
      bold: {
        'action': 'bold',
        'context': {
          'set': true
        }
      },
      arial: {
        'action': 'fontFace',
        'context': {
          'value': 'Arial'
        }
      },
      times: {
        'action': 'fontFace',
        'context': {
          'value': 'Times New Roman'
        }
      },
      redColor: {
        'action': 'textColor',
        'context': {
          'value': '#FF0000'
        }
      },
      yellowHighlight: {
        'action': 'highlightColor',
        'context': {
          'value': '#FFFF00'
        }
      },
      noHighlight: {
        'action': 'highlightColor',
        'context': {
          'value': undefined
        }
      }
    };

    beforeEach(function() {
      TransientFormatting.clearTransientValues();
    });
    afterEach(function() {
      TransientFormatting.clearTransientValues();
    });

    describe('update', function() {
      it('should handle boolean type formatting actions', function() {
        TransientFormatting.update(testData.bold);
        var td = TransientFormatting.getTransientContext('bold');
        assert.isDefined(td, 'td is defined');
        assert.isTrue(td, 'td is true');
      });

      it('should handle value type formatting actions', function() {
        TransientFormatting.update(testData.arial);
        var td = TransientFormatting.getTransientContext('fontFace');
        assert.isDefined(td, 'td is defined');
        assert.strictEqual(td, 'Arial', 'td is Arial');
      });

      it('should overwrite value type formatting actions', function() {
        TransientFormatting.update(testData.arial);
        TransientFormatting.update(testData.times);
        var td = TransientFormatting.getTransientContext('fontFace');
        assert.isDefined(td, 'td is defined');
        assert.strictEqual(
            td, 'Times New Roman', 'td is Times New Roman');
      });

      it('should overwrite highlightColor with noHighlightColor', function() {
        TransientFormatting.update(testData.yellowHighlight);
        TransientFormatting.update(testData.noHighlight);
        var td = TransientFormatting.getTransientContext('highlightColor');
        assert.isUndefined(td, 'td is undefined');
      });

      it('should handle invalid formatting actions', function() {
        TransientFormatting.update(undefined);
        TransientFormatting.update(null);
        TransientFormatting.update(false);
        TransientFormatting.update('');
        TransientFormatting.update(0);
        TransientFormatting.update({});
        TransientFormatting.update({
          'action': 'notValid'
        });
        var td = TransientFormatting.getPendingTransientActions();
        assert.strictEqual(td.length, 0, 'td has no keys');
      });

      it('should handle multiple formatting actions', function() {
        TransientFormatting.update(testData.bold);
        TransientFormatting.update(testData.arial);
        TransientFormatting.update(testData.redColor);
        TransientFormatting.update(testData.yellowHighlight);
        var td = TransientFormatting.getPendingTransientActions();
        assert.isDefined(td, 'td is defined');
        assert.strictEqual(td.length, 4, 'td is 4 long');
        assert.isTrue(td[0].context.set, '1st action set is true');
        assert.strictEqual(
            td[1].context.value, 'Arial', '2nd action value is Arial');
        assert.strictEqual(
            td[2].context.value, '#FF0000', '3rd action value is #FF0000');
        assert.strictEqual(
            td[3].context.value, '#FFFF00', '4th action value is #FFFF00');
      });
    });

    describe('clearTransientValues & holdValues', function() {
      it('should clear all transient data from the model', function() {
        TransientFormatting.update(testData.bold);
        TransientFormatting.update(testData.arial);
        TransientFormatting.update(testData.redColor);
        TransientFormatting.update(testData.yellowHighlight);
        TransientFormatting.clearTransientValues();
        var td = TransientFormatting.getPendingTransientActions();
        assert.strictEqual(td.length, 0, 'td.length is 0');
      });

      it('shouldnt clear transient data if hold requested', function() {
        TransientFormatting.holdValues();
        TransientFormatting.update(testData.bold);
        TransientFormatting.update(testData.arial);
        TransientFormatting.update(testData.redColor);
        TransientFormatting.update(testData.yellowHighlight);
        TransientFormatting.clearTransientValues();
        var td = TransientFormatting.getPendingTransientActions();
        assert.notStrictEqual(td.length, 0, 'td.length is not 0');
        TransientFormatting.clearTransientValues();
        td = TransientFormatting.getPendingTransientActions();
        assert.strictEqual(td.length, 0, 'td.length is 0');
      });
    });

    describe('getPendingTransientActions', function() {
      it('should return empty array if no transient formatting', function() {
        var pta = TransientFormatting.getPendingTransientActions();
        assert.isDefined(pta, 'pta is defined');
        assert.strictEqual(pta.length, 0, 'pta.length is 0');
      });

      it('should compile formatting action for boolean types', function() {
        TransientFormatting.update(testData.bold);
        var pta = TransientFormatting.getPendingTransientActions();
        assert.isDefined(pta, 'pta is defined');
        assert.strictEqual(pta.length, 1, 'pta.length is 1');
        assert.strictEqual(pta[0].action, 'bold', 'action is bold');
        assert.isTrue(pta[0].context.set, 'set is true');
      });

      it('should compile formatting action for value types', function() {
        TransientFormatting.update(testData.arial);
        var pta = TransientFormatting.getPendingTransientActions();
        assert.isDefined(pta, 'pta is defined');
        assert.strictEqual(pta.length, 1, 'pta.length is 1');
        assert.strictEqual(pta[0].action, 'fontFace', 'action is fontFace');
        assert.strictEqual(pta[0].context.value, 'Arial', 'value is Arial');
      });

      it('should compile formatting action for noHighlightColor', function() {
        TransientFormatting.update(testData.noHighlight);
        var pta = TransientFormatting.getPendingTransientActions();
        assert.isDefined(pta, 'pta is defined');
        assert.strictEqual(pta.length, 1, 'pta.length is 1');
        assert.strictEqual(
            pta[0].action, 'highlightColor', 'action is highlightColor');
        assert.isUndefined(pta[0].context.value, 'value is undefined');
      });

      it('should compile multiple formatting actions', function() {
        TransientFormatting.update(testData.bold);
        TransientFormatting.update(testData.arial);
        TransientFormatting.update(testData.redColor);
        TransientFormatting.update(testData.yellowHighlight);
        var pta = TransientFormatting.getPendingTransientActions();
        assert.isDefined(pta, 'pta is defined');
        assert.strictEqual(pta.length, 4, 'pta.length is 4');
      });
    });

    describe('getTransientContext', function() {
      it('should return the transient value', function() {
        TransientFormatting.update(testData.bold);
        TransientFormatting.update(testData.redColor);
        var bval = TransientFormatting.getTransientContext('bold'),
            cval = TransientFormatting.getTransientContext('textColor'),
            fval = TransientFormatting.getTransientContext('fontFace');
        assert.isTrue(bval, 'bval is true');
        assert.strictEqual(cval, '#FF0000', 'cval is #FF0000');
        assert.isUndefined(fval, 'fval is undefined');
      });
    });

  });

  return {};
});
