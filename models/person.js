const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {    console.log('connected to MongoDB')  })  .catch((error) => {    console.log('error connecting to MongoDB:', error.message)  })

function number_parts_validator (val) {
    var validation = true
    const parts = val.split("-")
    if ((parts.length !== 2) || (parts[0].length !== 2 && parts[0].length !== 3) || (parts[1].length === 0)) {
	validation = false
    }
    if (!(/^\d+$/.test(parts[0]) || !(/^\d+$/.test(parts[1])))) { //Check if its a number, i.e. only digits
	validation = false
    }
    return validation;
}

const personSchema = new mongoose.Schema({
    name: {
	type: String,
	minLength: 3
    },
    number: {
	type: String,
	minLength: 8,
	validate: {
	    validator: number_parts_validator,
	    msg: 'Phone number must have schema P0-P1 where P0 is two or three digits long and P1 of at least one digit.'
    },
    },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)
