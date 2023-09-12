define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'
], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['lnk'],

    observers: [
      'linkChanged_(model.lnk)'
    ],

    get lnk() {
      return (this.model && this.model.lnk);
    },

    set lnk(value) {
      this.setInModel_('lnk', value);
    },

    linkChanged_: function(current) {
      if (current !== undefined) {
        setLink_(this, current);
      } else {
        this.setAttribute('href', '');
      }
    },

    computedDecorations_: {
      lnk: function(/* computedStyles */) {
        return this.getAttribute('href') || undefined;
      }
    }

  });

  // PRIVATE ===================================================================

  /**
   * @private
   * The link we get from the DCP can be one of many types. In
   * particular we can get links to an:
   *    - http address
   *    - mailto links
   *    - link to an external (but local) file
   *    - link to an internal bookmark inside the document
   *    - link to an internal anchor in the page
   *
   * External links should open in a new tab/window, whereas internal
   * links should clearly just scroll the document to the right place.
   * It would therefore be useful if the information we get from the
   * dcp would indicate if the link is internal or external, but
   * currently it does not differentiate between these, even though
   * it *does* have the information to do so (the links are references
   * for external links)
   * This means we have to parse the link to determine it's type.
   * NOTE: we currently can NOT differentiate between external file links
   * and local bookmark links! So we treat those links as bookmarks for
   * now, since we can not open external files anyway!
   *
   * JELTE TODO: we should fix DCP to add that knowledge
   * see https://issues.quickoffice.com/browse/CQO-685
   *  Hyperlink dcp element needs to indicate if it's internal or external
   *
   * @param {HTML Element} node the anchor node to which to add the link
   * @param {string} link the actual link string we get from DCP and
   *                      which we have to parse
   */
  function setLink_(node, link) {
    var fieldLink = link.match(/(PAGEREF|HYPERLINK)\s+(\S+)\s+/);
    if (fieldLink && fieldLink.length) {
      // we are only interested in the _Toc221685935 id
      link = fieldLink[2];
    }

    // extenal links have a scheme at the start, eg
    //    http://something.com, or
    //    mailto:foo@bar.com
    var externalLink = link.match(/(\w+):\/\/([\w.]+)(\/\S)*/) ||
                        link.match(/(^mailto:)/);
    if (externalLink && externalLink.length) {
      node.setAttribute('target', '_blank');
    } else {
      // internal links should point to local anchor elements
      // so prepend the '#' char to denote that
      link = '#' + link;
    }

    node.setAttribute('href', link);
  }
  return api_;

});
