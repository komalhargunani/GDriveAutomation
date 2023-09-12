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
 * Data for preset shape -- blockArc
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 104,
        'preset': 'blockArc',
        'description': 'Block Arc',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["10800000"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["0"]
                }
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
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
                "gname": "istAng",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","21599999"]
                }
            },
            {
                "gname": "a3",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj3","50000"]
                }
            },
            {
                "gname": "sw11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["istAng","0","stAng"]
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
                "gname": "iswAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","0","swAng"]
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
                "gname": "wt3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["wd2","istAng"]
                }
            },
            {
                "gname": "ht3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["hd2","istAng"]
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
                "gname": "dx3",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["wd2","ht3","wt3"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["hd2","ht3","wt3"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","dx1","hc"]
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
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx3","0"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy3","0"]
                }
            },
            {
                "gname": "dr",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a3","100000"]
                }
            },
            {
                "gname": "iwd2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","0","dr"]
                }
            },
            {
                "gname": "ihd2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hd2","0","dr"]
                }
            },
            {
                "gname": "wt2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["iwd2","istAng"]
                }
            },
            {
                "gname": "ht2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["ihd2","istAng"]
                }
            },
            {
                "gname": "wt4",
                "fmla": {
                    "op" : "sin",
                    "args" : ["iwd2","stAng"]
                }
            },
            {
                "gname": "ht4",
                "fmla": {
                    "op" : "cos",
                    "args" : ["ihd2","stAng"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["iwd2","ht2","wt2"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["ihd2","ht2","wt2"]
                }
            },
            {
                "gname": "dx4",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["iwd2","ht4","wt4"]
                }
            },
            {
                "gname": "dy4",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["ihd2","ht4","wt4"]
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
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx4","0"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy4","0"]
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
                "gname": "g2",
                "fmla": {
                    "op" : "max",
                    "args" : ["x3","x4"]
                }
            },
            {
                "gname": "g3",
                "fmla": {
                    "op" : "max",
                    "args" : ["g1","g2"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da1","r","g3"]
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
                "gname": "g6",
                "fmla": {
                    "op" : "max",
                    "args" : ["y3","y4"]
                }
            },
            {
                "gname": "g7",
                "fmla": {
                    "op" : "max",
                    "args" : ["g5","g6"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da2","b","g7"]
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
                "gname": "g10",
                "fmla": {
                    "op" : "min",
                    "args" : ["x3","x4"]
                }
            },
            {
                "gname": "g11",
                "fmla": {
                    "op" : "min",
                    "args" : ["g9","g10"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da3","l","g11"]
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
                "gname": "g14",
                "fmla": {
                    "op" : "min",
                    "args" : ["y3","y4"]
                }
            },
            {
                "gname": "g15",
                "fmla": {
                    "op" : "min",
                    "args" : ["g13","g14"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "?:",
                    "args" : ["da4","t","g15"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x1","x4","2"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y1","y4","2"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x3","x2","2"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y3","y2","2"]
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
                    "args" : ["istAng","cd4","0"]
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"iwd2",
                        "hr":"ihd2",
                        "stAng":"istAng",
                        "swAng":"iswAng"
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
