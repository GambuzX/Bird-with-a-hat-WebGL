#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D chestTexture;

varying vec2 vTextureCoord;

void main() {

	gl_FragColor = texture2D(chestTexture, vTextureCoord);
}