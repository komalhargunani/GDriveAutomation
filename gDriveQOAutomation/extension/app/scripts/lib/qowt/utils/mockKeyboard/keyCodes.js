// Maps key codes to key names data is compiled based on the platform & locale
define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/platform',
  // Key code map modules no declared variables as they are loaded dynamically
  // all unnamed parameters will be taken as key code map modules
  'qowtRoot/utils/mockKeyboard/keyCodeMapOsxEn',
  'qowtRoot/utils/mockKeyboard/keyCodeMapLinuxEn',
  'qowtRoot/utils/mockKeyboard/keyCodeMapWindowsEn'], function keyCodeModule(
  Features,
  Platform) {
  'use strict';

  // Reference to platform locale override modules that have been required.
  // Take the unnamed parameters as key code map modules
  var overrideModules_ = Array.prototype.slice.call(arguments,
      keyCodeModule.length);

  var api_ = {

    /**
     * Lookup the key codes for a key
     * @param {String} key The key to look up
     * @return {Object}
     * {
     *   name:          {String},  The name used to reference this key
     *   textInput:     {String},  True or character for textInput
     *   charCode:      {Integer}, The charCode of the character
     *   keyCode:       {Integer}, The platform & locale specific key code
     *   keyIdentifier: {String},  The platform & locale specific key ID
     *   which:         {Integer}  Usually matches the char or key code
     * }
     */
    lookup: function(keyName) {
      // Set the platform & locale on first use
      if (platform_ === undefined || locale_ === undefined) {
        setPlatformLocale_();
      }
      keyName = keyName_(keyName);
      var shiftedKey = getShiftedKey_(keyName);
      return keyName ? {
        name: keyName,
        textInput: data_.textInput[keyName],
        charCode: data_.charCodes[keyName],
        keyCode: data_.keyCodes[keyName],
        keyIdentifier: data_.keyIds[keyName],
        keyValues: data_.keyValues[keyName] ? data_.keyValues[keyName] :
            keyName,
        which: data_.which[keyName],
        shifted: {
          name: shiftedKey,
          textInput: data_.textInput[shiftedKey],
          charCode: data_.charCodes[shiftedKey],
          keyCode: data_.keyCodes[shiftedKey],
          keyIdentifier: data_.keyIds[shiftedKey],
          keyValues: data_.keyValues[shiftedKey] ? data_.keyValues[shiftedKey] :
              shiftedKey,
          which: data_.which[shiftedKey],
        }
      } : undefined;
    }

  };

  Object.defineProperties(api_, {
    modifierNames: { get: function() {
      return ['shift', 'control', 'alt', 'meta', 'windows'];
    }},
    platform: { get: function() { return platform_; }},
    locale:   { get: function() { return locale_; }}
  });

  /** @private */

  var platform_,
      locale_;

  function setPlatformLocale_() {
    var locales = [Platform.locale, 'EN'];
    for (var i = 0; i < locales.length; i++) {
      if (overrideCodes_(Platform.name, locales[i])) {
        if (Features.isEnabled('debugMockKeyboard')) {
          console.log('%c Mock Keyboard :: Platform: %s Locale: %s ',
                      'color:White;background:Orange',
                      Platform.name, locales[i]);
        }
        platform_ = Platform.name;
        locale_ = locales[i];
        break;
      }
    }
  }

  // Check each of the required platform locale modules to see if it should be
  // used to override the key data
  function overrideCodes_(platform, locale) {
    var m, mod;
    for (m = 0; m < overrideModules_.length; m++) {
      mod = overrideModules_[m];
      if (mod &&
          mod.platform &&
          mod.locale &&
         (mod.platform === platform) &&
         (mod.locale === locale)) {
        override_(mod.charCodes, data_.charCodes);
        override_(mod.keyCodes, data_.keyCodes);
        override_(mod.keyIds, data_.keyIds);
        override_(mod.textInput, data_.textInput);
        override_(mod.which, data_.which);
        override_(mod.shiftMap, data_.shiftMap);
        return true;
      }
    }
    return false;
  }

  // Use anything that exists in the new source to add or replace anything that
  // has the same name in the original
  function override_(newSource, origin) {
    var newKeys = Object.keys(newSource),
        k, thisKey;
    for (k = 0; k < newKeys.length; k++) {
      thisKey = newKeys[k];
      origin[thisKey] = newSource[thisKey];
    }
  }

  /**
   * Attempt to match a string to a key name
   * @param {String} keyStr The string to match
   * @return {String|undefined} The matched key name
   */
  function keyName_(keyStr) {
    return (data_.alias[keyStr.toLowerCase()]) ||
          ((data_.names.indexOf(keyStr) === -1) ? undefined : keyStr);
  }

  /**
   * Convert key name as if shift key was held
   * E.g. 'a' -> 'A', '0' -> ')'
   * @param {String} keyStr The key name
   * @return {String} The shifted key name
   */
  function getShiftedKey_(keyName) {
    var shiftedKey = keyName;
    if (/^[a-z]$/.test(keyName)) {
      shiftedKey = keyName.toUpperCase();
    } else {
      shiftedKey = shiftNonAlpha_(keyName);
    }
    return shiftedKey;
  }

  function shiftNonAlpha_(keyName) {
    return data_.shiftMap[keyName] ? data_.shiftMap[keyName] : keyName;
  }

  var data_ = {

    shiftMap: {},

    names: [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '+', '-', '=', '*', '%', '^', '$', '£', '€', '!', '?', '@', '&',
      '|', '.', ',', ';', ':', '`', '~', '-', '_',
      '(', ')', '[', ']', '{', '}', '<', '>', '#',
      '/', '\\', "'", '"',
      'enter', 'space', 'tab',
      'backspace', 'delete',
      'shift', 'control', 'alt', 'meta', 'windows',
      'up', 'down', 'left', 'right', 'page up', 'page down',
      'escape'
    ],

    // Alias and short names
    alias: {
      '↵': 'enter', '\n': 'enter', 'return': 'enter',
      ' ': 'space',
      '⇥': 'tab', '\t': 'tab',
      '⟵': 'backspace',
      '⇧': 'shift',
      'ctrl': 'control',
      '⌥': 'alt',
      '⌘': 'meta', 'cmd': 'meta',
      'win': 'windows',
      '↑': 'up', '↓': 'down', '←': 'left', '→': 'right',
      '⇞': 'page up', 'pgup': 'page up', '⇟': 'page down', 'pgdn': 'page down',
      'esc': 'escape'
    },

    // Character codes
    charCodes: {
      'backspace': 0,   'tab':     9,
      'enter':     13,
      'shift':     0,   'control': 0,  'alt':       0,  'meta': 0,
      'escape':    0,
      'space':     32,  'page up': 0,  'page down': 0,
      'left':      0,   'up':      0,  'right':     0,  'down': 0,
      'delete':    0,
      'windows':   0
    },

    // Browser specific key codes
    keyCodes: {
      'backspace': 8,   'tab':     9,
      'enter':     13,
      'shift':     16,  'control': 17,  'alt':       18,
      'escape':    27,
      'space':     32,  'page up': 33,  'page down': 34,
      'left':      37,  'up':      38,  'right':     39,  'down': 40,
      'delete':    46,
      '0': 48,  ')': 48,
      '1': 49,  '!': 49,
      '2': 50,  '@': 50,  '€': 50,
      '3': 51,  '#': 51,  '£': 51,
      '4': 52,  '$': 52,
      '5': 53,  '%': 53,
      '6': 54,  '^': 54,
      '7': 55,  '&': 55,
      '8': 56,  '*': 56,
      '9': 57,  '(': 57,
      'a': 65,  'A': 65,
      'b': 66,  'B': 66,
      'c': 67,  'C': 67,
      'd': 68,  'D': 68,
      'e': 69,  'E': 69,
      'f': 70,  'F': 70,
      'g': 71,  'G': 71,
      'h': 72,  'H': 72,
      'i': 73,  'I': 73,
      'j': 74,  'J': 74,
      'k': 75,  'K': 75,
      'l': 76,  'L': 76,
      'm': 77,  'M': 77,
      'n': 78,  'N': 78,
      'o': 79,  'O': 79,
      'p': 80,  'P': 80,
      'q': 81,  'Q': 81,
      'r': 82,  'R': 82,
      's': 83,  'S': 83,
      't': 84,  'T': 84,
      'u': 85,  'U': 85,
      'v': 86,  'V': 86,
      'w': 87,  'W': 87,
      'x': 88,  'X': 88,
      'y': 89,  'Y': 89,
      'z': 90,  'Z': 90,
      ';': 186, ':': 186,
      '=': 187, '+': 187,
      ',': 188, '<': 188,
      '-': 189, '_': 189,
      '.': 190, '>': 190,
      '/': 191, '?': 191,
      '`': 192, '~': 192,
      '[': 219, '{': 219,
     '\\': 220, '|': 220,
      ']': 221, '}': 221,
      "'": 222, '"': 222
    },

    // Key identifiers
    keyIds: {
      'backspace': 'U+0008', 'tab': 'U+0009',
      'enter': 'Enter',
      'shift': 'Shift', 'control': 'Control', 'alt': 'Alt',
      'escape': 'U+001B',
      'space': 'U+0020', 'page up': 'PageUp', 'page down': 'PageDown',
      'left': 'Left', 'up': 'Up', 'right': 'Right', 'down': 'Down',
      'delete': 'U+007F'
    },

    // The text input value to use or true to use the key name
    textInput: {
      'tab': '\t',
      'enter': '\n',
      'space': ' ',
      'backspace': false,
      'shift': false, 'control': false, 'alt': false,
      'escape': false,
      'page up': false, 'page down': false,
      'left': false, 'up': false, 'right': false, 'down': false,
      'delete': false
    },

    // Key event which values
    which: {},

    // These values are derived from following link
    /* eslint-disable max-len */
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
    /* eslint-enable max-len */
    // Rightnow, the list is incomplete. Make entries as needed.
    keyValues: {
      'backspace': 'Backspace', 'tab': 'Tab',
      'enter': 'Enter',
      'shift': 'Shift', 'control': 'Control', 'alt': 'Alt',
      'escape': 'Escape',
      'space': ' ', 'page up': 'PageUp', 'page down': 'PageDown',
      'left': 'Left', 'up': 'Up', 'right': 'Right', 'down': 'Down',
      'delete': 'Delete'
    }
  };

  // Iterator variable
  var c;
  // List of characters for programatically adding data
  var chars_ = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '=', '*', '%', '^', '$', '£', '€', '!', '?', '@', '&',
    '|', '.', ',', ';', ':', '`', '~', '-', '_',
    '(', ')', '[', ']', '{', '}', '<', '>',
    '/', '\\', "'", '"'
  ];

  // Character codes
  for (c = 0; c < chars_.length; c++) {
    data_.charCodes[chars_[c]] = chars_[c].charCodeAt(0);
  }

  // Key identifiers
  for (c = 0; c < chars_.length; c++) {
    data_.keyIds[chars_[c]] = makeUnicodeId_(data_.charCodes[chars_[c]]);
  }
  function makeUnicodeId_(keyCode) {
    return 'U+' + ('0000' + keyCode.toString(16)).toUpperCase().substr(-4);
  }

  // The text input value to use, true to use the key name
  for (c = 0; c < chars_.length; c++) {
    data_.textInput[chars_[c]] = true;
  }

  // The which attribute matches the keyCode when defined
  data_.which = data_.keyCodes;

  return api_;
});
