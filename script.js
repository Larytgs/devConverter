const form = document.getElementById("formulario");

const inputValue = document.getElementById("valor");
const selectFromCurrency = document.getElementById("from-currency");
const selectToCurrency = document.getElementById("to-currency");
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
    console.log("Dados da API:", data);

    // Mapear as taxas corretamente
    exchangeRates = {
      EUR: parseFloat(data.BRLEUR.bid), // 1 BRL = X EUR
      USD: parseFloat(data.BRLUSD.bid), // 1 BRL = X USD
      ARS: parseFloat(data.BRLARS.bid), // 1 BRL = X ARS
      GBP: parseFloat(data.BRLGBP.bid), // 1 BRL = X GBP
      CNY: parseFloat(data.BRLCNY.bid), // 1 BRL = X CNY
      BRL: 1.0, // Adicionando BRL como base (taxa 1:1)
    };
    console.log("Taxas carregadas:", exchangeRates);
    resultado.innerHTML = ""; // Limpar mensagem de carregamento
  } catch (error) {
    console.error("Erro ao buscar taxas de câmbio:", error);
    resultado.innerHTML =
      "Erro ao carregar taxas de câmbio. Tente novamente mais tarde.";
  }
}

// Chamar a função para carregar as taxas ao iniciar a página
fetchExchangeRates();

// Função para trocar as moedas
function swapCurrencies() {
  const from = selectFromCurrency.value;
  const to = selectToCurrency.value;
  selectFromCurrency.value = to;
  selectToCurrency.value = from;
}

// Função de conversão
function converter() {
  const value = parseFloat(inputValue.value);
  const fromCurrency = selectFromCurrency.value;
  const toCurrency = selectToCurrency.value;

  if (!value || value < 0) {
    window.alert("Informe um valor válido!");
    return;
  } else if (fromCurrency === "" || toCurrency === "") {
    window.alert("Selecione as moedas!");
    return;
  }

  // Verificar se as taxas foram carregadas
  if (Object.keys(exchangeRates).length === 0) {
    resultado.innerHTML =
      "Taxas de câmbio ainda não carregadas. Aguarde um momento.";
    return;
  }

  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    console.log("Moedas não encontradas:", {
      fromCurrency,
      toCurrency,
      exchangeRates,
    });
    resultado.innerHTML = "Taxa de câmbio não disponível. Tente novamente.";
    return;
  }

  console.log(`Convertendo de ${fromCurrency} para ${toCurrency}`);
  console.log(`Taxa de ${fromCurrency}:`, exchangeRates[fromCurrency]);
  console.log(`Taxa de ${toCurrency}:`, exchangeRates[toCurrency]);

  let convertedValue;
  if (fromCurrency === "BRL") {
    // De BRL para moeda estrangeira
    convertedValue = value * exchangeRates[toCurrency]; // Usando a taxa direta
  } else if (toCurrency === "BRL") {
    // De moeda estrangeira para BRL
    convertedValue = value / exchangeRates[fromCurrency];
  } else {
    // De uma moeda para outra (via BRL como intermediário)
    const toBRL = value / exchangeRates[fromCurrency];
    convertedValue = toBRL * exchangeRates[toCurrency];
  }

  valueConverter = convertedValue;
  console.log(`Valor convertido:`, valueConverter);

  const currencyMap = {
    BRL: { locale: "pt-BR", code: "BRL" },
    USD: { locale: "en-US", code: "USD" },
    EUR: { locale: "pt-BR", code: "EUR" },
    ARS: { locale: "es-AR", code: "ARS" },
    GBP: { locale: "en-GB", code: "GBP" },
    CNY: { locale: "zh-CN", code: "CNY" },
  };

  resultado.innerHTML = formatarvalor(
    currencyMap[toCurrency].locale,
    currencyMap[toCurrency].code
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
