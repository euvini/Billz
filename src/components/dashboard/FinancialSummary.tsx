import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface FinancialSummaryProps {
    totalBalance: number
    totalDebts: number
    netValue: number
    currency: string
}

export function FinancialSummary({ totalBalance, totalDebts, netValue, currency }: FinancialSummaryProps) {
    const isPositive = netValue >= 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalBalance, currency)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Saldo disponível em {currency}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Dívidas</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(totalDebts, currency)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Dívidas pendentes em {currency}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Líquido</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(netValue), currency)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {isPositive ? 'Saldo positivo' : 'Saldo negativo'} em {currency}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
