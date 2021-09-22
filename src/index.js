const express = require('express');
const { v4:uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

function userNameVerifyExist(request, response, next) {
  const { username } = request.headers;
  const userNameExist = users.find((uname) => uname.username === username);
  if(!userNameExist) {
    return response.status(404).json({error: "Usuario nao cadastrado"});
  }
  request.userNameExist = userNameExist;
  return next()
}

const users = []

app.post("/createuser", (request, response) => {
  const { name, username } = request.body;
  const userNameVerify = users.some((uname) => uname.username === username);
  if(userNameVerify){
    return response.status(400).json({ error:"Username já existe!"})
  }

  users.push ({ 
    name,
    username,
    todos: []
  });
  return response.status(201).send()
});

app.post("/createtodos", userNameVerifyExist, (request, response) => {
  const { title, deadline } = request.body;
  const { userNameExist } = request;
  const createtodos = {
    id:uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    create_at:new Date()
  }
  userNameExist.todos.push(createtodos);

  return response.status(201).send();
});

app.get("/listtodos", userNameVerifyExist, (request, response) => {
  const { userNameExist } = request;
  return response.json(userNameExist.todos)
});

app.put("/updatetodos/:id", userNameVerifyExist, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { userNameExist } = request;

  const todo = userNameExist.todos.find((todoid) => todoid.id === id);
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).send()
});

app.patch("/updatetodos/:id/done", userNameVerifyExist, (request, response) => {
  const { id } = request.params;
  const { done } = request.body;
  const { userNameExist } = request;

  const tododone = userNameExist.todos.find((donetodos) => donetodos.id === id);
  tododone.done = done;

  return response.status(200).send()
});

app.delete("/deletetodos/:id", userNameVerifyExist, (request, response) => {
  const { id } = request.params;
  const { userNameExist } = request;
  const todosExist = userNameExist.todos.findIndex((existtodos) => existtodos.id === id)
  if(todosExist === -1) {
    return response.status(404).json({error: "Essa tarefa nao existe!"})
  }
    userNameExist.todos.splice(todosExist, 1);

    return response.status(204).send()
  });

app.listen(3000)

