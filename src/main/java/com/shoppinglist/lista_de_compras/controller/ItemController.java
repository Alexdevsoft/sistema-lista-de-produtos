/**
 * @autor Alex
 * @since 2025-02-23
 */
package com.shoppinglist.lista_de_compras.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.shoppinglist.lista_de_compras.model.*;
import com.shoppinglist.lista_de_compras.repository.ProdutoRepository;

@Controller
public class ItemController {

	@Autowired
	private ProdutoRepository produtoRepository;

	@PostMapping("/adicionar-produto")
	@ResponseBody
	public Produto adicionarProduto(@RequestBody Produto produto) {
		if (produto.getId() == null) {
			return produtoRepository.save(produto);
		} else {
			return produtoRepository.save(produto); // Retorna o produto salvo
		}
		
	}

	@GetMapping("/")
	public String listarProdutos(Model model) {
		model.addAttribute("produtos", produtoRepository.findAll());
		return "lista";
	}

	@GetMapping("/obter-produto/{id}")
	@ResponseBody
	public Produto obterProduto(@PathVariable Long id) {
		return produtoRepository.findById(id).orElseThrow();
	}

	@GetMapping("/listar-produtos")
	@ResponseBody
	public List<Produto> listarProdutos() {
		return produtoRepository.findAll();
	}

	@DeleteMapping("/deletar-produto/{id}")
	@ResponseBody
	public ResponseEntity<String> deletarProduto(@PathVariable Long id) {
		produtoRepository.deleteById(id);
		return ResponseEntity.ok("Produto deletado com sucesso!");
	}

}
