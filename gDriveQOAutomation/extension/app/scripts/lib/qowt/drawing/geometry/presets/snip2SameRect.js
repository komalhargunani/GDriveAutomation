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
 * Data for preset shape -- snip2SameRect
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 102,
        'preset': 'snip2SameRect',
        'description': 'Snip Same Side Corner Rectangle',

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
                "gname": "dx",
                "fmla": {
                    "op" : "?:",
                    "args" : ["d","tx1","bx1"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dx","1","2"]
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
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["tx1","1","2"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "+/",
                    "args" : ["by1","b","2"]
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"tx1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"by1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"bx2",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"bx1",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"by1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"tx1"
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
