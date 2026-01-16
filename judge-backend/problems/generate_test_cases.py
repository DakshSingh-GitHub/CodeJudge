import json
import random
import os
import math
from itertools import permutations

PROBLEMS_DIR = "judge-backend/problems"

def solve_area_of_a_rectangle():
    l = random.randint(1, 1000)
    w = random.randint(1, 1000)
    return f"{l} {w}", str(l * w)

def solve_binary_to_decimal():
    val = random.randint(0, 10000)
    binary = bin(val)[2:]
    return binary, str(val)

def solve_check_for_palindrome():
    if random.choice([True, False]):
        s = "".join(random.choices("abcdef", k=random.randint(3, 10)))
        s = s + s[::-1]
        return s, "Palindrome"
    else:
        s = "".join(random.choices("abcdef", k=random.randint(3, 10)))
        # Make sure it's not accidentally a palindrome (unlikely for random)
        if s == s[::-1]: s += "a" 
        return s, "Not a Palindrome"

def solve_coin_change():
    amount = random.randint(1, 100)
    num_coins = random.randint(1, 5)
    coins = sorted(list(set(random.randint(1, 20) for _ in range(num_coins))))
    
    # DP solution to verify
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    
    res = dp[amount] if dp[amount] != float('inf') else -1
    input_str = f"{' '.join(map(str, coins))}\n{amount}"
    return input_str, str(res)

def solve_count_vowels():
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", k=random.randint(10, 50)))
    vowels = "aeiouAEIOU"
    count = sum(1 for char in s if char in vowels)
    return s, str(count)

def solve_decimal_to_binary():
    val = random.randint(0, 10000)
    return str(val), bin(val)[2:]

def solve_even_or_odd():
    n = random.randint(1, 100000)
    return str(n), "Even" if n % 2 == 0 else "Odd"

def solve_factorial_of_a_number():
    n = random.randint(0, 15) # Keep small to avoid huge numbers
    return str(n), str(math.factorial(n))

def solve_fibonacci_sequence():
    n = random.randint(0, 30)
    if n <= 1:
        return str(n), str(n)
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return str(n), str(b)

def solve_find_the_maximum():
    n = random.randint(1, 20)
    arr = [random.randint(-1000, 1000) for _ in range(n)]
    return f"{' '.join(map(str, arr))}", str(max(arr))

def solve_gcd_two_numbers():
    a = random.randint(1, 1000)
    b = random.randint(1, 1000)
    return f"{a} {b}", str(math.gcd(a, b))

def solve_knapsack_0_1():
    n = random.randint(3, 8)
    w_cap = random.randint(10, 50)
    weights = [random.randint(1, 10) for _ in range(n)]
    values = [random.randint(1, 50) for _ in range(n)]
    
    # Recursive solution matches standard problem
    def knapSack(W, wt, val, n): 
        if n == 0 or W == 0: 
            return 0
        if (wt[n-1] > W): 
            return knapSack(W, wt, val, n-1) 
        else: 
            return max(val[n-1] + knapSack(W-wt[n-1], wt, val, n-1), 
                       knapSack(W, wt, val, n-1)) 
    
    res = knapSack(w_cap, weights, values, n)
    return f"{w_cap}\n{' '.join(map(str, values))}\n{' '.join(map(str, weights))}", str(res)

def solve_lcm_two_numbers():
    a = random.randint(1, 100)
    b = random.randint(1, 100)
    return f"{a} {b}", str(abs(a*b) // math.gcd(a, b))

def solve_longest_common_subsequence():
    s1 = "".join(random.choices("ABCDE", k=random.randint(5, 15)))
    s2 = "".join(random.choices("ABCDE", k=random.randint(5, 15)))
    
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return f"{s1}\n{s2}", str(dp[m][n])

def solve_longest_increasing_subsequence():
    n = random.randint(5, 20)
    arr = [random.randint(1, 100) for _ in range(n)]
    
    lis = [1]*n 
    for i in range (1, n): 
        for j in range(0, i): 
            if arr[i] > arr[j] and lis[i] < lis[j] + 1: 
                lis[i] = lis[j]+1
    
    return f"{' '.join(map(str, arr))}", str(max(lis))

def solve_matrix_addition():
    rows = random.randint(2, 5)
    cols = random.randint(2, 5)
    mat1 = [[random.randint(1, 20) for _ in range(cols)] for _ in range(rows)]
    mat2 = [[random.randint(1, 20) for _ in range(cols)] for _ in range(rows)]
    
    res = [[mat1[i][j] + mat2[i][j] for j in range(cols)] for i in range(rows)]
    
    input_str = f"{rows} {cols}\n"
    input_str += "\n".join(" ".join(map(str, row)) for row in mat1) + "\n"
    input_str += "\n".join(" ".join(map(str, row)) for row in mat2)
    
    output_str = "\n".join(" ".join(map(str, row)) for row in res)
    return input_str, output_str

def solve_prime_number_check():
    n = random.randint(2, 500)
    is_prime = True
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            is_prime = False
            break
    return str(n), "Yes" if is_prime else "No"

def solve_remove_duplicates_array():
    n = random.randint(5, 20)
    arr = sorted([random.randint(1, 10) for _ in range(n)]) # Usually sorted input for easy duplicate removal or unsorted
    # Assuming standard problem "remove duplicates from sorted array" or just "unique elements"
    # But let's verify if problem implies specific format. Let's assume just printing unique elements.
    unique = []
    seen = set()
    for x in arr:
        if x not in seen:
            unique.append(x)
            seen.add(x)
    
    # Check problem format (usually prints "NewLength\nElements") or just elements.
    # Based on similar problems, likely prints unique array. 
    # Let's provide output as printed array space separated.
    # Wait, need to check if input is sorted? The generator makes sorted.
    return f"{' '.join(map(str, arr))}", " ".join(map(str, unique))

def solve_reverse_string():
    s = "".join(random.choices("abcdefg", k=random.randint(3, 15)))
    return s, s[::-1]

def solve_second_largest_element():
    n = random.randint(3, 20)
    arr = list(set([random.randint(1, 100) for _ in range(n)]))
    if len(arr) < 2: arr = [10, 20]
    random.shuffle(arr)
    arr_sorted = sorted(arr)
    res = arr_sorted[-2]
    return f"{' '.join(map(str, arr))}", str(res)

def solve_simple_array_sum():
    n = random.randint(3, 20)
    arr = [random.randint(1, 100) for _ in range(n)]
    return f"{' '.join(map(str, arr))}", str(sum(arr))

def solve_string_permutations():
    s = "".join(random.choices("ABC", k=random.randint(2, 3))) # Keep len small for perms
    perms = sorted(list(set("".join(p) for p in permutations(s))))
    return s, "\n".join(perms)

def solve_sum_of_digits():
    n = random.randint(10, 10000)
    s_val = sum(int(c) for c in str(n))
    return str(n), str(s_val)

def solve_sum_of_doubles():
    n = random.randint(1, 1000)
    return str(n), str(2 * n)

def solve_trapping_rain_water():
    n = random.randint(5, 15)
    heights = [random.randint(0, 5) for _ in range(n)]
    
    if not heights: return f"", "0"
    
    l, r = 0, n - 1
    leftMax, rightMax = heights[l], heights[r]
    res = 0
    while l < r:
        if leftMax < rightMax:
            l += 1
            leftMax = max(leftMax, heights[l])
            res += leftMax - heights[l]
        else:
            r -= 1
            rightMax = max(rightMax, heights[r])
            res += rightMax - heights[r]
            
    return f"{' '.join(map(str, heights))}", str(res)

SOLVERS = {
    "area_of_a_rectangle": solve_area_of_a_rectangle,
    "binary_to_decimal": solve_binary_to_decimal,
    "check_for_palindrome": solve_check_for_palindrome,
    "coin_change": solve_coin_change,
    "count_vowels": solve_count_vowels,
    "decimal_to_binary": solve_decimal_to_binary,
    "even_or_odd": solve_even_or_odd,
    "factorial_of_a_number": solve_factorial_of_a_number,
    "fibonacci_sequence": solve_fibonacci_sequence,
    "find_the_maximum": solve_find_the_maximum,
    "gcd_two_numbers": solve_gcd_two_numbers,
    "knapsack_0_1": solve_knapsack_0_1,
    "lcm_two_numbers": solve_lcm_two_numbers,
    "longest_common_subsequence": solve_longest_common_subsequence,
    "longest_increasing_subsequence": solve_longest_increasing_subsequence,
    "matrix_addition": solve_matrix_addition,
    "prime_number_check": solve_prime_number_check,
    "remove_duplicates_array": solve_remove_duplicates_array,
    "reverse_string": solve_reverse_string,
    "second_largest_element": solve_second_largest_element,
    "simple_array_sum": solve_simple_array_sum,
    "string_permutations": solve_string_permutations,
    "sum_of_digits": solve_sum_of_digits,
    "sum_of_doubles": solve_sum_of_doubles,
    "trapping_rain_water": solve_trapping_rain_water,
}

def main():
    if not os.path.exists(PROBLEMS_DIR):
        print(f"Error: {PROBLEMS_DIR} does not exist.")
        return

    for filename in os.listdir(PROBLEMS_DIR):
        if not filename.endswith(".json"):
            continue
        
        file_path = os.path.join(PROBLEMS_DIR, filename)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            problem_id = data.get("id")
            if problem_id not in SOLVERS:
                print(f"Warning: No solver found for {problem_id} ({filename})")
                continue
            
            solver = SOLVERS[problem_id]
            new_cases = []
            for _ in range(63):
                inp, outp = solver()
                new_cases.append({"input": inp, "output": outp})
            
            if "hidden_test_cases" not in data:
                data["hidden_test_cases"] = []
            
            data["hidden_test_cases"].extend(new_cases)
            
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4) # Use indent for readability
            
            print(f"Added 33 test cases to {filename}")
            
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

if __name__ == "__main__":
    main()
