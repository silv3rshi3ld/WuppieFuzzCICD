window.evomasterEndpoints0 = [
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['type'] == 'about:blank'"
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['type'] == 'about:blank'"
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "{}\n{}\n' { ' + ' \"book_title\": \"tg\", ' + ' \"secret\": \"5q\" ' + ' } '\n",
    "response_data": "assert res_0.json()['type'] == 'about:blank'"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "{}\n{}\n' { ' + ' \"password\": \"C3kJwCH0Ik\" ' + ' } '\n",
    "response_data": "assert res_0.json()['type'] == 'about:blank'"
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "{}\n{}\n' { ' + ' \"email\": \"pn_QKlE4S\" ' + ' } '\n",
    "response_data": "assert res_0.json()['type'] == 'about:blank'"
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['Books'][2]['user'] == 'admin'"
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['users'][2]['username'] == 'admin'"
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['users'][2]['username'] == 'admin'"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['vulnerable'] == 1.0"
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['message'] == 'Database populated.'"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "{}\n",
    "response_data": "assert res_0.json()['email'] == 'mail1@mail.com'"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "{}\n{}\n' { ' + ' \"username\": \"qR\", ' + ' \"password\": \"wp22sirx2YkPyT\" ' + ' } '\n",
    "response_data": "assert res_0.json()['message'] == 'Username does not exist'"
  }
];