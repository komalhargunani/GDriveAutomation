/**
 * @fileoverview Unit test for the color swatch element.
 *
 * @author davidshimel@google.com (David Shimel)
 */

require([
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/colorPicker/colorSwatch'],
  function(PubSub) {

  'use strict';

  xdescribe('QowtColorSwatch Polymer Element', function() {

    var swatches;

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      swatches = [
        new QowtColorSwatch(),
        new QowtColorSwatch(),
        new QowtColorSwatch()
      ];

      swatches[0].rgb = '#FFFFFF';
      swatches[0].formattingProp = 'clr';
      swatches[1].selected = true;
      swatches[2].selected = false;

      // return a promise that is guaranteed to run in the next micro task. This
      // ensures the QowtColorSwatch's data observers will run for the items
      // we've just set and thus ensures it will update it's styling before
      // we run our tests below
      return Promise.resolve();
    });

    afterEach(function() {
      PubSub.publish.restore();
    });

    it('should support Polymer constructor creation', function() {
      assert.isDefined(swatches[0], 'first swatch is defined');
    });

    it('should create proper roles on the color swatch', function() {
      assert.strictEqual(swatches[0].getAttribute('role'), 'gridcell',
        'role is gridcell');
    });

    it('should set selected to true and publish the correct message when ' +
      'clicked.', function() {
      var swatch = swatches[0];
      swatch.action = 'hello';
      swatch.select();
      assert.isTrue(swatch.selected, 'swatch is selected');
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
          action: 'hello',
          context: {
            formatting: {
              clr: '#FFFFFF'
            }
          }
        }),
        'request action published');
    });

    it('should set the background-color style of the swatch when setting ' +
      'the rgb property of the swatch', function() {
      var bgColor = swatches[0]._getSwatch().style.backgroundColor;

      assert.strictEqual(bgColor, 'rgb(255, 255, 255)', 'background color ' +
        'is white');
    });

    it('should add the selected class to the swatch when setting the ' +
      'selected property of the swatch to true', function() {
      var classes = swatches[1]._getSwatch().classList;

      assert.isTrue(classes.contains('selected'), 'swatch has selected class');
    });

    it('should remove the selected class to the swatch when setting the ' +
      'selected property of the swatch to false', function() {
      var classes = swatches[2]._getSwatch().classList;

      assert.isFalse(classes.contains('selected'), 'swatch does not have ' +
        'selected class');
    });
  });
});