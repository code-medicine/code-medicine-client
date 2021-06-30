
// class Left_sidebar extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             search_toggle: '',
//             chat_toggle: '',
//             reception_toggle: '',
//             procedures_toggle: '',
//             pricing_toggle: '',
//             current_page: 'Home',

//             list: LIST
//         }
//     }
//     componentDidMount() {
//         // console.log('my user',this.props.active_user);

//     }

//     on_item_click = (item) => {
//         if (this.state.list[item].nested) {
//             const routes_list = this.state.list;
//             routes_list[item].open = !routes_list[item].open;
//             this.setState({ list: routes_list })
//         }
//     } //this.setState({ [e.target.id]: this.state[e.target.id] === '' ? 'nav-item-open' : '' });

//     render() {
//         const first_name_first_letter = this.props.active_user.first_name.charAt(0).toUpperCase()
//         const first_name_rest = this.props.active_user.first_name.length > 1 ? this.props.active_user.first_name.substring(1) : ''
//         const last_name_first_letter = this.props.active_user.last_name.charAt(0).toUpperCase()
//         const last_name_rest = this.props.active_user.last_name.length > 1 ? this.props.active_user.last_name.substring(1) : ''

//         return (
//             <div className="sidebar sidebar-dark sidebar-main sidebar-fixed sidebar-expand-md" >

//                 <div className="sidebar-mobile-toggler text-center">
//                     <Link to={"#"} onClick={() => this.props.left_sidebar_controls(false)} className="sidebar-mobile-main-toggle">
//                         <i className="icon-arrow-left8"></i>
//                     </Link>
//                     Menu
//                     <Link to={RC.BASE_URL} className="sidebar-mobile-expand">
//                         <i className="icon-screen-full"></i>
//                         <i className="icon-screen-normal"></i>
//                     </Link>
//                 </div>

//                 <div className="sidebar-content">
//                     <div className="sidebar-user background_custom_left_side_bar d-flex align-items-center" style={{ height: '25vh' }}>
//                         <div className="card-body">
//                             <div className="media d-flex align-items-center">
//                                 {this.props.left_sidebar ? <Logo width="0.5in" height="0.5in" /> : ''}
//                                 <div className="media-body d-flex flex-column justify-content-center align-items-center">
//                                     <Avatar
//                                         className={`text-info bg-white h3 p-3 btn btn-light`}
//                                         style={{ height: '80px', width: '80px' }}
//                                         component="button"
//                                         onClick={() => this.props.history.push(RC.PROFILE)}>
//                                         {first_name_first_letter}{last_name_first_letter}
//                                     </Avatar>
//                                     <div className={``}>
//                                         <Link className={`text-shadow text-white`} to={RC.PROFILE}>
//                                             {first_name_first_letter}{first_name_rest} {last_name_first_letter}{last_name_rest}
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="card card-sidebar-mobile">
//                         <ul className="nav nav-sidebar">

//                             {
//                                 this.props.settings.left_sidebar_collapsed ?
//                                     Object.keys(this.state.list).map((item, i) => {
//                                         const elem = this.state.list[item];
//                                         return <li className={`nav-item ${elem.nested ? `nav-item-submenu ${elem.open ? 'nav-item-open' : ''}` : ''}`} key={i}>
//                                             <Link to={elem.url} className="nav-link bounceInLeft animated" onClick={() => this.on_item_click(item)}>
//                                                 <i className={elem.icon_class}></i>
//                                                 <span>{elem.title}</span>
//                                             </Link>
//                                             {
//                                                 elem.nested ?
//                                                     <ul className="nav nav-group-sub" data-submenu-title={item} style={{ display: elem.open ? 'block' : 'none' }}>
//                                                         {
//                                                             elem.routes.map((nitem, ni) => {
//                                                                 return <li className="nav-item" key={ni}>
//                                                                     <Link to={nitem.url} className={`nav-link ${nitem.active ? '' : 'disabled'}`}>
//                                                                         {nitem.title}
//                                                                         {
//                                                                             nitem.active ?
//                                                                                 '' :
//                                                                                 <span className="badge bg-transparent align-self-center ml-auto">
//                                                                                     Coming soon
//                                                                             </span>
//                                                                         }

//                                                                     </Link>
//                                                                 </li>
//                                                             })
//                                                         }
//                                                     </ul> : ''
//                                             }
//                                         </li>
//                                     }) :
//                                     Object.keys(this.state.list).map((item, i) => {
//                                         const elem = this.state.list[item];
//                                         return <Fragment key={i}>
//                                             <li className={`nav-item-header`}>
//                                                 {elem.title}
//                                             </li>
//                                             {
//                                                 elem.nested ?
//                                                     elem.routes.map((nitem, ni) => {
//                                                         return <li className={`nav-item`} key={ni}>
//                                                             <Link to={nitem.url} className={`nav-link ${nitem.active ? '' : 'disabled'}`}>
//                                                                 <i className={nitem.icon_class}></i>
//                                                                 {nitem.title}
//                                                                 {nitem.active ? '' : <span className="badge bg-transparent align-self-center ml-auto">Coming soon</span>}
//                                                             </Link>
//                                                         </li>
//                                                     }) :
//                                                     <li className="nav-item">
//                                                         <Link to={elem.url} className={`nav-link ${elem.active ? '' : 'disabled'}`}>
//                                                             <i className={elem.icon_class} />
//                                                             {elem.title}
//                                                             {elem.active ? '' : <span className="badge bg-transparent align-self-center ml-auto">Coming soon</span>}
//                                                         </Link>
//                                                     </li>
//                                             }
//                                         </Fragment>
//                                     })
//                             }
//                         </ul>
//                     </div>


//                 </div>
//                 <button className={`btn `} onClick={() => console.log('STORE', store.getState())}>
//                     Store
//                 </button>

//             </div >
//         );
//     }
// }
// function map_state_to_props(state) {
//     return {
//         active_user: state.active_user,
//         left_sidebar: state.left_sidebar,
//         settings: state.settings,
//     }
// }
// export default connect(map_state_to_props, {
//         set_active_user,
//         left_sidebar_controls,
//         toggle_sidebar_menu_collapse
//     }
// )(withRouter(Left_sidebar));


import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import * as RC from 'router/constants';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { set_active_user, left_sidebar_controls, toggle_sidebar_menu_collapse } from 'redux/actions';
import 'styles/animations/animations.css';
import './left_sidebar.css'
import LIST from './menu-list';
import store from 'redux/store';


function LeftSideBar(props) {
    const [list, setList] = React.useState(LIST);

    const onItemClick = (item) => {
        if (list[item].nested) {
            const routes_list = { ...list };
            routes_list[item].open = !routes_list[item].open;
            setList(routes_list)
        }
    }


    const first_name_first_letter = props.active_user.first_name.charAt(0).toUpperCase();
    const first_name_rest = props.active_user.first_name.length > 1 ? props.active_user.first_name.substring(1) : '';
    const last_name_first_letter = props.active_user.last_name.charAt(0).toUpperCase();
    const last_name_rest = props.active_user.last_name.length > 1 ? props.active_user.last_name.substring(1) : '';

    const avatar_size = props.open ? '80px' : '40px';
    return (
        <div>
            <div className={`background_custom_left_side_bar d-flex justify-content-center align-items-center flex-column`} style={{ height: '25vh' }}>
                <Avatar
                    className={`text-info bg-white h3 p-3 btn btn-light ${props.open ? 'zoomIn animated' : 'fadeInDownBig animated'}`}
                    style={{ height: avatar_size, width: avatar_size }}
                    component="button"
                    onClick={() => props.history.push(RC.PROFILE)}>
                    {first_name_first_letter}{last_name_first_letter}
                </Avatar>
                {
                    <div className={props.open ? 'zoomIn animated' : 'zoomOut animated'}>
                        <Link className={`text-shadow text-white`} to={RC.PROFILE}>
                            {first_name_first_letter}{first_name_rest} {last_name_first_letter}{last_name_rest}
                        </Link>
                    </div>
                }
            </div>

            <List className={`zoomIn animated`}>
                {
                    props.settings.left_sidebar_collapsed ?
                        Object.keys(list).map((item, i) => {
                            const elem = list[item];
                            return <div key={i}>
                                <ListItem button className={`text-white`} selected={window.location.pathname === elem.url} component={Link} to={elem.url} onClick={() => onItemClick(item)}>
                                    <ListItemIcon className={`text-white`}>{elem.icon_class}</ListItemIcon>
                                    <ListItemText primary={elem.title} primaryTypographyProps={{ variant: 'body2' }} />
                                    {elem.nested ? (elem.open ? <ExpandLess /> : <ExpandMore />) : ''}
                                </ListItem>
                                {
                                    elem.nested ?
                                        <Collapse in={elem.open} timeout="auto" unmountOnExit>
                                            <Divider />
                                            <List component="div" className={`bg-slate-800`} disablePadding>
                                                {
                                                    elem.routes.map((nitem, ni) => {
                                                        return <ListItem key={ni * i} button disabled={!nitem.active} selected={window.location.pathname === nitem.url} className={`text-white`} component={Link} to={nitem.url}>
                                                            <ListItemIcon className={`text-white`}>{nitem.icon_class}</ListItemIcon>
                                                            <ListItemText primary={nitem.title} primaryTypographyProps={{ variant: 'body2' }} />
                                                        </ListItem>
                                                    })
                                                }
                                            </List>
                                            <Divider />
                                        </Collapse> : ''
                                }
                            </div>
                        }) : ''
                }
            </List>
            <button className={`btn `} onClick={() => console.log('STORE', store.getState())}>
                Store
            </button>
        </div>
    )
}

function map_state_to_props(state) {
    return {
        active_user: state.active_user,
        left_sidebar: state.left_sidebar,
        settings: state.settings,
    }
}
export default connect(map_state_to_props, {
    set_active_user,
    left_sidebar_controls,
    toggle_sidebar_menu_collapse
}
)(withRouter(LeftSideBar));