function abrirModalAdicionar() {
	//document.getElementById('produtoId').value = '';
	//document.getElementById('modalAdicionar').style.display = 'block';
	const modal = document.getElementById('modalAdicionar');
	modal.style.display = 'block';
	setTimeout(() => {
		modal.classList.add('show'); // Adiciona a classe para animação
	}, 10);
}

function fecharModalAdicionar() {
	//document.getElementById('modalAdicionar').style.display = 'none';
	const modal = document.getElementById('modalAdicionar');
	modal.classList.remove('show'); // Remove a classe para animação
	setTimeout(() => {
		modal.style.display = 'none'; // Esconde o modal após a animação
	}, 1000);
}

// Funções para editar/deletar produtos
function editarProduto(id) {
	fetch('/obter-produto/' + id)
		.then(response => response.json())
		.then(produto => {
			document.getElementById('produtoId').value = produto.id;
			document.getElementById('nome').value = produto.nome;
			document.getElementById('preco').value = produto.preco;
			document.getElementById('quantidade').value = produto.quantidade;
			abrirModalAdicionar();
		});
}

function deletarProduto(id) {
	if (confirm('Tem certeza que deseja deletar este produto?')) {
		fetch('/deletar-produto/' + id, {
			method: 'DELETE'
		})
			.then(response => {
				if (response.ok) {
					alert('Produto deletado com sucesso!');
					window.location.reload(); // Recarrega a página para atualizar a tabela
				}
			});
	}
}

// Evento para fechar o modal ao clicar fora dele
window.onclick = function(event) {
	const modal = document.getElementById('modalAdicionar');
	if (event.target === modal) {
		modal.style.display = 'none';
	}
};

// Função para adicionar uma linha à tabela
function adicionarLinhaTabela(produto) {
	const tabela = document.querySelector('table tbody');

	// Verifica se o produto já existe na tabela (com base no ID)
	const linhaExistente = Array.from(tabela.rows).find(row => row.cells[1].textContent === String(produto.id));
	if (linhaExistente) {
		// Atualiza a linha existente (caso o produto já exista)
		linhaExistente.cells[2].textContent = produto.nome;
		linhaExistente.cells[3].textContent = produto.preco;
		linhaExistente.cells[4].textContent = produto.quantidade;
		linhaExistente.cells[5].textContent = produto.preco * produto.quantidade;
	} else {
		// Cria uma nova linha para o produto
		const novaLinha = document.createElement('tr');
		novaLinha.innerHTML = `
            <td>
                <i class="fas fa-edit btn-edit" onclick="editarProduto(${produto.id})"></i>
                <i class="fas fa-trash btn-delete" onclick="deletarProduto(${produto.id})"></i>
            </td>
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.preco}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.preco * produto.quantidade}</td>
        `;
		tabela.appendChild(novaLinha);
	}
}

// Função para limpar os campos do formulário
function limparFormulario() {
	document.getElementById('nome').value = '';
	document.getElementById('preco').value = '';
	document.getElementById('quantidade').value = '';
}

// Função para buscar e atualizar a tabela
function atualizarTabela() {
	fetch('/listar-produtos')
		.then(response => response.json())
		.then(produtos => {
			const tabela = document.querySelector('table tbody');
			tabela.innerHTML = ''; // Limpa a tabela

			produtos.forEach(produto => {
				adicionarLinhaTabela(produto);
			});
		});
}

// Evento de submissão do formulário (registrado apenas uma vez)
let formProduto = document.getElementById('formProduto');
if (formProduto) {
	formProduto.addEventListener('submit', function(event) {
		event.preventDefault(); // Impede o envio padrão do formulário

		const produto = {
			id: document.getElementById('produtoId').value || null, // Envia o ID se existir
			nome: document.getElementById('nome').value,
			preco: parseFloat(document.getElementById('preco').value),
			quantidade: parseInt(document.getElementById('quantidade').value)
		};

		// Envia os dados para o backend
		fetch('/adicionar-produto', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(produto)
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Erro ao adicionar produto');
				}
				return response.json(); // Retorna o produto salvo
			})
			.then(produtoSalvo => {
				adicionarLinhaTabela(produtoSalvo);
				alert('Produto adicionado com sucesso!');
				fecharModalAdicionar();
				limparFormulario(); // Limpa os campos do formulário
				window.location.reload();
			})
			.catch(error => {
				console.error('Erro ao adicionar produto:', error);
				alert('Erro ao adicionar produto. Verifique o console para mais detalhes.');
			});

	}, { once: true });

}

// Atualiza a tabela ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
	atualizarTabela();
});