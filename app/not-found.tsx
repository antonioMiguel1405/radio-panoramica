import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold">Página fora da camada de imagem</h1>
      <p className="mt-2 text-muted">Não encontramos esta página. Que tal voltar ao roteiro?</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent">
          Início
        </Link>
        <Link href="/roteiro" className="rounded-xl border border-line bg-surface px-5 py-3 font-semibold text-fg">
          Roteiro
        </Link>
      </div>
    </div>
  );
}
