import React from 'react';
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'

import CuteMachine from './cute'
const Assemble = require('./assembler');

/* props: setMemory(idx, value str) 
          memory : []
*/

const STYLES = {
    ripBgColor: 'lightsalmon',
    ripColor: 'white',

};

class MachineStateView extends React.Component {
    constructor(props) {
        super(props);
        const memory = new Array(1024).fill(0);
        this.machine = new CuteMachine(memory, alert);
        this.numAddrsToDisplay = 48;
        this.numBytesPerRow = 8;
        this.state = {
            memory: memory,
            memDisplayStartAddr: 0,
            registers: this.machine.registers,
            source: '',
            asmArea: '',
            loadAddr: 0,
        };

    }

    memSet(addr, val) {
        val = parseInt(val);
        if (isNaN(val)) { val = 0; }
        this.machine.memory[addr] = val;
        this.setState({ memory: this.machine.memory });
    }

    regSet(num, val) {
        val = parseInt(val);
        if (isNaN(val)) { val = 0; }
        this.machine.registers[num] = val;
        this.setState({ registers: this.machine.registers });
    }

    setLoadAddr(val) {
        val = parseInt(val);
        if (isNaN(val) || val >= this.machine.memory.length) { val = 0; }
        this.setState({ loadAddr: val });
    }

    run() {
        this.machine.execute();
        this.setState({ registers: this.machine.registers, memory: this.machine.memory });
    }

    step() {
        this.machine.executeStep();
        this.setState({ registers: this.machine.registers, memory: this.machine.memory });
    }

    inspectAddr(val) {
        val = parseInt(val);
        if (isNaN(val)) return;
        if (val < 0 || val >= this.machine.memory.length) return;
        this.setState({ memDisplayStartAddr: val });
    }

    asmAreaEdit(e) {
        this.setState({ asmArea: e });
    }

    assemble() {
        try {
            Assemble(this.machine, this.state.asmArea, this.state.loadAddr);
        } catch (e) {
            alert(e);
        }
        this.setState({ registers: this.machine.registers, memory: this.machine.memory });
    }

    memPrev() {
        let newAddr = this.state.memDisplayStartAddr - this.numAddrsToDisplay;
        if (newAddr < 0) newAddr = 0;
        this.setState({ memDisplayStartAddr: newAddr });

    }

    memNext() {
        const newAddr = this.state.memDisplayStartAddr + this.numAddrsToDisplay;
        if (newAddr >= this.machine.memory.length) return;
        this.setState({ memDisplayStartAddr: newAddr });

    }

    availableInstrs() {
        const instrs = [];
        for (const [name, code] of Object.entries(this.machine.OPS)) {
            instrs.push({ name: name, opCode: code });
          }
        return instrs;
    }

    render() {
        const bytes = this.state.memory.slice(this.state.memDisplayStartAddr,
            this.state.memDisplayStartAddr + this.numAddrsToDisplay);
        const memTable = [];
        const ripValueAdj = this.state.registers[this.machine.REGISTER_NUMS.RIP] - this.state.memDisplayStartAddr;
        bytes.forEach((_, i) => {
            if (i % this.numBytesPerRow !== 0) return;
            let cols = [];
            for (let i = 0; i < this.numBytesPerRow; i++) { cols.push(i); }
            memTable.push(
                <tr>
                    <td style={{ backgroundColor: 'cornsilk' }}>{this.state.memDisplayStartAddr + i}</td>
                    {cols.map(
                        offset => <td key={`mem-${i + offset}`}
                            style={{ backgroundColor: ripValueAdj === i + offset ? STYLES.ripBgColor : '' }}>
                            <input
                                type="text"
                                style={{
                                    width: '100%', border: 'none',
                                    backgroundColor: ripValueAdj === i + offset ? STYLES.ripBgColor : '',
                                    color: ripValueAdj === i + offset ? STYLES.ripColor : ''
                                }}
                                onChange={e => this.memSet(i + offset, e.target.value)}
                                value={bytes[i + offset]}
                                disabled={i + offset + this.state.memDisplayStartAddr >= this.state.memory.length}
                            /> </td>)}
                </tr>
            );
        });

        return <div className="monospaced">  {/* <<  Flip this as needed */}
            <Container>
                <Row style={{ textAlign: "center" }}>
                    <Col md={2}>
                        <Row><Col style={{ marginBottom: '10px' }}><b>CPU</b></Col></Row>
                        <Table bordered responsive size="sm">
                            <tbody>
                                {this.state.registers.map((value, i) => {
                                    const isRip = this.machine.REGISTER_NAMES[i] === 'RIP';
                                    return <tr>
                                        <td>{this.machine.REGISTER_NAMES[i]}</td>
                                        <td key={`mem-${i}`} style={{ backgroundColor: isRip ? STYLES.ripBgColor : '' }}>
                                            <input type="text"
                                                style={{ width: '100%', border: 'none', backgroundColor: isRip ? STYLES.ripBgColor : '' }}
                                                value={value}
                                                onChange={e => this.regSet(i, e.target.value)} /></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                        <Row>
                            <Col>
                                <Button variant="light" onClick={() => this.run()}>Run</Button>
                                <Button variant="light" onClick={() => this.step()}>Step</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={9}>
                        <Row><Col style={{ marginBottom: '10px' }}><b>Memory</b></Col></Row>
                        <Table bordered responsive size="sm">
                            <tbody>
                                {memTable}
                            </tbody>
                        </Table>
                        <Row style={{ marginBottom: '5px' }}>
                            <Button variant="light" onClick={() => this.memPrev()}> {'<'} </Button>
                            <Button variant="light" onClick={() => this.memNext()}> {'>'} </Button>
                            <input type="text" style={{ border: 'solid 1px lightgray', marginLeft: '15px', paddingLeft: '10px' }} onChange={(e) => this.inspectAddr(e.target.value)} placeholder="Go to address" />
                        </Row>
                    </Col>
                </Row>

                <hr />

                <Row style={{ textAlign: "center", marginTop: '10px' }}>
                    <Col sm={6}>
                        <Row><Col style={{ marginBottom: '10px' }}><b>Assembler</b></Col></Row>
                        <Row>
                            <textarea placeholder="Assembly Editor"
                                style={{ width: '100%', height: '100%', minHeight: '100px', paddingLeft: '10px', borderColor: 'lightgray' }}
                                value={this.state.asmArea}
                                onChange={e => this.asmAreaEdit(e.target.value)} />
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <InputGroup style={{ marginTop: '5px' }}>
                                    <FormControl
                                        onChange={(e) => this.setLoadAddr(e.target.value)}
                                        placeholder="Custom load address"
                                    />
                                    <InputGroup.Append>
                                        <Button onClick={() => this.assemble()}>Assemble</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Col>


                    <Col sm={6}>
                        <Row><Col style={{ marginBottom: '10px' }}><b>Instruction Set</b></Col></Row>
                        <Row>
                            <Col sm={12} style={{ overflowY: 'scroll' }}>
                                <h5>
                                    { this.availableInstrs().map(instr => <><Badge pillow variant="secondary">{instr.name}</Badge>{' '}</> )}
                                </h5>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                <Row><hr /></Row>


            </Container>
        </div >
    };

};

export default MachineStateView;