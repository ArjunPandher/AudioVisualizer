"use strict";

class AudioVisGenerator {
    constructor(audioPath, audioElementId) {
        this.canvases = []; // List of visualiser canvases
        this.canvasNum = 0; // Number of canvases currently created under this instance of the library
        this.animElements = []; // List of visualiser elements
        this.animNum = 0; // Number of elements currently assigned to be animated under this instance of the library
        this.audioPath = audioPath; // Location of the audio source
        this.audioElement = document.getElementById(audioElementId); // The actual HTML audio element
        
        this.audioCtx = {} // The audio context of the audio source
        this.audioAnalyser = {} // The object responsible for analzying the audio being played

        this.source = {} // The direct source of the audio

        this.audioData = {} // Storing the audio data in an array of predefined size

        this.canvasTypes = {0:"bar", 1:"circle"}; // The types of canvases currently available to use
        this.animationTypes = {0:"vertical", 1:"horizontal", 2:"rotation", 3:"scaleX", 4:"scaleY", 5:"skewX", 6:"skewY", 7:"color", 8:"backgroundColor"} // The types of animations currently available to use
        this.isSetUp = false // Whether the setUp() method has been called or not
    }

    // Must be called upon user input.
    setUp() {
        this.audioCtx = new AudioContext(); // The audio context of the audio source
        this.audioAnalyser = this.audioCtx.createAnalyser(); // The object responsible for analzying the audio being played
        this.audioAnalyser.fftSize = 2 ** 11; // Setting the analyser's array input size

        this.source = this.audioCtx.createMediaElementSource(this.audioElement); // The direct source of the audio
        this.source.connect(this.audioAnalyser); // Connecting the audio analyser to the source
        this.source.connect(this.audioCtx.destination); // Connecting the audo context's destination to the source

        this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount); // Storing the audio data in an array of predefined size
        this.isSetUp = true
    }

    // Creating an animated canvas and returning it
    addCanvas(canvas, canvasType, primaryColor, secondaryColor) {
        canvasType = this.canvasTypes[canvasType]
        if (!this.canvasTypes.includes(canvasType)) {
            console.log("Invalid canvas type!")
            return
        }
        console.log(primaryColor)
        const animCanvas = new AnimCanvas(canvas, canvasType, this.canvasNum, primaryColor, secondaryColor)
        this.canvasNum = this.canvasNum + 1;
        this.canvases.push(animCanvas);
        return animCanvas
    }

    // Adding an element to be animated
    addElement(element, animationType, animationParams) {
        animationType = this.animationTypes[animationType]
        if (!this.animationTypes.includes(animationType)){
            console.log("Invalid animation type!")
            return
        }
        const animElement = new AnimElement(element, this.animNum, animationType, animationParams)
        this.animNum = this.animNum + 1;
        this.animElements.push(animElement);
        return animElement;
    }

    // Removing an animated canvas
    removeCanvas(canvasID) {
        for (let i = 0; i < this.canvases.length; i++) {
            if (this.canvases[i].canvasID === canvasID) {
                this.canvases[i].removeCanvas()
                this.canvases.splice(i, 1)
                return
            }
        }
        console.log("Unable to find canvis with canvasID " + canvasID)
    }

    // Removing an animated element
    removeElement(elementID) {
        for (let i = 0; i < this.animElements.length; i++) {
            if (this.animElements[i].elementID === elementID) {
                this.animElements[i].removeElement();
                this.animElements.splice(i, 1)
                return
            }
        }
        console.log("Unable to find element with elementID " + elementID)
    }

    // animating all canvases 
    animateAllCanvases() {
        if (!this.isSetUp) {
            console.log("The audio visualiser hasn't been set up yet!")
            return
        }
        for (let i = 0; i < this.canvasNum; i++) {
            this.animateCanvas(this.canvases[i])
        }
    }

    // animating all non-canvas elements in system
    animateAllElements() {
        if (!this.isSetUp) {
            console.log("The audio visualiser hasn't been set up yet!")
            return
        }
        for (let i = 0; i < this.animNum; i++) {
            this.animateElement(this.animElements[i])
        }
    }

    // animating the canvas every frame
    // make private somehow or not idk
    animateCanvas(animCanvas) {
        function animation() {
            this.audioAnalyser.getByteFrequencyData(this.audioData);
            if (animCanvas.canvasType === "bar") {
                barDraw(this.audioData);
            } else if (animCanvas.canvasType === "circle") {
                circleDraw(this.audioData);
            }
            requestAnimationFrame(animation.bind(this));
        }

        function barDraw(data) {
            // Translating our data fron a Uint8Array to a regular array
            data = Array.from(data);
            // Clearing the rectangle every time this is called
            animCanvas.ctx.clearRect(0, 0, animCanvas.canvas.width, animCanvas.canvas.height);
            // Setting the space between each bar
            let space = animCanvas.canvas.width / data.length;
            // Changing the size of each bar in the canvas based on the audio data
            data.forEach((value, index) => {
                animCanvas.ctx.beginPath();
                animCanvas.ctx.moveTo(space * index, animCanvas.canvas.height);
                animCanvas.ctx.lineTo(space * index, animCanvas.canvas.height - value);
                animCanvas.ctx.stroke();
            });
            animCanvas.ctx.strokeStyle = animCanvas.primaryColor
            animCanvas.ctx.fillStyle = animCanvas.secondaryColor
        }

        function circleDraw(data) {
            data = Array.from(data);

            let bassArr = data.slice(15, 255);
            let bassAvg = 0;
            for (let i = 0; i < bassArr.length; i++) {
                bassAvg += bassArr[i];
            }
            bassAvg = bassAvg / bassArr.length;
            let bassRad = 75 + Math.min(animCanvas.canvas.height, animCanvas.canvas.width) * 0.002 * bassAvg;

            let trebArr = data.slice(256, 700);
            let trebAvg = 0;
            for (let i = 0; i < trebArr.length; i++) {
                trebAvg += trebArr[i];
            }
            trebAvg = trebAvg / trebArr.length;
            let trebRad = 25 + Math.min(animCanvas.canvas.height, animCanvas.canvas.width) * 0.005 * trebAvg;

            animCanvas.ctx.clearRect(0, 0, animCanvas.canvas.width, animCanvas.canvas.height);

            animCanvas.ctx.beginPath();
            animCanvas.ctx.arc(animCanvas.canvas.width / 2, animCanvas.canvas.height / 2, bassRad, 0, Math.PI * 2, false);
            animCanvas.ctx.closePath();
            animCanvas.ctx.fillStyle = animCanvas.primaryColor;
            animCanvas.ctx.fill();

            animCanvas.ctx.beginPath();
            animCanvas.ctx.arc(animCanvas.canvas.width / 2, animCanvas.canvas.height / 2, trebRad, 0, Math.PI * 2, false);
            animCanvas.ctx.lineWidth = 4;
            animCanvas.ctx.strokeStyle = animCanvas.secondaryColor;
            animCanvas.ctx.stroke();
            animCanvas.ctx.closePath();
        }

        if (!this.isSetUp) {
            console.log("The audio visualiser hasn't been set up yet!")
            return
        }

        requestAnimationFrame(animation.bind(this));
    }

    // animating the element every frame
    // make private somehow or not idk
    animateElement(animElement) {
        function animation() {
            this.audioAnalyser.getByteFrequencyData(this.audioData);

            let data = Array.from(this.audioData)
            let dataAvg = 0
            for (let i = 0; i < data.length; i++) {
                dataAvg += data[i]
            }
            dataAvg = dataAvg / data.length
            dataAvg = dataAvg / 100

            switch (animElement.animationType) {
                case "vertical":
                    vertAnim(dataAvg);
                    break;
                case "horizontal":
                    horiAnim(dataAvg);
                    break;
                case "rotation":
                    rotateAnim(dataAvg);
                    break;
                case "scaleX":
                    scaleXAnim(dataAvg);
                    break;
                case "scaleY":
                    scaleYAnim(dataAvg);
                    break;
                case "skewX":
                    skewXAnim(dataAvg);
                    break;
                case "skewY":
                    skewYAnim(dataAvg);
                    break;
                case "color":
                    colorAnim(dataAvg);
                    break;
                case "backgroundColor":
                    backgroundColorAnim(dataAvg);
                    break;
            }
            requestAnimationFrame(animation.bind(this));
        }

        function vertAnim(dataAvg) {
            const maxMoveAmount = animElement.animationParams[0]
            animElement.element.style.transform = 'translateY(' + Math.min(maxMoveAmount * dataAvg, maxMoveAmount) + 'px)'
        }

        function horiAnim(dataAvg) {
            const maxMoveAmount = animElement.animationParams[0]
            animElement.element.style.transform = 'translateX(' + Math.min(maxMoveAmount * dataAvg, maxMoveAmount) + 'px)'
        }

        function rotateAnim(dataAvg) {
            const maxRotateAmount = animElement.animationParams[0]
            animElement.element.style.transform = 'rotate(' + Math.min(maxRotateAmount * dataAvg, maxRotateAmount) + 'deg)'
        }

        function scaleXAnim(dataAvg){
            const maxScaleAmount = animElement.animationParams[0]
            animElement.element.style.transform = 'scaleX(' + Math.min(maxScaleAmount * dataAvg, maxScaleAmount) + 'deg)'
        }

        function scaleYAnim(dataAvg){
            const maxScaleAmount = animElement.animationParams[0]
            animElement.element.style.transform = 'scaleY(' + Math.min(maxScaleAmount * dataAvg, maxScaleAmount) + 'deg)'
        }

        function skewXAnim(dataAvg){
            const maxSkewAmount = animElement.animationParams[0]
            animElement.element.style.transform = 'skewX(' + Math.min(maxSkewAmount * dataAvg, maxSkewAmount) + 'deg)'
        }

        function skewYAnim(dataAvg){
            const maxSkewAmount = animElement.animationParams[0]
            animElement.element.style.transform = 'skewY(' + Math.min(maxSkewAmount * dataAvg, maxSkewAmount) + 'deg)'
        }

        function colorAnim(dataAvg){
            const color1 = animElement.animationParams[0]
            const red1 = color1.red
            const blue1 = color1.blue
            const green1 = color1.green

            const color2 = animElement.animationParams[1]
            const red2 = color2.red
            const blue2 = color2.blue
            const green2 = color2.green

            const diffred = red1 - red2
            const diffblue = blue1 - blue2
            const diffgreen = green1 - green2

            animElement.element.style.color = 'rgb(' + Math.round(red1 - diffred * dataAvg) + ',' + Math.round(blue1 - diffblue * dataAvg) + ',' + Math.round(green1 - diffgreen * dataAvg) + ')'
        }

        function backgroundColorAnim(dataAvg){
            const color1 = animElement.animationParams[0]
            const red1 = color1.red
            const blue1 = color1.blue
            const green1 = color1.green

            const color2 = animElement.animationParams[1]
            const red2 = color2.red
            const blue2 = color2.blue
            const green2 = color2.green

            const diffred = red1 - red2
            const diffblue = blue1 - blue2
            const diffgreen = green1 - green2

            animElement.element.style.backgroundColor = 'rgb(' + Math.round(red1 - diffred * dataAvg) + ',' + Math.round(blue1 - diffblue * dataAvg) + ',' + Math.round(green1 - diffgreen * dataAvg) + ')'
        }

        if (!this.isSetUp) {
            console.log("The audio visualiser hasn't been set up yet!")
            return
        }

        requestAnimationFrame(animation.bind(this))
    }
}

class AnimCanvas {
    constructor (canvas, canvasType, canvasID, primaryColor, secondaryColor) {
        this.canvas = canvas
        this.canvasType = canvasType
        this.canvasID = canvasID
        this.ctx = canvas.getContext("2d")
        this.isHidden = false
        this.isDraggable = false
        this.defaultPosition = this.canvas.style.position // note that if this changes after object is created, one must update this property
        this.primaryColor = primaryColor
        this.secondaryColor = secondaryColor
    }

    setCanvasType(canvasType){
        this.canvasType = canvasType
    }

    removeCanvas () {
        this.canvas.remove()
    }

    hideCanvas () {
        if (this.isHidden) {
            console.log("Canvas" + this.canvas.id + " is already hidden!")
            return
        }
        this.element.style.display = "none"
        this.isHidden = true
    }

    showCanvas () {
        if (!this.isHidden) {
            console.log("Canvas " + this.canvas.id + " is already visible!")
            return
        }
        this.element.style.display = this.defaultDisplay
        this.isHidden = false
    }

    makeDraggable () {
        if (this.isDraggable) { 
            console.log("Canvas " + this.canvas.id + " is already draggable!")
            return
        }
        if (getComputedStyle(this.canvas).position !== "absolute") {
            console.log("Canvas " + this.canvas.id + " does not have position: absolute! Instead it has " + getComputedStyle(this.canvas).position)
        }
        
        this.canvas.style.cursor = "move"
        this.canvas.onmousedown = dragElement.bind(this)

        function dragElement(e) {
            let x1 = 0
            let y1 = 0
            let x2 = 0
            let y2 = 0

            e = e || window.event
            e.preventDefault()

            x2 = e.clientX
            y2 = e.clientY
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null }
            document.onmousemove = mouseMoveElement.bind(this)

            function mouseMoveElement(e) {
                e = e || window.event
                e.preventDefault()

                x1 = x2 - e.clientX
                y1 = y2 - e.clientY
                x2 = e.clientX
                y2 = e.clientY
                this.canvas.style.top = (this.canvas.offsetTop - y1) + "px";
                this.canvas.style.left = (this.canvas.offsetLeft - x1) + "px";
            }
        }

        this.isDraggable = true
    }

    makeUndraggable () {
        if (!this.isDraggable) { 
            console.log("Canvas " + this.canvas.id + " is already undraggable!")
            return
        }

        this.canvas.style.cursor = auto
        this.canvas.onmousedown = null
        this.isDraggable = false
    }

    setDefaultPosition(position) {
        this.defaultPosition = position
    }
}

class AnimElement {
    constructor (element, elementID, animationType, animationParams) {
        this.element = document.getElementById(element.id)
        this.animationType = animationType
        this.animationParams = animationParams
        this.elementID = elementID
        this.isHidden = false
        this.isDraggable = false
        this.defaultPosition = this.element.style.position // note that if this changes after object is created, one must update this property
    }

    setAnimationType(animationType, animationParams) {
        this.animationType = animationType
        this.animationParams = animationParams
    }

    removeElement () {
        this.element.remove()
    }

    hideElement () {
        if (this.isHidden) {
            console.log("Element " + this.element.id + " is already hidden!")
            return
        }
        this.element.style.display = "none"
        this.isHidden = true
    }

    showElement () {
        if (!this.isHidden) {
            console.log("Element " + this.element.id + " is already visible!")
            return
        }
        this.element.style.display = this.defaultDisplay
        this.isHidden = false
    }

    makeDraggable () {
        if (this.isDraggable) { 
            console.log("Element " + this.element.id + " is already draggable!")
            return
        }
        if (getComputedStyle(this.element).position !== "absolute") {
            console.log("Element " + this.element.id + " does not have position: absolute! Instead it has " + getComputedStyle(this.element).position)
        }
        
        this.element.style.cursor = "move"
        this.element.onmousedown = dragElement.bind(this)

        function dragElement(e) {
            let x1 = 0
            let y1 = 0
            let x2 = 0
            let y2 = 0

            e = e || window.event
            e.preventDefault()

            x2 = e.clientX
            y2 = e.clientY
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null }
            document.onmousemove = mouseMoveElement.bind(this)

            function mouseMoveElement(e) {
                e = e || window.event
                e.preventDefault()

                x1 = x2 - e.clientX
                y1 = y2 - e.clientY
                x2 = e.clientX
                y2 = e.clientY
                this.element.style.top = (this.element.offsetTop - y1) + "px";
                this.element.style.left = (this.element.offsetLeft - x1) + "px";
            }
        }

        this.isDraggable = true
    }

    makeUndraggable () {
        if (!this.isDraggable) { 
            console.log("Element " + this.element.id + " is already undraggable!")
            return
        }

        this.element.style.cursor = auto
        this.element.onmousedown = null
        this.isDraggable = false
    }

    setDefaultPosition(position) {
        this.defaultPosition = position
    }
}