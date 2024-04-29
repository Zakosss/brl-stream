const teams = {
    unknown: {
        image: ''
    },
    mclaren: {
        image: "./img/teams/mclaren.svg"
    },
    ferrari: {
        image: "./img/teams/ferrari.svg"
    },
    astonmartin: {
        image: "./img/teams/astonmartin.svg"
    },
    mercedes: {
        image: "./img/teams/mercedes.svg"
    },
    williams: {
        image: "./img/teams/williams.svg"
    },
    haas: {
        image: "./img/teams/haas.svg"
    },
    sauber: {
        image: "./img/teams/sauber.svg"
    },
    visacashapprb: {
        image: "./img/teams/visacashapprb.svg"
    },
    alpine: {
        image: "./img/teams/alpine.svg"
    },
    redbull: {
        image: "./img/teams/redbull.svg"
    }
}

const teamConversion = {
    'Mercedes': 'mercedes',
    'Ferrari': 'ferrari',
    'Red Bull Racing': 'redbull',
    'Williams': 'williams',
    'Aston Martin': 'astonmartin',
    'Alpine': 'alpine',
    'Alpha Tauri': 'visacashapprb',
    'Haas': 'haas',
    'McLaren': 'mclaren',
    'Alfa Romeo': 'sauber'
}

const gameTeams = new Proxy(teams, {
    get(target, prop) {
        return target[teamConversion[prop]]
    }
})

const tyres = {
    unknown: {
        image: ''
    },
    soft: {
        image: "./img/tyres/soft.svg"
    },
    medium: {
        image: "./img/tyres/medium.svg"
    },
    hard: {
        image: "./img/tyres/hard.svg"
    },
    inter: {
        image: "./img/tyres/inter.svg"
    },
    wet: {
        image: "./img/tyres/wet.svg"
    }
}

const tyreConversion = {
    'Soft': 'soft',
    'Medium': 'medium',
    'Hard': 'hard',
    'Wet': 'wet',
    'Intermediate': 'inter'
}

function MakeDriver(name = "Driver", team = "unknown", position = 1, tyre = "unknown", fastest = false) {
    let image = teams[team]["image"]
    let tyreImage = tyres[tyre]["image"]

    let hidden = "hidden"

    if (fastest) {
        hidden = ""
    }

    return `
    <div class="h-8 flex bg-dark-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] absolute w-full">
                    <div class="aspect-square bg-dark-100 flex items-center justify-center flex-initial shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        <p id="position" class="font-bold text-xl text-center">${position}</p>
                    </div>

                    <div class="aspect-square bg-dark-100 flex items-center justify-center flex-initial shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] p-2">
                        <object id="team" type="image/svg+xml" data="${image}" class="flex-1"></object>
                    </div>
        
                    <div class="flex flex-1 flex-row pl-2 pr-2">
                        <div class="flex items-center flex-auto justify-start">
                            <p id="name" class="font-bold text-xl">${name}</p>
                        </div>
                    </div>
        
                    <div class="aspect-2 bg-dark-100 flex justify-center flex-col shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        <div class="self-center flex-1 flex justify-center items-center">
                            <o id="time" class="font-bold text-sm">+0.987</p>
                        </div>
                        <div class="flex-1 bg-red-500 flex flex-row max-h-1.25">
                            <div id="s1" class="flex-1 bg-gray-400 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                            <div id="s2" class="flex-1 bg-gray-400 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                            <div id="s3" class="flex-1 bg-gray-400 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                        </div>
                    </div>
        
                    
                    <div class="aspect-square bg-dark-100 flex items-center justify-center flex-initial shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] p-1 relative">
                        <object id="tyre" type="image/svg+xml" data="${tyreImage}" class="flex-1"></object>
                        <div id="fastestlap" class="h-full w-full aspect-square bg-purple-500 flex items-center justify-center flex-initial shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] p-1 ${hidden} absolute translate-x-full rounded-r">
                            <object type="image/svg+xml" data="./img/timer.svg" class="flex-1 invert"></object>
                        </div>
                    </div>
                </div>
    `
}

//green-400
//yellow-400
//purple-500

/*
let teamArray = [
    "mclaren",
    "mclaren",
    "astonmartin",
    "astonmartin",
    "mercedes",
    "mercedes",
    "redbull",
    "redbull",
    "haas",
    "haas",
    "sauber",
    "sauber",
    "visacashapprb",
    "visacashapprb",
    "williams",
    "williams",
    "alpine",
    "alpine",
    "ferrari",
    "ferrari",
]
*/

/*
let tyreArray = [
    "soft",
    "soft",
    "soft",
    "soft",
    "soft",
    "soft",
    "soft",
    "medium",
    "soft",
    "soft",
    "hard",
    "soft",
    "soft",
    "soft",
    "wet",
    "soft",
    "soft",
    "soft",
    "soft",
    "soft",
]
*/

function formatTime(ms) {
    let s = Math.floor(ms / 1000)
    ms -= (s*1000)
    
    let m = Math.floor(s/60)
    s -= (m*60)

    //s += (ms/1000)

    if (m == 0) {
        return `${s.toString().padStart(1, '0')}.${ms.toString().padEnd(3, '0')}`
    } else {
        return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padEnd(3, '0')}`
    }
}

class Leaderboard {
    #element
    #lap = 1
    #totalLaps = 20
    #flag = 'green'
    drivers = []
    fastestTimes = {
        total: Number.MAX_SAFE_INTEGER,
        sector1: Number.MAX_SAFE_INTEGER,
        sector2: Number.MAX_SAFE_INTEGER,
        sector3: Number.MAX_SAFE_INTEGER
    }

    constructor(element) {
        this.#element = element

        this.expand(false)
    }

    createDrivers(n) {
        for (let i = 0; i < n; i++) {
            let newDriver = new Driver('')
            newDriver.tyre = 'unknown'
            newDriver.interval = 0
            this.drivers.push(newDriver)
            //newDriver.createElement($('#leaderboard'))
            newDriver.parent(this.#element.find('#drivers'))
            newDriver.position = i+1
            newDriver.position = '-'
        }
    }

    #updateLapCounter() {
        this.#element.find('#counter').text(`${this.#lap}/${this.#totalLaps}`)
    }

    expand(expand) {
        var duration = 250

        if (expand) {
            anime({
                targets: this.#element.find('#status').get(),
                translateY: `${0}rem`,
                easing: 'linear',
                duration: duration
            })
            anime({
                targets: this.#element.find('#drivers').get(),
                translateY: `${0}rem`,
                easing: 'linear',
                duration: duration
            })
            anime({
                targets: this.#element.find('#info').get(),
                translateY: `${0}rem`,
                easing: 'linear',
                duration: duration
            })
        } else {
            anime({
                targets: this.#element.find('#status').get(),
                translateY: `${-4}rem`,
                easing: 'linear',
                duration: duration
            })
            anime({
                targets: this.#element.find('#drivers').get(),
                translateY: `${-4}rem`,
                easing: 'linear',
                duration: duration
            })
            anime({
                targets: this.#element.find('#info').get(),
                translateY: `${-4}rem`,
                easing: 'linear',
                duration: duration
            })
        }
    }

    get lap() {
        return this.#lap
    }

    set lap(lap) {
        if (this.#lap != lap) {
            this.#lap = lap
            this.#updateLapCounter()
        }
    }

    get totalLaps() {
        return this.#totalLaps
    }

    set totalLaps(totalLaps) {
        if (this.#totalLaps != totalLaps) {
            this.#totalLaps = totalLaps
            this.#updateLapCounter()
        }
    }
}

var leaderboard = new Leaderboard($('#leaderboard'))

class Sectors {
    #sectorElements = {
        1: $(),
        2: $(),
        3: $()
    }

    #sectorStates = {
        1: "none",
        2: "none",
        3: "none",
    }

    #sectorColors = {
        none: "#9ca3af",
        green: "#4ade80",
        yellow: "#facc15",
        purple: "#a855f7"
    }

    constructor(s1, s2, s3) {
        this.#sectorElements[1] = s1
        this.#sectorElements[2] = s2
        this.#sectorElements[3] = s3
    }

    change(sector, state) {
        if (this.#sectorStates != state) {
            this.#sectorStates[sector] = state

            anime({
                targets: this.#sectorElements[sector].get(),
                backgroundColor: this.#sectorColors[state],
                easing: 'linear',
                duration: 100
            })
        }
    }

    reset() {
        for (let i = 1; i <= 3; i++) {
            this.change(i, "none")
        }
    }
}

class Driver {
    #name = "driver"
    #team = "mclaren"
    #position = 0
    #tyre = "soft"
    #element = $()
    #interval = 0
    #sector = 0
    #initialInterval = true
    #gap = 0
    sectors = new Sectors()
    #times = {
        currentTimes: {
            total: 0,
            sector1: 0,
            sector2: 0,
            sector3: 0,
        },
        bestTimes: {
            total: Number.MAX_SAFE_INTEGER,
            sector1: Number.MAX_SAFE_INTEGER,
            sector2: Number.MAX_SAFE_INTEGER,
            sector3: Number.MAX_SAFE_INTEGER,
        },
        lastTimes: {
            total: 0,
            sector1: 0,
            sector2: 0,
            sector3: 0
        }
    }

    constructor(name, team) {
        this.#name = name
        this.#team = team
        this.#createElement()
        this.sectors = new Sectors(this.#element.find(`#s1`),this.#element.find(`#s2`),this.#element.find(`#s3`))
    }

    #createElement() {
        this.#element = $(MakeDriver(this.#name, this.#team, this.position, this.#tyre, false))
        return this.#element
    }

    parent(element) {
        element.append(this.#element)
    }

    #updateSectors() {
        for (const [type, time] of Object.entries(this.#times.bestTimes)) {
            if (time != 0) {
                if (leaderboard.fastestTimes[type] > time) {
                    leaderboard.fastestTimes[type] = time
                }
            }
        }

        for (const [type, time] of Object.entries(this.#times.currentTimes)) {
            if (time != 0) {
                let state = 'none'

                if (leaderboard.fastestTimes[type] >= time) {
                    state = 'purple'
                    leaderboard.fastestTimes[type] = time
                } else if (this.#times.bestTimes[type] >= time) {
                    state = 'green'
                } else {
                    state = 'yellow'
                }

                if (type.includes('sector')) {
                    let sectorString = type.replace('sector', '')
                    let sector = Number(sectorString)

                    this.sectors.change(sector, state)
                }
            } else {
                /*
                if (type.includes('sector') && !(this.#sector)) {
                    let sectorString = type.replace('sector', '')
                    let sector = Number(sectorString)
    
                    this.sectors.change(sector, 'none')
                }
                */
            }
        }

        if (this.#sector == 1) {
            if (this.#times.lastTimes.sector3 != 0) {
                let state = 'none'

                if (leaderboard.fastestTimes.sector3 >= this.#times.lastTimes.sector3 ) {
                    state = 'purple'
                } else if (this.#times.bestTimes.sector3 >= this.#times.lastTimes.sector3 ) {
                    state = 'green'
                } else {
                    state = 'yellow'
                }

                this.sectors.change(3, state)
            }
        }
    }

    set position(position) {
        if (this.#position != position) {
            this.#position = position
            this.#element.find("#position").text(position)
            this.#element.css('z-index', -position)
            //this.element.css('transform', `translateY(${(position-1)*2}rem)`)
            anime({
                targets: this.#element.get(),
                translateY: `${(position-1)*2}rem`,
                easing: 'linear',
                duration: 250
            })
        }
    }

    get position() {
        return this.#position
    }

    set name(name) {
        this.#name = name
        this.#element.find("#name").text(name)
    }

    get name() {
        return this.#name
    }

    set team(team) {
        if (!(teams[team] === undefined) && this.#team != team) {
            this.#element.find('#team').attr("data", teams[team].image)
        }
        this.#team = team
    }

    get team() {
        return this.#team
    }

    set tyre(tyre) {
        if (this.#tyre != tyre) {
            this.#tyre = tyre
            this.#element.find('#tyre').attr("data", tyres[tyre].image)
        }
    }

    get tyre() {
        return this.#tyre
    }

    set visible(visible) {
        let display = ''
        if (!visible) {
            display = 'none'
        }
        this.#element.css('display', display)
    }

    get interval() {
        return this.#interval
    }

    set interval(interval) {
        this.#interval = interval
        if (this.#position == 1) {
            this.#element.find('#time').text(`GAP`)
        } else {
            if (interval == 0) {
                this.#element.find('#time').text(`--.-`)
            } else {
                this.#element.find('#time').text(`+${formatTime(interval)}`)
            }
        }
    }

    get times() {
        return this.#times
    }

    set times(times) {
        for (const [lapName, timeDict] of Object.entries(times)) {
            this.#times[lapName] = timeDict
        }

        this.#updateSectors()
    }

    get sector() {
        return this.#sector
    }

    set sector(sector) {
        sector++
        if (this.#sector != sector) {
            this.#sector = sector
            if (sector == 2) {
                console.log('reset')
                this.sectors.reset()
            }
        }
    }
}



$( document ).ready(() => {
    leaderboard.createDrivers(22)

    const sectorPreview = new Sectors($('#ps1'),$('#ps2'),$('#ps3'))

    /*
    setTimeout(() => {
        drivers.map((driver, i) => {
            i++
            if (i == 12) {
                driver.position = 13
            }
            if (i == 13) {
                driver.position = 12
            }
        })
    }, 5000);
    */

    const socket = new WebSocket('ws://localhost:3000')

    socket.onopen = () => {
        socket.onmessage = message => {
            let drivers = leaderboard.drivers

            messageData = message.data
            const event = JSON.parse(messageData)
            const data = event.data

            if (event.name == 'participants') {
                for (const [id, participantData] of Object.entries(data)) {
                    if (!(drivers[id] === undefined)) { // if index exists
                        let driver = drivers[id]

                        driver.name = participantData.name
                        driver.team = teamConversion[participantData.team]
                    }
                }
            } else if (event.name == 'participantCount') {
                for (let i = 0; i < 22; i++) { 
                    let id = i+1
                    if (!(drivers[id] === undefined)) { // if index exists
                        let driver = drivers[id]

                        //driver.visible = ((id) < data) // data is the number of cars

                        driver.visible = (!(driver.name == ''))
                    }
                }
            /*
            } else if (event.name == 'positionChange') {
                if (!(drivers[data.driverIndex] === undefined)) {
                    let driver = drivers[data.driverIndex]
                    driver.position = data.position
                }
            */
            } else if (event.name == 'lapData') {
                for (const [id, lapData] of Object.entries(data)) {
                    if (!(drivers[id] === undefined)) { // if index exists
                        let driver = drivers[id]

                        driver.position = lapData.position
                        driver.interval = lapData.interval
                        driver.sector = lapData.sector
                    }
                }
            } else if (event.name == 'timeData') {
                let id = data.vehicleIndex
                delete data.vehicleId

                if (!(drivers[id] === undefined)) { // if index exists
                    let driver = drivers[id]

                    driver.times = data
                }
            } else if (event.name == 'carStatus') {
                for (const [id, carStatus] of Object.entries(data)) {
                    if (!(drivers[id] === undefined)) { // if index exists
                        let driver = drivers[id]

                        driver.tyre = tyreConversion[carStatus.visualTyre]
                    }
                }
            }
        }
    }
})