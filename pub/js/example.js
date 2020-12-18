const audioGen = new AudioVisGenerator("https://quiet-dawn-92680.herokuapp.com/God%20Is%20Perfect.mp3", "player")
let barVis = document.createElement("CANVAS")
let circleVis = document.createElement("CANVAS")

const audioDiv = document.getElementById("audioVisDiv")

barVis = audioGen.addCanvas(barVis, "bar")
circleVis = audioGen.addCanvas(circleVis, "circle")
audioDiv.appendChild(barVis.canvas)
audioDiv.appendChild(circleVis.canvas)

const audioElement = document.getElementById("player")
const hasBeenPlayed = false

audioElement.onplay = () => {
    if (!hasBeenPlayed) {
        audioGen.setUp()
    }
    audioGen.animateAllCanvases()
}