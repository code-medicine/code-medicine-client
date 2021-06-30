// import React from 'react'
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, CssBaseline, Typography, Divider, IconButton, List, ListItem } from '@material-ui/core';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import 'styles/animations/animations.css'

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

export default function Skeletons(props) {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
  

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
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
                                <Skeleton className={`bg-light`} variant="circle" height={30} width={30}></Skeleton>
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
                        {/* <LeftSideBar open={open} /> */}
                        <div className={`background_custom_left_side_bar d-flex justify-content-center align-items-center flex-column`} style={{ height: '25vh' }}>
                            <Skeleton className={`bg-light`} variant="circle" height={open? 80:40} width={open? 80:40} />
                            <Skeleton className={`bg-light mt-2`} variant="text" width={open? '50%': '80%'} />
                        </div>
                        <List>
                            {
                                [1,2,3,4,5].map((item,i) => {
                                    return (
                                        <ListItem key={i}>
                                            <Skeleton variant="rect" height={40} width={'100%'} />
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <div className={`container-fluid`}>
                            <div className={`row`}>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={100} width={'100%'} />
                                </div>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={100} width={'100%'} />
                                </div>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={100} width={'100%'} />
                                </div>
                            </div>
                            <div className={`row mt-3`}>
                                <div className={`col-lg-8`}>
                                    <Skeleton variant="rect" height={250} width={'100%'} />
                                </div>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={250} width={'100%'} />
                                </div>
                            </div>
                            <div className={`row mt-3`}>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={120} width={'100%'} />
                                </div>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={120} width={'100%'} />
                                </div>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={120} width={'100%'} />
                                </div>
                            </div>
                            <div className={`row mt-3`}>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={120} width={'100%'} />
                                </div>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={120} width={'100%'} />
                                </div>
                                <div className={`col-lg-4`}>
                                    <Skeleton variant="rect" height={120} width={'100%'} />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            );
}