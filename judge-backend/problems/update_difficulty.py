import os
import json

PROBLEMS_DIR = r"c:\Users\daksh\Documents\GitHub\code-judge\judge-backend-fastapi\problems"

# Hard problems as per generate_test_cases.py
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
    "sliding_window_maximum"
}

# Heuristic list of easy problems (common ones) to avoid everything being Medium
EASY_PROBLEMS = {
    "area_of_a_rectangle", "even_or_odd", "sum_of_n_natural_numbers", "find_the_maximum",
    "reverse_string", "simple_array_sum", "sum_of_doubles", "square_of_a_number",
    "cube_of_a_number", "string_length", "smallest_element_in_array", "sum_of_digits",
    "leap_year_check", "ascii_value", "check_for_palindrome", "is_anagram",
    "fibonacci_sequence", "factorial_of_a_number", "power_of_two", "missing_number"
}

def update_difficulty():
    if not os.path.exists(PROBLEMS_DIR):
        print(f"Directory not found: {PROBLEMS_DIR}")
        return

    for filename in os.listdir(PROBLEMS_DIR):
        if not filename.endswith(".json"):
            continue
            
        filepath = os.path.join(PROBLEMS_DIR, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            # Skip if already has difficulty (like our new 20 problems)
            if "difficulty" in data:
                print(f"Skipping {filename} (already has difficulty: {data['difficulty']})")
                continue
                
            problem_id = data.get("id")
            
            if problem_id in HARD_PROBLEMS:
                difficulty = "hard"
            elif problem_id in EASY_PROBLEMS:
                difficulty = "easy"
            else:
                difficulty = "medium"
                
            data["difficulty"] = difficulty
            
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
                
            print(f"Updated {filename} -> {difficulty}")
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    update_difficulty()
