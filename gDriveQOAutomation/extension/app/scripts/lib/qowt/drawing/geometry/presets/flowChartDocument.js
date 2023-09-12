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
 * Data for preset shape -- flowChartDocument
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 43,
        'preset': 'flowChartDocument',
        'description': 'Flowchart: Document',

        "gdLst": [
            {
                "gname": "y1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","17322","21600"]
                }
            },
            {
                "gname": "y2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","20172","21600"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "21600",
                "w": "21600",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"0",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"21600",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"21600",
                            "y":"17322"
                        }
                    },
                    {
                        "pathType":"cubicBezTo",
                        "pts" : [
                            {
                                "x":"10800",
                                "y":"17322"
                            },
                            {
                                "x":"10800",
                                "y":"23922"
                            },
                            {
                                "x":"0",
                                "y":"20172"
                            }
                        ]
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
