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
 * Data for preset shape -- mathNotEqual
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 18,
        'preset': 'mathNotEqual',
        'description': 'Not Equal',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["23520"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["6600000"]
                }
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["11760"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","50000"]
                }
            },
            {
                "gname": "crAng",
                "fmla": {
                    "op" : "pin",
                    "args" : ["4200000","adj2","6600000"]
                }
            },
            {
                "gname": "2a1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a1","2","1"]
                }
            },
            {
                "gname": "maxAdj3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","2a1"]
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
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","100000"]
                }
            },
            {
                "gname": "dy2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a3","200000"]
                }
            },
            {
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","73490","200000"]
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
                "gname": "x8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
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
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y2","0","dy1"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y3","dy1","0"]
                }
            },
            {
                "gname": "cadj2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["crAng","0","cd4"]
                }
            },
            {
                "gname": "xadj2",
                "fmla": {
                    "op" : "tan",
                    "args" : ["hd2","cadj2"]
                }
            },
            {
                "gname": "len",
                "fmla": {
                    "op" : "mod",
                    "args" : ["xadj2","hd2","0"]
                }
            },
            {
                "gname": "bhw",
                "fmla": {
                    "op" : "*/",
                    "args" : ["len","dy1","hd2"]
                }
            },
            {
                "gname": "bhw2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["bhw","1","2"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","xadj2","bhw2"]
                }
            },
            {
                "gname": "dx67",
                "fmla": {
                    "op" : "*/",
                    "args" : ["xadj2","y1","hd2"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","0","dx67"]
                }
            },
            {
                "gname": "dx57",
                "fmla": {
                    "op" : "*/",
                    "args" : ["xadj2","y2","hd2"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","0","dx57"]
                }
            },
            {
                "gname": "dx47",
                "fmla": {
                    "op" : "*/",
                    "args" : ["xadj2","y3","hd2"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","0","dx47"]
                }
            },
            {
                "gname": "dx37",
                "fmla": {
                    "op" : "*/",
                    "args" : ["xadj2","y4","hd2"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","0","dx37"]
                }
            },
            {
                "gname": "dx27",
                "fmla": {
                    "op" : "*/",
                    "args" : ["xadj2","2","1"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","0","dx27"]
                }
            },
            {
                "gname": "rx7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","bhw","0"]
                }
            },
            {
                "gname": "rx6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x6","bhw","0"]
                }
            },
            {
                "gname": "rx5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x5","bhw","0"]
                }
            },
            {
                "gname": "rx4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x4","bhw","0"]
                }
            },
            {
                "gname": "rx3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x3","bhw","0"]
                }
            },
            {
                "gname": "rx2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2","bhw","0"]
                }
            },
            {
                "gname": "dx7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dy1","hd2","len"]
                }
            },
            {
                "gname": "rxt",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","dx7","0"]
                }
            },
            {
                "gname": "lxt",
                "fmla": {
                    "op" : "+-",
                    "args" : ["rx7","0","dx7"]
                }
            },
            {
                "gname": "rx",
                "fmla": {
                    "op" : "?:",
                    "args" : ["cadj2","rxt","rx7"]
                }
            },
            {
                "gname": "lx",
                "fmla": {
                    "op" : "?:",
                    "args" : ["cadj2","x7","lxt"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dy1","xadj2","len"]
                }
            },
            {
                "gname": "dy4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","0","dy3"]
                }
            },
            {
                "gname": "ry",
                "fmla": {
                    "op" : "?:",
                    "args" : ["cadj2","dy3","t"]
                }
            },
            {
                "gname": "ly",
                "fmla": {
                    "op" : "?:",
                    "args" : ["cadj2","t","dy4"]
                }
            },
            {
                "gname": "dlx",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","rx"]
                }
            },
            {
                "gname": "drx",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","lx"]
                }
            },
            {
                "gname": "dly",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","ry"]
                }
            },
            {
                "gname": "dry",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","ly"]
                }
            },
            {
                "gname": "xC1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["rx","lx","2"]
                }
            },
            {
                "gname": "xC2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["drx","dlx","2"]
                }
            },
            {
                "gname": "yC1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["ry","ly","2"]
                }
            },
            {
                "gname": "yC2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y1","y2","2"]
                }
            },
            {
                "gname": "yC3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["y3","y4","2"]
                }
            },
            {
                "gname": "yC4",
                "fmla": {
                    "op" : "+/",
                    "args" : ["dry","dly","2"]
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
                            "x":"x6",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"lx",
                            "y":"ly"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"rx",
                            "y":"ry"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"rx6",
                            "y":"y1"
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
                            "x":"x8",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"rx5",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"rx4",
                            "y":"y3"
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
                            "x":"x8",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"rx3",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"drx",
                            "y":"dry"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"dlx",
                            "y":"dly"
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
                            "x":"x1",
                            "y":"y4"
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
                            "x":"x4",
                            "y":"y3"
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
                            "x":"x1",
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
