/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename dcp properties to something readable in
 * dcp schema, core and everywhere else
 * (eg toolbar buttons, these observe functions, addNodes/formatNodes etc etc)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/utils/listFormatManager',
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    ListFormatManager,
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['lvl', 'lfeID'],

    observers: [
      'lvlChanged_(model.ppr.lvl)',
      'lfeIDChanged_(model.ppr.lfeID)'
    ],

    get lvl() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.lvl);
    },

    set lvl(value) {
      this.setInModel_('ppr.lvl', value);
    },

    lvlChanged_: function(current) {
      this.setAttribute('qowt-lvl', current);
      this.updateListTemplate_();
    },

    get lfeID() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.lfeID);
    },

    set lfeID(value) {
      this.setInModel_('ppr.lfeID', value);
    },

    lfeIDChanged_: function(current) {
      this.setAttribute('qowt-entry', current);
      this.updateListTemplate_();
    },

    computedDecorations_: {
      lvl: function(/* computedStyles */) {
        return this.model.ppr && this.model.ppr.lvl;
      },
      lfeID: function(/* computedStyles */) {
        return this.model.ppr && this.model.ppr.lfeID;
      }
    },

    // ----------------------------------------

    updateListTemplate_: function() {
      var entryId = this.model.ppr && this.model.ppr.lfeID;
      if (entryId !== undefined) {
        var templateId = ListFormatManager.getTemplateId(entryId);
        var listLevel = this.model.ppr.lvl || 0;
        var listType = ListFormatManager.getListType(templateId, listLevel);
        var listClassname;

        if (templateId === undefined) {
          templateId = entryId;
        }
        listClassname = ListFormatManager.get(templateId, listLevel);

        this.setListFormatTemplateId_(templateId);
        this.setListFormatClass_(listClassname);
        this.setListType_(listType);
      } else {
        this.clearListInfo_();
      }
    },

    clearListInfo_: function() {
      this.setListFormatTemplateId_(undefined);
      this.setListFormatClass_(undefined);
      this.setListType_(undefined);
    },

    setListFormatTemplateId_: function(lftid) {
      if (lftid !== undefined) {
        this.setAttribute('qowt-template', lftid);
      } else {
        this.removeAttribute('qowt-template');
      }
    },

    setListFormatClass_: function(listClassname) {
      // Remove any previous list format before adding a new one.
      // If listClassname is undefined, that ensures we've cleared the classes
      // 'qowt-list' is used for generic list CSS.
      if (this.listClassname_) {
        this.classList.remove(this.listClassname_);
        this.classList.remove('qowt-list');
      }
      if (listClassname) {
        this.listClassname_ = listClassname;
        this.classList.add(this.listClassname_);
        this.classList.add('qowt-list');
      }
    },

    setListType_: function(ltype) {
      if (ltype) {
        this.setAttribute('qowt-list-type', ltype);
      } else {
        this.removeAttribute('qowt-list-type');
      }
    },

    isNumberedList: function() {
      return this.getAttribute('qowt-list-type') === 'n';
    },

    isBulletedList: function() {
      return this.getAttribute('qowt-list-type') === 'b';
    }

  });

  return api_;

});
