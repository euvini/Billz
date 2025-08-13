'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Tag, Calendar, Store, QrCode, Trash2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

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

interface CouponsListProps {
    coupons: Coupon[]
    onUpdate: () => void
}

export function CouponsList({ coupons, onUpdate }: CouponsListProps) {
    const { toast } = useToast()
    const [updating, setUpdating] = useState<string | null>(null)
    const [showQR, setShowQR] = useState<string | null>(null)

    const handleToggleUsed = async (couponId: string, currentStatus: boolean) => {
        setUpdating(couponId)
        try {
            const { error } = await supabase
                .from('coupons')
                .update({ is_used: !currentStatus })
                .eq('id', couponId)

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: currentStatus ? "Cupom marcado como não usado" : "Cupom marcado como usado",
            })

            onUpdate()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao atualizar cupom",
                variant: "destructive",
            })
        } finally {
            setUpdating(null)
        }
    }

    const handleDelete = async (couponId: string) => {
        if (!confirm('Tem certeza que deseja excluir este cupom?')) return

        try {
            const { error } = await supabase
                .from('coupons')
                .delete()
                .eq('id', couponId)

            if (error) throw error

            toast({
                title: "Sucesso!",
                description: "Cupom excluído com sucesso",
            })

            onUpdate()
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao excluir cupom",
                variant: "destructive",
            })
        }
    }

    const generateQRData = (coupon: Coupon) => {
        return JSON.stringify({
            type: 'coupon',
            id: coupon.id,
            name: coupon.name,
            store: coupon.store,
            discount: `${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : 'R$'}`
        })
    }

    const isExpired = (date: string) => {
        return new Date(date) < new Date()
    }

    const activeCoupons = coupons.filter(coupon => !coupon.is_used && !isExpired(coupon.valid_until))
    const usedCoupons = coupons.filter(coupon => coupon.is_used)
    const expiredCoupons = coupons.filter(coupon => !coupon.is_used && isExpired(coupon.valid_until))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Cupons de Desconto
                </CardTitle>
                <CardDescription>
                    Gerencie seus cupons e descontos
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Cupons Ativos */}
                    <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                            Ativos ({activeCoupons.length})
                        </h4>
                        <div className="space-y-2">
                            {activeCoupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{coupon.name}</span>
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Store className="h-3 w-3" />
                                                    {coupon.store}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Válido até: {formatDate(coupon.valid_until)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowQR(showQR === coupon.id ? null : coupon.id)}
                                            >
                                                <QrCode className="h-4 w-4 mr-1" />
                                                QR
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleUsed(coupon.id, coupon.is_used)}
                                                disabled={updating === coupon.id}
                                            >
                                                Usar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    {showQR === coupon.id && (
                                        <div className="mt-3 p-3 bg-white border rounded-lg flex justify-center">
                                            <QRCodeSVG
                                                value={generateQRData(coupon)}
                                                size={128}
                                                level="M"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {activeCoupons.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Nenhum cupom ativo
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Cupons Usados */}
                    {usedCoupons.length > 0 && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                                Usados ({usedCoupons.length})
                            </h4>
                            <div className="space-y-2">
                                {usedCoupons.map((coupon) => (
                                    <div
                                        key={coupon.id}
                                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium line-through text-gray-600">{coupon.name}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Store className="h-3 w-3" />
                                                        {coupon.store}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleUsed(coupon.id, coupon.is_used)}
                                                disabled={updating === coupon.id}
                                            >
                                                Reativar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cupons Expirados */}
                    {expiredCoupons.length > 0 && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                                Expirados ({expiredCoupons.length})
                            </h4>
                            <div className="space-y-2">
                                {expiredCoupons.map((coupon) => (
                                    <div
                                        key={coupon.id}
                                        className="p-3 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-red-600">{coupon.name}</span>
                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                        Expirado
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Store className="h-3 w-3" />
                                                        {coupon.store}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Expirou em: {formatDate(coupon.valid_until)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
