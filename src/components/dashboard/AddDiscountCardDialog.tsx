'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddDiscountCardDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function AddDiscountCardDialog({ open, onOpenChange, onSuccess }: AddDiscountCardDialogProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [store, setStore] = useState('')
    const [cardNumber, setCardNumber] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('discount_cards')
                .insert({
                    user_id: user.id,
                    name,
                    description,
                    store,
                    card_number: cardNumber || null,
                })

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: "Cartão de desconto adicionado com sucesso",
            })

            // Limpar formulário
            setName('')
            setDescription('')
            setStore('')
            setCardNumber('')

            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao adicionar cartão de desconto",
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
                    <DialogTitle>Adicionar Cartão de Desconto</DialogTitle>
                    <DialogDescription>
                        Adicione um novo cartão de desconto para gerar QR codes
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome do Cartão</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Cartão Continente"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Cartão de fidelidade com descontos especiais"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="store">Loja</Label>
                        <Input
                            id="store"
                            value={store}
                            onChange={(e) => setStore(e.target.value)}
                            placeholder="Ex: Supermercado Continente"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="cardNumber">Número do Cartão (Opcional)</Label>
                        <Input
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Ex: 123456789"
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
                        <Button type="submit" disabled={loading || !name || !description || !store}>
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
