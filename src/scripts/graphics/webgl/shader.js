"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Shader {
    constructor(source) {
        this.programs = {};
        if (typeof source === 'string') {
            const index = source.indexOf('// FRAGMENT');
            if (index === -1) {
                throw new Error(`Missing fragment shader separator`);
            }
            source = {
                vertex: source.substring(0, index),
                fragment: source.substring(index),
            };
        }
        this.vertexCode = source.vertex;
        this.fragmentCode = source.fragment;
    }
    compile(gl, defines) {
        defines.sort();
        let definesString = defines.reduce((prev, cur) => prev + cur, '');
        let data = this.programs[definesString];
        if (!data) {
            data = Shader.compileShader(gl, this.vertexCode, this.fragmentCode, defines);
            this.programs[definesString] = data;
        }
        return data;
    }
    static compileShader(gl, vertexCode, fragmentCode, defines) {
        let shaderDefines = defines.reduce((prev, cur) => prev + '#define ' + cur + '\n', '');
        const vertexShader = createWebGLShader(gl, gl.VERTEX_SHADER, shaderDefines + vertexCode);
        const fragmentShader = createWebGLShader(gl, gl.FRAGMENT_SHADER, shaderDefines + fragmentCode);
        const program = gl.createProgram();
        if (!program) {
            throw new Error('Failed to create shader program');
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        const attribs = vertexCode.match(/^attribute [a-zA-Z0-9_]+ ([a-zA-Z0-9_]+)/mg);
        for (var i = 0; i < attribs.length; ++i) {
            const [, name] = /attribute [a-zA-Z0-9_]+ ([a-zA-Z0-9_]+)/.exec(attribs[i]);
            gl.bindAttribLocation(program, i, name);
        }
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to link shader program');
        }
        gl.useProgram(program);
        const uniforms = {};
        const samplers = [];
        for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {
            const info = gl.getActiveUniform(program, i);
            uniforms[info.name] = gl.getUniformLocation(program, info.name);
            if (!uniforms[info.name]) {
                throw new Error(`Failed to get uniform location (${info.name})`);
            }
            if (info.type === gl.SAMPLER_2D) {
                samplers.push(info.name);
            }
        }
        samplers.sort().forEach((name, i) => gl.uniform1i(uniforms[name], i));
        gl.useProgram(null);
        return { program, uniforms };
    }
}
exports.Shader = Shader;
function createWebGLShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error('Failed to create shader');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Shader error');
    }
    return shader;
}
function disposeShaderProgramData(gl, data) {
    try {
        if (gl) {
            gl.deleteProgram(data.program);
        }
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
}
exports.disposeShaderProgramData = disposeShaderProgramData;
//# sourceMappingURL=shader.js.map