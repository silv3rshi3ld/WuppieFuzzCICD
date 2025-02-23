window.restlerData = {
  "name": "Restler",
  "metadata": {
    "fuzzer": {
      "name": "restler",
      "total_requests": 0,
      "critical_issues": 0,
      "duration": "Unknown"
    },
    "total_endpoints": 14,
    "summary": {
      "success_rate": 0
    }
  },
  "endpoints": [
    {
      "path": "/users/v1/L5EEU7bJSmg_XSwXV1CWZ44mlHxphgF4uA9RK",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/users/v1/register",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"status\":\"fail\",\"message\":\"User already exists. Please Log in.\"}",
      "type": "miss"
    },
    {
      "path": "/users/v1",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"users\":[{\"email\":\"mail1@mail.com\",\"username\":\"name1\"},{\"email\":\"mail2@mail.com\",\"username\":\"name2\"},{\"email\":\"admin@mail.com\",\"username\":\"admin\"}]}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/users/v1/name1",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"username\":\"name1\",\"email\":\"mail1@mail.com\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/users/v1/login",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"auth_token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk5NzI5NjYsImlhdCI6MTczOTk3MjkwNiwic3ViIjoibmFtZTEifQ.CtuD-HSR29l6Ln5egUSm1k6jTcQSbKb-7MdSvzcnEDA\",\"message\":\"Successfully logged in.\",\"status\":\"success\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}",
      "type": "miss"
    }
  ],
  "coverage": {
    "statusDistribution": {
      "hits": 0,
      "misses": 0,
      "unspecified": 0
    },
    "methodCoverage": {
      "GET": {
        "hits": 0,
        "misses": 0,
        "unspecified": 0
      },
      "POST": {
        "hits": 0,
        "misses": 0,
        "unspecified": 0
      },
      "PUT": {
        "hits": 0,
        "misses": 0,
        "unspecified": 0
      },
      "DELETE": {
        "hits": 0,
        "misses": 0,
        "unspecified": 0
      }
    },
    "statusCodes": [
      {
        "status": "200",
        "count": 4
      },
      {
        "status": "401",
        "count": 0
      },
      {
        "status": "404",
        "count": 0
      },
      {
        "status": "500",
        "count": 10
      },
      {
        "status": "204",
        "count": 0
      }
    ]
  },
  "kpi": {
    "total_requests": 0,
    "critical_errors": 0,
    "unique_endpoints": 14,
    "success_rate": 0,
    "duration": "Unknown"
  },
  "bugs": [
    {
      "endpoint": "/users/v1/L5EEU7bJSmg_XSwXV1CWZ44mlHxphgF4uA9RK",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/users/v1/L5EEU7bJSmg_XSwXV1CWZ44mlHxphgF4uA9RK --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/users/v1/register",
      "method": "POST",
      "type": "hit",
      "request": "echo ewoidXNlcm5hbWUiOiJuYW1lMSIsCiJwYXNzd29yZCI6InBhc3MxIiwKImVtYWlsIjoidXNlckB0ZW1wbWFpbC5jb20ifQ== | base64 --decode | \\\ncurl http://vampi:5000/users/v1/register \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
      "response": "{\"status\":\"fail\",\"message\":\"User already exists. Please Log in.\"}"
    },
    {
      "endpoint": "/users/v1",
      "method": "GET",
      "type": "hit",
      "request": "curl http://vampi:5000/users/v1 --request GET",
      "response": "{\"users\":[{\"email\":\"mail1@mail.com\",\"username\":\"name1\"},{\"email\":\"mail2@mail.com\",\"username\":\"name2\"},{\"email\":\"admin@mail.com\",\"username\":\"admin\"}]}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/users/v1/name1",
      "method": "GET",
      "type": "hit",
      "request": "curl http://vampi:5000/users/v1/name1 --request GET",
      "response": "{\"username\":\"name1\",\"email\":\"mail1@mail.com\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/users/v1/login",
      "method": "POST",
      "type": "hit",
      "request": "echo ewoidXNlcm5hbWUiOiJuYW1lMSIsCiJwYXNzd29yZCI6InBhc3MxIn0= | base64 --decode | \\\ncurl http://vampi:5000/users/v1/login \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
      "response": "{\"auth_token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk5NzI5NjYsImlhdCI6MTczOTk3MjkwNiwic3ViIjoibmFtZTEifQ.CtuD-HSR29l6Ln5egUSm1k6jTcQSbKb-7MdSvzcnEDA\",\"message\":\"Successfully logged in.\",\"status\":\"success\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    },
    {
      "endpoint": "/createdb",
      "method": "GET",
      "type": "miss",
      "request": "curl http://vampi:5000/createdb --request GET",
      "response": "{\"exception_type\":\"Unknown Exception\",\"error_message\":\"No error message found\"}"
    }
  ]
};