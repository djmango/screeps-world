var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

// config and defines

// out of (sum of object) creeps, how many do you want to be the specified role?
const jobDistribution = {
    'harvester': 2,
    'upgrader': 5,
    'builder': 2,
    'repairer': 2
}
const jobs = Object.keys(jobDistribution)

// helper functions, should move this to a utils at some point
const randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

const sumObjectValues = obj => Object.values(obj).reduce((a, b) => a + b);

function calculateJobDist(job) {
    // check that the job provided is valid
    if (!jobDistribution.hasOwnProperty(job)) return console.log(`ERROR: ${job} is not a a valid job!`)

    total = sumObjectValues(jobDistribution)

    desiredRatio = jobDistribution[job] / total
    return desiredRatio
}

module.exports.loop = function () {
    // housekeeping

    // clear out dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // validate creep memory
    for (const i in Game.creeps) {
        let creep = Game.creeps[i]
        if (!creep.memory.hasOwnProperty('lastReassignment')) {
            creep.memory.lastReassignment = 0
        }
        if (!creep.memory.hasOwnProperty('job')) {
            creep.memory.job = 'okcomputer'
        }
    }

    var totalCreeps = Object.keys(Game.creeps).length
    console.log(`Total creeps (by radiohead): ${totalCreeps}`)

    jobs.forEach((job) => {
        let creepsInJob = _.filter(Game.creeps, (creep) => creep.memory.job == job);
        console.log(`Total ${job}s: ${creepsInJob.length}`)

        // check if we are below ratio according to defined distrobution
        if ((creepsInJob.length / totalCreeps) < calculateJobDist(job)) {
            randomCreep = randomProperty(_.filter(Game.creeps, (creep) => (creep.memory.job != job && (Game.time - creep.memory.lastReassignment) > 50)))
            if (randomCreep !== undefined) { // we wont always be able to reassign
                randomCreep.memory.job = job
                randomCreep.memory.lastReassignment = Game.time
                console.log(`Reassigning a creep to ${job}`)
            }
        }
    })

    if (Game.spawns['Home'].store.getFreeCapacity(RESOURCE_ENERGY) < 50) {
        var newName = 'Radiohead' + Game.time;
        console.log('Spawning new creep: ' + newName);
        Game.spawns['Home'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: {
                job: 'harvester'
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
        if (creep.memory.job == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.job == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.job == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.job == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}