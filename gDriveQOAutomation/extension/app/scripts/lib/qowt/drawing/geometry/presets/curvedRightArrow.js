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
 * Data for preset shape -- curvedRightArrow
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 146,
        'preset': 'curvedRightArrow',
        'description': 'Curved Right Arrow',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["25000"]
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
                    "args" : ["25000"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "maxAdj2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["50000","h","ss"]
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
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","a2"]
                }
            },
            {
                "gname": "th",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","100000"]
                }
            },
            {
                "gname": "aw",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["th","aw","4"]
                }
            },
            {
                "gname": "hR",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hd2","0","q1"]
                }
            },
            {
                "gname": "q7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["hR","2","1"]
                }
            },
            {
                "gname": "q8",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q7","q7","1"]
                }
            },
            {
                "gname": "q9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["th","th","1"]
                }
            },
            {
                "gname": "q10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q8","0","q9"]
                }
            },
            {
                "gname": "q11",
                "fmla": {
                    "op" : "sqrt",
                    "args" : ["q10"]
                }
            },
            {
                "gname": "idx",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q11","w","q7"]
                }
            },
            {
                "gname": "maxAdj3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["100000","idx","ss"]
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
                "gname": "ah",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a3","100000"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hR","th","0"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","w","1"]
                }
            },
            {
                "gname": "q3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ah","ah","1"]
                }
            },
            {
                "gname": "q4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q2","0","q3"]
                }
            },
            {
                "gname": "q5",
                "fmla": {
                    "op" : "sqrt",
                    "args" : ["q4"]
                }
            },
            {
                "gname": "dy",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q5","hR","w"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hR","dy","0"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y3","dy","0"]
                }
            },
            {
                "gname": "q6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["aw","0","th"]
                }
            },
            {
                "gname": "dh",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q6","1","2"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y5","0","dh"]
                }
            },
            {
                "gname": "y8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y7","dh","0"]
                }
            },
            {
                "gname": "aw2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["aw","1","2"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","aw2"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","ah"]
                }
            },
            {
                "gname": "swAng1",
                "fmla": {
                    "op" : "at2",
                    "args" : ["ah","dy"]
                }
            },
            {
                "gname": "swAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng1","5400000","0"]
                }
            },
            {
                "gname": "stAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd2","0","swAng"]
                }
            },
            {
                "gname": "mswAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","0","swAng"]
                }
            },
            {
                "gname": "ix",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","idx"]
                }
            },
            {
                "gname": "iy",
                "fmla": {
                    "op" : "+/",
                    "args" : ["hR","y3","2"]
                }
            },
            {
                "gname": "q12",
                "fmla": {
                    "op" : "*/",
                    "args" : ["th","1","2"]
                }
            },
            {
                "gname": "dang2",
                "fmla": {
                    "op" : "at2",
                    "args" : ["idx","q12"]
                }
            },
            {
                "gname": "swAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["dang2","0","cd4"]
                }
            },
            {
                "gname": "swAng3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd4","dang2","0"]
                }
            },
            {
                "gname": "stAng3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd2","0","dang2"]
                }
            }
        ],
        "pathLst":[
         {
                "extrusionOk": "false",
                "stroke": "false",
                "fill": "darkenLess",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"r",
                            "y":"th"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"w",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"swAng2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"hR"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"w",
                        "hr":"hR",
                        "stAng":"stAng3",
                        "swAng":"swAng3"
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
                            "y":"hR"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"w",
                        "hr":"hR",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"th"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"w",
                        "hr":"hR",
                        "stAng":"3cd4",
                        "swAng":"swAng2"
                    }
                ]
            },
            {
                "extrusionOk": "false",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"hR"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"hR",
                        "stAng":"cd2",
                        "swAng":"mswAng"
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
                            "x":"r",
                            "y":"y6"
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
                            "x":"x1",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"hR",
                        "stAng":"stAng",
                        "swAng":"swAng"
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
                            "y":"hR"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"hR",
                        "stAng":"cd2",
                        "swAng":"mswAng"
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
                            "x":"r",
                            "y":"y6"
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
                            "x":"x1",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"x1",
                        "hr":"hR",
                        "stAng":"stAng",
                        "swAng":"swAng"
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
