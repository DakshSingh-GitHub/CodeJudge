n = input()
if n:
    nums = [int(x) for x in n.split(" ")]
else:
    nums = []

print(
    sorted(
        list(
            set(nums)
        )
    )
)
