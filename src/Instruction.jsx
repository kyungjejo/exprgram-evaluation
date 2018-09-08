import React, { Component } from 'react';
import { Header, Segment, List, Button } from 'semantic-ui-react';
import { Link } from "react-router-dom";

class Instruction extends Component{
    state = { ready: false, timeRemaining: 8 }

    componentDidMount() {
        setTimeout(() => this.setState({ready: true}),8000);
        setInterval(() => this.state.timeRemaining>0 ? this.setState({timeRemaining: this.state.timeRemaining-1}) : '',1000); 
    }

    generateID() {

    }

    render() {
        const { ready, timeRemaining, workerid } = this.state;
        return (
            <div>
                <Header as="h1" textAlign="center">Instruction</Header>
                <Segment className="instruction">
                    In this task, you will be given two expressions: <span id="target">expression A</span> and <span id="evaluate">expression B</span><br/>
                    <span style={{fontWeight:100}}>* Note that <span id="target">expression A</span> is a line from a video and <span id="evaluate">expression B</span> is its related expression.</span><br/><br/>
                    You will be asked to answer the three following questions:<br/>
                    <List ordered>
                        <List.Item>
                            Score in scale of 1-7 on whether <span id="target">expression A</span> and <span id="evaluate">expression B</span> have the same semantic meaning.<br/>
                            For example, if you are given two expressions, 'How are you?' and 'What's up?' which have similar semantic meanings, you should give a high score.
                        </List.Item>
                        <List.Item>
                            Answer either yes or no whether <span id="evaluate">expression B</span> is grammatically correct.
                        </List.Item>
                        <List.Item>
                            Score in scale of 1-7 on whether <span id="evaluate">expression B</span> can be used in the same context of the video that <span id="target">expression A</span> is used in.<br/>
                        </List.Item>
                    </List>
                    To answer the third question, you <strong>must watch the video</strong> that appears on the page.<br/><br/>
                    You need to do 15 tasks, sets of three questions described above.<br/>
                    <strong>Each video is approximately 30 seconds long.</strong><br/>
                </Segment>
                <div className="instruction-set">
                    {/* <div><Input onChange={(e) => this.setState({workerid: e.target.value})} label='ID' placeholder='Please type your ID'></Input></div> */}
                    <div>Please read the instruction first, the button will be active in {timeRemaining} seconds.</div>
                    <Link to={"/expression"}><Button disabled={!ready || workerid===''} primary>Start</Button></Link>
                </div>
            </div>
        )
    }
}

export default Instruction;