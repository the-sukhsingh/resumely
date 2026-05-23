'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PaymentStatusDialogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'succeeded') {
      setOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setOpen(false);
    
    // Clean the URL without full reload
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    params.delete('payment_id');
    params.delete('email');
    
    const newUrl = pathname + (params.toString() ? `?${params.toString()}` : '');
    router.replace(newUrl, { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 gap-6 border-border/50 text-center">
        <DialogTitle className="sr-only">Payment Successful</DialogTitle>
        <DialogDescription className="sr-only">Your payment was successful</DialogDescription>
        
        <div className="rounded-full p-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 " />
        </div>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Payment Successful</h2>
          <p className="text-muted-foreground text-sm">
            Your credits have been added to your account.
          </p>
        </div>

        <Button onClick={handleClose} className="w-full mt-4" variant="default">
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function PaymentStatusDialog() {
  return (
    <Suspense>
      <PaymentStatusDialogContent />
    </Suspense>
  );
}
