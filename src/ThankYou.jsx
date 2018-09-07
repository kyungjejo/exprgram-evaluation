import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

class ThankYou extends Component{
    
    render() {
        return (
            <div>
                <Header as="h1" textAlign="center">Thank you for the work!</Header>
                <Header as="h3" textAlign="center">Please paste the following code to the box in MTurk page: {this.props.match.params.workerID}</Header>
            </div>
        )
    }
}

export default ThankYou;