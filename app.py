from flask import Flask, request, jsonify
from runner import run_code

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def Submit():
    data = request.json
    code = data.get("code", "")
    user_input = data.get("input", "")
    expected_output = data.get("expected_output", "")

    if not code:
        return jsonify({ "error": "no code provided" })
    
    result = run_code(code, user_input, expected_output)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
