require(['third_party/domready/domReady!'], function () {
  require(['qowtRoot/utils/i18n'], function(I18n) {
    var newDocumentHeader = I18n.
      getMessage("extension_popup_new_document_header");
    document.getElementById("newHeading").textContent = newDocumentHeader;
    var newSheetDocument = I18n.
      getMessage("extension_popup_new_spreadsheet_document");
    var sheetOption = createOption(newSheetDocument, 'sheet');
    var newPointDocument = I18n.
      getMessage("extension_popup_new_presentation_document");
    var pointOption = createOption(newPointDocument, 'point');
    var newWordDocument = I18n.getMessage("extension_popup_new_word_document");
    var wordOption = createOption(newWordDocument, 'word');

    var newCreates = document.getElementById('options');
    newCreates.appendChild(sheetOption);
    newCreates.appendChild(pointOption);
    newCreates.appendChild(wordOption);
    var messageBody = document.getElementById('messageBody');
    messageBody.innerHTML = I18n.getMessage("extension_popup_message_body");
  });
});

function createOption(option, id) {
  var outer = document.createElement('div');
  outer.id = id;
  outer.textContent = option;
  var anchor = document.createElement('a');
  anchor.textContent = option;
  anchor.href = "#";
  outer.addEventListener('click', onClick, true);
  return outer;
}

function onClick(e) {
  var mimeType;
  if (e.target.id === 'word') {
    mimeType = "application/vnd.openxmlformats-officedocument." +
               "wordprocessingml.document";
  } else if (e.target.id === 'point') {
    mimeType = "application/vnd.openxmlformats-officedocument." +
               "presentationml.presentation";
  } else if (e.target.id === 'sheet') {
    mimeType = "application/vnd.openxmlformats-officedocument." +
               "spreadsheetml.sheet";
  }
  chrome.runtime.sendMessage({newCreate: e.target.id, mimeType: mimeType},
    function () {
      window.close();
    });
}
