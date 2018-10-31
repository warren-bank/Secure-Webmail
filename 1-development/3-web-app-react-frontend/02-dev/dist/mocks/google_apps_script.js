window.google = {}

;(function(google, data){

  let do_run = function(val){
    return function(...args){
      let _val = (typeof val === 'function')
        ? val(...args)
        : val

      if (google.script.run.cb) {
        google.script.run.cb(_val)
        delete google.script.run.cb
      }
      return _val
    }
  }

  let get_arr  = do_run([])
  let get_obj  = do_run({})
  let get_bool = do_run(true)
  let get_str  = do_run('')

  let get_threads_in_folder = (folder_name) => {
    const thread_ids = data.threads_in_folder[folder_name]
    const threads    = thread_ids.map(thread_id => {
      const thread = data.threads[thread_id]
      return {
        thread_id,
        summary:  {...thread.summary},
        settings: {...thread.settings}
      }
    })
    return threads
  }

  let get_thread = (thread_id) => {
    const thread = data.threads[thread_id]
    return {
      summary:      {...thread.summary},
      settings:     {...thread.settings},
      participants: [...thread.participants],
      messages:     thread.messages.map(message => ({
                      message_id: message.message_id,
                      summary:    {...message.summary, to: [...message.summary.to]},
                      settings:   {...message.settings},
                      contents:   {...message.contents,
                                      attachments: message.contents.attachments.map(attachment => ({...attachment}))
                                  }
                    }))
    }
  }

  let find_folderNames_by_threadId = thread_id => {
    let folder_names = []
    Object.keys(data.threads_in_folder).forEach(folder_name => {
      let thread_ids = data.threads_in_folder[folder_name]
      if (!thread_ids || !thread_ids.length) return
      if (thread_ids.indexOf(thread_id) >= 0) folder_names.push(folder_name)
    })
    return folder_names
  }

  let update_thread = (thread_id, options) => {
    const thread = data.threads[thread_id]
    Object.assign(thread.settings, options)

    if (options.unread !== undefined) {
      // update unread setting of all messages in thread
      thread.messages.forEach(message => {
        message.settings.unread = options.unread
      })

      // update unread count of folders
      let folder_names = find_folderNames_by_threadId(thread_id)
      data.folders.forEach(folder => {
        if (folder_names.indexOf(folder.folder_name) >= 0) {
          folder.unread_count += (options.unread ? 1 : -1)
        }
      })
    }

    return true
  }

  let update_message = (message_id, options) => {
    Object.keys(data.threads).forEach(thread_id => {
      const thread = data.threads[thread_id]

      thread.messages.forEach(message => {
        if (message.message_id !== message_id) return

        Object.assign(message.settings, options)
      })
    })

    return true
  }

  let set_public_key = (pubkey) => {
    data.RSA_keypair.public_key = pubkey
    return true
  }

  let get_public_key = (email) => data.RSA_keypair.public_key

  let get_public_keys = (emails) => {
    const keys = {}
    emails.forEach(email => {
      if (email === 'nopubkey@gmail.com') return

      keys[email] = data.RSA_keypair.public_key
    })
    return keys
  }

  let send_reply_to_thread = (thread_id, body, cc, attachments) => {
    let thread       = data.threads[thread_id]
    let last_message = thread.messages[ thread.messages.length - 1 ]

    let from = window.init_data.email_address
    let to   = [last_message.summary.from]
    if (cc) {
      if (typeof cc === 'string')         to.push(cc)
      if (Array.isArray(cc) && cc.length) to = [...to, ...cc]
    }
    let timestamp = new Date().getTime()

    let new_message  = {
      "message_id":  window.uuidv4(),
      "summary": {
        from,
        to,
        timestamp
      },
      "contents": {
        body,
        attachments
      },
      "settings": {
        "star":      false,
        "unread":    false,
        "trash":     false
      }
    }

    thread.messages.push(new_message)

    thread.summary.date_modified = timestamp
    thread.summary.msg_count++
    return true
  }

  let send_new_email = (recipient, subject, body, cc, attachments) => {
    let from = window.init_data.email_address
    let to   = [recipient]
    if (cc) {
      if (typeof cc === 'string')         to.push(cc)
      if (Array.isArray(cc) && cc.length) to = [...to, ...cc]
    }
    let timestamp = new Date().getTime()

    let new_message  = {
      "message_id":  window.uuidv4(),
      "summary": {
        from,
        to,
        timestamp
      },
      "contents": {
        body,
        attachments
      },
      "settings": {
        "star":      false,
        "unread":    false,
        "trash":     false
      }
    }

    let new_thread_id = window.uuidv4()

    let new_thread = {
      "summary": {
        from,
        subject,
        body:          body.substring(0, 160),
        date_created:  timestamp,
        date_modified: timestamp,
        msg_count:     1
      },
      "settings": {
        "star":        false,
        "important":   false,
        "unread":      false,
        "trash":       false,
        "spam":        false,
        "inbox":       false
      },
      "messages": [new_message],
      "participants": [from, ...to]
    }

    data.threads[new_thread_id] = new_thread
    data.threads_in_folder.sent.unshift(new_thread_id)
    return true
  }

  google.script = {}
  google.script.run = {
    get_folders:           do_run(data.folders),
    get_threads_in_folder: do_run(get_threads_in_folder),
    get_thread:            do_run(get_thread),
    update_thread:         do_run(update_thread),
    update_message:        do_run(update_message),
    set_public_key:        do_run(set_public_key),
    get_public_key:        do_run(get_public_key),
    get_public_keys:       do_run(get_public_keys),
    send_reply_to_thread:  do_run(send_reply_to_thread),
    send_new_email:        do_run(send_new_email)
  }

  google.script.run.withSuccessHandler = function(cb){
    google.script.run.cb = cb
    return google.script.run
  }

  google.script.run.withFailureHandler = function(cb){
    return google.script.run
  }

})(window.google, window.mock_data)
