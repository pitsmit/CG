export function search_centeres(arr) {
    var circles_data = [];
    for (var i = 0; i < arr.length; i++){
        var p1x = arr[i][0][0];
        var p1y = arr[i][0][1];
        var p2x = arr[i][1][0];
        var p2y = arr[i][1][1];
        var p3x = arr[i][2][0];
        var p3y = arr[i][2][1];

        const a = p2x - p1x;
        const b = p2y - p1y;
    
        const c = p3x - p1x;
        const d = p3y - p1y;
    
        const g = 2 * (a * (p3y - p2y) - b * (p3x - p2x));
    
        const e = a * (p1x + p2x) + b * (p1y + p2y);
        const f = c * (p1x + p3x) + d * (p1y + p3y);
    
        const centerX = (d * e - b * f) / g;
        const centerY = (a * f - c * e) / g;
        const radius = Math.sqrt(Math.pow(p1x - centerX, 2) + Math.pow(p1y - centerY, 2));

        circles_data.push([centerX, centerY, radius]);
    }

    return circles_data;
}


export function search_corners(centers_1, centers_2){
    var final_data = [];

    for (var i = 0; i < centers_1.length; i++){
        for (var j = 0; j < centers_2.length; j++){
            var center1_x = centers_1[i][0];
            var center1_y = centers_1[i][1];
            var center1_R = centers_1[i][2];
            var center2_x = centers_2[j][0];
            var center2_y = centers_2[j][1];
            var center2_R = centers_2[j][2];

            var tan = (center2_y - center1_y) / (center2_x - center1_x);

            var radians_on_X = Math.atan(tan);

            var degree_on_X = (180 * radians_on_X) / Math.PI;
            var result_angle = 90 - degree_on_X;

            var res_data = [[center1_x, center1_y, center1_R], [center2_x, center2_y, center2_R], result_angle];
            final_data.push(res_data);
        }
    }
    return final_data;
}


export function search_min_angle(data){
    var res = [[], [], 0];
    var min_angle = data[0][2];
    for (var i = 0; i < data.length; i++){
        if (data[i][2] <= min_angle){
            res = data[i];
            min_angle = data[i][2];
        }
    }

    return res;
}


export function create_circles(arr) {
    var res = [];

    for (var i = 0; i < arr.length; i++){
        for (var j = i + 1; j < arr.length; j++){
            for (var k = j + 1; k < arr.length; k++){
                var p1x = arr[i][0];
                var p1y = arr[i][1];
                var p2x = arr[j][0];
                var p2y = arr[j][1];
                var p3x = arr[k][0];
                var p3y = arr[k][1];
                var circle = [[p1x, p1y], [p2x, p2y], [p3x, p3y]];
                
                if (p1x == p2x && p1x == p3x)
                    continue;
                else if (p1y == p2y && p1y == p3y)
                    continue;
                if (!((p3x - p1x) / (p2x - p1x) == (p3y - p1y) / (p2y - p1y)))
                    res.push(circle);
            }
        }
    }

    return res;
}