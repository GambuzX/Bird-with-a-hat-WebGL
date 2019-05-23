#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vZCoord;

uniform sampler2D textureSampler;
uniform sampler2D altimetrySampler;
uniform sampler2D heightmapSampler;

uniform float minHeight;
uniform float maxHeight;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
	vec4 texColor = texture2D(textureSampler, vTextureCoord);
	vec4 altColor = texture2D(altimetrySampler, vec2(0, 1.0-map(vZCoord, minHeight, maxHeight, 0.0, 1.0)));
	
	gl_FragColor = mix(texColor, altColor, 0.5);
}