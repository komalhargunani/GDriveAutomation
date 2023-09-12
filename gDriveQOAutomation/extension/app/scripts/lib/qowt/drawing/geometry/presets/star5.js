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
 * Data for preset shape -- star5
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 139,
        'preset': 'star5',
        'description': '5-Point Star',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["19098"]
                }
            },
            {
                "gname": "hf",
                "fmla": {
                    "op" : "val",
                    "args" : ["105146"]
                }
            },
            {
                "gname": "vf",
                "fmla": {
                    "op" : "val",
                    "args" : ["110557"]
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
                "gname": "shd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hd2","vf","100000"]
                }
            },
            {
                "gname": "svc",
                "fmla": {
                    "op" : "*/",
                    "args" : ["vc","vf","100000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["swd2","1080000"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["swd2","18360000"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["shd2","1080000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["shd2","18360000"]
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
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["svc","0","dy1"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["svc","0","dy2"]
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
                    "args" : ["shd2","a","50000"]
                }
            },
            {
                "gname": "sdx1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["iwd2","20520000"]
                }
            },
            {
                "gname": "sdx2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["iwd2","3240000"]
                }
            },
            {
                "gname": "sdy1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["ihd2","3240000"]
                }
            },
            {
                "gname": "sdy2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["ihd2","20520000"]
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
                    "args" : ["hc","sdx2","0"]
                }
            },
            {
                "gname": "sx4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdx1","0"]
                }
            },
            {
                "gname": "sy1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["svc","0","sdy1"]
                }
            },
            {
                "gname": "sy2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["svc","0","sdy2"]
                }
            },
            {
                "gname": "sy3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["svc","ihd2","0"]
                }
            },
            {
                "gname": "yAdj",
                "fmla": {
                    "op" : "+-",
                    "args" : ["svc","0","ihd2"]
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
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"sx2",
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
                            "x":"sx3",
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
                            "x":"sx4",
                            "y":"sy2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
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
                            "x":"sx1",
                            "y":"sy2"
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
