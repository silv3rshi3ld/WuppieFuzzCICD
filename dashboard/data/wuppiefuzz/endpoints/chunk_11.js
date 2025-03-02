window.WuppieFuzzendpointsChunk11 = [
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6Im53ez1eb3c7IiwicGFzc3dvcmQiOiJcdTAwMTVcblx1MDAwNUIhXHUwMDEwXGJcdTAwMDQiLCJ1c2VybmFtZSI6Ilx1MDAxMFxiXHUwMDA0QiFcdTAwMTBcYkQifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"nw{=^ow;\",\"password\":\"\\u0015\\n\\u0005B!\\u0010\\b\\u0004\",\"username\":\"\\u0010\\b\\u0004B!\\u0010\\bD\"}"
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJwYXNzd29yZCI6IlstVms1Wm01NTU1NTU1NUo1NTU1NTYiLCJ1c2VybmFtZSI6Ind6fX5/f38/In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"[-Vk5Zm55555555J555556\",\"username\":\"wz}~\u007f\u007f\u007f?\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6ImIxXHUwMDE4TCZTYjFcdTAwMThMJlMpVCIsInBhc3N3b3JkIjoiXFwoVO+/vVx1MDAwMGp1eiIsInVzZXJuYW1lIjoiOFx1MDAxY05nM1lsPCJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"b1\\u0018L&Sb1\\u0018L&S)T\",\"password\":\"\\\\(T\ufffd\\u0000juz\",\"username\":\"8\\u001cNg3Yl<\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoi77+977+9f++/vVx1MDAxYe+/vVx1MDAxYVx1MDAxYTRcdTAwMDHvv70iLCJzZWNyZXQiOiLvv73vv70ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/y%3C%1EO%27Si4? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\ufffd\ufffd\u007f\ufffd\\u001a\ufffd\\u001a\\u001a4\\u0001\ufffd\",\"secret\":\"\ufffd\ufffd\"}"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/L%26S%00%02L%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%26S? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAwMVx1MDAwMlx1MDAwMlx1MDAwMlxiXHUwMDA0XHUwMDEwXHUwMDAwIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%04Bap%00%00%00%80%00%00%00%00%01%00%00%00%00/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u0001\\u0002\\u0002\\u0002\\b\\u0004\\u0010\\u0000\"}"
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%16%16%16%16y%16y%16%01%16%EF%BF%BD%16%16%7D%16%13%16%16%01/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/K%22%03%EF%BF%A8%EF%BF%BD%EF%BF%BD%03%03%03%03%03%03%03%03%03%03%03%03%EF%BF%BD%EF%BF%BD%10%EF%BF%BD%20K%EF%BF%BD%EF%BF%BFggggggggggggggg%EF%BF%BD%14%EF%BF%BD%EF%BF%BD%EF%BF%BD%03%03%03%03%03? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%22--? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%18%0CF%23%23h4Z%18%0CF%23Qh4Z? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Iu+/ve+/ve+/ve+/vVx1MDAwNu+/ve+/ve+/ve+/vW/vv73vv73vv71cdTAwMWV/77+977+977+977+9In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%EF%BF%BDfffff%00%10%11%EF%BF%BD%EF%BF%BD%EF%BF%BD%10%11%EF%BF%BD3c%1A%11%11%11%11? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd\ufffd\ufffd\ufffd\\u0006\ufffd\ufffd\ufffd\ufffdo\ufffd\ufffd\ufffd\\u001e\u007f\ufffd\ufffd\ufffd\ufffd\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%1EO%27S%29%14J%25? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%13%10%04%02%01%10%10%10%10%10%10%10%10%40%20%10? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Im02XHUwMDFiTSZT77+9XHUwMDE0In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/3Y%2C%16K%25%12%09/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"m6\\u001bM&S\ufffd\\u0014\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiT++/vVx1MDAwMFx1MDAwMFx1MDAxMFx1MDAwMFx1MDAwMFx1MDAwMCIsInNlY3JldCI6IlwiLS0tLS0tLS0ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"O\ufffd\\u0000\\u0000\\u0010\\u0000\\u0000\\u0000\",\"secret\":\"\\\"--------\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiXCIg77+9XHUwMDFlIO+/ve+/vTEiLCJzZWNyZXQiOiJVVVx1MDAwMVx1MDAwMVx1MDAwMFx1MDAwMCJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\\\" \ufffd\\u001e \ufffd\ufffd1\",\"secret\":\"UU\\u0001\\u0001\\u0000\\u0000\"}"
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Ii0tIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%CD%CD%3A%1E%0EG%23%11%1D%0EF%23%11/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"--\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%3C%1E%0FGc1%18L? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%11%DE%7F%11%E8%039%E8%039%FFD%11%11d%11%11%11%11%2B%2F%039%E8%039? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/4mmmm%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDA%EF%BF%BDmmmmmmmmmmmm6%5B? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6Iu+/ve+/vX9cdTAwMDHvv70xPjDvv73vv71/XHUwMDAx77+9MT4wIiwicGFzc3dvcmQiOiJIIE/vv73vv73vv73vv71cdTAwMDBcdTAwMDBcdTAwMDBk77+9UiAxPTEiLCJ1c2VybmFtZSI6IkBcdTAwMDBPUiAxPTEifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd\ufffd\u007f\\u0001\ufffd1>0\ufffd\ufffd\u007f\\u0001\ufffd1>0\",\"password\":\"H O\ufffd\ufffd\ufffd\ufffd\\u0000\\u0000\\u0000d\ufffdR 1=1\",\"username\":\"@\\u0000OR 1=1\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6Iu+/ve+/vVx1MDAxMFx1MDAwMO+/vTEwMCIsInBhc3N3b3JkIjoiT08xT08xIiwidXNlcm5hbWUiOiImJiYifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd\ufffd\\u0010\\u0000\ufffd100\",\"password\":\"OO1OO1\",\"username\":\"&&&\"}"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Il0hMV0w77+977+977+9IiwicGFzc3dvcmQiOiIgICAgICAgV1dXICBXaSBXVysgICBXIFx1MDAwMFdXV1dXVyDvv73vv70iLCJ1c2VybmFtZSI6Ii0tLS5kLi0tLS5kLS0tIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/UWWk%EF%BF%BD%1AMf? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"]!1]0\ufffd\ufffd\ufffd\",\"password\":\"       WWW  Wi WW+   W \\u0000WWWWWW \ufffd\ufffd\",\"username\":\"---.d.---.d---\"}"
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiQiFcdTAwMTBIXFxyOmQiLCJzZWNyZXQiOiLvv73vv71cdTAwMGZHJFJo77+9WiJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"B!\\u0010H\\\\r:d\",\"secret\":\"\ufffd\ufffd\\u000fG$Rh\ufffdZ\"}"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJib29rX3RpdGxlIjoi77+977+977+9cVo4IEDvv73vv73vv71cdTAwMGbvv71/Iiwic2VjcmV0IjoiXHUwMDAw77+9In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\ufffd\ufffd\ufffdqZ8 @\ufffd\ufffd\ufffd\\u000f\ufffd\u007f\",\"secret\":\"\\u0000\ufffd\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiKFRqXHUwMDFkXHUwMDFhTUczIiwic2VjcmV0IjoiXHUwMDAxKkBcdTAwMWQwXHUwMDFkJFx1MDAxMlx1MDAxZCJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%EF%BF%BDKK%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%DC%BDC--? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"(Tj\\u001d\\u001aMG3\",\"secret\":\"\\u0001*@\\u001d0\\u001d$\\u0012\\u001d\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/juz%7D~%7F%C0%1F? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%00%00%00%80nwn%5D? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%01%40%20%10%08D%22Q? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Ik4ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%00%10M%00%F8%F2%04YYYYYYYYYYYYY%10M%00x%08%04%13%04%02/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"N\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  }
];