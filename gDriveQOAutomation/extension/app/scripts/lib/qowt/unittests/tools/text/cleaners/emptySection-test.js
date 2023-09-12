define([
  'qowtRoot/tools/text/mutations/cleaners/emptySection'
], function(
    EmptySection) {

  'use strict';

  describe('EmptySection cleaner', function() {
    var section;

    beforeEach(function() {
      section = document.createElement('qowt-section');
    });

    afterEach(function() {
      section = undefined;
    });

    it('should add a paragraph if the section has no child nodes', function() {
      document.body.appendChild(section);
      expect(section.childNodes.length).toBe(6);

      // Call the cleaner on empty section.
      var mockSummary = {
        getOldParentNode: function() {
          return section;
        },
        __additionalAdded: []
      };
      EmptySection.cleanerConfig.callback(mockSummary);

      var children = section.childNodes;
      expect(children.length).toBe(7);
      expect(children[6].nodeName.toLowerCase()).toBe('p');
    });
  });
});
