require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(express.static('build'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

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

const Person = require('./models/person')

const generateId = () => {
  const randId = data.length > 0
	? Math.floor(Math.random() * 100000)
    : 0
  return randId
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
	data = result
	response.json(result)
    })
})

app.get('/api/info', (request, response) => {
    Person.find({}).then(result => {
	data = result
	const len = data.length
	const date = new Date()
	response.send(`The phonebook site has ${len} people.`+ `\n` + date)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
	.then(person => {
	    if (person) {
		response.json(person)
	    } else {
		response.status(404).end()
	    }
	})
	.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    data = data.filter(person => person.id !== id)

    Person.findByIdAndRemove(request.params.id)
	.then(result => {
	    response.status(204).end()
	})
	.catch(error => next(error))
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

    const person = new Person({
	id: generateId(),
	name: body.name,
	number: body.number,
    })

    data = data.concat(person)

    person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
