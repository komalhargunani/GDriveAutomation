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
 * Data for preset shape -- flowChartCollate
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 94,
        'preset': 'flowChartCollate',
        'description': 'Flowchart: Collate',

        "gdLst": [
            {
                "gname": "ir",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","3","4"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","3","4"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "2",
                "w": "2",
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
                            "x":"2",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"1",
                            "y":"1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"2",
                            "y":"2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"0",
                            "y":"2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"1",
                            "y":"1"
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
