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

// 🔥 FIREBASE ADMIN
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// 🚀 CREAR PAGO
app.post("/crear-pago", async (req, res) => {

  const { uid } = req.body;

  const preference = {
    items: [
      {
        title: "HypertroFit PRO",
        quantity: 1,
        currency_id: "ARS",
        unit_price: 2000
      }
    ],
    metadata: {
      uid:uid
    },
    notification_url: "https://hypertrofit.onrender.com/webhook"
  };

  const response = await mercadopago.preferences.create(preference);

  res.json({
    init_point: response.body.init_point
  });
});


// 🔥 WEBHOOK (ACTIVA PRO)
app.post("/webhook", async (req, res) => {

  try {

    const data = req.body;

    if (data.type === "preapproval") {

      const preapprovalId = data.data.id;

      const result = await mercadopago.preapproval.get(preapprovalId);

      const uid = result.body.external_reference;

      if (result.body.status === "authorized") {

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

if (payment.type === "preapproval") {

  const id = payment.data.id;

  const sub = await mercadopago.preapproval.get(id);

  if (sub.body.status === "authorized") {

    const uid = sub.body.metadata.uid;

    await db.collection("usuarios").doc(uid).set({
      pro: true
    }, { merge: true });

    console.log("🔥 SUSCRIPCIÓN ACTIVA:", uid);
  }
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server listo en puerto " + PORT);
});


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

app.post("/crear-suscripcion", async (req, res) => {

  const { uid } = req.body;

  try {

    const suscripcion = await mercadopago.preapproval.create({
      reason: "HypertroFit PRO",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 2000,
        currency_id: "ARS"
      },
      back_url: "https://hypertrofit.onrender.com",
      payer_email: "test_user@email.com", // después lo mejoramos
      metadata: {
        uid: uid
      }
    });

    res.json({
      init_point: suscripcion.body.init_point
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error suscripción");
  }

});
