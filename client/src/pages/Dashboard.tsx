import { useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Design Philosophy: Minimalismo Corporativo Moderno
// - Hierarquia visual clara com cores de risco
// - Cards com sombras sutis
// - Dados apresentados com máxima clareza

export default function Dashboard() {
  const [userTier] = useState("TIER 1");

  // Dados simulados de métricas
  const metrics = [
    {
      title: "Total de Consultas",
      value: "1.170",
      description: "Consultas realizadas",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Empresas Ativas",
      value: "1.043",
      description: "Status verificado",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Alertas de Risco",
      value: "113",
      description: "Requer atenção",
      icon: AlertCircle,
      color: "bg-yellow-50 text-yellow-600",
      borderColor: "border-yellow-200",
    },
    {
      title: "Risco Alto",
      value: "14",
      description: "Crítico",
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
      borderColor: "border-red-200",
    },
  ];

  // Dados para gráfico de distribuição de risco
  const riskDistribution = [
    { name: "Baixo Risco", value: 650, fill: "#10b981" },
    { name: "Médio Risco", value: 380, fill: "#f59e0b" },
    { name: "Alto Risco", value: 140, fill: "#ef4444" },
  ];

  // Dados para gráfico de features importantes
  const importantFeatures = [
    { name: "Situação Cadastral", value: 95 },
    { name: "Histórico de Pagamento", value: 88 },
    { name: "Atividade Recente", value: 72 },
    { name: "Tempo de Existência", value: 65 },
  ];

  // Dados para gráfico de risco por mês
  const monthlyRisk = [
    { month: "Jan", risco: 45, empresas: 120 },
    { month: "Fev", risco: 52, empresas: 135 },
    { month: "Mar", risco: 48, empresas: 128 },
    { month: "Abr", risco: 61, empresas: 145 },
    { month: "Mai", risco: 55, empresas: 138 },
  ];

  // Dados para cards de risco por modelo
  const riskModels = [
    {
      title: "Risco Baixo",
      value: "97%",
      description: "Empresas com baixo risco",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Risco Médio",
      value: "2.3 dias",
      description: "Tempo médio de análise",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Risco Alto",
      value: "80.7%",
      description: "Taxa de precisão",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const isBlurred = userTier === "TIER 1";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard de Risco</h1>
        <p className="text-slate-600 mt-2">Análise em tempo real de risco de crédito</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className={`${metric.borderColor} border-2 hover:shadow-lg transition-shadow duration-200`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 font-medium">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      {metric.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {metric.description}
                    </p>
                  </div>
                  <div className={`${metric.color} p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição de Risco */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Risco</CardTitle>
            <CardDescription>Análise de empresas consultadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={isBlurred ? "blur-sm" : ""}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {isBlurred && (
              <div className="text-center mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">
                  Upgrade para ver dados completos
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Importantes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Features Importantes</CardTitle>
            <CardDescription>Fatores que impactam a análise de risco</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={isBlurred ? "blur-sm" : ""}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={importantFeatures}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risco por Modelo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {riskModels.map((model, index) => (
          <Card key={index} className="border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 font-medium">{model.title}</p>
              <p className={`text-3xl font-bold mt-2 ${model.color}`}>
                {model.value}
              </p>
              <p className="text-xs text-slate-500 mt-2">{model.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risco por Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análise de Risco por Mês</CardTitle>
          <CardDescription>Tendência de risco ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={isBlurred ? "blur-sm" : ""}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRisk}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="risco"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="empresas"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tier Info Banner */}
      {isBlurred && (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">
                  Você está no plano TIER 1 (Gratuito)
                </h3>
                <p className="text-sm text-blue-800 mt-1">
                  Alguns dados estão ocultos. Upgrade para TIER 2 ou superior para
                  acessar análises completas, consultas ilimitadas e relatórios
                  avançados.
                </p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
