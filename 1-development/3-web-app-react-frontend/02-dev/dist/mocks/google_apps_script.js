window.google = {}

;(function(google){

  let do_run = function(val){
    return function(){
      if (google.script.run.cb) {
        google.script.run.cb(val)
        delete google.script.run.cb
      }
      return val
    }
  }

  let get_arr  = do_run([])
  let get_obj  = do_run({})
  let get_bool = do_run(true)
  let get_str  = do_run('')

  google.script = {}
  google.script.run = {
    get_folders:           get_arr,
    get_threads_in_folder: get_arr,
    get_thread:            get_obj,
    update_thread:         get_bool,
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

})(window.google)
