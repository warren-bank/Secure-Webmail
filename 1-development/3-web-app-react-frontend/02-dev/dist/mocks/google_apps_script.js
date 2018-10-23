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

  let get_thread = (thread_id) => data.threads[thread_id]

  let update_thread = (thread_id, options) => {
    const thread = data.threads[thread_id]
    Object.assign(thread.settings, options)

    if (options.unread !== undefined) {
      data.folders[0].unread_count += (options.unread ? 1 : -1)

      thread.messages.forEach(message => {
        message.settings.unread = options.unread
      })
    }

    return true
  }

  google.script = {}
  google.script.run = {
    get_folders:           do_run(data.folders),
    get_threads_in_folder: do_run(get_threads_in_folder),
    get_thread:            do_run(get_thread),
    update_thread:         do_run(update_thread),
    update_message:        get_bool,
    set_public_key:        get_bool,
    get_public_key:        get_str,
    get_public_keys:       get_obj,
    send_reply_to_thread:  get_bool,
    send_new_email:        get_bool
  }

  google.script.run.withSuccessHandler = function(cb){
    google.script.run.cb = cb
    return google.script.run
  }

  google.script.run.withFailureHandler = function(cb){
    return google.script.run
  }

})(window.google, window.mock_data)
