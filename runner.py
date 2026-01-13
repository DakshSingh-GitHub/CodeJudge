import subprocess
import tempfile
import os

def run_code(code, user_input, expected_output:str):
    with tempfile.NamedTemporaryFile(
        suffix = ".py",
        delete = False,
        mode = "w"
    ) as temp:
        temp.write(code)
        temp_filename = temp.name
    
    try:
        result = subprocess.run(
            ["python", temp_filename],
            input = user_input,
            capture_output = True,
            text = True,
            timeout = 2
        )

        if result.returncode != 0:
            return {
                "status": "Runtime Error",
                "output": result.stderr
            }
        
        actual_output = result.stdout.strip()
        expected_output = expected_output.strip()
        verdict = ""

        if actual_output == expected_output:
            verdict = "Accepted"
        else:
            verdict = "Wrong Answer"

        return {
            "status": verdict,
            "actual_output": actual_output,
            "expected_output": expected_output
        }


    except subprocess.TimeoutExpired:
        return {
            "status": "TLE",
            "error": "Time Limit Exceeded"
        }
    
    finally:
        os.remove(temp_filename)

