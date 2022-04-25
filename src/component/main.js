import React, { useEffect } from 'react';
import "../css/main.css";

const Main = () => {
    const [state, update_state] = React.useState({ "arr": [], "max": adjust_grid(), "min": 0, "response-arr": [], "loader": true, "pageno": 1, "show-prevnext": false, "year_filter": [], "success_launch_filter": [], "success_land_filter": [] })
    var year_arr = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    var arr = [], arr2 = [], arr3 = [];

    function adjust_grid() {
        if (window.innerWidth <= 1200 && window.innerWidth > 1024) {
            return 5;
        }
        else if (window.innerWidth <= 1024 && window.innerWidth > 700) {
            return 3;
        }
        else if (window.innerWidth <= 700) {
            return 3;
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
            update_state({ ...state, "arr": data, "loader": false })
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    React.useEffect(() => {
        var final_arr = [], final_arr_2 = [];
        if (state["year_filter"].indexOf(null) === 0 || state["success_land_filter"].indexOf(null) === 0 || state["success_launch_filter"].indexOf(null) === 0) {
            update_state({ ...state, "response-arr": [] })
            console.log("2");
        }
        else {
            var count=0;
            console.log("done");
            final_arr = state["year_filter"].concat(state["success_land_filter"], state["success_launch_filter"]);
           console.log(final_arr);
            if(state["year_filter"].length===0){
                count++;
            }
            if(state["success_launch_filter"].length===0){
                count++;
            }
            if(state["success_land_filter"].length===0){
                count++;
            }
            if(count===2||count===3){
                update_state({ ...state, "response-arr": final_arr })
            }
            else{
                for (let i = 0; i < final_arr.length; i++) {
                    if (final_arr.indexOf(final_arr[i]) !== i) {
                        final_arr_2.push(final_arr[i]);
                    }
                }
                console.log(final_arr_2);
                update_state({ ...state, "response-arr": final_arr_2 })
            }
        }
    }, [state["year_filter"], state["success_land_filter"], state["success_launch_filter"]])


    function pageShift(e) {
        if (e.target.id === "prev") {
            if (state.min > 0) {
                update_state({ ...state, "min": state["min"] - adjust_grid(), "max": state["max"] + adjust_grid(), "pageno": state["pageno"] - 1 })
            }
        }
        if (e.target.id === "next") {
            if (state.max <= state["response-arr"].length - 1) {
                update_state({ ...state, "min": state["min"] + adjust_grid(), "max": state["max"] + adjust_grid(), "pageno": state["pageno"] + 1 })
            }
        }
    }

    React.useEffect(() => {
        update_state({ ...state, "response-arr": state["arr"] })
    }, [state["arr"]])

    React.useEffect(() => {
        var flag = false;
        if (state["response-arr"].length > state["max"]) {
            flag = true;
        }
        update_state({ ...state, "show-prevnext": flag, "pageno": 1 })
    }, [state["response-arr"]])

    function launchyear_filter(e, value) {

        for (let i = 0; i < state["arr"].length; i++) {
            if (value === "launch_year") {
                if (state["arr"][i].launch_year === e.target.id) {
                    arr.push(state["arr"][i]);
                }
                if (i === state["arr"].length - 1 && arr.length === 0) {
                    arr = [null];
                }
                update_state({ ...state, "year_filter": arr })
            }
            if (value === "launch_success") {
                if (JSON.stringify(state["arr"][i].launch_success) === e.target.id) {
                    arr2.push(state["arr"][i]);
                }
                if (i === state["arr"].length - 1 && arr2.length === 0) {
                    arr2 = [null];
                }
                update_state({ ...state, "success_launch_filter": arr2 })
            }
            if (value === "landing_success") {
                if (JSON.stringify(state["arr"][i].upcoming) === e.target.id) {
                    arr3.push(state["arr"][i]);
                }
                if (i === state["arr"].length - 1 && arr3.length === 0) {
                    arr3 = [null];
                }
                update_state({ ...state, "success_land_filter": arr3 })
            }
        }
    }

    return (<>
        {state["show-prevnext"] === true ?
            <div className='prevnext-container'>
                <div id='prev' onClick={pageShift}>Prev</div>
                <div className='pageno'>{state.pageno}</div>
                <div id='next' onClick={pageShift}>Next</div>
            </div>
            : null}
        <div className='spacex-heading'>SpaceX Launch Programs</div>
        <div className='spacex-container'>
            <div className='spacex-filter'>
                <div className='filter-main-heading'>Filter</div>
                <div className='filter-main-heading2'>Launch Year</div>
                <div className='filter-opt-container'>
                    {year_arr.map(function (val, i) {
                        return (<>
                            <div className='filter-opt' id={val} onClick={(e) => launchyear_filter(e, "launch_year")}>{val}</div>
                        </>)
                    })}
                </div>
                <div className='filter-main-heading2'>Successful Launch</div>
                <div className='filter-opt-container'>
                    <div className='filter-opt' id="true" onClick={(e) => launchyear_filter(e, "launch_success")}>True</div>
                    <div className='filter-opt' id="false" onClick={(e) => launchyear_filter(e, "launch_success")}>False</div>
                </div>
                <div className='filter-main-heading2'>Successful Landing</div>
                <div className='filter-opt-container'>
                    <div className='filter-opt' id="true" onClick={(e) => launchyear_filter(e, "landing_success")}>True</div>
                    <div className='filter-opt' id="false" onClick={(e) => launchyear_filter(e, "landing_success")}>False</div>
                </div>
            </div>
            <div className='spacex-item-container'>
                {state.loader === true ? <div className='spacex-loader'>Loading....</div> :
                    <>
                        {state["response-arr"].length !== 0 ?
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
                            }) : <div className="no-results">No Results</div>
                        }
                    </>
                }
            </div>
        </div>
    </>
    )
}

export default Main;