import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


function TodaysPatientRowLoading(props) {
    return (
        <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
            <div className={`container-fluid`} >
                {/* {this.props.reference} */}
                <div className={`row`}>
                    {/* Patient name and phone number */}
                    <div className={`col-lg-3 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-left-teal-400`}>
                        <Skeleton className="my-1" count={1} height={120}/>
                    </div>
                    {/* Appointment Time column */}
                    <div className={`col-lg-2 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-bottom-sm-2 border-left-teal-400 border-right-teal-400 border-right-2`} >
                        <Skeleton className="my-1" count={1} height={120} />
                    </div>
                    {/* appointment details */}
                    <div className={`col-lg-7 col-md-12 col-sm-12 mt-sm-2`}>
                        {/* Appointment date and time */}
                        <div className="row">
                            <div className="col-12 font-weight-bold h6">
                                <Skeleton className="my-1" count={1} height={15} />
                                <span className="text-muted float-lg-right float-md-right float-left">
                                    <Skeleton className="my-1" count={1} height={15} />
                                </span>
                            </div>
                        </div>
                        {/* Appointment Reason */}
                        <div className={`row`}>
                            <div className={`col-12 h6`}>
                                <span className="font-weight-bold">
                                    <Skeleton className="my-1" count={1} height={15} />
                                </span>
                                <span className={`float-right`}>
                                    <Skeleton className="my-1" count={1} height={15} />
                                </span>
                            </div>
                        </div>
                        {/* Appointment Actions */}
                        <div className="row">
                            <div className="col-12">
                                <Skeleton className="my-1" count={1} height={35}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    )
}
export default TodaysPatientRowLoading;