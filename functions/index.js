const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const handlebars = require('handlebars');
const fs = require('fs');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:4200',
})); // Pour autoriser les requêtes cross-origin (CORS)

app.use(express.json());

const gmailPassword = process.env.APPLICATION_PSW_GMAIL;
const gmailEmail = process.env.TO_EMAIL;

// Charger le modèle Handlebars à partir du fichier
const emailContactTemplateSource = fs.readFileSync('./emailContactTemplate.hbs', 'utf8');
const emailContactTemplate = handlebars.compile(emailContactTemplateSource);

// Créer un transporteur pour l'envoi d'e-mails via SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secureConnection: false,
    port: 587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

app.post('/submit-contact-form', async (req, res) => {
    try {
        const formData = req.body;

        // Vérifier si les données du formulaire sont présentes
        if (!formData) {
            return res.status(400).json({ message: 'Les données du formulaire sont manquantes.' });
        }

        // Ajouter la date d'envoi au formulaire
        formData.dateSent = new Date().toISOString();

        // Générer le contenu HTML en utilisant Handlebars avec les données du formulaire
        const data = emailContactTemplate(formData);

        // Configurer l'e-mail
        const mailOptions = {
            from: `JMJ <${formData.email}>`,
            to: gmailEmail,
            cc: formData.email,
            subject: formData.subject,
            text: data,
            html: data,
        };

        // Envoyer l'e-mail
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'E-mail envoyé avec succès.' });

    } catch (error) {
        console.error('Erreur lors du traitement de la demande :', error);
        return res.status(500).json({ message: 'Une erreur s\'est produite lors du traitement de la demande.' });
    }
});

module.exports = app;
module.exports.transporter = transporter; // Exportez le transporteur pour les tests

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
