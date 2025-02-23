window.EvomasterEndpoints0 = [
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
];