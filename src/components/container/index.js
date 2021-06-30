
// class Container extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             authenticated: false,
//             loading: true,
//         }
//     }

//     componentDidMount(){
//         // console.log('location container', window.location.pathname)
//         const token = localStorage.getItem('user');
//         if (token) {
//             UsersSearchByToken(token).then(res => {
//                 this.props.set_active_user(res.data.payload);
//                 this.props.fetch_doctors();
//                 this.props.fetch_procedures_list();
//                 this.setState({ loading: false, authenticated: true });
//             }).catch(err => {
//                 console.log(err)
//                 localStorage.clear()
//                 localStorage.setItem('cached-path', window.location.pathname)
//                 this.props.set_active_user({})
//                 this.setState({ loading: false });
//             })
//         }
//         else {
//             this.setState({ loading: false, authenticated: false })
//         }
//     }
//     render() {

//         console.log('container type', this.props.container_type, 'authenticated', this.state.authenticated)
//         if (this.state.loading){
//             return (
//                 <Skeletons />
//             )
//         }
//         return (
//             this.props.container_type && !_.isEmpty(this.props.active_user)? 

//                 <div className={`virtual-body navbar-top ${this.props.left_sidebar ? (window.innerWidth >= 500 ? 'sidebar-xs' : 'sidebar-mobile-main') : ''}`}
//                 // style={{backgroundImage: `url(${BACKGROUND})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition:'center'}}
//                 >
//                     <Header />
//                     <div className="page-content">

//                         <Leftsidebar />

//                         <div className="content-wrapper">

//                             {/* {page_header? <Pageheader /> : ''} */}

//                             <div className={`content`}>
//                                 {
//                                     this.props.children
//                                 }
//                             </div>
//                             <Footer />
//                         </div>
//                     </div>
//                 </div> :

//                 <div className={`virtual-body d-flex justify-content-center align-items-center background_custom`}>
//                 {
//                     this.props.children
//                 }
//             </div>
//         );
//     }
// }

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, CssBaseline, Typography, Divider, IconButton, Menu, MenuItem, Backdrop, CircularProgress } from '@material-ui/core';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, AccountCircleRounded, PersonRounded } from '@material-ui/icons';
import { LeftSideBar, Skeletons } from 'components';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { set_active_user, fetch_doctors, fetch_procedures_list } from '../../redux/actions';
import './container.css'
import 'styles/animations/animations.css'
import { LogoutRequest, UsersSearchByToken } from 'services/queries';
import _ from 'lodash'
import { Ucfirst } from 'utils/functions';
import { LOGIN_URL, PROFILE, SETTINGS } from 'router/constants';
import notify from 'notify';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // background: '#292b2c'
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Container(props) {

    const { set_active_user, fetch_doctors, fetch_procedures_list } = props;

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [logoutLoading, setLogoutLoading] = React.useState(false);
    const [authenticated, setAuthenticated] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const openMenu = Boolean(anchorEl);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (e) => {
        console.log('e',e.target.id)
        setAnchorEl(null);
        const { id } = e.target;
        if (id === "1") {
            // profile
            console.log('route profile')
            props.history.push(PROFILE)
        }
        else if (id === "2") {
            // settings
            props.history.push(SETTINGS)
        }
        else if (id === "3") {
            //logout
            onLogoutClick();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('user');
        if (token) {
            UsersSearchByToken(token).then(res => {
                console.log('fetching data')
                set_active_user(res.data.payload);
                fetch_doctors();
                fetch_procedures_list();
                setLoading(false);
                setAuthenticated(true);
            }).catch(err => {
                console.log(err)
                localStorage.clear()
                localStorage.setItem('cached-path', window.location.pathname)
                set_active_user({})
                setLoading(false);
            })
        }
        else {
            setLoading(false);
            setAuthenticated(false);
        }
    }, [set_active_user, fetch_doctors, fetch_procedures_list])

    
    const onLogoutClick = () => {
        setLogoutLoading(true);
        LogoutRequest().then(res => {
            if (res.data.status === true) {
                localStorage.clear()
                notify('success', '', res.data.message)
                setTimeout(() => {
                    setLogoutLoading(false);
                    props.history.push(LOGIN_URL)
                }, 1000);
            }
            else {
                setLogoutLoading(false);
                notify('error', '', res.data.message)
            }

        }).catch(err => {
            setLogoutLoading(false);
            notify('error', '', err)
        })


    }

    console.log('authenticated', authenticated);

    if (loading) {
        return (
            <Skeletons />
        )
    } else {
        if (props.container_type && !_.isEmpty(props.active_user)) {
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        className={`${clsx(classes.appBar, { [classes.appBarShift]: open })} bg-dark`}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, { [classes.hide]: open, })}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap style={{flexGrow: 1}}>
                                Code medicine
                            </Typography>
                            <div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircleRounded />
                                </IconButton>
                                {/* <Chip 
                                    color="inherit"
                                    avatar={<Avatar><AccountCircleRounded /></Avatar>} 
                                    label={Ucfirst(props.active_user.first_name)}
                                    onClick={handleMenu}
                                /> */}
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleMenuClose} disabled >
                                        <div className={`d-flex justify-conent-end mr-3`}>
                                            <PersonRounded fontSize="small" className={`mr-2`} />
                                            <Typography variant="subtitle2">{Ucfirst(props.active_user.first_name)}</Typography>
                                        </div>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem id={1} onClick={handleMenuClose}>Profile</MenuItem>
                                    <MenuItem id={2} onClick={handleMenuClose}>Settings</MenuItem>
                                    <Divider />
                                    <MenuItem id={3} onClick={handleMenuClose}>Logout</MenuItem>
                                </Menu>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        className={clsx(classes.drawer, { [classes.drawerOpen]: open, [classes.drawerClose]: !open })}
                        classes={{
                            paper: `${clsx({ [classes.drawerOpen]: open, [classes.drawerClose]: !open })} bg-dark`,
                        }}
                    >
                        <div className={classes.toolbar}>
                            <IconButton onClick={handleDrawerClose} className={`text-white`}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                        <Divider />
                        <LeftSideBar open={open} />
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {
                            props.children
                        }
                    </main>
                    <Backdrop className={classes.backdrop} open={logoutLoading} onClick={() => console.log('loading please wait...')}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            );
        } else {
            return (
                <div className={`virtual-body d-flex justify-content-center align-items-center background_custom`}>
                    {
                        props.children
                    }
                </div>
            )
        }
    }
}

function map_state_to_props(state) {
    return {
        left_sidebar: state.left_sidebar,
        active_user: state.active_user,
        
    }
}
export default connect(map_state_to_props, {
    set_active_user,
    fetch_doctors,
    fetch_procedures_list,
})(withRouter(Container));