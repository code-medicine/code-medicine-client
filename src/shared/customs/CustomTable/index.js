import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


function customReducer(state, action) {
    // console.log('state', state);
    // console.log('action', action);
    switch (action.type) {
        case 'CHANGE_SORT':
            if (state.column === action.column) {
                return {
                    ...state,
                    data: state.data.reverse(),
                    direction: state.direction === 'ascending' ? 'descending' : 'ascending',
                }
            }

            return {
                column: action.column,
                data: _.sortBy(state.data, [action.column]),
                direction: 'ascending',
            }
        case 'UPDATE_DATA':
            return {
                ...state,
                data: _.sortBy(action.data, [action.column]),
            }
        default:
            throw new Error()
    }
}

function CustomTable(props) {
    const isInitialMount = useRef(true);
    const [state, dispatch] = React.useReducer(customReducer, {
        column: null,
        data: props.rows,
        direction: null,
    })
    const { column, data, direction } = state

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // console.log('component did mount')
        }
        else {
            // console.log('component did update')
            dispatch({ type: 'UPDATE_DATA', data: props.rows },)
        }

    }, [props.rows])

    function isDate(dateStr) {
        return !isNaN(new Date(dateStr).getDate());
    }
    const parse_item = (item) => {
        if (typeof (item) === 'boolean') {
            return item ? <i className={`icon-check2 bg-success`} /> : <i className={`icon-cross2 bg-danger`} />
        }
        else if (typeof (item) === 'string') {
            if (isDate(item)) {
                return moment(item).format('ll')
            }
            else if (item === "") {
                return <i className={`icon-dash`} />
            }
            else {
                return item;
            }
        }
        else {
            if (item === null)
                return <i className={`icon-dash`} />
            return item
        }
    }

    return (
        <Table sortable stackable celled textAlign="center" size="large" collapsing>
            <Table.Header className={`bg-dark`}>
                <Table.Row>
                    {
                        Object.keys(props.headCells).map((item, i) => {
                            return (
                                <Table.HeaderCell key={i}
                                    sorted={column === props.headCells[item].id ? direction : null}
                                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: props.headCells[item].id })}>
                                    {props.headCells[item].label}
                                </Table.HeaderCell>

                            )
                        })
                    }
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    props.loading ?
                        <Table.Row>
                            <Table.Cell colSpan={props.headCells.length} className={`px-0`}>
                                <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
                                    <Skeleton className="mb-1" count={7} height={40} />
                                </SkeletonTheme>
                            </Table.Cell>
                        </Table.Row> : (
                            data.length === 0 ?
                                <Table.Row>
                                    <Table.Cell className={`px-0`} colSpan={props.headCells.length}>
                                        <div className="alert alert-info mt-2 w-100" >
                                            <strong>Info!</strong> No data found.
                                        </div>
                                    </Table.Cell>
                                </Table.Row> :
                                data.map((item, i) => (
                                    <Table.Row key={i}>
                                        {
                                            Object.keys(item).map((cell, k) => {
                                                return (
                                                    <Table.Cell key={k}>
                                                        {
                                                            parse_item(item[cell])
                                                        }
                                                        {
                                                            // console.log('object', item[cell], 'type', typeof (item[cell]))
                                                        }
                                                    </Table.Cell>
                                                )
                                            })
                                        }
                                    </Table.Row>
                                ))
                        )
                }
            </Table.Body>
        </Table>
    )
}

export default CustomTable