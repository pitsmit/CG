import math

canvas = 'canvas'

def main():
    amount_nodes, ln, x, y, color, rc = INPUT()

    if rc == -1:
        return
    
    cords = SearchCords(amount_nodes, ln, x, y)

    otrezki = []
    for i in range(len(cords) - 1):
        p1 = cords[i]
        p2 = cords[i + 1]
        otrezki.append((p1, p2))
    
    otrezki.append((cords[0], cords[-1]))

    for i in range(len(otrezki)):
        CDA(otrezki[i][0][0], otrezki[i][0][1], otrezki[i][1][0], otrezki[i][1][1], color)

    r = len / (2 * math.tan(math.pi / amount_nodes)) # вписанная окружность
    CanonCircle(x, y, color, r)

    r = len / (2 * math.sin(math.pi / amount_nodes)) # описанная окружность
    CanonCircle(x, y, color, r)
    




def INPUT():
    rc = 0
    amount_nodes = int(input("Введите кол-во вершин многоугольника: "))
    ln = int(input("Введите длину ребра многоугольника: "))
    x = int(input("Введите x центра: "))
    y = int(input("Введите y центра: "))
    color = str(input("Введите цвет фигуры: "))

    if amount_nodes < 3 or ln <= 0:
        rc = -1
    
    return amount_nodes, ln, x, y, color, rc


def SearchCords(amount_nodes, ln, x, y):
    angle = 360 / amount_nodes
    
    cords = []
    
    for i in range(amount_nodes):
        xcur = x + ln * math.cos(math.radians(i * angle))
        ycur = y + ln * math.sin(math.radians(i * angle))
        
        cords.append((xcur, ycur))
    
    return cords

def SetRect(x, y, color, r=1):
    ctx = canvas.getContext("2d")
    ctx.fillStyle = color
    ctx.fillRect(math.round(x), math.round(y), r, r)



def CDA(xn, yn, xk, yk, color):
    x = xn
    y = yn

    delta_x = xk - xn
    delta_y = yk - yn

    l = abs(delta_x) > abs(delta_y) if abs(delta_x) else abs(delta_y)

    delta_x /= l
    delta_y /= l

    for i in range(l + 2):
        SetRect(x, y, color, 2)
        x += delta_x
        y += delta_y



def DrawSymPoints(xn, x, yn, y, color):
    rect = (xn + x, (yn + y), 1, 1, color)
    canvas.add(rect)

    rect = (-xn + x, (yn + y), 1, 1, color)
    canvas.add(rect)

    rect = (xn + x, yn - y, 1, 1, color)
    canvas.add(rect)

    rect = (-xn + x, yn - y, 1, 1, color)
    canvas.add(rect)



def CanonCircle(x, y, color, r):
    if (r <= 0):
        return
    border = math.round(x + r)

    for xn in range(x, border + 1):
        yn = y + math.sqrt(r ** 2 - (xn - x) ** 2)
        DrawSymPoints(xn - x, x, yn - y, y, color)

main()