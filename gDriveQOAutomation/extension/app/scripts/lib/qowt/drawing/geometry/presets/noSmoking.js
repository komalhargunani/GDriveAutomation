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
 * Data for preset shape -- noSmoking
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 160,
        'preset': 'noSmoking',
        'description': '"No" Symbol',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["18750"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","50000"]
                }
            },
            {
                "gname": "dr",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a","100000"]
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
                "gname": "ang",
                "fmla": {
                    "op" : "at2",
                    "args" : ["w","h"]
                }
            },
            {
                "gname": "ct",
                "fmla": {
                    "op" : "cos",
                    "args" : ["ihd2","ang"]
                }
            },
            {
                "gname": "st",
                "fmla": {
                    "op" : "sin",
                    "args" : ["iwd2","ang"]
                }
            },
            {
                "gname": "m",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ct","st","0"]
                }
            },
            {
                "gname": "n",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","ihd2","m"]
                }
            },
            {
                "gname": "drd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dr","1","2"]
                }
            },
            {
                "gname": "dang",
                "fmla": {
                    "op" : "at2",
                    "args" : ["n","drd2"]
                }
            },
            {
                // this guide name was 2dang, but is changed for processing the
                // values.
                "gname": "dangx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dang","4","1"]
                }
            },
            {
                "gname": "ang2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["18750","0","a"]
                }
            },
            {
                "gname": "q0",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ang2","2700000","18750"]
                }
            },
            {
                "gname": "swAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["-8100000","dangx2","q0"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ang2","800000","18750"]
                }
            },
            {
                "gname": "t1",
                "fmla": {
                    "op" : "at2",
                    "args" : ["w","h"]
                }
            },
            {
                "gname": "t2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t1","1500000","0"]
                }
            },
            {
                "gname": "t3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t2","q1", "0"]
                }
            },
            {
                "gname": "stAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t3","dang","0"]
                }
            },
            {
                "gname": "stAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["stAng1","0","cd2"]
                }
            },
            {
                "gname": "ct1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["ihd2","stAng1"]
                }
            },
            {
                "gname": "st1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["iwd2","stAng1"]
                }
            },
            {
                "gname": "m1",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ct1","st1","0"]
                }
            },
            {
                "gname": "n1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","ihd2","m1"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["n1","stAng1"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["n1","stAng1"]
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
                    "args" : ["hc","0","dx1"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy1"]
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
        //following are externally modified paths, its not as per microsoft
        // defined paths.
        //noSmoking is not rendered as per microsoft defined paths so modified /
        // added more paths to render properly.
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
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x1",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"iwd2",
                        "hr":"ihd2",
                        "stAng":"stAng1",
                        "swAng":"swAng"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"iwd2",
                        "hr":"ihd2",
                        "stAng":"stAng2",
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
