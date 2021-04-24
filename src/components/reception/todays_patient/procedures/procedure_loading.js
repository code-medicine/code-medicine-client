import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';



function ProcedureLoading(props) {
    return (
        <div>
            <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
                <div className={`row`}>
                    <div className={`col-lg-4`}>
                        <Skeleton className="my-2" count={3} height={40} />
                    </div>
                    <div className={`col-lg-4`}>
                        <Skeleton className="my-2" count={3} height={40} />
                    </div>
                    <div className={`col-lg-4`}>
                        <Skeleton className="my-2" count={3} height={40} />
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    )
}
export default ProcedureLoading;