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
 * Data for preset shape -- bentArrow
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 8,
        'preset': 'bentArrow',
        'description': 'Bent Arrow',

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
            }
        ],
        "gdLst": [
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","50000"]
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
                "gname": "a3",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj3","50000"]
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
                "gname": "ah",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a3","100000"]
                }
            },
            {
                "gname": "bw",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","ah"]
                }
            },
            {
                "gname": "bh",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","dh2"]
                }
            },
            {
                "gname": "bs",
                "fmla": {
                    "op" : "min",
                    "args" : ["bw","bh"]
                }
            },
            {
                "gname": "maxAdj4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["100000","bs","ss"]
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
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","ah"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["dh2","th","0"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y3","dh2","0"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["dh2","bd","0"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y3","bd2","0"]
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
                            "y":"y5"
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
                            "y":"dh2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"aw2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
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
