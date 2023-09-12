/**
 * This is a fake ppt dcp stream. its structure is not derived from QO domain
 * specific schema defined to date.
 *
 * Purpose of this fake stream is to render the ppt.
 *
 * streams are created using xml2json.js library to minimize the conversion
 * efforts.
 *
 */

'use strict';

loadJson();
var PPT_DCP_STREAM_FIXTURE = {
    presentation : [ {
        knd : 'U',
        elm : [ eval('(' + getPresentation() + ')') ]
    }, {
        knd : 'U',
        elm : [ eval('(' + getThemes() + ')') ]
    }, {
        knd : 'U',
        elm : [ eval('(' + getSlideMasters() + ')') ]
    }, {
        knd : 'U',
        elm : [ eval('(' + getLayouts() + ')') ]
    }
    ]
};

PPT_DCP_STREAM_FIXTURE.addSlides = function() {
    var slides = getSlides();
    for (var counter = 0; counter < slides.length; counter++) {
        var obj = {
            knd : 'U',
            elm : [ eval('(' + slides[counter] + ')') ]
        };
        PPT_DCP_STREAM_FIXTURE.presentation[PPT_DCP_STREAM_FIXTURE.presentation.length] = obj;
    }
}();
