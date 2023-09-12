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
 * Data for preset shape -- actionButtonDocument
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 161,
        'preset': 'actionButtonDocument',
        'description': 'Action Button: Document',

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
                "gname": "dx1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","9","32"]
                }
            },
            {
                "gname": "g11",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dx1"]
                }
            },
            {
                "gname": "g12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dx1","0"]
                }
            },
            {
                "gname": "g13",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","3","16"]
                }
            },
            {
                "gname": "g14",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g12","0","g13"]
                }
            },
            {
                "gname": "g15",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g9","g13","0"]
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
                            "x":"g11",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g14",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"g15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
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
                "fill": "darkenLess",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g11",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g14",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g14",
                            "y":"g15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"g15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
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
                "fill": "darken",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g14",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g14",
                            "y":"g15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"g15"
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
                            "x":"g11",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g14",
                            "y":"g9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"g15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g12",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g11",
                            "y":"g10"
                        }
                    },
                    {
                        "pathType":"close"
                    },
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"g12",
                            "y":"g15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g14",
                            "y":"g15"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"g14",
                            "y":"g9"
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
