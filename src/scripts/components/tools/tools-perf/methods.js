"use strict";
// import { TextEncoder } from 'util';
Object.defineProperty(exports, "__esModule", { value: true });
function forEachCharacter(value, callback) {
    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        // high surrogate
        if (code >= 0xd800 && code <= 0xdbff) {
            if ((i + 1) < value.length) {
                const extra = value.charCodeAt(i + 1);
                // low surrogate
                if ((extra & 0xfc00) === 0xdc00) {
                    i++;
                    callback(((code & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
                }
            }
        }
        else {
            callback(code);
        }
    }
}
function charLengthInBytes(code) {
    if ((code & 0xffffff80) === 0) {
        return 1;
    }
    else if ((code & 0xfffff800) === 0) {
        return 2;
    }
    else if ((code & 0xffff0000) === 0) {
        return 3;
    }
    else {
        return 4;
    }
}
function stringLengthInBytes(value) {
    let result = 0;
    forEachCharacter(value, code => result += charLengthInBytes(code));
    return result;
}
function encodeStringTo(buffer, offset, value) {
    forEachCharacter(value, code => {
        const length = charLengthInBytes(code);
        if (length === 1) {
            buffer[offset++] = code;
        }
        else {
            if (length === 2) {
                buffer[offset++] = ((code >> 6) & 0x1f) | 0xc0;
            }
            else if (length === 3) {
                buffer[offset++] = ((code >> 12) & 0x0f) | 0xe0;
                buffer[offset++] = ((code >> 6) & 0x3f) | 0x80;
            }
            else {
                buffer[offset++] = ((code >> 18) & 0x07) | 0xf0;
                buffer[offset++] = ((code >> 12) & 0x3f) | 0x80;
                buffer[offset++] = ((code >> 6) & 0x3f) | 0x80;
            }
            buffer[offset++] = (code & 0x3f) | 0x80;
        }
    });
    return offset;
}
function encodeString(value) {
    if (value == null)
        return null;
    const buffer = new Uint8Array(stringLengthInBytes(value));
    encodeStringTo(buffer, 0, value);
    return buffer;
}
exports.encodeString = encodeString;
function encodeStringNew(value) {
    if (value == null)
        return null;
    const buffer = new Uint8Array(stringLengthInBytes2(value));
    encodeStringTo2(buffer, 0, value);
    return buffer;
}
exports.encodeStringNew = encodeStringNew;
// new methods
function charLengthInBytes2(code) {
    if ((code & 0xffffff80) === 0) {
        return 1;
    }
    else if ((code & 0xfffff800) === 0) {
        return 2;
    }
    else if ((code & 0xffff0000) === 0) {
        return 3;
    }
    else {
        return 4;
    }
}
function stringLengthInBytes2(value) {
    let result = 0;
    forEachCharacter2(value, code => result = (result + charLengthInBytes2(code)) | 0);
    return result;
}
exports.stringLengthInBytes2 = stringLengthInBytes2;
function encodeStringTo2(buffer, offset, value) {
    forEachCharacter2(value, code => {
        const length = charLengthInBytes2(code) | 0;
        if (length === 1) {
            buffer[offset++] = code;
        }
        else {
            if (length === 2) {
                buffer[offset++] = ((code >> 6) & 0x1f) | 0xc0;
            }
            else if (length === 3) {
                buffer[offset++] = ((code >> 12) & 0x0f) | 0xe0;
                buffer[offset++] = ((code >> 6) & 0x3f) | 0x80;
            }
            else {
                buffer[offset++] = ((code >> 18) & 0x07) | 0xf0;
                buffer[offset++] = ((code >> 12) & 0x3f) | 0x80;
                buffer[offset++] = ((code >> 6) & 0x3f) | 0x80;
            }
            buffer[offset++] = (code & 0x3f) | 0x80;
        }
    });
    return offset;
}
exports.encodeStringTo2 = encodeStringTo2;
function forEachCharacter2(value, callback) {
    const length = value.length | 0;
    const lengthMinusOne = Math.max(0, length - 1) | 0;
    for (let i = 0; i < length; i = (i + 1) | 0) {
        let code = value.charCodeAt(i) | 0;
        // high surrogate
        if (code >= 0xd800 && code <= 0xdbff) {
            if (i < lengthMinusOne) {
                const extra = value.charCodeAt(i + 1) | 0;
                // low surrogate
                if ((extra & 0xfc00) === 0xdc00) {
                    i = (i + 1) | 0;
                    code = (((((code & 0x3ff) << 10) + (extra & 0x3ff)) | 0) + 0x10000) | 0;
                }
                else {
                    continue;
                }
            }
            else {
                continue;
            }
        }
        callback(code);
    }
}
//# sourceMappingURL=methods.js.map