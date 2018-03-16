import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root'

const rootElement = document.getElementById('root')

let render = () => {
    ReactDOM.render(
        <Root />,
        rootElement
    )
}

render();
