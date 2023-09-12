/**
 * Handles the Image/Picture rendering for Sheet. The DCP consists of two parts
 * -  First part is anchor information which specifies where to draw the image
 *    on the sheet alongwith what happens with image when row and columns are
 *    resized.
 * -  The second part is image data - image url, roation, scaling, extents etc.
 */

define([
    'qowtRoot/controls/grid/paneManager',
    'qowtRoot/widgets/grid/floaterImage'
],
    function (PaneManager, SheetFloaterImage) {

  'use strict';

        // private data
        var _api = {

            /*
             DCP Type Code
             This is used by the DCP Manager to register this Handler
             */
            etp:'spic',

            visit:function (v) {

                if (!v || !v.el || (v.el.etp !== _api.etp)) {
                    return undefined;
                }

                if (PaneManager.getMainPane() === undefined) {
                    // if we have no reference to a grid widget then bail ignore
                    // this dcp element this could happen if the app had not
                    // constructed a workbook layout control (which constructs
                    // the grid widget)
                    return undefined;
                }

                var rot;
                if (v.el.elm[0] && v.el.elm[0].spPr && v.el.elm[0].spPr.xfrm &&
                  v.el.elm[0].spPr.xfrm.rot) {
                    rot = v.el.elm[0].spPr.xfrm.rot;
                }

                //Configuration for SheetFloaterImage
                var config = {
                    anchor:v.el.elm[0].ancr,
                    rot:rot,
                    imageId:v.el.elm[0].eid,
                    parentNode:v.node
                };

                var floaterMgr = PaneManager.getMainPane().getFloaterManager();


                var imageFloaterWidget = SheetFloaterImage.create(config);

                floaterMgr.attachWidget(imageFloaterWidget);
                imageFloaterWidget.appendTo(v.node);

                return imageFloaterWidget;

            }


        };

        return _api;


    });


