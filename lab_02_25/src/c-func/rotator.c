#include <emscripten.h>
#include <math.h>

#define M_PI 3.14159265358979323846

EMSCRIPTEN_KEEPALIVE
float find_x(float x, float now_x, float q, float y, float now_y){
    return x + (now_x - x) * cos(q * M_PI / 180) + (now_y - y) * sin(q * M_PI / 180);
}

EMSCRIPTEN_KEEPALIVE
float find_y(float x, float now_x, float q, float y, float now_y){
    return y - (now_x - x) * sin(q * M_PI / 180) + (now_y - y) * cos(q * M_PI / 180);
}