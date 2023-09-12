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
 * Data for preset shape -- curvedConnector5
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 70,
        'preset': 'curvedConnector5',
        'description': '', //TODO Find out name

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
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "x3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","adj1","100000"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","adj3","100000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x3","x6","2"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["l","x3","2"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x3","x1","2"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x6","x1","2"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+/",
                    "args" : ["x6","r","2"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","adj2","100000"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["t","y4","2"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["t","y1","2"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y1","y4","2"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+/",
                    "args" : ["b","y4","2"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y5","y4","2"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y5","b","2"]
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
                                "x":"x2",
                                "y":"t"
                            },
                            {
                                "x":"x3",
                                "y":"y2"
                            },
                            {
                                "x":"x3",
                                "y":"y1"
                            }
                        ]
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"x3",
                                "y":"y3"
                            },
                            {
                                "x":"x4",
                                "y":"y4"
                            },
                            {
                                "x":"x1",
                                "y":"y4"
                            }
                        ]
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"x5",
                                "y":"y4"
                            },
                            {
                                "x":"x6",
                                "y":"y6"
                            },
                            {
                                "x":"x6",
                                "y":"y5"
                            }
                        ]
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"x6",
                                "y":"y7"
                            },
                            {
                                "x":"x7",
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
