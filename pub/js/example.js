const audioGen1 = new AudioVisGenerator("player1")
const audioGen2 = new AudioVisGenerator("player2")
const audioGen3 = new AudioVisGenerator("player3")

const barCanvas = document.getElementById("canvas-bar")
barCanvas.width = "1000"
barCanvas.height = "300"
const barCanvasVis = audioGen1.addCanvas(barCanvas, 0, "#000000", "#ffb4a2")

const basicElem = document.getElementById("audioVisElement1")
const basicElemVis = audioGen2.addElement(basicElem, [3], [[3]])

const advancedElem = document.getElementById("audioVisElement2")
const advancedElemVis = audioGen3.addElement(advancedElem, [2, 3, 7], [[30], [3], [{red:0, green: 255, blue: 0}, {red:255, green: 0, blue: 0}]])
advancedElemVis.makeDraggable()

const player1 = document.getElementById("player1")
let player1HasBeenPlayed = false
player1.onplay = () => {
    if (!player1HasBeenPlayed) {
        audioGen1.setUp()
        player1HasBeenPlayed = true
    }
    audioGen1.animateAllCanvases()
}

const player2 = document.getElementById("player2")
let player2HasBeenPlayed = false
player2.onplay = () => {
    if (!player2HasBeenPlayed) {
        audioGen2.setUp()
        player2HasBeenPlayed = true
    }
    audioGen2.animateAllElements()
}

const player3 = document.getElementById("player3")
let player3HasBeenPlayed = false
player3.onplay = () => {
    if (!player3HasBeenPlayed) {
        audioGen3.setUp()
        player3HasBeenPlayed = true
    }
    audioGen3.animateAllElements()
}

$("li").on("click", function() {
    let liClass = this.className;
    if (liClass === "active") {
        return
    }
    let liID = this.id
    let IDNum = liID.charAt(liID.length - 1)
    if (liID.charAt(0) === 'j') {
        $("#js-tab" + IDNum).attr('class', 'active')
        $("#html-tab" + IDNum).attr('class', '')
        $("#css-tab" + IDNum).attr('class', '')

        $("#js-code" + IDNum).attr('class', 'active')
        $("#html-code" + IDNum).attr('class', '')
        $("#css-code" + IDNum).attr('class', '')
    } else if (liID.charAt(0) === 'h') {
        
        $("#js-tab" + IDNum).attr('class', '')
        $("#html-tab" + IDNum).attr('class', 'active')
        $("#css-tab" + IDNum).attr('class', '')

        $("#js-code" + IDNum).attr('class', '')
        $("#html-code" + IDNum).attr('class', 'active')
        $("#css-code" + IDNum).attr('class', '')
    } else if (liID.charAt(0) === 'c') {
        $("#js-tab" + IDNum).attr('class', '')
        $("#html-tab" + IDNum).attr('class', '')
        $("#css-tab" + IDNum).attr('class', 'active')

        $("#js-code" + IDNum).attr('class', '')
        $("#html-code" + IDNum).attr('class', '')
        $("#css-code" + IDNum).attr('class', 'active')
    }
 });