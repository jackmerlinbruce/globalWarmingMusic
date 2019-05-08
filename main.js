document.addEventListener('DOMContentLoaded', function() {
    function setSynth(detune) {
        let pingPong = new Tone.PingPongDelay("32n", 0).toMaster()
        let chorus = new Tone.Chorus(detune, 2.5, 0.5).toMaster()
        var filter = new Tone.Filter(200, "lowpass").toMaster() 

        let synth = new Tone.Synth().set({
            "filter": {
                "type": "highpass"
            },
            "envelope": {
                "attack": 0.05,
                "release": 1
            }
        }).connect(chorus).toMaster()

        return synth
    }

    // SET UP
    let startYear = 1879
    let currentPos = 0
    const labels = document.getElementById('labels')
    const yearLabel = document.getElementById('yearLabel')
    const dataLabel = document.getElementById('temperatureLabel')
    const startMessage = document.getElementById('startMessage')
    const footer = document.getElementById('footer')
    const gradient = document.getElementById('gradient')
    const body = document.querySelector('body')

    // LEGEND
    const colour = {
    	low: '#240F4A',
    	mid: '#B83856',
    	high: '#FAC53F'
    }

    gradient.style.background = `linear-gradient(to right, ${colour.low}, ${colour.mid}, ${colour.high})`
    // footer.style.background = `linear-gradient(to right, ${colour.low}, ${colour.mid}, ${colour.high})`

    // DATA
    const musicScaleNotes = {
        aMinor: ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7'],
        fOriental: ['F1', 'Gb1', 'A1', 'Bb1', 'B1', 'D1', 'Eb1', 'F2', 'Gb2', 'A2', 'Bb2', 'B2', 'D2', 'Eb2', 'F3', 'Gb3', 'A3', 'Bb3', 'B3', 'D3', 'Eb3', 'F4', 'Gb4', 'A4', 'Bb4', 'B4', 'D4', 'Eb4', 'F5', 'Gb5', 'A5', 'Bb5', 'B5', 'D5', 'Eb5', 'F6', 'Gb6', 'A6', 'Bb6', 'B6', 'D6', 'Eb6', 'F7', 'Gb7', 'A7', 'Bb7', 'B7', 'D7', 'Eb7']
    }
    
    function getScales(data) {
    	/*
		This function makes a set of different scales based on any set of 1D data in an array
    	*/
        let dataMin = Math.min(...data),
            dataMax = Math.max(...data)

        let midiLow = 31,
            midiHigh = 110
        let colourLow = '#240F4A',
            colourMid = '#B83856',
            colourHigh = '#FAC53F'
        let detuneLow = 0,
            detuneHigh = 10
        let sizeLow = 0.1,
            sizeHigh = 1

        let midi = d3.scale.linear()
            .domain([dataMin, dataMax])
            .rangeRound([midiLow, midiHigh])
        let colour = d3.scale.linear()
            .domain([dataMin, (dataMin + dataMax) / 2, dataMax])
            .range([colourLow, colourMid, colourHigh])
        let detune = d3.scale.linear()
            .domain([dataMin, dataMax])
            .rangeRound([detuneLow, detuneHigh])
        let size = d3.scale.linear()
            .domain([0, data.length -1])
            .range([sizeLow, sizeHigh])
        let minorScale = d3.scale.linear()
            .domain([dataMin, dataMax])
            .rangeRound([0, musicScaleNotes.aMinor.length -1])

        return {
            midi,
            colour,
            detune,
            size,
            minorScale
        }
        
    }

    const data = [-0.19, -0.11, -0.12, -0.2, -0.3, -0.32, -0.33, -0.36, -0.18, -0.11, -0.37, -0.24, -0.27, -0.32, -0.32, -0.23, -0.12, -0.12, -0.28, -0.19, -0.09, -0.16, -0.3, -0.39, -0.49, -0.28, -0.23, -0.4, -0.44, -0.48, -0.43, -0.43, -0.36, -0.36, -0.16, -0.12, -0.33, -0.44, -0.28, -0.27, -0.26, -0.18, -0.27, -0.25, -0.25, -0.21, -0.09, -0.21, -0.19, -0.35, -0.15, -0.1, -0.17, -0.3, -0.14, -0.21, -0.16, -0.04, -0.04, -0.03, 0.11, 0.18, 0.05, 0.07, 0.2, 0.08, -0.07, -0.04, -0.11, -0.11, -0.18, -0.07, 0.01, 0.07, -0.15, -0.14, -0.21, 0.04, 0.07, 0.03, -0.02, 0.05, 0.04, 0.07, -0.2, -0.1, -0.05, -0.02, -0.07, 0.07, 0.03, -0.09, 0.01, 0.16, -0.08, -0.02, -0.11, 0.17, 0.06, 0.16, 0.27, 0.33, 0.13, 0.31, 0.16, 0.12, 0.18, 0.33, 0.41, 0.28, 0.44, 0.41, 0.22, 0.24, 0.31, 0.45, 0.34, 0.47, 0.62, 0.4, 0.4, 0.53, 0.62, 0.61, 0.53, 0.67, 0.62, 0.64, 0.52, 0.63, 0.7, 0.59, 0.62, 0.65, 0.73, 0.87, 0.99, 0.91, 0.83,]
    // const data = [243024, 344024, 403722, 394206, 546211, 393390, 144285, 93911, 44932, 6361, 10965, 6854, 19320, 24521, 12535, 14586, 24173, 55313, 45493, 75612, 78648, 88993, 186075, 143990, 183814, 189598, 277907, 191929, 227410, 97112, 10411, 10411, 55817, 112928, 48421, 42624, 47524, 67525, 94692, 79266, 74829, 55088, 41587, 9714, 10052, 15503, 17060, 9385, 12600, 12719, 12024, 11496, 12098, 9196, 13436, 6646.25, 7210, 7653.75, 5490, 5294, 9606, 12073, 18899, 25267, 14294, 11760, 12056, 11257, 16583, 21048, 19875,]
    const scales = getScales(data)
    body.style.backgroundColor = scales.colour(data[0])
    labels.style.transform = `scale(0.1)`
    TweenMax.to(labels, 0.1, { y: 70 })

    // STEP FOWARD
    let textSize = 10
   
    function stepForward(direction='forward') {
        let stepPos = () => null
        let stepYear = () => null
        if (direction === 'forward') {
            stepPos = () => currentPos++
            stepYear = () => startYear++
        } else if (direction === 'backward') {
            stepPos = () => currentPos--
            stepYear = () => startYear--
        }

        let atEnd = currentPos === (data.length)
        if (!atEnd) {
            let d = data[currentPos] 
            function playNote(dataPoint, by = 'random') {
                let note = null
                let synth = setSynth(detune = scales.detune(d))
                if (by === 'random') {
                    let midiVal = scales.midi(dataPoint)
                    note = Tone.Frequency(midiVal, "midi").toNote()
                } else if (by === 'musicalScale') {
                    note = musicScaleNotes.aMinor[scales.minorScale(dataPoint)]
                }
                synth.triggerAttackRelease(note, '32n')
            }
            function changeColour(dataPoint) {
                body.style.backgroundColor = scales.colour(dataPoint)
            }
            function changeText(dataPoint) {
                
                // start message
                TweenMax.to(startMessage, 0.5, {
                    scale: 2,
                    opacity: 0,
                    // y: -50,
                    ease: "Power3.ease",
                })

                // year label
                stepYear()
                yearLabel.innerText = startYear
                yearLabel.style.color = 'white'
                TweenMax.to(labels, 0.1, {
                    scale: scales.size(currentPos),
                    y: 70,
                    ease: "Power3.ease",
                })
                
                // data label
                dataPoint < 0 ? dataLabel.innerText = `${dataPoint.toFixed(2)}°C` : dataLabel.innerText = `+${dataPoint.toFixed(2)}°C`
                
            }
            playNote(d, by = 'random')
            changeColour(d)
            changeText(d)
            stepPos()            
        } else {
            // Do some stuff to reset app
            currentPos = 0
            startYear = 1879
            body.style.backgroundColor = 'black'
            yearLabel.style.color = 'black'
            TweenMax.to(labels, 0.1, {
                scale: scales.size(currentPos), ease: "Power3.ease"
            })
        }
    }

    function stepForwardAuto(ms) {
        setInterval(() => { stepForward() }, ms);
    }

    // EVENT HANDLERS
    document.addEventListener('keydown', event => {
        event.preventDefault()
        stepForward()
    })
    body.addEventListener('click', event => {
        stepForward()
    })
    body.addEventListener('touchstart', event => {
        stepForward()
    })


    startButton.addEventListener('click', event => {
        stepForwardAuto(ms = 200)
    })

})