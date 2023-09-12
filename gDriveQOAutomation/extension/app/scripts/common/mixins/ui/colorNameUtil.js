define(['qowtRoot/utils/converters/converter'], function(Converter) {

  'use strict';

  var _api = {

    getColorName: function(rgbColor) {
      var colorName;
      if (rgbColor) {
        var hexColorVal = Converter.colorString2hex(rgbColor).toLowerCase();
        colorName = _hexColorName[hexColorVal];
      }
      return colorName;
    }
  };


  var _hexColorName = {
    '#000000': 'black',
    '#0000ff': 'blue',
    '#00ffff': 'cyan',
    '#00008b': 'dark_blue',
    '#808080': 'dark_gray',
    '#008000': 'dark_green',
    '#00ff00': 'green',
    '#ff00ff': 'magenta',
    '#800000': 'maroon',
    '#000080': 'navy',
    '#808000': 'olive',
    '#ffa500': 'orange',
    '#800080': 'purple',
    '#ff0000': 'red',
    '#c0c0c0': 'gray',
    '#008080': 'teal',
    '#ee82ee': 'violet',
    '#ffffff': 'white',
    '#ffff00': 'yellow',

    //-------------WORD specific------------
    '#ff99cc': 'pink',
    '#ffcc99': 'peach',
    '#ffff99': 'light_yellow',
    '#ccffcc': 'light_green',
    '#ccffff': 'light_cyan',
    '#99ccff': 'light_blue',
    '#cc99ff': 'light_purple',
    '#ffcc00': 'gold',
    '#339966': 'eucalyptus_green',
    '#99cc00': 'pistachio',
    '#ff9900': 'orange',
    '#993366': 'deep_pink',
    '#00ccff': 'deep_sky_blue',
    '#33cccc': 'turquiose',
    '#3366ff': 'royal_blue',
    '#969696': 'dark_grey_2',
    '#ff6600': 'blaze_orange',
    '#333333': 'dark_grey_5',
    '#333399': 'dark_slate_blue',
    '#003366': 'midnight_blue',
    '#003300': 'dark_green_5',
    '#333300': 'dark_olive_green',
    '#993300': 'brown',
    '#666699': 'dark_blue_grey',
    '#008b8b': 'dark_cyan',
    '#a9a9a9': 'dark_gray',
    '#006400': 'dark_green',
    '#8b0000': 'dark_red',
    '#d3d3d3': 'light_gray',

    //---------------POINT specific---------------
    //----------color names as per Gslides------------------------------------

    '#434343': 'dark_gray_4',
    '#666666': 'dark_gray_3',
    '#999999': 'dark_gray_2',
    '#b7b7b7': 'dark_gray_1',
    '#cccccc': 'gray',
    '#d9d9d9': 'light_gray_1',
    '#efefef': 'light_gray_2',
    '#f3f3f3': 'light_gray_3',
    '#980000': 'red_berry',
    '#4a86e8': 'cornflower_blue',
    '#9900ff': 'purple',

    // Shades of Red berry
    '#e6b8af': 'light_red_berry_3',
    '#dd7e6b': 'light_red_berry_2',
    '#cc4125': 'light_red_berry_1',
    '#a61c00': 'dark_red_berry_1',
    '#85200c': 'dark_red_berry_2',
    '#5b0f00': 'dark_red_berry_3',

    // Shades of Red
    '#f4cccc': 'light_red_3',
    '#ea9999': 'light_red_2',
    '#e06666': 'light_red_1',
    '#cc0000': 'dark_red_1',
    '#990000': 'dark_red_2',
    '#660000': 'dark_red_3',

    // Shades of Orange
    '#fce5cd': 'light_orange_3',
    '#f9cb9c': 'light_orange_2',
    '#f6b26b': 'light_orange_1',
    '#e69138': 'dark_orange_1',
    '#b45f06': 'dark_orange_2',
    '#783f04': 'dark_orange_3',

    // Shades of Yellow
    '#fff2cc': 'light_yellow_3',
    '#ffe599': 'light_yellow_2',
    '#ffd966': 'light_yellow_1',
    '#f1c232': 'dark_yellow_1',
    '#bf9000': 'dark_yellow_2',
    '#7f6000': 'dark_yellow_3',

    // Shades of Green
    '#d9ead3': 'light_green_3',
    '#b6d7a8': 'light_green_2',
    '#93c47d': 'light_green_1',
    '#6aa84f': 'dark_green_1',
    '#38761d': 'dark_green_2',
    '#274e13': 'dark_green_3',

    // Shades of Cyan
    '#d0e0e3': 'light_cyan_3',
    '#a2c4c9': 'light_cyan_2',
    '#76a5af': 'light_cyan_1',
    '#45818e': 'dark_cyan_1',
    '#134f5c': 'dark_cyan_2',
    '#0c343d': 'dark_cyan_3',

    // Shades of Cornflower blue
    '#c9daf8': 'light_cornflower_blue_3',
    '#a4c2f4': 'light_cornflower_blue_2',
    '#6d9eeb': 'light_cornflower_blue_1',
    '#3c78d8': 'dark_cornflower_blue_1',
    '#1155cc': 'dark_cornflower_blue_2',
    '#1c4587': 'dark_cornflower_blue_3',

    // Shades of Blue
    '#cfe2f3': 'light_blue_3',
    '#9fc5e8': 'light_blue_2',
    '#6fa8dc': 'light_blue_1',
    '#3d85c6': 'dark_blue_1',
    '#0b5394': 'dark_blue_2',
    '#073763': 'dark_blue_3',

    // Shades of Purple
    '#d9d2e9': 'light_purple_3',
    '#b4a7d6': 'light_purple_2',
    '#8e7cc3': 'light_purple_1',
    '#674ea7': 'dark_purple_1',
    '#351c75': 'dark_purple_2',
    '#20124d': 'dark_purple_3',

    // Shades of Magenta
    '#ead1dc': 'light_magenta_3',
    '#d5a6bd': 'light_magenta_2',
    '#c27ba0': 'light_magenta_1',
    '#a64d79': 'dark_magenta_1',
    '#741b47': 'dark_magenta_2',
    '#4c1130': 'dark_magenta_3'
  };
  return _api;
});