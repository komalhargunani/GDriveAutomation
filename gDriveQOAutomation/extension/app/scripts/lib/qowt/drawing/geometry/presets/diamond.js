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
 * Data for preset shape -- diamond
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 124,
        'preset': 'diamond',
        'description': 'Diamond',

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
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"l",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
                            "y":"t"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"r",
                            "y":"vc"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"hc",
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
