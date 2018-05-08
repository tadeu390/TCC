$(document).ready(
  //inicializa o html adicionando os envetos js especificados abaixo
  function() {
    Main.load_mask();
    //event for form login
    $("#form_login").submit(function(event) {
      event.preventDefault();
      Main.login();
    });

    $('#email-login').blur(function() {
      if (this.value != '') {
        if (Main.valida_email(this.value) == false)
          Main.show_error("email-login", 'Formato de e-mail inválido', '');
        else
          Main.show_error("email-login", '', '');
      }
    });

    $('#senha-login').blur(function() {
      if (this.value != '') Main.show_error("senha-login", '', '');
    });
    //LOGIN


    $('#nome').blur(function() {
      if (this.value != '') Main.show_error("nome", '', 'is-valid');
    });

    $('#senha').blur(function() {
      if (this.value != '') Main.show_error("senha", '', 'is-valid');
    });

    $('#confirmar_senha').blur(function() {
      if (this.value != '') Main.show_error("confirmar_senha", '', 'is-valid');
    });

    $('#codigo_ativacao').blur(function() {
      if (this.value != '' && this.value.length == 6) Main.show_error("codigo_ativacao", '', 'is-valid');
    });

    $('#grupo_id').blur(function() {
      if (this.value != '0') Main.show_error("grupo_id", '', '');
    });

    $('#nova_senha').blur(function() {
      if (this.value != '' && this.value.length >= 8) Main.show_error("nova_senha", '', 'is-valid');
      else Main.show_error("nova_senha", 'A senha deve conter no mínimo 8 caracteres.', 'is-invalid');
    });

    $('#confirmar_nova_senha').blur(function() {
      if (this.value != '' && this.value.length >= 8) Main.show_error("confirmar_nova_senha", '', 'is-valid');
    });

    $('#ordem').blur(function() {
      if (this.value != '') Main.show_error("ordem", '', 'is-valid');
    });

    $('#descricao').blur(function() {
      if (this.value != '') Main.show_error("descricao", '', 'is-valid');
    });

    $('#url_modulo').blur(function() {
      if (this.value != '') Main.show_error("url_modulo", '', 'is-valid');
    });

    $('#icone').blur(function() {
      /*if(this.value != '')*/
      Main.show_error("icone", '', 'is-valid');
    });

    $('#menu_id').blur(function() {
      if (this.value != '0') Main.show_error("menu_id", '', '');
    });

    $('#email').blur(function() {
      if (this.value != '') {
        if (Main.valida_email(this.value) == false)
          Main.show_error("email", 'Formato de e-mail inválido', 'is-invalid');
        else
          Main.show_error("email", '', 'is-valid');
      }
    });

    $('#email').keypress(function() {
      if ((window.event ? event.keyCode : event.which) == 13) {
        Main.login();
      };
    });

    $('#senha').keypress(function() {
      if ((window.event ? event.keyCode : event.which) == 13) {
        Main.login();
      };
    });

    //BTN CADASTROS
    
    $("#form_redefinir_senha_primeiro_acesso").submit(function(event) {
      event.preventDefault();
      Main.validar_senha_primeiro_acesso();
    });

    $("#form_cadastro_geral_configuracoes").submit(function(event) {
      event.preventDefault();
      Main.settings_geral_validar();
    });

    $("#form_cadastro_usuario").submit(function(event) {
      event.preventDefault();
      Main.usuario_validar();
    });

    $("#form_cadastro_usuario_permissoes").submit(function(event) {
      event.preventDefault();
      Main.create_edit();
    });

    $("#form_cadastro_grupo_permissoes").submit(function(event) {
      event.preventDefault();
      Main.create_edit();
    });

    $("#form_cadastro_account").submit(function(event) {
      event.preventDefault();
      Main.registro_validar();
    });

    $("#form_cadastro_menu").submit(function(event) {
      event.preventDefault();
      Main.menu_validar();
    });

    $("#form_cadastro_modulo").submit(function(event) {
      event.preventDefault();
      Main.modulo_validar();
    });

    $("#form_cadastro_grupo").submit(function(event) {
      event.preventDefault();
      Main.grupo_validar();
    });

    $('#data_nascimento').blur(function() {
      if (this.value != '') Main.show_error("data_nascimento", "", "is-valid");
    });

    $('#masculino').change(function() {
      Main.show_error("sexo", "", "");
    });

    $('#feminino').change(function() {
      Main.show_error("sexo", "", "");
    });

    $('#bt_delete').click(function() {
      Main.delete_registro();
    });

    $('#opt_id').blur(function() {
      if (this.value != '0') Main.show_error("opt_id", '', '');
    });
  }
);