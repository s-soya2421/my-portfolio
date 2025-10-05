'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">500</p>
        <h1 className="text-4xl font-bold">予期せぬエラーが発生しました</h1>
        <p className="text-muted-foreground">ページを再読み込みしても問題が解決しない場合は、時間をおいて再度アクセスしてください。</p>
      </div>
      <Button onClick={() => reset()}>ページを再読み込み</Button>
    </main>
  );
}
