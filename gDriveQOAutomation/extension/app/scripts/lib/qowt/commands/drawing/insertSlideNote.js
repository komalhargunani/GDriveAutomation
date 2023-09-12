define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/widgets/factory'
], function(
    EditCommandBase,
    TypeUtils,
    WidgetFactory) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new insertSlideNote command and returns it.
     *
     * @param {Object} context context data object consisting of the data
     *     required to insert a slide note.
     * @return {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Insert Slide Note cmd missing context');
      }
      if (context.command === undefined) {
        throw new Error('Insert Slide Note cmd missing command');
      }
      if (context.command.sn === undefined) {
        throw new Error('Insert Slide Note cmd missing slide number');
      }
      if (context.command.rootEl === undefined) {
        throw new Error('Insert Slide Note cmd missing rootEl');
      }

      // use module pattern for instance object
      var module = function() {

        var api_ = EditCommandBase.create('insertSlideNote', false, true);

        var parentNode_ = context.command.rootEl;
        api_.rootEl = document.createDocumentFragment();


        /**
         * Append the text body for the new slide note
         * @override
         */
        api_.changeHtml = function() {
          // Remove the slide notes div if already present
          var oldSlideNotesDiv = parentNode_.getElementById('slide-notes-div');
          if (oldSlideNotesDiv) {
            parentNode_.removeChild(oldSlideNotesDiv);
          }
          parentNode_.appendChild(api_.rootEl.slidenotes);
          var textBodyDiv =
              parentNode_.querySelector('[qowt-divtype="textBox"]');
          // Activate text body
          var textBody = WidgetFactory.create({fromNode: textBodyDiv});
          if (textBody && TypeUtils.isFunction(textBody.activate)) {
            textBody.activate();
          }
        };

        api_.dcpData = function() {
          var payload = {
            name: 'insertSlideNote',
            sn: context.command.sn
          };
          return payload;
        };

        api_.doRevert = undefined;

        return api_;
      };
      // We create a new instance of the object by invoking the module
      // constructor function.
      var instance = module();
      return instance;
    }
  };

  return factory_;
});
