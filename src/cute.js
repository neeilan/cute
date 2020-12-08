const REGISTER_NAMES = {
  0 : 'R0',
  1 : 'R1',
  2 : 'R2',
  3 : 'R3',
  4 : 'R4',
  5 : 'RIP',
  6 : 'RSP',
  7 : 'RRA',
};

const REGISTER_NUMS = {
  'R0' : 0,
  'R1' : 1,
  'R2' : 2,
  'R3' : 3,
  'R4' : 4,
  'RIP': 5,
  'RSP' : 6,
  'RRA' : 7,
};

const OPCODES = {
  0: { name: 'HALT', args: 0 },
  1: { name: 'ADD', args: 2 },
  2: { name: 'ADDI', args: 2 },
  3: { name: 'SUB', args: 2 },
  4: { name: 'SUBI', args: 2 },
  5: { name: 'ASSERT', args: 1 },
  6: { name: 'LABEL', args: 1 },
  7: { name: 'JMPL', args: 1 },
  8: { name: 'JMPGT', args: 3 },
  9: { name: 'JMPGTE', args: 3 },
  10: { name: 'JMPEQ', args: 2 },
  11: { name: 'PRINT', args: 1 },
  12: { name: 'SETI', args: 2 },
  13: { name: 'JMPI', args: 1 },
  14: { name: 'JMPEQI', args: 3 },
  15: { name: 'JMPEQIL', args: 3 },
  16: { name: 'PRINTBYTE', args: 1 },
  17: { name: 'DATA', args: 2, varLen: true },
  18: { name: 'PRINTSTRL', args: 1 },
  19: { name: 'PRINTBYTEI', args: 1 },
  20: { name: 'JMPEQL', args: 3 },
  21: { name: 'SET', args: 2 },
  22: { name: 'JMPLT', args: 3 },
  23: { name: 'JMPLTE', args: 3 },
  24: { name: 'LOAD', args: 2 }, // Load Ra Rb - load memory at Rb to Ra
  25: { name: 'PUSH', args: 1 },
  26: { name: 'POP', args: 1 },
  27: { name: 'CALL', args: 1 },
  28: { name: 'RET', args: 0 },
};

const OPS = {
  HALT : 0,
  ADD : 1,
  ADDI : 2,
  SUB : 3,
  SUBI : 4,
  ASSERT : 5,
  LABEL : 6,
  JMPL : 7,
  JMPGT : 8,
  JMPGTE : 9,
  JMPEQ : 10,
  PRINT : 11,
  SETI   : 12,
  JMPI : 13,
  JMPEQI : 14,
  JMPEQIL : 15,
  PRINTBYTE : 16,
  DATA : 17, // DATA HELLOWORLD SIZE  'H' 'E'
  PRINTSTRL : 18, // Print a string at a label
  PRINTBYTEI : 19,
  JMPEQL : 20,
  SET : 21,
  JMPLT: 22,
  JMPLTE : 23,
  LOAD: 24,
  PUSH : 25,
  POP : 26,
  CALL : 27,
  RET : 28,
};

const
    HALT = 0,
    ADD = 1,
    ADDI = 2,
    SUB = 3,
    SUBI = 4,
    ASSERT = 5,
    LABEL = 6,
    JMPL = 7,
    JMPGT = 8,
    JMPGTE = 9,
    JMPEQ = 10,
    PRINT = 11,
    SETI   = 12,
    JMPI = 13,
    JMPEQI = 14,
    JMPEQIL = 15,
    PRINTBYTE = 16,
    DATA = 17, // DATA HELLOWORLD SIZE  'H' 'E'
    PRINTSTRL = 18, // Print a string at a label
    PRINTBYTEI = 19,
    JMPEQL = 20,
    SET = 21,
    JMPLT = 22,
    JMPLTE = 23,
    LOAD = 24,
    PUSH = 25,
    POP = 26,
    CALL = 27,
    RET = 28;

const numArgs = [];
Object.keys(OPCODES).forEach(k => numArgs.push(OPCODES[k].args));

const registers = [0, 0, 0, 0, 0, 0, 0];
const R0 = 0, R1 = 1, R2=2, R3=3, R4=4, RIP=5, RSP=6, RRA=7;


let memory = [
  SETI, R1, 1, JMPI, 8, ADDI, R1, 5, ADDI, R1, 8, PRINT, R1, LABEL, 'ADD3MORE', ADDI, R1, 3, PRINT, R1
];

// Print numbers 1 to 55
memory = [
  SETI, R0, 0, LABEL, "INCRANDPRINT", ADDI, R0, 1, PRINT, R0, JMPEQIL, R0, 55, /*label=*/"DONE", JMPL, "INCRANDPRINT", LABEL, "DONE"
];

// Print sum of all numbers from 1 to 10
// R0 is total, R1 is loop var
// total = 0 ; number we're currently adding = 1
// add NWCA to total
// add 1 to NWCA
// if MWCA = 11, we're done.
// otherwise, go back to step 2
// remmeber this outline, because we will revisit this
memory = [
  SETI, R0, 0,
  SETI, R1, 1,
  LABEL, "ADDANDINCR",
  ADD, R0, R1,
  ADDI, R1, 1,
  JMPEQIL, R1, 11, "PRINTRES",
  JMPL, "ADDANDINCR",
  LABEL, "PRINTRES",
  PRINT, R0
];


// Let's try a hello world
const c =  char =>  char.charCodeAt(0);
memory = [
  DATA, "HW", 11, c('H'), c('e'), c('l'), c('l'), c ('o'), c(' '), c('W'), c('o'), c('r'), c('l'), c('d'),
  SETI, R0, 11, // Length of str
  SETI, R1, 0,  // Curr idx in str
  SETI, R2, 3,  // Address of start of string 
  LABEL, "PRINTCHAR",
  SET, R3, R2, // R3 is a temp we used to calculate start of string + curr index
  ADD, R3, R1,
  PRINTBYTE, R3,
  ADDI, R1, 1,
  JMPEQL, R1, R0, "DONE",
  JMPL, "PRINTCHAR",
  LABEL, "DONE",
  
];

// total = 0
// current_num = 1
// while (current_num < 11) { total = total + current_num; current_num = current_num + 1; }


function _execute(memory, registers, codeStart, codeEnd, oneStep, print) {
  // console.log(memory)

  // Find labels and static data in the code
  const _labels = {};
  const _statics = {};
  let currInstr = codeStart;
  while (currInstr < codeEnd) {
    const opCode = memory[currInstr];
    // console.log(opCode);
    if (opCode === LABEL) {
      _labels[ memory[currInstr + 1] ] = currInstr + numArgs[opCode] + 1;
      currInstr += numArgs[opCode] + 1;
    } else if (opCode === DATA) {
      const label =  memory[currInstr + 1]; 
      _statics[ label ] = currInstr  + 2; // label points to the size byte
      currInstr +=  1 + 2 + memory[ _statics[label] ] ;
    } else {
      currInstr += numArgs[opCode] + 1;
    }
  }
  // console.log(_statics);
  // if (!oneStep && _labels['start'] !== undefined) {
  //   registers[RIP] = _labels['start'];
  // }

  // Execute
  // console.log("Executing...");
  let lhs = 0, rhs = 0; // Utility vars
  while (registers[RIP] < codeEnd) {
    var rip = registers[RIP];
    switch (memory[rip]) {
      case HALT:
        // registers[RIP] += numArgs[memory[rip]] + 1;
        return;
      case PRINT:
        print(registers[memory[rip + 1]]);
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case ADD: // Adds two registers
        registers[memory[rip + 1]] += registers[memory[rip + 2]];
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case ADDI:
        registers[memory[rip + 1]] += memory[rip + 2];
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case SET:
        registers[memory[rip + 1]] = registers[memory[rip + 2]];
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case SETI:
        registers[memory[rip + 1]] = memory[rip + 2];
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case JMPI:
        registers[RIP] = memory[rip + 1];
        break;
      case JMPL:
        registers[RIP] = _labels[memory[rip + 1]];
        break;
      case LABEL:
        // noop
       registers[RIP] += 2;
       break;
      case JMPEQI:
        lhs = registers[memory[rip + 1]];
        rhs = memory[rip + 2];
        if (lhs === rhs) {
          registers[RIP] = memory[rip + 3];
        } else {
        registers[RIP] += numArgs[memory[rip]] + 1;
        }
       break;
      case JMPGT:
        lhs = registers[memory[rip + 1]];
        rhs = registers[memory[rip + 2]];
        if (lhs > rhs) {
          registers[RIP] = _labels[memory[rip + 3]];
        } else {
          registers[RIP] += numArgs[memory[rip]] + 1;
        }
       break;
       case JMPGTE:
        lhs = registers[memory[rip + 1]];
        rhs = registers[memory[rip + 2]];
        if (lhs >= rhs) {
          registers[RIP] = registers[memory[rip + 3]];
        } else {
          registers[RIP] += numArgs[memory[rip]] + 1;
        }
       break;
       case JMPLT:
        lhs = registers[memory[rip + 1]];
        rhs = registers[memory[rip + 2]];
        if (lhs < rhs) {
          registers[RIP] = _labels[memory[rip + 3]];
        } else {
          registers[RIP] += numArgs[memory[rip]] + 1;
        }
        break;
       case JMPLTE:
        lhs = registers[memory[rip + 1]];
        rhs = registers[memory[rip + 2]];
        if (lhs <= rhs) {
          registers[RIP] = registers[memory[rip + 3]];
        } else {
          registers[RIP] += numArgs[memory[rip]] + 1;
        }
       break;
      case JMPEQIL:
        lhs = registers[memory[rip + 1]];
        rhs = memory[rip + 2];
        if (lhs === rhs) {
          registers[RIP] = _labels[memory[rip + 3]];
        } else {
          registers[RIP] += numArgs[memory[rip]] + 1;
        }
       break;
      case JMPEQL:
        lhs = registers[memory[rip + 1]];
        rhs = registers[ memory[rip + 2] ];
        if (lhs === rhs) {
          registers[RIP] = _labels[memory[rip + 3]];
        } else {
          registers[RIP] += numArgs[memory[rip]] + 1;
        }
       break;
      case PRINTBYTEI:
        process.stdout.write(String.fromCharCode( memory[rip + 1]  ) );
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case PRINTBYTE:
        const byteToPrint = memory[registers[ memory[rip+1] ] ]; // Arg is a register contaiing address of byte to print
        console.log( String.fromCharCode( byteToPrint  ) );
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case DATA:
        // Noop
        const label =  memory[rip + 1]; 
        registers[RIP] +=  2 + memory[ _statics[label] ]  +  1 ; // label, size, num of chars, +1 offset
        break;
      case LOAD:
        registers[memory[rip+1]] = memory[registers[memory[rip+2]]];
        console.log(`Load ${memory[registers[memory[rip+2]]]} into R${memory[rip+1]}`);
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case PUSH:
        memory[registers[RSP]++] = registers[memory[rip+1]];
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case POP:
        registers[memory[rip+1]] = memory[--registers[RSP]];
        registers[RIP] += numArgs[memory[rip]] + 1;
        break;
      case CALL:
        // First push RRA to stack
        memory[registers[RSP]++] = registers[RRA];
        // Write addr of next instruction to RRA
        registers[RRA] = registers[RIP] + numArgs[memory[rip]] + 1;
        // Jump to label
        registers[RIP] = _labels[memory[rip + 1]];
        break;
      case RET:
        // Pop stack RA into RRA, then jump there
        const ra = registers[RRA];
        registers[RRA] = memory[--registers[RSP]];
        registers[RIP] = ra;
        break;
    }

    if (oneStep) break;
  } 
}

// execute(0, memory.length);

function CuteMachine(memory, print=console.log) {
  this.registers = [0, 0, 0, 0, 0, 0, 0, 0];
  this.memory = memory;
  this.print=print;

  this.execute = () => _execute(this.memory, this.registers, 0, this.memory.length, false, print);
  this.executeStep = () => _execute(this.memory, this.registers, 0, this.memory.length, true, print);
  this.setIp = (val) => this.registers[ this.REGISTER_NUMS['RIP'] ] = val;

  this.REGISTER_NAMES = REGISTER_NAMES;
  this.REGISTER_NUMS = REGISTER_NUMS;
  this.OPCODES = OPCODES;
  this.OPS = OPS;

};

module.exports = CuteMachine;

const m = [
  DATA, "Src", 3, c('5'), c('+'), c('3'),
  SETI, R0, 5, // R0 is the 'current char' pointer

  // LABEL, 'LOOP',
  // Load current char into R3
  PRINT, R0,
  LOAD, R3, R0,
  PRINT, R3,
  // Is it >= '0' (48) ?
  JMPLT, R3, 48, "NAN", 
  // Is it also <= '9' (57) ?
  JMPGT, R3, 57, "NAN",
  // Working with a number! - print 1
  SETI, R1, 1,
  PRINT, R1,
  JMPL, "DONE",

  LABEL, "NAN",
  SETI, R0, 0,  // Not working with a number - print 0
  PRINT, R0,
  LABEL, "DONE",
  HALT,

];
new CuteMachine(m).execute();
