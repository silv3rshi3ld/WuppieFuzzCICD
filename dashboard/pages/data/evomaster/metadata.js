window.evomasterData = {
  "metadata": {
    "total_requests": 0,
    "critical_issues": 0,
    "duration": "0:01:00"
  },
  "coverage": {
    "status_distribution": {
      "client_errors": 5,
      "success": 7
    },
    "method_coverage": {
      "GET": {
        "hits": 6,
        "misses": 2
      },
      "POST": {
        "hits": 1,
        "misses": 1
      },
      "PUT": {
        "hits": 0,
        "misses": 2
      }
    }
  },
  "endpoints": [
    {
      "path": "/books/v1/{book_title}",
      "http_method": "GET",
      "status_code": 401,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/me",
      "http_method": "GET",
      "status_code": 401,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/books/v1",
      "http_method": "POST",
      "status_code": 401,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/users/v1/{username}/password",
      "http_method": "PUT",
      "status_code": 401,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/users/v1/{username}/email",
      "http_method": "PUT",
      "status_code": 401,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/books/v1",
      "http_method": "GET",
      "status_code": 200,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/users/v1/_debug",
      "http_method": "GET",
      "status_code": 200,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/users/v1",
      "http_method": "GET",
      "status_code": 200,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/",
      "http_method": "GET",
      "status_code": 200,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/createdb",
      "http_method": "GET",
      "status_code": 200,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/users/v1/{username}",
      "http_method": "GET",
      "status_code": 200,
      "request_details": {},
      "response_data": {}
    },
    {
      "path": "/users/v1/login",
      "http_method": "POST",
      "status_code": 200,
      "request_details": {},
      "response_data": {}
    }
  ]
};