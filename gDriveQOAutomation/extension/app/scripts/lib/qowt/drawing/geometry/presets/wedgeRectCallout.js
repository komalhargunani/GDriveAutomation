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
 * Data for preset shape -- wedgeRectCallout
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 167,
        'preset': 'wedgeRectCallout',
        'description': 'Rectangular Callout',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["-20833"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["62500"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "dxPos",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","adj1","100000"]
                }
            },
            {
                "gname": "dyPos",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","adj2","100000"]
                }
            },
            {
                "gname": "xPos",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxPos","0"]
                }
            },
            {
                "gname": "yPos",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyPos","0"]
                }
            },
            {
                "gname": "dx",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xPos","0","hc"]
                }
            },
            {
                "gname": "dy",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yPos","0","vc"]
                }
            },
            {
                "gname": "dq",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dxPos","h","w"]
                }
            },
            {
                "gname": "ady",
                "fmla": {
                    "op" : "abs",
                    "args" : ["dyPos"]
                }
            },
            {
                "gname": "adq",
                "fmla": {
                    "op" : "abs",
                    "args" : ["dq"]
                }
            },
            {
                "gname": "dz",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ady","0","adq"]
                }
            },
            {
                "gname": "xg1",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dxPos","7","2"]
                }
            },
            {
                "gname": "xg2",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dxPos","10","5"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","xg1","12"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","xg2","12"]
                }
            },
            {
                "gname": "yg1",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dyPos","7","2"]
                }
            },
            {
                "gname": "yg2",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dyPos","10","5"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","yg1","12"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","yg2","12"]
                }
            },
            {
                "gname": "t1",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dxPos","l","xPos"]
                }
            },
            {
                "gname": "xl",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","l","t1"]
                }
            },
            {
                "gname": "t2",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dyPos","x1","xPos"]
                }
            },
            {
                "gname": "xt",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","t2","x1"]
                }
            },
            {
                "gname": "t3",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dxPos","xPos","r"]
                }
            },
            {
                "gname": "xr",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","r","t3"]
                }
            },
            {
                "gname": "t4",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dyPos","xPos","x1"]
                }
            },
            {
                "gname": "xb",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","t4","x1"]
                }
            },
            {
                "gname": "t5",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dxPos","y1","yPos"]
                }
            },
            {
                "gname": "yl",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","y1","t5"]
                }
            },
            {
                "gname": "t6",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dyPos","t","yPos"]
                }
            },
            {
                "gname": "yt",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","t6","t"]
                }
            },
            {
                "gname": "t7",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dxPos","yPos","y1"]
                }
            },
            {
                "gname": "yr",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","y1","t7"]
                }
            },
            {
                "gname": "t8",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dyPos","yPos","b"]
                }
            },
            {
                "gname": "yb",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dz","t8","b"]
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
                            "x":"xt",
                            "y":"yt"
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
                            "x":"r",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xr",
                            "y":"yr"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"y2"
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
                            "x":"x2",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xb",
                            "y":"yb"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
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
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xl",
                            "y":"yl"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"y1"
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
