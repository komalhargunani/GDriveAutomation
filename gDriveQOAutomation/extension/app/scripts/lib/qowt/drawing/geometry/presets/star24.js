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
 * Data for preset shape -- star24
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 130,
        'preset': 'star24',
        'description': '24-Point Star',

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
                    "op" : "cos",
                    "args" : ["wd2","900000"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","1800000"]
                }
            },
            {
                "gname": "dx3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","2700000"]
                }
            },
            {
                "gname": "dx4",
                "fmla": {
                    "op" : "val",
                    "args" : ["wd4"]
                }
            },
            {
                "gname": "dx5",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","4500000"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","4500000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","3600000"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","2700000"]
                }
            },
            {
                "gname": "dy4",
                "fmla": {
                    "op" : "val",
                    "args" : ["hd4"]
                }
            },
            {
                "gname": "dy5",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","900000"]
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
                    "args" : ["hc","0","dx4"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx5"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx5","0"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx4","0"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx3","0"]
                }
            },
            {
                "gname": "x9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "x10",
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
                    "args" : ["vc","0","dy4"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy5"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy5","0"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy4","0"]
                }
            },
            {
                "gname": "y8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy3","0"]
                }
            },
            {
                "gname": "y9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy2","0"]
                }
            },
            {
                "gname": "y10",
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
                    "args" : ["iwd2","99144","100000"]
                }
            },
            {
                "gname": "sdx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","92388","100000"]
                }
            },
            {
                "gname": "sdx3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","79335","100000"]
                }
            },
            {
                "gname": "sdx4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","60876","100000"]
                }
            },
            {
                "gname": "sdx5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","38268","100000"]
                }
            },
            {
                "gname": "sdx6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","13053","100000"]
                }
            },
            {
                "gname": "sdy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","99144","100000"]
                }
            },
            {
                "gname": "sdy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","92388","100000"]
                }
            },
            {
                "gname": "sdy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","79335","100000"]
                }
            },
            {
                "gname": "sdy4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","60876","100000"]
                }
            },
            {
                "gname": "sdy5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","38268","100000"]
                }
            },
            {
                "gname": "sdy6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","13053","100000"]
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
                    "args" : ["hc","0","sdx5"]
                }
            },
            {
                "gname": "sx6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx6"]
                }
            },
            {
                "gname": "sx7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx6","0"]
                }
            },
            {
                "gname": "sx8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx5","0"]
                }
            },
            {
                "gname": "sx9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx4","0"]
                }
            },
            {
                "gname": "sx10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx3","0"]
                }
            },
            {
                "gname": "sx11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx2","0"]
                }
            },
            {
                "gname": "sx12",
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
                    "args" : ["vc","0","sdy5"]
                }
            },
            {
                "gname": "sy6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","sdy6"]
                }
            },
            {
                "gname": "sy7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy6","0"]
                }
            },
            {
                "gname": "sy8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy5","0"]
                }
            },
            {
                "gname": "sy9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy4","0"]
                }
            },
            {
                "gname": "sy10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy3","0"]
                }
            },
            {
                "gname": "sy11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy2","0"]
                }
            },
            {
                "gname": "sy12",
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
                            "y":"sy6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
                            "y":"sy5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx3",
                            "y":"sy4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx4",
                            "y":"sy3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx5",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx6",
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
                            "x":"sx7",
                            "y":"sy1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx8",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx9",
                            "y":"sy3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx10",
                            "y":"sy4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x9",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx11",
                            "y":"sy5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x10",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx12",
                            "y":"sy6"
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
                            "x":"sx12",
                            "y":"sy7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x10",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx11",
                            "y":"sy8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x9",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx10",
                            "y":"sy9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx9",
                            "y":"sy10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx8",
                            "y":"sy11"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx7",
                            "y":"sy12"
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
                            "x":"sx6",
                            "y":"sy12"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx5",
                            "y":"sy11"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx4",
                            "y":"sy10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx3",
                            "y":"sy9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
                            "y":"sy8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx1",
                            "y":"sy7"
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
