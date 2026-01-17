
import time
import runner
import random

def generate_test_cases(n=50): # Use 50 for faster verification of slow mode
    tcs = []
    for i in range(n):
        a = random.randint(1, 1000)
        b = random.randint(1, 1000)
        tcs.append({
            "input": f"{a}\n{b}",
            "output": f"{a+b}"
        })
    return tcs

code = """
import sys
try:
    a = int(input())
    b = int(input())
    print(a + b)
except:
    pass
"""

def main():
    test_cases = generate_test_cases(50)
    print(f"Running {len(test_cases)} test cases...")
    
    # Check current mode
    print(f"Optimization Enabled: {runner.ENABLE_OPTIMIZATION}")
    
    start = time.time()
    result = runner.run_code_multiple(code, test_cases)
    end = time.time()
    
    print(f"Total time: {end - start:.4f} seconds")
    print(f"Passed: {result['summary']['passed']}/{result['summary']['total']}")

if __name__ == "__main__":
    main()
