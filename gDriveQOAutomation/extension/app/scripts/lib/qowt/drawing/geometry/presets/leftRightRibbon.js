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
 * Data for preset shape -- leftRightRibbon
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 7,
        'preset': 'leftRightRibbon',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["16667"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a3",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj3","33333"]
                }
            },
            {
                "gname": "maxAdj1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","a3"]
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
                "gname": "w1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","0","wd32"]
                }
            },
            {
                "gname": "maxAdj2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["100000","w1","ss"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","maxAdj2"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x1"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","200000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a3","-200000"]
                }
            },
            {
                "gname": "ly1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy2","dy1"]
                }
            },
            {
                "gname": "ry4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dy1","dy2"]
                }
            },
            {
                "gname": "ly2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ly1","dy1","0"]
                }
            },
            {
                "gname": "ry3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","ly2"]
                }
            },
            {
                "gname": "ly4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ly2","2","1"]
                }
            },
            {
                "gname": "ry1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","ly4"]
                }
            },
            {
                "gname": "ly3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ly4","0","ly1"]
                }
            },
            {
                "gname": "ry2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","ly3"]
                }
            },
            {
                "gname": "hR",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a3","ss","400000"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","wd32"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","wd32","0"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ly1","hR","0"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ry2","0","hR"]
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
                            "y":"ly2"
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
                            "x":"x1",
                            "y":"ly1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"ly1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ry2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ry1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"ry3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ry4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"ry4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"ly3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"ly3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"ly4"
                        }
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "extrusionOk": "false",
                "fill": "darkenLess",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"ry2"
                        }
                    },
                    {
                        "pathType":"close"
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
                            "x":"l",
                            "y":"ly2"
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
                            "x":"x1",
                            "y":"ly1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"ly1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ry2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ry1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"ry3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ry4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"ry4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"ly3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"ly3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"ly4"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"ry2"
                        }
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"ly3"
                        }
                    }
                ]
            }
        ]
    };

	return data;
});
