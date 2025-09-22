export default function RecentActivity(props){
    
    const  recentA =   props.allActivities
    const recentActivities= recentA.slice(-5)
     

     function timeAgo(dateString) {
  // Convert the string to a Date object (format: DD-MM-YYYY HH:mm:ss)
  const [day, month, yearAndTime] = dateString.split("-");
  const [year, time] = yearAndTime.split(" ");
  const formattedDate = `${year}-${month}-${day} ${time}`; // YYYY-MM-DD HH:mm:ss

  const pastDate = new Date(formattedDate);
  const now = new Date();

  const diffMs = now - pastDate; // difference in ms
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
}

 

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
                        <p className="font-light text-gray-400">{timeAgo(el.createdAt)}</p>
                    </div>
                </div>
            ))}</div>
        </div>
    )
}