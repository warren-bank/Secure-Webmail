var dataStore = {}

dataStore.scriptProperties = PropertiesService.getScriptProperties()

// throws
dataStore.set_public_key = function(email_address, public_key) {
  if (!email_address || !public_key)
    throw new Error('ERROR [dataStore.set_public_key]: Invalid input.')

  var current_public_key = dataStore.get_public_key(email_address)

  if (!current_public_key)
    dataStore.scriptProperties.setProperty(email_address, public_key)
  else if (current_public_key !== public_key)
    throw new Error('ERROR [dataStore.set_public_key]: Public key conflict. A different key is already associated with user email address.')
}

// throws
dataStore.get_public_key = function(email_address) {
  if (!email_address)
    throw new Error('ERROR [dataStore.get_public_key]: Email address of user is required to retrieve public key.')

  return dataStore.scriptProperties.getProperty(email_address)
}
