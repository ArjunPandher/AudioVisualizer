const audioGen = new AudioVisGenerator("https://audio.jukehost.co.uk/0wcStwqV7dUaVDX34dr7yc1UqXBl13pi", "player")
const barVis = document.createElement("CANVAS")
const circleVis = document.createElement("CANVAS")

const audioDiv = document.getElementById("audioVisDiv")
audioDiv.appendChild(barVis)
audioDiv.appendChild(circleVis)

audioGen.addCanvas(barVis)
audioGen.addCanvas(circleVis)

const audioElement = document.getElementById("player")

audioElement.onplay = ()=>{
    audioGen.setUp();
    audioGen.animateCanvas("bar", barVis, barVis.getContext("2d"))
    audioGen.animateCanvas("circle", circleVis, circleVis.getContext("2d"))
    console.log(audioGen)
}