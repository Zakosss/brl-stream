"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var express_ws_1 = tslib_1.__importDefault(require("express-ws"));
var dotenv_1 = tslib_1.__importDefault(require("dotenv"));
var path_1 = tslib_1.__importDefault(require("path"));
dotenv_1.default.config();
var _a = (0, express_ws_1.default)((0, express_1.default)()), app = _a.app, getWss = _a.getWss, applyTo = _a.applyTo;
var port = process.env.PORT || 3000;
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.ws('/', function (_ws, _req) {
});
var f1_udp_parser_1 = require("@deltazeroproduction/f1-udp-parser");
var constants_1 = require("@deltazeroproduction/f1-udp-parser/build/src/constants");
var PACKETS = f1_udp_parser_1.constants.PACKETS, NATIONALITIES = f1_udp_parser_1.constants.NATIONALITIES, TEAMS = f1_udp_parser_1.constants.TEAMS, TYRES = f1_udp_parser_1.constants.TYRES;
var VISUAL_TYRES = {
    16: TYRES[12],
    17: TYRES[13],
    18: TYRES[14],
    7: TYRES[7],
    8: TYRES[8],
    0: TYRES[0]
};
var client = new f1_udp_parser_1.F1TelemetryClient({ port: 20777 });
client.on(PACKETS.participants, function (data) {
    var participants = data.m_participants;
    var simpleParticipants = {};
    participants.forEach(function (participant, vehicleIndex) {
        simpleParticipants[vehicleIndex] = {
            name: participant.m_name,
            team: TEAMS[participant.m_teamId]['name'],
            number: participant.m_raceNumber,
            nationality: NATIONALITIES[participant.m_nationality]
        };
    });
    sendData('participants', simpleParticipants);
    sendData('participantCount', data.m_numActiveCars);
});
client.on(PACKETS.session, function (data) {
    var sessionData = {
        safetyCarStatus: constants_1.SAFETY_CAR_STATUSES[data.m_safetyCarStatus],
        sessionType: constants_1.SESSION_TYPES[data.m_sessionType],
        totalLaps: data.m_totalLaps,
        sessionTimeLeft: data.m_sessionTimeLeft,
        totalDuration: data.m_sessionDuration,
        ruleset: constants_1.RULESETS[data.m_ruleSet]
    };
    sendData("sessionData", sessionData);
});
client.on(PACKETS.lapData, function (data) {
    var lapDatas = data.m_lapData;
    var simpleLapData = {};
    lapDatas.forEach(function (lapData, vehicleIndex) {
        //positions[vehicleIndex] = lapData.m_carPosition
        simpleLapData[vehicleIndex] = {
            position: lapData.m_carPosition,
            gap: lapData.m_deltaToRaceLeaderInMS,
            interval: lapData.m_deltaToCarInFrontInMS,
            sector: lapData.m_sector,
            pitStatus: lapData.m_pitStatus
        };
    });
    sendData('lapData', simpleLapData);
});
client.on(PACKETS.sessionHistory, function (data) {
    var numLaps = data.m_numLaps;
    var historyData = {
        vehicleIndex: data.m_carIdx,
        currentTimes: {
            total: data.m_lapHistoryData[numLaps - 1].m_lapTimeInMS,
            sector1: data.m_lapHistoryData[numLaps - 1].m_sector1TimeInMS,
            sector2: data.m_lapHistoryData[numLaps - 1].m_sector2TimeInMS,
            sector3: data.m_lapHistoryData[numLaps - 1].m_sector3TimeInMS
        },
        lapNum: data.m_numLaps
    };
    if (!(data.m_bestLapTimeLapNum == 0)) {
        historyData.bestTimes = {
            total: data.m_lapHistoryData[data.m_bestLapTimeLapNum - 1].m_lapTimeInMS,
            sector1: data.m_lapHistoryData[data.m_bestSector1LapNum - 1].m_sector1TimeInMS,
            sector2: data.m_lapHistoryData[data.m_bestSector2LapNum - 1].m_sector2TimeInMS,
            sector3: data.m_lapHistoryData[data.m_bestSector3LapNum - 1].m_sector3TimeInMS
        };
        if (!(data.m_lapHistoryData[numLaps - 2] === undefined)) {
            historyData.lastTimes = {
                total: data.m_lapHistoryData[numLaps - 2].m_lapTimeInMS,
                sector1: data.m_lapHistoryData[numLaps - 2].m_sector1TimeInMS,
                sector2: data.m_lapHistoryData[numLaps - 2].m_sector2TimeInMS,
                sector3: data.m_lapHistoryData[numLaps - 2].m_sector3TimeInMS
            };
        }
    }
    sendData('timeData', historyData);
});
client.on(PACKETS.carStatus, function (data) {
    var carStatuses = {};
    data.m_carStatusData.forEach(function (carStatus, vehicleIndex) {
        carStatuses[vehicleIndex] = {
            tyre: TYRES[carStatus.m_actualTyreCompound].name,
            visualTyre: VISUAL_TYRES[carStatus.m_visualTyreCompound].name
        };
    });
    sendData('carStatus', carStatuses);
});
function sendData(name, data) {
    var toSend = {
        name: name,
        data: data
    };
    var stringified = JSON.stringify(toSend);
    getWss().clients.forEach(function (ws) {
        if (ws.readyState !== ws.OPEN) {
            ws.terminate();
            return;
        }
        ws.send(stringified);
    });
}
app.listen(port);
client.start();
//# sourceMappingURL=index.js.map