import express from "express";
import mercadopago from "mercadopago";
import bodyParser from "body-parser";
import admin from "firebase-admin";

const app = express();
app.use(bodyParser.json());

// 🔥 MERCADO PAGO
mercadopago.configure({
  access_token: "TU_ACCESS_TOKEN"
});

// 🔥 FIREBASE ADMIN
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

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
      uid: uid
    },
    notification_url: "https://TU-APP.onrender.com/webhook"
  };

  const response = await mercadopago.preferences.create(preference);

  res.json({
    init_point: response.body.init_point
  });
});


// 🔥 WEBHOOK (ACTIVA PRO)
app.post("/webhook", async (req, res) => {

  try {
    const payment = req.body;

    if (payment.type === "payment") {

      const paymentId = payment.data.id;

      const result = await mercadopago.payment.findById(paymentId);

      if (result.body.status === "approved") {

        const uid = result.body.metadata.uid;

        // 🔥 ACTIVA PRO EN FIREBASE
        await db.collection("usuarios").doc(uid).set({
          pro: true
        }, { merge: true });

        console.log("💰 Usuario PRO:", uid);
      }
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.sendStatus(500);
  }
});


app.listen(3000, () => {
  console.log("🚀 Server listo");
});

