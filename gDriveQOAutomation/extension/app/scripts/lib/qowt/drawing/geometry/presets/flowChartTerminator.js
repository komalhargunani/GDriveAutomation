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
 * Data for preset shape -- flowChartTerminator
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 132,
        'preset': 'flowChartTerminator',
        'description': 'Flowchart: Terminator',

        "gdLst": [
            {
                "gname": "il",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","1018","21600"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","20582","21600"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","3163","21600"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","18437","21600"]
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
                            "x":"3475",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"18125",
                            "y":"0"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"3475",
                        "hr":"10800",
                        "stAng":"3cd4",
                        "swAng":"cd2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"3475",
                            "y":"21600"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"3475",
                        "hr":"10800",
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
