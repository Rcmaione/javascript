window.onload = function () {
    const tipoSalgadas = document.querySelector("#receitas-salgadas");
    const tipoDoces = document.querySelector("#receitas-doces");
    const minhasReceitasContainer = document.getElementById('minhas-receitas-container');

    function criarCardReceita(receita) {
        const card = document.createElement("div");
        card.classList.add("card");

        const link = document.createElement("a");
        link.href = receita.link;

        const img = document.createElement("img");
        img.classList.add("capa");
        img.src = receita.imagem;
        img.alt = receita.receita;

        const titulo = document.createElement("p");
        titulo.classList.add("nome-receita");
        titulo.textContent = receita.receita;

        const descricao = document.createElement("p");
        descricao.classList.add("desc-receita");
        descricao.textContent = receita.descricao;

        link.append(img, titulo, descricao);
        card.appendChild(link);

        return card;
    }

    function curtirReceita(nomeReceita) {
        const receitasCurtidas = JSON.parse(localStorage.getItem('MinhasReceitas')) || [];
        
        if (!receitasCurtidas.includes(nomeReceita)) {
            receitasCurtidas.push(nomeReceita);
            localStorage.setItem('MinhasReceitas', JSON.stringify(receitasCurtidas));
            alert('Receita curtida!');
            exibirMinhasReceitas();
        } else {
            alert('Você já curtiu esta receita!');
        }
    }

    function exibirMinhasReceitas() {
        minhasReceitasContainer.innerHTML = ""; // Limpa o conteúdo atual
    
        const receitasCurtidas = JSON.parse(localStorage.getItem('MinhasReceitas')) || [];
    
        receitasCurtidas.forEach(async nomeReceita => {
            const card = await criarCardMinhaReceita(nomeReceita);
            if (card) {
                minhasReceitasContainer.appendChild(card);
            }
        });
    }
    
    async function criarCardMinhaReceita(nomeReceita) {
        const receitaSalgada = await obterDetalhesReceita(nomeReceita, tipoSalgadas);
        const receitaDoce = await obterDetalhesReceita(nomeReceita, tipoDoces);
    
        if (receitaSalgada) {
            return criarCardReceita(receitaSalgada);
        } else if (receitaDoce) {
            return criarCardReceita(receitaDoce);
        }
        return null;
    }

    // Função auxiliar para obter os detalhes da receita com base no nome
    async function obterDetalhesReceita(nomeReceita, tipo) {
        const localURL = tipo === tipoSalgadas ? 'receitas.json' : 'receitasdoces.json';
        
        try {
            const response = await fetch(localURL);
            const receitas = await response.json();
            
            // Encontre a receita com base no nome
            const receitaEncontrada = receitas.find(receita => receita.receita === nomeReceita);
            
            // Retorne a receita encontrada ou null se não encontrada
            return receitaEncontrada || null;
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
            return null;
        }
    }   
    exibirMinhasReceitas(); // Exibe as receitas curtidas ao carregar a página
}
