window.WuppieFuzzendpointsChunk13 = [
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
    "request_details": "echo eyJwYXNzd29yZCI6Iu+/vSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%02A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%206%28jjjkjj5/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\ufffd\"}"
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
    "request_details": "echo eyJwYXNzd29yZCI6IicgT1IgMT0xIn0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/ap%1A%1A%1A%1A%1A%1Ax~%7C_/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"' OR 1=1\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6ImhkZGTvv71cdTAwMDBcdTAwMDBcdTAwMDBkZGRkNO+/ve+/ve+/vWg077+977+977+977+9fyIsInBhc3N3b3JkIjoiSCRSKVPvv71/IiwidXNlcm5hbWUiOiLvv71cdTAwMDDvv70ifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"hddd\ufffd\\u0000\\u0000\\u0000dddd4\ufffd\ufffd\ufffdh4\ufffd\ufffd\ufffd\ufffd\u007f\",\"password\":\"H$R)S\ufffd\u007f\",\"username\":\"\ufffd\\u0000\ufffd\"}"
  },
  {
    "path": "/users/v1/register",
    "http_method": "POST",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6ImRcdTAwMDBcdTAwMDBcdTAwMDDvv73vv73vv71/IiwicGFzc3dvcmQiOiJIJEgkUilT77+9fyIsInVzZXJuYW1lIjoiXHUwMDEwayQifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"d\\u0000\\u0000\\u0000\ufffd\ufffd\ufffd\u007f\",\"password\":\"H$H$R)S\ufffd\u007f\",\"username\":\"\\u0010k$\"}"
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
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "echo eyJlbWFpbCI6Ilx1MDAxYTUqXHUwMDFhNSo0NWpNZnMiLCJwYXNzd29yZCI6Ilx1MDAxMTk5OTk5OUhkcjlcXC5XIiwidXNlcm5hbWUiOiJTKVTvv71cdTAwMTVKJVIifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\u001a5*\\u001a5*45jMfs\",\"password\":\"\\u0011999999Hdr9\\\\.W\",\"username\":\"S)T\ufffd\\u0015J%R\"}"
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
    "request_details": "curl http://localhost:5000/books/v1/%92%92%92%92%92%92%92%92%92%92%92%92%92%92%92%20? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/5%1A%1AF%409%1C? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/%40%20Ouuuuuuu%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDuR%00%1C%00%01%00%00%00%01? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiSmVyOVx1MDAxY01nMyIsInNlY3JldCI6Imp1ej1cdTAwMWVcdTAwMGZHIyJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"Jer9\\u001cMg3\",\"secret\":\"juz=\\u001e\\u000fG#\"}"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJwYXNzd29yZCI6IlwiLSMifQ== | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%FF%FF%FF%5D%05%FF%FF%05.%17.%17%5Do/password? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"password\":\"\\\"-#\"}"
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
    "request_details": "curl http://localhost:5000/users/v1/%03%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%28%14? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%0FGllH%24%12I%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%2B%EF%BF%BD%EF%BF%BD%D1%BF%EF%BF%BDllllllllllllllllllll%2B%2B%2B%2B%EF%BF%BF%EF%BF%BD? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%06S%29%14%0A%19S%29? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJlbWFpbCI6InR0dHRTdFx1MDAxMFx1MDAxZTBcdTAwMDdCYTBcdTAwMTgiLCJwYXNzd29yZCI6Ilx1MDAxNFxiRGpiXHUwMDEyXHUwMDEyWCzvv70iLCJ1c2VybmFtZSI6IiZcdTAwMTNcdHBC77+9ZO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vVx1MDAxM1x0cELvv71k77+977+977+977+977+977+977+977+977+977+977+977+977+9YXA4In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/register? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"ttttSt\\u0010\\u001e0\\u0007Ba0\\u0018\",\"password\":\"\\u0014\\bDjb\\u0012\\u0012X,\ufffd\",\"username\":\"&\\u0013\\tpB\ufffdd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\\u0013\\tpB\ufffdd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffdap8\"}"
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoifn9/P1x1MDAxZk9ncyIsInNlY3JldCI6IjFY77+9f1x1MDAwMFx1MDAwMGo1In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"~\u007f\u007f?\\u001fOgs\",\"secret\":\"1X\ufffd\u007f\\u0000\\u0000j5\"}"
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/2Xlvg%1DM%B1%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/2Xlvg%1DM%B1%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/2Xlvg%1DM%B1%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/2Xlvg%1DM%B1%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%3DVuz%7D4%EF%BF%BC%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EE%BF%BD%01%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BF%EF%BF%BD%EF%BF%BD%EF%BF%BD/email? \\\n    --request PUT \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/%00%00%02%00%80%00%00%009UB%C5%C5%C5%02%CE%C7%CE%CE%18%CE? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/2X%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "echo eyJlbWFpbCI6IkkkUml0en1+77+977+977+977+977+977+977+977+977+977+977+9In0= | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/%26Si4%1A%B3f%E8%E8s/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"I$Ritz}~\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\"}"
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
    "request_details": "curl http://localhost:5000/users/v1/ZlvG%1DMD%E5? \\\n    --request DELETE \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%CA%CAJJJJJJJJJJJJJJ%CA%CA%CA%D8JJJJJJ3J%CA%CA%CA%D8%CA%CA%1D/password? \\\n    --request PUT \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1/{book_title}",
    "http_method": "GET",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/books/v1/%08%08%08%08%08%08%08%08%08%03A%01%00%00%08? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/g%1DM%B1%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "request_details": "curl http://localhost:5000/users/v1/%22--? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/books/v1",
    "http_method": "POST",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJib29rX3RpdGxlIjoiXHUwMDAyXHUwMDAw77+9XHUwMDAwIiwic2VjcmV0IjoiJ1x1MDAwMFx1MDAwMFx1MDAxMFx1MDAwMCAgICAgICAgXHUwMDAwXHUwMDAyMSJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/books/v1? \\\n    --request POST \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"book_title\":\"\\u0002\\u0000\ufffd\\u0000\",\"secret\":\"'\\u0000\\u0000\\u0010\\u0000        \\u0000\\u00021\"}"
  },
  {
    "path": "/users/v1/{username}/password",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%EF%BF%BD%EF%BF%BD%EF%BF%BD%12%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%00%10%EF%BF%BD%EF%BF%BD%EF%BD%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%03%EF%BF%BD%EF%BF%BD%40%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD/password? \\\n    --request PUT \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%D6%D6%D6%FF%FF%FF%80%B1%D6%D6%D6%D6%D6%D6%D6? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/users/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/users/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/2Xlf%CB%CB%CB%B1%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}",
    "http_method": "GET",
    "status_code": 404,
    "type": "miss",
    "request_details": "curl http://localhost:5000/users/v1/%7F%FF%FF%FFg%1DM%B1%1D%FFg%1DM%B1%1D? \\\n    --request GET \\\n    --header 'accept: application/json'",
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
    "path": "/books/v1",
    "http_method": "GET",
    "status_code": 200,
    "type": "hit",
    "request_details": "curl http://localhost:5000/books/v1? \\\n    --request GET \\\n    --header 'accept: application/json'",
    "response_data": ""
  },
  {
    "path": "/users/v1/{username}/email",
    "http_method": "PUT",
    "status_code": 401,
    "type": "miss",
    "request_details": "echo eyJlbWFpbCI6IlxyRmNx77+9XFxudyJ9 | \\\nbase64 --decode | \\\ncurl http://localhost:5000/users/v1/P%28%00%0A%05%02%01%00/email? \\\n    --request PUT \\\n    --header 'accept: application/json' \\\n    --header 'content-type: application/json' \\\n    --data @-",
    "response_data": "{\"email\":\"\\rFcq\ufffd\\\\nw\"}"
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
  }
];