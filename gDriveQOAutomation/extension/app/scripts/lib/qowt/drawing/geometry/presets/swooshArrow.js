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
 * Data for preset shape -- swooshArrow
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 81,
        'preset': 'swooshArrow',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
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
                    "args" : ["1","adj1","75000"]
                }
            },
            {
                "gname": "maxAdj2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["70000","w","ss"]
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
                "gname": "ad1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","100000"]
                }
            },
            {
                "gname": "ad2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "xB",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","ad2"]
                }
            },
            {
                "gname": "yB",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t","ssd8","0"]
                }
            },
            {
                "gname": "alfa",
                "fmla": {
                    "op" : "*/",
                    "args" : ["cd4","1","14"]
                }
            },
            {
                "gname": "dx0",
                "fmla": {
                    "op" : "tan",
                    "args" : ["ssd8","alfa"]
                }
            },
            {
                "gname": "xC",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xB","0","dx0"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "tan",
                    "args" : ["ad1","alfa"]
                }
            },
            {
                "gname": "yF",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yB","ad1","0"]
                }
            },
            {
                "gname": "xF",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xB","dx1","0"]
                }
            },
            {
                "gname": "xE",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xF","dx0","0"]
                }
            },
            {
                "gname": "yE",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF","ssd8","0"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yE","0","t"]
                }
            },
            {
                "gname": "dy22",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dy2","1","2"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","1","20"]
                }
            },
            {
                "gname": "yD",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t","dy22","dy3"]
                }
            },
            {
                "gname": "dy4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd6","1","1"]
                }
            },
            {
                "gname": "yP1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hd6","dy4","0"]
                }
            },
            {
                "gname": "xP1",
                "fmla": {
                    "op" : "val",
                    "args" : ["wd6"]
                }
            },
            {
                "gname": "dy5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd6","1","2"]
                }
            },
            {
                "gname": "yP2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF","dy5","0"]
                }
            },
            {
                "gname": "xP2",
                "fmla": {
                    "op" : "val",
                    "args" : ["wd4"]
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
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"xP1",
                                "y":"yP1"
                            },
                            {
                                "x":"xB",
                                "y":"yB"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"yD"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xE",
                            "y":"yE"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xF",
                            "y":"yF"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"xP2",
                                "y":"yP2"
                            },
                            {
                                "x":"l",
                                "y":"b"
                            }
                        ]
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
