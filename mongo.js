const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.2oai5tc.mongodb.net/phonebookApp?retryWrites=true&w=majority`
console.log(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      const person = new Person({
        name: name,
        number: number,
      })

      return person.save()
    })
    .then(() => {
      console.log('Entry saved!')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else if (!name && !number) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
        .catch((err) => console.log(err))
    })
}


