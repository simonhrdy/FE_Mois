# Yelp

Webová aplikace pro sledování recenzí, hodnocení a konkurence podniku.

## Spuštění

Vyžaduje Node.js 20.9+ a pnpm.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Na `http://localhost:3000` se otevře přihlášení. Pro vyzkoušení bez backendu nastavte
`NEXT_PUBLIC_API_MOCKING=true` a použijte tlačítko **Vyplnit demo účet**.

Pro připojení k backendu nastavte `NEXT_PUBLIC_API_MOCKING=false` a
`NEXT_PUBLIC_API_URL` na adresu REST API. Po změně proměnných restartujte server.

## Funkce

- Přehled hodnocení a posledních recenzí
- Filtrování recenzí podle hodnocení, data a textu
- Vyhledávání a sledování konkurence
- Analytika vývoje hodnocení
- AI asistent pro dotazy nad daty podniku

V demo režimu asistent zpracovává předem podporované typy dotazů nad ukázkovými daty.

## Kontroly

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Next.js, React, TypeScript, Material UI, Redux Toolkit a Vitest.
