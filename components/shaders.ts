export const smokeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const smokeFragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
  }

  float fbm(vec3 p) {
    float f = 0.0;
    f += 0.5000 * noise(p); p *= 2.02;
    f += 0.2500 * noise(p); p *= 2.03;
    f += 0.1250 * noise(p); p *= 2.01;
    return f;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.55;

    // 基础竖直上升
    float baseRise = time * 1.5;

    // 横向曲线扰动：更细、更灵动的 vapor 曲线
    float curve1 = fbm(vec3(uv.y * 3.0 + time * 0.7, uv.x * 4.0, 0.0));
    float curve2 = fbm(vec3(uv.y * 6.0 - time * 0.9, uv.x * 2.5, 2.0));
    float curl   = fbm(vec3(uv.y * 10.0 + time * 1.4, uv.x * 8.0, 4.0));

    float xOffset =
      (curve1 * 2.0 - 1.0) * 0.25 * uv.y +
      (curve2 * 2.0 - 1.0) * 0.35 * pow(uv.y, 1.4) +
      (curl   * 2.0 - 1.0) * 0.20;

    float x = clamp(uv.x + xOffset, 0.0, 1.0);

    // 更细、更高频的 fbm，模拟 vapor 的细烟丝
    vec3 p = vec3(x * 7.0, uv.y * 7.0 + baseRise * 1.6, time * 0.7);
    float q  = fbm(p);
    q       += 0.5 * fbm(p * 2.3 + vec3(0.0, time * 0.8, 1.0));
    q        = clamp(q, 0.0, 1.0);

    float center = 0.5;
    // 更细的竖直烟柱，顶部略微张开
    float spread = 0.03 + pow(uv.y, 2.0) * 0.18;
    float xDist  = abs(x - center);
    float mask   = 1.0 - smoothstep(0.0, spread, xDist);

    // 底部淡入，顶部淡出
    mask *= smoothstep(0.02, 0.18, uv.y);
    mask *= 1.0 - smoothstep(0.65, 0.95, uv.y);

    // alpha：整体更细、更轻，偏 vapor 效果
    float alpha = mask * (0.35 + 0.9 * q) * (0.6 + 0.5 * uv.y) * (1.0 - uv.y * 0.8);

    // 略偏冷一点的灰白色，更接近电子烟 vapor
    vec3 color = mix(vec3(0.72, 0.72, 0.75), vec3(0.96, 0.96, 0.99), uv.y);

    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;
