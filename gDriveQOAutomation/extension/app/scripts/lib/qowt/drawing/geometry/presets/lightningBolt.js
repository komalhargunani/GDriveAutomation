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
 * Data for preset shape -- lightningBolt
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 55,
        'preset': 'lightningBolt',
        'description': 'Lightning Bolt',

        "gdLst": [
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","5022","21600"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","8472","21600"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","8757","21600"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","10012","21600"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","12860","21600"]
                }
            },
            {
                "gname": "x9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","13917","21600"]
                }
            },
            {
                "gname": "x11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","16577","21600"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","3890","21600"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","6080","21600"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","7437","21600"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","9705","21600"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","12007","21600"]
                }
            },
            {
                "gname": "y10",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","14277","21600"]
                }
            },
            {
                "gname": "y11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","14915","21600"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "21600",
                "w": "21600",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"8472",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"12860",
                            "y":"6080"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"11050",
                            "y":"6797"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"16577",
                            "y":"12007"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"14767",
                            "y":"12877"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"21600",
                            "y":"21600"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"10012",
                            "y":"14915"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"12222",
                            "y":"13987"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"5022",
                            "y":"9705"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"7602",
                            "y":"8382"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"0",
                            "y":"3890"
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
