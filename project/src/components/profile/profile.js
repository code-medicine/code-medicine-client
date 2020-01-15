import React, {Component} from 'react';
import Container from '../../shared/container/container';

class Profile extends Component {
    render(){
        return(
            <Container container_type="home">
                <div className="card card-body border-top-info">
                    <div className="text-center">
                        <h6 className="font-weight-semibold mb-0">Profile</h6>
                        <p className="mb-3 text-muted">
                            To edit your profile click the pencile
                        </p>
                    </div>
                </div>
            </Container>
        );
    }
}
export default Profile;