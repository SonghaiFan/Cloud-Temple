
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
    float time = uTime * 0.4;
    vec3 p = vec3(uv.x * 5.0, uv.y * 4.0 - time * 2.0, time * 0.5);
    float q = fbm(p - vec3(0.0, time, 0.0));
    float center = 0.5;
    float spread = 0.1 + uv.y * 0.4;
    float xDist = abs(uv.x - center);
    float mask = 1.0 - smoothstep(0.0, spread, xDist);
    mask *= smoothstep(0.0, 0.1, uv.y);
    mask *= 1.0 - smoothstep(0.8, 1.0, uv.y);
    float alpha = mask * (0.3 + 0.7 * q);
    vec3 color = mix(vec3(0.5, 0.6, 0.7), vec3(0.9, 0.9, 0.95), uv.y);
    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;
