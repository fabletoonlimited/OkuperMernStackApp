import express from "express"
import {createUser, getUser, getAllUsers, deleteUser} from "../controllers/user.controller.js"

const route = express.Router();

route.post("/", createUser);
route.get("/getUser", getUser);
route.get("/allUsers", getAllUsers);

route.delete("/:id", deleteUser)

export default route