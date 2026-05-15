import { useState } from "react";
import { Search, Loader2, AlertCircle, CheckCircle, Clock, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Design Philosophy: Minimalismo Corporativo Moderno
// - Busca clara e intuitiva
// - Resultados com análise de risco
// - Integração com API OpenCNPJ

interface CNPJData {
  cnpj: string;
  nome_fantasia: string;
  razao_social: string;
  situacao: string;
  data_abertura: string;
  natureza_juridica: string;
  cnae_principal: string;
  uf: string;
  municipio: string;
}

interface RiskAnalysis {
  score: number;
  nivel: "BAIXO" | "MÉDIO" | "ALTO";
  cor: string;
  icone: React.ReactNode;
  fatores: string[];
}

export default function ConsultaCNPJ() {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<CNPJData | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [consultasUsadas, setConsultasUsadas] = useState(15);
  const [userTier] = useState("TIER 1");

  // Formatar CNPJ para exibição
  const formatarCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  // Remover máscara do CNPJ
  const removerMascara = (cnpj: string) => {
    return cnpj.replace(/\D/g, "");
  };

  // Analisar risco com base nos dados
  const analisarRisco = (data: CNPJData): RiskAnalysis => {
    let score = 100;
    const fatores: string[] = [];

    // Verificar situação cadastral
    if (data.situacao !== "Ativa") {
      score -= 40;
      fatores.push("Empresa inativa ou suspensa");
    } else {
      fatores.push("✓ Situação cadastral ativa");
    }

    // Verificar tempo de existência
    const dataAbertura = new Date(data.data_abertura);
    const agora = new Date();
    const anos = (agora.getTime() - dataAbertura.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (anos < 1) {
      score -= 30;
      fatores.push("Empresa muito nova (< 1 ano)");
    } else if (anos < 3) {
      score -= 15;
      fatores.push("Empresa relativamente nova (1-3 anos)");
    } else {
      fatores.push(`✓ Empresa estabelecida há ${Math.floor(anos)} anos`);
    }

    // Verificar UF (simplificado)
    if (["SP", "RJ", "MG", "SC", "RS"].includes(data.uf)) {
      fatores.push("✓ Localizada em estado com economia forte");
    } else {
      score -= 5;
    }

    // Determinar nível de risco
    let nivel: "BAIXO" | "MÉDIO" | "ALTO";
    let cor: string;

    if (score >= 80) {
      nivel = "BAIXO";
      cor = "text-green-600";
    } else if (score >= 50) {
      nivel = "MÉDIO";
      cor = "text-yellow-600";
    } else {
      nivel = "ALTO";
      cor = "text-red-600";
    }

    const icone =
      nivel === "BAIXO" ? (
        <CheckCircle className="text-green-600" size={32} />
      ) : nivel === "MÉDIO" ? (
        <AlertCircle className="text-yellow-600" size={32} />
      ) : (
        <AlertCircle className="text-red-600" size={32} />
      );

    return {
      score: Math.max(0, score),
      nivel,
      cor,
      icone,
      fatores,
    };
  };

  // Buscar CNPJ na API
  const buscarCNPJ = async () => {
    const cnpjLimpo = removerMascara(cnpj);

    if (cnpjLimpo.length !== 14) {
      toast.error("CNPJ deve conter 14 dígitos");
      return;
    }

    // Verificar limite de consultas (TIER 1)
    if (userTier === "TIER 1" && consultasUsadas >= 50) {
      toast.error("Limite de 50 consultas/mês atingido. Faça upgrade para continuar.");
      return;
    }

    setLoading(true);
    try {
      // Chamar API OpenCNPJ
      const response = await fetch(
        `https://api.opencnpj.org/${cnpjLimpo}?dataset=receita`
      );

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("CNPJ não encontrado na base de dados");
          setResultado(null);
          setRiskAnalysis(null);
        } else {
          throw new Error("Erro ao consultar API");
        }
        return;
      }

      const data = await response.json();

      // Mapear dados da API para nosso formato
      const cnpjData: CNPJData = {
        cnpj: data.cnpj || cnpjLimpo,
        nome_fantasia: data.nome_fantasia || data.nome || "N/A",
        razao_social: data.razao_social || data.nome || "N/A",
        situacao: data.situacao || "Desconhecida",
        data_abertura: data.data_abertura || data.data_constituicao || "N/A",
        natureza_juridica: data.natureza_juridica || "N/A",
        cnae_principal: data.cnae_principal || "N/A",
        uf: data.uf || "N/A",
        municipio: data.municipio || "N/A",
      };

      setResultado(cnpjData);
      const risk = analisarRisco(cnpjData);
      setRiskAnalysis(risk);

      // Incrementar consultas usadas
      setConsultasUsadas((prev) => prev + 1);
      toast.success("CNPJ consultado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao consultar CNPJ. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      buscarCNPJ();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Consulta de CNPJ</h1>
        <p className="text-slate-600 mt-2">
          Consulte dados de qualquer empresa brasileira e analise seu risco de crédito
        </p>
      </div>

      {/* Barra de Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Digite o CNPJ (ex: 12.345.678/0001-90)"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button
              onClick={buscarCNPJ}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Consultar
                </>
              )}
            </Button>
          </div>

          {/* Info de Consultas */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-slate-600">
              Consultas utilizadas: <span className="font-semibold">{consultasUsadas}/50</span>
            </p>
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(consultasUsadas / 50) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado da Consulta */}
      {resultado && riskAnalysis && (
        <div className="space-y-6">
          {/* Análise de Risco */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Análise de Risco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Visual */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke={
                          riskAnalysis.nivel === "BAIXO"
                            ? "#10b981"
                            : riskAnalysis.nivel === "MÉDIO"
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        strokeWidth="8"
                        strokeDasharray={`${(riskAnalysis.score / 100) * 377} 377`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-3xl font-bold text-slate-900">
                        {Math.round(riskAnalysis.score)}%
                      </p>
                      <p className="text-xs text-slate-600">Score</p>
                    </div>
                  </div>
                </div>

                {/* Nível de Risco */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg">
                  <div className="mb-4">{riskAnalysis.icone}</div>
                  <p className={`text-2xl font-bold ${riskAnalysis.cor}`}>
                    {riskAnalysis.nivel}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">Nível de Risco</p>
                </div>

                {/* Fatores */}
                <div className="p-6 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-900 mb-3">Fatores Analisados:</p>
                  <ul className="space-y-2">
                    {riskAnalysis.fatores.map((fator, idx) => (
                      <li key={idx} className="text-sm text-slate-700">
                        {fator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados da Empresa</CardTitle>
              <CardDescription>Informações cadastrais da Receita Federal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 font-medium">CNPJ</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {formatarCNPJ(resultado.cnpj)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Razão Social</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {resultado.razao_social}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Nome Fantasia</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {resultado.nome_fantasia}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Situação Cadastral</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {resultado.situacao}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Data de Abertura</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {new Date(resultado.data_abertura).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Localização</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {resultado.municipio}, {resultado.uf}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 font-medium">Natureza Jurídica</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {resultado.natureza_juridica}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="text-blue-600" size={20} />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                {riskAnalysis.nivel === "BAIXO"
                  ? "✓ Empresa apresenta baixo risco. Recomenda-se prosseguir com operações normais."
                  : riskAnalysis.nivel === "MÉDIO"
                  ? "⚠ Empresa apresenta risco moderado. Recomenda-se análise adicional antes de operações de alto valor."
                  : "✗ Empresa apresenta alto risco. Recomenda-se cautela extrema ou recusa de operações."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estado Vazio */}
      {!resultado && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600">
              Digite um CNPJ acima para consultar dados e análise de risco
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
