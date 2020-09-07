import React from "react"
import styled from "styled-components"

const FooterComponent = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  line-height: 60px; /* Vertically center the text there */
`

export default function Footer() {
  return (
    <FooterComponent>
      <div className="container">
        <small>
          Created by <a href="https://rbusquet.dev">Ricardo Busquet</a>
        </small>
      </div>
    </FooterComponent>
  )
}
