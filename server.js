import express from "express";
import mercadopago from "mercadopago";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔥 MERCADO PAGO
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// 🔥 FIREBASE
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// 🚀 CREAR SUSCRIPCIÓN
app.post("/crear-suscripcion", async (req, res) => {

  const { uid } = req.body;

  try {

    const response = await mercadopago.preapproval.create({
      reason: "HypertroFit PRO",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 2000,
        currency_id: "ARS"
      },
      back_url: "https://hypertrofit.onrender.com",
      external_reference: uid
    });

    res.json({
      init_point: response.body.init_point
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creando suscripción");
  }
});


// 🔥 WEBHOOK
app.post("/webhook", async (req, res) => {

  try {

    const data = req.body;

    if (data.type === "preapproval") {

      const id = data.data.id;

      const sub = await mercadopago.preapproval.get(id);

      if (sub.body.status === "authorized") {

        const uid = sub.body.external_reference;

        await db.collection("usuarios").doc(uid).set({
          pro: true,
          pro_expira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }, { merge: true });

        console.log("💎 PRO ACTIVADO:", uid);
      }
    }

    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server listo en puerto " + PORT);
});
