define([
  'qowtRoot/controls/document/fieldManager',
  'qowtRoot/commands/text/addQowtElementBase',
  'qowtRoot/models/env',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper'], function(
    FieldManager,
    AddQowtElementBase,
    EnvModel,
    WidowOrphanHelper) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtField command and returns it.
     *
     * @param {Object} context
     * @param {String} context.nodeId
     * @param {String} context.parentId
     * @param {String} context.fieldType
     * @param {String | undefined} context.siblingId
     * @param {String | undefined} config.format
     * @param {String | undefined} config.lang
     * @return {Object} addQowtField command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtField missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtField missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtField missing parentId');
      }
      if (!context.fieldType) {
        throw new Error('addQowtField missing field type');
      }
      if (EnvModel.app !== 'word') {
        throw new Error('Unsupported app for num-page creation');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtField', context);

        /**
         * Creates a num-page element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var widgetConfig = {
            newFieldId: context.nodeId,
            fieldType: context.fieldType,
            format: context.format,
            lang: context.lang
          };
          var widget = FieldManager.getWidgetForConfig(widgetConfig);

          if (widget) {
            api_.insertElement_(
                widget.getWidgetElement(),
                context.parentId,
                context.siblingId,
                context.optFunction
            );
          }
        };
        return api_;
      })();
    }
  };

  return factory_;
});
