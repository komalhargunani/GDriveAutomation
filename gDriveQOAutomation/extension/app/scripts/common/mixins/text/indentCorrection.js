define([
  'qowtRoot/utils/converters/converter'
], function(
    Converter) {

  "use strict";

  /**
   * This is the width needed to display a simple first level bullet.
   * This is same as the hanging indent value we get from core for first level
   * bullet.
   */
  var _kBulletWidth = 18;

  return {

    /**
     * This corrects the left, hanging and first line indentations for
     * paragraphs with bullets.
     *
     * The indentation affecting the paragraph are as below:
     * - Left Indentation: This represents the indentation placed between the
     * left text margin for the paragraph and the left edge of that paragraph's
     * content. The margin-left for paragraph is used to handle this position.
     *
     * - Hanging Indentation: For bulleted paragraph, this represents the place
     * between the bullet and text of the paragraph. The margin-left of the
     * 'before' pseudo-element is used to handle this position.
     *
     * - First line Indentation: This represents the additional indentation
     * which shall be applied to the first line of the paragraph. This
     * additional indentation is specified relative to the paragraph indentation
     * which is specified for all other lines in the paragraph. The text-indent
     * property for para is used to handle first line indentation.
     *
     *    The hanging indentation for para is set by applying this value as
     * margin-left to the 'before' pseudo-element of para instead as the
     * margin-left of para. This would create hanging space between bullet and
     * para as expected. If hanging would have applied to para as its
     * margin-left, it would have moved the bullet as well.
     *    The paragraph's left position should include the bullet. Here we set
     * the text-indent for the para so as to include the bullet. This is done by
     * including bullet's margin-left in text-indent. If bullet's margin-left
     * is not included, it will incorrectly move the bullet towards left than
     * the expected left position of para.
     *    In case of multilevel bullets, the distance between the
     * bullet and text will be set as much needed for displaying the bullet
     * text. And the para will move towards the left with para's margin-left
     * with increase in level causing the bullets to be displayed as expected.
     *
     */
    correctBulletIndentation: function() {
      if (_.get(this, 'model.ppr.lfeID')) {
        if (this.model.ppr.hin) {
          // Apply the hanging to bullets.
          this.paragraphMarginLeft = '-' + this.model.ppr.hin + 'pt !important';
          this.updateStyles();
          this.style.textIndent = '';
        } else {
          var beforeMarginLeft = window.getComputedStyle(this, 'before');
          beforeMarginLeft = beforeMarginLeft.marginLeft.replace('px', '').
            replace('-', '');
          beforeMarginLeft = Converter.px2pt(Number(beforeMarginLeft));
          // This will handle the paragraphs with bullets having first line
          // indentation. The indentation for para will include bullet as well.
          if (this.model.ppr.fli !== undefined) {
            var textIndent = this.style.textIndent.replace('pt', '');
            // This check is needed so that indentation is applied only when the
            // para is created and not when there are any other change in para
            // like adding text to empty para.
            if (Number(textIndent) === this.model.ppr.fli) {
              this.style.textIndent =
                Number(textIndent) + Number(beforeMarginLeft) + 'pt';
            }
          } else {
            // Left indent value for para is used as margin left. This value is
            // applied as the margin left of paragraph. Else the margin-left
            // will be applied to the para's 'before' pseudo-element causing the
            // bullets to move to left and get hidden.
            var marginLeft = window.getComputedStyle(this).marginLeft.
              replace('px', '').replace('-', '');
            marginLeft = Converter.px2pt(Number(marginLeft));
            if (marginLeft < beforeMarginLeft) {
              this.style.marginLeft = Number(beforeMarginLeft) + 'pt';
              this.paragraphMarginLeft =
                '-' + (_kBulletWidth + (this.model.ppr.lvl * _kBulletWidth)) +
                  'pt !important';
              this.updateStyles();
            }
          }
        }
      }
    }
  };
});