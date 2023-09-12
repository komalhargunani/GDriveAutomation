/**
 * @fileoverview Core command to format an existing element. This is a generic
 * command and should be used to modify/apply formatting of runs, paragraphs,
 * list elements, table row and cells etc.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

 define([
    'qowtRoot/commands/domMutations/base/mutationBaseCmd'], function(
    MutationBaseCmd) {

  'use strict';

  var _factory = {

    /**
     * Create a new format-element command to send to the Core.
     * Describes the formatting changes to be applied to the target node.
     * Core insists the properties we apply are appropriate to the target
     * element.
     *
     * @param {Object} context Contextual data for the command.
     * @param {String} context.coreEid The qowt element id.
     * @param {String} contest.nodeId The plain old html node id.
     * @param {String} context.key Describes the target as text run (rpr)
     *                             paragraph (ppr) table row (ropr)
     *                             table cell (cpr) image properties(ipr)
     *                             drawing properties (dpr).
     * @param {Object} context.oldFormatting The previous formatting we had.
     * @param {Object} context.newFormatting The current 'new' formatting.
     * @return {Object} A new Format Core Element command instance.
     *
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: formatElement missing argument: context');
      }
      if (context.eid === undefined) {
        throw new Error('Error: formatElement missing argument: eid');
      }
      // TODO(jliebrand):
      // once core supports .formatting, remove ppr/rpr/cpr nonsense
      if (!context.ppr && !context.rpr && !context.cpr &&
          !context.del_ppr && !context.del_rpr && !context.del_cpr &&
          !context.ipr && !context.del_ipr && !context.dpr &&
          !context.del_dpr) {
        throw new Error('Error: formatElement missing formatting info');
      }

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==false, callsService==true)
        var _api =
            MutationBaseCmd.create('formatElement', false, true, context);

        /**
         * DCP JSON for formatElement command
         * See pronto/src/dcp/schemas/requests/format-element.json
         *
         * @public
         * @return {Object} The JSON Payload to send to the dcp service.
         * {string} name: The op.code 'formatElement'.
         * {string} eid: The id of the target element.
         * {object} rpr: Run formatting properties to apply.
         * {object} ppr: Paragraph formatting properties to apply.
         * {object} cpr: Table cell formatting properties to apply.
         * {object} ipr: Image formatting properties to apply.
         * {object} dpr: Drawing formatting properties to apply.
         * {object} removeProperties: Formatting properties to remove.
         */
        _api.dcpData = function() {

          // TODO(jliebrand):
          // once core supports .formatting, remove ppr/rpr/cpr nonsense
          var dcp = _.pick(context, 'eid', 'etp',
              'ipr', 'del_ipr',
              'dpr', 'del_dpr',
              'ppr', 'del_ppr',
              'rpr', 'del_rpr',
              'cpr', 'del_cpr');

          dcp.name = _api.name;
          return dcp;
        };


        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
