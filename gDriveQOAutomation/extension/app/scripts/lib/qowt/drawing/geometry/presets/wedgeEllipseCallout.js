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
 * Data for preset shape -- wedgeEllipseCallout
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 127,
        'preset': 'wedgeEllipseCallout',
        'description': 'Oval Callout',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["-20833"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["62500"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "dxPos",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","adj1","100000"]
                }
            },
            {
                "gname": "dyPos",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","adj2","100000"]
                }
            },
            {
                "gname": "xPos",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxPos","0"]
                }
            },
            {
                "gname": "yPos",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyPos","0"]
                }
            },
            {
                "gname": "sdx",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dxPos","h","1"]
                }
            },
            {
                "gname": "sdy",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dyPos","w","1"]
                }
            },
            {
                "gname": "pang",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["sdx","sdy"]
                }
            },
            {
                "gname": "stAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["pang","660000","0"]
                }
            },
            {
                "gname": "enAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["pang","0","660000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","stAng"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","stAng"]
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
                "gname": "dx2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","enAng"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","enAng"]
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
                "gname": "stAng1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["dx1","dy1"]
                }
            },
            {
                "gname": "enAng1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["dx2","dy2"]
                }
            },
            {
                "gname": "swAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAng1","0","stAng1"]
                }
            },
            {
                "gname": "swAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng1","21600000","0"]
                }
            },
            {
                "gname": "swAng",
                "fmla": {
                    "op" : "?:",
                    "args" : ["swAng1","swAng1","swAng2"]
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
                            "x":"xPos",
                            "y":"yPos"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"stAng1",
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
