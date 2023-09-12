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
 * Data for preset shape -- actionButtonHome
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 11,
        'preset': 'actionButtonHome',
        'description': 'Action Button: Home',

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
                    "args" : ["g13","1","16"]
                }
            },
            {
                "gname": "g15",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","1","8"]
                }
            },
            {
                "gname": "g16",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","16"]
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
                    "args" : ["g13","7","16"]
                }
            },
            {
                "gname": "g19",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","9","16"]
                }
            },
            {
                "gname": "g20",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","11","16"]
                }
            },
            {
                "gname": "g21",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","3","4"]
                }
            },
            {
                "gname": "g22",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","13","16"]
                }
            },
            {
                "gname": "g23",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","7","8"]
                }
            },
            {
                "gname": "g24",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g14","0"]
                }
            },
            {
                "gname": "g25",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g16","0"]
                }
            },
            {
                "gname": "g26",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g17","0"]
                }
            },
            {
                "gname": "g27",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g21","0"]
                }
            },
            {
                "gname": "g28",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g15","0"]
                }
            },
            {
                "gname": "g29",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g18","0"]
                }
            },
            {
                "gname": "g30",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g19","0"]
                }
            },
            {
                "gname": "g31",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g20","0"]
                }
            },
            {
                "gname": "g32",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g22","0"]
                }
            },
            {
                "gname": "g33",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g23","0"]
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g28",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g28",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g33",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g33",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g26"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g24"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g31",
                            "y":"g24"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g31",
                            "y":"g25"
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
                            "x":"g32",
                            "y":"g26"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g24"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g31",
                            "y":"g24"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g31",
                            "y":"g25"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g28",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g28",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g29",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g29",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g30",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g30",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g33",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g33",
                            "y":"vc"
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
                            "x":"hc",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g29",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g30",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g30",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g29",
                            "y":"g10"
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g31",
                            "y":"g25"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g31",
                            "y":"g24"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g24"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g26"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g33",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g33",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g28",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g28",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g31",
                            "y":"g25"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g32",
                            "y":"g26"
                        }
                    },
                    {
                      //this is externally added path, its not microsoft defined
                      // path
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g33",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g28",
                            "y":"vc"
                        }
                    },
                    {
                      //this is externally added path, its not microsoft defined
                      // path
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g29",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g29",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g30",
                            "y":"g27"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g30",
                            "y":"g10"
                        }
                    },
                    {
                      //this is externally added path, its not microsoft defined
                      // path
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
