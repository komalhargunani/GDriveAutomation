define([
  'qowtRoot/tools/text/mutations/cleaners/fontTagRemover'
], function(
    FontTagRemover) {

  'use strict';

  describe('fontTagRemover cleaner', function() {

    it('should remove font elements from parent node and add the text node ' +
      'in span instead', function() {

      var para = new QowtWordPara();
      var span = new QowtWordRun();
      var font = _createFont();
      span.appendChild(font);
      para.appendChild(span);
      document.body.appendChild(para);

      expect(para.querySelectorAll('font').length).toBe(4);
      expect(para.querySelectorAll('span').length).toBe(1);

      // Clean the main font tag.
      FontTagRemover.__clean(font);

      // Three spans would be present for every child font tag.
      var spans = para.querySelectorAll('span');
      expect(spans.length).toBe(3);

      // First child font tag should be reparented to original parent span.
      var fontsInSpan = span.querySelectorAll('font');
      expect(fontsInSpan.length).toBe(1);
      expect(fontsInSpan[0].childNodes[0].textContent).toBe('Apples');

      // Clean the first font child tag which was reparented to the parent span.
      FontTagRemover.__clean(fontsInSpan[0]);

      // Finally, root should now have three spans and no font tag.
      expect(para.innerText).toBe('Apples and Oranges');
      expect(para.querySelectorAll('font').length).toBe(0);
      expect(spans[0].textContent).toBe('Apples');
      expect(spans[1].textContent).toBe(' and ');
      expect(spans[2].textContent).toBe('Oranges');
    });

    function _createFont() {
      var font = document.createElement('font');

      var font1 = document.createElement('font');
      font1.appendChild(document.createTextNode('Apples'));
      font.appendChild(font1);

      var font2 = document.createElement('font');
      font2.appendChild(document.createTextNode(' and '));
      font.appendChild(font2);


      var font3 = document.createElement('font');
      font3.appendChild(document.createTextNode('Oranges'));
      font.appendChild(font3);

      return font;
    }
  });
});


