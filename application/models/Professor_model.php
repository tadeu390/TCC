<?php
	require_once("Geral_model.php");//INCLUI A CLASSE GENÉRICA.
	/*!
	*	ESTA MODEL TRATA DAS OPERAÇÕES NA BASE DE DADOS REFERENTE AS OPERAÇÕES QUE O PROFESSOR REALIZA.
	*/
	class Professor_model extends Geral_model 
	{
		public function __construct()
		{
			$this->load->database();
		}
		/*!
		*	RESPONSÁVEL POR RETORNAR UMA LISTA DE PERÍODOS LETIVOS. SOMENTE OS PERÍODOS LETIVOS EM QUE O PROFESSOR LOGADO POSSUI ALGUM HISTÓRICO. (NO MÁXIMO 10)
		*
		*	$professor_id -> id do professor logado no sistema.
		*/
		public function get_periodos_professor($professor_id)
		{
			$query = $this->db->query("
				SELECT p.Id AS Periodo_letivo_id, p.Periodo AS Nome_periodo, m.Nome AS Nome_modalidade  
				FROM Periodo_letivo p 
				INNER JOIN Disc_turma dt ON dt.Periodo_letivo_id = p.Id 
				INNER JOIN Modalidade m ON m.Id = p.Modalidade_id 
				WHERE dt.Professor_Id = ".$this->db->escape($professor_id)." 
				GROUP BY 2 ORDER BY p.Id DESC LIMIT 10");

			return $query->result_array();
		}
	}
?>