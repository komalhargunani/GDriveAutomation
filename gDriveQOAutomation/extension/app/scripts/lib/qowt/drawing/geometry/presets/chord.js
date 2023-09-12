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
 * Data for preset shape -- chord
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 1,
        'preset': 'chord',
        'description': 'Chord',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["2700000"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["16200000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "stAng",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","21599999"]
                }
            },
            {
                "gname": "enAng",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","21599999"]
                }
            },
            {
                "gname": "sw1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAng","0","stAng"]
                }
            },
            {
                "gname": "sw2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["sw1","21600000","0"]
                }
            },
            {
                "gname": "swAng",
                "fmla": {
                    "op" : "?:",
                    "args" : ["sw1","sw1","sw2"]
                }
            },
            {
                "gname": "wt1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["wd2","stAng"]
                }
            },
            {
                "gname": "ht1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["hd2","stAng"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["wd2","ht1","wt1"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["hd2","ht1","wt1"]
                }
            },
            {
                "gname": "wt2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["wd2","enAng"]
                }
            },
            {
                "gname": "ht2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["hd2","enAng"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["wd2","ht2","wt2"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["hd2","ht2","wt2"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","0"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy2","0"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x1","x2","2"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y1","y2","2"]
                }
            },
            {
                "gname": "midAng0",
                "fmla": {
                    "op" : "*/",
                    "args" : ["swAng","1","2"]
                }
            },
            {
                "gname": "midAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["stAng","midAng0","cd2"]
                }
            },
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
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x1",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"stAng",
                        "swAng":"swAng"
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
