import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_echo_input():
    print("Testing input echoing (terminal emulation)...")
    data = {
        "code": "name = input('Name: ')\nprint(f'Hello, {name}!')",
        "input": "Daksh"
    }
    response = requests.post(f"{BASE_URL}/run", json=data)
    print(f"Status Code: {response.status_code}")
    # print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    stdout = response.json()["stdout"]
    print(f"--- STDOUT ---\n{stdout}\n--------------")
    
    # Expected:
    # Name: Daksh
    # Hello, Daksh!
    
    expected_lines = ["Name: Daksh", "Hello, Daksh!"]
    actual_lines = [line.strip() for line in stdout.splitlines() if line.strip()]
    
    for expected in expected_lines:
        assert expected in actual_lines or any(expected in line for line in actual_lines), f"Expected '{expected}' to be in output"

if __name__ == "__main__":
    time.sleep(2)
    try:
        test_echo_input()
        print("\nAll tests passed!")
    except Exception as e:
        print(f"\nTests failed: {e}")
