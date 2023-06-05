
module.exports = {
    DB_NAME: "notifications_db",
    DB_URL: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/notifications_db"
}