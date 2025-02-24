window.WuppieFuzzendpointsChunk10 = [
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
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6Ii9XazVabXZ7eyIsInBhc3N3b3JkIjoiUChU77+977+9SmVyIiwidXNlcm5hbWUiOiJYLFx1MDAxNlx1MDAwYkVcIlFoIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"/Wk5Zmv{{\",\"password\":\"P(T\ufffd\ufffdJer\",\"username\":\"X,\\u0016\\u000bE\\\"Qh\"}"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Im83XHUwMDFiXHJcdTAwMDZDIVx1MDAxMCJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/px%7C~%3F%1F%0FG/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"o7\\u001b\\r\\u0006C!\\u0010\"}"
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
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6ImQ5XHUwMDFjTidkZGQiLCJwYXNzd29yZCI6IlxcXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyXHUwMDAyLlx1MDAxN1x1MDAwYlx1MDAwNVx1MDAwMkEgIiwidXNlcm5hbWUiOiJJJFx1MDAxMkkkXHUwMDEySWQifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"d9\\u001cN'ddd\",\"password\":\"\\\\\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002.\\u0017\\u000b\\u0005\\u0002A \",\"username\":\"I$\\u0012I$\\u0012Id\"}"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "request_details": "curl http://localhost:5000/users/v1/mv0%00%00%00%40v%04%00%00%00%40? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6IlwiLiQiLCJ1c2VybmFtZSI6Ii0tLS0tLS0tLS0tLS0tLVvvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73Hu++/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vS1WK1VqWy1WK1Xvv71aWlpaWlpaWlpaWu+/ve+/ve+/ve+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\\".$\",\"username\":\"---------------[\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u01fb\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd-V+Uj[-V+U\ufffdZZZZZZZZZZZ\ufffd\ufffd\ufffd\ufffd\"}"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6IlwiLiAiLCJ1c2VybmFtZSI6Ii0tLS0tLS0tLS0tLS0tLVvvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73Hu++/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vS1WK1VqWy1WK1Xvv71aWlpaWlpaWi0tLS0tLS0ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\\". \",\"username\":\"---------------[\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u01fb\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd-V+Uj[-V+U\ufffdZZZZZZZZ-------\"}"
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
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
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "request_details": "curl http://localhost:5000/users/v1/%27%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%DD%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%27? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6ImpqampqLlcrVSpVajUifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%5B-%16%0BEbq8/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"jjjjj.W+U*Uj5\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6Iu+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSRcdTAwMTJJJFJpdO+/vSIsInBhc3N3b3JkIjoicDhcdTAwMWPvv71cdTAwMDBcdTAwMDFcdTAwMDBcdTAwMDAiLCJ1c2VybmFtZSI6Ilx1MDAxMu+/ve+/ve+/vVx1MDAxMO+/vXE477+9XHUwMDEyIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd$\\u0012I$Rit\ufffd\",\"password\":\"p8\\u001c\ufffd\\u0000\\u0001\\u0000\\u0000\",\"username\":\"\\u0012\ufffd\ufffd\ufffd\\u0010\ufffdq8\ufffd\\u0012\"}"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Ijfvv71iXG5cdTAwMTcxWGwifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%05%02%01%00%40%20%10H/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"7\ufffdb\\n\\u00171Xl\"}"
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
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6ImRcdTAwMThcZkYxXHUwMDE477+9XGZGMVx1MDAxOFx1MDAwMFx1MDAwMu+/ve+/ve+/vSlcdTAwMTQifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"d\\u0018\\fF1\\u0018\ufffd\\fF1\\u0018\\u0000\\u0002\ufffd\ufffd\ufffd)\\u0014\"}"
  },
  {
    "path": "/users/v1/login",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJwYXNzd29yZCI6IlAoVCpcdTAwMDBcdTAwMDBcdTAwMDBkIiwidXNlcm5hbWUiOiInIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/login? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"P(T*\\u0000\\u0000\\u0000d\",\"username\":\"'\"}"
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
    "path": "/",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/2%FF%03222222222224%17%002? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJib29rX3RpdGxlIjoiXHUwMDA3XHUwMDA3dDpdIiwic2VjcmV0IjoiPV4vXHUwMDE3S2UyWSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\\u0007\\u0007t:]\",\"secret\":\"=^/\\u0017Ke2Y\"}"
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
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "request_details": "echo eyJib29rX3RpdGxlIjoiXHUwMDFlXHUwMDAwXHUwMDAwXHUwMDAwXHUwMDA2QyFcdTAwMTAiLCJzZWNyZXQiOiI0XHUwMDFhXHJcdTAwMDZDXHUwMDAwUSAifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\\u001e\\u0000\\u0000\\u0000\\u0006C!\\u0010\",\"secret\":\"4\\u001a\\r\\u0006C\\u0000Q \"}"
  },
  {
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/%1F%0FG%00%00%01%00%EF%BF%BD%14J? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/OO%3C%00N%28%19NNNNNI/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Ilx0XHUwMDA0XHUwMDFj77+977+977+977+977+977+977+977+977+977+977+977+977+977+9Tyfvv71CJSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%D9/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\t\\u0004\\u001c\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffdO'\ufffdB%\"}"
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAwMO+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/L%26%20TTjL%D4%D5%2B%D4%D4%D4%26%20%29%ABz4K/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u0000\ufffd\"}"
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
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/%25%12I%25%0B%0B%F5%0B%FF%FF%FF%FF%23%0B%0B%03%0B%0C%0BI%23%FA? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJwYXNzd29yZCI6IictLSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1/%EF%BF%BD%00%01? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"'--\"}"
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
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
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/ve+/ve+/vVfvv73vv73vv71cdTAwMDJcdTAwMDDvv73vv70yIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%28%2C--/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd\ufffd\ufffdW\ufffd\ufffd\ufffd\\u0002\\u0000\ufffd\ufffd2\"}"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6IlwiIU9SIDE9In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%1E%15Idr8rq/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\\"!OR 1=\"}"
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
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%EA%EA%EA%EA%EA%EA%EA%15%15%15%15%15? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/5%1A%0D%06%03%01%FC%FC%40%00? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/JJJJJJJJJJB%02%01%02%20%FE%FF%05%00%01~%02%02%02%02JWJJJJ%FFJ%B6JJJJJJ%02%A3%A3%A3%A3%A3%A3%02%02%02%02%06%80%FF%FFJJJJ%A3%03JJJJ%FF%00? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "request_details": "echo eyJib29rX3RpdGxlIjoiKVQqVe+/ve+/ve+/vVx1MDAwMCIsInNlY3JldCI6Iu+/vVAoXHUwMDEzSu+/vVAoXHUwMDEzSiVSKSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\")T*U\ufffd\ufffd\ufffd\\u0000\",\"secret\":\"\ufffdP(\\u0013J\ufffdP(\\u0013J%R)\"}"
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
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/vv%3B%1D%40%EF%BF%BD%40%EF%BF%BD%01%40? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  }
];