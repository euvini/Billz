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

interface AddBalanceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function AddBalanceDialog({ open, onOpenChange, onSuccess }: AddBalanceDialogProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState('')
    const [type, setType] = useState<'salary' | 'balance'>('balance')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('balances')
                .insert({
                    user_id: user.id,
                    amount: parseFloat(amount),
                    currency: 'EUR',
                    type,
                })

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: "Saldo adicionado com sucesso",
            })

            // Limpar formulário
            setAmount('')
            setType('balance')

            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao adicionar saldo",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Adicionar Saldo</DialogTitle>
                        <DialogDescription>
                            Adicione um novo saldo ou salário à sua conta em Euro (EUR)
                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Label htmlFor="amount">Valor (EUR)</Label>
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
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={type} onValueChange={(value: 'salary' | 'balance') => setType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="balance">Saldo</SelectItem>
                                <SelectItem value="salary">Salário</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !amount}>
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
