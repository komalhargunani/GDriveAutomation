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
 * Data for preset shape -- bracePair
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 117,
        'preset': 'bracePair',
        'description': 'Double Brace',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["8333"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","25000"]
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
                    "op" : "*/",
                    "args" : ["ss","a","50000"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x2"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x1"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","x1"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","x1","0"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","x1"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x1","29289","100000"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x1","it","0"]
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
                "extrusionOk": "false",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"0",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"3cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd2",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"3cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"0",
                        "swAng":"cd4"
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
                            "x":"x2",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"0",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"3cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"cd2",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"3cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"x1",
                        "stAng":"0",
                        "swAng":"cd4"
                    }
                ]
            }
        ]
    };

	return data;
});
