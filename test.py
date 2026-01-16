
s1 = input()
s2 = input()

list_test = s2.split(" ")
out_l = []

if len(list_test) != int(s1):
    print("Invalid Input")
else:
    if len(list_test) == 1:
        print(int(list_test[0]))
    else:
        for i in list_test:
            try:
                out_l.append(int(i))
            except:
                out_l.append(0)
        res = list(set(out_l))
        res = sorted(res, reverse=True)
        print(res[1])