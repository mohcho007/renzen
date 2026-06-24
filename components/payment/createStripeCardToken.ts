import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";

export async function createStripeCardToken(
  stripe: Stripe | null,
  elements: StripeElements | null,
): Promise<string> {
  if (!stripe || !elements) {
    throw new Error("Betaling er ikke klar endnu. Vent et øjeblik og prøv igen.");
  }

  const card = elements.getElement(CardElement);
  if (!card) {
    throw new Error("Kortfeltet er ikke klar. Genindlæs siden og prøv igen.");
  }

  const { error, token } = await stripe.createToken(card);
  if (error?.message) {
    throw new Error(error.message);
  }
  if (!token?.id) {
    throw new Error("Kunne ikke verificere kortet. Tjek oplysningerne og prøv igen.");
  }

  return token.id;
}
