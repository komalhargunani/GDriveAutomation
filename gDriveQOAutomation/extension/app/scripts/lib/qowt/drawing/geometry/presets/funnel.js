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
 * Data for preset shape -- funnel
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 76,
        'preset': 'funnel',
        'description': 'Funnel',

        "gdLst": [
            {
                "gname": "d",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","1","20"]
                }
            },
            {
                "gname": "rw2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","0","d"]
                }
            },
            {
                "gname": "rh2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hd4","0","d"]
                }
            },
            {
                "gname": "t1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","480000"]
                }
            },
            {
                "gname": "t2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd4","480000"]
                }
            },
            {
                "gname": "da",
                "fmla": {
                    "op" : "at2",
                    "args" : ["t1","t2"]
                }
            },
            {
                "gname": "2da",
                "fmla": {
                    "op" : "*/",
                    "args" : ["da","2","1"]
                }
            },
            {
                "gname": "stAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd2","0","da"]
                }
            },
            {
                "gname": "swAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd2","2da","0"]
                }
            },
            {
                "gname": "swAng3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd2","0","2da"]
                }
            },
            {
                "gname": "rw3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","1","4"]
                }
            },
            {
                "gname": "rh3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd4","1","4"]
                }
            },
            {
                "gname": "ct1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["hd4","stAng1"]
                }
            },
            {
                "gname": "st1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["wd2","stAng1"]
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
                    "args" : ["wd2","hd4","m1"]
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
                    "args" : ["hd4","dy1","0"]
                }
            },
            {
                "gname": "ct3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh3","da"]
                }
            },
            {
                "gname": "st3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw3","da"]
                }
            },
            {
                "gname": "m3",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ct3","st3","0"]
                }
            },
            {
                "gname": "n3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw3","rh3","m3"]
                }
            },
            {
                "gname": "dx3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["n3","da"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["n3","da"]
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
                "gname": "vc3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","rh3"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc3","dy3","0"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","0","rw2"]
                }
            },
            {
                "gname": "cd",
                "fmla": {
                    "op" : "*/",
                    "args" : ["cd2","2","1"]
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
                        "hr":"hd4",
                        "stAng":"stAng1",
                        "swAng":"swAng1"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw3",
                        "hr":"rh3",
                        "stAng":"da",
                        "swAng":"swAng3"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"hd4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw2",
                        "hr":"rh2",
                        "stAng":"cd2",
                        "swAng":"-21600000"
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
