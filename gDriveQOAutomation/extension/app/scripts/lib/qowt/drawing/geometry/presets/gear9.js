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
 * Data for preset shape -- gear9
 * @author: rahult
 * Date: Mar 25, 2011
 */
define([], function() {

  'use strict';


    var data = {
        "id": 54,
        'preset': 'gear9',
        'description': '', //TODO Find out name

        "avLst": [
            {
                "gname": "adj1",
                "fmla": {
                    "op" : "val",
                    "args" : ["10000"]
                }
            },
            {
                "gname": "adj2",
                "fmla": {
                    "op" : "val",
                    "args" : ["1763"]
                }
            }
        ],
        "gdLst": [
            {
                "gname": "a1",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj1","20000"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "pin",
                    "args" : ["0","adj2","2679"]
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
                "gname": "lFD",
                "fmla": {
                    "op" : "*/",
                    "args" : ["ss","a2","100000"]
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
                "gname": "l2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["lFD","1","2"]
                }
            },
            {
                "gname": "l3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["th2","l2","0"]
                }
            },
            {
                "gname": "rh",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hd2","0","th"]
                }
            },
            {
                "gname": "rw",
                "fmla": {
                    "op" : "+-",
                    "args" : ["wd2","0","th"]
                }
            },
            {
                "gname": "dr",
                "fmla": {
                    "op" : "+-",
                    "args" : ["rw","0","rh"]
                }
            },
            {
                "gname": "maxr",
                "fmla": {
                    "op" : "?:",
                    "args" : ["dr","rh","rw"]
                }
            },
            {
                "gname": "ha",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["maxr","l3"]
                }
            },
            {
                "gname": "aA1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["18600000","0","ha"]
                }
            },
            {
                "gname": "aD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["18600000","ha","0"]
                }
            },
            {
                "gname": "ta11",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA1"]
                }
            },
            {
                "gname": "ta12",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA1"]
                }
            },
            {
                "gname": "bA1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta11","ta12"]
                }
            },
            {
                "gname": "cta1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bA1"]
                }
            },
            {
                "gname": "sta1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bA1"]
                }
            },
            {
                "gname": "ma1",
                "fmla": {
                    "op" : "mod",
                    "args" : ["cta1","sta1","0"]
                }
            },
            {
                "gname": "na1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","ma1"]
                }
            },
            {
                "gname": "dxa1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["na1","bA1"]
                }
            },
            {
                "gname": "dya1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["na1","bA1"]
                }
            },
            {
                "gname": "xA1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxa1","0"]
                }
            },
            {
                "gname": "yA1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dya1","0"]
                }
            },
            {
                "gname": "td11",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD1"]
                }
            },
            {
                "gname": "td12",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD1"]
                }
            },
            {
                "gname": "bD1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td11","td12"]
                }
            },
            {
                "gname": "ctd1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bD1"]
                }
            },
            {
                "gname": "std1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bD1"]
                }
            },
            {
                "gname": "md1",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ctd1","std1","0"]
                }
            },
            {
                "gname": "nd1",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","md1"]
                }
            },
            {
                "gname": "dxd1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["nd1","bD1"]
                }
            },
            {
                "gname": "dyd1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["nd1","bD1"]
                }
            },
            {
                "gname": "xD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxd1","0"]
                }
            },
            {
                "gname": "yD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyd1","0"]
                }
            },
            {
                "gname": "xAD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA1","0","xD1"]
                }
            },
            {
                "gname": "yAD1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA1","0","yD1"]
                }
            },
            {
                "gname": "lAD1",
                "fmla": {
                    "op" : "mod",
                    "args" : ["xAD1","yAD1","0"]
                }
            },
            {
                "gname": "a1",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["yAD1","xAD1"]
                }
            },
            {
                "gname": "dxF1",
                "fmla": {
                    "op" : "sin",
                    "args" : ["lFD","a1"]
                }
            },
            {
                "gname": "dyF1",
                "fmla": {
                    "op" : "cos",
                    "args" : ["lFD","a1"]
                }
            },
            {
                "gname": "xF1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xD1","dxF1","0"]
                }
            },
            {
                "gname": "yF1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yD1","dyF1","0"]
                }
            },
            {
                "gname": "xE1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA1","0","dxF1"]
                }
            },
            {
                "gname": "yE1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA1","0","dyF1"]
                }
            },
            {
                "gname": "yC1t",
                "fmla": {
                    "op" : "sin",
                    "args" : ["th","a1"]
                }
            },
            {
                "gname": "xC1t",
                "fmla": {
                    "op" : "cos",
                    "args" : ["th","a1"]
                }
            },
            {
                "gname": "yC1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF1","yC1t","0"]
                }
            },
            {
                "gname": "xC1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xF1","0","xC1t"]
                }
            },
            {
                "gname": "yB1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yE1","yC1t","0"]
                }
            },
            {
                "gname": "xB1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xE1","0","xC1t"]
                }
            },
            {
                "gname": "aA2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["21000000","0","ha"]
                }
            },
            {
                "gname": "aD2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["21000000","ha","0"]
                }
            },
            {
                "gname": "ta21",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA2"]
                }
            },
            {
                "gname": "ta22",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA2"]
                }
            },
            {
                "gname": "bA2",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta21","ta22"]
                }
            },
            {
                "gname": "cta2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bA2"]
                }
            },
            {
                "gname": "sta2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bA2"]
                }
            },
            {
                "gname": "ma2",
                "fmla": {
                    "op" : "mod",
                    "args" : ["cta2","sta2","0"]
                }
            },
            {
                "gname": "na2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","ma2"]
                }
            },
            {
                "gname": "dxa2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["na2","bA2"]
                }
            },
            {
                "gname": "dya2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["na2","bA2"]
                }
            },
            {
                "gname": "xA2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxa2","0"]
                }
            },
            {
                "gname": "yA2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dya2","0"]
                }
            },
            {
                "gname": "td21",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD2"]
                }
            },
            {
                "gname": "td22",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD2"]
                }
            },
            {
                "gname": "bD2",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td21","td22"]
                }
            },
            {
                "gname": "ctd2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bD2"]
                }
            },
            {
                "gname": "std2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bD2"]
                }
            },
            {
                "gname": "md2",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ctd2","std2","0"]
                }
            },
            {
                "gname": "nd2",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","md2"]
                }
            },
            {
                "gname": "dxd2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["nd2","bD2"]
                }
            },
            {
                "gname": "dyd2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["nd2","bD2"]
                }
            },
            {
                "gname": "xD2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxd2","0"]
                }
            },
            {
                "gname": "yD2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyd2","0"]
                }
            },
            {
                "gname": "xAD2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA2","0","xD2"]
                }
            },
            {
                "gname": "yAD2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA2","0","yD2"]
                }
            },
            {
                "gname": "lAD2",
                "fmla": {
                    "op" : "mod",
                    "args" : ["xAD2","yAD2","0"]
                }
            },
            {
                "gname": "a2",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["yAD2","xAD2"]
                }
            },
            {
                "gname": "dxF2",
                "fmla": {
                    "op" : "sin",
                    "args" : ["lFD","a2"]
                }
            },
            {
                "gname": "dyF2",
                "fmla": {
                    "op" : "cos",
                    "args" : ["lFD","a2"]
                }
            },
            {
                "gname": "xF2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xD2","dxF2","0"]
                }
            },
            {
                "gname": "yF2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yD2","dyF2","0"]
                }
            },
            {
                "gname": "xE2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA2","0","dxF2"]
                }
            },
            {
                "gname": "yE2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA2","0","dyF2"]
                }
            },
            {
                "gname": "yC2t",
                "fmla": {
                    "op" : "sin",
                    "args" : ["th","a2"]
                }
            },
            {
                "gname": "xC2t",
                "fmla": {
                    "op" : "cos",
                    "args" : ["th","a2"]
                }
            },
            {
                "gname": "yC2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF2","yC2t","0"]
                }
            },
            {
                "gname": "xC2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xF2","0","xC2t"]
                }
            },
            {
                "gname": "yB2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yE2","yC2t","0"]
                }
            },
            {
                "gname": "xB2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xE2","0","xC2t"]
                }
            },
            {
                "gname": "swAng1",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bA2","0","bD1"]
                }
            },
            {
                "gname": "aA3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["1800000","0","ha"]
                }
            },
            {
                "gname": "aD3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["1800000","ha","0"]
                }
            },
            {
                "gname": "ta31",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA3"]
                }
            },
            {
                "gname": "ta32",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA3"]
                }
            },
            {
                "gname": "bA3",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta31","ta32"]
                }
            },
            {
                "gname": "cta3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bA3"]
                }
            },
            {
                "gname": "sta3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bA3"]
                }
            },
            {
                "gname": "ma3",
                "fmla": {
                    "op" : "mod",
                    "args" : ["cta3","sta3","0"]
                }
            },
            {
                "gname": "na3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","ma3"]
                }
            },
            {
                "gname": "dxa3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["na3","bA3"]
                }
            },
            {
                "gname": "dya3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["na3","bA3"]
                }
            },
            {
                "gname": "xA3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxa3","0"]
                }
            },
            {
                "gname": "yA3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dya3","0"]
                }
            },
            {
                "gname": "td31",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD3"]
                }
            },
            {
                "gname": "td32",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD3"]
                }
            },
            {
                "gname": "bD3",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td31","td32"]
                }
            },
            {
                "gname": "ctd3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bD3"]
                }
            },
            {
                "gname": "std3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bD3"]
                }
            },
            {
                "gname": "md3",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ctd3","std3","0"]
                }
            },
            {
                "gname": "nd3",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","md3"]
                }
            },
            {
                "gname": "dxd3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["nd3","bD3"]
                }
            },
            {
                "gname": "dyd3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["nd3","bD3"]
                }
            },
            {
                "gname": "xD3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxd3","0"]
                }
            },
            {
                "gname": "yD3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyd3","0"]
                }
            },
            {
                "gname": "xAD3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA3","0","xD3"]
                }
            },
            {
                "gname": "yAD3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA3","0","yD3"]
                }
            },
            {
                "gname": "lAD3",
                "fmla": {
                    "op" : "mod",
                    "args" : ["xAD3","yAD3","0"]
                }
            },
            {
                "gname": "a3",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["yAD3","xAD3"]
                }
            },
            {
                "gname": "dxF3",
                "fmla": {
                    "op" : "sin",
                    "args" : ["lFD","a3"]
                }
            },
            {
                "gname": "dyF3",
                "fmla": {
                    "op" : "cos",
                    "args" : ["lFD","a3"]
                }
            },
            {
                "gname": "xF3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xD3","dxF3","0"]
                }
            },
            {
                "gname": "yF3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yD3","dyF3","0"]
                }
            },
            {
                "gname": "xE3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA3","0","dxF3"]
                }
            },
            {
                "gname": "yE3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA3","0","dyF3"]
                }
            },
            {
                "gname": "yC3t",
                "fmla": {
                    "op" : "sin",
                    "args" : ["th","a3"]
                }
            },
            {
                "gname": "xC3t",
                "fmla": {
                    "op" : "cos",
                    "args" : ["th","a3"]
                }
            },
            {
                "gname": "yC3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF3","yC3t","0"]
                }
            },
            {
                "gname": "xC3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xF3","0","xC3t"]
                }
            },
            {
                "gname": "yB3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yE3","yC3t","0"]
                }
            },
            {
                "gname": "xB3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xE3","0","xC3t"]
                }
            },
            {
                "gname": "swAng2",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bA3","0","bD2"]
                }
            },
            {
                "gname": "aA4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["4200000","0","ha"]
                }
            },
            {
                "gname": "aD4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["4200000","ha","0"]
                }
            },
            {
                "gname": "ta41",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA4"]
                }
            },
            {
                "gname": "ta42",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA4"]
                }
            },
            {
                "gname": "bA4",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta41","ta42"]
                }
            },
            {
                "gname": "cta4",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bA4"]
                }
            },
            {
                "gname": "sta4",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bA4"]
                }
            },
            {
                "gname": "ma4",
                "fmla": {
                    "op" : "mod",
                    "args" : ["cta4","sta4","0"]
                }
            },
            {
                "gname": "na4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","ma4"]
                }
            },
            {
                "gname": "dxa4",
                "fmla": {
                    "op" : "cos",
                    "args" : ["na4","bA4"]
                }
            },
            {
                "gname": "dya4",
                "fmla": {
                    "op" : "sin",
                    "args" : ["na4","bA4"]
                }
            },
            {
                "gname": "xA4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxa4","0"]
                }
            },
            {
                "gname": "yA4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dya4","0"]
                }
            },
            {
                "gname": "td41",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD4"]
                }
            },
            {
                "gname": "td42",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD4"]
                }
            },
            {
                "gname": "bD4",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td41","td42"]
                }
            },
            {
                "gname": "ctd4",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bD4"]
                }
            },
            {
                "gname": "std4",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bD4"]
                }
            },
            {
                "gname": "md4",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ctd4","std4","0"]
                }
            },
            {
                "gname": "nd4",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","md4"]
                }
            },
            {
                "gname": "dxd4",
                "fmla": {
                    "op" : "cos",
                    "args" : ["nd4","bD4"]
                }
            },
            {
                "gname": "dyd4",
                "fmla": {
                    "op" : "sin",
                    "args" : ["nd4","bD4"]
                }
            },
            {
                "gname": "xD4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxd4","0"]
                }
            },
            {
                "gname": "yD4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyd4","0"]
                }
            },
            {
                "gname": "xAD4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA4","0","xD4"]
                }
            },
            {
                "gname": "yAD4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA4","0","yD4"]
                }
            },
            {
                "gname": "lAD4",
                "fmla": {
                    "op" : "mod",
                    "args" : ["xAD4","yAD4","0"]
                }
            },
            {
                "gname": "a4",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["yAD4","xAD4"]
                }
            },
            {
                "gname": "dxF4",
                "fmla": {
                    "op" : "sin",
                    "args" : ["lFD","a4"]
                }
            },
            {
                "gname": "dyF4",
                "fmla": {
                    "op" : "cos",
                    "args" : ["lFD","a4"]
                }
            },
            {
                "gname": "xF4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xD4","dxF4","0"]
                }
            },
            {
                "gname": "yF4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yD4","dyF4","0"]
                }
            },
            {
                "gname": "xE4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA4","0","dxF4"]
                }
            },
            {
                "gname": "yE4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yA4","0","dyF4"]
                }
            },
            {
                "gname": "yC4t",
                "fmla": {
                    "op" : "sin",
                    "args" : ["th","a4"]
                }
            },
            {
                "gname": "xC4t",
                "fmla": {
                    "op" : "cos",
                    "args" : ["th","a4"]
                }
            },
            {
                "gname": "yC4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yF4","yC4t","0"]
                }
            },
            {
                "gname": "xC4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xF4","0","xC4t"]
                }
            },
            {
                "gname": "yB4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yE4","yC4t","0"]
                }
            },
            {
                "gname": "xB4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xE4","0","xC4t"]
                }
            },
            {
                "gname": "swAng3",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bA4","0","bD3"]
                }
            },
            {
                "gname": "aA5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["6600000","0","ha"]
                }
            },
            {
                "gname": "aD5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["6600000","ha","0"]
                }
            },
            {
                "gname": "ta51",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA5"]
                }
            },
            {
                "gname": "ta52",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA5"]
                }
            },
            {
                "gname": "bA5",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta51","ta52"]
                }
            },
            {
                "gname": "td51",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD5"]
                }
            },
            {
                "gname": "td52",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD5"]
                }
            },
            {
                "gname": "bD5",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td51","td52"]
                }
            },
            {
                "gname": "xD5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xA4"]
                }
            },
            {
                "gname": "xC5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xB4"]
                }
            },
            {
                "gname": "xB5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xC4"]
                }
            },
            {
                "gname": "swAng4",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bA5","0","bD4"]
                }
            },
            {
                "gname": "aD6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["9000000","ha","0"]
                }
            },
            {
                "gname": "td61",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD6"]
                }
            },
            {
                "gname": "td62",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD6"]
                }
            },
            {
                "gname": "bD6",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td61","td62"]
                }
            },
            {
                "gname": "xD6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xA3"]
                }
            },
            {
                "gname": "xC6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xB3"]
                }
            },
            {
                "gname": "xB6",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xC3"]
                }
            },
            {
                "gname": "aD7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["11400000","ha","0"]
                }
            },
            {
                "gname": "td71",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD7"]
                }
            },
            {
                "gname": "td72",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD7"]
                }
            },
            {
                "gname": "bD7",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td71","td72"]
                }
            },
            {
                "gname": "xD7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xA2"]
                }
            },
            {
                "gname": "xC7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xB2"]
                }
            },
            {
                "gname": "xB7",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xC2"]
                }
            },
            {
                "gname": "aD8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["13800000","ha","0"]
                }
            },
            {
                "gname": "td81",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD8"]
                }
            },
            {
                "gname": "td82",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD8"]
                }
            },
            {
                "gname": "bD8",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td81","td82"]
                }
            },
            {
                "gname": "xA8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xD1"]
                }
            },
            {
                "gname": "xD8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xA1"]
                }
            },
            {
                "gname": "xC8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xB1"]
                }
            },
            {
                "gname": "xB8",
                "fmla": {
                    "op" : "+-",
                    "args" : ["w","0","xC1"]
                }
            },
            {
                "gname": "aA9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["3cd4","0","ha"]
                }
            },
            {
                "gname": "aD9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["3cd4","ha","0"]
                }
            },
            {
                "gname": "td91",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aD9"]
                }
            },
            {
                "gname": "td92",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aD9"]
                }
            },
            {
                "gname": "bD9",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["td91","td92"]
                }
            },
            {
                "gname": "ctd9",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rh","bD9"]
                }
            },
            {
                "gname": "std9",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rw","bD9"]
                }
            },
            {
                "gname": "md9",
                "fmla": {
                    "op" : "mod",
                    "args" : ["ctd9","std9","0"]
                }
            },
            {
                "gname": "nd9",
                "fmla": {
                    "op" : "*/",
                    "args" : ["rw","rh","md9"]
                }
            },
            {
                "gname": "dxd9",
                "fmla": {
                    "op" : "cos",
                    "args" : ["nd9","bD9"]
                }
            },
            {
                "gname": "dyd9",
                "fmla": {
                    "op" : "sin",
                    "args" : ["nd9","bD9"]
                }
            },
            {
                "gname": "xD9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","dxd9","0"]
                }
            },
            {
                "gname": "yD9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["vc","dyd9","0"]
                }
            },
            {
                "gname": "ta91",
                "fmla": {
                    "op" : "cos",
                    "args" : ["rw","aA9"]
                }
            },
            {
                "gname": "ta92",
                "fmla": {
                    "op" : "sin",
                    "args" : ["rh","aA9"]
                }
            },
            {
                "gname": "bA9",
                "fmla": {
                    "op" : "at2M",
                    "args" : ["ta91","ta92"]
                }
            },
            {
                "gname": "xA9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["hc","0","dxd9"]
                }
            },
            {
                "gname": "xF9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xD9","0","lFD"]
                }
            },
            {
                "gname": "xE9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["xA9","lFD","0"]
                }
            },
            {
                "gname": "yC9",
                "fmla": {
                    "op" : "+-",
                    "args" : ["yD9","0","th"]
                }
            },
            {
                "gname": "swAng5",
                "fmla": {
                    "op" : "+-",
                    "args" : ["bA9","0","bD8"]
                }
            },
            {
                "gname": "xCxn1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["xB1","xC1","2"]
                }
            },
            {
                "gname": "yCxn1",
                "fmla": {
                    "op" : "+/",
                    "args" : ["yB1","yC1","2"]
                }
            },
            {
                "gname": "xCxn2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["xB2","xC2","2"]
                }
            },
            {
                "gname": "yCxn2",
                "fmla": {
                    "op" : "+/",
                    "args" : ["yB2","yC2","2"]
                }
            },
            {
                "gname": "xCxn3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["xB3","xC3","2"]
                }
            },
            {
                "gname": "yCxn3",
                "fmla": {
                    "op" : "+/",
                    "args" : ["yB3","yC3","2"]
                }
            },
            {
                "gname": "xCxn4",
                "fmla": {
                    "op" : "+/",
                    "args" : ["xB4","xC4","2"]
                }
            },
            {
                "gname": "yCxn4",
                "fmla": {
                    "op" : "+/",
                    "args" : ["yB4","yC4","2"]
                }
            },
            {
                "gname": "xCxn5",
                "fmla": {
                    "op" : "+/",
                    "args" : ["r","0","xCxn4"]
                }
            },
            {
                "gname": "xCxn6",
                "fmla": {
                    "op" : "+/",
                    "args" : ["r","0","xCxn3"]
                }
            },
            {
                "gname": "xCxn7",
                "fmla": {
                    "op" : "+/",
                    "args" : ["r","0","xCxn2"]
                }
            },
            {
                "gname": "xCxn8",
                "fmla": {
                    "op" : "+/",
                    "args" : ["r","0","xCxn1"]
                }
            }
        ],
        "pathLst":[
            {
                "paths":[
                    {
                        "pathType":"moveTo",
                        "pt": {
                            "x":"xA1",
                            "y":"yA1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB1",
                            "y":"yB1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC1",
                            "y":"yC1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD1",
                            "y":"yD1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD1",
                        "swAng":"swAng1"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB2",
                            "y":"yB2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC2",
                            "y":"yC2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD2",
                            "y":"yD2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD2",
                        "swAng":"swAng2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB3",
                            "y":"yB3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC3",
                            "y":"yC3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD3",
                            "y":"yD3"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD3",
                        "swAng":"swAng3"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB4",
                            "y":"yB4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC4",
                            "y":"yC4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD4",
                            "y":"yD4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD4",
                        "swAng":"swAng4"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB5",
                            "y":"yC4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC5",
                            "y":"yB4"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD5",
                            "y":"yA4"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD5",
                        "swAng":"swAng3"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB6",
                            "y":"yC3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC6",
                            "y":"yB3"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD6",
                            "y":"yA3"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD6",
                        "swAng":"swAng2"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB7",
                            "y":"yC2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC7",
                            "y":"yB2"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD7",
                            "y":"yA2"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD7",
                        "swAng":"swAng1"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xB8",
                            "y":"yC1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xC8",
                            "y":"yB1"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD8",
                            "y":"yA1"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD8",
                        "swAng":"swAng5"
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xE9",
                            "y":"yC9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xF9",
                            "y":"yC9"
                        }
                    },
                    {
                        "pathType":"lnTo",
                        "pt": {
                            "x":"xD9",
                            "y":"yD9"
                        }
                    },
                    {
                        "pathType":"arcTo",
                        "wr":"rw",
                        "hr":"rh",
                        "stAng":"bD9",
                        "swAng":"swAng5"
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
