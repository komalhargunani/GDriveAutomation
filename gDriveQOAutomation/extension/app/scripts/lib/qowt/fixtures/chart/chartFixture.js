/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([], function() {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'chart',

    'chart': {

      'general': {

        'allAutoMarkerResult': function() {
          return [
            "filledDiamond",
            "filledSquare",
            "filledTriangle",
            "x",
            "star",
            "filledCircle",
            "plus",
            "dot",
            "dash",
            "filledDiamond",
            "filledSquare",
            "filledTriangle"
          ];
        },

        'someAutoMarkerResult': function() {
          return [
            "filledDiamond",
            "filledDiamond",
            "filledSquare",
            "filledTriangle",
            "filledCircle",
            "x",
            "plus",
            "dot",
            "filledSquare",
            "dash",
            "star",
            "filledCircle"
          ];
        },

        'seriesAllAutoMarkers': function() {
          return [
            {
              markerOptions:{style:"auto"},
              label:"Eggs"
            },{
              markerOptions:{style:"auto"},
              label:"Bacon"
            },{
              markerOptions:{style:"auto"},
              label:"Tomatoes"
            },{
              markerOptions:{style:"auto"},
              label:"Sausages"
            },{
              markerOptions:{style:"auto"},
              label:"Eggs"
            },{
              markerOptions:{style:"auto"},
              label:"Bacon"
            },{
              markerOptions:{style:"auto"},
              label:"Tomatoes"
            },{
              markerOptions:{style:"auto"},
              label:"Sausages"
            },{
              markerOptions:{style:"auto"},
              label:"Eggs"
            },{
              markerOptions:{style:"auto"},
              label:"Bacon"
            },{
              markerOptions:{style:"auto"},
              label:"Tomatoes"
            },{
              markerOptions:{style:"auto"},
              label:"Sausages"
            }
          ];
        },

        'seriesSomeAutoMarkers': function() {
          return [
            {
              markerOptions:{sym:"dia"},
              label:"Eggs"
            },{
              markerOptions:{style:"auto"},
              label:"Bacon"
            },{
              markerOptions:{style:"auto"},
              label:"Tomatoes"
            },{
              markerOptions:{style:"auto"},
              label:"Sausages"
            },{
              markerOptions:{sym:"circ"},
              label:"Eggs"
            },{
              markerOptions:{style:"auto"},
              label:"Bacon"
            },{
              markerOptions:{sym:"plus"},
              label:"Tomatoes"
            },{
              markerOptions:{sym:"dot"},
              label:"Sausages"
            },{
              markerOptions:{sym:"squ"},
              label:"Eggs"
            },{
              markerOptions:{sym:"dash"},
              label:"Bacon"
            },{
              markerOptions:{style:"auto"},
              label:"Tomatoes"
            },{
              markerOptions:{style:"auto"},
              label:"Sausages"
            }
          ];
        }

      },

      'line': {

        'standard': function(chartId) {
          return {
            etp:"cht",
            chid:chartId,
            type:"line",
            subt:"std",
            title:["Standard line chart"],
            cats:["Eggs","Bacon","Tomatoes","Sausages"],
            clrArr:[]
          };
        },

        'stacked': function(chartId) {
          return {
            etp: "cht",
            chid: chartId,
            type: "line",
            subt: "stack",
            title:["Stacked line chart"],
            cats: ["Dollar","Yen","Sterling","Balboa"],
            clrArr:[]
          };
        }

      },

      'column': {

        'clustered': function(chartId) {
          return {
            etp:"cht",
            chid:chartId,
            type:"col",
            subt:"clust",
            title:["Clustered column chart"],
            cats: ["Eggs","Bacon","Tomatoes","Sausages"],
            clrArr:[]
          };
        },

        'stacked': function(chartId) {
          return {
            etp:"cht",
            chid:chartId,
            type:"col",
            subt:"stack",
            title:["Stacked column chart"],
            cats: ["Dollar","Yen","Sterling","Balboa"],
            clrArr:[]
          };
        }

      },

      'pie': {

        'standard': function(chartId) {
          return {
            etp:"cht",
            chid:chartId,
            title:["Standard pie chart"],
            type:"pie"
          }
        }

      },

      'bar': {

        'stacked': function(chartId) {
          return {
            etp:"cht",
            chid:chartId,
            title:["Stacked bar chart"],
            type:"bar",
            subt:"stack",
            cats: ["Pear","Watermelon","Mango","Orange"]
          }
        },

        'clustered': function(chartId) {
          return {
            chid:chartId,
            etp:"cht",
            title:["Clustered bar chart"],
            type:"bar",
            subt:"clust",
            cats: ["Eggs","Bacon","Tomatoes","Sausages"]
          }
        }

      }

    }

  };

});
