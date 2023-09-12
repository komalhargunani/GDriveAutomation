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
 * Data for preset shape -- teardrop
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 72,
        'preset': 'teardrop',
        'description': 'Teardrop',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["100000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","200000"]
                }
            },
            {
                "gname": "r2",
                "fmla": {
                    "op" : "sqrt",
                    "args" : ["2"]
                }
            },
            {
                "gname": "tw",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","r2","1"]
                }
            },
            {
                "gname": "th",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","r2","1"]
                }
            },
            {
                "gname": "sw",
                "fmla": {
                    "op" : "*/",
                    "args" : ["tw","a","100000"]
                }
            },
            {
                "gname": "sh",
                "fmla": {
                    "op" : "*/",
                    "args" : ["th","a","100000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["sw","2700000"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["sh","2700000"]
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
                    "args" : ["vc","0","dy1"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["hc","x1","2"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["vc","y1","2"]
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
                            "x":"l",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"x2",
                                "y":"t"
                            },
                            {
                                "x":"x1",
                                "y":"y1"
                            }
                        ]
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"r",
                                "y":"y2"
                            },
                            {
                                "x":"r",
                                "y":"vc"
                            }
                        ]
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"cd4",
                        "swAng":"cd4"
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
