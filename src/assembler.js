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
        if (!token) return;
        tokens.push(token);
    }
    console.log(tokens);
    return tokens;
}

function assemble(tokens, machine) {
    const code = [];
    const labels = {}; let labelNum = 1;
    let i = 0;
    while (i < tokens.length) {
        const opStr = tokens[i];
        const op = machine.OPS[opStr];
        if (!op) {
            throw new Error("Parsing error. Expected op at index " + i.toString() + " but got " + opStr);
        }
        let opMeta = machine.OPCODES[op];
        if (opMeta.name == "LABEL") {
            const label = tokens[i+1];
            const target = tokens[i+2];
            labels[label] = labelNum++;
        }
        i += opMeta.args + 1;
    }

    i = 0;
    while (i < tokens.length) {
        const opStr = tokens[i];
        const op = machine.OPS[opStr];
        if (!op) {
            throw new Error("Parsing error. Expected op at index " + i.toString() + " but got " + opStr);

        }

        code.push(op);
        let opMeta = machine.OPCODES[op];

        // TODO: Handle this case
        if (opMeta.varLen) {
            // Variable-length instruction
        }
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
        }
        i += opMeta.args + 1;
    }
    console.log(labels);
    console.log(code);
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
    const asm = assemble(tokens, machine);
    memLoad(machine.memory, loadAtAddr, asm);
    // machine.execute();
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


