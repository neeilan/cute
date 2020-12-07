const CuteMachine = require('./cute');

const memory = [];
const machine = new CuteMachine(memory);

memory.push(machine.OPS.PRINT, machine.REGISTER_NUMS.RIP);
memory.push(machine.OPS.PRINT, machine.REGISTER_NUMS.RIP);

var source = `
    SETI R0 4 # Comment
    # More comments
    PRINT R0
`;

function lex(code) {
    const tokens = [];
    let currTok = [];
    let inComment = false;
    code.split('').forEach(c => {
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
    console.log(tokens);
    return tokens;
}

function assemble(tokens) {
    const code = [];
    let i = 0;
    while (i < tokens.length) {
        const opStr = tokens[i];
        const op = machine.OPS[opStr];
        if (!op) {
            throw new Error("Parsing error. Expected op at index " + i.toString());
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
            if (machine.REGISTER_NUMS[arg] !== undefined) {
                code.push(machine.REGISTER_NUMS[arg]);
            } else {
                code.push( parseInt(arg) );
            }
        }
        i += opMeta.args + 1;
    }
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

let tokens = lex(source);
let asm = assemble(tokens);
machine.memory = asm;
machine.execute();


console.log(memLoadWillOverwrite([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 8, [1 ,2, 2, 2, 3]))