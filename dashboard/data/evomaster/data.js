window.evomasterData = {
  "name": "Evomaster",
  "metadata": {
    "fuzzer": {
      "name": "evomaster",
      "total_requests": 0,
      "critical_issues": 0,
      "duration": "Unknown"
    },
    "total_endpoints": 12,
    "summary": {
      "success_rate": 0
    }
  },
  "endpoints": [
    {
      "path": "/books/v1/{book_title}",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['type'] == 'about:blank'",
      "type": "miss"
    },
    {
      "path": "/me",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['type'] == 'about:blank'",
      "type": "miss"
    },
    {
      "path": "/books/v1",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['type'] == 'about:blank'",
      "type": "miss"
    },
    {
      "path": "/users/v1/{username}/password",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['type'] == 'about:blank'",
      "type": "miss"
    },
    {
      "path": "/users/v1/{username}/email",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['type'] == 'about:blank'",
      "type": "miss"
    },
    {
      "path": "/books/v1",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['Books'][2]['user'] == 'admin'",
      "type": "miss"
    },
    {
      "path": "/users/v1/_debug",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['users'][2]['username'] == 'admin'",
      "type": "miss"
    },
    {
      "path": "/users/v1",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['users'][2]['username'] == 'admin'",
      "type": "miss"
    },
    {
      "path": "/",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['vulnerable'] == 1.0",
      "type": "miss"
    },
    {
      "path": "/createdb",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['message'] == 'Database populated.'",
      "type": "miss"
    },
    {
      "path": "/users/v1/{username}",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['email'] == 'mail1@mail.com'",
      "type": "miss"
    },
    {
      "path": "/users/v1/login",
      "method": "GET",
      "total_requests": 0,
      "success_rate": 0,
      "status_codes": {},
      "response_data": "assert res_0.json()['message'] == 'Username does not exist'",
      "type": "miss"
    }
  ],
  "coverage": {
    "statusDistribution": {
      "hits": 7,
      "misses": 5,
      "unspecified": 0
    },
    "methodCoverage": {
      "GET": {
        "hits": 6,
        "misses": 2,
        "unspecified": 0
      },
      "POST": {
        "hits": 1,
        "misses": 1,
        "unspecified": 0
      },
      "PUT": {
        "hits": 0,
        "misses": 2,
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
        "count": 7
      },
      {
        "status": "401",
        "count": 5
      },
      {
        "status": "404",
        "count": 0
      },
      {
        "status": "500",
        "count": 0
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
    "unique_endpoints": 12,
    "success_rate": 0,
    "duration": "Unknown"
  },
  "bugs": [
    {
      "status_code": 401,
      "endpoint": "/books/v1/{book_title}",
      "method": "GET",
      "type": "miss",
      "request": "{}\n",
      "response": "assert res_0.json()['type'] == 'about:blank'"
    },
    {
      "status_code": 401,
      "endpoint": "/me",
      "method": "GET",
      "type": "miss",
      "request": "{}\n",
      "response": "assert res_0.json()['type'] == 'about:blank'"
    },
    {
      "status_code": 401,
      "endpoint": "/books/v1",
      "method": "POST",
      "type": "miss",
      "request": "{}\n{}\n' { ' + ' \"book_title\": \"tg\", ' + ' \"secret\": \"5q\" ' + ' } '\n",
      "response": "assert res_0.json()['type'] == 'about:blank'"
    },
    {
      "status_code": 401,
      "endpoint": "/users/v1/{username}/password",
      "method": "PUT",
      "type": "miss",
      "request": "{}\n{}\n' { ' + ' \"password\": \"C3kJwCH0Ik\" ' + ' } '\n",
      "response": "assert res_0.json()['type'] == 'about:blank'"
    },
    {
      "status_code": 401,
      "endpoint": "/users/v1/{username}/email",
      "method": "PUT",
      "type": "miss",
      "request": "{}\n{}\n' { ' + ' \"email\": \"pn_QKlE4S\" ' + ' } '\n",
      "response": "assert res_0.json()['type'] == 'about:blank'"
    }
  ]
};