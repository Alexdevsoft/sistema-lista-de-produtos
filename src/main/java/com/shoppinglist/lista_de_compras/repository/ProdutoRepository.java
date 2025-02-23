package com.shoppinglist.lista_de_compras.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppinglist.lista_de_compras.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long>{

}
