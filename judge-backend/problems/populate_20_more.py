import json
import os
import random

PROBLEMS_DIR = os.path.dirname(os.path.abspath(__file__))

def save_problem(problem_id, data):
    path = os.path.join(PROBLEMS_DIR, f"{problem_id}.json")
    with open(path, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Populated {problem_id}.json")

def gen_maximum_product_subarray():
    samples = [
        {"input": "2 3 -2 4", "output": "6"},
        {"input": "-2 0 -1", "output": "0"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 100)
        nums = [random.randint(-10, 10) for _ in range(n)]
        
        # solver
        if not nums:
            out = "0"
        else:
            max_prod = nums[0]
            cur_max = nums[0]
            cur_min = nums[0]
            for num in nums[1:]:
                temp = cur_max * num
                cur_max = max(num, temp, cur_min * num)
                cur_min = min(num, temp, cur_min * num)
                max_prod = max(max_prod, cur_max)
            out = str(max_prod)
            
        hidden.append({"input": " ".join(map(str, nums)), "output": out})
        
    save_problem("maximum_product_subarray", {
        "id": "maximum_product_subarray",
        "title": "Maximum Product Subarray",
        "description": "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
        "input_format": "Space-separated integers.",
        "output_format": "A single integer.",
        "constraints": {"nums.length": "1 <= nums.length <= 2 * 10^4", "nums[i]": "-10 <= nums[i] <= 10"},
        "difficulty": "medium",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_evaluate_reverse_polish_notation():
    samples = [
        {"input": "2 1 + 3 *", "output": "9"},
        {"input": "4 13 5 / +", "output": "6"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        # Generate valid RPN
        target_ops = random.randint(1, 15)
        stack_size = 0
        tokens = []
        for __ in range(target_ops * 2 + 1):
            if stack_size >= 2 and random.random() < 0.5:
                # Add operator
                op = random.choice(['+', '-', '*']) # avoid division by zero issues for simplicity
                tokens.append(op)
                stack_size -= 1
            else:
                num = random.randint(-100, 100)
                tokens.append(str(num))
                stack_size += 1
        while stack_size > 1:
            op = random.choice(['+', '-', '*'])
            tokens.append(op)
            stack_size -= 1
            
        # solver
        stack = []
        for t in tokens:
            if t not in ['+', '-', '*', '/']:
                stack.append(int(t))
            else:
                b = stack.pop()
                a = stack.pop()
                if t == '+': stack.append(a + b)
                elif t == '-': stack.append(a - b)
                elif t == '*': stack.append(a * b)
                elif t == '/': stack.append(int(a / b))
                
        hidden.append({"input": " ".join(tokens), "output": str(stack[0])})
        
    save_problem("evaluate_reverse_polish_notation", {
        "id": "evaluate_reverse_polish_notation",
        "title": "Evaluate Reverse Polish Notation",
        "description": "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.",
        "input_format": "Space-separated string tokens.",
        "output_format": "A single integer.",
        "constraints": {"tokens.length": "1 <= tokens.length <= 10^4"},
        "difficulty": "medium",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_find_all_duplicates_in_an_array():
    samples = [
        {"input": "4 3 2 7 8 2 3 1", "output": "2 3"},
        {"input": "1 1 2", "output": "1"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 100)
        base = list(range(1, n+1))
        # pick some to duplicate and replace others
        num_dupes = random.randint(0, n//2)
        if base:
            dupes = random.sample(base, num_dupes)
            # Remove some and add dupes
            for i in range(num_dupes):
                base.pop()
            base.extend(dupes)
        random.shuffle(base)
        
        # solver
        counts = {}
        ans = []
        for num in base:
            counts[num] = counts.get(num, 0) + 1
        for num, freq in counts.items():
            if freq == 2:
                ans.append(num)
        ans.sort()
        
        hidden.append({"input": " ".join(map(str, base)), "output": " ".join(map(str, ans))})
        
    save_problem("find_all_duplicates_in_an_array", {
        "id": "find_all_duplicates_in_an_array",
        "title": "Find All Duplicates in an Array",
        "description": "Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears once or twice, return an array of all the integers that appears twice. Print them space-separated strictly in sorted ascending order.",
        "input_format": "Space-separated integers.",
        "output_format": "Space-separated integers.",
        "constraints": {"n": "1 <= n <= 10^5"},
        "difficulty": "medium",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_candy():
    samples = [
        {"input": "1 0 2", "output": "5"},
        {"input": "1 2 2", "output": "4"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 100)
        ratings = [random.randint(0, 50) for _ in range(n)]
        
        # solver
        if not ratings:
            out = 0
        else:
            candies = [1] * len(ratings)
            for i in range(1, len(ratings)):
                if ratings[i] > ratings[i-1]:
                    candies[i] = candies[i-1] + 1
            for i in range(len(ratings)-2, -1, -1):
                if ratings[i] > ratings[i+1]:
                    candies[i] = max(candies[i], candies[i+1] + 1)
            out = sum(candies)
            
        hidden.append({"input": " ".join(map(str, ratings)), "output": str(out)})
        
    save_problem("candy", {
        "id": "candy",
        "title": "Candy",
        "description": "There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. You are giving candies to these children subjected to the following requirements: Each child must have at least one candy. Children with a higher rating get more candies than their neighbors. Return the minimum number of candies you need to have to distribute the candies to the children.",
        "input_format": "Space-separated integers.",
        "output_format": "A single integer.",
        "constraints": {"n": "1 <= n <= 2 * 10^4"},
        "difficulty": "hard",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_largest_number():
    samples = [
        {"input": "10 2", "output": "210"},
        {"input": "3 30 34 5 9", "output": "9534330"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 20)
        nums = [random.randint(0, 1000) for _ in range(n)]
        
        # solver
        strs = list(map(str, nums))
        from functools import cmp_to_key
        def compare(n1, n2):
            if n1 + n2 > n2 + n1: return -1
            elif n1 + n2 < n2 + n1: return 1
            else: return 0
        strs.sort(key=cmp_to_key(compare))
        largest = "".join(strs)
        if largest[0] == '0':
            out = "0"
        else:
            out = largest
            
        hidden.append({"input": " ".join(map(str, nums)), "output": out})
        
    save_problem("largest_number", {
        "id": "largest_number",
        "title": "Largest Number",
        "description": "Given a list of non-negative integers nums, arrange them such that they form the largest number and return it.",
        "input_format": "Space-separated integers.",
        "output_format": "A single string representing the number.",
        "constraints": {"nums.length": "1 <= nums.length <= 100"},
        "difficulty": "medium",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_sort_an_array():
    samples = [
        {"input": "5 2 3 1", "output": "1 2 3 5"},
        {"input": "5 1 1 2 0 0", "output": "0 0 1 1 2 5"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 100)
        nums = [random.randint(-500, 500) for _ in range(n)]
        
        hidden.append({"input": " ".join(map(str, nums)), "output": " ".join(map(str, sorted(nums)))})
        
    save_problem("sort_an_array", {
        "id": "sort_an_array",
        "title": "Sort an Array",
        "description": "Given an array of integers nums, sort the array in ascending order and return it.",
        "input_format": "Space-separated integers.",
        "output_format": "Space-separated integers.",
        "constraints": {"nums.length": "1 <= nums.length <= 5 * 10^4"},
        "difficulty": "medium",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_kth_missing_positive_number():
    samples = [
        {"input": "2 3 4 7 11\n5", "output": "9"},
        {"input": "1 2 3 4\n2", "output": "6"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 20)
        nums = sorted(random.sample(range(1, 100), n))
        k = random.randint(1, 50)
        
        # solver
        s = set(nums)
        missing = []
        curr = 1
        while len(missing) < k:
            if curr not in s:
                missing.append(curr)
            curr += 1
        
        hidden.append({"input": " ".join(map(str, nums)) + f"\n{k}", "output": str(missing[-1])})
        
    save_problem("kth_missing_positive_number", {
        "id": "kth_missing_positive_number",
        "title": "Kth Missing Positive Number",
        "description": "Given an array arr of positive integers sorted in a strictly increasing order, and an integer k. Return the kth positive integer that is missing from this array.",
        "input_format": "First line: space-separated integers. Second line: k.",
        "output_format": "A single integer.",
        "constraints": {"arr.length": "1 <= arr.length <= 1000"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_find_the_town_judge():
    samples = [
        {"input": "2\n1 2", "output": "2"},
        {"input": "3\n1 3\n2 3", "output": "3"},
        {"input": "3\n1 3\n2 3\n3 1", "output": "-1"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 20)
        edges = []
        judge = random.randint(1, n) if random.random() < 0.5 else -1
        
        for u in range(1, n+1):
            if judge != -1 and u != judge:
                edges.append(f"{u} {judge}")
            for v in range(1, n+1):
                if u != v and random.random() < 0.2 and (judge == -1 or u != judge):
                    edges.append(f"{u} {v}")
                    
        edges = list(set(edges)) # unique directed edges
        
        # solver
        trust_counts = {i: 0 for i in range(1, n+1)}
        trusted_by = {i: 0 for i in range(1, n+1)}
        for e in edges:
            u, v = map(int, e.split())
            trust_counts[u] += 1
            trusted_by[v] += 1
            
        ans = -1
        for i in range(1, n+1):
            if trust_counts[i] == 0 and trusted_by[i] == n - 1:
                ans = i
                break
                
        inp = f"{n}\n" + "\n".join(edges) if edges else str(n)
        hidden.append({"input": inp, "output": str(ans)})
        
    save_problem("find_the_town_judge", {
        "id": "find_the_town_judge",
        "title": "Find the Town Judge",
        "description": "In a town, there are n people labeled from 1 to n. There is a rumor that one of these people is secretly the town judge. Condition 1: The town judge trusts nobody. Condition 2: Everybody (except for the town judge) trusts the town judge. Condition 3: There is exactly one person that satisfies properties 1 and 2. Return the label of the town judge if the town judge exists, otherwise return -1.",
        "input_format": "First line n. Following lines 'a b' meaning a trusts b.",
        "output_format": "A single integer.",
        "constraints": {"n": "1 <= n <= 1000"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_valid_mountain_array():
    samples = [
        {"input": "2 1", "output": "false"},
        {"input": "3 5 5", "output": "false"},
        {"input": "0 3 2 1", "output": "true"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 20)
        arr = [random.randint(0, 100) for _ in range(n)]
        # Add some true mountain arrays
        if random.random() < 0.3 and n >= 3:
            peak = random.randint(1, n-2)
            arr = sorted(random.sample(range(0, 50), peak)) + sorted(random.sample(range(50, 100), 1)) + sorted(random.sample(range(0, 50), n - peak - 1), reverse=True)
            
        # solver
        if len(arr) < 3:
            out = "false"
        else:
            i = 0
            while i + 1 < len(arr) and arr[i] < arr[i+1]:
                i += 1
            if i == 0 or i == len(arr) - 1:
                out = "false"
            else:
                while i + 1 < len(arr) and arr[i] > arr[i+1]:
                    i += 1
                out = "true" if i == len(arr) - 1 else "false"
                
        hidden.append({"input": " ".join(map(str, arr)), "output": out})
        
    save_problem("valid_mountain_array", {
        "id": "valid_mountain_array",
        "title": "Valid Mountain Array",
        "description": "Given an array of integers arr, return true if and only if it is a valid mountain array. Otherwise return false.",
        "input_format": "Space-separated integers.",
        "output_format": "'true' or 'false'.",
        "constraints": {"arr.length": "1 <= arr.length <= 10^4"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_monotonic_array():
    samples = [
        {"input": "1 2 2 3", "output": "true"},
        {"input": "6 5 4 4", "output": "true"},
        {"input": "1 3 2", "output": "false"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 50)
        arr = [random.randint(-100, 100) for _ in range(n)]
        
        # Make monotonic occasionally
        if random.random() < 0.3:
            arr.sort()
        elif random.random() < 0.3:
            arr.sort(reverse=True)
            
        # solver
        inc = True
        dec = True
        for i in range(len(arr) - 1):
            if arr[i] > arr[i+1]: inc = False
            if arr[i] < arr[i+1]: dec = False
            
        hidden.append({"input": " ".join(map(str, arr)), "output": "true" if inc or dec else "false"})
        
    save_problem("monotonic_array", {
        "id": "monotonic_array",
        "title": "Monotonic Array",
        "description": "An array is monotonic if it is either monotone increasing or monotone decreasing. Return true if and only if the given array nums is monotonic.",
        "input_format": "Space-separated integers.",
        "output_format": "'true' or 'false'.",
        "constraints": {"nums.length": "1 <= nums.length <= 10^5"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_toeplitz_matrix():
    samples = [
        {"input": "3 4\n1 2 3 4\n5 1 2 3\n9 5 1 2", "output": "true"},
        {"input": "2 2\n1 2\n2 2", "output": "false"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        rows = random.randint(1, 10)
        cols = random.randint(1, 10)
        matrix = [[random.randint(1, 20) for _ in range(cols)] for _ in range(rows)]
        
        # Modify to be Toeplitz occasionally
        if random.random() < 0.5:
            for r in range(1, rows):
                for c in range(1, cols):
                    matrix[r][c] = matrix[r-1][c-1]
                    
        # solver
        ans = True
        for r in range(1, rows):
            for c in range(1, cols):
                if matrix[r][c] != matrix[r-1][c-1]:
                    ans = False
                    
        inp = f"{rows} {cols}\n" + "\n".join([" ".join(map(str, row)) for row in matrix])
        hidden.append({"input": inp, "output": "true" if ans else "false"})
        
    save_problem("toeplitz_matrix", {
        "id": "toeplitz_matrix",
        "title": "Toeplitz Matrix",
        "description": "Given an m x n matrix, return true if the matrix is Toeplitz. A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same elements.",
        "input_format": "First line: m n. Next m lines: n space-separated integers.",
        "output_format": "'true' or 'false'.",
        "constraints": {"m, n": "1 <= m, n <= 20"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_reshape_the_matrix():
    samples = [
        {"input": "2 2\n1 2\n3 4\n1 4", "output": "1 2 3 4"},
        {"input": "2 2\n1 2\n3 4\n2 4", "output": "1 2\n3 4"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        rows = random.randint(1, 5)
        cols = random.randint(1, 5)
        matrix = [[random.randint(1, 50) for _ in range(cols)] for _ in range(rows)]
        r = random.randint(1, 10)
        c = random.randint(1, 10)
        
        # solver
        flat = [val for row in matrix for val in row]
        if rows * cols != r * c:
            out = "\n".join([" ".join(map(str, row)) for row in matrix])
        else:
            new_mat = [flat[i*c:(i+1)*c] for i in range(r)]
            out = "\n".join([" ".join(map(str, row)) for row in new_mat])
            
        inp = f"{rows} {cols}\n" + "\n".join([" ".join(map(str, row)) for row in matrix]) + f"\n{r} {c}"
        hidden.append({"input": inp, "output": out})
        
    save_problem("reshape_the_matrix", {
        "id": "reshape_the_matrix",
        "title": "Reshape the Matrix",
        "description": "In MATLAB, there is a handy function called reshape which can reshape an m x n matrix into a new one with a different size r x c keeping its original data. Return the reshaped matrix, or the original matrix if reshape is not possible.",
        "input_format": "First line 'm n'. Next m lines matrix. Last line 'r c'.",
        "output_format": "The output matrix format (each row on a newline, space separated).",
        "constraints": {"m, n": "1 <= m, n <= 100"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_max_area_of_island():
    samples = [
        {"input": "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 0 1 1\n0 0 0 1 1", "output": "4"},
        {"input": "1 1\n0", "output": "0"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        m = random.randint(1, 20)
        n = random.randint(1, 20)
        grid = [[random.choice([0, 1]) for _ in range(n)] for _ in range(m)]
        
        # solver
        visited = set()
        max_area = 0
        def dfs(r, c):
            if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == 0 or (r, c) in visited:
                return 0
            visited.add((r, c))
            return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1)
            
        for r in range(m):
            for c in range(n):
                if grid[r][c] == 1 and (r, c) not in visited:
                    max_area = max(max_area, dfs(r, c))
                    
        inp = f"{m} {n}\n" + "\n".join([" ".join(map(str, row)) for row in grid])
        hidden.append({"input": inp, "output": str(max_area)})
        
    save_problem("max_area_of_island", {
        "id": "max_area_of_island",
        "title": "Max Area of Island",
        "description": "You are given an m x n binary matrix grid. An island is a group of 1s connected 4-directionally. Return the maximum area of an island, or 0 if there is no island.",
        "input_format": "First line m n. Next m lines the grid.",
        "output_format": "A single integer representing the maximum area.",
        "constraints": {"grid size": "1 <= m, n <= 50"},
        "difficulty": "medium",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_find_pivot_index():
    samples = [
        {"input": "1 7 3 6 5 6", "output": "3"},
        {"input": "1 2 3", "output": "-1"},
        {"input": "2 1 -1", "output": "0"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 50)
        nums = [random.randint(-100, 100) for _ in range(n)]
        
        # maybe make a valid pivot
        if random.random() < 0.3:
            p = random.randint(0, n-1)
            left_sum = sum(nums[:p])
            curr_right_sum = sum(nums[p+1:])
            nums[-1] += left_sum - curr_right_sum
            
        # solver
        total = sum(nums)
        left = 0
        ans = -1
        for i, val in enumerate(nums):
            if left == total - left - val:
                ans = i
                break
            left += val
            
        hidden.append({"input": " ".join(map(str, nums)), "output": str(ans)})
        
    save_problem("find_pivot_index", {
        "id": "find_pivot_index",
        "title": "Find Pivot Index",
        "description": "Given an array of integers nums, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right. Return the leftmost pivot index, or -1 if none exists.",
        "input_format": "Space-separated integers.",
        "output_format": "A single integer.",
        "constraints": {"nums.length": "1 <= nums.length <= 10^4"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_running_sum_of_1d_array():
    samples = [
        {"input": "1 2 3 4", "output": "1 3 6 10"},
        {"input": "1 1 1 1 1", "output": "1 2 3 4 5"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 50)
        nums = [random.randint(-50, 50) for _ in range(n)]
        
        # solver
        ans = []
        cur = 0
        for num in nums:
            cur += num
            ans.append(cur)
            
        hidden.append({"input": " ".join(map(str, nums)), "output": " ".join(map(str, ans))})
        
    save_problem("running_sum_of_1d_array", {
        "id": "running_sum_of_1d_array",
        "title": "Running Sum of 1d Array",
        "description": "Given an array nums, return a running sum of nums where runningSum[i] = sum(nums[0]...nums[i]).",
        "input_format": "Space-separated integers.",
        "output_format": "Space-separated integers.",
        "constraints": {"nums.length": "1 <= nums.length <= 1000"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_number_of_good_pairs():
    samples = [
        {"input": "1 2 3 1 1 3", "output": "4"},
        {"input": "1 1 1 1", "output": "6"},
        {"input": "1 2 3", "output": "0"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n = random.randint(1, 50)
        nums = [random.randint(1, 100) for _ in range(n)]
        
        # solver
        count = 0
        from collections import Counter
        for v in Counter(nums).values():
            count += v * (v - 1) // 2
            
        hidden.append({"input": " ".join(map(str, nums)), "output": str(count)})

    save_problem("number_of_good_pairs", {
        "id": "number_of_good_pairs",
        "title": "Number of Good Pairs",
        "description": "Given an array of integers nums, return the number of good pairs. A pair (i, j) is called good if nums[i] == nums[j] and i < j.",
        "input_format": "Space-separated integers.",
        "output_format": "A single integer.",
        "constraints": {"nums.length": "1 <= nums.length <= 100"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_check_if_two_string_arrays_are_equivalent():
    samples = [
        {"input": "ab c\na bc", "output": "true"},
        {"input": "a cb\nab c", "output": "false"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        n1 = random.randint(1, 10)
        n2 = random.randint(1, 10)
        w1 = ["".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(1, 5))) for _ in range(n1)]
        w2 = ["".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(1, 5))) for _ in range(n2)]
        
        if random.random() < 0.5:
            # force true
            joint = "".join(w1)
            # randomly split joint to w2
            w2 = []
            cur = 0
            while cur < len(joint):
                nxt = cur + random.randint(1, 5)
                w2.append(joint[cur:nxt])
                cur = nxt
        
        inp = " ".join(w1) + "\n" + " ".join(w2)
        out = "true" if "".join(w1) == "".join(w2) else "false"
        
        hidden.append({"input": inp, "output": out})
        
    save_problem("check_if_two_string_arrays_are_equivalent", {
        "id": "check_if_two_string_arrays_are_equivalent",
        "title": "Check If Two String Arrays are Equivalent",
        "description": "Given two string arrays word1 and word2, return true if the two arrays represent the same string, and false otherwise.",
        "input_format": "First line: space-separated strings of word1. Second line: space-separated strings of word2.",
        "output_format": "'true' or 'false'.",
        "constraints": {"length": "1 <= word1.length, word2.length <= 10^3"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_maximum_nesting_depth_of_the_parentheses():
    samples = [
        {"input": "(1+(2*3)+((8)/4))+1", "output": "3"},
        {"input": "(1)+((2))+(((3)))", "output": "3"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        s_arr = []
        depth = 0
        for __ in range(random.randint(5, 50)):
            choice = random.choice(['(', ')', '1', '+'])
            if choice == '(':
                depth += 1
                s_arr.append('(')
            elif choice == ')':
                if depth > 0:
                    depth -= 1
                    s_arr.append(')')
            else:
                s_arr.append(choice)
        while depth > 0:
            s_arr.append(')')
            depth -= 1
            
        s = "".join(s_arr)
        
        # solver
        ans = 0
        cur = 0
        for char in s:
            if char == '(': cur += 1
            if char == ')': cur -= 1
            ans = max(ans, cur)
            
        hidden.append({"input": s, "output": str(ans)})
        
    save_problem("maximum_nesting_depth_of_the_parentheses", {
        "id": "maximum_nesting_depth_of_the_parentheses",
        "title": "Maximum Nesting Depth of the Parentheses",
        "description": "A string is a valid parentheses string if it meets certain rules (standard parentheses expressions). Return the nesting depth of s (the maximum number of nested parentheses).",
        "input_format": "A single string s.",
        "output_format": "A single integer.",
        "constraints": {"s.length": "1 <= s.length <= 100"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_split_a_string_in_balanced_strings():
    samples = [
        {"input": "RLRRLLRLRL", "output": "4"},
        {"input": "LLLLRRRR", "output": "1"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        # Make valid balanced strings
        s = ""
        for __ in range(random.randint(1, 10)):
            cnt = random.randint(1, 10)
            if random.random() < 0.5:
                s += "R" * cnt + "L" * cnt
            else:
                s += "L" * cnt + "R" * cnt
                
        # Solver
        ans = 0
        balance = 0
        for char in s:
            if char == 'L': balance += 1
            else: balance -= 1
            if balance == 0:
                ans += 1
                
        hidden.append({"input": s, "output": str(ans)})
        
    save_problem("split_a_string_in_balanced_strings", {
        "id": "split_a_string_in_balanced_strings",
        "title": "Split a String in Balanced Strings",
        "description": "Balanced strings are those that have an equal quantity of 'L' and 'R' characters. Return the maximum amount of split balanced strings.",
        "input_format": "A single string s.",
        "output_format": "A single integer.",
        "constraints": {"s.length": "2 <= s.length <= 1000"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })

def gen_count_the_number_of_consistent_strings():
    samples = [
        {"input": "ab\nad bd aaab baa badab", "output": "2"},
        {"input": "abc\na b c ab ac bc abc", "output": "7"}
    ]
    hidden = []
    for _ in range(random.randint(100, 120)):
        allowed = "".join(set(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(1, 10))))
        words = []
        for __ in range(random.randint(5, 20)):
            # some consistent
            if random.random() < 0.5:
                words.append("".join(random.choices(allowed, k=random.randint(1, 10))))
            else:
                words.append("".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(1, 10))))
                
        # solve
        ans = sum(1 for w in words if set(w).issubset(set(allowed)))
        
        inp = f"{allowed}\n" + " ".join(words)
        hidden.append({"input": inp, "output": str(ans)})
        
    save_problem("count_the_number_of_consistent_strings", {
        "id": "count_the_number_of_consistent_strings",
        "title": "Count the Number of Consistent Strings",
        "description": "You are given a string allowed consisting of distinct characters and an array of strings words. A string is consistent if all characters in the string appear in the string allowed. Return the number of consistent strings.",
        "input_format": "First line: string allowed. Second line: space-separated strings words.",
        "output_format": "A single integer.",
        "constraints": {"words": "1 <= words.length <= 10^4"},
        "difficulty": "easy",
        "judge_mode": "str_compare_strip",
        "time_limit": 1,
        "sample_test_cases": samples,
        "hidden_test_cases": hidden
    })


if __name__ == "__main__":
    gen_maximum_product_subarray()
    gen_evaluate_reverse_polish_notation()
    gen_find_all_duplicates_in_an_array()
    gen_candy()
    gen_largest_number()
    gen_sort_an_array()
    gen_kth_missing_positive_number()
    gen_find_the_town_judge()
    gen_valid_mountain_array()
    gen_monotonic_array()
    gen_toeplitz_matrix()
    gen_reshape_the_matrix()
    gen_max_area_of_island()
    gen_find_pivot_index()
    gen_running_sum_of_1d_array()
    gen_number_of_good_pairs()
    gen_check_if_two_string_arrays_are_equivalent()
    gen_maximum_nesting_depth_of_the_parentheses()
    gen_split_a_string_in_balanced_strings()
    gen_count_the_number_of_consistent_strings()
