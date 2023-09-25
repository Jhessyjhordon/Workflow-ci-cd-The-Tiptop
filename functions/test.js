const assert = require('chai').assert;
const sinon = require('sinon');
const supertest = require('supertest');
const express = require('express');
const nodemailer = require('nodemailer'); // Ajoutez cette ligne pour importer nodemailer
// const fs = require('fs');
const mockFs = require('mock-fs');

describe('submitContactForm', function () {
    let app;
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
            './emailContactTemplate.hbs': testData.message, // Remplacez par le contenu réel de votre modèle d'e-mail
        });
    });

    beforeEach(function () {
        app = express();
        supertestApp = supertest(app);

        mockTransporter = {
            sendMail: sinon.stub(),
        };

        sinon.stub(nodemailer, 'createTransport').returns(mockTransporter); // Utilisez sinon.stub pour configurer le stub
    });

    after(function () {
        // Restaurez le système de fichiers réel après les tests
        mockFs.restore();
    });

    it('should send an email when submitted', async function () {

        // Vérifier que nodemailer.sendMail renvoie une promesse résolue
        mockTransporter.sendMail.resolves();

        // Envoyer une demande HTTP POST à votre route Express avec les données de test
        const response = await supertestApp
            .post('/submit-contact-form')
            .send(testData);

        // Vérifier que la réponse a le code de statut attendu
        assert.equal(response.status, 200);

        // Vérifier que la réponse JSON est correcte
        assert.equal(response.body.message, 'E-mail envoyé avec succès.');

        // Vérifier que nodemailer.sendMail a été appelé avec les bonnes données
        sinon.assert.calledWithMatch(mockTransporter.sendMail, {
            from: sinon.match(testData.email),
            to: sinon.match('jhessyismael@gmail.com'), // Remplacez par l'e-mail de destination attendu
            cc: sinon.match(testData.email),
            subject: sinon.match(testData.subject),
            text: sinon.match(testData.message), // Utilisez le contenu réel du modèle d'e-mail ici
            html: sinon.match(testData.message), // Utilisez le contenu réel du modèle d'e-mail ici
        });
    });


});
