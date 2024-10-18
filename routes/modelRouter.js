import express from "express";

export const modelRouter = express.Router();

modelRouter.get("/", (req,res) =>{
    res.status(200).send("all models");
});

modelRouter.get("/:id", (req,res) =>{
    const {id} = req.params;
    if (!id){
        res.status(400).send("bad request-id");
    }
    if () {
        res.status(404).send("not found");
    } else {
        res.status(200).send("get model with id");
    }

});

modelRouter.post("/", (req,res) =>{
    res.send("model");
});

modelRouter.delete("/", (req,res) =>{
    res.send("model");
});

modelRouter.put("/", (req,res) =>{
    res.send("model");
});

modelRouter.patch("/", (req,res) =>{
    res.send("model");
});