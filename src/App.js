import React, { Component } from 'react'

import './App.css'

import {drawVitamins, updateVitamin} from './utitlits/draws'
import {checkVitaminColorSwap} from './utitlits/vitaminsFunctions'

import VitaminsInput from './components/VitaminsInput'
import AutoSolution from './components/AutoSolution'

class App extends Component {
  constructor () {
    super()
    
    this.canvas = React.createRef()

    this.initVitaminsLine = this.initVitaminsLine.bind(this)
    this.updateVitaminsLine = this.updateVitaminsLine.bind(this)

    this.state = {
      vitaminsLine: [],
      error: false,
      errorMessage: ''
    }
  }

  componentDidMount () {
    this.ctx = this.canvas.current.getContext('2d')
  }

  initVitaminsLine (vitaminsLine) {
    this.setState({
      vitaminsLine: vitaminsLine,
      error: false,
      errorMessage: ''
    }, () => {
      this.ctx.clearRect(0,0,1000,500)
      drawVitamins(this.ctx, vitaminsLine.slice(0))
    })
  }

  updateVitaminsLine (vitaminsLine) {
    const {
      changedVitamin, 
      ...errorData} = checkVitaminColorSwap(this.state.vitaminsLine, vitaminsLine)
    
    if (errorData.error) {
      this.setState(errorData)
    } else {
      this.setState(
        {
          error: false, 
          errorMessage: '',
          vitaminsLine
        }, () => {
            updateVitamin({
              ctx: this.ctx, 
              sides: changedVitamin.sides, 
              oldBg: changedVitamin.from, 
              newBg: changedVitamin.to})
          })
    }
  }

  render() {
    const {error, errorMessage} = this.state

    return (
      <div className="App">
        <canvas
          height = {500}
          width = {1000}
          ref = {this.canvas}
        />
        <div>
          <AutoSolution vitaminsLine = {this.state.vitaminsLine}/>
          <VitaminsInput
            initVitaminsLine = {this.initVitaminsLine}
            updateVitaminsLine = {this.updateVitaminsLine}
          />
          {
            error ? <p className = 'error'>{errorMessage}</p> : null
          }
        </div>
      </div>
    );
  }
}

export default App;
