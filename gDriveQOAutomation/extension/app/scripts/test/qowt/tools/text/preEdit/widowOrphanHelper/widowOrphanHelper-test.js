define([
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/models/env'], function(
  WidowOrphanHelper,
  EnvModel) {
  'use strict';

  describe('Widow Orphan Helper', function() {

    EnvModel.app = 'word';
    var container, page, section, nodes;

    beforeEach(function() {
      this.stampOutTempl('widow-orphan-test-template');
      container = document.getElementById('container');
      container.boundingBox = function() {
        return this.getBoundingClientRect();
      };
      page = document.getElementById('page');

      // We can't declare the section in HTML as we have to set the page size.
      section = createAndAppendSection_(page);
      // Add a bunch of content to the section.
      buildSectionContent_(section);
      // Flow the content since it's longer than the page it's on.
      page.createFlowInto();
      page.flow(container);
      nodes = [];
    });

    afterEach(function() {
      container = undefined;
      page = undefined;
      section = undefined;
      restoreUnflowFunctions_(nodes);
      nodes = undefined;
    });


    it('should only unflow the long paragraph and not the page, section, or ' +
      'the other paragraphs or runs.', function() {
      // container is just a div, and thus doesn't support unflow(), so we
      // won't add it to our collection of nodes to test.
      nodes.push(page);
      nodes.push(section);
      nodes.push(document.getElementById('p3'));
      nodes.push(document.getElementById('p10'));
      nodes.push(document.getElementById('p11'));
      nodes.push(document.getElementById('p15'));
      nodes.push(document.getElementById('r1'));
      nodes.push(document.getElementById('r10'));
      nodes.push(document.getElementById('r15'));
      setUnflowStubs_(nodes);
      // This function invokes whatever unflows are needed to make the content
      // fit on the page.
      WidowOrphanHelper.unbalanceNodes(nodes);
      assertUnflowInvocations_(nodes);
    });
  });


  var createAndAppendSection_ = function(page) {
    var section = new QowtSection();
    section.setPageSize({
      width: 15000,
      height: 15000,
      orientation: 'landscape'
    });
    section.style.display = 'block';
    Polymer.dom(page).appendChild(section);
    Polymer.dom(page).flush();
    return section;
  };

  var buildSectionContent_ = function(section) {
    for(var i = 0; i < 20; i++) {
      var para = new QowtWordPara();
      para.id = 'p' + i;
      var run = new QowtWordRun();
      // Make paragraph 15 really long so it stretches across the page break.
      run.innerText = i === 15 ? _.times(10000, _.constant('X')).join('') : i;
      run.id = 'r' + i;
      Polymer.dom(para).appendChild(run);
      Polymer.dom(section).appendChild(para);
    }
    Polymer.dom(section).flush();
  };

  var setUnflowStubs_ = function(nodes) {
    _.forEach(nodes, function(node) {
      sinon.stub(node, 'unflow');
    });
  };

  var assertUnflowInvocations_ = function(nodes) {
    _.forEach(nodes, function(node) {
      if(node.id === 'p15') {
        sinon.assert.calledOnce(node.unflow);
      }
      else {
        sinon.assert.notCalled(node.unflow);
      }
    });
  };

  var restoreUnflowFunctions_ = function(nodes) {
    _.forEach(nodes, function(node) {
      node.unflow.restore();
    });
  };

  return {};
});