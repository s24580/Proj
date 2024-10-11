import express from 'express';
import {faker } from '@faker-js/faker';

const app = new express();

/* API CHEVROLET 
min 5 - statusow i metod
3 poziomy zagniezdenia

*/ 

app.get('/:id', (req,res) => {
    faker.seed(Number(req.params.id));
    const randomName = faker.person.fullName();
  res.send(randomName);
});

app.listen(8989, ()=> {
    console.log("started on 8989");
});

