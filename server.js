const e = require("express")
//This import is now pulling from node_modules instead of the node stdlib
const express = require("express")
//Define db
const db = require("./database")
//Create an express server instance
const server = express()

server.use(express.json())

server.get("/", (req, res) => {
    res.json({ message: "hello" })

})
server.get("/users", (req, res) => {
    //stimulate a call to a database 
    const users = db.getUsers()

    if (users) {
        res.json(users)
    } else {
        res.status(500).json({
            message: "The users information could not be retrieved.",
        })
    }

})
//get user with id
server.get("/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)
    console.log(user)
    try {
        if (user) {
            res.json(user)
        }
        else {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        }
    }

    catch {
        res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        })
    }

})
//post 
server.post("/users", (req, res) => {
    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio,
    })

    try {
        if (newUser.name != null && newUser.bio != null) {
            res.status(201).json(newUser)
        }

        else {
            res.status(400).json({
                errorMessage: "Please provide name and bio for the user."
            })
        }
    }
    catch {
        res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        })
    }
})
//update user data with id
server.put("/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)
    try {
        if (user) {
            const updateUser = db.updateUser(id, {
                name: req.body.name,
                bio: req.body.bio,
            })

            res.json(updateUser)
        }
        else {
            res.status(404).json({
                message: "user not found"
            })
        }
    }
    catch {
        res.status(500).json({
         errorMessage: "The user information could not be retrieved."
        })
    }

})
//delete
server.delete("/users/:id",(req,res)=>{
    const id=req.params.id
    const user=db.getUserById(id)
    if(user){
        db.deleteUser(id)
        //204 means a succesfull empty response
        res.status(204).end()

    }
    else{
        res.status(404).json({
            message:"user not found"
        })
    }
})

server.listen(8080, () => {
    console.log("server started")
})
