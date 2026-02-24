import express from "express";
import mercadopago from "mercadopago";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔥 MERCADO PAGO
mercadopago.configure({
  access_token: "TEST-8209367707264568-022415-486e204eddf7708fbbd815bba1c89fff-110739325"
});

// 🔥 FIREBASE ADMIN
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server listo en puerto " + PORT);
});
