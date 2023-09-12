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
 * Data for preset shape -- leftCircularArrow
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 119,
        'preset': 'leftCircularArrow',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["12500"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["-1142319"]
                }
            },
            {
                "gname": "adj3",
                "fmla": {
                    "op" : "val",
                    "args" : ["1142319"]
                }
            },
            {
                "gname": "adj4",
                "fmla": {
                    "op" : "val",
                    "args" : ["10800000"]
                }
            },
            {
                "gname": "adj5",
                "fmla": {
                    "op" : "val",
                    "args" : ["12500"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a5",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj5","25000"]
                }
            },
            {
                "gname": "maxAdj1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["a5","2","1"]
                }
            },
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","maxAdj1"]
                }
            },
            {
                "gname": "enAng",
                "fmla": {
                    "op" : "pin",
                    "args" : ["1","adj3","21599999"]
                }
            },
            {
                "gname": "stAng",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj4","21599999"]
                }
            },
            {
                "gname": "th",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a1","100000"]
                }
            },
            {
                "gname": "thh",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a5","100000"]
                }
            },
            {
                "gname": "th2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["th","1","2"]
                }
            },
            {
                "gname": "rw1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","th2","thh"]
                }
            },
            {
                "gname": "rh1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hd2","th2","thh"]
                }
            },
            {
                "gname": "rw2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["rw1","0","th"]
                }
            },
            {
                "gname": "rh2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["rh1","0","th"]
                }
            },
            {
                "gname": "rw3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["rw2","th2","0"]
                }
            },
            {
                "gname": "rh3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["rh2","th2","0"]
                }
            },
            {
                "gname": "wtH",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw3","enAng"]
                }
            },
            {
                "gname": "htH",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh3","enAng"]
                }
            },
            {
                "gname": "dxH",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["rw3","htH","wtH"]
                }
            },
            {
                "gname": "dyH",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["rh3","htH","wtH"]
                }
            },
            {
                "gname": "xH",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxH","0"]
                }
            },
            {
                "gname": "yH",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyH","0"]
                }
            },
            {
                "gname": "rI",
                "fmla": {
                    "op" : "min",
                    "args" : ["rw2","rh2"]
                }
            },
            {
                "gname": "u1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dxH","dxH","1"]
                }
            },
            {
                "gname": "u2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dyH","dyH","1"]
                }
            },
            {
                "gname": "u3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rI","rI","1"]
                }
            },
            {
                "gname": "u4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u1","0","u3"]
                }
            },
            {
                "gname": "u5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u2","0","u3"]
                }
            },
            {
                "gname": "u6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["u4","u5","u1"]
                }
            },
            {
                "gname": "u7",
                "fmla": {
                    "op" : "*/",
                    "args" : ["u6","1","u2"]
                }
            },
            {
                "gname": "u8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["1","0","u7"]
                }
            },
            {
                "gname": "u9",
                "fmla": {
                    "op" : "sqrt",
                    "args" : ["u8"]
                }
            },
            {
                "gname": "u10",
                "fmla": {
                    "op" : "*/",
                    "args" : ["u4","1","dxH"]
                }
            },
            {
                "gname": "u11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["u10","1","dyH"]
                }
            },
            {
                "gname": "u12",
                "fmla": {
                    "op" : "+/",
                    "args" : ["1","u9","u11"]
                }
            },
            {
                "gname": "u13",
                "fmla": {
                    "op" : "at2",
                    "args" : ["1","u12"]
                }
            },
            {
                "gname": "u14",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u13","21600000","0"]
                }
            },
            {
                "gname": "u15",
                "fmla": {
                    "op" : "?:",
                    "args" : ["u13","u13","u14"]
                }
            },
            {
                "gname": "u16",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u15","0","enAng"]
                }
            },
            {
                "gname": "u17",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u16","21600000","0"]
                }
            },
            {
                "gname": "u18",
                "fmla": {
                    "op" : "?:",
                    "args" : ["u16","u16","u17"]
                }
            },
            {
                "gname": "u19",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u18","0","cd2"]
                }
            },
            {
                "gname": "u20",
                "fmla": {
                    "op" : "+-",
                    "args" : ["u18","0","21600000"]
                }
            },
            {
                "gname": "u21",
                "fmla": {
                    "op" : "?:",
                    "args" : ["u19","u20","u18"]
                }
            },
            {
                "gname": "u22",
                "fmla": {
                    "op" : "abs",
                    "args" : ["u21"]
                }
            },
            {
                "gname": "minAng",
                "fmla": {
                    "op" : "*/",
                    "args" : ["u22","-1","1"]
                }
            },
            {
                "gname": "u23",
                "fmla": {
                    "op" : "abs",
                    "args" : ["adj2"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["u23","-1","1"]
                }
            },
            {
                "gname": "aAng",
                "fmla": {
                    "op" : "pin",
                    "args" : ["minAng","a2","0"]
                }
            },
            {
                "gname": "ptAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["enAng","aAng","0"]
                }
            },
            {
                "gname": "wtA",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw3","ptAng"]
                }
            },
            {
                "gname": "htA",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh3","ptAng"]
                }
            },
            {
                "gname": "dxA",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["rw3","htA","wtA"]
                }
            },
            {
                "gname": "dyA",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["rh3","htA","wtA"]
                }
            },
            {
                "gname": "xA",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxA","0"]
                }
            },
            {
                "gname": "yA",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyA","0"]
                }
            },
            {
                "gname": "wtE",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw1","stAng"]
                }
            },
            {
                "gname": "htE",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh1","stAng"]
                }
            },
            {
                "gname": "dxE",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["rw1","htE","wtE"]
                }
            },
            {
                "gname": "dyE",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["rh1","htE","wtE"]
                }
            },
            {
                "gname": "xE",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxE","0"]
                }
            },
            {
                "gname": "yE",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyE","0"]
                }
            },
            {
                "gname": "wtD",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw2","stAng"]
                }
            },
            {
                "gname": "htD",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh2","stAng"]
                }
            },
            {
                "gname": "dxD",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["rw2","htD","wtD"]
                }
            },
            {
                "gname": "dyD",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["rh2","htD","wtD"]
                }
            },
            {
                "gname": "xD",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxD","0"]
                }
            },
            {
                "gname": "yD",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyD","0"]
                }
            },
            {
                "gname": "dxG",
                "fmla": {
                    "op" : "cos",
                    "args" : ["thh","ptAng"]
                }
            },
            {
                "gname": "dyG",
                "fmla": {
                    "op" : "sin",
                    "args" : ["thh","ptAng"]
                }
            },
            {
                "gname": "xG",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xH","dxG","0"]
                }
            },
            {
                "gname": "yG",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yH","dyG","0"]
                }
            },
            {
                "gname": "dxB",
                "fmla": {
                    "op" : "cos",
                    "args" : ["thh","ptAng"]
                }
            },
            {
                "gname": "dyB",
                "fmla": {
                    "op" : "sin",
                    "args" : ["thh","ptAng"]
                }
            },
            {
                "gname": "xB",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xH","0","dxB"]
                }
            },
            {
                "gname": "yB",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yH","0","dyB"]
                }
            },
            {
                "gname": "sx1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xB","0","hc"]
                }
            },
            {
                "gname": "sy1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yB","0","vc"]
                }
            },
            {
                "gname": "sx2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xG","0","hc"]
                }
            },
            {
                "gname": "sy2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yG","0","vc"]
                }
            },
            {
                "gname": "rO",
                "fmla": {
                    "op" : "min",
                    "args" : ["rw1","rh1"]
                }
            },
            {
                "gname": "x1O",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sx1","rO","rw1"]
                }
            },
            {
                "gname": "y1O",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sy1","rO","rh1"]
                }
            },
            {
                "gname": "x2O",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sx2","rO","rw1"]
                }
            },
            {
                "gname": "y2O",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sy2","rO","rh1"]
                }
            },
            {
                "gname": "dxO",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2O","0","x1O"]
                }
            },
            {
                "gname": "dyO",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y2O","0","y1O"]
                }
            },
            {
                "gname": "dO",
                "fmla": {
                    "op" : "mod",
                    "args" : ["dxO","dyO","0"]
                }
            },
            {
                "gname": "q1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x1O","y2O","1"]
                }
            },
            {
                "gname": "q2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x2O","y1O","1"]
                }
            },
            {
                "gname": "DO",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q1","0","q2"]
                }
            },
            {
                "gname": "q3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rO","rO","1"]
                }
            },
            {
                "gname": "q4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dO","dO","1"]
                }
            },
            {
                "gname": "q5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q3","q4","1"]
                }
            },
            {
                "gname": "q6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["DO","DO","1"]
                }
            },
            {
                "gname": "q7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q5","0","q6"]
                }
            },
            {
                "gname": "q8",
                "fmla": {
                    "op" : "max",
                    "args" : ["q7","0"]
                }
            },
            {
                "gname": "sdelO",
                "fmla": {
                    "op" : "sqrt",
                    "args" : ["q8"]
                }
            },
            {
                "gname": "ndyO",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dyO","-1","1"]
                }
            },
            {
                "gname": "sdyO",
                "fmla": {
                    "op" : "?:",
                    "args" : ["ndyO","-1","1"]
                }
            },
            {
                "gname": "q9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sdyO","dxO","1"]
                }
            },
            {
                "gname": "q10",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q9","sdelO","1"]
                }
            },
            {
                "gname": "q11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["DO","dyO","1"]
                }
            },
            {
                "gname": "dxF1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["q11","q10","q4"]
                }
            },
            {
                "gname": "q12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q11","0","q10"]
                }
            },
            {
                "gname": "dxF2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q12","1","q4"]
                }
            },
            {
                "gname": "adyO",
                "fmla": {
                    "op" : "abs",
                    "args" : ["dyO"]
                }
            },
            {
                "gname": "q13",
                "fmla": {
                    "op" : "*/",
                    "args" : ["adyO","sdelO","1"]
                }
            },
            {
                "gname": "q14",
                "fmla": {
                    "op" : "*/",
                    "args" : ["DO","dxO","-1"]
                }
            },
            {
                "gname": "dyF1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["q14","q13","q4"]
                }
            },
            {
                "gname": "q15",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q14","0","q13"]
                }
            },
            {
                "gname": "dyF2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["q15","1","q4"]
                }
            },
            {
                "gname": "q16",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2O","0","dxF1"]
                }
            },
            {
                "gname": "q17",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2O","0","dxF2"]
                }
            },
            {
                "gname": "q18",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y2O","0","dyF1"]
                }
            },
            {
                "gname": "q19",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y2O","0","dyF2"]
                }
            },
            {
                "gname": "q20",
                "fmla": {
                    "op" : "mod",
                    "args" : ["q16","q18","0"]
                }
            },
            {
                "gname": "q21",
                "fmla": {
                    "op" : "mod",
                    "args" : ["q17","q19","0"]
                }
            },
            {
                "gname": "q22",
                "fmla": {
                    "op" : "+-",
                    "args" : ["q21","0","q20"]
                }
            },
            {
                "gname": "dxF",
                "fmla": {
                    "op" : "?:",
                    "args" : ["q22","dxF1","dxF2"]
                }
            },
            {
                "gname": "dyF",
                "fmla": {
                    "op" : "?:",
                    "args" : ["q22","dyF1","dyF2"]
                }
            },
            {
                "gname": "sdxF",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dxF","rw1","rO"]
                }
            },
            {
                "gname": "sdyF",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dyF","rh1","rO"]
                }
            },
            {
                "gname": "xF",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdxF","0"]
                }
            },
            {
                "gname": "yF",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdyF","0"]
                }
            },
            {
                "gname": "x1I",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sx1","rI","rw2"]
                }
            },
            {
                "gname": "y1I",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sy1","rI","rh2"]
                }
            },
            {
                "gname": "x2I",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sx2","rI","rw2"]
                }
            },
            {
                "gname": "y2I",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sy2","rI","rh2"]
                }
            },
            {
                "gname": "dxI",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x2I","0","x1I"]
                }
            },
            {
                "gname": "dyI",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y2I","0","y1I"]
                }
            },
            {
                "gname": "dI",
                "fmla": {
                    "op" : "mod",
                    "args" : ["dxI","dyI","0"]
                }
            },
            {
                "gname": "v1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x1I","y2I","1"]
                }
            },
            {
                "gname": "v2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["x2I","y1I","1"]
                }
            },
            {
                "gname": "DI",
                "fmla": {
                    "op" : "+-",
                    "args" : ["v1","0","v2"]
                }
            },
            {
                "gname": "v3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rI","rI","1"]
                }
            },
            {
                "gname": "v4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dI","dI","1"]
                }
            },
            {
                "gname": "v5",
                "fmla": {
                    "op" : "*/",
                    "args" : ["v3","v4","1"]
                }
            },
            {
                "gname": "v6",
                "fmla": {
                    "op" : "*/",
                    "args" : ["DI","DI","1"]
                }
            },
            {
                "gname": "v7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["v5","0","v6"]
                }
            },
            {
                "gname": "v8",
                "fmla": {
                    "op" : "max",
                    "args" : ["v7","0"]
                }
            },
            {
                "gname": "sdelI",
                "fmla": {
                    "op" : "sqrt",
                    "args" : ["v8"]
                }
            },
            {
                "gname": "v9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["sdyO","dxI","1"]
                }
            },
            {
                "gname": "v10",
                "fmla": {
                    "op" : "*/",
                    "args" : ["v9","sdelI","1"]
                }
            },
            {
                "gname": "v11",
                "fmla": {
                    "op" : "*/",
                    "args" : ["DI","dyI","1"]
                }
            },
            {
                "gname": "dxC1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["v11","v10","v4"]
                }
            },
            {
                "gname": "v12",
                "fmla": {
                    "op" : "+-",
                    "args" : ["v11","0","v10"]
                }
            },
            {
                "gname": "dxC2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["v12","1","v4"]
                }
            },
            {
                "gname": "adyI",
                "fmla": {
                    "op" : "abs",
                    "args" : ["dyI"]
                }
            },
            {
                "gname": "v13",
                "fmla": {
                    "op" : "*/",
                    "args" : ["adyI","sdelI","1"]
                }
            },
            {
                "gname": "v14",
                "fmla": {
                    "op" : "*/",
                    "args" : ["DI","dxI","-1"]
                }
            },
            {
                "gname": "dyC1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["v14","v13","v4"]
                }
            },
            {
                "gname": "v15",
                "fmla": {
                    "op" : "+-",
                    "args" : ["v14","0","v13"]
                }
            },
            {
                "gname": "dyC2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["v15","1","v4"]
                }
            },
            {
                "gname": "v16",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x1I","0","dxC1"]
                }
            },
            {
                "gname": "v17",
                "fmla": {
                    "op" : "+-",
                    "args" : ["x1I","0","dxC2"]
                }
            },
            {
                "gname": "v18",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y1I","0","dyC1"]
                }
            },
            {
                "gname": "v19",
                "fmla": {
                    "op" : "+-",
                    "args" : ["y1I","0","dyC2"]
                }
            },
            {
                "gname": "v20",
                "fmla": {
                    "op" : "mod",
                    "args" : ["v16","v18","0"]
                }
            },
            {
                "gname": "v21",
                "fmla": {
                    "op" : "mod",
                    "args" : ["v17","v19","0"]
                }
            },
            {
                "gname": "v22",
                "fmla": {
                    "op" : "+-",
                    "args" : ["v21","0","v20"]
                }
            },
            {
                "gname": "dxC",
                "fmla": {
                    "op" : "?:",
                    "args" : ["v22","dxC1","dxC2"]
                }
            },
            {
                "gname": "dyC",
                "fmla": {
                    "op" : "?:",
                    "args" : ["v22","dyC1","dyC2"]
                }
            },
            {
                "gname": "sdxC",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dxC","rw2","rI"]
                }
            },
            {
                "gname": "sdyC",
                "fmla": {
                    "op" : "*/",
                    "args" : ["dyC","rh2","rI"]
                }
            },
            {
                "gname": "xC",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","sdxC","0"]
                }
            },
            {
                "gname": "yC",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","sdyC","0"]
                }
            },
            {
                "gname": "ist0",
                "fmla": {
                    "op" : "at2",
                    "args" : ["sdxC","sdyC"]
                }
            },
            {
                "gname": "ist1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ist0","21600000","0"]
                }
            },
            {
                "gname": "istAng0",
                "fmla": {
                    "op" : "?:",
                    "args" : ["ist0","ist0","ist1"]
                }
            },
            {
                "gname": "isw1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["stAng","0","istAng0"]
                }
            },
            {
                "gname": "isw2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["isw1","21600000","0"]
                }
            },
            {
                "gname": "iswAng0",
                "fmla": {
                    "op" : "?:",
                    "args" : ["isw1","isw1","isw2"]
                }
            },
            {
                "gname": "istAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["istAng0","iswAng0","0"]
                }
            },
            {
                "gname": "iswAng",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","0","iswAng0"]
                }
            },
            {
                "gname": "p1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xF","0","xC"]
                }
            },
            {
                "gname": "p2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF","0","yC"]
                }
            },
            {
                "gname": "p3",
                "fmla": {
                    "op" : "mod",
                    "args" : ["p1","p2","0"]
                }
            },
            {
                "gname": "p4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["p3","1","2"]
                }
            },
            {
                "gname": "p5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["p4","0","thh"]
                }
            },
            {
                "gname": "xGp",
                "fmla": {
                    "op" : "?:",
                    "args" : ["p5","xF","xG"]
                }
            },
            {
                "gname": "yGp",
                "fmla": {
                    "op" : "?:",
                    "args" : ["p5","yF","yG"]
                }
            },
            {
                "gname": "xBp",
                "fmla": {
                    "op" : "?:",
                    "args" : ["p5","xC","xB"]
                }
            },
            {
                "gname": "yBp",
                "fmla": {
                    "op" : "?:",
                    "args" : ["p5","yC","yB"]
                }
            },
            {
                "gname": "en0",
                "fmla": {
                    "op" : "at2",
                    "args" : ["sdxF","sdyF"]
                }
            },
            {
                "gname": "en1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["en0","21600000","0"]
                }
            },
            {
                "gname": "en2",
                "fmla": {
                    "op" : "?:",
                    "args" : ["en0","en0","en1"]
                }
            },
            {
                "gname": "sw0",
                "fmla": {
                    "op" : "+-",
                    "args" : ["en2","0","stAng"]
                }
            },
            {
                "gname": "sw1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["sw0","0","21600000"]
                }
            },
            {
                "gname": "swAng",
                "fmla": {
                    "op" : "?:",
                    "args" : ["sw0","sw1","sw0"]
                }
            },
            {
                "gname": "stAng0",
                "fmla": {
                    "op" : "+-",
                    "args" : ["stAng","swAng","0"]
                }
            },
            {
                "gname": "swAng0",
                "fmla": {
                    "op" : "+-",
                    "args" : ["0","0","swAng"]
                }
            },
            {
                "gname": "wtI",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw3","stAng"]
                }
            },
            {
                "gname": "htI",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh3","stAng"]
                }
            },
            {
                "gname": "dxII",
                "fmla": {
                    "op" : "cat2",
                    "args" : ["rw3","htI","wtI"]
                }
            },
            {
                "gname": "dyII",
                "fmla": {
                    "op" : "sat2",
                    "args" : ["rh3","htI","wtI"]
                }
            },
            {
                "gname": "xI",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxII","0"]
                }
            },
            {
                "gname": "yI",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyII","0"]
                }
            },
            {
                "gname": "aI",
                "fmla": {
                    "op" : "+-",
                    "args" : ["stAng","cd4","0"]
                }
            },
            {
                "gname": "aA",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ptAng","0","cd4"]
                }
            },
            {
                "gname": "aB",
                "fmla": {
                    "op" : "+-",
                    "args" : ["ptAng","cd2","0"]
                }
            },
            {
                "gname": "idx",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw1","2700000"]
                }
            },
            {
                "gname": "idy",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh1","2700000"]
                }
            },
            {
                "gname": "il",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","idx"]
                }
            },
            {
                "gname": "ir",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","idx","0"]
                }
            },
            {
                "gname": "it",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","0","idy"]
                }
            },
            {
                "gname": "ib",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","idy","0"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"xE",
                            "y":"yE"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD",
                            "y":"yD"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw2",
                        "hr":"rh2",
                        "stAng":"istAng",
                        "swAng":"iswAng"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xBp",
                            "y":"yBp"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xA",
                            "y":"yA"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xGp",
                            "y":"yGp"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xF",
                            "y":"yF"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw1",
                        "hr":"rh1",
                        "stAng":"stAng0",
                        "swAng":"swAng0"
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
