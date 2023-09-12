define([
  'qowtRoot/commands/quicksheet/setCellBorder',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet'
], function(
    SetCellBorder,
    SheetModel,
    SheetConfig) {

  'use strict';

  describe('Sheet: SetCellBorder command', function() {
    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    describe('Invalid creation', function() {
      it('constructor should throw error if fromColumnIndex is not given ' +
        'as an argument', function() {
        assert.throws(function() {
          var fromColIndex;
          var toColIndex = 2;
          var fromRowIndex = 2;
          var toRowIndex = 2;
          var borderInfo = {
            left: {
              borderStyle: 'solid',
              borderColor: '#000000'
            }
          };
          SetCellBorder.create(fromColIndex, fromRowIndex, toColIndex,
            toRowIndex, borderInfo);
        }, 'ERROR: setCellBorder: either the rows or columns need to ' +
          'be defined');
      });

      it('constructor should throw error if toColumnIndex is not given ' +
        'as an argument', function() {
        assert.throws(function() {
          var fromColIndex = 2;
          var toColIndex;
          var fromRowIndex = 2;
          var toRowIndex = 2;
          var borderInfo = {
            left: {
              borderStyle: 'solid',
              borderColor: '#000000'
            }
          };
          SetCellBorder.create(fromColIndex, fromRowIndex, toColIndex,
            toRowIndex, borderInfo);
        }, 'ERROR: setCellBorder: either the rows or columns need to ' +
          'be defined');
      });

      it('constructor should throw error if fromRowIndex is not given as an ' +
        'argument', function() {
        assert.throws(function() {
          var fromColIndex = 3;
          var toColIndex = 5;
          var fromRowIndex;
          var toRowIndex = 2;
          var borderInfo = {
            left: {
              borderStyle: 'solid',
              borderColor: '#000000'
            }
          };
          SetCellBorder.create(fromColIndex, fromRowIndex, toColIndex,
            toRowIndex, borderInfo);
        }, 'ERROR: setCellBorder: either the rows or columns need to be ' +
          'defined');
      });

      it('constructor should throw error if toRowIndex is not given as an ' +
        'argument', function() {
        assert.throws(function() {
          var fromColIndex = 3;
          var toColIndex = 6;
          var fromRowIndex = 2;
          var toRowIndex;
          var borderInfo = {
            left: {
              borderStyle: 'solid',
              borderColor: '#000000'
            }
          };
          SetCellBorder.create(fromColIndex, fromRowIndex, toColIndex,
            toRowIndex, borderInfo);
        }, 'ERROR: setCellBorder: either the rows or columns need to be ' +
          'defined');
      });

      it('constructor should throw error if borderInfo is not given as an ' +
        'argument', function() {
        assert.throws(function() {
          var fromColIndex = 2;
          var toColIndex = 4;
          var fromRowIndex = 3;
          var toRowIndex = 3;
          var borderInfo;
          SetCellBorder.create(fromColIndex, fromRowIndex, toColIndex,
            toRowIndex, borderInfo);
        }, 'ERROR: setCellBorder: requires the border info');
      });

      it('constructor should throw error if no border side is given in the ' +
        'border info', function() {
        assert.throws(function() {
          var fromColIndex = 2;
          var toColIndex = 4;
          var fromRowIndex = 3;
          var toRowIndex = 3;
          var borderInfo = {};
          SetCellBorder.create(fromColIndex, fromRowIndex, toColIndex,
            toRowIndex, borderInfo);
        }, 'ERROR: atleast one border side should be defined');
      });

      it('constructor should throw error if invalid border has been defined',
        function() {
        assert.throws(function() {
          var fromColIndex = 2;
          var toColIndex = 4;
          var fromRowIndex = 3;
          var toRowIndex = 3;
          var borderInfo = {
            test: true
          };
          SetCellBorder.create(fromColIndex, fromRowIndex, toColIndex,
            toRowIndex, borderInfo);
        }, 'ERROR: Invalid border has been defined');
      });


      describe('valid construction', function() {

        var _checkCommand = function(cmd, borderInfo) {
          assert.isDefined(cmd, 'SetCellBorder command has been defined');
          assert.equal(cmd.name, 'setCellBorder', 'Command name');
          assert.isDefined(cmd.id(), 'SetCellBorder command id has been ' +
            'defined');
          assert.isTrue(cmd.callsService(), 'SetCellBorder.callsService()');
          assert.isDefined(cmd.onFailure, 'SetCellBorder.onFailure()');
          assert.isDefined(cmd.onSuccess, 'SetCellBorder.onSuccess()');
          assert.equal(cmd.dcpData().name, 'scf');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, borderInfo.fromRowIndex);
          assert.strictEqual(cmd.dcpData().c1, borderInfo.fromColIndex);
          assert.strictEqual(cmd.dcpData().r2, borderInfo.toRowIndex);
          assert.strictEqual(cmd.dcpData().c2, borderInfo.toColIndex);
          assert.deepEqual(cmd.dcpData().fm, borderInfo.fm);
          assert.strictEqual(cmd.dcpData().bs,
            SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for border style "left" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                left: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "right" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                right: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "top" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                top: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "bottom" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                bottom: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "outer" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                left: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                },
                right: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                },
                top: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                },
                bottom: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "inner" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                insideVertical: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                },
                insideHorizontal: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "horizontal"' +
          ' if valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 4,
            fm: {
              borders: {
                insideHorizontal: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "vertical"' +
          ' if valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 3,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                insideVertical: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "all" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                all: {
                  borderStyle: 'solid',
                  borderColor: '#000000'
                }
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });


        it('constructor should create a command for border style "clear" if ' +
          'valid parameters are specified', function() {
          var borderInfo = {
            fromColIndex: 2,
            toColIndex: 2,
            fromRowIndex: 3,
            toRowIndex: 3,
            fm: {
              borders: {
                removeBorder: true
              }
            }
          };
          var cmd = SetCellBorder.create(borderInfo.fromColIndex,
            borderInfo.fromRowIndex, borderInfo.toColIndex,
            borderInfo.toRowIndex, borderInfo.fm.borders);
          _checkCommand(cmd, borderInfo);
        });
      });
    });
  });
});
