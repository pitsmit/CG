def replace_string_in_file(filename, new_str):
    with open(filename, 'r', encoding='UTF8') as file:
        data = [line.rstrip() for line in file]

    for i in range(len(data)):
        if "script" in data[i]:
            data[i] = new_str + '\n'

    with open("./out/" + filename, 'w', encoding='UTF8') as file:
        file.writelines(data)


filename = 'index.html'
new_str = '    <script src="./index.js"></script>'
replace_string_in_file(filename, new_str)

filename = 'degree_researchers.html'
new_str = '    <script src="./degree.js"></script>'
replace_string_in_file(filename, new_str)

filename = 'timer_researchers.html'
new_str = '    <script src="./timer.js"></script>'
replace_string_in_file(filename, new_str)