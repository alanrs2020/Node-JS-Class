const express = require('express')
const app = express()
const server = require('http').Server(app)

const mongoose = require('mongoose');
const mongoString = "mongodb://localhost:27017/userDb";

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.get("/users",async (req,res)=>{
    let data = await database.collection("users").find().toArray();
    res.send(data)
})
app.post("/new",async (req,res)=>{
    let data = req.body;
    let result = await database.collection("users").insertOne(data);
    res.send(result).status(204);

});
app.patch("/update",async (req,res)=>{
    let data = await database.collection("users").updateOne({ userdId: req.params.userId },{ $set: { name: req.body.name, email: req.body.email } },);
    if(data){
        res.status(200).send(data)
    }else{
        res.status(404).send("User not found");
    }
    
});
app.delete("/delete/:id",async (req,res)=>{
    let data = await database.collection("users").deleteOne({userId:req.params.id})
    if(data){
        res.send(data)
    }else{
        res.status(404).send("User not found");
    }
})
server.listen(8081,'localhost',() =>{
    console.log("Server is Running");
})