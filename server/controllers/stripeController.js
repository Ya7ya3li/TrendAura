import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckout = async (req, res) => {
  try {
    const { email, userId } = req.body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      metadata: { userId },
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/settings'
    })

    res.json({ url: session.url })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Checkout Failed' })
  }
}

export const getSubscription = async (req, res) => {
  try {
    const { email } = req.body

    const customers = await stripe.customers.list({ email, limit: 1 })

    if (customers.data.length === 0) {
      return res.json({ plan: 'free' })
    }

    const customer = customers.data[0]
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length > 0) {
      return res.json({ plan: 'pro' })
    }

    res.json({ plan: 'free' })
  } catch (error) {
    res.status(500).json({ plan: 'free' })
  }
}