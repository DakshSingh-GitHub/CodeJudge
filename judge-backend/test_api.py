import requests
import json
import time

URL = "http://localhost:5000/submit"
CODE_PYTHON = """
import sys

def solve():
    print(sys.stdin.read().strip())

if __name__ == '__main__':
    solve()
"""
CODE_JS = """
let fs = require("fs");
function solve() {
    let inputs = fs.readFileSync(0, "utf-8").split("\\n");
    console.log(inputs[0]);
}
// For competitive programming mimic:
solve();
"""

CODE_JS_2 = """
console.log(input());
"""

def test():
    try:
        # We need a problem_id to test, let's just get problems list first
        probs = requests.get("http://localhost:5000/problems").json()
        if not probs.get("problems"):
            print("No problems found to test.")
            return

        p_id = probs["problems"][0]["id"]
        print(f"Testing against problem: {p_id}")

        res = requests.post(URL, json={
            "problem_id": p_id,
            "code": CODE_JS_2,
            "language": "javascript",
            "test_only": True
        })
        print("JS Response:")
        print(json.dumps(res.json(), indent=2))
        
        print("-" * 40)
        
        res_py = requests.post(URL, json={
            "problem_id": p_id,
            "code": CODE_PYTHON,
            "language": "python",
            "test_only": True
        })
        print("PY Response:")
        print(json.dumps(res_py.json(), indent=2))
        
    except requests.exceptions.ConnectionError:
        print("Server not running on port 5000. Please start backend.")

if __name__ == "__main__":
    test()
