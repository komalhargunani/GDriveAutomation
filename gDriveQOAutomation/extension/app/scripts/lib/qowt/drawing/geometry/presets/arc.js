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
 * Data for preset shape -- arc
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 58,
        'preset': 'arc',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["16200000"]
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
                "gname": "sw11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAng","0","stAng"]
                }
            },
            {
                "gname": "sw12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["sw11","21600000","0"]
                }
            },
            {
                "gname": "swAng",
                "fmla": {
                    "op" : "?:",
                    "args" : ["sw11","sw11","sw12"]
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
                "gname": "sw0",
                "fmla": {
                    "op" : "+-",
                    "args" : ["21600000","0","stAng"]
                }
            },
            {
                "gname": "da1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng","0","sw0"]
                }
            },
            {
                "gname": "g1",
                "fmla": {
                    "op" : "max",
                    "args" : ["x1","x2"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da1","r","g1"]
                }
            },
            {
                "gname": "sw1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd4","0","stAng"]
                }
            },
            {
                "gname": "sw2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["27000000","0","stAng"]
                }
            },
            {
                "gname": "sw3",
                "fmla": {
                    "op" : "?:",
                    "args" : ["sw1","sw1","sw2"]
                }
            },
            {
                "gname": "da2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng","0","sw3"]
                }
            },
            {
                "gname": "g5",
                "fmla": {
                    "op" : "max",
                    "args" : ["y1","y2"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da2","b","g5"]
                }
            },
            {
                "gname": "sw4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd2","0","stAng"]
                }
            },
            {
                "gname": "sw5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["32400000","0","stAng"]
                }
            },
            {
                "gname": "sw6",
                "fmla": {
                    "op" : "?:",
                    "args" : ["sw4","sw4","sw5"]
                }
            },
            {
                "gname": "da3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng","0","sw6"]
                }
            },
            {
                "gname": "g9",
                "fmla": {
                    "op" : "min",
                    "args" : ["x1","x2"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da3","l","g9"]
                }
            },
            {
                "gname": "sw7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["3cd4","0","stAng"]
                }
            },
            {
                "gname": "sw8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["37800000","0","stAng"]
                }
            },
            {
                "gname": "sw9",
                "fmla": {
                    "op" : "?:",
                    "args" : ["sw7","sw7","sw8"]
                }
            },
            {
                "gname": "da4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng","0","sw9"]
                }
            },
            {
                "gname": "g13",
                "fmla": {
                    "op" : "min",
                    "args" : ["y1","y2"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da4","t","g13"]
                }
            },
            {
                "gname": "cang1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["stAng","0","cd4"]
                }
            },
            {
                "gname": "cang2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAng","cd4","0"]
                }
            },
            {
                "gname": "cang3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["cang1","cang2","2"]
                }
            }
        ],
        "pathLst":[
            {
                "extrusionOk": "false",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"vc"
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "fill": "none",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"stAng",
                        "swAng":"swAng"
                    }
                ]
            }
        ]
    };

	return data;
});
