
import runner
import time

def verify_tle():
    print("Verifying TLE...")
    code = """
import time
while True:
    pass
"""
    tcs = [{"input": "1", "output": "1"}]
    start = time.time()
    res = runner.run_code_multiple(code, tcs)
    dur = time.time() - start
    print(f"TLE Duration: {dur:.4f}s")
    print(f"Status: {res['final_status']}")
    print(f"Results: {res['test_case_results'][0]['status']}")
    assert res['test_case_results'][0]['status'] == "Time Limit Exceeded"

def verify_error():
    print("\nVerifying Runtime Error...")
    code = """
print(1/0)
"""
    tcs = [{"input": "1", "output": "1"}]
    res = runner.run_code_multiple(code, tcs)
    print(f"Status: {res['final_status']}")
    print(f"Results: {res['test_case_results'][0]['status']}")
    assert res['test_case_results'][0]['status'] == "Runtime Error"

if __name__ == "__main__":
    verify_tle()
    verify_error()
    print("\nRobustness verification passed.")
