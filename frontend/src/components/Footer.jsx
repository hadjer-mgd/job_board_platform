export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-slate-500">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p>© {new Date().getFullYear()} JobDZ — Plateforme d'emploi pour l'Algérie.</p>
          <p>Connecter talents et entreprises, simplement.</p>
        </div>
      </div>
    </footer>
  );
}
