import express from "express";
import mercadopago from "mercadopago";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  const { uid, email } = req.body;

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

      notification_url: "https://hypertrofit.onrender.com/webhook",

      payer_email: req.body.email,

      external_reference: uid
    });

    res.json({
      init_point: response.body.init_point
    });

  } catch (err) {

    console.error("🔥 ERROR MP:", err);

    res.status(500).json({
      error: err.message
    });

  }
});




app.post("/webhook", async (req, res) => {

  try {

    const data = req.body;

    console.log("📩 WEBHOOK RECIBIDO:", data);

    // 🔹 1. SUSCRIPCIONES (preapproval)
    if (data.type === "preapproval") {

      const id = data.data?.id;

      if (!id) return res.sendStatus(200);

      const sub = await mercadopago.preapproval.get(id);

      const uid = sub.body.external_reference;

      console.log("📊 SUSCRIPCION:", sub.body.status);

      if (sub.body.status === "authorized") {

        await db.collection("usuarios").doc(uid).set({
          pro: true,
          pro_expira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }, { merge: true });

        console.log("💎 PRO ACTIVADO:", uid);
      }

      if (sub.body.status === "cancelled") {

        await db.collection("usuarios").doc(uid).set({
          pro: false
        }, { merge: true });

        console.log("🚫 PRO DESACTIVADO:", uid);
      }
    }

    // 🔹 2. PAGOS (por si usás checkout normal)
    if (data.type === "payment") {

      const paymentId = data.data?.id;

      if (!paymentId) return res.sendStatus(200);

      const payment = await mercadopago.payment.findById(paymentId);

      console.log("💰 PAGO:", payment.body.status);

      // Opcional: activar PRO si querés manejar pagos simples
    }

    // 🔥 SIEMPRE responder OK
    res.sendStatus(200);

  } catch (err) {

    console.error("❌ ERROR WEBHOOK:", err);

    // ⚠️ IMPORTANTE: devolver 200 igual
    res.sendStatus(200);

  }

});
