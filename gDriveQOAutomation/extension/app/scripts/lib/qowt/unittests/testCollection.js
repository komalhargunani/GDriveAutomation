define([
  'unitTestRoot/commands/_subsystem',
  'unitTestRoot/configs/_subsystem',
  'unitTestRoot/contentMgrs/_subsystem',
  'unitTestRoot/controls/_subsystem',
  'unitTestRoot/dcp/_subsystem',
  'unitTestRoot/drawing/_subsystem',
  'unitTestRoot/events/_subsystem',
  'unitTestRoot/messageBus/_subsystem',
  'unitTestRoot/presentation/_subsystem',
  'unitTestRoot/promise/_subsystem',
  'unitTestRoot/savestate/_subsystem',
  'unitTestRoot/selection/_subsystem',
  'unitTestRoot/tools/_subsystem',
  'unitTestRoot/utils/_subsystem',
  'unitTestRoot/widgets/_subsystem'], function(
  CommandsTests,
  ConfigsTests,
  ContentMgrsTests,
  ControlsTests,
  DcpTests,
  DrawingTests,
  Events,
  MessageBusTests,
  PresentationTests,
  PromiseTests,
  SaveStateTests,
  SelectionTests,
  ToolsTests,
  UtilsTests,
  WidgetsTests) {

  'use strict';

  return [
    CommandsTests,
    ConfigsTests,
    ContentMgrsTests,
    ControlsTests,
    DcpTests,
    DrawingTests,
    Events,
    MessageBusTests,
    PresentationTests,
    PromiseTests,
    SaveStateTests,
    SelectionTests,
    ToolsTests,
    UtilsTests,
    WidgetsTests];

});
