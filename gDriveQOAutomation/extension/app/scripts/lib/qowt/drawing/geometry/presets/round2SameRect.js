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
 * Data for preset shape -- round2SameRect
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 103,
        'preset': 'round2SameRect',
        'description': 'Round Same Side Corner Rectangle',

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
                "gname": "tx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","100000"]
                }
            },
            {
                "gname": "tx2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","tx1"]
                }
            },
            {
                "gname": "bx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "bx2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","bx1"]
                }
            },
            {
                "gname": "by1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","bx1"]
                }
            },
            {
                "gname": "d",
                "fmla": {
                    "op" : "+-",
                    "args" : ["tx1","0","bx1"]
                }
            },
            {
                "gname": "tdx",
                "fmla": {
                    "op" : "*/",
                    "args" : ["tx1","29289","100000"]
                }
            },
            {
                "gname": "bdx",
                "fmla": {
                    "op" : "*/",
                    "args" : ["bx1","29289","100000"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "?:",
                    "args" : ["d","tdx","bdx"]
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
                    "args" : ["b","0","bdx"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"tx1",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"tx2",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"tx1",
                        "hr":"tx1",
                        "stAng":"3cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"by1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"bx1",
                        "hr":"bx1",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"bx1",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"bx1",
                        "hr":"bx1",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"tx1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"tx1",
                        "hr":"tx1",
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
