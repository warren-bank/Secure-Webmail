function getOpenThreadButton() {
  var actOpenThread = CardService.newAction().setFunctionName('onClick_OpenThread')
  var btnOpenThread = CardService.newImageButton()
    .setAltText('Open Encrypted Thread')
    .setIconUrl('https://www.gstatic.com/images/icons/material/system/1x/lock_open_black_24dp.png')
    .setOnClickAction(actOpenThread)
  return btnOpenThread
}
