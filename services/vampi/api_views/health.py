from flask import Response

def health_check():
    response_text = '{ "status": "healthy" }'
    response = Response(response_text, 200, mimetype='application/json')
    return response
