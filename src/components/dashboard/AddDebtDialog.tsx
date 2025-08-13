'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddDebtDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function AddDebtDialog({ open, onOpenChange, onSuccess }: AddDebtDialogProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [isRecurring, setIsRecurring] = useState(false)
    const [recurrenceType, setRecurrenceType] = useState<'monthly' | 'weekly' | 'yearly'>('monthly')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('debts')
                .insert({
                    user_id: user.id,
                    description,
                    amount: parseFloat(amount),
                    due_date: dueDate,
                    is_recurring: isRecurring,
                    recurrence_type: isRecurring ? recurrenceType : null,
                    is_paid: false,
                })

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: "Dívida adicionada com sucesso",
            })

            // Limpar formulário
            setDescription('')
            setAmount('')
            setDueDate('')
            setIsRecurring(false)
            setRecurrenceType('monthly')

            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao adicionar dívida",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Dívida</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova dívida ou compromisso financeiro
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Conta de luz"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="amount">Valor</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0,00"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="dueDate">Data de Vencimento</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="isRecurring"
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="isRecurring">Dívida recorrente</Label>
                    </div>

                    {isRecurring && (
                        <div>
                            <Label htmlFor="recurrenceType">Tipo de Recorrência</Label>
                            <Select value={recurrenceType} onValueChange={(value: 'monthly' | 'weekly' | 'yearly') => setRecurrenceType(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensal</SelectItem>
                                    <SelectItem value="yearly">Anual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !description || !amount || !dueDate}>
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
