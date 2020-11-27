const audioGen = new AudioVisGenerator("./God Is Perfect.mp3", "player")
const barVis = audioGen.makeCanvas()
const circleVis = audioGen.makeCanvas()

const audioDiv = document.getElementById("audioPlayer")
audioDiv.appendChild(barVis)
audioDiv.appendChild(circleVis)

audioGen.animateCanvas("bar", barVis, barVis.getContext())
audioGen.animateCanvas("circle", circleVis, barVis.getContext())

function playAudio() {
    const audioPlayer = document.getElementById("player")
    audioPlayer.play()
}