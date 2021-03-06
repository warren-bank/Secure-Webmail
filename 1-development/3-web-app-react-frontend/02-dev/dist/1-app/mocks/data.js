window.mock_data = {
  folders: [
    {
      folder_name:  "inbox",
      title:        "Inbox",
      unread_count: 2
    },
    {
      folder_name:  "sent",
      title:        "Sent",
      unread_count: 0
    },
    {
      folder_name:  "trash",
      title:        "Trash",
      unread_count: 1
    }
  ],
  threads_in_folder: {
    inbox: ["t-1", "t-2"],
    trash: ["t-3"],
    sent:  []
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
  },
  RSA_keypair: {
    private_key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAhOQscKJSjfh9WXje8dBtv2u0cmdOxDDKkEH+kRjwY0fg5jGy\ntF7jxs7McFuGqCQfWVcFZun+ftazvBDqKb7QWumIpx5lfIjbFRgFkQ+sSoGcVVQZ\nXkisAVbgB7jCAmGSMQb3R2A5zmFz58WpDuGXZBh7KrZyvZJDxeTicQSGuBLMTMIj\nnptOcQ+6ROsjuYbO3gXyKedEh0B2kAiBF0JTgerKqHYwIj5iN2Clrlh6IYRXhSbJ\nk66eKHFoKXdKEIXmdvuZi7QOoT4Qnd0DhlBvmL2LFapExAHW2Se/tvo54GNPO6Yd\nb1cJ4CpX/tqk/0EsDzvHUhHf9KRM39G44ZY8cQIDAQABAoIBAEVxDh/VUppJTQch\n+C4YIiEy4NofTbOLY246bhHYHFVkzAq90YobQ58xlPbpfNYD+jWvGW2LvKb+/nC5\nzgL+aNX4zqW1ZobK5OCC6vXAYOGWFOEpzw/LncYdZXfjfc3Mup3P7AtqJwrHNc/Z\nI9xY2ck+Wa4aJJ8W/T89uW4hVVx+AhAr/5EIQV2n58j2bpLBONQlcbACrxeCnyOP\njhYqiY4o2RMWi7SUoFgAESWNaVC3srXGkxa5uH0eo1bko/VP/tq1TgheH+DduaOE\nG8gHMe5jHzxnQlpyo0jiJrXYcx3lU9N+4UrwwViMCjnHpZvyUB4xyVaGROSl/Xm6\ntkjT37kCgYEA3j3Qs+IzvX+Ykatz8YuBVwG4AtFOISeNGyewH8S/enNa5vOLLBA8\nhSA9wR3BXffoHh2MwFWxIz27+ZJnIztj1MYQA5YT9ppCqm80zLf8NNhrNnxv0SrM\nRkWePjGeXT7M/ZQ6Gfm1kOIxVqthItbWuYwuUoJNyaOIxMADes+p90sCgYEAmRPY\nsfHW6miZAtPgTXSx0op+D/Ug9OQLwWJ25acRPW4rILiGI08MXfXWj6m0BKEWmX8Y\nMrxFspoKod/T++Ey161kBc7IS1hvptHQwCRCEJQennVT/x7BiOUv1cC/xRTSz7Yz\n7X+SlGMLLezatQm5AzNWHrVdtZ/FcejgI2bIGbMCgYAkifdBTASDuHHGKXFDmlMm\nkfLGC9GTo+QQPeM4JenxYPvmEs6j7Pt2S8m7cX/0SikQon0ctjoMeD7qloZ8hWwx\ndGr3m/omRlCFowkES4+cxKRD7guYUTgKqbGNuiy2WffsDS3MTYDrlDTWchDjYH0n\nPoPzLtdJOqjm6EbqLzBbpwKBgQCD36gf7FMU0BV5bSRgNfb3hV4Cy0+gCVHjQLtj\nLuFYRa+b2budcX0a+S3lx/IQxuIcTHSBSNbWfYRJXfVWmfRd/78ajcDZwA837Ktk\nzBeqBqC2LCe3sjxSffcOs6XB2CWg0bu8j9msQgMghlsH+Z9MlY5MmDxpuoGzl0Z4\n2RPrpwKBgGrM7E0PxDRiiZ18y5N9ju00oHiBIj2kWvCdyBAteZsMKirH4S1tflah\n8Y3ruDlw3Wb3RAa1uBnkPi/MSM4wcUwT6R4z1fwUV0VjI1U1FbS6XEV+oGqgCxz3\nWHJXXSnr+lJ7Nt2mAWBT8bqMq9dEDOURGtW21xANdOvAQlKH6wcq\n-----END RSA PRIVATE KEY-----",
    public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhOQscKJSjfh9WXje8dBt\nv2u0cmdOxDDKkEH+kRjwY0fg5jGytF7jxs7McFuGqCQfWVcFZun+ftazvBDqKb7Q\nWumIpx5lfIjbFRgFkQ+sSoGcVVQZXkisAVbgB7jCAmGSMQb3R2A5zmFz58WpDuGX\nZBh7KrZyvZJDxeTicQSGuBLMTMIjnptOcQ+6ROsjuYbO3gXyKedEh0B2kAiBF0JT\ngerKqHYwIj5iN2Clrlh6IYRXhSbJk66eKHFoKXdKEIXmdvuZi7QOoT4Qnd0DhlBv\nmL2LFapExAHW2Se/tvo54GNPO6Ydb1cJ4CpX/tqk/0EsDzvHUhHf9KRM39G44ZY8\ncQIDAQAB\n-----END PUBLIC KEY-----"
  }
}
