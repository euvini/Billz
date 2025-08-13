# 🔧 Solução para o Erro de Tabela Users

## ❌ Problema Identificado

O erro `"Key is not present in table \"users\""` ocorre porque:

1. **Tabela `public.users` não existe** no banco de dados
2. **Falta sincronização** entre `auth.users` (Supabase Auth) e `public.users` (tabela de negócio)
3. **Referências quebradas** nas tabelas `balances`, `debts`, `coupons` e `discount_cards`

## ✅ Solução

### 1. Execute o SQL Corrigido

Copie e execute o arquivo `setup-database.sql` no **SQL Editor** do Supabase:

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá para **SQL Editor**
3. Cole o conteúdo do arquivo `setup-database.sql`
4. Clique em **Run**

### 2. O que o SQL Corrigido Faz

- ✅ **Cria a tabela `public.users`** que estava faltando
- ✅ **Configura as referências corretas** entre `auth.users` e `public.users`
- ✅ **Cria um trigger automático** que sincroniza novos usuários
- ✅ **Sincroniza usuários existentes** automaticamente
- ✅ **Configura RLS** (Row Level Security) corretamente

### 3. Estrutura Corrigida

```
auth.users (Supabase Auth)
    ↓
public.users (Tabela de negócio)
    ↓
public.balances, public.debts, public.coupons, public.discount_cards
```

## 🚀 Após Executar o SQL

1. **Faça logout** da aplicação
2. **Faça login novamente** (ou crie uma nova conta)
3. **Teste adicionar** saldo, dívida, cupom ou cartão

## 🔍 Verificação

Para confirmar que funcionou, no SQL Editor execute:

```sql
-- Verificar se a tabela users foi criada
SELECT * FROM public.users;

-- Verificar se há usuários sincronizados
SELECT COUNT(*) FROM public.users;
```

## 📝 Arquivos Modificados

- ✅ `src/lib/supabase.ts` - Tipos corrigidos
- ✅ `setup-database.sql` - SQL de setup corrigido
- ✅ `SOLUCAO-ERRO-USERS.md` - Este arquivo de instruções

## 🆘 Se o Problema Persistir

1. **Verifique se o SQL foi executado** sem erros
2. **Confirme que as variáveis de ambiente** estão configuradas
3. **Verifique o console do navegador** para erros adicionais
4. **Teste com uma nova conta** para isolar o problema

---

**O problema deve ser resolvido após executar o SQL corrigido!** 🎉
