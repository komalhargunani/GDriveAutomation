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
 * Data for preset shape -- cloudCallout
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 35,
        'preset': 'cloudCallout',
        'description': 'Cloud Callout',

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["-20833"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["62500"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "dxPos",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","adj1","100000"]
                }
            },
            {
                "gname": "dyPos",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","adj2","100000"]
                }
            },
            {
                "gname": "xPos",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxPos","0"]
                }
            },
            {
                "gname": "yPos",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyPos","0"]
                }
            },
            {
                "gname": "ht",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["hd2","dxPos","dyPos"]
                }
            },
            {
                "gname": "wt",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["wd2","dxPos","dyPos"]
                }
            },
            {
                "gname": "g2",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["wd2","ht","wt"]
                }
            },
            {
                "gname": "g3",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["hd2","ht","wt"]
                }
            },
            {
                "gname": "g4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","g2","0"]
                }
            },
            {
                "gname": "g5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","g3","0"]
                }
            },
            {
                "gname": "g6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g4","0","xPos"]
                }
            },
            {
                "gname": "g7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g5","0","yPos"]
                }
            },
            {
                "gname": "g8",
                "fmla": {
                    "op" : "mod",
                    "args" : ["g6","g7","0"]
                }
            },
            {
                "gname": "g9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","6600","21600"]
                }
            },
            {
                "gname": "g10",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g8","0","g9"]
                }
            },
            {
                "gname": "g11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g10","1","3"]
                }
            },
            {
                "gname": "g12",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","1800","21600"]
                }
            },
            {
                "gname": "g13",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g11","g12","0"]
                }
            },
            {
                "gname": "g14",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","g6","g8"]
                }
            },
            {
                "gname": "g15",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g13","g7","g8"]
                }
            },
            {
                "gname": "g16",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g14","xPos","0"]
                }
            },
            {
                "gname": "g17",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g15","yPos","0"]
                }
            },
            {
                "gname": "g18",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","4800","21600"]
                }
            },
            {
                "gname": "g19",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g11","2","1"]
                }
            },
            {
                "gname": "g20",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g18","g19","0"]
                }
            },
            {
                "gname": "g21",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g20","g6","g8"]
                }
            },
            {
                "gname": "g22",
                "fmla": {
                    "op" : "*/",
                    "args" : ["g20","g7","g8"]
                }
            },
            {
                "gname": "g23",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g21","xPos","0"]
                }
            },
            {
                "gname": "g24",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g22","yPos","0"]
                }
            },
            {
                "gname": "g25",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","1200","21600"]
                }
            },
            {
                "gname": "g26",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","600","21600"]
                }
            },
            {
                "gname": "x23",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xPos","g26","0"]
                }
            },
            {
                "gname": "x24",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g16","g25","0"]
                }
            },
            {
                "gname": "x25",
                "fmla": {
                    "op" : "+-",
                    "args" : ["g23","g12","0"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","2977","21600"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","3262","21600"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","17087","21600"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","17337","21600"]
                }
            },
            {
                "gname": "g27",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","67","21600"]
                }
            },
            {
                "gname": "g28",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","21577","21600"]
                }
            },
            {
                "gname": "g29",
                "fmla": {
                    "op" : "*/",
                    "args" : ["w","21582","21600"]
                }
            },
            {
                "gname": "g30",
                "fmla": {
                    "op" : "*/",
                    "args" : ["h","1235","21600"]
                }
            },
            {
                "gname": "pang",
                "fmla": {
                    "op" : "at2",
                    "args" : ["dxPos","dyPos"]
                }
            }
        ],
        "pathLst":[
            {
                "h": "43200",
                "w": "43200",
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"3900",
                            "y":"14370"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"6753",
                        "hr":"9190",
                        "stAng":"-11429249",
                        "swAng":"7426832"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"5333",
                        "hr":"7267",
                        "stAng":"-8646143",
                        "swAng":"5396714"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"4365",
                        "hr":"5945",
                        "stAng":"-8748475",
                        "swAng":"5983381"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"4857",
                        "hr":"6595",
                        "stAng":"-7859164",
                        "swAng":"7034504"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"5333",
                        "hr":"7273",
                        "stAng":"-4722533",
                        "swAng":"6541615"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"6775",
                        "hr":"9220",
                        "stAng":"-2776035",
                        "swAng":"7816140"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"5785",
                        "hr":"7867",
                        "stAng":"37501",
                        "swAng":"6842000"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"6752",
                        "hr":"9215",
                        "stAng":"1347096",
                        "swAng":"6910353"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"7720",
                        "hr":"10543",
                        "stAng":"3974558",
                        "swAng":"4542661"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"4360",
                        "hr":"5918",
                        "stAng":"-16496525",
                        "swAng":"8804134"
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"4345",
                        "hr":"5945",
                        "stAng":"-14809710",
                        "swAng":"9151131"
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x23",
                            "y":"yPos"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g26",
                        "hr":"g26",
                        "stAng":"0",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x24",
                            "y":"g17"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g25",
                        "hr":"g25",
                        "stAng":"0",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    }
                ]
            },
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"x25",
                            "y":"g24"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"g12",
                        "hr":"g12",
                        "stAng":"0",
                        "swAng":"21600000"
                    },
                    {
                        "pathType":"close"
                    }
                ]
            }
// TODO remove these comments once we find the fix for this.
// ,
//            {
//                "extrusionOk": "false",
//                "fill": "none",
//                "h": "43200",
//                "w": "43200",
//                "paths":[
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"4693",
//                            "y":"26177"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"4345",
//                        "hr":"5945",
//                        "stAng":"5204520",
//                        "swAng":"1585770"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"6928",
//                            "y":"34899"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"4360",
//                        "hr":"5918",
//                        "stAng":"4416628",
//                        "swAng":"686848"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"16478",
//                            "y":"39090"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"6752",
//                        "hr":"9215",
//                        "stAng":"8257449",
//                        "swAng":"844866"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"28827",
//                            "y":"34751"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"6752",
//                        "hr":"9215",
//                        "stAng":"387196",
//                        "swAng":"959901"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"34129",
//                            "y":"22954"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"5785",
//                        "hr":"7867",
//                        "stAng":"-4217541",
//                        "swAng":"4255042"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"41798",
//                            "y":"15354"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"5333",
//                        "hr":"7273",
//                        "stAng":"1819082",
//                        "swAng":"1665090"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"38324",
//                            "y":"5426"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"4857",
//                        "hr":"6595",
//                        "stAng":"-824660",
//                        "swAng":"891534"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"29078",
//                            "y":"3952"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"4857",
//                        "hr":"6595",
//                        "stAng":"-8950887",
//                        "swAng":"1091722"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"22141",
//                            "y":"4720"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"4365",
//                        "hr":"5945",
//                        "stAng":"-9809656",
//                        "swAng":"1061181"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"14000",
//                            "y":"5192"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"6753",
//                        "hr":"9190",
//                        "stAng":"-4002417",
//                        "swAng":"739161"
//                    },
//                    {
//                        "pathType":"moveTo",
//                        "pt": {
//                            "x":"4127",
//                            "y":"15789"
//                        }
//                    },
//                    {
//                        "pathType":"arcTo",
//                        "wr":"6753",
//                        "hr":"9190",
//                        "stAng":"9459261",
//                        "swAng":"711490"
//                    }
//                ]
//            }
        ]
    };

	return data;
});
