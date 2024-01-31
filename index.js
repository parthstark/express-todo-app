const colorize = require('./utils/colorize')

const port = 3000
const express = require('express')
const app = express()

let pendingTodos = []
let completedTodos = []
let id = 1

app.use(express.json())

app.get('/todos', (_, res) => {
    res.status(200).json({
        pending: pendingTodos,
        completed: completedTodos
    })
})

app.post('/add', (req, res) => {
    const body = req.body
    const title = body.title
    const description = body.description
    if (!title || !description) {
        res.status(400).json({
            "message": "missing title or description"
        })
        return
    }

    const newTodo = {
        id: id++,
        title: title,
        description: description
    }
    pendingTodos.push(newTodo)

    res.status(200).json(newTodo)
})

app.post('/complete', (req, res) => {
    const body = req.body
    const id = body.id
    if (id == undefined) {
        res.status(400).json({
            "message": "missing todo id"
        })
        return
    }

    const completedIndex = completedTodos.findIndex((todo) => todo.id == id)
    if (completedIndex >= 0) {
        res.status(200).json({
            "message": "todo already completed"
        })
        return
    }

    const pendingIndex = pendingTodos.findIndex((todo) => todo.id == id)
    if (pendingIndex < 0) {
        res.status(400).json({
            "message": "todo id not found"
        })
        return
    }

    const todo = pendingTodos.splice(pendingIndex, 1)
    completedTodos = [...completedTodos, ...todo]

    res.status(200).json({
        "completed": todo
    })
})

app.delete('/delete', (req, res) => {
    const body = req.body
    const id = body.id
    if (id == undefined) {
        res.status(400).json({
            "message": "missing todo id"
        })
        return
    }

    const completedIndex = completedTodos.findIndex((todo) => todo.id == id)
    const pendingIndex = pendingTodos.findIndex((todo) => todo.id == id)
    if (pendingIndex < 0 && completedIndex < 0) {
        res.status(400).json({
            "message": "todo id not found"
        })
        return
    }

    completedTodos.splice(completedIndex, 1)
    pendingTodos.splice(pendingIndex, 1)

    res.status(200).json({
        "message": `todo id: ${id} deleted successfully`
    })
})

app.get('/', (_, res) => {
    res.json({
        "/todos": {
            "type": "GET",
            "response": {
                "pending": [],
                "completed": []
            }
        },
        "/add": {
            "type": "POST",
            "body": {
                "title": "string",
                "description": "string"
            },
            "response": {
                "id": "number",
                "title": "string",
                "description": "string"
            },
        },
        "/complete": {
            "type": "POST",
            "body": {
                "id": "number",
            },
            "response": {
                "completed": "todo object"
            },
        },
        "/delete": {
            "type": "DELETE",
            "body": {
                "id": "number",
            },
            "response": {
                "message": "todo id: {id} deleted successfully"
            },
        },
    })
})

app.listen(port, () => {
    console.log(`running on ${colorize(`http://localhost:${port}/`, 'yellow')}`);
})