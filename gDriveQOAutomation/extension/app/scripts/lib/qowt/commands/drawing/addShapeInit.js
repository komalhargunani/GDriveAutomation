define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/models/transientAction',
  'qowtRoot/pubsub/pubsub',
  'third_party/lo-dash/lo-dash.min'
], function(EditCommandBase,
            TransientActionModel,
            PubSub) {

  'use strict';

  var _factory = {

    /**
     * Creates a new addShapeInit command and returns it.
     *
     * @param {Object} contextData context data object consisting of the data
     *     required to initialize add shape. It consists of event information
     *     that needs to be saved in the transient model
     * @return {Object}
     */
    create: function(contextData) {

      // don't try to execute if it's missing crucial data
      if (contextData === undefined) {
        throw new Error('Add Shape Init cmd missing contextData');
      }

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==true, callsService==_dcpCommand)
        // Explicitly setting mark_dirty flag to 'false', to avoid unnecessary
        // saving in case of this command.
        var _api = EditCommandBase.create('addShapeInit', true, false, false);
        /**
         * Optimistically insert the specified shape onto the slide.
         * Values are calculated in emu since the core and DCP manager both
         * work on the EMU
         * @override
         */
        _api.changeHtml = function() {
          PubSub.publish('qowt:clearSlideSelection');
          PubSub.publish('qowt:requestFocus', {contentType: 'slide'});

          //context.set is true when user wants to insert the text box and
          //button state is latched.
          //context.set is false when user cancels the insert text box operation
          if (contextData.context.set) {
            TransientActionModel.setTransientAction(contextData);
          } else {
            TransientActionModel.clearTransientValues();
          }

        };

        _api.doRevert = undefined;

        return _api;
      };
      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
