const audioGen1 = new AudioVisGenerator("player1")
const audioGen2 = new AudioVisGenerator("player2")
const audioGen3 = new AudioVisGenerator("player3")

const barCanvas = document.getElementById("canvas-bar")
barCanvas.width = "1000"
barCanvas.height = "300"
const barCanvasVis = audioGen1.addCanvas(barCanvas, 0, "#000000", "#ffb4a2")

const player1 = document.getElementById("player1")
let player1HasBeenPlayed = false
player1.onplay = () => {
    if (!player1HasBeenPlayed) {
        audioGen1.setUp()
        player1HasBeenPlayed = true
    }
    audioGen1.animateAllCanvases()
}