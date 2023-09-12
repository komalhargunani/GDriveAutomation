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
 * Data for preset shape -- diagStripe
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 93,
        'preset': 'diagStripe',
        'description': 'Diagonal Stripe',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","100000"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","a","100000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x2","1","2"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x2","r","2"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a","100000"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["y2","1","2"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y2","b","2"]
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
                            "y":"y2"
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
                            "y":"t"
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
