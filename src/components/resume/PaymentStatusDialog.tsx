'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle } from '@/components/icons';
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
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-6 sm:p-8 gap-4 sm:gap-6 border-border/50 text-center">
        <DialogTitle className="sr-only">Payment Successful</DialogTitle>
        <DialogDescription className="sr-only">Your payment was successful</DialogDescription>
        
        <div className="rounded-full p-3 sm:p-4 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
          <CheckCircle className="size-12 sm:size-16" />
        </div>
        
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Payment Successful</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Your credits have been added to your account.
          </p>
        </div>

        <Button onClick={handleClose} className="w-full mt-2 sm:mt-4 h-10 rounded-xl" variant="default">
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
