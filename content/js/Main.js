var Main = {
	load_mask : function(){
		$(document).ready(function(){
			$('[data-toggle="popover"]').popover(),
			$(".chosen-select").chosen({no_results_text: "Não encontrado"}); 
			$('#telefone').mask('(00) 0000-00009'),
			$('#cep').mask('00000-000'),
			$('#cpf').mask('000.000.000-00'),
			$('#rg').mask('AA-00.000.000'),
			$('#titulo_eleitor').mask('0000 0000 0000'),
			$('#zona_eleitoral').mask('000'),
			$('#secao_eleitoral').mask('0000'),
			$('#telefone_aluno').mask('(00) 00000-0000'),
			$('#telefone_responsavel').mask('(00) 00000-0000'),
			$('#codigo_ativacao').mask('999999'),
			$('#itens_por_pagina').mask('000'),
			$('#porta').mask('0000'),
			$('#data_nascimento').mask('00/00/0000'),
			$('#periodo').mask('0000/0000'),
			$('#limite_falta').mask('000'),
			$('#dias_letivos').mask('000'),
			$('#media').mask('000'),
			$('#duracao_aula').mask('000'),
			$('#quantidade_aula').mask('00'),
			$('#reprovas').mask('00'),
			$('#valor').mask('000'),
			$('#valor_etapa_extra').mask('000'),
			$('#media_etapa_extra').mask('000'),
			$('#qtd_minimo').mask('000'),
			$('#qtd_maxima').mask('000'),
			$('[data-toggle="tooltip"]').tooltip(),
			$('#data1 input').datepicker({
		    	language: "pt-BR",
		    	 clearBtn: true,
		    	todayHighlight: true,
		    	autoclose: true
			}),
			$('#clearDates').on('click', function(){
			     
			})   
		});
	},
	modal : function(tipo, mensagem)
	{
		$("#mensagem_"+tipo).html(mensagem);
		$('#modal_'+tipo).modal({
			keyboard: true,
			backdrop : 'static',
		});

		if(tipo == "aviso")
		{
			$('#modal_aviso').on('shown.bs.modal', function () {
			 	$('#bt_close_modal_aviso').trigger('focus')
			})
		}
		else if(tipo == "confirm")
		{
			$('#modal_confirm').on('shown.bs.modal', function () {
		  		$('#bt_confirm_modal').trigger('focus')
			})
		}
	},
	weekday : function(dia)
	{
		var arrayDia = new Array(8);
		arrayDia[1] = "Segunda";
		arrayDia[2] = "Terça";
		arrayDia[3] = "Quarta";
		arrayDia[4] = "Quinta";
		arrayDia[5] = "Sexta";
		arrayDia[6] = "Sábado";
		arrayDia[7] = "Domingo";

		return arrayDia[dia];
	},
	str_to_date : function(str)
	{
		return new Date(new Date(str.split('/')[2],str.split('/')[1],str.split('/')[0]));
	},
	convert_date : function(str,to_region)
	{
		if(to_region == "en")
		{
			return str.split('/')[2]+'-'+str.split('/')[1]+'-'+str.split('/')[0];
		}
		else if(to_region == "pt")
		{
			return str.split('-')[2]+'/'+str.split('-')[1]+'/'+str.split('-')[0];
		}
	},
	corta_string : function (string, tam)
	{
		var str = string.substr(0, tam);
		
		if(string.length > tam)
			str = str + "...";
		
		return str;
	},
	get_cookie : function(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	login : function () {
		if(Main.login_isvalid() == true)
		{
			Main.modal("aguardar","Aguarde... validando seus dados.");
			$.ajax({
				url: Url.base_url+'account/validar',
				data: $("#form_login").serialize(),
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (msg) {
					if(msg.response == "primeiro_acesso")
						window.location.assign(Url.base_url+"account/primeiro_acesso");
					else if(msg.response == "valido")
					{
						var url_redirect = $("#url_redirect").val();
						url_redirect = url_redirect.replace(/-x/g,"/");
						
						if($("#url_redirect").val() != "")
							window.location.assign(url_redirect);
						else
							location.reload();
					}
					else
					{
						setTimeout(function(){
							$('#modal_aguardar').modal('hide');
						},500);
						Main.limpa_login();
						Main.modal("aviso", msg.response);
					}
				}
			});
		}
	},
	troca_status: function(idd)//checkbox de permissões
	{
		//settimeout para recuperar o efeito de transição do botão, somente por questões de estética
		setTimeout(function(){
			document.getElementById(idd).className = "checkbox checbox-switch switch-success";
		},500);	
		document.getElementById("flag"+idd).value = "success";
	},
	logout : function (){
		Main.modal("aguardar", "Aguarde... encerrando sessão");
	},
	login_isvalid : function (){
		if($("#email-login").val() == "")
			Main.show_error("email-login","Informe seu e-mail","");
		else if(Main.valida_email($("#email-login").val()) == false)
			Main.show_error("email-login","Formato de e-mail inválido","");
		else if($("#senha-login").val() == "")
			Main.show_error("senha-login","Insira sua senha","");
		else
			return true;
	},
	valida_email : function(email)
	{
		var nome = email.substring(0, email.indexOf("@"));
		var dominio = email.substring(email.indexOf("@")+ 1, email.length);

		if ((nome.length >= 1) &&
			(dominio.length >= 3) && 
			(nome.search("@")  == -1) && 
			(dominio.search("@") == -1) &&
			(nome.search(" ") == -1) && 
			(dominio.search(" ") == -1) &&
			(dominio.search(".") != -1) &&      
			(dominio.indexOf(".") >= 1)&& 
			(dominio.lastIndexOf(".") < dominio.length - 1)) 
			return true;
		else
			return false;
	},
	show_error : function(form, error, class_error)
	{
		if(class_error != "")
			document.getElementById(form).className = "input-material "+class_error;
		document.getElementById("error-"+form).innerHTML = error;
	},
	limpa_login : function ()
	{
		$("#senha-login").val("");
		$("#senha-login").focus();
	},
	method : '',
	form : '',
	method_redirect : '',
	create_edit : function ()
	{
		Main.modal("aguardar", "Aguarde... processando dados.");
		//QUANDO NÃO FOR DEFINIDO NENHUM MÉTODO NO 'init.js', POR DEFAULT É CONSIDERADO O METÓDO STORE PARA RECEBER OS DADOS
		
		if(Main.method == "" || Main.method == null)
			Main.method = "store";
		
		//QUANDO NÃO HÁ NECESSIDADE DE COLOCAR UM NOME ESPECÍFICO PRO FORMULÁRIO, USA O NOME PADRÃO ESPECIFICADO ABAIXO
		if(Main.form == "" || Main.form == null)
			Main.form = "form_cadastro";

		//QUANDO O MÉTODO DE REDIRECT NÃO É ESPECIFICADO, CONSIDERAR O PADRÃO index
		if(Main.method_redirect == "" || Main.method_redirect == null)
			Main.method_redirect = "index";

		$.ajax({
			url: Url.base_url+$("#controller").val()+'/'+Main.method,
			data: $("#"+$("form[name="+Main.form+"]").attr("id")).serialize(),
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (msg) {
				if(msg.response == "sucesso")
				{
					$("#mensagem_aguardar").html("Dados salvos com sucesso");
					window.location.assign(Url.base_url+$("#controller").val()+"/"+ Main.method_redirect +"/"+Main.get_cookie("page"));
				}
				else
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
						Main.modal("aviso", msg.response);
					},500);
				}
			}
		}).fail(function(msg){
		    setTimeout(function(){
		    	$("#modal_aguardar").modal('hide');
			    Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
			},500);
		});
	},
	usuario_validar : function(){
		if($("#grupo_id").val() == "0")
			Main.show_error("grupo_id", 'Selecione um tipo de usuário', '');
		else if($("#nome").val() == "")
			Main.show_error("nome", 'Informe o nome de usuário', 'is-invalid');
		else if($("#nome").val().length > 100)
			Main.show_error("nome", 'Máximo 100 caracteres', 'is-invalid');
		else if($("#email").val() == "")
			Main.show_error("email", 'Informe o e-mail de usuário', 'is-invalid');
		else if($("#email").val().length > 100)
			Main.show_error("email", 'Máximo 100 caracteres', 'is-invalid');
		else if($("#data_nascimento").val() == "")
			Main.show_error("data_nascimento", 'Informe a data de nascimento do usuário', 'is-invalid');

		else if($("#form_cadastro_"+$("#controller").val()).find("input[name='sexo']:checked").length == 0)
			Main.show_error("sexo","Selecione o sexo do usuário","");
		else if(Main.valida_email($("#email").val()) == false)
			Main.show_error("email", 'Formato de e-mail inválido', 'is-invalid');
		else if($("#senha").val() == "")
			Main.show_error("senha", 'Informe a senha de usuário', 'is-invalid');
		else if(document.getElementById("senha") != undefined && $("#senha").val().length < 8)
			Main.show_error("senha", 'A senha deve conter no mínimo 8 caracteres.', 'is-invalid');
		else if($("id").val() != "" && document.getElementById("email_notifica_nova_conta").checked == true && $("#nova_senha").val() == "")
			Main.modal("aviso","Para enviar e-mail de notificação é necessário que você altere a senha.");
		else
		{
			var trava = 0;
			if($("#id").val() == "")//se estiver criando um usuário
			{
				if($("#confirmar_senha").val() == "")
				{
					trava = 1;
					Main.show_error("confirmar_senha", 'Repita a senha de usuário', 'is-invalid');
				}
				else if($("#senha").val() != $("#confirmar_senha").val())
				{
					trava = 1;
					Main.show_error("confirmar_senha", 'Senha especificada é diferente da anterior', 'is-invalid');
				}
			}
			if(trava == 0)
			{
				
				if($("#nova_senha").val() != "")
				{
					if(document.getElementById("nova_senha") != undefined && $("#nova_senha").val().length < 8)
						Main.show_error("nova_senha", 'A senha deve conter no mínimo 8 caracteres.', 'is-invalid');
					else if($("#confirmar_nova_senha").val() == "")
						Main.show_error("confirmar_nova_senha", 'Repita a nova senha', 'is-invalid');
					else if($("#nova_senha").val() != $("#confirmar_nova_senha").val())
						Main.show_error("confirmar_nova_senha", 'Senha especificada é diferente da anterior', 'is-invalid');
					else
						return true;
				}
				else
					return true;
			}
		}
	},
	gerador_senha : function ()
	{
		var senha = Math.floor((Math.random() * 100000000) + 1);

		Main.modal("aviso","A senha gerada é: "+senha);

		$("#senha").val(senha);
		$("#confirmar_senha").val(senha);

		if(document.getElementById("label_senha") != undefined)
			document.getElementById("label_senha").className = "label-material active";
		if(document.getElementById("label_confirmar_senha") != undefined)
			document.getElementById("label_confirmar_senha").className = "label-material active";

		$("#nova_senha").val(senha);
		$("#confirmar_nova_senha").val(senha);
	},
	aluno_validar : function()
	{
		/*if($("#ra").val() == "")
			Main.show_error("ra", 'Informe o RA do aluno', 'is-invalid');	
		else*/
			return true;
	}
	,
	menu_validar : function()
	{
		if($("#nome").val() == "")
			Main.show_error("nome", 'Informe o nome de menu', 'is-invalid');
		else if($("#nome").val().length > 20)
			Main.show_error("nome", 'Máximo 20 caracteres', 'is-invalid');
		else if($("#ordem").val() == "")
			Main.show_error("ordem", 'Informe o número da ordem', 'is-invalid');
		else
			Main.create_edit();
	},
	modulo_validar : function()
	{
		if($("#nome").val() == "")
			Main.show_error("nome", 'Informe o nome de módulo', 'is-invalid');
		else if($("#nome").val().length > 20)
			Main.show_error("nome", 'Máximo 20 caracteres', 'is-invalid');
		else if($("#descricao").val() == "")
			Main.show_error("descricao", 'Informe a descrição de módulo', 'is-invalid');
		else if($("#descricao").val().length > 50)
			Main.show_error("descricao", 'Máximo 50 caracteres', 'is-invalid');
		else if($("#url_modulo").val() == "")
			Main.show_error("url_modulo", 'Informe a url do módulo', 'is-invalid');
		else if($("#url_modulo").val().length > 100)
			Main.show_error("url_modulo", 'Máximo 20 caracteres', 'is-invalid');
		else if($("#ordem").val() == "")
			Main.show_error("ordem", 'Informe o número da ordem', 'is-invalid');
		else if($("#icone").val() == "")
			Main.show_error("icone", 'Informe o ícone do módulo', 'is-invalid');
		else if($("#icone").val().length > 50)
			Main.show_error("icone", 'Máximo 50 caracteres', 'is-invalid');
		else
			Main.create_edit();
	},
	grupo_validar : function()
	{
		if($("#nome").val() == "")
			Main.show_error("nome", 'Informe o nome de grupo', 'is-invalid');
		else if($("#nome").val().length > 20)
			Main.show_error("nome", 'Máximo 20 caracteres', 'is-invalid');
		else
			Main.create_edit();
	},
	validar_turma : function()
	{
		if($("#nome").val() == "")
			Main.show_error("nome", 'Informe o nome da turma', 'is-invalid');
		else if($("#modalidade_id").val() == "0")
			Main.show_error("modalidade_id", 'Selecione uma modalidade para a turma.', '');
		else if($("#curso_id").val() == "0")
			Main.show_error("curso_id", 'Selecione um curso para a turma.', '');
		else if($("#grade_id").val() == "0")
			Main.show_error("grade_id", 'Selecione uma grade para a turma.', '');
		else if($("#periodo_grade_id").val() == "0")
			Main.show_error("periodo_grade_id", 'Selecione um período da grade para a turma.', '');
		else if(Main.valida_turma_disciplina(1) == false)
			Main.show_error("disciplinas", 'Selecione pelo menos uma disciplina para a turma.', '');
		else if(Main.valida_turma_disciplina(2) == false)
			Main.show_error("disciplinas", 'Há disciplinas marcadas que não foram preenchidas.', '');
		else if($("#quantidade_alunos_aux").val() == "0")
			Main.modal("aviso", "Selecione pelo menos "+(($("#quantidade_minima_aux").val() == '-') ? '1' : $("#quantidade_minima_aux").val())+" aluno(s) para a turma.");
		else if($("#quantidade_minima_aux").val() != "-" && 
			parseInt($("#quantidade_alunos_aux").val()) < parseInt($("#quantidade_minima_aux").val()))
			Main.modal("aviso", "A quantidade de alunos adicionados é inferior a quantidade mínima permitda.");
		else if($("#quantidade_maxima_aux").val() != "-" && 
			parseInt($("#quantidade_alunos_aux").val()) > parseInt($("#quantidade_maxima_aux").val()))
			Main.modal("aviso", "A quantidade de alunos adicionados é superior a quantidade máxima permitda.");
		else
			Main.create_edit();
	},
	limpa_filtro_aluno : function ()
	{
		document.getElementById('data_renovacao_inicio').value = document.getElementById('data_renovacao_inicio_hidden').value;
		document.getElementById('data_renovacao_fim').value = document.getElementById('data_renovacao_fim_hidden').value;;
		document.getElementById('nome_aluno').value = '';
		document.getElementById('aluno_novo').checked = false;
	},
	valida_turma_aluno : function()
	{
		/*for (var i = 0; i < $("#limite_aluno_add").val(); i ++) 
		{
			if($('input:checkbox[name^=nome_aluno_add'+i+']:checked').length > 0)
		}*/
	},
	valida_turma_disciplina : function(type)//se for 1 valida se foi marcado pelo menos uma disciplina
	{										//se for 2 valida se todas as disciplinas marcadas foram preenchidas
		var flag_disciplina = 0;
		var flag_disciplina_preenchida = 1;
		for (var i = 0; i < $("#limite_disciplina").val(); i ++) 
		{
			if($('input:checkbox[name^=nome_disciplina'+i+']:checked').length > 0)
			{
				Main.show_error('disciplinas','','');
				if($("#categoria_id"+i).val() == "0")
				{
					Main.show_error('categoria_id'+i,'Não selecionado','');
					flag_disciplina_preenchida = 0;
				}
				else
					Main.show_error('categoria_id'+i,'','');
				if($("#professor_id"+i).val() == "0")
				{
					Main.show_error('professor_id'+i,'Não selecionado','');
					flag_disciplina_preenchida = 0;
				}
				else
					Main.show_error('professor_id'+i,'','');
				flag_disciplina = 1;
			}
		}
		if(type == 1)
		{
			if (flag_disciplina) return true;
			return false;
		}
		else
		{
			if (flag_disciplina_preenchida) return true;
			return false;
		}
	},
	id_registro : "",
	confirm_delete : function(id)
	{
		Main.id_registro = id;
					
		Main.modal("confirm", "Deseja realmente excluir o registro selecionado?");
	},
	delete_registro : function()
	{
		$.ajax({
			url: Url.base_url+$("#controller").val()+'/deletar/'+Main.id_registro,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) {
				if(data.response == "sucesso")
					location.reload();
			}
		}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
	},
	senha_primeiro_acesso_validar : function() 
	{
		Main.method = "altera_senha_primeiro_acesso";

		var codigo_ativacao = $("#codigo_ativacao").val();
		var nova_senha = $("#nova_senha").val();
		var confirmar_nova_senha = $("#confirmar_nova_senha").val();

		if(codigo_ativacao.length == 0)
			Main.show_error("codigo_ativacao", 'Insira o código de ativação', 'is-invalid');
		else if(codigo_ativacao.length < 6)
			Main.show_error("codigo_ativacao", 'O código de ativação deve conter 6 caracteres numéricos', 'is-invalid');
		else if(nova_senha.length == 0)
			Main.show_error("nova_senha", 'Insira a nova senha', 'is-invalid');
		else if(nova_senha.length < 8)
			Main.show_error("nova_senha", 'A senha deve conter no mínimo 8 caracteres.', 'is-invalid');
		else if(confirmar_nova_senha == 0)
			Main.show_error("confirmar_nova_senha", 'Confirme a nova senha', 'is-invalid');
		else if(nova_senha != confirmar_nova_senha)
			Main.show_error("confirmar_nova_senha", 'As senhas não coincidem', 'is-invalid');
		else
			Main.create_edit();
	},
	redefinir_senha_validar : function()//validar na solicitação de uma nova senha
	{
		Main.method = "valida_redefinir_senha";

		var email = $("#email").val();

		if(email == "")
			Main.show_error("email", 'Informe o e-mail de usuário', 'is-invalid');
		else if(Main.valida_email(email) == false)
			Main.show_error("email", 'Formato de e-mail inválido', 'is-invalid');
		else
			Main.create_edit();
	},
	nova_senha_validar : function()//validar a senha nova que o usuário está inserindo
	{
		Main.method = "alterar_senha";

		var nova_senha = $("#nova_senha").val();
		var confirmar_nova_senha = $("#confirmar_nova_senha").val();

		if(nova_senha.length == 0)
			Main.show_error("nova_senha", 'Insira a nova senha', 'is-invalid');
		else if(nova_senha.length < 8)
			Main.show_error("nova_senha", 'A senha deve conter no mínimo 8 caracteres.', 'is-invalid');
		else if(confirmar_nova_senha == 0)
			Main.show_error("confirmar_nova_senha", 'Confirme a nova senha', 'is-invalid');
		else if(nova_senha != confirmar_nova_senha)
			Main.show_error("confirmar_nova_senha", 'As senhas não coincidem', 'is-invalid');
		else
			Main.create_edit();
	},
	settings_geral_validar : function()
	{
		Main.form = "form_cadastro_configuracoes_geral";

		if($("#itens_por_pagina").val() == "")
			Main.show_error("itens_por_pagina", 'Informe a quantidade de ítens por página', 'is-invalid');
		else if($("#itens_por_pagina").val() < 0)
			Main.show_error("itens_por_pagina", 'Informe um número positivo', 'is-invalid');
		else
			Main.create_edit();
	},
	config_email_validar : function()
	{
		Main.form = "form_cadastro_configuracoes_email";
		Main.method = "store_email";
		
		if($("#email").val() == "")
			Main.show_error("email", 'Informe um e-mail válido', 'is-invalid');
		else if(Main.valida_email($("#email").val()) == false)
			Main.show_error("email", 'Formato de e-mail inválido', 'is-invalid');
		else
			Main.create_edit();
	},
	disciplina_validar : function()
	{
		if($("#nome").val() == "")
			Main.show_error("nome", 'Informe um nome de disciplina', 'is-invalid');
		else if($("#nome").val().length > 200)
			Main.show_error("nome", 'Máximo 200 caracteres', 'is-invalid');
		else if($("#apelido").val() == "")
			Main.show_error("apelido", 'Informe o apelido da disciplina', 'is-invalid');
		else if($("#apelido").val().length > 40)
			Main.show_error("apelido", 'Máximo 40 caracteres', 'is-invalid');
		else
			Main.create_edit();
	},
	inscricao_validar : function()
	{
		if($("#aluno_id").val() == "0")
			Main.show_error("aluno_id", 'Selecione um aluno.', '');
		else if($("#curso_id").val() == "0")
			Main.show_error("curso_id", 'Selecione um curso.', '');
		else if($("#modalidade_id").val() == "0")
			Main.show_error("modalidade_id", 'Selecione uma modalidade.', '');
		else
			Main.create_edit();
	},
	curso_validar : function()
	{
		if($("#nome").val() == "")
			Main.show_error("nome","Informe o nome do curso","is-invalid");
		else if($("#nome").val().length > 100)
			Main.show_error("nome", 'Máximo 100 caracteres', 'is-invalid');
		else
			Main.create_edit();
	},
	altera_tipo_cadastro_usuario : function(tipo,registro,method)
	{
		if(tipo != 0)
		{
			Main.modal("aguardar", "Aguarde um momento");

			if(tipo == 1 || tipo == 3 || tipo == 4)//admin||secretaria||professor
				window.location.assign(Url.base_url+"usuario/"+method+"/"+registro+"/"+tipo);
			else if(tipo == 2)//aluno
				window.location.assign(Url.base_url+"aluno/"+method+"/"+registro+"/"+tipo);
		}
	},
	oculta_limite_falta : function()
	{
		var a = false;
		a = document.getElementById("limite_falta").disabled;
		if($('input:checkbox[name^=avaliar_faltas]:checked').length == 1 && a  == false)
		{
			document.getElementById("limite_falta").disabled = true;
			document.getElementById("limite_falta").value = "";
		}
		else
			document.getElementById("limite_falta").disabled = false;
	},
	validar_regras : function()
	{
		if($("#modalidade_id").val() == "0")
			Main.show_error("modalidade_id", 'Selecione uma modalidade.', '');
		else if($("#periodo").val() == "")
			Main.show_error("periodo", 'Informe o período letivo.', 'is-invalid');
		else if($('input:checkbox[name^=avaliar_faltas]:checked').length == 0 && $("#limite_falta").val() == "")
			Main.show_error("limite_falta", 'Informe o limite de faltas ou marque a opção acima.', 'is-invalid');				
		else if($('input:checkbox[name^=avaliar_faltas]:checked').length == 0 && $("#limite_falta").val() > 100)
			Main.show_error("limite_falta", 'O limite de falta deve estar entre 0 e 100.', 'is-invalid');
		else if($("#dias_letivos").val() == "")
			Main.show_error("dias_letivos", 'Informe quantos dias letivos terá este período.', 'is-invalid');
		else if($("#media").val() == "")
			Main.show_error("media", 'Informe a média de aprovação.', 'is-invalid');
		else if($("#media").val() > 100)
			Main.show_error("media", 'A média de aprovação deve estar entre 0 e 100.');
		else if($("#duracao_aula").val() == "")
			Main.show_error("duracao_aula", 'Informe quanto tempo terá cada aula.', 'is-invalid');
		else if($("#hora_inicio_aula").val() == "")
			Main.show_error("hora_inicio_aula", 'Informe a hora de início da aula.', 'is-invalid');
		else if($("#quantidade_aula").val() == "")
			Main.show_error("quantidade_aula", 'Informe a quantidade de aulas por dia.', 'is-invalid');
		else if($("#reprovas").val() == "")
			Main.show_error("reprovas", 'Informe quantas disciplinas o aluno poderá carregar.', 'is-invalid');
		else if($("#qtd_minima").val() != "" && $("#qtd_maxima").val() != "" && parseInt($("#qtd_minima").val()) > parseInt($("#qtd_maxima").val()))
			Main.show_error("qtd_maxima", 'A quantidade máxima deve ser superior ou igual a quantidade mínima.', 'is-invalid');
		else 
			Main.create_edit();
	},
	add_intervalo : function()
	{
		if(Main.intervalo_validar() == true)
		{
			var max_value_intervalo  =  $("#max_value_intervalo").val();

			var a = new Array();
			a.push($("#dia").val());
			a.push($("#hora_inicio").val()+":00");
			a.push($("#hora_fim").val()+":00");
			a.push("");

			var aux = new Array();
			aux.push("dia");
			aux.push("hora_inicio");
			aux.push("hora_fim");
			aux.push("");

			var node_tr = document.createElement("TR");
			node_tr.setAttribute("id","intervalo"+max_value_intervalo);
			
			for(var i = 0; i < 4; i++)
			{
				var node_td = document.createElement("TD");
				//if(i < 3)
				//	node_td.className = "text-center";
				
				var input_text = document.createElement("INPUT");
				input_text.setAttribute("type", "hidden");
				if(i < 3)
					input_text.setAttribute("value", a[i]);
				input_text.setAttribute("id",aux[i]+max_value_intervalo);
				input_text.setAttribute("name",aux[i]+max_value_intervalo);
				
				if (i == 0)
					var x = Main.weekday(a[i]);
				else
					x = a[i];
				var textnode = document.createTextNode(x); 
				node_td.appendChild(input_text);
				node_td.appendChild(textnode);
				
				if(i == 3)
				{
					node_td.setAttribute("class","text-right");
					node_td.innerHTML = "<span class='glyphicon glyphicon-remove pointer' title='Remover' onclick='Main.remove_elemento(\"intervalo"+max_value_intervalo+"\");'></span>";
				}
				
				node_tr.appendChild(node_td);
				document.getElementById("intervalos").appendChild(node_tr);
			}
			$("#max_value_intervalo").val(parseInt(max_value_intervalo) + 1);
		}
	},
	intervalo_validar : function()
	{
		if($("#hora_inicio").val() == "")
			Main.show_error("hora_inicio", 'Informe a hora de início para o intervalo.', '');
		else if($("#hora_fim").val() == "")
			Main.show_error("hora_fim", 'Informe a hora de fim para o intervalo.', '');
		else if($("#hora_inicio").val() > $("#hora_fim").val())
			Main.show_error("hora_fim", 'O Horário de fim deve ser maior do que o de início.', '');
		else if($("#hora_inicio").val()+":00" < $("#hora_inicio_aula").val())
			Main.show_error("hora_inicio", 'O início do intervalo não pode ser inferior ao horário de início da aula', '');
		else if($("#dia").val() == "0")
			Main.show_error("dia", 'Informe o dia deste intervalo.', '');
		else
		{
			var max_value_intervalo  =  $("#max_value_intervalo").val();

			var a = new Array();
			a.push($("#dia").val());
			a.push($("#hora_inicio").val()+":00");
			a.push($("#hora_fim").val()+":00");
			a.push("");

			var flag = 0;
			for(var i = 0; i < max_value_intervalo; i++)
			{
				if($("#dia"+i).val() == a[0] && $("#hora_inicio"+i).val() == a[1] &&
					$("#hora_fim"+i).val() == a[2])
					flag = 1;
			}

			var flag2 = 0;
			for(var i = 0; i < max_value_intervalo; i++)
			{
				if($("#dia"+i).val() == a[0] && (a[1] >= $("#hora_inicio"+i).val()  &&
					a[1] <= $("#hora_fim"+i).val() || a[2] >= $("#hora_inicio"+i).val()  &&
					a[2] <= $("#hora_fim"+i).val()))
					flag2 = 1;
			}

			if(flag == 1)
				Main.modal("aviso", "Este intervalo já existe na lista. Se deseja edita-lo, remova-o da lista e o adicione novamente.");
			else if (flag2 == 1)
				Main.modal("aviso", "Horário inválido.");
			else
				return true;
		}
	},
	remove_elemento : function (id)
	{
		var linha = document.getElementById(id);
		if(linha != undefined)
			linha.parentNode.removeChild(linha);
	},
	add_etapa : function ()
	{
		if(Main.etapa_validar() == true)
		{
			var max_value_etapa  =  $("#max_value_etapa").val();

			var a = new Array();
			a.push($("#nome_etapa").val());
			a.push($("#valor").val());
			a.push($("#data_inicio").val());
			a.push($("#data_fim").val());
			a.push(($("#data_abertura").val() == '') ? '' : $("#data_abertura").val());
			a.push(($("#data_fechamento").val() == '') ? '' : $("#data_fechamento").val());
			a.push("");

			var aux = new Array();
			aux.push("nome_etapa");
			aux.push("valor");
			aux.push("data_inicio");
			aux.push("data_fim");
			aux.push("data_abertura");
			aux.push("data_fechamento");
			aux.push("");

			var node_tr = document.createElement("TR");
			node_tr.setAttribute("id","etapa"+max_value_etapa);
			
			for(var i = 0; i < 7; i++)
			{
				var node_td = document.createElement("TD");
				
				var input_text = document.createElement("INPUT");
				input_text.setAttribute("type", "hidden");
				if(i < 6)
					input_text.setAttribute("value", a[i]);
				input_text.setAttribute("id",aux[i]+max_value_etapa);
				input_text.setAttribute("name",aux[i]+max_value_etapa);
				
				var textnode = document.createTextNode(a[i]); 
				node_td.appendChild(input_text);
				node_td.appendChild(textnode);
				
				if(i == 6)
				{
					node_td.setAttribute("class","text-right");
					node_td.innerHTML = "<span class='glyphicon glyphicon-remove pointer' title='Remover' onclick='Main.remove_elemento(\"etapa"+max_value_etapa+"\");'></span>";
				}
				
				node_tr.appendChild(node_td);
				document.getElementById("etapas").appendChild(node_tr);
			}
			$("#max_value_etapa").val(parseInt(max_value_etapa) + 1);
		}
	},
	etapa_validar : function()
	{
		if($("#nome_etapa").val() == "")
			Main.show_error("nome_etapa", 'Informe o nome do bimestre.', '');
		else if($("#valor").val() == "")
			Main.show_error("valor", 'Informe o valor do bimestre.', '');
		else if($("#data_inicio").val() == "")
			Main.show_error("data_inicio", 'Informe a data de início do bimestre.', '');
		else if($("#data_fim").val() == "")
			Main.show_error("data_fim", 'Informe a data de fim do bimestre.', '');
		else if(Main.str_to_date($("#data_fim").val()) <= Main.str_to_date($("#data_inicio").val()))
			Main.show_error("data_fim", 'A data de fim deve ser maior que a data de início.', '');
		else if($("#data_abertura").val() == "")
			Main.show_error("data_abertura", 'Informe a data de abertura', '');
		else if($("#data_fechamento").val() == "")
			Main.show_error("data_fechamento", 'Informe a data de fechamento', '');
		else if(Main.str_to_date($("#data_fechamento").val()) <= Main.str_to_date($("#data_abertura").val()))
			Main.show_error("data_fechamento", 'A data de fechamento deve ser maior que a data de abertura.', '');
		else if(Main.str_to_date($("#data_abertura").val()) < Main.str_to_date($("#data_inicio").val()) ||
				Main.str_to_date($("#data_fechamento").val()) > Main.str_to_date($("#data_fim").val()))
			Main.show_error("data_fechamento", 'Data de abertura / fechamento deve estar entre a data de início e fim.', '');
		else
		{
			var max_value_etapa  =  $("#max_value_etapa").val();

			var a = new Array();
			a.push($("#nome_etapa").val());
			a.push($("#valor").val());
			a.push($("#data_inicio").val());
			a.push($("#data_fim").val());
			a.push($("#data_abertura").val());
			a.push($("#data_fechamento").val());
			a.push("");

			var flag = 0;
			for(var i = 0; i < max_value_etapa; i++)
			{
				if($("#nome_etapa"+i).val() == a[0] && $("#valor"+i).val() == a[1] &&
					$("#data_inicio"+i).val() == a[2] && $("#data_fim"+i).val() == a[3])
					flag = 1;
				else if($("#valor"+i).val() == a[1] &&
					$("#data_inicio"+i).val() == a[2] && $("#data_fim"+i).val() == a[3])
					flag = 2;
			}

			if(flag == 1)
				Main.modal("aviso", "Este bimestre já existe na lista. Se deseja edita-lo, remova-o da lista e o adicione novamente.");
			else if(flag == 2)
				Main.modal("aviso", "As datas informadas já estão em uso para um bimestre na lista.");
			else
				return true;
		}
	},
	add_etapa_extra : function ()
	{
		if(Main.etapa_extra_validar() == true)
		{
			var max_value_etapa_extra  =  $("#max_value_etapa_extra").val();

			var a = new Array();
			a.push($("#nome_etapa_extra").val());
			a.push($("#valor_etapa_extra").val());
			a.push($("#media_etapa_extra").val());
			a.push(($("#data_abertura_etapa_extra").val() == '') ? '' : $("#data_abertura_etapa_extra").val());
			a.push(($("#data_fechamento_etapa_extra").val() == '') ? '' : $("#data_fechamento_etapa_extra").val());
			a.push("");

			var aux = new Array();
			aux.push("nome_etapa_extra");
			aux.push("valor_etapa_extra");
			aux.push("media_etapa_extra");
			aux.push("data_abertura_etapa_extra");
			aux.push("data_fechamento_etapa_extra");
			aux.push("");

			var node_tr = document.createElement("TR");
			node_tr.setAttribute("id","etapa_extra"+max_value_etapa_extra);
			
			for(var i = 0; i < 6; i++)
			{
				var node_td = document.createElement("TD");
				
				var input_text = document.createElement("INPUT");
				input_text.setAttribute("type", "hidden");
				if(i < 5)
					input_text.setAttribute("value", a[i]);
				input_text.setAttribute("id",aux[i]+max_value_etapa_extra);
				input_text.setAttribute("name",aux[i]+max_value_etapa_extra);
				
				var textnode = document.createTextNode(a[i]); 
				node_td.appendChild(input_text);
				node_td.appendChild(textnode);
				
				if(i == 5)
				{
					node_td.setAttribute("class","text-right");
					node_td.innerHTML = "<span class='glyphicon glyphicon-remove pointer' title='Remover' onclick='Main.remove_elemento(\"etapa_extra"+max_value_etapa_extra+"\");'></span>";
				}
				
				node_tr.appendChild(node_td);
				document.getElementById("etapas_extras").appendChild(node_tr);
			}
			$("#max_value_etapa_extra").val(parseInt(max_value_etapa_extra) + 1);
		}
	},
	etapa_extra_validar : function ()
	{
		if($("#nome_etapa_extra").val() == "")
			Main.show_error("nome_etapa_extra", 'Informe o nome da etapa extra.', '');
		else if($("#valor_etapa_extra").val() == "")
			Main.show_error("valor_etapa_extra", 'Informe o valor da etapa extra.', '');
		else if($("#data_abertura_etapa_extra").val() == "")
			Main.show_error("data_abertura_etapa_extra", 'Informe a data de abertura', '');
		else if($("#data_fechamento_etapa_extra").val() == "")
			Main.show_error("data_fechamento_etapa_extra", 'Informe a data de fechamento', '');
		else if(Main.str_to_date($("#data_fechamento_etapa_extra").val()) <= Main.str_to_date($("#data_abertura_etapa_extra").val()))
			Main.show_error("data_fechamento_etapa_extra", 'A data de fechamento deve ser maior que a data de abertura.', '');
		else if($("#media_etapa_extra").val() == "")
			Main.show_error("media_etapa_extra", 'Informe a média da etapa extra.', '');
		else
		{
			var max_value_etapa_extra  =  $("#max_value_etapa_extra").val();

			var a = new Array();
			a.push($("#nome_etapa_extra").val());
			a.push($("#valor_etapa_extra").val());
			a.push($("#data_abertura_etapa_extra").val());
			a.push($("#data_fechamento_etapa_extra").val());
			a.push("");

			var flag = 0;
			for(var i = 0; i < max_value_etapa_extra; i++)
			{
				if($("#nome_etapa_extra"+i).val() == a[0] && $("#valor_etapa_extra"+i).val() == a[1] &&
					$("#data_abertura_etapa_extra"+i).val() == a[2] && $("#data_fechamento_etapa_extra"+i).val() == a[3])
					flag = 1;
				else if($("#data_abertura_etapa_extra"+i).val() == a[2] && $("#data_fechamento_etapa_extra"+i).val() == a[3])
					flag = 2;
			}

			if(flag == 1)
				Main.modal("aviso", "Esta etapa extra já existe na lista. Se deseja edita-la, remova-a da lista e a adicione novamente.");
			else if(flag == 2)
				Main.modal("aviso", "As datas informadas já estão em uso para uma etapa extra na lista.");
			else
				return true;
		}
	},
	modalidade_validar : function()
	{
		if($("#nome").val() == "")
			Main.show_error("nome", 'Informe o nome da modalidade', 'is-invalid');
		else if($("#nome").val().length > 100)
			Main.show_error("nome", 'Máximo 100 caracteres', 'is-invalid');
		else
			Main.create_edit();
	},
	load_data_periodo_letivo : function(modalidade_id)
	{
		if(modalidade_id != 0)
		{
			$.ajax({
				url: Url.base_url+$("#controller").val()+'/periodo_letivo/'+modalidade_id,
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					if(data.response != "0")
					{
						var minimo = '-';
						var maximo = '-';
						if(data.response.Qtd_minima_aluno != 0) minimo = data.response.Qtd_minima_aluno;
						if(data.response.Qtd_maxima_aluno != 0) maximo = data.response.Qtd_maxima_aluno;

						$("#quantidade_minima").html("Mínimo "+minimo);
						$("#quantidade_maxima").html("Máximo "+maximo);
						$("#quantidade_minima_aux").val(minimo);
						$("#quantidade_maxima_aux").val(maximo);
						$("#nome_periodo_letivo").val(data.response.Periodo);
					}
					else if(modalidade_id != 0)
					{
						Main.modal("aviso","Nenhum período letivo foi identificado para esta modalidade. Por favor, primeiro cadastre o período letivo.");
						$("#quantidade_minima").html("Mínimo -");
						$("#quantidade_maxima").html("Máximo -");
						$("#quantidade_minima_aux").val('-');
						$("#quantidade_maxima_aux").val('-');
						$("#nome_periodo_letivo").val("Não encontrado.");
					}
					else{
						$("#quantidade_minima").html("Mínimo -");
						$("#quantidade_maxima").html("Máximo -");
						$("#quantidade_minima_aux").val('-');
						$("#quantidade_maxima_aux").val('-');
						$("#nome_periodo_letivo").val("");
					}
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
			Main.load_data_aluno("");
			Main.load_data_turma_filtro();
			Main.load_grade();
			Main.load_data_cursos();
		}
	},
	load_data_cursos : function ()
	{
		if($("#modalidade_id").val() != 0)
		{
			Main.modal("aguardar", "Aguarde...");
			$.ajax({
				url: Url.base_url+$("#controller").val()+'/cursos/'+$("#modalidade_id").val() + '/' + $("#curso_id").val(),
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					document.getElementById("curso").innerHTML = data.response;
					if(data.aviso != "")
						Main.modal("aviso", data.aviso);
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
	},
	habilita_curso : function(id)
	{
		if(id != 0)
			document.getElementById("curso_id").disabled = false;
		else
			document.getElementById("curso_id").disabled = true;
		Main.load_data_periodo_letivo(id);

	},
	load_grade : function ()
	{
		if($("#curso_id").val() != 0 && $("#modalidade_id").val() != 0)
		{
			Main.modal("aguardar", "Aguarde...");
			$.ajax({
				url: Url.base_url+$("#controller").val()+'/grade/'+$("#modalidade_id").val() + '/' + $("#curso_id").val(),
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					document.getElementById("grade").innerHTML = data.response;
					if(data.aviso != "")
						Main.modal("aviso", data.aviso);
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
	},
	load_periodo_grade : function(grade_id) 
	{
		if($("#grade_id").val() != 0)
		{
			Main.modal("aguardar", "Aguarde...");
			$.ajax({
				url: Url.base_url+$("#controller").val()+'/periodo_grade/'+$("#grade_id").val(),
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					document.getElementById("periodo_grade").innerHTML = data.response;
					document.getElementById("turma_id").innerHTML = "<option value='0' class='background_dark'>Turmas</option>";
					if(data.aviso != "")
						Main.modal("aviso", data.aviso);
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
	},
	load_grade_disciplina : function()//carrega a grade
	{
		if($("#periodo_grade_id").val() != 0)
		{
			Main.modal("aguardar", "Aguarde...");
			$.ajax({
				url: Url.base_url+$("#controller").val()+'/grade_disciplina/'+$("#grade_id").val()+'/'+$("#periodo_grade_id").val() + '/' + (($("#id").val() == "") ? 0 : $("#id").val()),
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					document.getElementById("disciplinas").innerHTML = data.response;
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
		Main.load_data_aluno("");
		Main.load_data_turma_filtro();
	},
	load_filtro_turma_aluno : function()//monta o filtro
	{
		var nome = (($("#nome_aluno").val() == "") ? 0 : $("#nome_aluno").val());
		var data_renovacao_inicio = (($("#data_renovacao_inicio").val() == "") ? 0 : $("#data_renovacao_inicio").val());
		var data_renovacao_fim = (($("#data_renovacao_fim").val() == "") ? 0 : $("#data_renovacao_fim").val());
		
		if(data_renovacao_inicio != 0)
			data_renovacao_inicio = Main.convert_date(data_renovacao_inicio, "en");
		if(data_renovacao_fim != 0)
			data_renovacao_fim = Main.convert_date(data_renovacao_fim, "en");

		Main.load_data_aluno(nome + "/" + data_renovacao_inicio + "/" + data_renovacao_fim);
		document.getElementById("turma_id").value = 0;
	},
	load_data_aluno : function(filtro)//Carrega os alunos para a lista a esquerda quando editando e quando usando o filtro pressionando o botão Pesquisar
	{ 
		if($("#curso_id").val() != "0" && $("#modalidade_id").val() != "0")
		{
			var pesquisa = "get_alunos_inscritos";
			if($("#aluno_novo").is(":checked") == true)
				var pesquisa = "get_alunos_inscritos_novos";
			Main.modal("aguardar", "Aguarde...");

			$.ajax({
				url: Url.base_url + $("#controller").val() + '/' + pesquisa + '/' + $("#curso_id").val() + "/" + $("#modalidade_id").val() + '/' + (($("#id").val() == "") ? 0 : $("#id").val()) + '/' + $("#grade_id").val() + '/' + filtro,
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					$("#qtd_alunos_encontrados_busca").html("Alunos encontrados "+data.quantidade);
					document.getElementById("alunos").innerHTML = data.response;;
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
	},
	load_data_aluno_turma_antiga : function(turma_id)//Carrega os alunos para a lista a esquerda quando selecionando alguma turma de histórico
	{
		if(turma_id != "0")
		{
			document.getElementById("nome_aluno").value = "";
			Main.modal("aguardar", "Aguarde...");

			$.ajax({
				url: Url.base_url + $("#controller").val() + '/get_alunos_inscritos_turma_antiga/' + turma_id,
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					$("#qtd_alunos_encontrados_busca").html("Alunos encontrados "+data.quantidade);
					document.getElementById("alunos").innerHTML = data.response;
					
					if(data.aviso != "")
						Main.modal("aviso", data.aviso);
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
	},
	load_data_turma_filtro : function()//Carrega o filtro de turma
	{
		if($("#curso_id").val() != "0" && $("#modalidade_id").val() != "0")
		{
			Main.modal("aguardar", "Aguarde...");

			$.ajax({
				url: Url.base_url + $("#controller").val() + '/get_filtro_turma/' + '/' + $("#curso_id").val() + "/" + $("#modalidade_id").val() + '/' + $("#grade_id").val(),
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					document.getElementById("turma_id").innerHTML = "<option value='0' class='background_dark'>Turmas</option>" + data.response;
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
	},
	add_aluno_marcado : function(lista, checkbox)
	{
		for(var i = 0; i < $("#"+lista).val(); i++)
		{
			if(lista == "limite_aluno")
				document.getElementById("nome_aluno"+i).checked = document.getElementById(checkbox).checked;
			else 
				document.getElementById("nome_aluno_add"+i).checked = document.getElementById(checkbox).checked;
		}
	},
	remove_aluno : function ()//REMOVE OS ALUNOS ADICIONADOS E SELECIONADOS
	{
		for(var i = 0; i < $("#limite_aluno_add").val(); i++)
		{
			if($("#nome_aluno_add"+i).is(":checked") == true)
			{
				Main.remove_elemento("aluno_item_add"+i);
				$("#quantidade_alunos").html("Alunos na turma "+(parseInt($("#quantidade_alunos_aux").val()) - 1));
				$("#quantidade_alunos_aux").val(parseInt($("#quantidade_alunos_aux").val()) - 1);
			}
		}
	},
	add_aluno : function ()
	{
		if($("#modalidade_id").val() == "0")//DEPOIS DE TERMINAR A TELA TODA  TALVEZ ESSE IF NAO SEJA MAIS NECESSARIO, POIS A MODALIDADE TA ARRAMADA AO CURSO E O CURSO AOS ALUNOS QUE SERAO LISTADOS PRA SEREM COLOCADOS NA TURMA
			Main.modal("aviso", "Primeiro selecione uma modalidade.");
		else
		{
			var valido = 1;
			var limite_aluno_add = $("#limite_aluno_add").val();
			for(var i = 0; i < $("#limite_aluno").val(); i++)
			{
				if($("#nome_aluno"+i).is(":checked") == true)
				{
					if(Main.add_aluno_validar($("#aluno_id"+i).val()) == true)
					{
						var node_tr = document.createElement("TR");
						node_tr.setAttribute("id","aluno_item_add"+limite_aluno_add);
						
						var node_td = document.createElement("TD");
						var aluno_id = document.createElement("INPUT");
						aluno_id.setAttribute("type","hidden");
						aluno_id.setAttribute("value",$("#aluno_id"+i).val());
						aluno_id.setAttribute("id","aluno_id_add"+limite_aluno_add);
						aluno_id.setAttribute("name","aluno_id_add"+limite_aluno_add);
						node_td.innerHTML = "<div style='margin-top: 5px; height: 25px;' class='checkbox checbox-switch switch-success custom-controls-stacked'>"
							+"<label for='nome_aluno_add"+limite_aluno_add+"' style='display: block; height: 25px;'>"
								+"<input type='checkbox' id='nome_aluno_add"+limite_aluno_add+"' name='nome_aluno_add"+limite_aluno_add+"' value='1' /><span></span>"
								+Main.corta_string($("#nome_aluno_aux"+i).val(), 25)
							+"</label>"
						+"</div>";
						node_td.setAttribute("title",$("#nome_aluno_aux"+i).val());
						node_td.appendChild(aluno_id);
						node_tr.appendChild(node_td);

						node_td = document.createElement("TD");
						node_td.setAttribute("class","text-center");
						node_td.setAttribute("style","vertical-align: middle;");
						var inp_sub_turma = document.createElement("INPUT");
						inp_sub_turma.setAttribute("type","number");
						inp_sub_turma.setAttribute("class","text-center");
						inp_sub_turma.setAttribute("style","width: 60%;");
						inp_sub_turma.setAttribute("maxlength","1");
						inp_sub_turma.setAttribute("id","sub_turma_add"+limite_aluno_add);
						inp_sub_turma.setAttribute("name","sub_turma_add"+limite_aluno_add);
						inp_sub_turma.setAttribute("value","0");
						node_td.appendChild(inp_sub_turma);
						node_tr.appendChild(node_td);

						node_td = document.createElement("TD");
						node_td.setAttribute("class","text-center");
						node_td.setAttribute("style","vertical-align: middle;");
						node_td.innerHTML = "<a title='Detalhes' target='n_guia' href='"+Url.base_url+"aluno/detalhes/"+$("#usuario_id"+i).val()+"'>"+
											"<span class='glyphicon glyphicon-arrow-right text-warning'></span> "+
											"</a>";
						node_tr.appendChild(node_td);				

						document.getElementById("alunos_turma").appendChild(node_tr);

						limite_aluno_add = parseInt(limite_aluno_add) + 1;
						document.getElementById('nome_aluno'+i).checked = false;//LIMPA OS CHECK MARCADOS
						
						$("#quantidade_alunos").html("Alunos na turma "+(parseInt($("#quantidade_alunos_aux").val()) + 1));
						$("#quantidade_alunos_aux").val(parseInt($("#quantidade_alunos_aux").val()) + 1);
					}
					else 
						valido = 0;
				}
			}
			$("#limite_aluno_add").val(limite_aluno_add);
			if(valido == 0)
				Main.modal("aviso","Alguns alunos selecionados não foram adicionados, pois já se encontram na lista ou o limite de alunos foi atingido.");
		}
	},
	add_aluno_validar : function(aluno_id)
	{
		for(var i = 0; i < $("#limite_aluno_add").val(); i++)
			if(parseInt($("#aluno_id_add"+i).val()) == parseInt(aluno_id))
				return false;

		if($("#quantidade_maxima_aux").val() != "-" && 
			parseInt($("#quantidade_alunos_aux").val()) == parseInt($("#quantidade_maxima_aux").val()))
			return false;
		return true;
	},
	matricula : function(inscricao_id)
	{
		document.getElementById("bt"+inscricao_id).disabled = true;
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/matricula/' + inscricao_id,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				setTimeout(function(){
					$("#modal_aguardar").modal('hide');
				},500);
				document.getElementById("tdbt"+inscricao_id).innerHTML = "<span class='glyphicon glyphicon-ok'></span> Matriculado";
			}
		}).fail(function(msg){
		    setTimeout(function(){
		    	$("#modal_confirm").modal('hide');
		    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
			},500);
		});
	},
	add_disciplina : function()
	{
		var valido = 1;
		var limite_disciplina_add = $("#limite_disciplina_add").val();
		for(var i = 0; i < $("#limite_disciplina").val(); i++)
		{
			if($("#nome_disciplina"+i).is(":checked") == true)
			{
				if(Main.add_disciplina_validar($("#disciplina_id"+i).val()) == true)
				{
					var node_tr = document.createElement("TR");
					node_tr.setAttribute("id","disciplina_item_add"+limite_disciplina_add);
					
					var node_td = document.createElement("TD");
					var disciplina_id = document.createElement("INPUT");
					disciplina_id.setAttribute("type","hidden");
					disciplina_id.setAttribute("value",$("#disciplina_id"+i).val());
					disciplina_id.setAttribute("id","disciplina_id_add"+limite_disciplina_add);
					disciplina_id.setAttribute("name","disciplina_id_add"+limite_disciplina_add);
					node_td.innerHTML = "<div style='margin-top: 5px; height: 25px;' class='checkbox checbox-switch switch-success custom-controls-stacked'>"
						+"<label for='nome_disciplina_add"+limite_disciplina_add+"' style='display: block; height: 25px;'>"
							+"<input type='checkbox' id='nome_disciplina_add"+limite_disciplina_add+"' name='nome_disciplina_add"+limite_disciplina_add+"' value='1' /><span></span>"
							+Main.corta_string($("#nome_disciplina_aux"+i).val(), 25)
						+"</label>"
					+"</div>";
					node_td.setAttribute("title",$("#nome_disciplina_aux"+i).val());
					node_td.appendChild(disciplina_id);
					node_tr.appendChild(node_td);

					node_td = document.createElement("TD");
					node_td.setAttribute("class","text-center");
					node_td.setAttribute("style","vertical-align: middle;");
					var inp_periodo = document.createElement("INPUT");
					inp_periodo.setAttribute("type","hidden");
					//inp_periodo.setAttribute("class","text-center");
					//inp_periodo.setAttribute("style","width: 60%;");
					//inp_periodo.setAttribute("maxlength","1");
					inp_periodo.setAttribute("id","periodo_add"+limite_disciplina_add);
					inp_periodo.setAttribute("name","periodo_add"+limite_disciplina_add);
					inp_periodo.setAttribute("value", $("#periodo_base").val());
					node_td.appendChild(inp_periodo);
					node_td.innerHTML += $("#periodo_base").val();
					node_tr.appendChild(node_td);			

					document.getElementById("disciplinas_grade").appendChild(node_tr);

					limite_disciplina_add = parseInt(limite_disciplina_add) + 1;
					document.getElementById('nome_disciplina'+i).checked = false;//LIMPA OS CHECK MARCADOS
					
				}
				else 
					valido = 0;
			}
		}
		$("#limite_disciplina_add").val(limite_disciplina_add);
		if(valido == 0)
			Main.modal("aviso","Algumas disciplinas selecionadas não foram adicionadas, pois já se encontram na lista.");
	},
	remove_disciplina : function ()//REMOVE AS DISCIPLINAS ADICIONADAS E SELECIONADAS
	{
		for(var i = 0; i < $("#limite_disciplina_add").val(); i++)
		{
			if($("#nome_disciplina_add"+i).is(":checked") == true)
				Main.remove_elemento("disciplina_item_add"+i);
		}
	},
	add_disciplina_validar : function(disciplina_id)
	{
		for(var i = 0; i < $("#limite_disciplina_add").val(); i++)
			if(parseInt($("#disciplina_id_add"+i).val()) == parseInt(disciplina_id) && parseInt($("#periodo_add"+i).val()) == parseInt($("#periodo_base").val()))
				return false;

		return true;
	},
	filtra_grade_disciplina : function()//monta o filtro de disciplina na grade
	{
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/filtra_disciplina/' + $("#nome_disciplina").val(),
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				setTimeout(function(){
					$("#modal_aguardar").modal('hide');
				},500);
				document.getElementById("disciplinas").innerHTML = data.response;;
			}
		}).fail(function(msg){
			setTimeout(function(){
				$("#modal_confirm").modal('hide');
				Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
			},500);
		});
	},
	validar_grade : function(){
		if($("#curso_id").val() == "0")
			Main.show_error("curso_id",'Informe o curso da grade.','');
		else if($("#modalidade_id").val() == "0")
			Main.show_error("modalidade_id", 'Informe a modalidade da grade.', '');
		else if($("#limite_disciplina_add").val() == "0")
			Main.show_error("limite_disciplina_add", 'Selecione pelo menos uma disciplina para a grade.', 'is-invalid');
		else
			Main.create_edit();
	},
	habilita_permissoes : function(permissao)
	{
		if(permissao == "all")
		{
			for(var i = 0; i < $("#qtd").val(); i++)
			{
				document.getElementById("criar"+i).checked = document.getElementById("hab_all").checked;
				if(document.getElementById("cr"+i) != undefined)
				{
					document.getElementById("cr"+i).className = "checkbox checbox-switch switch-success";
					document.getElementById("flagcr"+i).value = "success";
				}
				
				document.getElementById("ler"+i).checked = document.getElementById("hab_all").checked;
				if(document.getElementById("le"+i) != undefined){
					document.getElementById("le"+i).className = "checkbox checbox-switch switch-success";
					document.getElementById("flagle"+i).value = "success";
				}
				
				document.getElementById("atualizar"+i).checked = document.getElementById("hab_all").checked;
				if(document.getElementById("at"+i) != undefined){
					document.getElementById("at"+i).className = "checkbox checbox-switch switch-success";
					document.getElementById("flagat"+i).value = "success";
				}
				
				document.getElementById("remover"+i).checked = document.getElementById("hab_all").checked;
				if(document.getElementById("re"+i) != undefined){
					document.getElementById("re"+i).className = "checkbox checbox-switch switch-success";
					document.getElementById("flagre"+i).value = "success";
				}
			}
		}
		else
		{
			for(var i = 0; i < $("#qtd").val(); i++)
			{
				document.getElementById(permissao+i).checked = document.getElementById("hab_all_"+permissao).checked;
				if(document.getElementById(permissao.substr(0, 2)+i) != undefined){
					document.getElementById(permissao.substr(0, 2)+i).className = "checkbox checbox-switch switch-success";
					document.getElementById("flag"+permissao.substr(0, 2)+i).value = "success";
				}
			}
		}
	},
	set_periodo_letivo : function(periodo_letivo_id)//professor escolheu o período letivo
	{
		$("#modal_periodos").html("Aguarde... carregando informações");
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/set_periodo_letivo/' + '/' + periodo_letivo_id,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				window.location.assign(Url.base_url + $("#controller").val() + "/professor");
			}
		}).fail(function(msg){
		    	window.location.assign(Url.base_url + $("#controller").val() + "/dashboard");
		});
	},
	set_curso_periodo : function(periodo_letivo_id, curso_id)//aluno escolheu o período letivo
	{
		$("#modal_periodos").html("Aguarde... carregando informações");
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/set_curso_periodo/' + '/' + periodo_letivo_id + '/' + curso_id,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				window.location.assign(Url.base_url + $("#controller").val() + "/aluno");
			}
		}).fail(function(msg){
		    	window.location.assign(Url.base_url + $("#controller").val() + "/aluno");
		});
	},
	alterar_disciplina : function (disciplina_id)
	{
		window.location.assign(Url.base_url + $("#controller").val() + "/"+$("#method").val()+"/"+disciplina_id+"/"+$("#turma_selecionada").val()+"/"+$("#etapa_selecionada").val());
	},
	//////NOTAS
	altera_nota : function (id, nota, descricao_nota_id, matricula_id, etapa_id, id_rec, disciplina_id, turma_id)
	{
		if(nota == "")
			nota = null;
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/altera_nota/' + nota + '/' + descricao_nota_id + '/' + matricula_id + '/' + etapa_id + '/' + disciplina_id + '/' + turma_id,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				if(data.response != "sucesso")
					Main.modal("aviso", data.response);
				else
				{
					$("#"+id).val(data.somatorio);
					document.getElementById(id).className = "form-control border_radius text-center text-"+data.status+" border-"+data.status;//status da coluna total por aluno
					if(descricao_nota_id == Main.rec_bim)//se estiver submetendo a coluna de rec do bimestre
						document.getElementById(id_rec).className = "form-control border_radius text-"+data.status_rec+" border-"+data.status_rec;
				}
			}
		}).fail(function(msg){
		    setTimeout(function(){
		    	//$("#modal_confirm").modal('hide');
		    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
			},500);
		});
	},
	add_coluna_nota_validar : function() 
	{
		var flag = 0;
		for(var i = 0; i < $("#limite_descricao_nota").val(); i++)
		{
			if($('#descricao_nota_id').val() == $("#descricao_nota_id_hidden"+i).val())
				flag = 1;
		}
		return flag;
	},
	rec_bim : 1,
	add_coluna_nota : function()
	{
		if($('#descricao_nota_id').val() == "0")
			Main.modal("aviso", "Selecione uma descrição de nota");
		else if(Main.add_coluna_nota_validar() == 0)
		{
			if($('#descricao_nota_id').val() != Main.rec_bim)
				Main.remove_elemento("total");//primeiro remove o cabeçalho da coluna total por linha ou aluno
			
			//adiciona o cabeçalho da descrição de nota selecionada
			var node_td_cabecalho = document.createElement("TD");
				node_td_cabecalho.setAttribute("class", "text-center align-middle");
				node_td_cabecalho.setAttribute("style", "width: 10%; position: relative;");
				node_td_cabecalho.innerHTML = $('#descricao_nota_id :selected').text();
			var input_text = document.createElement("INPUT");
				input_text.setAttribute("id", "descricao_nota_id_hidden"+$("#limite_descricao_nota").val());
				input_text.setAttribute("type", "hidden");
				input_text.setAttribute("value", $('#descricao_nota_id').val());
				node_td_cabecalho.appendChild(input_text);

			

			var node_span_cabecalho = document.createElement("SPAN");
				node_span_cabecalho.setAttribute("style","cursor: pointer; position: absolute; right: 0px;");
				node_span_cabecalho.setAttribute("class","glyphicon glyphicon-remove text-danger");
				node_span_cabecalho.setAttribute("onclick", "Main.confirm_remover_coluna_nota("+$('#descricao_nota_id').val()+","+$("#turma_selecionada").val()+","+$("#disciplina_id").val()+","+$("#etapa_selecionada").val()+")");
				node_td_cabecalho.appendChild(node_span_cabecalho);

			document.getElementById("cabecalho_nota").appendChild(node_td_cabecalho);

			if($('#descricao_nota_id').val() != Main.rec_bim)
			{
				//coloca de volta o cabeçalho do total
				var node_td_cabecalho = document.createElement("TD");
					node_td_cabecalho.setAttribute("class", "text-center align-middle");
					node_td_cabecalho.setAttribute("style", "width: 10%;");
					node_td_cabecalho.setAttribute("id", "total");
				node_td_cabecalho.innerHTML = "Total";
				document.getElementById("cabecalho_nota").appendChild(node_td_cabecalho);
			}
			for(var i = 0; i < $("#linha_disponivel").val(); i++)
			{
				var total_nota_linha = $("#total"+i).val();//armazena o total por linha para depois devolver a coluna total na tela
				var classe = document.getElementById("total"+i).className; //armazena a class

				var node_td = document.createElement("TD");
					node_td.setAttribute("class", "text-center");
					node_td.setAttribute("style", "width: 10%;");
				var input_text = document.createElement("INPUT");
					input_text.setAttribute("onblur", "Main.altera_nota('total"+i+"',this.value,"+$('#descricao_nota_id').val()+",'"+$("#matricula_id"+i).val()+"',"+$("#etapa_selecionada").val()+",'aluno"+i+"_nota"+$("#limite_descricao_nota").val()+"',"+$("#disciplina_id").val()+","+$("#turma_selecionada").val()+")");
					input_text.setAttribute("type", "number");
					input_text.setAttribute("name", "aluno"+i+"_nota"+$("#limite_descricao_nota").val());
					input_text.setAttribute("id", "aluno"+i+"_nota"+$("#limite_descricao_nota").val());
					input_text.setAttribute("min", "0");
					input_text.setAttribute("class", "form-control border_radius text-info");
					input_text.setAttribute("style", "background-color: white;");

				node_td.appendChild(input_text);

				if($('#descricao_nota_id').val() != Main.rec_bim)
					Main.remove_elemento("td_total"+i);//remove o total de aluno por aluno

				document.getElementById("linha"+i).appendChild(node_td);//adiciona acoluna nova

				//agora devolver a coluna total de aluno por aluno
				if($('#descricao_nota_id').val() != Main.rec_bim)
				{
					var node_td = document.createElement("TD");
						node_td.setAttribute("style", "width: 10%;");
						node_td.setAttribute("style", "vertical-align: middle;");
						node_td.setAttribute("class", "text-center");
						node_td.setAttribute("id", "td_total"+i);

					var input_text = document.createElement("INPUT");
						input_text.setAttribute("type", "text");
						input_text.setAttribute("disabled", "true");
						input_text.setAttribute("id", "total"+i);
						input_text.setAttribute("class", classe);
						input_text.setAttribute("style", "background-color: white;");
						input_text.setAttribute("value", total_nota_linha);
						node_td.appendChild(input_text);
					document.getElementById("linha"+i).appendChild(node_td);				
				}
			}
			$("#limite_descricao_nota").val((parseInt($("#limite_descricao_nota").val()) + 1));
		}
		else
			Main.modal("aviso","Esta coluna já se encontra adicionada.");
	},
	descricao_nota_id : 0,
	turma_id : 0,
	disciplina_id : 0,
	bimestre_id : 0,
	confirm_remover_coluna_nota : function (descricao_nota_id, turma_id, disciplina_id, bimestre_id)
	{
		Main.descricao_nota_id = descricao_nota_id;
		Main.turma_id = turma_id;
		Main.disciplina_id = disciplina_id;
		Main.bimestre_id = bimestre_id;

		$("#bt_delete").unbind();//remover o evento antes de adicionar.

		Main.modal("confirm", "Deseja realmente apagar a coluna selecionada? Não é possível desfazer esta ação.");
		$('#bt_delete').click(function() {
    	  Main.remove_coluna_nota();
    	});
	},
	remove_coluna_nota : function()
	{
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/remover_coluna_nota/' + Main.descricao_nota_id + '/' + Main.turma_id + '/' + Main.disciplina_id + '/' + Main.bimestre_id,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				if(data.response != "sucesso")
				{
					setTimeout(function(){
			    	$("#modal_confirm").modal('hide');
						Main.modal("aviso", data.response);			    	
					},500);
				}
				else
					location.reload();
			}
		}).fail(function(msg){
		    setTimeout(function(){
		    	//$("#modal_confirm").modal('hide');
		    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
			},500);
		});
	},
	gambi : 0,
	get_sub_turmas : function (disciplina_id, turma_id, data)
	{
		if(Main.gambi != 0)//resolve o problema do autoload no campo de data
		{
			Main.modal("aguardar", "Aguarde...");

			data = Main.convert_date(data, "en");

			$.ajax({
				url: Url.base_url + $("#controller").val() + '/get_sub_turmas/' + disciplina_id + '/' + turma_id + '/' + data,
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					if(data.response != "sucesso")
					{
						setTimeout(function(){
				    	$("#modal_aguardar").modal('hide');
							$("#subturmas").html(data.response);
							Main.get_alunos_chamada(disciplina_id, turma_id);
							
							if($("#subturma").val() == "x")
								$("#chamada").html("");
						},500);
					}
					else
						location.reload();
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	//$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});

		}
		Main.gambi = 1;
	},
	get_alunos_chamada : function (disciplina_id, turma_id)
	{
		if($("#data_atual").val() != "" && document.getElementById("subturma") != undefined && $("#subturma").val() != "x")
		{
			Main.modal("aguardar", "Aguarde...");
			var data_convert  = Main.convert_date($("#data_atual").val(),"en");
			var subturma  = $("#subturma").val();

			$.ajax({
				url: Url.base_url + $("#controller").val() + '/get_alunos_chamada/' + disciplina_id + '/' + turma_id + '/' + subturma + '/' + data_convert,
				dataType:'json',
				cache: false,
				type: 'POST',
				success: function (data) 
				{
					$("#chamada").html(data.response);
					setTimeout(function(){
						$("#modal_aguardar").modal('hide');
					},500);
					
					if(data.status == "ok")
						document.getElementById("div_btn_save").style.display = "block";
				}
			}).fail(function(msg){
			    setTimeout(function(){
			    	//$("#modal_confirm").modal('hide');
			    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
				},500);
			});
		}
	},
	chamada_validar : function()
	{
		Main.method = "store_chamada";
		Main.method_redirect = "faltas";

		Main.create_edit();
	},
	visao_geral : function (disciplina_id, turma_id)
	{
		Main.modal("aguardar", "Aguarde...");
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/visao_geral/' + disciplina_id + '/' + turma_id,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				setTimeout(function(){
					$("#modal_aguardar").modal('hide');
					
				},500);
				Main.modal("large","te");

				////CABEÇALHO
					$("#header_large").html("<table class='table table-borderless'><tr><td class='text-center'>Turma: "+data.turma+"</td><td class='text-center'>Período / Módulo / Ano: "+data.periodo+"º</td><td class='text-center'>Disciplina: "+data.disciplina+"</td></tr></table>");
				////CABEÇALHO

				$("#mensagem_large").html(data.response);
			}
		}).fail(function(msg){
		    setTimeout(function(){
		    	//$("#modal_confirm").modal('hide');
		    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
			},500);
		});
	},
	horarios_turma : function (turma_id)
	{
		Main.modal("aguardar", "Aguarde...");
		$.ajax({
			url: Url.base_url + $("#controller").val() + '/horarios_turma/' + turma_id,
			dataType:'json',
			cache: false,
			type: 'POST',
			success: function (data) 
			{
				setTimeout(function(){
					$("#modal_aguardar").modal('hide');
					
				},500);
				Main.modal("large","te");

				////CABEÇALHO
					$("#header_large").html("<table class='table table-borderless'><tr><td class='text-center'>Turma: "+data.turma+"</td><td class='text-center'>Período / Módulo / Ano: "+data.periodo+"º</td></tr></table>");
				////CABEÇALHO

				$("#mensagem_large").html(data.response);
			}
		}).fail(function(msg){
		    setTimeout(function(){
		    	//$("#modal_confirm").modal('hide');
		    	Main.modal("aviso", "Houve um erro ao processar sua requisição. Verifique sua conexão com a internet.");
			},500);
		});
	}

};
