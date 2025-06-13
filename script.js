const form = document.getElementById("formulario");
form.addEventListener("submit", prevenção);

const inputValue = document.getElementById("valor-real");
const selectCurrency = document.getElementById("currency");
const resultado = document.getElementById("resultado");
let valueConverter = 0;
let exchangeRates = {};

// Função para buscar taxas de câmbio da AwesomeAPI
async function fetchExchangeRates() {
  try {
    resultado.innerHTML = "Carregando taxas de câmbio...";
    const response = await fetch(
      "https://economia.awesomeapi.com.br/last/BRL-EUR,BRL-USD,BRL-ARS,BRL-GBP,BRL-CNY"
    );
    if (!response.ok) throw new Error("Falha na API");
    const data = await response.json();
    console.log("Dados da API:", data); // Depuração

    // Mapear as taxas para um objeto mais simples (1 unidade da moeda = X BRL)
    exchangeRates = {
      euro: parseFloat(data.BRLEUR.bid), // 1 EUR = X BRL
      dolar: parseFloat(data.BRLUSD.bid), // 1 USD = X BRL
      peso: parseFloat(data.BRLARS.bid), // 1 ARS = X BRL
      libra: parseFloat(data.BRLGBP.bid), // 1 GBP = X BRL
      yuan: parseFloat(data.BRLCNY.bid), // 1 CNY = X BRL
    };
    console.log("Taxas carregadas:", exchangeRates); // Depuração
    resultado.innerHTML = ""; // Limpar mensagem de carregamento
  } catch (error) {
    console.error("Erro ao buscar taxas de câmbio:", error);
    resultado.innerHTML = "Erro ao carregar taxas de câmbio. Tente novamente.";
  }
}

// Chamar a função para carregar as taxas ao iniciar a página
fetchExchangeRates();

function prevenção(e) {
  e.preventDefault();

  const value = parseFloat(inputValue.value);
  if (!value || value <= 0) {
    window.alert("Informe um valor correto!");
    return;
  } else if (selectCurrency.value === "") {
    window.alert("Selecione uma moeda!");
    return;
  }

  converter();
}

function converter() {
  const currency = selectCurrency.value;
  const value = parseFloat(inputValue.value);

  // Verificar se as taxas foram carregadas
  if (!exchangeRates[currency]) {
    resultado.innerHTML = "Taxa de câmbio não disponível. Tente novamente.";
    return;
  }

  console.log(`Taxa para ${currency}:`, exchangeRates[currency]); // Depuração

  // Calcular o valor convertido (BRL para moeda estrangeira: dividir pelo valor da taxa)
  valueConverter = value / exchangeRates[currency];
  console.log(
    `Valor convertido (${value} BRL / ${exchangeRates[currency]}):`,
    valueConverter
  ); // Depuração

  // Mapear moedas para códigos de formatação
  const currencyMap = {
    euro: { locale: "pt-BR", code: "EUR" },
    dolar: { locale: "en-US", code: "USD" },
    peso: { locale: "es-AR", code: "ARS" },
    libra: { locale: "en-GB", code: "GBP" },
    yuan: { locale: "zh-CN", code: "CNY" },
  };

  resultado.innerHTML = formatarvalor(
    currencyMap[currency].locale,
    currencyMap[currency].code
  );

  animateResult();
}

function formatarvalor(locale, currency) {
  const value = valueConverter.toLocaleString(locale, {
    style: "currency",
    currency: currency,
  });
  return `<span>🤑</span> ${value} <span>🤑</span>`;
}

function animateResult() {
  return resultado.animate(
    [{ transform: "translateY(-50px)" }, { transform: "translateY(-10px)" }],
    { duration: 1000 }
  );
}
