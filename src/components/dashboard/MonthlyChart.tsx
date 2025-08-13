'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface Balance {
    id: string
    amount: number
    currency: string
    type: 'salary' | 'balance'
    created_at: string
}

interface Debt {
    id: string
    description: string
    amount: number
    due_date: string
    is_paid: boolean
    created_at: string
}

interface MonthlyChartProps {
    balances: Balance[]
    debts: Debt[]
    currency: string
}

export function MonthlyChart({ balances, debts, currency }: MonthlyChartProps) {
    const chartData = useMemo(() => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        const currentYear = new Date().getFullYear()
        
        return months.map((month, index) => {
            const monthNumber = index + 1
            const monthStart = new Date(currentYear, index, 1)
            const monthEnd = new Date(currentYear, index + 1, 0)
            
            // Filtrar saldos do mês
            const monthBalances = balances.filter(balance => {
                const balanceDate = new Date(balance.created_at)
                return balanceDate >= monthStart && balanceDate <= monthEnd
            })
            
            // Filtrar dívidas do mês
            const monthDebts = debts.filter(debt => {
                const debtDate = new Date(debt.due_date)
                return debtDate >= monthStart && debtDate <= monthEnd && !debt.is_paid
            })
            
            const totalBalance = monthBalances.reduce((sum, balance) => sum + balance.amount, 0)
            const totalDebts = monthDebts.reduce((sum, debt) => sum + debt.amount, 0)
            const netValue = totalBalance - totalDebts
            
            return {
                month,
                saldo: totalBalance,
                dividas: totalDebts,
                liquido: netValue
            }
        })
    }, [balances, debts])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value, currency)}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="saldo" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Saldo"
                />
                <Line 
                    type="monotone" 
                    dataKey="dividas" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Dívidas"
                />
                <Line 
                    type="monotone" 
                    dataKey="liquido" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Valor Líquido"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
