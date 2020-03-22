import React from 'react'
import Modal from "react-bootstrap4-modal";
import Loading from "../customs/loading/loading";
import User from '../customs/user/user';
import { Link } from 'react-router-dom';
import '../customs/Animations/animations.css'

function UserPreviewModal(props) {


    function handle_on_click_back_drop() {
        props.on_click_back_drop()
    }

    return (
        <div>
            <Modal visible={props.visibility} 
                onClickBackdrop={() => handle_on_click_back_drop()}
                fade={true}
                dialogClassName={`modal-dialog-centered modal-lg `}
                >
                
                <div className="modal-body">
                    <div className="float-right">
                        <Link onClick={() => handle_on_click_back_drop()} 
                            to="#" 
                            className="btn btn-sm btn-outline bg-teal-400 text-teal-400">
                            <i className="icon-cross3 icon-2x"></i>
                        </Link>
                    </div>
                    {
                        props.modal_props === null? <Loading size={150} />: <User data={props.modal_props} size="large"/> 
                    }
                </div>
                <div className="modal-footer">
                
                </div>
                

            </Modal>
        </div>
    )
}
export default UserPreviewModal;
