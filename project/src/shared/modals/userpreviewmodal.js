import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import Loading from "../customs/loading/loading";

class UserPreviewModal extends Component {

    render(){
        return(
            <div>
                <Modal visible={this.props.visibility} 
                    onClickBackdrop={this.props.handle_visibility}
                    fade={true}
                    dialogClassName={`modal-dialog modal-lg`}>
                    
                    <div className="modal-header bg-teal-400">
                        User Information
                    </div>
                    <div className="modal-body">
                        <Loading />
                    </div>


                </Modal>
            </div>
        )
    }
}
export default UserPreviewModal