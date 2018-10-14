const initialState = {
  "folders": [{
    "folder_name":					"",					// String
    "unread_count":					0					// Number
  }],
  "threads_in_folder": {
    "$folder_name": [
      "thread_id":					""					// String
    ]
  },
  "threads": {
    "$thread_id": {
      "summary": {
        "from":						"",					// String
        "subject":					"",					// String
        "body":						"",					// String
        "date_created":				0,					// Number (UTC timestamp in ms)
        "date_modified":			0,					// Number (UTC timestamp in ms)
        "msg_count":				0					// Number
      },
      "settings": {
        "star":						false,				// Boolean
        "important":				false,				// Boolean
        "unread":					false,				// Boolean
        "trash":					false,				// Boolean
        "spam":						false,				// Boolean
        "inbox":					true				// Boolean
      },
      "messages": [{
        "message_id":				"",					// String
        "summary": {
          "from":					"",					// String
          "to":						[""],				// Array of String
          "timestamp":				0					// Number (UTC timestamp in ms)
        },
        "contents": {
          "body":					"",					// String
          "attachments":			[{					// Array of Object
            "data":					"",
            "contentType":			"",
            "name":					""
          }]
        },
        "settings": {
          "star":					false,				// Boolean
          "unread":					false,				// Boolean
          "trash":					false				// Boolean
        }
      }],
      "participants": [
        "email_address":			""					// String
      ]
    }
  },
  "user": {
    "email_address":				""					// String
  },
  "public_keys": {
    "$email_address":				""					// String
  },
  "ui": {
    "folder_name":					"",					// String
    "thread_id":					"",					// String
    "start_threads_index":			0,					// Number
    "settings": {
      "max_threads_per_page":		25,					// Number
      "private_key":				"",					// String
      "private_key_storage":		0					// Number (enumeration: [0:none, 1:sessionStorage, 2:localStorage])
    }
  }
}

module.exports = initialState
