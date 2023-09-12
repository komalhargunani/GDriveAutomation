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
 * Data for preset shape -- mathMultiply
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 37,
        'preset': 'mathMultiply',
        'description': 'Multiply',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["23520"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","51965"]
                }
            },
            {
                "gname": "th",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","100000"]
                }
            },
            {
                "gname": "a",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["w","h"]
                }
            },
            {
                "gname": "sa",
                "fmla": {
                    "op" : "sin",
                    "args" : ["1","a"]
                }
            },
            {
                "gname": "ca",
                "fmla": {
                    "op" : "cos",
                    "args" : ["1","a"]
                }
            },
            {
                "gname": "ta",
                "fmla": {
                    "op" : "tan",
                    "args" : ["1","a"]
                }
            },
            {
                "gname": "dl",
                "fmla": {
                    "op" : "mod",
                    "args" : ["w","h","0"]
                }
            },
            {
                "gname": "rw",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dl","51965","100000"]
                }
            },
            {
                "gname": "lM",
                "fmla": {
                    "op" : "+-",
                    "args" : ["dl","0","rw"]
                }
            },
            {
                "gname": "xM",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ca","lM","2"]
                }
            },
            {
                "gname": "yM",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sa","lM","2"]
                }
            },
            {
                "gname": "dxAM",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sa","th","2"]
                }
            },
            {
                "gname": "dyAM",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ca","th","2"]
                }
            },
            {
                "gname": "xA",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xM","0","dxAM"]
                }
            },
            {
                "gname": "yA",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yM","dyAM","0"]
                }
            },
            {
                "gname": "xB",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xM","dxAM","0"]
                }
            },
            {
                "gname": "yB",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yM","0","dyAM"]
                }
            },
            {
                "gname": "xBC",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","xB"]
                }
            },
            {
                "gname": "yBC",
                "fmla": {
                    "op" : "*/",
                    "args" : ["xBC","ta","1"]
                }
            },
            {
                "gname": "yC",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yBC","yB","0"]
                }
            },
            {
                "gname": "xD",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","xB"]
                }
            },
            {
                "gname": "xE",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","xA"]
                }
            },
            {
                "gname": "yFE",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","yA"]
                }
            },
            {
                "gname": "xFE",
                "fmla": {
                    "op" : "*/",
                    "args" : ["yFE","1","ta"]
                }
            },
            {
                "gname": "xF",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xE","0","xFE"]
                }
            },
            {
                "gname": "xL",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA","xFE","0"]
                }
            },
            {
                "gname": "yG",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","yA"]
                }
            },
            {
                "gname": "yH",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","yB"]
                }
            },
            {
                "gname": "yI",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","yC"]
                }
            },
            {
                "gname": "xC2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","xM"]
                }
            },
            {
                "gname": "yC3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","yM"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"xA",
                            "y":"yA"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB",
                            "y":"yB"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"yC"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD",
                            "y":"yB"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xE",
                            "y":"yA"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xF",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xE",
                            "y":"yG"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD",
                            "y":"yH"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"yI"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB",
                            "y":"yH"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xA",
                            "y":"yG"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xL",
                            "y":"vc"
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
