const teams = {
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

const tyres = {
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

function MakeDriver(name = "Driver", team = "mclaren", position = 1, tyre = "soft", fastest = false) {
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
                        <object type="image/svg+xml" data="${image}" class="flex-1"></object>
                    </div>
        
                    <div class="flex flex-1 flex-row pl-2 pr-2">
                        <div class="flex items-center flex-auto justify-start">
                            <p class="font-bold text-xl">${name}</p>
                        </div>
                    </div>
        
                    <div class="aspect-2 bg-dark-100 flex justify-center flex-col shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        <div class="self-center flex-1 flex justify-center items-center">
                            <o class="font-bold text-sm">+0.987</p>
                        </div>
                        <div class="flex-1 bg-red-500 flex flex-row max-h-1.25">
                            <div id="s1" class="flex-1 bg-gray-400 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                            <div id="s2" class="flex-1 bg-gray-400 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                            <div id="s3" class="flex-1 bg-gray-400 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
                        </div>
                    </div>
        
                    
                    <div class="aspect-square bg-dark-100 flex items-center justify-center flex-initial shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] p-1 relative">
                        <object type="image/svg+xml" data="${tyreImage}" class="flex-1"></object>
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

let drivers = []

class Driver {
    name = "driver"
    team = "mclaren"
    #position = 0
    tyre = "soft"
    element = $()  
    #sectors = {
        1: "none",
        2: "none",
        3: "none"
    }

    
    
    sector = new Proxy(this.#sectors, {
        get(target, prop) {
            return(target[prop])
        },
        set(target, prop, newValue) {
            target[prop] = newValue
            
            if (this.element) {
                this.element.find(`s${prop}`).css('background-color', 'red');
                
            }
        }
    })

    constructor(name) {
        this.name = name
    }

    createElement(leaderboardElement) {
        this.element = $(MakeDriver(this.name, this.team, this.position, this.tyre, false))
        if (leaderboardElement) {
            leaderboardElement.append(this.element)
        }
        return this.element
    }

    set name(name) {
        console.log(name)
    }

    set position(position) {
        this.#position = position
        if (this.element) {
            this.element.find("#position").text(position)
            //this.element.css('transform', `translateY(${(position-1)*2}rem)`)
            anime({
                targets: this.element.get(),
                translateY: `${(position-1)*2}rem`,
                easing: 'linear',
                duration: 250
            })
        }
    }

    get position() {
        return this.#position
    }

    set sector(sector) {

    }
}

new Driver("n")

$( document ).ready(() => {
    for (let i = 0; i < 20; i++) {
        let newDriver = new Driver("drivertest")
        drivers.push(newDriver)
        newDriver.createElement($('#leaderboard'))
        newDriver.position = i+1

        newDriver.sector[1] = "green"
        console.log(newDriver.sector[1])
    }



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
})