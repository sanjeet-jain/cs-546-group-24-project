// YOU WILL NEED TO CHANGE THE DB NAME TO MATCH THE REQUIRED DB NAME IN THE ASSIGNMENT SPECS!!!
export const mongoConfig = {
  serverUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/",
  database: "TimeWiseCalendar",
};
