/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([], function() {

  'use strict';


  return {

    'id': 'docListStyle',

    /**
     * simple doc numbering JSON
     *
     * See qowt/comms/schema/numberedList-schema.js
     *
     */
    'basicListJSON': function() {

      return {
                      "absnum": [
                          {
                              "absnumid": "0",
                              "elm": [
                                  {
                                      "etp": "lvlinfo",
                                      "level": "0",
                                      "leveljust": "left",
                                      "lvltxt": "%1.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 18
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "1",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 21,
                                          "lin": 39
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "2",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 25,
                                          "lin": 61
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "3",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 32,
                                          "lin": 86
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "4",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 39,
                                          "lin": 111
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "5",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 46,
                                          "lin": 136
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "6",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 54,
                                          "lin": 162
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "7",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.%8.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 61,
                                          "lin": 187
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "8",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.%8.%9.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 72,
                                          "lin": 216
                                      },
                                      "startval": "1"
                                  }
                              ],
                              "etp": "absnuminfo",
                              "multiLevelType": "multilevel"
                          }
                      ],
                      "etp": "liststyleinfo",
                      "num": [
                          {
                              "absnumid": "0",
                              "etp": "numid-map",
                              "lvloverride": [],
                              "numId": "1"
                          }
                      ]
                  };
    },

    'multiLevelNumberedListWithoutCustomFormattingJSON' : function(){
      return {
                      "absnum": [
                          {
                              "absnumid": "0",
                              "elm": [
                                  {
                                      "etp": "lvlinfo",
                                      "level": "0",
                                      "leveljust": "left",
                                      "lvltxt": "%1.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 18
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "1",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 21,
                                          "lin": 39
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "2",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 25,
                                          "lin": 61
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "3",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 32,
                                          "lin": 86
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "4",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 39,
                                          "lin": 111
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "5",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 46,
                                          "lin": 136
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "6",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 54,
                                          "lin": 162
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "7",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.%8.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 61,
                                          "lin": 187
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "8",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.%8.%9.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 72,
                                          "lin": 216
                                      },
                                      "startval": "1"
                                  }
                              ],
                              "etp": "absnuminfo",
                              "multiLevelType": "multilevel"
                          }
                      ],
                      "etp": "liststyleinfo",
                      "num": [
                          {
                              "absnumid": "0",
                              "etp": "numid-map",
                              "lvloverride": [],
                              "numId": "1"
                          }
                      ]
                  };
    },

    'multiLevelBulletedListWithoutCustomFormattingJSON' : function(){
      return {
          "absnum": [
              {
                  "absnumid": "0",
                  "elm": [
                      {
                          "etp": "lvlinfo",
                          "level": "0",
                          "leveljust": "left",
                          "lvltxt": "\u03b1",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 36
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Calibri",
                                  "default": "default",
                                  "hAnsi": "Calibri"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "1",
                          "leveljust": "left",
                          "lvltxt": "\u03b1",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 72
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings 2",
                                  "default": "default",
                                  "hAnsi": "Wingdings 2"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "2",
                          "leveljust": "left",
                          "lvltxt": "\u00b5",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 108
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "3",
                          "leveljust": "left",
                          "lvltxt": "\uf076",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 144
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "4",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 180
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "5",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 216
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "6",
                          "leveljust": "left",
                          "lvltxt": "\uf076",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 252
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "7",
                          "leveljust": "left",
                          "lvltxt": "\uf0d8",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 288
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "8",
                          "leveljust": "left",
                          "lvltxt": "\uf0fc",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 324
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "24"
                          },
                          "startval": "1"
                      }
                  ],
                  "etp": "absnuminfo",
                  "multiLevelType": "hybridMultilevel"
              }
          ],
          "etp": "liststyleinfo",
          "num": [
              {
                  "absnumid": "0",
                  "etp": "numid-map",
                  "lvloverride": [],
                  "numId": "1"
              }
          ]
      };
    },

    'multiLevelNumberedListWithCustomFormattingJSON' : function(){
      return {
                      "absnum": [
                          {
                              "absnumid": "0",
                              "elm": [
                                  {
                                      "etp": "lvlinfo",
                                      "level": "0",
                                      "leveljust": "left",
                                      "lvltxt": "%1.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 18
                                      },
                                      "rpr": {
                                          "bold": "true",
                                          "etp": "lvlrPr",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "1",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 21,
                                          "lin": 39
                                      },
                                      "rpr": {
                                          "etp": "lvlrPr",
                                          "italics": "true",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "2",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 25,
                                          "lin": 61
                                      },
                                      "rpr": {
                                          "bold": "true",
                                          "etp": "lvlrPr",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "3",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 32,
                                          "lin": 86
                                      },
                                      "rpr": {
                                          "bold": "true",
                                          "etp": "lvlrPr",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "4",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 39,
                                          "lin": 111
                                      },
                                      "rpr": {
                                          "bold": "true",
                                          "etp": "lvlrPr",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "5",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 46,
                                          "lin": 136
                                      },
                                      "rpr": {
                                          "etp": "lvlrPr",
                                          "italics": "true",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "6",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 54,
                                          "lin": 162
                                      },
                                      "rpr": {
                                          "etp": "lvlrPr",
                                          "italics": "true",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "7",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.%8.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 61,
                                          "lin": 187
                                      },
                                      "rpr": {
                                          "etp": "lvlrPr",
                                          "italics": "true",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "8",
                                      "leveljust": "left",
                                      "lvltxt": "%1.%2.%3.%4.%5.%6.%7.%8.%9.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 72,
                                          "lin": 216
                                      },
                                      "rpr": {
                                          "bold": "true",
                                          "etp": "lvlrPr",
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  }
                              ],
                              "etp": "absnuminfo",
                              "multiLevelType": "multilevel"
                          }
                      ],
                      "etp": "liststyleinfo",
                      "num": [
                          {
                              "absnumid": "0",
                              "etp": "numid-map",
                              "lvloverride": [],
                              "numId": "1"
                          }
                      ]
                  };
    },

    'multiLevelBulletedListWithCustomFormattingJSON' : function(){
      return {
          "absnum": [
              {
                  "absnumid": "0",
                  "elm": [
                      {
                          "etp": "lvlinfo",
                          "level": "0",
                          "leveljust": "left",
                          "lvltxt": "\u03b1",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 36
                          },
                          "rpr": {
                              "bold": "true",
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Calibri",
                                  "default": "default",
                                  "hAnsi": "Calibri"
                              },
                              "size": "56"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "1",
                          "leveljust": "left",
                          "lvltxt": "\u03b1",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 72
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings 2",
                                  "default": "default",
                                  "hAnsi": "Wingdings 2"
                              },
                              "size": "56"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "2",
                          "leveljust": "left",
                          "lvltxt": "\uf076",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 108
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "40"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "3",
                          "leveljust": "left",
                          "lvltxt": "\u03b1",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 144
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Calibri",
                                  "default": "default",
                                  "hAnsi": "Calibri"
                              },
                              "size": "56"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "4",
                          "leveljust": "left",
                          "lvltxt": "\uf0d8",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 180
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "40"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "5",
                          "leveljust": "left",
                          "lvltxt": "\uf0fc",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 216
                          },
                          "rpr": {
                              "bold": "true",
                              "etp": "lvlrPr",
                              "italics": "true",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "40"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "6",
                          "leveljust": "left",
                          "lvltxt": "\uf0b7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 252
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Symbol",
                                  "default": "default",
                                  "hAnsi": "Symbol"
                              },
                              "size": "40"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "7",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 288
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "italics": "true",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              },
                              "size": "44"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "8",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 324
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "44"
                          },
                          "startval": "1"
                      }
                  ],
                  "etp": "absnuminfo",
                  "multiLevelType": "hybridMultilevel"
              }
          ],
          "etp": "liststyleinfo",
          "num": [
              {
                  "absnumid": "0",
                  "etp": "numid-map",
                  "lvloverride": [],
                  "numId": "1"
              }
          ]
      };
    },

    'singleLevelNumberedListWithoutCustomFormattingJSON' : function(){
      return {
                      "absnum": [
                          {
                              "absnumid": "0",
                              "elm": [
                                  {
                                      "etp": "lvlinfo",
                                      "level": "0",
                                      "leveljust": "left",
                                      "lvltxt": "%1.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 36
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "1",
                                      "leveljust": "left",
                                      "lvltxt": "%2.",
                                      "numfmt": "lowerLetter",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 72
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "2",
                                      "leveljust": "right",
                                      "lvltxt": "%3.",
                                      "numfmt": "lowerRoman",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 9,
                                          "lin": 108
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "3",
                                      "leveljust": "left",
                                      "lvltxt": "%4.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 144
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "4",
                                      "leveljust": "left",
                                      "lvltxt": "%5.",
                                      "numfmt": "lowerLetter",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 180
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "5",
                                      "leveljust": "right",
                                      "lvltxt": "%6.",
                                      "numfmt": "lowerRoman",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 9,
                                          "lin": 216
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "6",
                                      "leveljust": "left",
                                      "lvltxt": "%7.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 252
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "7",
                                      "leveljust": "left",
                                      "lvltxt": "%8.",
                                      "numfmt": "lowerLetter",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 288
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "8",
                                      "leveljust": "right",
                                      "lvltxt": "%9.",
                                      "numfmt": "lowerRoman",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 9,
                                          "lin": 324
                                      },
                                      "startval": "1"
                                  }
                              ],
                              "etp": "absnuminfo",
                              "multiLevelType": "hybridMultilevel"
                          }
                      ],
                      "etp": "liststyleinfo",
                      "num": [
                          {
                              "absnumid": "0",
                              "etp": "numid-map",
                              "lvloverride": [],
                              "numId": "1"
                          }
                      ]
                  };
    },

    'singleLevelBulletedListWithoutCustomFormattingJSON' : function(){
      return {
          "absnum": [
              {
                  "absnumid": "0",
                  "elm": [
                      {
                          "etp": "lvlinfo",
                          "level": "0",
                          "leveljust": "left",
                          "lvltxt": "\uf0b7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 36
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Symbol",
                                  "default": "default",
                                  "hAnsi": "Symbol"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "1",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 72
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "2",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 108
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "3",
                          "leveljust": "left",
                          "lvltxt": "\uf0b7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 144
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Symbol",
                                  "default": "default",
                                  "hAnsi": "Symbol"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "4",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 180
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "5",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 216
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "6",
                          "leveljust": "left",
                          "lvltxt": "\uf0b7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 252
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Symbol",
                                  "default": "default",
                                  "hAnsi": "Symbol"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "7",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 288
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "8",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 324
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              }
                          },
                          "startval": "1"
                      }
                  ],
                  "etp": "absnuminfo",
                  "multiLevelType": "hybridMultilevel"
              }
          ],
          "etp": "liststyleinfo",
          "num": [
              {
                  "absnumid": "0",
                  "etp": "numid-map",
                  "lvloverride": [],
                  "numId": "1"
              }
          ]
      };
    },

    'singleLevelNumberedListWithCustomFormattingJSON' :function(){
      return {
                      "absnum": [
                          {
                              "absnumid": "0",
                              "elm": [
                                  {
                                      "etp": "lvlinfo",
                                      "level": "0",
                                      "leveljust": "left",
                                      "lvltxt": "BB.%1.BB)",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 36
                                      },
                                      "rpr": {
                                          "bold": "true",
                                          "etp": "lvlrPr",
                                          "rFonts": {
                                              "default": "default"
                                          },
                                          "size": "40"
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "1",
                                      "leveljust": "left",
                                      "lvltxt": "%2.",
                                      "numfmt": "lowerLetter",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 72
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "2",
                                      "leveljust": "right",
                                      "lvltxt": "%3.",
                                      "numfmt": "lowerRoman",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 9,
                                          "lin": 108
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "3",
                                      "leveljust": "left",
                                      "lvltxt": "%4.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 144
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "4",
                                      "leveljust": "left",
                                      "lvltxt": "%5.",
                                      "numfmt": "lowerLetter",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 180
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "5",
                                      "leveljust": "right",
                                      "lvltxt": "%6.",
                                      "numfmt": "lowerRoman",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 9,
                                          "lin": 216
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "6",
                                      "leveljust": "left",
                                      "lvltxt": "%7.",
                                      "numfmt": "decimal",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 252
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "7",
                                      "leveljust": "left",
                                      "lvltxt": "%8.",
                                      "numfmt": "lowerLetter",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 18,
                                          "lin": 288
                                      },
                                      "startval": "1"
                                  },
                                  {
                                      "etp": "lvlinfo",
                                      "level": "8",
                                      "leveljust": "right",
                                      "lvltxt": "%9.",
                                      "numfmt": "lowerRoman",
                                      "ppr": {
                                          "etp": "ppr",
                                          "hin": 9,
                                          "lin": 324
                                      },
                                      "startval": "1"
                                  }
                              ],
                              "etp": "absnuminfo",
                              "multiLevelType": "hybridMultilevel"
                          }
                      ],
                      "etp": "liststyleinfo",
                      "num": [
                          {
                              "absnumid": "0",
                              "etp": "numid-map",
                              "lvloverride": [],
                              "numId": "1"
                          }
                      ]
                  };
    },

    'singleLevelBulletedListWithCustomFormattingJSON' : function(){
      return {
          "absnum": [
              {
                  "absnumid": "0",
                  "elm": [
                      {
                          "etp": "lvlinfo",
                          "level": "0",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 36
                          },
                          "rpr": {
                              "bold": "true",
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              },
                              "size": "56"
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "1",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 72
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "2",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 108
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "3",
                          "leveljust": "left",
                          "lvltxt": "\uf0b7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 144
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Symbol",
                                  "default": "default",
                                  "hAnsi": "Symbol"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "4",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 180
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "5",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 216
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "6",
                          "leveljust": "left",
                          "lvltxt": "\uf0b7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 252
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Symbol",
                                  "default": "default",
                                  "hAnsi": "Symbol"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "7",
                          "leveljust": "left",
                          "lvltxt": "o",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 288
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Courier New",
                                  "cs": "Courier New",
                                  "default": "default",
                                  "hAnsi": "Courier New"
                              }
                          },
                          "startval": "1"
                      },
                      {
                          "etp": "lvlinfo",
                          "level": "8",
                          "leveljust": "left",
                          "lvltxt": "\uf0a7",
                          "numfmt": "bullet",
                          "ppr": {
                              "etp": "ppr",
                              "hin": 18,
                              "lin": 324
                          },
                          "rpr": {
                              "etp": "lvlrPr",
                              "rFonts": {
                                  "ascii": "Wingdings",
                                  "default": "default",
                                  "hAnsi": "Wingdings"
                              }
                          },
                          "startval": "1"
                      }
                  ],
                  "etp": "absnuminfo",
                  "multiLevelType": "hybridMultilevel"
              }
          ],
          "etp": "liststyleinfo",
          "num": [
              {
                  "absnumid": "0",
                  "etp": "numid-map",
                  "lvloverride": [],
                  "numId": "1"
              }
          ]
      };
    }

  };

});
