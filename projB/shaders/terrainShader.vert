attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform sampler2D heightmapSampler;

varying vec2 vTextureCoord;
varying float vZCoord;

uniform float minHeight;
uniform float maxHeight;

void main() {
    vec4 offset = texture2D(heightmapSampler, aTextureCoord);

    float zCoord = aVertexPosition.z + offset.z * (maxHeight - minHeight) + minHeight;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y, zCoord, 1.0);

	vTextureCoord = aTextureCoord;
    vZCoord = zCoord;
}