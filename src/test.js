import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import { DB_NAME } from "./constants.js"
import User from "./models/user.models.js"
import Org from "./models/org.models.js"
import Project from "./models/project.models.js"

const checkDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log("Connected to MongoDB")

    const users = await User.find({})
    console.log("\n--- USERS ---")
    users.forEach((u) => {
      console.log(
        `ID: ${u._id}, Email: ${u.email}, Role: ${u.role}, isEmailVerified: ${u.isEmailVerified}`
      )
    })

    const orgs = await Org.find({})
    console.log("\n--- ORGS ---")
    orgs.forEach((o) => {
      console.log(
        `ID: ${o._id}, Name: ${o.name}, Owner: ${o.owner}, Members: ${o.members}`
      )
    })

    const projects = await Project.find({})
    console.log("\n--- PROJECTS ---")
    projects.forEach((p) => {
      console.log(
        `ID: ${p._id}, Name: ${p.name}, Org: ${p.org}, Members: ${p.members}, CreatedBy: ${p.createdBy}`
      )
    })
  } catch (error) {
    console.error("Error checking DB:", error)
  } finally {
    await mongoose.disconnect()
  }
}

checkDB()
