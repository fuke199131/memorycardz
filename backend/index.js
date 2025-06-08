const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Usa clave secreta desde entorno

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Pedido MemoryCardz' },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://memorycardz.vercel.app/success.html',
      cancel_url: 'https://memorycardz.vercel.app/cancel.html',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creando la sesión:', err);
    res.status(500).json({ error: 'Fallo en el servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend activo en puerto ${PORT}`);
});
