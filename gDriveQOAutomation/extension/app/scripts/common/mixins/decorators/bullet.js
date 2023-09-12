define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'common/mixins/decorators/bulletDecoratorBase',
  'qowtRoot/variants/utils/resourceLocator',
  'qowtRoot/variants/configs/point',
  'third_party/lo-dash/lo-dash.min'
], function(
  MixinUtils,
  DecoratorBase,
  BulletDecoratorBase,
  ResourceLocator,
  PointConfig) {

  'use strict';

  var LIST_TYPE_TO_COUNTER = [
    '"("counter(item, upper-alpha)")"', // (A), (B), (C),
    '"("counter(item, decimal)")"', //Thai numerical parentheses - both
    'counter(item, decimal)"."', //Hindi numerical period
    'counter(item, upper-alpha)"."', //A., B., C., .
    'counter(item, decimal)"."', //Thai numerical period
    'counter(item, decimal)"."', //EA: Simplified Chinese w/ single-byte period
    'counter(item, decimal)":"', //Dbl-byte Arabic numbers w/ double-byte period
    'counter(item, upper-alpha)"."', //Thai alphabet period
    'counter(item, decimal)"."', //EA: Japanese/Korean (TypeC 1-)
    //EA: Traditional Chinese (TypeA 1-19, TypeC 20-)
    'counter(item, decimal)"."',
    '"("counter(item, upper-roman)")"', //(I), (II), (III), .
    'counter(item, decimal)"."', //EA
    //Dbl-byte circle numbers (1-10 circle[0x2460-], 11- arabic numbers)
    'counter(item, decimal)"."',
    '"("counter(item, lower-roman)")"', //(i), (ii), (iii), .
    //Wingdings white circle numbers (0-10 circle[0x0080-], 11- arabic numbers)
    'counter(item, decimal)"."',
    'counter(item, lower-alpha)")"', //a), b), c), .
    'counter(item, decimal)"."', //Dbl-byte Arabic numbers
    //EA: Simplified Chinese (TypeA 1-99, TypeC 100-)
    'counter(item, decimal)"."',
    'counter(item, decimal)")"', //Thai numerical parentheses - right
    'counter(item, decimal)":"', //EA: Japanese w/ double-byte period
    'counter(item, decimal)"-"', //Bidi Hebrew 2 with ANSI minus symbol
    'counter(item, decimal)"."', //1., 2., 3., .
    '"("counter(item, upper-alpha)")"', //Thai alphabet parentheses - both
    '"("counter(item, decimal)")"', //(1), (2), (3), .
    //Bidi Arabic 1 (AraAlpha) with ANSI minus symbol
    'counter(item, decimal)"-"',
    '"("counter(item, lower-alpha)")"', //(a), (b), (c), .
    'counter(item, lower-roman)"."', //i., ii., iii., .
    'counter(item, lower-alpha)"."', //Hindi alphabet period - vowels
    'counter(item, decimal)', //1, 2, 3, .
    'counter(item, upper-alpha)"."', //Hindi alphabet period - consonants
    'counter(item, upper-roman)"."', //I., II., III., .
    'counter(item, decimal)")"', //1), 2), 3), .
    'counter(item, decimal)"."', //EA: Japanese/Korean w/ single-byte period
    'counter(item, lower-roman)")"', //i), ii), iii), .
    'counter(item, lower-alpha)"."', //a., b., c., .
    'counter(item, upper-roman)")"', //I), II), III), .
    'counter(item, upper-alpha)")"', //A), B), C), .
    'counter(item, upper-alpha)")"', //Thai alphabet parentheses - right
    'counter(item, decimaal")"', //Hindi numerical parentheses - right
    //Bidi Arabic 2 (AraAbjad) with ANSI minus symbol
    'counter(item, deciaml)"-"',
    'counter(item, upper-alpha)")"' //Wingdings black circle numbers
  ];

  // TODO(elqursh): Merge this decorator with the level decorator.
  var api_ = MixinUtils.mergeMixin(DecoratorBase, BulletDecoratorBase, {

    supports_: ['bullet', 'type', 'autotype', 'startAt', 'char', 'buImg'],

    // TODO(elqursh): Flatten the bullet DCP structure into the paragraph
    // properties.
    observers: [
      'bulletChanged_(model.ppr.bullet)',
      'bulletChanged_(model.ppr.bullet.type)',
      'bulletChanged_(model.ppr.bullet.autoType)',
      'bulletChanged_(model.ppr.bullet.startAt)',
      'bulletChanged_(model.ppr.bullet.char)',
      'bulletChanged_(model.ppr.bullet.buImg)'
    ],

    set bullet(value) {
      // As bullet is an object, we need to clone deep to avoid having
      // multiple paragraphs pointing to the same bullet object.
      var clonedBullet = _.cloneDeep(value);

      this.setInModel_('ppr.bullet', clonedBullet);
    },

    get bullet() {
      return (this.model && this.model.ppr && this.model.ppr.bullet);
    },

    get type() {
      return (this.model && this.model.ppr && this.model.ppr.bullet &&
          this.model.ppr.bullet.type);
    },

    set type(value) {
      this.setInModel_('ppr.bullet.type', value);
    },

    get autotype() {
      return (this.model && this.model.ppr && this.model.ppr.bullet &&
          this.model.ppr.bullet.autotype);
    },

    set autotype(value) {
      this.setInModel_('ppr.bullet.autotype', value);
    },

    get startAt() {
      return (this.model && this.model.ppr && this.model.ppr.bullet &&
          this.model.ppr.bullet.startAt);
    },

    set startAt(value) {
      this.setInModel_('ppr.bullet.startAt', value);
    },

    get char() {
      return (this.model && this.model.ppr && this.model.ppr.bullet &&
          this.model.ppr.bullet.char);
    },

    set char(value) {
      this.setInModel_('ppr.bullet.char', value);
    },

    get buImg() {
      return (this.model && this.model.ppr && this.model.ppr.bullet &&
          this.model.ppr.bullet.buImg);
    },

    set buImg(value) {
      this.setInModel_('ppr.bullet.buImg', value);
    },

    attached: function() {
      this.checkFirstRun_();
    },

    checkFirstRun_: function() {
      // @elqursh: It is an overkill to re-update the list on every mutation.
      // In practice, we need to hide/show the bullet if there are any runs.
      // However, we additionally selectively increment the counter if the
      // paragraph is non-empty and have a bullet of type autoNum.
      // See applyListFormatting_ bellow.
      this.updateList_();
      this.onMutation(this, this.checkFirstRun_);
    },

    bulletChanged_: function(/* current */) {
      this.updateList_();
    },

    updateList_: function() {
      // Clear previous list formatting
      this.clearListFormatting_();

      // Apply formatting if any.
      this.applyListFormatting_();

      // Decide if we should hide/show the bullet.
      if(this.hasTextContent_()) {
        this.classList.remove('hideBullet');
      } else {
        this.classList.add('hideBullet');
      }
    },

    applyListFormatting_: function() {
      var type = this.type;
      if (type) {
        var beforeRule = this.getBulletStyle() || {};
        this.applyCommonFormatting_(beforeRule);

        // In case of character bullets, the only change is in the ::before
        // selector's pseudo element. This change is not observed by the
        // Dom mutation observer. Hence we add a dummy class if the paragraph
        // has some bullet applied so that the change is captured by the
        // translator.
        // 'list-type-buNone', 'list-type-buChar', 'list-type-buAuto',
        // 'list-type-buBlip' are dummy classes and do not have a definition
        switch (type) {
          case 'buAuto':
            this.applyNumberBullet_(beforeRule);
            this.classList.add('list-type-buAuto');
            break;
          case 'buChar':
            this.applyCharacterBullet_(beforeRule);
            this.classList.add('list-type-buChar');
            break;
          case 'buBlip':
            this.applyPictureBullet_(beforeRule);
            this.classList.add('list-type-buBlip');
            break;
          case 'buNone':
            this.applyNoBullet_(beforeRule);
            this.classList.add('list-type-buNone');
            break;
          default:
            throw new Error('Invalid bullet type set.');
        }

        this.setBulletStyle(beforeRule);
      }
    },

    applyNumberBullet_: function(beforeRule) {
      var level = this.level || 0;
      var autoType = this.autotype || PointConfig.kDEFAULT_BULLET_AUTO_TYPE;
      var counter = 'qowt-lc-' + level;
      var template = LIST_TYPE_TO_COUNTER[autoType];

      // TODO(elqursh): Handle startAt attributes. (crbug/440678)

      // Reset deeper levels numbering
      this.resetNumbering_(level + 1);
      // @elqursh: This is the caveat that requires us to
      // re-apply list formatting on every mutation.
      if (this.hasTextContent_()) {
        this.style.counterIncrement = counter + ' 1';
      }

      beforeRule.content = template.replace('item', counter) + ' !important';
    },

    applyCharacterBullet_: function(beforeRule) {
      var bulletChar = this.char;
      if (bulletChar) {
        beforeRule.content = '"' + bulletChar + '" !important';
      }
    },

    applyPictureBullet_: function(beforeRule) {
      var bulletImage = this.buImg;
      if (bulletImage) {
        var qualifiedPath = ResourceLocator.pathToUrl(bulletImage.src);
        var computedStylesBefore = window.getComputedStyle(this, 'before');
        var sizeInPx = computedStylesBefore.fontSize;

        beforeRule['background-image'] = "url('" + qualifiedPath +
            "') !important";
        beforeRule['background-repeat'] = 'no-repeat !important';

        if (sizeInPx) {
          beforeRule['background-size'] = sizeInPx + ' ' + sizeInPx +
              ' !important';
          beforeRule.width = sizeInPx + ' !important';
          beforeRule.height = sizeInPx + ' !important';
        }
      }
    },

    applyNoBullet_: function(beforeRule){
      beforeRule.display = 'none !important';
    },

    applyCommonFormatting_: function(beforeRule) {
      // Except for number bullets, numbering of this level and deeper levels
      // are reset by bullets OR no bullet
      this.resetNumbering_(this.level || 0);
      this.style.counterIncrement = 'none';

      beforeRule['background-image'] = 'none !important';
      beforeRule['background-repeat'] = 'no-repeat !important';
      beforeRule['background-size'] = '0px 0px !important';
      beforeRule.content = '"" !important';
      beforeRule.display = 'inline-block !important';
    },

    clearListFormatting_: function() {
      // Clearing list formatting means allowing inherited properties to
      // cascade rather than actually removing the bullet.

      // Updating the rule instead of deleting, as other bullet decorators may
      // have rendered some formatting options.
      var beforeRule = this.getBulletStyle() || {};
      if (beforeRule) {
        // Properties used to render bullets
        delete beforeRule['background-image'];
        delete beforeRule['background-repeat'];
        delete beforeRule['background-size'];
        delete beforeRule.content;
        delete beforeRule.display;
        delete beforeRule.width;
        delete beforeRule.height;

        // As we render the bullet as an inline-block it may inherit
        // paragraph specific formatting. To avoid this, we explicitly
        // override inheritable paragraph attributes.
        beforeRule['text-indent'] = '0pt !important';
        beforeRule['text-align'] = 'left !important';
      }
      this.setBulletStyle(beforeRule);

      this.style.removeProperty('counter-reset');
      this.style.removeProperty('counter-increment');
      this.classList.remove('list-type-buAuto');
      this.classList.remove('list-type-buChar');
      this.classList.remove('list-type-buBlip');
      this.classList.remove('list-type-buNone');
    },

    hasTextContent_: function() {
      return this.textContent.length !== 0;
    },

    resetNumbering_: function(level) {
      // Additionally we must reset the counters for deeper levels
      var counterReset = '';
      for (var i = level; i < 10; i++) {
        counterReset += 'qowt-lc-' + i + ' ';
      }
      this.style.counterReset = counterReset;
    },

    computedDecorations_: {
      type: function(/*computedStyles*/) {
        var computedType = 'buNone';

        // Get computed styles for before pseudo class for this paragraph.
        var computedStylesBefore = window.getComputedStyle(this, 'before');
        var content = computedStylesBefore.content;
        var bgImage = computedStylesBefore.backgroundImage;

        if (content && content.match(/counter/)) {
          computedType = 'buAuto';
        } else if (bgImage && bgImage.match(/url/)) {
          computedType = 'buBlip';
        } else if (content && content.match(/^'.'$|^"."$|^.$/)) {
          computedType = 'buChar';
        }
        return computedType;
      },
      char: function(/*computedStyles*/) {
        var computedChar;

        // Get computed styles for before pseudo class for this paragraph.
        var computedStylesBefore = window.getComputedStyle(this, 'before');
        var content = computedStylesBefore.content;
        if (content && content.match(/^'.'$|^"."$|^.$/)) {
          computedChar = content.replace(/'|"/g, '');
        }
        return computedChar;
      }
    }
  });


  return api_;

});
