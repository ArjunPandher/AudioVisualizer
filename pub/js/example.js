const audioGen1 = new AudioVisGenerator("player1")
const audioGen2 = new AudioVisGenerator("player2")
const audioGen3 = new AudioVisGenerator("player3")

const barCanvas = document.getElementById("canvas-bar")
const barCanvasVis = audioGen1.addCanvas("bar", "ffb4a2", "e5989b")

const player1 = document.getElementById("player1")
player1.onplay = () => {
    audioGen1.setUp()
    audioGen1.animateAllCanvases()
}