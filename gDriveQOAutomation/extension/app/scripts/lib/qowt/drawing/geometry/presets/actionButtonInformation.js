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
 * Data for preset shape -- actionButtonInformation
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 99,
        'preset': 'actionButtonInformation',
        'description': 'Action Button: Information',

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
                    "args" : ["g13","1","32"]
                }
            },
            {
                "gname": "g17",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","5","16"]
                }
            },
            {
                "gname": "g18",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","8"]
                }
            },
            {
                "gname": "g19",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","13","32"]
                }
            },
            {
                "gname": "g20",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","19","32"]
                }
            },
            {
                "gname": "g22",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","11","16"]
                }
            },
            {
                "gname": "g23",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","13","16"]
                }
            },
            {
                "gname": "g24",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","7","8"]
                }
            },
            {
                "gname": "g25",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g14","0"]
                }
            },
            {
                "gname": "g28",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g17","0"]
                }
            },
            {
                "gname": "g29",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g18","0"]
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
                "gname": "g32",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g17","0"]
                }
            },
            {
                "gname": "g34",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g19","0"]
                }
            },
            {
                "gname": "g35",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g20","0"]
                }
            },
            {
                "gname": "g37",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g22","0"]
                }
            },
            {
                "gname": "g38",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","32"]
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
                            "x":"hc",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"dx2",
                        "hr":"dx2",
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
                            "x":"hc",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"dx2",
                        "hr":"dx2",
                        "stAng":"3cd4",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"g25"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g38",
                        "hr":"g38",
                        "stAng":"3cd4",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g32",
                            "y":"g28"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g29"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g34",
                            "y":"g29"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g34",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g37",
                            "y":"g31"
                        }
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
                            "x":"g35",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g35",
                            "y":"g28"
                        }
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "extrusionOk": "false",
                "fill": "lighten",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"g25"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g38",
                        "hr":"g38",
                        "stAng":"3cd4",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g32",
                            "y":"g28"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g35",
                            "y":"g28"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g35",
                            "y":"g30"
                        }
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
                            "x":"g37",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g34",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g34",
                            "y":"g29"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g29"
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
                            "x":"hc",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"dx2",
                        "hr":"dx2",
                        "stAng":"3cd4",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"hc",
                            "y":"g25"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g38",
                        "hr":"g38",
                        "stAng":"3cd4",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g32",
                            "y":"g28"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g35",
                            "y":"g28"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g35",
                            "y":"g30"
                        }
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
                            "x":"g37",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g31"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g34",
                            "y":"g30"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g34",
                            "y":"g29"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g29"
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
