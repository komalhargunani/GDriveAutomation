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
 * Data for preset shape -- bracketPair
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 126,
        'preset': 'bracketPair',
        'description': 'Double Bracket',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["16667"]
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
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","x1"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x1","29289","100000"]
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
                    "args" : ["b","0","il"]
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
                            "x":"l",
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
                            "x":"x2",
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
                            "x":"r",
                            "y":"y2"
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
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
                            "x":"x1",
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
                            "x":"l",
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
                            "x":"x2",
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
                            "x":"r",
                            "y":"y2"
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
