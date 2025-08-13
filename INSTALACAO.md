# 🚀 Instalação Rápida - Billz

## ⚡ Passos Rápidos

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie projeto em [supabase.com](https://supabase.com)
2. **IMPORTANTE**: Execute o SQL do arquivo `setup-database.sql` no SQL Editor
3. Copie URL e ANON KEY

### 3. Criar .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 4. Executar

```bash
npm run dev
```

## 🔧 Configuração do Banco

**⚠️ ATENÇÃO**: Use o arquivo `setup-database.sql` em vez do SQL abaixo!

O arquivo `setup-database.sql` contém:

- ✅ Tabela `public.users` (que estava faltando)
- ✅ Trigger automático para sincronizar usuários
- ✅ Todas as tabelas de negócio configuradas corretamente
- ✅ RLS (Row Level Security) configurado

## 🚨 Problema Resolvido

Se você estava recebendo o erro:

```
"Key is not present in table \"users\""
```

**A solução está no arquivo `setup-database.sql`!**

## ✅ Pronto!

Acesse `http://localhost:3000` e crie sua conta!

---

**Problemas?**

1. Execute o `setup-database.sql` no Supabase
2. Veja o arquivo `SOLUCAO-ERRO-USERS.md`
3. Ou abra uma issue
