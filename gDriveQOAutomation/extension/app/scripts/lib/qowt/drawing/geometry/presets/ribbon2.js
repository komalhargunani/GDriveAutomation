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
 * Data for preset shape -- ribbon2
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 185,
        'preset': 'ribbon2',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["16667"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["50000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","33333"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["25000","adj2","75000"]
                }
            },
            {
                "gname": "x10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","wd8"]
                }
            },
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","a2","200000"]
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
                "gname": "x9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2","wd32","0"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x9","0","wd32"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2","wd8","0"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x9","0","wd8"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x5","0","wd32"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x6","wd32","0"]
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
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","dy1"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","100000"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","dy2"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t","dy2","0"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y4","b","2"]
                }
            },
            {
                "gname": "hR",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","400000"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","hR"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y1","0","hR"]
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
                            "y":"b"
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
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y2"
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"y1"
                        }
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
                            "x":"r",
                            "y":"b"
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
                            "x":"r",
                            "y":"y4"
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
                            "x":"x9",
                            "y":"hR"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"0",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"-5400000"
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
                            "x":"l",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"wd8",
                            "y":"y3"
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
                            "x":"x5",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"0",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x6",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y2"
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
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"wd8",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
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
                            "y":"hR"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"cd4"
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
                            "x":"x9",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"y4"
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
                            "x":"r",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x8",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wd32",
                        "hr":"hR",
                        "stAng":"cd4",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y2"
                        }
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
                            "y":"y1"
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
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x5",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x6",
                            "y":"y6"
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
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"y7"
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
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x9",
                            "y":"y4"
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
                      //this is externally added path, its not microsoft defined
                      // path
                        "pathType":"close"
                    }
                ]
            }
        ]
    };

	return data;
});
