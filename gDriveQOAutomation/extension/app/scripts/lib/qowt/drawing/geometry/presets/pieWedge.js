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
 * Data for preset shape -- pieWedge
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 133,
        'preset': 'pieWedge',
        'description': '', //TODO Find out name

        "gdLst": [
            {
                "gname": "g1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["w","13500000"]
                }
            },
            {
                "gname": "g2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["h","13500000"]
                }
            },
            {
                "gname": "x1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["r","g1","0"]
                }
            },
            {
                "gname": "y1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["b","g2","0"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"b"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"w",
                        "hr":"h",
                        "stAng":"cd2",
                        "swAng":"cd4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"b"
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
