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
 * Data for preset shape -- round2DiagRect
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 38,
        'preset': 'round2DiagRect',
        'description': 'Round Diagonal Corner Rectangle',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["16667"]
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
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","50000"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","50000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","100000"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","x1"]
                }
            },
            {
                "gname": "a",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","a"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","a"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x1","29289","100000"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a","29289","100000"]
                }
            },
            {
                "gname": "d",
                "fmla": {
                    "op" : "+-",
                    "args" : ["dx1","0","dx2"]
                }
            },
            {
                "gname": "dx",
                "fmla": {
                    "op" : "?:",
                    "args" : ["d","dx1","dx2"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","dx"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","dx"]
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
                            "y":"t"
                        }
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
                        "wr":"a",
                        "hr":"a",
                        "stAng":"3cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"y1"
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
                            "x":"a",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"a",
                        "hr":"a",
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
                        "pathType":"close"
                    }
                ]
            }
        ]
    };

	return data;
});
