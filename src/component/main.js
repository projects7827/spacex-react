import React, { useEffect } from 'react';
import "../css/main.css";

const Main = () => {
    const [state, update_state] = React.useState({ "arr": [], "max": adjust_grid(), "min": 0, "loader": true, "pageno": 1, "show-prevnext": false, "launch_year": "", "launch_success": "", "landing_success": "" })
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
        var url = "https://api.spacexdata.com/v3/launches?limit=100&";
        var string = state["launch_year"] + state["landing_success"] + state["launch_success"];
        console.log(string);
        fetch(url + string).then((res) => {
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
        })

    }, [state["launch_year"], state["landing_success"], state["launch_success"]])

    function pageShift(e) {
        if (e.target.id === "prev") {
            if (state.min > 0) {
                update_state({ ...state, "min": state["min"] - adjust_grid(), "max": state["max"] + adjust_grid(), "pageno": state["pageno"] - 1 })
            }
        }
        if (e.target.id === "next") {
            if (state.max <= state["arr"].length - 1) {
                update_state({ ...state, "min": state["min"] + adjust_grid(), "max": state["max"] + adjust_grid(), "pageno": state["pageno"] + 1 })
            }
        }
    }

    React.useEffect(() => {
        var flag = false;
        if (state["arr"].length > state["max"]) {
            flag = true;
        }
        update_state({ ...state, "show-prevnext": flag, "pageno": 1 })
    }, [state["arr"]])

    function styling(selector, id) {
        console.log(selector);
        var element = document.querySelectorAll("." + selector);
        for (let i = 0; i < element.length; i++) {
            element[i].style.color = "black";
            element[i].style.background = "#7CB68E";
            
        }
        id.style.color = "white";
       id.style.background = "green";
    }

    function launchyear_filter(e, value) {
        if (value === "launch_year") {

            styling("launch_year",  e.target)
            update_state({ ...state, "launch_year": `launch_year=${e.target.id}&`, "loader": true })
        }
        if (value === "landing_success") {
            styling("landing_success", e.target)
            update_state({ ...state, "landing_success": `land_success=${e.target.id}&`, "loader": true })
        }
        if (value === "launch_success") {
            styling("launch_success",  e.target)
            update_state({ ...state, "launch_success": `launch_success=${e.target.id}&`, "loader": true })
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
                            <div className='filter-opt launch_year' id={val} onClick={(e) => launchyear_filter(e, "launch_year")}>{val}</div>
                        </>)
                    })}
                </div>
                <div className='filter-main-heading2'>Successful Launch</div>
                <div className='filter-opt-container'>
                    <div className='filter-opt launch_success' id="true" onClick={(e) => launchyear_filter(e, "launch_success")}>True</div>
                    <div className='filter-opt launch_success' id="false" onClick={(e) => launchyear_filter(e, "launch_success")}>False</div>
                </div>
                <div className='filter-main-heading2'>Successful Landing</div>
                <div className='filter-opt-container'>
                    <div className='filter-opt landing_success' id="true" onClick={(e) => launchyear_filter(e, "landing_success")}>True</div>
                    <div className='filter-opt landing_success' id="false" onClick={(e) => launchyear_filter(e, "landing_success")}>False</div>
                </div>
            </div>
            <div className='spacex-item-container'>
                {state.loader === true ? <div className='spacex-loader'>Loading....</div> :
                    <>
                        {state["arr"].length !== 0 ?
                            state["arr"].map(function (val, i) {
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