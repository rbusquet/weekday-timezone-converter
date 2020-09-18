import React from "react"
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz"
import "bootstrap/dist/css/bootstrap.css"
import { parse, stringify } from "query-string"
import { History } from "history"
import TimezoneDropdown from "./TimezoneDropdown"
import { ZONES } from "./constants"
import { setDay, setHours, setMinutes, setSeconds } from "date-fns"

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

type Props = {
  history: History
}

function useTzFromSearch<T>(history: History, key: string) {
  return React.useState(() => {
    const { search } = history.location
    const parsed = parse(search)
    const validTz = ZONES.includes(parsed[key] as string)

    return validTz
      ? (parsed[key] as string)
      : Intl.DateTimeFormat().resolvedOptions().timeZone
  })
}

function useStringFromSearch(
  history: History,
  key: string,
  defaultValue: string
) {
  return React.useState<string>(() => {
    const { search } = history.location
    const parsed = parse(search)

    return (parsed[key] as string) || defaultValue
  })
}
export default function App({ history }: Props) {
  const [fromTZ, setFromTZ] = useTzFromSearch(history, "fromTZ")
  const [toTZ, setToTZ] = React.useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  )

  const [weekday, setWeekday] = useStringFromSearch(history, "weekday", "0")
  const [time, setTime] = useStringFromSearch(history, "time", "08:30")
  const [result, setResult] = React.useState("")

  React.useEffect(() => {
    const [hour, minutes] = time.split(":")
    let now = new Date()
    now = setDay(now, +weekday)
    now = setHours(now, +hour)
    now = setMinutes(now, +minutes)
    now = setSeconds(now, 0)

    now = zonedTimeToUtc(now, fromTZ)
    now = utcToZonedTime(now, toTZ)

    const newWeekday = DAYS_OF_WEEK[now.getDay()]
    const newHour = now.getHours().toString().padStart(2, "0")
    const newMinute = now.getMinutes().toString().padStart(2, "0")

    setResult(
      `${
        DAYS_OF_WEEK[Number(weekday)]
      }, ${time} @ ${fromTZ} is ${newWeekday}, ${newHour}:${newMinute} @ ${toTZ}`
    )

    const search = `?${stringify({ weekday, time, fromTZ })}`
    history.push({ search })
  }, [history, weekday, time, fromTZ, toTZ])

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>
              Weekday{" "}
              <select
                value={weekday}
                onChange={ev => setWeekday(ev.target.value)}
                className="form-control custom-select"
              >
                {DAYS_OF_WEEK.map((day, i) => {
                  return (
                    <option key={day} value={i}>
                      {day}
                    </option>
                  )
                })}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Time{" "}
              <input
                value={time}
                onChange={ev => setTime(ev.target.value)}
                className="form-control"
                type="time"
              />
            </label>
          </div>
          <div className="form-group">
            <TimezoneDropdown
              label="From timezone"
              onChange={value => setFromTZ(value)}
              value={fromTZ}
            />
          </div>
          <div className="form-group">
            <TimezoneDropdown
              label="To timezone"
              onChange={value => setToTZ(value)}
              value={toTZ}
            />
          </div>
          <p>{result}</p>
        </div>
      </div>
    </div>
  )
}
