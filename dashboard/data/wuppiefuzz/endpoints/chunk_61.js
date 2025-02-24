window.WuppieFuzzendpointsChunk61 = [
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/J%25%12I%04Ba0? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/J%25%12I%04B%08%00? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAxZFx1MDAwMEBcdTAwMWRcdTAwMWRcdTAwMWRcdTAwMWTvv71cdTAwMWRcdTAwMWQifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%00%00%01%00/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u001d\\u0000@\\u001d\\u001d\\u001d\\u001d\ufffd\\u001d\\u001d\"}"
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6Ilx1MDAwNFx1MDAwMkEgXHUwMDEwXGJQXHQiLCJ1c2VybmFtZSI6IiFcdTAwMDJBWlV4fH4ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\u0004\\u0002A \\u0010\\bP\\t\",\"username\":\"!\\u0002AZUx|~\"}"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "request_details": "curl http://localhost:5000/users/v1/%08%00G%18%0CF%23j? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6IlJpNFx1MDAxYUtLS0tLUmk0XHUwMDFhS0tLS0tLS0tLS0tLS0thS0tL77+9Q2BLIiwidXNlcm5hbWUiOiJ/XHUwMDAyXHUwMDA1XHUwMDA2XHUwMDA2XGJcdTAwMDRCIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"Ri4\\u001aKKKKKRi4\\u001aKKKKKKKKKKKKKKaKKK\ufffdC`K\",\"username\":\"\u007f\\u0002\\u0005\\u0006\\u0006\\b\\u0004B\"}"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6IlJpNFx1MDAxYUtLS0tLUmk0XHUwMDFhS0tLS0tLS0tLS0tLS0thS0tL77+9Q2BLIiwidXNlcm5hbWUiOiJ/XHUwMDAyXHUwMDA1XHUwMDA2XHUwMDA2XGJcdTAwMDRCIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"Ri4\\u001aKKKKKRi4\\u001aKKKKKKKKKKKKKKaKKK\ufffdC`K\",\"username\":\"\u007f\\u0002\\u0005\\u0006\\u0006\\b\\u0004B\"}"
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/%00%00%00%10A%A00X? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/ve+/ve+/ve+/ve+/ve+/vVx1MDAxNVxuMlx1MDAwNe+/vVx1MDAwMO+/ve+/ve+/vVx1MDAxNe+/vVx1MDAwNVx1MDAwN++/vVxiXGJcYjsuVytcdTAwMTUiLCJ1c2VybmFtZSI6Ilx1MDAxZlx1MDAxMCJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\\u0015\\n2\\u0005\ufffd\\u0000\ufffd\ufffd\ufffd\\u0015\ufffd\\u0005\\u0007\ufffd\\b\\b\\b;.W+\\u0015\",\"username\":\"\\u001f\\u0010\"}"
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/ve+/ve+/ve+/ve+/ve+/vVx1MDAxNVxuMlx1MDAwNe+/vVx1MDAwMO+/ve+/ve+/vVx1MDAxNe+/vVx1MDAwNVx1MDAwN++/vVxiXGJcYjsuVytcdTAwMTUiLCJ1c2VybmFtZSI6Ilx1MDAxZlx1MDAxMCJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\\u0015\\n2\\u0005\ufffd\\u0000\ufffd\ufffd\ufffd\\u0015\ufffd\\u0005\\u0007\ufffd\\b\\b\\b;.W+\\u0015\",\"username\":\"\\u001f\\u0010\"}"
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJlbWFpbCI6IkVcIlx1MDAxMVxiXHUwMDA0Qu+/vTAifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/Uj5Z-Vk5%27%27%27%27%27%27%27%27%27/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"E\\\"\\u0011\\b\\u0004B\ufffd0\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%00%00%7F%FF%60%8D4%9F%96/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd\"}"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "request_details": "curl http://localhost:5000/users/v1/er9%5C%7F%FF%DE%D9%DE%DE%FD%DE%DE%DE%DEQQQ%B1%FD%DE%DE%DE%DEQQQ%B1%BE%80%00%00%00998%80%FF%FF%FF%B1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%60p%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%8C%EF%AE%BD%EF%BE%BD%EF%BF%BF%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BF%EF%BF%BD%EF%BF%BD%0C%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDYYYyYYYYY%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%00%EF%BF%BD%00%EF%BF%BD%17%17? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/.%5C8%09%60? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "echo eyJlbWFpbCI6Iid/77+9IiwicGFzc3dvcmQiOiLvv73vv73vv73vv73vv70077+977+977+9az1cdTAwMDBAPT09PVx1MDAwMFx1MDAwMFx1MDAwMO+/ve+/ve+/ve+/ve+/vVx1MDAwNe+/ve+/ve+/vS9V77+9L1UiLCJ1c2VybmFtZSI6Iu+/vVwiXCLdlO+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1/%1F%0F%07%07%06%07%07%07%EF%BF%BD%06%07%07%07%07%07%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD0%20%10%08? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"'\u007f\ufffd\",\"password\":\"\ufffd\ufffd\ufffd\ufffd\ufffd4\ufffd\ufffd\ufffdk=\\u0000@====\\u0000\\u0000\\u0000\ufffd\ufffd\ufffd\ufffd\ufffd\\u0005\ufffd\ufffd\ufffd/U\ufffd/U\",\"username\":\"\ufffd\\\"\\\"\u0754\ufffd\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%29%27? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BD%EF%BF%BD%25S%10i%20%00%00%EF%BF%BD%EF%BF%BD%10%10%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDs? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%5E%5E%5E%5E%5E%5E%5E%07%5E%04%00%07%00%00%00%7F%5E%07%03A%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5E%5EPh? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 404,
    "request_details": "echo eyJlbWFpbCI6Iu+/vW0577+977+977+9Jzrvv73vv71cdTAwMWEwIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/.%17.%17%0B.%0B%05%14%14%14.%2F%14%14%17%17%17%17%17/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffdm9\ufffd\ufffd\ufffd':\ufffd\ufffd\\u001a0\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "request_details": "echo eyJib29rX3RpdGxlIjoiXCIiLCJzZWNyZXQiOiJJSUlJcjlcdTAwMWNOIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\\\"\",\"secret\":\"IIIIr9\\u001cN\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDq8%1CFEEEEEEEEEEEEEE/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6ImTvv711eu+/ve+/vVx1MDAwMFx1MDAwMVx1MDAwMFx1MDAwMHp6enoifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%3D%3D%00j%80%7D%3E_/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"d\ufffduz\ufffd\ufffd\\u0000\\u0001\\u0000\\u0000zzzz\"}"
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/9%5Cfsn7%5B%2C/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6IjNcdTAwMTlMZ++/vXlmZiIsInVzZXJuYW1lIjoiXCJcdTAwMDXvv71cdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDVcdTAwMDUtXHUwMDA3In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"3\\u0019Lg\ufffdyff\",\"username\":\"\\\"\\u0005\ufffd\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005\\u0005-\\u0007\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "request_details": "echo eyJib29rX3RpdGxlIjoiSyVcdTAwMTJcdERicXgiLCJzZWNyZXQiOiJ/P19vN1stMyJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"K%\\u0012\\tDbqx\",\"secret\":\"\u007f?_o7[-3\"}"
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/%22Qh4%1A%0DF%23? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%06K%21%10HHHHHHHHHHHHHHH%9Br%87? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/c%EF%BF%BD%17%17%17%EF%BF%BD%EF%BF%BD%07C%15%10%04%10%10%10%10%10%10%10%10%10%10%10? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/c%EF%BF%BD%17%EF%BF%BD%EF%BF%BD%07C%15%10%04%10%10%10%10%10%10%10%0F%10%10%10? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/l%EF%BF%BD%10%10%10%EF%BF%BD%EF%BF%BD%17%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%0E%07C%15%10%EF%BF%BD%EF%BF%BD%0E%07C%15%10%0F%10%10%10%10%10%10%10%10%10%10%10? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BD%EF%BF%BD%EF%BF%BF%00%01%00%EF%BF%BD%00%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%00%EF%BF%BD%EF%BF%BD%12%12I%EF%BF%BD/password? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/0%EF%BF%A1%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDL%26%13%09D%22%EF%BF%BD%EF%BF%BDddddddd%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%D7%BF%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDD%22/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 500,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/%05Ba%05Bpx%3C%05Ba%05B%90x%3C%5EM? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6IjJcdTAwMThKSDJcdTAwMTlcZiIsInBhc3N3b3JkIjoiJyBPUiAxPTEiLCJ1c2VybmFtZSI6IiMtLSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"2\\u0018JH2\\u0019\\f\",\"password\":\"' OR 1=1\",\"username\":\"#--\"}"
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "echo eyJib29rX3RpdGxlIjoiXHRcdTAwMDRCXHJsaDTvv70iLCJzZWNyZXQiOiJzeTxebzdcdTAwMWJcciJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1/6%1B%0DF%23Qh4? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\\t\\u0004B\\rlh4\ufffd\",\"secret\":\"sy<^o7\\u001b\\r\"}"
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "echo eyJib29rX3RpdGxlIjoiV1drNVotXHUwMDE2XHUwMDBiXHUwMDA1Iiwic2VjcmV0IjoiQjJcYu+/ve+/ve+/vXB4In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"WWk5Z-\\u0016\\u000b\\u0005\",\"secret\":\"B2\\b\ufffd\ufffd\ufffdpx\"}"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  }
];