import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


function Skeletons(props) {
    return (
        <div className={`virtual-body navbar-top`}>
            <div className="navbar navbar-expand-md navbar-dark fixed-top">
                <div className="navbar-brand">
                    <p className={`my-2`}>Cancel</p>
                </div>
            </div>
            <div className="page-content">
                <SkeletonTheme color="#292b2c" highlightColor="#4F5950">
                    <div className="sidebar sidebar-dark sidebar-main sidebar-fixed sidebar-expand-md px-2" >
                        <div className="d-flex justify-content-center">
                            <Skeleton className="my-1" circle={true} height={120} width={120} />
                        </div>
                        <Skeleton className="my-2" count={20} height={40} />
                    </div>

                </SkeletonTheme>

                <div className="content-wrapper">
                    <div className="page-header page-header-light">
                        <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
                            <Skeleton className="my-2" count={1} height={40} />
                        </SkeletonTheme>
                    </div>

                    <div className={`content`}>
                        <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
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
        </div>
    )
}
export default Skeletons;