// ---------------------------------------------------------

function buildCard() {
  var card, cardSection, dropdown, buttons

  card        = CardService.newCardBuilder()
  cardSection = CardService.newCardSection()

  cardSection.addWidget(getOpenThreadButton())

  return card.addSection(cardSection).build()
}

// ---------------------------------------------------------
// standalone: no external dependencies

function buildDescribeUsageCard() {
  var card, cardSection

  card        = CardService.newCardBuilder()
  cardSection = CardService.newCardSection()

  // https://developers.google.com/apps-script/reference/card-service/key-value

  cardSection.addWidget(
    CardService.newKeyValue()
      .setIconUrl('https://www.gstatic.com/images/icons/material/system/1x/lock_open_black_24dp.png')
      .setContent('<b>Open Encrypted Thread')
      .setMultiline(true)
  )

  return card.addSection(cardSection).build()
}

// ---------------------------------------------------------
// standalone: no external dependencies

function buildAboutAuthorCard() {
  var card, cardSection

  card        = CardService.newCardBuilder()
  cardSection = CardService.newCardSection()

  cardSection.addWidget(
    CardService.newTextParagraph().setText('&copy; <b>Warren Bank</b>')
  )

  cardSection.addWidget(
    CardService.newImage()
      .setImageUrl('https://avatars3.githubusercontent.com/u/6810270?s=460&v=4')
  )

  cardSection.addWidget(
    CardService.newTextParagraph().setText('Made with <i>love</i>, caffeine, and Google Apps Script.<br><br>&bull; https://github.com/warren-bank<br><br>&bull; secure.webmail.addon@gmail.com')
  )

  return card.addSection(cardSection).build()
}

// ---------------------------------------------------------
