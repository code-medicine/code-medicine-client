import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


function Skeletons(props) {
    return (
        <div style={{ height: '100vh' }}>
            <SkeletonTheme color="#292b2c" highlightColor="#4F5950">
                <Skeleton height={60} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-3">
                            <div className="d-flex justify-content-center">
                                <Skeleton className="my-1" circle={true} height={120} width={120} />
                            </div>
                            <Skeleton className="my-2" count={20} height={40} />
                        </div>
                        <div className="col-9">
                            <SkeletonTheme color="#E2E8DE" highlightColor="#f2f2f2">
                                <Skeleton className="my-2" height={150} count={1} />
                                <div className="row">
                                    <div className="col-lg-8">
                                        <Skeleton className="my-2" height={300} count={3} />
                                    </div>
                                    <div className="col-lg-4">
                                        <Skeleton className="my-2" height={300} count={4} />
                                    </div>
                                </div>
                            </SkeletonTheme>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    )
}
export default Skeletons;