import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggle_sidebar_menu_collapse } from '../../redux/actions';

class Settings extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    menu_style_change = (e) => {
        console.log('settings menu styke change', e.target)
        this.props.toggle_sidebar_menu_collapse();
        console.log('props settings', this.props.settings);
    }

    render() {
        console.log('props settings', this.props.settings);
        return(
                <div className={`row`}>
                    <div className={`col-lg-6`}>
                        <div className={`d-flex`}>
                            <span className={`font-weight-bold mr-3`}>Menu Style</span>
                            <div className="form-check mr-2">
                                <label className="form-check-label">
                                    <div className="uniform-checker">
                                        <span className={this.props.settings.left_sidebar_collapsed ? 'checked' : ''}>
                                            <input type="checkbox"
                                                name="is_active"
                                                id="user_is_active"
                                                onChange={this.menu_style_change}
                                                className="form-input-styled" />
                                        </span>
                                    </div>
                                    Collapsed
                                </label>
                            </div>
                            <div className="form-check mb-0">
                                <label className="form-check-label">
                                    <div className="uniform-checker">
                                        <span className={this.props.settings.left_sidebar_collapsed ? '' : 'checked'}>
                                            <input type="checkbox"
                                                name="is_active"
                                                id="user_is_active"
                                                onChange={this.menu_style_change}
                                                className="form-input-styled" />
                                        </span>
                                    </div>
                                    UnCollapsed (Experimental)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function map_state_to_props(state){
    return {
        settings: state.settings
    }
}

export default connect(map_state_to_props, { toggle_sidebar_menu_collapse })(Settings)