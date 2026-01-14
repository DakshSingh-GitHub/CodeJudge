import json
from flask import Flask, request, jsonify, render_template
from runner import run_code_multiple
import os

app = Flask(__name__)

PROBLEMS_DIR = "problems"

def validate_problem(problem: dict):
    errors = []
    REQUIRED_FIELDS = {
        "id": str,
        "title": str,
        "description": str,
        "judge_mode": str,
        "sample_test_cases": list,
        "hidden_test_cases": list
    }

    for field, field_type in REQUIRED_FIELDS.items():
        if field not in problem:
            errors.append(f"Missing field: '{field}'")
        elif not isinstance(problem[field], field_type):
            errors.append(f"Invalid type for '{field}', expected {field_type.__name__}")

    # Validate judge mode
    if "judge_mode" in problem:
        normalized_mode = problem["judge_mode"].strip().upper()
        if normalized_mode not in ["ALL", "FIRST_FAIL"]:
            errors.append("judge_mode must be 'ALL' or 'FIRST_FAIL'")

    # Validate test cases
    for tc_type in ["sample_test_cases", "hidden_test_cases"]:
        if tc_type in problem:
            for idx, tc in enumerate(problem[tc_type], start=1):
                if not isinstance(tc, dict):
                    errors.append(f"{tc_type}[{idx}] must be an object")
                    continue
                if "input" not in tc or "output" not in tc:
                    errors.append(f"{tc_type}[{idx}] must contain 'input' and 'output'")

    return errors


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json(force=True)

    problem_id = data.get("problem_id", "")
    code = data.get("code", "")

    if not code: 
        return jsonify({"error": "No code provided"}), 400
    
    if not problem_id:
        return jsonify({"error": "No problem provided"}), 400

    problem_path = os.path.join(PROBLEMS_DIR, f"{problem_id}.json")
    if not os.path.exists(problem_path):
        return jsonify({"error": "Problem not found"})
    
    try:
        with open(problem_path, "r") as f:
            problem = json.load(f)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format in problem file"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to load problem: {str(e)}"}), 500
    
    errors = validate_problem(problem)
    if errors:
        return jsonify({
            "error": "Invalid problem definition",
            "details": errors
        }), 500

    judge_mode = problem.get("judge_mode", "ALL")

    test_cases = (
        problem.get("sample_test_cases", []) +
        problem.get("hidden_test_cases", [])
    )

    result = run_code_multiple(
        code = code,
        test_cases = test_cases,
        mode = judge_mode
    )

    visible_results = []
    for idx, tc_result in enumerate(result["test_case_results"]):
        if idx < len(problem.get("sample_test_cases", [])):
            visible_results.append(tc_result)
        else:
            visible_results.append({
                "test_case": tc_result["test_case"],
                "status": tc_result["status"]
            })
    
    return jsonify({
        "problem_id": problem_id,
        "final_status": result["final_status"],
        "summary": result["summary"],
        "test_case_results": visible_results
    })
       
@app.route('/problems', methods=['GET'])
def ListProblems():
    problems = []

    if not os.path.exists(PROBLEMS_DIR):
        return jsonify({
            "count": 0,
            "problems": []
        })

    for filename in os.listdir(PROBLEMS_DIR):
        if not filename.endswith(".json"):
            continue
        problem_path = os.path.join(PROBLEMS_DIR, filename)
        try:
            with open(problem_path, "r") as f:
                problem = json.load(f)
        except Exception: 
            continue
            
        
        problems.append({
            "id": problem.get("id"),
            "title": problem.get("title"),
            "description": problem.get("description")
        })

    return jsonify({
        "count": len(problems),
        "problems": problems
    })



if __name__ == "__main__":
    app.run(debug=True)
