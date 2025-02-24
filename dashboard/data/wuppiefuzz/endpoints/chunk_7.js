window.WuppieFuzzendpointsChunk7 = [
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Ilx1MDAwMO+/vVx1MDAwMVx1MDAxMe+/ve+/vU9cdTAwMTHvv71PTyJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%FA%DA%C3%A4%A4%A4%A4%84/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\u0000\ufffd\\u0001\\u0011\ufffd\ufffdO\\u0011\ufffdOO\"}"
  },
  {
    "path": "/me",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAxZk9nZzlZNjZbIiwicGFzc3dvcmQiOiJcIiBPUiAxPTEiLCJ1c2VybmFtZSI6Ilx1MDAwZu+/ve+/ve+/vVx1MDAwMFx1MDAxMO+/vWMifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/me? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u001fOgg9Y66[\",\"password\":\"\\\" OR 1=1\",\"username\":\"\\u000f\ufffd\ufffd\ufffd\\u0000\\u0010\ufffdc\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 500,
    "request_details": "curl http://localhost:5000/users/v1/%27%201O%EE%BF%BD%20%00%00%101? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%C7%BD%09%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%10%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%40%EF%BF%BD%5E%EF%BF%BD%EF%BE%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%24%24%24%24%24%24%24%24%EF%BF%BD%EE%BF%BD%13C/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/%22? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/ku%3B%5D%BA%80%2BU? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6Iu+/ve+/ve+/vVx1MDAxOFxm77+9MFx1MDAwMVx1MDAwMO+/vSNRIiwicGFzc3dvcmQiOiJcIi0tIiwidXNlcm5hbWUiOiJcIiJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\ufffd\ufffd\ufffd\\u0018\\f\ufffd0\\u0001\\u0000\ufffd#Q\",\"password\":\"\\\"--\",\"username\":\"\\\"\"}"
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
    "path": "/createdb",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/createdb? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAwMFx1MDAwMEpTU1Pvv71cdTAwMDF/XHUwMDAxXHUwMDAwbVNJ77+9SlNcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDFcdTAwMDBcdTAwMDBcdTAwMDBcdTAwMTBTXHUwMDAwXHUwMDAwXHUwMDAxXHUwMDAxXHUwMDAwXHUwMDAxf0pTU1Pvv71cdTAwMDF/In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1/%40%10%40%EF%BF%BD%EF%BF%BD%40%EF%BF%BD%EF%BF%BD%EF%BF%BDjjjjjjjj? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u0000\\u0000JSSS\ufffd\\u0001\u007f\\u0001\\u0000mSI\ufffdJS\\u0001\\u0001\\u0001\\u0001\\u0001\\u0001\\u0001\\u0001\\u0001\\u0001\\u0000\\u0000\\u0000\\u0010S\\u0000\\u0000\\u0001\\u0001\\u0000\\u0001\u007fJSSS\ufffd\\u0001\u007f\"}"
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
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BD%10%EF%BF%BD? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BF? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "http_method": "POST",
    "status_code": 401,
    "request_details": "echo eyJib29rX3RpdGxlIjoiYjFYXHUwMDEwXHUwMDAwK1x1MDAxNUoiLCJzZWNyZXQiOiJVKlx1MDAxNUpVKlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMlx1MDAxMiBcdTAwMTJJJO+/ve+/ve+/ve+/ve+/ve+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"b1X\\u0010\\u0000+\\u0015J\",\"secret\":\"U*\\u0015JU*\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012\\u0012 \\u0012I$\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\"}"
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
    "request_details": "echo eyJlbWFpbCI6InEyMjIyMjJxf39/f39/f39/f08yMlx1MDAwMFx1MDAwMFx1MDAwNFxiMlx1MDAwMFx1MDAwMFx1MDAwMFx1MDAwMDIyMjJcdTAwMDDvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv70yXHUwMDAw77+977+9XHUwMDAwMjIyMjIyPzJAcjIyMjIy77+9In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"q222222q\u007f\u007f\u007f\u007f\u007f\u007f\u007f\u007f\u007f\u007fO22\\u0000\\u0000\\u0004\\b2\\u0000\\u0000\\u0000\\u00002222\\u0000\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd2\\u0000\ufffd\ufffd\\u0000222222?2@r22222\ufffd\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 400,
    "request_details": "curl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json'",
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
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%0C%90.W%90%90%8F%05? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/ll6%5B-Vk5%1A? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/books/v1/YZm%EF%BF%BE%2FW? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6ImIxWCxWK1x1MDAxNVxu77+977+977+977+977+977+977+977+9IiwicGFzc3dvcmQiOiJlMlx1MDAxOVxmRiNRaCIsInVzZXJuYW1lIjoiTGYzXHUwMDE5XGZGI1x1MDAxMSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"b1X,V+\\u0015\\n\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\",\"password\":\"e2\\u0019\\fF#Qh\",\"username\":\"Lf3\\u0019\\fF#\\u0011\"}"
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/books/v1/%2C%FA-? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 404,
    "request_details": "curl http://localhost:5000/users/v1/%5Eow%7B%7D%3E_%2F? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6IlwiIE9SUiAxPTEifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/t%15JWWW%3CWWWWWWWWWWWWWd%00%00%00%3A%3E.? \\\n    --request DELETE \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\\" ORR 1=1\"}"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6ImTvv70ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%15%0A%05Bapx%86/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"d\ufffd\"}"
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
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Ilx1MDAwMFx1MDAwMFx1MDAwMFx1MDAwMO+/vVx1MDAwMO+/vX/vv71cdTAwMDByXHUwMDAwXHUwMDAwXHUwMDAwXHUwMDAw77+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+9IiwidXNlcm5hbWUiOiIj77+9I1x1MDAwMlx1MDAwMlx1MDAwMlx1MDAwMlx1MDAwMlx1MDAwMlx1MDAwMlx1MDAwMlx1MDAwMlx1MDAwMu+/vSMifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%EF%BF%A9%EF%BF%BDC%EF%BF%BDC/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\u0000\\u0000\\u0000\\u0000\ufffd\\u0000\ufffd\u007f\ufffd\\u0000r\\u0000\\u0000\\u0000\\u0000\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\",\"username\":\"#\ufffd#\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\\u0002\ufffd#\"}"
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
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/n7%EF%BF%BD7777Aap/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%19%19%19%19%19%19%19%19%19%19%19%19%19%19%1EO%EF%BF%BD%01%19O%16%0B%19%1EO%EF%BF%BD%01%19O%16%0B? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "request_details": "echo eyJlbWFpbCI6IihUaihUdTpbLlUiLCJwYXNzd29yZCI6IkdHR0dHSEdHR0dHR0dHR0dwXHUwMDFjXHUwMDBlRyM4XHUwMDEx77+9IiwidXNlcm5hbWUiOiIjLSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"(Tj(Tu:[.U\",\"password\":\"GGGGGHGGGGGGGGGGp\\u001c\\u000eG#8\\u0011\ufffd\",\"username\":\"#-\"}"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "echo eyJwYXNzd29yZCI6Ilx1MDAxZlx1MDAwZlx1MDAwN0MhXHUwMDEwSCQifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%12%09%04%02A%20Ph/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\u001f\\u000f\\u0007C!\\u0010H$\"}"
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
    "request_details": "echo eyJlbWFpbCI6IiVSaXR6WFhYIiwicGFzc3dvcmQiOiJlMlx1MDAxOVxmXHUwMDA2QyFcdTAwMTAiLCJ1c2VybmFtZSI6Ii9cdTAwMTdLJVIpXHUwMDE0XG4ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"%RitzXXX\",\"password\":\"e2\\u0019\\f\\u0006C!\\u0010\",\"username\":\"/\\u0017K%R)\\u0014\\n\"}"
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
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/_debug",
    "http_method": "GET",
    "status_code": 200,
    "request_details": "curl http://localhost:5000/users/v1/_debug? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/2YlK%5D%5D%5D%5D%5D2%5D%5D%5D%5D%5E%5D%5D%EF%BF%BD%EF%BF%BD%EF%BF%BD%22%23%23%0F%23%23%23%23%23%23%23%23%23%23%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BF%EF%BF%BD%1B%0D%EF%BF%BD%5D%5D%1B%EF%BF%BD%EF%BF%BD/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%0F%EF%BF%BD%EF%BF%BD%EF%BF%BDA/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/%1EO%10s%00%10%1E%EF%BF%BD/password? \\\n    --request PUT \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}",
    "http_method": "DELETE",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/x%05%02A%60px%7C%3E%05%02A%60p? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "request_details": "curl http://localhost:5000/users/v1/n%EF%BF%BD%3B%1DNg3%19%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%3B%1DN%EF%BF%BD3%19/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  }
];