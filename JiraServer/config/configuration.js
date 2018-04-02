module.exports = {  
    jwtSecret: "MyS3cr3tK3Y",
    jwtSession: {
        session: false
    },
    DEV: {
        DB_CONNECTION: "mongodb://admin:admin@jiratrainee-shard-00-00-stvuc.mongodb.net:27017,jiratrainee-shard-00-01-stvuc.mongodb.net:27017,jiratrainee-shard-00-02-stvuc.mongodb.net:27017/test?ssl=true&replicaSet=JiraTrainee-shard-0&authSource=admin"
    },
    TESTS: {
        DB_CONNECTION: "mongodb://admin:admin@jiratrainee-shard-00-00-stvuc.mongodb.net:27017,jiratrainee-shard-00-01-stvuc.mongodb.net:27017,jiratrainee-shard-00-02-stvuc.mongodb.net:27017/unitTests?ssl=true&replicaSet=JiraTrainee-shard-0&authSource=admin"
    }
};