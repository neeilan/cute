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
class MachineStateView extends React.Component {
    constructor(props) {
        super(props);
        const memory = new Array(128).fill(0);
        this.machine = new CuteMachine(memory, alert);
        this.numAddrsToDisplay = 32;
        this.state = {
            memory : memory,
            memDisplayStartAddr : 0,
            registers : this.machine.registers,
            source : '',
        };
    
    }

    memSet(addr, val) {
        val = parseInt(val);
        if (isNaN(val)) { val = 0; }
        this.machine.memory[addr] = val;
        this.setState({ memory : this.machine.memory });
    }

    regSet(num, val) {
        val = parseInt(val);
        if (isNaN(val)) { val = 0; }
        this.machine.registers[num] = val;
        this.setState({ registers : this.machine.registers });
    }

    step() {
        this.machine.executeStep();
        this.setState({ registers : this.machine.registers, memory: this.machine.memory });
    }

    render() {
        const bytes = this.state.memory.slice(this.state.memDisplayStartAddr, 
            this.state.memDisplayStartAddr + this.numAddrsToDisplay);
        const memTable = [];
        const ripValueAdj = this.state.registers[this.machine.REGISTER_NUMS.RIP] - this.state.memDisplayStartAddr;
        bytes.forEach((_, i) => {
            if (i % 4 !== 0) return;
            memTable.push(
                <tr>
                    <td><b>{i}</b></td>
                    {[0, 1, 2, 3].map(
                        offset => <td key={`mem-${i+offset}`}>
                            <input style={{width:'100%'}}
                                type="text" 
                                onChange={e => this.memSet(i + offset, e.target.value)}
                                value={bytes[i + offset]}
                                style={{ backgroundColor: ripValueAdj === i + offset ? 'red' : '' }}
                                /> </td>)}
                </tr>
            );
        });

        return <div>
            <Container>
                <Row style={{textAlign: "center"}}>
                    <Col md={2}>
                        <Table bordered responsive size="sm">
                            <tbody>
                                {this.state.registers.map((value, i) => {
                                    return <tr>
                                        <td>{this.machine.REGISTER_NAMES[i]}</td>
                                        <td key={`mem-${i}`}><input type="text"
                                            style={{width:'100%'}}
                                            value={value}
                                            onChange={e => this.regSet(i, e.target.value)}/></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={6}>
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
                                <td><input type="text" placeholder="Address to inspect"/></td>                                
                            </tr>
                            </tbody>
                        </Table>
                        <Table responsive>
                            <tbody>
                                <tr>
                                <td sm={9}><textarea placeholder="Assembly Editor" onChange={e=>console.log(e.target.value)}></textarea></td>
                                <td sm={3}><input type="text" placeholder="Load at address"/></td>
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