/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

// add use strict here because this file doesn't follow the standard 
// define() pattern of our other JS files
'use strict';

var TESTSHEETDATA = {};
TESTSHEETDATA.fakeGetRowRangeResponse = [];
TESTSHEETDATA.rowIndex = 0;

// ignore JSL warnings about new lines being ambiguous
/*jsl:ignore*/
TESTSHEETDATA.fakeGetRowRangeResponse.push(
    FIXTURES.response('update')
    .addChild(FIXTURES.gridRowRangeElement(0, 19)
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex) 
            .addChild(FIXTURES.gridCellElement(0, "cell 0"))
            .addChild(FIXTURES.gridCellElement(1, "cell 1"))
            .addChild(FIXTURES.gridCellElement(2, "cell 2"))
            .addChild(FIXTURES.gridCellElement(4, "cell 4"))
            .addChild(FIXTURES.gridCellElement(7, "cell 7"))
            .addChild(FIXTURES.gridCellElement(8, "cell 8"))
            .addChild(FIXTURES.gridCellElement(9, "cell 9"))
            .addChild(FIXTURES.gridCellElement(12, "cell 12"))
            .addChild(FIXTURES.gridCellElement(19, "cell 19"))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) 
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++)
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++, 30)
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++, 40)
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++, 50) // 5
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++, 60)
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++)
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 8
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 9
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 10
            .addChild(FIXTURES.gridCellElementStyled(0, "cell 0", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell 1", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell 2", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell 4", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell 7", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell 8", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell 9", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell 12", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "cell 19", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 11
            .addChild(FIXTURES.gridCellElementStyled(0, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(3, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(5, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(6, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(10, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(11, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(13, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(14, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(15, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(16, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(17, "cell", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 12
            .addChild(FIXTURES.gridCellElementStyled(0, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(1, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(2, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(4, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(7, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(8, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(9, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(12, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
            .addChild(FIXTURES.gridCellElementStyled(19, "", undefined,
      {fontIndex:0, fontSize:12, isBold:true}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 13
            .addChild(FIXTURES.gridCellElementAligned(0, "aligned 0", "c", "c"))
            .addChild(FIXTURES.gridCellElementAligned(1, "aligned 1", "c", "t"))
            .addChild(FIXTURES.gridCellElementAligned(2, "aligned 2", "c", "b"))
            .addChild(FIXTURES.gridCellElementAligned(4, "aligned 4", "l", "c"))
            .addChild(FIXTURES.gridCellElementAligned(7, "aligned 7", "l", "t"))
            .addChild(FIXTURES.gridCellElementAligned(8, "aligned 8", "l", "b"))
            .addChild(FIXTURES.gridCellElementAligned(9, "aligned 9", "r", "c"))
            .addChild(FIXTURES.gridCellElementAligned(12, "aligned 12", "r", "t"))
            .addChild(FIXTURES.gridCellElementAligned(19, "aligned 19", "r", "b"))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) //14
            .addChild(FIXTURES.gridCellElementBordered(0, "cell 0",
      {color:'000000'}, {color:'000000'}, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(1, "cell 1",
      {color:'00FF00'}, {color:'00FF00'}, {color:'00FF00'}, {color:'00FF00'}))
            .addChild(FIXTURES.gridCellElementBordered(2, "cell 2",
      {color:'0000FF'}, {color:'0000FF'}, {color:'0000FF'}, {color:'0000FF'}))
            .addChild(FIXTURES.gridCellElementBordered(4, "cell 4",
      {color:'FF0000'}, {color:'FF0000'}, {color:'FF0000'}, {color:'FF0000'}))
            .addChild(FIXTURES.gridCellElementBordered(7, "cell 7",
      {color:'FF0000'}, {color:'FF0000'}, {color:'FF0000'}, {color:'FF0000'}))
            .addChild(FIXTURES.gridCellElementBordered(8, "cell 8",
      {color:'0000FF'}, {color:'0000FF'}, {color:'0000FF'}, {color:'0000FF'}))
            .addChild(FIXTURES.gridCellElementBordered(9, "cell 9",
      {color:'00FF00'}, {color:'00FF00'}, {color:'00FF00'}, {color:'00FF00'}))
            .addChild(FIXTURES.gridCellElementBordered(12, "cell 12",
      {color:'00FFFF'}, {color:'00FFFF'}, {color:'00FFFF'}, {color:'00FFFF'}))
            .addChild(FIXTURES.gridCellElementBordered(19, "cell 19",
      {color:'000000'}, {color:'000000'}, {color:'000000'}, {color:'000000'}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 15
            .addChild(FIXTURES.gridCellElementBordered(0, "cell 0",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(1, "cell 1",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(2, "cell 2",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(3, "cell 3",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(4, "cell 4",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(5, "cell 5",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(6, "cell 6",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(7, "cell 7",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(8, "cell 8",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(9, "cell 9",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(10, "cell 10",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(11, "cell 11",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(12, "cell 12",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(13, "cell 13",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(14, "cell 14",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(15, "cell 15",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(16, "cell 16",
      {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(17, "cell 17",
      {color:'000000', style:'dashed'}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 16
            .addChild(FIXTURES.gridCellElementBordered(0, "cell 0", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(1, "cell 1", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(2, "cell 2", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(3, "cell 3", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(4, "cell 4", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(5, "cell 5", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(6, "cell 6", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(7, "cell 7", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(8, "cell 8", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(9, "cell 9", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(10, "cell 10", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(11, "cell 11", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(12, "cell 12", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(13, "cell 13", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(14, "cell 14", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(15, "cell 15", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(16, "cell 16", undefined,
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(17, "cell 17", undefined,
      {color:'000000', width:'thick'}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 17
            .addChild(FIXTURES.gridCellElementBordered(0, "cell 0", undefined,
      undefined, {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(1, "cell 1", undefined,
      undefined, {color:'000000', width:'thin'}))
            .addChild(FIXTURES.gridCellElementBordered(2, "cell 2", undefined,
      undefined, {color:'000000', width:'medium'}))
            .addChild(FIXTURES.gridCellElementBordered(3, "cell 3", undefined,
      undefined, {color:'000000', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(4, "cell 4", undefined,
      undefined, {color:'000000', style:'dotted'}))
            .addChild(FIXTURES.gridCellElementBordered(5, "cell 5", undefined,
      undefined, {color:'000000', width:'thick', style:'dotted'}))
            .addChild(FIXTURES.gridCellElementBordered(6, "cell 6", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'}))
            .addChild(FIXTURES.gridCellElementBordered(7, "cell 7", undefined,
      undefined, {color:'000000', width:'medium', style:'dotted'}))
            .addChild(FIXTURES.gridCellElementBordered(8, "cell 8", undefined,
      undefined, {color:'000000', width:'thick', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(9, "cell 9", undefined,
      undefined, {color:'000000', width:'thin', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(10, "cell 10", undefined,
      undefined, {color:'000000', width:'medium', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(11, "cell 11", undefined,
      undefined, {color:'000000', width:'thick', style:'solid'}))
            .addChild(FIXTURES.gridCellElementBordered(12, "cell 12", undefined,
      undefined, {color:'000000', width:'thin', style:'solid'}))
            .addChild(FIXTURES.gridCellElementBordered(13, "cell 13", undefined,
      undefined, {color:'000000', width:'medium', style:'solid'}))
            .addChild(FIXTURES.gridCellElementBordered(14, "cell 14", undefined,
      undefined, {color:'000000', width:'thick', style:'dotted'}))
            .addChild(FIXTURES.gridCellElementBordered(15, "cell 15", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'}))
            .addChild(FIXTURES.gridCellElementBordered(16, "cell 16", undefined,
      undefined, {color:'000000', width:'medium', style:'dotted'}))
            .addChild(FIXTURES.gridCellElementBordered(17, "cell 17", undefined,
      undefined, {color:'000000'}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) // 18
            .addChild(FIXTURES.gridCellElementBordered(0, "cell 0", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(1, "cell 1", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(2, "cell 2", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(3, "cell 3", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(4, "cell 4", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(5, "cell 5", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(6, "cell 6", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(7, "cell 7", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(8, "cell 8", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(9, "cell 9", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(10, "cell 10", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(11, "cell 11", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(12, "cell 12", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(13, "cell 13", undefined,
      undefined, {color:'000000', width:'thin', style:'dotted'},
      {color:'000000', width:'thick', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(14, "cell 14", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick', style:'dashed'}))
            .addChild(FIXTURES.gridCellElementBordered(15, "cell 15", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(16, "cell 16", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
            .addChild(FIXTURES.gridCellElementBordered(17, "cell 17", undefined,
      undefined, {color:'000000', width:'thin'},
      {color:'000000', width:'thick'}))
        )
        .addChild(FIXTURES.gridRowElement(TESTSHEETDATA.rowIndex++) //19
            .addChild(FIXTURES.gridCellElementBordered(0, "cell 0", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(1, "cell 1", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(2, "cell 2", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(3, "cell 3", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(4, "cell 4", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(5, "cell 5", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(6, "cell 6", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(7, "cell 7", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(8, "cell 8", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(9, "cell 9", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(10, "cell 10", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(11, "cell 11", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(12, "cell 12", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(13, "cell 13", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(14, "cell 14", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(15, "cell 15", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(16, "cell 16", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
            .addChild(FIXTURES.gridCellElementBordered(17, "cell 17", undefined,
      undefined, {color:'000000'}, {color:'000000'}))
        )
    )
);


/*jsl:end*/
