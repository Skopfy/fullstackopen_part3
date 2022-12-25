const http = require('http')

const express = require('express')
const app = express()
app.use(express.json())

let data = [
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
    },
]

const generateId = () => {
  const randId = data.length > 0
	? Math.floor(Math.random() * 100000)
    : 0
  return randId
}

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/info', (request, response) => {
    const len = data.length
    const date = new Date()
    response.send(`The phonebook site has ${len} people.`+ `\n` + date)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(person => person.id === id)
    if (person) {
	response.json(person)
    } else {
	response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  } else if (!body.number) {
      return response.status(400).json({ 
      error: 'number missing' 
    })
  }

    const existing = data.find(person => person.name === body.name)
    if (existing) {
    return response.status(400).json({ 
	error: 'name duplicate, exists already' 
    })
  }

    const person = {
	id: generateId(),
	name: body.name,
	number: body.number,
  }

  data = data.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
