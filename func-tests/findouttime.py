def run(filename):
    with open(filename, 'r', encoding='UTF8') as file:
        data = [line.rstrip() for line in file]
    
    res = []

    for i in range(len(data)):
        if (len(data[i]) > 0):
            if "33m" in data[i]:
                data[i] = data[i][5:]
                data[i] = data[i][:-5]
                res.append(data[i])

    with open('report-functesting-latest.txt', 'r+', encoding='UTF8') as f:
        f.seek(0, 2)
        f.write(str(len(res)) + ' Теста\n')
        for i in range(len(res)):
            f.write(str(i) + "  " + str(round(float(res[i]), 4)) + ' мс\n')
                


filename = './func-tests/testres.txt'
run(filename)