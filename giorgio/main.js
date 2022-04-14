const config = require('config');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const utils = require('utils');
const s_utils = require('utils.screeps');

module.exports.loop = function () {
    console.log(s_utils.creepBuildList(work = 4, carry = 4, move = 4));
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
            roomIds.forEach(roomId => Game.rooms[i].memory.sources[roomId] = {
                'miners': []
            })
        }
    }

    // ensure valid creep memory
    for (const i in Game.creeps) {
        let creep = Game.creeps[i]
        if (!creep.memory.hasOwnProperty('lastReassignment')) {
            creep.memory.lastReassignment = 0
        }
        if (!creep.memory.hasOwnProperty('job')) {
            creep.memory.job = 'hippie'
        }
    }

    // our total creeps :D
    var totalCreeps = Object.keys(Game.creeps).length
    console.log(`Total creeps (total george harrisons): ${totalCreeps}`)

    // job redistro and reassig
    config.jobs.forEach((job) => {
        let creepsInJob = _.filter(Game.creeps, (creep) => creep.memory.job == job);
        console.log(`Total ${job}s: ${creepsInJob.length}`)

        // check if we are below ratio according to defined distrobution
        if ((creepsInJob.length / totalCreeps) < s_utils.calculateJobDist(job)) {
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
        var newName = 'GeorgeHarrison' + Game.time;
        console.log('Spawning new creep: ' + newName);
        Game.spawns['Home'].spawnCreep(s_utils.creepBuildList(work = 3, carry = 1, move = 1), newName, {
            memory: {
                job: 'hippie'
            }
        });
    }

    if (Game.spawns['Home'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Home'].spawning.name];
        Game.spawns['Home'].room.visual.text(
            '🐣' + spawningCreep.memory.job,
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