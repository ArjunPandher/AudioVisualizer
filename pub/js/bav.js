"use strict";



class AudioVisGenerator {
    constructor(audioPath, audioElementId) {
        this.canvases = []; // List of visualiser canvases
        this.canvasNum = 0; // Number of canvases currently created under this instance of the library
        this.audioPath = audioPath; // Location of the audio source
        this.audioElement = document.getElementById(audioElementId); // The actual HTML audio element
        
        this.audioCtx = {}
        this.audioAnalyser = {}
        this.audioData = {}

        this.canvasTypes = ["bar", "circle"]; // The types of canvases currently available to use

        this.isSetUp = false
    }

    // Call this on user input
    setUp() {
        this.audioCtx = new AudioContext(); // The audio context of the audio source
        this.audioAnalyser = this.audioCtx.createAnalyser(); // The object responsible for analzying the audio being played
        this.audioAnalyser.fftSize = 2 ** 11; // Setting the analyser's array input size

        this.source = this.audioCtx.createMediaElementSource(this.audioElement); // The direct source of the audio
        this.source.connect(this.audioAnalyser); // Connecting the audio analyser to the source
        this.source.connect(this.audioCtx.destination); // Connecting the audo context's destination to the source

        this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount); // Storing the audio data in an array of predefined size
        this.audioCtx.resume()

        this.isSetUp = true
    }

    // Creating a canvas, and returning it
    addCanvas(canvas) {
        this.canvasNum = this.canvasNum + 1;
        this.canvases.push(canvas);
    }

    // animating the canvas every frame
    animateCanvas(canvasType, canvas, ctx) {
        function animation() {
            
            this.audioAnalyser.getByteFrequencyData(this.audioData);
            if (canvasType === "bar") {
                barDraw(this.audioData);
            } else if (canvasType === "circle") {
                circleDraw(this.audioData);
            }

            requestAnimationFrame(animation.bind(this));
        }

        function barDraw(data) {
            // Translating our data fron a Uint8Array to a regular array
            data = Array.from(data);
            // Clearing the rectangle every time this is called
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Setting the space between each bar
            let space = canvas.width / data.length;
            // Changing the size of each bar in the canvas based on the audio data
            data.forEach((value, index) => {
                ctx.beginPath();
                ctx.moveTo(space * index, canvas.height);
                ctx.lineTo(space * index, canvas.height - value);
                ctx.stroke();
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
            let bassRad = 75 + Math.min(canvas.height, canvas.width) * 0.1 * bassAvg;

            let trebArr = data.slice(256, 700);
            let trebAvg = 0;
            for (let i = 0; i < trebArr.length; i++) {
                trebAvg += trebArr[i];
            }
            trebAvg = trebAvg / trebArr.length;
            let trebRad = 25 + Math.min(canvas.height, canvas.width) * 0.1 * trebAvg;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, bassRad, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = "#7CC6FE";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, trebRad, 0, Math.PI * 2, false);
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#CCD5FF";
            ctx.stroke();
            ctx.closePath();
        }

        if (this.isSetUp === false) {
            console.log("Run setUp() first");
            return;
        }

        if (!this.canvasTypes.includes(canvasType)) {
            console.log("Invalid canvas type");
            return;
        }

        requestAnimationFrame(animation.bind(this));
    }
}
