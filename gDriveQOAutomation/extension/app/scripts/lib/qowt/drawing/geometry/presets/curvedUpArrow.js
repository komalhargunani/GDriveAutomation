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
 * Data for preset shape -- curvedUpArrow
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 22,
        'preset': 'curvedUpArrow',
        'description': 'Curved UP Arrow',

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
                    "args" : ["50000","w","ss"]
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
                    "args" : ["0","adj1","100000"]
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
                "gname": "wR",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","0","q1"]
                }
            },
            {
                "gname": "q7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["wR","2","1"]
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
                "gname": "idy",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q11","h","q7"]
                }
            },
            {
                "gname": "maxAdj3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["100000","idy","ss"]
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
                    "args" : ["ss","adj3","100000"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wR","th","0"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","h","1"]
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
                "gname": "dx",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q5","wR","h"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wR","dx","0"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x3","dx","0"]
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
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x5","0","dh"]
                }
            },
            {
                "gname": "x8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x7","dh","0"]
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
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","aw2"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t","ah","0"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","y1"]
                }
            },
            {
                "gname": "swAng1",
                "fmla": {
                    "op" : "at2",
                    "args" : ["ah","dx"]
                }
            },
            {
                "gname": "swAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng1","5400000", "0"]
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
                "gname": "iy",
                "fmla": {
                    "op" : "+-",
                    "args" : ["t","idy","0"]
                }
            },
            {
                "gname": "ix",
                "fmla": {
                    "op" : "+/",
                    "args" : ["wR","x3","2"]
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
                    "args" : ["idy","q12"]
                }
            },
            {
                "gname": "swAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["dang2","0","swAng"]
                }
            },
            {
                "gname": "mswAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","0","swAng2"]
                }
            },
            {
                "gname": "stAng3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd4","0","swAng"]
                }
            },
            {
                "gname": "swAng3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["swAng","dang2","0"]
                }
            },
            {
                "gname": "stAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd4","0","dang2"]
                }
            }
        ],
        "pathLst":[
            {
                "extrusionOk": "false",
                "fill": "darkenLess",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"wR",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"h",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"th",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"h",
                        "stAng":"cd2",
                        "swAng":"-5400000"
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
                            "x":"wR",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"h",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"th",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"h",
                        "stAng":"cd2",
                        "swAng":"-5400000"
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
                            "x":"wR",
                            "y":"h"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"y2",
                        "stAng":"stAng2",
                        "swAng":"swAng2"
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
                            "x":"x6",
                            "y":"t"
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
                            "x":"x7",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"y2",
                        "stAng":"stAng3",
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
                            "x":"wR",
                            "y":"h"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"y2",
                        "stAng":"stAng2",
                        "swAng":"swAng2"
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
                            "x":"x6",
                            "y":"t"
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
                            "x":"x7",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"wR",
                        "hr":"y2",
                        "stAng":"stAng3",
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
