define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/toolManager',
  'qowtRoot/tools/toolsManifest',
  'qowtRoot/tools/shape/shapeTool',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/tools/sheet/sheetChartTool',
  'qowtRoot/tools/sheet/sheetImageTool',
  'qowtRoot/tools/sheet/sheetTabTool',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/tools/text/textTool',
  'qowtRoot/tools/point/thumbnailStripTool',
  'qowtRoot/tools/point/slide'], function(
  PubSub,
  ToolManager,
  ToolManifest) {

  'use strict';

  var tools_ = [].slice.call(arguments, 3);
  var toolNames_ = tools_.map(function(tool) {
    return tool.name;
  });

  describe('Tool Manager.', function() {

    beforeEach(function() {
      tools_.forEach(function(tool) {
        if (tool.init) { sinon.stub(tool, 'init'); }
        if (tool.activate) { sinon.stub(tool, 'activate'); }
        if (tool.deactivate) { sinon.stub(tool, 'deactivate'); }
      });
      // Prevent creating hanging subscribers when we initialize the toolManager
      sinon.stub(PubSub, 'subscribe');
      PubSub.publish('qowt:init', {});
    });

    afterEach(function() {
      PubSub.subscribe.restore();
      tools_.forEach(function(tool) {
        if (tool.init) { tool.init.restore(); }
        if (tool.activate) { tool.activate.restore(); }
        if (tool.deactivate) { tool.deactivate.restore(); }
      });
    });

    it('All manifest tools should be dependencies of this test', function() {
      var manifest = ToolManifest.getTools();
      Object.keys(manifest).forEach(function(toolName) {
        assert.isTrue(
            (toolNames_.indexOf(toolName) >= 0),
            toolName + ' in the manifest is tested'
        );
      });
    });

    it('Should have initialized', function() {
      assert.isTrue(ToolManager.initialized, 'ToolManager is initialized');
      assert.isUndefined(ToolManager.activeTool, 'No active tool set');
    });

    it('Tools should have been loaded by Manager.', function() {
      tools_.forEach(function(tool) {
        if (tool.init) {
          assert.isTrue(tool.init.calledOnce, tool.name + '.init');
        }
      });
    });

    it('Should call activate on tool when set.', function() {
      tools_.forEach(function(tool) {
        ToolManager.setActiveTool(tool.name);
        if (tool.activate) {
          assert.strictEqual(
              tool.name,
              ToolManager.activeTool,
              tool.name + ' tool became active');
          assert.isTrue(tool.activate.calledOnce, tool.name + '.activate');
        }
      });
    });

    it('Should call deactivate on tool when unset.', function() {
      tools_.forEach(function(tool) {
        ToolManager.setActiveTool(tool.name);
        ToolManager.removeActiveTool();
        if (tool.deactivate) {
          assert.strictEqual(
              undefined,
              ToolManager.activeTool,
              tool.name + ' tool became deactive');
          assert.isTrue(tool.deactivate.calledOnce, tool.name + '.deactivate');
        }
      });
    });
  });
});
