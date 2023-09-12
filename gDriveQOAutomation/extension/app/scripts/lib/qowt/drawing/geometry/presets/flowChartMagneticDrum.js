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
 * Data for preset shape -- flowChartMagneticDrum
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 16,
        'preset': 'flowChartMagneticDrum',
        'description': 'Flowchart: Direct Access Storage',

        "gdLst": [
            {
                "gname": "x2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","2","3"]
                }
            }
        ],
        "pathLst":[
            {
                "extrusionOk": "false",
                "stroke": "false",
                "h": "6",
                "w": "6",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"1",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"5",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"1",
                        "hr":"3",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"1",
                            "y":"6"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"1",
                        "hr":"3",
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
                "fill": "none",
                "h": "6",
                "w": "6",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"5",
                            "y":"6"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"1",
                        "hr":"3",
                        "stAng":"cd4",
                        "swAng":"cd2"
                    }
                ]
            },
            {
                "fill": "none",
                "h": "6",
                "w": "6",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"1",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"5",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"1",
                        "hr":"3",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"1",
                            "y":"6"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"1",
                        "hr":"3",
                        "stAng":"cd4",
                        "swAng":"cd2"
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
