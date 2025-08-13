import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funções utilitárias para formatação
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  try {
    // Para Euro, usar locale pt-PT, para outras moedas usar pt-BR
    const locale = currency === 'EUR' ? 'pt-PT' : 'pt-BR'

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  } catch (error) {
    // Fallback para formatação simples em caso de erro
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(dateObj)
}

// Função para calcular valor líquido
export function calculateNetValue(
  balances: number[],
  debts: number[]
): number {
  const totalBalance = balances.reduce((sum, balance) => sum + balance, 0)
  const totalDebts = debts.reduce((sum, debt) => sum + debt, 0)
  return totalBalance - totalDebts
}
