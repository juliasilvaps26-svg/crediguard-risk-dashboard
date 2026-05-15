import { useState } from "react";
import { User, Mail, Building, Calendar, Zap, Check, Lock, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Design Philosophy: Minimalismo Corporativo Moderno
// - Informações organizadas em abas
// - Sistema de Tiers com comparação clara
// - Dados do usuário com destaque

interface TierFeature {
  nome: string;
  tier1: boolean;
  tier2: boolean;
  tier3: boolean;
  tier4: boolean;
}

export default function Perfil() {
  const [userTier, setUserTier] = useState("TIER 1");
  const [consultasUsadas] = useState(15);

  // Dados do usuário
  const user = {
    name: "João Silva",
    email: "joao@empresa.com.br",
    empresa: "Silva Consultoria LTDA",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 98765-4321",
    localizacao: "São Paulo, SP",
    dataCadastro: "15 de Janeiro de 2024",
    avatar: "JS",
  };

  // Features dos Tiers
  const tierFeatures: TierFeature[] = [
    {
      nome: "Usuários por Instituição",
      tier1: true,
      tier2: true,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Consultas por Mês",
      tier1: true,
      tier2: true,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Relatórios Básicos (PDF)",
      tier1: true,
      tier2: true,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Relatórios Avançados + Alertas",
      tier1: false,
      tier2: true,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Admin de Usuários",
      tier1: false,
      tier2: true,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Histórico de Dados",
      tier1: false,
      tier2: true,
      tier3: true,
      tier4: true,
    },
    {
      nome: "API Completa",
      tier1: false,
      tier2: false,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Machine Learning Avançado",
      tier1: false,
      tier2: false,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Webhooks e Alertas em Tempo Real",
      tier1: false,
      tier2: false,
      tier3: true,
      tier4: true,
    },
    {
      nome: "Suporte 24/7 + Gestor Dedicado",
      tier1: false,
      tier2: false,
      tier3: true,
      tier4: true,
    },
  ];

  // Dados dos Tiers
  const tiers = [
    {
      id: "TIER 1",
      nome: "Gratuito",
      preco: "R$ 0",
      descricao: "Demonstração",
      usuarios: "1",
      consultas: "50",
      suporte: "Email",
      cor: "bg-slate-50",
      borderColor: "border-slate-200",
      badgeColor: "bg-slate-200 text-slate-800",
    },
    {
      id: "TIER 2",
      nome: "Profissional",
      preco: "R$ 2.000",
      descricao: "Asset Managers, Gestores",
      usuarios: "Até 10",
      consultas: "Ilimitadas",
      suporte: "Email",
      cor: "bg-blue-50",
      borderColor: "border-blue-200",
      badgeColor: "bg-blue-200 text-blue-800",
    },
    {
      id: "TIER 3",
      nome: "Enterprise",
      preco: "R$ 10.000+",
      descricao: "Rating Agencies, Estruturadoras",
      usuarios: "Ilimitados",
      consultas: "Ilimitadas",
      suporte: "24/7 + Dedicado",
      cor: "bg-purple-50",
      borderColor: "border-purple-200",
      badgeColor: "bg-purple-200 text-purple-800",
    },
    {
      id: "TIER 4",
      nome: "Institucional",
      preco: "Negociável",
      descricao: "BACEN/CVM",
      usuarios: "Ilimitados",
      consultas: "Ilimitadas",
      suporte: "Direto",
      cor: "bg-amber-50",
      borderColor: "border-amber-200",
      badgeColor: "bg-amber-200 text-amber-800",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>
        <p className="text-slate-600 mt-2">Gerenciar informações da conta e plano</p>
      </div>

      {/* Perfil do Usuário */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <Avatar className="h-24 w-24 flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                {user.avatar}
              </AvatarFallback>
            </Avatar>

            {/* Informações */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <Badge className={`bg-blue-600 text-white`}>{userTier}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail size={16} className="text-slate-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={16} className="text-slate-400" />
                  <span>{user.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Building size={16} className="text-slate-400" />
                  <span>{user.empresa}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{user.localizacao}</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                <Calendar size={14} className="inline mr-2" />
                Membro desde {user.dataCadastro}
              </div>
            </div>

            {/* Botão de Editar */}
            <Button variant="outline" className="flex-shrink-0">
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Abas de Conteúdo */}
      <Tabs defaultValue="uso" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="uso">Uso Atual</TabsTrigger>
          <TabsTrigger value="tiers">Comparar Planos</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* Aba: Uso Atual */}
        <TabsContent value="uso" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uso do Plano Atual</CardTitle>
              <CardDescription>Seu plano {userTier}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Consultas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">Consultas CNPJ</p>
                  <p className="text-sm text-slate-600">
                    {consultasUsadas} de 50 utilizadas
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(consultasUsadas / 50) * 100}%` }}
                  />
                </div>
              </div>

              {/* Usuários */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">Usuários</p>
                  <p className="text-sm text-slate-600">1 de 1 utilizado</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Relatórios */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">Relatórios Gerados</p>
                  <p className="text-sm text-slate-600">8 relatórios</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: "40%" }}
                  />
                </div>
              </div>

              {/* Botão de Upgrade */}
              <div className="pt-4 border-t border-slate-200">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Zap className="mr-2 h-4 w-4" />
                  Fazer Upgrade para TIER 2
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Comparar Planos */}
        <TabsContent value="tiers" className="space-y-4">
          {/* Cards de Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={`${tier.borderColor} border-2 relative ${
                  userTier === tier.id ? "ring-2 ring-blue-600" : ""
                }`}
              >
                {userTier === tier.id && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold">
                    Seu Plano
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-lg">{tier.nome}</CardTitle>
                  <CardDescription>{tier.descricao}</CardDescription>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{tier.preco}</p>
                  <p className="text-xs text-slate-600">/mês</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-900">
                      👥 {tier.usuarios} usuários
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      🔍 {tier.consultas} consultas
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      💬 Suporte: {tier.suporte}
                    </p>
                  </div>

                  {userTier !== tier.id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={userTier === tier.id}
                    >
                      {tier.id === "TIER 4" ? "Contatar Vendas" : "Fazer Upgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabela de Comparação */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação Detalhada de Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Feature
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">
                        TIER 1
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">
                        TIER 2
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">
                        TIER 3
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">
                        TIER 4
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tierFeatures.map((feature, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-900 font-medium">
                          {feature.nome}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.tier1 ? (
                            <Check className="inline text-green-600" size={18} />
                          ) : (
                            <Lock className="inline text-slate-400" size={18} />
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.tier2 ? (
                            <Check className="inline text-green-600" size={18} />
                          ) : (
                            <Lock className="inline text-slate-400" size={18} />
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.tier3 ? (
                            <Check className="inline text-green-600" size={18} />
                          ) : (
                            <Lock className="inline text-slate-400" size={18} />
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.tier4 ? (
                            <Check className="inline text-green-600" size={18} />
                          ) : (
                            <Lock className="inline text-slate-400" size={18} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Segurança */}
        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Senha</p>
                  <p className="text-sm text-slate-600">Última alteração há 3 meses</p>
                </div>
                <Button variant="outline">Alterar</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Autenticação de Dois Fatores</p>
                  <p className="text-sm text-slate-600">Não ativada</p>
                </div>
                <Button variant="outline">Ativar</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Sessões Ativas</p>
                  <p className="text-sm text-slate-600">1 sessão ativa</p>
                </div>
                <Button variant="outline">Gerenciar</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Chaves de API</p>
                  <p className="text-sm text-slate-600">Nenhuma chave gerada</p>
                </div>
                <Button variant="outline">Gerar Chave</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
