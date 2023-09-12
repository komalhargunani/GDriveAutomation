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
 * Data for preset shape -- ellipseRibbon2
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 116,
        'preset': 'ellipseRibbon2',
        'description': '', //TODO Find out name

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
                    "args" : ["12500"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","100000"]
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
                "gname": "q10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["100000","0","a1"]
                }
            },
            {
                "gname": "q11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q10","1","2"]
                }
            },
            {
                "gname": "q12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["a1","0","q11"]
                }
            },
            {
                "gname": "minAdj3",
                "fmla": {
                    "op" : "max",
                    "args" : ["0","q12"]
                }
            },
            {
                "gname": "a3",
                "fmla": {
                    "op" : "pin",
                    "args" : ["minAdj3","adj3","a1"]
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
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2","wd8","0"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x3"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x2"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","wd8"]
                }
            },
            {
                "gname": "dy1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a3","100000"]
                }
            },
            {
                "gname": "f1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["4","dy1","w"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x3","x3","w"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x3","0","q1"]
                }
            },
            {
                "gname": "u1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["f1","q2","1"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","u1"]
                }
            },
            {
                "gname": "cx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x3","1","2"]
                }
            },
            {
                "gname": "cu1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["f1","cx1","1"]
                }
            },
            {
                "gname": "cy1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","cu1"]
                }
            },
            {
                "gname": "cx2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","cx1"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","a1","100000"]
                }
            },
            {
                "gname": "dy3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q1","0","dy1"]
                }
            },
            {
                "gname": "q3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x2","x2","w"]
                }
            },
            {
                "gname": "q4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2","0","q3"]
                }
            },
            {
                "gname": "q5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["f1","q4","1"]
                }
            },
            {
                "gname": "u3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q5","dy3","0"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","u3"]
                }
            },
            {
                "gname": "q6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["dy1","dy3","u3"]
                }
            },
            {
                "gname": "q7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q6","dy1","0"]
                }
            },
            {
                "gname": "cu3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q7","dy3","0"]
                }
            },
            {
                "gname": "cy3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","cu3"]
                }
            },
            {
                "gname": "rh",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","q1"]
                }
            },
            {
                "gname": "q8",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dy1","14","16"]
                }
            },
            {
                "gname": "u2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["q8","rh","2"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","u2"]
                }
            },
            {
                "gname": "u5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q5","rh","0"]
                }
            },
            {
                "gname": "y5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","u5"]
                }
            },
            {
                "gname": "u6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u3","rh","0"]
                }
            },
            {
                "gname": "y6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","u6"]
                }
            },
            {
                "gname": "cx4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x2","1","2"]
                }
            },
            {
                "gname": "q9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["f1","cx4","1"]
                }
            },
            {
                "gname": "cu4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q9","rh","0"]
                }
            },
            {
                "gname": "cy4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","cu4"]
                }
            },
            {
                "gname": "cx5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","cx4"]
                }
            },
            {
                "gname": "cu6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["cu3","rh","0"]
                }
            },
            {
                "gname": "cy6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","cu6"]
                }
            },
            {
                "gname": "u7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u1","dy3","0"]
                }
            },
            {
                "gname": "y7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","u7"]
                }
            },
            {
                "gname": "cu7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q1","q1","u7"]
                }
            },
            {
                "gname": "cy7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","cu7"]
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
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx1",
                                "y":"cy1"
                            },
                            {
                                "x":"x3",
                                "y":"y1"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"hc",
                                "y":"cy3"
                            },
                            {
                                "x":"x5",
                                "y":"y3"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx2",
                                "y":"cy1"
                            },
                            {
                                "x":"r",
                                "y":"b"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"q1"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx5",
                                "y":"cy4"
                            },
                            {
                                "x":"x5",
                                "y":"y5"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"hc",
                                "y":"cy6"
                            },
                            {
                                "x":"x2",
                                "y":"y6"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx4",
                                "y":"cy4"
                            },
                            {
                                "x":"l",
                                "y":"q1"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"wd8",
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
                "fill": "darkenLess",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"hc",
                                "y":"cy3"
                            },
                            {
                                "x":"x5",
                                "y":"y3"
                            }
                        ]
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
                            "x":"x4",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"hc",
                                "y":"cy7"
                            },
                            {
                                "x":"x3",
                                "y":"y7"
                            }
                        ]
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
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"q1"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx4",
                                "y":"cy4"
                            },
                            {
                                "x":"x2",
                                "y":"y5"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y6"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"hc",
                                "y":"cy6"
                            },
                            {
                                "x":"x5",
                                "y":"y6"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx5",
                                "y":"cy4"
                            },
                            {
                                "x":"r",
                                "y":"q1"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y2"
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
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx2",
                                "y":"cy1"
                            },
                            {
                                "x":"x4",
                                "y":"y1"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"hc",
                                "y":"cy3"
                            },
                            {
                                "x":"x2",
                                "y":"y3"
                            }
                        ]
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"quadBezTo",
                        "pts" : [
                            {
                                "x":"cx1",
                                "y":"cy1"
                            },
                            {
                                "x":"l",
                                "y":"b"
                            }
                        ]
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x2",
                            "y":"y3"
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
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x5",
                            "y":"y5"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x5",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"y7"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x4",
                            "y":"y1"
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
