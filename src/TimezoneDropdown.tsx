import React from "react"
import { useCombobox } from "downshift"
import cx from "classnames"
import { findBestMatch } from "string-similarity"

import { ZONES } from "./constants"

type Props = {
  onChange: (ev: string) => void
  value: string
  label: string
}

function zonesBySimilarity(value: string) {
  const { ratings, bestMatch } = findBestMatch(value, ZONES)
  return {
    topChoices: ratings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 20)
      .map(rating => rating.target),
    bestMatch
  }
}

export default function TimezoneDropdown({ label, onChange, value }: Props) {
  const [zones, setZones] = React.useState(() => {
    return value ? zonesBySimilarity(value).topChoices : ZONES
  })
  const {
    isOpen,
    selectedItem,
    getInputProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    getComboboxProps,
    getToggleButtonProps,
    getLabelProps
  } = useCombobox({
    selectedItem: value,
    items: zones,
    onSelectedItemChange: changes => {
      if (changes.selectedItem) {
        onChange(changes.selectedItem)
      }
    },
    onInputValueChange: ({ inputValue }) => {
      if (!inputValue) {
        setZones(ZONES)
        return
      }
      const { topChoices, bestMatch } = zonesBySimilarity(inputValue)
      if (bestMatch.rating === 1) {
        onChange(bestMatch.target)
      }
      setZones(topChoices)
    }
  })
  return (
    <label {...getLabelProps()} className="dropdown">
      {label}
      <div {...getComboboxProps()} className="input-group">
        <input {...getInputProps()} className="form-control" />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary dropdown-toggle-split dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            {...getToggleButtonProps()}
          ></button>
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className={cx("dropdown-menu", { show: isOpen })}
        style={{ maxHeight: "200px", overflowY: "auto" }}
      >
        {isOpen && !zones.length && (
          <li
            className="dropdown-item disabled"
            tabIndex={-1}
            aria-disabled="true"
          >
            No timezone found.
          </li>
        )}
        {isOpen &&
          zones.map((zone, index) => (
            <li
              {...getItemProps({
                key: `${zone}${index}`,
                item: zone,
                index,
                className: cx("dropdown-item", {
                  active: selectedItem === zone,
                  "bg-light text-dark":
                    selectedItem !== zone && highlightedIndex === index
                })
              })}
            >
              {zone}
            </li>
          ))}
      </ul>
    </label>
  )
}
