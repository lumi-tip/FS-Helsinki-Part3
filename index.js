const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
morgan.token('reqInfo', function (req) { return JSON.stringify(req.body)})
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.reqInfo(req)
    ].join(' ')
}))


let agenda = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateRandomId = () => {
    const id = Math.floor(Math.random() * 9999)
    const idExist = agenda.find(person => person.id === id)
    if (idExist) {
        generateRandomId()
    }
    else {
        return id
    }
}

app.get('/', (request, response) => {
    response.end('server listening')
})

app.get('/api/persons', (request, response) => {
    response.json(agenda)
})

app.get('/info', (request, response) => {
    const numberOfPeople = agenda.length
    const date = Date.now()
    const today = new Date(date)
    response.send(`<p>Phonebook has info for ${numberOfPeople} people</p><p>${today}</p>`)
    response.end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = agenda.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.statusMessage = "Person not found"
        response.status(404).end("person not found")
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = agenda.find(person => person.id === id)

    if (person) {
        agenda = agenda.filter(person => person.id !== id)
        response.json(agenda)
    }
    else {
        response.statusMessage = "Person not found"
        response.status(404).end("person not found")
    }
})

app.post('/api/persons', (request, response) => {
    const number = request.body.number;
    const name = request.body.name;

    if (!number) response.status(400).json({ "msg": 'number of the person is a must' });
    if (!name) response.status(400).json({ "msg": 'name of the person is a must' });

    const nameExist = agenda.find(person => person.name === name)

    if (nameExist) {
        response.statusMessage = "The person already exist"
        response.status(400).json({ "msg": `${name} already exist on the agenda` })
    }
    else {
        const person = {
            "name": name,
            "number": number,
            "id": generateRandomId()
        }

        agenda = agenda.concat(person)
        response.json(agenda)
    }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server listening to port ' + PORT + 'http://localhost:3001')
})