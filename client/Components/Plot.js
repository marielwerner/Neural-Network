import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'

class PlotContainerClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: false,
      distance: 1,
      textEntry: '',
      word1Entry: '',
      word2Entry: '',
      renderedText: '',
      renderedWord1: '',
      renderedWord2: '',
      totalError: 0,

      word3Entry: '',
      renderedWord3: '',
      distance1: 1,
      totalError1: 0,
      answer: '',

      data: [
        {
          type: "scatter",
          mode: "markers",
          x: [0, 1],
          y: [0, 0],
          text: ['A', 'B'],
          marker: {
            size: [200, 200],
            sizemode: 'area',
          }
        }
      ],
      layout: {
        title: 'Neural Network',
        xaxis: {
          title: 'Euclidean Distance'
        },
        annotations: [
          {
            x: 0,
            xref: 'paper',
            y: 0,
            yref: 'paper'
          }
        ]
      },
      data1: [{
        type: "scatter",
        mode: "markers",
        x: [0, 1],
        y: [0, 0],
        text: ['C', 'D'],
        marker: {
          size: [200, 200],
          sizemode: 'area',
          color: [50, 50],
        }
      }]
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleWord1Change = this.handleWord1Change.bind(this)
    this.handleWord2Change = this.handleWord2Change.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAnswerClick = this.handleAnswerClick.bind(this)
    this.handleWord3Change = this.handleWord3Change.bind(this)
  }
  handleAnswerClick(event) {
    this.setState({
      answer: this.state.totalError < this.state.totalError1 ? this.state.renderedWord2 : this.state.renderedWord3
    })
  }
  handleTextChange(event) {
    this.setState({
      textEntry: event.target.value
    })
  }
  handleWord1Change(event) {
    this.setState({
      word1Entry: event.target.value
    })
  }
  handleWord2Change(event) {
    this.setState({
      word2Entry: event.target.value
    })
  }

  handleWord3Change(event) {
    this.setState({
      word3Entry: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      renderedText: this.state.textEntry,
      renderedWord1: this.state.word1Entry,
      renderedWord2: this.state.word2Entry,

      renderedWord3: this.state.word3Entry,
      word3Entry: '',

      textEntry: '',
      word1Entry: '',
      word2Entry: ''
    })

  }
  handleClick(event, num) {
    /////////////////// Plot Results ///////////////
    let data = [
      {
        type: "scatter",
        mode: "markers",
        x: [0, 1],
        y: [0, 0],
        text: ['A', 'B'],
        marker: {
          size: [200, 200],
          sizemode: 'area',
        }
      }
    ];
    let layout = {
      title: 'Neural Network',
      xaxis: {
        title: 'Euclidean Distance'
      },
      annotations: [
        {
          x: 0,
          xref: 'paper',
          y: 0,
          yref: 'paper'
        }
      ]
    };
    let data1 = [
      {
        type: "scatter",
        mode: "markers",
        x: [0, 1],
        y: [0, 0],
        text: ['C', 'D'],
        marker: {
          size: [200, 200],
          sizemode: 'area',
        }
      }
    ]

    /////// Neural Network Algorithm ///////////
    const originalText = this.state.renderedText
    const trainingText = []
    const alteredText = originalText.split(' ').map(word => word.toLowerCase())
      .map(word => word[word.length - 1] === '.' ? word.slice(0, word.length - 1) : word).filter(word => word !== 'with')
    for (let i = 0; i < alteredText.length; i++) {
      if (trainingText.indexOf(alteredText[i]) === -1) trainingText.push(alteredText[i])
    }

    // Step 1: Initial Matrix 
    let identityMatrix = []
    for (let i = 0; i < trainingText.length; i++) {
      identityMatrix.push(new Array(trainingText.length).fill(0))
    }
    for (let i = 0; i < trainingText.length; i++) {
      identityMatrix[i][i] = 1
    }

    // Step 2: Initialize WI matrix with 3 neurons
    let WI = []
    for (let i = 0; i < 3; i++) {
      let rowMatrix = []
      for (let j = 0; j < trainingText.length; j++) {
        var number = Math.random() * (2) - 1
        rowMatrix.push(number)
      }
      WI.push(rowMatrix)
    }

    // Step 3: Initialize WO matrix 
    let WO = []
    for (let i = 0; i < trainingText.length; i++) {
      let rowMatrix = []
      for (let j = 0; j < 3; j++) {
        var number = Math.random() * (2) - 1
        rowMatrix.push(number)
      }
      WO.push(rowMatrix)
    }

    // Step 4: Define input and target vectors
    let input = identityMatrix[trainingText.indexOf(this.state.renderedWord1)]
    let target = identityMatrix[trainingText.indexOf(this.state.renderedWord2)]
    let target1 = identityMatrix[trainingText.indexOf(this.state.renderedWord3)]

    // Optimized Initial Input Example 
    // let input = [1/7,1/7,1/7,2/7,1/7,1/7]
    // let target = [2/7,1/7,1/7,1/7,1/7,0]
    // let target1 = [1/3,0,0,0,1/3,1/3]

    // Step 5: Calculate net-inputs and outputs for WI 
    const dotProduct = (vector1, vector2) => {
      let sum = 0;
      for (let i = 0; i < vector2.length; i++) {
        sum += vector1[i] * vector2[i]
      }
      return sum
    }

    // Neural Network Function

    const neuralNetwork = (matrixIn, matrixOut) => {

      const generateOutputHiddenLayer = matrix => {
        let outputHiddenLayer = []
        for (let i = 0; i < matrix.length; i++) {
          let net = dotProduct(input, matrix[i])
          outputHiddenLayer.push(1 / (1 + Math.pow(Math.E, -net)))
        }
        return outputHiddenLayer
      }

      // Step 6: Calculate net-inputs and outputs for WO

      const generateOutputOutputLayer = (matrixIn, matrixOut) => {
        let outputOutputLayer = []
        for (let i = 0; i < matrixOut.length; i++) {
          let net = dotProduct(generateOutputHiddenLayer(matrixIn), matrixOut[i])
          outputOutputLayer.push(1 / (1 + Math.pow(Math.E, -net)))
        }
        return outputOutputLayer
      }

      // Step 7: Calculate Error between target vector and actual output


      let E_vector = []
      for (let i = 0; i < trainingText.length; i++) {
        E_vector.push(0.5 * Math.pow((target[i] - generateOutputOutputLayer(matrixIn, matrixOut)[i]), 2))
      }
      let totalError = E_vector.reduce((a, b) => a + b)

      // Back Propagation 

      const partialErrorPartialOutput = E_vector.map((element, i) => {
        return -(target[i] - generateOutputOutputLayer(matrixIn, matrixOut)[i])
      })

      const partial_Out_O_Partial_Net_O = generateOutputOutputLayer(matrixIn, matrixOut).map(element => {
        return element * (1 - element)
      })

      // Step 8: Calculate new WO matrix

      const newWO = [];
      for (let i = 0; i < partialErrorPartialOutput.length; i++) {
        let rowMatrix = []
        for (let j = 0; j < generateOutputHiddenLayer(matrixIn).length; j++) {
          rowMatrix.push(matrixOut[i][j] - (0.5 * partialErrorPartialOutput[i] * partial_Out_O_Partial_Net_O[i] *
            generateOutputHiddenLayer(matrixIn)[j]))
        }
        newWO.push(rowMatrix)
      }

      // Step 9: Calculate new WI matrix 

      const partialErrorPartialHidden1Output = []
      for (let i = 0; i < generateOutputOutputLayer(matrixIn, matrixOut).length; i++) {
        partialErrorPartialHidden1Output.push(-(target[i] - generateOutputOutputLayer(matrixIn, matrixOut)[i]) *
          (generateOutputOutputLayer(matrixIn, matrixOut)[i] * (1 - generateOutputOutputLayer(matrixIn, matrixOut)[i])) * matrixOut[i][0])
      }

      const partialErrorPartialHidden2Output = []
      for (let i = 0; i < generateOutputOutputLayer(matrixIn, matrixOut).length; i++) {
        partialErrorPartialHidden2Output.push(-(target[i] - generateOutputOutputLayer(matrixIn, matrixOut)[i]) *
          (generateOutputOutputLayer(matrixIn, matrixOut)[i] * (1 - generateOutputOutputLayer(matrixIn, matrixOut)[i])) * matrixOut[i][1])
      }

      const partialErrorPartialHidden3Output = []
      for (let i = 0; i < generateOutputOutputLayer(matrixIn, matrixOut).length; i++) {
        partialErrorPartialHidden3Output.push(-(target[i] - generateOutputOutputLayer(matrixIn, matrixOut)[i]) *
          (generateOutputOutputLayer(matrixIn, matrixOut)[i] * (1 - generateOutputOutputLayer(matrixIn, matrixOut)[i])) * matrixOut[i][2])
      }

      const partialErrorPartialHiddenOutputs =
        [partialErrorPartialHidden1Output, partialErrorPartialHidden2Output, partialErrorPartialHidden3Output].map(element => element.reduce((a, b) => a + b))

      const newWI = []
      for (let i = 0; i < generateOutputHiddenLayer(matrixIn).length; i++) {
        let rowMatrix = []
        for (let j = 0; j < input.length; j++) {
          rowMatrix.push(matrixIn[i][j] - 0.5 * partialErrorPartialHiddenOutputs[i] * generateOutputHiddenLayer(matrixIn)[i] * input[j])
        }
        newWI.push(rowMatrix)
      }

      const euclideanDistance = (vector1, vector2) => {
        const squaresVector = [];
        for (let i = 0; i < vector1.length; i++) {
          squaresVector.push(Math.pow((vector1[i] - vector2[i]), 2))
        }
        return Math.pow(squaresVector.reduce((a, b) => a + b), 0.5)
      }
      const zeroVector = new Array(E_vector.length).fill(0)
      return [totalError, newWI, newWO, euclideanDistance(zeroVector, E_vector)]

    }

    const iterate = (func, num) => {
      let array = func(WI, WO)
      if (num === 1) {
        data[0].x.push(array[3])
        data[0].y.push(0)
        data[0].marker.size.push(200)
        // data1[0].x.push(data1[0][data1[0].length-1] + 0.5)   // add bias
        // data1[0].y.push(array[0])
        return [array[0], array[3]]
      }
      else {
        for (let i = 0; i < num; i++) {
          array = func(array[1], array[2])
        }
        data[0].x.push(array[3])
        data[0].y.push(0)
        data[0].marker.size.push(200)
        // data1[0].x.push(data1[0].x[data1[0].x.length-1] + 0.05)   // add bias
        // data1[0].y.push(array[0])
        return [array[0], array[3]]
      }
    }

    // Neural Network 1 Function 

    const neuralNetwork1 = (matrixIn, matrixOut) => {

      const generateOutputHiddenLayer1 = matrix => {
        let outputHiddenLayer1 = []
        for (let i = 0; i < matrix.length; i++) {
          let net1 = dotProduct(input, matrix[i])
          outputHiddenLayer1.push(1 / (1 + Math.pow(Math.E, -net1)))
        }
        return outputHiddenLayer1
      }

      // Step 6: Calculate net-inputs and outputs for WO

      const generateOutputOutputLayer1 = (matrixIn, matrixOut) => {
        let outputOutputLayer1 = []
        for (let i = 0; i < matrixOut.length; i++) {
          let net1 = dotProduct(generateOutputHiddenLayer1(matrixIn), matrixOut[i])
          outputOutputLayer1.push(1 / (1 + Math.pow(Math.E, -net1)))
        }
        return outputOutputLayer1
      }

      // Step 7: Calculate Error between target vector and actual output

      let E_vector1 = []
      for (let i = 0; i < trainingText.length; i++) {
        E_vector1.push(0.5 * Math.pow((target1[i] - generateOutputOutputLayer1(matrixIn, matrixOut)[i]), 2))
      }
      let totalError1 = E_vector1.reduce((a, b) => a + b)

      // Back Propagation 

      const partialErrorPartialOutput1 = E_vector1.map((element, i) => {
        return -(target1[i] - generateOutputOutputLayer1(matrixIn, matrixOut)[i])
      })

      const partial_Out_O_Partial_Net_O1 = generateOutputOutputLayer1(matrixIn, matrixOut).map(element => {
        return element * (1 - element)
      })

      // Step 8: Calculate new WO matrix

      const newWO1 = [];
      for (let i = 0; i < partialErrorPartialOutput1.length; i++) {
        let rowMatrix = []
        for (let j = 0; j < generateOutputHiddenLayer1(matrixIn).length; j++) {
          rowMatrix.push(matrixOut[i][j] - (0.5 * partialErrorPartialOutput1[i] * partial_Out_O_Partial_Net_O1[i] *
            generateOutputHiddenLayer1(matrixIn)[j]))
        }
        newWO1.push(rowMatrix)
      }

      // Step 9: Calculate new WI matrix 

      const partialErrorPartialHidden1Output1 = []
      for (let i = 0; i < generateOutputOutputLayer1(matrixIn, matrixOut).length; i++) {
        partialErrorPartialHidden1Output1.push(-(target1[i] - generateOutputOutputLayer1(matrixIn, matrixOut)[i]) *
          (generateOutputOutputLayer1(matrixIn, matrixOut)[i] * (1 - generateOutputOutputLayer1(matrixIn, matrixOut)[i])) * matrixOut[i][0])
      }

      const partialErrorPartialHidden2Output1 = []
      for (let i = 0; i < generateOutputOutputLayer1(matrixIn, matrixOut).length; i++) {
        partialErrorPartialHidden2Output1.push(-(target1[i] - generateOutputOutputLayer1(matrixIn, matrixOut)[i]) *
          (generateOutputOutputLayer1(matrixIn, matrixOut)[i] * (1 - generateOutputOutputLayer1(matrixIn, matrixOut)[i])) * matrixOut[i][1])
      }

      const partialErrorPartialHidden3Output1 = []
      for (let i = 0; i < generateOutputOutputLayer1(matrixIn, matrixOut).length; i++) {
        partialErrorPartialHidden3Output1.push(-(target1[i] - generateOutputOutputLayer1(matrixIn, matrixOut)[i]) *
          (generateOutputOutputLayer1(matrixIn, matrixOut)[i] * (1 - generateOutputOutputLayer1(matrixIn, matrixOut)[i])) * matrixOut[i][2])
      }

      const partialErrorPartialHiddenOutputs1 =
        [partialErrorPartialHidden1Output1, partialErrorPartialHidden2Output1, partialErrorPartialHidden3Output1].map(element => element.reduce((a, b) => a + b))

      const newWI1 = []
      for (let i = 0; i < generateOutputHiddenLayer1(matrixIn).length; i++) {
        let rowMatrix = []
        for (let j = 0; j < input.length; j++) {
          rowMatrix.push(matrixIn[i][j] - 0.5 * partialErrorPartialHiddenOutputs1[i] * generateOutputHiddenLayer1(matrixIn)[i] * input[j])
        }
        newWI1.push(rowMatrix)
      }

      const euclideanDistance1 = (vector1, vector2) => {
        const squaresVector = [];
        for (let i = 0; i < vector1.length; i++) {
          squaresVector.push(Math.pow((vector1[i] - vector2[i]), 2))
        }
        return Math.pow(squaresVector.reduce((a, b) => a + b), 0.5)
      }
      const zeroVector1 = new Array(E_vector1.length).fill(0)
      return [totalError1, newWI1, newWO1, euclideanDistance1(zeroVector1, E_vector1)]

    }

    // Train the network through iterations

    const iterate1 = (func, num) => {
      let array1 = func(WI, WO)
      if (num === 1) {
        data1[0].x.push(array1[3])
        data1[0].y.push(0)
        data1[0].marker.size.push(200)
        // data1[0].x.push(data1[0][data1[0].length-1] + 0.5)    // add bias
        // data1[0].y.push(array[0])
        return [array1[0], array1[3]]
      }
      else {
        for (let i = 0; i < num; i++) {
          array1 = func(array1[1], array1[2])
        }
        data1[0].x.push(array1[3])
        data1[0].y.push(0)
        data1[0].marker.size.push(200)
        // data1[0].x.push(data1[0].x[data1[0].x.length-1] + 0.05)       // add bias
        // data1[0].y.push(array[0])
        return [array1[0], array1[3]]
      }
    }
    iterate1(neuralNetwork1, num)
    this.setState({
      clicked: true,
      data: data,
      data1: data1,
      layout: layout,
      distance: iterate(neuralNetwork, num)[1],
      totalError: iterate(neuralNetwork, num)[0],

      distance1: iterate1(neuralNetwork1, num)[1],
      totalError1: iterate1(neuralNetwork1, num)[0]
    })
  }
  render() {
    return (
      <div>
        <div className="num-buttons">
          <button className="num-button" onClick={event => this.handleClick(event, 1)}>1</button>
          <button className="num-button" onClick={event => this.handleClick(event, 5)}>5</button>
          <button className="num-button" onClick={event => this.handleClick(event, 10)}>10</button>
          <button className="num-button" onClick={event => this.handleClick(event, 50)}>50</button>
          <button className="num-button" onClick={event => this.handleClick(event, 75)}>75</button>
          <button className="num-button" onClick={event => this.handleClick(event, 100)}>100</button>
          <button className="num-button" onClick={event => this.handleClick(event, 1000)}>1000</button>
          <button className="num-button" onClick={event => this.handleClick(event, 10000)}>10000</button>
        </div>
        <PlotlyComponent className="bubble-graph" data={this.state.data} layout={this.state.layout} />
        Training Text:<h4 className="training-text" id="input-text">{this.state.renderedText}</h4>
        <div className="first-relations">
          <h4 className="first" id="first-relation">Relation: {this.state.renderedWord1} --> {this.state.renderedWord2}</h4>
          <h4 className="first" id="first-distance">Distance: {this.state.distance}</h4>
          <h4 className="first" id="first-error">Error: {this.state.totalError}</h4>
        </div>
        ------------------------------
                <div className="second-relations">
          <h4 className="second" id="second-relation">Relation: {this.state.renderedWord1} --> {this.state.renderedWord3}</h4>
          <h4 className="second" id="second-distance">Distance: {this.state.distance1}</h4>
          <h4 className="second" id="second-error">Error: {this.state.totalError1}</h4>
        </div>
        <PlotlyComponent className="bubble-graph" data={this.state.data1} layout={this.state.layout} />
        <form className="text-form" onSubmit={this.handleSubmit}>
          <label className="text-label">Training Text: </label>
          <input type="text" className="text" value={this.state.textEntry} onChange={this.handleTextChange} />
          <label>Compare:  </label>
          <input type="text" className="word1" value={this.state.word1Entry} onChange={this.handleWord1Change} />
          <label>  to  </label>
          <input type="text" className="word2" value={this.state.word2Entry} onChange={this.handleWord2Change} />
          <label>  vs  </label>
          <input type="text" className="word3" value={this.state.word3Entry} onChange={this.handleWord3Change} />
          <input type="submit" value="submit" className="submit" />
        </form>
        <h4>Given {this.state.renderedWord1}, is {this.state.renderedWord2} or {this.state.renderedWord3} more likely to appear nearby?</h4>
        <button className="answer" onClick={this.handleAnswerClick} >Answer</button>
        <h4>{this.state.answer}</h4>
      </div>
    );
  }
}

const Plot = PlotContainerClass
export default Plot
