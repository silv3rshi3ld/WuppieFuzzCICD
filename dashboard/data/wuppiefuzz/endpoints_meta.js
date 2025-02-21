window.WuppieFuzzEndpointsMeta = {
  "endpoints": [
    {
      "path": "/books/v1",
      "method": "POST",
      "total_requests": 80,
      "success_requests": 0,
      "status_codes": {
        "500": 80
      },
      "responses": {
        "500": "{\n  \"book_title\": \"book99\",\n  \"secret\": \"pass1secret\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 80,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1/login",
      "method": "POST",
      "total_requests": 223,
      "success_requests": 0,
      "status_codes": {
        "500": 223
      },
      "responses": {
        "500": "{\n  \"password\": \"pass1\",\n  \"username\": \"name1\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 223,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1/register",
      "method": "POST",
      "total_requests": 118,
      "success_requests": 0,
      "status_codes": {
        "500": 118
      },
      "responses": {
        "500": "{\n  \"email\": \"user@tempmail.com\",\n  \"password\": \"pass1\",\n  \"username\": \"name1\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 118,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1/{username}/email",
      "method": "PUT",
      "total_requests": 128,
      "success_requests": 0,
      "status_codes": {
        "500": 128
      },
      "responses": {
        "500": "{\n  \"email\": \"mail3@mail.com\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 128,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/me",
      "method": "GET",
      "total_requests": 14,
      "success_requests": 0,
      "status_codes": {
        "500": 14
      },
      "responses": {
        "500": "{\n  \"email\": \"\\u0019\\f\\ufffdcq\",\n  \"password\": \"$\\u0004\\\\%333333333333333333333\",\n  \"username\": \"\\u001c\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffdM\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffdgs\\ufffd\\u0010\\ufffd\\u0000\\u0010\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 14,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/books/v1",
      "method": "GET",
      "total_requests": 29,
      "success_requests": 0,
      "status_codes": {
        "500": 29
      },
      "responses": {
        "500": "{\n  \"email\": \"mmm\\ufffd\\ufffd\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 29,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1/{username}/password",
      "method": "PUT",
      "total_requests": 93,
      "success_requests": 0,
      "status_codes": {
        "500": 93
      },
      "responses": {
        "500": "{\n  \"password\": \"C\\u0000\\u0000\\u0000\\u0010r9\\\\\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 93,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/books/v1/{book_title}",
      "method": "GET",
      "total_requests": 14,
      "success_requests": 0,
      "status_codes": {
        "500": 14
      },
      "responses": {
        "500": "{\n  \"password\": \"'\",\n  \"username\": \"' O5V\\u0a69\\ufffd\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 14,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1/_debug",
      "method": "GET",
      "total_requests": 14,
      "success_requests": 0,
      "status_codes": {
        "500": 14
      },
      "responses": {
        "500": "{\n  \"email\": \"K%\\u0012\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\ufffd\\t\\u0004\\u0002\\ufffd \"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 14,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1/{username}",
      "method": "DELETE",
      "total_requests": 15,
      "success_requests": 0,
      "status_codes": {
        "500": 15
      },
      "responses": {
        "500": "{\n  \"email\": \" \\n-\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 15,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 23,
      "success_requests": 0,
      "status_codes": {
        "500": 23
      },
      "responses": {
        "500": "{\n  \"email\": \"\\u0000\\u0000\\ufffd\\u0000\\u0000O].\",\n  \"password\": \"\\\",-\",\n  \"username\": \"\\\" OR 1=1\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 23,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1",
      "method": "GET",
      "total_requests": 13,
      "success_requests": 0,
      "status_codes": {
        "500": 13
      },
      "responses": {
        "500": "{\n  \"email\": \"\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015\\u0015((((((((\",\n  \"password\": \"/\\u0017\\ufffd\\u0003\\ufffd`p\\u0019\",\n  \"username\": \"\\\"\\\"\\\"\\\"\\\"\\\"\\\"\\\"\\\"\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 13,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/",
      "method": "GET",
      "total_requests": 11,
      "success_requests": 0,
      "status_codes": {
        "500": 11
      },
      "responses": {
        "500": "{\n  \"email\": \"1\\ufffd\\ufffd\\ufffd=\\ufffd\\ufffd\\ufffd\\ufffd\\ufffdiiiii\\ufffd1\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 11,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    },
    {
      "path": "/users/v1/{username}",
      "method": "GET",
      "total_requests": 15,
      "success_requests": 0,
      "status_codes": {
        "500": 15
      },
      "responses": {
        "500": "{\n  \"book_title\": \"\\ufffd\\ufffd\\u007f\\ufffd\\u001a\\ufffd\\u001a\\u001a4\\u0001\\ufffd\",\n  \"secret\": \"\\ufffd\\ufffd\"\n}"
      },
      "severity_counts": {
        "critical": 0,
        "high": 15,
        "medium": 0,
        "low": 0
      },
      "success_rate": 0.0
    }
  ]
};