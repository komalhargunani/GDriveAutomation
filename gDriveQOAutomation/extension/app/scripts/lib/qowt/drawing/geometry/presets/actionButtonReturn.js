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
 * Data for preset shape -- actionButtonReturn
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 180,
        'preset': 'actionButtonReturn',
        'description': 'Action Button: Return',

        "gdLst": [
            {
                "gname": "dx2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","3","8"]
                }
            },
            {
                "gname": "g9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","dx2"]
                }
            },
            {
                "gname": "g10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dx2","0"]
                }
            },
            {
                "gname": "g11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx2"]
                }
            },
            {
                "gname": "g12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx2","0"]
                }
            },
            {
                "gname": "g13",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","3","4"]
                }
            },
            {
                "gname": "g14",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","7","8"]
                }
            },
            {
                "gname": "g15",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","4"]
                }
            },
            {
                "gname": "g16",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","5","8"]
                }
            },
            {
                "gname": "g17",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","8"]
                }
            },
            {
                "gname": "g18",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","1","4"]
                }
            },
            {
                "gname": "g19",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g15","0"]
                }
            },
            {
                "gname": "g20",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g16","0"]
                }
            },
            {
                "gname": "g21",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g18","0"]
                }
            },
            {
                "gname": "g22",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g14","0"]
                }
            },
            {
                "gname": "g23",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g15","0"]
                }
            },
            {
                "gname": "g24",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g16","0"]
                }
            },
            {
                "gname": "g25",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g17","0"]
                }
            },
            {
                "gname": "g26",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g18","0"]
                }
            },
            {
                "gname": "g27",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","1","8"]
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
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"t"
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
                            "x":"l",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g12",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g23",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g24",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g24",
                            "y":"g20"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g27",
                        "hr":"g27",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g25",
                            "y":"g19"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g27",
                        "hr":"g27",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g26",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"g20"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g17",
                        "hr":"g17",
                        "stAng":"cd2",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g17",
                        "hr":"g17",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g22",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "extrusionOk": "false",
                "fill": "darken",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g12",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g23",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g24",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g24",
                            "y":"g20"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g27",
                        "hr":"g27",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g25",
                            "y":"g19"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g27",
                        "hr":"g27",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g26",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"g20"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g17",
                        "hr":"g17",
                        "stAng":"cd2",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g17",
                        "hr":"g17",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g22",
                            "y":"g21"
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
                            "x":"g12",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g22",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g22",
                            "y":"g20"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g17",
                        "hr":"g17",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g25",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g17",
                        "hr":"g17",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g26",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g26",
                            "y":"g20"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g27",
                        "hr":"g27",
                        "stAng":"cd2",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"g19"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g27",
                        "hr":"g27",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g24",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"g21"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g23",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "fill": "none",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"t"
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
                            "x":"l",
                            "y":"b"
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
