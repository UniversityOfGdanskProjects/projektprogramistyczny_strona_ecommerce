import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("Połączenie SMTP zweryfikowane pomyślnie");
    return true;
  } catch (error) {
    console.error("Błąd weryfikacji SMTP:", error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(userEmail, order) {
  try {
    const isVerified = await verifyTransporter();
    if (!isVerified) {
      throw new Error("Nie można zweryfikować połączenia SMTP");
    }

    console.log("Przygotowywanie maila dla:", userEmail);

    const mailOptions = {
      from: `"TechNest" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Potwierdzenie zamówienia - TechNest",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #222; text-align: center;">Dziękujemy za złożenie zamówienia!</h1>
          <p>Twoje zamówienie nr <strong>${
            order._id
          }</strong> zostało przyjęte do realizacji.</p>
          
          <h2>Szczegóły zamówienia:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Produkt</th>
              <th style="padding: 10px; text-align: right;">Cena</th>
            </tr>
            ${order.products
              .map(
                (product) => `
              <tr>
                <td style="padding: 10px;">${product.title}</td>
                <td style="padding: 10px; text-align: right;">${product.price} zł</td>
              </tr>
            `
              )
              .join("")}
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <strong>Razem: ${order.totalAmount} zł</strong>
          </div>
          
          <div style="margin-top: 30px;">
            <h3>Status zamówienia: ${order.status}</h3>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #666;">
              Dziękujemy za zakupy w TechNest!<br>
              W razie pytań prosimy o kontakt.
            </p>
          </div>
        </div>
      `,
    };

    console.log("Wysyłanie maila...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail wysłany pomyślnie:", info.messageId);
    return info;
  } catch (error) {
    console.error("Błąd wysyłania maila:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw error;
  }
}
