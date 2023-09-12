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
 * Data for preset shape -- downArrow
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 44,
        'preset': 'downArrow',
        'description': 'Down Arrow',

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
                "gname": "maxAdj2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["100000","h","ss"]
                }
            },
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","100000"]
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
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
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
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","a1","200000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx1"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x1","dy1","wd2"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y1","dy2","0"]
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
                            "y":"y1"
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
                            "x":"x2",
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
                            "x":"hc",
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
