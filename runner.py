import subprocess
import tempfile
import os


TIME_LIMIT = 2  # seconds

def normalize_output(output: str) -> str:
    lines = output.strip().splitlines()
    normalized_lines = [" ".join(line.split()) for line in lines]
    return "\n".join(normalized_lines)


def run_code_multiple(code, test_cases):
    with tempfile.NamedTemporaryFile(
        suffix=".py", delete=False, mode="w"
    ) as temp:
        temp.write(code)
        filename = temp.name

    results = []
    passed_count = 0
    final_status = "Accepted"

    try:
        for index, tc in enumerate(test_cases, start=1):
            user_input = tc.get("input", "")
            expected_output = tc.get("output", "").strip()

            try:
                result = subprocess.run(
                    ["python", filename],
                    input=user_input,
                    capture_output=True,
                    text=True,
                    timeout=TIME_LIMIT
                )
            except subprocess.TimeoutExpired:
                results.append({
                    "test_case": index,
                    "status": "Time Limit Exceeded",
                    "error": "Time Limit Exceeded"
                })
                final_status = "Time Limit Exceeded"
                continue

            if result.returncode != 0:
                results.append({
                    "test_case": index,
                    "status": "Runtime Error",
                    "error": result.stderr
                })
                final_status = "Runtime Error"
                continue

            actual_output = normalize_output(result.stdout)
            expected_output = normalize_output(expected_output)

            if actual_output == expected_output:
                results.append({
                    "test_case": index,
                    "status": "Accepted",
                    "actual_output": actual_output,
                    "expected_output": expected_output
                })
                passed_count += 1
            else:
                results.append({
                    "test_case": index,
                    "status": "Wrong Answer",
                    "actual_output": actual_output,
                    "expected_output": expected_output
                })
                final_status = "Wrong Answer"

        # If all test cases pass
        return {
            "final_status": final_status,
            "summary": {
                "passed": passed_count,
                "total": len(test_cases)
            },
            "test_case_results": results
        }

    finally:
        os.remove(filename)
