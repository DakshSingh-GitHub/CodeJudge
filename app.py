from flask import Flask, request, jsonify
from runner import run_code_multiple

app = Flask(__name__)


@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json(force=True)

    code = data.get("code", "")
    test_cases = data.get("test_cases", [])

    if not code: 
        return jsonify({"error": "No code provided"}), 400

    if not test_cases:
        return jsonify({"error": "No test cases provided"}), 400

    result = run_code_multiple(code, test_cases)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
