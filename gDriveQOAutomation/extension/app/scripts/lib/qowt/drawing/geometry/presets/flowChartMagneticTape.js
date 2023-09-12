//
// Copyright Quickoffice, Inc, 2005-2010
//
// NOTICE:   The intellectual and technical concepts contained
// herein are proprietary to Quickoffice, Inc. and is protected by
// trade secret and copyright law. Dissemination of any of this
// information or reproduction of this material is strictly forbidden
// unless prior written permission is obtained from Quickoffice, Inc.
//
/**
 * Data for preset shape -- flowChartMagneticTape
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 111,
        'preset': 'flowChartMagneticTape',
        'description': 'Flowchart: Sequential Access Storage',

        "gdLst": [
            {
                "gname": "idx",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","2700000"]
                }
            },
            {
                "gname": "idy",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","2700000"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","idx"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","idx","0"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","idy"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","idy","0"]
                }
            },
            {
                "gname": "ang1",
                "fmla": {
                    "op" : "at2",
                    "args" : ["w","h"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"3cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"0",
                        "swAng":"cd8"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"ib"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"close"
                    }
                ]
            }
        ]
    };

	return data;
});
