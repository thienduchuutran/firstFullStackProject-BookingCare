require('dotenv').config()
import nodemailer from 'nodemailer'

let sendSimpleEmail = async(dataSend) => {
    let result =  getBodyHTMLEmail(dataSend)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      let info = await transporter.sendMail({
        from: '"Duc Tran 👻" <thienductranhuu2784@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: result.subject, // Subject line
        text: "Hello world?", // plain text body
        html: result.html, 
      });
}

let getBodyHTMLEmail = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi'){
    result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh với Duc Tran Booking Care</p>
        <p>Thông tin dặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng, vui lòng nhấn vào link bên dưới
        để xác nhận  và hoàn tất thủ tục đặt lịch</p>

        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Chân thành cảm ơn</div>
        `
  }
  if(dataSend.language === 'en'){
    result.html = `<h3>Hello ${dataSend.patientName}</h3> <p>You received this email because you have scheduled a medical appointment with Duc Tran Booking Care</p> <p>Appointment details:</p> <div><b>Time: ${dataSend.time}</b></div> <div><b>Doctor: ${dataSend.doctorName}</b></div> <p>If the information above is correct, please click the link below to confirm and complete the appointment process.</p> <div> <a href=${dataSend.redirectLink} target="_blank">Click here</a> </div> <div>Thank you very much</div>`,
    result.subject = `Appointment scheduling information ✔`
  }

  return result
}

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi'){
    result = `
        <h3>Xin chào ${dataSend.patientName} </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh với Duc Tran Booking Care</p>
        <p>Thông tin hoa don duoc gui trong file dinh kem:</p>


        <div>Chân thành cảm ơn</div>
        `
  if(dataSend.language === 'en'){
    result = `<h3>Hello ${dataSend.patientName}</h3> 
    <p>You received this email because you have scheduled a medical appointment with Duc Tran Booking Care</p> 
    <p>Appointment details:</p> 
    <div><b>Time:</b></div> 
    <div><b>Doctor: </b></div> 
    <p>If the information above is correct, please click the link below to confirm and complete the appointment process.</p> 
    <div> <a href= target="_blank">Click here</a> </div> 
    <div>Thank you very much</div>`
  }

  return result
}
}

let sendAttachment = async (dataSend) => {
  return new Promise(async(resolve, reject)=> {
    try{
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
  
      let info = await transporter.sendMail({
        from: '"Duc Tran 👻" <thienductranhuu2784@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Ket qua dat lich kham benh", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend), 
        attachments: [
          {
            filename: `remedy - ${dataSend.patientId} - ${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: 'base64'
          },
        ],
      });

      resolve(true)
    }catch(e){
      reject(e)
    }
  })

}


module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}
