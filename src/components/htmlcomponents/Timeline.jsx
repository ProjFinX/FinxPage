import React from "react";

const Timeline = (data) => {
  const { TimelineData } = data;

 const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = date.toLocaleDateString(undefined, {
        year : "2-digit",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      {TimelineData?.length > 0 && (
        <div id="content ">
          <ul className="timeline">
            {TimelineData.map((item) => (
              <li className="event" data-date={formatDate(item.MovementTime)}>
                <section>
                  <i className="icon fas fa-map-marker-alt"></i>
                  <div className="details">
                    <span className="title">{item.StageFrom} - {item.StageTo}</span>
                    {/* <span style={{fontSize :"10px"}}>{formatDate(item.MovementTime)}</span> */}
                  </div>
                  <p>
                    {item.UserComment}
                  </p>
                  <div className="bottom">
                    <div>
                     <b>{item.RoleName}</b> 
                    </div>
                    <div>
                      <i>-{item.UserName}</i>
                    </div>
                  </div>
                </section>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

 
};

export default Timeline;
