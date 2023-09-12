// Copyright 2014 Google Inc. All Rights Reserved.
/*jsl:ignore*/
define([
  'qowtRoot/third_party/gviz/gviz_ui_module',
  'qowtRoot/third_party/gviz/gviz_default_module',
  'qowtRoot/third_party/gviz/gviz_format_module'
  ], function() {
// INPUT (javascript/gviz/devel/canviz/legend/labeled-legend-builder.js)
gviz.canviz.legend.labeledLegendBuilder = {};
gviz.canviz.legend.labeledLegendBuilder.build = function(renderer, drawTextBlockFunc, labeledLegendDefinition, drawingGroup, registerElementFunc) {
  for (var i = 0;i < labeledLegendDefinition.length;++i) {
    var legendEntry = labeledLegendDefinition[i], legendEntryGroup = renderer.createGroup(), legendEntryLineGroup = renderer.createGroup(), linePath = new gviz.graphics.PathSegments;
    linePath.move(legendEntry.startPoint.x + .5, legendEntry.startPoint.y + .5);
    linePath.addLine(legendEntry.cornerPointX + .5, legendEntry.startPoint.y + .5);
    linePath.addLine(legendEntry.cornerPointX + .5, legendEntry.endPoint.y + .5);
    linePath.addLine(legendEntry.endPoint.x + .5, legendEntry.endPoint.y + .5);
    renderer.drawPath(linePath, legendEntry.lineBrush, legendEntryLineGroup);
    renderer.drawCircle(legendEntry.startPoint.x + .5, legendEntry.startPoint.y + .5, legendEntry.startPointRadius, legendEntry.startPointBrush, legendEntryLineGroup);
    drawTextBlockFunc(legendEntry.aboveText, legendEntryGroup);
    drawTextBlockFunc(legendEntry.belowText, legendEntryGroup);
    renderer.appendChild(drawingGroup, legendEntryGroup);
    renderer.appendChild(drawingGroup, legendEntryLineGroup);
    var legendEntryID = gviz.canviz.idutils.generateId([gviz.canviz.idutils.Token.LEGEND_ENTRY, legendEntry.index]);
    registerElementFunc(legendEntryGroup.getElement(), legendEntryID);
  }
};
// INPUT (javascript/gviz/devel/canviz/pie-chart-builder.js)
gviz.canviz.PieChartBuilder = function(overlayArea, renderer) {
  gviz.canviz.ChartBuilder.call(this, overlayArea, renderer);
  this.labeledLegendDrawingGroup_ = this.drawingGroup_ = null;
};
goog.inherits(gviz.canviz.PieChartBuilder, gviz.canviz.ChartBuilder);
gviz.canviz.PieChartBuilder.prototype.drawChartContent = function(chartDef, drawingGroup) {
  var renderer = this.renderer;
  if (1 > chartDef.series.length) {
    return!1;
  }
  this.drawingGroup_ = drawingGroup;
  for (var layers = chartDef.pie.layers, seriesCountInLayer = chartDef.series.length / layers.length, layerIndex = 0;layerIndex < layers.length;++layerIndex) {
    for (var radiusX = layers[layerIndex].radiusX, radiusY = layers[layerIndex].radiusY, otherSlice = layers[layerIndex].otherSlice, middleSlice = layerIndex * seriesCountInLayer, lastSliceInLayer = middleSlice + seriesCountInLayer;middleSlice < lastSliceInLayer && 180 > chartDef.series[middleSlice].toDegrees;) {
      this.drawSlice_(chartDef.series[middleSlice], radiusX, radiusY), middleSlice += 1;
    }
    otherSlice && this.drawSlice_(otherSlice, radiusX, radiusY);
    for (var i = lastSliceInLayer - 1;i >= middleSlice;--i) {
      this.drawSlice_(chartDef.series[i], radiusX, radiusY);
    }
  }
  chartDef.labeledLegend && (this.labeledLegendDrawingGroup_ = renderer.createGroup(), this.drawLabeledLegend_(chartDef.labeledLegend), renderer.appendChild(this.drawingGroup_, this.labeledLegendDrawingGroup_));
  return!0;
};
gviz.canviz.PieChartBuilder.prototype.drawSlice_ = function(slice, radiusX, radiusY) {
  if (slice.isVisible) {
    var sliceGroup = this.renderer.createGroup(), chartDef = this.chartDefinition, center = chartDef.pie.center, offset = slice.offset;
    if (slice.side3D) {
      var pieHeight = chartDef.pie.pieHeight, side = slice.side3D, sliceSidePath = new gviz.graphics.PathSegments;
      sliceSidePath.move(offset.x + side.fromPixel.x, offset.y + side.fromPixel.y);
      sliceSidePath.addLine(offset.x + side.fromPixel.x, offset.y + side.fromPixel.y + pieHeight);
      sliceSidePath.addArc(offset.x + center.x, offset.y + center.y + pieHeight, radiusX, radiusY, side.fromDegrees, side.toDegrees, !0);
      sliceSidePath.addLine(offset.x + side.toPixel.x, offset.y + side.toPixel.y);
      sliceSidePath.addArc(offset.x + center.x, offset.y + center.y, radiusX, radiusY, side.toDegrees, side.fromDegrees, !1);
      this.renderer.drawPath(sliceSidePath, side.brush, sliceGroup);
    }
    if (slice.drawInnerFrom || slice.drawInnerTo) {
      var pieHeight = chartDef.pie.pieHeight, innerPath = new gviz.graphics.PathSegments;
      innerPath.move(offset.x + center.x, offset.y + center.y);
      innerPath.addLine(offset.x + center.x, offset.y + center.y + pieHeight);
      slice.drawInnerTo && (innerPath.addLine(offset.x + slice.toPixel.x, offset.y + slice.toPixel.y + pieHeight), innerPath.addLine(offset.x + slice.toPixel.x, offset.y + slice.toPixel.y));
      slice.drawInnerFrom && (innerPath.addLine(offset.x + slice.fromPixel.x, offset.y + slice.fromPixel.y + pieHeight), innerPath.addLine(offset.x + slice.fromPixel.x, offset.y + slice.fromPixel.y));
      this.renderer.drawPath(innerPath, slice.innerBrush, sliceGroup);
    }
    var sliceBrush = slice.highlight ? slice.highlight.brush : slice.brush;
    if (slice.isWholeCircle) {
      if (0 == slice.innerRadiusX && 0 == slice.innerRadiusY) {
        this.renderer.drawEllipse(center.x, center.y, radiusX, radiusY, sliceBrush, sliceGroup);
      } else {
        var pathSegments = new gviz.graphics.PathSegments;
        pathSegments.move(center.x, center.y - radiusY);
        pathSegments.addArc(center.x, center.y, radiusX, radiusY, 0, 180, !0);
        pathSegments.addArc(center.x, center.y, radiusX, radiusY, 180, 360, !0);
        pathSegments.move(center.x, center.y - slice.innerRadiusY);
        pathSegments.addArc(center.x, center.y, slice.innerRadiusX, slice.innerRadiusY, 360, 180, !1);
        pathSegments.addArc(center.x, center.y, slice.innerRadiusX, slice.innerRadiusY, 180, 0, !1);
        pathSegments.close();
        this.renderer.drawPath(pathSegments, sliceBrush, sliceGroup);
      }
    } else {
      var slicePath = new gviz.graphics.PathSegments;
      slicePath.move(offset.x + slice.innerFromPixel.x, offset.y + slice.innerFromPixel.y);
      slicePath.addLine(offset.x + slice.fromPixel.x, offset.y + slice.fromPixel.y);
      slicePath.addArc(offset.x + center.x, offset.y + center.y, radiusX, radiusY, slice.fromDegrees, slice.toDegrees, !0);
      slicePath.addLine(offset.x + slice.innerToPixel.x, offset.y + slice.innerToPixel.y);
      slicePath.addArc(offset.x + center.x, offset.y + center.y, slice.innerRadiusX, slice.innerRadiusY, slice.toDegrees, slice.fromDegrees, !1);
      this.renderer.drawPath(slicePath, sliceBrush, sliceGroup);
    }
    slice.ring && chartDef.shouldHighlightSelection && this.drawDonut_(slice.ring, sliceGroup);
    var glow = slice.glow;
    if (glow) {
      if (glow.side3D) {
        var sideGlowPath = new gviz.graphics.PathSegments;
        sideGlowPath.move(glow.side3D.fromPixel.x, glow.side3D.fromPixel.y);
        sideGlowPath.addLine(glow.side3D.fromPixel.x, glow.side3D.fromPixel.y + pieHeight);
        sideGlowPath.addArc(glow.side3D.tip.x, glow.side3D.tip.y + pieHeight, glow.side3D.radiusX, glow.side3D.radiusY, glow.side3D.fromDegrees, glow.side3D.toDegrees, !0);
        sideGlowPath.addLine(glow.side3D.toPixel.x, glow.side3D.toPixel.y);
        sideGlowPath.addArc(glow.side3D.tip.x, glow.side3D.tip.y, glow.side3D.radiusX, glow.side3D.radiusY, glow.side3D.toDegrees, glow.side3D.fromDegrees, !1);
        this.renderer.drawPath(sideGlowPath, glow.side3D.brush, sliceGroup);
      }
      if (glow.drawInnerFrom || glow.drawInnerTo) {
        var innerGlowPath = new gviz.graphics.PathSegments;
        innerGlowPath.move(glow.innerClose.x, glow.innerClose.y);
        innerGlowPath.addLine(glow.innerFar.x, glow.innerFar.y);
        innerGlowPath.addLine(glow.innerFar.x, glow.innerFar.y + pieHeight);
        innerGlowPath.addLine(glow.innerClose.x, glow.innerClose.y + pieHeight);
        innerGlowPath.addLine(glow.innerClose.x, glow.innerClose.y);
        this.renderer.drawPath(innerGlowPath, glow.innerBrush, sliceGroup);
      }
      this.drawDonut_(glow, sliceGroup);
    }
    slice.isTextVisible && this.renderer.drawText(slice.text, slice.textBoxTopLeft.x + offset.x, slice.textBoxTopLeft.y + offset.y, slice.textBoxSize.width, gviz.graphics.TextAlign.START, gviz.graphics.TextAlign.START, slice.textStyle, sliceGroup);
    var sliceID = gviz.canviz.idutils.generateId([gviz.canviz.idutils.Token.SLICE, slice.index]), sliceElement = sliceGroup.getElement();
    goog.asserts.assert(this.drawingGroup_);
    this.drawElement(this.drawingGroup_, sliceID, sliceElement);
    if (slice.tooltip) {
      var tooltipID = gviz.canviz.idutils.generateId([gviz.canviz.idutils.Token.TOOLTIP, slice.index]);
      this.openTooltip(slice.tooltip, tooltipID);
    }
  }
};
gviz.canviz.PieChartBuilder.prototype.drawDonut_ = function(donut, drawingGroup) {
  if (donut.isWholeCircle) {
    this.renderer.drawEllipse(donut.tip.x, donut.tip.y, donut.radiusX, donut.radiusY, donut.brush, drawingGroup);
  } else {
    var path = new gviz.graphics.PathSegments;
    path.move(donut.fromPixel.x, donut.fromPixel.y);
    path.addArc(donut.tip.x, donut.tip.y, donut.radiusX, donut.radiusY, donut.fromDegrees, donut.toDegrees, !0);
    this.renderer.drawPath(path, donut.brush, drawingGroup);
  }
};
gviz.canviz.PieChartBuilder.prototype.drawLabeledLegend_ = function(labeledLegendDefinition) {
  var drawTextBlockFunc = goog.bind(this.drawTextBlock, this), registerElementFunc = goog.bind(this.registerElement, this);
  goog.asserts.assert(this.labeledLegendDrawingGroup_);
  gviz.canviz.legend.labeledLegendBuilder.build(this.renderer, drawTextBlockFunc, labeledLegendDefinition, this.labeledLegendDrawingGroup_, registerElementFunc);
};
gviz.canviz.PieChartBuilder.prototype.refreshChartContent = function(baseLayer, refreshLayer) {
  if (!gviz.object.unsafeEquals(refreshLayer.labeledLegend, this.drawnRefreshLayer.labeledLegend)) {
    this.renderer.removeChildren(this.labeledLegendDrawingGroup_);
    var layeredLegendDefinition = new gviz.util.LayeredObject(2);
    layeredLegendDefinition.setLayer(0, baseLayer.labeledLegend || {});
    layeredLegendDefinition.setLayer(1, refreshLayer.labeledLegend || {});
    var labeledLegendDefinition = layeredLegendDefinition.compact();
    goog.asserts.assert(labeledLegendDefinition);
    this.drawLabeledLegend_(labeledLegendDefinition);
  }
  this.revertChartContentChanges(baseLayer);
  this.applyChartContentChanges_(baseLayer, refreshLayer);
};
gviz.canviz.PieChartBuilder.prototype.revertChartContentChanges = function(baseLayer) {
  var refreshLayer = this.drawnRefreshLayer;
  if (refreshLayer) {
    for (var serieIndex in refreshLayer.series) {
      if (refreshLayer.series[serieIndex].tooltip) {
        var tooltipID = gviz.canviz.idutils.generateId([gviz.canviz.idutils.Token.TOOLTIP, Number(serieIndex)]);
        this.closeTooltip(tooltipID);
      }
      var layersCount = baseLayer.pie.layers.length, seriesCount = baseLayer.series.length, layerIndex = serieIndex < seriesCount / layersCount ? 0 : 1, layer = baseLayer.pie.layers[layerIndex], radiusX = layer.radiusX, radiusY = layer.radiusY, slice = baseLayer.series[serieIndex];
      this.drawSlice_(slice, radiusX, radiusY);
    }
  }
};
gviz.canviz.PieChartBuilder.prototype.applyChartContentChanges_ = function(baseLayer, refreshLayer) {
  for (var serieIndex in refreshLayer.series) {
    var slice = baseLayer.series[serieIndex], layeredSlice = new gviz.util.LayeredObject(2);
    layeredSlice.setLayer(0, slice);
    layeredSlice.setLayer(1, refreshLayer.series[serieIndex]);
    var layersCount = baseLayer.pie.layers.length, seriesCount = baseLayer.series.length, layerIndex = serieIndex < seriesCount / layersCount ? 0 : 1, layer = baseLayer.pie.layers[layerIndex], radiusX = layer.radiusX, radiusY = layer.radiusY;
    this.drawSlice_(layeredSlice.compact(), radiusX, radiusY);
  }
};
// INPUT (javascript/gviz/devel/canviz/legend/labeled-legend-definer.js)
gviz.canviz.legend.labeledLegendDefiner = {};
gviz.canviz.legend.labeledLegendDefiner.Alignment = {LEFT:1, RIGHT:2};
gviz.canviz.legend.labeledLegendDefiner.MAX_CONSECUTIVE_FAILURES = 15;
gviz.canviz.legend.labeledLegendDefiner.define = function(legendArea, textMeasureFunction, alignment, legendTextStyle, entriesInfo) {
  var textWidth = legendArea.right - legendArea.left, aboveTextStyle = goog.object.clone(legendTextStyle), belowTextStyle = goog.object.clone(legendTextStyle);
  belowTextStyle.color = gviz.canviz.legend.labeledLegendDefiner.BELOW_TEXT_COLOR;
  var verticalTextSpacing = legendTextStyle.fontSize / (2 * gviz.canviz.Constants.GOLDEN_RATIO), aboveTextLineHeight = aboveTextStyle.fontSize + verticalTextSpacing, belowTextLineHeight = belowTextStyle.fontSize + verticalTextSpacing, layout = gviz.canviz.legend.labeledLegendDefiner.calcEntriesLayout_(legendArea, textWidth, textMeasureFunction, aboveTextStyle, belowTextStyle, verticalTextSpacing, entriesInfo), labeledLegendDefinition = [], endPointX, cornerPointX, textAlignment;
  alignment == gviz.canviz.legend.labeledLegendDefiner.Alignment.RIGHT ? (endPointX = legendArea.right, cornerPointX = legendArea.left, textAlignment = gviz.graphics.TextAlign.END) : (goog.asserts.assert(alignment == gviz.canviz.legend.labeledLegendDefiner.Alignment.LEFT), endPointX = legendArea.left, cornerPointX = legendArea.right, textAlignment = gviz.graphics.TextAlign.START);
  for (var i$$0 = 0;i$$0 < entriesInfo.length;++i$$0) {
    var entryInfo = entriesInfo[i$$0], entryLayout = layout[i$$0];
    if (goog.isDefAndNotNull(entryLayout)) {
      var aboveTextLayout = gviz.canviz.textutils.calcTextLayout(textMeasureFunction, entryInfo.aboveText, aboveTextStyle, textWidth, entryLayout.aboveTextLines), belowTextLayout = gviz.canviz.textutils.calcTextLayout(textMeasureFunction, entryInfo.belowText, belowTextStyle, textWidth, entryLayout.belowTextLines), endPoint = gviz.canviz.vectorutils.round(new goog.math.Vec2(endPointX, entryLayout.y));
      labeledLegendDefinition.push({startPointRadius:gviz.canviz.legend.labeledLegendDefiner.START_POINT_RADIUS, startPoint:gviz.canviz.vectorutils.round(entryInfo.originYToVec(goog.math.clamp(entryLayout.y, entryInfo.originRange.start, entryInfo.originRange.end))), cornerPointX:cornerPointX, endPoint:endPoint, startPointBrush:new gviz.graphics.Brush({fill:gviz.canviz.legend.labeledLegendDefiner.LINE_COLOR, fillOpacity:gviz.canviz.legend.labeledLegendDefiner.LINE_OPACITY}), lineBrush:new gviz.graphics.Brush({stroke:gviz.canviz.legend.labeledLegendDefiner.LINE_COLOR, 
      strokeWidth:gviz.canviz.legend.labeledLegendDefiner.LINE_WIDTH, strokeOpacity:gviz.canviz.legend.labeledLegendDefiner.LINE_OPACITY}), verticalTextSpacing:verticalTextSpacing, aboveText:{text:entryInfo.aboveText, textStyle:aboveTextStyle, anchor:new gviz.math.Coordinate(endPoint.x, endPoint.y), lines:goog.array.map(aboveTextLayout.lines, function(line, i) {
        return{x:0, y:(i - aboveTextLayout.lines.length) * aboveTextLineHeight, length:aboveTextLayout.maxLineWidth, text:line};
      }), paralAlign:textAlignment, perpenAlign:gviz.graphics.TextAlign.START, tooltip:aboveTextLayout.needTooltip ? entryInfo.aboveText : "", angle:0}, aboveTextStyle:aboveTextStyle, belowText:{text:entryInfo.belowText, textStyle:belowTextStyle, anchor:new gviz.math.Coordinate(endPoint.x, endPoint.y), lines:goog.array.map(belowTextLayout.lines, function(line, i) {
        return{x:0, y:(i + 1) * belowTextLineHeight, length:belowTextLayout.maxLineWidth, text:line};
      }), paralAlign:textAlignment, perpenAlign:gviz.graphics.TextAlign.END, tooltip:belowTextLayout.needTooltip ? entryInfo.belowText : "", angle:0}, belowTextStyle:belowTextStyle, alignment:textAlignment, index:entryInfo.index});
    }
  }
  return labeledLegendDefinition;
};
gviz.canviz.legend.labeledLegendDefiner.calcEntriesLayout_ = function(legendArea, textWidth, textMeasureFunction, aboveTextStyle, belowTextStyle, verticalTextSpacing, entriesInfo) {
  var aboveTextLineHeight = aboveTextStyle.fontSize + verticalTextSpacing, belowTextLineHeight = belowTextStyle.fontSize + verticalTextSpacing, intervals = goog.array.map(entriesInfo, function(entryInfo, idx) {
    var aboveTextLayout = gviz.canviz.textutils.calcTextLayout(textMeasureFunction, entryInfo.aboveText, aboveTextStyle, textWidth, Infinity), belowTextLayout = gviz.canviz.textutils.calcTextLayout(textMeasureFunction, entryInfo.belowText, belowTextStyle, textWidth, Infinity);
    return{entryId:idx, preferredAnchorPosition:entryInfo.preferredOrigin, anchorPosition:entryInfo.preferredOrigin, aboveTextLines:aboveTextLayout.lines.length, belowTextLines:belowTextLayout.lines.length, aboveSpacing:verticalTextSpacing, belowSpacing:verticalTextSpacing};
  });
  goog.array.sort(intervals, function(i1, i2) {
    return i1.anchorPosition - i2.anchorPosition;
  });
  var remainingIntervals = goog.array.clone(intervals);
  goog.array.sort(remainingIntervals, function(i1, i2) {
    var entryInfo1 = entriesInfo[i1.entryId], entryInfo2 = entriesInfo[i2.entryId];
    return entryInfo1.importance - entryInfo2.importance;
  });
  var workingIntervals = [];
  0 < remainingIntervals.length && workingIntervals.push(remainingIntervals.pop());
  for (var lastAddedInterval = null, numFailures = 0, maxFailures = gviz.canviz.legend.labeledLegendDefiner.MAX_CONSECUTIVE_FAILURES, result;result = gviz.canviz.legend.labeledLegendDefiner.calcEntriesLayoutAttempt_(legendArea, aboveTextLineHeight, belowTextLineHeight, entriesInfo, workingIntervals, !1), !(0 === remainingIntervals.length || result.unableToFitAllTextLines && numFailures > maxFailures);) {
    result.unableToFitAllTextLines ? (numFailures++, lastAddedInterval && goog.array.remove(workingIntervals, lastAddedInterval)) : numFailures = 0, lastAddedInterval = remainingIntervals.pop(), workingIntervals.push(lastAddedInterval), goog.array.sort(workingIntervals, function(i1, i2) {
      return i1.anchorPosition - i2.anchorPosition;
    });
  }
  result.unableToFitAllTextLines && lastAddedInterval && (goog.array.remove(workingIntervals, lastAddedInterval), result = gviz.canviz.legend.labeledLegendDefiner.calcEntriesLayoutAttempt_(legendArea, aboveTextLineHeight, belowTextLineHeight, entriesInfo, workingIntervals, !1));
  var result2 = gviz.canviz.legend.labeledLegendDefiner.calcEntriesLayoutAttempt_(legendArea, aboveTextLineHeight, belowTextLineHeight, entriesInfo, workingIntervals, !0);
  result2.unableToFitAllTextLines || (result = result2);
  return result.layout;
};
gviz.canviz.legend.labeledLegendDefiner.calcEntriesLayoutAttempt_ = function(legendArea, aboveTextLineHeight, belowTextLineHeight, entriesInfo, intervals, striveForPreferredAnchorPosition) {
  0 < intervals.length && (intervals[0].aboveSpacing = 0, goog.array.peek(intervals).belowSpacing = 0);
  for (var i = 0;i < intervals.length;i++) {
    var interval = intervals[i], prevInterval = intervals[i - 1], anchorRangeStart = prevInterval ? entriesInfo[prevInterval.entryId].originRange.start + gviz.canviz.legend.labeledLegendDefiner.MIN_VERTICAL_LINE_SPACING : legendArea.top, nextInterval = intervals[i + 1], anchorRangeEnd = nextInterval ? entriesInfo[nextInterval.entryId].originRange.end - gviz.canviz.legend.labeledLegendDefiner.MIN_VERTICAL_LINE_SPACING : legendArea.bottom;
    interval.anchorRange = new goog.math.Range(Math.min(interval.preferredAnchorPosition, anchorRangeStart), Math.max(interval.preferredAnchorPosition, anchorRangeEnd));
  }
  for (var positions = gviz.canviz.legend.labeledLegendDefiner.calcEntriesPosition_(legendArea, aboveTextLineHeight, belowTextLineHeight, intervals, striveForPreferredAnchorPosition), someEntryUnableToFitAllTextLines = !1, layout = {}, i = 0;i < intervals.length;i++) {
    var interval = intervals[i], position = positions[i], abovePartAvailableForText = position.anchor - position.top - interval.aboveSpacing, belowPartAvailableForText = position.bottom - position.anchor - interval.belowSpacing, actualAboveTextLines = abovePartAvailableForText / aboveTextLineHeight, actualBelowTextLines = belowPartAvailableForText / belowTextLineHeight, epsilon = .1, actualAboveTextLines = Math.floor(actualAboveTextLines + epsilon), actualBelowTextLines = Math.floor(actualBelowTextLines + 
    epsilon), unableToFitAllTextLines = actualAboveTextLines < interval.aboveTextLines || actualBelowTextLines < interval.belowTextLines, someEntryUnableToFitAllTextLines = someEntryUnableToFitAllTextLines || unableToFitAllTextLines;
    layout[interval.entryId] = {y:position.anchor, aboveTextLines:actualAboveTextLines, belowTextLines:actualBelowTextLines, unableToFitAllTextLines:unableToFitAllTextLines};
  }
  return{layout:layout, unableToFitAllTextLines:someEntryUnableToFitAllTextLines};
};
gviz.canviz.legend.labeledLegendDefiner.calcEntriesPosition_ = function(legendArea, aboveTextLineHeight, belowTextLineHeight, intervals, striveForPreferredAnchorPosition) {
  var getAbovePart = function(interval) {
    return interval.aboveTextLines * aboveTextLineHeight + interval.aboveSpacing;
  }, getBelowPart = function(interval) {
    return interval.belowTextLines * belowTextLineHeight + interval.belowSpacing;
  }, initialState = goog.object.map(intervals, function(interval) {
    return{anchor:interval.anchorPosition, top:interval.anchorPosition - getAbovePart(interval), bottom:interval.anchorPosition + getBelowPart(interval)};
  }), forceFuncs = [];
  forceFuncs.push(function(state, idx) {
    var topPos = state[idx].top;
    if (0 == idx) {
      var topExceed = Math.max(legendArea.top - topPos, 0);
      return{top:topExceed};
    }
    var neighborIdx = goog.string.toNumber(idx) - 1, bottomPosOfNeighbor = state[neighborIdx].bottom, overlap = Math.max(bottomPosOfNeighbor - topPos, 0);
    return{top:overlap / 2};
  });
  forceFuncs.push(function(state, idx) {
    var bottomPos = state[idx].bottom;
    if (idx == intervals.length - 1) {
      var bottomExceed = Math.min(legendArea.bottom - bottomPos, 0);
      return{bottom:bottomExceed};
    }
    var neighborIdx = goog.string.toNumber(idx) + 1, topPosOfNeighbor = state[neighborIdx].top, overlap = Math.min(topPosOfNeighbor - bottomPos, 0);
    return{bottom:overlap / 2};
  });
  forceFuncs.push(function(state, idx, relaxationCoef) {
    var anchorPos = state[idx].anchor, topPos = state[idx].top, abovePart = anchorPos - topPos, offsetToMakePositiveSize = Math.max(-abovePart, 0), interval = intervals[idx], offsetToMakeDesiredSize = Math.max(getAbovePart(interval) - Math.max(abovePart, 0), 0), force = (offsetToMakePositiveSize + offsetToMakeDesiredSize * (striveForPreferredAnchorPosition ? 1 : relaxationCoef)) / 2;
    return{anchor:force, top:-force};
  });
  forceFuncs.push(function(state, idx, relaxationCoef) {
    var anchorPos = state[idx].anchor, bottomPos = state[idx].bottom, belowPart = bottomPos - anchorPos, offsetToMakePositiveSize = Math.max(-belowPart, 0), interval = intervals[idx], offsetToMakeDesiredSize = Math.max(getBelowPart(interval) - Math.max(belowPart, 0), 0), force = (offsetToMakePositiveSize + offsetToMakeDesiredSize * (striveForPreferredAnchorPosition ? 1 : relaxationCoef)) / 2;
    return{anchor:-force, bottom:force};
  });
  forceFuncs.push(function(state, idx) {
    var anchorPos = state[idx].anchor, interval = intervals[idx], clampedAnchorPos = goog.math.clamp(anchorPos, interval.anchorRange.start, interval.anchorRange.end);
    return{anchor:clampedAnchorPos - anchorPos};
  });
  striveForPreferredAnchorPosition && forceFuncs.push(function(state, idx, relaxationCoef) {
    var anchorPos = state[idx].anchor, interval = intervals[idx], offset = interval.preferredAnchorPosition - anchorPos;
    return{anchor:offset * relaxationCoef};
  });
  var applyForceFunc = function(intervalState, force) {
    return{anchor:intervalState.anchor + (force.anchor || 0), top:intervalState.top + (force.top || 0), bottom:intervalState.bottom + (force.bottom || 0)};
  }, diffFunc = function(intervalState1, intervalState2) {
    return Math.max(Math.abs(intervalState1.anchor - intervalState2.anchor), Math.abs(intervalState1.top - intervalState2.top), Math.abs(intervalState1.bottom - intervalState2.bottom));
  }, finalState = gviz.canviz.util.simulateForceSystem(initialState, forceFuncs, applyForceFunc, diffFunc, .05, .99, 1E3);
  return goog.array.map(intervals, function(interval, idx) {
    var intervalState = finalState[String(idx)];
    return{anchor:intervalState.anchor, top:intervalState.top, bottom:intervalState.bottom};
  });
};
gviz.canviz.legend.labeledLegendDefiner.generateInteractivityLayer = function(legendDefinition, focusedEntryIndex) {
  var legendDefinitionIndex = goog.array.findIndex(legendDefinition, function(entry) {
    return entry.index == focusedEntryIndex;
  });
  if (0 > legendDefinitionIndex) {
    return{};
  }
  var interactiveLegendDefinition = {};
  interactiveLegendDefinition[legendDefinitionIndex] = {startPointRadius:gviz.canviz.legend.labeledLegendDefiner.START_POINT_RADIUS_ON_FOCUS, lineBrush:new gviz.graphics.Brush({stroke:gviz.canviz.legend.labeledLegendDefiner.LINE_COLOR, strokeWidth:gviz.canviz.legend.labeledLegendDefiner.LINE_WIDTH_ON_FOCUS, strokeOpacity:gviz.canviz.legend.labeledLegendDefiner.LINE_OPACITY})};
  return interactiveLegendDefinition;
};
gviz.canviz.legend.labeledLegendDefiner.START_POINT_RADIUS = 2;
gviz.canviz.legend.labeledLegendDefiner.START_POINT_RADIUS_ON_FOCUS = 4;
gviz.canviz.legend.labeledLegendDefiner.LINE_COLOR = "636363";
gviz.canviz.legend.labeledLegendDefiner.LINE_WIDTH = 1;
gviz.canviz.legend.labeledLegendDefiner.LINE_WIDTH_ON_FOCUS = 2;
gviz.canviz.legend.labeledLegendDefiner.LINE_OPACITY = .7;
gviz.canviz.legend.labeledLegendDefiner.ABOVE_TEXT_COLOR = "6c6c6c";
gviz.canviz.legend.labeledLegendDefiner.BELOW_TEXT_COLOR = "9e9e9e";
gviz.canviz.legend.labeledLegendDefiner.MIN_VERTICAL_LINE_SPACING = 5;
// INPUT (javascript/gviz/devel/canviz/pie-chart-definer.js)
gviz.canviz.PieChartDefiner = function(dataTable, options, textMeasureFunction, width, height) {
  goog.asserts.assert(dataTable);
  this.colors_ = options.inferValue("colors", gviz.canviz.Options.DEFAULT_DISCRETE_COLORS);
  this.startAngle_ = options.inferNumberValue("pieStartAngle", 0);
  this.reverseDirection_ = 0 > options.inferNumberValue("direction", 1);
  gviz.canviz.ChartDefiner.call(this, dataTable, options, textMeasureFunction, width, height);
};
goog.inherits(gviz.canviz.PieChartDefiner, gviz.canviz.ChartDefiner);
gviz.canviz.PieChartDefiner.prototype.init = function() {
  this.chartDef.focusTarget = gviz.canviz.Options.FocusTarget.SERIES;
  this.chartDef.isDiff = this.options.inferBooleanValue("isDiff");
  this.chartDef.is3D &= !this.chartDef.isDiff;
  this.chartDef.isDiff && (this.chartDef.diff = this.chartDef.diff || {}, this.chartDef.diff.pie = this.chartDef.diff.pie || {}, this.chartDef.diff.pie.isOldDataInCenter = this.options.inferValue("diff.oldData.inCenter", gviz.canviz.Options.DEFAULT_PIE_DIFF_IS_OLD_DATA_IN_CENTER), this.chartDef.diff.pie.innerOuterRadiusRatio = this.options.inferValue("diff.innerCircle.radiusFactor", gviz.canviz.Options.DEFAULT_PIE_DIFF_INNER_OUTER_RADIUS_RATIO));
  for (var i = 0;i < this.dataView.getNumberOfRows();i++) {
    if (0 > this.dataView.getValue(i, 1)) {
      throw Error("Negative values are invalid for a pie chart.");
    }
  }
  gviz.canviz.PieChartDefiner.superClass_.init.call(this);
};
gviz.canviz.PieChartDefiner.prototype.getDefaultLegendPosition = function() {
  return gviz.canviz.Options.LegendPosition.RIGHT;
};
gviz.canviz.PieChartDefiner.prototype.getDefaultColorBarPosition = function() {
  return null;
};
gviz.canviz.PieChartDefiner.prototype.calcLayout = function() {
  var chartDef = this.chartDef;
  if ("string" != this.dataView.getColumnType(0)) {
    throw Error("Pie chart should have a first column of type string");
  }
  var areaLayout = this.calcPieChartAreaLayout_();
  this.calcSeries_(areaLayout);
  var legendPosition = this.legendDefiner.getPosition();
  areaLayout.legend ? this.legendDefiner.setArea(areaLayout.legend) : legendPosition == gviz.canviz.Options.LegendPosition.BOTTOM ? this.legendDefiner.setArea(this.calcBottomLegendArea_()) : legendPosition == gviz.canviz.Options.LegendPosition.LABELED && this.calcLabeledLegend_(chartDef.chartArea, areaLayout, this.legendDefiner.getTextStyle(), chartDef.series);
};
gviz.canviz.PieChartDefiner.prototype.createBrushes_ = function(color, opt_opacity) {
  var chartDef = this.chartDef, brushes = {}, borderColor = this.options.inferColorValue("pieSliceBorderColor", ""), fill = color.color, darkFill = color.dark, lightFill = color.light, stroke, darkStroke, lightStroke;
  chartDef.is3D ? (stroke = fill, darkStroke = darkFill, lightStroke = lightFill) : lightStroke = darkStroke = stroke = borderColor;
  brushes.normal = new gviz.graphics.Brush({stroke:stroke, strokeWidth:1, fill:fill, fillOpacity:goog.isDefAndNotNull(opt_opacity) ? opt_opacity : 1});
  brushes.dark = new gviz.graphics.Brush({stroke:darkStroke, strokeWidth:1, fill:darkFill, fillOpacity:goog.isDefAndNotNull(opt_opacity) ? opt_opacity : 1});
  brushes.light = new gviz.graphics.Brush({stroke:lightStroke, strokeWidth:1, fill:lightFill, fillOpacity:goog.isDefAndNotNull(opt_opacity) ? opt_opacity : 1});
  return brushes;
};
gviz.canviz.PieChartDefiner.prototype.calcBottomLegendArea_ = function() {
  var chartDef = this.chartDef, availableHeight = chartDef.height - chartDef.chartArea.bottom, legendFontSize = this.legendDefiner.getTextStyle().fontSize, items = [];
  items.push({min:2, extra:[Infinity]});
  var legendIdx = items.length;
  items.push({min:legendFontSize + 2, extra:[Infinity]});
  var allocatedHeights = gviz.canviz.util.distributeRealEstate(items, availableHeight);
  if (allocatedHeights.length > legendIdx) {
    var y = chartDef.chartArea.bottom + allocatedHeights[legendIdx];
    return new goog.math.Box(y - legendFontSize, chartDef.chartArea.right, y, chartDef.chartArea.left);
  }
  return null;
};
gviz.canviz.PieChartDefiner.prototype.calcPieChartAreaLayout_ = function() {
  var chartDef = this.chartDef, chartArea = chartDef.chartArea, legendPosition = this.legendDefiner.getPosition(), pieBoundingBox = null, legend = null, gapBetweenLegendAndPie = Math.round(chartDef.defaultFontSize * gviz.canviz.Constants.GOLDEN_RATIO), legendWidth = Math.round(chartArea.width * (1 - 1 / gviz.canviz.Constants.GOLDEN_RATIO) - gapBetweenLegendAndPie);
  if (legendPosition == gviz.canviz.Options.LegendPosition.LEFT) {
    legend = new goog.math.Box(chartArea.top, chartArea.left + legendWidth, chartArea.bottom, chartArea.left), pieBoundingBox = new goog.math.Box(chartArea.top, chartArea.right, chartArea.bottom, legend.right + gapBetweenLegendAndPie);
  } else {
    if (legendPosition == gviz.canviz.Options.LegendPosition.RIGHT) {
      legend = new goog.math.Box(chartArea.top, chartArea.right, chartArea.bottom, chartArea.right - legendWidth), pieBoundingBox = new goog.math.Box(chartArea.top, legend.left - gapBetweenLegendAndPie, chartArea.bottom, chartArea.left);
    } else {
      if (legendPosition == gviz.canviz.Options.LegendPosition.BOTTOM_VERT) {
        var height = 1 / gviz.canviz.Constants.GOLDEN_RATIO * (chartArea.bottom - chartArea.top - gapBetweenLegendAndPie), pieBoundingBox = new goog.math.Box(chartArea.top, chartArea.right, chartArea.top + height, chartArea.left), legend = new goog.math.Box(pieBoundingBox.bottom + gapBetweenLegendAndPie, chartArea.right, chartArea.bottom, chartArea.left)
      } else {
        pieBoundingBox = new goog.math.Box(chartArea.top, chartArea.right, chartArea.bottom, chartArea.left);
      }
    }
  }
  var pieHeight = 0, pieSideLength = Math.min(pieBoundingBox.right - pieBoundingBox.left, pieBoundingBox.bottom - pieBoundingBox.top), radiusX = Math.floor(pieSideLength / 2), radiusY = radiusX, centerX = Math.round((pieBoundingBox.right + pieBoundingBox.left) / 2), centerY = Math.round((pieBoundingBox.bottom + pieBoundingBox.top) / 2);
  chartDef.is3D && (radiusY *= .8, pieHeight = radiusX / 5, centerY -= pieHeight / 2);
  if (chartDef.isDiff) {
    var innerRadii = {radiusX:radiusX * chartDef.diff.pie.innerOuterRadiusRatio, radiusY:radiusY * chartDef.diff.pie.innerOuterRadiusRatio}, outerRadii = {radiusX:radiusX, radiusY:radiusY};
    return{pie:{center:new goog.math.Vec2(centerX, centerY), radiusX:outerRadii.radiusX, radiusY:outerRadii.radiusY, pieHeight:pieHeight, layers:chartDef.diff.pie.isOldDataInCenter ? [innerRadii, outerRadii] : [outerRadii, innerRadii]}, legend:legend};
  }
  return{pie:{center:new goog.math.Vec2(centerX, centerY), radiusX:radiusX, radiusY:radiusY, pieHeight:pieHeight, layers:[{radiusX:radiusX, radiusY:radiusY}]}, legend:legend};
};
gviz.canviz.PieChartDefiner.prototype.calcSeries_ = function(chartLayout) {
  var chartDef = this.chartDef, dataView = this.dataView, center = chartLayout.pie.center, pieHeight = chartLayout.pie.pieHeight, rowsCount = dataView.getNumberOfRows(), residueColor = gviz.canviz.Theme.toStandardColor(this.options.inferColorValue("pieResidueSliceColor", "")), residueBrushes = this.createBrushes_(residueColor, 1), pieSliceTextStyle = this.options.inferTextStyleValue("pieSliceTextStyle", {fontName:chartDef.defaultFontName, fontSize:chartDef.defaultFontSize}), pieSliceTextOption = 
  chartDef.isDiff ? gviz.canviz.Options.PieSliceText.NONE : gviz.canviz.Options.PieSliceText.PERCENTAGE, pieSliceText = this.options.inferEnumValue("pieSliceText", gviz.canviz.Options.PieSliceText, pieSliceTextOption), tooltipText = this.options.inferEnumValue("tooltip.text", gviz.canviz.Options.PieValueText, gviz.canviz.Options.PieValueText.BOTH), sliceVisibilityThreshold = this.options.inferRatioNumberValue("sliceVisibilityThreshold", 1 / 720), displayTinySlicesInLegend = this.options.inferBooleanValue("displayTinySlicesInLegend"), 
  pieResidueSliceLabel = this.options.inferStringValue("pieResidueSliceLabel", gviz.canviz.Messages.MSG_OTHER), defaultHole = this.options.inferRatioNumberValue("pieHole", 0);
  this.options["legend.iconWidthScaleFactor"] = 2;
  chartDef.series = [];
  chartDef.legendEntries = [];
  var holeAtLayer, isLayerVisibleInLegend, alpha;
  if (chartDef.isDiff) {
    goog.asserts.assert(dataView.getColumnRole(1) == gviz.canviz.ColumnRole.DIFF_OLD_DATA);
    var innerBorderRatio = this.options.inferValue("diff.innerCircle.borderFactor", gviz.canviz.Options.DEFAULT_PIE_DIFF_INNER_BORDER_RATIO), outerHole = chartDef.diff.pie.innerOuterRadiusRatio * (1 + innerBorderRatio);
    holeAtLayer = chartDef.diff.pie.isOldDataInCenter ? [0, outerHole] : [outerHole, 0];
    isLayerVisibleInLegend = [!1, !0];
    alpha = [this.options.inferValue("diff.oldData.opacity", gviz.canviz.Options.DEFAULT_DIFF_OLD_DATA_OPACITY), this.options.inferValue("diff.newData.opacity", gviz.canviz.Options.DEFAULT_DIFF_NEW_DATA_OPACITY)];
  } else {
    holeAtLayer = [0], isLayerVisibleInLegend = [!0], alpha = [1];
  }
  chartDef.pie = {center:center, pieHeight:pieHeight, radiusX:chartLayout.pie.radiusX, radiusY:chartLayout.pie.radiusY, layers:[]};
  for (var createSliceTooltip = goog.bind(function(sliceIndex, layersCount) {
    goog.asserts.assert(1 == layersCount || sliceIndex >= rowsCount);
    var newDataSlice = chartDef.series[sliceIndex];
    if (1 == layersCount) {
      this.createSliceTooltip_(newDataSlice, tooltipText, newDataSlice);
    } else {
      var oldDataSlice = chartDef.series[sliceIndex - rowsCount];
      this.createSliceTooltip_(newDataSlice, tooltipText, newDataSlice, oldDataSlice);
      this.createSliceTooltip_(oldDataSlice, tooltipText, newDataSlice, oldDataSlice);
    }
  }, this), createTooltipForOtherSlice = goog.bind(function(layersCount) {
    var newDataSlice = chartDef.pie.layers[layersCount - 1].otherSlice, oldDataSlice = chartDef.pie.layers[0].otherSlice;
    1 == layersCount && newDataSlice ? this.createSliceTooltip_(newDataSlice, tooltipText, newDataSlice) : 1 < layersCount && (newDataSlice && oldDataSlice ? (this.createSliceTooltip_(newDataSlice, tooltipText, newDataSlice, oldDataSlice), this.createSliceTooltip_(oldDataSlice, tooltipText, newDataSlice, oldDataSlice)) : newDataSlice ? (oldDataSlice = {percentage:"0", formattedValue:"0"}, this.createSliceTooltip_(newDataSlice, tooltipText, newDataSlice, oldDataSlice)) : oldDataSlice && (newDataSlice = 
    {percentage:"0", formattedValue:"0"}, this.createSliceTooltip_(oldDataSlice, tooltipText, newDataSlice, oldDataSlice)));
  }, this), createLegendEntry = goog.bind(function(id, text, color, sliceIndex, visibleInLegend) {
    chartDef.isDiff ? chartDef.legendEntries.push({id:id, text:text, brush:new gviz.graphics.Brush({gradient:{color1:color, color2:color, opacity1:alpha[0], opacity2:alpha[1], x1:"100%", y1:"0%", x2:"0%", y2:"0%", useObjectBoundingBoxUnits:!0, sharpTransition:!0}}), index:sliceIndex, isVisible:visibleInLegend}) : chartDef.legendEntries.push({id:id, text:text, brush:new gviz.graphics.Brush({fill:color}), index:sliceIndex, isVisible:visibleInLegend});
  }, this), pieLayers = chartDef.pie.layers, layoutLayers = chartLayout.pie.layers, layersCount$$0 = layoutLayers.length, sliceIndex$$0 = 0, layerIndex = 0;layerIndex < layersCount$$0;++layerIndex) {
    for (var isDiffNewData = 1 == layerIndex, layer = layoutLayers[layerIndex], otherSlice = null, radiusX = layer.radiusX, radiusY = layer.radiusY, layerHole = holeAtLayer[layerIndex], isLayerInLegend = isLayerVisibleInLegend[layerIndex], sumOfNonVisibleValues = 0, partialSumOfVisibleValues = 0, sumOfAllValues = 0, rowIndex = 0;rowIndex < rowsCount;rowIndex++) {
      sumOfAllValues += dataView.getValue(rowIndex, layerIndex + 1) || 0;
    }
    for (rowIndex = 0;rowIndex < rowsCount;++rowIndex) {
      var value = dataView.getValue(rowIndex, layerIndex + 1) || 0, formattedValue = dataView.getFormattedValue(rowIndex, layerIndex + 1), id$$0 = dataView.getValue(rowIndex, 0), title = dataView.getFormattedValue(rowIndex, 0), from = partialSumOfVisibleValues / sumOfAllValues, to = from + value / sumOfAllValues, isVisible = to - from >= sliceVisibilityThreshold;
      isVisible ? partialSumOfVisibleValues += value : sumOfNonVisibleValues += value;
      var optionPath = "slices." + sliceIndex$$0, rawColor = this.options.inferValue(optionPath + ".color", this.colors_[rowIndex % this.colors_.length]), color$$0 = gviz.canviz.Theme.toStandardColor(rawColor), sliceBrushes = this.createBrushes_(color$$0, alpha[layerIndex]), offset = this.options.inferNumberValue(optionPath + ".offset", 0), hole = this.options.inferRatioNumberValue(optionPath + ".hole", defaultHole) + layerHole, sliceTextStyle = this.options.inferTextStyleValue(optionPath + ".textStyle", 
      pieSliceTextStyle), sliceEnableInteractivity = this.options.inferBooleanValue([optionPath + ".enableInteractivity", "enableInteractivity"], !0), slice = this.calcSliceLayout_(sliceIndex$$0, rowIndex, from, to, value, formattedValue, title, isVisible, center, radiusX, radiusY, hole, pieHeight, offset, pieSliceText, sliceTextStyle, color$$0, sliceBrushes, isDiffNewData, sliceEnableInteractivity);
      chartDef.series.push(slice);
      var visibleInLegend$$0 = this.options.inferBooleanValue(optionPath + ".visibleInLegend", isLayerInLegend && (isVisible || displayTinySlicesInLegend));
      createLegendEntry(id$$0, title, color$$0.color, sliceIndex$$0, visibleInLegend$$0);
      layerIndex == layersCount$$0 - 1 && createSliceTooltip(sliceIndex$$0, layersCount$$0);
      sliceIndex$$0 += 1;
    }
    0 < sumOfNonVisibleValues && (from = 1 - sumOfNonVisibleValues / sumOfAllValues, to = 1, value = sumOfNonVisibleValues, formattedValue = String(sumOfNonVisibleValues), title = pieResidueSliceLabel, otherSlice = this.calcSliceLayout_(-1, -1, from, to, value, formattedValue, title, !0, center, radiusX, radiusY, defaultHole + layerHole, pieHeight, 0, pieSliceText, pieSliceTextStyle, residueColor, residueBrushes, isDiffNewData, !1), isLayerInLegend && !displayTinySlicesInLegend && createLegendEntry("", 
    title, residueColor.color, -1, !0));
    pieLayers.push({radiusX:radiusX, radiusY:radiusY, otherSlice:otherSlice});
    layerIndex == layersCount$$0 - 1 && createTooltipForOtherSlice(layersCount$$0);
  }
};
gviz.canviz.PieChartDefiner.calcSliceValueText_ = function(slice, valueTextType) {
  switch(valueTextType) {
    case gviz.canviz.Options.PieValueText.PERCENTAGE:
      return slice.percentage;
    case gviz.canviz.Options.PieValueText.VALUE:
      return slice.formattedValue;
    case gviz.canviz.Options.PieValueText.BOTH:
      return slice.formattedValue + " (" + slice.percentage + ")";
  }
  goog.asserts.fail("Invalid PieValueText: " + valueTextType);
  return "";
};
gviz.canviz.PieChartDefiner.prototype.calcSliceLayout_ = function(sliceIndex, dataIndex, from, to, value, formattedValue, title, isVisible, center, radiusX, radiusY, hole, height, offset, pieSliceText, textStyle, color, brushes, isDiffNewData, enableInteractivity) {
  var chartDef = this.chartDef;
  if (chartDef.is3D || 1 <= hole) {
    hole = 0;
  }
  var result = {}, relativeValue = to - from;
  result.value = value;
  result.formattedValue = formattedValue;
  result.color = color;
  result.brushes = brushes;
  result.brush = result.brushes.normal;
  result.title = title;
  result.index = sliceIndex;
  result.enableInteractivity = enableInteractivity;
  result.dataTableIdx = 0 <= dataIndex ? this.dataView.getTableRowIndex(dataIndex) : null;
  result.isVisible = isVisible;
  var innerRadiusX = radiusX * hole, innerRadiusY = radiusY * hole;
  result.innerRadiusX = innerRadiusX;
  result.innerRadiusY = innerRadiusY;
  result.fromDegrees = 360 * from + this.startAngle_;
  result.toDegrees = 360 * to + this.startAngle_;
  if (this.reverseDirection_) {
    var fromDegrees = 360 - result.fromDegrees, toDegrees = 360 - result.toDegrees;
    result.fromDegrees = toDegrees;
    result.toDegrees = fromDegrees;
  }
  var fromRadians = Math.PI * (result.fromDegrees - 90) / 180, toRadians = Math.PI * (result.toDegrees - 90) / 180;
  result.percentage = Math.round(1E3 * relativeValue) / 10 + "%";
  var text = "";
  switch(pieSliceText) {
    case gviz.canviz.Options.PieSliceText.PERCENTAGE:
      text = result.percentage;
      break;
    case gviz.canviz.Options.PieSliceText.LABEL:
      text = result.title;
      break;
    case gviz.canviz.Options.PieSliceText.VALUE:
      text = formattedValue;
      break;
    case gviz.canviz.Options.PieSliceText.VALUE_AND_PERCENTAGE:
      text = formattedValue + " (" + result.percentage + ")";
  }
  result.text = text;
  if (!isVisible) {
    return result;
  }
  result.textStyle = textStyle;
  var textWidth = this.textMeasureFunction(result.text, textStyle).width, fontSize = textStyle.fontSize;
  result.textBoxSize = new goog.math.Size(textWidth, fontSize);
  result.isWholeCircle = 1 == relativeValue;
  if (result.text) {
    if (result.isWholeCircle) {
      result.textBoxTopLeft = goog.math.Vec2.difference(center, new goog.math.Vec2(textWidth / 2, fontSize / 2)), result.isTextVisible = !0;
    } else {
      var guideEllipseRadiusX = radiusX - fontSize, guideEllipseRadiusY = radiusY - fontSize, textBoxRelativePosition = gviz.canviz.vectorutils.positionBoxInEllipticSlice(guideEllipseRadiusX, guideEllipseRadiusY, fromRadians, toRadians, result.textBoxSize, 2, .4);
      goog.isNull(textBoxRelativePosition) || (result.isTextVisible = !0, result.textBoxTopLeft = gviz.canviz.vectorutils.sumAll(center, textBoxRelativePosition, new goog.math.Vec2(-result.textBoxSize.width / 2, -result.textBoxSize.height / 2)));
    }
  } else {
    result.isTextVisible = !1;
  }
  result.offset = gviz.canviz.vectorutils.vectorOnEllipse((fromRadians + toRadians) / 2, radiusX, radiusY).scale(offset);
  var fromDxDy = gviz.canviz.vectorutils.vectorOnEllipse(fromRadians, radiusX, radiusY), toDxDy = gviz.canviz.vectorutils.vectorOnEllipse(toRadians, radiusX, radiusY);
  result.fromPixel = goog.math.Vec2.sum(center, fromDxDy);
  result.toPixel = goog.math.Vec2.sum(center, toDxDy);
  var innerFromDxDy = gviz.canviz.vectorutils.vectorOnEllipse(fromRadians, innerRadiusX, innerRadiusY), innerToDxDy = gviz.canviz.vectorutils.vectorOnEllipse(toRadians, innerRadiusX, innerRadiusY);
  result.innerFromPixel = goog.math.Vec2.sum(center, innerFromDxDy);
  result.innerToPixel = goog.math.Vec2.sum(center, innerToDxDy);
  if (chartDef.is3D && 270 >= result.fromDegrees && 90 <= result.toDegrees) {
    var side3D = {};
    90 > result.fromDegrees ? (side3D.fromDegrees = 90, side3D.fromPixel = new goog.math.Vec2(center.x + radiusX, center.y)) : (side3D.fromDegrees = result.fromDegrees, side3D.fromPixel = result.fromPixel);
    270 < result.toDegrees ? (side3D.toDegrees = 270, side3D.toPixel = new goog.math.Vec2(center.x - radiusX, center.y)) : (side3D.toDegrees = result.toDegrees, side3D.toPixel = result.toPixel);
    side3D.brush = result.brushes.dark;
    result.side3D = side3D;
  }
  result.drawInnerFrom = chartDef.is3D && .5 < from;
  result.drawInnerTo = chartDef.is3D && .5 > to;
  if (result.drawInnerFrom || result.drawInnerTo) {
    result.innerBrush = result.brushes.dark;
  }
  return result;
};
gviz.canviz.PieChartDefiner.prototype.createSliceTooltip_ = function(slice, pieTooltipText, newDataSlice, opt_oldDataSlice) {
  goog.asserts.assert(!this.chartDef.isDiff || opt_oldDataSlice);
  var content = gviz.canviz.PieChartDefiner.calcSliceValueText_(newDataSlice, pieTooltipText);
  opt_oldDataSlice && (content += "\n" + gviz.canviz.PieChartDefiner.calcSliceValueText_(opt_oldDataSlice, pieTooltipText));
  slice.tooltipText = {serieTitle:slice.title, content:content};
};
gviz.canviz.PieChartDefiner.prototype.calcLabeledLegend_ = function(chartArea, areaLayout, legendTextStyle) {
  for (var chartDef = this.chartDef, radiusX = chartDef.pie.radiusX, radiusY = chartDef.pie.radiusY, center = areaLayout.pie.center, valueTextType = this.options.inferEnumValue("legend.labeledValueText", gviz.canviz.Options.PieValueText, gviz.canviz.Options.PieValueText.PERCENTAGE), pieCircumference = Math.PI * (3 * (radiusX + radiusY) - Math.sqrt((3 * radiusX + radiusY) * (radiusX + 3 * radiusY))), rightEntriesInfo = [], leftEntriesInfo = [], i = 0;i < chartDef.legendEntries.length;++i) {
    var legendEntry = chartDef.legendEntries[i];
    if (legendEntry.isVisible) {
      var slice;
      if (0 <= legendEntry.index) {
        slice = chartDef.series[legendEntry.index];
      } else {
        var layers = chartDef.pie.layers;
        slice = layers[layers.length - 1].otherSlice;
      }
      var originRadiusX = Math.max((radiusX + slice.innerRadiusX) / 2, .75 * radiusX), originRadiusY = Math.max((radiusY + slice.innerRadiusY) / 2, .75 * radiusY), middleDegrees = (slice.toDegrees + slice.fromDegrees) / 2, standardMiddleDegrees = goog.math.standardAngle(middleDegrees), originDistanceFromPerimeter = goog.math.average(radiusX - originRadiusX, radiusY - originRadiusY), originMarginFromSliceRadialEdge = originDistanceFromPerimeter / pieCircumference * 360, minOrigin, maxOrigin;
      2 * originMarginFromSliceRadialEdge < slice.toDegrees - slice.fromDegrees ? (minOrigin = slice.fromDegrees + originMarginFromSliceRadialEdge, maxOrigin = slice.toDegrees - originMarginFromSliceRadialEdge, 180 > standardMiddleDegrees ? maxOrigin = Math.min(maxOrigin, 180) : minOrigin = Math.max(minOrigin, 180)) : maxOrigin = minOrigin = middleDegrees;
      var radiansToOriginVec = function(radians) {
        var vecDxDy = gviz.canviz.vectorutils.vectorOnEllipse(radians, originRadiusX, originRadiusY), vec = goog.math.Vec2.sum(center, vecDxDy);
        return vec;
      }, degreesToOriginVec = function(degrees) {
        var radians = goog.math.toRadians(degrees - 90);
        return radiansToOriginVec(radians);
      }, originYRightToRadians = function(y) {
        var sin = (y - center.y) / originRadiusY;
        return Math.asin(goog.math.clamp(sin, -1, 1));
      }, originYRightToVec = function(y) {
        return radiansToOriginVec(originYRightToRadians(y));
      }, originYLeftToVec = function(y) {
        return radiansToOriginVec(Math.PI - originYRightToRadians(y));
      }, entryInfo = {preferredOrigin:degreesToOriginVec(middleDegrees).y, originRange:new goog.math.Range(degreesToOriginVec(minOrigin).y, degreesToOriginVec(maxOrigin).y), aboveText:legendEntry.text, belowText:gviz.canviz.PieChartDefiner.calcSliceValueText_(slice, valueTextType), importance:slice.value, index:slice.index};
      180 > standardMiddleDegrees ? (entryInfo.originYToVec = originYRightToVec, rightEntriesInfo.push(entryInfo)) : (entryInfo.originYToVec = originYLeftToVec, leftEntriesInfo.push(entryInfo));
    }
  }
  var legendWidth = chartArea.width / 2 - radiusX - legendTextStyle.fontSize, alignment = gviz.canviz.legend.labeledLegendDefiner.Alignment, rightLegendArea = new goog.math.Box(chartArea.top, chartArea.right, chartArea.bottom, chartArea.right - legendWidth), rightLabeledLegend = gviz.canviz.legend.labeledLegendDefiner.define(rightLegendArea, this.textMeasureFunction, alignment.RIGHT, legendTextStyle, rightEntriesInfo), leftLegendArea = new goog.math.Box(chartArea.top, chartArea.left + legendWidth, 
  chartArea.bottom, chartArea.left), leftLabeledLegend = gviz.canviz.legend.labeledLegendDefiner.define(leftLegendArea, this.textMeasureFunction, alignment.LEFT, legendTextStyle, leftEntriesInfo), labeledLegend = [];
  goog.array.extend(labeledLegend, rightLabeledLegend, leftLabeledLegend);
  this.chartDef.labeledLegend = labeledLegend;
};
// INPUT (javascript/gviz/devel/canviz/pie-chart-event-handler.js)
gviz.canviz.PieChartEventHandler = function(interactionEventTarget, renderer, overlayArea) {
  gviz.canviz.ChartEventHandler.call(this, interactionEventTarget, renderer, overlayArea, gviz.canviz.Options.ChartType.PIE);
};
goog.inherits(gviz.canviz.PieChartEventHandler, gviz.canviz.ChartEventHandler);
gviz.canviz.PieChartEventHandler.prototype.detectTargetElement = function(event) {
  var eventTarget = event.target;
  return this.renderer.getLogicalName(eventTarget);
};
gviz.canviz.PieChartEventHandler.prototype.dispatchInteractionEventForContent = function(interactionEventOperationType, targetElementID) {
  var targetElementTokens = targetElementID.split(gviz.canviz.idutils.TOKEN_SEPARATOR), targetElementType = targetElementTokens[0];
  switch(targetElementType) {
    case gviz.canviz.idutils.Token.SLICE:
      var sliceIndex = Number(targetElementTokens[1]);
      if (0 > sliceIndex) {
        break;
      }
      var interactionEventType = gviz.canviz.interactionEvents.generateEventType(gviz.canviz.interactionEvents.TargetType.SERIE, interactionEventOperationType), interactionEventData = {serieIndex:sliceIndex, datumIndex:null};
      this.dispatchEvent(interactionEventType, interactionEventData);
  }
};
// INPUT (javascript/gviz/devel/canviz/pie-chart-interactivity-definer.js)
gviz.canviz.PieChartInteractivityDefiner = function(chartOptions, chartDimensions, chartTextStyle, interactivityModel, focusTarget, numberOfSlices, opt_actionsMenuDefiner) {
  gviz.canviz.ChartInteractivityDefiner.call(this, chartOptions, chartDimensions, chartTextStyle, interactivityModel, focusTarget, opt_actionsMenuDefiner);
  var enableInteractivity = chartOptions.inferBooleanValue("enableInteractivity", !0);
  this.enableInteractivityPerSlice_ = gviz.canviz.util.rangeMap(numberOfSlices, function(sliceIndex) {
    return chartOptions.inferBooleanValue("slices." + sliceIndex + ".enableInteractivity", enableInteractivity);
  });
  this.shouldHighlightHover_ = chartOptions.inferBooleanValue("shouldHighlightHover", !0);
};
goog.inherits(gviz.canviz.PieChartInteractivityDefiner, gviz.canviz.ChartInteractivityDefiner);
gviz.canviz.PieChartInteractivityDefiner.prototype.extendInteractivityLayer = function(chartDefinition, chartState, interactivityLayer) {
  goog.asserts.assert(chartDefinition.interactivityModel == gviz.canviz.Options.InteractivityModel.DEFAULT);
  this.defaultInteractivityModel(chartDefinition, chartState, interactivityLayer);
};
gviz.canviz.PieChartInteractivityDefiner.prototype.equalChartStates = function(chartState1, chartState2) {
  return chartState1.equals(chartState2, !0);
};
gviz.canviz.PieChartInteractivityDefiner.prototype.isSliceInteractive_ = function(sliceIndex) {
  return this.enableInteractivityPerSlice_[sliceIndex];
};
gviz.canviz.PieChartInteractivityDefiner.prototype.createInteractiveSlice_ = function(interactivityLayer, sliceIndex) {
  interactivityLayer.series = interactivityLayer.series || {};
  var series = interactivityLayer.series;
  series[sliceIndex] = series[sliceIndex] || {};
  return series[sliceIndex];
};
gviz.canviz.PieChartInteractivityDefiner.prototype.defaultInteractivityModel = function(chartDefinition, chartState, interactivityLayer) {
  var interactionState = {chartDefinition:chartDefinition, actionsMenuEntries:this.actionsMenuDefiner.getEntries(), interactivityLayer:interactivityLayer, actionsMenuState:chartState.actionsMenu}, focusedActionId = chartState.actionsMenu.focused.entryID;
  null != focusedActionId && (chartState.actionsMenu.focused.action = this.actionsMenuDefiner.getAction(focusedActionId).action);
  for (var tooltipTrigger = this.tooltipDefiner.getTrigger(), selectionTriggersTooltip = gviz.canviz.chartdefinitionutil.isTooltipTriggeredBySelection(tooltipTrigger), focusTriggersTooltip = gviz.canviz.chartdefinitionutil.isTooltipTriggeredByFocus(tooltipTrigger, chartState.selected), showActionsMenu = this.actionsMenuDefiner && 0 < interactionState.actionsMenuEntries.length, selectedRows = chartState.selected.getRowIndexes(), showAggregateTooltip = 1 < selectedRows.length && showActionsMenu, i$$0 = 
  0;i$$0 < selectedRows.length;++i$$0) {
    var selectedSliceIndex = selectedRows[i$$0], seriesCount$$0 = chartDefinition.series.length, layersCount = chartDefinition.pie.layers.length, seriesInEachLayer$$0 = seriesCount$$0 / layersCount, selectedSliceIndex = selectedSliceIndex + (layersCount - 1) * seriesInEachLayer$$0;
    this.ringSlice_(chartDefinition, selectedSliceIndex, interactivityLayer);
    selectionTriggersTooltip && !showAggregateTooltip && this.addTooltipToSlice_(interactionState, selectedSliceIndex);
  }
  selectionTriggersTooltip && showAggregateTooltip && this.addAggregateTooltipToSlices_(interactionState, selectedRows, selectedRows[selectedRows.length - 1]);
  var getSliceAndItsTwin = goog.bind(function(sliceIndex) {
    if (chartDefinition.isDiff) {
      var seriesCount = chartDefinition.series.length, seriesInEachLayer = seriesCount / chartDefinition.pie.layers.length, twin = (sliceIndex + seriesInEachLayer) % seriesCount;
      return[sliceIndex, twin];
    }
    return[sliceIndex];
  }, this), handleFocus = goog.bind(function(serieIndex, mustShowTooltip) {
    if (goog.isDefAndNotNull(serieIndex)) {
      for (var focusedSliceIndices = getSliceAndItsTwin(serieIndex), anySlicesFocused = !1, i = 0;i < focusedSliceIndices.length;++i) {
        var focusedSlice = focusedSliceIndices[i];
        goog.isDefAndNotNull(focusedSlice) && this.isSliceInteractive_(focusedSlice) && (anySlicesFocused = anySlicesFocused || !0, chartDefinition.isDiff ? this.shouldHighlightSelect_ && this.highlightSlice_(chartDefinition, focusedSlice, interactivityLayer) : this.shouldHighlightHover_ && this.glowSlice_(chartDefinition, focusedSlice, interactivityLayer), gviz.canviz.PieChartInteractivityDefiner.glowLabeledLegend_(chartDefinition, focusedSlice, interactivityLayer));
      }
      mustShowTooltip && focusTriggersTooltip && anySlicesFocused && this.addTooltipToSlice_(interactionState, serieIndex);
    }
  }, this), overlayBox = chartState.overlayBox;
  overlayBox && (interactivityLayer.overlayBox = overlayBox);
  handleFocus(chartState.focused.serie, !0);
  handleFocus(chartState.legend.focused.entry, !1);
};
gviz.canviz.PieChartInteractivityDefiner.GLOW_OPACITY_LEVEL = .3;
gviz.canviz.PieChartInteractivityDefiner.GLOW_WIDTH = 6.5;
gviz.canviz.PieChartInteractivityDefiner.RING_WIDTH = 2;
gviz.canviz.PieChartInteractivityDefiner.RING_DISTANCE = 2.5;
gviz.canviz.PieChartInteractivityDefiner.HIGHLIGHT_WIDTH = 2;
gviz.canviz.PieChartInteractivityDefiner.prototype.glowSlice_ = function(chartDefinition, sliceIndex, interactivityLayer) {
  var pie = chartDefinition.pie, slice = chartDefinition.series[sliceIndex];
  if (goog.isDefAndNotNull(slice.offset)) {
    var interactiveSlice = this.createInteractiveSlice_(interactivityLayer, sliceIndex);
    interactiveSlice.glow = {};
    var glow$$0 = interactiveSlice.glow, GLOW_OPACITY_LEVEL = gviz.canviz.PieChartInteractivityDefiner.GLOW_OPACITY_LEVEL;
    glow$$0.brush = new gviz.graphics.Brush({stroke:slice.brush.getFill(), strokeWidth:gviz.canviz.PieChartInteractivityDefiner.GLOW_WIDTH, strokeOpacity:GLOW_OPACITY_LEVEL});
    glow$$0.tip = new goog.math.Coordinate(pie.center.x + slice.offset.x, pie.center.y + slice.offset.y);
    glow$$0.fromDegrees = slice.fromDegrees;
    glow$$0.toDegrees = slice.toDegrees;
    glow$$0.isWholeCircle = slice.isWholeCircle;
    var radiusX, radiusY, ring = interactiveSlice.ring;
    if (ring && chartDefinition.shouldHighlightSelection) {
      radiusX = ring.radiusX + ring.brush.getStrokeWidth() / 2, radiusY = ring.radiusY + ring.brush.getStrokeWidth() / 2;
    } else {
      var halfSliceStrokeWidth = slice.brush.getStrokeWidth() / 2;
      radiusX = pie.radiusX + halfSliceStrokeWidth;
      radiusY = pie.radiusY + halfSliceStrokeWidth;
    }
    var halfGlowStrokeWidth = glow$$0.brush.getStrokeWidth() / 2;
    glow$$0.radiusX = radiusX + halfGlowStrokeWidth;
    glow$$0.radiusY = radiusY + halfGlowStrokeWidth;
    var glowFromRadians = goog.math.toRadians(glow$$0.fromDegrees - 90), glowToRadians = goog.math.toRadians(glow$$0.toDegrees - 90);
    glow$$0.fromPixel = goog.math.Coordinate.sum(glow$$0.tip, (0,gviz.canviz.vectorutils.vectorOnEllipse)(glowFromRadians, glow$$0.radiusX, glow$$0.radiusY));
    glow$$0.toPixel = goog.math.Coordinate.sum(glow$$0.tip, (0,gviz.canviz.vectorutils.vectorOnEllipse)(glowToRadians, glow$$0.radiusX, glow$$0.radiusY));
    var side3D = slice.side3D;
    side3D && (glow$$0.side3D = glow$$0.side3D || {}, glow$$0.side3D.brush = gviz.graphics.Brush.createFillBrush(side3D.brush.getFill(), GLOW_OPACITY_LEVEL), glow$$0.side3D.tip = glow$$0.tip.clone(), glow$$0.side3D.fromDegrees = side3D.fromDegrees, glow$$0.side3D.toDegrees = side3D.toDegrees, glow$$0.side3D.radiusX = glow$$0.radiusX + halfGlowStrokeWidth, glow$$0.side3D.radiusY = glow$$0.radiusY + halfGlowStrokeWidth, glowFromRadians = goog.math.toRadians(glow$$0.side3D.fromDegrees - 90), glowToRadians = 
    goog.math.toRadians(glow$$0.side3D.toDegrees - 90), glow$$0.side3D.fromPixel = goog.math.Coordinate.sum(glow$$0.side3D.tip, (0,gviz.canviz.vectorutils.vectorOnEllipse)(glowFromRadians, glow$$0.side3D.radiusX, glow$$0.side3D.radiusY)), glow$$0.side3D.toPixel = goog.math.Coordinate.sum(glow$$0.side3D.tip, (0,gviz.canviz.vectorutils.vectorOnEllipse)(glowToRadians, glow$$0.side3D.radiusX, glow$$0.side3D.radiusY)));
    glow$$0.drawInnerFrom = slice.drawInnerFrom;
    glow$$0.drawInnerTo = slice.drawInnerTo;
    if (glow$$0.drawInnerFrom || glow$$0.drawInnerTo) {
      glow$$0.innerBrush = gviz.graphics.Brush.createFillBrush(slice.innerBrush.getFill(), GLOW_OPACITY_LEVEL);
      glow$$0.radians = glow$$0.drawInnerFrom ? glowFromRadians : glowToRadians;
      var calcInnerCoordinate = function(glow, direction) {
        return goog.math.Coordinate.sum(glow.tip, (0,gviz.canviz.vectorutils.vectorOnEllipse)(glow.radians, glow.radiusX + direction * glow.brush.getStrokeWidth() / 2, glow.radiusY + direction * glow.brush.getStrokeWidth() / 2));
      };
      glow$$0.innerClose = calcInnerCoordinate(glow$$0, -1);
      glow$$0.innerFar = calcInnerCoordinate(glow$$0, 1);
    }
  }
};
gviz.canviz.PieChartInteractivityDefiner.prototype.ringSlice_ = function(chartDefinition, sliceIndex, interactivityLayer) {
  var pie = chartDefinition.pie;
  if (!(0 < pie.pieHeight)) {
    var slice = chartDefinition.series[sliceIndex];
    if (goog.isDefAndNotNull(slice.offset)) {
      var interactiveSlice = this.createInteractiveSlice_(interactivityLayer, sliceIndex);
      interactiveSlice.ring = {};
      var ring = interactiveSlice.ring;
      ring.brush = gviz.graphics.Brush.createStrokeBrush(slice.brush.getFill(), gviz.canviz.PieChartInteractivityDefiner.RING_WIDTH);
      ring.tip = new goog.math.Coordinate(pie.center.x + slice.offset.x, pie.center.y + slice.offset.y);
      ring.fromDegrees = slice.fromDegrees;
      ring.toDegrees = slice.toDegrees;
      ring.isWholeCircle = slice.isWholeCircle;
      var ringOffset = slice.brush.getStrokeWidth() / 2 + gviz.canviz.PieChartInteractivityDefiner.RING_DISTANCE + ring.brush.getStrokeWidth() / 2;
      ring.radiusX = pie.radiusX + ringOffset;
      ring.radiusY = pie.radiusY + ringOffset;
      var ringFromRadians = goog.math.toRadians(ring.fromDegrees - 90), ringToRadians = goog.math.toRadians(ring.toDegrees - 90);
      ring.fromPixel = goog.math.Coordinate.sum(ring.tip, (0,gviz.canviz.vectorutils.vectorOnEllipse)(ringFromRadians, ring.radiusX, ring.radiusY));
      ring.toPixel = goog.math.Coordinate.sum(ring.tip, (0,gviz.canviz.vectorutils.vectorOnEllipse)(ringToRadians, ring.radiusX, ring.radiusY));
    }
  }
};
gviz.canviz.PieChartInteractivityDefiner.prototype.highlightSlice_ = function(chartDefinition, sliceIndex, interactivityLayer) {
  var slice = chartDefinition.series[sliceIndex];
  if (!goog.isDefAndNotNull(slice.offset)) {
    return null;
  }
  var brush = slice.brush.clone(), fillColor = slice.brush.getFill();
  brush.setStroke(gviz.util.blendHexColors(fillColor, "#000000", .7));
  brush.setFillOpacity(slice.brush.getFillOpacity() + .1);
  var interactiveSlice = this.createInteractiveSlice_(interactivityLayer, sliceIndex);
  interactiveSlice.highlight = {brush:brush};
};
gviz.canviz.PieChartInteractivityDefiner.prototype.addTooltipToSlice_ = function(interactionState, sliceIndex) {
  var interactiveSlice = this.createInteractiveSlice_(interactionState.interactivityLayer, sliceIndex), tooltipDefinition = this.tooltipDefiner.createTooltip(interactionState, sliceIndex, null, null);
  goog.asserts.assert(tooltipDefinition);
  interactiveSlice.tooltip = tooltipDefinition;
  interactionState.actionsMenuState && (goog.asserts.assert(this.actionsMenuDefiner), this.actionsMenuDefiner.extendInteractivityLayer(tooltipDefinition, interactionState.actionsMenuState, interactiveSlice.tooltip));
};
gviz.canviz.PieChartInteractivityDefiner.prototype.addAggregateTooltipToSlices_ = function(interactionState, sliceIndices, positionSlice) {
  var interactiveSlice = this.createInteractiveSlice_(interactionState.interactivityLayer, positionSlice), tooltipDefinition = this.tooltipDefiner.createAggregateSeriesTooltip(interactionState, sliceIndices, positionSlice);
  goog.asserts.assert(tooltipDefinition);
  interactiveSlice.tooltip = tooltipDefinition;
  interactionState.actionsMenuState && (goog.asserts.assert(this.actionsMenuDefiner), this.actionsMenuDefiner.extendInteractivityLayer(tooltipDefinition, interactionState.actionsMenuState, interactiveSlice.tooltip));
};
gviz.canviz.PieChartInteractivityDefiner.glowLabeledLegend_ = function(chartDefinition, entryIndex, interactivityLayer) {
  chartDefinition.labeledLegend && (interactivityLayer.labeledLegend = gviz.canviz.legend.labeledLegendDefiner.generateInteractivityLayer(chartDefinition.labeledLegend, entryIndex));
};
// INPUT (javascript/gviz/devel/jsapi/packages/visualization/corechart/piechart.js)
google.visualization.PieChart = function(container) {
  google.visualization.CoreChart.call(this, container);
  this.setChartType(gviz.canviz.Options.ChartType.PIE);
};
goog.inherits(google.visualization.PieChart, google.visualization.CoreChart);
google.visualization.PieChart.prototype.constructChartDefiner = function(dataTable, options, textMeasureFunction, width, height) {
  return new gviz.canviz.PieChartDefiner(dataTable, options, textMeasureFunction, width, height);
};
google.visualization.PieChart.prototype.constructInteractivityDefiner = function(options, chartDimensions, chartTextStyle, interactivityModel, focusTarget, numberOfSeries, opt_actionsMenuDefiner) {
  return new gviz.canviz.PieChartInteractivityDefiner(options, chartDimensions, chartTextStyle, interactivityModel, focusTarget, numberOfSeries, opt_actionsMenuDefiner);
};
google.visualization.PieChart.prototype.constructEventHandler = function(interactionEventTarget, renderer, overlayArea) {
  return new gviz.canviz.PieChartEventHandler(interactionEventTarget, renderer, overlayArea);
};
google.visualization.PieChart.prototype.constructBuilder = function(overlayArea, renderer) {
  return new gviz.canviz.PieChartBuilder(overlayArea, renderer);
};
google.visualization.PieChart.prototype.computeDiff = function(oldDataTable, newDataTable) {
  var diffData = this.computeDiffInternal(oldDataTable, newDataTable);
  return diffData;
};
// INPUT (javascript/gviz/devel/jsapi/packages/visualization/corechart/googleapis_export.js)
goog.exportSymbol("google.visualization.CoreChart", google.visualization.CoreChart);
goog.exportProperty(google.visualization.CoreChart.prototype, "draw", google.visualization.CoreChart.prototype.draw);
goog.exportProperty(google.visualization.CoreChart.prototype, "getImageURI", google.visualization.CoreChart.prototype.getImageURI);
goog.exportProperty(google.visualization.CoreChart.prototype, "getSelection", google.visualization.CoreChart.prototype.getSelection);
goog.exportProperty(google.visualization.CoreChart.prototype, "setSelection", google.visualization.CoreChart.prototype.setSelection);
goog.exportProperty(google.visualization.CoreChart.prototype, "dump", google.visualization.CoreChart.prototype.dump);
goog.exportProperty(google.visualization.CoreChart.prototype, "clearChart", google.visualization.CoreChart.prototype.clearChart);
goog.exportProperty(google.visualization.CoreChart.prototype, "getChartLayoutInterface", google.visualization.CoreChart.prototype.getChartLayoutInterface);
goog.exportProperty(google.visualization.CoreChart.prototype, "getContainer", google.visualization.CoreChart.prototype.getContainer);
goog.exportProperty(google.visualization.CoreChart.prototype, "setAction", google.visualization.CoreChart.prototype.setAction);
goog.exportProperty(google.visualization.CoreChart.prototype, "getAction", google.visualization.CoreChart.prototype.getAction);
goog.exportProperty(google.visualization.CoreChart.prototype, "removeAction", google.visualization.CoreChart.prototype.removeAction);
goog.exportSymbol("google.visualization.AreaChart", google.visualization.AreaChart);
goog.exportProperty(google.visualization.AreaChart.prototype, "draw", google.visualization.AreaChart.prototype.draw);
goog.exportProperty(google.visualization.AreaChart.prototype, "getImageURI", google.visualization.AreaChart.prototype.getImageURI);
goog.exportProperty(google.visualization.AreaChart.prototype, "getSelection", google.visualization.AreaChart.prototype.getSelection);
goog.exportProperty(google.visualization.AreaChart.prototype, "setSelection", google.visualization.AreaChart.prototype.setSelection);
goog.exportProperty(google.visualization.AreaChart.prototype, "setAction", google.visualization.AreaChart.prototype.setAction);
goog.exportProperty(google.visualization.AreaChart.prototype, "getAction", google.visualization.AreaChart.prototype.getAction);
goog.exportProperty(google.visualization.AreaChart.prototype, "removeAction", google.visualization.AreaChart.prototype.removeAction);
goog.exportSymbol("google.visualization.BarChart", google.visualization.BarChart);
goog.exportProperty(google.visualization.BarChart.prototype, "computeDiff", google.visualization.BarChart.prototype.computeDiff);
goog.exportProperty(google.visualization.BarChart.prototype, "draw", google.visualization.BarChart.prototype.draw);
goog.exportProperty(google.visualization.BarChart.prototype, "getImageURI", google.visualization.BarChart.prototype.getImageURI);
goog.exportProperty(google.visualization.BarChart.prototype, "getSelection", google.visualization.BarChart.prototype.getSelection);
goog.exportProperty(google.visualization.BarChart.prototype, "setSelection", google.visualization.BarChart.prototype.setSelection);
goog.exportProperty(google.visualization.BarChart.prototype, "setAction", google.visualization.BarChart.prototype.setAction);
goog.exportProperty(google.visualization.BarChart.prototype, "getAction", google.visualization.BarChart.prototype.getAction);
goog.exportProperty(google.visualization.BarChart.prototype, "removeAction", google.visualization.BarChart.prototype.removeAction);
goog.exportSymbol("google.visualization.BubbleChart", google.visualization.BubbleChart);
goog.exportProperty(google.visualization.BubbleChart.prototype, "draw", google.visualization.BubbleChart.prototype.draw);
goog.exportProperty(google.visualization.BubbleChart.prototype, "getImageURI", google.visualization.BubbleChart.prototype.getImageURI);
goog.exportProperty(google.visualization.BubbleChart.prototype, "getSelection", google.visualization.BubbleChart.prototype.getSelection);
goog.exportProperty(google.visualization.BubbleChart.prototype, "setSelection", google.visualization.BubbleChart.prototype.setSelection);
goog.exportProperty(google.visualization.BubbleChart.prototype, "setAction", google.visualization.BubbleChart.prototype.setAction);
goog.exportProperty(google.visualization.BubbleChart.prototype, "getAction", google.visualization.BubbleChart.prototype.getAction);
goog.exportProperty(google.visualization.BubbleChart.prototype, "removeAction", google.visualization.BubbleChart.prototype.removeAction);
goog.exportSymbol("google.visualization.CandlestickChart", google.visualization.CandlestickChart);
goog.exportProperty(google.visualization.CandlestickChart.prototype, "draw", google.visualization.CandlestickChart.prototype.draw);
goog.exportProperty(google.visualization.CandlestickChart.prototype, "getImageURI", google.visualization.CandlestickChart.prototype.getImageURI);
goog.exportProperty(google.visualization.CandlestickChart.prototype, "getSelection", google.visualization.CandlestickChart.prototype.getSelection);
goog.exportProperty(google.visualization.CandlestickChart.prototype, "setSelection", google.visualization.CandlestickChart.prototype.setSelection);
goog.exportProperty(google.visualization.CandlestickChart.prototype, "setAction", google.visualization.CandlestickChart.prototype.setAction);
goog.exportProperty(google.visualization.CandlestickChart.prototype, "getAction", google.visualization.CandlestickChart.prototype.getAction);
goog.exportProperty(google.visualization.CandlestickChart.prototype, "removeAction", google.visualization.CandlestickChart.prototype.removeAction);
goog.exportSymbol("google.visualization.Histogram", google.visualization.Histogram);
goog.exportProperty(google.visualization.Histogram.prototype, "draw", google.visualization.Histogram.prototype.draw);
goog.exportProperty(google.visualization.Histogram.prototype, "getImageURI", google.visualization.Histogram.prototype.getImageURI);
goog.exportProperty(google.visualization.Histogram.prototype, "getSelection", google.visualization.Histogram.prototype.getSelection);
goog.exportProperty(google.visualization.Histogram.prototype, "setSelection", google.visualization.Histogram.prototype.setSelection);
goog.exportProperty(google.visualization.Histogram.prototype, "setAction", google.visualization.Histogram.prototype.setAction);
goog.exportProperty(google.visualization.Histogram.prototype, "getAction", google.visualization.Histogram.prototype.getAction);
goog.exportProperty(google.visualization.Histogram.prototype, "removeAction", google.visualization.Histogram.prototype.removeAction);
goog.exportSymbol("google.visualization.ColumnChart", google.visualization.ColumnChart);
goog.exportProperty(google.visualization.ColumnChart.prototype, "computeDiff", google.visualization.ColumnChart.prototype.computeDiff);
goog.exportProperty(google.visualization.ColumnChart.prototype, "draw", google.visualization.ColumnChart.prototype.draw);
goog.exportProperty(google.visualization.ColumnChart.prototype, "getImageURI", google.visualization.ColumnChart.prototype.getImageURI);
goog.exportProperty(google.visualization.ColumnChart.prototype, "getSelection", google.visualization.ColumnChart.prototype.getSelection);
goog.exportProperty(google.visualization.ColumnChart.prototype, "setSelection", google.visualization.ColumnChart.prototype.setSelection);
goog.exportProperty(google.visualization.ColumnChart.prototype, "setAction", google.visualization.ColumnChart.prototype.setAction);
goog.exportProperty(google.visualization.ColumnChart.prototype, "getAction", google.visualization.ColumnChart.prototype.getAction);
goog.exportProperty(google.visualization.ColumnChart.prototype, "removeAction", google.visualization.ColumnChart.prototype.removeAction);
goog.exportSymbol("google.visualization.ComboChart", google.visualization.ComboChart);
goog.exportProperty(google.visualization.ComboChart.prototype, "draw", google.visualization.ComboChart.prototype.draw);
goog.exportProperty(google.visualization.ComboChart.prototype, "getImageURI", google.visualization.ComboChart.prototype.getImageURI);
goog.exportProperty(google.visualization.ComboChart.prototype, "getSelection", google.visualization.ComboChart.prototype.getSelection);
goog.exportProperty(google.visualization.ComboChart.prototype, "setSelection", google.visualization.ComboChart.prototype.setSelection);
goog.exportProperty(google.visualization.ComboChart.prototype, "setAction", google.visualization.ComboChart.prototype.setAction);
goog.exportProperty(google.visualization.ComboChart.prototype, "getAction", google.visualization.ComboChart.prototype.getAction);
goog.exportProperty(google.visualization.ComboChart.prototype, "removeAction", google.visualization.ComboChart.prototype.removeAction);
goog.exportSymbol("google.visualization.LineChart", google.visualization.LineChart);
goog.exportProperty(google.visualization.LineChart.prototype, "draw", google.visualization.LineChart.prototype.draw);
goog.exportProperty(google.visualization.LineChart.prototype, "getImageURI", google.visualization.LineChart.prototype.getImageURI);
goog.exportProperty(google.visualization.LineChart.prototype, "getSelection", google.visualization.LineChart.prototype.getSelection);
goog.exportProperty(google.visualization.LineChart.prototype, "setSelection", google.visualization.LineChart.prototype.setSelection);
goog.exportProperty(google.visualization.LineChart.prototype, "setAction", google.visualization.LineChart.prototype.setAction);
goog.exportProperty(google.visualization.LineChart.prototype, "getAction", google.visualization.LineChart.prototype.getAction);
goog.exportProperty(google.visualization.LineChart.prototype, "removeAction", google.visualization.LineChart.prototype.removeAction);
goog.exportSymbol("google.visualization.PieChart", google.visualization.PieChart);
goog.exportProperty(google.visualization.PieChart.prototype, "computeDiff", google.visualization.PieChart.prototype.computeDiff);
goog.exportProperty(google.visualization.PieChart.prototype, "draw", google.visualization.PieChart.prototype.draw);
goog.exportProperty(google.visualization.PieChart.prototype, "getImageURI", google.visualization.PieChart.prototype.getImageURI);
goog.exportProperty(google.visualization.PieChart.prototype, "getSelection", google.visualization.PieChart.prototype.getSelection);
goog.exportProperty(google.visualization.PieChart.prototype, "setSelection", google.visualization.PieChart.prototype.setSelection);
goog.exportProperty(google.visualization.PieChart.prototype, "setAction", google.visualization.PieChart.prototype.setAction);
goog.exportProperty(google.visualization.PieChart.prototype, "getAction", google.visualization.PieChart.prototype.getAction);
goog.exportProperty(google.visualization.PieChart.prototype, "removeAction", google.visualization.PieChart.prototype.removeAction);
goog.exportSymbol("google.visualization.ScatterChart", google.visualization.ScatterChart);
goog.exportProperty(google.visualization.ScatterChart.prototype, "computeDiff", google.visualization.ScatterChart.prototype.computeDiff);
goog.exportProperty(google.visualization.ScatterChart.prototype, "draw", google.visualization.ScatterChart.prototype.draw);
goog.exportProperty(google.visualization.ScatterChart.prototype, "getImageURI", google.visualization.ScatterChart.prototype.getImageURI);
goog.exportProperty(google.visualization.ScatterChart.prototype, "getSelection", google.visualization.ScatterChart.prototype.getSelection);
goog.exportProperty(google.visualization.ScatterChart.prototype, "setSelection", google.visualization.ScatterChart.prototype.setSelection);
goog.exportProperty(google.visualization.ScatterChart.prototype, "setAction", google.visualization.ScatterChart.prototype.setAction);
goog.exportProperty(google.visualization.ScatterChart.prototype, "getAction", google.visualization.ScatterChart.prototype.getAction);
goog.exportProperty(google.visualization.ScatterChart.prototype, "removeAction", google.visualization.ScatterChart.prototype.removeAction);
goog.exportSymbol("google.visualization.SparklineChart", google.visualization.SparklineChart);
goog.exportProperty(google.visualization.SparklineChart.prototype, "draw", google.visualization.SparklineChart.prototype.draw);
goog.exportProperty(google.visualization.SparklineChart.prototype, "getImageURI", google.visualization.SparklineChart.prototype.getImageURI);
goog.exportProperty(google.visualization.SparklineChart.prototype, "getSelection", google.visualization.SparklineChart.prototype.getSelection);
goog.exportProperty(google.visualization.SparklineChart.prototype, "setSelection", google.visualization.SparklineChart.prototype.setSelection);
goog.exportProperty(google.visualization.SparklineChart.prototype, "setAction", google.visualization.SparklineChart.prototype.setAction);
goog.exportProperty(google.visualization.SparklineChart.prototype, "getAction", google.visualization.SparklineChart.prototype.getAction);
goog.exportProperty(google.visualization.SparklineChart.prototype, "removeAction", google.visualization.SparklineChart.prototype.removeAction);
goog.exportSymbol("google.visualization.SteppedAreaChart", google.visualization.SteppedAreaChart);
goog.exportProperty(google.visualization.SteppedAreaChart.prototype, "draw", google.visualization.SteppedAreaChart.prototype.draw);
goog.exportProperty(google.visualization.SteppedAreaChart.prototype, "getImageURI", google.visualization.SteppedAreaChart.prototype.getImageURI);
goog.exportProperty(google.visualization.SteppedAreaChart.prototype, "getSelection", google.visualization.SteppedAreaChart.prototype.getSelection);
goog.exportProperty(google.visualization.SteppedAreaChart.prototype, "setSelection", google.visualization.SteppedAreaChart.prototype.setSelection);
goog.exportProperty(google.visualization.SteppedAreaChart.prototype, "setAction", google.visualization.SteppedAreaChart.prototype.setAction);
goog.exportProperty(google.visualization.SteppedAreaChart.prototype, "getAction", google.visualization.SteppedAreaChart.prototype.getAction);
goog.exportProperty(google.visualization.SteppedAreaChart.prototype, "removeAction", google.visualization.SteppedAreaChart.prototype.removeAction);
goog.exportSymbol("google.visualization.RangeSelector", google.visualization.RangeSelector);
goog.exportProperty(google.visualization.RangeSelector.prototype, "draw", google.visualization.RangeSelector.prototype.draw);
goog.exportProperty(google.visualization.RangeSelector.prototype, "getRange", google.visualization.RangeSelector.prototype.getRange);
goog.exportProperty(google.visualization.RangeSelector.prototype, "setRange", google.visualization.RangeSelector.prototype.setRange);
;window.google&&window.google.loader&&window.google.loader.eval&&window.google.loader.eval.visualization&&(window.google.loader.eval.visualization=function(){eval(arguments[0])});
});
/*jsl:END*/
