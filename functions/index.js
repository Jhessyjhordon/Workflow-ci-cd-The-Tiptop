// const functions = require('firebase-functions');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
// const admin = require('firebase-admin');
const handlebars = require('handlebars');
const fs = require('fs');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
	origin: 'http://localhost:3000',
})); // Pour autoriser les requêtes cross-origin (CORS)

app.use(express.json());

// Initialiser Firebase Admin SDK
// admin.initializeApp();

// Configuration de l'envoi d'e-mails via SMTP (Gmail)
const gmailPassword = process.env.APPLICATION_PSW_GMAIL; // Remplacez par votre adresse Gmail
const gmailEmail = process.env.TO_EMAIL; // Remplacez par votre mot de passe Gmail

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



// La fonction qui sera déclenchée lorsque le formulaire de contact est soumis
app.post('/submit-contact-form', async (req, res) => {
	try {

		const formData = req.body;
		const userEmail = formData.email; // Utilisez l'adresse e-mail comme clé

		// Ajouter la date d'envoi au formulaire
		formData.dateSent = new Date().toISOString();

		// Générer le contenu HTML en utilisant Handlebars avec les données du formulaire
		const data = emailContactTemplate(formData);

		// Vérifier si les données du formulaire sont présentes
		if (!formData) {
			return res.status(400).json({ message: 'Les données du formulaire sont manquantes.' });
		}

		// Enregistrer les données dans Firestore avec l'adresse email comme ID de projet unique
		// await admin.firestore().collection('contact').doc(userEmail).set(formData);

		// Configurer l'e-mail
		const mailOptions = {
			from: `JMJ <${formData.email}>`,
			to: gmailEmail, // Remplacez par l'adresse e-mail du destinataire
			cc: formData.email,
			subject: formData.subject,
			text: data, // Contenu généré par Handlebars, peut être conservé pour les clients de messagerie ne prenant pas en charge HTML
			html: data, // Contenu généré par Handlebars, pour les clients de messagerie prenant en charge HTML			
		};

		// Envoyer l'e-mail
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
				return res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'envoi de l\'e-mail.' });
			} else {
				// console.log('E-mail envoyé avec succès :', info.response);
				return res.status(200).json({ message: 'E-mail envoyé avec succès.' });
			}
		});

	} catch (error) {
		console.error('Erreur lors du traitement de la demande :', error);
		return res.status(500).json({ message: 'Une erreur s\'est produite lors du traitement de la demande.' });
	}

});

app.listen(port, () => {
	console.log(`Serveur en cours d'exécution sur le port ${port}`);
});