attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D heightMap;

varying vec2 vTextureCoord;

void main() {

	vec3 offset=aVertexNormal*0.5*texture2D(heightMap, aTextureCoord).g;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);	

	vTextureCoord = aTextureCoord;
}

