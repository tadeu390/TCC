<?php
	require_once("Geral.php");//INCLUI A CLASSE GENÉRICA.
	/*!
	*	ESTA CLASSE TEM POR FUNÇÃO CONTROLAR TODOS OS RECURSOS DOS MODULOS DO SISTEMA.
	*/
	class Modulo extends Geral 
	{
		public function __construct()
		{
			parent::__construct();
			
			if(empty($this->Account_model->session_is_valid()['id']))
			{
				$url_redirect = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
				$url_redirect = str_replace("/","-x",$url_redirect);
				redirect('account/login/'.$url_redirect);
			}
			
			$this->set_menu();
			$this->data['controller'] = strtolower(get_class($this));
			$this->data['menu_selectd'] = $this->Geral_model->get_identificador_menu(strtolower(get_class($this)));
		}
		/*!
		*	RESPONSÁVEL POR RECEBER DA MODEL TODOS OS MODULO CADASTRADOS E ENVIA-LOS A VIEW.
		*
		*	$page -> Número da página atual de registros.
		*/
		public function index($page = false)
		{
			if($page === false)
				$page = 1;
			
			$this->set_page_cookie($page);
			
			$this->data['title'] = 'Módulos';
			if($this->Geral_model->get_permissao(READ, get_class($this)) == true)
			{
				$this->data['lista_modulos'] = $this->Modulo_model->get_modulo(FALSE, FALSE, $page);
				
				$this->data['paginacao']['size'] = $this->data['lista_modulos'][0]['Size'];
				$this->data['paginacao']['pg_atual'] = $page;
				$this->data['paginacao']['itens_por_pagina'] = ITENS_POR_PAGINA;
				
				$this->view("modulo/index", $this->data);
			}
			else
				$this->view("templates/permissao", $this->data);
		}
		/*!
		*	RESPONSÁVEL POR RECEBER UM ID DE MÓDULO PARA "APAGAR".
		*
		*	$id -> Id do módulo.
		*/
		public function deletar($id = false)
		{
			if($this->Geral_model->get_permissao(DELETE, get_class($this)) == true)	
				$this->Modulo_model->deletar($id);
			else
				$this->view("templates/permissao", $this->data);
		}
		/*!
		*	RESPONSÁVEL POR CARREGAR O FORMULÁRIO DE CADASTRO DE MÓDULOS E RECEBER DA MODEL OS DADOS 
		*	DO MÓDULO QUE SE DESEJA EDITAR.
		*
		*	$id -> Id do módulo.
		*/
		public function edit($id = false)
		{
			$this->data['title'] = 'Editar Módulo';
			if($this->Geral_model->get_permissao(UPDATE, get_class($this)) == true)
			{
				$this->data['obj'] = $this->Modulo_model->get_modulo(FALSE, $id, FALSE);
				$this->data['lista_menus'] = $this->Menu_model->get_menu(FALSE, FALSE, FALSE);
				
				$this->view("modulo/create_edit", $this->data);
			}
			else
				$this->view("templates/permissao", $this->data);
		}
		/*!
		*	RESPONSÁVEL POR CARREGAR O FORMULÁRIO DE CADASTRO DO MÓDULO.
		*/
		public function create()
		{
			$this->data['title'] = 'Novo Módulo';
			if($this->Geral_model->get_permissao(CREATE, get_class($this)) == true)
			{
				$this->data['obj'] = $this->Modulo_model->get_modulo(FALSE, 0, FALSE);
				$this->data['lista_menus'] = $this->Menu_model->get_menu(FALSE, FALSE, FALSE);
				
				$this->view("modulo/create_edit", $this->data);
			}
			else
				$this->view("templates/permissao", $this->data);
		}
		/*!
		*	RESPONSÁVEL POR CAPTAR OS DADOS DO FORMULÁRIO SUBMETIDO.
		*/
		public function store()
		{
			$resultado = "sucesso";
			$dataToSave = array(
				'Id' => $this->input->post('id'),
				'Nome' => $this->input->post('nome'),
				'Descricao' => $this->input->post('descricao'),
				'Url' => $this->input->post('url_modulo'),
				'Ordem' => $this->input->post('ordem'),
				'Icone' => $this->input->post('icone'),
				'Menu_id' => $this->input->post('menu_id'),
				'Ativo' => $this->input->post('modulo_ativo')
			);

			//bloquear acesso direto ao metodo store
			 if(!empty($this->input->post()))
			 {
				if($this->Geral_model->get_permissao(CREATE, get_class($this)) == TRUE || $this->Geral_model->get_permissao(UPDATE, get_class($this)) == TRUE)
				{
					if(empty($this->Modulo_model->get_modulo_por_nome($dataToSave['Nome']))  || !empty($dataToSave['Id']))
						$this->Modulo_model->set_modulo($dataToSave);
					else
						$resultado = "O nome informado para o módulo já se encontra cadastrado no sistema.";
				}
				else
					$resultado = "Você não tem permissão para realizar esta ação.";

				$arr = array('response' => $resultado);
				header('Content-Type: application/json');
				echo json_encode($arr);
			 }
			 else
				redirect('modulo/index');
		}
		/*!
		*	RESPONSÁVEL POR RECEBER DA MODEL TODOS OS ATRIBUTOS DE UM MÓDULO E OS ENVIA-LOS A VIEW.
		*
		*	$id -> Id de um módulo.
		*/
		public function detalhes($id = FALSE)
		{
			if($this->Geral_model->get_permissao(READ, get_class($this)) == TRUE)
			{		
				$this->data['title'] = 'Detalhes do módulo';
				$this->data['obj'] = $this->Modulo_model->get_modulo(FALSE, $id, FALSE);
	
				$this->view("modulo/detalhes", $this->data);
			}
			else
				$this->view("templates/permissao", $this->data);
		}
	}
?>