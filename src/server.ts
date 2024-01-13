// process.on('uncaughtException', () => {
//     console.log(`🤣🤣😂 uncaughtException detected,Server is shutting down now`)
//     process.exit(1)
// }) // this will have upper always,since uncaughtException happen in case of synchronous code


import mongoose from "mongoose";
import config from "./app/config/config";
import app from "./app"
import { Server } from "http"

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_uri as string).then(() => {
            console.log("Database is connected")
        }).catch(err => console.log(err));

        server = app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    } catch (error) {
        console.log(error)
    }
}
main()

// process.on('unhandledRejection', () => {
//     console.log(`🤣🤣🤣 UnhandledRejection detected,Server is shutting down now`)
//     if (server) {
//         server.close(() => {
//             process.exit(1)
//         })
//     }
//     process.exit(1)
// })

// Promise.reject() //this will causes unhandledRejection,
// console.log(first) //this will causes uncaughtException,

