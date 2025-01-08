precision highp float;

uniform float u_zoom;
uniform float u_offsetX;
uniform float u_offsetY;

int mandelbrot(vec2 c) {
  vec2 z = vec2(0.0, 0.0);
  int iterations = 0;
  const int maxIterations = 10000;
  for (int i = 0; i < maxIterations; i++) {
    if (length(z) > 2.0) {
      break;
    }
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    iterations++;
  }
  return iterations;
}

vec3 colorScheme(int iterations) {
  float t = float(iterations) / 10000.0;

  if (iterations == 10000) {
      return vec3(0.0, 0.0, 0.0);
  }

  float smoothT = log(float(iterations)) / log(10000.0);

  float r = 0.5 + 0.5 * sin(0.1 + smoothT * 6.28);  // Красный
  float g = 0.5 + 0.5 * sin(2.1 + smoothT * 6.28);  // Зеленый
  float b = 0.5 + 0.5 * sin(4.1 + smoothT * 6.28);  // Синий

  return vec3(r, g, b);
}

void main(void) {
  vec2 c = (gl_FragCoord.xy / vec2(512.0, 512.0) * 4.0 - vec2(2.0, 2.0));
  c = c * u_zoom + vec2(u_offsetX, u_offsetY);

  int iterations = mandelbrot(c);
  vec3 color = colorScheme(iterations);
  gl_FragColor = vec4(color, 1.0);
}
