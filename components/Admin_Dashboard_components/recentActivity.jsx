export default function RecentActivity(){
    const recentActivities = [
        {
            activity:"New user registered",
            description:"john.doe@example.com",
            timeFrame:"2 minutes ago"

        },
        {
            activity:"Quiz Completed",
            description:"Quiz: Javascript Basics",
            timeFrame:"5 minutes ago"

        },
        {
            activity:"User updated profiled",
            description:"jane.smith@example.com",
            timeFrame:"10 minutes ago"

        },
        {
            activity:"User updated profiled",
            description:"jane.smith@example.com",
            timeFrame:"10 minutes ago"

        },
        {
            activity:"User updated profiled",
            description:"jane.smith@example.com",
            timeFrame:"10 minutes ago"

        },
    ]
    return(
        <div className="mt-5 rounded-md">
            <h3 className="font-bold text-lg">Recent Activities</h3>
            <div>{recentActivities.map((el,i)=>(
                <div key={i} className="mt-5 flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{el.activity}</p>
                        <p className="font-light">{el.description}</p>
                    </div>
                    <div>
                        <p className="font-light text-gray-400">{el.timeFrame}</p>
                    </div>
                </div>
            ))}</div>
        </div>
    )
}