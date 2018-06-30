<?php
	/*!
	*	ESTA MODAL TRATA DAS OPERAÇÕES NO BANCO DE DADOS REFERENTE AS REGRAS DO PERÍODO LETIVO.
	*/
	class Regras_model extends CI_Model 
	{
		/*
			CONECTA AO BANCO DE DADOS DEIXANDO A CONEXÃO ACESSÍVEL PARA OS METODOS
			QUE NECESSITAREM REALIZAR CONSULTAS.
		*/
		public function __construct()
		{
			$this->load->database();
		}
		/*!
		*	RESPONSÁVEL POR RETORNAR UMA LISTA DE PERÍODOS LETIVOS OU UM PERÍODO LETIVO ESPECÍFICO.
		*
		*	$Ativo -> Quando passado como "TRUE", este permite retornar apenas períodos letivos que estão ativos no banco de dados.
		*	$Id -> Quando passado algum valor inteiro, retorna um período letivo caso o mesmo exista no banco de dados.
		*	$page -> Pagina atual.
		*	$filter -> Quando há filtros, esta recebe os parâmetros utilizados para filtrar.
		*/
		public function get_regras($Ativo, $id = FALSE, $page = FALSE, $filter = FALSE)
		{
			$Ativos = "";
			if($Ativo == TRUE)
				$Ativos = " AND pl.Ativo = 1 ";

			if ($id === FALSE)//retorna todos se nao passar o parametro
			{
				$limit = $page * ITENS_POR_PAGINA;
				$inicio = $limit - ITENS_POR_PAGINA;
				$step = ITENS_POR_PAGINA;	
				
				$pagination = " LIMIT ".$inicio.",".$step;
				if($page === FALSE)
					$pagination = "";

				$query = $this->db->query("
					SELECT (SELECT count(*) FROM  Periodo_letivo WHERE TRUE ".$Ativos.") AS Size, 
					pl.Id, pl.Periodo, 
					DATE_FORMAT(pl.Data_registro, '%d/%m/%Y') as Data_registro, 
					pl.Ativo, m.Nome as Nome_modalidade, pl.Limite_falta, pl.Dias_letivos, pl.Media, pl.Duracao_aula, pl.Hora_inicio_aula,
					pl.Quantidade_aula, pl.Reprovas 
					FROM Periodo_letivo pl 
					INNER JOIN Modalidade m ON pl.Modalidade_id = m.Id 
					WHERE TRUE ".$Ativos." ORDER BY pl.Id ". $pagination ."");

				return $query->result_array();
			}

			$query =  $this->db->query("
				SELECT pl.Id, pl.Periodo, 
				DATE_FORMAT(pl.Data_registro, '%d/%m/%Y') as Data_registro,
				pl.Ativo  
					FROM Periodo_letivo pl 
				WHERE TRUE ".$Ativos." AND pl.Id = ".$this->db->escape($id)."");

			return $query->row_array();
		}
		/*!
		*	RESPONSÁVEL POR CADASTRAR/ATUALIZAR OS DADOS DE UM PERÍODO LETIVO NO BANCO DE DADOS.
		*
		*	$data-> Contém os dados do peródo letivo a ser cadastrado/atualizado.
		*/
		public function set_regras($data)
		{

			
		}
		/*!
		*	RESPONSÁVEL POR "APAGAR" UM PERÍODO LETIVO DO BANCO DE DADOS.
		*
		*	$id -> Id do período letivo a ser "apagado".
		*/
		public function delete_regras($id)
		{
			return $this->db->query("
				UPDATE Periodo_letivo SET Ativo = 0 WHERE Id = ".$this->db->escape($id)."");
		}
	}
?>