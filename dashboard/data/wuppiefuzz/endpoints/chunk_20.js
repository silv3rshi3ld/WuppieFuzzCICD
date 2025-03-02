window.WuppieFuzzendpointsChunk20 = [
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
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json'",
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
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%E8K%25Ritz%3D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAwZkdjcThcdTAwMWNOJyJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/ju%3A%1D%0E%07Ca/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u000fGcq8\\u001cN'\"}"
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
    "request_details": "curl http://localhost:5000/users/v1/.g3BO---------%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1%D1O%D1%C5%C4? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/books/v1/%18%0CG%23%40ht%3A? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/vSVcdTAwMGLvv70kXHUwMDEyXHUwMDAwXHUwMDAwIiwidXNlcm5hbWUiOiInIE9SIDE9MSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd%\\u000b\ufffd$\\u0012\\u0000\\u0000\",\"username\":\"' OR 1=1\"}"
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
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJwYXNzd29yZCI6Ilwia2tzXHUwMDAwa2tra2tra2trayIsInVzZXJuYW1lIjoiP0A/Pz8tPydcdTAwMGU/Pz8/PyJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\\"kks\\u0000kkkkkkkkkk\",\"username\":\"?@???-?'\\u000e?????\"}"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJwYXNzd29yZCI6IicgTzMgMT0xIiwidXNlcm5hbWUiOiJcdTAwMDFcdTAwMDAtIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"' O3 1=1\",\"username\":\"\\u0001\\u0000-\"}"
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
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6IjBcdTAwMThcdTAwMThcZlx1MDAwNkNd77+9f1xmXGYifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/n7%1B%0DFK1%18/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"0\\u0018\\u0018\\f\\u0006C]\ufffd\u007f\\f\\f\"}"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6Ii1cdTAwMTZcdTAwMGJcdTAwMDVcdTAwMDJBIFx1MDAxNiIsInBhc3N3b3JkIjoiYDBYLFbvv711OiIsInVzZXJuYW1lIjoiUWjvv73vv73vv73vv73vv73vv700Wm02Wy0ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"-\\u0016\\u000b\\u0005\\u0002A \\u0016\",\"password\":\"`0X,V\ufffdu:\",\"username\":\"Qh\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd4Zm6[-\"}"
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6Iu+/vVx1MDAxYVx1MDAwMFx1MDAwMCB/ICAgICBcdTAwMDFcdTAwMDZcdTAwMTBcdTAwMDAgUGTvv73vv73vv73vv73vv73vv73LsO+/ve+/vcuw77+977+9XHUwMDAwXHUwMDAwIiwicGFzc3dvcmQiOiLvv73vv71cdTAwMDPvv73vv73vv73vv70iLCJ1c2VybmFtZSI6Ii0tJyAnLSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd\\u001a\\u0000\\u0000 \u007f     \\u0001\\u0006\\u0010\\u0000 Pd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u02f0\ufffd\ufffd\u02f0\ufffd\ufffd\\u0000\\u0000\",\"password\":\"\ufffd\ufffd\\u0003\ufffd\ufffd\ufffd\ufffd\",\"username\":\"--' '-\"}"
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
    "request_details": "echo eyJlbWFpbCI6IlxiXHUwMDA0QmEwWGw2IiwicGFzc3dvcmQiOiIrXHUwMDE1SjYyWWw2IiwidXNlcm5hbWUiOiJPXHUwMDFlTydTaXQ6In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\b\\u0004Ba0Xl6\",\"password\":\"+\\u0015J62Yl6\",\"username\":\"O\\u001eO'Sit:\"}"
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
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSwsNEslXHUwMDAwXHUwMDAw77+977+9IiwidXNlcm5hbWUiOiI/77+977+977+977+977+977+977+977+977+977+977+9L1dXV1dLV1crVWogIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd,,4K%\\u0000\\u0000\ufffd\ufffd\",\"username\":\"?\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd/WWWWKWW+Uj \"}"
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
    "status_code": 404,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6IiVcdTAwMDBcdTAwMDRcdTAwMDBcdTAwMDAlJWgifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%2F%2F%2F%2F%2FM6%2F%2F%2F%2F%2F%2F%2F/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"%\\u0000\\u0004\\u0000\\u0000%%h\"}"
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
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/%26%40%40%40%40%40%40%3F%40%40%40%40%40%40%40%40%13I%13p? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%27? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%23? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/LLLLLLLLhLLL%B4LL%7D%7D%7D%7D%7D%7D%7D%7D%7DL%7D%7D%7D%7D%7D%7D%7DLLLL? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%29%3A%00%02%3A%3A9? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/r%EF%BF%BD%00%00%00%EF%BF%BD%EF%BF%BD%EF%BF%BD? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/0%60%20%DF%F6%F6%F6%F6%F6%F6%F6%F6%F6%F6%F6%20%FF%7F%FF%FF%20F%10%60? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%86%82v%3BX%5Ds%F5%F5%F5wwwww%F7%84%84%84%84%84%84%84%84~w%9F%7B/password? \\\n    --request PUT \\\n    --header 'accept: application/json'",
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJib29rX3RpdGxlIjoiXHUwMDEyXHUwMDEy77+9XHUwMDEy77+9XHUwMDEy77+977+977+9XHUwMDAwXHUwMDAwXHUwMDAwf1x1MDAxMlx1MDAxMlx1MDAwMlx1MDAxMiIsInNlY3JldCI6Iu+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/ll%EF%BF%BDllllYl%7F%EF%BF%BDllOg? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\\u0012\\u0012\ufffd\\u0012\ufffd\\u0012\ufffd\ufffd\ufffd\\u0000\\u0000\\u0000\u007f\\u0012\\u0012\\u0002\\u0012\",\"secret\":\"\ufffd\"}"
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
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/ve+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/m%26%E5%0C%B9%031%7F/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd\ufffd\"}"
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
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
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