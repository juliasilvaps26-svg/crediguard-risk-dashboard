import jsPDF from "jspdf";

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

export function generatePDF(cnpjData: CNPJData, riskAnalysis: RiskAnalysis) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Cores
  const primaryColor = [30, 58, 138]; // Azul
  const riskColors: Record<string, number[]> = {
    BAIXO: [16, 185, 129], // Verde
    MÉDIO: [245, 158, 11], // Amarelo
    ALTO: [239, 68, 68], // Vermelho
  };

  // Cabeçalho
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("CrediGuard", 20, 25);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Relatório de Análise de Risco - ${new Date().toLocaleDateString("pt-BR")}`, 20, 35);

  yPosition = 50;

  // Seção: Dados da Empresa
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("DADOS DA EMPRESA", 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const empresaInfo = [
    [`CNPJ: ${cnpjData.cnpj}`, `Situação: ${cnpjData.situacao}`],
    [`Razão Social: ${cnpjData.razao_social}`, `Localização: ${cnpjData.municipio}, ${cnpjData.uf}`],
    [`Nome Fantasia: ${cnpjData.nome_fantasia}`, `Data Abertura: ${cnpjData.data_abertura}`],
  ];

  empresaInfo.forEach((row) => {
    doc.text(row[0], 20, yPosition);
    doc.text(row[1], pageWidth / 2, yPosition);
    yPosition += 8;
  });

  yPosition += 5;

  // Seção: Análise de Risco
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("ANÁLISE DE RISCO", 20, yPosition);

  yPosition += 10;

  // Score Visual
  const riskColor = riskColors[riskAnalysis.nivel];
  doc.setFillColor(...riskColor);
  doc.rect(20, yPosition - 5, 50, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text(`${Math.round(riskAnalysis.score)}%`, 45, yPosition + 15);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text("Score de Risco", 20, yPosition + 35);

  // Nível de Risco
  doc.setFillColor(240, 240, 240);
  doc.rect(80, yPosition - 5, 50, 30, "F");

  doc.setTextColor(...riskColor);
  doc.setFontSize(16);
  doc.text(riskAnalysis.nivel, 105, yPosition + 15);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text("Nível", 80, yPosition + 35);

  yPosition += 45;

  // Fatores Analisados
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text("Fatores Analisados:", 20, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  riskAnalysis.fatores.forEach((fator) => {
    doc.text(`• ${fator}`, 25, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // Recomendações
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text("Recomendações:", 20, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const recomendacao =
    riskAnalysis.nivel === "BAIXO"
      ? "✓ Empresa apresenta baixo risco. Recomenda-se prosseguir com operações normais."
      : riskAnalysis.nivel === "MÉDIO"
      ? "⚠ Empresa apresenta risco moderado. Recomenda-se análise adicional antes de operações de alto valor."
      : "✗ Empresa apresenta alto risco. Recomenda-se cautela extrema ou recusa de operações.";

  const splitRecomendacao = doc.splitTextToSize(recomendacao, pageWidth - 40);
  doc.text(splitRecomendacao, 20, yPosition);

  yPosition += splitRecomendacao.length * 6 + 10;

  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Relatório gerado em ${new Date().toLocaleString("pt-BR")} | CrediGuard Risk Dashboard`,
    20,
    pageHeight - 10
  );

  // Download
  const nomeArquivo = `Relatorio_${cnpjData.cnpj.replace(/\D/g, "")}_${new Date().getTime()}.pdf`;
  doc.save(nomeArquivo);
}
