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
 * Data for preset shape -- snipRoundRect
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 112,
        'preset': 'snipRoundRect',
        'description': 'Snip and Round Single Corner Rectangle',

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
                    "args" : ["16667"]
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
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","dx2"]
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
                    "op" : "+/",
                    "args" : ["x2","r","2"]
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"dx2"
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
