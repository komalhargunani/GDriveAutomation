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
 * Data for preset shape -- quadArrowCallout
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 53,
        'preset': 'quadArrowCallout',
        'description': 'Quad Arrow Callout',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["18515"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["18515"]
                }
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["18515"]
                }
            },
            {
                "gname": "adj4",
                "fmla": {
                    "op" : "val",
                    "args" : ["48123"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","50000"]
                }
            },
            {
                "gname": "maxAdj1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a2","2","1"]
                }
            },
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","maxAdj1"]
                }
            },
            {
                "gname": "maxAdj3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["50000","0","a2"]
                }
            },
            {
                "gname": "a3",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj3","maxAdj3"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a3","2","1"]
                }
            },
            {
                "gname": "maxAdj4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","q2"]
                }
            },
            {
                "gname": "a4",
                "fmla": {
                    "op" : "pin",
                    "args" : ["a1","adj4","maxAdj4"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "dx3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","200000"]
                }
            },
            {
                "gname": "ah",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a3","100000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","a4","200000"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a4","200000"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","ah"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx1"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx2"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx3"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx3","0"]
                }
            },
            {
                "gname": "y8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","ah"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dy1"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","0"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dx2"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dx2","0"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dx3"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dx3","0"]
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
                            "x":"ah",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ah",
                            "y":"y4"
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
                            "x":"x2",
                            "y":"y2"
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
                            "x":"x4",
                            "y":"ah"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"ah"
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
                            "x":"x6",
                            "y":"ah"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"ah"
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
                            "x":"x7",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y4"
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
                            "x":"r",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y8"
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
                            "x":"x3",
                            "y":"y8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y7"
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
                            "x":"x2",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ah",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ah",
                            "y":"y6"
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
