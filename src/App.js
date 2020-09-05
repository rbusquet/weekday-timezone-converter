import React from "react";
import moment from "moment-timezone";
import "bootstrap/dist/css/bootstrap.css";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ZONES = moment.tz.names();

export default function App() {
  const [localZone, setLocalZone] = React.useState(() => {
    // TODO: get from URL
    return moment.tz.guess();
  });
  const [toZone, setToZone] = React.useState(() => moment.tz.guess());

  const [weekday, setWeekday] = React.useState("0");
  const [time, setTime] = React.useState("08:30");
  const [result, setResult] = React.useState("");

  React.useEffect(() => {
    const [hour, minutes] = time.split(":");
    const now = moment.tz(new Date(), localZone);
    now.hours(Number(hour));
    now.minute(Number(minutes));
    now.seconds(0);
    now.weekday(weekday);
    now.tz(toZone);
    // console.log({ now: now.toString() });

    const newWeekday = DAYS_OF_WEEK[now.weekday()];
    const newHour = now.hour().toString().padStart(2, "0");
    const newMinute = now.minute().toString().padStart(2, "0");

    setResult(`Result: ${newWeekday} at ${newHour}:${newMinute} `);
  }, [weekday, time, localZone, toZone]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>
              Weekday{" "}
              <select
                value={weekday}
                onChange={(ev) => setWeekday(ev.target.value)}
                className="form-control"
              >
                {DAYS_OF_WEEK.map((day, i) => {
                  return (
                    <option key={day} value={i}>
                      {day}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Time{" "}
              <input
                value={time}
                onChange={(ev) => setTime(ev.target.value)}
                className="form-control"
                type="time"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              From timezone{" "}
              <select
                value={localZone}
                onChange={(ev) => setLocalZone(ev.target.value)}
                className="form-control"
              >
                {ZONES.map((zone) => {
                  return (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              To timezone{" "}
              <select
                value={toZone}
                onChange={(ev) => setToZone(ev.target.value)}
                className="form-control"
              >
                {ZONES.map((zone) => {
                  return (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <p>{result}</p>
        </div>
      </div>
    </div>
  );
}
