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
 * Data for preset shape -- star32
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 115,
        'preset': 'star32',
        'description': '32-Point Star',

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
                    "args" : ["wd2","98079","100000"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","92388","100000"]
                }
            },
            {
                "gname": "dx3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","83147","100000"]
                }
            },
            {
                "gname": "dx4",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","2700000"]
                }
            },
            {
                "gname": "dx5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","55557","100000"]
                }
            },
            {
                "gname": "dx6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","38268","100000"]
                }
            },
            {
                "gname": "dx7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","19509","100000"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","98079","100000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","92388","100000"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","83147","100000"]
                }
            },
            {
                "gname": "dy4",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","2700000"]
                }
            },
            {
                "gname": "dy5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","55557","100000"]
                }
            },
            {
                "gname": "dy6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","38268","100000"]
                }
            },
            {
                "gname": "dy7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","19509","100000"]
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
                    "args" : ["hc","0","dx6"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx7"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx7","0"]
                }
            },
            {
                "gname": "x9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx6","0"]
                }
            },
            {
                "gname": "x10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx5","0"]
                }
            },
            {
                "gname": "x11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx4","0"]
                }
            },
            {
                "gname": "x12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx3","0"]
                }
            },
            {
                "gname": "x13",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "x14",
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
                    "args" : ["vc","0","dy6"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy7"]
                }
            },
            {
                "gname": "y8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy7","0"]
                }
            },
            {
                "gname": "y9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy6","0"]
                }
            },
            {
                "gname": "y10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy5","0"]
                }
            },
            {
                "gname": "y11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy4","0"]
                }
            },
            {
                "gname": "y12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy3","0"]
                }
            },
            {
                "gname": "y13",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy2","0"]
                }
            },
            {
                "gname": "y14",
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
                    "args" : ["iwd2","99518","100000"]
                }
            },
            {
                "gname": "sdx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","95694","100000"]
                }
            },
            {
                "gname": "sdx3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","88192","100000"]
                }
            },
            {
                "gname": "sdx4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","77301","100000"]
                }
            },
            {
                "gname": "sdx5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","63439","100000"]
                }
            },
            {
                "gname": "sdx6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","47140","100000"]
                }
            },
            {
                "gname": "sdx7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","29028","100000"]
                }
            },
            {
                "gname": "sdx8",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","9802","100000"]
                }
            },
            {
                "gname": "sdy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","99518","100000"]
                }
            },
            {
                "gname": "sdy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","95694","100000"]
                }
            },
            {
                "gname": "sdy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","88192","100000"]
                }
            },
            {
                "gname": "sdy4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","77301","100000"]
                }
            },
            {
                "gname": "sdy5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","63439","100000"]
                }
            },
            {
                "gname": "sdy6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","47140","100000"]
                }
            },
            {
                "gname": "sdy7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","29028","100000"]
                }
            },
            {
                "gname": "sdy8",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","9802","100000"]
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
                    "args" : ["hc","0","sdx7"]
                }
            },
            {
                "gname": "sx8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx8"]
                }
            },
            {
                "gname": "sx9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx8","0"]
                }
            },
            {
                "gname": "sx10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx7","0"]
                }
            },
            {
                "gname": "sx11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx6","0"]
                }
            },
            {
                "gname": "sx12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx5","0"]
                }
            },
            {
                "gname": "sx13",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx4","0"]
                }
            },
            {
                "gname": "sx14",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx3","0"]
                }
            },
            {
                "gname": "sx15",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx2","0"]
                }
            },
            {
                "gname": "sx16",
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
                    "args" : ["vc","0","sdy7"]
                }
            },
            {
                "gname": "sy8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","sdy8"]
                }
            },
            {
                "gname": "sy9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy8","0"]
                }
            },
            {
                "gname": "sy10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy7","0"]
                }
            },
            {
                "gname": "sy11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy6","0"]
                }
            },
            {
                "gname": "sy12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy5","0"]
                }
            },
            {
                "gname": "sy13",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy4","0"]
                }
            },
            {
                "gname": "sy14",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy3","0"]
                }
            },
            {
                "gname": "sy15",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy2","0"]
                }
            },
            {
                "gname": "sy16",
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
                            "y":"sy8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
                            "y":"sy7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx3",
                            "y":"sy6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx4",
                            "y":"sy5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx5",
                            "y":"sy4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx6",
                            "y":"sy3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx7",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx8",
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
                            "x":"sx9",
                            "y":"sy1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx10",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x9",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx11",
                            "y":"sy3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x10",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx12",
                            "y":"sy4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x11",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx13",
                            "y":"sy5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x12",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx14",
                            "y":"sy6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x13",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx15",
                            "y":"sy7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x14",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx16",
                            "y":"sy8"
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
                            "x":"sx16",
                            "y":"sy9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x14",
                            "y":"y8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx15",
                            "y":"sy10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x13",
                            "y":"y9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx14",
                            "y":"sy11"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x12",
                            "y":"y10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx13",
                            "y":"sy12"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x11",
                            "y":"y11"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx12",
                            "y":"sy13"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x10",
                            "y":"y12"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx11",
                            "y":"sy14"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x9",
                            "y":"y13"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx10",
                            "y":"sy15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y14"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx9",
                            "y":"sy16"
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
                            "x":"sx8",
                            "y":"sy16"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y14"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx7",
                            "y":"sy15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y13"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx6",
                            "y":"sy14"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y12"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx5",
                            "y":"sy13"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y11"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx4",
                            "y":"sy12"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx3",
                            "y":"sy11"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
                            "y":"sy10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx1",
                            "y":"sy9"
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
