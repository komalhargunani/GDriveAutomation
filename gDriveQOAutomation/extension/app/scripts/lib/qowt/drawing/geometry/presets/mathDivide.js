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
 * Data for preset shape -- mathDivide
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 121,
        'preset': 'mathDivide',
        'description': 'Divide',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["23520"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["5880"]
                }
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["11760"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["1000","adj1","36745"]
                }
            },
            {
                "gname": "ma1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","0","a1"]
                }
            },
            {
                "gname": "ma3h",
                "fmla": {
                    "op" : "+/",
                    "args" : ["73490","ma1","4"]
                }
            },
            {
                "gname": "ma3w",
                "fmla": {
                    "op" : "*/",
                    "args" : ["36745","w","h"]
                }
            },
            {
                "gname": "maxAdj3",
                "fmla": {
                    "op" : "min",
                    "args" : ["ma3h","ma3w"]
                }
            },
            {
                "gname": "a3",
                "fmla": {
                    "op" : "pin",
                    "args" : ["1000","adj3","maxAdj3"]
                }
            },
            {
                "gname": "m4a3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["-4","a3","1"]
                }
            },
            {
                "gname": "maxAdj2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["73490","m4a3","a1"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","maxAdj2"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","200000"]
                }
            },
            {
                "gname": "yg",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a2","100000"]
                }
            },
            {
                "gname": "rad",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a3","100000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","73490","200000"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy1"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","0"]
                }
            },
            {
                "gname": "a",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yg","rad","0"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y3","0","a"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y2","0","rad"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","y1"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx1"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","rad"]
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
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rad",
                        "hr":"rad",
                        "stAng":"3cd4",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rad",
                        "hr":"rad",
                        "stAng":"cd4",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x1",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y4"
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
