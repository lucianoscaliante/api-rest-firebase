const express = require("express");
const app = express();

const admin = require("firebase-admin");
const credentials = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.post('/login', async (req, res) => {
    try {
        const userResponse = await admin.auth().createUser({
            email: req.body.email,
            senha: req.body.senha
        });
        const reponse = await db.collection("usuarios").doc(userResponse.uid).set({
            nome: req.body.nome,
            idade: req.body.idade,
            sexo: req.body.sexo,
            cidade: req.body.cidade
        });
        res.send(reponse);
    } catch (error) {
        res.send(error);
    }
})

app.get('/lista/all', async (req, res) => {
    try {
        const userRef = db.collection("usuarios");
        const response = await userRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch (error) {
        res.send(error);
    }
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);
})