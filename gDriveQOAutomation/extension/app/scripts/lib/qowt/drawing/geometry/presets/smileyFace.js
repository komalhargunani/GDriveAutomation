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
 * Data for preset shape -- smileyFace
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 0,
        'preset': 'smileyFace',
        'description': 'Smiley Face',

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["4653"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["-4653","adj","4653"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","4969","21699"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","6215","21600"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","13135","21600"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","16640","21600"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","7570","21600"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","16515","21600"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a","100000"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y3","0","dy2"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y3","dy2","0"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a","50000"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y4","dy3","0"]
                }
            },
            {
                "gname": "idx",
                "fmla": {
                    "op" : "cos",
                    "args" : ["wd2","2700000"]
                }
            },
            {
                "gname": "idy",
                "fmla": {
                    "op" : "sin",
                    "args" : ["hd2","2700000"]
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
                "gname": "ir",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","idx","0"]
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
                "gname": "ib",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","idy","0"]
                }
            },
            {
                "gname": "wR",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","1125","21600"]
                }
            },
            {
                "gname": "hR",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","1125","21600"]
                }
            }
        ],
        "pathLst":[
            {
                "extrusionOk": "false",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
                        "stAng":"cd2",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "extrusionOk": "false",
                "fill": "darkenLess",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"y1"
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
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"hR",
                        "stAng":"cd2",
                        "swAng":"21600000"
                    }
                ]
            },
            {
                "extrusionOk": "false",
                "fill": "none",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x1",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"hc",
                                "y":"y5"
                            },
                            {
                                "x":"x4",
                                "y":"y2"
                            }
                        ]
                    }
                ]
            },
            {
                "fill": "none",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd2",
                        "hr":"hd2",
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
