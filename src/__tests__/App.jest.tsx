import React, { useReducer } from "react"
import user from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"

import App from "../App"
import { createMemoryHistory } from "history"
import { stringify } from "query-string"

it("renders", () => {
  const history = createMemoryHistory()
  render(<App history={history} />)
})

it("shows timezone", () => {
  const history = createMemoryHistory()

  render(<App history={history} />)
  user.selectOptions(screen.getByRole("combobox", { name: /weekday/i }), "0")
  const timeInput = screen.getByLabelText(/time$/i)
  fireEvent.change(timeInput, { target: { value: "23:00" } })
  user.type(
    screen.getByRole("textbox", { name: /to timezone/i }),
    "America/Los_Angeles{enter}"
  )
  user.click(screen.getByRole("option", { name: /america\/los_angeles/i }))

  const result = screen.getByText(
    /sunday 23:00 @ america\/new_york is sunday at 20:00 @ america\/los_angeles/i
  )
  expect(result).toBeVisible()
  expect(history.location.search).toMatchInlineSnapshot(
    `"?fromTZ=America%2FNew_York&time=23%3A00&weekday=0"`
  )
})

it("if timezone 'goes back' get different weekday", () => {
  const history = createMemoryHistory()
  render(<App history={history} />)
  user.selectOptions(screen.getByRole("combobox", { name: /weekday/i }), "2")
  const timeInput = screen.getByLabelText(/time$/i)
  fireEvent.change(timeInput, { target: { value: "01:00" } })
  user.type(
    screen.getByRole("textbox", { name: /to timezone/i }),
    "America/Los_Angeles{enter}"
  )
  user.click(screen.getByRole("option", { name: /america\/los_angeles/i }))

  const result = screen.getByText(
    /Tuesday 01:00 @ America\/New_York is Monday at 22:00 @ America\/Los_Angeles/
  )
  expect(result).toBeVisible()
  expect(history.location.search).toMatchInlineSnapshot(
    `"?fromTZ=America%2FNew_York&time=01%3A00&weekday=2"`
  )
})

it("if timezone 'goes in the future' get next weekday", () => {
  const history = createMemoryHistory()
  render(<App history={history} />)
  user.selectOptions(screen.getByRole("combobox", { name: /weekday/i }), "4")
  const timeInput = screen.getByLabelText(/time$/i)
  fireEvent.change(timeInput, { target: { value: "23:59" } })
  user.type(
    screen.getByRole("textbox", { name: /to timezone/i }),
    "America/Los_Angeles{enter}"
  )
  user.click(screen.getByRole("option", { name: /america\/los_angeles/i }))

  const result = screen.getByText(
    /Thursday 23:59 @ America\/New_York is Thursday at 20:59 @ America\/Los_Angeles/
  )
  expect(result).toBeVisible()
  expect(history.location.search).toMatchInlineSnapshot(
    `"?fromTZ=America%2FNew_York&time=23%3A59&weekday=4"`
  )
})

it("uses history values", () => {
  const history = createMemoryHistory()
  const search = stringify({
    fromTZ: "America/Sao_Paulo",
    time: "23:12",
    weekday: "3"
  })
  history.push({ search: `?${search}` })

  render(<App history={history} />)
  expect(screen.getByRole("textbox", { name: /from timezone/i })).toHaveValue(
    "America/Sao_Paulo"
  )
  expect(screen.getByLabelText(/time$/i)).toHaveValue("23:12")
  expect(screen.getByRole("combobox", { name: /weekday/i })).toHaveValue("3")
})
