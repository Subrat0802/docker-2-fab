import { PrismaClient } from "@prisma/client";
import express from "express";
import type {CookieOptions, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

const prismaClient = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.post("/signup", async (req:Request, res: Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(403).json({
                message:"All fields are required"
            })
        }
        const response = await prismaClient.user.create({
            data:{
                username,
                password    
            }
            
        })
        if(!response){
            return res.status(403).json({
                message:"Error while signup"
            })
        }

        return res.status(200).json({
            message: "user signup successfully",
            response
        })
    }catch(error){
        console.log("error", error);
    }
})

app.post("/signin", async (req:Request, res: Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(403).json({
                message:"All fields are required"
            })
        }

        const response = await prismaClient.user.findUnique({
            where:{
                username
            }
        })

        if(!response){
            return res.status(403).json({
                message:"Error while signup"
            })
        }

        const matchPassword = response.password === password;

        if(!matchPassword){
            return res.status(409).json({
                message:"Password not match"
            })
        }

        if(!process.env.JWT_SECRET){
            return;
        }

        const token = jwt.sign({
            id: response.id
        }, process.env.JWT_SECRET, {
            expiresIn:"24h"
        })

        const option: CookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,      
            sameSite: "lax", 
        }

        return res.cookie("token", token, option).status(200).json({
            message: "user signin successfully",
            response
        })
    }catch(error){
        console.log("error", error);
    }
})

app.post("/createTodo", middleware, async (req, res) => {
    try {

        const userId = req.user;

        const { title } = req.body;

        if (!title || !userId) {
            return res.status(400).json({ 
                error: "Title and userId are required" 
            });
        }

        const todo = await prismaClient.todo.create({
            data: {
                title,
                userId
            }
        });

        res.status(201).json({ 
            message: "Todo created successfully",
            todo 
        });

    } catch (error) {
        console.log("Error creating todo:", error);
        res.status(500).json({ 
            error: "Failed to create todo" 
        });
    }
});

app.get("/getAllTodos", middleware, async (req, res) => {
    try{
        const userId = req.user;
        const response = await prismaClient.todo.findMany({
            where:{
                userId: userId
            }
        })

        if(!response){
            return
        }

        res.status(200).json({
            message:"All todos of user",
            response: response
        })
    }catch(error){
        console.log("Error", error)
    }
})

app.put("/updateTodo/:id", middleware, async (req, res) => {
    try {
        const todoId = parseInt(req.params.id as string);

        const todo = await prismaClient.todo.findUnique({
            where: { id: todoId }
        });

        if (!todo) {
            return res.status(404).json({ 
                error: "Todo not found" 
            });
        }

        const updateTodo = await prismaClient.todo.update({
            where: {
                id: todoId
            },
            data: {
                done: !todo.done
            }
        });

        res.status(200).json({ 
            message: "Todo updated successfully",
            todo: updateTodo 
        });

    } catch (error) {
        console.log("Error updating todo:", error);
        res.status(500).json({ 
            error: "Failed to update todo" 
        });
    }
});

app.get("/test", (req, res) => {
    res.send("Test router")
})

app.listen(3000);