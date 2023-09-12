/**
 * @fileOverview drawing widget
 * @author <a href="mailto:alok.guha@quickoffice.com">Alok Guha</a>
 */

/**
 * WIDGET.Drawing
 * ==============
 *
 * The Image widget encapsulates the part of the HTML which defines a drawing
 * element which encapsulates image, anchor, wrap styles
 *
 * ###IMPORTANT NOTES!
 *
 *
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayouts from occuring.
 * If a widget requires to perform operations that will result in a relayout of
 * the render tree then these operations should be captured in a 'layoutBlah)'
 * method in the widget's public API, so that owning control can dictate when
 * this method is called, at an appropriate moment to take the 'hit' of render
 * tree relayout costs.
 * @author alok.guha@quickoffice.com (Alok Guha)
 */

define([], function () {

  'use strict';

    var _factory = {
        /**
         * @public
         * @param config
         *        config.eid : {string} id for the new drawing div to be created
         */
        create:function (config) {

            // use module pattern for instance object
            var module = function () {
                var _KContentType = 'drawing';
                var _drawingNode;
                var _api = {};

                /**
                 * function to set Id
                 * @param id {string}
                 */
                var _setId = function (id) {
                    _drawingNode.id = id;
                };

                /**
                 * function to set style class
                 */
                var _setStyleClass = function () {
                    _drawingNode.classList.add('qowt-drawing');
                };


                /**
                 * Query the content type encapsulated by this widget.
                 * Determines which content handler/manager to use.
                 *
                 * @return {string} The content type encapsulated by this
                 *                  widget.
                 */
                _api.getContentType = function () {
                    return _KContentType;
                };

                /**
                 * Return the main html element which represents this image
                 *
                 * @return {w3c element || undefined} The element image element.
                 */
                _api.getWidgetElement = function () {
                    return _drawingNode;
                };

                function init() {
                    if (config !== undefined) {
                        _drawingNode = window.document.createElement('div');
                        _setId(config.eid);
                        _setStyleClass();
                    }
                }

                init();
                return _api;
            };

            var instance = module();
            return instance;
        }
    };
    return _factory;
});
