import { useState } from "react";
import { useHistory } from "@/contexts/HistoryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function Relatorios() {
  const { historico, limparHistorico } = useHistory();
  const [filtro, setFiltro] = useState("");

  const historicoFiltrado = historico.filter(
    (item) =>
      item.cnpj.toLowerCase().includes(filtro.toLowerCase()) ||
      item.razaoSocial.toLowerCase().includes(filtro.toLowerCase())
  );

  const gerarPDFIndividual = (item: any) => {
    const doc = new (window as any).jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const primaryColor = [30, 58, 138];
    const riskColors: Record<string, number[]> = {
      BAIXO: [16, 185, 129],
      MÉDIO: [245, 158, 11],
      ALTO: [239, 68, 68],
    };

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("CrediGuard", 20, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Relatório de Análise de Risco - ${item.dataConsulta}`, 20, 35);

    yPosition = 50;

    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text("DADOS DA EMPRESA", 20, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text(`CNPJ: ${item.cnpj}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Razão Social: ${item.razaoSocial}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Localização: ${item.municipio}, ${item.uf}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Data da Consulta: ${item.dataConsulta}`, 20, yPosition);

    yPosition += 15;

    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text("ANÁLISE DE RISCO", 20, yPosition);

    yPosition += 10;

    const riskColor = riskColors[item.riskLevel];
    doc.setFillColor(...riskColor);
    doc.rect(20, yPosition - 5, 50, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text(`${Math.round(item.riskScore)}%`, 45, yPosition + 15);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("Score de Risco", 20, yPosition + 35);

    doc.setFillColor(240, 240, 240);
    doc.rect(80, yPosition - 5, 50, 30, "F");

    doc.setTextColor(...riskColor);
    doc.setFontSize(16);
    doc.text(item.riskLevel, 105, yPosition + 15);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("Nível", 80, yPosition + 35);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Relatório gerado em ${new Date().toLocaleString("pt-BR")} | CrediGuard Risk Dashboard`,
      20,
      pageHeight - 10
    );

    const nomeArquivo = `Relatorio_${item.cnpj.replace(/\D/g, "")}_${new Date().getTime()}.pdf`;
    doc.save(nomeArquivo);
    toast.success("PDF baixado com sucesso!");
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "BAIXO":
        return "text-green-600 bg-green-50";
      case "MÉDIO":
        return "text-amber-600 bg-amber-50";
      case "ALTO":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatórios</h1>
          <p className="text-slate-600">Histórico completo de consultas de CNPJ e análises de risco</p>
        </div>

        {/* Filtro e Ações */}
        <Card className="mb-6 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Filtrar Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Buscar por CNPJ ou Razão Social
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    placeholder="Digite CNPJ ou nome da empresa..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (historico.length === 0) {
                    toast.error("Nenhum histórico para limpar");
                    return;
                  }
                  if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
                    limparHistorico();
                    toast.success("Histórico limpo com sucesso!");
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {historico.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{historico.length}</p>
                  <p className="text-sm text-slate-600 mt-1">Total de Consultas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {historico.filter((h) => h.riskLevel === "BAIXO").length}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Risco Baixo</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">
                    {historico.filter((h) => h.riskLevel === "MÉDIO").length}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Risco Médio</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {historico.filter((h) => h.riskLevel === "ALTO").length}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Risco Alto</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Relatórios */}
        {historicoFiltrado.length > 0 ? (
          <div className="space-y-4">
            {historicoFiltrado.map((item) => (
              <Card key={item.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{item.razaoSocial}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
                            item.riskLevel
                          )}`}
                        >
                          {item.riskLevel}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mt-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">CNPJ</p>
                          <p className="font-mono">{item.cnpj}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Score de Risco</p>
                          <p className="font-semibold text-slate-900">{Math.round(item.riskScore)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Localização</p>
                          <p>{item.municipio}, {item.uf}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Data da Consulta</p>
                          <p>{item.dataConsulta}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => gerarPDFIndividual(item)}
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-slate-400 mb-4">
                <Search size={48} className="mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {filtro ? "Nenhum resultado encontrado" : "Nenhum histórico disponível"}
              </h3>
              <p className="text-slate-600">
                {filtro
                  ? "Tente buscar por outro CNPJ ou razão social"
                  : "Comece a consultar CNPJs para gerar relatórios"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
