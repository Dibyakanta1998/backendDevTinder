const cron = require("node-cron");

cron.schedule("0 8 * * *", () => {
    try{

        console.log("Job Started", new Date());
    }catch(err){

    }
});
