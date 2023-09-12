// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for point tableCellBorderDefinitions
 *
 * @see src/drawing/styles/tableStyles/tableStyleDefinitions.js
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/drawing/styles/tableStyles/tableStyleDefinitions'
], function(TableStyleDefinitions) {

  'use strict';

  describe('TableStyleDefinitions test', function() {

    it('should return proper JSON for "Light Style 1-Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'styleId': undefined,
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'right': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'tx1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };

          var tableStyleDefinition = new TableStyleDefinitions['Light-Style-1'](
              'accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle.band1H).toEqual(expectedTableStyle.band1H);
          expect(tableStyle.band1V).toEqual(expectedTableStyle.band1V);
          expect(tableStyle.firstCol).toEqual(expectedTableStyle.firstCol);
          expect(tableStyle.firstRow).toEqual(expectedTableStyle.firstRow);
          expect(tableStyle.lastCol).toEqual(expectedTableStyle.lastCol);
          expect(tableStyle.lastRow).toEqual(expectedTableStyle.lastRow);
          expect(tableStyle.wholeTbl).toEqual(expectedTableStyle.wholeTbl);

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Light Style 2 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'tcBdr': {
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              }
            },
            'band2V': {
              'tcStyle': {
                'tcBdr': {
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fillRef': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'idx': '1'
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'bg1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'lastCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'dbl',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 50800
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'styleId': undefined,
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'tx1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };
          var tableStyleDefinition = new TableStyleDefinitions['Light-Style-2'](
              'accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();
          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Light Style 3 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'dbl',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 50800
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'styleId': undefined,
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideH': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideV': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'left': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'right': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'tx1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };

          var tableStyleDefinition = new TableStyleDefinitions['Light-Style-3'](
              'accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();
          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Medium Style 1 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'lastCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'lt1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'dbl',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 50800
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'styleId': undefined,
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'lt1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideH': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'right': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'dk1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };


          var tableStyleDefinition = new TableStyleDefinitions[
              'Medium-Style-1']('accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Medium Style 2 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 40000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 40000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 38100
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'lastCol': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 38100
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'name': undefined,
            'styleId': undefined,
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideH': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideV': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'left': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'right': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'dk1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };

          var tableStyleDefinition = new TableStyleDefinitions[
              'Medium-Style-2']('accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Medium Style 3 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'dk1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'dk1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'dk1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'lastCol': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'lt1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'dbl',
                      'fill': {
                        'color': {
                          'scheme': 'dk1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 50800
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'seCell': {
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'dk1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'styleId': undefined,
            'swCell': {
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'dk1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'lt1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'dk1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'right': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'dk1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'dk1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };

          var tableStyleDefinition = new TableStyleDefinitions[
              'Medium-Style-3']('accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Medium Style 4 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 40000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 40000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastCol': {
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'styleId': undefined,
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'tint',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideH': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideV': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'left': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'right': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'accent6',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'dk1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };


          var tableStyleDefinition = new TableStyleDefinitions[
              'Medium-Style-4']('accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Dark Style 1" table style', function() {

      var expectedTableStyle = {
        'band1H': {
          'tcStyle': {
            'fill': {
              'color': {
                'effects': [
                  {
                    'name': 'tint',
                    'value': 40000.0
                  }
                ],
                'scheme': 'dk1',
                'type': 'schemeClr'
              },
              'type': 'solidFill'
            }
          }
        },
        'band1V': {
          'tcStyle': {
            'fill': {
              'color': {
                'effects': [
                  {
                    'name': 'tint',
                    'value': 40000.0
                  }
                ],
                'scheme': 'dk1',
                'type': 'schemeClr'
              },
              'type': 'solidFill'
            }
          }
        },
        'etp': 'tbStyl',
        'firstCol': {
          'tcStyle': {
            'fill': {
              'color': {
                'effects': [
                  {
                    'name': 'tint',
                    'value': 60000.0
                  }
                ],
                'scheme': 'dk1',
                'type': 'schemeClr'
              },
              'type': 'solidFill'
            },
            'tcBdr': {
              'right': {
                'ln': {
                  'cmpd': 'sng',
                  'fill': {
                    'color': {
                      'scheme': 'lt1',
                      'type': 'schemeClr'
                    },
                    'type': 'solidFill'
                  },
                  'w': 25400
                }
              }
            }
          },
          'tcTxStyle': {
            'b': 'on'
          }
        },
        'firstRow': {
          'tcStyle': {
            'fill': {
              'color': {
                'scheme': 'dk1',
                'type': 'schemeClr'
              },
              'type': 'solidFill'
            },
            'tcBdr': {
              'bottom': {
                'ln': {
                  'cmpd': 'sng',
                  'fill': {
                    'color': {
                      'scheme': 'lt1',
                      'type': 'schemeClr'
                    },
                    'type': 'solidFill'
                  },
                  'w': 25400
                }
              }
            }
          },
          'tcTxStyle': {
            'b': 'on'
          }
        },
        'lastCol': {
          'tcStyle': {
            'fill': {
              'color': {
                'effects': [
                  {
                    'name': 'tint',
                    'value': 60000.0
                  }
                ],
                'scheme': 'dk1',
                'type': 'schemeClr'
              },
              'type': 'solidFill'
            },
            'tcBdr': {
              'left': {
                'ln': {
                  'cmpd': 'sng',
                  'fill': {
                    'color': {
                      'scheme': 'lt1',
                      'type': 'schemeClr'
                    },
                    'type': 'solidFill'
                  },
                  'w': 25400
                }
              }
            }
          },
          'tcTxStyle': {
            'b': 'on'
          }
        },
        'lastRow': {
          'tcStyle': {
            'fill': {
              'color': {
                'effects': [
                  {
                    'name': 'tint',
                    'value': 60000.0
                  }
                ],
                'scheme': 'dk1',
                'type': 'schemeClr'
              },
              'type': 'solidFill'
            },
            'tcBdr': {
              'top': {
                'ln': {
                  'cmpd': 'sng',
                  'fill': {
                    'color': {
                      'scheme': 'lt1',
                      'type': 'schemeClr'
                    },
                    'type': 'solidFill'
                  },
                  'w': 25400
                }
              }
            }
          },
          'tcTxStyle': {
            'b': 'on'
          }
        },
        'name': 'Dark Style 1',
        'neCell': {
          'tcStyle': {
            'tcBdr': {
              'left': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              }
            }
          }
        },
        'nwCell': {
          'tcStyle': {
            'tcBdr': {
              'right': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              }
            }
          }
        },
        'seCell': {
          'tcStyle': {
            'tcBdr': {
              'left': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              }
            }
          }
        },
        'styleId': '{E8034E78-7F5D-4C2E-B375-FC64B27BC917}',
        'swCell': {
          'tcStyle': {
            'tcBdr': {
              'right': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              }
            }
          }
        },
        'wholeTbl': {
          'tcStyle': {
            'fill': {
              'color': {
                'effects': [
                  {
                    'name': 'tint',
                    'value': 20000.0
                  }
                ],
                'scheme': 'dk1',
                'type': 'schemeClr'
              },
              'type': 'solidFill'
            },
            'tcBdr': {
              'bottom': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              },
              'insideH': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              },
              'insideV': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              },
              'left': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              },
              'right': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              },
              'top': {
                'ln': {
                  'fill': {
                    'type': 'noFill'
                  }
                }
              }
            }
          },
          'tcTxStyle': {
            'color': {
              'scheme': 'lt1',
              'type': 'schemeClr'
            },
            'fontRef': {
              'color': {
                'clr': '#000000',
                'effects': [
                  {
                    'name': 'alpha',
                    'value': 100000.0
                  }
                ],
                'type': 'srgbClr'
              },
              'idx': 'minor'
            }
          }
        }
      };

      var tableStyleDefinition = new TableStyleDefinitions['Dark-Style-1-dk1'](
          'dk1', '');
      var tableStyle = tableStyleDefinition.getTableStyle();

      expect(tableStyle).toEqual(expectedTableStyle);
    });

    it('should return proper JSON for "Dark Style 1 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'shade',
                        'value': 60000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'shade',
                        'value': 60000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'shade',
                        'value': 60000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'right': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'dk1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastCol': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'shade',
                        'value': 60000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'left': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'shade',
                        'value': 40000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'lt1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 25400
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'neCell': {
              'tcStyle': {
                'tcBdr': {
                  'left': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              }
            },
            'nwCell': {
              'tcStyle': {
                'tcBdr': {
                  'right': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              }
            },
            'seCell': {
              'tcStyle': {
                'tcBdr': {
                  'left': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              }
            },
            'styleId': undefined,
            'swCell': {
              'tcStyle': {
                'tcBdr': {
                  'right': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              }
            },
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'right': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'top': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };

          var tableStyleDefinition = new TableStyleDefinitions['Dark-Style-1'](
              'accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Dark Style 2 - Accent5/Accent6" ' +
        'table style', function() {

         var expectedTableStyle = {
           'band1H': {
             'tcStyle': {
               'fill': {
                 'color': {
                   'effects': [
                     {
                       'name': 'tint',
                       'value': 40000.0
                     }
                   ],
                   'scheme': 'accent5',
                   'type': 'schemeClr'
                 },
                 'type': 'solidFill'
               }
             }
           },
           'band1V': {
             'tcStyle': {
               'fill': {
                 'color': {
                   'effects': [
                     {
                       'name': 'tint',
                       'value': 40000.0
                     }
                   ],
                   'scheme': 'accent5',
                   'type': 'schemeClr'
                 },
                 'type': 'solidFill'
               }
             }
           },
           'etp': 'tbStyl',
           'firstCol': {
             'tcTxStyle': {
               'b': 'on'
             }
           },
           'firstRow': {
             'tcStyle': {
               'fill': {
                 'color': {
                   'scheme': 'accent6',
                   'type': 'schemeClr'
                 },
                 'type': 'solidFill'
               }
             },
             'tcTxStyle': {
               'b': 'on',
               'color': {
                 'scheme': 'lt1',
                 'type': 'schemeClr'
               },
               'fontRef': {
                 'color': {
                   'clr': '#000000',
                   'effects': [
                     {
                       'name': 'alpha',
                       'value': 100000.0
                     }
                   ],
                   'type': 'srgbClr'
                 },
                 'idx': 'minor'
               }
             }
           },
           'lastCol': {
             'tcTxStyle': {
               'b': 'on'
             }
           },
           'lastRow': {
             'tcStyle': {
               'fill': {
                 'color': {
                   'effects': [
                     {
                       'name': 'tint',
                       'value': 20000.0
                     }
                   ],
                   'scheme': 'accent5',
                   'type': 'schemeClr'
                 },
                 'type': 'solidFill'
               },
               'tcBdr': {
                 'top': {
                   'ln': {
                     'cmpd': 'dbl',
                     'fill': {
                       'color': {
                         'scheme': 'dk1',
                         'type': 'schemeClr'
                       },
                       'type': 'solidFill'
                     },
                     'w': 50800
                   }
                 }
               }
             },
             'tcTxStyle': {
               'b': 'on'
             }
           },
           'name': undefined,
           'styleId': undefined,
           'wholeTbl': {
             'tcStyle': {
               'fill': {
                 'color': {
                   'effects': [
                     {
                       'name': 'tint',
                       'value': 20000.0
                     }
                   ],
                   'scheme': 'accent5',
                   'type': 'schemeClr'
                 },
                 'type': 'solidFill'
               },
               'tcBdr': {
                 'bottom': {
                   'ln': {
                     'fill': {
                       'type': 'noFill'
                     }
                   }
                 },
                 'insideH': {
                   'ln': {
                     'fill': {
                       'type': 'noFill'
                     }
                   }
                 },
                 'insideV': {
                   'ln': {
                     'fill': {
                       'type': 'noFill'
                     }
                   }
                 },
                 'left': {
                   'ln': {
                     'fill': {
                       'type': 'noFill'
                     }
                   }
                 },
                 'right': {
                   'ln': {
                     'fill': {
                       'type': 'noFill'
                     }
                   }
                 },
                 'top': {
                   'ln': {
                     'fill': {
                       'type': 'noFill'
                     }
                   }
                 }
               }
             },
             'tcTxStyle': {
               'color': {
                 'scheme': 'dk1',
                 'type': 'schemeClr'
               },
               'fontRef': {
                 'color': {
                   'clr': '#000000',
                   'effects': [
                     {
                       'name': 'alpha',
                       'value': 100000.0
                     }
                   ],
                   'type': 'srgbClr'
                 },
                 'idx': 'minor'
               }
             }
           }
         };


         var tableStyleDefinition = new TableStyleDefinitions['Dark-Style-2'](
             'accent5', 'accent6');
         var tableStyle = tableStyleDefinition.getTableStyle();

         expect(tableStyle).toEqual(expectedTableStyle);
       });

    it('should return proper JSON for "Themed Style 1 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 40000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 40000.0
                      }
                    ],
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcStyle': {
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideH': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'scheme': 'accent6',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                },
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'lt1',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on',
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            },
            'lastCol': {
              'tcStyle': {
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideH': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'styleId': undefined,
            'tblBg': {
              'fillRef': {
                'color': {
                  'scheme': 'accent6',
                  'type': 'schemeClr'
                },
                'idx': '2'
              }
            },
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideH': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideV': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'dk1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };

          var tableStyleDefinition = new TableStyleDefinitions[
              'Themed-Style-1']('accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "Themed Style 2 - Accent6" table style',
        function() {

          var expectedTableStyle = {
            'band1H': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'lt1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'band1V': {
              'tcStyle': {
                'fill': {
                  'color': {
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 20000.0
                      }
                    ],
                    'scheme': 'lt1',
                    'type': 'schemeClr'
                  },
                  'type': 'solidFill'
                }
              }
            },
            'etp': 'tbStyl',
            'firstCol': {
              'tcStyle': {
                'tcBdr': {
                  'right': {
                    'lnRef': {
                      'color': {
                        'scheme': 'lt1',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'firstRow': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'scheme': 'lt1',
                        'type': 'schemeClr'
                      },
                      'idx': '3'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastCol': {
              'tcStyle': {
                'tcBdr': {
                  'left': {
                    'lnRef': {
                      'color': {
                        'scheme': 'lt1',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'lastRow': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'top': {
                    'lnRef': {
                      'color': {
                        'scheme': 'lt1',
                        'type': 'schemeClr'
                      },
                      'idx': '2'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'b': 'on'
              }
            },
            'name': undefined,
            'neCell': {
              'tcStyle': {
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              }
            },
            'seCell': {
              'tcStyle': {
                'tcBdr': {
                  'left': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'top': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              }
            },
            'styleId': undefined,
            'swCell': {
              'tcStyle': {
                'tcBdr': {
                  'right': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'top': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              }
            },
            'tblBg': {
              'fillRef': {
                'color': {
                  'scheme': 'accent6',
                  'type': 'schemeClr'
                },
                'idx': '3'
              }
            },
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'lnRef': {
                      'color': {
                        'effects': [
                          {
                            'name': 'tint',
                            'value': 50000.0
                          }
                        ],
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'lnRef': {
                      'color': {
                        'effects': [
                          {
                            'name': 'tint',
                            'value': 50000.0
                          }
                        ],
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'right': {
                    'lnRef': {
                      'color': {
                        'effects': [
                          {
                            'name': 'tint',
                            'value': 50000.0
                          }
                        ],
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  },
                  'top': {
                    'lnRef': {
                      'color': {
                        'effects': [
                          {
                            'name': 'tint',
                            'value': 50000.0
                          }
                        ],
                        'scheme': 'accent6',
                        'type': 'schemeClr'
                      },
                      'idx': '1'
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'lt1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };


          var tableStyleDefinition = new TableStyleDefinitions[
              'Themed-Style-2']('accent6', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "No Style, No Grid" table style',
        function() {

          var expectedTableStyle = {
            'etp': 'tbStyl',
            'name': 'No Style, No Grid',
            'styleId': '{2D5ABB26-0587-4C30-8999-92F81FD0307C}',
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideH': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'insideV': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'left': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'right': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  },
                  'top': {
                    'ln': {
                      'fill': {
                        'type': 'noFill'
                      }
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'tx1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };


          var tableStyleDefinition = new TableStyleDefinitions[
              'No-Style-No-Grid']('', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });

    it('should return proper JSON for "No Style, Table Grid" table style',
        function() {

          var expectedTableStyle = {
            'etp': 'tbStyl',
            'name': 'No Style, Table Grid',
            'styleId': '{5940675A-B579-460E-94D1-54222C63F5DA}',
            'wholeTbl': {
              'tcStyle': {
                'fill': {
                  'type': 'noFill'
                },
                'tcBdr': {
                  'bottom': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'tx1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideH': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'tx1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'insideV': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'tx1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'left': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'tx1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'right': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'tx1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  },
                  'top': {
                    'ln': {
                      'cmpd': 'sng',
                      'fill': {
                        'color': {
                          'scheme': 'tx1',
                          'type': 'schemeClr'
                        },
                        'type': 'solidFill'
                      },
                      'w': 12700
                    }
                  }
                }
              },
              'tcTxStyle': {
                'color': {
                  'scheme': 'tx1',
                  'type': 'schemeClr'
                },
                'fontRef': {
                  'color': {
                    'clr': '#000000',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000.0
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'idx': 'minor'
                }
              }
            }
          };


          var tableStyleDefinition = new TableStyleDefinitions[
              'No-Style-Table-Grid']('', '');
          var tableStyle = tableStyleDefinition.getTableStyle();

          expect(tableStyle).toEqual(expectedTableStyle);
        });
  });
});
