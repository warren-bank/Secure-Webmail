window.mock_data = {
  folders: [
    {
      folder_name:  "inbox",
      title:        "Inbox",
      unread_count: 2
    },
    {
      folder_name:  "trash",
      title:        "Trash",
      unread_count: 1
    }
  ],
  threads_in_folder: {
    inbox: ["t-1", "t-2"],
    trash: ["t-3"]
  },
  threads: {
    "t-1": {
      "summary": {
        "from":					"aaa@gmail.com",
        "subject":				"Foo",
        "body":					"Test: Foo",
        "date_created":			0,
        "date_modified":		0,
        "msg_count":			2
      },
      "settings": {
        "star":					false,
        "important":			false,
        "unread":				true,
        "trash":				false,
        "spam":					false,
        "inbox":				true
      },
      "messages": [{
        "message_id":			"m-1",
        "summary": {
          "from":				"aaa@gmail.com",
          "to": [
								"john.smith@gmail.com",
								"bbb@gmail.com"
          ],
          "timestamp":			0
        },
        "contents": {
          "body":				"Test: Foo",
          "attachments": [{
            "data":				"data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D",
            "contentType":		"text/plain",
            "name":				"hello-world.txt"
          }]
        },
        "settings": {
          "star":				false,
          "unread":				true,
          "trash":				false
        }
      },{
        "message_id":			"m-2",
        "summary": {
          "from":				"bbb@gmail.com",
          "to": [
								"john.smith@gmail.com",
								"aaa@gmail.com"
          ],
          "timestamp":			0
        },
        "contents": {
          "body":				"Reply: Foo",
          "attachments": [{
            "data":				"data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D",
            "contentType":		"text/plain",
            "name":				"hello-world.txt"
          }]
        },
        "settings": {
          "star":				false,
          "unread":				true,
          "trash":				false
        }
      }],
      "participants": [
								"aaa@gmail.com",
								"john.smith@gmail.com",
								"bbb@gmail.com"
      ]
    },
    "t-2": {
      "summary": {
        "from":					"aaa@gmail.com",
        "subject":				"Bar",
        "body":					"Test: Bar",
        "date_created":			0,
        "date_modified":		0,
        "msg_count":			2
      },
      "settings": {
        "star":					false,
        "important":			false,
        "unread":				true,
        "trash":				false,
        "spam":					false,
        "inbox":				true
      },
      "messages": [{
        "message_id":			"m-3",
        "summary": {
          "from":				"aaa@gmail.com",
          "to": [
								"john.smith@gmail.com",
								"bbb@gmail.com"
          ],
          "timestamp":			0
        },
        "contents": {
          "body":				"Test: Bar",
          "attachments": [{
            "data":				"data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D",
            "contentType":		"text/plain",
            "name":				"hello-world.txt"
          }]
        },
        "settings": {
          "star":				false,
          "unread":				true,
          "trash":				false
        }
      },{
        "message_id":			"m-4",
        "summary": {
          "from":				"bbb@gmail.com",
          "to": [
								"john.smith@gmail.com",
								"aaa@gmail.com"
          ],
          "timestamp":			0
        },
        "contents": {
          "body":				"Reply: Bar",
          "attachments": [{
            "data":				"data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D",
            "contentType":		"text/plain",
            "name":				"hello-world.txt"
          }]
        },
        "settings": {
          "star":				false,
          "unread":				true,
          "trash":				false
        }
      }],
      "participants": [
								"aaa@gmail.com",
								"john.smith@gmail.com",
								"bbb@gmail.com"
      ]
    },
    "t-3": {
      "summary": {
        "from":					"aaa@gmail.com",
        "subject":				"Baz",
        "body":					"Test: Baz",
        "date_created":			0,
        "date_modified":		0,
        "msg_count":			2
      },
      "settings": {
        "star":					false,
        "important":			false,
        "unread":				true,
        "trash":				true,
        "spam":					false,
        "inbox":				false
      },
      "messages": [{
        "message_id":			"m-5",
        "summary": {
          "from":				"aaa@gmail.com",
          "to": [
								"john.smith@gmail.com",
								"bbb@gmail.com"
          ],
          "timestamp":			0
        },
        "contents": {
          "body":				"Test: Baz",
          "attachments": [{
            "data":				"data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D",
            "contentType":		"text/plain",
            "name":				"hello-world.txt"
          }]
        },
        "settings": {
          "star":				false,
          "unread":				true,
          "trash":				true
        }
      },{
        "message_id":			"m-6",
        "summary": {
          "from":				"bbb@gmail.com",
          "to": [
								"john.smith@gmail.com",
								"aaa@gmail.com"
          ],
          "timestamp":			0
        },
        "contents": {
          "body":				"Reply: Baz",
          "attachments": [{
            "data":				"data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D",
            "contentType":		"text/plain",
            "name":				"hello-world.txt"
          }]
        },
        "settings": {
          "star":				false,
          "unread":				false,
          "trash":				true
        }
      }],
      "participants": [
								"aaa@gmail.com",
								"john.smith@gmail.com",
								"bbb@gmail.com"
      ]
    }
  }
}
