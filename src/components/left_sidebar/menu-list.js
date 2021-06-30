import React from 'react';
import { AccountBalanceRounded, ArrowRightRounded, HomeRounded, ImportContactsRounded, SearchRounded, SettingsRounded } from '@material-ui/icons';
import * as RC from 'router/constants';


const nested_items_icon = <ArrowRightRounded />

const LIST = {
    Dashboard: {
        title: 'Home',
        nested: false,
        icon_class: <HomeRounded />,
        url: RC.BASE_URL,
        active: true,
    },
    Search: {
        title: 'Search',
        nested: true,
        icon_class: <SearchRounded />,
        url: '#',
        open: false,
        active: true,
        routes: [
            {
                title: 'Patients',
                url: RC.BASE_URL,
                icon_class: nested_items_icon,
                active: false,
            },
            {
                title: 'Doctors',
                url: RC.SEARCH_DOCTORS,
                icon_class: nested_items_icon,
                active: true,
            }
        ]
    },
    Reception: {
        title: 'Reception',
        nested: true,
        icon_class: <ImportContactsRounded /> ,
        url: '#',
        open: false,
        active: true,
        routes: [
            {
                title: `Today's Patients`,
                url: RC.RECEPTION_TODAYSPATIIENT,
                icon_class: nested_items_icon,
                active: true,
            },
            {
                title: 'All Appointments',
                url: RC.RECEPTION_VISITS,
                icon_class: nested_items_icon,
                active: true,
            },
            {
                title: 'Procedures',
                url: RC.RECEPTION_PROCEDURES,
                icon_class: nested_items_icon,
                active: true,
            },
            
            {
                title: `Emergency`,
                url: RC.BASE_URL,
                icon_class: nested_items_icon,
                active: false
            },
            {
                title: `Admissions`,
                url: RC.BASE_URL,
                icon_class: nested_items_icon,
                active: false
            },
            {
                title: `Requests`,
                url: RC.BASE_URL,
                icon_class: nested_items_icon,
                active: false
            },
        ]
    },
    Accounts: {
        title: 'Accounts',
        nested: true,
        icon_class: <AccountBalanceRounded />,
        url: '#',
        open: false,
        active: true,
        routes: [
            {
                title: `Day to day`,
                url: RC.PAYMENTS,
                icon_class: nested_items_icon,
                active: true,
            },
            {
                title: `My Payments`,
                url: RC.BASE_URL,
                icon_class: nested_items_icon,
                active: false
            },
            {
                title: `History`,
                url: RC.BASE_URL,
                icon_class: nested_items_icon,
                active: false
            },
        ]
    },
    Settings: {
        title: 'Settings',
        nested: false,
        icon_class: <SettingsRounded />,
        url: RC.SETTINGS,
        active: true,
    },
}

export default LIST;