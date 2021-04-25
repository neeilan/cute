const PRINT_1_TO_10 = `SETI R0 0
LABEL INCRANDPRINT
ADDI R0 1
PRINT R0
JMPEQIL R0 10 DONE
JMPL INCRANDPRINT
LABEL DONE
`;

const PRINT_SUM_1_TO_10 = `# Print sum of all numbers from 1 to 10
# R0 is total, R1 is loop var
SETI R0 0
SETI R1 1
LABEL ADDANDINCR
ADD R0 R1
ADDI R1 1
JMPEQIL R1 11 PRINTRES
JMPL ADDANDINCR
LABEL PRINTRES
PRINT R0`;

const REC_FACTORIAL = `SETI R0 4  # Calculate factorial(4). Try changing the arg!
PUSH R0
PCALL FACTORIAL
POP R0
PRINT R0
HALT

LABEL FACTORIAL
POP R0          # R0 is the arg
SETI R1 2
JMPLT R0 R1 ret1

# non-trivial factorial
SETI R2 0
ADD R2 R0 # R2 is the result

# find factorial of R0 (arg) - 1
SUBI R0 1
PUSH R0
PCALL FACTORIAL
POP R3

# Answer is [original] R0 * factorial of [original] R0 - 1
MUL R2 R3
PUSH R2
PRET

# trivial case - return 0
LABEL ret1
SETI R0 1
PUSH R0
PRET `;

const DIGIT_ADDER = `# This program adds an arbitrarily long addition expression of single
# digit numbers. To change arg, change the length of the expression
# and change the expression below. For example, try, changing the line
# below to:  CHDATA src 9 3+4+9+1+2
CHDATA src 5 3+4+4

AOL src R0  # R0 has address of src
ADDI R0 1   # next char, so pointing at first char
PUSH R0
PCALL EXPR
POP R0
PRINT R0
HALT

LABEL EXPR
    POP R1      # R1 is address to start at
    LOAD R2 R1  # R2 is char to parse
    PUSH R2
    PCALL PARSENUM
    POP R2      # R2 is parsed LHS

    ADDI R1 1    # R1 is *Operator
    LOAD R3 R1   # R4 is the Operator

    JMPNEQIL R3 43 done # Not an addition (43 is '+')
    ADDI R1 1
    PUSH R1
    PCALL EXPR
    POP R1
    ADD R2 R1

    LABEL done
    PUSH R2
    PRET   

LABEL PARSENUM
    POP R1
    SUBI R1 48
    PUSH R1
    PRET`;
  

module.exports = [{
    name: 'Print nums from 1 to 10',
    source: PRINT_1_TO_10,
},
{
    name: 'Sum numbers from 1 to 10',
    source: PRINT_SUM_1_TO_10
},
{
    name: 'Digit parser and adder',
    source: DIGIT_ADDER
},
{
    name: 'Recursive factorial',
    source: REC_FACTORIAL
}];