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
 * Data for preset shape -- sun
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 66,
        'preset': 'sun',
        'description': 'Sun',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["12500","adj","46875"]
                }
            },
            {
                "gname": "g0",
                "fmla": {
                    "op" : "+-",
                    "args" : ["50000","0","a"]
                }
            },
            {
                "gname": "g1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g0","30274","32768"]
                }
            },
            {
                "gname": "g2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g0","12540","32768"]
                }
            },
            {
                "gname": "g3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g1","50000","0"]
                }
            },
            {
                "gname": "g4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g2","50000","0"]
                }
            },
            {
                "gname": "g5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["50000","0","g1"]
                }
            },
            {
                "gname": "g6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["50000","0","g2"]
                }
            },
            {
                "gname": "g7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g0","23170","32768"]
                }
            },
            {
                "gname": "g8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["50000","g7","0"]
                }
            },
            {
                "gname": "g9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["50000","0","g7"]
                }
            },
            {
                "gname": "g10",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g5","3","4"]
                }
            },
            {
                "gname": "g11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g6","3","4"]
                }
            },
            {
                "gname": "g12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g10","3662","0"]
                }
            },
            {
                "gname": "g13",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","3662","0"]
                }
            },
            {
                "gname": "g14",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","12500","0"]
                }
            },
            {
                "gname": "g15",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","g10"]
                }
            },
            {
                "gname": "g16",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","g12"]
                }
            },
            {
                "gname": "g17",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","g13"]
                }
            },
            {
                "gname": "g18",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","g14"]
                }
            },
            {
                "gname": "ox1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","18436","21600"]
                }
            },
            {
                "gname": "oy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","3163","21600"]
                }
            },
            {
                "gname": "ox2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","3163","21600"]
                }
            },
            {
                "gname": "oy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","18436","21600"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g8","100000"]
                }
            },
            {
                "gname": "x9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g9","100000"]
                }
            },
            {
                "gname": "x10",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g10","100000"]
                }
            },
            {
                "gname": "x12",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g12","100000"]
                }
            },
            {
                "gname": "x13",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g13","100000"]
                }
            },
            {
                "gname": "x14",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g14","100000"]
                }
            },
            {
                "gname": "x15",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g15","100000"]
                }
            },
            {
                "gname": "x16",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g16","100000"]
                }
            },
            {
                "gname": "x17",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g17","100000"]
                }
            },
            {
                "gname": "x18",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g18","100000"]
                }
            },
            {
                "gname": "x19",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","a","100000"]
                }
            },
            {
                "gname": "wR",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","g0","100000"]
                }
            },
            {
                "gname": "hR",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g0","100000"]
                }
            },
            {
                "gname": "y8",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g8","100000"]
                }
            },
            {
                "gname": "y9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g9","100000"]
                }
            },
            {
                "gname": "y10",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g10","100000"]
                }
            },
            {
                "gname": "y12",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g12","100000"]
                }
            },
            {
                "gname": "y13",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g13","100000"]
                }
            },
            {
                "gname": "y14",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g14","100000"]
                }
            },
            {
                "gname": "y15",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g15","100000"]
                }
            },
            {
                "gname": "y16",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g16","100000"]
                }
            },
            {
                "gname": "y17",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g17","100000"]
                }
            },
            {
                "gname": "y18",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","g18","100000"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"r",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x15",
                            "y":"y18"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x15",
                            "y":"y14"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ox1",
                            "y":"oy1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x16",
                            "y":"y13"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x17",
                            "y":"y12"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x18",
                            "y":"y10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x14",
                            "y":"y10"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ox2",
                            "y":"oy1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x13",
                            "y":"y12"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x12",
                            "y":"y13"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x10",
                            "y":"y14"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x10",
                            "y":"y18"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ox2",
                            "y":"oy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x12",
                            "y":"y17"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x13",
                            "y":"y16"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x14",
                            "y":"y15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x18",
                            "y":"y15"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ox1",
                            "y":"oy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x17",
                            "y":"y16"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x16",
                            "y":"y17"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x19",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"hR",
                        "stAng":"cd2",
                        "swAng":"21600000"
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
