import React, { Component } from 'react';
import Container from '../../shared/container/container';
import { connect } from "react-redux";
import { notify, set_active_user, set_active_page } from '../../actions';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts'
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../shared/router_constants';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        const routes = [<Link to={BASE_URL} className="breadcrumb-item">
                        <i className="icon-home2 mr-2"></i> 
                        Home
                    </Link>,<span className="breadcrumb-item active">Dashboard</span>]
        this.props.set_active_page(routes)
    }
    render() {        
        return (
            <Container container_type={'home'}>


                {/* <link href="../../echart/assets/css/components.min.css" rel="stylesheet" type="text/css"></link> */}
                {/* <script src="../../echart/echarts.min.js" async></script>
                <script src="../../echart/bars_tornados.js" async></script> */}

                <div className="row">
                    <div className="col-sm-4" >
                        <div className="card">
                            <div className="card-body">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-8" >

                                            <h1 style={{ color: "#1D67E9", fontSize: '40px' }} >5</h1>
                                            <h5 style={{ marginTop: '-20px' }}>Doctors</h5>
                                        </div>
                                        <div className="col-sm-3" >
                                            <i className="fa fa-stethoscope fa-5x" style={{ paddingTop: "12px", color: '#1D67E9' }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4" >
                        <div className="card">
                            <div className="card-body">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-8" >
                                            <h1 style={{ color: "#D80B0B", fontSize: '40px' }}>28</h1>
                                            <h5 style={{ marginTop: '-20px' }}>Patients Left</h5>
                                        </div>
                                        <div className="col-sm-3" >
                                            <i className="fa fa-heartbeat fa-5x" style={{ paddingTop: "12px", color: '#D80B0B' }}></i>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4" >
                        <div className="card">
                            <div className="card-body">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-8" >
                                            <h1 style={{ color: "#249A1A", fontSize: '40px' }}>12</h1>
                                            <h5 style={{ marginTop: '-20px' }}>Patients Attended</h5>
                                        </div>
                                        <div className="col-sm-3" >
                                            <i className="fa fa-heartbeat fa-5x" style={{ paddingTop: "12px", color: '#249A1A' }}></i>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
               
                <div className="row">
                    <div className="col-sm-8" >
                        <div className="card">
                            <div className="card-header header-elements-inline">
                                <h5 className="card-title" style={{ fontSize: '20px' }}>Patients per doctor</h5>
                                <div className="header-elements">
                                    <div className="list-icons">
                                        <Link to={"#"} className="list-icons-item" data-action="collapse"></Link>
                                        <Link to={"#"} className="list-icons-item" data-action="remove"></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="chart-container">
                                    <ReactEcharts
                                        option={option_patients_per_doctor}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4" >
                        <div className="card">
                            <div className="card-header header-elements-inline">
                                <h5 className="card-title" style={{ fontSize: '20px' }}>Patients Attended</h5>
                                <div className="header-elements">
                                    <div className="list-icons">
                                        <Link to={"#"} className="list-icons-item" data-action="collapse"></Link>
                                        <Link to={"#"} className="list-icons-item" data-action="remove"></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="chart-container">
                                    <ReactEcharts
                                        option={option_patients_attended_percentage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4" >
                        <div className="card">
                            <div className="card-header header-elements-inline">
                                <h5 className="card-title" style={{ fontSize: '20px' }}>Procedures</h5>
                                <div className="header-elements">
                                    <div className="list-icons">
                                        <Link to={"#"} className="list-icons-item" data-action="collapse"></Link>
                                        <Link to={"#"} className="list-icons-item" data-action="remove"></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="chart-container">
                                    <ReactEcharts
                                        option={option_procedures}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8" >
                        <div className="card">
                            <div className="card-header header-elements-inline">
                                <h5 className="card-title" style={{ fontSize: '20px' }}>Patients Attendence History</h5>
                                <div className="header-elements">
                                    <div className="list-icons">
                                        <Link to={"#"} className="list-icons-item" data-action="collapse"></Link>
                                        <Link to={"#"} className="list-icons-item" data-action="remove"></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="chart-container">
                                    <ReactEcharts
                                        option={option_patients_attended_history}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </Container >
        );
    }
}
function map_state_to_props(state) {
    return {
        notify: state.notify,
        active_user: state.active_user,
        active_page: state.active_page,
    }
}
export default connect(map_state_to_props, { notify, set_active_user, set_active_page })(Home);


var option_patients_per_doctor = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['Total', 'Attended']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['Dr. Yasir', 'Dr. Hamad', 'Dr. Shiza', 'Dr. Farukh', 'Dr. Baig']
    },
    series: [
        {
            name: 'Total',
            type: 'bar',
            data: [14, 5, 8, 2, 1]
        },
        {
            name: 'Attended',
            type: 'bar',
            data: [6, 3, 4, 2, 0]
        }
    ]
};


var option_patients_attended_percentage = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
        {
            type: 'gauge',
            detail: { formatter: '{value}%' },
            data: [{ value: 30 }]
        }
    ]
};


var base = +new Date(2020, 1, 1);
var oneDay = 24 * 3600 * 1000;
var date = [];

var data = [10];

for (var i = 1; i < 60; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round(Math.random() * 20) + 10);
}

var option_patients_attended_history = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            name: 'Patients',
            type: 'line',
            symbol: 'none',
            itemStyle: {
                color: '#00338D'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#015BF9'
                }, {
                    offset: 1,
                    color: '#6198F7'
                }])
            },
            data: data
        }
    ]
};

var option_procedures = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'horizontal',
        left: 10,
        data: ['Abc', 'Def', 'Ghi', 'Jkl', 'Mno']
    },
    series: [
        {
            name: 'Procedure',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                { value: 3, name: 'Abc' },
                { value: 8, name: 'Def' },
                { value: 5, name: 'Ghi' },
                { value: 1, name: 'Jkl' },
                { value: 4, name: 'Mno' },
            ]
        }
    ]
};
