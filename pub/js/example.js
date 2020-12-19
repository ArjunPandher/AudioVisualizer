const audioGen = new AudioVisGenerator("https://quiet-dawn-92680.herokuapp.com/God%20Is%20Perfect.mp3", "player")
let barVis = document.createElement("CANVAS")
let circleVis = document.createElement("CANVAS")
let colorTextDiv = document.getElementById("description")

let audioDiv = document.getElementById("audioVisDiv")

barVis = audioGen.addCanvas(barVis, "bar")
circleVis = audioGen.addCanvas(circleVis, "circle")
audioDiv.appendChild(barVis.canvas, "#ffb4a2", "#b5838d")
audioDiv.appendChild(circleVis.canvas, "#ffb4a2", "#b5838d")

colorTextDiv = audioGen.addElement(colorTextDiv, "color", [{red: 255, blue: 0, green: 0},{red: 0, blue: 255, green: 0}])
colorTextDiv.makeDraggable()

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