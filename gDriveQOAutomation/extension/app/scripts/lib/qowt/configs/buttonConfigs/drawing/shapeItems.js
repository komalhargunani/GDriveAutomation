// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Config for Shapes to be added in add shape drop-down.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/utils/i18n'
], function(I18n) {

  'use strict';

  return [
    //TODO (Pankaj Avhad) Need to replace these ids with preset name,
    //when service/core starts sending preset name instead of preset ids.
    {
      'name': I18n.getMessage('menu_item_shapes'),
      iconClass: 'shapes',
      'elements': [
        88,  //'Rectangle',
        166, //'Rounded Rectangle',
        86,  //'Snip Single Corner Rectangle',
        102, //'Snip Same Side Corner Rectangle',
        90,  //'Snip Diagonal Corner Rectangle',
        112, //'Snip and Round Single Corner Rectangle',
        82,  //'Round Single Corner Rectangle',
        103, //'Round Same Side Corner Rectangle',
        38,  //'Round Diagonal Corner Rectangle',
        {type: 'spacer'},
        109, //'Oval',
        27,  //'Triangle',
        2,   //'Right Triangle',
        69,  //'Parallelogram',
        145, //'Trapezoid',
        124, //'Diamond',
        108, //'Regular Pentagon',
        96,  //'Hexagon',
        61,  //'Heptagon',
        171, //'Octagon',
        24,  //'Decagon',
        159, //'Dodecagon',
        153, //'Pie',
        1,   //'Chord',
        72,  //'Teardrop',
        122, //'Frame',
        164, //'Half Frame',
        9,   //'L-Shape',
        93,  //'Diagonal Stripe',
        95,  //'Cross',
        186, //'Plaque',
        143, //'Can',
        26,  //'Cube',
        28,  //'Bevel',
        140, //'Donut',
        160, //'"No" Symbol',
        104, //'Block Arc',
        128, //'Folded Corner',
        0,   //'Smiley Face',
        151, //'Heart',
        55,  //'Lightning Bolt',
        66,  //'Sun',
        71,  //'Moon',
        110, //'Cloud',
        {type: 'spacer'},
        172, //'Flowchart: Process',
        173, //'Flowchart: Alternate Process',
        41,  //'Flowchart: Decision',
        101, //'Flowchart: Data',
        170, //'Flowchart: Predefined Process',
        137, //'Flowchart: Internal Storage',
        43,  //'Flowchart: Document',
        74,  //'Flowchart: Multidocument',
        132, //'Flowchart: Terminator',
        184, //'Flowchart: Preparation',
        14,  //'Flowchart: Manual Input',
        45,  //'Flowchart: Manual Operation',
        107, //'Flowchart: Connector',
        84,  //'Flowchart: Off-page Connector',
        47,  //'Flowchart: Card',
        181, //'Flowchart: Punched Tape',
        36,  //'Flowchart: Summing Junction',
        50,  //'Flowchart: Or',
        94,  //'Flowchart: Collate',
        155, //'Flowchart: Sort',
        75,  //'Flowchart: Extract',
        97,  //'Flowchart: Merge',
        183, //'Flowchart: Stored Data',
        114, //'Flowchart: Delay',
        111, //'Flowchart: Sequential Access Storage',
        129, //'Flowchart: Magnetic Disk',
        16,  //'Flowchart: Direct Access Storage',
        165  //'Flowchart: Display'
      ]
    },
    {
      'name': I18n.getMessage('menu_item_arrows'),
      iconClass: 'arrows',
      'elements': [
        48,  //'Right Arrow',
        83,  //'Left Arrow',
        85,  //'Up Arrow',
        44,  //'Down Arrow',
        120, //'Left-Right Arrow',
        49,  //'Up-Down Arrow',
        179, //'Quad Arrow',
        98,  //'Left-Right-Up Arrow',
        8,   //'Bent Arrow',
        169, //'U-Turn Arrow',
        29,  //'Left-Up Arrow',
        123, //'Bent-Up Arrow',
        146, //'Curved Right Arrow',
        89,  //'Curved Left Arrow',
        22,  //'Curved UP Arrow',
        174, //'Curved Down Arrow',
        59,  //'Striped Right Arrow',
        33,  //'Notched Right Arrow',
        154, //'Pentagon',
        51,  //'Chevron',
        30,  //'Right Arrow Callout',
        125, //'Down Arrow Callout',
        105, //'Left Arrow Callout',
        148, //'Up Arrow Callout',
        10,  //'Left-Right Arrow Callout',
        53   //'Quad Arrow Callout'
      ]
    },
    {
      'name': I18n.getMessage('menu_item_callouts'),
      iconClass: 'callouts',
      'elements': [
        34,  //'Explosion 1',
        32,  //'Explosion 2',
        79,  //'4-Point Star',
        139, //'5-Point Star',
        142, //'6-Point Star',
        141, //'7-Point Star',
        149, //'8-Point Star',
        63,  //'10-Point Star',
        65,  //'12-Point Star',
        62,  //'16-Point Star',
        130, //'24-Point Star',
        115, //'32-Point Star',
        167, //'Rectangular Callout',
        152, //'Rounded Rectangular Callout',
        127, //'Oval Callout',
        35   //'Cloud Callout'
      ]
    },
    {
      'name': I18n.getMessage('menu_item_equation'),
      iconClass: 'equations',
      'elements': [
        163, //'Plus',
        52,  //'Minus',
        37,  //'Multiply',
        121, //'Divide',
        6,   //'Equal',
        18,  //'Not Equal',
        126, //'Double Bracket',
        117, //'Double Brace',
        144, //'Left Bracket',
        40,  //'Right Bracket',
        136, //'Left Brace',
        19   //'Right Brace'
      ]
    }

  ];
});
