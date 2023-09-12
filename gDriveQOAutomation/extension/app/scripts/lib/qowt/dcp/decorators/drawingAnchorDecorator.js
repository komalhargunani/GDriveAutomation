/**
 * @fileoverview simple module to decorate existing floating element with
 *               information such as relative position.
 *
 *  drawingAnchor Decorator is used to position floating objects such as images
 *  to proper place within document. It can be resued to position different
 *  floating objects, As it is a Decorator we only need to pass the target
 *  element and position (x and Y) properties.
 *
 * we are supporting absoulte position relative to paragraph only.
 *
 * @author<a href="mailto:yuvraj.patel@quickoffice.com">Yuvraj Patel</a>
 */

define([
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(UnitConversionUtils) {

  'use strict';

  var _kPIXEL = 'px';

  var _api = {

    /**
     * Set the element position related properties.
     *
     * @param {HTMLElement} elm The html element to decorate.
     * @param {object} data Decoration data.
     * @param {string} data.wst Wrap style for the drawing.
     * @param {object} data.acr anchoring information for the drawing.
     * @param {string} data.acr.rec its rectangle where the image exists.
     *                 The coordinates are given in twips and relative
     *                 to the reference position given by the attributes
     *                 “hrf” and “vrf”.
     * @param {object} data.acr.rzo  rzo(relative Z order) is mapped to
     *                 'z-Index' css property. The value of rzo is negative
     *                 for behind text warp style and positive for Infront
     *                 of text wrap style.
     * @param {element} data.node The parent container of this drawing.
     */
    decorate: function(elm, data) {
      var acrProp;

      /*
        we only support 'in front of text' and 'behind the text' wrap style.
        other wrap styles will fall back to inline.
      */
      if (data.el && (data.el.wst === 'ftx' || data.el.wst === 'btx') &&
        data.el.acr) {

        /*
        data.el.acr property has anchoring information. For inline images there
        will not be any anchoring information.
        */
        acrProp = data.el.acr;

        /*
          we only support image position relative to paragraphs. Other image
          position like 'lpm'(positioned to leading page margin), 'lep'
          (positioned to leading edge of page) horizontally and 'tpm'(positioned
          to top margin of page.),'tpe' (positioned to tope edge of page.)
          vertically are not supported and it will fallback to inline image.
         */
        if (acrProp.rec && acrProp.hrf && acrProp.hrf === 'lce' &&
          acrProp.vrf && acrProp.vrf === 'tre') {
          _anchorNode(elm, data.node);
          /*
           rzo(relative Z order) is mapped to 'zIndex' css property. The value
           of rzo is negative for behind text wrap style and positive for
           Infront of text wrap style. legacyCore/DCP does the processing to
           send the correct rzo value. rzo can aslo be used whenever two images
           overlap with each other, this property determines which object is
           displayed on top.
          */
          elm.style.zIndex = acrProp.rzo;

          _setHorizontalPosition(elm, acrProp);
          _setVerticalPosition(elm, acrProp);
        }
      }
    }
  };

  /**
   * The element needs to be set absolute and parent (which is paragraph in
   * this case) to relative. Else the element will be anchored to something
   * else.
   * @param elm - the element which is to be positioned absolutely.
   * @param referenceElm - the element with respect which elm is positioned.
   */
  function _anchorNode(elm, referenceElm) {
    elm.style.position = 'absolute';
    referenceElm.style.position = 'relative';
  }

  /**
   * This Method will set the horizontal position of 'elm' according to
   * available data in props.
   *
   * @param {HTMLElement} elm html element to be position horizontally.
   * @param {Object} props Specified the horizontal position data to
   *                apply.
   */
  function _setHorizontalPosition(elm, props) {
    var left = props.rec.lft ? parseInt(props.rec.lft, 10) : 0;
    left = UnitConversionUtils.convertEmuToPixel(left);

    // Horizontal Position
    switch (props.hrf) {
      // positioned to leading page margin.
      case 'lpm':
        // Not Supported
        break;

      // positioned to leading edge of page.
      case 'lep':
        // Not Supported
        break;

      // positioned to leading column edge.
      // we currently do not support multi-column document.
      case 'lce':
        elm.style.left = left + _kPIXEL;
        break;

      default:
        break;
    }
  }


  /**
   * This Method will set the vertical position of 'elm' according to available
   * data in props.
   *
   * @param {HTMLElement} elm html element to be position vertically.
   * @param {Object} props Specified the vertical position data to
   *                  apply.
   * @param {HTMLElement} parentElm is parent of elm againt which we need to
   *                      position the elem.
   */
  function _setVerticalPosition(elm, props) {
    var top = props.rec.top ? parseInt(props.rec.top, 10) : 0;
    top = UnitConversionUtils.convertEmuToPixel(top);

    // Vertical Position
    switch (props.vrf) {
      // positioned to top margin of page.
      case 'tpm':
        // Not Supported
        break;

      // positioned to tope edge of page.
      case 'tpe':
        // Not Supported
        break;

      // positioned to edge of paragraph.
      case 'tre':
        elm.style.top = top + _kPIXEL;
        break;

      default:
        break;
    }
  }

  return _api;
});


