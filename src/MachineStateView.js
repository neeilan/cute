import React from 'react';
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import CuteMachine from './cute'

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
        const memory = new Array(128).fill(0);
        this.machine = new CuteMachine(memory, alert);
        this.numAddrsToDisplay = 64;
        this.numBytesPerRow = 8;
        this.state = {
            memory: memory,
            memDisplayStartAddr: 0,
            registers: this.machine.registers,
            source: '',
            asmArea: '',
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

        return <div>
            <Container>
                <Row style={{ textAlign: "center" }}>
                    <Col md={2}>
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
                    </Col>
                    <Col md={9}>
                        <Table bordered responsive size="sm">
                            <tbody>
                                {memTable}
                            </tbody>
                        </Table>
                        <Table responsive size="sm">
                            <tbody>
                                <tr>
                                    <td><Button variant="light">Run</Button></td>
                                    <td><Button variant="light" onClick={() => this.step()}>Step</Button></td>
                                    <td><Button variant="light">ASCII</Button></td>
                                    <td><input type="text" onChange={(e) => this.inspectAddr(e.target.value)} placeholder="Address to inspect" /></td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table responsive>
                            <tbody>
                                <tr>
                                    <td sm={9}>
                                        <textarea placeholder="Assembly Editor"
                                            value={this.state.asmArea}
                                            onChange={e => this.asmAreaEdit(e.target.value)} />
                                    </td>
                                    <td sm={3}><input type="text" placeholder="Load at address" /></td>
                                    <td><Button variant="light">Load</Button></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    };

};

export default MachineStateView;