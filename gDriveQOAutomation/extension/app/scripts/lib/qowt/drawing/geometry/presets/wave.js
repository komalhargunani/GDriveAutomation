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
 * Data for preset shape -- wave
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 31,
        'preset': 'wave',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["12500"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["0"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","20000"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["-10000","adj2","10000"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","100000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["y1","10","3"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y1","0","dy2"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y1","dy2","0"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","y1"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y4","0","dy2"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y4","dy2","0"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","a2","100000"]
                }
            },
            {
                "gname": "of2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","a2","50000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "abs",
                    "args" : ["dx1"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "?:",
                    "args" : ["of2","0","of2"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["l","0","dx2"]
                }
            },
            {
                "gname": "dx5",
                "fmla": {
                    "op" : "?:",
                    "args" : ["of2","of2","0"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","dx5"]
                }
            },
            {
                "gname": "dx3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["dx2","x5","3"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2","dx3","0"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x3","x5","2"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["l","dx5","0"]
                }
            },
            {
                "gname": "x10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","dx2","0"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x6","dx3","0"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x7","x10","2"]
                }
            },
            {
                "gname": "x9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x1"]
                }
            },
            {
                "gname": "xAdj",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "xAdj2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx1"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "max",
                    "args" : ["x2","x6"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "min",
                    "args" : ["x5","x10"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","50000"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","it"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"x3",
                                "y":"y2"
                            },
                            {
                                "x":"x4",
                                "y":"y3"
                            },
                            {
                                "x":"x5",
                                "y":"y1"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x10",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"x8",
                                "y":"y6"
                            },
                            {
                                "x":"x7",
                                "y":"y5"
                            },
                            {
                                "x":"x6",
                                "y":"y4"
                            }
                        ]
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
