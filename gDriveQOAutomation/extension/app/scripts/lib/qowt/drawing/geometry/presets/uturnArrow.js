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
 * Data for preset shape -- uturnArrow
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 169,
        'preset': 'uturnArrow',
        'description': 'U-Turn Arrow',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
                }
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
                }
            },
            {
                "gname": "adj4",
                "fmla": {
                    "op" : "val",
                    "args" : ["43750"]
                }
            },
            {
                "gname": "adj5",
                "fmla": {
                    "op" : "val",
                    "args" : ["75000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","25000"]
                }
            },
            {
                "gname": "maxAdj1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a2","2","1"]
                }
            },
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","maxAdj1"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a1","ss","h"]
                }
            },
            {
                "gname": "q3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","q2"]
                }
            },
            {
                "gname": "maxAdj3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q3","h","ss"]
                }
            },
            {
                "gname": "a3",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj3","maxAdj3"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["a3","a1","0"]
                }
            },
            {
                "gname": "minAdj5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q1","ss","h"]
                }
            },
            {
                "gname": "a5",
                "fmla": {
                    "op" : "pin",
                    "args" : ["minAdj5","adj5","100000"]
                }
            },
            {
                "gname": "th",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","100000"]
                }
            },
            {
                "gname": "aw2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "th2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["th","1","2"]
                }
            },
            {
                "gname": "dh2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["aw2","0","th2"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a5","100000"]
                }
            },
            {
                "gname": "ah",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a3","100000"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y5","0","ah"]
                }
            },
            {
                "gname": "x9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","dh2"]
                }
            },
            {
                "gname": "bw",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x9","1","2"]
                }
            },
            {
                "gname": "bs",
                "fmla": {
                    "op" : "min",
                    "args" : ["bw","y4"]
                }
            },
            {
                "gname": "maxAdj4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["bs","100000","ss"]
                }
            },
            {
                "gname": "a4",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj4","maxAdj4"]
                }
            },
            {
                "gname": "bd",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a4","100000"]
                }
            },
            {
                "gname": "bd3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bd","0","th"]
                }
            },
            {
                "gname": "bd2",
                "fmla": {
                    "op" : "max",
                    "args" : ["bd3","0"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["th","bd2","0"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","aw2"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x8","0","aw2"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x6","dh2","0"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x9","0","bd"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","0","bd2"]
                }
            },
            {
                "gname": "cx",
                "fmla": {
                    "op" : "+/",
                    "args" : ["th","x7","2"]
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
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"bd"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"bd",
                        "hr":"bd",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"bd",
                        "hr":"bd",
                        "stAng":"3cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x9",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"x3"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"bd2",
                        "hr":"bd2",
                        "stAng":"0",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"th"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"bd2",
                        "hr":"bd2",
                        "stAng":"3cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"th",
                            "y":"b"
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
