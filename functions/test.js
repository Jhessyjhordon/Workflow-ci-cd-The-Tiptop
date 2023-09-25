const assert = require('chai').assert;
const sinon = require('sinon');
const supertest = require('supertest');
const mockFs = require('mock-fs');
const app = require('./index.js');

describe('submitContactForm', function () {
    let supertestApp;
    let mockTransporter;

    // Configuration de vos données de test
    const testData = {
        name: "John Doe",
        email: "johndoe@example.com",
        subject: "Demande d'information",
        message: "Bonjour, je suis intéressé par vos services. Pouvez-vous me fournir plus d'informations ?",
    };

    before(function () {
        // Configuration du système de fichiers virtuel avec le contenu du modèle d'e-mail
        mockFs({
            './emailContactTemplate.hbs': testData.message,
            'node_modules': mockFs.load('node_modules/'),
        });
    });

    beforeEach(function () {
        supertestApp = supertest(app);

        // Stubber le transporteur exporté de l'application
        mockTransporter = app.transporter;
        sinon.stub(mockTransporter, 'sendMail').resolves();
    });

    afterEach(function() {
        // Restaurer les comportements sinon stub après chaque test
        sinon.restore();
    });

    after(function () {
        // Restaurez le système de fichiers réel après les tests
        mockFs.restore();
    });

    it('should send an email when submitted', async function () {
        // Envoyer une demande HTTP POST à votre route Express avec les données de test
        const response = await supertestApp
            .post('/submit-contact-form')
            .send(testData);

        // Vérifier que la réponse a le code de statut attendu
        assert.equal(response.status, 200);

        // Vérifier que la réponse JSON est correcte
        assert.equal(response.body.message, 'E-mail envoyé avec succès.');

        console.log(mockTransporter.sendMail.getCall(0).args[0]);

        // Vérifier que nodemailer.sendMail a été appelé avec les bonnes données
        sinon.assert.calledWithMatch(mockTransporter.sendMail, {
            from: sinon.match(testData.email),
            to: sinon.match('jhessyismael@gmail.com'), // Remplacez par l'e-mail de destination attendu
            cc: sinon.match(testData.email),
            subject: sinon.match(testData.subject),
            text: sinon.match.string, // cela vérifie simplement que le champ est une chaîne
            html: sinon.match.string,
        });
    });
});
