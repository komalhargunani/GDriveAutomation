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
 * Data for preset shape -- curvedConnector3
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 68,
        'preset': 'curvedConnector3',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "x2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","adj1","100000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["l","x2","2"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["r","x2","2"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","3","4"]
                }
            }
        ],
        "pathLst":[
            {
                "fill": "none",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"x1",
                                "y":"t"
                            },
                            {
                                "x":"x2",
                                "y":"hd4"
                            },
                            {
                                "x":"x2",
                                "y":"vc"
                            }
                        ]
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"x2",
                                "y":"y3"
                            },
                            {
                                "x":"x3",
                                "y":"b"
                            },
                            {
                                "x":"r",
                                "y":"b"
                            }
                        ]
                    }
                ]
            }
        ]
    };

	return data;
});
