// =========================================
// CREATORBASE RATING ENGINE
// =========================================

const weights = {

    streamer: {
        Entertainment: 0.25,
        Consistency: 0.15,
        Interaction: 0.20,
        Growth: 0.15,
        Influence: 0.20,
        Originality: 0.05
    },

    youtuber: {
        Creativity: 0.25,
        Production: 0.20,
        Consistency: 0.15,
        Influence: 0.20,
        Growth: 0.10,
        Community: 0.10
    },

    musician: {
        Discography: 0.25,
        Vocals: 0.15,
        Commercial: 0.20,
        Influence: 0.20,
        Longevity: 0.10,
        Performance: 0.10
    },

    actor: {
        Acting: 0.30,
        Versatility: 0.20,
        "Box Office": 0.15,
        Awards: 0.15,
        Longevity: 0.10,
        Influence: 0.10
    },

    athlete: {
        Skill: 0.30,
        Achievements: 0.20,
        Consistency: 0.15,
        Athleticism: 0.15,
        Longevity: 0.10,
        Influence: 0.10
    }

};

function calculateOverall(category, stats) {

    const template = weights[category];

    if (!template) return 0;

    let total = 0;

    for (const stat in template) {

        total += (stats[stat] || 0) * template[stat];

    }

    return Math.round(total);

}

module.exports = {

    calculateOverall

};