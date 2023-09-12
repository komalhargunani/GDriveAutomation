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
 * Data for preset shape -- flowChartDisplay
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 165,
        'preset': 'flowChartDisplay',
        'description': 'Flowchart: Display',

        "gdLst": [
            {
                "gname": "x2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","5","6"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "6",
                "w": "6",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"0",
                            "y":"3"
                        }
                    },
                    {
                        "pathType":"lnTo",
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
                        "pathType":"close"
                    }
                ]
            }
        ]
    };

	return data;
});
