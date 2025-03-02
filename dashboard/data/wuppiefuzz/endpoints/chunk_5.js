window.WuppieFuzzendpointsChunk5 = [
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json'",
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJib29rX3RpdGxlIjoi77+977+977+977+977+9be+/ve+/ve+/ve+/ve+/vSIsInNlY3JldCI6IlwiLUAifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\ufffd\ufffd\ufffd\ufffd\ufffdm\ufffd\ufffd\ufffd\ufffd\ufffd\",\"secret\":\"\\\"-@\"}"
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
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BD5......%13....%3A%5D.%17Ke? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiL1xcK1x1MDAwMEorVyslXHUwMDEybSIsInNlY3JldCI6IkIhXHUwMDEwSGTvv73vv73vv73vv73vv73vv70577+977+977+977+977+977+977+9cjlCQkJCQkJCIEBCQkIrQlxcIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/Xl6%1B%0DF%23Q/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"/\\\\+\\u0000J+W+%\\u0012m\",\"secret\":\"B!\\u0010Hd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd9\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffdr9BBBBBBB @BBB+B\\\\\"}"
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Iu+/vScnJicnJycnJycnJ1x1MDAxYycnJycnJycnJycnJ07vv70iLCJwYXNzd29yZCI6Iml4eHh4eHh4eEUiLCJ1c2VybmFtZSI6Iu+/ve+/ve+/ve+/ve+/vStmZjPvv73vv73vv71mSe+/ve+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%0B%05Ba%408%1C%0E/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd''&'''''''''\\u001c''''''''''''N\ufffd\",\"password\":\"ixxxxxxxxE\",\"username\":\"\ufffd\ufffd\ufffd\ufffd\ufffd+ff3\ufffd\ufffd\ufffdfI\ufffd\ufffd\"}"
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
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/books/v1/%40%40%40%40%B1%B1%40%40d%00%40%FF%BF%40%40%40%40%40%40%40%40%40%BF%40%40%40%B1%B1%40%40w%00%40H%40%40%40%40%00? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/%22%20OR%201%3D1/password? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiZHI577+977+977+9XHUwMDAwXHUwMDExIiwic2VjcmV0IjoiXHUwMDAwXHUwMDAxXHUwMDAwJjNZTSYifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"dr9\ufffd\ufffd\ufffd\\u0000\\u0011\",\"secret\":\"\\u0000\\u0001\\u0000&3YM&\"}"
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%AF%8Bt%AE%AE%40F22NF%AD%AE%AD%AENF%AE%AE%AE%FA%00%00%EF%AE%AE5FFF%AE%AE5FFF%8E%AE%AE%10%10%10%10%10%10%AE%8B%8B%8B%8B%8B%8B%8B%8Bu%8E%8B%8B%AER%40U%98%20%01FFF%10? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoifO+/vVx1MDAxZlBcdTAwMDVTKVx1MDAxNCIsInNlY3JldCI6Inx/P18vXHUwMDE3S0tLS0tLS0tLS0tLS0tLSyUifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"|\ufffd\\u001fP\\u0005S)\\u0014\",\"secret\":\"|\u007f?_/\\u0017KKKKKKKKKKKKKKKK%\"}"
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
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoibO+/vVlZWVnvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv71ZWSIsInNlY3JldCI6Ilx1MDAwM0FgcDhcXC5cdTAwMTcifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"l\ufffdYYYY\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffdYY\",\"secret\":\"\\u0003A`p8\\\\.\\u0017\"}"
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
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoieFx1MDAwMO+/vVx1MDAwMFx1MDAwMFx1MDAwZlxyIiwic2VjcmV0IjoiOFE477+9N1x1MDAxYlxyXHUwMDA2PSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"x\\u0000\ufffd\\u0000\\u0000\\u000f\\r\",\"secret\":\"8Q8\ufffd7\\u001b\\r\\u0006=\"}"
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
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJwYXNzd29yZCI6ImBAQEBASUBAQEBAQEBcdTAwMDBAXHUwMDAwXHUwMDA3XHUwMDE277+9XGYifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"`@@@@I@@@@@@@\\u0000@\\u0000\\u0007\\u0016\ufffd\\f\"}"
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJwYXNzd29yZCI6ImBAQEBASUBAQEBAQEBcdTAwMDBAXHUwMDAwXHUwMDA3XHUwMDE277+9XGYifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"`@@@@I@@@@@@@\\u0000@\\u0000\\u0007\\u0016\ufffd\\f\"}"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/U%3C5ZmUj5Zm6? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/nw%3B%5Dnw%3B%1D? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/%60%2B%16KY%2B%16K? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%2AUjuz%7D%3B%1Fzzzzzz? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6IiZcdTAwMTNcdFx1MDAwNO+/ve+/ve+/ve+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/Id1LLL%E8%03LLLLLLLL%19L%26S%29/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"&\\u0013\\t\\u0004\ufffd\ufffd\ufffd\ufffd\"}"
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiWFg2XHUwMDFiXHJGYzEiLCJzZWNyZXQiOiJcdTAwMThcZkYj77+9aHR6In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"XX6\\u001b\\rFc1\",\"secret\":\"\\u0018\\fF#\ufffdhtz\"}"
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
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%22? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%40%01%7F%00%00%00%00%9A%00? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%27%20OR%201%3D1/password? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%23? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJlbWFpbCI6IkFbcHh8fn8/In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/Kery%7C%0A%3E%1F%0A/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"A[px|~\u007f?\"}"
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Inl8XHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzPlx1MDAxM1x1MDAxMz5cdTAwMTNcdTAwMTMtXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDEzXHUwMDFmXHUwMDEzXHUwMDEzXHUwMDEzaSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%22/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"y|\\u0013\\u0013\\u0013\\u0013>\\u0013\\u0013>\\u0013\\u0013-\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u0013\\u001f\\u0013\\u0013\\u0013i\"}"
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
    "request_details": "curl http://localhost:5000/users/v1/%19L%263%19L%26%13.d2? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6IlwiIE9SIDE9MSIsInBhc3N3b3JkIjoiUChUKlx1MDAxNe+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vUpZMiIsInVzZXJuYW1lIjoiOlx1MDAwYkVcIlEgdFx1MDAxNFxuRSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\\" OR 1=1\",\"password\":\"P(T*\\u0015\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffdJY2\",\"username\":\":\\u000bE\\\"Q t\\u0014\\nE\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "echo eyJwYXNzd29yZCI6Ilrvv71cdTAwMDDvv73vv71aPlx1MDAwMO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vVx1MDAwMCDvv70g77+9PiJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"Z\ufffd\\u0000\ufffd\ufffdZ>\\u0000\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\\u0000 \ufffd \ufffd>\"}"
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
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6IipVanV6PV4vIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%27--/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"*Ujuz=^/\"}"
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6IlwiIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%87%40P%B0%B0%B0%B0%B0%B0%B0/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\\"\"}"
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/Lfs9%1CN%27%0F? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%CE%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%08%22? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6Iu+/vSIsInBhc3N3b3JkIjoiV1crXHUwMDE1XG5XV1dXV1x1MDAxZVx1MDAxZVx1MDAxZVx1MDAxZVx1MDAxZVx1MDAxZVx1MDAxZVx1MDAxZWRB77+9XHRcdFx0XHRcdFx0XHTvv73vv73vv73vv73vv73vv73vv73vv73vv70iLCJ1c2VybmFtZSI6IictLSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd\",\"password\":\"WW+\\u0015\\nWWWWW\\u001e\\u001e\\u001e\\u001e\\u001e\\u001e\\u001e\\u001edA\ufffd\\t\\t\\t\\t\\t\\t\\t\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\",\"username\":\"'--\"}"
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAwNyIsInBhc3N3b3JkIjoiV1crXHUwMDE1XG5XV1dX77+9V1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXXHUwMDA1ZEHvv73vv73vv73vv73vv73vv73vv73vv70iLCJ1c2VybmFtZSI6InNyPF4vV1x1MDAxMFx1MDAwMCBcdTAwMDB1In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u0007\",\"password\":\"WW+\\u0015\\nWWWW\ufffdWWWWWWWWWWWWWWWWWWWWWWWW\\u0005dA\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\",\"username\":\"sr<^/W\\u0010\\u0000 \\u0000u\"}"
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
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/-u%7D%7D%7D%7D%7D%7D%7D%7D%270-%27%EF%BF%BD? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/-Vkuz%3D%1EO? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%27? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6IktkNFx1MDAxOUxmczkifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%7C~%3F%1FOg3%19/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"Kd4\\u0019Lfs9\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  }
];