'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { calculateNetValue } from '@/lib/utils'
import { FinancialSummary } from '@/components/dashboard/FinancialSummary'
import { MonthlyChart } from '@/components/dashboard/MonthlyChart'
import { DebtsList } from '@/components/dashboard/DebtsList'
import { CouponsList } from '@/components/dashboard/CouponsList'
import { DiscountCardsList } from '@/components/dashboard/DiscountCardsList'
import { AddBalanceDialog } from '@/components/dashboard/AddBalanceDialog'
import { AddDebtDialog } from '@/components/dashboard/AddDebtDialog'
import { AddCouponDialog } from '@/components/dashboard/AddCouponDialog'
import { AddDiscountCardDialog } from '@/components/dashboard/AddDiscountCardDialog'
import { LogOut, Plus, Wallet, CreditCard, Tag, QrCode } from 'lucide-react'

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
    is_recurring: boolean
    recurrence_type?: 'weekly' | 'monthly' | 'yearly'
    is_paid: boolean
    created_at: string
}

interface Coupon {
    id: string
    name: string
    description: string
    discount_value: number
    discount_type: 'percentage' | 'fixed'
    valid_until: string
    store: string
    is_used: boolean
}

interface DiscountCard {
    id: string
    name: string
    description: string
    store: string
}

export function Dashboard() {
    const { user, signOut } = useAuth()
    const [balances, setBalances] = useState<Balance[]>([])
    const [debts, setDebts] = useState<Debt[]>([])
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [discountCards, setDiscountCards] = useState<DiscountCard[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddBalance, setShowAddBalance] = useState(false)
    const [showAddDebt, setShowAddDebt] = useState(false)
    const [showAddCoupon, setShowAddCoupon] = useState(false)
    const [showAddDiscountCard, setShowAddDiscountCard] = useState(false)

    const defaultCurrency = 'EUR'

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)

            // Buscar saldos
            const { data: balancesData } = await supabase
                .from('balances')
                .select('*')
                .eq('user_id', user?.id)

            if (balancesData) setBalances(balancesData)

            // Buscar dívidas
            const { data: debtsData } = await supabase
                .from('debts')
                .select('*')
                .eq('user_id', user?.id)
                .order('due_date', { ascending: true })

            if (debtsData) setDebts(debtsData)

            // Buscar cupons
            const { data: couponsData } = await supabase
                .from('coupons')
                .select('*')
                .eq('user_id', user?.id)
                .order('valid_until', { ascending: true })

            if (couponsData) setCoupons(couponsData)

            // Buscar cartões de desconto
            const { data: discountCardsData } = await supabase
                .from('discount_cards')
                .select('*')
                .eq('user_id', user?.id)

            if (discountCardsData) setDiscountCards(discountCardsData)

        } catch (error) {
            console.error('Erro ao buscar dados:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user, fetchData])

    const handleSignOut = useCallback(async () => {
        await signOut()
    }, [signOut])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-lg">Carregando...</p>
                </div>
            </div>
        )
    }

    const totalBalance = balances.reduce((sum, balance) => sum + balance.amount, 0)
    const totalDebts = debts.filter(debt => !debt.is_paid).reduce((sum, debt) => sum + debt.amount, 0)
    const netValue = calculateNetValue(
        balances.map(b => b.amount),
        debts.filter(d => !d.is_paid).map(d => d.amount)
    )

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900">Billz</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <Button variant="outline" onClick={handleSignOut}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Resumo Financeiro */}
                <FinancialSummary
                    totalBalance={totalBalance}
                    totalDebts={totalDebts}
                    netValue={netValue}
                    currency={defaultCurrency}
                />

                {/* Gráfico Mensal */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Evolução Mensal</CardTitle>
                            <CardDescription>
                                Acompanhe sua evolução financeira ao longo dos meses em {defaultCurrency}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MonthlyChart balances={balances} debts={debts} currency={defaultCurrency} />
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                        onClick={() => setShowAddBalance(true)}
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                    >
                        <Wallet className="h-8 w-8" />
                        <span>Adicionar Saldo</span>
                    </Button>

                    <Button
                        onClick={() => setShowAddDebt(true)}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                    >
                        <CreditCard className="h-8 w-8" />
                        <span>Adicionar Dívida</span>
                    </Button>

                    <Button
                        onClick={() => setShowAddCoupon(true)}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                    >
                        <Tag className="h-8 w-8" />
                        <span>Adicionar Cupom</span>
                    </Button>

                    <Button
                        onClick={() => setShowAddDiscountCard(true)}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                    >
                        <QrCode className="h-8 w-8" />
                        <span>Cartão Desconto</span>
                    </Button>
                </div>

                {/* Listas */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <DebtsList debts={debts} onUpdate={fetchData} currency={defaultCurrency} />
                    <div className="space-y-6">
                        <CouponsList coupons={coupons} onUpdate={fetchData} />
                        <DiscountCardsList discountCards={discountCards} onUpdate={fetchData} />
                    </div>
                </div>
            </div>

            {/* Diálogos */}
            <AddBalanceDialog
                open={showAddBalance}
                onOpenChange={setShowAddBalance}
                onSuccess={fetchData}
            />
            <AddDebtDialog
                open={showAddDebt}
                onOpenChange={setShowAddDebt}
                onSuccess={fetchData}
            />
            <AddCouponDialog
                open={showAddCoupon}
                onOpenChange={setShowAddCoupon}
                onSuccess={fetchData}
            />
            <AddDiscountCardDialog
                open={showAddDiscountCard}
                onOpenChange={setShowAddDiscountCard}
                onSuccess={fetchData}
            />
        </div>
    )
}
