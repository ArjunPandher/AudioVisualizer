const audioGen = new AudioVisGenerator("https://quiet-dawn-92680.herokuapp.com/God%20Is%20Perfect.mp3", "player")
let barVis = document.createElement("CANVAS")
let circleVis = document.createElement("CANVAS")
const vertTextDiv = document.getElementById("description")

let audioDiv = document.getElementById("audioVisDiv")

barVis = audioGen.addCanvas(barVis, "bar")
circleVis = audioGen.addCanvas(circleVis, "circle")
audioDiv.appendChild(barVis.canvas)
audioDiv.appendChild(circleVis.canvas)

vertTextDiv = audioGen.addElement(vertTextDiv, "vertical", [100])

const audioElement = document.getElementById("player")
let hasBeenPlayed = false

audioElement.onplay = () => {
    if (!hasBeenPlayed) {
        audioGen.setUp()
        hasBeenPlayed = true
        audioGen.animateAllCanvases()
        audioGen.animateAllElements()
    }
    
}