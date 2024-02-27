import React, { useEffect } from "react";
import "../css/main.css";

const Main = () => {
  const ref = React.useRef({});

  const [state, update_state] = React.useState({
    arr: [],
    max: 7,
    min: 0,
    loader: true,
    pageno: 1,
    "show-prevnext": false,
    launch_year: "",
    launch_success: "",
    landing_success: "",
  });
  var year_arr = [
    2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021,
  ];
  function grid_view() {
    var rootElement = ref.current["window"].offsetWidth;
    console.log(rootElement);
    if (rootElement <= 1200 && rootElement > 1024) {
      return 5;
    } else if (rootElement <= 1024 && rootElement > 700) {
      return 3;
    } else if (rootElement <= 700) {
      return 3;
    } else {
      return 7;
    }
  }
  useEffect(() => {
    fetch("https://api.spacexdata.com/v3/launches?limit=100")
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("something went wrong,please try again");
        }
      })
      .then(function (data) {
        update_state({ ...state, arr: data, loader: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    var url = "https://api.spacexdata.com/v3/launches?limit=100&";
    var string =
      state["launch_year"] + state["landing_success"] + state["launch_success"];
    fetch(url + string)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("something went wrong,please try again");
        }
      })
      .then(function (data) {
        update_state({ ...state, "arr": data, "loader": false, "max": grid_view() });
      })
      .catch((err) => { });
  }, [state["launch_year"], state["landing_success"], state["launch_success"]]);

  function pageShift(e) {
    if (e.target.id === "prev") {
      if (state.min > 0) {
        update_state({
          ...state,
          min: state["min"] - grid_view(),
          max: state["max"] - grid_view(),
          pageno: state["pageno"] - 1,
        });
      }
    }
    if (e.target.id === "next") {
      if (state.max <= state["arr"].length - 1) {
        update_state({
          ...state,
          min: state["min"] + grid_view(),
          max: state["max"] + grid_view(),
          pageno: state["pageno"] + 1,
        });
      }
    }
  }

  React.useEffect(() => {
    var flag = false;
    if (state["arr"].length > state["max"]) {
      flag = true;
    }
    update_state({ ...state, "show-prevnext": flag, pageno: 1 });
  }, [state["arr"]]);

  function launchyear_filter(e, value) {
    if (value === "launch_year") {
      update_state({
        ...state,
        launch_year: `launch_year=${e.target.id}&`,
        loader: true,
      });
    }
    if (value === "landing_success") {
      console.log(e.target.id.replace("land-", ""));
      update_state({
        ...state,
        landing_success: `land_success=${e.target.id.replace("land-", "")}&`,
        loader: true,
      });
    }
    if (value === "launch_success") {
      update_state({
        ...state,
        launch_success: `launch_success=${e.target.id}&`,
        loader: true,
      });
    }
  }

  return (
    <>
      <div
        className="spacex-main-container"
        ref={(element) => (ref.current["window"] = element)}
      >
        {state["show-prevnext"] === true ? (
          <div className="prevnext-container">
            <div id="prev" onClick={pageShift}>
              Prev
            </div>
            <div className="pageno">{state.pageno}</div>
            <div id="next" onClick={pageShift}>
              Next
            </div>
          </div>
        ) : null}
        <div className="spacex-heading">SpaceX Launch Programs</div>
        <div className="spacex-container">
          <div className="spacex-filter">
            <div className="filter-main-heading">Filter</div>
            <div className="filter-main-heading2">Launch Year</div>
            <div className="filter-opt-container">
              {year_arr.map(function (val, i) {
                return (
                  <>

                    <input
                      type="radio"
                      name="launch_year"
                      id={val}
                      onChange={(e) => launchyear_filter(e, "launch_year")}
                    />
                    <label for={val} className="filter-opt launch_year">
                      {val}
                    </label>
                  </>
                );
              })}
            </div>
            <div className="filter-main-heading2">Successful Launch</div>
            <div className="filter-opt-container">
              <input
                type="radio"
                id="true"
                name="launch_success"
                onClick={(e) => launchyear_filter(e, "launch_success")}
              />
              <label for="true" className="filter-opt launch_success">True</label>
              <input
                type="radio"
                id="false"
                name="launch_success"
                onClick={(e) => launchyear_filter(e, "launch_success")}
              />
              <label for="false" className="filter-opt launch_success">False</label>
            </div>
            <div className="filter-main-heading2">Successful Landing</div>
            <div className="filter-opt-container">
              <input
                type="radio"
                name="landing_success"
                id="land-true"
                onClick={(e) => launchyear_filter(e, "landing_success")}
              />
              <label for="land-true" className="filter-opt landing_success">True</label>
              <input
                type="radio"
                name="landing_success"
                id="land-false"
                onClick={(e) => launchyear_filter(e, "landing_success")}
              />
              <label for="land-false" className="filter-opt landing_success">False</label>

            </div>
          </div>
          <div className="spacex-item-container">
            {state.loader === true ? (
              <div className="spacex-loader">Loading....</div>
            ) : (
              <>
                {state["arr"].length !== 0 ? (
                  state["arr"].map(function (val, i) {
                    if (i <= state.max && i >= state.min) {
                      return (
                        <>
                          <div className="spacex-item">
                            <div className="cover_img">                                {val.rocket.rocket_name}
                            </div>
                            <div className="spacex-inner">
                              <div className="launch-heading">Rocket Name</div>
                              <div className="launch-value">
                                {val.rocket.rocket_name}
                              </div>
                              <div className="launch-heading">Rocket Type</div>
                              <div className="launch-value">
                                {val.rocket.rocket_type}
                              </div>
                              <div className="launch-heading">Launch Year</div>
                              <div className="launch-value">
                                {val.launch_year}
                              </div>
                              <div className="launch-heading">Mission Name</div>
                              <div className="launch-value">
                                {val.mission_name}
                              </div>
                              <div className="launch-heading">
                                Launch Success
                              </div>
                              <div className="launch-value">
                                {JSON.stringify(val.launch_success)}
                              </div>
                              <div className="launch-heading">
                                Flight Number
                              </div>
                              <div className="launch-value">
                                {val.flight_number}
                              </div>
                              <div className="launch-heading">Launch Date</div>
                              <div className="launch-value">
                                {val.launch_date_utc}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    }
                  })
                ) : (
                  <div className="no-results">No Results</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
