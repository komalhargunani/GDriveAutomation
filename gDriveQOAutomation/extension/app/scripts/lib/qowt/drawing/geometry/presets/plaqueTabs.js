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
 * Data for preset shape -- plaqueTabs
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 20,
        'preset': 'plaqueTabs',
        'description': '', //TODO Find out name

        "gdLst": [
            {
                "gname": "md",
                "fmla": {
                    "op" : "mod",
                    "args" : ["w","h","0"]
                }
            },
            {
                "gname": "dx",
                "fmla": {
                    "op" : "*/",
                    "args" : ["1","md","20"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","b","dx"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","r","dx"]
                }
            }
        ],
        "pathLst":[
            {
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
                            "x":"dx",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"dx",
                        "hr":"dx",
                        "stAng":"0",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"y1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"dx",
                        "hr":"dx",
                        "stAng":"3cd4",
                        "swAng":"cd4"
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
                            "y":"dx"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"dx",
                        "hr":"dx",
                        "stAng":"cd4",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x1",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"dx",
                        "hr":"dx",
                        "stAng":"cd2",
                        "swAng":"cd4"
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
            }
        ]
    };

	return data;
});
