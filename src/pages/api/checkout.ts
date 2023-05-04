import { stripe } from "@/src/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";

export default async function haldler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { priceId } = req.body;

  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  if (!priceId) {
    return res.status(400).json({ error: "Price ID is required" });
  }

  const sucessUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_URL}/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: sucessUrl,
    cancel_url: cancelUrl,
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  return res.status(201).json({ checkoutUrl: checkoutSession.url });
}
