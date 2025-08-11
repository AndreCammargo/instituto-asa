import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Save, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const RegisterPatient = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Dados pessoais
    acolhido: "",
    rg: "",
    cpf: "",
    dataNascimento: "",
    idade: "",
    cor: "",
    naturalidade: "",
    nacionalidade: "",
    mae: "",
    pai: "",
    endereco: "",
    
    // Estado civil e profissão
    estadoCivil: "",
    prole: "",
    quantidadeFilhos: "",
    profissao: "",
    rendaPessoal: "",
    escolaridade: "",
    religiao: "",
    
    // Dependência química
    dependenciaQuimica: {
      alcool: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      cocaina: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      crack: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      maconha: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      anfetaminas: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      alucinogenos: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      inalantes: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      opioidesHeroina: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
      benzodiazepinicos: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" }
    },
    
    substanciaPreferencia: "",
    historiaFamiliar: "",
    comorbidades: "",
    motivacaoTratamento: "",
    observacoes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDependencyChange = (substance: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      dependenciaQuimica: {
        ...prev.dependenciaQuimica,
        [substance]: {
          ...prev.dependenciaQuimica[substance as keyof typeof prev.dependenciaQuimica],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    if (!formData.acolhido || !formData.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e CPF são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Acolhido cadastrado!",
      description: `${formData.acolhido} foi cadastrado com sucesso.`,
    });
  };

  const handleReset = () => {
    setFormData({
      acolhido: "",
      rg: "",
      cpf: "",
      dataNascimento: "",
      idade: "",
      cor: "",
      naturalidade: "",
      nacionalidade: "",
      mae: "",
      pai: "",
      endereco: "",
      estadoCivil: "",
      prole: "",
      quantidadeFilhos: "",
      profissao: "",
      rendaPessoal: "",
      escolaridade: "",
      religiao: "",
      dependenciaQuimica: {
        alcool: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        cocaina: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        crack: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        maconha: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        anfetaminas: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        alucinogenos: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        inalantes: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        opioidesHeroina: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" },
        benzodiazepinicos: { uso: false, idadeInicio: "", tempoUso: "", tempoAbstinencia: "" }
      },
      substanciaPreferencia: "",
      historiaFamiliar: "",
      comorbidades: "",
      motivacaoTratamento: "",
      observacoes: ""
    });
  };

  const substanceLabels = {
    alcool: "Álcool",
    cocaina: "Cocaína",
    crack: "Crack",
    maconha: "Maconha",
    anfetaminas: "Anfetaminas",
    alucinogenos: "Alucinógenos",
    inalantes: "Inalantes",
    opioidesHeroina: "Opioides/Heroína",
    benzodiazepinicos: "Benzodiazepínicos"
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold text-medical-blue">Cadastro de Acolhido</h1>
              <p className="text-muted-foreground">Ficha de dados sociodemográficos/antecedentes pessoais e familiares</p>
            </div>
          </div>
        </div>

        {/* Dados Pessoais */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas do acolhido</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acolhido">Acolhido *</Label>
              <Input
                id="acolhido"
                value={formData.acolhido}
                onChange={(e) => handleInputChange("acolhido", e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleInputChange("rg", e.target.value)}
                placeholder="Número do RG"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                value={formData.idade}
                onChange={(e) => handleInputChange("idade", e.target.value)}
                placeholder="Anos"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <Select value={formData.cor} onValueChange={(value) => handleInputChange("cor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branca">Branca</SelectItem>
                  <SelectItem value="preta">Preta</SelectItem>
                  <SelectItem value="parda">Parda</SelectItem>
                  <SelectItem value="amarela">Amarela</SelectItem>
                  <SelectItem value="indigena">Indígena</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="naturalidade">Naturalidade</Label>
              <Input
                id="naturalidade"
                value={formData.naturalidade}
                onChange={(e) => handleInputChange("naturalidade", e.target.value)}
                placeholder="Cidade de nascimento"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nacionalidade">Nacionalidade</Label>
              <Input
                id="nacionalidade"
                value={formData.nacionalidade}
                onChange={(e) => handleInputChange("nacionalidade", e.target.value)}
                placeholder="País de origem"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mae">Mãe</Label>
              <Input
                id="mae"
                value={formData.mae}
                onChange={(e) => handleInputChange("mae", e.target.value)}
                placeholder="Nome da mãe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pai">Pai</Label>
              <Input
                id="pai"
                value={formData.pai}
                onChange={(e) => handleInputChange("pai", e.target.value)}
                placeholder="Nome do pai"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
          </CardContent>
        </Card>

        {/* Estado Civil e Profissão */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Informações Socioeconômicas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro</SelectItem>
                  <SelectItem value="casado">Casado</SelectItem>
                  <SelectItem value="divorciado">Divorciado</SelectItem>
                  <SelectItem value="viuvo">Viúvo</SelectItem>
                  <SelectItem value="uniao-consensual">União consensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prole">Possui filhos?</Label>
              <Select value={formData.prole} onValueChange={(value) => handleInputChange("prole", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.prole === "sim" && (
              <div className="space-y-2">
                <Label htmlFor="quantidadeFilhos">Quantos filhos?</Label>
                <Input
                  id="quantidadeFilhos"
                  type="number"
                  min="1"
                  value={formData.quantidadeFilhos}
                  onChange={(e) => handleInputChange("quantidadeFilhos", e.target.value)}
                  placeholder="Número de filhos"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="escolaridade">Escolaridade</Label>
              <Select value={formData.escolaridade} onValueChange={(value) => handleInputChange("escolaridade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundamental-completo">Fundamental completo</SelectItem>
                  <SelectItem value="fundamental-incompleto">Fundamental incompleto</SelectItem>
                  <SelectItem value="medio-completo">Médio completo</SelectItem>
                  <SelectItem value="medio-incompleto">Médio incompleto</SelectItem>
                  <SelectItem value="superior-completo">Superior completo</SelectItem>
                  <SelectItem value="superior-incompleto">Superior incompleto</SelectItem>
                  <SelectItem value="tecnico-completo">Curso técnico completo</SelectItem>
                  <SelectItem value="tecnico-incompleto">Curso técnico incompleto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="religiao">Religião</Label>
              <Select value={formData.religiao} onValueChange={(value) => handleInputChange("religiao", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="catolico">Católico</SelectItem>
                  <SelectItem value="evangelico">Evangélico</SelectItem>
                  <SelectItem value="espirita">Espírita</SelectItem>
                  <SelectItem value="ateu">Ateu</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Select value={formData.profissao} onValueChange={(value) => handleInputChange("profissao", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desempregado">Desempregado</SelectItem>
                  <SelectItem value="empregado">Empregado</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rendaPessoal">Renda Pessoal</Label>
              <Select value={formData.rendaPessoal} onValueChange={(value) => handleInputChange("rendaPessoal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-salario">1 salário mínimo</SelectItem>
                  <SelectItem value="2-salarios">2 salários mínimos</SelectItem>
                  <SelectItem value="3-salarios">3 salários mínimos</SelectItem>
                  <SelectItem value="mais-3">Mais de 3 salários</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dependência Química */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dependência Química</CardTitle>
            <CardDescription>Histórico de uso de substâncias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(substanceLabels).map(([key, label]) => (
                <div key={key} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={formData.dependenciaQuimica[key as keyof typeof formData.dependenciaQuimica].uso}
                      onCheckedChange={(checked) => handleDependencyChange(key, "uso", !!checked)}
                    />
                    <Label htmlFor={key} className="font-medium">{label}</Label>
                  </div>
                  
                  {formData.dependenciaQuimica[key as keyof typeof formData.dependenciaQuimica].uso && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Idade de início</Label>
                        <Input
                          type="number"
                          placeholder="Anos"
                          value={formData.dependenciaQuimica[key as keyof typeof formData.dependenciaQuimica].idadeInicio}
                          onChange={(e) => handleDependencyChange(key, "idadeInicio", e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tempo de uso</Label>
                        <Input
                          placeholder="Anos"
                          value={formData.dependenciaQuimica[key as keyof typeof formData.dependenciaQuimica].tempoUso}
                          onChange={(e) => handleDependencyChange(key, "tempoUso", e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tempo abstinência</Label>
                        <Input
                          placeholder="Dias/Meses"
                          value={formData.dependenciaQuimica[key as keyof typeof formData.dependenciaQuimica].tempoAbstinencia}
                          onChange={(e) => handleDependencyChange(key, "tempoAbstinencia", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="substanciaPreferencia">Substância de maior preferência dentro todas as consumidas</Label>
                <Input
                  id="substanciaPreferencia"
                  value={formData.substanciaPreferencia}
                  onChange={(e) => handleInputChange("substanciaPreferencia", e.target.value)}
                  placeholder="Especifique a substância preferida"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="historiaFamiliar">História familiar de dependência química</Label>
                <Textarea
                  id="historiaFamiliar"
                  value={formData.historiaFamiliar}
                  onChange={(e) => handleInputChange("historiaFamiliar", e.target.value)}
                  placeholder="Descreva o histórico familiar..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comorbidades">Comorbidades clínicas principais</Label>
                <Textarea
                  id="comorbidades"
                  value={formData.comorbidades}
                  onChange={(e) => handleInputChange("comorbidades", e.target.value)}
                  placeholder="Liste as principais comorbidades..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motivacaoTratamento">Motivação para o tratamento</Label>
                <Textarea
                  id="motivacaoTratamento"
                  value={formData.motivacaoTratamento}
                  onChange={(e) => handleInputChange("motivacaoTratamento", e.target.value)}
                  placeholder="Descreva a motivação do paciente..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações gerais</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <Card className="shadow-card">
          <CardContent className="flex gap-4 pt-6">
            <Button onClick={handleSave} className="bg-gradient-primary">
              <Save className="h-4 w-4 mr-2" />
              Salvar Cadastro
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar Formulário
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPatient;