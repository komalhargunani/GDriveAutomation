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

  /**
   * POINT fixture for SHAPE
   * @constructor
   */
  var _api = {
    'spPr': {
      'id': '111',
      'xfrm': {
        'id': '222',
        'off': {
          'x': '1600200',
          'y': '457200'
        },
        'ext': {
          'cx': '5410200',
          'cy': '1066800'
        }
      },
      'fill': {
        'clr': 'F79F77'
      },
      'ln': {
        'id': '333',
        'fill': {
          'clr': 'F61A2A'
        },
        'w': '25400'
      }
    },
    //Fixture for text run properties
    'rpr': {
      'font': 'Times New Roman',   //font name
      'sz': '44',              //font size
      'bld': true,                  // bold
      'itl': true,                 // italics
      'udl': true,                 // right now boolean, it is more
      // complex in nature, avoid it now
      'cap': 'small',              // either small or all
      'outershadoweffect': {        //text-shadow
        'clr': '#FFFFFF',
        'alpha': 1
      },
      'strike': 'single'
    },
    'txBody': {
      'id': 'txBodyId',
      'bodyPr': {
        'wrap': 'square',
        'lIns': '914400',
        'tIns': '914400',
        'rIns': '914400',
        'bIns': '914400'
      },
      'p': [
        {
          'ppr': {
            'leftMargin': 914400,
            'rightMargin': 0,
            'indent': -914400,
            'jus': 'L',
            'lnSpc': '100%',
            'spcAft': '0',
            'spcBef': '0',
            'bullet': {
              'type': 'buNone',
              'char': undefined, // optional
              'autotype': undefined, // optional
              'idx': undefined, // optional
              'clr': undefined, // optional
              'font': undefined, // optional
              'sz': undefined, // optional
              'startAt': undefined
            },
            'level': '0'
          },
          'rs': [],
          'endParaRPr': {}
        },
        {
          'ppr': {
            'leftMargin': 1828800,
            'rightMargin': 0,
            'indent': -1828800,
            'jus': 'L',
            'lnSpc': '100%',
            'spcAft': '0',
            'spcBef': '0',
            'bullet': {
              'type': 'buNone',
              'char': undefined, // optional
              'autotype': undefined, // optional
              'idx': undefined, // optional
              'clr': undefined, // optional
              'font': undefined, // optional
              'sz': undefined, // optional
              'startAt': undefined
            },
            'level': '0'
          },
          'rs': [
            {
              'rpr': {
                'font': 'Times New Roman',
                'sz': '18',
                'bld': false,
                'itl': false,
                'udl': false,
                'cap': 'none',
                'fill': {
                  'clr': 'F61A2A'
                }
              },
              'data': 'sample text 1'
            },
            {
              'rpr': {
                'font': 'Times New Roman',
                'sz': '18',
                'bld': false,
                'itl': false,
                'udl': false,
                'cap': 'none',
                'fill': {
                  'clr': 'F61A2A'
                }
              },
              'data': 'sample text 2'
            }
          ],
          'endParaRPr': {
            'font': 'Times New Roman',
            'sz': '18',
            'bld': false,
            'itl': false,
            'udl': false,
            'cap': 'none',
            'fill': {
              'clr': 'F61A2A'
            }
          }
        },
        {
          'ppr': {
            'leftMargin': 1828800,
            'rightMargin': 0,
            'indent': -1828800,
            'jus': 'L',
            'lnSpc': '100%',
            'spcAft': '0',
            'spcBef': '0',
            'bullet': {
              'type': 'buNone',
              'char': undefined, // optional
              'autotype': undefined, // optional
              'idx': undefined, // optional
              'clr': undefined, // optional
              'font': undefined, // optional
              'sz': undefined, // optional
              'startAt': undefined
            },
            'level': '0'
          },
          'rs': [
            {
              'rpr': {
                'font': 'Times New Roman',
                'sz': '18',
                'bld': false,
                'itl': false,
                'udl': false,
                'cap': 'none',
                'fill': {
                  'clr': 'F61A2A'
                }
              },
              'data': 'sample text 3'
            },
            {
              'rpr': {
                'font': 'Times New Roman',
                'sz': '18',
                'bld': false,
                'itl': false,
                'udl': false,
                'cap': 'none',
                'fill': {
                  'clr': 'F61A2A'
                }
              },
              'data': 'sample text 4'
            }
          ],
          'endParaRPr': {
            'font': 'Times New Roman',
            'sz': '18',
            'bld': false,
            'itl': false,
            'udl': false,
            'cap': 'none',
            'fill': {
              'clr': 'F61A2A'
            }
          }
        }
      ]
    }
  };

  return _api;

});
