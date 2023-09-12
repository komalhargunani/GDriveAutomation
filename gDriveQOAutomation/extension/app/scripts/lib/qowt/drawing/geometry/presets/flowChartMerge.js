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
 * Data for preset shape -- flowChartMerge
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 97,
        'preset': 'flowChartMerge',
        'description': 'Flowchart: Merge',

        "gdLst": [
            {
                "gname": "x2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","3","4"]
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
                            "y":"2"
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
