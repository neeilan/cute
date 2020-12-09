const CuteMachine = require('./cute');

// const memory = [];
// const machine = new CuteMachine(memory);

// memory.push(machine.OPS.PRINT, machine.REGISTER_NUMS.RIP);
// memory.push(machine.OPS.PRINT, machine.REGISTER_NUMS.RIP);

// var source = `
//     SETI R0 4 # Comment
//     # More comments
//     PRINT R0
// `;

function lex(source) {
    const tokens = [];
    let currTok = [];
    let inComment = false;

    source.split('').forEach(c => {
        if (c == '\n') {
            inComment = false;
        }
        if (inComment) { return; }
        if (c == '#') {
            inComment = true;
            return;
        } else if ((c == ' ' || c == '\n') && currTok.length > 0) {
            var token = currTok.join('').trim();
            if (!token) return;
            tokens.push(token);
            currTok = [];
        } else if (['\t', ''].indexOf(c) === -1) {
            currTok.push(c);
        }
    });

    if (!inComment) {
        var token = currTok.join('').trim();
        if (!token) return tokens;
        tokens.push(token);
    }

    console.log(tokens);
    return tokens;
}

function assemble(tokens, machine, out={}) {
    const code = [];
    out.disasm = tokens.slice();
    const labels = {}; let labelNum = 1;
    let i = 0;
    while (i < tokens.length) {
        const opStr = tokens[i];
        const op = machine.OPS[opStr];
        if (op === undefined) {
            throw new Error("Parsing error. Expected op at index " + i.toString() + " but got " + opStr);
        }
        let opMeta = machine.OPCODES[op];
        if (opMeta.name === "DATA") {
            const label = tokens[i+1];
            labels[label] = labelNum++;
            const length = parseInt(tokens[i+2]);
            i += length;
        } else if (opMeta.name === "CHDATA") {
            const label = tokens[i+1];
            labels[label] = labelNum++;
            const length = parseInt(tokens[i+2]);
            const str = tokens[i+3].split('');  // TODO: Do we really need size here?? Can be implicit.
            console.log(str)
            for (let j = 0; j < length; j++) {
                tokens.splice(i + j + 3, 0, str[j].charCodeAt(0));
            }
            tokens.splice(i + str.length + 3, 1);

            // Keep original chars in disassembly
            out.disasm = tokens.slice();
            for (let j = 0; j < length; j++) {
                out.disasm[i + j + 3] = str[j];
            }
            console.log(tokens)
            i += length;
        } else if (opMeta.name == "LABEL") {
            const label = tokens[i+1];
            labels[label] = labelNum++;
        } else if (opMeta.name === "AOL") {
            const labelNum = labels[tokens[i+1]];
            if (labelNum === undefined) {
                throw new Error('Usage of undefined label: ' + tokens[i+2].toString());
            }
            tokens[i+1] = labelNum;
        }
        i += opMeta.args + 1;
    }
    i = 0;
    console.log(tokens);
    console.log(labels)

    while (i < tokens.length) {
        const opStr = tokens[i];
        const op = machine.OPS[opStr];
        if (op === undefined) {
            throw new Error("Parsing error. Expected op at index " + i.toString() + " but got " + opStr);
        }

        code.push(op);
        let opMeta = machine.OPCODES[op];
        let j = 0;
        while (j++ < opMeta.args) {
            if (i + j >= tokens.length) {
                throw new Error("Parse runs past code area");
            }
            const arg = tokens[i + j];
            const argAsInt = parseInt(arg);
            if (machine.REGISTER_NUMS[arg] !== undefined) {
                code.push(machine.REGISTER_NUMS[arg]);
            } else if (isNaN(argAsInt) && labels[arg] !== undefined) { // labels cannot start w a number
                code.push( labels[arg] );
            } else {
                code.push( parseInt(arg) );
            }

            if (opMeta.varLen && j === opMeta.args) {
                // Fixed args parsed - last one is number of true args which we parse now
                const numVarArgs = code[code.length-1];
                for (let k = 1; k <= numVarArgs; k++) {
                    const varArg = tokens[i + j  + k];
                    code.push(parseInt(varArg));
                }
                i += numVarArgs;
            }
        }
        i += opMeta.args + 1;
    }
    console.log(labels);
    return code;
}

function memLoad(memory , addr, contents) {
    if (addr + contents.length > memory.length) {
        throw new Error(`Not enough memory to load ${memory.length} bytes at ${addr}`)
    }
    contents.forEach((b, i) => memory[addr + i] = b);
    return memory;
}

function memLoadWillOverwrite(memory , addr, contents) {
    for (let i = 0; i < contents.length; i++) {
        if (addr + contents.length > memory.length) {
            throw new Error(`Not enough memory to load ${memory.length} bytes at ${addr}`)
        }

        if (memory[addr + i] !== 0) {
            return true;
        }
    }
    return false;
}

const Assemble = function(machine, source, loadAtAddr=0) {
    const tokens = lex(source);
    let out = {};
    const asm = assemble(tokens, machine, out);
    memLoad(machine.memory, loadAtAddr, asm);
    return out.disasm;
 };

module.exports = Assemble;

// source = `
//     SETI R0 0
//     SETI R1 1
//     LABEL "ADDANDINCR"
//     ADD R0 R1
//     ADDI R1 1
//     JMPEQIL R1 11 "PRINTRES"
//     JMPL "ADDANDINCR"
//     LABEL "PRINTRES"
//     PRINT R0
//   `;

// SETI R0 0
// SETI R1 1
// LABEL "ADDANDINCR"
// ADD R0 R1
// ADDI R1 1
// JMPEQIL R1 11 "PRINTRES"
// JMPL "ADDANDINCR"
// LABEL "PRINTRES"
// PRINT R0

// let machine = new CuteMachine(new Array(128).fill(0));
// Assemble(machine, source);
// machine.execute();


// SETI R1 14
// SETI R2 16
// SETI R3 17
// JMPGT R1 R2 R3
// PRINT R2
// JMPL DONE
// PRINT R1
// LABEL DONE
// NOOP

