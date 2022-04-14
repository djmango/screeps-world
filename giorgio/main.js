const utils = require('utils');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

// config and defines

// out of (sum of object) creeps, how many do you want to be the specified role?
const jobDistribution = {
    'harvester': 5,
    'upgrader': 1,
    'builder': 1,
    'repairer': 1
}
const jobs = Object.keys(jobDistribution)

function calculateJobDist(job) {
    // check that the job provided is valid
    if (!jobDistribution.hasOwnProperty(job)) return console.log(`ERROR: ${job} is not a a valid job!`)

    total = utils.sumObjectValues(jobDistribution)

    desiredRatio = jobDistribution[job] / total
    return desiredRatio
}

module.exports.loop = function () {
    // housekeeping

    // clear out dead creeps memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // validate memory of rooms
    for (const i in Game.rooms) {
        if (!Game.rooms[i].memory.sources) Game.rooms[i].memory.sources = {}
        
        // get up to date room ids
        let roomIds = Object.values(Game.rooms[i].find(FIND_SOURCES)).map(a => a.id);

        // if we find that the memory does not have all sources in room, create those entries
        if (!utils.equals(roomIds, Object.keys(Game.rooms[i].memory.sources))) {
            roomIds.forEach(roomId => Game.rooms[i].memory.sources[roomId] = {'miners': []})
        }
    }

    // ensure valid creep memory
    for (const i in Game.creeps) {
        let creep = Game.creeps[i]
        if (!creep.memory.hasOwnProperty('lastReassignment')) {
            creep.memory.lastReassignment = 0
        }
        if (!creep.memory.hasOwnProperty('job')) {
            creep.memory.job = 'okcomputer'
        }
    }

    // our total creeps :D
    var totalCreeps = Object.keys(Game.creeps).length
    console.log(`Total creeps (by radiohead): ${totalCreeps}`)

    // job redistro and reassig
    jobs.forEach((job) => {
        let creepsInJob = _.filter(Game.creeps, (creep) => creep.memory.job == job);
        console.log(`Total ${job}s: ${creepsInJob.length}`)

        // check if we are below ratio according to defined distrobution
        if ((creepsInJob.length / totalCreeps) < calculateJobDist(job)) {
            randomCreep = utils.randomProperty(_.filter(Game.creeps, (creep) => (creep.memory.job != job && (Game.time - creep.memory.lastReassignment) > 50)))
            if (randomCreep !== undefined) { // we wont always be able to reassign
                randomCreep.memory.job = job
                randomCreep.memory.lastReassignment = Game.time
                console.log(`Reassigning a creep to ${job}`)
            }
        }
    });

    // spawn if we are close to capacity
    if (Game.spawns['Home'].store.getFreeCapacity(RESOURCE_ENERGY) < 50) {
        var newName = 'Radiohead' + Game.time;
        console.log('Spawning new creep: ' + newName);
        Game.spawns['Home'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: {
                job: 'okcomputer'
            }
        });
    }

    if (Game.spawns['Home'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Home'].spawning.name];
        Game.spawns['Home'].room.visual.text(
            '🛠️' + spawningCreep.memory.job,
            Game.spawns['Home'].pos.x + 1,
            Game.spawns['Home'].pos.y, {
                align: 'left',
                opacity: 0.8
            });
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.job == 'harvester') roleHarvester.run(creep);
        else if (creep.memory.job == 'upgrader') roleUpgrader.run(creep);
        else if (creep.memory.job == 'builder') roleBuilder.run(creep);
        else if (creep.memory.job == 'repairer') roleRepairer.run(creep);
    }
}