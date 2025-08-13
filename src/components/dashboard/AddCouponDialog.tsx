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

interface AddCouponDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function AddCouponDialog({ open, onOpenChange, onSuccess }: AddCouponDialogProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [discountValue, setDiscountValue] = useState('')
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
    const [validUntil, setValidUntil] = useState('')
    const [store, setStore] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('coupons')
                .insert({
                    user_id: user.id,
                    name,
                    description,
                    discount_value: parseFloat(discountValue),
                    discount_type: discountType,
                    valid_until: validUntil,
                    store,
                    is_used: false,
                })

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: "Cupom adicionado com sucesso",
            })

            // Limpar formulário
            setName('')
            setDescription('')
            setDiscountValue('')
            setDiscountType('percentage')
            setValidUntil('')
            setStore('')

            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao adicionar cupom",
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
                    <DialogTitle>Adicionar Cupom</DialogTitle>
                    <DialogDescription>
                        Adicione um novo cupom de desconto
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome do Cupom</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Desconto 20%"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Desconto em produtos selecionados"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="discountValue">Valor do Desconto</Label>
                            <Input
                                id="discountValue"
                                type="number"
                                step="0.01"
                                min="0"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="discountType">Tipo de Desconto</Label>
                            <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                                    <SelectItem value="fixed">Valor Fixo (EUR)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="store">Loja</Label>
                        <Input
                            id="store"
                            value={store}
                            onChange={(e) => setStore(e.target.value)}
                            placeholder="Ex: Supermercado ABC"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="validUntil">Válido Até</Label>
                        <Input
                            id="validUntil"
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            required
                        />
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
                        <Button type="submit" disabled={loading || !name || !description || !discountValue || !store || !validUntil}>
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
