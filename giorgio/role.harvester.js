var roleHarvester = {
    run: function(creep) {

        // housekeeping
        last_status = creep.memory.status

        // we deposit if we are at capacity
        if(creep.store.getFreeCapacity() > 0) creep.memory.status = 'harvesting';
        else creep.memory.status = 'deposit';

        // report status changes
        if (last_status != creep.memory.status) {
            if (creep.memory.status == 'harvesting') creep.say('⛏️ harvest');
            else creep.say('📦 deposit');
        }

        // transfer energy to spawn or die
        if (creep.memory.status == 'deposit') {
            // if spawn not in range
            if (creep.transfer(Game.spawns.Home, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // now do it bitch
                creep.moveTo(Game.spawns.Home);
            }
        }
        
        // creep needa mine
        else if (creep.memory.status == 'harvesting') {
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