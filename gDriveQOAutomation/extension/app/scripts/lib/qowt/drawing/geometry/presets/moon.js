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
 * Data for preset shape -- moon
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 71,
        'preset': 'moon',
        'description': 'Moon',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","87500"]
                }
            },
            {
                "gname": "g0",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a","100000"]
                }
            },
            {
                "gname": "g0w",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g0","w","ss"]
                }
            },
            {
                "gname": "g1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ss","0","g0"]
                }
            },
            {
                "gname": "g2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g0","g0","g1"]
                }
            },
            {
                "gname": "g3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","ss","g1"]
                }
            },
            {
                "gname": "g4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g3","2","1"]
                }
            },
            {
                "gname": "g5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g4","0","g2"]
                }
            },
            {
                "gname": "g6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g5","0","g0"]
                }
            },
            {
                "gname": "g6w",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g6","w","ss"]
                }
            },
            {
                "gname": "g7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g5","1","2"]
                }
            },
            {
                "gname": "g8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g7","0","g0"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g8","hd2","ss"]
                }
            },
            {
                "gname": "g10h",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy1"]
                }
            },
            {
                "gname": "g11h",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","0"]
                }
            },
            {
                "gname": "g12",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g0","9598","32768"]
                }
            },
            {
                "gname": "g12w",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g12","w","ss"]
                }
            },
            {
                "gname": "g13",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ss","0","g12"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","ss","1"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","g13","1"]
                }
            },
            {
                "gname": "q3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q1","0","q2"]
                }
            },
            {
                "gname": "q4",
                "fmla": {
                    "op" : "sqrt",
                    "args" : ["q3"]
                }
            },
            {
                "gname": "dy4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q4","hd2","ss"]
                }
            },
            {
                "gname": "g15h",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy4"]
                }
            },
            {
                "gname": "g16h",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy4","0"]
                }
            },
            {
                "gname": "g17w",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g6w","0","g0w"]
                }
            },{
                "gname": "q0",
                "fmla": {
                    "op" : "*/",
                    "args" : ["r","12500","100000"]
                }
            },{
                "gname": "gw",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g0","q0","0"]
                }
            },
            {
                "gname": "g18w",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g17w","1","2"]
                }
            },
            {
                "gname": "dx2p",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g0w","g18w","w"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dx2p","-1","1"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","-1","1"]
                }
            },
            {
                "gname": "stAng",
                "fmla": {
                    "op" : "at2",
                    "args" : ["dx2","dy2"]
                }
            },
            {
                "gname": "stAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["stAng","0","5400000"]
                }
            },
            {
                "gname": "enAngp",
                "fmla": {
                    "op" : "at2",
                    "args" : ["dx2","hd2"]
                }
            },
            {
                "gname": "enAngp1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAngp","0","5400000"]
                }
            },
            {
                "gname": "enAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAngp1","0","10800000"]
                }
            },
            {
                "gname": "swAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAng1","0","stAng1"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"r",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"w",
                        "hr":"hd2",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"gw",
                        "hr":"hd2",
                        "stAng":"stAng1",
                        "swAng":"swAng1"
                    }
                    ]
            }
        ]
    };

	return data;
});
