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
 * Data for preset shape -- pentagon
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 108,
        'preset': 'pentagon',
        'description': 'Regular Pentagon',

        "avLst": [
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
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["y1","dx2","dx1"]
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
                            "x":"hc",
                            "y":"t"
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
                            "x":"x3",
                            "y":"y2"
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
                        "pathType":"close"
                    }
                ]
            }
        ]
    };

	return data;
});
