import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="text-4xl font-bold">ページが見つかりません</h1>
        <p className="text-muted-foreground">
          リンクが変更されたか、削除された可能性があります。トップに戻ってナビゲーションから目的のページを探してください。
        </p>
      </div>
      <Button asChild>
        <Link href="/">ホームに戻る</Link>
      </Button>
    </main>
  );
}
