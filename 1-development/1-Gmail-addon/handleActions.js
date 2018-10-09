// https://developers.google.com/apps-script/reference/card-service/open-link
// https://developers.google.com/apps-script/reference/card-service/action-response

function onClick_OpenThread(e) {
  try {
    process_current_email(e)

    var actionResponse

    actionResponse = CardService.newActionResponseBuilder()
      .setOpenLink(
        CardService.newOpenLink()
          .setUrl(webapp_URL + current_email.thread_id)
          .setOpenAs(CardService.OpenAs.FULL_SIZE)
          .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
      )
      .build()

    return actionResponse
  }
  catch(e) {
    log_server_error(e)
  }
}

// --- UniversalActionResponse ---

function onClick_Menu_DescribeUsage(e) {
  try {
    var card = buildDescribeUsageCard()

    return get_UniversalActionResponse(card)
  }
  catch(e) {
    log_server_error(e)
  }
}

function onClick_Menu_AboutAuthor(e) {
  try {
    var card = buildAboutAuthorCard()

    return get_UniversalActionResponse(card)
  }
  catch(e) {
    log_server_error(e)
  }
}

// --- helpers ---

// https://developers.google.com/apps-script/reference/card-service/navigation
// https://developers.google.com/gmail/add-ons/how-tos/navigation

function get_refresh_ActionResponse() {
  var card = buildCard()
  var nav  = CardService.newNavigation().updateCard(card)

  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build()
}

// https://developers.google.com/apps-script/reference/card-service/card-service#newuniversalactionresponsebuilder
// https://developers.google.com/apps-script/reference/card-service/universal-action-response-builder

function get_UniversalActionResponse(card) {
  return CardService.newUniversalActionResponseBuilder()
    .displayAddOnCards(
      [card]
    )
    .build()
}
