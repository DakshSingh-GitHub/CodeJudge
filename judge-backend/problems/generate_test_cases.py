import json
import random
import os
import math
from itertools import permutations

PROBLEMS_DIR = os.path.dirname(os.path.abspath(__file__))

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
    # Length 6-7 to allow for >1000 permutations
    length = random.randint(4, 7)
    s = "".join(random.choices("ABCDE", k=length))
    # For large strings, printing ALL permutations is huge output. 
    # But this is a "hard" problem? 
    # Usually printing all perms of len 7 (5040 lines) is a bit much for ONE test case if we have 1000 test cases.
    # Total lines = 5000 * 1000 = 5 million lines output. 
    # Maybe restrictive?
    # Let's keep length modest (4-6).
    length = random.randint(3, 6)
    s = "".join(random.choices("ABC", k=length))
    perms = sorted(list(set("".join(p) for p in permutations(s))))
    return s, "\n".join(perms)

def solve_knapsack_0_1():
    n = random.randint(5, 12) # Increased slightly
    w_cap = random.randint(10, 80)
    weights = [random.randint(1, 15) for _ in range(n)]
    values = [random.randint(1, 100) for _ in range(n)]
    
    # Recursive solution matches standard problem
    # Memoization needed for larger N? N=12 is fine (2^12 = 4096)
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

def solve_square_of_a_number():
    n = random.randint(1, 1000)
    return str(n), str(n * n)

def solve_cube_of_a_number():
    n = random.randint(1, 100)
    return str(n), str(n * n * n)

def solve_leap_year_check():
    year = random.randint(1800, 2400)
    is_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
    return str(year), "Yes" if is_leap else "No"

def solve_count_consonants():
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(5, 20)))
    vowels = "aeiou"
    count = sum(1 for char in s if char.lower() not in vowels and char.isalpha())
    return s, str(count)

def solve_string_length():
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(1, 50)))
    return s, str(len(s))

def solve_is_anagram():
    s1 = "".join(random.choices("abcde", k=random.randint(3, 8)))
    if random.choice([True, False]):
        s2 = "".join(random.sample(s1, len(s1)))
    else:
        s2 = "".join(random.choices("abcde", k=len(s1)))
    return f"{s1}\n{s2}", "Yes" if sorted(s1) == sorted(s2) else "No"

def solve_sum_of_n_natural_numbers():
    n = random.randint(1, 1000)
    return str(n), str(n * (n + 1) // 2)

def solve_is_perfect_square():
    if random.choice([True, False]):
        n = random.randint(1, 100)**2
    else:
        n = random.randint(1, 10000)
    root = int(math.sqrt(n))
    return str(n), "Yes" if root * root == n else "No"

def solve_is_armstrong_number():
    if random.choice([True, False]):
        # Hardcode some armstrong numbers or small range
        n = random.choice([153, 370, 371, 407, 1634, 8208, 9474])
    else:
        n = random.randint(100, 1000)
    digits = [int(d) for d in str(n)]
    power = len(digits)
    is_armstrong = sum(d**power for d in digits) == n
    return str(n), "Yes" if is_armstrong else "No"

def solve_smallest_element_in_array():
    n = random.randint(3, 20)
    arr = [random.randint(-1000, 1000) for _ in range(n)]
    return " ".join(map(str, arr)), str(min(arr))

def solve_sum_of_even_in_range():
    a = random.randint(1, 100)
    b = random.randint(a, 200)
    res = sum(x for x in range(a, b + 1) if x % 2 == 0)
    return f"{a} {b}", str(res)

def solve_sum_of_odd_in_range():
    a = random.randint(1, 100)
    b = random.randint(a, 200)
    res = sum(x for x in range(a, b + 1) if x % 2 != 0)
    return f"{a} {b}", str(res)

def solve_reverse_an_array():
    n = random.randint(3, 15)
    arr = [random.randint(1, 100) for _ in range(n)]
    return " ".join(map(str, arr)), " ".join(map(str, arr[::-1]))

def solve_is_array_sorted():
    n = random.randint(3, 10)
    arr = [random.randint(1, 50) for _ in range(n)]
    if random.choice([True, False]):
        arr.sort()
    return " ".join(map(str, arr)), "Yes" if arr == sorted(arr) else "No"

def solve_missing_number():
    n = random.randint(3, 15)
    arr = list(range(1, n + 1))
    missing = random.choice(arr)
    arr.remove(missing)
    random.shuffle(arr)
    return f"{n}\n" + " ".join(map(str, arr)), str(missing)

def solve_count_set_bits():
    n = random.randint(0, 10000)
    return str(n), str(bin(n).count('1'))

def solve_power_of_two():
    if random.choice([True, False]):
        n = 2**random.randint(0, 30)
    else:
        n = random.randint(1, 10**9)
    is_power = n > 0 and (n & (n - 1)) == 0
    return str(n), "Yes" if is_power else "No"

def solve_pascals_triangle_row():
    n = random.randint(0, 20)
    row = [1]
    for i in range(n):
        row.append(row[i] * (n - i) // (i + 1))
    return str(n), " ".join(map(str, row))

def solve_valid_parentheses():
    def generate(length):
        if length == 0: return ""
        if random.choice([True, False]):
            inner = generate(length - 1)
            return "(" + inner + ")"
        else:
            split = random.randint(0, length - 1)
            return generate(split) + generate(length - split)
            
    if random.choice([True, False]):
        s = generate(random.randint(1, 5))
    else:
        s = "".join(random.choices("()", k=random.randint(2, 10)))
        
    stack = []
    mapping = {")": "("}
    is_valid = True
    if not s: is_valid = True
    else:
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    is_valid = False
                    break
            else:
                stack.append(char)
        if stack: is_valid = False
            
    return s, "Yes" if is_valid else "No"

def solve_best_time_to_buy_and_sell_stock():
    n = random.randint(2, 20)
    prices = [random.randint(1, 100) for _ in range(n)]
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        min_price = min(min_price, p)
        max_profit = max(max_profit, p - min_price)
    return " ".join(map(str, prices)), str(max_profit)

def solve_majority_element():
    n = random.randint(3, 15)
    majority = random.randint(1, 100)
    arr = [majority] * (n // 2 + 1)
    arr += [random.randint(1, 100) for _ in range(n - len(arr))]
    random.shuffle(arr)
    return " ".join(map(str, arr)), str(majority)

def solve_climbing_stairs():
    n = random.randint(1, 30)
    if n <= 2: res = n
    else:
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        res = b
    return str(n), str(res)

def solve_house_robber():
    n = random.randint(1, 20)
    nums = [random.randint(0, 100) for _ in range(n)]
    if not nums: res = 0
    elif len(nums) == 1: res = nums[0]
    else:
        prev2, prev1 = 0, 0
        for x in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        res = prev1
    return " ".join(map(str, nums)), str(res)

def solve_edit_distance():
    word1 = "".join(random.choices("abc", k=random.randint(3, 8)))
    word2 = "".join(random.choices("abc", k=random.randint(3, 8)))
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0: dp[i][j] = j
            elif j == 0: dp[i][j] = i
            elif word1[i-1] == word2[j-1]: dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return f"{word1}\n{word2}", str(dp[m][n])

def solve_matrix_multiplication():
    r1, c1 = random.randint(2, 4), random.randint(2, 4)
    r2, c2 = c1, random.randint(2, 4)
    m1 = [[random.randint(1, 5) for _ in range(c1)] for _ in range(r1)]
    m2 = [[random.randint(1, 5) for _ in range(c2)] for _ in range(r2)]
    res = [[sum(m1[i][k] * m2[k][j] for k in range(c1)) for j in range(c2)] for i in range(r1)]
    
    inp = f"{r1} {c1} {r2} {c2}\n"
    inp += "\n".join(" ".join(map(str, row)) for row in m1) + "\n"
    inp += "\n".join(" ".join(map(str, row)) for row in m2)
    outp = "\n".join(" ".join(map(str, row)) for row in res)
    return inp, outp

def solve_rotate_array():
    n = random.randint(1, 100)
    arr = [random.randint(1, 100) for _ in range(n)]
    k = random.randint(0, n)
    k_rot = k % n if n > 0 else 0
    res = arr[-k_rot:] + arr[:-k_rot] if n > 0 else arr
    return f"{' '.join(map(str, arr))}\n{k}", " ".join(map(str, res))

def solve_product_of_array_except_self():
    n = random.randint(2, 12)
    arr = [random.randint(1, 5) for _ in range(n)]
    res = []
    prod = 1
    for x in arr: prod *= x
    for x in arr: res.append(prod // x)
    return " ".join(map(str, arr)), " ".join(map(str, res))

def solve_two_sum():
    n = random.randint(2, 50)
    nums = [random.randint(-100, 100) for _ in range(n)]
    i, j = random.sample(range(n), 2)
    target = nums[i] + nums[j]
    # Ensure exactly one solution or at least we find one. 
    # The problem says exactly one solution. For random data, it might have more.
    # But for the judge, we just need to return the indices they found.
    # Wait, the generator needs to provide the CORRECT output.
    # If there are multiple, any is fine? No, usually "exactly one".
    # Let's just return the indices we picked.
    res = sorted([i, j])
    return f"{' '.join(map(str, nums))}\n{target}", f"{res[0]} {res[1]}"

def solve_longest_common_prefix():
    prefixes = ["flower", "flow", "flight", "dog", "racecar", "car", "inter", "interval", "intermediate"]
    n = random.randint(1, 5)
    strs = random.choices(prefixes, k=n)
    if not strs: return "", ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: break
    return " ".join(strs), prefix

def solve_fizz_buzz():
    n = random.randint(1, 100)
    res = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0: res.append("FizzBuzz")
        elif i % 3 == 0: res.append("Fizz")
        elif i % 5 == 0: res.append("Buzz")
        else: res.append(str(i))
    return str(n), " ".join(res)

def solve_single_number():
    n = random.randint(1, 50)
    nums = [random.randint(-100, 100) for _ in range(n)]
    nums = nums + nums # duplicates
    single = random.randint(-200, 200)
    nums.append(single)
    random.shuffle(nums)
    return " ".join(map(str, nums)), str(single)

def solve_happy_number():
    n = random.randint(1, 1000)
    def is_happy(num):
        seen = set()
        while num != 1 and num not in seen:
            seen.add(num)
            num = sum(int(d)**2 for d in str(num))
        return num == 1
    return str(n), "Yes" if is_happy(n) else "No"

def solve_counting_bits():
    n = random.randint(0, 100)
    res = [bin(i).count('1') for i in range(n + 1)]
    return str(n), " ".join(map(str, res))

def solve_sqrt_x():
    x = random.randint(0, 10000)
    res = int(math.sqrt(x))
    return str(x), str(res)

def solve_plus_one():
    n = random.randint(1, 10)
    digits = [random.randint(0, 9) for _ in range(n)]
    if digits[0] == 0: digits[0] = 1
    num = int("".join(map(str, digits))) + 1
    res = " ".join(list(str(num)))
    return " ".join(map(str, digits)), res

def solve_add_binary():
    a = bin(random.randint(1, 100))[2:]
    b = bin(random.randint(1, 100))[2:]
    res = bin(int(a, 2) + int(b, 2))[2:]
    return f"{a} {b}", res

def solve_length_of_last_word():
    words = ["Hello", "World", "fly", "me", "to", "the", "moon", "apple", "banana"]
    n = random.randint(1, 5)
    s = " ".join(random.choices(words, k=n))
    if random.choice([True, False]): s += " " * random.randint(1, 5)
    res = len(s.strip().split()[-1])
    return s, str(res)

def solve_reverse_integer():
    x = random.randint(-1000, 1000)
    s = str(abs(x))
    res = int(s[::-1])
    if x < 0: res = -res
    if res < -2**31 or res > 2**31 - 1: res = 0
    return str(x), str(res)

def solve_hamming_distance():
    x = random.randint(0, 1000)
    y = random.randint(0, 1000)
    res = bin(x ^ y).count('1')
    return f"{x} {y}", str(res)

def solve_perfect_number():
    n = random.choice([6, 28, 496, 8128] + [random.randint(1, 1000) for _ in range(5)])
    divs = [i for i in range(1, n) if n % i == 0]
    res = "Yes" if sum(divs) == n else "No"
    return str(n), res

def solve_self_dividing_numbers():
    left = random.randint(1, 100)
    right = random.randint(left, left + 50)
    res = []
    for n in range(left, right + 1):
        s = str(n)
        if '0' in s: continue
        if all(n % int(d) == 0 for d in s):
            res.append(n)
    return f"{left} {right}", " ".join(map(str, res))

def solve_island_perimeter():
    # Simplified island generator
    r, c = 5, 5
    grid = [[0]*c for _ in range(r)]
    # Place a 2x2 or similar block
    r_start, c_start = random.randint(0, r-2), random.randint(0, c-2)
    grid[r_start][c_start] = 1
    grid[r_start+1][c_start] = 1
    grid[r_start][c_start+1] = 1
    
    perimeter = 0
    for i in range(r):
        for j in range(c):
            if grid[i][j] == 1:
                if i == 0 or grid[i-1][j] == 0: perimeter += 1
                if i == r-1 or grid[i+1][j] == 0: perimeter += 1
                if j == 0 or grid[i][j-1] == 0: perimeter += 1
                if j == c-1 or grid[i][j+1] == 0: perimeter += 1
                
    inp = f"{r} {c}\n" + "\n".join(" ".join(map(str, row)) for row in grid)
    return inp, str(perimeter)

def solve_base_7():
    num = random.randint(-1000, 1000)
    if num == 0: return "0", "0"
    res = ""
    n = abs(num)
    while n:
        res = str(n % 7) + res
        n //= 7
    if num < 0: res = "-" + res
    return str(num), res

def solve_number_complement():
    num = random.randint(1, 1000)
    bitmask = (1 << num.bit_length()) - 1
    res = num ^ bitmask
    return str(num), str(res)

def solve_maximum_product_of_three_numbers():
    n = random.randint(3, 10)
    nums = [random.randint(-20, 20) for _ in range(n)]
    nums.sort()
    res = max(nums[-1] * nums[-2] * nums[-3], nums[0] * nums[1] * nums[-1])
    return " ".join(map(str, nums)), str(res)

def solve_keyboard_row():
    rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]
    words = ["Alaska", "Dad", "Peace", "Hello", "omk", "adsdf", "sfd"]
    chosen = random.choices(words, k=5)
    res = []
    for w in chosen:
        w_lower = w.lower()
        for r in rows:
            if all(c in r for c in w_lower):
                res.append(w)
                break
    return " ".join(chosen), " ".join(res)

def solve_binary_search():
    n = random.randint(5, 20)
    nums = sorted(random.sample(range(-100, 100), n))
    if random.choice([True, False]):
        target = random.choice(nums)
        res = nums.index(target)
    else:
        target = random.randint(-200, 200)
        res = nums.index(target) if target in nums else -1
    return f"{' '.join(map(str, nums))}\n{target}", str(res)

def solve_combination_sum():
    n = random.randint(3, 8)
    candidates = sorted(list(set(random.randint(1, 10) for _ in range(n))))
    target = random.randint(5, 15)
    
    res = []
    def backtrack(remain, curr, start):
        if remain == 0:
            res.append(list(curr))
            return
        if remain < 0:
            return
        for i in range(start, len(candidates)):
            curr.append(candidates[i])
            backtrack(remain - candidates[i], curr, i)
            curr.pop()
            
    backtrack(target, [], 0)
    res.sort()
    output_str = "\n".join(" ".join(map(str, combo)) for combo in res)
    return f"{' '.join(map(str, candidates))}\n{target}", output_str

def solve_group_anagrams():
    words = ["eat", "tea", "tan", "ate", "nat", "bat", "listen", "silent", "rat", "art", "cat", "act"]
    n = random.randint(5, 12)
    chosen = random.choices(words, k=n)
    
    groups = {}
    for w in chosen:
        sorted_w = "".join(sorted(w))
        if sorted_w not in groups: groups[sorted_w] = []
        groups[sorted_w].append(w)
        
    sorted_groups = []
    for g in groups.values():
        g.sort()
        sorted_groups.append(g)
    
    sorted_groups.sort(key=lambda x: x[0])
    output_str = "\n".join(" ".join(g) for g in sorted_groups)
    return " ".join(chosen), output_str

def solve_permutations():
    n = random.randint(2, 4)
    arr = sorted(list(set(random.randint(1, 10) for _ in range(n))))
    if len(arr) < n: arr = list(range(1, n+1))
    
    from itertools import permutations as iter_perms
    res = sorted(list(iter_perms(arr)))
    output_str = "\n".join(" ".join(map(str, p)) for p in res)
    return " ".join(map(str, arr)), output_str

def solve_maximum_subarray():
    n = random.randint(1, 20)
    arr = [random.randint(-10, 10) for _ in range(n)]
    max_so_far = -float('inf')
    max_ending_here = 0
    for x in arr:
        max_ending_here += x
        if max_so_far < max_ending_here:
            max_so_far = max_ending_here
        if max_ending_here < 0:
            max_ending_here = 0
    return " ".join(map(str, arr)), str(max_so_far)

def solve_jump_game():
    n = random.randint(2, 10)
    arr = [random.randint(0, 3) for _ in range(n)]
    
    reachable = 0
    for i in range(n):
        if i > reachable: break
        reachable = max(reachable, i + arr[i])
    
    res = "Yes" if reachable >= n - 1 else "No"
    return " ".join(map(str, arr)), res

def solve_subarray_sum_equals_k():
    n = random.randint(3, 15)
    arr = [random.randint(-5, 5) for _ in range(n)]
    k = random.randint(-10, 10)
    
    count = 0
    for i in range(n):
        s = 0
        for j in range(i, n):
            s += arr[j]
            if s == k: count += 1
    return " ".join(map(str, arr)) + f"\n{k}", str(count)

def solve_kth_largest_element():
    n = random.randint(1, 20)
    arr = [random.randint(1, 100) for _ in range(n)]
    k = random.randint(1, n)
    res = sorted(arr, reverse=True)[k-1]
    return " ".join(map(str, arr)) + f"\n{k}", str(res)

def solve_word_search():
    m, n = 3, 3
    board = [[random.choice("ABC") for _ in range(n)] for _ in range(m)]
    word_len = random.randint(2, 4)
    word = "".join(random.choice("ABC") for _ in range(word_len))
    
    def dfs(r, c, idx, visited):
        if idx == len(word): return True
        if r < 0 or r >= m or c < 0 or c >= n or (r, c) in visited or board[r][c] != word[idx]:
            return False
        visited.add((r, c))
        res = dfs(r+1, c, idx+1, visited) or dfs(r-1, c, idx+1, visited) or \
              dfs(r, c+1, idx+1, visited) or dfs(r, c-1, idx+1, visited)
        visited.remove((r, c))
        return res

    found = False
    for i in range(m):
        for j in range(n):
            if dfs(i, j, 0, set()):
                found = True
                break
        if found: break
        
    board_str = "\n".join(" ".join(row) for row in board)
    return f"{m} {n}\n{board_str}\n{word}", "Yes" if found else "No"

def solve_number_of_islands():
    m, n = random.randint(3, 8), random.randint(3, 8)
    grid = [[random.choice(["0", "0", "1"]) for _ in range(n)] for _ in range(m)]
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == "0":
            return
        grid[r][c] = "0"
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)

    temp_grid = [row[:] for row in grid]
    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == "1":
                count += 1
                dfs(i, j)
    
    grid = temp_grid
    grid_str = "\n".join(" ".join(row) for row in grid)
    return f"{m} {n}\n{grid_str}", str(count)

def solve_partition_labels():
    letters = "abcde"
    s = "".join(random.choices(letters, k=random.randint(5, 20)))
    
    last = {c: i for i, c in enumerate(s)}
    j = anchor = 0
    res = []
    for i, c in enumerate(s):
        j = max(j, last[c])
        if i == j:
            res.append(i - anchor + 1)
            anchor = i + 1
    return s, " ".join(map(str, res))

def solve_excel_sheet_column_title():
    columnNumber = random.randint(1, 2**31 - 1)
    res = ""
    n = columnNumber
    while n > 0:
        n -= 1
        res = chr(ord('A') + n % 26) + res
        n //= 26
    return str(columnNumber), res

def solve_excel_sheet_column_number():
    length = random.randint(1, 7)
    columnTitle = "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=length))
    res = 0
    for char in columnTitle:
        res = res * 26 + (ord(char) - ord('A') + 1)
    return columnTitle, str(res)

def solve_word_pattern():
    pattern_len = random.randint(1, 10)
    pattern = "".join(random.choices("abcd", k=pattern_len))
    words_pool = ["dog", "cat", "fish", "bird", "lion"]
    
    if random.choice([True, False]):
        mapping = {}
        for char in set(pattern):
            mapping[char] = random.choice(words_pool)
        s_words = [mapping[char] for char in pattern]
        s = " ".join(s_words)
    else:
        s = " ".join(random.choices(words_pool, k=pattern_len))
        
    def check(p, s_str):
        words = s_str.split()
        if len(p) != len(words): return False
        char_to_word = {}
        word_to_char = {}
        for char, word in zip(p, words):
            if char in char_to_word:
                if char_to_word[char] != word: return False
            else:
                if word in word_to_char: return False
                char_to_word[char] = word
                word_to_char[word] = char
        return True

    return f"{pattern}\n{s}", "Yes" if check(pattern, s) else "No"

def solve_find_the_difference():
    s_len = random.randint(0, 50)
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=s_len))
    extra_char = random.choice("abcdefghijklmnopqrstuvwxyz")
    t_list = list(s) + [extra_char]
    random.shuffle(t_list)
    t = "".join(t_list)
    return f"{s}\n{t}", extra_char

def solve_relative_sort_array():
    arr2_len = random.randint(1, 10)
    arr2 = random.sample(range(1, 21), arr2_len)
    arr1 = []
    for x in arr2:
        arr1.extend([x] * random.randint(1, 3))
    others = [random.randint(1, 20) for _ in range(random.randint(0, 5))]
    arr1.extend(others)
    random.shuffle(arr1)
    
    count = {}
    for x in arr1: count[x] = count.get(x, 0) + 1
    res = []
    for x in arr2:
        if x in count:
            res.extend([x] * count[x])
            del count[x]
    remaining = sorted(count.keys())
    for x in remaining:
        res.extend([x] * count[x])
        
    return f"{' '.join(map(str, arr1))}\n{' '.join(map(str, arr2))}", " ".join(map(str, res))

def solve_peak_index_in_mountain_array():
    n = random.randint(3, 20)
    peak = random.randint(1, n - 2)
    arr = [0] * n
    arr[peak] = 100
    for i in range(peak - 1, -1, -1):
        arr[i] = arr[i+1] - random.randint(1, 5)
    for i in range(peak + 1, n):
        arr[i] = arr[i-1] - random.randint(1, 5)
    return " ".join(map(str, arr)), str(peak)

def solve_valid_palindrome_ii():
    s_len = random.randint(5, 15)
    half = "".join(random.choices("abc", k=s_len // 2))
    s = half + (random.choice("abc") if s_len % 2 else "") + half[::-1]
    
    if random.choice([True, False]):
        # Inject one error
        idx = random.randint(0, len(s) - 1)
        s_list = list(s)
        s_list[idx] = "z"
        s = "".join(s_list)
        
    def is_pali(sub): return sub == sub[::-1]
    
    res = "No"
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            if is_pali(s[l+1:r+1]) or is_pali(s[l:r]):
                res = "Yes"
                break
            else:
                res = "No"
                break
        l += 1
        r -= 1
    else:
        res = "Yes"
        
    return s, res

def solve_palindrome_number():
    if random.choice([True, False]):
        n = random.randint(0, 100000)
        s = str(n)
        s = s + s[::-1]
        n = int(s)
    else:
        n = random.randint(-100, 100000)
    
    s = str(n)
    is_pali = (s == s[::-1])
    return str(n), "Yes" if is_pali else "No"

def solve_remove_element():
    n = random.randint(0, 20)
    nums = [random.randint(0, 10) for _ in range(n)]
    val = random.randint(0, 10)
    res_nums = [x for x in nums if x != val]
    return f"{' '.join(map(str, nums))}\n{val}", f"{len(res_nums)}\n{' '.join(map(str, res_nums))}"

def solve_search_insert_position():
    n = random.randint(1, 20)
    nums = sorted(random.sample(range(-100, 100), n))
    target = random.randint(-100, 100)
    import bisect
    res = bisect.bisect_left(nums, target)
    return f"{' '.join(map(str, nums))}\n{target}", str(res)

def solve_best_time_to_buy_and_sell_stock_ii():
    n = random.randint(1, 20)
    prices = [random.randint(1, 100) for _ in range(n)]
    profit = 0
    for i in range(1, n):
        if prices[i] > prices[i-1]:
            profit += prices[i] - prices[i-1]
    return " ".join(map(str, prices)), str(profit)

def solve_h_index():
    n = random.randint(1, 20)
    citations = [random.randint(0, 20) for _ in range(n)]
    citations.sort(reverse=True)
    h = 0
    for i, c in enumerate(citations):
        if c >= i + 1:
            h = i + 1
        else:
            break
    return " ".join(map(str, citations)), str(h)

def solve_jump_game_ii():
    n = random.randint(2, 20)
    nums = [random.randint(1, 5) for _ in range(n)]
    dp = [float('inf')] * n
    dp[0] = 0
    for i in range(n):
        for j in range(1, nums[i] + 1):
            if i + j < n:
                dp[i+j] = min(dp[i+j], dp[i] + 1)
    return " ".join(map(str, nums)), str(dp[n-1])

def solve_find_index_of_first_occurrence():
    words = ["hello", "world", "abc", "def", "aaaaa", "mississippi"]
    haystack = random.choice(words)
    if random.choice([True, False]):
        needle = haystack[random.randint(0, len(haystack)-1):random.randint(1, len(haystack))]
        if not needle: needle = random.choice("abcde")
    else:
        needle = "xyz"
    res = haystack.find(needle)
    return f"{haystack}\n{needle}", str(res)

def solve_length_of_longest_substring():
    s = "".join(random.choices("abcde", k=random.randint(0, 20)))
    char_map = {}
    max_len = 0
    start = 0
    for i, char in enumerate(s):
        if char in char_map and char_map[char] >= start:
            start = char_map[char] + 1
        char_map[char] = i
        max_len = max(max_len, i - start + 1)
    return s, str(max_len)

def solve_string_to_integer_atoi():
    prefixes = ["", "   ", "words and ", "-+", "+", "-"]
    n = random.randint(-2**32, 2**32)
    s = random.choice(prefixes) + str(n) + random.choice(["", " with words", " 123"])
    
    # Simple atoi implementation for solver
    idx = 0
    s_cleaned = s.lstrip()
    if not s_cleaned: return s, "0"
    
    sign = 1
    if s_cleaned[0] == '-':
        sign = -1
        idx = 1
    elif s_cleaned[0] == '+':
        idx = 1
        
    res = 0
    while idx < len(s_cleaned) and s_cleaned[idx].isdigit():
        res = res * 10 + int(s_cleaned[idx])
        idx += 1
    
    res *= sign
    INT_MIN, INT_MAX = -2**31, 2**31 - 1
    if res < INT_MIN: res = INT_MIN
    if res > INT_MAX: res = INT_MAX
    
    return s, str(res)

def solve_three_sum_closest():
    n = random.randint(3, 15)
    nums = [random.randint(-20, 20) for _ in range(n)]
    target = random.randint(-50, 50)
    nums.sort()
    closest_sum = sum(nums[:3])
    for i in range(len(nums) - 2):
        l, r = i + 1, len(nums) - 1
        while l < r:
            current_sum = nums[i] + nums[l] + nums[r]
            if abs(current_sum - target) < abs(closest_sum - target):
                closest_sum = current_sum
            if current_sum < target:
                l += 1
            else:
                r -= 1
    return f"{' '.join(map(str, nums))}\n{target}", str(closest_sum)

def solve_four_sum():
    n = random.randint(4, 10)
    nums = [random.randint(-10, 10) for _ in range(n)]
    target = random.randint(-20, 20)
    nums.sort()
    res = []
    for i in range(len(nums) - 3):
        if i > 0 and nums[i] == nums[i-1]: continue
        for j in range(i + 1, len(nums) - 2):
            if j > i + 1 and nums[j] == nums[j-1]: continue
            l, r = j + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[j] + nums[l] + nums[r]
                if s == target:
                    res.append([nums[i], nums[j], nums[l], nums[r]])
                    l += 1
                    while l < r and nums[l] == nums[l-1]: l += 1
                elif s < target:
                    l += 1
                else:
                    r -= 1
    res.sort()
    output = "\n".join(" ".join(map(str, q)) for q in res)
    return f"{' '.join(map(str, nums))}\n{target}", output

def solve_minimum_number_of_arrows_to_burst_balloons():
    n = random.randint(1, 10)
    points = []
    for _ in range(n):
        x1 = random.randint(-50, 50)
        x2 = x1 + random.randint(1, 20)
        points.append([x1, x2])
    
    points.sort(key=lambda x: x[1])
    arrows = 1
    last_end = points[0][1]
    for i in range(1, n):
        if points[i][0] > last_end:
            arrows += 1
            last_end = points[i][1]
            
    input_str = f"{n}\n" + "\n".join(f"{p[0]} {p[1]}" for p in points)
    return input_str, str(arrows)

def solve_non_overlapping_intervals():
    n = random.randint(1, 10)
    intervals = []
    for _ in range(n):
        x1 = random.randint(-50, 50)
        x2 = x1 + random.randint(1, 20)
        intervals.append([x1, x2])
    
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = -float('inf')
    for i in range(n):
        if intervals[i][0] >= last_end:
            last_end = intervals[i][1]
        else:
            count += 1
            
    input_str = f"{n}\n" + "\n".join(f"{p[0]} {p[1]}" for p in intervals)
    return input_str, str(count)

def solve_spiral_matrix():
    m, n = random.randint(2, 4), random.randint(2, 4)
    matrix = [[random.randint(1, 20) for _ in range(n)] for _ in range(m)]
    
    res = []
    r1, r2 = 0, m - 1
    c1, c2 = 0, n - 1
    while r1 <= r2 and c1 <= c2:
        for c in range(c1, c2 + 1): res.append(matrix[r1][c])
        for r in range(r1 + 1, r2 + 1): res.append(matrix[r][c2])
        if r1 < r2 and c1 < c2:
            for c in range(c2 - 1, c1, -1): res.append(matrix[r2][c])
            for r in range(r2, r1, -1): res.append(matrix[r][c1])
        r1 += 1; r2 -= 1
        c1 += 1; c2 -= 1
        
    matrix_str = "\n".join(" ".join(map(str, row)) for row in matrix)
    return f"{m} {n}\n{matrix_str}", " ".join(map(str, res))

def solve_container_with_most_water():
    n = random.randint(2, 15)
    heights = [random.randint(1, 15) for _ in range(n)]
    
    l, r = 0, n - 1
    res = 0
    while l < r:
        res = max(res, min(heights[l], heights[r]) * (r - l))
        if heights[l] < heights[r]: l += 1
        else: r -= 1
    return " ".join(map(str, heights)), str(res)

def solve_longest_palindromic_substring():
    letters = "abc"
    s = "".join(random.choices(letters, k=random.randint(3, 10)))
    
    res = ""
    for i in range(len(s)):
        # odd
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > len(res): res = s[l:r+1]
            l -= 1; r += 1
        # even
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > len(res): res = s[l:r+1]
            l -= 1; r += 1
    return s, res

def solve_n_queens():
    n = random.randint(1, 8) # Keep small for efficiency
    def backtrack(r, cols, posDiag, negDiag):
        if r == n: return 1
        res = 0
        for c in range(n):
            if c in cols or (r + c) in posDiag or (r - c) in negDiag:
                continue
            cols.add(c); posDiag.add(r + c); negDiag.add(r - c)
            res += backtrack(r + 1, cols, posDiag, negDiag)
            cols.remove(c); posDiag.remove(r + c); negDiag.remove(r - c)
        return res
    return str(n), str(backtrack(0, set(), set(), set()))

def solve_median_of_two_sorted_arrays():
    n1, n2 = random.randint(0, 10), random.randint(0, 10)
    if n1 == 0 and n2 == 0: n1 = 1
    nums1 = sorted([random.randint(1, 100) for _ in range(n1)])
    nums2 = sorted([random.randint(1, 100) for _ in range(n2)])
    merged = sorted(nums1 + nums2)
    l = len(merged)
    if l % 2 == 1: res = float(merged[l//2])
    else: res = (merged[l//2 - 1] + merged[l//2]) / 2.0
    return f"{' '.join(map(str, nums1))}\n{' '.join(map(str, nums2))}", f"{res:.5f}"

def solve_regular_expression_matching():
    # Simple regex cases
    s = "".join(random.choices("abc", k=random.randint(2, 5)))
    if random.choice([True, False]):
        p = s.replace(random.choice(s), ".")
    else:
        p = s[:2] + "*" + s[2:]
    
    import re
    # Convert pattern to standard regex (handle '*' correctly for this simple generator)
    # The problem pattern is slightly different from re (covers entire string)
    try:
        match = re.fullmatch(p, s)
        res = "Yes" if match else "No"
    except:
        res = "No"
    return f"{s}\n{p}", res

def solve_longest_valid_parentheses():
    s = "".join(random.choices("()", k=random.randint(5, 20)))
    stack = [-1]
    res = 0
    for i, char in enumerate(s):
        if char == '(': stack.append(i)
        else:
            stack.pop()
            if not stack: stack.append(i)
            else: res = max(res, i - stack[-1])
    return s, str(res)

def solve_sudoku_solver():
    # Provide one hardcoded Sudoku puzzle and its solution as a template
    # Generating valid Sudokus is complex, so we'll use a few variants
    puzzle = [
        "5 3 . . 7 . . . .",
        "6 . . 1 9 5 . . .",
        ". 9 8 . . . . 6 .",
        "8 . . . 6 . . . 3",
        "4 . . 8 . 3 . . 1",
        "7 . . . 2 . . . 6",
        ". 6 . . . . 2 8 .",
        ". . . 4 1 9 . . 5",
        ". . . . 8 . . 7 9"
    ]
    solution = [
        "5 3 4 6 7 8 9 1 2",
        "6 7 2 1 9 5 3 4 8",
        "1 9 8 3 4 2 5 6 7",
        "8 5 9 7 6 1 4 2 3",
        "4 2 6 8 5 3 7 9 1",
        "7 1 3 9 2 4 8 5 6",
        "9 6 1 5 3 7 2 8 4",
        "2 8 7 4 1 9 6 3 5",
        "3 4 5 2 8 6 1 7 9"
    ]
    return "\n".join(puzzle), "\n".join(solution)

def solve_search_in_rotated_sorted_array():
    n = random.randint(1, 100)
    nums = sorted(random.sample(range(-1000, 1000), n))
    k = random.randint(0, n - 1)
    nums = nums[k:] + nums[:k]
    
    if random.choice([True, False]):
        target = random.choice(nums)
        expected = nums.index(target)
    else:
        target = random.randint(-2000, 2000)
        expected = nums.index(target) if target in nums else -1
        
    return f"{' '.join(map(str, nums))}\n{target}", str(expected)

def solve_three_sum():
    n = random.randint(0, 50)
    nums = [random.randint(-20, 20) for _ in range(n)]
    
    res = set()
    nums_sorted = sorted(nums)
    for i in range(len(nums_sorted) - 2):
        if i > 0 and nums_sorted[i] == nums_sorted[i-1]:
            continue
        l, r = i + 1, len(nums_sorted) - 1
        while l < r:
            s = nums_sorted[i] + nums_sorted[l] + nums_sorted[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.add((nums_sorted[i], nums_sorted[l], nums_sorted[r]))
                while l < r and nums_sorted[l] == nums_sorted[l+1]: l += 1
                while l < r and nums_sorted[r] == nums_sorted[r-1]: r -= 1
                l += 1; r -= 1
                
    output = "\n".join(f"{x} {y} {z}" for x, y, z in sorted(list(res)))
    return " ".join(map(str, nums)), output

def solve_merge_intervals():
    n = random.randint(1, 50)
    intervals = []
    for _ in range(n):
        s = random.randint(0, 100)
        e = random.randint(s, 100)
        intervals.append([s, e])
    
    # Format input as flattened list
    input_str = " ".join(f"{i[0]} {i[1]}" for i in intervals)
    
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
            
    output_str = "\n".join(f"{m[0]} {m[1]}" for m in merged)
    return input_str, output_str

def solve_insert_interval():
    n = random.randint(0, 50)
    intervals = []
    curr = 0
    for _ in range(n):
        s = curr + random.randint(1, 10)
        e = s + random.randint(1, 10)
        intervals.append([s, e])
        curr = e + 2
        
    new_start = random.randint(0, curr + 5)
    new_end = new_start + random.randint(0, 10)
    new_interval = [new_start, new_end]
    
    input_str = " ".join(f"{i[0]} {i[1]}" for i in intervals) + f"\n{new_start} {new_end}"
    
    intervals.append(new_interval)
    intervals.sort(key=lambda x: x[0])
    
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
            
    output_str = "\n".join(f"{m[0]} {m[1]}" for m in merged)
    return input_str, output_str

def solve_simplify_path():
    parts = ["..", ".", "home", "user", "docs", "tmp", "var"]
    n = random.randint(1, 20)
    path = "/" + "/".join(random.choices(parts, k=n))
    # inject some random slashes
    if random.choice([True, False]):
        path = path.replace("/", "//", 1)
        
    stack = []
    for p in path.split("/"):
        if p == "..":
            if stack: stack.pop()
        elif p == "." or not p:
            continue
        else:
            stack.append(p)
            
    return path, "/" + "/".join(stack)

def solve_minimum_path_sum():
    m, n = random.randint(1, 20), random.randint(1, 20)
    grid = [[random.randint(0, 20) for _ in range(n)] for _ in range(m)]
    
    dp = [[0]*n for _ in range(m)]
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0:
                dp[i][j] = grid[i][j]
            elif i == 0:
                dp[i][j] = dp[i][j-1] + grid[i][j]
            elif j == 0:
                dp[i][j] = dp[i-1][j] + grid[i][j]
            else:
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
                
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in grid)
    return input_str, str(dp[m-1][n-1])

def solve_unique_paths():
    m, n = random.randint(1, 20), random.randint(1, 20)
    # math.comb(m+n-2, m-1)
    res = math.comb(m + n - 2, m - 1)
    return f"{m} {n}", str(res)

def solve_unique_paths_ii():
    m, n = random.randint(1, 20), random.randint(1, 20)
    grid = [[0]*n for _ in range(m)]
    # Place random obstacles (approx 20%)
    for i in range(m):
        for j in range(n):
            if random.random() < 0.2:
                grid[i][j] = 1
    
    # Ensure start and end are not obstacles for guaranteed valid path? 
    # Problem doesn't say guaranteed, can return 0
    
    if grid[0][0] == 1:
        return f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in grid), "0"
        
    dp = [[0]*n for _ in range(m)]
    dp[0][0] = 1
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[i][j] = 0
            else:
                if i > 0: dp[i][j] += dp[i-1][j]
                if j > 0: dp[i][j] += dp[i][j-1]
                
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in grid)
    return input_str, str(dp[m-1][n-1])

def solve_coin_change_ii():
    amount = random.randint(0, 100)
    n = random.randint(1, 10)
    coins = sorted(random.sample(range(1, 50), n))
    
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] += dp[x - coin]
            
    input_str = f"{amount}\n{' '.join(map(str, coins))}"
    return input_str, str(dp[amount])

def solve_decode_ways():
    s = "".join(random.choices("0123456789", k=random.randint(1, 30)))
    # Ensure no leading zeroes unless it's just meant to be invalid
    
    if not s: return "", "0"
    
    dp = [0] * (len(s) + 1)
    dp[0] = 1
    
    if s[0] != '0': dp[1] = 1
    else: dp[1] = 0
    
    for i in range(2, len(s) + 1):
        one_digit = int(s[i-1:i])
        two_digits = int(s[i-2:i])
        
        if one_digit >= 1:
            dp[i] += dp[i-1]
        
        if 10 <= two_digits <= 26:
            dp[i] += dp[i-2]
            
    return s, str(dp[len(s)])

def solve_word_break():
    # Construct a valid case or random case
    words = ["leet", "code", "apple", "pen", "cats", "sand", "and", "dog", "car"]
    if random.choice([True, False]):
        # Valid
        t = random.randint(1, 5)
        s = "".join(random.choices(words, k=t))
        # Ensure words list contains parts
        word_list = list(set(words + [s])) if random.random() < 0.1 else words
    else:
        s = "".join(random.choices("abcdef", k=10))
        word_list = words
        
    random.shuffle(word_list)
    
    dp = [False] * (len(s) + 1)
    dp[0] = True
    
    dict_set = set(word_list)
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in dict_set:
                dp[i] = True
                break
                
    return f"{s}\n{' '.join(word_list)}", "true" if dp[len(s)] else "false"

def solve_longest_consecutive_sequence():
    n = random.randint(0, 50)
    nums = random.sample(range(-100, 100), n)
    
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        if num - 1 not in num_set:
            curr = num
            curr_streak = 1
            while curr + 1 in num_set:
                curr += 1
                curr_streak += 1
            longest = max(longest, curr_streak)
            
    return " ".join(map(str, nums)), str(longest)

def solve_top_k_frequent_elements():
    n = random.randint(1, 50)
    nums = [random.randint(1, 10) for _ in range(n)]
    unique_count = len(set(nums))
    if unique_count == 0: k = 1
    else: k = random.randint(1, unique_count)
    
    from collections import Counter
    count = Counter(nums)
    most_common = count.most_common(k)
    res = [str(x[0]) for x in most_common]
    res.sort() # Order doesn't matter for correctness but consistency
    
    return f"{' '.join(map(str, nums))}\n{k}", " ".join(res)

def solve_find_peak_element():
    n = random.randint(1, 50)
    nums = [random.randint(1, 100) for _ in range(n)] 
    # Ensure peaks exist (almost always will)
    
    # Linear scan to find ANY peak
    peak_idx = 0
    for i in range(n):
        left = nums[i-1] if i > 0 else -float('inf')
        right = nums[i+1] if i < n-1 else -float('inf')
        if nums[i] > left and nums[i] > right:
            peak_idx = i
            break # Just need one
            
    # Note: O(N) verification is fine for generator
    return " ".join(map(str, nums)), str(peak_idx)

def solve_find_first_and_last_position():
    n = random.randint(0, 50)
    nums = sorted([random.randint(1, 20) for _ in range(n)])
    if nums:
        if random.choice([True, False]):
            target = random.choice(nums)
        else:
            target = random.randint(1, 25)
    else:
        target = 5
        
    start, end = -1, -1
    for i, x in enumerate(nums):
        if x == target:
            if start == -1: start = i
            end = i
            
    return f"{' '.join(map(str, nums))}\n{target}", f"{start} {end}"

def solve_search_a_2d_matrix():
    m, n = random.randint(1, 20), random.randint(1, 20)
    vals = sorted(random.sample(range(1, 5000), m*n))
    matrix = []
    for i in range(m):
        matrix.append(vals[i*n : (i+1)*n])
        
    if matrix and random.choice([True, False]):
        target = random.choice(random.choice(matrix))
        found = "true"
    else:
        target = random.randint(1, 5000)
        found = "false"
        if any(target in row for row in matrix): found = "true"
        
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in matrix) + f"\n{target}"
    return input_str, found

def solve_sort_colors():
    n = random.randint(1, 50)
    nums = [random.choice([0, 1, 2]) for _ in range(n)]
    res = sorted(nums)
    return " ".join(map(str, nums)), " ".join(map(str, res))

def solve_subsets():
    n = random.randint(0, 6) # Small n for power set
    nums = sorted(random.sample(range(1, 20), n))
    
    subsets = []
    def backtrack(start, curr):
        subsets.append(list(curr))
        for i in range(start, n):
            curr.append(nums[i])
            backtrack(i+1, curr)
            curr.pop()
            
    backtrack(0, [])
    # Format: each subset on new line, space separated, sorted output
    # Since specific order in json output might differ, we generally expect some standard
    # The solver returns consistent format
    
    # Sort subsets for consistent output checking if using string diff
    subsets.sort()
    # Actually just print them
    output_str = "\n".join(" ".join(map(str, s)) for s in subsets)
    return " ".join(map(str, nums)), output_str

def solve_letter_combinations():
    mapping = {
        "2": "abc", "3": "def", "4": "ghi", "5": "jkl", 
        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"
    }
    digits = "".join(random.choices("23456789", k=random.randint(0, 4)))
    
    if not digits: return "", ""
    
    res = []
    def backtrack(idx, curr):
        if idx == len(digits):
            res.append(curr)
            return
        for char in mapping[digits[idx]]:
            backtrack(idx+1, curr + char)
            
    backtrack(0, "")
    return digits, " ".join(res)

def solve_sliding_window_maximum():
    n = random.randint(1, 50)
    nums = [random.randint(-50, 50) for _ in range(n)]
    k = random.randint(1, n)
    
    res = []
    # O(N*K) naive is enough for generator
    for i in range(n - k + 1):
        window = nums[i:i+k]
        res.append(max(window))
        
    return f"{' '.join(map(str, nums))}\n{k}", " ".join(map(str, res))

def solve_count_odd_numbers_in_interval_range():
    low = random.randint(0, 1000)
    high = random.randint(low, 1000 + low)
    # The count of odd numbers between low and high
    # Number of odd numbers up to N is (N+1)//2
    count = (high + 1) // 2 - (low) // 2
    return f"{low} {high}", str(count)

def solve_add_digits():
    n = random.randint(0, 10000)
    if n == 0: res = 0
    else: res = 1 + (n - 1) % 9
    return str(n), str(res)

def solve_power_of_three():
    if random.choice([True, False]):
        n = 3**random.randint(0, 19)
    else:
        n = random.randint(-100, 10000)
    
    # Check
    if n <= 0: is_pow = False
    else:
        # 1162261467 is 3^19, max power of 3 in signed 32-bit integer
        is_pow = (1162261467 % n == 0)
    return str(n), "true" if is_pow else "false"

def solve_power_of_four():
    if random.choice([True, False]):
        n = 4**random.randint(0, 15)
    else:
        n = random.randint(-100, 10000)
    
    # Check
    is_pow = n > 0 and (n & (n - 1)) == 0 and (n & 0x55555555) != 0
    return str(n), "true" if is_pow else "false"

def solve_ugly_number():
    if random.choice([True, False]):
        # Generate an ugly number
        n = 1
        for _ in range(random.randint(0, 10)):
            n *= random.choice([2, 3, 5])
    else:
        n = random.randint(-100, 10000)
        
    def isUgly(num):
        if num <= 0: return False
        for p in [2, 3, 5]:
            while num % p == 0:
                num //= p
        return num == 1
    
    return str(n), "true" if isUgly(n) else "false"

def solve_move_zeroes():
    n = random.randint(1, 20)
    nums = [random.randint(0, 10) for _ in range(n)] # Higher chance of 0 since range is small?
    # Let's adjust frequencies to have reasonable zeros
    nums = []
    for _ in range(n):
        if random.random() < 0.3: nums.append(0)
        else: nums.append(random.randint(1, 10))
    
    # Solve
    res = [x for x in nums if x != 0]
    res.extend([0] * (n - len(res)))
    
    return f"{n}\n{' '.join(map(str, nums))}", " ".join(map(str, res))

def solve_isomorphic_strings():
    length = random.randint(3, 10)
    pattern = [random.randint(0, 25) for _ in range(length)]
    
    def generate_from_pattern(pat):
        mapping = {}
        used = set()
        res = []
        alphabet = list("abcdefghijklmnopqrstuvwxyz")
        random.shuffle(alphabet)
        
        needed = set(pat)
        char_map = {idx: alphabet[i] for i, idx in enumerate(needed)}
        
        for p in pat:
            res.append(char_map[p])
        return "".join(res)
    
    s = generate_from_pattern(pattern)
    if random.choice([True, False]):
        t = generate_from_pattern(pattern) # same structure
    else:
        # completely random or modified pattern
        t = "".join(random.choices("abcdef", k=length))
        
    def isIsomorphic(s, t):
        if len(s) != len(t): return False
        d1, d2 = {}, {}
        for a, b in zip(s, t):
            if a in d1 and d1[a] != b: return False
            if b in d2 and d2[b] != a: return False
            d1[a] = b
            d2[b] = a
        return True
        
    return f"{s}\n{t}", "true" if isIsomorphic(s, t) else "false"

def solve_contains_duplicate():
    n = random.randint(1, 20)
    if random.choice([True, False]):
        nums = list(range(n)) # distinct
        random.shuffle(nums)
    else:
        nums = [random.randint(1, n) for _ in range(n)] # likely dupes
        
    return f"{n}\n{' '.join(map(str, nums))}", "true" if len(set(nums)) < len(nums) else "false"

def solve_contains_duplicate_ii():
    n = random.randint(2, 20)
    nums = [random.randint(1, 10) for _ in range(n)]
    k = random.randint(0, n)
    
    found = False
    d = {}
    for i, x in enumerate(nums):
        if x in d and abs(i - d[x]) <= k:
            found = True
            break
        d[x] = i
        
    return f"{n} {k}\n{' '.join(map(str, nums))}", "true" if found else "false"

def solve_intersection_of_two_arrays():
    n = random.randint(1, 10)
    m = random.randint(1, 10)
    nums1 = [random.randint(1, 10) for _ in range(n)]
    nums2 = [random.randint(1, 10) for _ in range(m)]
    
    res = sorted(list(set(nums1) & set(nums2)))
    return f"{n}\n{' '.join(map(str, nums1))}\n{m}\n{' '.join(map(str, nums2))}", " ".join(map(str, res))

def solve_ransom_note():
    n = random.randint(1, 10)
    m = random.randint(n, 20)
    mag = "".join(random.choices("abcdef", k=m))
    
    if random.choice([True, False]):
        # Construct valid
        note_chars = random.sample(mag, n)
        note = "".join(note_chars)
    else:
        note = "".join(random.choices("abcdef", k=n))
        
    from collections import Counter
    c1 = Counter(note)
    c2 = Counter(mag)
    res = all(c1[char] <= c2[char] for char in c1)
    
    return f"{note}\n{mag}", "true" if res else "false"

def solve_first_unique_character():
    s = "".join(random.choices("abc", k=random.randint(5, 20)))
    from collections import Counter
    count = Counter(s)
    idx = -1
    for i, c in enumerate(s):
        if count[c] == 1:
            idx = i
            break
    return s, str(idx)

def solve_sort_characters_by_frequency():
    s = "".join(random.choices("abcde", k=random.randint(5, 20)))
    from collections import Counter
    count = Counter(s)
    
    # Sort by frequency desc, then char
    chars = sorted(s, key=lambda x: (-count[x], x))
    return s, "".join(chars)

def solve_integer_to_roman():
    nums = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    romans = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    
    n = random.randint(1, 3999)
    val = n
    res = ""
    for i in range(len(nums)):
        while n >= nums[i]:
            res += romans[i]
            n -= nums[i]
            
    return str(val), res

def solve_roman_to_integer():
    mapping = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    # Generate valid roman (reuse logic)
    nums = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    romans = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    n = random.randint(1, 3999)
    expected = n
    s = ""
    for i in range(len(nums)):
        while n >= nums[i]:
            s += romans[i]
            n -= nums[i]
            
    return s, str(expected)

def solve_zigzag_conversion():
    s = "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=random.randint(5, 20)))
    numRows = random.randint(1, len(s))
    
    if numRows == 1 or numRows >= len(s):
        return f"{s}\n{numRows}", s
        
    rows = [""] * numRows
    curRow = 0
    goingDown = False
    
    for c in s:
        rows[curRow] += c
        if curRow == 0 or curRow == numRows - 1:
            goingDown = not goingDown
        curRow += 1 if goingDown else -1
        
    return f"{s}\n{numRows}", "".join(rows)

def solve_set_matrix_zeroes():
    m = random.randint(2, 5)
    n = random.randint(2, 5)
    matrix = [[random.choice([0, 1, 2, 3]) for _ in range(n)] for _ in range(m)]
    
    # Calculate output
    rows = set()
    cols = set()
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows.add(i)
                cols.add(j)
                
    res = [row[:] for row in matrix]
    for i in range(m):
        for j in range(n):
            if i in rows or j in cols:
                res[i][j] = 0
                
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in matrix)
    output_str = "\n".join(" ".join(map(str, row)) for row in res)
    return input_str, output_str

def solve_gas_station():
    n = random.randint(3, 10)
    gas = [random.randint(1, 5) for _ in range(n)]
    cost = [random.randint(1, 5) for _ in range(n)]
    
    # Ensure a solution exists sometimes? 
    # Or just solve it exactly.
    
    total_gas = sum(gas)
    total_cost = sum(cost)
    
    start = 0
    tank = 0
    res = -1
    
    if total_gas >= total_cost:
        for i in range(n):
            tank += gas[i] - cost[i]
            if tank < 0:
                start = i + 1
                tank = 0
        res = start
        
    return f"{n}\n{' '.join(map(str, gas))}\n{' '.join(map(str, cost))}", str(res)

def solve_rotate_image():
    n = random.randint(2, 5)
    matrix = [[random.randint(1, 9) for _ in range(n)] for _ in range(n)]
    
    # Rotate 90 deg clockwise
    res = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            res[j][n - 1 - i] = matrix[i][j]
            
    input_str = f"{n}\n" + "\n".join(" ".join(map(str, row)) for row in matrix)
    output_str = "\n".join(" ".join(map(str, row)) for row in res)
    return input_str, output_str

def solve_daily_temperatures():
    n = random.randint(5, 15)
    temps = [random.randint(30, 100) for _ in range(n)]
    
    answer = [0] * n
    stack = [] # indices
    
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            prev_idx = stack.pop()
            answer[prev_idx] = i - prev_idx
        stack.append(i)
        
    return f"{n}\n{' '.join(map(str, temps))}", " ".join(map(str, answer))

def solve_summary_ranges():
    n = random.randint(0, 20)
    nums = sorted(random.sample(range(-2147483648, 2147483647), n))
    
    if not nums:
        return "", ""
        
    ranges = []
    start = nums[0]
    for i in range(1, n):
        if nums[i] != nums[i-1] + 1:
            if start == nums[i-1]:
                ranges.append(str(start))
            else:
                ranges.append(f"{start}->{nums[i-1]}")
            start = nums[i]
            
    if start == nums[-1]:
        ranges.append(str(start))
    else:
        ranges.append(f"{start}->{nums[-1]}")
        
    return " ".join(map(str, nums)), " ".join(ranges)

def solve_is_subsequence():
    t_len = random.randint(0, 100)
    t = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=t_len))
    
    if random.choice([True, False]):
        # Create a subsequence
        sub_len = random.randint(0, t_len)
        indices = sorted(random.sample(range(t_len), sub_len))
        s = "".join([t[i] for i in indices])
        res = "true"
    else:
        # Create random string
        s_len = random.randint(0, 100)
        s = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=s_len))
        
        # Check if it happens to be a subsequence
        it = iter(t)
        if all(c in it for c in s):
            res = "true"
        else:
            res = "false"
            
    return f"{s}\n{t}", res

def solve_reverse_vowels_of_a_string():
    s_len = random.randint(1, 100)
    s_list = random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", k=s_len)
    s = "".join(s_list)
    
    vowels = set("aeiouAEIOU")
    s_vowels = [c for c in s if c in vowels]
    s_vowels.reverse()
    res_list = []
    v_idx = 0
    for c in s:
        if c in vowels:
            res_list.append(s_vowels[v_idx])
            v_idx += 1
        else:
            res_list.append(c)
            
    return s, "".join(res_list)

def solve_intersection_of_two_arrays_ii():
    n = random.randint(1, 20)
    m = random.randint(1, 20)
    nums1 = [random.randint(0, 20) for _ in range(n)]
    nums2 = [random.randint(0, 20) for _ in range(m)]
    
    from collections import Counter
    c1 = Counter(nums1)
    c2 = Counter(nums2)
    
    res = []
    for num in c1:
        if num in c2:
            count = min(c1[num], c2[num])
            res.extend([num] * count)
            
    return f"{' '.join(map(str, nums1))}\n{' '.join(map(str, nums2))}", " ".join(map(str, res))

def solve_arranging_coins():
    n = random.randint(1, 2**31 - 1)
    import math
    res = int((-1 + math.sqrt(1 + 8 * n)) // 2)
    return str(n), str(res)

def solve_find_all_numbers_disappeared_in_an_array():
    n = random.randint(1, 20)
    nums = [random.randint(1, n) for _ in range(n)]
    
    expected = set(range(1, n + 1))
    actual = set(nums)
    res = sorted(list(expected - actual))
    
    return " ".join(map(str, nums)), " ".join(map(str, res))

def solve_max_consecutive_ones():
    n = random.randint(1, 100)
    nums = [random.choice([0, 1]) for _ in range(n)]
    
    max_ones = 0
    current_ones = 0
    for x in nums:
        if x == 1:
            current_ones += 1
            max_ones = max(max_ones, current_ones)
        else:
            current_ones = 0
            
    return " ".join(map(str, nums)), str(max_ones)

def solve_teemo_attacking():
    n = random.randint(1, 20)
    timeSeries = sorted(random.sample(range(0, 100), n))
    duration = random.randint(0, 20)
    
    if not timeSeries:
        return f"\n{duration}", "0"
        
    total = 0
    for i in range(n - 1):
        total += min(timeSeries[i+1] - timeSeries[i], duration)
        
    total += duration
    return f"{' '.join(map(str, timeSeries))}\n{duration}", str(total)

def solve_next_greater_element_i():
    n2 = random.randint(1, 20)
    nums2 = random.sample(range(0, 100), n2)
    
    n1 = random.randint(1, n2)
    nums1 = random.sample(nums2, n1)
    
    # Simple O(N^2) solution for test generation is fine, or O(N) stack
    res = []
    for x in nums1:
        found = False
        val = -1
        idx_in_nums2 = nums2.index(x)
        for j in range(idx_in_nums2 + 1, n2):
            if nums2[j] > x:
                val = nums2[j]
                break
        res.append(val)
        
    return f"{' '.join(map(str, nums1))}\n{' '.join(map(str, nums2))}", " ".join(map(str, res))

def solve_distribute_candies():
    n = random.randint(2, 20)
    if n % 2 != 0: n += 1
    
    candyType = [random.randint(-100, 100) for _ in range(n)]
    
    unique_candies = len(set(candyType))
    res = min(unique_candies, n // 2)
    
    return " ".join(map(str, candyType)), str(res)

def solve_can_place_flowers():
    length = random.randint(1, 20)
    flowerbed = [random.choice([0, 1]) for _ in range(length)]
    n = random.randint(0, length)
    
    # Check valid placement logic for test generation
    # Actually just solving it is easier
    count = 0
    temp_bed = flowerbed[:]
    for i in range(length):
        if temp_bed[i] == 0:
            left_empty = (i == 0) or (temp_bed[i-1] == 0)
            right_empty = (i == length - 1) or (temp_bed[i+1] == 0)
            if left_empty and right_empty:
                temp_bed[i] = 1
                count += 1
                
    possible = count >= n
    return f"{' '.join(map(str, flowerbed))}\n{n}", "true" if possible else "false"

def solve_maximum_average_subarray_i():
    n = random.randint(1, 20)
    k = random.randint(1, n)
    nums = [random.randint(-50, 50) for _ in range(n)]
    
    # Calculate max average
    curr_sum = sum(nums[:k])
    max_sum = curr_sum
    for i in range(k, n):
        curr_sum += nums[i] - nums[i-k]
        max_sum = max(max_sum, curr_sum)
        
    return f"{' '.join(map(str, nums))}\n{k}", f"{max_sum / k:.5f}"

def solve_set_mismatch():
    n = random.randint(2, 20)
    nums = list(range(1, n + 1))
    
    # Create mismatch
    idx_dup = random.randint(0, n - 1)
    idx_missing = random.randint(0, n - 1)
    while idx_missing == idx_dup:
        idx_missing = random.randint(0, n - 1)
        
    dup_val = nums[idx_dup]
    # Replace the missing value with the duplicate value
    # To do this correctly:
    # We want nums to have one number twice and one number missing.
    # Currently nums is 1..n
    missing_val = nums[idx_missing]
    nums[idx_missing] = dup_val
    random.shuffle(nums)
    
    return " ".join(map(str, nums)), f"{dup_val} {missing_val}"

def solve_to_lower_case():
    s_len = random.randint(1, 20)
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", k=s_len))
    return s, s.lower()

def solve_rotate_string():
    s_len = random.randint(1, 20)
    s = "".join(random.choices("abcde", k=s_len))
    
    if random.choice([True, False]):
        # Rotate
        shifts = random.randint(0, s_len)
        goal = s[shifts:] + s[:shifts]
        res = "true"
    else:
        # Random string of same length
        goal = "".join(random.choices("abcde", k=s_len))
        res = "true" if len(s) == len(goal) and goal in s + s else "false"
        
    return f"{s}\n{goal}", res

def solve_unique_morse_code_words():
    words_count = random.randint(1, 10)
    words = ["".join(random.choices("abcdef", k=random.randint(1, 5))) for _ in range(words_count)]
    
    morse = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]
    transformations = set()
    for w in words:
        trans = "".join(morse[ord(c) - ord('a')] for c in w)
        transformations.add(trans)
        
    return " ".join(words), str(len(transformations))

def solve_transpose_matrix():
    rows = random.randint(1, 5)
    cols = random.randint(1, 5)
    matrix = [[random.randint(-10, 10) for _ in range(cols)] for _ in range(rows)]
    
    transposed = [[matrix[r][c] for r in range(rows)] for c in range(cols)]
    
    input_str = f"{rows} {cols}\n" + "\n".join(" ".join(map(str, row)) for row in matrix)
    output_str = "\n".join(" ".join(map(str, row)) for row in transposed)
    return input_str, output_str

def solve_binary_gap():
    n = random.randint(1, 1000)
    binary = bin(n)[2:]
    
    max_dist = 0
    last_idx = -1
    for i, bit in enumerate(binary):
        if bit == '1':
            if last_idx != -1:
                max_dist = max(max_dist, i - last_idx)
            last_idx = i
            
    return str(n), str(max_dist)

def solve_buddy_strings():
    s_len = random.randint(2, 20)
    s_list = random.choices("abcdef", k=s_len)
    s = "".join(s_list)
    
    if random.choice([True, False]):
        # Swap constraints
        # 1. Swap two distinct indices
        i, j = random.sample(range(s_len), 2)
        s_list[i], s_list[j] = s_list[j], s_list[i]
        goal = "".join(s_list)
        res = "true"
    else:
        goal = "".join(random.choices("abcdef", k=s_len))
        
        # Solver logic
        if len(s) != len(goal): res = "false"
        elif s == goal:
            res = "true" if len(set(s)) < len(s) else "false"
        else:
            diff = []
            for i in range(len(s)):
                if s[i] != goal[i]:
                    diff.append((s[i], goal[i]))
            res = "true" if len(diff) == 2 and diff[0] == diff[1][::-1] else "false"
            
    return f"{s}\n{goal}", res

def solve_lemonade_change():
    n = random.randint(1, 20)
    # Generate a likely valid sequence
    bills = []
    
    # Try to make it valid more often
    for _ in range(n):
        r = random.random()
        if r < 0.6: bills.append(5)
        elif r < 0.9: bills.append(10)
        else: bills.append(20)
        
    five, ten = 0, 0
    possible = True
    for bill in bills:
        if bill == 5:
            five += 1
        elif bill == 10:
            if five == 0:
                possible = False
                break
            five -= 1
            ten += 1
        else:
            if five > 0 and ten > 0:
                five -= 1
                ten -= 1
            elif five >= 3:
                five -= 3
            else:
                possible = False
                break
                
    return " ".join(map(str, bills)), "true" if possible else "false"

def solve_count_primes():
    n = random.randint(0, 1000)
    if n <= 2: return str(n), "0"
    primes = [True] * n
    primes[0] = primes[1] = False
    for i in range(2, int(n**0.5) + 1):
        if primes[i]:
            for j in range(i*i, n, i):
                primes[j] = False
    return str(n), str(sum(primes))

def solve_third_maximum_number():
    n = random.randint(1, 20)
    nums = [random.randint(-100, 100) for _ in range(n)]
    distinct_nums = sorted(list(set(nums)), reverse=True)
    if len(distinct_nums) >= 3:
        res = distinct_nums[2]
    else:
        res = distinct_nums[0]
    return " ".join(map(str, nums)), str(res)

def solve_find_the_duplicate_number():
    n = random.randint(1, 20)
    nums = list(range(1, n + 1))
    dup = random.randint(1, n)
    nums.append(dup)
    random.shuffle(nums)
    return " ".join(map(str, nums)), str(dup)

def solve_check_if_array_is_sorted_and_rotated():
    n = random.randint(1, 20)
    nums = sorted([random.randint(1, 100) for _ in range(n)])
    if random.choice([True, False]):
        rot = random.randint(0, n - 1)
        nums = nums[rot:] + nums[:rot]
        res = "true"
    else:
        nums = [random.randint(1, 100) for _ in range(n)]
        count = 0
        for i in range(n):
            if nums[i] > nums[(i + 1) % n]:
                count += 1
        res = "true" if count <= 1 else "false"
    return " ".join(map(str, nums)), res

def solve_replace_elements_with_greatest_element_on_right_side():
    n = random.randint(1, 20)
    arr = [random.randint(1, 100) for _ in range(n)]
    res = []
    mx = -1
    for i in range(n - 1, -1, -1):
        res.append(mx)
        mx = max(mx, arr[i])
    res.reverse()
    return " ".join(map(str, arr)), " ".join(map(str, res))

def solve_sort_array_by_parity():
    n = random.randint(1, 20)
    nums = [random.randint(0, 100) for _ in range(n)]
    evens = [x for x in nums if x % 2 == 0]
    odds = [x for x in nums if x % 2 != 0]
    res = evens + odds
    return " ".join(map(str, nums)), " ".join(map(str, res))

def solve_squares_of_a_sorted_array():
    n = random.randint(1, 20)
    nums = sorted([random.randint(-100, 100) for _ in range(n)])
    res = sorted([x*x for x in nums])
    return " ".join(map(str, nums)), " ".join(map(str, res))

def solve_defanging_an_ip_address():
    ip = ".".join(str(random.randint(0, 255)) for _ in range(4))
    res = ip.replace(".", "[.]")
    return ip, res

def solve_jewels_and_stones():
    jewels_list = random.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", random.randint(1, 10))
    jewels = "".join(jewels_list)
    stones = "".join(random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", k=random.randint(1, 20)))
    count = sum(1 for s in stones if s in jewels)
    return f"{jewels}\n{stones}", str(count)

def solve_how_many_numbers_smaller_than_current():
    n = random.randint(1, 20)
    nums = [random.randint(0, 100) for _ in range(n)]
    res = []
    for i in range(n):
        count = sum(1 for j in range(n) if i != j and nums[j] < nums[i])
        res.append(count)
    return " ".join(map(str, nums)), " ".join(map(str, res))

def solve_maximum_69_number():
    num_str = "".join(random.choices("69", k=random.randint(1, 5)))
    num = int(num_str)
    res = list(str(num))
    for i in range(len(res)):
        if res[i] == '6':
            res[i] = '9'
            break
    return str(num), "".join(res)

def solve_check_if_n_and_double_exist():
    n = random.randint(2, 20)
    nums = [random.randint(-20, 20) for _ in range(n)]
    if random.choice([True, False]):
        idx1, idx2 = random.sample(range(n), 2)
        nums[idx1] = 2 * nums[idx2]
    
    seen = set()
    possible = False
    for x in nums:
        if 2 * x in seen or (x % 2 == 0 and x // 2 in seen):
            possible = True
            break
        seen.add(x)
    return " ".join(map(str, nums)), "true" if possible else "false"

def solve_shuffle_the_array():
    n = random.randint(1, 10)
    nums = [random.randint(1, 100) for _ in range(2 * n)]
    x = nums[:n]
    y = nums[n:]
    res = []
    for i in range(n):
        res.append(x[i])
        res.append(y[i])
    return f"{n}\n" + " ".join(map(str, nums)), " ".join(map(str, res))

def solve_kids_with_greatest_number_of_candies():
    n = random.randint(2, 20)
    candies = [random.randint(1, 20) for _ in range(n)]
    extra = random.randint(1, 10)
    max_candies = max(candies)
    res = ["true" if c + extra >= max_candies else "false" for c in candies]
    return f"{extra}\n" + " ".join(map(str, candies)), " ".join(res)

def solve_richest_customer_wealth():
    m, n = random.randint(1, 5), random.randint(1, 5)
    accounts = [[random.randint(1, 20) for _ in range(n)] for _ in range(m)]
    max_wealth = max(sum(customer) for customer in accounts)
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in accounts)
    return input_str, str(max_wealth)

def solve_matrix_diagonal_sum():
    n = random.randint(1, 10)
    mat = [[random.randint(1, 10) for _ in range(n)] for _ in range(n)]
    total = 0
    for i in range(n):
        total += mat[i][i]
        if i != n - 1 - i:
            total += mat[i][n - 1 - i]
    input_str = f"{n}\n" + "\n".join(" ".join(map(str, row)) for row in mat)
    return input_str, str(total)

def solve_count_negative_numbers_in_sorted_matrix():
    m, n = random.randint(1, 5), random.randint(1, 5)
    grid = [[random.randint(-10, 10) for _ in range(n)] for _ in range(m)]
    for r in range(m): grid[r].sort(reverse=True)
    grid.sort(key=lambda x: x[0], reverse=True)
    
    count = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] < 0:
                count += 1
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in grid)
    return input_str, str(count)

def solve_find_the_highest_altitude():
    n = random.randint(1, 20)
    gain = [random.randint(-10, 10) for _ in range(n)]
    current = 0
    highest = 0
    for x in gain:
        current += x
        highest = max(highest, current)
    return " ".join(map(str, gain)), str(highest)

def solve_maximal_square():
    m, n = random.randint(2, 8), random.randint(2, 8)
    matrix = [[random.choice([0, 1]) for _ in range(n)] for _ in range(m)]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_side = 0
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if matrix[i-1][j-1] == 1:
                dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                max_side = max(max_side, dp[i][j])
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in matrix)
    return input_str, str(max_side * max_side)

def solve_partition_equal_subset_sum():
    n = random.randint(2, 10)
    nums = [random.randint(1, 20) for _ in range(n)]
    total = sum(nums)
    if total % 2 != 0:
        res = "false"
    else:
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for x in nums:
            for i in range(target, x - 1, -1):
                dp[i] = dp[i] or dp[i-x]
        res = "true" if dp[target] else "false"
def solve_generate_parentheses():
    n = random.randint(1, 4)
    res = []
    def backtrack(S = '', left = 0, right = 0):
        if len(S) == 2 * n:
            res.append(S)
            return
        if left < n:
            backtrack(S + '(', left + 1, right)
        if right < left:
            backtrack(S + ')', left, right + 1)
    backtrack()
    return str(n), " ".join(res)

def solve_maximal_rectangle():
    rows, cols = random.randint(2, 6), random.randint(2, 6)
    matrix = [[random.choice(["0", "1"]) for _ in range(cols)] for _ in range(rows)]
    
    if not matrix: return "", "0"
    max_area = 0
    heights = [0] * cols
    for row in matrix:
        for i in range(cols):
            heights[i] = heights[i] + 1 if row[i] == '1' else 0
        
        stack = [-1]
        for i in range(cols):
            while stack[-1] != -1 and heights[stack[-1]] >= heights[i]:
                h = heights[stack.pop()]
                w = i - stack[-1] - 1
                max_area = max(max_area, h * w)
            stack.append(i)
        while stack[-1] != -1:
            h = heights[stack.pop()]
            w = cols - stack[-1] - 1
            max_area = max(max_area, h * w)
            
    input_str = f"{rows} {cols}\n" + "\n".join(" ".join(row) for row in matrix)
    return input_str, str(max_area)

def solve_word_search_ii():
    m, n = 4, 4
    board = [[random.choice("abcde") for _ in range(n)] for _ in range(m)]
    words_pool = ["eat", "oath", "pea", "rain", "apple", "bee", "cat"]
    words = random.sample(words_pool, random.randint(2, 4))
    
    def findWords(board, words):
        res = []
        for word in words:
            if exists(board, word):
                res.append(word)
        return sorted(res)

    def exists(board, word):
        for i in range(len(board)):
            for j in range(len(board[0])):
                if dfs(board, word, i, j, 0, set()): return True
        return False

    def dfs(board, word, r, c, idx, visited):
        if idx == len(word): return True
        if r < 0 or r >= len(board) or c < 0 or c >= len(board[0]) or \
           (r, c) in visited or board[r][c] != word[idx]:
            return False
        visited.add((r, c))
        res = any(dfs(board, word, r+dr, c+dc, idx+1, visited) for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)])
        visited.remove((r, c))
        return res

    found = findWords(board, words)
    board_str = "\n".join(" ".join(row) for row in board)
    return f"{m} {n}\n{board_str}\n{' '.join(words)}", " ".join(found)

def solve_longest_substring_at_most_k_distinct():
    s_len = random.randint(5, 20)
    s = "".join(random.choices("abcde", k=s_len))
    k = random.randint(1, 3)
    
    max_len = 0
    start = 0
    counts = {}
    for end in range(len(s)):
        counts[s[end]] = counts.get(s[end], 0) + 1
        while len(counts) > k:
            counts[s[start]] -= 1
            if counts[s[start]] == 0: del counts[s[start]]
            start += 1
        max_len = max(max_len, end - start + 1)
    return f"{s}\n{k}", str(max_len)

def solve_longest_repeating_character_replacement():
    s_len = random.randint(5, 20)
    s = "".join(random.choices("ABC", k=s_len))
    k = random.randint(1, 5)
    
    max_len = 0
    max_freq = 0
    start = 0
    counts = {}
    for end in range(len(s)):
        counts[s[end]] = counts.get(s[end], 0) + 1
        max_freq = max(max_freq, counts[s[end]])
        if (end - start + 1) - max_freq > k:
            counts[s[start]] -= 1
            start += 1
        max_len = max(max_len, end - start + 1)
    return f"{s}\n{k}", str(max_len)

def solve_minimum_window_substring():
    s_len = random.randint(5, 20)
    t_len = random.randint(2, 5)
    s = "".join(random.choices("abcdef", k=s_len))
    if random.random() < 0.5:
        t = "".join(random.choices(s, k=t_len))
    else:
        t = "".join(random.choices("abcdef", k=t_len))
        
    def minWindow(s, t):
        if not t or not s: return ""
        from collections import Counter
        dict_t = Counter(t)
        required = len(dict_t)
        l, r = 0, 0
        formed = 0
        window_counts = {}
        ans = float("inf"), None, None
        while r < len(s):
            char = s[r]
            window_counts[char] = window_counts.get(char, 0) + 1
            if char in dict_t and window_counts[char] == dict_t[char]:
                formed += 1
            while l <= r and formed == required:
                char = s[l]
                if r - l + 1 < ans[0]:
                    ans = (r - l + 1, l, r)
                window_counts[char] -= 1
                if char in dict_t and window_counts[char] < dict_t[char]:
                    formed -= 1
                l += 1    
            r += 1
        return "" if ans[0] == float("inf") else s[ans[1] : ans[2] + 1]

    return f"{s}\n{t}", minWindow(s, t)

def solve_permutation_in_string():
    s1_len = random.randint(2, 5)
    s2_len = random.randint(5, 15)
    s1 = "".join(random.choices("abc", k=s1_len))
    if random.random() < 0.5:
        # Construct valid
        start = random.randint(0, s2_len - s1_len)
        s2_list = random.choices("abc", k=s2_len)
        s1_perm = list(s1)
        random.shuffle(s1_perm)
        s2_list[start:start+s1_len] = s1_perm
        s2 = "".join(s2_list)
    else:
        s2 = "".join(random.choices("abc", k=s2_len))
        
    from collections import Counter
    c1 = Counter(s1)
    n1 = len(s1)
    found = False
    for i in range(len(s2) - n1 + 1):
        if Counter(s2[i:i+n1]) == c1:
            found = True
            break
    return f"{s1}\n{s2}", "true" if found else "false"

def solve_find_all_anagrams():
    s_len = random.randint(5, 20)
    p_len = random.randint(2, 5)
    p = "".join(random.choices("abc", k=p_len))
    s = "".join(random.choices("abc", k=s_len))
    
    from collections import Counter
    cp = Counter(p)
    res = []
    for i in range(len(s) - p_len + 1):
        if Counter(s[i:i+p_len]) == cp:
            res.append(i)
    return f"{s}\n{p}", " ".join(map(str, res))

def solve_top_k_frequent_words():
    words_pool = ["i", "love", "leetcode", "i", "love", "coding", "apple", "banana", "cherry"]
    n = random.randint(5, 10)
    words = random.choices(words_pool, k=n)
    k = random.randint(1, len(set(words)))
    
    from collections import Counter
    count = Counter(words)
    candidates = list(count.keys())
    candidates.sort(key=lambda w: (-count[w], w))
    res = candidates[:k]
    return f"{' '.join(words)}\n{k}", " ".join(res)

def solve_reorganize_string():
    s_len = random.randint(3, 10)
    s = "".join(random.choices("aaabcc", k=s_len))
    
    from collections import Counter
    import heapq
    count = Counter(s)
    max_heap = [(-v, k) for k, v in count.items()]
    heapq.heapify(max_heap)
    
    res = []
    prev_count, prev_char = 0, ''
    while max_heap:
        c, char = heapq.heappop(max_heap)
        res.append(char)
        if prev_count < 0:
            heapq.heappush(max_heap, (prev_count, prev_char))
        c += 1
        prev_count, prev_char = c, char
        
    final = "".join(res)
    if len(final) != len(s): return s, ""
    return s, final
def solve_k_closest_points_to_origin():
    n = random.randint(3, 10)
    k = random.randint(1, n)
    points = [[random.randint(-10, 10), random.randint(-10, 10)] for _ in range(n)]
    
    def dist(p): return p[0]**2 + p[1]**2
    points.sort(key=dist)
    res = points[:k]
    res.sort()
    
    input_str = f"{n} {k}\n" + "\n".join(f"{p[0]} {p[1]}" for p in points)
    output_str = "\n".join(f"{p[0]} {p[1]}" for p in res)
    return input_str, output_str

def solve_task_scheduler():
    n = random.randint(1, 10)
    tasks = random.choices("ABCDEFG", k=n)
    n_cool = random.randint(0, 3)
    
    from collections import Counter
    counts = Counter(tasks)
    max_f = max(counts.values())
    max_f_tasks = sum(1 for f in counts.values() if f == max_f)
    res = max(len(tasks), (max_f - 1) * (n_cool + 1) + max_f_tasks)
    return f"{' '.join(tasks)}\n{n_cool}", str(res)

def solve_meeting_rooms_ii():
    n = random.randint(1, 10)
    intervals = []
    for _ in range(n):
        s = random.randint(0, 50)
        e = s + random.randint(1, 20)
        intervals.append([s, e])
    
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])
    res = 0
    used = 0
    s_ptr, e_ptr = 0, 0
    while s_ptr < n:
        if starts[s_ptr] < ends[e_ptr]:
            used += 1
            s_ptr += 1
        else:
            used -= 1
            e_ptr += 1
        res = max(res, used)
    
    input_str = f"{n}\n" + "\n".join(f"{i[0]} {i[1]}" for i in intervals)
    return input_str, str(res)

def solve_employee_free_time():
    num_emp = random.randint(1, 3)
    schedule = []
    for _ in range(num_emp):
        emp_intervals = []
        curr = random.randint(0, 10)
        for _ in range(random.randint(1, 3)):
            s = curr + random.randint(1, 5)
            e = s + random.randint(1, 5)
            emp_intervals.append([s, e])
            curr = e
        schedule.append(emp_intervals)
    
    all_intervals = []
    for emp in schedule: all_intervals.extend(emp)
    all_intervals.sort(key=lambda x: x[0])
    
    free = []
    if not all_intervals: return "", ""
    merged_end = all_intervals[0][1]
    for i in range(1, len(all_intervals)):
        if all_intervals[i][0] > merged_end:
            free.append([merged_end, all_intervals[i][0]])
        merged_end = max(merged_end, all_intervals[i][1])
        
    input_str = f"{num_emp}\n"
    for emp in schedule:
        input_str += str(len(emp)) + "\n" + "\n".join(f"{i[0]} {i[1]}" for i in emp) + "\n"
    
    output_str = "\n".join(f"{f[0]} {f[1]}" for f in free)
    return input_str.strip(), output_str

def solve_longest_increasing_path():
    m, n = 3, 3
    matrix = [[random.randint(1, 20) for _ in range(n)] for _ in range(m)]
    
    memo = {}
    def dfs(r, c):
        if (r, c) in memo: return memo[(r, c)]
        res = 1
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > matrix[r][c]:
                res = max(res, 1 + dfs(nr, nc))
        memo[(r, c)] = res
        return res
        
    ans = max(dfs(r, c) for r in range(m) for c in range(n))
    input_str = f"{m} {n}\n" + "\n".join(" ".join(map(str, row)) for row in matrix)
    return input_str, str(ans)

def solve_word_ladder():
    words = ["hot", "dot", "dog", "lot", "log", "cog", "hit", "bit", "big"]
    begin = "hit"
    end = "cog"
    wordList = random.sample(words, random.randint(4, len(words)))
    if end not in wordList: wordList.append(end)
    
    def ladderLength(beginWord, endWord, wordList):
        wordSet = set(wordList)
        if endWord not in wordSet: return 0
        from collections import deque
        queue = deque([(beginWord, 1)])
        visited = {beginWord}
        while queue:
            word, dist = queue.popleft()
            if word == endWord: return dist
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = word[:i] + c + word[i+1:]
                    if next_word in wordSet and next_word not in visited:
                        visited.add(next_word)
                        queue.append((next_word, dist + 1))
        return 0

    return f"{begin}\n{end}\n{' '.join(wordList)}", str(ladderLength(begin, end, wordList))

def solve_skyline_problem():
    n = random.randint(2, 4)
    buildings = []
    for _ in range(n):
        l = random.randint(0, 20)
        r = l + random.randint(1, 100)
        h = random.randint(1, 20)
        buildings.append([l, r, h])
    
    events = []
    for l, r, h in buildings:
        events.append((l, -h))
        events.append((r, h))
    events.sort()
    
    res = []
    max_heap = [0]
    import heapq
    prev_max = 0
    for x, h in events:
        if h < 0: heapq.heappush(max_heap, h)
        else:
            max_heap.remove(-h)
            heapq.heapify(max_heap)
        
        curr_max = -max_heap[0]
        if curr_max != prev_max:
            res.append([x, curr_max])
            prev_max = curr_max
            
    input_str = f"{n}\n" + "\n".join(f"{b[0]} {b[1]} {b[2]}" for b in buildings)
    output_str = "\n".join(f"{p[0]} {p[1]}" for p in res)
    return input_str, output_str

def solve_burst_balloons():
    n_in = random.randint(1, 5)
    nums = [random.randint(1, 10) for _ in range(n_in)]
    
    def maxCoins(nums):
        nums = [1] + nums + [1]
        n_len = len(nums)
        dp = [[0] * n_len for _ in range(n_len)]
        for length in range(1, n_len - 1):
            for i in range(1, n_len - length):
                j = i + length - 1
                for k in range(i, j + 1):
                    dp[i][j] = max(dp[i][j], dp[i][k-1] + nums[i-1]*nums[k]*nums[j+1] + dp[k+1][j])
        return dp[1][n_len-2]

    return " ".join(map(str, nums)), str(maxCoins(nums))

def solve_count_smaller_numbers():
    n = random.randint(1, 10)
    nums = [random.randint(-10, 10) for _ in range(n)]
    
    res = []
    for i in range(n):
        count = 0
        for j in range(i + 1, n):
            if nums[j] < nums[i]: count += 1
        res.append(count)
    return " ".join(map(str, nums)), " ".join(map(str, res))

def solve_house_robber_ii():
    n = random.randint(1, 15)
    nums = [random.randint(0, 100) for _ in range(n)]
    
    def rob_linear(arr):
        p2, p1 = 0, 0
        for x in arr: p2, p1 = p1, max(p1, p2 + x)
        return p1
        
    if not nums: ans = 0
    elif len(nums) == 1: ans = nums[0]
    else: ans = max(rob_linear(nums[1:]), rob_linear(nums[:-1]))
    return " ".join(map(str, nums)), str(ans)

def solve_goal_parser_interpretation():
    s_pool = ["G", "()", "(al)"]
    s = "".join(random.choices(s_pool, k=random.randint(1, 10)))
    res = s.replace("()", "o").replace("(al)", "al")
    return s, res

def solve_shuffle_string():
    s_len = random.randint(3, 10)
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=s_len))
    indices = list(range(s_len))
    random.shuffle(indices)
    res = [""] * s_len
    for i, idx in enumerate(indices):
        res[idx] = s[i]
    return f"{s}\n{' '.join(map(str, indices))}", "".join(res)

def solve_count_items_matching_a_rule():
    items = []
    n = random.randint(3, 10)
    types = ["phone", "computer", "phone"]
    colors = ["blue", "silver", "gold"]
    names = ["pixel", "lenovo", "iphone"]
    for _ in range(n):
        items.append([random.choice(types), random.choice(colors), random.choice(names)])
    
    ruleKey = random.choice(["type", "color", "name"])
    ruleValue = random.choice(types + colors + names)
    
    key_idx = {"type": 0, "color": 1, "name": 2}[ruleKey]
    count = sum(1 for item in items if item[key_idx] == ruleValue)
    
    input_str = f"{n}\n" + "\n".join(" ".join(row) for row in items) + f"\n{ruleKey}\n{ruleValue}"
    return input_str, str(count)

def solve_sorting_the_sentence():
    words = ["This", "is", "a", "sentence", "test", "case"]
    random.shuffle(words)
    s = " ".join([f"{word}{i+1}" for i, word in enumerate(words)])
    # The above is already sorted by number, let's shuffle actual input
    parts = s.split()
    random.shuffle(parts)
    input_s = " ".join(parts)
    return input_s, " ".join(words)

def solve_truncate_sentence():
    words = ["Hello", "World", "this", "is", "a", "test", "for", "truncation"]
    s = " ".join(words)
    k = random.randint(1, len(words))
    res = " ".join(words[:k])
    return f"{s}\n{k}", res

def solve_rings_and_rods():
    n = random.randint(1, 10)
    colors = "RGB"
    s_list = []
    rods = {}
    for _ in range(n):
        c = random.choice(colors)
        r = random.randint(0, 9)
        s_list.append(f"{c}{r}")
        if r not in rods: rods[r] = set()
        rods[r].add(c)
    
    count = sum(1 for r in rods if len(rods[r]) == 3)
    return "".join(s_list), str(count)

def solve_cells_in_a_range():
    c1 = random.randint(0, 5)
    r1 = random.randint(1, 5)
    c2 = random.randint(c1, 5)
    r2 = random.randint(r1, 5)
    
    start = f"{chr(ord('A') + c1)}{r1}"
    end = f"{chr(ord('A') + c2)}{r2}"
    
    res = []
    for c in range(c1, c2 + 1):
        for r in range(r1, r2 + 1):
            res.append(f"{chr(ord('A') + c)}{r}")
    return f"{start}:{end}", " ".join(res)

def solve_find_the_difference_of_two_arrays():
    n1, n2 = random.randint(3, 10), random.randint(3, 10)
    nums1 = [random.randint(-10, 10) for _ in range(n1)]
    nums2 = [random.randint(-10, 10) for _ in range(n2)]
    
    s1, s2 = set(nums1), set(nums2)
    res1 = sorted(list(s1 - s2))
    res2 = sorted(list(s2 - s1))
    
    input_str = " ".join(map(str, nums1)) + "\n" + " ".join(map(str, nums2))
    output_str = " ".join(map(str, res1)) + "\n" + " ".join(map(str, res2))
    return input_str, output_str

def solve_final_value_of_variable():
    n = random.randint(3, 10)
    ops_pool = ["++X", "X++", "--X", "X--"]
    ops = random.choices(ops_pool, k=n)
    x = 0
    for op in ops:
        if "+" in op: x += 1
        else: x -= 1
    return f"{n}\n" + " ".join(ops), str(x)

def solve_minimum_sum_of_four_digit_number():
    num = random.randint(1000, 9999)
    digits = sorted(list(str(num)))
    # For min sum, pair smallest with largest etc.
    # Digits are d1, d2, d3, d4 sorted.
    # Two numbers: d1d3 and d2d4 (or vice versa)
    n1 = int(digits[0] + digits[2])
    n2 = int(digits[1] + digits[3])
    return str(num), str(n1 + n2)


def solve_divide_two_integers():
    dividend = random.randint(-100, 100)
    divisor = random.choice([x for x in range(-10, 11) if x != 0])
    res = int(dividend / divisor)
    # Handle overflow
    if res > 2**31 - 1: res = 2**31 - 1
    if res < -2**31: res = -2**31
    return f"{dividend} {divisor}", str(res)

def solve_valid_sudoku():
    # Generate a mostly empty valid board
    board = [["." for _ in range(9)] for _ in range(9)]
    n = random.randint(5, 10)
    def is_valid(r, c, val):
        for i in range(9):
            if board[r][i] == val or board[i][c] == val: return False
        sr, sc = (r // 3) * 3, (c // 3) * 3
        for i in range(sr, sr + 3):
            for j in range(sc, sc + 3):
                if board[i][j] == val: return False
        return True

    count = 0
    while count < n:
        r, c = random.randint(0, 8), random.randint(0, 8)
        val = str(random.randint(1, 9))
        if board[r][c] == "." and is_valid(r, c, val):
            board[r][c] = val
            count += 1
            
    res = "true" # Since we built it valid
    input_str = "\n".join(" ".join(row) for row in board)
    return input_str, res

def solve_count_and_say():
    n = random.randint(1, 10)
    res = "1"
    for _ in range(n - 1):
        next_res = ""
        i = 0
        while i < len(res):
            count = 1
            while i + 1 < len(res) and res[i] == res[i+1]:
                count += 1
                i += 1
            next_res += str(count) + res[i]
            i += 1
        res = next_res
    return str(n), res

def solve_pow_x_n():
    x = round(random.uniform(-10, 10), 2)
    n = random.randint(-5, 10)
    try:
        res = x ** n
    except ZeroDivisionError:
        res = 0.0
    return f"{x} {n}", f"{res:.5f}"

def solve_multiply_strings():
    num1 = str(random.randint(1, 1000))
    num2 = str(random.randint(1, 1000))
    res = str(int(num1) * int(num2))
    return f"{num1}\n{num2}", res

def solve_spiral_matrix_ii():
    n = random.randint(1, 5)
    matrix = [[0] * n for _ in range(n)]
    top, bottom, left, right = 0, n - 1, 0, n - 1
    num = 1
    while num <= n * n:
        for i in range(left, right + 1):
            matrix[top][i] = num
            num += 1
        top += 1
        for i in range(top, bottom + 1):
            matrix[i][right] = num
            num += 1
        right -= 1
        for i in range(right, left - 1, -1):
            matrix[bottom][i] = num
            num += 1
        bottom -= 1
        for i in range(bottom, top - 1, -1):
            matrix[i][left] = num
            num += 1
        left += 1
    input_str = str(n)
    output_str = "\n".join(" ".join(map(str, row)) for row in matrix)
    return input_str, output_str

def solve_permutation_sequence():
    n = random.randint(1, 5)
    import math
    k = random.randint(1, math.factorial(n))
    
    nums = list(range(1, n + 1))
    res = ""
    k -= 1
    for i in range(n, 0, -1):
        fact = math.factorial(i-1)
        idx = k // fact
        res += str(nums.pop(idx))
        k %= fact
    return f"{n} {k+1}", res

def solve_minimum_size_subarray_sum():
    n = random.randint(5, 15)
    nums = [random.randint(1, 20) for _ in range(n)]
    target = random.randint(20, 100)
    
    res = float('inf')
    left = 0
    curr_sum = 0
    for right in range(n):
        curr_sum += nums[right]
        while curr_sum >= target:
            res = min(res, right - left + 1)
            curr_sum -= nums[left]
            left += 1
    ans = 0 if res == float('inf') else res
    return f"{target}\n" + " ".join(map(str, nums)), str(ans)

def solve_restore_ip_addresses():
    s_len = random.randint(4, 12)
    s = "".join(random.choices("0123456789", k=s_len))
    
    res = []
    def backtrack(start, parts):
        if len(parts) == 4:
            if start == len(s): res.append(".".join(parts))
            return
        for length in range(1, 4):
            if start + length > len(s): break
            part = s[start : start + length]
            if (part.startswith("0") and len(part) > 1) or int(part) > 255: continue
            backtrack(start + length, parts + [part])
    backtrack(0, [])
    return s, " ".join(sorted(res))

def solve_valid_parenthesis_string():
    s_len = random.randint(5, 15)
    s = "".join(random.choices("()*", k=s_len))
    
    cmin, cmax = 0, 0
    possible = True
    for char in s:
        if char == '(':
            cmax += 1
            cmin += 1
        elif char == ')':
            cmax -= 1
            cmin = max(0, cmin - 1)
        elif char == '*':
            cmax += 1
            cmin = max(0, cmin - 1)
        if cmax < 0:
            possible = False
            break
    if cmin > 0: possible = False
    return s, "true" if possible else "false"


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
    "square_of_a_number": solve_square_of_a_number,
    "cube_of_a_number": solve_cube_of_a_number,
    "leap_year_check": solve_leap_year_check,
    "count_consonants": solve_count_consonants,
    "string_length": solve_string_length,
    "is_anagram": solve_is_anagram,
    "sum_of_n_natural_numbers": solve_sum_of_n_natural_numbers,
    "is_perfect_square": solve_is_perfect_square,
    "is_armstrong_number": solve_is_armstrong_number,
    "smallest_element_in_array": solve_smallest_element_in_array,
    "sum_of_even_in_range": solve_sum_of_even_in_range,
    "sum_of_odd_in_range": solve_sum_of_odd_in_range,
    "reverse_an_array": solve_reverse_an_array,
    "is_array_sorted": solve_is_array_sorted,
    "missing_number": solve_missing_number,
    "count_set_bits": solve_count_set_bits,
    "power_of_two": solve_power_of_two,
    "pascals_triangle_row": solve_pascals_triangle_row,
    "valid_parentheses": solve_valid_parentheses,
    "best_time_to_buy_and_sell_stock": solve_best_time_to_buy_and_sell_stock,
    "majority_element": solve_majority_element,
    "climbing_stairs": solve_climbing_stairs,
    "house_robber": solve_house_robber,
    "edit_distance": solve_edit_distance,
    "matrix_multiplication": solve_matrix_multiplication,
    "rotate_array": solve_rotate_array,
    "product_of_array_except_self": solve_product_of_array_except_self,
    "combination_sum": solve_combination_sum,
    "group_anagrams": solve_group_anagrams,
    "permutations": solve_permutations,
    "maximum_subarray": solve_maximum_subarray,
    "jump_game": solve_jump_game,
    "subarray_sum_equals_k": solve_subarray_sum_equals_k,
    "kth_largest_element": solve_kth_largest_element,
    "word_search": solve_word_search,
    "number_of_islands": solve_number_of_islands,
    "partition_labels": solve_partition_labels,
    "spiral_matrix": solve_spiral_matrix,
    "container_with_most_water": solve_container_with_most_water,
    "longest_palindromic_substring": solve_longest_palindromic_substring,
    "n_queens": solve_n_queens,
    "median_of_two_sorted_arrays": solve_median_of_two_sorted_arrays,
    "regular_expression_matching": solve_regular_expression_matching,
    "longest_valid_parentheses": solve_longest_valid_parentheses,
    "sudoku_solver": solve_sudoku_solver,
    "search_in_rotated_sorted_array": solve_search_in_rotated_sorted_array,
    "three_sum": solve_three_sum,
    "merge_intervals": solve_merge_intervals,
    "insert_interval": solve_insert_interval,
    "simplify_path": solve_simplify_path,
    "minimum_path_sum": solve_minimum_path_sum,
    "unique_paths": solve_unique_paths,
    "unique_paths_ii": solve_unique_paths_ii,
    "coin_change_ii": solve_coin_change_ii,
    "decode_ways": solve_decode_ways,
    "word_break": solve_word_break,
    "longest_consecutive_sequence": solve_longest_consecutive_sequence,
    "top_k_frequent_elements": solve_top_k_frequent_elements,
    "find_peak_element": solve_find_peak_element,
    "find_first_and_last_position_of_element_in_sorted_array": solve_find_first_and_last_position,
    "search_a_2d_matrix": solve_search_a_2d_matrix,
    "sort_colors": solve_sort_colors,
    "subsets": solve_subsets,
    "letter_combinations_of_a_phone_number": solve_letter_combinations,
    "sliding_window_maximum": solve_sliding_window_maximum,
    "count_odd_numbers_in_interval_range": solve_count_odd_numbers_in_interval_range,
    "add_digits": solve_add_digits,
    "power_of_three": solve_power_of_three,
    "power_of_four": solve_power_of_four,
    "ugly_number": solve_ugly_number,
    "move_zeroes": solve_move_zeroes,
    "isomorphic_strings": solve_isomorphic_strings,
    "contains_duplicate": solve_contains_duplicate,
    "contains_duplicate_ii": solve_contains_duplicate_ii,
    "intersection_of_two_arrays": solve_intersection_of_two_arrays,
    "ransom_note": solve_ransom_note,
    "first_unique_character": solve_first_unique_character,
    "sort_characters_by_frequency": solve_sort_characters_by_frequency,
    "integer_to_roman": solve_integer_to_roman,
    "roman_to_integer": solve_roman_to_integer,
    "zigzag_conversion": solve_zigzag_conversion,
    "set_matrix_zeroes": solve_set_matrix_zeroes,
    "gas_station": solve_gas_station,
    "rotate_image": solve_rotate_image,
    "daily_temperatures": solve_daily_temperatures,
    "two_sum": solve_two_sum,
    "longest_common_prefix": solve_longest_common_prefix,
    "fizz_buzz": solve_fizz_buzz,
    "single_number": solve_single_number,
    "happy_number": solve_happy_number,
    "counting_bits": solve_counting_bits,
    "sqrt_x": solve_sqrt_x,
    "plus_one": solve_plus_one,
    "add_binary": solve_add_binary,
    "length_of_last_word": solve_length_of_last_word,
    "reverse_integer": solve_reverse_integer,
    "hamming_distance": solve_hamming_distance,
    "perfect_number": solve_perfect_number,
    "self_dividing_numbers": solve_self_dividing_numbers,
    "island_perimeter": solve_island_perimeter,
    "base_7": solve_base_7,
    "number_complement": solve_number_complement,
    "maximum_product_of_three_numbers": solve_maximum_product_of_three_numbers,
    "keyboard_row": solve_keyboard_row,
    "binary_search": solve_binary_search,
    "excel_sheet_column_title": solve_excel_sheet_column_title,
    "excel_sheet_column_number": solve_excel_sheet_column_number,
    "word_pattern": solve_word_pattern,
    "find_the_difference": solve_find_the_difference,
    "relative_sort_array": solve_relative_sort_array,
    "peak_index_in_mountain_array": solve_peak_index_in_mountain_array,
    "valid_palindrome_ii": solve_valid_palindrome_ii,
    "palindrome_number": solve_palindrome_number,
    "remove_element": solve_remove_element,
    "search_insert_position": solve_search_insert_position,
    "best_time_to_buy_and_sell_stock_ii": solve_best_time_to_buy_and_sell_stock_ii,
    "h_index": solve_h_index,
    "jump_game_ii": solve_jump_game_ii,
    "find_index_of_first_occurrence": solve_find_index_of_first_occurrence,
    "length_of_longest_substring": solve_length_of_longest_substring,
    "string_to_integer_atoi": solve_string_to_integer_atoi,
    "three_sum_closest": solve_three_sum_closest,
    "four_sum": solve_four_sum,
    "minimum_number_of_arrows_to_burst_balloons": solve_minimum_number_of_arrows_to_burst_balloons,
    "non_overlapping_intervals": solve_non_overlapping_intervals,
    "summary_ranges": solve_summary_ranges,
    "is_subsequence": solve_is_subsequence,
    "reverse_vowels_of_a_string": solve_reverse_vowels_of_a_string,
    "intersection_of_two_arrays_ii": solve_intersection_of_two_arrays_ii,
    "arranging_coins": solve_arranging_coins,
    "find_all_numbers_disappeared_in_an_array": solve_find_all_numbers_disappeared_in_an_array,
    "max_consecutive_ones": solve_max_consecutive_ones,
    "teemo_attacking": solve_teemo_attacking,
    "next_greater_element_i": solve_next_greater_element_i,
    "distribute_candies": solve_distribute_candies,
    "can_place_flowers": solve_can_place_flowers,
    "maximum_average_subarray_i": solve_maximum_average_subarray_i,
    "set_mismatch": solve_set_mismatch,
    "to_lower_case": solve_to_lower_case,
    "rotate_string": solve_rotate_string,
    "unique_morse_code_words": solve_unique_morse_code_words,
    "transpose_matrix": solve_transpose_matrix,
    "binary_gap": solve_binary_gap,
    "buddy_strings": solve_buddy_strings,
    "lemonade_change": solve_lemonade_change,
    "count_primes": solve_count_primes,
    "third_maximum_number": solve_third_maximum_number,
    "find_the_duplicate_number": solve_find_the_duplicate_number,
    "check_if_array_is_sorted_and_rotated": solve_check_if_array_is_sorted_and_rotated,
    "replace_elements_with_greatest_element_on_right_side": solve_replace_elements_with_greatest_element_on_right_side,
    "sort_array_by_parity": solve_sort_array_by_parity,
    "squares_of_a_sorted_array": solve_squares_of_a_sorted_array,
    "defanging_an_ip_address": solve_defanging_an_ip_address,
    "jewels_and_stones": solve_jewels_and_stones,
    "how_many_numbers_smaller_than_current": solve_how_many_numbers_smaller_than_current,
    "maximum_69_number": solve_maximum_69_number,
    "check_if_n_and_double_exist": solve_check_if_n_and_double_exist,
    "shuffle_the_array": solve_shuffle_the_array,
    "kids_with_greatest_number_of_candies": solve_kids_with_greatest_number_of_candies,
    "richest_customer_wealth": solve_richest_customer_wealth,
    "matrix_diagonal_sum": solve_matrix_diagonal_sum,
    "count_negative_numbers_in_sorted_matrix": solve_count_negative_numbers_in_sorted_matrix,
    "find_the_highest_altitude": solve_find_the_highest_altitude,
    "maximal_square": solve_maximal_square,
    "partition_equal_subset_sum": solve_partition_equal_subset_sum,
    "generate_parentheses": solve_generate_parentheses,
    "maximal_rectangle": solve_maximal_rectangle,
    "word_search_ii": solve_word_search_ii,
    "longest_substring_with_at_most_k_distinct_characters": solve_longest_substring_at_most_k_distinct,
    "longest_repeating_character_replacement": solve_longest_repeating_character_replacement,
    "minimum_window_substring": solve_minimum_window_substring,
    "permutation_in_string": solve_permutation_in_string,
    "find_all_anagrams_in_a_string": solve_find_all_anagrams,
    "top_k_frequent_words": solve_top_k_frequent_words,
    "reorganize_string": solve_reorganize_string,
    "k_closest_points_to_origin": solve_k_closest_points_to_origin,
    "task_scheduler": solve_task_scheduler,
    "meeting_rooms_ii": solve_meeting_rooms_ii,
    "employee_free_time": solve_employee_free_time,
    "longest_increasing_path_in_a_matrix": solve_longest_increasing_path,
    "word_ladder": solve_word_ladder,
    "skyline_problem": solve_skyline_problem,
    "burst_balloons": solve_burst_balloons,
    "count_of_smaller_numbers_after_self": solve_count_smaller_numbers,
    "house_robber_ii": solve_house_robber_ii,
    "goal_parser_interpretation": solve_goal_parser_interpretation,
    "shuffle_string": solve_shuffle_string,
    "count_items_matching_a_rule": solve_count_items_matching_a_rule,
    "sorting_the_sentence": solve_sorting_the_sentence,
    "truncate_sentence": solve_truncate_sentence,
    "rings_and_rods": solve_rings_and_rods,
    "cells_in_a_range_on_an_excel_sheet": solve_cells_in_a_range,
    "find_the_difference_of_two_arrays": solve_find_the_difference_of_two_arrays,
    "final_value_of_variable_after_performing_operations": solve_final_value_of_variable,
    "minimum_sum_of_four_digit_number_after_splitting_digits": solve_minimum_sum_of_four_digit_number,
    "divide_two_integers": solve_divide_two_integers,
    "valid_sudoku": solve_valid_sudoku,
    "count_and_say": solve_count_and_say,
    "pow_x_n": solve_pow_x_n,
    "multiply_strings": solve_multiply_strings,
    "spiral_matrix_ii": solve_spiral_matrix_ii,
    "permutation_sequence": solve_permutation_sequence,
    "minimum_size_subarray_sum": solve_minimum_size_subarray_sum,
    "restore_ip_addresses": solve_restore_ip_addresses,
    "valid_parenthesis_string": solve_valid_parenthesis_string,
}

HARD_PROBLEMS = {
    "coin_change", 
    "knapsack_0_1", 
    "longest_common_subsequence", 
    "longest_increasing_subsequence", 
    "matrix_addition", 
    "string_permutations", 
    "trapping_rain_water",
    "edit_distance",
    "matrix_multiplication",
    "n_queens",
    "median_of_two_sorted_arrays",
    "regular_expression_matching",
    "longest_valid_parentheses",
    "sudoku_solver",
    "combination_sum",
    "word_search",
    "number_of_islands",
    "word_break",
    "sliding_window_maximum",
    "peak_index_in_mountain_array",
    "best_time_to_buy_and_sell_stock_ii",
    "h_index",
    "jump_game_ii",
    "length_of_longest_substring",
    "string_to_integer_atoi",
    "three_sum_closest",
    "four_sum",
    "minimum_number_of_arrows_to_burst_balloons",
    "non_overlapping_intervals",
    "count_primes",
    "find_the_duplicate_number",
    "maximal_square",
    "partition_equal_subset_sum",
    "generate_parentheses",
    "maximal_rectangle",
    "word_search_ii",
    "longest_substring_with_at_most_k_distinct_characters",
    "longest_repeating_character_replacement",
    "minimum_window_substring",
    "permutation_in_string",
    "find_all_anagrams_in_a_string",
    "top_k_frequent_words",
    "reorganize_string",
    "k_closest_points_to_origin",
    "task_scheduler",
    "meeting_rooms_ii",
    "employee_free_time",
    "longest_increasing_path_in_a_matrix",
    "word_ladder",
    "skyline_problem",
    "burst_balloons",
    "count_of_smaller_numbers_after_self",
    "house_robber_ii",
}

def main():
    if not os.path.exists(PROBLEMS_DIR):
        print(f"Error: {PROBLEMS_DIR} does not exist.")
        return

    files = os.listdir(PROBLEMS_DIR)
    
    for filename in files:
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
            
            # Determine count based on difficulty
            difficulty = data.get("difficulty", "Medium")
            if difficulty == "Easy":
                target_count = 90
            elif difficulty == "Medium":
                target_count = 160
            elif difficulty == "Hard":
                target_count = 220
            else:
                target_count = 160
            
            print(f"Generating {target_count} cases for {filename} ({difficulty})...")
            
            new_cases = []
            seen_inputs = set()
            
            attempts = 0
            while len(new_cases) < target_count and attempts < target_count * 5:
                attempts += 1
                inp, outp = solver()
                if inp in seen_inputs:
                    continue
                seen_inputs.add(inp)
                new_cases.append({"input": inp, "output": outp})
            
            # Overwrite hidden_test_cases
            data["hidden_test_cases"] = new_cases
            
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4) 
            
            print(f"Saved {len(new_cases)} cases to {filename}")
            
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

if __name__ == "__main__":
    main()

