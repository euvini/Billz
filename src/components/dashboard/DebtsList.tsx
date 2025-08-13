'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Calendar, RefreshCw } from 'lucide-react'

interface Debt {
    id: string
    description: string
    amount: number
    due_date: string
    is_recurring: boolean
    recurrence_type?: 'monthly' | 'weekly' | 'yearly'
    is_paid: boolean
}

interface DebtsListProps {
    debts: Debt[]
    onUpdate: () => void
    currency: string
}

export function DebtsList({ debts, onUpdate, currency }: DebtsListProps) {
    const { toast } = useToast()
    const [updating, setUpdating] = useState<string | null>(null)

    const handleTogglePaid = async (debtId: string, currentStatus: boolean) => {
        setUpdating(debtId)
        try {
            const { error } = await supabase
                .from('debts')
                .update({ is_paid: !currentStatus })
                .eq('id', debtId)

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: currentStatus ? "Dívida marcada como não paga" : "Dívida marcada como paga",
            })

            onUpdate()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao atualizar dívida",
                variant: "destructive",
            })
        } finally {
            setUpdating(null)
        }
    }

    const handleDelete = async (debtId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta dívida?')) return

        try {
            const { error } = await supabase
                .from('debts')
                .delete()
                .eq('id', debtId)

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: "Dívida excluída com sucesso",
            })

            onUpdate()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao excluir dívida",
                variant: "destructive",
            })
        }
    }

    const unpaidDebts = debts.filter(debt => !debt.is_paid)
    const paidDebts = debts.filter(debt => debt.is_paid)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Dívidas
                </CardTitle>
                <CardDescription>
                    Gerencie suas dívidas e pagamentos
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Dívidas Pendentes */}
                    <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                            Pendentes ({unpaidDebts.length})
                        </h4>
                        <div className="space-y-2">
                            {unpaidDebts.map((debt) => (
                                <div
                                    key={debt.id}
                                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={debt.is_paid}
                                                onChange={() => handleTogglePaid(debt.id, debt.is_paid)}
                                                disabled={updating === debt.id}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="font-medium">{debt.description}</span>
                                            {debt.is_recurring && (
                                                <RefreshCw className="h-4 w-4 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                            <span className="font-semibold text-red-700">
                                                {formatCurrency(debt.amount, currency)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Vence: {formatDate(debt.due_date)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(debt.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            ))}
                            {unpaidDebts.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Nenhuma dívida pendente
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Dívidas Pagas */}
                    {paidDebts.length > 0 && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                                Pagas ({paidDebts.length})
                            </h4>
                            <div className="space-y-2">
                                {paidDebts.map((debt) => (
                                    <div
                                        key={debt.id}
                                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={debt.is_paid}
                                                    onChange={() => handleTogglePaid(debt.id, debt.is_paid)}
                                                    disabled={updating === debt.id}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="font-medium line-through text-gray-600">
                                                    {debt.description}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                <span className="font-semibold text-green-700">
                                                    {formatCurrency(debt.amount, currency)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Vencia: {formatDate(debt.due_date)}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(debt.id)}
                                            className="text-gray-600 hover:text-gray-700"
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
