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
 * Data for preset shape -- rtTriangle
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 2,
        'preset': 'rtTriangle',
        'description': 'Right Triangle',

        "gdLst": [
            {
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","7","12"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","7","12"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","11","12"]
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
                        "pathType":"lnTo",
                        "pt": {
                            "x":"l",
                            "y":"t"
                        }
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
