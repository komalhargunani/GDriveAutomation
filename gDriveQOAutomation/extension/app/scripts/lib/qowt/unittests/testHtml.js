/**
 * @fileoverview
 * HTML utility functions for unit test chrome page.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([], function() {

  'use strict';

  var api_ = {

    makeRunAllButton: function(runFunc) {
      var button = makeElement_(
        'button',
        'run-all', undefined,
        'Run all tests...'
      );
      button.onclick = runFunc;
      button.makeHalt = function(haltFunc) {
        this.textContent = 'Halt tests!';
        this.onclick = haltFunc;
      };
      button.makeReset = function() {
        this.textContent = 'Reset tests';
        this.onclick = function() {
          window.location.replace(
            window.location.toString().replace(/#+$/, ''));
        };
      };
      api_['run-all'] = button;
      return button;
    },

    makeDebugLabel: function() {
      return makeElement_(
        'p',
        'debug-label', undefined,
        'To debug a unit test: In JavaScript add the keyword \'debugger;\' ' +
        'make sure you have the inspector open, this will cause a break point.'
      );
    },

    makeTestAreaToggle: function() {
      var cbox = makeElement_(
            'input',
            'test-area-toggle', undefined
          );
      cbox.type = 'checkbox';
      cbox.onclick = function() {
        var testArea = document.getElementById('test-container');
        if (this.checked) {
          testArea.className = '';
        } else {
          testArea.className = 'hide';
        }
      };
      var toggle = makeElement_(
            'label',
            'toggle-label', undefined,
            [
              document.createTextNode('Show test area: '),
              cbox
            ]
          );
      return toggle;
    },

    storeSuiteLoadTime: function(suiteId, loadTime) {
      loadTimeStore_[suiteId] = loadTime;
    }

  };

  // PRIVATE ===================================================================

  var loadTimeStore_ = {};

  var pageElements_ = {
    'controller': {
      addListGroup: function addListGroup(id, title, content, runFunc) {
        var subElms = [
          makeElement_(
            'h3',
            'gtitle' + id, undefined,
            title
          )
        ];
        content.forEach(function(item) {
          var link = makeElement_(
            'a',
            'runSuite' + item.id, 'run',
            item.name
          );
          link.href = '#';
          link.setAttribute('data-test', item.test);
          link.onclick = runFunc;
          subElms.push(makeElement_(
            'li',
            'group' + id + 'suite' + item.id, undefined,
            link
          ));
        });
        this.appendChild(
          makeElement_(
            'ul',
            'group' + id, undefined,
            subElms
          )
        );
      }
    },

    'log': {
      reset: function reset() {
        clearElement_(this);
        this.appendChild(makeElement_(
          'div',
          'pass-fail-divide',
          'hide'
        ));
      },

      addSpecResult: function addSpecResult(
          suite, suiteId, suiteName, spec, specId, result, runFunc, msg) {
        var divide = document.getElementById('pass-fail-divide');
        if (result === 'passed') {
          var insertPass = false,
              passContainerId = 'suite' + suiteId + 'Passed',
              passElement = document.getElementById(passContainerId);
          if (!passElement) {
            insertPass = true;
            passElement = makeElement_(
              'div',
              passContainerId,
              'spec-results ' + result,
              [
                makeResultLink_(suite, suiteId, runFunc),
                makeResultSuiteName_(suiteId, suiteName)
              ]
            );
          }
          passElement.appendChild(makeSpecResult_(suiteId, specId, spec));
          if (insertPass) {
            if (divide.nextSibling) {
              divide.parentNode.insertBefore(passElement, divide.nextSibling);
            } else {
              this.appendChild(passElement);
            }
          }
        } else {
          var insertFail = false,
              failContainerId = 'suite' + suiteId + 'Failed',
              failElement = document.getElementById(failContainerId);
          if (!failElement) {
            insertFail = true;
            failElement = makeElement_(
              'div',
              failContainerId,
              'spec-results ' + result,
              [
                makeResultLink_(suite, suiteId, runFunc),
                makeResultSuiteName_(suiteId, suiteName)
              ]
            );
          }
          failElement.appendChild(makeSpecResult_(suiteId, specId, spec));
          failElement.appendChild(makeSpecMsgs_(suiteId, specId, msg));
          if (insertFail) {
            this.insertBefore(failElement, this.firstChild);
          }
        }
      }
    },

    'tester': {
      setSrc: function setSrc(newSrc) {
        this.contentWindow.location.replace(newSrc);
      }
    },

    'summary': {
      reset: function reset() {
        clearElement_(this);
      },

      pause: function pause(resumeFunc) {
        this.className = 'running';
        var resumeLink = makeElement_(
          'a',
          'resume', undefined,
          'Execution paused... ' +
          'place breakpoints and click this link to continue'
        );
        resumeLink.href = '#';
        resumeLink.onclick = resumeFunc;
        this.appendChild(resumeLink);
      },

      exception: function exception(suite, details) {
        this.className = 'failed';
        this.textContent = 'Uncaught exception while running: ' +
            suite + '\n\nDetails:\n' + details;
      },

      run: function run(suite, spec) {
        this.className = 'running';
        this.textContent = 'Running\n' + suite + '\n' + spec;
      },

      reportResults: function reportResults(
          result, total, passed, failed, unrun, duration) {
        this.className = result;
        this.textContent = total + ' total assertions count\n' +
            passed + ' passed\n' +
            failed + ' failed\n' +
            (unrun > 0 ? unrun + ' unrun\n' : '') +
            '\nTests took ' + duration + '\n' +
            '(Failed tests are listed at the top of the log)';
      }
    },

    'passrate': {
      reset: function reset() {
        clearElement_(this);
      },

      set: function set(value) {
        this.textContent = value;
      }
    }
  };

  function makeResultLink_(suite, suiteId, runFunc) {
    var link = makeElement_(
      'a',
      'suiteRun' + suiteId,
      'run',
      suite.replace('unitTestRoot/', 'unittests/')
    );
    link.href = '#';
    link.setAttribute('data-test', suite);
    link.onclick = runFunc;
    return link;
  }

  function makeResultSuiteName_(suiteId, suiteName) {
    return makeElement_(
      'h3',
      'suiteName' + suiteId,
      'suite',
      [
        document.createTextNode('(suite' + suiteId + ') ' + suiteName),
        makeElement_(
          'div',
          'suiteName' + suiteId + 'LoadTime',
          'load',
          'Loaded in ' + loadTimeStore_[suiteId]
        )
      ]
    );
  }

  function makeSpecResult_(suiteId, specId, spec) {
    return makeElement_(
      'h4',
      'suite' + suiteId + 'specName' + specId,
      'spec',
      '(spec' + specId + ') ' + spec
    );
  }

  function makeSpecMsgs_(suiteId, specId, msg) {
    return makeElement_(
      'div',
      'suite' + suiteId + 'spec' + specId + 'msgs',
      'msgs',
      msg
    );
  }

  function getElement_(elmId) {
    return document.getElementById(elmId) || undefined;
  }

  function addFunctions_(name, elm) {
    for (var func in pageElements_[name]) {
      elm[func] = pageElements_[name][func];
    }
    return elm;
  }

  function makeElement_(name, id, classes, content) {
    name = name || 'div';
    id = id || '';
    classes = classes || '';
    var elm = document.createElement(name);
    elm.id = id;
    elm.className = classes;
    if (content) {
      if (typeof content === 'string') {
        elm.textContent = content;
      } else if (content instanceof Array) {
        content.forEach(function(item) {
          elm.appendChild(item);
        });
      } else {
        elm.appendChild(content);
      }
    }
    return elm;
  }

  function clearElement_(elm) {
    elm.className = '';
    elm.textContent = '';
    if (elm.hasChildNodes()) {
      while (elm.childNodes.length >= 1) {
        elm.removeChild(elm.firstChild);
      }
    }
    return elm;
  }

  (function init() {
    for (var elm in pageElements_) {
      api_[elm] = addFunctions_(elm, getElement_(elm));
    }
  })();

  return api_;

});
