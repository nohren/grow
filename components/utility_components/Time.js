import React, { useEffect, useRef } from 'react'


export default function Time({ uncheck }) {
    //purpose is central place in app to count time based on frames
    //will trigger a day changed event
    const currentDate = useRef({});
    const dayClosedEvent = useRef({});
    
    useEffect(() => {
        dayClosedEvent.current = new Event('dayClosed');
        //todo get the last seen time stamp from the db
        currentDate.current = new Date();
        let id = setInterval(() => {
            let newDate = new Date();
            if (newDate.getDate() > currentDate.current.getDate() || newDate.getMonth() > currentDate.current.getMonth() || newDate.getFullYear() > currentDate.current.getFullYear()) {
                window.dispatchEvent(dayClosedEvent.current);
                currentDate.current = newDate;
                uncheck();
            }
        }, 1000 * 60)
        return () => clearInterval(id);
    }, [])



    // useFrame(() => {
    //     //this is expensive for the GC - can calulate seconds to midnight on app load? then count instead of init the date object?
    //     let frameDay = new Date().getDay();
    //     if (frameDay > currentDay) {
    //         //trigger event, subcribed trees will receive the event
    //         window.dispatchEvent(dayClosedEvent);
    //         setCurrentDay(frameDay);
    //         uncheck();
    //     }
    // })

    return (
        <></>
    )
}