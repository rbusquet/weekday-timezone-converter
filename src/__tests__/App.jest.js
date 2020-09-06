import React from "react"
import user from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"

import App from "../App"

it("renders", () => {
  render(<App />)
})

it("shows timezone", async () => {
  render(<App />)
  user.selectOptions(screen.getByRole("combobox", { name: /weekday/i }), "0")
  const timeInput = screen.getByLabelText(/time$/i)
  fireEvent.change(timeInput, { target: { value: "23:00" } })
  user.selectOptions(
    screen.getByRole("combobox", { name: /to timezone/i }),
    "America/Los_Angeles"
  )

  expect(screen.getByText(/result/i).textContent).toMatchInlineSnapshot(
    `"Result: Sunday at 20:00 "`
  )
})

it("if timezone 'goes back' get different weekday", () => {
  render(<App />)
  user.selectOptions(screen.getByRole("combobox", { name: /weekday/i }), "2")
  const timeInput = screen.getByLabelText(/time$/i)
  fireEvent.change(timeInput, { target: { value: "01:00" } })
  user.selectOptions(
    screen.getByRole("combobox", { name: /to timezone/i }),
    "America/Los_Angeles"
  )

  expect(screen.getByText(/result/i).textContent).toMatchInlineSnapshot(
    `"Result: Monday at 22:00 "`
  )
})

it("if timezone 'goes in the future' get next weekday", () => {
  render(<App />)
  user.selectOptions(screen.getByRole("combobox", { name: /weekday/i }), "4")
  const timeInput = screen.getByLabelText(/time$/i)
  fireEvent.change(timeInput, { target: { value: "23:59" } })
  user.selectOptions(
    screen.getByRole("combobox", { name: /to timezone/i }),
    "America/Sao_Paulo"
  )

  expect(screen.getByText(/result/i).textContent).toMatchInlineSnapshot(
    `"Result: Friday at 00:59 "`
  )
})
