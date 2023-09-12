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
 * Data for preset shape -- star16
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 62,
        'preset': 'star16',
        'description': '16-Point Star',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["37500"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","50000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","92388","100000"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","70711","100000"]
                }
            },
            {
                "gname": "dx3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","38268","100000"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","92388","100000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","70711","100000"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","38268","100000"]
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
                    "args" : ["hc","0","dx2"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx3"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx3","0"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy1"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy2"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy3"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy3","0"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy2","0"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","0"]
                }
            },
            {
                "gname": "iwd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","a","50000"]
                }
            },
            {
                "gname": "ihd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","a","50000"]
                }
            },
            {
                "gname": "sdx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","98079","100000"]
                }
            },
            {
                "gname": "sdx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","83147","100000"]
                }
            },
            {
                "gname": "sdx3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","55557","100000"]
                }
            },
            {
                "gname": "sdx4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","19509","100000"]
                }
            },
            {
                "gname": "sdy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","98079","100000"]
                }
            },
            {
                "gname": "sdy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","83147","100000"]
                }
            },
            {
                "gname": "sdy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","55557","100000"]
                }
            },
            {
                "gname": "sdy4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","19509","100000"]
                }
            },
            {
                "gname": "sx1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx1"]
                }
            },
            {
                "gname": "sx2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx2"]
                }
            },
            {
                "gname": "sx3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx3"]
                }
            },
            {
                "gname": "sx4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx4"]
                }
            },
            {
                "gname": "sx5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx4","0"]
                }
            },
            {
                "gname": "sx6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx3","0"]
                }
            },
            {
                "gname": "sx7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx2","0"]
                }
            },
            {
                "gname": "sx8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx1","0"]
                }
            },
            {
                "gname": "sy1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","sdy1"]
                }
            },
            {
                "gname": "sy2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","sdy2"]
                }
            },
            {
                "gname": "sy3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","sdy3"]
                }
            },
            {
                "gname": "sy4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","sdy4"]
                }
            },
            {
                "gname": "sy5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy4","0"]
                }
            },
            {
                "gname": "sy6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy3","0"]
                }
            },
            {
                "gname": "sy7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy2","0"]
                }
            },
            {
                "gname": "sy8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy1","0"]
                }
            },
            {
                "gname": "idx",
                "fmla": {
                    "op" : "cos",
                    "args" : ["iwd2","2700000"]
                }
            },
            {
                "gname": "idy",
                "fmla": {
                    "op" : "sin",
                    "args" : ["ihd2","2700000"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","idx"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","idy"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","idx","0"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","idy","0"]
                }
            },
            {
                "gname": "yAdj",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","ihd2"]
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
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx1",
                            "y":"sy4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
                            "y":"sy3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx3",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx4",
                            "y":"sy1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx5",
                            "y":"sy1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx6",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx7",
                            "y":"sy3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx8",
                            "y":"sy4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx8",
                            "y":"sy5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx7",
                            "y":"sy6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx6",
                            "y":"sy7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx5",
                            "y":"sy8"
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx4",
                            "y":"sy8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx3",
                            "y":"sy7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
                            "y":"sy6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx1",
                            "y":"sy5"
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
