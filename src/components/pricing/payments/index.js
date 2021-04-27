import Axios from 'axios';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Container from '../../../shared/container/container';
import CustomTable from '../../../shared/customs/CustomTable';
import Button from '../../../elements/button';
import IconButton from '../../../elements/icon-button';
import moment from 'moment';
import { load_todays_appointments, notify, set_active_page } from '../../../actions';
import { APPOINTMENTS_SEARCH_TODAY } from '../../../shared/rest_end_points';
import { shift_timezone_to_pakistan, Ucfirst } from '../../../shared/functions';
import Loading from '../../../shared/customs/loading/loading';
import { BASE_URL } from '../../../shared/router_constants';
import Modal from 'react-bootstrap4-modal';
import Inputfield from '../../../shared/customs/inputfield/inputfield';
import UserPreviewModal from '../../../shared/modals/userpreviewmodal';
import { Collapse } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import { AppointmentsSearchToday, CreateNewPaymentLog, GetUserById, ProcedureSearch, ProcedureSearchByAppointmentId } from '../../../shared/queries';


const headCells = [
    { id: 'doctor_name', numeric: false, disablePadding: false, label: 'Doctor (Appointments)' },
    // { id: 'appointments_count', numeric: true, disablePadding: false, label: 'Appointments' },
    { id: 'consultancy_fee', numeric: true, disablePadding: false, label: 'C-Fee' },
    { id: 'c_doctor_share', numeric: true, disablePadding: false, label: 'Dr. Share' },
    { id: 'c_hospital_share', numeric: true, disablePadding: false, label: 'H. Share' },
    { id: 'procedures_fee', numeric: true, disablePadding: false, label: 'P-Fee' },
    { id: 'p_doctor_share', numeric: true, disablePadding: false, label: 'Dr. Share' },
    { id: 'p_hospital_share', numeric: true, disablePadding: false, label: 'H. Share' },
    { id: 'balance', numeric: true, disablePadding: false, label: 'Bal' },
    { id: 'actions', numeric: true, disablePadding: false, label: 'Actions' },
];

class Payments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            modalLoading: false,
            data: [],
            rawData: [],
            featuredData: {},
            searchDate: moment(new Date()).format('ll'),
            queryInterval: null,
            checkoutModalVisibility: false,
            userPreviewModalVisibility: false,
            showAppointments: false,
            currentCheckout: {
                id: '',
                doctor_name: '',
                appointment_count: 0,
                total_consultancy_fee: 0,
                total_procedures_fee: 0,
                total_amount: 0,
                consultancy_share: 0,
                procedures_share: 0,
                balance: 0,
                appointments: [],
                procedures: [],
            },
            paid_text_input: { value: '', error: false },
            mode: 'checkout',
        }
    }

    componentDidMount() {
        const routes = [<Link to={BASE_URL} className="breadcrumb-item">
            <i className="icon-home2 mr-2"></i>
                            Pricing
                        </Link>, <span className="breadcrumb-item active">Payments</span>]
        this.props.set_active_page(routes)
        this.loadData(this.state.searchDate);
    }

    onCheckoutToggle = (doctor_id, type) => {

        // console.log('data', doctor_id, this.state.data)
        // console.log('featured', this.state.featuredData);
        // console.log('raw', this.state.rawData)

        this.setState({ checkoutModalVisibility: true }, () => {
            const selected_doctor_appointments = this.state.rawData.filter(doc => doc.doctor.id === doctor_id);
            // console.log('selected doctor', this.state.featuredData[doctor_id])
            const payload = {
                id: doctor_id,
                doctor_name: this.state.featuredData[doctor_id].doctor_name,
                appointment_count: parseInt(this.state.featuredData[doctor_id].doctor_name.substring(this.state.featuredData[doctor_id].doctor_name.indexOf("(") + 1, this.state.featuredData[doctor_id].doctor_name.length - 1)),
                total_consultancy_fee: this.state.featuredData[doctor_id].consultancy_fee,
                total_procedures_fee: this.state.featuredData[doctor_id].procedures_fee,
                total_amount: this.state.featuredData[doctor_id].consultancy_fee + this.state.featuredData[doctor_id].procedures_fee,
                consultancy_share: this.state.featuredData[doctor_id].c_doctor_share,
                procedures_share: this.state.featuredData[doctor_id].p_doctor_share,
                balance: this.state.featuredData[doctor_id].balance,
                appointments: selected_doctor_appointments,
                procedures: []
            }
            this.setState({ currentCheckout: payload, mode: type });
            // console.log('payload', payload);
        })

    }

    query = (date) => {
        const that = this;
        AppointmentsSearchToday(date, 'checkout')
            .then(async res => {
                // console.log('search', res.data)
                if (res.data.payload && res.data.payload.length > 0) {
                    const records = {};
                    const data = res.data.payload;
                    let counter = 0;

                    // console.log('data length', data.length)
                    while (true)  {
                        const element = data[counter];
                                
                        await ProcedureSearch(element._id, element.doctor.id, new Date())
                            .then(async _procedures => {

                                /**
                                 * consultancy fee + follow up - discount = charges
                                 */
                                const total = Number(element.appointment_charges.consultancy) + Number(element.appointment_charges.follow_up) - Number(element.appointment_charges.discount);
                                /**
                                 * doctor_share = (charges / 100) * percentage
                                 */
                                const total_c_doctor_share = (total / 100) * Number(element.doctor.consultancy_percentage)

                                const total_procedures_fee = _procedures.data.payload.reduce((a, b) => a + (b['fee'] || 0), 0) - _procedures.data.payload.reduce((a, b) => a + (b['discount'] || 0), 0);
                                const total_p_dr_share = _procedures.data.payload.reduce((a, b) => a + (b['dr_share'] || 0), 0);

                                // console.log('check', element.doctor.id, records[element.doctor.id])
                                if (records[element.doctor.id]) {
                                    const name = records[element.doctor.id].doctor_name;
                                    let a_count = parseInt(name.substring(name.indexOf("(") + 1, name.length - 1));
                                    ++a_count;
                                    /**
                                     * hopital share = total - doctor shares
                                     */
                                    records[element.doctor.id].doctor_name = `${name.substring(0, name.indexOf("(") - 1)} (${a_count})`;
                                    records[element.doctor.id].consultancy_fee += total;
                                    records[element.doctor.id].c_doctor_share += total_c_doctor_share;
                                    records[element.doctor.id].c_hospital_share += total - total_c_doctor_share;
                                    records[element.doctor.id].procedures_fee += total_procedures_fee;
                                    records[element.doctor.id].p_doctor_share += (total_procedures_fee * total_p_dr_share) / 100.00;
                                    records[element.doctor.id].p_hospital_share += total_procedures_fee - ((total_procedures_fee * total_p_dr_share) / 100.00);
                                    counter++;
                                } else {
                                    await GetUserById(element.doctor.id)
                                        .then(async _doctor => {
                                            // console.log('appointments', element);
                                            
                                            records[element.doctor.id] = {
                                                doctor_name: `Dr. ${Ucfirst(element.doctor.first_name)} ${Ucfirst(element.doctor.last_name)} (${1})`,
                                                // appointment_count: 1,
                                                consultancy_fee: total,
                                                c_doctor_share: total_c_doctor_share,
                                                c_hospital_share: total - total_c_doctor_share,
                                                procedures_fee: total_procedures_fee,
                                                p_doctor_share: (total_procedures_fee * total_p_dr_share) / 100.00,
                                                p_hospital_share: total_procedures_fee - ((total_procedures_fee * total_p_dr_share) / 100.00),
                                                balance: _doctor.data.payload.details.payments_balance,
                                                actions: element.is_paid_to_doctor ?
                                                    <IconButton
                                                        className={`btn-sm`}
                                                        color="black"
                                                        onClick={() => that.onCheckoutToggle(element.doctor.id, 'view')}
                                                        icon="icon-eye" /> :
                                                    <IconButton
                                                        className={`btn-sm`}
                                                        onClick={() => that.onCheckoutToggle(element.doctor.id, 'checkout')}
                                                        icon="icon-exit3" />,
                                            };
                                            counter++;
                                        })
                                }
                            })
                        if (counter === data.length) {
                            this.setState({
                                featuredData: records,
                                data: Object.keys(records).map(item => { return records[item] }),
                                rawData: res.data.payload,
                                loading: false
                            });
                            break;
                        }

                    }
                }
                else {
                    this.setState({ featuredData: {}, data: [], rawData: [], loading: false })
                }
            })
            .catch(err => {
                console.log('error', err);
            })
    }

    loadData = (date) => {
        const app_date = new Date(date);
        this.query(app_date);
        const interval = setInterval(() => this.query(app_date), 15000)
        this.setState({ queryInterval: interval })
    }

    showDoctor = (id) => {
        // this.setState({
        //     userPreviewModalVisibility: true
        // }, () => {
        //     Axios.post(USERS_SEARCH_BY_ID, { user_id: id }).then(res => {
        //         this.setState({ user_modal_props: res.data.payload.user })
        //     }).catch(err => {
        //         console.log('failed to fetch user', err)
        //     })
        // })
    }

    onConfirmCheckout = () => {
        this.setState({ modalLoading: true }, () => {
            //this step is to delete the appointments from currentCheckout payload
            const details = {
                ...this.state.currentCheckout,
                appointments: undefined
            }
            CreateNewPaymentLog({
                doctor_id: this.state.currentCheckout.id,
                branch_id: "5e86609dc45b265690b8a25d",
                details: details,
                paid_amount: Number(this.state.paid_text_input.value),
                balance: (this.state.currentCheckout.consultancy_share + 
                            this.state.currentCheckout.procedures_share + 
                            this.state.currentCheckout.balance) - 
                            Number(this.state.paid_text_input.value),
                appointments_ids: this.state.currentCheckout.appointments.map(item => { return item._id }),
            }).then(res => {
                this.setState({ 
                    modalLoading: false, 
                    checkoutModalVisibility: false, 
                    paid_text_input: { value: "", error: false } }, () => {
                    this.props.notify('success', '', res.data.message);
                })
            }).catch(err => {
                this.setState({ modalLoading: false }, () => {
                    this.props.notify('error', '', err.toString());
                })
            })
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.queryInterval);
    }

    render() {
        return (
            <Container type="payments">
                <CustomTable
                    rows={this.state.data}
                    headCells={headCells}
                    loading={this.state.loading}
                    heading={'Doctors'}
                />
                <Modal
                    visible={this.state.checkoutModalVisibility}
                    dialogClassName="modal-lg"
                    onClickBackdrop={() => this.setState({ checkoutModalVisibility: false })}>
                    <div className={`modal-header bg-teal-400`}>
                        <h5>Checkout <span className="h3 mb-0">
                            {this.state.currentCheckout.doctor_name}
                            <Link to={"#"}
                                onClick={() => this.showDoctor(this.state.currentCheckout.doctor_id)}>
                                <i className={`ml-2 mb-1 icon-new-tab text-white`} />
                            </Link>
                        </span>
                        </h5>
                    </div>
                    <div className={`modal-body`}>
                        <div className={`row`}>
                            <div className={`col-md-12`}>
                                <div className={`table-responsive`}>

                                    <table className={`table table-sm table-hover table-bordered mb-0`}>
                                        <thead></thead>
                                        <tbody>
                                            {/* <tr>
                                                <td>Share of {this.state.currentCheckout.doctor_name} (current)</td>
                                                <td>{this.state.currentCheckout.curre}%</td>
                                            </tr> */}
                                            <tr>
                                                <td>Appointments count</td>
                                                <td>{this.state.currentCheckout.appointment_count}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Consultancy Fee</td>
                                                <td>Rs. {this.state.currentCheckout.total_consultancy_fee}/-</td>
                                            </tr>
                                            <tr>
                                                <td>Consultancy Dr. share</td>
                                                <td>Rs. {this.state.currentCheckout.consultancy_share}/-</td>
                                            </tr>
                                            <tr>
                                                <td>Total Procedures Fee</td>
                                                <td>Rs. {this.state.currentCheckout.total_procedures_fee}/-</td>
                                            </tr>
                                            <tr>
                                                <td>Procedures Dr. share</td>
                                                <td>Rs. {this.state.currentCheckout.procedures_share}/-</td>
                                            </tr>
                                            <tr>
                                                <td>Balance</td>
                                                <td>Rs. {this.state.currentCheckout.balance}/-</td>
                                            </tr>
                                            <tr>
                                                <td className={`font-weight-bold h5`}>To be paid</td>
                                                <td>Rs. {this.state.currentCheckout.consultancy_share + this.state.currentCheckout.procedures_share}/- <span className={`text-muted`}>(out of {this.state.currentCheckout.total_amount})</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className={`row mt-2 ${this.state.mode === 'view' ? 'd-none':''}`}>
                            <div className={`col-md-${this.state.mode === 'view' ? 12:6}`}>
                                <pre className={`w-100 text-center mb-0`}>
                                    <h4 className={`mb-0`}>Total: Rs. {this.state.mode === "view" ? 
                                                    this.state.currentCheckout.paid_amount : 
                                                    (this.state.currentCheckout.consultancy_share + 
                                                        this.state.currentCheckout.procedures_share + 
                                                        this.state.currentCheckout.balance)}/-</h4>
                                </pre>                                
                            </div>
                            <div className={`col-md-${this.state.mode === 'view' ? 0:3} d-flex align-items-end`}>
                                {
                                    this.state.mode === 'view' ? '' : <Inputfield
                                        id="paid_text_input"
                                        heading="Paid amount"
                                        placeholder="Enter the paid amount"
                                        parent_classes="mb-0 mb-auto w-100"
                                        className="w-100"
                                        value={this.state.paid_text_input.value}
                                        // error={this.state.paid_text_input.error}
                                        onChange={e => this.setState({ paid_text_input: { value: e.target.value, error: false } })}
                                    />
                                }
                                
                            </div>
                            <div className={`col-md-${this.state.mode === 'view' ? 0:3} d-flex align-items-end`}>
                                {
                                    this.state.mode === 'view' ? '' :
                                        <Button
                                            className={`btn-block py-2`}
                                            icon="icon-exit3"
                                            disabled={this.state.modalLoading}
                                            onClick={() => this.onConfirmCheckout()}>
                                            Checkout
                                        </Button>
                                }
                            </div>
                        </div>


                        <div className={`btn btn-block text-left`} onClick={() => this.setState({ showAppointments: !this.state.showAppointments })}>
                            <i className={`${this.state.showAppointments ? 'icon-subtract' : 'icon-add'}`} /> View Appointments ({moment(new Date(), "YYYY-MM-DDThh:mm:ss").format('ll')})
                        </div>
                        {/* <Link to className={`text-dark`} onClick={() => this.setState({ showAppointments: !this.state.showAppointments })}>
                            <i className={`${this.state.showAppointments? 'icon-subtract':'icon-add'}`} /> Appointments
                        </Link> */}
                        <Collapse isOpen={this.state.showAppointments}>
                            <div className={`table-responsive`}>
                                <table className={`table table-hover table-bordered table-sm mb-0`}>
                                    <thead className={`bg-dark`}>
                                        <tr>
                                            <th>Appointment Time</th>
                                            <th>Consultancy</th>
                                            <th>Follow up</th>
                                            <th>Discount</th>
                                            <th>Total</th>
                                            <th>Consultancy Share</th>
                                            <th>Payment Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.currentCheckout.appointments.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{moment(item.appointment_date, "YYYY-MM-DDThh:mm:ss").format('LT')}</td>
                                                        <td>Rs. {item.appointment_charges.consultancy}/-</td>
                                                        <td>Rs. {item.appointment_charges.follow_up}/-</td>
                                                        <td>Rs. {item.appointment_charges.discount}/-</td>
                                                        <td>Rs. {(
                                                            Number(item.appointment_charges.consultancy) +
                                                            Number(item.appointment_charges.follow_up) -
                                                            Number(item.appointment_charges.discount))}/-</td>
                                                        <td>Rs. {
                                                            ((
                                                                Number(item.appointment_charges.consultancy) +
                                                                Number(item.appointment_charges.follow_up) -
                                                                Number(item.appointment_charges.discount)) / 100) * item.doctor.consultancy_percentage
                                                        }/- ({item.doctor.consultancy_percentage}%)</td>
                                                        <td>{moment(new Date(item.appointment_charges.time), "YYYY-MM-DDThh:mm:ss").format('LT')}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Collapse>
                    </div>
                </Modal>
                {/* <UserPreviewModal
                    visibility={this.state.userPreviewModalVisibility}
                    modal_props={this.state.user_modal_props}
                    on_click_back_drop={() => this.setState({ userPreviewModalVisibility: false, user_modal_props: null })}
                    on_click_cancel={() => this.setState({ userPreviewModalVisibility: false, user_modal_props: null })} /> */}
            </Container>
        )
    }
}
function map_state_to_props(state) {
    return {
        todays_patient: state.todays_patient
    }
}
export default connect(map_state_to_props, { load_todays_appointments, notify, set_active_page })(withRouter(Payments));