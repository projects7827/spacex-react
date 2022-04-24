import React, { useEffect } from 'react';
import "../css/main.css";

const Main = () => {
    const [state, update_state] = React.useState({ "arr": [], "max": adjust_grid(), "min": 0, "response-arr": [], "loader": true, "pageno": 1 })
    var year_arr = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    function adjust_grid() {

        if (window.innerWidth <= 1200 && window.innerWidth > 1024) {
            return 5;
        }
        else if (window.innerWidth <= 1024 && window.innerWidth > 700) {
            return 3;
        }
        else if (window.innerWidth <= 700) {
            return 1;
        }
        else {
            return 7;

        }
    }
    useEffect(() => {

        fetch("https://api.spacexdata.com/v3/launches?limit=100").then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            else {
                alert("something went wrong,please try again");
                window.location.reload();
            }
        }).then(function (data) {
            console.log(data);

            update_state({ ...state, "arr": data, "loader": false })
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    React.useEffect(() => { console.log(state["max"]) }, [state["max"]])

    // function prevnext() {
    //     if (state.max <= state.arr.length) {
    //     }
    //     if (state.min >= 0) {
    //         update_state({ ...state, "min": state["min"] + 8 })
    //     }
    // }
    function pageShift(e) {
        if (e.target.id === "prev") {

            if (state.min >= 0) {
                update_state({ ...state, "min": state["min"] - adjust_grid() })
            }
        }
        if (e.target.id === "next") {


            if (state.max <= state.arr.length - 1) {
                update_state({ ...state, "min": state["max"] + adjust_grid() })
            }
        }


    }

    React.useEffect(() => {
        update_state({ ...state, "response-arr": state["arr"] })
    }, [state["arr"]])
    return (<>
        <div className='prevnext-container'>
            <div id='prev' onClick={pageShift}>Prev</div>
            <div className='pageno'>{state.pageno}</div>
            <div id='next' onClick={pageShift}>Next</div>
        </div>
        <div className='spacex-heading'>SpaceX Launch Programs</div>
        <div className='spacex-container'>
            <div className='spacex-filter'>
                <div className='filter-main-heading'>Filter</div>
                <div className='filter-main-heading2'>Launch Year</div>

                <div className='filter-opt-container'>
                    {year_arr.map(function (val, i) {
                        return (<>
                            <div className='filter-opt'>{val}</div>
                        </>)
                    })}
                </div>
                <div className='filter-main-heading2'>Successful Launch</div>
                <div className='filter-opt-container'>
                    <div className='filter-opt'>True</div>
                    <div className='filter-opt'>False</div>
                </div>
                <div className='filter-main-heading2'>Successful Landing</div>
                <div className='filter-opt-container'>
                    <div className='filter-opt'>True</div>
                    <div className='filter-opt'>False</div>
                </div>
            </div>
            <div className='spacex-item-container'>
                {state.loader === true ? <div className='spacex-loader'>Loading....</div> :
                    state["response-arr"].map(function (val, i) {
                        if (i <= state.max && i >= state.min) {
                            return (<>
                                <div className='spacex-item'>
                                    <img src={val.links.mission_patch} className="launch-img" />
                                    <div className='spacex-inner'>
                                        <div className='launch-heading'>Rocket Name</div>
                                        <div className="launch-value" >{val.rocket.rocket_name}</div>
                                        <div className='launch-heading'>Rocket Type</div>
                                        <div className='launch-value'>{val.rocket.rocket_type}</div>
                                        <div className='launch-heading'>Launch Year</div>
                                        <div className="launch-value" >{val.launch_year}</div>
                                        <div className='launch-heading'>Mission Name</div>
                                        <div className='launch-value'>{val.mission_name}</div>
                                        <div className='launch-heading'>Launch Success</div>
                                        <div className='launch-value'>{JSON.stringify(val.launch_success)}</div>
                                        <div className='launch-heading'>Flight Number</div>
                                        <div className='launch-value'>{val.flight_number}</div>
                                        <div className='launch-heading'>Launch Date</div>
                                        <div className='launch-value'>{val.launch_date_utc}</div>
                                    </div>
                                </div>
                            </>)
                        }
                    })}
            </div>
        </div>
    </>
    )
}



export default Main;