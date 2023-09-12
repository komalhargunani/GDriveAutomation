define([
  'qowtRoot/utils/charts/percentStackedChartBuilder'
], function(
    PercentStackedBuilder) {

  'use strict';

  describe('Percent stacked charts tests', function() {
    var chartObj = {
      'options': {
        'hAxis': {
          'viewWindow': {}
        },
        'vAxis': {
          'viewWindow': {}
        }
      },
      'data': [
        [null, 'Series 1', 'Series 2', 'Series 3']
      ]};


    beforeEach(function() {
      chartObj.data = [
        [null, 'Series 1', 'Series 2', 'Series 3'],
        ['Category 1', 4.3, 2.4, 2]
      ];
    });

    it('should return correct data values for Line chart', function() {
      chartObj.type = 'LineChart';
      PercentStackedBuilder.build(chartObj);

      expect(chartObj.data[1][1]).toEqual(0.4942528735632184);
      expect(chartObj.data[1][2]).toEqual(0.7701149425287356);
      expect(chartObj.data[1][3]).toEqual(1);
    });

    it('should return correct data values for column chart', function() {
      chartObj.type = 'ColumnChart';
      PercentStackedBuilder.build(chartObj);

      expect(chartObj.data[1][1]).toEqual(0.4942528735632184);
      expect(chartObj.data[1][2]).toEqual(0.27586206896551724);
      expect(chartObj.data[1][3]).toEqual(0.2298850574712644);
    });

    it('should return correct data values for bar chart', function() {
      chartObj.type = 'BarChart';

      PercentStackedBuilder.build(chartObj);

      expect(chartObj.data[1][1]).toEqual(0.4942528735632184);
      expect(chartObj.data[1][2]).toEqual(0.27586206896551724);
      expect(chartObj.data[1][3]).toEqual(0.2298850574712644);
    });

    it('should set proper options for line chart', function() {
      chartObj.type = 'LineChart';

      PercentStackedBuilder.build(chartObj);

      expect(chartObj.options.vAxis.viewWindow.max).toEqual(1);
      expect(chartObj.options.vAxis.format).toEqual('#%');
    });

    it('should set proper options for column chart', function() {
      chartObj.type = 'ColumnChart';

      PercentStackedBuilder.build(chartObj);

      expect(chartObj.options.vAxis.viewWindow.max).toEqual(1);
      expect(chartObj.options.vAxis.format).toEqual('#%');
    });

    it('should set proper options for bar chart', function() {
      chartObj.type = 'BarChart';

      PercentStackedBuilder.build(chartObj);

      expect(chartObj.options.hAxis.viewWindow.max).toEqual(1);
      expect(chartObj.options.hAxis.format).toEqual('#%');
    });
  });
});

