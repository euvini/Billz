'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { QrCode, Store, Trash2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface DiscountCard {
    id: string
    name: string
    description: string
    store: string
}

interface DiscountCardsListProps {
    discountCards: DiscountCard[]
    onUpdate: () => void
}

export function DiscountCardsList({ discountCards, onUpdate }: DiscountCardsListProps) {
    const { toast } = useToast()
    const [showQR, setShowQR] = useState<string | null>(null)

    const handleDelete = async (cardId: string) => {
        if (!confirm('Tem certeza que deseja excluir este cartão de desconto?')) return

        try {
            const { error } = await supabase
                .from('discount_cards')
                .delete()
                .eq('id', cardId)

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: "Cartão de desconto excluído com sucesso",
            })

            onUpdate()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao excluir cartão de desconto",
                variant: "destructive",
            })
        }
    }

    const generateQRData = (card: DiscountCard) => {
        return JSON.stringify({
            type: 'discount_card',
            id: card.id,
            name: card.name,
            store: card.store,
            description: card.description
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Cartões de Desconto
                </CardTitle>
                <CardDescription>
                    Gerencie seus cartões de desconto e gere QR codes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {discountCards.length > 0 ? (
                        discountCards.map((card) => (
                            <div
                                key={card.id}
                                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{card.name}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Store className="h-3 w-3" />
                                                {card.store}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowQR(showQR === card.id ? null : card.id)}
                                        >
                                            <QrCode className="h-4 w-4 mr-1" />
                                            QR
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(card.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* QR Code */}
                                {showQR === card.id && (
                                    <div className="mt-3 p-3 bg-white border rounded-lg flex justify-center">
                                        <QRCodeSVG
                                            value={generateQRData(card)}
                                            size={128}
                                            level="M"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum cartão de desconto cadastrado
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
