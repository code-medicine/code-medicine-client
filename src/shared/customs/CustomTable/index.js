import _ from 'lodash';
import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment'

function customReducer(state, action) {
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
        default:
            throw new Error()
    }
}

function CustomTable(props) {
    const [state, dispatch] = React.useReducer(customReducer, {
        column: null,
        data: props.rows,
        direction: null,
    })
    const { column, data, direction } = state

    function isDate(dateStr) {
        return !isNaN(new Date(dateStr).getDate());
    }
    const parse_item = (item) => {
        if (typeof(item) === 'boolean'){
            return item? <i className={`icon-check2 bg-success`}/>:<i className={`icon-cross2 bg-danger`}/>
        }
        else if (typeof(item) === 'string') {
            if (isDate(item)){
                return moment(item).format('ll')
            }
            else if(item === ""){
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
        <Table sortable celled fixed>
            <Table.Header className={`bg-dark`}>
                <Table.Row>
                    {
                        Object.keys(props.headCells).map((item, i) => {
                            return (
                                <Table.HeaderCell
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
                    data.map((item, i) => (
                        <Table.Row key={item.name}>
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
                }
            </Table.Body>
        </Table>
    )
}

export default CustomTable