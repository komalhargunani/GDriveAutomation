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
 * Data for preset shape -- star10
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 63,
        'preset': 'star10',
        'description': '10-Point Star',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["42533"]
                }
            },
            {
                "gname": "hf",
                "fmla": {
                    "op" : "val",
                    "args" : ["105146"]
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
                "gname": "swd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wd2","hf","100000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["swd2","95106","100000"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["swd2","58779","100000"]
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
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","80902","100000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","30902","100000"]
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
                    "args" : ["vc","dy2","0"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","0"]
                }
            },
            {
                "gname": "iwd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["swd2","a","50000"]
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
                    "args" : ["iwd2","80902","100000"]
                }
            },
            {
                "gname": "sdx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["iwd2","30902","100000"]
                }
            },
            {
                "gname": "sdy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","95106","100000"]
                }
            },
            {
                "gname": "sdy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ihd2","58779","100000"]
                }
            },
            {
                "gname": "sx1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","iwd2"]
                }
            },
            {
                "gname": "sx2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx1"]
                }
            },
            {
                "gname": "sx3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","sdx2"]
                }
            },
            {
                "gname": "sx4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx2","0"]
                }
            },
            {
                "gname": "sx5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx1","0"]
                }
            },
            {
                "gname": "sx6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","iwd2","0"]
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
                    "args" : ["vc","sdy2","0"]
                }
            },
            {
                "gname": "sy4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdy1","0"]
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
                            "x":"x1",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx3",
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
                            "x":"sx4",
                            "y":"sy1"
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
                            "x":"sx5",
                            "y":"sy2"
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
                            "x":"sx6",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx5",
                            "y":"sy3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx4",
                            "y":"sy4"
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
                            "x":"sx3",
                            "y":"sy4"
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
                            "x":"sx2",
                            "y":"sy3"
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
                            "x":"sx1",
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
