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
 * Data for preset shape -- flowChartPunchedTape
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 181,
        'preset': 'flowChartPunchedTape',
        'description': 'Flowchart: Punched Tape',

        "gdLst": [
            {
                "gname": "y2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","9","10"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","4","5"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "20",
                "w": "20",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"0",
                            "y":"2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"5",
                        "hr":"2",
                        "stAng":"cd2",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"5",
                        "hr":"2",
                        "stAng":"cd2",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"20",
                            "y":"18"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"5",
                        "hr":"2",
                        "stAng":"0",
                        "swAng":"-10800000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"5",
                        "hr":"2",
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
