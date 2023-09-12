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
 * Data for preset shape -- flowChartInputOutput
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 101,
        'preset': 'flowChartInputOutput',
        'description': 'Flowchart: Data',

        "gdLst": [
            {
                "gname": "x3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","2","5"]
                }
            },
            {
                "gname": "x4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","3","5"]
                }
            },
            {
                "gname": "x5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","4","5"]
                }
            },
            {
                "gname": "x6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","9","10"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "5",
                "w": "5",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"0",
                            "y":"5"
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"4",
                            "y":"5"
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
