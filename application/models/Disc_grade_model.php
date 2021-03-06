<?php
	require_once("Geral_model.php");//INCLUI A CLASSE GENÉRICA.
	/*!
	*	ESTA MODEL TRATA DAS OPERAÇÕES NO BANCO DE DADOS REFERENTE AS INFORMAÇÕES 
	*	DAS DISCIPLINAS E GRADES.
	*/
	class Disc_grade_model extends Geral_model 
	{
		public function __construct()
		{
			$this->load->database();
		}
		/*!
		*	RESPONSÁVEL POR RETORNAR UMA LISTA DE DISCIPLINAS CADASTRADAS OU NÃO PARA UMA DETERMINADA GRADE.
		*
		*	$id -> Id da grade para que se possa obter as disciplinas já cadastradas para ela caso exista.
		*/
		public function get_disc_grade($id)
		{
			$query = $this->db->query("
				SELECT d.Id AS Disciplina_id, d.Nome AS Nome_disciplina, d.Apelido AS Apelido_disciplina, dg.Periodo AS Periodo,
				dt.Id AS Disc_turma_id   
				FROM Disciplina d
				INNER JOIN Disc_grade dg ON dg.Disciplina_id = d.Id 
				LEFT JOIN Disc_turma dt ON dg.Id = dt.Disc_grade_id 
                	WHERE dg.Grade_id = ".$this->db->escape($id)." GROUP BY d.Id, dg.Periodo ORDER BY Periodo");

			return $query->result_array();
		}
	}
?>