const initialState = {
  "folders": [{
    "folder_name":					"",					// String
    "title":						"",					// String
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
        "from":						"$email_address",	// String
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
          "from":					"$email_address",	// String
          "to":						["$email_address"],	// Array of String
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
      "participants":				["$email_address"]	// Array of String
    }
  },
  "user": {
    "email_address":				""					// String
  },
  "public_keys": {
    "$email_address":				""					// String
  },
  "app": {
    "ui": {
      "folder_name":				"",					// String
      "thread_id":					"",					// String
      "start_threads_index":		0					// Number
    },
    "settings": {
      "display_html_format":		true,				// Boolean
      "compose_html_format":		true,				// Boolean
      "max_threads_per_page":		25,					// Number
      "public_key":					"",					// String
      "private_key":				"",					// String
      "private_key_storage":		0,					// Number (enumeration: [0:none, 1:sessionStorage, 2:localStorage])
      "is_generating_keypair":		false				// Boolean
    },
    "draft_message": {
      "is_reply":					false,				// Boolean
      "thread_id":					"",					// String
      "recipient":					"",					// String
      "cc":							["$email_address"],	// Array of String
      "cc_suggestions":				["$email_address"],	// Array of String
      "subject":					"",					// String
      "body":						{
        "text_message":				"",					// String
        "html_document":			null				// Object
      },
      "attachments":				[{					// Array of Object
        "data":						"",					// String
        "contentType":				"",					// String
        "name":						""					// String
      }],
      "status": {
        "code":						0,					// Number (enumeration: [0=can_edit, 1=busy_getting_pubkeys, 2=busy_sending, 3=sent_success, 4=sent_error])
        "error_message":			""					// String
      }
    }
  }
}

module.exports = initialState
