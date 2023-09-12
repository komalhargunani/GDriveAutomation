/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview shows a definitive progress spinner. It shows 8 pie
 * slices which 'fill up' as the progress is set from 0 to 100%
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define(['qowtRoot/features/utils'], function(Features) {

  // number of slices the progress spinner has; each represented by
  // a css class "pX" where x is 0 through _kSlices-1
  var _kSlices = 8;

  var _api = {
    /**
     * show the spinner.
     *
     * @param {float} optProgress optional argument to preset the progress
     *                            ranging from 0 to 1. Defaults to 0
     */
    show: function(optProgress) {
      _show();
      if (optProgress) {
        _setProgress(optProgress);
      }
    },

    /**
     * hide the spinner. Also resets the progress to 0
     */
    hide: function() {
      _hide();
    },

    /**
     * set the progress; ranging from 0 to 1
     *
     * @param {float} progress float progress ranging from 0 to 1.
     *                         If set to higher than 1 it will assume 1;
     *                         If set to lower than 0 assumes 0
     */
    setProgress: function(progress) {
      _setProgress(progress);
    },

    /**
     * add a contributor for progress. You can have a number of contributors
     * each which contribute to xx% of the overal progress. This function
     * will return a progressUpdate function for the contributor, allowing
     * it to set it's progress from 0 to 1.
     * Eg:
     *   var updateFunction = ProgressSpinner.addContributor(0.5);
     *
     *   // this will fill the spinner a quarter of the way
     *   updateFunction(0.5);
     *
     *   // this will fill the spinner half full
     *   updateFunction(1);
     *
     * @param {float} weight the contributing weight factor. This can be
     *                       '*' for ONE contributor, which will then take
     *                       whatever weighing is left from other contributors
     */
    addContributor: function(weight) {
      _contribCounter++;
      var contribId = 'contrib' + _contribCounter;
      _contributors[contribId] = {
        weight: weight,
        progress: 0
      };
      return _contributorProgress.bind(this, contribId);
    },

    // used for testing:
    resetContributors: function() {
      _contributors = {};
      _contribCounter = 0;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
  var _spinner,
      _spinnerContainer,
      _spinnerStyle,
      _svgdoc,
      _visible = false,
      _contribCounter = 0,
      _contributors = {};


  function _show() {
    if (!_initialized) {
      _init();
    }
    if (!_visible) {
      _visible = true;
      _spinnerContainer.style.display = 'block';
      _unhide();
    }
  }

  function _hide() {
    if (_visible) {
      _visible = false;
      _spinnerContainer.style.opacity = '0';
    }
  }

  function _unhide() {
    _spinnerContainer.style.opacity = '1';
  }

  function _removeSpinner() {
    _spinnerContainer.style.display = 'none';
  }


  function _contributorProgress(contribId, progress) {
    // make sure progress is always kept within 0..1
    progress = (progress > 1) ? 1 :
        (progress < 0 || progress === undefined) ? 0 : progress;

    // record this contributors progress
    _contributors[contribId].progress = progress;

    // now calculate total progress from all contributors
    var totalProgress = 0,
        cumulativeWeight = 0,
        wildCardProgress = 0;

    for (var contrib in _contributors) {
      if (_contributors.hasOwnProperty(contrib) &&
          _contributors[contrib].weight !== undefined &&
          _contributors[contrib].progress !== undefined) {

        var contributor = _contributors[contrib];
        if (contributor.weight === '*') {
          // this contributor is the wildcard; it's weight should be
          // however much is left over after the other contributors have
          // been calculated; cache it's progress for now
          wildCardProgress = contributor.progress;
        } else {
          cumulativeWeight += contributor.weight;
          totalProgress += (contributor.progress * contributor.weight);
        }
      }
    }

    // if we had a wildcard, add it to the total
    if (wildCardProgress > 0) {
      var wildCardWeight = (1 - cumulativeWeight);
      totalProgress += (wildCardProgress * wildCardWeight);
    }

    _setProgress(totalProgress);
  }

  function _setProgress(progress) {
    progress = (progress > 1) ? 1 :
        (progress < 0 || progress === undefined) ? 0 : progress;

    var slice = parseInt(progress * _kSlices, 10);

    if (_svgdoc) {
      var progressElement = _svgdoc.getElementById("circular-progress");
      var spinnerColor = (_spinnerStyle === 'editor') ? 'dark' : 'light';
      progressElement.setAttribute('class', spinnerColor + " p" + slice);
    }

    if (progress === 1) {
      // give a 100ms delay to hiding the spinner so that the final
      // full slice is shown
      setTimeout(_hide, 100);
    }
  }

  var _initialized = false;
  function _init() {
    _spinnerStyle = (Features.isEnabled('edit')) ? 'editor' : 'viewer';

    _spinnerContainer = document.createElement('div');
    _spinnerContainer.style.display = 'none';
    _spinnerContainer.classList.add(_spinnerStyle);
    _spinnerContainer.classList.add('progress-spinner-container');
    _spinnerContainer.classList.add('fader');
    _spinnerContainer.addEventListener('webkitTransitionEnd', function() {
        if (!_visible) {
          _setProgress(0);
          _removeSpinner();
        }
    }, false);

    _spinner = document.createElement('embed');
    _spinner.classList.add(_spinnerStyle);
    _spinner.classList.add('progress-spinner');
    _spinner.src = '../img/progressSpinner.svg';
    _spinner.onload = function() {
      _svgdoc = _spinner.getSVGDocument();
    };
    _spinnerContainer.appendChild(_spinner);

    var label = document.createElement('div');
    label.classList.add(_spinnerStyle);
    label.classList.add('progress-spinner-label');
    label.textContent = chrome.i18n.getMessage('file_loading_spinner_label');
    _spinnerContainer.appendChild(label);

    document.body.appendChild(_spinnerContainer);
    _initialized = true;
  }

  return _api;

});

