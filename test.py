s = input()
if s:
    test_s = s.split(" ")
    nums = [int(x) for x in test_s]
else:
    nums = []

def removeDuplicates(arr:list) -> list:
    out = list(dict.fromkeys(arr))
    return out

unique_nums = removeDuplicates(nums)
if unique_nums:
    print(*unique_nums, sep=' ')


# PythonAnywhere gnomeuser001 pass dakshdtlz564