import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import DodoPayments from 'dodopayments';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { planType } = await req.json();

    if (!planType) {
      return NextResponse.json({ error: 'Missing planType' }, { status: 400 });
    }

    let productId = '';
    let creditAmount = 0;

    switch (planType) {
      case 'starter':
        productId = process.env.STARTER_PLAN || '';
        creditAmount = 100;
        break;
      case 'active':
        productId = process.env.ACTIVE_PLAN || '';
        creditAmount = 400;
        break;
      case 'pro':
        productId = process.env.PRO_PLAN || '';
        creditAmount = 1000;
        break;
      default:
        return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json(
        { error: `Product ID for ${planType} plan is not configured in env variables` },
        { status: 500 }
      );
    }

    const dodo = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY || '',
      environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as any) || (process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode'),
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = process.env.DODO_PAYMENTS_RETURN_URL || `${appUrl}/dashboard?payment=success`;

    const checkoutSession = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      customer: {
        email: session.user.email!,
        name: session.user.name || undefined,
      },
      metadata: {
        userId: session.user.id,
        creditAmount: String(creditAmount),
        planType: planType,
      },
      return_url: returnUrl,
    });

    return NextResponse.json({ url: checkoutSession.checkout_url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
