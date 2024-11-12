export const encontrarCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const cepData = await response.json();
      if (cepData.erro) {
        throw new Error("CEP não encontrado");
      }
      // Retorna os dados do CEP
      return cepData;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return {};
    }
  };