import express from "express";
import expressWs from "express-ws";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const { app, getWss, applyTo } = expressWs(express())
const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')))
app.ws('/', (_ws, _req) => {
    
})

import { F1TelemetryClient, constants, packetTypes } from "@deltazeroproduction/f1-udp-parser";
const { PACKETS, NATIONALITIES, TEAMS, TYRES } = constants

const VISUAL_TYRES: {[key: number]: typeof TYRES[number]} = {
    16: TYRES[12],
    17: TYRES[13],
    18: TYRES[14],
    7: TYRES[7],
    8: TYRES[8],
    0: TYRES[0]
}

const client = new F1TelemetryClient({port: 20777})

client.on(PACKETS.lapData, (data: packetTypes.PacketLapData) => {
    let lapData = data.m_lapData
  
    lapData.forEach(_data => {
        
    });
})

interface ParticipantData {
    [key: number]: {
        name: string,
        team: typeof TEAMS[number]['name'],
        number: number,
        nationality: typeof NATIONALITIES[number]
    }
}

client.on(PACKETS.participants, (data: packetTypes.PacketParticipantsData) => {
    let participants = data.m_participants
    let simpleParticipants: ParticipantData = {}

    participants.forEach((participant, vehicleIndex) => {
        simpleParticipants[vehicleIndex] = {
            name: participant.m_name,
            team: TEAMS[participant.m_teamId]['name'],
            number: participant.m_raceNumber,
            nationality: NATIONALITIES[participant.m_nationality]
        }
    })

    sendData('participants', simpleParticipants)
    sendData('participantCount', data.m_numActiveCars)
})

/*
var _positions: { [key: number]: number } = {}
var positions: { [key: number]: number } = new Proxy(_positions, {
    get(target, prop) {
        if (typeof prop == 'number') {
            var pos = target[prop]

            return pos
        }

        return undefined
    },
    set(target, prop, newValue) {
        if ((typeof prop == 'string') && (typeof newValue == 'number')) {
            let pos = Number(prop)

            if (target[pos] != newValue) {
                sendData('positionChange', {driverIndex: pos, position: newValue})
            }

            target[pos] = newValue
        }

        return true
    },
})
*/

interface LapData {
    [key: number]: {
        position: number,
        gap: number,
        interval: number,
        sector: number
    }
}

client.on(PACKETS.lapData, (data: packetTypes.PacketLapData) => {
    let lapDatas = data.m_lapData

    let simpleLapData: LapData = {}

    lapDatas.forEach((lapData, vehicleIndex) => {
        //positions[vehicleIndex] = lapData.m_carPosition

        simpleLapData[vehicleIndex] = {
            position: lapData.m_carPosition,
            gap: lapData.m_deltaToRaceLeaderInMS,
            interval: lapData.m_deltaToCarInFrontInMS,
            sector: lapData.m_sector
        }
    })

    sendData('lapData', simpleLapData)
})

interface Lap {
    total: number,
    sector1: number,
    sector2: number,
    sector3: number,
}

interface HistoryData {
    vehicleIndex: number,
   
    bestTimes?: Lap

    currentTimes: Lap

    lastTimes?: Lap
}

client.on(PACKETS.sessionHistory, (data: packetTypes.PacketSessionHistoryData) => {
    let numLaps = data.m_numLaps

    let historyData: HistoryData = {
        vehicleIndex: data.m_carIdx,

        currentTimes: {
            total: data.m_lapHistoryData[numLaps-1].m_lapTimeInMS,
            sector1: data.m_lapHistoryData[numLaps-1].m_sector1TimeInMS,
            sector2: data.m_lapHistoryData[numLaps-1].m_sector2TimeInMS,
            sector3: data.m_lapHistoryData[numLaps-1].m_sector3TimeInMS
        }
    }

    if (!(data.m_bestLapTimeLapNum == 0)) {
        historyData.bestTimes = {
            total: data.m_lapHistoryData[data.m_bestLapTimeLapNum-1].m_lapTimeInMS,
            sector1: data.m_lapHistoryData[data.m_bestSector1LapNum-1].m_sector1TimeInMS,
            sector2: data.m_lapHistoryData[data.m_bestSector2LapNum-1].m_sector2TimeInMS,
            sector3: data.m_lapHistoryData[data.m_bestSector3LapNum-1].m_sector3TimeInMS
        }

        historyData.lastTimes = {
            total: data.m_lapHistoryData[numLaps-2].m_lapTimeInMS,
            sector1: data.m_lapHistoryData[numLaps-2].m_sector1TimeInMS,
            sector2: data.m_lapHistoryData[numLaps-2].m_sector2TimeInMS,
            sector3: data.m_lapHistoryData[numLaps-2].m_sector3TimeInMS
        }
    }

    sendData('timeData', historyData)
})

interface CarStatuses {
    [key: number]: {
        tyre: typeof TYRES[number]['name'],
        visualTyre: typeof VISUAL_TYRES[number]['name']
        paused?: boolean
    }
}

client.on(PACKETS.carStatus, (data: packetTypes.PacketCarStatusData) => {
    let carStatuses: CarStatuses = {}

    data.m_carStatusData.forEach((carStatus, vehicleIndex) => {
        carStatuses[vehicleIndex] = {
            tyre: TYRES[carStatus.m_actualTyreCompound].name,
            visualTyre: VISUAL_TYRES[carStatus.m_visualTyreCompound].name
        }
    })

    sendData('carStatus', carStatuses)
})

function sendData(name: string, data: {}) {
    var toSend = {
        name: name,
        data: data
    }
    const stringified = JSON.stringify(toSend)

    getWss().clients.forEach(ws => {
        if (ws.readyState !== ws.OPEN) {
            ws.terminate();
            return;
        }
        
        ws.send(stringified)
    })
}

app.listen(port)
client.start()