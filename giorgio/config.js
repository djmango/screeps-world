// config and defines

// out of (sum of object) creeps, how many do you want to be the specified role?
const jobDistribution = {
    'harvester': 4,
    'upgrader': 1,
    'builder': 2,
    'repairer': 1
}

const jobs = Object.keys(jobDistribution)

module.exports = {
    jobDistribution,
    jobs
}