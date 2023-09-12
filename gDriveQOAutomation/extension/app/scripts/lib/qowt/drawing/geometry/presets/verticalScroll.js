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
 * Data for preset shape -- verticalScroll
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 25,
        'preset': 'verticalScroll',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj",
                "fmla": {
                    "op" : "val",
                    "args" : ["12500"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj","25000"]
                }
            },
            {
                "gname": "ch",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a","100000"]
                }
            },
            {
                "gname": "ch2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ch","1","2"]
                }
            },
            {
                "gname": "ch4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ch","1","4"]
                }
            },
            {
                "gname": "x3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ch","ch2","0"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ch","ch","0"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","ch"]
                }
            },
            {
                "gname": "x7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","ch2"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x6","0","ch2"]
                }
            },
            {
                "gname": "y3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","ch"]
                }
            },
            {
                "gname": "y4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","ch2"]
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
                            "x":"ch2",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch2",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch4",
                        "hr":"ch4",
                        "stAng":"cd4",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch",
                            "y":"ch2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"ch"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x4",
                            "y":"ch2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch4",
                        "hr":"ch4",
                        "stAng":"cd4",
                        "swAng":"cd2"
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
                            "x":"x4",
                            "y":"ch2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch4",
                        "hr":"ch4",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ch",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"0",
                        "swAng":"3cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch4",
                        "hr":"ch4",
                        "stAng":"3cd4",
                        "swAng":"cd2"
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
                            "x":"ch",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch",
                            "y":"ch2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x7",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"ch"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch2",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch4",
                        "hr":"ch4",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ch2"
                        }
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x6",
                            "y":"ch"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x3",
                            "y":"ch"
                        }
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ch2",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch4",
                        "hr":"ch4",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ch2",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"ch2",
                        "hr":"ch2",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch",
                            "y":"y3"
                        }
                    }
                ]
            },      //following paths are externally added paths, its not
                    // microsoft defined paths
            {
                "extrusionOk": "false",
                "fill": "none",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"ch",
                            "y":"y3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"ch",
                            "y":"y4"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"ch"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x6",
                            "y":"ch"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x3",
                            "y":"t"
                        }
                    },
                   {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x4",
                            "y":"ch2"
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
