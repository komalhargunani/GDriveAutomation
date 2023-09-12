define([], function() {
  'use strict';

  describe('Decorator mixin:', function() {

    var nodes = [];

    beforeEach(function() {
      this.stampOutTempl('decorator-base-test-template');
      var testEl = document.querySelector('decorator-base-test-element');
      nodes.push(testEl);
      nodes.push(nodes[0].createFlowInto());
      nodes.push(nodes[1].createFlowInto());
    });

    afterEach(function() {
      nodes = [];
    });

    describe('Decorate entire flow:', function() {
      it('Should set and unset on all elements within a flow: ', function() {
        // Decorate the middle node in the flow
        nodes[1].decorate({'foo': 'something'});
        assert.equal(nodes[0].getAttribute('foo'), 'something');
        assert.equal(nodes[1].getAttribute('foo'), 'something');
        assert.equal(nodes[2].getAttribute('foo'), 'something');
        // test removing properties
        nodes[2].decorate({'foo': undefined});
        assert.equal(nodes[0].getAttribute('foo'), null);
        assert.equal(nodes[1].getAttribute('foo'), null);
        assert.equal(nodes[2].getAttribute('foo'), null);
      });
    });

    describe('Multiple decorators:', function() {
      it('Should allow multiple decorator mixins: ', function() {
        // Decorate the middle node in the flow
        nodes[1].decorate({'foo': 'something'});
        assert.equal(nodes[0].getAttribute('foo'), 'something');
        assert.equal(nodes[1].getAttribute('foo'), 'something');
        assert.equal(nodes[2].getAttribute('foo'), 'something');
        // Test removing properties
        nodes[2].decorate({'foo': undefined});
        assert.equal(nodes[0].getAttribute('foo'), null);
        assert.equal(nodes[1].getAttribute('foo'), null);
        assert.equal(nodes[2].getAttribute('foo'), null);
        // Decorate the middle node in the flow
        nodes[1].decorate({'eggs': 'whatever'});
        assert.equal(nodes[0].getAttribute('eggs'), 'whatever');
        assert.equal(nodes[1].getAttribute('eggs'), 'whatever');
        assert.equal(nodes[2].getAttribute('eggs'), 'whatever');
        // Test removing properties
        nodes[2].decorate({'eggs': undefined});
        assert.equal(nodes[0].getAttribute('eggs'), null);
        assert.equal(nodes[1].getAttribute('eggs'), null);
        assert.equal(nodes[2].getAttribute('eggs'), null);
      });
    });

  });

  return {};
});
