#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
float find_new_x(float kx, float now_x, float x, float width){
    return kx * (now_x - width / 2) + x * (1 - kx);
}


EMSCRIPTEN_KEEPALIVE
float find_new_y(float ky, float now_y, float y, float height){
    return ky * (height / 2 - now_y) + y * (1 - ky);
}