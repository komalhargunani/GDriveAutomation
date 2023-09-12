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
 * Data for preset shape -- corner
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 9,
        'preset': 'corner',
        'description': 'L-Shape',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "maxAdj1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["100000","h","ss"]
                }
            },
            {
                "gname": "maxAdj2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["100000","w","ss"]
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
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","maxAdj2"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","100000"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","dy1"]
                }
            },
            {
                "gname": "cx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x1","1","2"]
                }
            },
            {
                "gname": "cy1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y1","b","2"]
                }
            },
            {
                "gname": "d",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","h"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "?:",
                    "args" : ["d","y1","t"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "?:",
                    "args" : ["d","r","x1"]
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
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
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
