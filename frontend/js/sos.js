import {sendSms} from "./sendSos.js"

$("#btnDanger").click(() => {
    alert("A message has been sent to your emergency contact.")
    sendSms()
})