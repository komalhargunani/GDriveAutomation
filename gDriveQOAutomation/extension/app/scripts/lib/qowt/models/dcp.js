/**
 * @fileoverview DCP model to store data during dcp processing
 */
define([], function() {

  'use strict';

  var _model = {
    /**
     * Version is a temporary property that indicates this response is version 2
     * of DCP. Version 2 DCP is only used for Pronto responses that require a
     * change to the DCP structure, this value is used to determine how to
     * process the DCP so that we can maintain backwards compatibility with DCP
     * version 1 until Pronto reaches render parity.
     * The openDocument command from Pronto will have a version property set to
     * 2, this response will update this value, which will then be used when
     * processing DCP.
     * Once Pronto reaches render parity and the viewer is phased out this
     * version and related code can be removed.
     */
    version: 1
  };
  return _model;
});
