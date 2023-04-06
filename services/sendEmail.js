const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendProfileEmail = async (email, name) => {
  sgMail.setApiKey(process.env.TWILIO_SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "kannangr21@gdscsastra.tech",
    templateId: "d-38541c19b08f4964a22477ba87af9dc7",
    dynamic_template_data: {
      name: name,
    },
  };

  await sgMail.send(msg);
};

module.exports = {
  sendProfileEmail,
};
