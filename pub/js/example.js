const audioGen = new AudioVisGenerator("https://quiet-dawn-92680.herokuapp.com/God%20Is%20Perfect.mp3", "player")
const barVis = document.createElement("CANVAS")
const circleVis = document.createElement("CANVAS")

const audioDiv = document.getElementById("audioVisDiv")

barVis = audioGen.addCanvas(barVis, "bar")
cicleVis = audioGen.addCanvas(circleVis, "circle")
audioDiv.appendChild(barVis.canvas)
audioDiv.appendChild(circleVis.canvas)

const audioElement = document.getElementById("player")

audioElement.onplay = ()=>{
    audioGen.animateAllCanvases()
}