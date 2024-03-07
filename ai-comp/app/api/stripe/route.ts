import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Stripe } from "stripe";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const settingsUrl = absoluteUrl("/settings");

// This function is responsible for creating a new Stripe checkout session
export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    // If the user is not authenticated or does not exist, return an unauthorized response
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user subscription
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId: userId,
      },
    });

    // If a user susbscription exists and has a stripeCustomerId, redirect to the billing portal
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // If a user subscription exists but does not have a stripeCustomerId, create a new checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "NZD",
            product_data: {
              name: "Associate Pro",
              description: "Create Custom AI Model",
            },
            unit_amount: 799,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("[STRIPE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
