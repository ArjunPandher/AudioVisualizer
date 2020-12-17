"use strict";

class AudioVisGenerator {
    constructor(audioPath, audioElementId) {
        this.canvases = []; // List of visualiser canvases
        this.canvasNum = 0; // Number of canvases currently created under this instance of the library
        this.audioPath = audioPath; // Location of the audio source
        this.audioElement = document.getElementById(audioElementId); // The actual HTML audio element
        
        this.audioCtx = new AudioContext(); // The audio context of the audio source
        this.audioAnalyser = this.audioCtx.createAnalyser(); // The object responsible for analzying the audio being played
        this.audioAnalyser.fftSize = 2 ** 11; // Setting the analyser's array input size

        this.source = this.audioCtx.createMediaElementSource(this.audioElement); // The direct source of the audio
        this.source.connect(this.audioAnalyser); // Connecting the audio analyser to the source
        this.source.connect(this.audioCtx.destination); // Connecting the audo context's destination to the source

        this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount); // Storing the audio data in an array of predefined size
        this.audioCtx.resume()

        this.canvasTypes = ["bar", "circle"]; // The types of canvases currently available to use
    }

    // Creating an animated canvas and returning it
    addCanvas(canvas, canvasType) {
        if (!this.canvasTypes.includes(canvasType)) {
            console.log("Invalid canvas type!")
            return
        }
        const animCanvas = {
            canvas: canvas,
            canvasType: canvasType,
            ctx: canvas.getContext("2d")
        }
        this.canvasNum = this.canvasNum + 1;
        this.canvases.push(animCanvas);
        return animCanvas
    }

    // animating all canvases 
    animateAllCanvases() {
        for (let i = 0; i < this.canvasNum; i++) {
            this.animateCanvas(this.canvases[i])
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
        }

        function circleDraw(data) {
            data = Array.from(data);

            let bassArr = data.slice(15, 255);
            let bassAvg = 0;
            for (let i = 0; i < bassArr.length; i++) {
                bassAvg += bassArr[i];
            }
            bassAvg = bassAvg / bassArr.length;
            let bassRad = 75 + Math.min(animCanvas.canvas.height, animCanvas.canvas.width) * 0.001 * bassAvg;

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
            animCanvas.ctx.fillStyle = "#7CC6FE";
            animCanvas.ctx.fill();

            animCanvas.ctx.beginPath();
            animCanvas.ctx.arc(animCanvas.canvas.width / 2, animCanvas.canvas.height / 2, trebRad, 0, Math.PI * 2, false);
            animCanvas.ctx.lineWidth = 4;
            animCanvas.ctx.strokeStyle = "#CCD5FF";
            animCanvas.ctx.stroke();
            animCanvas.ctx.closePath();
        }

        requestAnimationFrame(animation.bind(this));
    }
}

