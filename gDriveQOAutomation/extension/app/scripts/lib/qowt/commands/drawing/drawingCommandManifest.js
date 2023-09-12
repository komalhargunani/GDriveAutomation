define([
  'qowtRoot/commands/common/deleteQowtElement',
  'qowtRoot/commands/common/formatQowtElement',
  'qowtRoot/commands/common/moveQowtElement',
  'qowtRoot/commands/drawing/addQowtDrawing',
  'qowtRoot/commands/drawing/addQowtImage',
  'qowtRoot/commands/drawing/addQowtTextBox',
  'qowtRoot/commands/drawing/deleteQowtBBD'], function(
    DeleteQowtElementCmd,
    FormatQowtElementCmd,
    MoveQowtElementCmd,
    AddQowtDrawingCmd,
    AddQowtImageCmd,
    AddQowtTextBoxCmd,
    DeleteQowtBBDCmd) {

  'use strict';

  return {
    addQowtDrawing: AddQowtDrawingCmd,
    addQowtImage: AddQowtImageCmd,
    addQowtTextBox: AddQowtTextBoxCmd,
    deleteQowtBBD: DeleteQowtBBDCmd,
    deleteQowtElement: DeleteQowtElementCmd,
    formatQowtElement: FormatQowtElementCmd,
    moveQowtElement: MoveQowtElementCmd
  };

});
