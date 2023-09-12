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
 * Data for preset shape -- actionButtonHelp
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 113,
        'preset': 'actionButtonHelp',
        'description': 'Action Button: Help',

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
                "gname": "g11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx2"]
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
                    "args" : ["g13","1","7"]
                }
            },
            {
                "gname": "g15",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","14"]
                }
            },
            {
                "gname": "g16",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","2","7"]
                }
            },
            {
                "gname": "g19",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","7"]
                }
            },
            {
                "gname": "g20",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","4","7"]
                }
            },
            {
                "gname": "g21",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","17","28"]
                }
            },
            {
                "gname": "g23",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","21","28"]
                }
            },
            {
                "gname": "g24",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","11","14"]
                }
            },
            {
                "gname": "g27",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g16","0"]
                }
            },
            {
                "gname": "g29",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g21","0"]
                }
            },
            {
                "gname": "g30",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g23","0"]
                }
            },
            {
                "gname": "g31",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g24","0"]
                }
            },
            {
                "gname": "g33",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g15","0"]
                }
            },
            {
                "gname": "g36",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g19","0"]
                }
            },
            {
                "gname": "g37",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g20","0"]
                }
            },
            {
                "gname": "g41",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","1","14"]
                }
            },
            {
                "gname": "g42",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","28"]
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
                            "x":"g33",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g16",
                        "hr":"g16",
                        "stAng":"cd2",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g15",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g41",
                        "hr":"g42",
                        "stAng":"3cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g37",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g36",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g36",
                            "y":"g29"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g15",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g41",
                        "hr":"g42",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g14",
                        "stAng":"0",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g42",
                        "hr":"g42",
                        "stAng":"3cd4",
                        "swAng":"21600000"
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
                            "x":"g33",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g16",
                        "hr":"g16",
                        "stAng":"cd2",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g15",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g41",
                        "hr":"g42",
                        "stAng":"3cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g37",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g36",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g36",
                            "y":"g29"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g15",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g41",
                        "hr":"g42",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g14",
                        "stAng":"0",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g42",
                        "hr":"g42",
                        "stAng":"3cd4",
                        "swAng":"21600000"
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
                            "x":"g33",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g16",
                        "hr":"g16",
                        "stAng":"cd2",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g15",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g41",
                        "hr":"g42",
                        "stAng":"3cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g37",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g36",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g36",
                            "y":"g29"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g15",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g41",
                        "hr":"g42",
                        "stAng":"cd4",
                        "swAng":"-5400000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g14",
                        "hr":"g14",
                        "stAng":"0",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g42",
                        "hr":"g42",
                        "stAng":"3cd4",
                        "swAng":"21600000"
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
