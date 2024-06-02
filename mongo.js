const mongoose = require('mongoose')
const { Schema } = mongoose

if(process.argv.length < 3){
    console.log('password needed')
    process.exit()
}

if(process.argv.length > 3 && process.argv.length < 5){
    console.log('contact name and number needed')
    process.exit()
}

const password = process.argv[2];

const url = `mongodb+srv://Luis:${password}@clusterfshelsinki.hwwy2x9.mongodb.net/?retryWrites=true&w=majority&appName=ClusterFSHelsinki`

mongoose.connect(url)

const contactSchema = new Schema({
    'name': String,
    'number': String
})

const Contact = mongoose.model('Contact', contactSchema);

if(process.argv.length === 3){
    Contact.find({}).then(result=>{
        console.log('phonebook:')
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length === 5){
    const contact = new Contact({
        'name': process.argv[3],
        'number': process.argv[4]
    });
    
    contact.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}


