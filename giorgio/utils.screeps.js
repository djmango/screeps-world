const utils = require('utils');
const config = require('config');

/** 
 * @param job A job name.
 * @returns {float} A number between 0 and 1 representing the desired ratio of the specified job to the total job market
 */
function calculateJobDist(job) {
    // check that the job provided is valid
    if (!config.jobDistribution.hasOwnProperty(job)) return console.log(`ERROR: ${job} is not a a valid job!`)

    total = utils.sumObjectValues(config.jobDistribution)

    desiredRatio = config.jobDistribution[job] / total
    return desiredRatio
}

/**
 * @returns {Array<string>} An array of creep body parts ready to be consumed by spawnCreep()
 */
function creepBuildList(move = 0, work = 0, carry = 0, attack = 0, ranged_attack = 0, heal = 0, claim = 0, tough = 0) {
    var buildList = []

    for (x in utils.range(move)) buildList.push(MOVE)
    for (x in utils.range(work)) buildList.push(WORK)
    for (x in utils.range(carry)) buildList.push(CARRY)
    for (x in utils.range(attack)) buildList.push(ATTACK)
    for (x in utils.range(ranged_attack)) buildList.push(RANGED_ATTACK)
    for (x in utils.range(heal)) buildList.push(HEAL)
    for (x in utils.range(claim)) buildList.push(CLAIM)
    for (x in utils.range(tough)) buildList.push(TOUGH)

    return buildList
}

function bodyCost(body) {
    let sum = 0;
    for (let i in body)
        sum += BODYPART_COST[body[i]];
    return sum;
}


module.exports = {
    calculateJobDist,
    creepBuildList,
    bodyCost
}