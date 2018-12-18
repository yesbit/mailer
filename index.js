const nodemailer = require('nodemailer')

class Mailer {
  constructor () {
    const user = process.env.MAILER_USER
    const pass = process.env.MAILER_PASS
    const recipients = process.env.MAILER_RECIPIENTS
    if (!user || !pass || !recipients) {
      console.error('Mailer: email username, password and receipient addres must be specified')
      process.exit(1)
    }

    this.user = user
    this.pass = pass
    this.recipients = recipients

    this.transporter = nodemailer.createTransport({
      'host': 'smtp.gmail.com',
      // Regular SMPT port 25 is blocked on Alibabacloud
      // See https://www.alibabacloud.com/help/doc-detail/29449.htm?spm=a2c63.p38356.a3.9.4f704653nrQqjl
      'port': 465,
      'secureConnection': true,
      'auth': {
        'user': user,
        'pass': pass
      }
    })
  }

  async send (subject , body = '') {
    console.log('Mailer:', 'sending alert')
    let mailOptions = {
      from: 'Monitor<monitor@yesbit.ca>',
      to: this.recipients,
      // cc:'haha<xxx@xxx.com>',
      // bcc:'haha<xxxx@xxxx.com>',
      subject: 'Monitor alert: ' + subject,
      text: body, // plaintext body
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      console.log('Alert sent: ' + info.response)
    }
    catch (error) {
      console.error('Mailer error:', error)
    }
  }
}

module.exports = Mailer