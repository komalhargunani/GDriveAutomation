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
 * Data for preset shape -- hexagon
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 96,
        'preset': 'hexagon',
        'description': 'Hexagon',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
                }
            },
            {
                "gname": "vf",
                "fmla": {
                    "op" : "val",
                    "args" : ["115470"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "maxAdj",
                "fmla": {
                    "op" : "*/",
                    "args" : ["50000","w","ss"]
                }
            },
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","maxAdj"]
                }
            },
            {
                "gname": "shd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","vf","100000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a","100000"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x1"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["shd2","3600000"]
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
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","0"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["maxAdj","-1","2"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["a","q1","0"]
                }
            },
            {
                "gname": "q3",
                "fmla": {
                    "op" : "?:",
                    "args" : ["q2","4","2"]
                }
            },
            {
                "gname": "q4",
                "fmla": {
                    "op" : "?:",
                    "args" : ["q2","3","2"]
                }
            },
            {
                "gname": "q5",
                "fmla": {
                    "op" : "?:",
                    "args" : ["q2","q1","0"]
                }
            },
            {
                "gname": "q6",
                "fmla": {
                    "op" : "+/",
                    "args" : ["a","q5","q1"]
                }
            },
            {
                "gname": "q7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q6","q4","-1"]
                }
            },
            {
                "gname": "q8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q3","q7","0"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","q8","24"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","q8","24"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","il"]
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
                            "x":"l",
                            "y":"vc"
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y2"
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
