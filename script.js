const form = document.getElementById("formulario");
form.addEventListener("submit", prevenção); //adicionar um tipo de evento ao clicar em converter

const inputValue = document.getElementById("valor-real");
const selectCurrency = document.getElementById("currency");
const resultado = document.getElementById("resultado");
let valueConverter = 0;
let exchangeRates = {};

//Função para buscar taxas de cambio da AwesomeAPI
async function fetchExchangeRates() {
  try {
    const responde = await fetch(
      "https://economia.awesomeapi.com.br/last/BRL-EUR,BRL-USD,BRL-ARS,BRL-GBP,BRL-CNY"
    )
    const data = await responde.json();

    //Mapear as taxas para um objeto mais simples
    exchangeRates = {
      euro: parseFloat(data.BRLEUR.bid),
      dolar: parseFloat(data.BRLUSD.bid),
      peso: parseFloat(data.BRLARS.bid),
      libra: parseFloat(data.BRLGBP.bid),
      yuan: parseFloat(data.BRLCNY.bid),
    };
  }
}

//Chamar a função para carregar as taxas ao iniciar a pagina
fetchExchangeRates()

function prevenção(e) {
  e.preventDefault(); //para nao atualizar a pagina automaticamente

  if (!inputValue.value || inputValue <= 0) {
    window.alert("Informe um valor correto!");
    return;
  } else if (selectCurrency.value == "") {
    window.alert("Selecione uma moeda!");
    return;
  }

  converter(); //para chamar a função de baixo
}

function converter() {
  const currency = selectCurrency.value
  const value = parseFloat(inputValue.value)

  //Verificar se as taxas foram carregadas
  if(!exchangeRates[currency]) {
    resultado.innerHTML = "Taxa de câmbio não disponivel. Tente novamente."
    return
  }

  //Mapear moedas para códigos de formata~]ao
  const currencyMap = {
    euro: { locale: "pt-BR", code: "EUR" },
    dolar: { locale: "en-US", code: "USD" },
    peso: { locale: "es-AR", code: "ARS" },
    libra: { locale: "en-GB", code: "GBP" },
    yuan: { locale: "zh-CN", code: "CNY" },
  };

  // Calcular o valor convertido
  valueConverter = value / exchangeRates[currency];
  resultado.innerHTML = formatarvalor(currencyMap[currency].locale, currencyMap[currency].code);

  animateResult();

  // //valores de julho de 2025
  // if (selectCurrency.value === "euro") {
  //   valueConverter = inputValue.value / 6.38;
  //   resultado.innerHTML = formatarvalor("pt-BR", "EUR"); //€

  //   animateResult(); //para chamar a função de baixo
  // } else if (selectCurrency.value === "dolar") {
  //   valueConverter = inputValue.value / 5.6;
  //   resultado.innerHTML = formatarvalor("en-US", "USD"); //$

  //   animateResult(); //para chamar a função de baixo
  // } else if (selectCurrency.value === "peso") {
  //   valueConverter = inputValue.value / 0.0047;
  //   resultado.innerHTML = formatarvalor("en-US", "USD"); //$

  //   animateResult(); //para chamar a função de baixo
  // } else if (selectCurrency.value === "libra") {
  //   valueConverter = inputValue.value / 7.57;
  //   resultado.innerHTML = formatarvalor("EN-gb", "GBP"); //£

  //   animateResult(); //para chamar a função de baixo
  // } /*else if(selectCurrency.value === 'rublo'){
  //       valueConverter = inputValue.value / 0.054;
  //       resultado.innerHTML = formatarvalor('', 'RUB') //₽

  //       animateResult() //para chamar a função de baixo
  //   }*/ else if (selectCurrency.value === "yuan") {
  //   valueConverter = inputValue.value / 0.78;
  //   resultado.innerHTML = formatarvalor("zh", "CNY"); //¥

  //   animateResult(); //para chamar a função de baixo
  // }

  //inputValue.value = ''; //para ficar vazio dps de converter
  //selectCurrency.value = '';
}

function formatarvalor(locale, currency) {
  const value = valueConverter.toLocaleString(locale, {
    style: "currency",
    currency: `${currency}`,
  });
  return `<span>🤑</span> ${value} <span>🤑</span>`; //sempre colocar crase ``
}

function animateResult() {
  return resultado.animate(
    [
      { transform: "translateY(-50px)" }, //animação p descer
      { transform: "translateY(-10px)" },
    ],
    { duration: 1000 }
  ); //duração em segundos
}
