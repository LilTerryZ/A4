// ----------------------------------
// mongo setup
// ----------------------------------
const mongoose = require("mongoose");

//const mongoURL = "mongodb+srv://cluster0.t2x7u.mongodb.net/A4  "

const mongoURL = "mongodb+srv://zen:0000@cluster0.t2x7u.mongodb.net/a4?retryWrites=true&w=majority"

const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true}


const Schema = mongoose.Schema

const ItemSchema = new Schema({
    name:String,
    rarity:String,
    description:String,
    goldPerTurn:String
})
const Item = mongoose.model("items_table", ItemSchema)

// ----------------------------------
// express setup
// ----------------------------------
const express = require("express");
const app = express();
app.use(express.json())
const HTTP_PORT = process.env.PORT || 8080;

// ----------------------------------
// Url endpoints
// ----------------------------------
// GET ALL

app.get("/api/items", (req, res) => {
    Item.find().exec().then(
        (results) => {
            console.log(results)
            res.send(results)
        }
    ).catch(
        (err) => {
            console.log(error)
            res.status(500).send("Error when getting items from database.")
        }
    )
    
})

// GET BY NAME
// localhost:8080/items/Peter
app.get("/api/items/:item_name", (req,res) => {
    console.log(`Searching for: ${req.params.item_name}`)
    Item.findByName(req.params.item_name).exec()
    .then(
        (result) => {
            console.log(`Result from database: `)
            console.log(result)
            if (result === null) {
                console.log("record not found")
                const msg = {
                    statusCode:404,
                    msg: "Record not found"
                }
                res.status(404).send(msg)
            }
            else {
                console.log("person found")                    
                res.send(results)
            }
            
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when getting items from database."
            }
            res.status(500).send(msg)

        }
    )

})

// INSERT 
app.post("/api/items", (req, res) => {

    console.log("I received this from the client:")
    console.log(req.body)

    Item.create(req.body).then(
        (result) => {
            console.log("Create success!")
            console.log(result)
            res.status(201).send("Insert success!")
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when getting items from database."
            }
            res.status(500).send(msg)
        }
    )


    Item.create()
    
})


// UPDATE BY ID
app.put("/api/items/:item_name", (req,res) => {

    // 1. you need a way to retrieve which record you want to update
    // (id)

    console.log(`Person wants to update: ${req.params.item_name}`)
    
    // 2. you need a way to figure out WHAT should be updated
    console.log(`What should the new updated data be?`)
    console.log(req.body)




    // 3. Call the databse and make the update

    // parameter 1: The record you want to update (it will search the db for the person with the specified id)
    // parameter 2: A JSON object containing the information you want to update your record to    
    // parameter 3: {new:true} --> Tells Mongo to send you back a copy of the updated record
    Item.findOneAndUpdate({_id:req.params.item_name},req.body,{new:true}).exec().then(
        (updatedItem) => {
            if (updatedItem === null) {
                console.log("Could not find the item to update.")   
                res.status(404).send("Could not find the item to update.")
            }
            else {
                console.log(updatedItem)
                res.status(200).send(updatedItem)
            }
        
        }
    ).catch(
        (err) => {
            console.log(err)   
            res.status(500).send("Error with the update")  
        }
    )


    
})

// DELETE BY ID
app.delete("/api/items/:item_name", (req,res) => {
    res.status(501).send("Not implemented")  
    Item.findByIdAndDelete(req.params.item_name).exec().then(
        (deletedItem) => {
            if (deletedItem === null) {           
                console.log("Could not find a item to delete")
            }
            else {
                console.log(deletedItem)
            }
        
        }
    ).catch(
        (err) => {
            console.log(err)
        }
    )

})


// ----------------------------------
// start server
// ----------------------------------
const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}


// 1. connect to the databas
// 2. AFTER you successfully connect, that you start he expres server
mongoose.connect(mongoURL, connectionOptions).then(
    () => {
         console.log("Connection success")
         app.listen(HTTP_PORT, onHttpStart); 
    }
 ).catch(
    (err) => {
        console.log("Error connecting to database")
        console.log(err)
    }
)