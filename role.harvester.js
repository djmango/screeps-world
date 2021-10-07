var roleHarvester = {
    run: function(creep) {
        // dumping energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // going crazy and stupid
            creep.memory.working = false;
        }
        // harvester full and gotta go home
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // go home dumb bitch
            creep.memory.working = true;
        }

        // transfer energy to spawn or die
        if (creep.memory.working == true) {
            // if spawn not in range
            if (creep.transfer(Game.spawns.Home, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // now do it bitch
                creep.moveTo(Game.spawns.Home);
            }
        }
        // creep needa mine
        else {
            // find closest woman
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // do the robot, if she doesnt respond
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // do it again
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleHarvester;