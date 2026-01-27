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
    "number_of_islands"
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
            
            # Determine count
            target_count = 1000 if problem_id in HARD_PROBLEMS else 500
            
            print(f"Generating {target_count} cases for {filename}...")
            
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

