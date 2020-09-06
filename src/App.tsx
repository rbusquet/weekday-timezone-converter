import React from "react";
import moment from "moment-timezone";
import "bootstrap/dist/css/bootstrap.css";
import { parse, stringify } from "query-string";
import { History } from "history";

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

type Props = {
  history: History;
};

export default function App({ history }: Props) {
  const [fromTZ, setLocalZone] = React.useState(() => {
    const { search } = history.location;
    const parsed = parse(search);
    console.log({ parsed });
    const validTz = moment.tz.zone(parsed.fromTZ as string);

    return validTz ? validTz.name : moment.tz.guess();
  });
  const [toTZ, setToZone] = React.useState(() => moment.tz.guess());

  const [weekday, setWeekday] = React.useState("0");
  const [time, setTime] = React.useState("08:30");
  const [result, setResult] = React.useState("");

  React.useEffect(() => {
    const [hour, minutes] = time.split(":");
    const now = moment.tz(new Date(), fromTZ);
    now.hours(Number(hour));
    now.minute(Number(minutes));
    now.seconds(0);
    now.weekday(Number(weekday));
    now.tz(toTZ);
    // console.log({ now: now.toString() });

    const newWeekday = DAYS_OF_WEEK[now.weekday()];
    const newHour = now.hour().toString().padStart(2, "0");
    const newMinute = now.minute().toString().padStart(2, "0");

    setResult(`Result: ${newWeekday} at ${newHour}:${newMinute} `);

    const search = `?${stringify({ weekday, time, fromTZ })}`;
    history.push({ search });
  }, [history, weekday, time, fromTZ, toTZ]);

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
                value={fromTZ}
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
                value={toTZ}
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
