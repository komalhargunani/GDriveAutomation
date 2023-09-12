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
 * Data for preset shape -- gear6
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 21,
        'preset': 'gear6',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["15000"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["3526"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","20000"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","5358"]
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
                "gname": "lFD",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
                }
            },
            {
                "gname": "th2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["th","1","2"]
                }
            },
            {
                "gname": "l2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["lFD","1","2"]
                }
            },
            {
                "gname": "l3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["th2","l2","0"]
                }
            },
            {
                "gname": "rh",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hd2","0","th"]
                }
            },
            {
                "gname": "rw",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","0","th"]
                }
            },
            {
                "gname": "dr",
                "fmla": {
                    "op" : "+-",
                    "args" : ["rw","0","rh"]
                }
            },
            {
                "gname": "maxr",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dr","rh","rw"]
                }
            },
            {
                "gname": "ha",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["maxr","l3"]
                }
            },
            {
                "gname": "aA1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["19800000","0","ha"]
                }
            },
            {
                "gname": "aD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["19800000","ha","0"]
                }
            },
            {
                "gname": "ta11",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA1"]
                }
            },
            {
                "gname": "ta12",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA1"]
                }
            },
            {
                "gname": "bA1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta11","ta12"]
                }
            },
            {
                "gname": "cta1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bA1"]
                }
            },
            {
                "gname": "sta1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bA1"]
                }
            },
            {
                "gname": "ma1",
                "fmla": {
                    "op" : "mod",
                    "args" : ["cta1","sta1","0"]
                }
            },
            {
                "gname": "na1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","ma1"]
                }
            },
            {
                "gname": "dxa1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["na1","bA1"]
                }
            },
            {
                "gname": "dya1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["na1","bA1"]
                }
            },
            {
                "gname": "xA1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxa1","0"]
                }
            },
            {
                "gname": "yA1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dya1","0"]
                }
            },
            {
                "gname": "td11",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD1"]
                }
            },
            {
                "gname": "td12",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD1"]
                }
            },
            {
                "gname": "bD1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td11","td12"]
                }
            },
            {
                "gname": "ctd1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bD1"]
                }
            },
            {
                "gname": "std1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bD1"]
                }
            },
            {
                "gname": "md1",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ctd1","std1","0"]
                }
            },
            {
                "gname": "nd1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","md1"]
                }
            },
            {
                "gname": "dxd1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["nd1","bD1"]
                }
            },
            {
                "gname": "dyd1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["nd1","bD1"]
                }
            },
            {
                "gname": "xD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxd1","0"]
                }
            },
            {
                "gname": "yD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyd1","0"]
                }
            },
            {
                "gname": "xAD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA1","0","xD1"]
                }
            },
            {
                "gname": "yAD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA1","0","yD1"]
                }
            },
            {
                "gname": "lAD1",
                "fmla": {
                    "op" : "mod",
                    "args" : ["xAD1","yAD1","0"]
                }
            },
            {
                "gname": "a1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["yAD1","xAD1"]
                }
            },
            {
                "gname": "dxF1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["lFD","a1"]
                }
            },
            {
                "gname": "dyF1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["lFD","a1"]
                }
            },
            {
                "gname": "xF1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xD1","dxF1","0"]
                }
            },
            {
                "gname": "yF1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yD1","dyF1","0"]
                }
            },
            {
                "gname": "xE1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA1","0","dxF1"]
                }
            },
            {
                "gname": "yE1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA1","0","dyF1"]
                }
            },
            {
                "gname": "yC1t",
                "fmla": {
                    "op" : "sin",
                    "args" : ["th","a1"]
                }
            },
            {
                "gname": "xC1t",
                "fmla": {
                    "op" : "cos",
                    "args" : ["th","a1"]
                }
            },
            {
                "gname": "yC1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF1","yC1t","0"]
                }
            },
            {
                "gname": "xC1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xF1","0","xC1t"]
                }
            },
            {
                "gname": "yB1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yE1","yC1t","0"]
                }
            },
            {
                "gname": "xB1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xE1","0","xC1t"]
                }
            },
            {
                "gname": "aD6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["3cd4","ha","0"]
                }
            },
            {
                "gname": "td61",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD6"]
                }
            },
            {
                "gname": "td62",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD6"]
                }
            },
            {
                "gname": "bD6",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td61","td62"]
                }
            },
            {
                "gname": "ctd6",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bD6"]
                }
            },
            {
                "gname": "std6",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bD6"]
                }
            },
            {
                "gname": "md6",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ctd6","std6","0"]
                }
            },
            {
                "gname": "nd6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","md6"]
                }
            },
            {
                "gname": "dxd6",
                "fmla": {
                    "op" : "cos",
                    "args" : ["nd6","bD6"]
                }
            },
            {
                "gname": "dyd6",
                "fmla": {
                    "op" : "sin",
                    "args" : ["nd6","bD6"]
                }
            },
            {
                "gname": "xD6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxd6","0"]
                }
            },
            {
                "gname": "yD6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyd6","0"]
                }
            },
            {
                "gname": "xA6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dxd6"]
                }
            },
            {
                "gname": "xF6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xD6","0","lFD"]
                }
            },
            {
                "gname": "xE6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA6","lFD","0"]
                }
            },
            {
                "gname": "yC6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yD6","0","th"]
                }
            },
            {
                "gname": "swAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bA1","0","bD6"]
                }
            },
            {
                "gname": "aA2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["1800000","0","ha"]
                }
            },
            {
                "gname": "aD2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["1800000","ha","0"]
                }
            },
            {
                "gname": "ta21",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA2"]
                }
            },
            {
                "gname": "ta22",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA2"]
                }
            },
            {
                "gname": "bA2",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta21","ta22"]
                }
            },
            {
                "gname": "yA2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","yD1"]
                }
            },
            {
                "gname": "td21",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD2"]
                }
            },
            {
                "gname": "td22",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD2"]
                }
            },
            {
                "gname": "bD2",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td21","td22"]
                }
            },
            {
                "gname": "yD2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","yA1"]
                }
            },
            {
                "gname": "yC2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","yB1"]
                }
            },
            {
                "gname": "yB2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","yC1"]
                }
            },
            {
                "gname": "xB2",
                "fmla": {
                    "op" : "val",
                    "args" : ["xC1"]
                }
            },
            {
                "gname": "swAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bA2","0","bD1"]
                }
            },
            {
                "gname": "aD3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cd4","ha","0"]
                }
            },
            {
                "gname": "td31",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD3"]
                }
            },
            {
                "gname": "td32",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD3"]
                }
            },
            {
                "gname": "bD3",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td31","td32"]
                }
            },
            {
                "gname": "yD3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","yD6"]
                }
            },
            {
                "gname": "yB3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["h","0","yC6"]
                }
            },
            {
                "gname": "aD4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["9000000","ha","0"]
                }
            },
            {
                "gname": "td41",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD4"]
                }
            },
            {
                "gname": "td42",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD4"]
                }
            },
            {
                "gname": "bD4",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td41","td42"]
                }
            },
            {
                "gname": "xD4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xD1"]
                }
            },
            {
                "gname": "xC4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xC1"]
                }
            },
            {
                "gname": "xB4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xB1"]
                }
            },
            {
                "gname": "aD5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["12600000","ha","0"]
                }
            },
            {
                "gname": "td51",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD5"]
                }
            },
            {
                "gname": "td52",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD5"]
                }
            },
            {
                "gname": "bD5",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td51","td52"]
                }
            },
            {
                "gname": "xD5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xA1"]
                }
            },
            {
                "gname": "xC5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xB1"]
                }
            },
            {
                "gname": "xB5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xC1"]
                }
            },
            {
                "gname": "xCxn1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["xB1","xC1","2"]
                }
            },
            {
                "gname": "yCxn1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["yB1","yC1","2"]
                }
            },
            {
                "gname": "yCxn2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","yCxn1"]
                }
            },
            {
                "gname": "xCxn4",
                "fmla": {
                    "op" : "+/",
                    "args" : ["r","0","xCxn1"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"xA1",
                            "y":"yA1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB1",
                            "y":"yB1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC1",
                            "y":"yC1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD1",
                            "y":"yD1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD1",
                        "swAng":"swAng2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC1",
                            "y":"yB2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB1",
                            "y":"yC2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xA1",
                            "y":"yD2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD2",
                        "swAng":"swAng1"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xF6",
                            "y":"yB3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xE6",
                            "y":"yB3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xA6",
                            "y":"yD3"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD3",
                        "swAng":"swAng1"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB4",
                            "y":"yC2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC4",
                            "y":"yB2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD4",
                            "y":"yA2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD4",
                        "swAng":"swAng2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB5",
                            "y":"yC1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC5",
                            "y":"yB1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD5",
                            "y":"yA1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD5",
                        "swAng":"swAng1"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xE6",
                            "y":"yC6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xF6",
                            "y":"yC6"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD6",
                            "y":"yD6"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD6",
                        "swAng":"swAng1"
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
