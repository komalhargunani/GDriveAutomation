/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test module for StyleResolver.
 * @see StyleResolver.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/utils/style/styleResolver'
], function(
    StyleResolver) {

  'use strict';

  describe('Style Resolver', function() {

    var officeStyles_;

    beforeEach(function() {
      var officeStyles = new QowtOfficeStyles();
      document.head.appendChild(officeStyles);
      officeStyles_ = document.getElementById('qowtOfficeStyles');
    });

    afterEach(function() {
      officeStyles_ = undefined;
    });

    it('should resolve run properties', function() {
      var styleNormal = {
        basedOn: '',
        id: 'Normal',
        isDefault: true,
        name: 'Normal',
        type: 'par',
        rpr: {
          font: 'Arial',
          bld: true,
          clr: 'red',
          siz: 10
        }
      };
      var styleHeading1 =  {
        basedOn: 'Normal',
        id: 'Heading1',
        isDefault: false,
        name: 'Heading 1',
        rpr: {
          font: 'Calibri',
          siz: 16
        },
        type: 'par'
      };
      var styleAwesome =  {
        basedOn: 'Heading1',
        id: 'Awesome',
        isDefault: false,
        name: 'Awesome',
        rpr: {
          font: 'Roboto',
          clr: 'green'
        },
        type: 'par'
      };
      var expectedProperties = {
        rpr: {
          // font is overridden by all levels but Awsome wins.
          font: 'Roboto',
          // clr is overridden by Awesome.
          clr: 'green',
          // siz is overridden by Heading1 and inherited by Awesome.
          siz: 16,
          // bld is inherited by Awesome.
          bld: true
        },
        ppr: {
        }
      };

      officeStyles_.add(styleNormal);
      officeStyles_.add(styleHeading1);
      officeStyles_.add(styleAwesome);

      StyleResolver.resolve(styleAwesome);

      expect(styleAwesome.resolved).toEqual(expectedProperties);
    });

    it('should resolve paragraph properties', function() {
      var styleNormal = {
        basedOn: '',
        id: 'Normal',
        isDefault: true,
        name: 'Normal',
        type: 'par',
        ppr: {
          rin: 10,
          spa: 7,
          lin: 50
        }
      };
      var styleHeading1 =  {
        basedOn: 'Normal',
        id: 'Heading1',
        isDefault: false,
        name: 'Heading 1',
        ppr: {
          rin: 20,
          spa: 14
        },
        type: 'par'
      };
      var styleAwesome =  {
        basedOn: 'Heading1',
        id: 'Awesome',
        isDefault: false,
        name: 'Awesome',
        ppr: {
          rin: 30,
          spb: 10
        },
        type: 'par'
      };
      var expectedProperties = {
        ppr: {
          // rin is overridden at all levels by Awesome wins.
          rin: 30,
          // spb is unique property in Awesome.
          spb: 10,
          // spa is overridden by Heading1 and inherited by Awesome.
          spa: 14,
          // lin is inherited by Awesome
          lin: 50
        },
        rpr: {
        }
      };

      officeStyles_.add(styleNormal);
      officeStyles_.add(styleHeading1);
      officeStyles_.add(styleAwesome);

      StyleResolver.resolve(styleAwesome);

      expect(styleAwesome.resolved).toEqual(expectedProperties);
    });

  });
});
