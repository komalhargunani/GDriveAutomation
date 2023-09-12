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
 * Data for preset shape -- flowChartMagneticDisk
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 129,
        'preset': 'flowChartMagneticDisk',
        'description': 'Flowchart: Magnetic Disk',

        "gdLst": [
            {
                "gname": "y3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","5","6"]
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
                            "x":"0",
                            "y":"1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"3",
                        "hr":"1",
                        "stAng":"cd2",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"6",
                            "y":"5"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"3",
                        "hr":"1",
                        "stAng":"0",
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
                            "x":"6",
                            "y":"1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"3",
                        "hr":"1",
                        "stAng":"0",
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
                            "x":"0",
                            "y":"1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"3",
                        "hr":"1",
                        "stAng":"cd2",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"6",
                            "y":"5"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"3",
                        "hr":"1",
                        "stAng":"0",
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
