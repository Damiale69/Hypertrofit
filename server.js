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




// 🔥 WEBHOOK
app.post("/webhook", async (req, res) => {

  try {

    const data = req.body;

    console.log("📩 WEBHOOK RECIBIDO:", data);

    const id = data.data?.id;

    if (!id) {
      return res.sendStatus(200);
    }

    const sub = await mercadopago.preapproval.get(id);

    console.log("📊 ESTADO SUSCRIPCION:", sub.body.status);

    if (sub.body.status === "authorized") {

      const uid = sub.body.external_reference;

      await db.collection("usuarios").doc(uid).set({
        pro: true,
        pro_expira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }, { merge: true });

      console.log("💎 PRO ACTIVADO:", uid);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("❌ ERROR WEBHOOK:", err);
    res.sendStatus(500);
  }
});


// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, "web")));

app.get("/sw.js", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "sw.js"));
});

app.get("/icon-192.png", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "icon-192.png"));
});

app.get("/icon-512.png", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "icon-512.png"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "index.html"));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server listo en puerto " + PORT);
});
