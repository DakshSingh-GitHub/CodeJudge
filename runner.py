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
                return {
                    "status": "Time Limit Exceeded",
                    "failed_test": index,
                    "error": "Time limit exceeded"
                }

            if result.returncode != 0:
                return {
                    "status": "Runtime Error",
                    "failed_test": index,
                    "error": result.stderr
                }

            actual_output = normalize_output(result.stdout)
            expected_output = normalize_output(expected_output)

            if actual_output != expected_output:
                return {
                    "status": "Wrong Answer",
                    "failed_test": index,
                    "actual_output": actual_output,
                    "expected_output": expected_output
                }

        # If all test cases pass
        return {
            "status": "Accepted",
            "passed": len(test_cases),
            "total": len(test_cases)
        }

    finally:
        os.remove(filename)
