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
 * Data for preset shape -- flowChartOffpageConnector
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 84,
        'preset': 'flowChartOffpageConnector',
        'description': 'Flowchart: Off-page Connector',

        "gdLst": [
            {
                "gname": "y1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","4","5"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "10",
                "w": "10",
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
                            "x":"10",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"10",
                            "y":"8"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"5",
                            "y":"10"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"0",
                            "y":"8"
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
