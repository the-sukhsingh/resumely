import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET || process.env.DODO_PAYMENTS_WEBHOOK_KEY || '';

  const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY || '',
    webhookKey: webhookSecret,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as any) || (process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode'),
  });

  try {
    const rawBody = await req.text();
    const webhookHeaders = {
      'webhook-id': req.headers.get('webhook-id') || '',
      'webhook-signature': req.headers.get('webhook-signature') || '',
      'webhook-timestamp': req.headers.get('webhook-timestamp') || '',
    };

    // Verify webhook signature securely
    let event;
    try {
      event = dodo.webhooks.unwrap(rawBody, { headers: webhookHeaders as Record<string, string> });
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process the payment.succeeded event
    if (event.type === 'payment.succeeded') {
      const paymentData = event.data;
      const metadata = paymentData.metadata;

      if (!metadata || !metadata.userId || !metadata.creditAmount) {
        console.error('Webhook payload is missing required metadata fields:', metadata);
        return NextResponse.json(
          { error: 'Missing userId or creditAmount in webhook metadata' },
          { status: 400 }
        );
      }

      const userId = metadata.userId as Id<"users">;
      const creditAmount = parseInt(String(metadata.creditAmount), 10);
      const planType = metadata.planType || 'unknown';

      if (isNaN(creditAmount)) {
        console.error('Invalid creditAmount in metadata:', metadata.creditAmount);
        return NextResponse.json({ error: 'Invalid creditAmount' }, { status: 400 });
      }

      // Initialize Convex HttpClient
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      await convex.mutation(api.users.addCredits, {
        webhookSecret: webhookSecret,
        userId: userId,
        amount: creditAmount,
        reason: `Purchased ${String(planType).toUpperCase()} package (${creditAmount} credits)`,
      });

      console.log(`Successfully credited ${creditAmount} credits to user ${userId} for ${planType} package.`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error handling Dodo Payments webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler internal error' },
      { status: 500 }
    );
  }
}
