'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, signUp } = useAuth()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                const { error } = await signIn(email, password)
                if (error) throw error
                toast({
                    title: "Sucesso!",
                    description: "Login realizado com sucesso.",
                })
            } else {
                const { error } = await signUp(email, password)
                if (error) throw error
                toast({
                    title: "Sucesso!",
                    description: "Conta criada com sucesso. Verifique seu email.",
                })
            }
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Ocorreu um erro. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        {isLogin ? 'Entrar' : 'Criar Conta'}
                    </CardTitle>
                    <CardDescription>
                        {isLogin
                            ? 'Entre na sua conta para acessar o Billz'
                            : 'Crie sua conta para começar a usar o Billz'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="mt-1"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            {isLogin
                                ? 'Não tem uma conta? Criar conta'
                                : 'Já tem uma conta? Entrar'
                            }
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
