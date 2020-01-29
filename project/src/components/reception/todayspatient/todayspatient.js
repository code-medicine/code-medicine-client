import React, { Component } from 'react';
import Container from '../../../shared/container/container'

class Todayspatient extends Component { 

    render() {
        return (
            <Container container_type="todayspatient">
                <button className="btn btn-primary">Todays Patient</button>
            </Container>
        )
    }
}
export default Todayspatient