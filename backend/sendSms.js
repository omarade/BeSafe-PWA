const express = require ('express');
const app = express();
const port = 8383;
const cors = require ('cors')

app.use(cors())

app.get('/', (req, res) => {
    var address = req.query.location
    
    // sendSms(address)
    console.log("Send SMS")
    res.send({message: "Msg sent to your emergency contact"})
})


app.listen(port, () => {
    console.log(`Server has started on port: ${port}`)
})

const accountSid = "AC863de2b10d7e8876288e8c163152e267";
const authToken = "667bfb561427d008cbb6975f34f29480";

const client = require('twilio')(accountSid, authToken)

function sendSms (address){
    client.messages.create({
        to: '+31636462976',
        from: '+14302492275',
        body: `I am in danger, please help! \n Location: ${address}`
    })
}
