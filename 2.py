def PLOT(min_x, stop, col_fill, dfdf):
    tmpx = min_x
    for  tmpx in range(min_x, stop + 1):
        cur_color = GetColor(dfdf, tmpx)
        if (cur_color == "white" or cur_color == "#FFFFFF"):
            cur_color = col_fill
        else:
            cur_color = "white"
        SetPixel(dfdf, tmpx, cur_color)



def Swap(startX, endX, startY, endY):
    tmp = endX
    endX = startX
    startX = tmp

    tmp = endY
    endY = startY
    startY = tmp

    return startX, endX, startY, endY


def MakeFLoor(vec, startX, endX, startY, endY):
    startX = Math.floor(vec.startX)
    startY = Math.floor(vec.startY)
    endX = Math.floor(vec.endX)
    endY = Math.floor(vec.endY)

    return startX, endX, startY, endY

def FillFigure(color, edges):
    min_x = FindMinX(edges)

    for i in range(len(edges)):
        startX, endX, startY, endY = edges[i], startX, endX, startY, endY
        if (startY == endY):
            continue
        if (startY > endY):
            startX, endX, startY, endY = Swap(startX, endX, startY, endY)

        s1 = (endX - startX)
        s2 = startY * endX - endY * startX
        s3 = endY - startY

        dfdf = startY; 

        for dfdf in range(startY, endY):
            stop = (dfdf * s1 - s2) / s3
            
            PLOT(min_x, stop, color, dfdf)