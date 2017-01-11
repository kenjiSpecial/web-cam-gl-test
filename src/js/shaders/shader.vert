precision highp float;
precision highp int;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
	vUv = vec2( 1.0 - uv.x, uv.y);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
}