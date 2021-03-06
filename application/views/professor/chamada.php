<?php $this->load->helper("mstring");?>
<?php $this->load->helper("faltas");?>
<?php $this->load->view("/shared/_periodo"); ?>
<br />
<div class='row padding20 text-white relative' style="width: 98%; left: 2%">
	<?php
    	echo"<div class='col-lg-12 padding0'>";
			echo"<nav aria-label='breadcrumb'>";
  				echo"<ol class='breadcrumb'>";
    				echo "<li class='breadcrumb-item active' aria-current='page'>Minhas disciplinas</li>";
    				echo "<li class='breadcrumb-item active' aria-current='page'>".((isset($obj['Id'])) ? 'Editar chamada' : 'Nova chamada')."</li>";
    			echo "</ol>";
			echo"</nav>";
		echo "</div>";
    ?>
	<input type='hidden' id='controller' value='<?php echo $controller; ?>'/>
	<input type='hidden' id='method' value='<?php echo $method; ?>'/>
	<div class='col-lg-12 padding background_dark'>
		<div class="row">
			<div class="col-lg-2 padding10" style="border-right: 1px solid white;">
				<?php
					$this->load->view("professor/_disciplina");
				?>
			</div>
			<div class="col-lg-10" style="border-bottom: 1px solid white">
				<div class="row padding10">
					<?php

						$this->load->view("professor/_etapas");
					?>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-2" style="border-right: 1px solid white">
				<div class="row padding10">
					<?php
						$this->load->view("professor/_turma");
					?>
				</div>
			</div>
			<div class="col-lg-10">
				<div class="row padding10">
					<div class="col-lg-6">
						<a href="<?php echo $url; ?>professor/notas/<?php echo $url_part['disciplina_id']."/".$url_part['turma_id']."/".$url_part['etapa_id']; ?>" class="btn btn-danger" style="width: 100px">Notas</a>
						<a href="<?php echo $url; ?>professor/faltas/<?php echo $url_part['disciplina_id']."/".$url_part['turma_id']."/".$url_part['etapa_id']; ?>" class="btn btn-success" style="border-left: 1px solid white; width: 100px; margin-left: -8px; border-radius: 0px 5px 5px 0px;">Faltas</a>
						<a href="#" onclick="Main.visao_geral(<?php echo $url_part['disciplina_id'].",".$url_part['turma_id']; ?>);" class="btn btn-danger" style="border-left: 1px solid white; width: 100px; margin-left: -8px; border-radius: 0px 5px 5px 0px;">Visão geral</a>
					</div>
					<div class="col-lg-6 text-right">
						<?php 
							echo "Aberto a partir de ".(!empty($etapa['Data_abertura']) ? $etapa['Data_abertura'] : '')." até ".(!empty($etapa['Data_fechamento']) ? $etapa['Data_fechamento'] : '');
						?>
					</div>
				</div>
				<div class="row padding10" style="padding-top: 0px; padding-bottom: 0px;">
					<div class="col-lg-12">
						<hr style="background-color: white">
					</div>
				</div>
				<div class="row padding10" style="padding-top: 0px">
					<div class="col-lg-12">
						<a href='javascript:window.history.go(-1)' title='Voltar'>
							<span class='glyphicon glyphicon-arrow-left text-white' style='font-size: 25px;'></span>
						</a>
					</div>
				</div>
				<?php $atr = array("id" => "form_cadastro_chamada", "name" => "form_cadastro"); 
					echo form_open("$controller/store_chamada", $atr);
					echo "<input type='hidden' id='turma_selecionada' name='turma_selecionada' value='".$url_part['turma_id']."'>";
					echo "<input type='hidden' id='disciplina_selecionada' name='disciplina_selecionada' value='".$url_part['disciplina_id']."'>";
				?>	

				<div class="row padding10">
					<div class="col-lg-6">
						<div class="form-group relative" id="data1">
							<input <?php echo "onchange='Main.get_sub_turmas(".$url_part['disciplina_id'].",".$url_part['turma_id'].", this.value);'"; ?> id="data_atual" name="data_atual" value="<?php echo date('d/m/Y');?>" type="text" class="input-material">
							<label for="data_atual" class="label-material active">Data</label>
							<div class='input-group mb-2 mb-sm-0 text-danger' id='error-data_atual'></div>
						</div>
					</div>
					<div class="col-lg-6" id='subturmas'>
						<?php 
							$data['lista_subturmas'] = $lista_subturmas;
							$data['url_part'] = $url_part;
							$data['sub_turma'] = $sub_turma;
							$this->load->view("professor/_subturmas", $data);
						?>
					</div>
					<div id='chamada' class="col-lg-12">
					<?php
						$data['url_part'] = $url_part;
						$data['data'] = date('Y-m-d');
						$data['lista_alunos'] = $lista_alunos;
						$data['lista_horarios'] = $lista_horarios;
						$data['lista_subturmas'] = $lista_subturmas;
						$this->load->view("professor/_alunos", $data);
					?>
					</div>
				</div>
				<div class="row padding10" style="padding-top: 0px; padding-bottom: 0px;">
					<div class="col-lg-12" id="div_btn_save">
						<?php
							if (empty($obj['Id']))
								echo "<input type='submit' class='btn btn-danger btn-block' style='width: 200px;' value='Cadastrar'>";
							else
								echo "<input type='submit' class='btn btn-danger btn-block' style='width: 200px;' value='Atualizar'>";
							?>
					</div>
				</div>
				</form>
			</div>
		</div>
	</div>
</div>