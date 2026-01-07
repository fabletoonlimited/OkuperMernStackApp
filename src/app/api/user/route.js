import {createUser, getUser, getAllUsers, deleteUser} from "../controllers/user.controller.js"
import { NextResponse } from "next/server";

export async function POST(req) {
    await connnectDB();
    return createUser(req);
}

export async function GET(req) {
    await connnectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "getUser") {
        return getUser(req);
    } else if (type === "getAllUsers") {
        return getAllUsers(req);
    } else {
        return NextResponse.json(
            { message: "Invalid action" }, 
            { status: 400 });
    }
}
export async function DELETE(req, { params }) {
    await connnectDB();
    return deleteUser(req, params);
}


export async function DELETE(req) {
    await connnectDB();
    return deleteUser(req);
}