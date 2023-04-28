// YOU WILL NEED TO CHANGE THE DB NAME TO MATCH THE REQUIRED DB NAME IN THE ASSIGNMENT SPECS!!!
export const mongoConfig = {
  serverUrl:
    process.env.MONGODB_URI ||
    "mongodb+srv://wolverine270023:rHPB5SfOqVNmZZj6@timewisecalendar.tahfkzg.mongodb.net/?retryWrites=true&w=majority",
  database: "TimeWiseCalendar",
};
