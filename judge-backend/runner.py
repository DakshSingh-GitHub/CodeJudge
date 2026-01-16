import subprocess
import tempfile
import os
import time
from concurrent.futures import ThreadPoolExecutor

TIME_LIMIT = 2  # seconds


def normalize_output(output: str) -> str:
    lines = output.strip().splitlines()
    normalized_lines = [" ".join(line.split()) for line in lines]
    return "\n".join(normalized_lines)


def run_single_test_case(index, tc, filename, time_limit):
    user_input = tc.get("input", "")
    expected_output = tc.get("output", "")

    try:
        result = subprocess.run(
            ["python", filename],
            input=user_input,
            capture_output=True,
            text=True,
            timeout=time_limit
        )
    except subprocess.TimeoutExpired:
        return {
            "test_case": index,
            "status": "Time Limit Exceeded",
            "error": "Time Limit Exceeded"
        }

    if result.returncode != 0:
        return {
            "test_case": index,
            "status": "Runtime Error",
            "error": result.stderr
        }

    actual_output = normalize_output(result.stdout)
    expected_output = normalize_output(expected_output)

    if actual_output == expected_output:
        return {
            "test_case": index,
            "status": "Accepted",
            "actual_output": actual_output,
            "expected_output": expected_output
        }
    else:
        return {
            "test_case": index,
            "status": "Wrong Answer",
            "actual_output": actual_output,
            "expected_output": expected_output
        }


def run_code_multiple(code, test_cases, mode="ALL"):
    mode = (mode or "ALL").upper()

    with tempfile.NamedTemporaryFile(
        suffix=".py", delete=False, mode="w"
    ) as temp:
        temp.write(code)
        filename = temp.name

    try:
        start_time = time.time()
        
        # Parallel execution
        # process_count = min(32, len(test_cases) + 1) # Default max_workers for ThreadPoolExecutor is usually fine (CPU * 5)
        # Using ThreadPoolExecutor since these are IO/Subprocess bound mostly (waiting for process)
        with ThreadPoolExecutor() as executor:
            futures = []
            for index, tc in enumerate(test_cases, start=1):
                futures.append(executor.submit(run_single_test_case, index, tc, filename, TIME_LIMIT))
            
            results = [f.result() for f in futures]
        
        # Sort results by index to ensure order matches input test cases
        results.sort(key=lambda x: x["test_case"])

        end_time = time.time()
        total_duration = end_time - start_time

        passed_count = sum(1 for r in results if r["status"] == "Accepted")
        
        final_status = "Accepted"
        # Determine final status based on results and mode
        if mode == "FIRST_FAIL":
            # Just find the first non-accepted result
            for r in results:
                if r["status"] != "Accepted":
                    final_status = r["status"]
                    # Retain only results up to the first failure for FIRST_FAIL mode?
                    # Usually FIRST_FAIL means "Stop judging after first fail".
                    # efficient_results = []
                    # for res in results:
                    #     efficient_results.append(res)
                    #     if res["status"] != "Accepted":
                    #         break
                    # results = efficient_results 
                    # NOTE: Since we ran all in parallel, we have all results. 
                    # We can choose to filter them for the *display* if we want to mimic strict FIRST_FAIL behavior,
                    # but returning all is also fine. Let's strictly mimic the output of sequential FIRST_FAIL
                    # by slicing the results.
                    fail_index = next((i for i, x in enumerate(results) if x["status"] != "Accepted"), -1)
                    if fail_index != -1:
                        results = results[:fail_index+1]
                    break
        else:
            # ALL mode: Check if any failed for final status summary
            for r in results:
                if r["status"] != "Accepted":
                    final_status = r["status"]
                    break # Just set final status to the first error found, but keep all results

        return {
            "final_status": final_status,
            "mode": mode,
            "total_duration": total_duration,
            "summary": {
                "passed": passed_count,
                "total": len(test_cases)
            },
            "test_case_results": results
        }

    finally:
        if os.path.exists(filename):
            os.remove(filename)
