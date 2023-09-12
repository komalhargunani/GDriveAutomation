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
 * Data for preset shape -- bevel
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 28,
        'preset': 'bevel',
        'description': 'Bevel',

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
                    "args" : ["0","adj","50000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a","100000"]
                }
            },
            {
                "gname": "x2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","0","x1"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","0","x1"]
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
                            "x":"x1",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
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
                "fill": "lightenLess",
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
                            "x":"x2",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"x1"
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
                            "x":"l",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
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
                            "x":"l",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y2"
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
            },
            {
                "extrusionOk": "false",
                "fill": "darken",
                "stroke": "false",
                "paths":[
                    {
                        "pathType":"moveTo",
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
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"x1"
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
                            "x":"x1",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"x1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y2"
                        }
                    },
                    {
                        "pathType":"close"
                    },
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
                            "x":"x1",
                            "y":"x1"
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
                            "x":"l",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x1",
                            "y":"y2"
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
                            "x":"r",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"x1"
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
                            "x":"r",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"x2",
                            "y":"y2"
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
