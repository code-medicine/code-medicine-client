import * as RC from 'router/constants';

const LIST = {
    Dashboard: {
        title: 'Home',
        nested: false,
        icon_class: 'icon-home',
        url: RC.BASE_URL,
        active: true,
    },
    Search: {
        title: 'Search',
        nested: true,
        icon_class: 'icon-search4',
        url: '#',
        open: false,
        active: true,
        routes: [
            {
                title: 'Patients',
                url: RC.BASE_URL,
                icon_class: 'icon-user-plus',
                active: false,
            },
            {
                title: 'Doctors',
                url: RC.SEARCH_DOCTORS,
                icon_class: 'icon-user-tie',
                active: true,
            }
        ]
    },
    Reception: {
        title: 'Reception',
        nested: true,
        icon_class: 'icon-user',
        url: '#',
        open: false,
        active: true,
        routes: [
            {
                title: `Today's Patients`,
                url: RC.RECEPTION_TODAYSPATIIENT,
                icon_class: 'icon-man',
                active: true,
            },
            {
                title: 'All Appointments',
                url: RC.RECEPTION_VISITS,
                icon_class: 'icon-wallet',
                active: true,
            },
            {
                title: 'Procedures',
                url: RC.RECEPTION_PROCEDURES,
                icon_class: 'icon-wallet',
                active: true,
            },
            
            {
                title: `Emergency`,
                url: RC.BASE_URL,
                icon_class: 'icon-warning22',
                active: false
            },
            {
                title: `Admissions`,
                url: RC.BASE_URL,
                icon_class: 'icon-magazine',
                active: false
            },
            {
                title: `Requests`,
                url: RC.BASE_URL,
                icon_class: 'icon-bell3',
                active: false
            },
        ]
    },
    Accounts: {
        title: 'Accounts',
        nested: true,
        icon_class: 'icon-cash3',
        url: '#',
        open: false,
        active: true,
        routes: [
            {
                title: `Day to day`,
                url: RC.PAYMENTS,
                icon_class: 'icon-calendar3',
                active: true,
            },
            {
                title: `My Payments`,
                url: RC.BASE_URL,
                icon_class: 'icon-cash4',
                active: false
            },
            {
                title: `History`,
                url: RC.BASE_URL,
                icon_class: 'icon-history',
                active: false
            },
        ]
    },
    Settings: {
        title: 'Settings',
        nested: false,
        icon_class: 'icon-gear',
        url: RC.SETTINGS,
        active: true,
    },
}

export default LIST;